import { AGENDA } from "@/lib/event";

/** Run-of-show as a horizontal, scrollable line timeline. */
export default function AgendaTimeline() {
  return (
    <div className="relative">
      <div className="overflow-x-auto no-scrollbar">
        <ol className="flex min-w-max px-2 py-2">
          {AGENDA.map((item) => (
            <li
              key={item.time + item.title}
              className="flex-shrink-0 w-40 sm:w-48 px-2 text-center"
            >
              <p className="font-mono text-[10px] sm:text-xs text-gold-400 tracking-wide mb-3 whitespace-nowrap">
                {item.time}
              </p>

              {/* node sitting on the connecting line */}
              <div className="relative flex items-center justify-center">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gold-500/40"
                />
                <span
                  aria-hidden
                  className="relative z-10 grid h-[15px] w-[15px] place-items-center rounded-full border border-gold-400 bg-ink-black shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                </span>
              </div>

              <h4 className="mt-3 font-display text-sm sm:text-base text-champagne leading-snug">
                {item.title}
              </h4>
              {item.details && (
                <ul className="mt-1.5 space-y-0.5">
                  {item.details.map((d) => (
                    <li
                      key={d}
                      className="text-ivory-faint text-[11px] leading-relaxed"
                    >
                      {d}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-6 text-center text-[10px] uppercase tracking-[0.22em] text-ivory-faint">
        Swipe to explore the evening →
      </p>
    </div>
  );
}
