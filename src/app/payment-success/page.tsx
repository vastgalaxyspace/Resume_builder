import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0F] px-4 py-12">
      <div className="w-full max-w-xl rounded-lg border border-[#1E1E2E] bg-[rgba(255,255,255,0.03)] p-8 text-center">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-[#22C55E]/10">
          <CheckCircle2 size={30} className="text-[#22C55E]" />
        </div>
        <h1 className="text-3xl text-[#F0F0F5]">Payment successful</h1>
        <p className="mt-3 text-[#8888A0]">
          Your Stripe Checkout payment is complete. You can return to ResumeIQ and continue your
          resume analysis.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex rounded-lg bg-gradient-to-r from-[#4F8EF7] to-[#7C5CFC] px-5 py-3 text-sm text-[#F0F0F5] transition-all duration-200 hover:shadow-[0_0_24px_rgba(79,142,247,0.28)]"
        >
          Go to ResumeIQ
        </Link>
      </div>
    </main>
  );
}
