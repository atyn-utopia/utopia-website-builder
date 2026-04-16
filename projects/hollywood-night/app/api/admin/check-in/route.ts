import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({ ticketId: z.string().trim().min(4).max(64) });

const MAX_LUCKY = 600;

async function assignLuckyNumber(): Promise<number | null> {
  const { data: existing } = await supabaseAdmin
    .from("tickets")
    .select("lucky_number")
    .not("lucky_number", "is", null);
  const used = new Set(
    (existing ?? [])
      .map((r) => r.lucky_number as number | null)
      .filter((n): n is number => typeof n === "number")
  );
  if (used.size >= MAX_LUCKY) return null;
  // Random unused number in 1..MAX_LUCKY
  for (let i = 0; i < 20; i++) {
    const n = Math.floor(Math.random() * MAX_LUCKY) + 1;
    if (!used.has(n)) return n;
  }
  // Fallback: scan
  for (let n = 1; n <= MAX_LUCKY; n++) {
    if (!used.has(n)) return n;
  }
  return null;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid ticket id" }, { status: 400 });
  }
  const ticketId = parsed.data.ticketId;

  const { data: ticket, error: fetchErr } = await supabaseAdmin
    .from("tickets")
    .select("*, guests(name, company_name, has_plus_one, transportation_required)")
    .eq("ticket_id", ticketId)
    .single();

  if (fetchErr || !ticket) {
    return NextResponse.json(
      { ok: false, status: "not_found", message: "Ticket not found" },
      { status: 404 }
    );
  }

  if (ticket.checked_in) {
    return NextResponse.json({
      ok: false,
      status: "already_used",
      message: "This ticket was already checked in.",
      ticket: {
        ticketId: ticket.ticket_id,
        holderName: ticket.holder_name,
        kind: ticket.kind,
        checkedInAt: ticket.checked_in_at,
        luckyNumber: ticket.lucky_number,
        company: ticket.guests?.company_name ?? null,
      },
    });
  }

  const luckyNumber = ticket.lucky_number ?? (await assignLuckyNumber());

  const { data: updated, error: updateErr } = await supabaseAdmin
    .from("tickets")
    .update({
      checked_in: true,
      checked_in_at: new Date().toISOString(),
      lucky_number: luckyNumber,
    })
    .eq("id", ticket.id)
    .eq("checked_in", false)
    .select("*, guests(company_name)")
    .single();

  if (updateErr || !updated) {
    return NextResponse.json(
      { ok: false, status: "race", message: "Ticket just got checked in." },
      { status: 409 }
    );
  }

  return NextResponse.json({
    ok: true,
    status: "checked_in",
    message: "Welcome.",
    ticket: {
      ticketId: updated.ticket_id,
      holderName: updated.holder_name,
      kind: updated.kind,
      checkedInAt: updated.checked_in_at,
      luckyNumber: updated.lucky_number,
      company: updated.guests?.company_name ?? null,
    },
  });
}
