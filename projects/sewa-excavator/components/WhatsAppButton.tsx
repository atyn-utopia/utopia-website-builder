'use client';

import Link from 'next/link';
import { siteConfig } from '@/config/site';

export function WhatsAppButton({
  href,
  label,
  className,
  children,
}: {
  href: string;
  label?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const onClick = () => {
    if (typeof window !== 'undefined' && typeof window.uwc === 'function') {
      const phone = siteConfig.fallbackPhone;
      window.uwc('click', {
        label: `whatsapp-${phone}${label ? `-${label}` : ''}`,
      });
    }
  };

  return (
    <Link href={href} onClick={onClick} className={className} prefetch={false}>
      {children}
    </Link>
  );
}

export function WaIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.5 3.5A11 11 0 0 0 3.6 17.4L2 22l4.7-1.5A11 11 0 1 0 20.5 3.5ZM12 20a8.8 8.8 0 0 1-4.7-1.3l-.3-.2-2.8.9.9-2.7-.2-.3A8.9 8.9 0 1 1 12 20Zm5-6.6c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1l-.8.9c-.1.2-.3.2-.6.1a7.3 7.3 0 0 1-3.6-3.1c-.3-.5.3-.5.8-1.6.1-.2 0-.3 0-.5l-.9-2.1c-.2-.5-.5-.4-.6-.5h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7a10 10 0 0 0 4 3.5c2.4 1 2.4.7 2.8.7s1.7-.7 1.9-1.4c.2-.7.2-1.3.1-1.4l-.6-.3Z"/>
    </svg>
  );
}
