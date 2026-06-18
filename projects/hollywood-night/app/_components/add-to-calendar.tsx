import { googleCalendarUrl } from "@/lib/calendar";

/** Gold-outline button that opens a pre-filled Google Calendar event. */
export default function AddToCalendar({
  className = "",
}: {
  className?: string;
}) {
  return (
    <a
      href={googleCalendarUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 border border-gold-500/70 text-gold-300 px-6 py-3 uppercase tracking-[0.18em] text-[11px] font-medium transition-[transform,opacity,background-color,border-color] duration-200 hover:bg-gold-500/10 hover:border-gold-400 hover:text-gold-200 hover:-translate-y-0.5 ${className}`}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="3" y="4.5" width="18" height="16" rx="2" />
        <path d="M3 9h18M8 2.5v4M16 2.5v4M12 13v4M10 15h4" />
      </svg>
      Add to Calendar
    </a>
  );
}
