"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
  plan: string;
  planExpiresAt: string | null;
};

const plans = [
  {
    id: "free",
    name: "Free",
    price: "0 \u20BD",
    period: "forever",
    features: ["5 generations per day", "All content types", "Basic tone control"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "990 \u20BD",
    period: "/month",
    features: [
      "100 generations per day",
      "All content types",
      "Advanced tone control",
      "Generation history",
      "Priority support",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: "2 490 \u20BD",
    period: "/month",
    features: [
      "Unlimited generations",
      "All content types",
      "Advanced tone control",
      "Full history",
      "Priority support",
      "API access (coming soon)",
    ],
  },
];

export default function BillingPage() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (searchParams.get("success")) {
      setMessage("Payment received! Your plan will be activated shortly.");
    } else if (searchParams.get("canceled")) {
      setMessage("Payment was canceled. No changes were made.");
    }

    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) setUser(data.user);
      });
  }, [searchParams]);

  async function handleSubscribe(plan: "pro" | "business") {
    setLoading(plan);
    try {
      const res = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage(data.error || "Failed to start checkout");
      }
    } catch {
      setMessage("Something went wrong.");
    } finally {
      setLoading(null);
    }
  }

  if (!user) return null;

  const expiresAt = user.planExpiresAt ? new Date(user.planExpiresAt) : null;
  const daysLeft = expiresAt
    ? Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Plans</h1>
        <p className="mt-1 text-gray-600">Manage your subscription and billing details.</p>
      </div>

      {message && (
        <div
          className={`mb-6 px-4 py-3 rounded-lg text-sm ${
            message.includes("received") || message.includes("activated")
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-yellow-50 border border-yellow-200 text-yellow-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Current plan */}
      <div className="card mb-8">
        <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
        <p className="text-gray-600 mt-1">
          You are on the{" "}
          <span className="font-medium text-gray-900">
            {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
          </span>{" "}
          plan.
        </p>
        {user.plan !== "free" && daysLeft !== null && (
          <p className="text-sm text-gray-500 mt-2">
            {daysLeft > 0
              ? `Expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"} (${expiresAt!.toLocaleDateString()})`
              : "Expired — renew to keep your plan"}
          </p>
        )}
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = user.plan === plan.id;
          const canBuy = plan.id !== "free";
          const isRenew = isCurrent && plan.id !== "free";

          return (
            <div
              key={plan.id}
              className={`card ${isCurrent ? "!border-brand-600 !border-2 ring-1 ring-brand-600" : ""}`}
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {isCurrent && plan.id === "free" ? (
                <div className="text-center text-sm font-medium text-brand-600 py-2">
                  Current Plan
                </div>
              ) : isRenew ? (
                <button
                  onClick={() => handleSubscribe(plan.id as "pro" | "business")}
                  disabled={loading === plan.id}
                  className="btn-primary w-full !text-sm"
                >
                  {loading === plan.id ? "Loading..." : "Renew for 30 days"}
                </button>
              ) : canBuy ? (
                <button
                  onClick={() => handleSubscribe(plan.id as "pro" | "business")}
                  disabled={loading === plan.id}
                  className="btn-primary w-full !text-sm"
                >
                  {loading === plan.id ? "Loading..." : `Upgrade to ${plan.name}`}
                </button>
              ) : (
                <div className="text-center text-sm text-gray-400 py-2">-</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
