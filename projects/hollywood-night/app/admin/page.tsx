import { supabaseAdmin, type GuestRow, type TicketRow } from "@/lib/supabase";
import GuestList from "./_guest-list";

export const metadata = { title: "Guest List — Admin" };
export const dynamic = "force-dynamic";

type GuestWithTickets = GuestRow & { tickets: TicketRow[] };

export default async function AdminHome() {
  const { data: guests } = await supabaseAdmin
    .from("guests")
    .select("*, tickets(*)")
    .order("created_at", { ascending: false });

  const rows = (guests ?? []) as GuestWithTickets[];
  const allTickets = rows.flatMap((g) => g.tickets ?? []);

  const initialStats = {
    attending: rows.filter((g) => g.attending).length,
    totalTickets: allTickets.length,
    checkedIn: allTickets.filter((t) => t.checked_in).length,
    transport: rows.filter((g) => g.transportation_required).length,
  };

  return (
    <main className="min-h-screen bg-ink-900">
      <GuestList initialGuests={rows} initialStats={initialStats} />
    </main>
  );
}
