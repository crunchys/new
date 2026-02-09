import OpenAI from "openai";

let _openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

export type ContentType = "blog" | "social" | "email" | "product" | "ad";

const systemPrompts: Record<ContentType, string> = {
  blog: `You are an expert blog writer. Write engaging, well-structured blog posts with clear headings,
compelling introductions, and actionable conclusions. Use a professional but approachable tone.
Format the output in Markdown.`,

  social: `You are a social media expert. Create engaging, attention-grabbing social media posts
optimized for maximum engagement. Include relevant hashtag suggestions. Keep posts concise and impactful.
Provide variations for different platforms (Twitter/X, LinkedIn, Instagram).`,

  email: `You are an email marketing specialist. Write compelling email copy with attention-grabbing
subject lines, engaging body content, and clear calls-to-action. Include a subject line suggestion
at the top of each email.`,

  product: `You are a product copywriter. Write persuasive product descriptions that highlight benefits,
address pain points, and drive conversions. Use sensory language and create urgency where appropriate.
Include bullet points for key features.`,

  ad: `You are an advertising copywriter. Create compelling ad copy that grabs attention, communicates
value propositions clearly, and drives clicks. Provide multiple variations of headlines and descriptions
suitable for Google Ads, Facebook Ads, etc.`,
};

export async function generateContent(
  type: ContentType,
  userPrompt: string,
  tone: string = "professional"
): Promise<string> {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `${systemPrompts[type]}\n\nTone: ${tone}. Write in the same language as the user's prompt.`,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    max_tokens: 2000,
    temperature: 0.8,
  });

  return response.choices[0]?.message?.content || "Failed to generate content.";
}
