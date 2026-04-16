"use client";

import { useCallback, useEffect, useState } from "react";
import AdminHeader from "../_admin-header";
import Scanner from "./_scanner";

type Stats = {
  attending: number;
  totalTickets: number;
  checkedIn: number;
  transport: number;
};

export default function ScanClient({ initialStats }: { initialStats: Stats }) {
  const [stats, setStats] = useState<Stats>(initialStats);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/guests", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setStats({
        attending: data.stats.attending,
        totalTickets: data.stats.totalTickets,
        checkedIn: data.stats.checkedIn,
        transport: data.stats.transport,
      });
    } catch {}
  }, []);

  useEffect(() => {
    const id = setInterval(refresh, 5000);
    return () => clearInterval(id);
  }, [refresh]);

  return (
    <>
      <AdminHeader stats={stats} />
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <p className="text-center text-[10px] uppercase tracking-[0.28em] text-gold-500 mb-2">
          ◆ Door Scanner
        </p>
        <h1 className="text-center font-display text-3xl md:text-5xl text-champagne mb-6 md:mb-10">
          Scan to Admit
        </h1>
        <Scanner onResult={(o) => { if (o.ok) refresh(); }} />
      </section>
    </>
  );
}
