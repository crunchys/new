import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_placeholder", {
      apiVersion: "2025-02-24.acacia",
    });
  }
  return _stripe;
}

export function getPriceId(plan: "pro" | "business"): string {
  if (plan === "pro") {
    return process.env.STRIPE_PRO_PRICE_ID || "";
  }
  return process.env.STRIPE_BUSINESS_PRICE_ID || "";
}
