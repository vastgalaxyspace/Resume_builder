import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { UploadScreen } from '@/components/UploadScreen';
import { ProcessingScreen } from '@/components/ProcessingScreen';
import { ResultsScreen } from '@/components/ResultsScreen';
import { ColorPalette } from '@/components/ColorPalette';

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#050508]">
      <Header />

      <main className="py-12 px-6">
        <div className="max-w-[1600px] mx-auto space-y-12">
          <div className="text-center mb-16">
            <h1 className="bg-gradient-to-r from-[#4F8EF7] to-[#7C5CFC] bg-clip-text text-transparent inline-block mb-4 text-4xl font-bold">
              ResumeIQ Design Showcase
            </h1>
            <p className="text-[#8888A0]">Dark-theme AI-powered resume analyzer</p>
          </div>

          <div className="space-y-16">
            <div className="relative">
              <div className="absolute -top-8 left-4 px-3 py-1 rounded-full bg-[#1A1A24] border border-[#1E1E2E] text-xs text-[#4F8EF7] font-mono">
                01 Upload
              </div>
              <div className="bg-[#111118] rounded-2xl border border-[#1E1E2E] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <UploadScreen />
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-8 left-4 px-3 py-1 rounded-full bg-[#1A1A24] border border-[#1E1E2E] text-xs text-[#4F8EF7] font-mono">
                02 Processing
              </div>
              <div className="bg-[#111118] rounded-2xl border border-[#1E1E2E] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <ProcessingScreen />
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-8 left-4 px-3 py-1 rounded-full bg-[#1A1A24] border border-[#1E1E2E] text-xs text-[#4F8EF7] font-mono">
                03 Results
              </div>
              <div className="bg-[#111118] rounded-2xl border border-[#1E1E2E] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <ResultsScreen />
              </div>
            </div>
          </div>

          <ColorPalette />
        </div>
      </main>

      <Footer />
    </div>
  );
}
