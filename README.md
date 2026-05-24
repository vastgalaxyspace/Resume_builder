# ResumeIQ

AI resume analyzer built with Next.js. Users upload a resume, choose a target role and experience level, then the app:

1. Extracts resume text from PDF, DOCX, or TXT.
2. Searches current role requirements with Tavily.
3. Sends the resume and market data to `mistral-small-latest`.
4. Shows an ATS-style dashboard with missing skills, keyword gaps, section issues, priority fixes, and bullet rewrites.

## Getting Started

Install dependencies:

```bash
npm install
```

Create `.env` from `.env.example` and add your keys:

```bash
cp .env.example .env
```

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Resume Extraction

The default extractor is backend-only and free:

- PDF text: `pdf-parse`
- DOCX text: `mammoth`
- TXT text: native buffer parsing

For scanned/image PDFs, set `ENABLE_MISTRAL_OCR="true"` to use Mistral OCR as a fallback. Keep this disabled if you want to avoid OCR API usage.

Free OCR API options to evaluate later:

- OCR.space free tier
- Mindee trial/free developer tier
- Google Cloud Vision free credits for new accounts

For production, keep extraction on the backend so API keys and resume files do not leak into the browser.
