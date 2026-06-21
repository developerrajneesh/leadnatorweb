"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiArrowRight, FiLock } from "react-icons/fi";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/studio/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/studio/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "That didn't work — please check your email and password.");
      router.push(next.startsWith("/studio") ? next : "/studio/dashboard");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="studio-gate">
      <div className="studio-gate-card studio-login-card">
        <div className="studio-gate-badge"><FiLock /> Sign in</div>
        <h1>Welcome to Leadnator</h1>
        <p>Sign in to manage your blog, track visitors, and view leads from your contact page.</p>

        {error && <div className="studio-error">{error}</div>}

        <form onSubmit={handleSubmit} className="studio-gate-form">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="ln-btn ln-btn-primary ln-btn-lg ln-btn-block" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"} <FiArrowRight />
          </button>
        </form>

        <p className="studio-gate-foot">
          <Link href="/blog">Browse the blog</Link>
          {" · "}
          <Link href="/">Go to main website</Link>
        </p>
      </div>
    </div>
  );
}

export default function StudioLoginPage() {
  return (
    <Suspense fallback={<div className="studio-gate"><div className="studio-gate-card">Loading…</div></div>}>
      <LoginForm />
    </Suspense>
  );
}
