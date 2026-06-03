'use client';

import type { AnchorHTMLAttributes, ReactNode } from 'react';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  label?: string;
  children: ReactNode;
};

/**
 * Anchor wrapper that fires `window.uwc('click', { label: 'whatsapp-<label>' })`
 * on click before navigation runs. Works for any WhatsApp CTA — nav, hero,
 * sticky FAB, inline CTAs, footer.
 *
 * The original onClick (if any) still runs.
 */
export default function WhatsAppClickTracker({
  label = 'cta',
  onClick,
  children,
  ...rest
}: Props) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        if (typeof window !== 'undefined' && typeof window.uwc === 'function') {
          window.uwc('click', { label: `whatsapp-${label}` });
        }
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
