// Malaysian phone validation.
// Accepts E.164 format with country code 60. Mobile numbers start with 1
// (e.g. +60123456789). Length after +60 is 9–11 digits.

const E164_MY = /^\+60\d{9,11}$/;

export function isValidMyPhone(value: string): boolean {
  return E164_MY.test(value.trim());
}

/** Strip everything except digits from a user-entered local part. */
export function sanitizeDigits(raw: string): string {
  return raw.replace(/\D/g, "");
}

/** Combine fixed +60 prefix with digits-only local part. */
export function formatMyPhone(digitsOnly: string): string {
  const d = sanitizeDigits(digitsOnly).replace(/^60/, "");
  return `+60${d}`;
}
