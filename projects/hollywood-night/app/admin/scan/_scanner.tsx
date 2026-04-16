"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

type ScanOutcome = {
  ok: boolean;
  status: "checked_in" | "already_used" | "not_found" | "race" | "error";
  message: string;
  ticket?: {
    ticketId: string;
    holderName: string;
    kind: "main" | "plus_one";
    checkedInAt?: string | null;
    luckyNumber?: number | null;
    company?: string | null;
  };
  at: number;
};

type ScannerProps = {
  onResult?: (outcome: ScanOutcome) => void;
};

export default function Scanner({ onResult }: ScannerProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const busyRef = useRef(false);
  const lastIdRef = useRef<string | null>(null);
  const [active, setActive] = useState(false);
  const [history, setHistory] = useState<ScanOutcome[]>([]);
  const [current, setCurrent] = useState<ScanOutcome | null>(null);
  const [startError, setStartError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      const s = scannerRef.current;
      if (!s) return;
      (async () => {
        try {
          await s.stop();
          s.clear();
        } catch {}
      })();
    };
  }, []);

  async function start() {
    if (!elRef.current) return;
    setStartError(null);
    const scanner = new Html5Qrcode(elRef.current.id, {
      verbose: false,
      formatsToSupport: [0 /* QR_CODE */],
    });
    scannerRef.current = scanner;
    try {
      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 15,
          qrbox: (w, h) => {
            const min = Math.min(w, h);
            const size = Math.floor(min * 0.8);
            return { width: size, height: size };
          },
          aspectRatio: 1.0,
        },
        handleDecoded,
        () => {}
      );
      setActive(true);
    } catch (err) {
      setStartError(
        err instanceof Error ? err.message : "Unable to start camera"
      );
    }
  }

  async function stop() {
    try {
      await scannerRef.current?.stop();
      await scannerRef.current?.clear();
    } catch {}
    scannerRef.current = null;
    setActive(false);
  }

  async function handleDecoded(decoded: string) {
    if (busyRef.current) return;
    if (decoded === lastIdRef.current) return;
    busyRef.current = true;
    lastIdRef.current = decoded;
    try {
      const res = await fetch("/api/admin/check-in", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ticketId: decoded }),
      });
      const data = await res.json();
      const outcome: ScanOutcome = {
        ok: !!data.ok,
        status: data.status ?? "error",
        message: data.message ?? "Unknown",
        ticket: data.ticket,
        at: Date.now(),
      };
      setCurrent(outcome);
      setHistory((h) => [outcome, ...h].slice(0, 6));
      onResult?.(outcome);
    } catch {
      const outcome: ScanOutcome = {
        ok: false,
        status: "error",
        message: "Network error",
        at: Date.now(),
      };
      setCurrent(outcome);
      onResult?.(outcome);
    }
    // busyRef stays true until the user dismisses the modal.
  }

  function dismissCurrent() {
    setCurrent(null);
    lastIdRef.current = null;
    busyRef.current = false;
  }

  async function manualSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const id = String(form.get("ticketId") ?? "").trim();
    if (!id) return;
    lastIdRef.current = null;
    busyRef.current = false;
    await handleDecoded(id);
    (e.currentTarget as HTMLFormElement).reset();
  }

  return (
    <div className="space-y-4">
      <div className="relative mx-auto max-w-xs">
        <div
          id="qr-reader"
          ref={elRef}
          className="relative w-full min-h-[240px] bg-ink-800 border border-ink-600 overflow-hidden"
        />
        <span className="absolute top-1 left-1 w-6 h-6 border-l-2 border-t-2 border-gold-500 pointer-events-none" />
        <span className="absolute top-1 right-1 w-6 h-6 border-r-2 border-t-2 border-gold-500 pointer-events-none" />
        <span className="absolute bottom-1 left-1 w-6 h-6 border-l-2 border-b-2 border-gold-500 pointer-events-none" />
        <span className="absolute bottom-1 right-1 w-6 h-6 border-r-2 border-b-2 border-gold-500 pointer-events-none" />
      </div>

      <div className="flex justify-center gap-3">
        {!active ? (
          <button
            onClick={start}
            className="bg-grad-gold text-ink-black font-medium tracking-[0.14em] uppercase text-xs px-8 py-3 border border-gold-300/40 shadow-gold transition-[transform,opacity] duration-200 hover:-translate-y-px hover:brightness-110 active:translate-y-px"
          >
            Start Camera
          </button>
        ) : (
          <button
            onClick={stop}
            className="bg-transparent border border-gold-500/60 text-gold-300 px-8 py-3 uppercase tracking-[0.14em] text-xs transition-[transform,opacity] duration-200 hover:bg-gold-500/10"
          >
            Stop
          </button>
        )}
      </div>

      <div className="max-w-xs mx-auto">
        <p className="text-[9px] uppercase tracking-[0.28em] text-gold-500 mb-2 text-center">
          ◆ Manual entry
        </p>
        <form onSubmit={manualSubmit} className="flex gap-2">
          <input
            name="ticketId"
            placeholder="T-XXXXX-XXXXX"
            className="flex-1 bg-ink-800 border border-ink-600 text-ivory placeholder-ivory/25 px-3 py-2 font-mono text-xs tracking-wider focus:border-gold-500 focus:ring-1 focus:ring-gold-500/40 outline-none"
          />
          <button
            type="submit"
            className="bg-transparent border border-gold-500/60 text-gold-300 px-4 py-2 uppercase tracking-[0.14em] text-[10px] transition-[transform,opacity] duration-200 hover:bg-gold-500/10"
          >
            Check In
          </button>
        </form>
        <p className="mt-2 text-[9px] text-ivory-faint text-center">
          Format: <span className="font-mono text-gold-500">T-XXXXX-XXXXX</span>
          {" "}— 12 characters from the guest&apos;s ticket
        </p>
      </div>

      {startError && (
        <p className="text-error-crimson text-sm text-center">{startError}</p>
      )}

      {history.length > 0 && (
        <details className="max-w-md mx-auto">
          <summary className="text-[10px] uppercase tracking-[0.28em] text-gold-500 cursor-pointer text-center">
            ◆ Recent scans ({history.length})
          </summary>
          <ul className="space-y-2 mt-3">
            {history.map((h, i) => (
              <li
                key={`${h.at}-${i}`}
                className="flex items-center justify-between gap-2 text-xs bg-ink-800 border border-ink-600 px-3 py-2"
              >
                <span className="font-mono text-[10px] text-gold-500 truncate">
                  {h.ticket?.ticketId ?? "—"}
                </span>
                <span className="text-ivory truncate">
                  {h.ticket?.holderName ?? "—"}
                </span>
                <span
                  className={`text-[9px] uppercase tracking-[0.2em] shrink-0 ${
                    h.status === "checked_in"
                      ? "text-success-emerald"
                      : h.status === "already_used"
                      ? "text-carpet-bright"
                      : "text-error-crimson"
                  }`}
                >
                  {h.status.replace("_", " ")}
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}

      {current && <ResultModal outcome={current} onClose={dismissCurrent} />}
    </div>
  );
}

function ResultModal({
  outcome,
  onClose,
}: {
  outcome: ScanOutcome;
  onClose: () => void;
}) {
  const isSuccess = outcome.status === "checked_in";
  const isWarn = outcome.status === "already_used";

  const frameColor = isSuccess
    ? "border-success-emerald"
    : isWarn
    ? "border-carpet-bright"
    : "border-error-crimson";
  const bgTint = isSuccess
    ? "bg-success-emerald/10"
    : isWarn
    ? "bg-carpet-red/20"
    : "bg-error-crimson/15";
  const badgeClass = isSuccess
    ? "text-success-emerald border-success-emerald"
    : isWarn
    ? "text-carpet-bright border-carpet-bright"
    : "text-error-crimson border-error-crimson";

  const title = isSuccess
    ? "Welcome"
    : isWarn
    ? "Already Used"
    : outcome.status === "not_found"
    ? "Not Found"
    : "Error";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-black/90 backdrop-blur-sm rise-in"
    >
      <div
        className={`relative w-full max-w-sm bg-ink-900 border-2 ${frameColor} shadow-ticket`}
      >
        <div className={`${bgTint} p-6 text-center`}>
          <p
            className={`inline-block text-[10px] uppercase tracking-[0.28em] border px-3 py-1 ${badgeClass}`}
          >
            {title}
          </p>
          <h2 className="font-display text-4xl text-champagne mt-5 leading-tight">
            {outcome.ticket?.holderName ?? "Unknown"}
          </h2>
          {outcome.ticket?.company && (
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold-500 mt-1">
              {outcome.ticket.company}
            </p>
          )}
          {outcome.ticket?.kind === "plus_one" && (
            <p className="text-[10px] uppercase tracking-[0.22em] text-ivory-faint mt-1">
              Plus One
            </p>
          )}
          {typeof outcome.ticket?.luckyNumber === "number" && (
            <div className="mt-5 inline-block border border-gold-500/60 bg-ink-black/60 px-6 py-3">
              <p className="text-[9px] uppercase tracking-[0.28em] text-gold-500 mb-1">
                Lucky Number
              </p>
              <p className="font-mono font-black text-4xl text-gold-300 tabular-nums">
                {String(outcome.ticket.luckyNumber).padStart(3, "0")}
              </p>
            </div>
          )}
          <p className="text-ivory-dim text-sm mt-4">{outcome.message}</p>
          {outcome.ticket && (
            <p className="mt-3 font-mono text-[11px] text-gold-400 tracking-wider">
              {outcome.ticket.ticketId}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          autoFocus
          className="w-full bg-grad-gold text-ink-black font-medium tracking-[0.14em] uppercase text-sm px-8 py-5 border-t border-gold-300/40 transition-[transform,opacity] duration-200 hover:brightness-110 active:translate-y-px"
        >
          {isSuccess ? "Scan Next Guest" : "Dismiss"}
        </button>
      </div>
    </div>
  );
}
