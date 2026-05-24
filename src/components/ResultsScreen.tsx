"use client";

import { Download, RefreshCw, AlertTriangle, Sparkles, Target, CheckCircle2, ArrowLeft, TrendingUp, ListChecks, ExternalLink, ScanText } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

import { AuthNavButton } from './AuthNavButton';
import { useAnalysis, AnalysisResult } from '@/context/AnalysisContext';

function scoreColor(score: number) {
  if (score >= 80) return { text: 'text-[#22C55E]', stroke: '#22C55E', glow: 'rgba(34,197,94,0.4)', bg: 'rgba(34,197,94,0.15)', grad: 'from-[#22C55E] to-[#10B981]' };
  if (score >= 60) return { text: 'text-[#F59E0B]', stroke: '#F59E0B', glow: 'rgba(245,158,11,0.4)', bg: 'rgba(245,158,11,0.15)', grad: 'from-[#F59E0B] to-[#F97316]' };
  if (score >= 40) return { text: 'text-[#F97316]', stroke: '#F97316', glow: 'rgba(249,115,22,0.4)', bg: 'rgba(249,115,22,0.15)', grad: 'from-[#F97316] to-[#EF4444]' };
  return { text: 'text-[#EF4444]', stroke: '#EF4444', glow: 'rgba(239,68,68,0.4)', bg: 'rgba(239,68,68,0.15)', grad: 'from-[#EF4444] to-[#DC2626]' };
}

function sectionDot(level: string) {
  switch (level) {
    case 'strong': case 'good': return 'bg-[#22C55E]';
    case 'weak': return 'bg-[#F59E0B]';
    case 'missing': return 'bg-[#EF4444]';
    default: return 'bg-[#44445A]';
  }
}

function sectionTextColor(level: string) {
  switch (level) {
    case 'strong': case 'good': return 'text-[#22C55E]';
    case 'weak': return 'text-[#F59E0B]';
    case 'missing': return 'text-[#EF4444]';
    default: return 'text-[#44445A]';
  }
}

function extractionLabel(method?: string) {
  switch (method) {
    case 'pdf-parse': return 'PDF text';
    case 'mammoth': return 'DOCX text';
    case 'plain-text': return 'TXT';
    case 'mistral-ocr': return 'Mistral OCR';
    default: return 'Resume text';
  }
}

function downloadReport(r: AnalysisResult) {
  const lines: string[] = [];
  lines.push(`RESUMEIQ ANALYSIS REPORT`, `========================`, ``);
  lines.push(`Role: ${r.role}`);
  lines.push(`Experience: ${r.experience}`);
  lines.push(`Date: ${new Date(r.analyzedAt).toLocaleString()}`, ``);
  lines.push(`ATS SCORE: ${r.atsScore}/100 (${r.atsLabel})`);
  lines.push(`Market Fit: ${r.marketFit}%`);
  lines.push(`Profile Strength: ${r.profileStrengthLabel} (${r.profileStrength}/4)`, ``);
  lines.push(`SKILLS MATCHED (${r.skillsMatched.length}):`, ...r.skillsMatched.map(s => `  ✓ ${s}`), ``);
  lines.push(`CRITICAL MISSING (${r.skillsMissing.length}):`, ...r.skillsMissing.map(s => `  ✗ ${s}`), ``);
  if (r.skillsNiceToHave.length) lines.push(`NICE TO HAVE:`, ...r.skillsNiceToHave.map(s => `  + ${s}`), ``);
  if (r.keywordGaps?.length) lines.push(`KEYWORD GAPS:`, ...r.keywordGaps.map(s => `  - ${s}`), ``);
  if (r.priorityActions?.length) lines.push(`PRIORITY ACTIONS:`, ...r.priorityActions.map((s, i) => `  ${i + 1}. ${s}`), ``);
  lines.push(`RESUME SECTIONS:`);
  r.sections.forEach(s => lines.push(`  ${s.name}: ${s.status}`));
  lines.push(``);
  lines.push(`IMPROVEMENTS:`);
  r.improvements.forEach((im, i) => { lines.push(`  ${i + 1}. ${im.title}`, `     ${im.detail}`, ``); });
  lines.push(`BULLET REWRITES:`);
  r.rewrites.forEach((rw, i) => { lines.push(`  ${i + 1}. Before: ${rw.before}`, `     After: ${rw.after}`, `     Why: ${rw.why}`, ``); });
  if (r.marketSources?.length) {
    lines.push(`MARKET SOURCES:`);
    r.marketSources.forEach((source, i) => lines.push(`  ${i + 1}. ${source.title}`, `     ${source.url}`, ``));
  }
  lines.push(`OVERALL ASSESSMENT:`, r.overallAssessment);

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `resumeiq-report-${Date.now()}.txt`;
  a.click(); URL.revokeObjectURL(url);
}

export function ResultsScreen() {
  const { result, reset } = useAnalysis();

  if (!result) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[rgba(79,142,247,0.1)] flex items-center justify-center">
            <TrendingUp size={32} className="text-[#4F8EF7]" />
          </div>
          <h3 className="text-xl text-[#F0F0F5] mb-2">No analysis results yet</h3>
          <p className="text-[#8888A0] mb-6">Upload your resume and run an analysis to see your results here.</p>
          <Link href="/" className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#4F8EF7] to-[#7C5CFC] text-[#F0F0F5] hover:shadow-[0_0_24px_rgba(79,142,247,0.3)] transition-all duration-200">
            Go to Upload
          </Link>
        </div>
      </div>
    );
  }

  return <ResultsDashboard result={result} onReset={reset} />;
}

function ResultsDashboard({ result: r, onReset }: { result: AnalysisResult; onReset: () => void }) {
  const sc = useMemo(() => scoreColor(r.atsScore), [r.atsScore]);
  const mfColor = useMemo(() => scoreColor(r.marketFit), [r.marketFit]);
  const circumference = 2 * Math.PI * 28;
  const dashOffset = circumference - (r.atsScore / 100) * circumference;
  const date = new Date(r.analyzedAt);
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Nav */}
      <nav className="flex items-center justify-between gap-4 border-b border-[#1E1E2E] px-4 py-4 md:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="bg-gradient-to-r from-[#4F8EF7] to-[#7C5CFC] bg-clip-text text-xl font-medium text-transparent">Resume IQ</Link>
          <div className="px-3 py-1 rounded-full bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] text-xs text-[#8888A0]">AI-Powered · Live Market Data</div>
        </div>
        <AuthNavButton />
      </nav>

      {/* Sub-header */}
      <div className="flex flex-col gap-4 border-b border-[#1E1E2E] bg-[#111118] px-4 py-4 lg:flex-row lg:items-center lg:justify-between md:px-8">
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/" onClick={onReset} className="text-[#8888A0] hover:text-[#F0F0F5] transition-colors"><ArrowLeft size={20} /></Link>
          <h3 className="text-[#F0F0F5]">Resume Analysis</h3>
          <div className="px-3 py-1 rounded-full bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] text-xs text-[#8888A0]">{r.role}</div>
          <span className="text-sm text-[#44445A]">{dateStr}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => downloadReport(r)} className="px-4 py-2 rounded-lg bg-transparent border border-[#1E1E2E] text-[#8888A0] hover:border-[#4F8EF7] hover:text-[#F0F0F5] transition-all duration-200 flex items-center gap-2">
            <Download size={16} />Download Report
          </button>
          <Link href="/" onClick={onReset} className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#4F8EF7] to-[#7C5CFC] text-[#F0F0F5] hover:shadow-[0_0_24px_rgba(79,142,247,0.3)] transition-all duration-200 flex items-center gap-2">
            <RefreshCw size={16} />Analyze Another
          </Link>
        </div>
      </div>

      {/* Dashboard */}
      <div className="px-4 py-8 md:px-8">
        {/* Stat cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {/* ATS Score */}
          <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] p-6 hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(79,142,247,0.15)] transition-all duration-200">
            <div className="text-sm text-[#8888A0] mb-2">ATS Score</div>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="#1E1E2E" strokeWidth="4" fill="none" />
                  <circle cx="32" cy="32" r="28" stroke={sc.stroke} strokeWidth="4" fill="none"
                    strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round"
                    className={`drop-shadow-[0_0_8px_${sc.glow}]`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`bg-gradient-to-br ${sc.grad} bg-clip-text text-transparent font-mono`}>{r.atsScore}</span>
                </div>
              </div>
              <div className={sc.text}>{r.atsLabel}</div>
            </div>
          </div>

          {/* Skills Matched */}
          <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] p-6 hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(34,197,94,0.15)] transition-all duration-200">
            <div className="text-sm text-[#8888A0] mb-2">Skills Matched</div>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#22C55E] to-[#10B981] bg-clip-text text-transparent text-3xl font-mono">{r.skillsMatched.length}/{r.totalRequired}</div>
              <div className="text-[#22C55E]">Required skills found</div>
            </div>
          </div>

          {/* Missing Critical */}
          <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] p-6 hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(239,68,68,0.15)] transition-all duration-200">
            <div className="text-sm text-[#8888A0] mb-2">Missing Critical</div>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#EF4444] to-[#DC2626] bg-clip-text text-transparent text-3xl font-mono">{r.skillsMissing.length}</div>
              <div className="text-[#EF4444]">Must-add skills</div>
            </div>
          </div>

          {/* Profile Strength */}
          <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] p-6 hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(79,142,247,0.15)] transition-all duration-200">
            <div className="text-sm text-[#8888A0] mb-2">Profile Strength</div>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(i => <div key={i} className={`w-2 h-8 rounded-sm ${i <= r.profileStrength ? 'bg-[#4F8EF7]' : 'bg-[#1E1E2E]'}`} />)}
              </div>
              <div className="text-[#4F8EF7]">{r.profileStrengthLabel}</div>
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-xl bg-[rgba(255,255,255,0.03)] border border-[#1E1E2E] p-4 flex items-center gap-3">
            <ScanText size={18} className="text-[#4F8EF7]" />
            <div>
              <div className="text-sm text-[#8888A0]">Extraction</div>
              <div className="text-[#F0F0F5]">{extractionLabel(r.extraction?.method)}{r.extraction?.characters ? ` · ${r.extraction.characters.toLocaleString()} chars` : ''}</div>
            </div>
          </div>
          <div className="rounded-xl bg-[rgba(255,255,255,0.03)] border border-[#1E1E2E] p-4 flex items-center gap-3">
            <TrendingUp size={18} className="text-[#22C55E]" />
            <div>
              <div className="text-sm text-[#8888A0]">Market Sources</div>
              <div className="text-[#F0F0F5]">{r.marketSources?.length ?? 0} live references used</div>
            </div>
          </div>
          <div className="rounded-xl bg-[rgba(255,255,255,0.03)] border border-[#1E1E2E] p-4 flex items-center gap-3">
            <ListChecks size={18} className="text-[#F59E0B]" />
            <div>
              <div className="text-sm text-[#8888A0]">Priority Actions</div>
              <div className="text-[#F0F0F5]">{r.priorityActions?.length ?? 0} next steps</div>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Left column */}
          <div className="space-y-6">
            {/* Critical Missing */}
            <div className="rounded-2xl bg-[rgba(239,68,68,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] overflow-hidden hover:-translate-y-0.5 transition-all duration-200">
              <div className="bg-[rgba(239,68,68,0.05)] border-b border-[#1E1E2E] px-6 py-3 flex items-center gap-2">
                <AlertTriangle size={18} className="text-[#EF4444]" /><span className="text-[#F0F0F5]">Critical Skills Missing</span>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {r.skillsMissing.map(s => <span key={s} className="px-3 py-1.5 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-[#EF4444] font-mono text-sm flex items-center gap-2"><span>×</span> {s}</span>)}
                  {r.skillsMissing.length === 0 && <p className="text-sm text-[#8888A0]">No critical skills missing — great job!</p>}
                </div>
                {r.skillsNiceToHave.length > 0 && (
                  <div className="border-t border-[#1E1E2E] pt-4">
                    <div className="flex items-center gap-2 mb-2"><Sparkles size={16} className="text-[#F59E0B]" /><span className="text-sm text-[#F59E0B]">Nice to Have</span></div>
                    <div className="flex flex-wrap gap-2">
                      {r.skillsNiceToHave.map(s => <span key={s} className="px-3 py-1.5 rounded-lg bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.3)] text-[#F59E0B] font-mono text-sm flex items-center gap-2"><span>+</span> {s}</span>)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Skills You Have */}
            <div className="rounded-2xl bg-[rgba(34,197,94,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] overflow-hidden hover:-translate-y-0.5 transition-all duration-200">
              <div className="bg-[rgba(34,197,94,0.05)] border-b border-[#1E1E2E] px-6 py-3 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[#22C55E]" /><span className="text-[#F0F0F5]">Skills You Already Have</span>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {r.skillsMatched.map(s => <span key={s} className="px-3 py-1.5 rounded-lg bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] text-[#22C55E] font-mono text-sm flex items-center gap-2"><span>✓</span> {s}</span>)}
                  {r.skillsMatched.length === 0 && <p className="text-sm text-[#8888A0]">No matching skills found — consider updating your resume.</p>}
                </div>
              </div>
            </div>

            {/* Resume Sections */}
            <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] overflow-hidden hover:-translate-y-0.5 transition-all duration-200">
              <div className="bg-[rgba(255,255,255,0.02)] border-b border-[#1E1E2E] px-6 py-3"><span className="text-[#F0F0F5]">Resume Sections</span></div>
              <div className="p-6 space-y-3">
                {r.sections.map(s => (
                  <div key={s.name} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${sectionDot(s.level)} animate-pulse`} />
                    <div className="flex-1 flex items-baseline gap-2">
                      <span className="text-[#F0F0F5]">{s.name}</span><span className="text-sm">—</span>
                      <span className={`text-sm ${sectionTextColor(s.level)}`}>{s.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Improvements */}
            <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] overflow-hidden hover:-translate-y-0.5 transition-all duration-200">
              <div className="bg-[rgba(79,142,247,0.05)] border-b border-[#1E1E2E] px-6 py-3 flex items-center gap-2">
                <Target size={18} className="text-[#4F8EF7]" /><span className="text-[#F0F0F5]">What To Add / Improve</span>
              </div>
              <div className="p-6 space-y-6">
                {r.improvements.map((item, i) => (
                  <div key={i} className="border-l-2 border-[#4F8EF7] pl-4">
                    <div className="text-[#F0F0F5] mb-1">{i + 1}. {item.title}</div>
                    <p className="text-sm text-[#8888A0]">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bullet Rewrites */}
            <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] overflow-hidden hover:-translate-y-0.5 transition-all duration-200">
              <div className="bg-[rgba(255,255,255,0.02)] border-b border-[#1E1E2E] px-6 py-3 flex items-center gap-2"><span className="text-[#F0F0F5]">✏ Bullet Point Rewrites</span></div>
              <div className="p-6 space-y-6">
                {r.rewrites.map((rw, i) => (
                  <div key={i} className="space-y-3">
                    <div>
                      <div className="inline-block px-2 py-0.5 rounded text-xs bg-[rgba(239,68,68,0.1)] text-[#EF4444] mb-2">BEFORE</div>
                      <p className="text-sm text-[#8888A0] opacity-60 line-through">{rw.before}</p>
                    </div>
                    <div className="text-[#8888A0] text-center">↓</div>
                    <div>
                      <div className="inline-block px-2 py-0.5 rounded text-xs bg-[rgba(34,197,94,0.1)] text-[#22C55E] mb-2">AFTER</div>
                      <p className="text-sm text-[#F0F0F5]">{rw.after}</p>
                    </div>
                    <details className="text-xs text-[#8888A0] cursor-pointer">
                      <summary className="hover:text-[#4F8EF7] transition-colors">Why this works</summary>
                      <p className="mt-2 pl-4 border-l border-[#1E1E2E]">{rw.why}</p>
                    </details>
                    {i < r.rewrites.length - 1 && <div className="border-t border-[#1E1E2E] pt-3" />}
                  </div>
                ))}
              </div>
            </div>

            {Boolean(r.priorityActions?.length || r.keywordGaps?.length) && (
              <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] overflow-hidden hover:-translate-y-0.5 transition-all duration-200">
                <div className="bg-[rgba(245,158,11,0.05)] border-b border-[#1E1E2E] px-6 py-3 flex items-center gap-2">
                  <ListChecks size={18} className="text-[#F59E0B]" /><span className="text-[#F0F0F5]">Priority Fixes</span>
                </div>
                <div className="p-6 space-y-5">
                  {Boolean(r.priorityActions?.length) && (
                    <div className="space-y-3">
                      {r.priorityActions?.map((action, i) => (
                        <div key={action} className="flex gap-3">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(245,158,11,0.12)] text-xs text-[#F59E0B]">{i + 1}</span>
                          <p className="text-sm text-[#F0F0F5]">{action}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {Boolean(r.keywordGaps?.length) && (
                    <div className="border-t border-[#1E1E2E] pt-4">
                      <div className="text-sm text-[#8888A0] mb-3">ATS keyword gaps</div>
                      <div className="flex flex-wrap gap-2">
                        {r.keywordGaps?.map((gap) => (
                          <span key={gap} className="px-3 py-1.5 rounded-lg bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.3)] text-[#F59E0B] font-mono text-sm">{gap}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {Boolean(r.marketSources?.length) && (
              <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] overflow-hidden hover:-translate-y-0.5 transition-all duration-200">
                <div className="bg-[rgba(79,142,247,0.05)] border-b border-[#1E1E2E] px-6 py-3 flex items-center gap-2">
                  <ExternalLink size={18} className="text-[#4F8EF7]" /><span className="text-[#F0F0F5]">Market Data Used</span>
                </div>
                <div className="p-6 space-y-4">
                  {r.marketSources?.map((source) => (
                    <a key={source.url || source.title} href={source.url} target="_blank" rel="noreferrer" className="block rounded-xl border border-[#1E1E2E] bg-[#111118] p-4 hover:border-[#4F8EF7] transition-colors">
                      <div className="flex items-start gap-2">
                        <span className="text-sm text-[#F0F0F5] flex-1">{source.title}</span>
                        <ExternalLink size={14} className="text-[#8888A0] mt-0.5" />
                      </div>
                      {source.content && <p className="mt-2 text-xs text-[#8888A0] line-clamp-2">{source.content}</p>}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Overall Assessment */}
            <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border-l-2 border-[#4F8EF7] border-t border-r border-b border-[#1E1E2E] p-6 hover:-translate-y-0.5 transition-all duration-200">
              <h4 className="text-[#F0F0F5] mb-3">Overall Assessment</h4>
              <p className="text-sm text-[#8888A0] leading-relaxed mb-4">{r.overallAssessment}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#8888A0]">Market fit:</span>
                  <span className={`${mfColor.text} font-mono`}>{r.marketFit}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#1E1E2E] overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${mfColor.grad} rounded-full shadow-[0_0_12px_${mfColor.glow}]`} style={{ width: `${r.marketFit}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
