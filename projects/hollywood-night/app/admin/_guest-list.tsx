"use client";

import { useEffect, useState, useCallback } from "react";
import type { GuestRow, TicketRow } from "@/lib/supabase";
import AdminHeader from "./_admin-header";

type GuestWithTickets = GuestRow & { tickets: TicketRow[] };

type Stats = {
  attending: number;
  notAttending: number;
  totalTickets: number;
  checkedIn: number;
  transport: number;
  vip: number;
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
    vip: number;
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
  const [filter, setFilter] = useState<"all" | "vip" | "staff">("all");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<GuestWithTickets | null>(
    null
  );
  const [editTarget, setEditTarget] = useState<GuestWithTickets | null>(null);
  const [busy, setBusy] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/guests", { cache: "no-store" });
      if (!res.ok) return;
      const data: Payload = await res.json();
      setGuests(data.guests ?? []);
      setStats({
        attending: data.stats.attending,
        notAttending: data.stats.notAttending,
        totalTickets: data.stats.totalTickets,
        checkedIn: data.stats.checkedIn,
        transport: data.stats.transport,
        vip: data.stats.vip,
      });
      setLastUpdated(new Date());
    } catch {}
  }, []);

  useEffect(() => {
    const id = setInterval(fetchData, 5000);
    return () => clearInterval(id);
  }, [fetchData]);

  const vipCount = guests.filter((g) => g.rsvp_type === "vip").length;
  const staffCount = guests.length - vipCount;
  const q = search.trim().toLowerCase();
  const shown = guests
    .filter((g) => filter === "all" || (g.rsvp_type ?? "staff") === filter)
    .filter((g) => {
      if (!q) return true;
      return [
        g.name,
        g.phone,
        g.email,
        g.company_name,
        g.guest_id,
        g.plus_one_name,
        g.plus_one_phone,
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });

  async function handleDelete() {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/guests/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      await fetchData();
    } finally {
      setBusy(false);
    }
  }

  async function handleSave(values: EditValues) {
    if (!editTarget) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/guests/${editTarget.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setEditTarget(null);
        await fetchData();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <AdminHeader stats={stats} />
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8 md:py-10">
        <div className="flex items-baseline justify-between gap-4 mb-6 md:mb-8 flex-wrap">
          <h1 className="font-display text-3xl md:text-4xl text-champagne">
            Guest List
          </h1>
          <span className="text-[10px] uppercase tracking-[0.22em] text-ivory-faint">
            ◆ Live · updated {lastUpdated.toLocaleTimeString()}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-5">
          <FilterButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label="All"
            count={guests.length}
          />
          <FilterButton
            active={filter === "vip"}
            onClick={() => setFilter("vip")}
            label="VIP"
            count={vipCount}
          />
          <FilterButton
            active={filter === "staff"}
            onClick={() => setFilter("staff")}
            label="Staff"
            count={staffCount}
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, email…"
            className="ml-auto w-full sm:w-72 bg-ink-700 border border-ink-600 text-ivory text-sm px-3 py-2 outline-none focus:border-gold-500 placeholder-ivory/30"
          />
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
                    <th className="px-4 py-4">Type</th>
                    <th className="px-4 py-4">Company</th>
                    <th className="px-4 py-4">Contact</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Plus One</th>
                    <th className="px-4 py-4">Tickets</th>
                    <th className="px-4 py-4">RSVP&apos;d</th>
                    <th className="px-4 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((g, i) => (
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
                      <td className="px-4 py-4">
                        <TypeChip type={g.rsvp_type} />
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
                      <td className="px-4 py-4">
                        <TicketsList tickets={g.tickets ?? []} />
                      </td>
                      <td className="px-4 py-4 font-mono text-[10px] text-ivory-faint">
                        {new Date(g.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditTarget(g)}
                            className="text-[10px] uppercase tracking-[0.16em] text-gold-300 border border-gold-500/50 px-2.5 py-1.5 hover:bg-gold-500/10 hover:border-gold-400 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteTarget(g)}
                            className="text-[10px] uppercase tracking-[0.16em] text-error-crimson border border-error-crimson/50 px-2.5 py-1.5 hover:bg-error-crimson/10 hover:border-error-crimson transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-3">
              {shown.map((g) => (
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
                    <div className="flex flex-col items-end gap-1">
                      <StatusChip attending={g.attending} />
                      <TypeChip type={g.rsvp_type} />
                    </div>
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
                    <span className="ml-auto text-[10px]">
                      {new Date(g.created_at).toLocaleString()}
                    </span>
                  </div>
                  {(g.tickets ?? []).length > 0 && (
                    <div className="mt-3 border-t border-ink-600 pt-2">
                      <TicketsList tickets={g.tickets ?? []} />
                    </div>
                  )}
                  <div className="flex gap-2 mt-3 border-t border-ink-600 pt-3">
                    <button
                      onClick={() => setEditTarget(g)}
                      className="flex-1 text-[10px] uppercase tracking-[0.16em] text-gold-300 border border-gold-500/50 py-2 hover:bg-gold-500/10 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(g)}
                      className="flex-1 text-[10px] uppercase tracking-[0.16em] text-error-crimson border border-error-crimson/50 py-2 hover:bg-error-crimson/10 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {shown.length === 0 && (
              <p className="text-center text-ivory-faint italic py-10">
                No guests match your search.
              </p>
            )}
          </>
        )}
      </div>

      {deleteTarget && (
        <ConfirmDeleteModal
          guest={deleteTarget}
          busy={busy}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
      {editTarget && (
        <EditModal
          guest={editTarget}
          busy={busy}
          onClose={() => setEditTarget(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
}

type EditValues = {
  name: string;
  phone: string;
  email: string;
  companyName: string;
  attending: boolean;
  hasPlusOne: boolean;
  plusOneName: string;
  plusOnePhone: string;
  transportationRequired: boolean;
  rsvpType: "staff" | "vip";
};

function FilterButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-[10px] uppercase tracking-[0.2em] px-3 py-2 border transition-colors ${
        active
          ? "border-gold-500 text-gold-300 bg-gold-500/10"
          : "border-ink-600 text-ivory-faint hover:border-gold-500/40"
      }`}
    >
      {label} <span className="ml-1 font-mono">{count}</span>
    </button>
  );
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-ink-800 border border-gold-500/30 shadow-card max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-ink-600 px-5 py-4">
          <h2 className="font-display text-xl text-champagne">{title}</h2>
          <button
            onClick={onClose}
            className="text-ivory-faint hover:text-gold-400 text-lg leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function ConfirmDeleteModal({
  guest,
  busy,
  onCancel,
  onConfirm,
}: {
  guest: GuestWithTickets;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <ModalShell title="Delete RSVP" onClose={onCancel}>
      <p className="text-ivory-dim text-sm leading-relaxed">
        Delete{" "}
        <span className="text-champagne font-medium">{guest.name}</span>? This
        permanently removes their RSVP and any issued tickets. This cannot be
        undone.
      </p>
      <div className="flex gap-3 mt-6">
        <button
          onClick={onCancel}
          disabled={busy}
          className="flex-1 text-[11px] uppercase tracking-[0.18em] text-ivory-dim border border-ink-600 py-3 hover:border-ivory/40 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={busy}
          className="flex-1 text-[11px] uppercase tracking-[0.18em] text-white bg-error-crimson py-3 hover:brightness-110 transition disabled:opacity-50"
        >
          {busy ? "Deleting…" : "Delete"}
        </button>
      </div>
    </ModalShell>
  );
}

function EditModal({
  guest,
  busy,
  onClose,
  onSave,
}: {
  guest: GuestWithTickets;
  busy: boolean;
  onClose: () => void;
  onSave: (v: EditValues) => void;
}) {
  const [v, setV] = useState<EditValues>({
    name: guest.name,
    phone: guest.phone,
    email: guest.email,
    companyName: guest.company_name ?? "",
    attending: guest.attending,
    hasPlusOne: guest.has_plus_one,
    plusOneName: guest.plus_one_name ?? "",
    plusOnePhone: guest.plus_one_phone ?? "",
    transportationRequired: guest.transportation_required,
    rsvpType: guest.rsvp_type === "vip" ? "vip" : "staff",
  });

  const set = <K extends keyof EditValues>(k: K, val: EditValues[K]) =>
    setV((prev) => ({ ...prev, [k]: val }));

  const inputCls =
    "w-full bg-ink-700 border border-ink-600 text-ivory text-sm px-3 py-2 outline-none focus:border-gold-500";
  const labelCls =
    "block text-[10px] uppercase tracking-[0.2em] text-gold-500 mb-1.5";

  return (
    <ModalShell title="Edit Guest" onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSave(v);
        }}
      >
        <div>
          <label className={labelCls}>Full name</label>
          <input
            className={inputCls}
            value={v.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Phone</label>
            <input
              className={inputCls}
              value={v.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input
              className={inputCls}
              value={v.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Company</label>
            <input
              className={inputCls}
              value={v.companyName}
              onChange={(e) => set("companyName", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>RSVP type</label>
            <select
              className={inputCls}
              value={v.rsvpType}
              onChange={(e) =>
                set("rsvpType", e.target.value === "vip" ? "vip" : "staff")
              }
            >
              <option value="staff" className="bg-ink-800">
                Staff
              </option>
              <option value="vip" className="bg-ink-800">
                VIP
              </option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-ivory-dim">
          <input
            type="checkbox"
            checked={v.attending}
            onChange={(e) => set("attending", e.target.checked)}
          />
          Attending
        </label>
        <label className="flex items-center gap-2 text-sm text-ivory-dim">
          <input
            type="checkbox"
            checked={v.hasPlusOne}
            onChange={(e) => set("hasPlusOne", e.target.checked)}
          />
          Has plus one
        </label>

        {v.hasPlusOne && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Plus one name</label>
              <input
                className={inputCls}
                value={v.plusOneName}
                onChange={(e) => set("plusOneName", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Plus one phone</label>
              <input
                className={inputCls}
                value={v.plusOnePhone}
                onChange={(e) => set("plusOnePhone", e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="flex-1 text-[11px] uppercase tracking-[0.18em] text-ivory-dim border border-ink-600 py-3 hover:border-ivory/40 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="flex-1 text-[11px] uppercase tracking-[0.18em] text-ink-black bg-grad-gold py-3 hover:brightness-110 transition disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </ModalShell>
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

function TypeChip({ type }: { type?: string }) {
  const vip = type === "vip";
  return (
    <span
      className={`inline-block text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 border ${
        vip
          ? "text-gold-300 border-gold-500 bg-gold-500/10"
          : "text-ivory-faint border-ivory/20"
      }`}
    >
      {vip ? "VIP" : "Staff"}
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
