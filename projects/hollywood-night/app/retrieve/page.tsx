import { Suspense } from "react";
import Image from "next/image";
import { EVENT } from "@/lib/event";
import LoadingScreen from "../_components/loading-screen";
import RetrieveForm from "./_retrieve-form";

export const metadata = {
  title: `Retrieve Ticket — ${EVENT.name}`,
};

export default function RetrievePage() {
  return (
    <main className="bg-runway grain min-h-screen relative">

      <nav className="relative px-6 py-8 flex items-center justify-center max-w-6xl mx-auto">
        <a href="/" className="block w-48 md:w-72" aria-label="Home">
          <Image
            src="/masthead-dinner.png"
            alt="Utopia Group of Companies — Hollywood Red Carpet"
            width={1600}
            height={726}
            className="w-full h-auto"
          />
        </a>
      </nav>

      <section className="relative px-6 py-16 max-w-2xl md:max-w-5xl mx-auto text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] text-gold-500 mb-4">
          ◆ Ticket Retrieval
        </p>
        <h1 className="font-display text-4xl md:text-6xl text-champagne mb-4">
          Find Your Ticket
        </h1>
        <p className="text-ivory-dim text-sm md:text-base mb-12 leading-relaxed">
          Enter the phone number you used to RSVP and we&apos;ll reveal your
          ticket{"(s)"}.
        </p>

        <Suspense fallback={<LoadingScreen label="Finding your ticket" />}>
          <RetrieveForm />
        </Suspense>
      </section>

      <footer className="relative px-6 py-16 text-center">
        <p className="text-ivory-faint text-xs uppercase tracking-[0.2em]">
          {EVENT.name} · {EVENT.dateLabel}
        </p>
      </footer>
    </main>
  );
}
