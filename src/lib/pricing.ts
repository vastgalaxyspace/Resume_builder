export type PaidPlanId = "pro" | "career";
export type PlanId = "free" | PaidPlanId;

export type PricingPlan = {
  id: PlanId;
  name: string;
  description: string;
  priceLabel: string;
  interval?: "month";
  checkout: boolean;
  featured?: boolean;
  unitAmount?: number;
  features: string[];
};

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Starter",
    description: "Try the core resume analysis flow.",
    priceLabel: "$0",
    checkout: false,
    features: ["Basic resume scan", "Target role matching", "ATS keyword overview"],
  },
  {
    id: "pro",
    name: "Pro",
    description: "Improve one resume for active job applications.",
    priceLabel: "$9",
    interval: "month",
    checkout: true,
    featured: true,
    unitAmount: 900,
    features: [
      "Unlimited resume analyses",
      "Market-backed keyword gaps",
      "Bullet rewrite suggestions",
      "Priority improvement plan",
    ],
  },
  {
    id: "career",
    name: "Career",
    description: "Deeper support for serious interview pipelines.",
    priceLabel: "$19",
    interval: "month",
    checkout: true,
    unitAmount: 1900,
    features: [
      "Everything in Pro",
      "Multiple role comparisons",
      "Advanced recruiter reasoning",
      "Priority support",
    ],
  },
];

export function getPaidPlan(planId: string): PricingPlan | undefined {
  return pricingPlans.find((plan) => plan.id === planId && plan.checkout);
}
