import Image from "next/image";
import { EVENT } from "@/lib/event";
import RsvpForm from "./_components/rsvp-form";
import MarqueeBulbs from "./_components/marquee-bulbs";
import TicketPreview from "./_components/ticket-preview";
import Reveal from "./_components/reveal";
import DoorOpening from "./_components/door-opening";
import RunwayRail from "./_components/runway-rail";
import AgendaTimeline from "./_components/agenda-timeline";

export default function Home() {
  return (
    <>
      <DoorOpening />
      {/* Doors part to reveal the red carpet runway behind them */}
      <div className="h-screen bg-runway" aria-hidden />

      {/* Sticky "My Ticket" button — stays visible on scroll */}
      <a
        href="/retrieve"
        className="fixed top-4 right-4 z-40 bg-ink-black/80 backdrop-blur-sm border border-gold-500/60 text-gold-300 px-4 py-2 uppercase tracking-[0.18em] text-[10px] md:text-[11px] font-medium transition-[transform,opacity,background-color] duration-200 hover:bg-gold-500/10 hover:border-gold-400 hover:-translate-y-0.5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.9)]"
      >
        ◆ My Ticket
      </a>

      <main className="bg-runway grain min-h-screen relative overflow-hidden">
        <RunwayRail />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-12 pb-24 space-y-8 md:space-y-12">

          {/* ───────────── Chapter I — The Invitation (hero) ───────────── */}
          <Reveal
            as="section"
            id="chapter-1"
            className="runway-panel scroll-mt-8 px-6 sm:px-10 lg:px-16 pt-20 pb-16 text-center"
          >
            <p className="text-[11px] md:text-xs uppercase tracking-[0.32em] text-gold-500 mb-8">
              ◆ 31.07.2026 · Hollywood Red Carpet ◆
            </p>

            <MarqueeBulbs />

            <div className="relative my-9 md:my-12 w-full max-w-3xl mx-auto">
              <Image
                src="/masthead-dinner.png"
                alt="Utopia Group of Companies — Hollywood Red Carpet"
                width={1600}
                height={726}
                priority
                className="w-full h-auto drop-shadow-[0_0_40px_rgba(212,175,55,0.3)]"
              />
            </div>

            <h1 className="sr-only">{EVENT.name}</h1>

            <h2 className="font-display italic text-xl md:text-3xl text-gold-300 mb-8">
              You&apos;re Invited to the Annual Dinner
            </h2>

            <MarqueeBulbs />

            <div className="mt-10 inline-flex flex-wrap items-center justify-center gap-3 md:gap-4 text-ivory-dim text-sm md:text-base">
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
          </Reveal>

          {/* ───────────── Chapter II — The Evening ───────────── */}
          <Reveal
            as="section"
            id="chapter-2"
            className="runway-panel scroll-mt-8 px-6 sm:px-10 lg:px-16 pt-20 pb-16"
          >
            <p className="text-center text-[11px] uppercase tracking-[0.28em] text-gold-500 mb-4">
              ◆ The Evening
            </p>
            <h3 className="text-center font-display font-semibold text-3xl md:text-5xl text-champagne mb-14">
              A Night Under the Spotlight
            </h3>

            <div className="grid md:grid-cols-3 gap-6 stagger">
              <DetailCard
                label="Date"
                primary={EVENT.dateLabel}
                secondary={EVENT.timeLabel}
              />
              <DetailCard
                label="Dress Code"
                primary={EVENT.dressCode}
                secondary="Come as a star"
              />
              <DetailCard
                label="Venue"
                primary={EVENT.venue}
                secondary={EVENT.venueAddress}
              />
            </div>

            <div className="mt-16">
              <p className="text-center text-[11px] uppercase tracking-[0.28em] text-gold-500 mb-8">
                ◆ Your Ticket Awaits
              </p>
              <div className="float-ticket">
                <TicketPreview />
              </div>
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
            <h3 className="text-center font-display font-semibold text-3xl md:text-5xl text-champagne mb-3">
              Tentative Run of Show
            </h3>
            <p className="text-center text-ivory-dim mb-12 leading-relaxed">
              An evening of dining, masquerade games &amp; grand prizes. Timings
              are indicative and may shift on the night.
            </p>
            <AgendaTimeline />
          </Reveal>

          {/* ───────────── Chapter IV — RSVP ───────────── */}
          <Reveal
            as="section"
            id="chapter-4"
            className="runway-panel scroll-mt-8 px-6 sm:px-10 lg:px-16 pt-20 pb-16"
          >
            <div className="max-w-2xl mx-auto">
              <p className="text-center text-[11px] uppercase tracking-[0.28em] text-gold-500 mb-4">
                ◆ RSVP
              </p>
              <h3 className="text-center font-display font-semibold text-3xl md:text-5xl text-champagne mb-4">
                Claim Your Seat
              </h3>
              <p className="text-center text-ivory-dim mb-12 leading-relaxed">
                Tickets are personal and non-transferable. A QR pass will be
                emailed on confirmation.
              </p>
              <RsvpForm />
            </div>
          </Reveal>

          {/* ───────────── Closing ───────────── */}
          <footer className="relative pt-10 pb-4 text-center">
            <div className="flex justify-center gap-2 text-gold-400 text-lg mb-4">
              <span>★</span>
              <span>★</span>
              <span>★</span>
            </div>
            <p className="font-display italic text-gold-300 text-xl mb-2">
              See you on the red carpet.
            </p>
            <p className="text-ivory-faint text-xs uppercase tracking-[0.2em]">
              {EVENT.name} · {EVENT.dateLabel}
            </p>
            <p className="mt-6">
              <a
                href="/retrieve"
                className="text-ivory-faint text-xs uppercase tracking-[0.2em] hover:text-gold-400 transition-[transform,opacity] duration-200"
              >
                My Ticket →
              </a>
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}

function DetailCard({
  label,
  primary,
  secondary,
}: {
  label: string;
  primary: string;
  secondary: string;
}) {
  return (
    <div className="glass relative p-8 text-center transition-[transform,opacity,border-color] duration-500 hover:-translate-y-1 hover:border-gold-500/50">
      <span className="absolute top-2 left-2 w-4 h-4 border-l border-t border-gold-500" />
      <span className="absolute top-2 right-2 w-4 h-4 border-r border-t border-gold-500" />
      <span className="absolute bottom-2 left-2 w-4 h-4 border-l border-b border-gold-500" />
      <span className="absolute bottom-2 right-2 w-4 h-4 border-r border-b border-gold-500" />
      <p className="text-[10px] uppercase tracking-[0.28em] text-gold-500 mb-4">
        {label}
      </p>
      <p className="font-display text-2xl text-champagne mb-2">{primary}</p>
      <p className="text-ivory-faint text-sm">{secondary}</p>
    </div>
  );
}
