import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TicketWithGuest = {
  ticket_id: string;
  lucky_number: number | null;
  holder_name: string;
  drawn_at: string | null;
  guests?: { name?: string | null; company_name?: string | null } | null;
};

function toDraw(t: TicketWithGuest) {
  return {
    ticketId: t.ticket_id,
    luckyNumber: t.lucky_number,
    holderName: t.holder_name,
    company: t.guests?.company_name ?? "",
    guestName: t.guests?.name ?? t.holder_name,
    drawnAt: t.drawn_at,
  };
}

export async function GET() {
  const { data: history } = await supabaseAdmin
    .from("tickets")
    .select("*, guests(name, company_name)")
    .not("drawn_at", "is", null)
    .order("drawn_at", { ascending: false })
    .limit(20);

  const eligibleRes = await supabaseAdmin
    .from("tickets")
    .select("id", { count: "exact", head: true })
    .eq("checked_in", true)
    .not("lucky_number", "is", null)
    .is("drawn_at", null);

  const drawnRes = await supabaseAdmin
    .from("tickets")
    .select("id", { count: "exact", head: true })
    .not("drawn_at", "is", null);

  const draws = (history ?? []).map((t) => toDraw(t as TicketWithGuest));

  return NextResponse.json({
    ok: true,
    latest: draws[0] ?? null,
    history: draws,
    eligibleCount: eligibleRes.count ?? 0,
    drawnCount: drawnRes.count ?? 0,
  });
}
