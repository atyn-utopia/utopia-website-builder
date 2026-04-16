import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  // Eligible = checked in + has a lucky number + not yet drawn
  const { data: eligible, error } = await supabaseAdmin
    .from("tickets")
    .select("*, guests(name, company_name)")
    .eq("checked_in", true)
    .not("lucky_number", "is", null)
    .is("drawn_at", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const pool = eligible ?? [];
  if (pool.length === 0) {
    return NextResponse.json(
      { ok: false, message: "No eligible entries to draw from." },
      { status: 409 }
    );
  }

  const winner = pool[Math.floor(Math.random() * pool.length)];

  const { data: updated, error: updErr } = await supabaseAdmin
    .from("tickets")
    .update({ drawn_at: new Date().toISOString() })
    .eq("id", winner.id)
    .is("drawn_at", null)
    .select("*, guests(name, company_name)")
    .single();

  if (updErr || !updated) {
    return NextResponse.json(
      { ok: false, message: "Draw race — try again." },
      { status: 409 }
    );
  }

  return NextResponse.json({
    ok: true,
    draw: {
      ticketId: updated.ticket_id,
      luckyNumber: updated.lucky_number,
      holderName: updated.holder_name,
      company: updated.guests?.company_name ?? "",
      guestName: updated.guests?.name ?? updated.holder_name,
      drawnAt: updated.drawn_at,
    },
  });
}
