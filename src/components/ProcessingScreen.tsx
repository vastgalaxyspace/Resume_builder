import { CheckCircle2, Loader2, Circle, Radio } from 'lucide-react';
import { Moon } from 'lucide-react';
import Link from 'next/link';

export function ProcessingScreen() {
  const steps = [
    { id: 1, text: 'Parsing resume content', status: 'done' },
    { id: 2, text: 'Fetching latest market job requirements', subtext: 'Searching LinkedIn, Greenhouse, Lever...', status: 'active' },
    { id: 3, text: 'Running AI gap analysis', status: 'pending' },
    { id: 4, text: 'Generating improvement suggestions', status: 'pending' },
    { id: 5, text: 'Preparing your report', status: 'pending' },
  ];

  return (
    <div className="min-h-[800px] bg-[#0A0A0F]">
      <nav className="flex items-center justify-between gap-4 border-b border-[#1E1E2E] px-4 py-4 md:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="bg-gradient-to-r from-[#4F8EF7] to-[#7C5CFC] bg-clip-text text-xl font-medium text-transparent">
            Resume IQ
          </Link>
          <div className="px-3 py-1 rounded-full bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] text-xs text-[#8888A0]">
            AI-Powered · Live Market Data
          </div>
        </div>
        <button className="w-10 h-10 rounded-lg bg-[#111118] border border-[#1E1E2E] flex items-center justify-center hover:bg-[#1A1A24] transition-all duration-200">
          <Moon size={18} className="text-[#8888A0]" />
        </button>
      </nav>

      <div className="px-8 py-24 flex items-center justify-center">
        <div className="max-w-[600px] w-full">
          <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] p-12">
            <div className="flex justify-center mb-8">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="44"
                    stroke="#1E1E2E"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="44"
                    stroke="#4F8EF7"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="276.46"
                    strokeDashoffset="110.58"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_12px_rgba(79,142,247,0.6)]"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-2xl text-[#4F8EF7] font-mono">
                  40%
                </div>
              </div>
            </div>

            <h3 className="text-center text-2xl text-[#F0F0F5] mb-8">Analyzing your resume...</h3>

            <div className="space-y-4 mb-8">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-start gap-4 p-4 rounded-lg transition-all duration-200 ${
                    step.status === 'active' ? 'bg-[rgba(79,142,247,0.05)] border-l-2 border-[#4F8EF7]' : ''
                  }`}
                >
                  <div className="mt-0.5">
                    {step.status === 'done' && (
                      <CheckCircle2 size={20} className="text-[#22C55E]" />
                    )}
                    {step.status === 'active' && (
                      <Loader2 size={20} className="text-[#4F8EF7] animate-spin" />
                    )}
                    {step.status === 'pending' && (
                      <Circle size={20} className="text-[#44445A]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`${
                      step.status === 'done' ? 'text-[#8888A0] line-through' :
                      step.status === 'active' ? 'text-[#F0F0F5]' :
                      'text-[#44445A]'
                    }`}>
                      {step.text}
                    </p>
                    {step.subtext && step.status === 'active' && (
                      <p className="text-sm text-[#8888A0] mt-1">{step.subtext}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[rgba(79,142,247,0.05)] rounded-lg border border-[#1E1E2E] p-4 mb-6">
              <div className="flex items-center gap-3">
                <Radio size={16} className="text-[#4F8EF7] animate-pulse" />
                <div className="flex-1">
                  <p className="text-sm text-[#8888A0]">Found: Senior ML Eng @ Stripe</p>
                  <p className="text-xs text-[#44445A] font-mono">lever.co</p>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-[#44445A]">Usually takes 20–30 seconds</p>
            <Link href="/results" className="mt-6 block w-full rounded-lg border border-[#1E1E2E] bg-[#111118] px-4 py-3 text-center text-sm text-[#8888A0] transition-all duration-200 hover:border-[#4F8EF7] hover:text-[#F0F0F5]">
              View sample results
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
