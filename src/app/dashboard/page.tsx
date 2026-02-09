"use client";

import { useState, useEffect } from "react";

const contentTypes = [
  {
    id: "blog",
    label: "Blog Post",
    icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
    placeholder:
      "Write a blog post about the benefits of remote work for software engineers. Target audience: tech professionals. Include practical tips and examples.",
  },
  {
    id: "social",
    label: "Social Media",
    icon: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z",
    placeholder:
      "Create social media posts announcing our new AI-powered productivity tool. Focus on time-saving benefits. Tone: excited but professional.",
  },
  {
    id: "email",
    label: "Email Campaign",
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    placeholder:
      "Write a welcome email for new SaaS subscribers. Highlight key features, include onboarding steps, and encourage them to try the product.",
  },
  {
    id: "product",
    label: "Product Description",
    icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
    placeholder:
      "Write a product description for wireless noise-canceling headphones. Premium quality, 30-hour battery, perfect for work and travel.",
  },
  {
    id: "ad",
    label: "Ad Copy",
    icon: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z",
    placeholder:
      "Create Google Ads copy for an online course platform. Focus on career advancement and flexible learning. Include multiple headline and description variations.",
  },
];

const tones = [
  "Professional",
  "Casual",
  "Friendly",
  "Authoritative",
  "Humorous",
  "Persuasive",
  "Inspirational",
  "Formal",
];

export default function DashboardPage() {
  const [selectedType, setSelectedType] = useState("blog");
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("Professional");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usage, setUsage] = useState({ today: 0, limit: 5, plan: "free" });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/usage")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setUsage(data);
      });
  }, []);

  const currentType = contentTypes.find((t) => t.id === selectedType)!;

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: selectedType, prompt, tone: tone.toLowerCase() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Generation failed");
        return;
      }

      setResult(data.result);
      setUsage((prev) => ({
        ...prev,
        today: data.usage?.used ?? prev.today + 1,
      }));
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Content Generator</h1>
        <p className="mt-1 text-gray-600">
          Select a content type, describe what you need, and let AI do the writing.
        </p>
      </div>

      {/* Usage bar */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Daily Usage: {usage.today} / {usage.limit >= 999999 ? "Unlimited" : usage.limit}
          </span>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
            usage.plan === "business"
              ? "bg-purple-100 text-purple-700"
              : usage.plan === "pro"
              ? "bg-brand-100 text-brand-700"
              : "bg-gray-100 text-gray-600"
          }`}>
            {usage.plan.charAt(0).toUpperCase() + usage.plan.slice(1)} Plan
          </span>
        </div>
        {usage.limit < 999999 && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-brand-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((usage.today / usage.limit) * 100, 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* Content type selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {contentTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => {
              setSelectedType(type.id);
              setResult("");
            }}
            className={`card !p-4 text-center transition-all cursor-pointer ${
              selectedType === type.id
                ? "!border-brand-600 !bg-brand-50 ring-1 ring-brand-600"
                : "hover:border-gray-300"
            }`}
          >
            <svg
              className={`w-6 h-6 mx-auto mb-2 ${
                selectedType === type.id ? "text-brand-600" : "text-gray-400"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={type.icon} />
            </svg>
            <span
              className={`text-sm font-medium ${
                selectedType === type.id ? "text-brand-700" : "text-gray-600"
              }`}
            >
              {type.label}
            </span>
          </button>
        ))}
      </div>

      {/* Input form */}
      <div className="card mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe what you want to generate
          </label>
          <textarea
            className="input-field min-h-[120px] resize-y"
            placeholder={currentType.placeholder}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
            <select
              className="input-field"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              {tones.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="btn-primary whitespace-nowrap"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Generating...</span>
              </span>
            ) : (
              "Generate Content"
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Generated Content</h2>
            <button
              onClick={handleCopy}
              className="btn-secondary !py-2 !px-4 !text-sm"
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
          </div>
          <div className="prose max-w-none bg-gray-50 rounded-lg p-6 whitespace-pre-wrap text-gray-800 leading-relaxed">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
