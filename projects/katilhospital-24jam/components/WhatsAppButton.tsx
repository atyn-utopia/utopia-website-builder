'use client';

import { trackWhatsApp } from '@/lib/track';
import { siteConfig } from '@/config/site';

const WA_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

interface WhatsAppButtonProps {
  href: string;
  label: string;
  variant?: 'pill' | 'full' | 'compact' | 'floating';
  locationSlug?: string;
  ariaLabel?: string;
}

export default function WhatsAppButton({
  href,
  label,
  variant = 'pill',
  locationSlug,
  ariaLabel,
}: WhatsAppButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#25D366',
    color: '#FFFFFF',
    fontWeight: 700,
    fontSize: 14,
    fontFamily: 'Inter, sans-serif',
    borderRadius: 9999,
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 14px rgba(37,211,102,0.35)',
    transition: 'transform 150ms cubic-bezier(0.16,1,0.3,1), opacity 150ms cubic-bezier(0.16,1,0.3,1)',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    pill: { padding: '11px 22px' },
    compact: { padding: '9px 16px', fontSize: 13 },
    full: { padding: '14px 24px', width: '100%', fontSize: 15 },
    floating: {
      padding: 0,
      width: 56,
      height: 56,
      borderRadius: '50%',
      position: 'fixed',
      right: 20,
      bottom: 20,
      zIndex: 50,
      boxShadow: '0 10px 24px rgba(37,211,102,0.5)',
    },
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel || label}
      onClick={() => trackWhatsApp(siteConfig.fallbackPhone, locationSlug)}
      style={{ ...baseStyle, ...variantStyles[variant] }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.backgroundColor = '#1EBE57';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.backgroundColor = '#25D366';
      }}
    >
      {WA_ICON}
      {variant !== 'floating' && <span>{label}</span>}
    </a>
  );
}
