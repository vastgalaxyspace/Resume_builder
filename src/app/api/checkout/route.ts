import { NextRequest, NextResponse } from "next/server";

import { getPaidPlan } from "@/lib/pricing";

export const runtime = "nodejs";

const STRIPE_CHECKOUT_SESSIONS_URL = "https://api.stripe.com/v1/checkout/sessions";

export async function POST(request: NextRequest) {
  try {
    const { planId } = (await request.json()) as { planId?: string };
    const plan = getPaidPlan(String(planId ?? ""));

    if (!plan || !plan.unitAmount || !plan.interval) {
      return NextResponse.json({ error: "Invalid pricing plan selected." }, { status: 400 });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Stripe is not configured. Add STRIPE_SECRET_KEY to your environment." },
        { status: 500 }
      );
    }

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || request.nextUrl.origin;

    const params = new URLSearchParams({
      mode: "subscription",
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?checkout=cancelled`,
      "line_items[0][quantity]": "1",
      "line_items[0][price_data][currency]": "usd",
      "line_items[0][price_data][unit_amount]": String(plan.unitAmount),
      "line_items[0][price_data][recurring][interval]": plan.interval,
      "line_items[0][price_data][product_data][name]": `ResumeIQ ${plan.name}`,
      "line_items[0][price_data][product_data][description]": plan.description,
      "metadata[planId]": plan.id,
    });

    const response = await fetch(STRIPE_CHECKOUT_SESSIONS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = (await response.json()) as { url?: string; error?: { message?: string } };

    if (!response.ok || !data.url) {
      return NextResponse.json(
        { error: data.error?.message ?? "Could not create Stripe Checkout session." },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json({ url: data.url });
  } catch (error) {
    console.error("[/api/checkout] Error:", error);
    return NextResponse.json({ error: "Unable to start checkout." }, { status: 500 });
  }
}
