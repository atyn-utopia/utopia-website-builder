import { EVENT } from "./event";

// WhatsApp is sent through the shared Supabase edge function `send-message`,
// which wraps ReplyBox server-side (channel + token live in the function).
// Auth is the Supabase key we already have; no ReplyBox token in this app.
const SEND_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, "")}/functions/v1/send-message`
  : "";

/**
 * Send a WhatsApp text. Best-effort: returns { ok:false } (and logs) on missing
 * config or any error — never throws, so an RSVP is never blocked.
 */
export async function sendWhatsAppText(
  to: string,
  text: string
): Promise<{ ok: boolean; error?: string }> {
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!SEND_URL || !key) {
    console.warn(
      "send-message not configured (NEXT_PUBLIC_SUPABASE_URL / Supabase key missing) — skipping WhatsApp."
    );
    return { ok: false, error: "not configured" };
  }

  try {
    const res = await fetch(SEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, text }),
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as {
        detail?: unknown;
      };
      const detail =
        typeof data.detail === "string"
          ? data.detail
          : JSON.stringify(data.detail ?? res.statusText);
      console.error("send-message failed", res.status, detail);
      return { ok: false, error: `${res.status} ${detail}` };
    }
    return { ok: true };
  } catch (err) {
    console.error("send-message network error", err);
    return { ok: false, error: "network" };
  }
}

/** Confirmation message sent to a guest after they finish registering. */
export function buildRsvpWhatsApp(
  name: string,
  retrieveUrl: string,
  rsvpType: "staff" | "vip" = "staff"
): string {
  const typeLabel = rsvpType === "vip" ? "VIP Guest" : "Staff Guest";
  return [
    `Hi ${name}!`,
    "",
    "🎬 You're confirmed for *Utopia Hollywood Red Carpet Night.*",
    "",
    `🗓 ${EVENT.dateLabel}`,
    `🕕 ${EVENT.timeLabel}`,
    `📍 ${EVENT.venue}`,
    `👤 ${typeLabel}`,
    "",
    "View your e-ticket & QR code here:",
    retrieveUrl,
    "",
    "Please keep your QR — present it at the door for entry. See you on the red carpet! ⭐",
  ].join("\n");
}
