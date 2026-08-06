'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

export function WaIcon({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.913.913l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.353 0-4.528-.804-6.254-2.148l-.437-.35-3.329 1.116 1.116-3.329-.35-.437A9.956 9.956 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
    </svg>
  );
}

/**
 * Every WhatsApp CTA on the site goes through this button so each click is
 * recorded once, with a label naming the surface it came from.
 */
export function WhatsAppButton({
  href,
  label,
  className,
  children,
  ariaLabel,
}: {
  href: string;
  /** Surface name — becomes the `whatsapp-<label>` analytics event. */
  label: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <Link
      href={href}
      className={className}
      aria-label={ariaLabel}
      // Opens in a new tab so the site stays open behind WhatsApp and the
      // visitor can keep browsing after sending their message.
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        if (typeof window !== 'undefined' && typeof window.uwc === 'function') {
          window.uwc('click', { label: `whatsapp-${label}` });
        }
      }}
    >
      {children}
    </Link>
  );
}
