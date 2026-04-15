"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { COMPANIES } from "@/lib/companies";
import { isValidMyPhone } from "@/lib/phone";
import LoadingScreen from "./loading-screen";
import PhoneField from "./phone-field";

type SubmitResult =
  | { ok: true; attending: boolean; ticketCount?: number; emailSent?: boolean }
  | { ok: false; error: string };

export default function RsvpForm() {
  const router = useRouter();
  const [attending, setAttending] = useState(true);
  const [hasPlusOne, setHasPlusOne] = useState(false);
  const [transport, setTransport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const form = new FormData(e.currentTarget);
    const phone = String(form.get("phone") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const name = String(form.get("name") ?? "").trim();
    const companyName = String(form.get("companyName") ?? "");
    const plusOneName = hasPlusOne
      ? String(form.get("plusOneName") ?? "").trim()
      : null;
    const plusOnePhone = hasPlusOne
      ? String(form.get("plusOnePhone") ?? "").trim()
      : null;

    // Client-side required checks
    if (!name || !email || !companyName) {
      setResult({ ok: false, error: "Please fill all fields." });
      setLoading(false);
      return;
    }
    if (!isValidMyPhone(phone)) {
      setResult({
        ok: false,
        error: "Phone number must be a valid Malaysian number, e.g. +60123456789.",
      });
      setLoading(false);
      return;
    }
    if (attending && hasPlusOne) {
      if (!plusOneName) {
        setResult({ ok: false, error: "Please enter your plus one's name." });
        setLoading(false);
        return;
      }
      if (!plusOnePhone || !isValidMyPhone(plusOnePhone)) {
        setResult({
          ok: false,
          error: "Please enter a valid Malaysian phone for your plus one.",
        });
        setLoading(false);
        return;
      }
    }

    const payload = {
      name,
      phone,
      email,
      companyName,
      attending,
      hasPlusOne,
      plusOneName,
      plusOnePhone,
      transportationRequired: transport,
    };

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setResult({ ok: false, error: data.error ?? "Something went wrong" });
        setLoading(false);
        return;
      }
      if (data.attending) {
        router.push(`/retrieve?phone=${encodeURIComponent(phone)}&welcome=1`);
        return;
      }
      setResult({ ok: true, attending: false });
    } catch {
      setResult({ ok: false, error: "Network error" });
    } finally {
      setLoading(false);
    }
  }

  if (result?.ok && !result.attending) {
    return (
      <div className="bg-ink-800 border border-gold-500/30 shadow-card p-10 text-center rise-in">
        <p className="text-[11px] uppercase tracking-[0.28em] text-gold-500 mb-4">
          ◆ Noted
        </p>
        <h3 className="font-display text-4xl text-champagne mb-4">
          We&apos;ll miss you.
        </h3>
        <p className="text-ivory-dim leading-relaxed">
          Thanks for letting us know.
        </p>
      </div>
    );
  }

  return (
    <>
      {loading && <LoadingScreen label="Sending your invitation" />}
    <form
      onSubmit={onSubmit}
      className="bg-ink-800 border border-gold-500/20 shadow-card p-8 md:p-10 space-y-6"
      noValidate
    >
      <Field label="Full name" name="name" required autoComplete="name" />
      <div className="grid md:grid-cols-2 gap-6">
        <PhoneField label="Phone number" name="phone" required />
        <Field
          label="Email address"
          name="email"
          required
          type="email"
          autoComplete="email"
        />
      </div>

      <label className="block">
        <span className="block text-[11px] uppercase tracking-[0.22em] text-gold-500 mb-2">
          Company
        </span>
        <select
          name="companyName"
          required
          defaultValue=""
          className="w-full bg-ink-700 border border-ink-600 text-ivory px-5 py-4 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/40 outline-none appearance-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' stroke='%23D4AF37' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 1.25rem center",
            paddingRight: "3rem",
          }}
        >
          <option value="" disabled>
            Select your company…
          </option>
          {COMPANIES.map((c) => (
            <option key={c} value={c} className="bg-ink-800 text-ivory">
              {c}
            </option>
          ))}
        </select>
      </label>

      <Segmented
        label="Will you be attending?"
        options={[
          { value: "yes", label: "Attending" },
          { value: "no", label: "Not Attending" },
        ]}
        value={attending ? "yes" : "no"}
        onChange={(v) => setAttending(v === "yes")}
      />

      {attending && (
        <>
          <Toggle
            label="Bringing a plus one?"
            value={hasPlusOne}
            onChange={setHasPlusOne}
          />

          {hasPlusOne && (
            <div className="grid md:grid-cols-2 gap-6 rise-in">
              <Field label="Plus one name" name="plusOneName" required />
              <PhoneField
                label="Plus one phone"
                name="plusOnePhone"
                required
              />
            </div>
          )}

          <Toggle
            label="Need transportation to the venue?"
            value={transport}
            onChange={setTransport}
          />
        </>
      )}

      {result?.ok === false && (
        <p className="text-error-crimson text-sm">{result.error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-grad-gold text-ink-black font-medium tracking-[0.22em] uppercase text-sm px-10 py-5 border border-gold-300/50 shadow-gold transition-[transform,opacity,filter] duration-300 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-black"
      >
        {loading ? "Sending invitation" : "Confirm RSVP"}
      </button>
    </form>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-[0.22em] text-gold-500 mb-2">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full bg-ink-700 border border-ink-600 text-ivory placeholder-ivory/30 px-5 py-4 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/40 outline-none transition-[transform,opacity] duration-150"
      />
    </label>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-t border-ink-600 pt-5">
      <span className="text-ivory-dim text-sm">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative h-7 w-12 rounded-full border transition-[transform,opacity] duration-200 ${
          value
            ? "bg-gold-600 border-gold-400"
            : "bg-ink-700 border-ink-600"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-gold-400 shadow-gold transition-[transform,opacity] duration-200 ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function Segmented({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <span className="block text-[11px] uppercase tracking-[0.22em] text-gold-500 mb-2">
        {label}
      </span>
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              type="button"
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`px-4 py-3 text-sm uppercase tracking-[0.12em] border transition-[transform,opacity] duration-200 ${
                active
                  ? "bg-gold-500/10 border-gold-500 text-gold-300"
                  : "bg-ink-700 border-ink-600 text-ivory-dim hover:border-gold-500/40"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
