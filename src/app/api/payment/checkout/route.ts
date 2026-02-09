import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createPayment } from "@/lib/yookassa";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { plan } = await req.json();
    if (plan !== "pro" && plan !== "business") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    if (!process.env.YOOKASSA_SHOP_ID || !process.env.YOOKASSA_SECRET_KEY) {
      return NextResponse.json(
        { error: "Payment system not configured" },
        { status: 500 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const payment = await createPayment({
      plan,
      userId: user.id,
      returnUrl: `${appUrl}/dashboard/billing?success=true`,
    });

    if (!payment.confirmation?.confirmation_url) {
      return NextResponse.json(
        { error: "Failed to create payment" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: payment.confirmation.confirmation_url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
