import { AGENDA } from "@/lib/event";

/** Run-of-show as a vertical line timeline. */
export default function AgendaTimeline() {
  return (
    <div className="relative mx-auto max-w-2xl">
      <ol className="relative">
        {/* the connecting line */}
        <span
          aria-hidden
          className="absolute top-2 bottom-2 left-[7px] w-px bg-gradient-to-b from-transparent via-gold-500/45 to-transparent"
        />
        {AGENDA.map((item) => (
          <li
            key={item.time + item.title}
            className="relative pl-9 sm:pl-12 pb-7 last:pb-0"
          >
            {/* node on the line */}
            <span
              aria-hidden
              className="absolute left-0 top-1 grid h-[15px] w-[15px] place-items-center rounded-full border border-gold-400 bg-ink-black shadow-[0_0_10px_rgba(212,175,55,0.5)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
            </span>
            <p className="font-mono text-[10px] sm:text-xs text-gold-400 tracking-wide mb-1">
              {item.time}
            </p>
            <h4 className="font-display text-lg sm:text-xl text-champagne leading-snug">
              {item.title}
            </h4>
            {item.details && (
              <ul className="mt-1.5 space-y-0.5">
                {item.details.map((d) => (
                  <li
                    key={d}
                    className="text-ivory-faint text-xs sm:text-sm leading-relaxed"
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
  );
}
