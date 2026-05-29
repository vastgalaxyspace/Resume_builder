"use client";

import { CloudUpload, Search, FileText, X, Briefcase, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState, DragEvent } from 'react';

import { AuthNavButton } from './AuthNavButton';
import { useAnalysis, ExperienceLevel } from '@/context/AnalysisContext';

const QUICK_ROLES = ['Data Scientist', 'Frontend Engineer', 'Product Manager', 'Backend Developer', 'ML Engineer', 'DevOps Engineer'];

const EXP_OPTIONS: { value: ExperienceLevel; label: string; desc: string }[] = [
  { value: 'entry', label: 'Entry Level', desc: '0-2 years' },
  { value: 'mid', label: 'Mid Level', desc: '2-5 years' },
  { value: 'senior', label: 'Senior', desc: '5+ years' },
];

function fmtSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

export function UploadScreen() {
  const router = useRouter();
  const { file, role, experience, setFile, setRole, setExperience } = useAnalysis();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [showExp, setShowExp] = useState(false);
  const [err, setErr] = useState('');

  const pick = useCallback((f: File | null) => {
    setErr('');
    if (!f) return;
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'txt'].includes(ext || '')) { setErr('Upload a PDF, DOCX, or TXT file.'); return; }
    if (f.size > 10485760) { setErr('Max file size is 10 MB.'); return; }
    setFile(f);
  }, [setFile]);

  const onDrop = useCallback((e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragOver(false); pick(e.dataTransfer.files?.[0] || null); }, [pick]);

  const go = () => {
    setErr('');
    if (!file) { setErr('Please upload your resume first.'); return; }
    if (!role.trim()) { setErr('Please enter a target role.'); return; }
    router.push('/processing');
  };

  const curExp = EXP_OPTIONS.find(o => o.value === experience)!;

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <nav className="flex items-center justify-between gap-4 border-b border-[#1E1E2E] px-4 py-4 md:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="bg-gradient-to-r from-[#4F8EF7] to-[#7C5CFC] bg-clip-text text-xl font-medium text-transparent">Resume IQ</Link>
          <div className="px-3 py-1 rounded-full bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] text-xs text-[#8888A0]">AI-Powered · Live Market Data</div>
          <Link href="/pricing" className="hidden text-sm text-[#8888A0] transition-colors hover:text-[#F0F0F5] md:block">Pricing</Link>
        </div>
        <AuthNavButton />
      </nav>

      <div className="px-4 py-12 md:px-8 md:py-16">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(79,142,247,0.08)] border border-[rgba(79,142,247,0.2)] text-[#4F8EF7] text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[#4F8EF7] animate-pulse" />
            Powered by Mistral AI + Live Market Data
          </div>
          <h1 className="text-4xl md:text-5xl mb-4 text-[#F0F0F5] leading-tight">Get hired <span className="bg-gradient-to-r from-[#4F8EF7] to-[#7C5CFC] bg-clip-text text-transparent">faster.</span></h1>
          <p className="text-lg md:text-xl text-[#8888A0] mb-6 max-w-2xl mx-auto">We compare your resume against live market job requirements and show exactly what&apos;s missing.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="px-4 py-2 rounded-full bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] text-[#8888A0]">10k+ resumes analyzed</div>
            <div className="text-[#44445A]">·</div>
            <div className="px-4 py-2 rounded-full bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] text-[#8888A0]">94% success rate</div>
          </div>
        </div>

        <div className="max-w-[640px] mx-auto">
          <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] p-6 md:p-8">
            {/* Step 1 */}
            <div className="mb-8">
              <div className="text-sm text-[#4F8EF7] font-mono mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[rgba(79,142,247,0.15)] flex items-center justify-center text-xs">1</span>Upload Resume
              </div>
              {!file ? (
                <div className={`rounded-xl border-2 border-dashed p-6 md:p-10 text-center cursor-pointer transition-all duration-300 ${dragOver ? 'border-[#4F8EF7] bg-[rgba(79,142,247,0.08)] shadow-[0_0_32px_rgba(79,142,247,0.15)]' : 'border-[#1E1E2E] bg-[#0A0A0F] hover:border-[#4F8EF7] hover:shadow-[0_0_24px_rgba(79,142,247,0.1)]'}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={onDrop} onClick={() => inputRef.current?.click()}>
                  <input ref={inputRef} type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={e => pick(e.target.files?.[0] || null)} />
                  <div className={`mx-auto mb-4 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${dragOver ? 'bg-[rgba(79,142,247,0.2)] scale-110' : 'bg-[rgba(79,142,247,0.1)]'}`}>
                    <CloudUpload size={28} className="text-[#4F8EF7]" />
                  </div>
                  <p className="text-[#F0F0F5] mb-1 font-medium">{dragOver ? 'Drop your file here' : 'Drop your resume here'}</p>
                  <p className="text-sm text-[#8888A0] mb-4">or click to browse files</p>
                  <div className="flex items-center justify-center gap-2">
                    {['PDF', 'DOCX', 'TXT'].map(t => <span key={t} className="px-3 py-1 rounded text-xs font-mono bg-[#111118] border border-[#1E1E2E] text-[#8888A0]">{t}</span>)}
                    <span className="text-xs text-[#44445A] ml-1">Max 10MB</span>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-[#1E1E2E] bg-[#111118] p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[rgba(79,142,247,0.1)] flex items-center justify-center flex-shrink-0"><FileText size={22} className="text-[#4F8EF7]" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#F0F0F5] truncate font-medium">{file.name}</p>
                    <p className="text-xs text-[#8888A0]">{fmtSize(file.size)} · {file.name.split('.').pop()?.toUpperCase()}</p>
                  </div>
                  <button onClick={e => { e.stopPropagation(); setFile(null); }} className="w-9 h-9 rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] flex items-center justify-center text-[#8888A0] hover:text-[#EF4444] hover:border-[#EF4444] transition-all duration-200"><X size={16} /></button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 my-6"><div className="flex-1 h-px bg-[#1E1E2E]" /><span className="text-sm text-[#44445A]">then</span><div className="flex-1 h-px bg-[#1E1E2E]" /></div>

            {/* Step 2 */}
            <div className="mb-6">
              <div className="text-sm text-[#4F8EF7] font-mono mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[rgba(79,142,247,0.15)] flex items-center justify-center text-xs">2</span>Target Role
              </div>
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8888A0] pointer-events-none" />
                <input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder='e.g. "Senior ML Engineer at Google"'
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#111118] border border-[#1E1E2E] text-[#F0F0F5] placeholder:text-[#44445A] focus:border-[#4F8EF7] focus:outline-none focus:ring-1 focus:ring-[#4F8EF7] transition-all duration-200" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {QUICK_ROLES.map(r => (
                  <button key={r} onClick={() => setRole(r)} className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${role === r ? 'bg-[rgba(79,142,247,0.15)] border border-[#4F8EF7] text-[#4F8EF7]' : 'bg-[#111118] border border-[#1E1E2E] text-[#8888A0] hover:border-[#4F8EF7] hover:text-[#F0F0F5]'}`}>{r}</button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 my-6"><div className="flex-1 h-px bg-[#1E1E2E]" /><span className="text-sm text-[#44445A]">and</span><div className="flex-1 h-px bg-[#1E1E2E]" /></div>

            {/* Step 3 */}
            <div className="mb-8">
              <div className="text-sm text-[#4F8EF7] font-mono mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[rgba(79,142,247,0.15)] flex items-center justify-center text-xs">3</span>Experience Level
              </div>
              <div className="relative">
                <button onClick={() => setShowExp(!showExp)} className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl bg-[#111118] border border-[#1E1E2E] text-[#F0F0F5] hover:border-[#4F8EF7] transition-all duration-200">
                  <div className="flex items-center gap-3"><Briefcase size={18} className="text-[#8888A0]" /><span>{curExp.label}</span><span className="text-sm text-[#44445A]">({curExp.desc})</span></div>
                  <ChevronDown size={18} className={`text-[#8888A0] transition-transform duration-200 ${showExp ? 'rotate-180' : ''}`} />
                </button>
                {showExp && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-20 rounded-xl border border-[#1E1E2E] bg-[#111118] shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
                    {EXP_OPTIONS.map(o => (
                      <button key={o.value} onClick={() => { setExperience(o.value); setShowExp(false); }} className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all duration-150 ${experience === o.value ? 'bg-[rgba(79,142,247,0.1)] text-[#4F8EF7]' : 'text-[#F0F0F5] hover:bg-[rgba(255,255,255,0.03)]'}`}>
                        <span>{o.label}</span><span className="text-sm text-[#8888A0]">{o.desc}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {err && <div className="mb-4 rounded-lg border border-[#EF4444]/40 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{err}</div>}

            <button onClick={go} className="block w-full py-4 rounded-xl bg-gradient-to-r from-[#4F8EF7] to-[#7C5CFC] text-center text-[#F0F0F5] font-medium hover:shadow-[0_0_32px_rgba(79,142,247,0.3)] hover:scale-[0.98] active:scale-[0.96] transition-all duration-200">
              Analyze My Resume →
            </button>

            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-[#44445A]">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />Secure & Private</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />30-Second Analysis</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />Free to Use</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
