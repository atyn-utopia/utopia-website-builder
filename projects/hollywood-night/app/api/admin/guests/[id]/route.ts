import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  // Tickets are removed automatically via the ON DELETE CASCADE FK.
  const { error } = await supabaseAdmin.from("guests").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const name = str(body.name);
  const email = str(body.email).toLowerCase();
  const phone = str(body.phone);

  if (!name || !email || !phone) {
    return NextResponse.json(
      { error: "Name, phone and email are required." },
      { status: 400 }
    );
  }

  const hasPlusOne = Boolean(body.hasPlusOne);
  const plusOneName = hasPlusOne ? str(body.plusOneName) : null;
  const plusOnePhone = hasPlusOne ? str(body.plusOnePhone) : null;

  const update: Record<string, unknown> = {
    name,
    email,
    phone,
    company_name: str(body.companyName),
    attending: Boolean(body.attending),
    has_plus_one: hasPlusOne,
    plus_one_name: plusOneName,
    plus_one_phone: plusOnePhone,
    transportation_required: Boolean(body.transportationRequired),
    rsvp_type: body.rsvpType === "vip" ? "vip" : "staff",
  };

  let { data: guest, error } = await supabaseAdmin
    .from("guests")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();

  // Fall back gracefully if the rsvp_type column hasn't been migrated yet.
  if (error && /rsvp_type/i.test(error.message)) {
    delete update.rsvp_type;
    ({ data: guest, error } = await supabaseAdmin
      .from("guests")
      .update(update)
      .eq("id", id)
      .select("*")
      .single());
  }

  if (error || !guest) {
    return NextResponse.json(
      { error: error?.message ?? "Update failed" },
      { status: 500 }
    );
  }

  // Keep existing ticket holder names in sync with the edited guest.
  await supabaseAdmin
    .from("tickets")
    .update({ holder_name: name })
    .eq("guest_row_id", id)
    .eq("kind", "main");
  if (plusOneName) {
    await supabaseAdmin
      .from("tickets")
      .update({ holder_name: plusOneName })
      .eq("guest_row_id", id)
      .eq("kind", "plus_one");
  }

  return NextResponse.json({ ok: true, guest });
}
