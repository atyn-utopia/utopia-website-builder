import { supabase } from "./supabase";
import { headers } from "next/headers";

const FALLBACK_PHONE = "60174287801";
const FALLBACK_WA_TEXT = "Hi, I need a 24-hour electrician.";

type LeadsMode = "single" | "rotation" | "location" | "hybrid";

interface PhoneRow {
  phone_number: string;
  whatsapp_text: string | null;
  percentage: number | null;
  label: string | null;
  location_slug: string | null;
}

export interface PhoneResult {
  phone: string;
  whatsappText: string;
  source: "database" | "fallback";
  mode: LeadsMode | "fallback";
}

function pickWeighted(rows: PhoneRow[]): PhoneRow | undefined {
  if (rows.length === 0) return undefined;
  if (rows.length === 1) return rows[0];
  const total = rows.reduce((sum, r) => sum + (r.percentage || 1), 0);
  let roll = Math.random() * total;
  for (const row of rows) {
    roll -= row.percentage || 1;
    if (roll <= 0) return row;
  }
  return rows[rows.length - 1];
}

function findDefaultRow(rows: PhoneRow[]): PhoneRow | undefined {
  return rows.find((r) => r.label === "default");
}

async function getHostDomain(): Promise<string> {
  try {
    const h = await headers();
    const host = h.get("host") || h.get("x-forwarded-host") || "";
    return host.replace(/:\d+$/, "");
  } catch {
    return "";
  }
}

async function getLeadsMode(domain: string): Promise<LeadsMode> {
  try {
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

function fallbackResult(): PhoneResult {
  return {
    phone: FALLBACK_PHONE,
    whatsappText: FALLBACK_WA_TEXT,
    source: "fallback",
    mode: "fallback",
  };
}

function toResult(
  row: PhoneRow | undefined,
  mode: LeadsMode,
  host: string,
): PhoneResult {
  if (!row) return fallbackResult();
  const text = row.whatsapp_text || FALLBACK_WA_TEXT;
  return {
    phone: row.phone_number,
    whatsappText: `Hi ${host}, ${text}`,
    source: "database",
    mode,
  };
}

export async function getPhoneNumber(
  locationSlug?: string,
): Promise<PhoneResult> {
  try {
    if (!supabase) return fallbackResult();

    const domain = await getHostDomain();
    const mode = await getLeadsMode(domain);

    const { data, error } = await supabase
      .from("phone_numbers")
      .select("phone_number, whatsapp_text, percentage, label, location_slug")
      .eq("website", domain)
      .eq("is_active", true);

    if (error || !data || data.length === 0) return fallbackResult();

    const rows = data as PhoneRow[];
    const defaultRow = findDefaultRow(rows);

    switch (mode) {
      case "single":
        return toResult(defaultRow ?? rows[0], mode, domain);

      case "rotation":
        return toResult(pickWeighted(rows), mode, domain);

      case "location": {
        if (locationSlug) {
          const locRows = rows.filter((r) => r.location_slug === locationSlug);
          if (locRows.length > 0) {
            return toResult(pickWeighted(locRows), mode, domain);
          }
        }
        return toResult(defaultRow, mode, domain);
      }

      case "hybrid": {
        if (locationSlug && locationSlug !== "all") {
          const locRows = rows.filter((r) => r.location_slug === locationSlug);
          if (locRows.length > 0) {
            return toResult(pickWeighted(locRows), mode, domain);
          }
        }
        return toResult(defaultRow, mode, domain);
      }

      default:
        return toResult(defaultRow, mode, domain);
    }
  } catch (err) {
    console.error("[getPhoneNumber] Unexpected error:", err);
    return fallbackResult();
  }
}

export function waLink(phone: string, message?: string): string {
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${phone}${query}`;
}

export async function getWhatsAppLink(
  locationSlug?: string,
  messageOverride?: string,
): Promise<string> {
  const { phone, whatsappText } = await getPhoneNumber(locationSlug);
  return waLink(phone, messageOverride || whatsappText);
}
