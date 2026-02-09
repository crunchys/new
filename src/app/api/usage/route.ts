import { NextResponse } from "next/server";
import { getCurrentUser, getPlanLimits } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayCount = await prisma.generation.count({
    where: {
      userId: user.id,
      createdAt: { gte: today },
    },
  });

  const totalCount = await prisma.generation.count({
    where: { userId: user.id },
  });

  const limit = getPlanLimits(user.plan);

  return NextResponse.json({
    today: todayCount,
    total: totalCount,
    limit,
    plan: user.plan,
  });
}
