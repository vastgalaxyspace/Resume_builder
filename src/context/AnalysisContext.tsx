"use client";

import { useRouter } from "next/navigation";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

/* ---------- Types ---------- */

export type ExperienceLevel = "entry" | "mid" | "senior";

export type AnalysisStep =
  | "idle"
  | "uploading"
  | "parsing"
  | "searching"
  | "analyzing"
  | "done"
  | "error";

export interface ResumeSection {
  name: string;
  status: string;
  level: "strong" | "good" | "weak" | "missing" | "not_found";
}

export interface BulletRewrite {
  before: string;
  after: string;
  why: string;
}

export interface Improvement {
  title: string;
  detail: string;
}

export interface AnalysisResult {
  atsScore: number;
  atsLabel: string;
  scoreBreakdown?: {
    atsKeywordAndFormat: number;
    tableStakesCoverage: number;
    evidenceStrength: number;
    projectExperienceRelevance: number;
  };
  marketBenchmark?: {
    seniority: string;
    tableStakes: string[];
    differentiators: string[];
    niceToHave: string[];
    notes: string;
  };
  atsReasoning?: {
    keywordMatchSummary: string;
    formatSignals: string[];
    parseRisks: string[];
    exactKeywordGaps: string[];
  };
  recruiterReasoning?: {
    strengths: string[];
    concerns: string[];
    seniorityFit: string;
  };
  skillsMatched: string[];
  skillsMissing: string[];
  skillsNiceToHave: string[];
  totalRequired: number;
  sections: ResumeSection[];
  improvements: Improvement[];
  rewrites: BulletRewrite[];
  overallAssessment: string;
  profileStrength: number; // 1-4
  profileStrengthLabel: string;
  marketFit: number; // 0-100
  keywordGaps?: string[];
  priorityActions?: string[];
  extraction?: {
    method: "pdf-parse" | "mammoth" | "plain-text" | "mistral-ocr";
    characters: number;
    warning?: string;
  };
  marketSources?: Array<{
    title: string;
    url: string;
    content: string;
  }>;
  role: string;
  experience: string;
  analyzedAt: string;
}

export interface AnalysisContextValue {
  file: File | null;
  role: string;
  experience: ExperienceLevel;
  result: AnalysisResult | null;
  step: AnalysisStep;
  error: string;
  setFile: (f: File | null) => void;
  setRole: (r: string) => void;
  setExperience: (e: ExperienceLevel) => void;
  startAnalysis: () => Promise<void>;
  reset: () => void;
}

const AnalysisContext = createContext<AnalysisContextValue | undefined>(
  undefined
);

/* ---------- Provider ---------- */

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState<ExperienceLevel>("mid");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [step, setStep] = useState<AnalysisStep>("idle");
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const startAnalysis = useCallback(async () => {
    if (!file || !role.trim()) return;

    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setError("");
    setResult(null);

    try {
      // Step 1 — uploading
      setStep("uploading");
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("role", role.trim());
      formData.append("experience", experience);

      // Small visual delay so user sees each step
      await delay(600);
      setStep("parsing");
      await delay(800);
      setStep("searching");

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      setStep("analyzing");

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(
          body.error || `Analysis failed (${response.status})`
        );
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
      setStep("done");

      // Auto-navigate to results
      router.push("/results");
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
      setStep("error");
    }
  }, [experience, file, role, router]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setFile(null);
    setRole("");
    setExperience("mid");
    setResult(null);
    setStep("idle");
    setError("");
  }, []);

  const value = useMemo(
    () => ({
      file,
      role,
      experience,
      result,
      step,
      error,
      setFile,
      setRole,
      setExperience,
      startAnalysis,
      reset,
    }),
    [experience, error, file, result, role, step, startAnalysis, reset]
  );

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error("useAnalysis must be used inside AnalysisProvider");
  return ctx;
}

/* ---------- Helpers ---------- */
function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
