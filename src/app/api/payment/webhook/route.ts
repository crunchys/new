import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// YooKassa webhook handler
// Docs: https://yookassa.ru/developers/using-api/webhooks
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Verify this is a payment.succeeded event
    if (body.event !== "payment.succeeded") {
      return NextResponse.json({ received: true });
    }

    const payment = body.object;
    if (!payment || payment.status !== "succeeded") {
      return NextResponse.json({ received: true });
    }

    const userId = payment.metadata?.userId;
    const plan = payment.metadata?.plan;

    if (!userId || !plan) {
      console.error("Webhook missing metadata:", payment.id);
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    // Activate plan for 30 days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await prisma.user.update({
      where: { id: userId },
      data: {
        plan,
        planExpiresAt: expiresAt,
      },
    });

    console.log(`Plan activated: user=${userId} plan=${plan} expires=${expiresAt.toISOString()}`);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
