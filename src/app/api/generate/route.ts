import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getPlanLimits } from "@/lib/auth";
import { generateContent, ContentType } from "@/lib/openai";
import { prisma } from "@/lib/db";

const validTypes: ContentType[] = ["blog", "social", "email", "product", "ad"];

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { type, prompt, tone } = await req.json();

    if (!type || !validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 400 }
      );
    }

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Check daily usage limits
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await prisma.generation.count({
      where: {
        userId: user.id,
        createdAt: { gte: today },
      },
    });

    const limit = getPlanLimits(user.plan);
    if (todayCount >= limit) {
      return NextResponse.json(
        {
          error: `Daily limit reached (${limit} generations). Upgrade your plan for more.`,
          limit,
          used: todayCount,
        },
        { status: 429 }
      );
    }

    const result = await generateContent(type, prompt, tone || "professional");

    await prisma.generation.create({
      data: {
        userId: user.id,
        type,
        prompt: prompt.slice(0, 500),
        result,
      },
    });

    return NextResponse.json({
      result,
      usage: { used: todayCount + 1, limit },
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate content. Please try again." },
      { status: 500 }
    );
  }
}
