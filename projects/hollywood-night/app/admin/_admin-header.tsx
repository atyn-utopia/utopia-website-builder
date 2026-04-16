"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

type Stats = {
  attending: number;
  checkedIn: number;
  totalTickets: number;
  transport: number;
};

export default function AdminHeader({ stats }: { stats: Stats }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header
      className="border-b border-ink-600 bg-ink-800 sticky top-0 z-20"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-5">
        <div className="flex items-center justify-between gap-4">
          <a href="/admin" className="block w-28 md:w-40 shrink-0">
            <Image
              src="/logo.png"
              alt="Hollywood Red Carpet"
              width={480}
              height={270}
              className="w-full h-auto"
            />
          </a>
          <nav className="flex gap-3 md:gap-6 text-[10px] md:text-[11px] uppercase tracking-[0.18em]">
            <a
              href="/admin"
              className="text-gold-300 hover:text-gold-400 transition-[transform,opacity] duration-150"
            >
              Guests
            </a>
            <a
              href="/admin/scan"
              className="text-ivory-dim hover:text-gold-400 transition-[transform,opacity] duration-150"
            >
              Scanner
            </a>
            <a
              href="/admin/lucky-draw"
              className="text-ivory-dim hover:text-gold-400 transition-[transform,opacity] duration-150"
            >
              Draw
            </a>
          </nav>
          <button
            onClick={logout}
            className="text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-ivory-faint hover:text-gold-400 transition-[transform,opacity] duration-150"
          >
            Logout
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2 md:gap-6 mt-4 pt-4 border-t border-ink-600">
          <Stat label="Attending" value={stats.attending} />
          <Stat label="Tickets" value={stats.totalTickets} />
          <Stat label="Checked In" value={stats.checkedIn} highlight />
          <Stat label="Transport" value={stats.transport} />
        </div>
      </div>
    </header>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col items-center text-center md:items-start md:text-left">
      <span
        className={`font-mono text-xl md:text-2xl leading-none ${
          highlight ? "text-gold-400" : "text-ivory"
        }`}
      >
        {value}
      </span>
      <span className="text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-ivory-faint mt-1">
        {label}
      </span>
    </div>
  );
}
