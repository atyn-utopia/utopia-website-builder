import { EVENT } from "./event";

const TITLE = `${EVENT.name} — ${EVENT.subtitle}`;
const LOCATION = `${EVENT.venue}, ${EVENT.venueAddress}`;
const DETAILS = `You're invited to the ${EVENT.organizer} annual dinner. Dress code: ${EVENT.dressCode}. Present your QR ticket at the door.`;

/** Compact UTC form (YYYYMMDDTHHMMSSZ) used by Google + ICS. */
function toUtc(iso: string): string {
  return new Date(iso)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

/** Google Calendar "add event" template URL. */
export function googleCalendarUrl(): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: TITLE,
    dates: `${toUtc(EVENT.startsAt)}/${toUtc(EVENT.endsAt)}`,
    details: DETAILS,
    location: LOCATION,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function outlookDeeplink(host: string): string {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: TITLE,
    startdt: EVENT.startsAt,
    enddt: EVENT.endsAt,
    location: LOCATION,
    body: DETAILS,
  });
  return `https://${host}/calendar/0/deeplink/compose?${params.toString()}`;
}

/** Outlook.com (personal) deeplink. */
export function outlookLiveUrl(): string {
  return outlookDeeplink("outlook.live.com");
}

/** Office 365 / Outlook (work or school) deeplink. */
export function office365Url(): string {
  return outlookDeeplink("outlook.office.com");
}

/** ICS data URL — for Apple Calendar and Outlook desktop. */
export function icsDataUrl(): string {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hollywood Night//RSVP//EN",
    "BEGIN:VEVENT",
    `DTSTART:${toUtc(EVENT.startsAt)}`,
    `DTEND:${toUtc(EVENT.endsAt)}`,
    `SUMMARY:${TITLE}`,
    `LOCATION:${LOCATION}`,
    `DESCRIPTION:${DETAILS}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}
