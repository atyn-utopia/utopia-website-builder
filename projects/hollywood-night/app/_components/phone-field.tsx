"use client";

import { useState } from "react";
import { sanitizeDigits } from "@/lib/phone";

type Props = {
  label?: string;
  name: string;
  required?: boolean;
  initial?: string;
  size?: "default" | "compact";
  hint?: string;
};

export default function PhoneField({
  label = "Phone number",
  name,
  required,
  initial = "",
  hint,
}: Props) {
  const [digits, setDigits] = useState(() =>
    sanitizeDigits(initial.replace(/^\+?60/, ""))
  );
  const fullValue = `+60${digits}`;

  function update(raw: string) {
    setDigits(sanitizeDigits(raw).slice(0, 11));
  }

  const padY = "py-3";

  return (
    <label className="block">
      {label && (
        <span className="block text-[11px] uppercase tracking-[0.22em] text-gold-500 mb-2">
          {label}
        </span>
      )}
      <div className="flex items-stretch border-0 border-b border-gold-500/30 focus-within:border-gold-400 transition-colors duration-200">
        <span className="flex items-center pr-3 mr-3 text-gold-300 font-mono text-sm border-r border-gold-500/25 select-none">
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
          className={`flex-1 bg-transparent text-ivory placeholder-ivory/25 px-0 ${padY} outline-none font-mono`}
        />
      </div>
      {hint && (
        <span className="block mt-2 text-[11px] leading-snug text-gold-300/80">
          {hint}
        </span>
      )}
      <input type="hidden" name={name} value={fullValue} />
    </label>
  );
}
