import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { generateGuestId, generateTicketId } from "@/lib/ids";
import { qrDataUrl } from "@/lib/qr";
import { renderTicketsPdf, type TicketPdfData } from "@/lib/ticket-pdf";
import { sendTicketsEmail } from "@/lib/resend";
import { COMPANIES } from "@/lib/companies";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const myPhone = z
  .string()
  .trim()
  .regex(/^\+60\d{9,11}$/, "Invalid Malaysian phone number");

const schema = z
  .object({
    name: z.string().trim().min(2).max(120),
    phone: myPhone,
    email: z.string().trim().toLowerCase().email(),
    companyName: z.enum(COMPANIES as unknown as [string, ...string[]]),
    attending: z.boolean(),
    hasPlusOne: z.boolean(),
    plusOneName: z.string().trim().max(120).optional().nullable(),
    plusOnePhone: z.string().trim().max(30).optional().nullable(),
    transportationRequired: z.boolean(),
  })
  .refine(
    (v) => !v.hasPlusOne || (v.plusOneName && v.plusOneName.length >= 2),
    { message: "Plus-one name required", path: ["plusOneName"] }
  )
  .refine(
    (v) => !v.hasPlusOne || /^\+60\d{9,11}$/.test(v.plusOnePhone ?? ""),
    { message: "Valid Malaysian plus-one phone required", path: ["plusOnePhone"] }
  );

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const guestId = generateGuestId();

  const { data: guestRow, error: insertErr } = await supabaseAdmin
    .from("guests")
    .insert({
      guest_id: guestId,
      name: data.name,
      phone: data.phone,
      email: data.email,
      company_name: data.companyName,
      attending: data.attending,
      has_plus_one: data.hasPlusOne,
      plus_one_name: data.hasPlusOne ? data.plusOneName : null,
      plus_one_phone: data.hasPlusOne ? data.plusOnePhone ?? null : null,
      transportation_required: data.transportationRequired,
    })
    .select("*")
    .single();

  if (insertErr || !guestRow) {
    return NextResponse.json(
      { error: "Failed to save RSVP", detail: insertErr?.message },
      { status: 500 }
    );
  }

  if (!data.attending) {
    return NextResponse.json({
      ok: true,
      guestId,
      attending: false,
      message: "RSVP recorded. We'll miss you.",
    });
  }

  type TicketInsert = {
    ticket_id: string;
    guest_row_id: string;
    holder_name: string;
    kind: "main" | "plus_one";
  };
  const ticketRows: TicketInsert[] = [
    {
      ticket_id: generateTicketId(),
      guest_row_id: guestRow.id,
      holder_name: data.name,
      kind: "main",
    },
  ];
  if (data.hasPlusOne && data.plusOneName) {
    ticketRows.push({
      ticket_id: generateTicketId(),
      guest_row_id: guestRow.id,
      holder_name: data.plusOneName,
      kind: "plus_one",
    });
  }

  const { data: insertedTickets, error: ticketErr } = await supabaseAdmin
    .from("tickets")
    .insert(ticketRows)
    .select("*");

  if (ticketErr || !insertedTickets) {
    return NextResponse.json(
      { error: "Failed to create tickets", detail: ticketErr?.message },
      { status: 500 }
    );
  }

  const ticketsForPdf: TicketPdfData[] = await Promise.all(
    insertedTickets.map(async (t) => ({
      holderName: t.holder_name,
      ticketId: t.ticket_id,
      qrDataUrl: await qrDataUrl(t.ticket_id),
    }))
  );

  try {
    const pdf = await renderTicketsPdf(ticketsForPdf);
    await sendTicketsEmail({
      to: data.email,
      guestName: data.name,
      ticketCount: ticketsForPdf.length,
      pdf,
    });
  } catch (err) {
    console.error("email send failed", err);
    return NextResponse.json({
      ok: true,
      guestId,
      attending: true,
      ticketCount: ticketsForPdf.length,
      emailSent: false,
      message:
        "RSVP saved and tickets generated, but email delivery failed. You can retrieve your tickets by phone.",
    });
  }

  return NextResponse.json({
    ok: true,
    guestId,
    attending: true,
    ticketCount: ticketsForPdf.length,
    emailSent: true,
  });
}
