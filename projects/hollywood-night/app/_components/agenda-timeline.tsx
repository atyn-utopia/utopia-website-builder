import { AGENDA } from "@/lib/event";

/** Run-of-show rendered as an elegant dinner programme. */
export default function AgendaTimeline() {
  return (
    <div className="glass mx-auto max-w-2xl p-6 sm:p-10">
      <ol className="divide-y divide-gold-500/15">
        {AGENDA.map((item) => (
          <li
            key={item.time + item.title}
            className="grid grid-cols-[auto_1fr] gap-4 sm:gap-7 py-4 first:pt-0 last:pb-0"
          >
            <span className="font-mono text-[10px] sm:text-xs text-gold-400 tracking-wide whitespace-nowrap pt-1.5">
              {item.time}
            </span>
            <div>
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
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
