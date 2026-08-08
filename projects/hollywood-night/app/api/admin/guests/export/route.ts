import { supabaseAdmin } from "@/lib/supabase";
import { renderGuestsPdf, type GuestPdfRow } from "@/lib/guests-pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { data: guests, error } = await supabaseAdmin
    .from("guests")
    .select("*, tickets(id, checked_in, lucky_number)")
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  const rows: GuestPdfRow[] = (guests ?? []).map((g) => ({
    guest_id: g.guest_id,
    name: g.name,
    rsvp_type: g.rsvp_type,
    company_name: g.company_name,
    phone: g.phone,
    email: g.email,
    attending: g.attending,
    has_plus_one: g.has_plus_one,
    plus_one_name: g.plus_one_name,
    created_at: g.created_at,
    ticketCount: (g.tickets ?? []).length,
    luckyNumbers: (g.tickets ?? [])
      .filter(
        (t: { checked_in: boolean; lucky_number: number | null }) =>
          t.checked_in && typeof t.lucky_number === "number"
      )
      .map((t: { lucky_number: number }) => t.lucky_number),
  }));

  const now = new Date();
  const exportedAt = now.toLocaleString("en-GB", {
    timeZone: "Asia/Kuala_Lumpur",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  // Filename stamp: YYYYMMDD-HHMM in Malaysia time.
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kuala_Lumpur",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const stamp = `${get("year")}${get("month")}${get("day")}-${get("hour")}${get("minute")}`;

  const pdf = await renderGuestsPdf(rows, exportedAt);

  return new Response(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="hollywood-night-guests-${stamp}.pdf"`,
      "cache-control": "no-store",
    },
  });
}
