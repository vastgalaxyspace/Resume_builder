"use client";

import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { PricingPlan, pricingPlans } from "@/lib/pricing";

export function PricingPlans() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function startCheckout(plan: PricingPlan) {
    if (!plan.checkout) return;

    setError("");
    setLoadingPlan(plan.id);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id }),
      });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Could not start checkout.");
      }

      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout.");
      setLoadingPlan(null);
    }
  }

  return (
    <div>
      {error && (
        <div className="mx-auto mb-6 max-w-2xl rounded-lg border border-[#EF4444]/40 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {pricingPlans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-lg border p-5 ${
              plan.featured
                ? "border-[#4F8EF7] bg-[rgba(79,142,247,0.08)] shadow-[0_0_30px_rgba(79,142,247,0.12)]"
                : "border-[#1E1E2E] bg-[rgba(255,255,255,0.03)]"
            }`}
          >
            <div className="flex min-h-[112px] flex-col">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl text-[#F0F0F5]">{plan.name}</h2>
                {plan.featured && (
                  <span className="rounded-full border border-[#4F8EF7]/40 bg-[#4F8EF7]/10 px-2.5 py-1 text-xs text-[#8DB8FF]">
                    Popular
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-[#8888A0]">{plan.description}</p>
            </div>

            <div className="mt-6 flex items-end gap-1">
              <span className="text-4xl font-medium text-[#F0F0F5]">{plan.priceLabel}</span>
              {plan.interval && <span className="pb-1 text-sm text-[#8888A0]">/{plan.interval}</span>}
            </div>

            {plan.checkout ? (
              <button
                type="button"
                onClick={() => startCheckout(plan)}
                disabled={loadingPlan !== null}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm text-[#F0F0F5] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70 ${
                  plan.featured
                    ? "bg-gradient-to-r from-[#4F8EF7] to-[#7C5CFC] hover:shadow-[0_0_24px_rgba(79,142,247,0.28)]"
                    : "border border-[#1E1E2E] bg-[#111118] hover:border-[#4F8EF7]"
                }`}
              >
                {loadingPlan === plan.id && <Loader2 size={16} className="animate-spin" />}
                {loadingPlan === plan.id ? "Opening checkout" : "Choose plan"}
              </button>
            ) : (
              <Link
                href="/"
                className="mt-6 flex w-full items-center justify-center rounded-lg border border-[#1E1E2E] bg-[#111118] px-4 py-3 text-sm text-[#F0F0F5] transition-all duration-200 hover:border-[#4F8EF7]"
              >
                Start free
              </Link>
            )}

            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2 text-sm text-[#C9C9D6]">
                  <Check size={16} className="mt-0.5 shrink-0 text-[#22C55E]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
