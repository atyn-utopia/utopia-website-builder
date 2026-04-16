import { EVENT } from "@/lib/event";

export default function TicketPreview() {
  return (
    <div className="relative mx-auto max-w-3xl" style={{ transform: "rotate(-1.2deg)" }}>
      <div
        className="relative grain bg-grad-ticket border border-gold-500 shadow-ticket overflow-hidden"
        style={{ aspectRatio: "5.2 / 1" }}
      >
        <div className="absolute inset-0 bg-grad-shimmer pointer-events-none opacity-60" />
        <div className="relative flex h-full">
          <div className="flex-[3] p-6 md:p-8 border-r border-dashed border-gold-500/60">
            <p className="text-[10px] md:text-[11px] uppercase tracking-[0.32em] text-gold-400 font-medium mb-3">
              ◆ {EVENT.name} · Admit One
            </p>
            <h3 className="font-display font-black italic text-2xl md:text-4xl text-champagne leading-none">
              You&apos;re Invited
            </h3>
            <p className="text-[10px] md:text-xs text-ivory-dim mt-2 tracking-wide">
              {EVENT.subtitle}
            </p>
            <div className="mt-4 md:mt-6 font-mono text-[10px] md:text-xs text-ivory-dim space-y-0.5">
              <p>{EVENT.dateLabel}</p>
              <p>
                {EVENT.timeLabel} · {EVENT.venue}
              </p>
              <p>Dress: {EVENT.dressCode}</p>
            </div>
          </div>
          <div className="flex-[1] flex flex-col items-center justify-center bg-ink-800/40 p-4">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-champagne border border-gold-500 flex items-center justify-center">
              <span className="font-mono text-[8px] md:text-[10px] text-ink-black">
                ◆ QR ◆
              </span>
            </div>
            <p
              className="mt-2 md:mt-3 font-display italic text-gold-400 text-[10px] md:text-xs"
              style={{ letterSpacing: "0.18em" }}
            >
              ADMIT ONE
            </p>
          </div>
        </div>
        <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-ink-black" />
        <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-ink-black" />
      </div>
    </div>
  );
}
