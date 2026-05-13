import { Sparkles, Menu } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1E1E2E] bg-[rgba(10,10,15,0.8)] backdrop-blur-[12px]">
      <div className="max-w-[1600px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F8EF7] to-[#7C5CFC] flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <Link href="/" className="bg-gradient-to-r from-[#4F8EF7] to-[#7C5CFC] bg-clip-text text-transparent font-semibold">
                ResumeIQ
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm text-[#8888A0] hover:text-[#F0F0F5] transition-colors">
                Upload
              </Link>
              <Link href="/processing" className="text-sm text-[#8888A0] hover:text-[#F0F0F5] transition-colors">
                Processing
              </Link>
              <Link href="/results" className="text-sm text-[#8888A0] hover:text-[#F0F0F5] transition-colors">
                Results
              </Link>
              <Link href="/showcase" className="text-sm text-[#8888A0] hover:text-[#F0F0F5] transition-colors">
                Showcase
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/showcase" className="hidden md:block px-4 py-2 text-sm text-[#8888A0] hover:text-[#F0F0F5] transition-colors">
              Sign in
            </Link>
            <Link href="/" className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#4F8EF7] to-[#7C5CFC] text-[#F0F0F5] text-sm hover:shadow-[0_0_24px_rgba(79,142,247,0.3)] transition-all duration-200">
              Get started free
            </Link>
            <button className="md:hidden w-10 h-10 rounded-lg bg-[#111118] border border-[#1E1E2E] flex items-center justify-center">
              <Menu size={18} className="text-[#8888A0]" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
