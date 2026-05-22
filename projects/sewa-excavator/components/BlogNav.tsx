import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { WhatsAppButton, WaIcon } from './WhatsAppButton';
import { waRedirect } from '@/lib/waRedirect';
import { siteConfig } from '@/config/site';

export default async function BlogNav({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'nav' });
  return (
    <header className="blog-nav">
      <div className="container blog-nav-inner">
        <Link href={`/${locale}`} className="brand" aria-label={`${siteConfig.brandName} homepage`}>
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-name">{siteConfig.brandName}</span>
        </Link>
        <nav className="blog-nav-links">
          <Link href={`/${locale}#products`}>{t('products')}</Link>
          <Link href={`/${locale}#calculator`}>{t('calculator')}</Link>
          <Link href={`/${locale}#locations`}>{t('locations')}</Link>
          <Link href={`/${locale}/blog`}>{t('blog')}</Link>
        </nav>
        <div className="blog-nav-actions">
          <LanguageSwitcher />
          <WhatsAppButton href={waRedirect(locale)} label="blog-nav" className="btn btn-wa blog-nav-cta">
            <WaIcon size={16} />
            <span>{t('whatsappCta')}</span>
          </WhatsAppButton>
        </div>
      </div>
      <style>{`
        .blog-nav { position: sticky; top: 0; z-index: 40; background: rgba(255,255,255,0.94); backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); }
        .blog-nav-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px var(--gut); }
        .brand { display: inline-flex; align-items: center; gap: 10px; }
        .brand-mark { width: 26px; height: 26px; border-radius: 8px; background: var(--gradient-orange); }
        .brand-name { font-weight: 800; font-size: 16px; letter-spacing: -0.015em; color: var(--brand-charcoal); }
        .blog-nav-links { display: none; gap: 28px; }
        .blog-nav-links a { color: var(--ink-muted); font-weight: 500; font-size: 14px; }
        .blog-nav-links a:hover { color: var(--brand-orange-deep); }
        .blog-nav-actions { display: inline-flex; align-items: center; gap: 10px; }
        .blog-nav-cta { height: 42px; padding: 0 16px; font-size: 13px; }
        @media (min-width: 960px) { .blog-nav-links { display: inline-flex; } }
        @media (max-width: 640px) { .blog-nav-cta { display: none; } .brand-name { display: none; } }
      `}</style>
    </header>
  );
}
