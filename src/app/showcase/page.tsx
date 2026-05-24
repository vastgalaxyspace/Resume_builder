import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ColorPalette } from "@/components/ColorPalette";
import Link from "next/link";

export default function ShowcasePage() {
  return (
    <div className="min-h-screen w-full bg-[#050508]">
      <Header />

      <main className="px-6 py-12">
        <div className="mx-auto max-w-[1600px] space-y-12">
          <div className="mb-16 text-center">
            <h1 className="mb-4 inline-block bg-gradient-to-r from-[#4F8EF7] to-[#7C5CFC] bg-clip-text text-4xl font-bold text-transparent">
              ResumeIQ Design Showcase
            </h1>
            <p className="text-[#8888A0]">Dark-theme AI-powered resume analyzer</p>
          </div>

          <div className="space-y-16">
            <ShowcasePanel label="01 Upload">
              <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[rgba(79,142,247,0.1)] flex items-center justify-center">
                  <span className="text-[#4F8EF7] text-2xl">📄</span>
                </div>
                <h3 className="text-xl text-[#F0F0F5] mb-2">Upload Screen</h3>
                <p className="text-[#8888A0] mb-4">Drag-and-drop resume upload with role selection and experience level picker.</p>
                <Link href="/" className="inline-block px-6 py-2 rounded-lg bg-gradient-to-r from-[#4F8EF7] to-[#7C5CFC] text-[#F0F0F5] text-sm">Try it live →</Link>
              </div>
            </ShowcasePanel>

            <ShowcasePanel label="02 Processing">
              <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[rgba(79,142,247,0.1)] flex items-center justify-center">
                  <span className="text-[#4F8EF7] text-2xl">⚙️</span>
                </div>
                <h3 className="text-xl text-[#F0F0F5] mb-2">Processing Screen</h3>
                <p className="text-[#8888A0] mb-4">Real-time progress tracking with animated steps — parsing, searching, analyzing.</p>
              </div>
            </ShowcasePanel>

            <ShowcasePanel label="03 Results">
              <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[#1E1E2E] p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[rgba(79,142,247,0.1)] flex items-center justify-center">
                  <span className="text-[#4F8EF7] text-2xl">📊</span>
                </div>
                <h3 className="text-xl text-[#F0F0F5] mb-2">Results Dashboard</h3>
                <p className="text-[#8888A0] mb-4">Dynamic ATS score, skills gap analysis, improvement suggestions, bullet rewrites.</p>
              </div>
            </ShowcasePanel>
          </div>

          <ColorPalette />
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ShowcasePanel({
  label,
  children,
}: Readonly<{
  label: string;
  children: React.ReactNode;
}>) {
  return (
    <section className="relative">
      <div className="absolute -top-8 left-4 rounded-full border border-[#1E1E2E] bg-[#1A1A24] px-3 py-1 font-mono text-xs text-[#4F8EF7]">
        {label}
      </div>
      <div className="overflow-hidden rounded-2xl border border-[#1E1E2E] bg-[#111118] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] md:p-8">
        {children}
      </div>
    </section>
  );
}
