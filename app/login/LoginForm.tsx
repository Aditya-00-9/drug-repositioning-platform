"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import MedicalDisclaimer from "@/app/components/MedicalDisclaimer";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/admin/review";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setError("Invalid credentials");
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-navy-900 via-black to-black px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800/80 bg-slate-950/60 p-8">
        <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-teal-300/90">
          Reviewer access
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-50">Sign in</h1>
        <p className="mt-2 text-sm text-slate-400">
          Scientific and medical reviewers only. Research platform access.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100"
              required
            />
          </div>
          <div>
            <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100"
              required
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-teal-500/20 py-2 text-[11px] font-mono uppercase tracking-[0.2em] text-teal-300 ring-1 ring-teal-500/30 hover:bg-teal-500/30 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <MedicalDisclaimer className="mt-6" />
        <Link
          href="/"
          className="mt-4 block text-center text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500 hover:text-teal-300"
        >
          ← Back to platform
        </Link>
      </div>
    </main>
  );
}
