import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { data: guests, error } = await supabaseAdmin
    .from("guests")
    .select("*, tickets(*)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: ticketStats } = await supabaseAdmin
    .from("tickets")
    .select("checked_in");

  const totalTickets = ticketStats?.length ?? 0;
  const checkedIn = ticketStats?.filter((t) => t.checked_in).length ?? 0;
  const attending = guests?.filter((g) => g.attending).length ?? 0;
  const notAttending = guests?.filter((g) => !g.attending).length ?? 0;
  const transport = guests?.filter((g) => g.transportation_required).length ?? 0;

  return NextResponse.json({
    ok: true,
    stats: { totalGuests: guests?.length ?? 0, attending, notAttending, totalTickets, checkedIn, transport },
    guests,
  });
}
