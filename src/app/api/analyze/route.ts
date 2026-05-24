import { Mistral } from "@mistralai/mistralai";
import { readFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

/* ------------------------------------------------------------------ */
/*  POST /api/analyze                                                  */
/*  Accepts FormData: resume (File), role (string), experience (string)*/
/* ------------------------------------------------------------------ */

export const maxDuration = 60;
export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MIN_EXTRACTED_CHARS = 50;
const MISTRAL_CHAT_MODEL = "mistral-small-latest";
const MISTRAL_OCR_MODEL = "mistral-ocr-latest";
let pdfWorkerDataUrl: string | undefined;

type ExperienceLevel = "entry" | "mid" | "senior";

type ExtractionResult = {
  text: string;
  method: "pdf-parse" | "mammoth" | "plain-text" | "mistral-ocr";
  warning?: string;
};

type JobMarketData = {
  summary: string;
  sources: Array<{
    title: string;
    url: string;
    content: string;
    score?: number;
    rawContent?: string;
  }>;
};

type TavilySearchResult = {
  title?: unknown;
  url?: unknown;
  content?: unknown;
  raw_content?: unknown;
  score?: unknown;
};

type TavilySearchResponse = {
  answer?: unknown;
  results?: unknown;
};

type AnalysisPayload = Record<string, unknown> & {
  role: string;
  experience: ExperienceLevel;
  analyzedAt: string;
  extraction: {
    method: ExtractionResult["method"];
    characters: number;
    warning?: string;
  };
  marketSources: JobMarketData["sources"];
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const resumeFile = formData.get("resume") as File | null;
    const role = formData.get("role") as string | null;
    const experience = formData.get("experience") as string | null;
    const normalizedRole = role?.trim() ?? "";
    const normalizedExperience = normalizeExperience(experience);

    if (!resumeFile || !normalizedRole) {
      return NextResponse.json(
        { error: "Resume file and target role are required." },
        { status: 400 }
      );
    }

    if (resumeFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Resume file is too large. Please upload a file under 10 MB." },
        { status: 413 }
      );
    }

    const extraction = await extractText(resumeFile);

    if (!extraction.text || extraction.text.trim().length < MIN_EXTRACTED_CHARS) {
      return NextResponse.json(
        {
          error:
            "Could not extract enough text from your resume. If it is a scanned PDF, enable Mistral OCR fallback or upload a text-based PDF/DOCX.",
        },
        { status: 422 }
      );
    }

    let marketData: JobMarketData = {
      summary: "No live job description data available.",
      sources: [],
    };

    try {
      marketData = await searchJobDescriptions(normalizedRole, normalizedExperience);
    } catch (err) {
      console.warn("[/api/analyze] Tavily search skipped:", err);
    }

    const analysisResult = await analyzeWithMistral(
      extraction.text,
      marketData,
      normalizedRole,
      normalizedExperience
    );

    return NextResponse.json({
      ...analysisResult,
      role: normalizedRole,
      experience: normalizedExperience,
      analyzedAt: String(analysisResult.analyzedAt ?? new Date().toISOString()),
      extraction: {
        method: extraction.method,
        characters: extraction.text.length,
        ...(extraction.warning ? { warning: extraction.warning } : {}),
      },
      marketSources: marketData.sources.map(({ title, url, content }) => ({
        title,
        url,
        content: content.slice(0, 280),
      })),
    } satisfies AnalysisPayload);
  } catch (err: unknown) {
    console.error("[/api/analyze] Error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/* ================================================================== */
/*  RESUME TEXT EXTRACTION                                             */
/* ================================================================== */

async function extractText(file: File): Promise<ExtractionResult> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();

  if (name.endsWith(".pdf")) {
    const parsedText = await extractPdfText(buffer);
    if (parsedText.trim().length >= MIN_EXTRACTED_CHARS) {
      return { text: cleanExtractedText(parsedText), method: "pdf-parse" };
    }

    const ocrText = await extractWithMistralOcr(buffer, file.name);
    if (ocrText.trim().length >= MIN_EXTRACTED_CHARS) {
      return {
        text: cleanExtractedText(ocrText),
        method: "mistral-ocr",
        warning: "Local PDF text extraction was weak, so Mistral OCR was used.",
      };
    }

    return { text: cleanExtractedText(parsedText), method: "pdf-parse" };
  }

  if (name.endsWith(".docx")) {
    return { text: cleanExtractedText(await extractDocxText(buffer)), method: "mammoth" };
  }

  if (name.endsWith(".txt")) {
    return { text: cleanExtractedText(buffer.toString("utf-8")), method: "plain-text" };
  }

  throw new Error("Unsupported file type. Please upload a PDF, DOCX, or TXT file.");
}

async function extractPdfText(buffer: Buffer): Promise<string> {
  const { PDFParse } = await import("pdf-parse");
  PDFParse.setWorker(await getPdfWorkerDataUrl());

  const parser = new PDFParse({ data: buffer });

  try {
    const data = await parser.getText();
    return data.text;
  } finally {
    await parser.destroy();
  }
}

async function getPdfWorkerDataUrl(): Promise<string> {
  if (pdfWorkerDataUrl) return pdfWorkerDataUrl;

  const workerPath = path.join(
    process.cwd(),
    "node_modules",
    "pdfjs-dist",
    "legacy",
    "build",
    "pdf.worker.min.mjs"
  );
  const workerSource = await readFile(workerPath);

  pdfWorkerDataUrl = `data:text/javascript;base64,${workerSource.toString("base64")}`;
  return pdfWorkerDataUrl;
}

async function extractDocxText(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

async function extractWithMistralOcr(buffer: Buffer, fileName: string): Promise<string> {
  if (process.env.ENABLE_MISTRAL_OCR !== "true") return "";

  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey || apiKey.startsWith("your_")) return "";

  const client = new Mistral({ apiKey });
  const uploadedPdf = await client.files.upload({
    file: {
      fileName,
      content: buffer,
    },
    purpose: "ocr",
  });

  const ocrResponse = await client.ocr.process({
    model: MISTRAL_OCR_MODEL,
    document: {
      type: "file",
      fileId: uploadedPdf.id,
    },
    includeImageBase64: false,
  });

  return ocrResponse.pages.map((page) => page.markdown).join("\n\n");
}

function cleanExtractedText(text: string): string {
  return text
    .replace(/\u0000/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/* ================================================================== */
/*  TAVILY JOB DESCRIPTION SEARCH                                      */
/* ================================================================== */

async function searchJobDescriptions(
  role: string,
  experience: ExperienceLevel
): Promise<JobMarketData> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey || apiKey.startsWith("your_")) {
    return { summary: "No Tavily API key configured; skipping live job search.", sources: [] };
  }

  const experienceLabel = experience === "entry" ? "entry level junior" : experience;
  const searches = [
    {
      label: "Current entry-level job descriptions",
      query: `${experienceLabel} ${role} job description required skills responsibilities qualifications ATS keywords`,
      topic: "general",
      time_range: "month",
    },
    {
      label: "Entry-level hiring expectations",
      query: `${experienceLabel} ${role} hiring requirements technical skills projects testing database API`,
      topic: "general",
      time_range: "year",
    },
    {
      label: "Resume keyword benchmarks",
      query: `${experienceLabel} ${role} resume keywords ATS screening skills projects requirements`,
      topic: "general",
      time_range: "year",
    },
  ];

  const responses = await Promise.all(
    searches.map(async (search) => ({
      label: search.label,
      data: await searchTavily(apiKey, {
        query: search.query,
        topic: search.topic,
        time_range: search.time_range,
      }),
    }))
  );

  const sourcesByUrl = new Map<string, JobMarketData["sources"][number]>();
  const answerParts: string[] = [];

  for (const response of responses) {
    if (typeof response.data.answer === "string" && response.data.answer.trim()) {
      answerParts.push(`${response.label}: ${response.data.answer.trim()}`);
    }

    if (!Array.isArray(response.data.results)) continue;

    for (const result of response.data.results.filter(isRecord) as TavilySearchResult[]) {
      const url = String(result.url ?? "").trim();
      if (!url || sourcesByUrl.has(url)) continue;

      sourcesByUrl.set(url, {
        title: String(result.title ?? "Untitled job source"),
        url,
        content: cleanTavilyContent(String(result.content ?? "")),
        rawContent: cleanTavilyContent(String(result.raw_content ?? "")),
        score: Number.isFinite(Number(result.score)) ? Number(result.score) : undefined,
      });
    }
  }

  const sources = Array.from(sourcesByUrl.values())
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 12);

  return {
    summary: answerParts.join("\n\n") || "No market summary returned.",
    sources,
  };
}

async function searchTavily(
  apiKey: string,
  options: { query: string; topic: string; time_range: string }
): Promise<TavilySearchResponse> {
  const body = {
    api_key: apiKey,
    query: options.query,
    auto_parameters: true,
    topic: options.topic,
    search_depth: "advanced",
    chunks_per_source: 3,
    max_results: 8,
    include_answer: "advanced",
    include_raw_content: "markdown",
    include_images: false,
    include_image_descriptions: false,
    time_range: options.time_range,
    ...(options.topic === "general" && process.env.TAVILY_COUNTRY
      ? { country: process.env.TAVILY_COUNTRY.trim().toLowerCase() }
      : {}),
    ...(parseCsvEnv(process.env.TAVILY_INCLUDE_DOMAINS).length
      ? { include_domains: parseCsvEnv(process.env.TAVILY_INCLUDE_DOMAINS) }
      : {}),
    ...(parseCsvEnv(process.env.TAVILY_EXCLUDE_DOMAINS).length
      ? { exclude_domains: parseCsvEnv(process.env.TAVILY_EXCLUDE_DOMAINS) }
      : {}),
  };

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) throw new Error(`Tavily API error: ${response.status}`);

  return response.json();
}

function cleanTavilyContent(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function parseCsvEnv(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/* ================================================================== */
/*  MISTRAL AI ANALYSIS                                                */
/* ================================================================== */

async function analyzeWithMistral(
  resumeText: string,
  marketData: JobMarketData,
  role: string,
  experience: ExperienceLevel
): Promise<Record<string, unknown>> {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey || apiKey.startsWith("your_")) {
    throw new Error("Mistral API key is not configured. Please add MISTRAL_API_KEY to your .env file.");
  }

  const client = new Mistral({ apiKey });
  const prompt = buildAnalysisPrompt(resumeText, marketData, role, experience);

  const result = await client.chat.complete({
    model: MISTRAL_CHAT_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are an expert ATS resume analyst. You ONLY respond with valid JSON. No markdown, no explanation outside the JSON object.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.3,
    responseFormat: { type: "json_object" },
  });

  const text =
    typeof result.choices?.[0]?.message?.content === "string"
      ? result.choices[0].message.content
      : "";

  if (!text) throw new Error("Empty response from Mistral. Please try again.");

  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonString = jsonMatch ? jsonMatch[1].trim() : text.trim();

  try {
    const parsed = normalizeAnalysisResult(JSON.parse(jsonString));
    parsed.role = role;
    parsed.experience = experience;
    parsed.analyzedAt = new Date().toISOString();
    return parsed;
  } catch {
    throw new Error("Failed to parse AI response. Please try again.");
  }
}

function buildAnalysisPrompt(
  resumeText: string,
  marketData: JobMarketData,
  role: string,
  experience: ExperienceLevel
): string {
  const experienceLabel =
    experience === "entry"
      ? "Entry-level (0-2 years)"
      : experience === "senior"
        ? "Senior (5+ years)"
        : "Mid-level (2-5 years)";
  const jobDescriptions = formatMarketData(marketData);

  return `Analyze the resume below against the target role "${role}" at ${experienceLabel} experience level. Use the live job market data provided to make your analysis current and accurate.

RESUME TEXT:
---
${resumeText.slice(0, 8000)}
---

LIVE JOB MARKET DATA FOR "${role}":
---
${jobDescriptions.slice(0, 6000)}
---

IMPORTANT INSTRUCTIONS:
1. Compare the resume against the job requirements found in the market data.
2. Be specific and actionable. Reference actual skills, technologies, and keywords from the job postings.
3. Score fairly but critically. Most resumes should score between 40-85, not higher.
4. Provide real before/after bullet point rewrites using content from the actual resume.
5. Do not invent experience, employers, degrees, certifications, or measurable outcomes that are not supported by the resume.
6. Treat a skill as "matched" only if it appears explicitly in the resume text or is directly proven by a listed project/experience bullet.
7. Do not list senior-level tools as "critical missing" for entry-level candidates unless the market data repeatedly shows them as entry-level requirements.
8. Separate true entry-level requirements from nice-to-have technologies.
9. Never add numeric metrics, scale claims, uptime claims, concurrency claims, percentages, or business impact unless the resume text already contains them.
10. If a rewrite would benefit from a metric but the resume lacks one, write a non-metric improvement instead.
11. For every bullet rewrite, preserve the candidate's real project, employer, tools, and scope. Do not change Android work into backend service work unless the resume states that backend service existed.

Respond with a valid JSON object matching this exact schema:

{
  "atsScore": <number 0-100>,
  "atsLabel": "<string: 'Excellent Match' if >=80, 'Good Match' if >=60, 'Needs Work' if >=40, 'Poor Match' if <40>",
  "skillsMatched": ["<skill1>", "<skill2>"],
  "skillsMissing": ["<entry-level critical missing skill only>"],
  "skillsNiceToHave": ["<optional or senior-adjacent skill>"],
  "totalRequired": <number>,
  "sections": [
    {"name": "<e.g. Experience>", "status": "<e.g. strong>", "level": "<strong|good|weak|missing|not_found>"}
  ],
  "improvements": [
    {"title": "<short title>", "detail": "<2-3 sentence advice>"}
  ],
  "rewrites": [
    {"before": "<original bullet>", "after": "<improved bullet>", "why": "<explanation>"}
  ],
  "overallAssessment": "<3-4 sentence assessment>",
  "profileStrength": <1-4>,
  "profileStrengthLabel": "<Needs Work|Average|Above Average|Excellent>",
  "marketFit": <0-100>,
  "keywordGaps": ["<entry-level keyword recruiters/ATS expect but resume lacks>"],
  "priorityActions": ["<highest impact next action>"]
}

For entry-level analysis, keep skillsMissing focused on fundamentals such as Git, REST APIs, SQL/NoSQL depth, testing, debugging, deployment, authentication, and one primary backend framework. Put advanced infrastructure, observability, distributed systems, AI/ML, payment systems, and high-scale architecture in skillsNiceToHave unless the target role explicitly requires them.

Provide at least 5 improvements, 3 bullet rewrites, 5 resume sections analyzed, 5 keyword gaps, and 3 priority actions.`;
}

function formatMarketData(marketData: JobMarketData): string {
  const parts = [`Market Summary:\n${marketData.summary}`];

  for (const source of marketData.sources) {
    const rawContent = source.rawContent ? `\nRaw Content:\n${source.rawContent.slice(0, 900)}` : "";
    parts.push(
      `Source: ${source.url}\nTitle: ${source.title}\nRelevance Score: ${source.score ?? "n/a"}\nSnippets:\n${source.content}${rawContent}`
    );
  }

  return parts.join("\n\n---\n\n") || "No relevant job descriptions found.";
}

function normalizeAnalysisResult(value: unknown): Record<string, unknown> {
  const result = isRecord(value) ? { ...value } : {};

  result.atsScore = clampNumber(result.atsScore, 0, 100, 0);
  result.marketFit = clampNumber(result.marketFit, 0, 100, 0);
  result.profileStrength = clampNumber(result.profileStrength, 1, 4, 1);
  result.atsLabel = String(result.atsLabel ?? labelForScore(result.atsScore as number));
  result.profileStrengthLabel = String(result.profileStrengthLabel ?? "Needs Work");
  result.overallAssessment = String(result.overallAssessment ?? "Analysis completed, but the model returned a sparse assessment.");
  result.skillsMatched = normalizeStringArray(result.skillsMatched);
  result.skillsMissing = normalizeStringArray(result.skillsMissing);
  result.skillsNiceToHave = normalizeStringArray(result.skillsNiceToHave);
  result.keywordGaps = normalizeStringArray(result.keywordGaps);
  result.priorityActions = normalizeStringArray(result.priorityActions);
  result.totalRequired = Math.max(
    Number(result.totalRequired) || 0,
    (result.skillsMatched as string[]).length + (result.skillsMissing as string[]).length
  );
  result.sections = normalizeSections(result.sections);
  result.improvements = normalizeObjects(result.improvements, ["title", "detail"]);
  result.rewrites = normalizeObjects(result.rewrites, ["before", "after", "why"]);

  return result;
}

function normalizeExperience(value: string | null): ExperienceLevel {
  if (value === "entry" || value === "mid" || value === "senior") return value;
  return "mid";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, Math.round(number)));
}

function labelForScore(score: number): string {
  if (score >= 80) return "Excellent Match";
  if (score >= 60) return "Good Match";
  if (score >= 40) return "Needs Work";
  return "Poor Match";
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).trim()).filter(Boolean).slice(0, 20);
}

function normalizeObjects(value: unknown, keys: string[]): Array<Record<string, string>> {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isRecord)
    .map((item) =>
      Object.fromEntries(keys.map((key) => [key, String(item[key] ?? "").trim()]))
    )
    .filter((item) => keys.every((key) => item[key]))
    .slice(0, 12);
}

function normalizeSections(value: unknown) {
  const allowedLevels = new Set(["strong", "good", "weak", "missing", "not_found"]);
  if (!Array.isArray(value)) return [];

  return value
    .filter(isRecord)
    .map((item) => {
      const level = String(item.level ?? "not_found");
      return {
        name: String(item.name ?? "").trim(),
        status: String(item.status ?? "").trim(),
        level: allowedLevels.has(level) ? level : "not_found",
      };
    })
    .filter((item) => item.name && item.status)
    .slice(0, 12);
}
