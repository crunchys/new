import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CopySnap - AI Copywriting That Converts",
  description:
    "Generate high-converting blog posts, social media content, emails, product descriptions, and ad copy in seconds with AI.",
  keywords: "AI copywriting, content generation, blog writer, social media, email marketing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
