import ScanClient from "./_scan-client";
import { supabaseAdmin } from "@/lib/supabase";

export const metadata = { title: "Scanner — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminScanPage() {
  const { data: guests } = await supabaseAdmin
    .from("guests")
    .select("id, attending, has_plus_one, transportation_required, rsvp_type");
  const { data: tickets } = await supabaseAdmin
    .from("tickets")
    .select("checked_in");

  const rows = guests ?? [];
  const stats = {
    attending: rows
      .filter((g) => g.attending)
      .reduce((n, g) => n + 1 + (g.has_plus_one ? 1 : 0), 0),
    notAttending: rows.filter((g) => !g.attending).length,
    vip: rows.filter((g) => g.rsvp_type === "vip").length,
    totalTickets: (tickets ?? []).length,
    checkedIn: (tickets ?? []).filter((t) => t.checked_in).length,
    transport: rows.filter((g) => g.transportation_required).length,
  };

  return (
    <main className="min-h-screen bg-ink-900">
      <ScanClient initialStats={stats} />
    </main>
  );
}
