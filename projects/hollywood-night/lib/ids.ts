import { randomBytes } from "crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomCode(length: number): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) out += ALPHABET[bytes[i] % ALPHABET.length];
  return out;
}

export function generateGuestId(): string {
  return `HN-${randomCode(4)}-${randomCode(4)}`;
}

export function generateTicketId(): string {
  return `T-${randomCode(5)}-${randomCode(5)}`;
}
