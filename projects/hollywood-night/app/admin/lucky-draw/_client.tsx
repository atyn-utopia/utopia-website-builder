"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Draw = {
  ticketId: string;
  luckyNumber: number;
  holderName: string;
  company: string;
  guestName: string;
  drawnAt: string;
};

type LatestResponse = {
  ok: boolean;
  latest: Draw | null;
  history: Draw[];
  eligibleCount: number;
  drawnCount: number;
};

const SPIN_DURATION_MS = 3200;
const WHEEL_TICK_MS = 60;

export default function LuckyDrawClient() {
  const [isMobile, setIsMobile] = useState(false);
  const [eligibleCount, setEligibleCount] = useState(0);
  const [drawnCount, setDrawnCount] = useState(0);

  const [latest, setLatest] = useState<Draw | null>(null);
  const [history, setHistory] = useState<Draw[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [displayDigits, setDisplayDigits] = useState<[number, number, number]>([
    0, 0, 0,
  ]);
  const [showWinner, setShowWinner] = useState(false);

  const lastKnownIdRef = useRef<string | null>(null);
  const initializedRef = useRef(false);
  const tickTimerRef = useRef<number | null>(null);
  const [triggerError, setTriggerError] = useState<string | null>(null);
  const [triggerLoading, setTriggerLoading] = useState(false);

  // Detect viewport
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Poll /latest every 1.2s; trigger animation on new draws.
  const poll = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/lucky-draw/latest", {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data: LatestResponse = await res.json();
      setEligibleCount(data.eligibleCount);
      setDrawnCount(data.drawnCount);
      setHistory(data.history ?? []);
      const draw = data.latest;

      // First poll after page load: seed silently regardless of whether
      // there's a prior draw. This ensures later draws animate properly.
      if (!initializedRef.current) {
        initializedRef.current = true;
        if (draw) {
          lastKnownIdRef.current = draw.ticketId;
          setLatest(draw);
          setDisplayDigits(toDigits(draw.luckyNumber));
          setShowWinner(true);
        }
        return;
      }

      if (draw && draw.ticketId !== lastKnownIdRef.current) {
        lastKnownIdRef.current = draw.ticketId;
        startSpin(draw);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    poll();
    const id = setInterval(poll, 1200);
    return () => clearInterval(id);
  }, [poll]);

  // Cleanup any running tick timer
  useEffect(() => {
    return () => {
      if (tickTimerRef.current) window.clearInterval(tickTimerRef.current);
    };
  }, []);

  function startSpin(draw: Draw) {
    setShowWinner(false);
    setSpinning(true);
    setLatest(draw);
    const target = toDigits(draw.luckyNumber);

    // Per-wheel stopped flags, captured by the interval closure so ticks
    // only randomise wheels that are still spinning.
    const stopped = [false, false, false];

    if (tickTimerRef.current) window.clearInterval(tickTimerRef.current);
    tickTimerRef.current = window.setInterval(() => {
      setDisplayDigits((cur) => {
        const next = [...cur] as [number, number, number];
        for (let i = 0; i < 3; i++) {
          if (!stopped[i]) next[i] = randDigit();
        }
        return next;
      });
    }, WHEEL_TICK_MS);

    // Stop each wheel progressively.
    const stopDelays = [
      SPIN_DURATION_MS - 1600,
      SPIN_DURATION_MS - 900,
      SPIN_DURATION_MS,
    ];

    stopDelays.forEach((delay, idx) => {
      window.setTimeout(() => {
        stopped[idx] = true;
        setDisplayDigits((cur) => {
          const next = [...cur] as [number, number, number];
          next[idx] = target[idx];
          return next;
        });
        if (idx === 2 && tickTimerRef.current) {
          window.clearInterval(tickTimerRef.current);
          tickTimerRef.current = null;
        }
      }, delay);
    });

    window.setTimeout(() => {
      // Force the final display to the exact target, defending against any
      // lingering race with the tick timer.
      setDisplayDigits(target);
      setSpinning(false);
      setShowWinner(true);
    }, SPIN_DURATION_MS + 250);
  }

  async function trigger() {
    setTriggerError(null);
    setTriggerLoading(true);
    try {
      const res = await fetch("/api/admin/lucky-draw/spin", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setTriggerError(data.message ?? "Unable to draw.");
      } else {
        // Polling will pick it up on both devices within ~1.2s.
        // Also start local animation now for immediate feedback.
        lastKnownIdRef.current = data.draw.ticketId;
        startSpin(data.draw);
      }
    } catch {
      setTriggerError("Network error");
    } finally {
      setTriggerLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen bg-stage grain"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >

      <div className="relative z-20 px-4 md:px-6 py-8 md:py-12 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <a
            href="/admin"
            className="text-[11px] uppercase tracking-[0.2em] text-ivory-faint hover:text-gold-400 transition-[transform,opacity] duration-150"
          >
            ← Admin
          </a>
          <div className="flex gap-4 md:gap-6 text-[10px] uppercase tracking-[0.18em]">
            <div className="text-center">
              <div className="font-mono text-xl text-ivory">{eligibleCount}</div>
              <div className="text-ivory-faint">Eligible</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-xl text-gold-400">{drawnCount}</div>
              <div className="text-ivory-faint">Drawn</div>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] uppercase tracking-[0.32em] text-gold-500 mb-3">
          ◆ Hollywood Night
        </p>
        <h1 className="text-center font-display italic text-5xl md:text-7xl text-champagne mb-10 md:mb-14">
          Lucky Draw
        </h1>

        <SlotMachine digits={displayDigits} spinning={spinning} />

        <div className="mt-8 md:mt-12 text-center min-h-[140px]">
          {showWinner && latest ? (
            <div className="rise-in">
              <p className="text-[10px] uppercase tracking-[0.32em] text-gold-500 mb-2">
                ◆ Winner
              </p>
              <h2 className="font-display text-4xl md:text-6xl text-champagne mb-2 leading-tight">
                {latest.guestName}
              </h2>
              {latest.company && (
                <p className="font-display italic text-xl md:text-2xl text-gold-300">
                  {latest.company}
                </p>
              )}
              <p className="mt-3 font-mono text-xs text-ivory-faint">
                {latest.ticketId}
              </p>
            </div>
          ) : spinning ? (
            <p className="font-display italic text-2xl text-gold-300">
              Drawing a lucky number…
            </p>
          ) : (
            <p className="text-[10px] uppercase tracking-[0.28em] text-ivory-faint">
              {isMobile
                ? "Tap SPIN below to draw"
                : "Waiting for the next draw…"}
            </p>
          )}
        </div>

        {isMobile && (
          <div className="mt-10">
            <button
              onClick={trigger}
              disabled={triggerLoading || spinning || eligibleCount === 0}
              className="w-full bg-grad-gold text-ink-black font-medium tracking-[0.32em] uppercase text-lg px-10 py-7 border border-gold-300/50 shadow-gold transition-[transform,opacity,filter] duration-200 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-px disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {triggerLoading
                ? "Drawing"
                : spinning
                ? "Spinning"
                : eligibleCount === 0
                ? "No Entries"
                : "Spin"}
            </button>
            {triggerError && (
              <p className="text-error-crimson text-sm mt-4 text-center">
                {triggerError}
              </p>
            )}
            <p className="mt-5 text-center text-[10px] uppercase tracking-[0.22em] text-ivory-faint">
              Desktop displays animate automatically
            </p>
          </div>
        )}

        {!isMobile && (
          <div className="mt-10 text-center">
            <p className="text-[10px] uppercase tracking-[0.22em] text-ivory-faint">
              ◆ Use a mobile device to trigger the draw
            </p>
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-14 border-t border-ink-600 pt-10">
            <p className="text-center text-[10px] uppercase tracking-[0.28em] text-gold-500 mb-6">
              ◆ Previously Drawn ({history.length})
            </p>
            <ul className="space-y-2 max-w-2xl mx-auto">
              {history.map((d) => (
                <li
                  key={d.ticketId}
                  className="flex items-center justify-between gap-3 bg-ink-800 border border-ink-600 px-4 py-3"
                >
                  <span className="font-mono font-black text-xl text-gold-400 tabular-nums shrink-0">
                    {String(d.luckyNumber ?? 0).padStart(3, "0")}
                  </span>
                  <div className="flex-1 min-w-0 text-right md:text-left md:flex md:items-baseline md:gap-3">
                    <span className="block text-ivory text-sm truncate">
                      {d.guestName}
                    </span>
                    {d.company && (
                      <span className="block text-ivory-faint text-[11px] truncate">
                        {d.company}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[9px] text-ivory-faint shrink-0 hidden md:block">
                    {d.drawnAt
                      ? new Date(d.drawnAt).toLocaleTimeString()
                      : ""}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-center text-[10px] uppercase tracking-[0.22em] text-ivory-faint">
              ◆ Each number can only be drawn once
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function SlotMachine({
  digits,
  spinning,
}: {
  digits: [number, number, number];
  spinning: boolean;
}) {
  return (
    <div className="relative mx-auto max-w-lg">
      <div className="absolute -inset-6 bg-grad-gold opacity-20 blur-3xl pointer-events-none" />
      <div className="relative bg-gradient-to-b from-gold-600 via-gold-500 to-gold-600 p-2 shadow-[0_30px_90px_-20px_rgba(212,175,55,0.55),inset_0_2px_0_rgba(255,255,255,0.35)]">
        <div className="bg-ink-black p-4 md:p-6 border border-gold-400/40">
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {digits.map((d, i) => (
              <Wheel key={i} value={d} spinning={spinning} index={i} />
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center px-4 py-2">
          <span className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-ink-black/70 font-medium">
            ◆ Lucky ◆
          </span>
          <span className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-ink-black/70 font-medium">
            ◆ Draw ◆
          </span>
        </div>
      </div>
    </div>
  );
}

function Wheel({
  value,
  spinning,
  index,
}: {
  value: number;
  spinning: boolean;
  index: number;
}) {
  return (
    <div className="relative overflow-hidden bg-ivory border-2 border-gold-600 shadow-[inset_0_8px_20px_rgba(0,0,0,0.35),inset_0_-8px_20px_rgba(0,0,0,0.35)]">
      <div className="aspect-[3/4] flex items-center justify-center">
        <span
          className={`font-display font-black text-6xl md:text-8xl text-ink-black tabular-nums transition-[transform,opacity] duration-75 ${
            spinning ? "blur-[0.5px]" : ""
          }`}
          style={{
            textShadow: "0 2px 0 rgba(0,0,0,0.15)",
          }}
        >
          {value}
        </span>
      </div>
      <span className="absolute inset-x-0 top-1/2 h-px bg-carpet-red/40 pointer-events-none" />
      <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-gold-500" />
      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-gold-500" />
      <span className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-gold-500" />
      <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-gold-500" />
      <span className="sr-only">wheel {index + 1}</span>
    </div>
  );
}

function toDigits(n: number): [number, number, number] {
  const padded = String(n).padStart(3, "0").slice(-3);
  return [
    parseInt(padded[0], 10),
    parseInt(padded[1], 10),
    parseInt(padded[2], 10),
  ];
}

function randDigit() {
  return Math.floor(Math.random() * 10);
}
