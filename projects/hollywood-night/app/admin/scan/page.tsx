import ScanClient from "./_scan-client";
import { supabaseAdmin } from "@/lib/supabase";

export const metadata = { title: "Scanner — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminScanPage() {
  const { data: guests } = await supabaseAdmin
    .from("guests")
    .select("id, attending, transportation_required");
  const { data: tickets } = await supabaseAdmin
    .from("tickets")
    .select("checked_in");

  const stats = {
    attending: (guests ?? []).filter((g) => g.attending).length,
    totalTickets: (tickets ?? []).length,
    checkedIn: (tickets ?? []).filter((t) => t.checked_in).length,
    transport: (guests ?? []).filter((g) => g.transportation_required).length,
  };

  return (
    <main className="min-h-screen bg-ink-900">
      <ScanClient initialStats={stats} />
    </main>
  );
}
