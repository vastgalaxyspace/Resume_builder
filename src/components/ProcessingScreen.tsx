"use client";

import { CheckCircle2, Loader2, Circle, Radio, AlertTriangle, RotateCw } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { AuthNavButton } from './AuthNavButton';
import { useAnalysis, AnalysisStep } from '@/context/AnalysisContext';

const STEP_CONFIG = [
  { id: 'uploading', text: 'Uploading resume', subtext: 'Preparing your file...' },
  { id: 'parsing', text: 'Parsing resume content', subtext: 'Extracting text from your document...' },
  { id: 'searching', text: 'Fetching live job requirements', subtext: 'Searching real job postings via Tavily...' },
  { id: 'analyzing', text: 'Running AI gap analysis', subtext: 'Mistral AI is comparing your resume against market data...' },
  { id: 'done', text: 'Preparing your report', subtext: '' },
] as const;

function stepIndex(s: AnalysisStep): number {
  const idx = STEP_CONFIG.findIndex(c => c.id === s);
  return idx >= 0 ? idx : -1;
}

function progressPercent(s: AnalysisStep): number {
  const map: Record<string, number> = { idle: 0, uploading: 10, parsing: 30, searching: 50, analyzing: 75, done: 100, error: 0 };
  return map[s] ?? 0;
}

export function ProcessingScreen() {
  const { step, error, file, role, experience, startAnalysis, reset } = useAnalysis();
  const started = useRef(false);
  const [displayPct, setDisplayPct] = useState(0);

  // Kick off analysis on mount
  useEffect(() => {
    if (!started.current && file && role) {
      started.current = true;
      startAnalysis();
    }
  }, [file, role, startAnalysis]);

  // Animate progress
  useEffect(() => {
    const target = progressPercent(step);
    const timer = setInterval(() => {
      setDisplayPct(prev => {
        if (prev >= target) { clearInterval(timer); return target; }
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [step]);

  const currentStepIdx = stepIndex(step);
  const circumference = 2 * Math.PI * 44;
  const dashOffset = circumference - (displayPct / 100) * circumference;

  // If no file/role (direct navigation), show message
  if (!file || !role) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[rgba(79,142,247,0.1)] flex items-center justify-center">
            <AlertTriangle size={32} className="text-[#F59E0B]" />
          </div>
          <h3 className="text-xl text-[#F0F0F5] mb-2">No resume uploaded</h3>
          <p className="text-[#8888A0] mb-6">Please upload your resume and select a target role first.</p>
          <Link href="/" className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#4F8EF7] to-[#7C5CFC] text-[#F0F0F5] hover:shadow-[0_0_24px_rgba(79,142,247,0.3)] transition-all duration-200">
            Go to Upload
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <nav className="flex items-center justify-between gap-4 border-b border-[#1E1E2E] px-4 py-4 md:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="bg-gradient-to-r from-[#4F8EF7] to-[#7C5CFC] bg-clip-text text-xl font-medium text-transparent">Resume IQ</Link>
          <div className="px-3 py-1 rounded-full bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] text-xs text-[#8888A0]">AI-Powered · Live Market Data</div>
        </div>
        <AuthNavButton />
      </nav>

      <div className="px-4 py-16 md:px-8 md:py-24 flex items-center justify-center">
        <div className="max-w-[600px] w-full">
          <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] p-8 md:p-12">
            {/* Progress Ring */}
            <div className="flex justify-center mb-8">
              <div className="relative w-28 h-28">
                <svg className="w-28 h-28 -rotate-90">
                  <circle cx="56" cy="56" r="44" stroke="#1E1E2E" strokeWidth="5" fill="none" />
                  <circle cx="56" cy="56" r="44" stroke="url(#progressGrad)" strokeWidth="5" fill="none"
                    strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round"
                    className="drop-shadow-[0_0_12px_rgba(79,142,247,0.6)] transition-all duration-500" />
                  <defs>
                    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4F8EF7" />
                      <stop offset="100%" stopColor="#7C5CFC" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-mono bg-gradient-to-r from-[#4F8EF7] to-[#7C5CFC] bg-clip-text text-transparent">{displayPct}%</span>
                </div>
              </div>
            </div>

            <h3 className="text-center text-2xl text-[#F0F0F5] mb-2">
              {step === 'error' ? 'Analysis Failed' : step === 'done' ? 'Analysis Complete!' : 'Analyzing your resume...'}
            </h3>
            <p className="text-center text-sm text-[#8888A0] mb-8">
              {role} · {experience === 'entry' ? 'Entry Level' : experience === 'senior' ? 'Senior' : 'Mid Level'}
            </p>

            {/* Steps */}
            <div className="space-y-3 mb-8">
              {STEP_CONFIG.map((cfg, idx) => {
                let status: 'done' | 'active' | 'pending' = 'pending';
                if (step === 'error') {
                  status = idx < currentStepIdx ? 'done' : idx === currentStepIdx ? 'active' : 'pending';
                } else if (currentStepIdx > idx) {
                  status = 'done';
                } else if (currentStepIdx === idx) {
                  status = 'active';
                }

                return (
                  <div key={cfg.id} className={`flex items-start gap-4 p-3.5 rounded-xl transition-all duration-300 ${status === 'active' ? 'bg-[rgba(79,142,247,0.06)] border border-[rgba(79,142,247,0.2)]' : 'border border-transparent'}`}>
                    <div className="mt-0.5 flex-shrink-0">
                      {status === 'done' && <CheckCircle2 size={20} className="text-[#22C55E]" />}
                      {status === 'active' && <Loader2 size={20} className="text-[#4F8EF7] animate-spin" />}
                      {status === 'pending' && <Circle size={20} className="text-[#44445A]" />}
                    </div>
                    <div className="flex-1">
                      <p className={`${status === 'done' ? 'text-[#8888A0] line-through' : status === 'active' ? 'text-[#F0F0F5]' : 'text-[#44445A]'}`}>{cfg.text}</p>
                      {cfg.subtext && status === 'active' && <p className="text-sm text-[#8888A0] mt-1">{cfg.subtext}</p>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Error state */}
            {step === 'error' && (
              <div className="mb-6">
                <div className="rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/10 p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={18} className="text-[#EF4444] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-[#FCA5A5] font-medium mb-1">Something went wrong</p>
                      <p className="text-sm text-[#FCA5A5]/70">{error || 'An unexpected error occurred.'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { started.current = false; startAnalysis(); }} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#4F8EF7] to-[#7C5CFC] text-[#F0F0F5] flex items-center justify-center gap-2 hover:shadow-[0_0_24px_rgba(79,142,247,0.3)] transition-all duration-200">
                    <RotateCw size={16} /> Retry
                  </button>
                  <Link href="/" onClick={reset} className="flex-1 py-3 rounded-xl border border-[#1E1E2E] bg-[#111118] text-[#8888A0] flex items-center justify-center hover:border-[#4F8EF7] hover:text-[#F0F0F5] transition-all duration-200">
                    Start Over
                  </Link>
                </div>
              </div>
            )}

            {/* Live feed indicator */}
            {step !== 'error' && step !== 'done' && (
              <div className="bg-[rgba(79,142,247,0.05)] rounded-xl border border-[#1E1E2E] p-4 mb-6">
                <div className="flex items-center gap-3">
                  <Radio size={16} className="text-[#4F8EF7] animate-pulse" />
                  <div className="flex-1">
                    <p className="text-sm text-[#8888A0]">Analyzing: {file.name}</p>
                    <p className="text-xs text-[#44445A] font-mono">Target: {role}</p>
                  </div>
                </div>
              </div>
            )}

            {step !== 'error' && <p className="text-center text-sm text-[#44445A]">Usually takes 20–30 seconds</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
