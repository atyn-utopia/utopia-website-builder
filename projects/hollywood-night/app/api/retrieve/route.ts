import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { qrDataUrl } from "@/lib/qr";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  phone: z.string().trim().min(4).max(30),
});

function normalizePhone(raw: string): string {
  return raw.replace(/[^0-9+]/g, "");
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
  }

  const phone = normalizePhone(parsed.data.phone);
  const likeTail = phone.slice(-8);

  const { data: guests, error } = await supabaseAdmin
    .from("guests")
    .select("*, tickets(*)")
    .or(`phone.ilike.%${likeTail},plus_one_phone.ilike.%${likeTail}`);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!guests || guests.length === 0) {
    return NextResponse.json({ ok: true, found: false, tickets: [] });
  }

  const tickets = guests.flatMap((g) =>
    (g.tickets ?? []).map(
      (t: {
        ticket_id: string;
        holder_name: string;
        kind: string;
        checked_in: boolean;
        lucky_number: number | null;
      }) => ({
        ticketId: t.ticket_id,
        holderName: t.holder_name,
        kind: t.kind,
        checkedIn: t.checked_in,
        luckyNumber: t.checked_in ? t.lucky_number : null,
        guestName: g.name,
      })
    )
  );

  const withQr = await Promise.all(
    tickets.map(async (t) => ({
      ...t,
      qr: await qrDataUrl(t.ticketId),
    }))
  );

  return NextResponse.json({ ok: true, found: true, tickets: withQr });
}
