import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';
import { getBlogPosts } from '@/lib/webcore';
import { waRedirect } from '@/lib/waRedirect';
import { WhatsAppButton, WaIcon } from '@/components/WhatsAppButton';
import BlogNav from '@/components/BlogNav';
import SiteFooter from '@/components/SiteFooter';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.blogListing' });
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [l, `${siteConfig.url}/${l}/blog`]),
  );
  languages['x-default'] = `${siteConfig.url}/${routing.defaultLocale}/blog`;
  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: `${siteConfig.url}/${locale}/blog`, languages },
  };
}

export default async function BlogListing({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const posts = await getBlogPosts(locale);

  return (
    <>
      <BlogNav locale={locale} />

      <section className="blog-hero">
        <div className="blog-hero-bg" aria-hidden="true" />
        <div className="container blog-hero-inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href={`/${locale}`}>{t('breadcrumbHome')}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{t('breadcrumbBlog')}</span>
          </nav>
          <h1>{t('title')}</h1>
          <h2>{t('subtitle')}</h2>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {posts.length === 0 ? (
            <p className="blog-empty">{t('noPosts')}</p>
          ) : (
            <div className="blog-grid">
              {posts.map((post) => {
                const tr = post.blog_translations[0];
                return (
                  <article key={post.id} className="blog-card">
                    {post.cover_image_url && (
                      <Link href={`/${locale}/blog/${post.slug}`} className="blog-card-img">
                        <Image src={post.cover_image_url} alt={tr?.title ?? post.slug} width={600} height={350} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                      </Link>
                    )}
                    <div className="blog-card-body">
                      <p className="blog-card-date">{new Date(post.published_at).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      <h3><Link href={`/${locale}/blog/${post.slug}`}>{tr?.title}</Link></h3>
                      <p className="blog-card-excerpt">{tr?.excerpt}</p>
                      <Link href={`/${locale}/blog/${post.slug}`} className="blog-card-link">{t('readMore')} →</Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Blog CTA banner */}
      <section className="blog-cta">
        <div className="container blog-cta-inner">
          <div>
            <h3>{t('ctaBannerTitle')}</h3>
            <p>{t('ctaBannerBody')}</p>
          </div>
          <WhatsAppButton href={waRedirect(locale)} label="blog-cta" className="btn btn-wa">
            <WaIcon /> {t('ctaBannerLabel')}
          </WhatsAppButton>
        </div>
      </section>

      <SiteFooter locale={locale} />

      <style>{`
        .blog-hero { position: relative; color: #fff; padding: 56px 0 64px; overflow: hidden; }
        .blog-hero-bg {
          position: absolute; inset: 0;
          background-color: var(--brand-charcoal);
          background-image: var(--gradient-hero-glow),
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: auto, 56px 56px, 56px 56px;
        }
        .blog-hero-inner { position: relative; z-index: 1; text-align: center; }
        .breadcrumb { display: inline-flex; gap: 8px; font-size: 13px; color: rgba(255,255,255,0.6); margin: 0 0 18px; padding: 0; }
        .breadcrumb a { color: var(--brand-orange-bright); font-weight: 600; }
        .breadcrumb span[aria-hidden="true"] { color: rgba(255,255,255,0.3); }
        .breadcrumb [aria-current="page"] { color: #fff; font-weight: 600; }
        .blog-hero h1 { font-size: clamp(2rem, 4.5vw, 3.25rem); font-weight: 800; color: #fff; margin: 0; letter-spacing: -0.025em; }
        .blog-hero h2 { font-size: clamp(1rem, 1.5vw, 1.25rem); font-weight: 500; color: rgba(255,255,255,0.78); margin: 8px 0 0; }

        .blog-empty { text-align: center; color: var(--ink-muted); font-size: 16px; padding: 48px 0; }
        .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
        .blog-card { background: #fff; border: 1px solid var(--line); border-radius: var(--radius-card); overflow: hidden; display: flex; flex-direction: column; transition: transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out); }
        .blog-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
        .blog-card-img { display: block; aspect-ratio: 16/9; overflow: hidden; }
        .blog-card-body { padding: 22px; display: flex; flex-direction: column; gap: 8px; }
        .blog-card-date { font-family: var(--font-mono-stack); font-weight: 600; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-muted); margin: 0; }
        .blog-card h3 { font-size: 19px; font-weight: 700; color: var(--brand-charcoal); letter-spacing: -0.015em; line-height: 1.3; margin: 0; }
        .blog-card-excerpt { font-size: 14.5px; line-height: 1.6; color: var(--ink-muted); margin: 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .blog-card-link { color: var(--brand-orange-deep); font-weight: 700; font-size: 14px; margin-top: auto; }

        .blog-cta { background: var(--brand-orange-pale); padding: 56px 0; }
        .blog-cta-inner {
          display: flex; flex-direction: column; align-items: center; justify-content: space-between; gap: 24px;
          text-align: center;
        }
        @media (min-width: 768px) { .blog-cta-inner { flex-direction: row; text-align: left; } }
        .blog-cta h3 { font-size: 22px; font-weight: 700; color: var(--brand-charcoal); margin: 0 0 6px; letter-spacing: -0.015em; }
        .blog-cta p { font-size: 15px; color: var(--ink-muted); margin: 0; }
      `}</style>
    </>
  );
}
