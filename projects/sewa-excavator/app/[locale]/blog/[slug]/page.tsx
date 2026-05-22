import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';
import { getBlogPost, getBlogPostSlugs, getRecentBlogPosts } from '@/lib/webcore';
import { waRedirect } from '@/lib/waRedirect';
import { ArticleSchema } from '@/components/schema/ArticleSchema';
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema';
import { WhatsAppButton, WaIcon } from '@/components/WhatsAppButton';
import BlogNav from '@/components/BlogNav';
import SiteFooter from '@/components/SiteFooter';

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs();
  return slugs.flatMap((s) =>
    routing.locales.map((locale) => ({ locale, slug: s.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPost(slug, locale);
  if (!post) return {};
  const tr = post.blog_translations[0];
  const path = `/blog/${slug}`;
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [l, `${siteConfig.url}/${l}${path}`]),
  );
  languages['x-default'] = `${siteConfig.url}/${routing.defaultLocale}${path}`;
  return {
    title: tr.meta_title || `${tr.title} | ${siteConfig.brandName}`,
    description: tr.meta_description || tr.excerpt,
    alternates: { canonical: `${siteConfig.url}/${locale}${path}`, languages },
    openGraph: {
      type: 'article', title: tr.title, description: tr.excerpt,
      url: `${siteConfig.url}/${locale}${path}`,
      images: post.cover_image_url ? [{ url: post.cover_image_url, width: 1200, height: 630 }] : undefined,
      publishedTime: post.published_at,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getBlogPost(slug, locale);
  if (!post) notFound();
  const tr = post.blog_translations[0];
  const t = await getTranslations({ locale, namespace: 'blog' });
  const recent = await getRecentBlogPosts(locale, slug, 3);
  const wordCount = (tr.content || '').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(wordCount / 220));

  return (
    <>
      <BlogNav locale={locale} />
      <ArticleSchema
        locale={locale}
        slug={slug}
        title={tr.title}
        excerpt={tr.excerpt}
        coverImage={post.cover_image_url}
        publishedAt={post.published_at}
      />
      <BreadcrumbSchema
        items={[
          { name: t('breadcrumbHome'), url: `${siteConfig.url}/${locale}` },
          { name: t('breadcrumbBlog'), url: `${siteConfig.url}/${locale}/blog` },
          { name: tr.title, url: `${siteConfig.url}/${locale}/blog/${slug}` },
        ]}
      />

      <article className="post">
        <header className="post-header">
          <div className="container">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href={`/${locale}`}>{t('breadcrumbHome')}</Link>
              <span aria-hidden="true">/</span>
              <Link href={`/${locale}/blog`}>{t('breadcrumbBlog')}</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{tr.title}</span>
            </nav>
            <h1>{tr.title}</h1>
            <p className="post-excerpt">{tr.excerpt}</p>
            <p className="post-meta">
              <span>{t('publishedOn')} {new Date(post.published_at).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span aria-hidden="true">·</span>
              <span>{minutes} {t('minRead')}</span>
            </p>
          </div>
        </header>

        {post.cover_image_url && (
          <div className="container post-cover-wrap">
            <Image src={post.cover_image_url} alt={tr.title} width={1200} height={630} style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-md)' }} priority />
          </div>
        )}

        <div className="container post-body-wrap">
          <div className="post-body">
            <div className="blog-content" dangerouslySetInnerHTML={{ __html: tr.content }} />
            <div className="blog-cta-banner">
              <h3>{t('ctaBannerTitle')}</h3>
              <p>{t('ctaBannerBody')}</p>
              <WhatsAppButton href={waRedirect(locale)} label={`blog-${slug}`} className="btn btn-wa">
                <WaIcon /> {t('ctaBannerLabel')}
              </WhatsAppButton>
            </div>
          </div>
          {recent.length > 0 && (
            <aside className="post-sidebar">
              <h4>{t('recentPosts')}</h4>
              <ul>
                {recent.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/${locale}/blog/${r.slug}`}>{r.blog_translations[0]?.title}</Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </article>

      <SiteFooter locale={locale} />

      <style>{`
        .post-header { padding: 56px 0 32px; background: var(--brand-paper); border-bottom: 1px solid var(--line); }
        .post-header .breadcrumb { display: inline-flex; gap: 8px; font-size: 13px; color: var(--ink-muted); margin: 0 0 18px; padding: 0; }
        .post-header .breadcrumb a { color: var(--brand-orange-deep); font-weight: 600; }
        .post-header .breadcrumb [aria-current="page"] { color: var(--brand-charcoal); font-weight: 600; }
        .post-header h1 { font-size: clamp(2rem, 4vw, 2.875rem); font-weight: 800; color: var(--brand-charcoal); letter-spacing: -0.025em; line-height: 1.1; margin: 0 0 12px; max-width: 800px; }
        .post-excerpt { font-size: clamp(1rem, 1.4vw, 1.1875rem); color: var(--ink-muted); line-height: 1.6; max-width: 740px; margin: 0; }
        .post-meta { display: inline-flex; flex-wrap: wrap; gap: 10px; font-family: var(--font-mono-stack); font-weight: 600; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-faint); margin: 18px 0 0; }
        .post-cover-wrap { padding: 32px var(--gut); }
        .post-body-wrap { display: grid; grid-template-columns: 1fr; gap: 40px; padding: 32px var(--gut) 80px; }
        @media (min-width: 960px) { .post-body-wrap { grid-template-columns: minmax(0, 1fr) 280px; } }
        .post-body { max-width: 740px; }
        .blog-cta-banner { margin: 48px 0 0; background: var(--brand-orange-pale); border-radius: var(--radius-card); padding: 32px; text-align: center; border: 1px solid var(--brand-orange-ring); }
        .blog-cta-banner h3 { font-size: 22px; font-weight: 700; color: var(--brand-charcoal); margin: 0 0 8px; letter-spacing: -0.015em; }
        .blog-cta-banner p { font-size: 15px; color: var(--ink-muted); margin: 0 0 18px; }
        .post-sidebar { position: sticky; top: 100px; align-self: start; background: #fff; border: 1px solid var(--line); border-radius: var(--radius-card); padding: 22px; }
        .post-sidebar h4 { font-family: var(--font-mono-stack); font-weight: 700; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--brand-orange-deep); margin: 0 0 12px; }
        .post-sidebar ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
        .post-sidebar a { color: var(--ink); font-weight: 600; font-size: 14px; line-height: 1.4; }
        .post-sidebar a:hover { color: var(--brand-orange-deep); }
      `}</style>
    </>
  );
}
