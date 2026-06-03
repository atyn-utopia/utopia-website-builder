'use client';

import type { AnchorHTMLAttributes, ReactNode } from 'react';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  phoneNumber: string;
  children: ReactNode;
};

export default function WhatsAppClickTracker({
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
