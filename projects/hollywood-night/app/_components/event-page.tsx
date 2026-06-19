import Image from "next/image";
import { EVENT } from "@/lib/event";
import RsvpForm from "./rsvp-form";
import MarqueeBulbs from "./marquee-bulbs";
import Reveal from "./reveal";
import DoorOpening from "./door-opening";
import RunwayRail from "./runway-rail";
import AgendaTimeline from "./agenda-timeline";
import Countdown from "./countdown";
import FilmStrip from "./film-strip";
import MyTicketButton from "./my-ticket-button";
import IntroLoader from "./intro-loader";

export default function EventPage({
  variant = "staff",
}: {
  variant?: "staff" | "vip";
}) {
  const retrieveHref = variant === "vip" ? "/retrieve?from=vip" : "/retrieve";
  return (
    <>
      <IntroLoader />
      <DoorOpening />

      {/* "My Ticket" button — hidden over the splash, appears after the first section */}
      <MyTicketButton href={retrieveHref} />

      <main className="bg-runway grain min-h-screen relative overflow-x-clip">
        <RunwayRail />

        {/* ───────────── Splash — the image the doors open onto (pinned to linger) ───────────── */}
        <section id="hero-splash" className="relative h-[155vh] w-full">
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            {/* image fades out at the bottom into the shared velvet, blending into the next section */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage: "url(/main-background.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                maskImage:
                  "linear-gradient(to bottom, #000 56%, transparent 96%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, #000 56%, transparent 96%)",
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.20) 0%, transparent 36%, transparent 100%)",
              }}
            />
          </div>
        </section>

        {/* ───────────── Chapter I — The Invitation ───────────── */}
        <Reveal
          as="section"
          id="chapter-1"
          className="relative scroll-mt-8 px-6 sm:px-10 lg:px-16 pt-24 pb-24 text-center min-h-screen flex flex-col items-center justify-center"
        >
            <div className="relative z-10 w-full max-w-3xl mx-auto">
              <Image
                src="/masthead-dinner.png"
                alt="Utopia Group of Companies — Hollywood Red Carpet"
                width={1600}
                height={726}
                priority
                className="w-72 sm:w-[26rem] md:w-[32rem] h-auto mx-auto mb-8 drop-shadow-[0_0_45px_rgba(212,175,55,0.45)]"
              />

              <p className="text-[11px] md:text-xs uppercase tracking-[0.32em] text-gold-400 mb-7">
                31.07.2026 · Hollywood Red Carpet
              </p>

              <MarqueeBulbs />

              <h1 className="sr-only">{EVENT.name}</h1>

              <h2 className="font-display italic text-3xl md:text-6xl text-champagne my-6 leading-[1.1]">
                You&apos;re Invited to{" "}
                <br className="md:hidden" />
                the Annual Dinner
              </h2>

              <MarqueeBulbs />

              <div className="mt-9 inline-flex flex-wrap items-center justify-center gap-3 md:gap-4 text-ivory-dim text-xs md:text-base">
                <span>{EVENT.dateLabel}</span>
                <span className="text-gold-500">◆</span>
                <span>{EVENT.timeLabel}</span>
                <span className="text-gold-500">◆</span>
                <span>{EVENT.venue}</span>
              </div>

              <div className="mt-10 flex justify-center">
                <a
                  href="#chapter-4"
                  className="inline-block bg-transparent border border-gold-500/70 text-gold-300 px-14 py-4 uppercase tracking-[0.28em] text-xs font-medium transition-[transform,opacity,background-color,border-color] duration-300 hover:bg-gold-500/10 hover:border-gold-400 hover:text-gold-200 hover:-translate-y-0.5"
                >
                  RSVP Now
                </a>
              </div>
            </div>
          </Reveal>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-12 pt-10 md:pt-14 space-y-8 md:space-y-12">

          {/* ───────────── Chapter II — The Evening ───────────── */}
          <Reveal
            as="section"
            id="chapter-2"
            className="runway-panel scroll-mt-8 px-6 sm:px-10 lg:px-16 pt-20 pb-16"
          >
            <p className="text-center text-[11px] uppercase tracking-[0.28em] text-gold-500 mb-4">
              ◆ The Evening
            </p>
            <h3 className="text-center font-display font-semibold text-2xl md:text-5xl text-champagne mb-14">
              A Night Under the Spotlight
            </h3>

            <div className="grid md:grid-cols-3 gap-6 stagger">
              <DetailCard
                label="Date"
                primary={EVENT.dateLabel}
                secondary={EVENT.timeLabel}
                icon={<DetailIcon name="date" />}
              />
              <DetailCard
                label="Dress Code"
                primary="Hollywood Gala Night"
                secondary="Dress to impress in your finest formal attire and get ready to shine like a star!"
                icon={<DetailIcon name="dress" />}
              />
              <DetailCard
                label="Venue"
                primary={EVENT.venue}
                secondary={EVENT.venueAddress}
                icon={<DetailIcon name="venue" />}
                twoLine
              />
            </div>
          </Reveal>

          {/* ───────────── Chapter III — The Programme ───────────── */}
          <Reveal
            as="section"
            id="chapter-3"
            className="runway-panel scroll-mt-8 px-6 sm:px-10 lg:px-16 pt-20 pb-16"
          >
            <p className="text-center text-[11px] uppercase tracking-[0.28em] text-gold-500 mb-4">
              ◆ The Programme
            </p>
            <h3 className="text-center font-display font-semibold text-2xl md:text-5xl text-champagne mb-3">
              Tentative Run of Show
            </h3>
            <p className="text-center text-ivory-dim text-sm md:text-base mb-12 leading-relaxed">
              An evening of dining, games &amp; grand prizes.
            </p>
            <AgendaTimeline />
          </Reveal>
        </div>

        {/* ───────────── Film strip (auto-scrolling) ───────────── */}
        <FilmStrip />

        {/* ───────────── Chapter IV — RSVP (full-bleed) ───────────── */}
        <Reveal
          as="section"
          id="chapter-4"
          className="relative overflow-hidden scroll-mt-8 px-6 sm:px-10 lg:px-16 pt-24 pb-16"
        >
            {/* photographic background */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage: "url(/form-background.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            {/* gradient overlay — fades into the velvet at top & bottom */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, #1C060B 0%, rgba(28,6,11,0.92) 14%, rgba(20,4,8,0.78) 50%, rgba(28,6,11,0.92) 86%, #1C060B 100%)",
              }}
            />
            <div className="relative z-10 w-full max-w-2xl mx-auto">
              <p className="text-center text-[11px] uppercase tracking-[0.28em] text-gold-500 mb-4">
                ◆ {variant === "vip" ? "VIP RSVP" : "RSVP"}
              </p>
              <h3 className="text-center font-display font-semibold text-2xl md:text-5xl text-champagne mb-4">
                Claim Your Seat
              </h3>
              <p className="text-center text-ivory-dim text-sm md:text-base mb-10 leading-relaxed">
                Tickets are personal and non-transferable. A QR pass will be
                sent on WhatsApp.
              </p>
              <div className="mb-12">
                <p className="text-center text-[10px] uppercase tracking-[0.28em] text-gold-500 mb-5">
                  ◆ Countdown to the Night
                </p>
                <Countdown />
              </div>
              <RsvpForm variant={variant} />
            </div>

            {/* ───────────── Closing ───────────── */}
            <footer className="relative z-10 mt-20 pt-10 text-center">
            <div className="flex justify-center gap-2 text-gold-400 text-lg mb-4">
              <span>★</span>
              <span>★</span>
              <span>★</span>
            </div>
            <p className="font-display italic text-gold-300 text-xl mb-2">
              See you on the red carpet.
            </p>
            <p className="text-ivory-faint text-[10px] md:text-xs uppercase tracking-[0.2em]">
              {EVENT.name} · {EVENT.dateLabel}
            </p>
            <p className="mt-6">
              <a
                href={retrieveHref}
                className="text-ivory-faint text-xs uppercase tracking-[0.2em] hover:text-gold-400 transition-[transform,opacity] duration-200"
              >
                My Ticket →
              </a>
            </p>
          </footer>
        </Reveal>
      </main>
    </>
  );
}

function DetailCard({
  label,
  primary,
  secondary,
  icon,
  twoLine = false,
}: {
  label: string;
  primary: string;
  secondary: string;
  icon: React.ReactNode;
  twoLine?: boolean;
}) {
  return (
    <div className="group relative flex flex-col items-center justify-start text-center px-7 py-11 border border-gold-500/20 bg-gradient-to-b from-white/[0.05] to-white/[0.01] backdrop-blur-md shadow-[0_30px_70px_-45px_rgba(0,0,0,0.95)] transition-[transform,border-color] duration-500 hover:-translate-y-1.5 hover:border-gold-500/45">
      <span className="mb-5 text-gold-400/90 transition-transform duration-500 group-hover:scale-110">
        {icon}
      </span>
      <p className="text-[10px] uppercase tracking-[0.34em] text-gold-400 mb-3">
        {label}
      </p>
      <span
        aria-hidden
        className="mb-5 block h-px w-8 bg-gradient-to-r from-transparent via-gold-500/60 to-transparent"
      />
      <p
        className={`font-display text-xl text-champagne leading-snug ${
          twoLine ? "max-w-[12rem]" : "whitespace-nowrap"
        }`}
      >
        {primary}
      </p>
      {secondary && (
        <p className="mt-3 max-w-[15rem] text-ivory-faint text-[13px] leading-relaxed">
          {secondary}
        </p>
      )}
    </div>
  );
}

function DetailIcon({ name }: { name: "date" | "dress" | "venue" }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (name === "date") {
    return (
      <svg {...common}>
        <rect x="3" y="4.5" width="18" height="16" rx="1.5" />
        <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
      </svg>
    );
  }
  if (name === "dress") {
    return (
      <svg {...common}>
        <path d="M3 7.5 11 12 3 16.5Z" />
        <path d="M21 7.5 13 12 21 16.5Z" />
        <rect x="10.5" y="9.8" width="3" height="4.4" rx="0.7" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M12 21c4-4.5 6.5-7.7 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 13.3 8 16.5 12 21Z" />
      <circle cx="12" cy="10.5" r="2.4" />
    </svg>
  );
}
