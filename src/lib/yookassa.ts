// YooKassa API client
// Docs: https://yookassa.ru/developers/api

const YOOKASSA_API_URL = "https://api.yookassa.ru/v3";

function getAuthHeader(): string {
  const shopId = process.env.YOOKASSA_SHOP_ID || "";
  const secretKey = process.env.YOOKASSA_SECRET_KEY || "";
  return "Basic " + Buffer.from(`${shopId}:${secretKey}`).toString("base64");
}

export interface YooKassaPayment {
  id: string;
  status: "pending" | "waiting_for_capture" | "succeeded" | "canceled";
  amount: { value: string; currency: string };
  confirmation?: { type: string; confirmation_url: string };
  metadata?: Record<string, string>;
}

export const PLAN_PRICES = {
  pro: { value: "990.00", currency: "RUB", label: "990" },
  business: { value: "2490.00", currency: "RUB", label: "2 490" },
} as const;

export async function createPayment(options: {
  plan: "pro" | "business";
  userId: string;
  returnUrl: string;
}): Promise<YooKassaPayment> {
  const price = PLAN_PRICES[options.plan];

  const res = await fetch(`${YOOKASSA_API_URL}/payments`, {
    method: "POST",
    headers: {
      Authorization: getAuthHeader(),
      "Idempotence-Key": crypto.randomUUID(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: { value: price.value, currency: price.currency },
      capture: true,
      confirmation: {
        type: "redirect",
        return_url: options.returnUrl,
      },
      description: `CopySnap ${options.plan === "pro" ? "Pro" : "Business"} Plan — 30 days`,
      metadata: {
        userId: options.userId,
        plan: options.plan,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("YooKassa create payment error:", err);
    throw new Error("Failed to create payment");
  }

  return res.json();
}
