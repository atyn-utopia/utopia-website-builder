import { Resend } from "resend";
import { EVENT } from "./event";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM_EMAIL;

function getClient() {
  if (!apiKey || !from) {
    throw new Error("Missing RESEND_API_KEY or RESEND_FROM_EMAIL in env.");
  }
  return { client: new Resend(apiKey), from };
}

type SendTicketsArgs = {
  to: string;
  guestName: string;
  ticketCount: number;
  pdf: Buffer;
};

export async function sendTicketsEmail({
  to,
  guestName,
  ticketCount,
  pdf,
}: SendTicketsArgs) {
  const { client, from } = getClient();

  const ticketsWord = ticketCount > 1 ? `${ticketCount} tickets` : "your ticket";

  const html = `
  <div style="background:#05060A;padding:40px 20px;font-family:'Helvetica Neue',Arial,sans-serif;color:#FBF7EC;">
    <div style="max-width:560px;margin:0 auto;background:#0B0D14;border:1px solid rgba(212,175,55,0.3);padding:40px;">
      <p style="font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#D4AF37;margin:0 0 16px 0;">◆ 16.05.2026 · Red Carpet Night</p>
      <h1 style="font-family:Georgia,serif;font-size:32px;color:#F6EBD0;margin:0 0 8px 0;font-style:italic;">You're on the list, ${escapeHtml(guestName)}.</h1>
      <p style="color:rgba(251,247,236,0.72);line-height:1.7;font-size:15px;margin:16px 0;">
        Welcome to <strong style="color:#F4DC86;">${EVENT.name}</strong> — ${EVENT.subtitle}.
        ${ticketsWord} ${ticketCount > 1 ? "are" : "is"} attached as a PDF.
        Present the QR code${ticketCount > 1 ? "s" : ""} at the door for entry.
      </p>
      <div style="height:1px;background:linear-gradient(90deg,transparent,#D4AF37,transparent);opacity:0.5;margin:24px 0;"></div>
      <p style="color:#F4DC86;font-size:13px;margin:4px 0;">${EVENT.dateLabel}</p>
      <p style="color:#F4DC86;font-size:13px;margin:4px 0;">${EVENT.timeLabel} · ${EVENT.venue}</p>
      <p style="color:#F4DC86;font-size:13px;margin:4px 0;">Dress: ${EVENT.dressCode}</p>
      <div style="height:1px;background:linear-gradient(90deg,transparent,#D4AF37,transparent);opacity:0.5;margin:24px 0;"></div>
      <p style="color:rgba(251,247,236,0.42);font-size:12px;font-style:italic;text-align:center;margin:0;">
        See you on the red carpet.
      </p>
    </div>
  </div>`;

  return client.emails.send({
    from,
    to,
    subject: `🎬 Your ${EVENT.name} ticket${ticketCount > 1 ? "s" : ""}`,
    html,
    attachments: [
      {
        filename: `hollywood-night-tickets.pdf`,
        content: pdf,
      },
    ],
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
