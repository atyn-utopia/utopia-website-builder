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
    <main className="bg-stage grain min-h-screen relative">

      <nav className="relative px-6 py-8 flex items-center justify-between max-w-6xl mx-auto">
        <a href="/" className="block w-40 md:w-52">
          <Image
            src="/logo.png"
            alt="Hollywood Red Carpet"
            width={480}
            height={270}
            className="w-full h-auto"
          />
        </a>
        <a
          href="/"
          className="text-[11px] uppercase tracking-[0.2em] text-ivory-faint hover:text-gold-400 transition-[transform,opacity] duration-150"
        >
          ← Home
        </a>
      </nav>

      <section className="relative px-6 py-16 max-w-2xl md:max-w-5xl mx-auto text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] text-gold-500 mb-4">
          ◆ Ticket Retrieval
        </p>
        <h1 className="font-display text-5xl md:text-6xl text-champagne mb-4">
          Find Your Ticket
        </h1>
        <p className="text-ivory-dim mb-12 leading-relaxed">
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
