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

export default function RsvpForm({
  variant = "staff",
}: {
  variant?: "staff" | "vip";
}) {
  const router = useRouter();
  const isVip = variant === "vip";
  const [attending, setAttending] = useState(true);
  const [hasPlusOne, setHasPlusOne] = useState(false);
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
    if (!name || !email || (!isVip && !companyName)) {
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
      companyName: isVip ? "" : companyName,
      attending,
      hasPlusOne,
      plusOneName,
      plusOnePhone,
      transportationRequired: false,
      rsvpType: isVip ? "vip" : "staff",
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
        router.push(
          `/retrieve?phone=${encodeURIComponent(phone)}&welcome=1${
            isVip ? "&from=vip" : ""
          }`
        );
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
      <div className="glass p-10 text-center rise-in">
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
      className="glass p-8 md:p-10 space-y-7"
      noValidate
    >
      <Field label="Full name" name="name" required autoComplete="name" />
      <div className="grid md:grid-cols-2 gap-6">
        <PhoneField
          label="Phone number"
          name="phone"
          required
          hint="Please double-check — this number is your key to your ticket and entry."
        />
        <Field
          label="Email address"
          name="email"
          required
          type="email"
          autoComplete="email"
        />
      </div>

      {!isVip && (
        <label className="block">
          <span className="block text-[11px] uppercase tracking-[0.22em] text-gold-500 mb-2">
            Company
          </span>
          <select
            name="companyName"
            required
            defaultValue=""
            className="field-line w-full text-ivory px-0 py-3 outline-none appearance-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' stroke='%23D4AF37' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.25rem center",
              paddingRight: "2rem",
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
      )}

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

      <div className="flex flex-col items-center gap-3 pt-1">
        <p className="text-center text-ivory-faint text-xs leading-relaxed">
          Each phone number can register once. Having trouble?
        </p>
        <a
          href="https://wa.me/60174287801?text=Hi%2C%20I%20need%20help%20with%20my%20Hollywood%20Night%20RSVP."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1EBE57] text-white px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
            aria-hidden
          >
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15c-1.53 0-3.03-.41-4.34-1.19l-.31-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.24-8.23 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43-.14-.01-.31-.01-.47-.01-.16 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.25 3.74.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z" />
          </svg>
          Ask for Help
        </a>
      </div>
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
        className="field-line w-full text-ivory placeholder-ivory/25 px-0 py-3 outline-none"
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
    <div className="flex items-center justify-between gap-6 border-t border-gold-500/15 pt-5">
      <span className="text-ivory-dim text-sm">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative h-7 w-12 rounded-full border transition-[transform,opacity] duration-200 ${
          value
            ? "bg-gold-600 border-gold-400"
            : "bg-white/5 border-gold-500/25"
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
                  : "bg-white/5 border-gold-500/20 text-ivory-dim hover:border-gold-500/45"
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
