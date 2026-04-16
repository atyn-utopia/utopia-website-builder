import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "hn_admin";

function getSecrets() {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!password || !secret) {
    throw new Error("Missing ADMIN_PASSWORD or ADMIN_SESSION_SECRET in env.");
  }
  return { password, secret };
}

export function makeAdminToken(): string {
  const { password, secret } = getSecrets();
  return createHmac("sha256", secret).update(password).digest("hex");
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const expected = makeAdminToken();
    const a = Buffer.from(token, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return verifyAdminToken(token);
}

export const ADMIN_COOKIE = COOKIE_NAME;
