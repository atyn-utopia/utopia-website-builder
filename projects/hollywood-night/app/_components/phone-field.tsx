"use client";

import { useState } from "react";
import { sanitizeDigits } from "@/lib/phone";

type Props = {
  label?: string;
  name: string;
  required?: boolean;
  initial?: string;
  size?: "default" | "compact";
};

export default function PhoneField({
  label = "Phone number",
  name,
  required,
  initial = "",
  size = "default",
}: Props) {
  const [digits, setDigits] = useState(() =>
    sanitizeDigits(initial.replace(/^\+?60/, ""))
  );
  const fullValue = `+60${digits}`;

  function update(raw: string) {
    setDigits(sanitizeDigits(raw).slice(0, 11));
  }

  const padY = size === "compact" ? "py-3" : "py-4";

  return (
    <label className="block">
      {label && (
        <span className="block text-[11px] uppercase tracking-[0.22em] text-gold-500 mb-2">
          {label}
        </span>
      )}
      <div className="flex items-stretch bg-ink-700 border border-ink-600 focus-within:border-gold-500 focus-within:ring-1 focus-within:ring-gold-500/40 transition-[transform,opacity] duration-150">
        <span className="flex items-center justify-center px-4 text-gold-300 font-mono text-sm border-r border-ink-600 bg-ink-800 select-none">
          +60
        </span>
        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="tel-national"
          required={required}
          placeholder="12 345 6789"
          value={digits}
          onChange={(e) => update(e.target.value)}
          className={`flex-1 bg-transparent text-ivory placeholder-ivory/30 px-4 ${padY} outline-none font-mono`}
        />
      </div>
      <input type="hidden" name={name} value={fullValue} />
    </label>
  );
}
