'use client';

import type { AnchorHTMLAttributes, ReactNode } from 'react';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  phoneNumber: string;
  children: ReactNode;
};

/**
 * Anchor wrapper that fires `window.uwc('click', { label: 'whatsapp-<phone>' })`
 * on click before navigation runs. Works for any WhatsApp CTA — nav, hero,
 * sticky FAB, inline CTAs, blog CTA banner, footer.
 *
 * The original onClick (if any) still runs.
 */
export default function WaClickTracker({
  phoneNumber,
  onClick,
  children,
  ...rest
}: Props) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        if (typeof window !== 'undefined' && window.uwc) {
          window.uwc('click', { label: `whatsapp-${phoneNumber}` });
        }
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
