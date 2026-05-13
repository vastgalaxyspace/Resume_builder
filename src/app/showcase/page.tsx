import { ColorPalette } from "@/components/ColorPalette";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProcessingScreen } from "@/components/ProcessingScreen";
import { ResultsScreen } from "@/components/ResultsScreen";
import { UploadScreen } from "@/components/UploadScreen";

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
              <UploadScreen />
            </ShowcasePanel>

            <ShowcasePanel label="02 Processing">
              <ProcessingScreen />
            </ShowcasePanel>

            <ShowcasePanel label="03 Results">
              <ResultsScreen />
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
