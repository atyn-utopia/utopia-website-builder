'use client';

import { trackWhatsApp } from '@/lib/track';
import { siteConfig } from '@/config/site';
import type { ReactNode, CSSProperties } from 'react';

interface Props {
  href: string;
  className?: string;
  style?: CSSProperties;
  phone?: string;
  children: ReactNode;
}

/**
 * Tiny client wrapper around an `<a>` tag that fires a `whatsapp-{phone}`
 * webcore click event before allowing the browser to follow the link.
 * Use anywhere a server component needs to render a WhatsApp CTA with tracking.
 */
export function TrackedWhatsAppLink({ href, className, style, phone, children }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsApp(phone ?? siteConfig.fallbackPhone)}
      className={className}
      style={style}
    >
      {children}
    </a>
  );
}
