"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? "");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block">
        <span className="block text-[11px] uppercase tracking-[0.22em] text-gold-500 mb-2">
          Password
        </span>
        <input
          name="password"
          type="password"
          required
          autoFocus
          className="w-full bg-ink-700 border border-ink-600 text-ivory placeholder-ivory/30 px-5 py-4 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/40 outline-none"
        />
      </label>
      {error && <p className="text-error-crimson text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-grad-gold text-ink-black font-medium tracking-[0.14em] uppercase text-xs px-8 py-4 border border-gold-300/40 shadow-gold transition-[transform,opacity] duration-200 hover:-translate-y-px hover:brightness-110 active:translate-y-px disabled:opacity-50"
      >
        {loading ? "Verifying…" : "Enter"}
      </button>
    </form>
  );
}
