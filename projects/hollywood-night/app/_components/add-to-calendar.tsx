import {
  googleCalendarUrl,
  outlookLiveUrl,
  office365Url,
  icsDataUrl,
} from "@/lib/calendar";

/** "Add to Your Calendar" — blue CTA plus per-provider logo links. */
export default function AddToCalendar({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <a
        href={googleCalendarUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-[#4285F4] hover:bg-[#3b78e7] text-white px-7 py-3 text-sm font-medium tracking-wide transition-[transform,background-color] duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4285F4]"
      >
        Add to Your Calendar
      </a>

      <div className="flex items-center gap-5">
        <a
          href={icsDataUrl()}
          download="hollywood-night.ics"
          title="Apple Calendar"
          aria-label="Add to Apple Calendar"
          className="opacity-80 hover:opacity-100 transition-opacity"
        >
          <AppleIcon />
        </a>
        <a
          href={googleCalendarUrl()}
          target="_blank"
          rel="noopener noreferrer"
          title="Google Calendar"
          aria-label="Add to Google Calendar"
          className="opacity-80 hover:opacity-100 transition-opacity"
        >
          <GoogleIcon />
        </a>
        <a
          href={outlookLiveUrl()}
          target="_blank"
          rel="noopener noreferrer"
          title="Outlook.com"
          aria-label="Add to Outlook.com"
          className="opacity-80 hover:opacity-100 transition-opacity"
        >
          <OutlookIcon />
        </a>
        <a
          href={office365Url()}
          target="_blank"
          rel="noopener noreferrer"
          title="Office 365"
          aria-label="Add to Office 365"
          className="opacity-80 hover:opacity-100 transition-opacity"
        >
          <OutlookIcon />
        </a>
      </div>
    </div>
  );
}

function AppleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" aria-hidden>
      <path d="M16.365 1.43c0 1.14-.467 2.21-1.22 3.003-.81.85-2.13 1.51-3.23 1.42-.14-1.1.42-2.28 1.16-3.03.81-.83 2.22-1.45 3.29-1.49.03.03.03.06 0 .1zM20.5 17.2c-.55 1.27-.81 1.83-1.52 2.95-.99 1.56-2.39 3.5-4.12 3.51-1.54.02-1.93-1.01-4.02-1-2.09.01-2.52 1.02-4.06 1.01-1.73-.01-3.05-1.76-4.04-3.32-2.83-4.34-3.13-9.43-1.38-12.14 1.24-1.93 3.2-3.06 5.04-3.06 1.88 0 3.06 1.03 4.62 1.03 1.51 0 2.43-1.03 4.6-1.03 1.64 0 3.38.89 4.62 2.43-4.06 2.22-3.4 8.02.78 9.69z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C39.9 36.6 44 31 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}

function OutlookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="3" fill="#0F6CBD" />
      <text
        x="12"
        y="16.5"
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill="#fff"
        fontFamily="Arial, sans-serif"
      >
        O
      </text>
    </svg>
  );
}
