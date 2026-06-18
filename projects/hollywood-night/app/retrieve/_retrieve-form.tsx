"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toPng } from "html-to-image";
import PhoneField from "../_components/phone-field";
import AddToCalendar from "../_components/add-to-calendar";
import { isValidMyPhone } from "@/lib/phone";

type Ticket = {
  ticketId: string;
  holderName: string;
  kind: "main" | "plus_one";
  checkedIn: boolean;
  luckyNumber: number | null;
  guestName: string;
  qr: string;
};

export default function RetrieveForm() {
  const params = useSearchParams();
  const initialPhone = params.get("phone") ?? "";
  const welcome = params.get("welcome") === "1";
  const autoRanRef = useRef(false);
  const lastPhoneRef = useRef<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const runLookup = useCallback(async (phone: string, silent = false) => {
    if (!silent) {
      setLoading(true);
      setError(null);
      setTickets(null);
    }
    lastPhoneRef.current = phone;
    try {
      const res = await fetch("/api/retrieve", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (!silent) setError(data.error ?? "Lookup failed");
      } else {
        setTickets(data.tickets ?? []);
        setSearched(true);
        // Only collapse the search form on an explicit (user-initiated) lookup,
        // never on the background poll, otherwise it keeps snapping shut.
        if (!silent && data.tickets?.length) setSearchOpen(false);
      }
    } catch {
      if (!silent) setError("Network error");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoRanRef.current) return;
    if (initialPhone) {
      autoRanRef.current = true;
      runLookup(initialPhone);
    } else {
      setSearchOpen(true);
    }
  }, [initialPhone, runLookup]);

  useEffect(() => {
    if (!searched) return;
    const id = setInterval(() => {
      const phone = lastPhoneRef.current;
      if (phone) runLookup(phone, true);
    }, 3000);
    return () => clearInterval(id);
  }, [searched, runLookup]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const phone = String(form.get("phone") ?? "").trim();
    if (!isValidMyPhone(phone)) {
      setError("Please enter a valid Malaysian phone number, e.g. +60123456789.");
      return;
    }
    setError(null);
    await runLookup(phone);
  }

  const hasTickets = tickets && tickets.length > 0;

  return (
    <>
      {welcome && hasTickets && (
        <div className="mb-10 border border-gold-500/50 bg-gradient-to-b from-gold-500/10 to-transparent p-6 md:p-8 text-center rise-in">
          <p className="text-[10px] uppercase tracking-[0.32em] text-gold-500 mb-3">
            ◆ RSVP Confirmed
          </p>
          <h2 className="font-display italic text-2xl md:text-5xl text-champagne leading-tight">
            You&apos;re on the list.
          </h2>
          <p className="text-ivory-dim text-sm md:text-base mt-3 leading-relaxed">
            Your ticket{tickets.length > 1 ? "s are" : " is"} below. A copy
            has also been sent to your email.
          </p>
          <div className="mt-6">
            <AddToCalendar />
          </div>
        </div>
      )}

      {hasTickets && (
        <div className="space-y-6 rise-in text-left">
          {tickets.map((t) => (
            <TicketCard key={t.ticketId} ticket={t} />
          ))}
        </div>
      )}

      {searched && !hasTickets && (
        <p className="text-ivory-dim rise-in text-center">
          No tickets found for this phone number.
        </p>
      )}

      <div className="mt-10 text-center">
        {!searchOpen ? (
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="text-[10px] uppercase tracking-[0.28em] text-ivory-faint hover:text-gold-400 transition-[transform,opacity] duration-200"
          >
            ◆ Look up a different phone number
          </button>
        ) : (
          <form onSubmit={onSubmit} className="max-w-md mx-auto text-left rise-in">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-[0.22em] text-gold-500">
                Find ticket by phone
              </span>
              {hasTickets && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setError(null);
                  }}
                  className="text-[10px] uppercase tracking-[0.22em] text-ivory-faint hover:text-gold-400 transition-[transform,opacity] duration-200"
                >
                  Close
                </button>
              )}
            </div>
            <PhoneField
              name="phone"
              label=""
              required
              initial={initialPhone}
              size="compact"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-grad-gold text-ink-black font-medium tracking-[0.12em] uppercase text-xs px-6 py-3 border border-gold-300/40 shadow-gold transition-[transform,opacity,filter] duration-200 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-px disabled:opacity-50"
            >
              {loading ? "Searching…" : "Show My Ticket"}
            </button>
            {error && (
              <p className="text-error-crimson text-sm mt-3 text-center">
                {error}
              </p>
            )}
          </form>
        )}
      </div>
    </>
  );
}

function shortenName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 2) return parts.join(" ");
  const [first, second, ...rest] = parts;
  const initials = rest
    .map((p) => p[0]?.toUpperCase() + ".")
    .filter(Boolean)
    .join(" ");
  return `${first} ${second} ${initials}`;
}

function TicketCard({ ticket }: { ticket: Ticket }) {
  const displayName = shortenName(ticket.holderName);
  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);

  async function saveAsImage() {
    const node =
      (window.matchMedia("(min-width: 768px)").matches
        ? desktopRef.current
        : mobileRef.current) ?? desktopRef.current ?? mobileRef.current;
    if (!node) return;
    setSaving(true);
    try {
      const dataUrl = await toPng(node, {
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: "#0b0b0f",
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `hollywood-night-ticket-${ticket.ticketId}.png`;
      a.click();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {/* Desktop: two-image split layout. Left half is pure branding, right half
          has an empty top region where we overlay the guest name + QR. Everything
          scales cleanly because each half owns its own box. */}
      <div
        ref={desktopRef}
        className="hidden md:block relative w-full shadow-ticket overflow-hidden"
        style={{
          aspectRatio: "7543 / 2734",
          containerType: "inline-size",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/ticket.png"
          alt="Hollywood Red Carpet — Admit One ticket"
          className="absolute inset-0 w-full h-full object-cover block"
        />
        {/* name + QR panel overlaid on the right of the ticket */}
        <div
          className="absolute flex flex-col items-center justify-center text-center"
          style={{
            top: "9%",
            bottom: "9%",
            right: "11%",
            width: "27%",
          }}
        >
          <p
            className="uppercase text-gold-400"
            style={{
              fontSize: "0.7cqw",
              letterSpacing: "0.26em",
              marginBottom: "0.25cqw",
              textShadow: "0 2px 12px rgba(0,0,0,0.95)",
            }}
          >
            {ticket.kind === "plus_one" ? "Plus One" : "Main Guest"}
          </p>
          <h3
            className="font-display text-champagne leading-tight"
            style={{
              fontSize: "1.5cqw",
              marginBottom: "0.5cqw",
              maxWidth: "100%",
              textShadow: "0 2px 16px rgba(0,0,0,0.95)",
            }}
          >
            {displayName}
          </h3>

          {ticket.checkedIn && typeof ticket.luckyNumber === "number" ? (
            <div className="rise-in flex flex-col items-center">
              <p
                className="uppercase text-gold-500"
                style={{
                  fontSize: "0.75cqw",
                  letterSpacing: "0.28em",
                  marginBottom: "0.4cqw",
                  textShadow: "0 2px 12px rgba(0,0,0,0.95)",
                }}
              >
                Lucky Number
              </p>
              <div
                className="bg-ink-black/80 backdrop-blur-sm border-2 border-gold-500"
                style={{ padding: "0.9cqw 1.6cqw" }}
              >
                <p
                  className="font-mono font-black text-gold-300 tabular-nums leading-none"
                  style={{ fontSize: "3cqw" }}
                >
                  {String(ticket.luckyNumber).padStart(3, "0")}
                </p>
              </div>
              <p
                className="uppercase text-success-emerald border border-success-emerald"
                style={{
                  fontSize: "0.7cqw",
                  letterSpacing: "0.22em",
                  marginTop: "0.6cqw",
                  padding: "0.15cqw 0.6cqw",
                }}
              >
                ✓ Admitted
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div
                className="bg-white border border-gold-500 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.9)]"
                style={{ padding: "0.6cqw", marginTop: "3px" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ticket.qr}
                  alt="Ticket QR"
                  className="block"
                  style={{ width: "12cqw", height: "12cqw" }}
                />
              </div>
              <p
                className="font-mono text-gold-300 tracking-wider"
                style={{
                  fontSize: "0.8cqw",
                  marginTop: "0.6cqw",
                  textShadow: "0 2px 12px rgba(0,0,0,0.95)",
                }}
              >
                {ticket.ticketId}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: stacked vertical card over the ticket-mobile background */}
      <div
        ref={mobileRef}
        className="md:hidden relative w-full border border-gold-500 shadow-ticket overflow-hidden bg-ink-black"
        style={{
          aspectRatio: "6890 / 8906",
          backgroundImage: "url(/ticket-mobile.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-x-0 top-0 flex flex-col items-center justify-center text-center px-6"
          style={{ height: "41%" }}
        >
          <p
            className="uppercase text-gold-400 mb-1 text-[9px] tracking-[0.26em]"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.95)" }}
          >
            {ticket.kind === "plus_one" ? "Plus One" : "Main Guest"}
          </p>
          <h3
            className="font-display text-2xl text-champagne leading-tight mb-2"
            style={{ textShadow: "0 2px 14px rgba(0,0,0,0.95)" }}
          >
            {ticket.holderName}
          </h3>

          {ticket.checkedIn && typeof ticket.luckyNumber === "number" ? (
            <div className="rise-in flex flex-col items-center">
              <div className="bg-ink-black/80 border-2 border-gold-500 px-6 py-3">
                <p className="font-mono font-black text-4xl text-gold-300 tabular-nums leading-none">
                  {String(ticket.luckyNumber).padStart(3, "0")}
                </p>
              </div>
              <p
                className="mt-2 uppercase text-success-emerald text-[9px] tracking-[0.22em]"
                style={{ textShadow: "0 2px 10px rgba(0,0,0,0.95)" }}
              >
                ✓ Admitted
              </p>
            </div>
          ) : (
            <>
              <div className="bg-white p-2 border border-gold-500">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ticket.qr} alt="Ticket QR" className="w-24 h-24" />
              </div>
              <p
                className="mt-1.5 font-mono text-gold-300 text-[9px] tracking-wider"
                style={{ textShadow: "0 2px 10px rgba(0,0,0,0.95)" }}
              >
                {ticket.ticketId}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={saveAsImage}
          disabled={saving}
          className="inline-flex items-center gap-2 border border-gold-500/60 text-gold-300 hover:text-gold-200 hover:border-gold-400 uppercase tracking-[0.22em] text-[10px] px-5 py-3 transition-[transform,opacity,filter] duration-200 hover:-translate-y-0.5 disabled:opacity-50"
        >
          {saving ? "Preparing…" : "◆ Save Ticket as Image"}
        </button>
      </div>
    </>
  );
}
