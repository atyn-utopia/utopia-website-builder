import { getSupabase } from "./supabase";

const WEBSITE = "roller-shutter-malaysia.vercel.app";
const PRODUCT_SLUG = "roller-shutter";
const FALLBACK_PHONE = "60174287801";

interface PhoneRow {
  phone_number: string;
  location_slug: string;
}

export interface PhoneResult {
  phone: string;
  source: "location" | "global-pool" | "env-fallback";
}

function pickRandom<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function getPhoneNumber(
  locationSlug: string
): Promise<PhoneResult> {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return { phone: FALLBACK_PHONE, source: "env-fallback" };
    }

    const { data, error } = await supabase
      .from("phone_numbers")
      .select("phone_number, location_slug")
      .eq("website", WEBSITE)
      .eq("product_slug", PRODUCT_SLUG)
      .eq("is_active", true)
      .in("location_slug", [locationSlug, "all"]);

    if (error) {
      console.error("[getPhoneNumber] Supabase error:", error.message);
      return { phone: FALLBACK_PHONE, source: "env-fallback" };
    }

    if (!data || data.length === 0) {
      return { phone: FALLBACK_PHONE, source: "env-fallback" };
    }

    const rows = data as PhoneRow[];
    const locationPool = rows.filter((r) => r.location_slug === locationSlug);
    const globalPool = rows.filter((r) => r.location_slug === "all");

    const fromLocation = pickRandom(locationPool);
    if (fromLocation)
      return { phone: fromLocation.phone_number, source: "location" };

    const fromGlobal = pickRandom(globalPool);
    if (fromGlobal)
      return { phone: fromGlobal.phone_number, source: "global-pool" };

    return { phone: FALLBACK_PHONE, source: "env-fallback" };
  } catch (err) {
    console.error("[getPhoneNumber] Unexpected error:", err);
    return { phone: FALLBACK_PHONE, source: "env-fallback" };
  }
}

export function waLink(phone: string, message?: string): string {
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${phone}${query}`;
}

export async function getWhatsAppLink(
  locationSlug: string,
  message?: string
): Promise<string> {
  const { phone } = await getPhoneNumber(locationSlug);
  return waLink(phone, message);
}
