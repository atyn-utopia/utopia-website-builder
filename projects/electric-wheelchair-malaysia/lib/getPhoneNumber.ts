import { getSupabase } from "./supabase";
import { headers } from "next/headers";

const FALLBACK_PHONE = "60108889849";
const FALLBACK_WA_TEXT = "Hi, I am interested in your electric wheelchair.";

/**
 * Leads modes:
 * - single:   One default number for entire website
 * - rotation: Multiple numbers, weighted random by percentage
 * - location: Location-specific numbers with percentage rotation
 * - hybrid:   Location numbers + fallback "all" pool combined
 */
type LeadsMode = "single" | "rotation" | "location" | "hybrid";

interface PhoneRow {
  phone_number: string;
  whatsapp_text: string;
  percentage: number;
  label: string | null;
  location_slug: string;
}

export interface PhoneResult {
  phone: string;
  whatsappText: string;
  source: "database" | "fallback";
  mode: LeadsMode | "fallback";
}

/**
 * Weighted random pick based on percentage column.
 * If percentages don't sum to 100, they're treated as relative weights.
 */
function pickWeighted(rows: PhoneRow[]): PhoneRow | undefined {
  if (rows.length === 0) return undefined;
  if (rows.length === 1) return rows[0];

  const totalWeight = rows.reduce((sum, r) => sum + (r.percentage || 1), 0);
  let random = Math.random() * totalWeight;

  for (const row of rows) {
    random -= row.percentage || 1;
    if (random <= 0) return row;
  }

  return rows[0];
}

/**
 * Resolve the current domain from the HTTP host header.
 */
async function getHostDomain(): Promise<string> {
  try {
    const h = await headers();
    const host = h.get("host") || h.get("x-forwarded-host") || "";
    return host.replace(/:\d+$/, "");
  } catch {
    return "";
  }
}

/**
 * Fetch the leads_mode for this domain from company_websites table.
 */
async function getLeadsMode(domain: string): Promise<LeadsMode> {
  try {
    const supabase = getSupabase();
    if (!supabase) return "single";

    const { data, error } = await supabase
      .from("company_websites")
      .select("leads_mode")
      .eq("domain", domain)
      .single();

    if (error || !data) return "single";
    return (data.leads_mode as LeadsMode) || "single";
  } catch {
    return "single";
  }
}

function toResult(row: PhoneRow | undefined, mode: LeadsMode): PhoneResult {
  if (!row) {
    return { phone: FALLBACK_PHONE, whatsappText: FALLBACK_WA_TEXT, source: "fallback", mode: "fallback" };
  }
  return {
    phone: row.phone_number,
    whatsappText: row.whatsapp_text || FALLBACK_WA_TEXT,
    source: "database",
    mode,
  };
}

/**
 * Fetch phone number + WhatsApp text based on the website's leads_mode.
 *
 * @param locationSlug - Optional. The location slug from the current page.
 *   Pass this from location pages (e.g. "kuala-lumpur").
 *   Omit or pass undefined for homepage/blog/other pages.
 *
 * 4 modes:
 *
 * SINGLE: One default number → just return it.
 *
 * ROTATION: Multiple numbers for the domain → pick by weighted percentage.
 *
 * LOCATION: Query numbers matching the location_slug.
 *   If multiple → pick by weighted percentage.
 *   If none for this location → fall back to location_slug = "all".
 *
 * HYBRID: If locationSlug provided → query that location's numbers only.
 *   If no locationSlug (homepage/blog) → query location_slug = "all" only.
 *   In both cases, pick by weighted percentage if multiple.
 */
export async function getPhoneNumber(locationSlug?: string): Promise<PhoneResult> {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return { phone: FALLBACK_PHONE, whatsappText: FALLBACK_WA_TEXT, source: "fallback", mode: "fallback" };
    }

    const domain = await getHostDomain();
    const mode = await getLeadsMode(domain);

    // Fetch all active numbers for this domain
    const { data, error } = await supabase
      .from("phone_numbers")
      .select("phone_number, whatsapp_text, percentage, label, location_slug")
      .eq("website", domain)
      .eq("is_active", true);

    if (error || !data || data.length === 0) {
      return { phone: FALLBACK_PHONE, whatsappText: FALLBACK_WA_TEXT, source: "fallback", mode: "fallback" };
    }

    const rows = data as PhoneRow[];

    switch (mode) {
      case "single": {
        // Case 1: Just return the first (only) number
        return toResult(rows[0], mode);
      }

      case "rotation": {
        // Case 2: Pick from all numbers by weighted percentage
        return toResult(pickWeighted(rows), mode);
      }

      case "location": {
        // Case 3: Filter by location, then pick by percentage
        if (locationSlug) {
          const locationRows = rows.filter((r) => r.location_slug === locationSlug);
          if (locationRows.length > 0) {
            return toResult(pickWeighted(locationRows), mode);
          }
        }
        // Fallback to "all" if no location match or no locationSlug
        const allRows = rows.filter((r) => r.location_slug === "all");
        return toResult(pickWeighted(allRows.length > 0 ? allRows : rows), mode);
      }

      case "hybrid": {
        // Case 4: Location pages → location numbers only
        //         Other pages → "all" numbers only
        if (locationSlug && locationSlug !== "all") {
          const locationRows = rows.filter((r) => r.location_slug === locationSlug);
          if (locationRows.length > 0) {
            return toResult(pickWeighted(locationRows), mode);
          }
          // No numbers for this specific location → fall back to "all"
        }
        const allRows = rows.filter((r) => r.location_slug === "all");
        return toResult(pickWeighted(allRows.length > 0 ? allRows : rows), mode);
      }

      default: {
        return toResult(pickWeighted(rows), mode);
      }
    }
  } catch (err) {
    console.error("[getPhoneNumber] Unexpected error:", err);
    return { phone: FALLBACK_PHONE, whatsappText: FALLBACK_WA_TEXT, source: "fallback", mode: "fallback" };
  }
}

export function waLink(phone: string, message?: string): string {
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${phone}${query}`;
}

export async function getWhatsAppLink(locationSlug?: string): Promise<string> {
  const { phone, whatsappText } = await getPhoneNumber(locationSlug);
  return waLink(phone, whatsappText);
}
