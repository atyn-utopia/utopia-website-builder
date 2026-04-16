import Image from "next/image";
import { EVENT } from "@/lib/event";
import RsvpForm from "./_components/rsvp-form";
import MarqueeBulbs from "./_components/marquee-bulbs";
import TicketPreview from "./_components/ticket-preview";
import Reveal from "./_components/reveal";
import DoorOpening from "./_components/door-opening";

export default function Home() {
  return (
    <>
    <DoorOpening />
    <div className="h-screen bg-ink-black" aria-hidden />

    {/* Sticky "My Ticket" button — stays visible on scroll */}
    <a
      href="/retrieve"
      className="fixed top-4 right-4 z-40 bg-ink-black/80 backdrop-blur-sm border border-gold-500/60 text-gold-300 px-4 py-2 uppercase tracking-[0.18em] text-[10px] md:text-[11px] font-medium transition-[transform,opacity,background-color] duration-200 hover:bg-gold-500/10 hover:border-gold-400 hover:-translate-y-0.5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.9)]"
    >
      ◆ My Ticket
    </a>

    <main className="bg-stage grain min-h-screen relative overflow-hidden">

      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-6 py-24 text-center">
        <div
          className="drift-glow absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 65% 50% at 50% 30%, rgba(212,175,55,0.22) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 max-w-4xl">
          <p
            className="text-[11px] md:text-xs uppercase tracking-[0.32em] text-gold-500 mb-8 rise-in"
            style={{ animationDelay: "200ms" }}
          >
            ◆ 16.05.2026 · Red Carpet Night ◆
          </p>

          <div className="rise-in" style={{ animationDelay: "350ms" }}>
            <MarqueeBulbs />
          </div>

          <div
            className="relative my-10 md:my-14 w-full max-w-3xl mx-auto rise-in"
            style={{ animationDelay: "500ms" }}
          >
            <Image
              src="/logo.png"
              alt="Utopia Group of Companies — Hollywood Red Carpet"
              width={1600}
              height={900}
              priority
              className="w-full h-auto drop-shadow-[0_0_40px_rgba(212,175,55,0.3)]"
            />
          </div>

          <p
            className="font-display italic text-lg md:text-2xl text-gold-300 mb-8 rise-in"
            style={{ animationDelay: "700ms" }}
          >
            You&apos;re Invited to the Annual Dinner
          </p>

          <div className="rise-in" style={{ animationDelay: "850ms" }}>
            <MarqueeBulbs />
          </div>

          <div
            className="mt-12 inline-flex flex-wrap items-center justify-center gap-3 md:gap-4 text-ivory-dim text-sm md:text-base rise-in"
            style={{ animationDelay: "1000ms" }}
          >
            <span>{EVENT.dateLabel}</span>
            <span className="text-gold-500">◆</span>
            <span>{EVENT.timeLabel}</span>
            <span className="text-gold-500">◆</span>
            <span>{EVENT.venue}</span>
          </div>

          <div
            className="mt-12 flex justify-center rise-in"
            style={{ animationDelay: "1150ms" }}
          >
            <a
              href="#rsvp"
              className="inline-block bg-transparent border border-gold-500/70 text-gold-300 px-14 py-4 uppercase tracking-[0.28em] text-xs font-medium transition-[transform,opacity,background-color,border-color] duration-300 hover:bg-gold-500/10 hover:border-gold-400 hover:text-gold-200 hover:-translate-y-0.5"
            >
              RSVP Now
            </a>
          </div>
        </div>

        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold-500 text-xl rise-in"
          style={{ animationDelay: "1400ms" }}
          aria-hidden
        >
          <span className="block animate-[gentle-float_3s_ease-in-out_infinite]">
            ▾
          </span>
        </div>
      </section>

      <div className="hairline w-full max-w-5xl mx-auto" />

      <Reveal as="section" className="relative px-6 py-24 max-w-6xl mx-auto">
        <p className="text-center text-[11px] uppercase tracking-[0.28em] text-gold-500 mb-4">
          ◆ The Evening
        </p>
        <h2 className="text-center font-display text-4xl md:text-5xl text-champagne mb-16">
          A Night Under the Spotlight
        </h2>
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
            secondary="To be announced"
          />
        </div>
      </Reveal>

      <Reveal as="section" className="relative px-6 py-20">
        <p className="text-center text-[11px] uppercase tracking-[0.28em] text-gold-500 mb-8">
          ◆ Your Ticket Awaits
        </p>
        <div className="float-ticket">
          <TicketPreview />
        </div>
      </Reveal>

      <div className="hairline w-full max-w-5xl mx-auto" />

      <Reveal
        as="section"
        className="relative px-6 py-24 max-w-3xl mx-auto"
      >
        <div id="rsvp" className="scroll-mt-20" />
        <p className="text-center text-[11px] uppercase tracking-[0.28em] text-gold-500 mb-4">
          ◆ RSVP
        </p>
        <h2 className="text-center font-display text-4xl md:text-5xl text-champagne mb-4">
          Claim Your Seat
        </h2>
        <p className="text-center text-ivory-dim mb-12 leading-relaxed">
          Tickets are personal and non-transferable. A QR pass will be emailed
          on confirmation.
        </p>
        <RsvpForm />
      </Reveal>

      <Reveal as="footer" className="relative px-6 py-16 text-center">
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
      </Reveal>
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
    <div className="relative bg-ink-800 border border-gold-500/20 shadow-card p-8 text-center transition-[transform,opacity,border-color] duration-500 hover:-translate-y-1 hover:border-gold-500/50">
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
