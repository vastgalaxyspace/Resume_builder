import { CloudUpload, Search, Moon } from 'lucide-react';
import Link from 'next/link';

export function UploadScreen() {
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

      <div className="px-8 py-16">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-5xl mb-4 text-[#F0F0F5]">Get hired faster.</h1>
          <p className="text-xl text-[#8888A0] mb-6">
            We compare your resume against live market job requirements and show exactly what is missing.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="px-4 py-2 rounded-full bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] text-[#8888A0]">
              10k+ resumes analyzed
            </div>
            <div className="text-[#44445A]">·</div>
            <div className="px-4 py-2 rounded-full bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] text-[#8888A0]">
              94% success rate
            </div>
          </div>
        </div>

        <div className="max-w-[640px] mx-auto">
          <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] p-8">
            <div className="mb-8">
              <div className="text-sm text-[#4F8EF7] font-mono mb-3">01 — Upload Resume</div>
              <div className="relative group">
              <div className="rounded-xl border-2 border-dashed border-[#1E1E2E] bg-[#0A0A0F] p-8 text-center transition-all duration-200 hover:border-[#4F8EF7] hover:shadow-[0_0_24px_rgba(79,142,247,0.15)] md:p-12">
                  <CloudUpload size={48} className="mx-auto mb-4 text-[#4F8EF7]" />
                  <p className="text-[#F0F0F5] mb-2">Drop your PDF or DOCX here</p>
                  <button className="mt-3 px-6 py-2 rounded-lg bg-transparent border border-[#1E1E2E] text-[#8888A0] hover:border-[#4F8EF7] hover:text-[#F0F0F5] transition-all duration-200">
                    Browse files
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="px-3 py-1 rounded text-xs font-mono bg-[#111118] border border-[#1E1E2E] text-[#8888A0]">PDF</span>
                <span className="px-3 py-1 rounded text-xs font-mono bg-[#111118] border border-[#1E1E2E] text-[#8888A0]">DOCX</span>
                <span className="px-3 py-1 rounded text-xs font-mono bg-[#111118] border border-[#1E1E2E] text-[#8888A0]">TXT</span>
              </div>
            </div>

            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-[#1E1E2E]"></div>
              <span className="text-sm text-[#44445A]">then</span>
              <div className="flex-1 h-px bg-[#1E1E2E]"></div>
            </div>

            <div className="mb-8">
              <div className="text-sm text-[#4F8EF7] font-mono mb-3">02 — Target Role</div>
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8888A0]" />
                <input
                  type="text"
                  placeholder='e.g. "Senior ML Engineer at Google"'
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-[#111118] border border-[#1E1E2E] text-[#F0F0F5] placeholder:text-[#44445A] focus:border-[#4F8EF7] focus:outline-none focus:ring-1 focus:ring-[#4F8EF7] transition-all duration-200"
                />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button className="px-4 py-2 rounded-lg bg-[#111118] border border-[#1E1E2E] text-[#8888A0] hover:border-[#4F8EF7] hover:text-[#F0F0F5] transition-all duration-200">
                  Data Scientist
                </button>
                <button className="px-4 py-2 rounded-lg bg-[#111118] border border-[#1E1E2E] text-[#8888A0] hover:border-[#4F8EF7] hover:text-[#F0F0F5] transition-all duration-200">
                  Frontend Engineer
                </button>
                <button className="px-4 py-2 rounded-lg bg-[#111118] border border-[#1E1E2E] text-[#8888A0] hover:border-[#4F8EF7] hover:text-[#F0F0F5] transition-all duration-200">
                  Product Manager
                </button>
              </div>
            </div>

            <Link href="/processing" className="block w-full py-4 rounded-lg bg-gradient-to-r from-[#4F8EF7] to-[#7C5CFC] text-center text-[#F0F0F5] hover:shadow-[0_0_32px_rgba(79,142,247,0.3)] hover:scale-[0.98] active:scale-[0.96] transition-all duration-200 animate-pulse">
              Analyze My Resume →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
