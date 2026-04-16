import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env."
  );
}

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false },
  db: { schema: "hollywood" },
});

export type GuestRow = {
  id: string;
  guest_id: string;
  name: string;
  phone: string;
  email: string;
  company_name: string;
  attending: boolean;
  has_plus_one: boolean;
  plus_one_name: string | null;
  plus_one_phone: string | null;
  transportation_required: boolean;
  created_at: string;
};

export type TicketRow = {
  id: string;
  ticket_id: string;
  guest_row_id: string;
  holder_name: string;
  kind: "main" | "plus_one";
  checked_in: boolean;
  checked_in_at: string | null;
  lucky_number: number | null;
  drawn_at: string | null;
  created_at: string;
};
