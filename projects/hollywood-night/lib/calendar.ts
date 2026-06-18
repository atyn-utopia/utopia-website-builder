import { EVENT } from "./event";

/** Format an offset-aware ISO string to Google Calendar's compact UTC form. */
function toGCalDate(iso: string): string {
  return new Date(iso)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

/** Google Calendar "add event" template URL, built from the event config. */
export function googleCalendarUrl(): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${EVENT.name} — ${EVENT.subtitle}`,
    dates: `${toGCalDate(EVENT.startsAt)}/${toGCalDate(EVENT.endsAt)}`,
    details: `You're invited to the ${EVENT.organizer} annual dinner. Dress code: ${EVENT.dressCode}. Present your QR ticket at the door.`,
    location: `${EVENT.venue}, ${EVENT.venueAddress}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
