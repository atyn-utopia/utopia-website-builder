import { EVENT } from "./event";

const BASE_URL =
  process.env.REPLYBOX_BASE_URL ||
  "https://replybox-54au9.ondigitalocean.app";

/**
 * Send a WhatsApp text via the ReplyBox public API. Best-effort: returns
 * { ok:false } (and logs) on missing config or any error — never throws, so an
 * RSVP is never blocked by WhatsApp delivery.
 */
export async function sendWhatsAppText(
  to: string,
  text: string
): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.REPLYBOX_TOKEN;
  const channelId = process.env.REPLYBOX_CHANNEL_ID;
  if (!token || !channelId) {
    console.warn(
      "ReplyBox not configured (REPLYBOX_TOKEN / REPLYBOX_CHANNEL_ID missing) — skipping WhatsApp."
    );
    return { ok: false, error: "not configured" };
  }

  try {
    const res = await fetch(`${BASE_URL}/api/v1/public/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channelId,
        to,
        message_type: "text",
        body: { text },
      }),
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { detail?: string };
      const detail = data.detail ?? res.statusText;
      console.error("ReplyBox send failed", res.status, detail);
      return { ok: false, error: `${res.status} ${detail}` };
    }
    return { ok: true };
  } catch (err) {
    console.error("ReplyBox network error", err);
    return { ok: false, error: "network" };
  }
}

/** Confirmation message sent to a guest after they finish registering.
 * Pass `hostName` to address a plus-one as that guest's invitee. */
export function buildRsvpWhatsApp(
  name: string,
  retrieveUrl: string,
  hostName?: string
): string {
  const intro = hostName
    ? `Hi ${name}! 🎬 You're confirmed as ${hostName}'s guest for ${EVENT.name}.`
    : `Hi ${name}! 🎬 You're confirmed for ${EVENT.name}.`;
  return [
    intro,
    "",
    `🗓 ${EVENT.dateLabel}`,
    `🕕 ${EVENT.timeLabel}`,
    `📍 ${EVENT.venue}`,
    "",
    "View your e-ticket & QR code here:",
    retrieveUrl,
    "",
    "Please keep your QR — present it at the door for entry. See you on the red carpet! ⭐",
  ].join("\n");
}
