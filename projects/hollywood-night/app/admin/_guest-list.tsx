"use client";

import { useEffect, useState, useCallback } from "react";
import type { GuestRow, TicketRow } from "@/lib/supabase";
import AdminHeader from "./_admin-header";

type GuestWithTickets = GuestRow & { tickets: TicketRow[] };

type Stats = {
  attending: number;
  totalTickets: number;
  checkedIn: number;
  transport: number;
};

type Payload = {
  ok: boolean;
  guests: GuestWithTickets[];
  stats: {
    totalGuests: number;
    attending: number;
    notAttending: number;
    totalTickets: number;
    checkedIn: number;
    transport: number;
  };
};

export default function GuestList({
  initialGuests,
  initialStats,
}: {
  initialGuests: GuestWithTickets[];
  initialStats: Stats;
}) {
  const [guests, setGuests] = useState(initialGuests);
  const [stats, setStats] = useState(initialStats);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/guests", { cache: "no-store" });
      if (!res.ok) return;
      const data: Payload = await res.json();
      setGuests(data.guests ?? []);
      setStats({
        attending: data.stats.attending,
        totalTickets: data.stats.totalTickets,
        checkedIn: data.stats.checkedIn,
        transport: data.stats.transport,
      });
      setLastUpdated(new Date());
    } catch {}
  }, []);

  useEffect(() => {
    const id = setInterval(fetchData, 5000);
    return () => clearInterval(id);
  }, [fetchData]);

  return (
    <>
      <AdminHeader stats={stats} />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <div className="flex items-baseline justify-between gap-4 mb-6 md:mb-8 flex-wrap">
          <h1 className="font-display text-3xl md:text-4xl text-champagne">
            Guest List
          </h1>
          <span className="text-[10px] uppercase tracking-[0.22em] text-ivory-faint">
            ◆ Live · updated {lastUpdated.toLocaleTimeString()}
          </span>
        </div>

        {guests.length === 0 ? (
          <div className="border border-ink-600 p-12 text-center text-ivory-faint italic">
            No RSVPs yet.
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto border border-ink-600">
              <table className="w-full text-sm">
                <thead className="bg-ink-800">
                  <tr className="text-left text-[10px] uppercase tracking-[0.22em] text-gold-500">
                    <th className="px-4 py-4">Name</th>
                    <th className="px-4 py-4">Company</th>
                    <th className="px-4 py-4">Contact</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Plus One</th>
                    <th className="px-4 py-4">Transport</th>
                    <th className="px-4 py-4">Tickets</th>
                    <th className="px-4 py-4">RSVP&apos;d</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map((g, i) => (
                    <tr
                      key={g.id}
                      className={`border-t border-ink-600 ${
                        i % 2 === 0 ? "bg-ink-900" : "bg-[#0E111A]"
                      }`}
                    >
                      <td className="px-4 py-4">
                        <div className="text-ivory">{g.name}</div>
                        <div className="font-mono text-[10px] text-gold-600 mt-0.5">
                          {g.guest_id}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-ivory-dim text-[12px]">
                        {g.company_name || "—"}
                      </td>
                      <td className="px-4 py-4 font-mono text-[11px] text-ivory-dim">
                        <div>{g.phone}</div>
                        <div className="text-[10px] text-ivory-faint">
                          {g.email}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <StatusChip attending={g.attending} />
                      </td>
                      <td className="px-4 py-4 text-ivory-dim">
                        {g.has_plus_one ? g.plus_one_name ?? "—" : "—"}
                      </td>
                      <td className="px-4 py-4 text-ivory-dim">
                        {g.transportation_required ? "Yes" : "—"}
                      </td>
                      <td className="px-4 py-4">
                        <TicketsList tickets={g.tickets ?? []} />
                      </td>
                      <td className="px-4 py-4 font-mono text-[10px] text-ivory-faint">
                        {new Date(g.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-3">
              {guests.map((g) => (
                <article
                  key={g.id}
                  className="bg-ink-800 border border-ink-600 p-4"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="text-ivory text-base font-medium">
                        {g.name}
                      </div>
                      <div className="font-mono text-[10px] text-gold-600 mt-0.5">
                        {g.guest_id}
                      </div>
                    </div>
                    <StatusChip attending={g.attending} />
                  </div>
                  {g.company_name && (
                    <div className="text-[11px] text-ivory-dim mb-2">
                      {g.company_name}
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-1 font-mono text-[11px] text-ivory-dim border-t border-ink-600 pt-2 mt-2">
                    <div>{g.phone}</div>
                    <div className="text-[10px] text-ivory-faint">
                      {g.email}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[11px] text-ivory-faint">
                    {g.has_plus_one && (
                      <span>+1: {g.plus_one_name ?? "—"}</span>
                    )}
                    {g.transportation_required && <span>Transport</span>}
                    <span className="ml-auto text-[10px]">
                      {new Date(g.created_at).toLocaleString()}
                    </span>
                  </div>
                  {(g.tickets ?? []).length > 0 && (
                    <div className="mt-3 border-t border-ink-600 pt-2">
                      <TicketsList tickets={g.tickets ?? []} />
                    </div>
                  )}
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

function StatusChip({ attending }: { attending: boolean }) {
  return attending ? (
    <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-gold-300 border border-gold-500 px-2 py-1">
      Attending
    </span>
  ) : (
    <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-ivory-faint border border-ivory/20 px-2 py-1">
      Not Going
    </span>
  );
}

function TicketsList({ tickets }: { tickets: TicketRow[] }) {
  if (tickets.length === 0) return <span className="text-ivory-faint">—</span>;
  return (
    <div className="flex flex-col gap-1">
      {tickets.map((t) => (
        <div key={t.id} className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-gold-500">
            {t.ticket_id}
          </span>
          {t.checked_in ? (
            <span className="text-[9px] uppercase tracking-[0.2em] text-ink-black bg-gold-500 px-1.5 py-0.5">
              ✓ In
            </span>
          ) : (
            <span className="text-[9px] uppercase tracking-[0.2em] text-ivory-faint">
              Pending
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
