import Link from "next/link";

import { PricingPlans } from "@/components/PricingPlans";

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <main className="min-h-screen bg-[#0A0A0F] px-4 py-8 md:px-8">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Link
          href="/"
          className="bg-gradient-to-r from-[#4F8EF7] to-[#7C5CFC] bg-clip-text text-xl font-medium text-transparent"
        >
          Resume IQ
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-[#1E1E2E] bg-[#111118] px-4 py-2 text-sm text-[#F0F0F5] transition-all duration-200 hover:border-[#4F8EF7]"
        >
          Back to app
        </Link>
      </nav>

      <section className="mx-auto max-w-6xl py-12 md:py-16">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center rounded-full border border-[rgba(79,142,247,0.2)] bg-[rgba(79,142,247,0.08)] px-4 py-1.5 text-sm text-[#4F8EF7]">
            Simple monthly plans
          </div>
          <h1 className="text-4xl leading-tight text-[#F0F0F5] md:text-5xl">
            Choose a ResumeIQ plan
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#8888A0]">
            Start free, then upgrade when you want unlimited analysis and deeper role-specific
            guidance.
          </p>
          {resolvedSearchParams.checkout === "cancelled" && (
            <div className="mx-auto mt-6 max-w-2xl rounded-lg border border-[#F59E0B]/40 bg-[#F59E0B]/10 px-4 py-3 text-sm text-[#FCD34D]">
              Checkout was cancelled. You can choose a plan whenever you are ready.
            </div>
          )}
        </div>

        <PricingPlans />
      </section>
    </main>
  );
}
