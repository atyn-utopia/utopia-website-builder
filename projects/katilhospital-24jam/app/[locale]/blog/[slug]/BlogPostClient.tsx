'use client';

import { useTranslations, useLocale } from 'next-intl';
import FomoBar from '@/components/FomoBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { waRedirect } from '@/lib/waRedirect';
import { trackClick } from '@/lib/track';

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url: string;
  published_at: string;
  content: string;
}

interface Props {
  post: Post;
  recentPosts: Post[];
  readingTime: number;
  formattedDate: string;
  chromeProvided?: boolean;
}

export default function BlogPostClient({
  post,
  recentPosts,
  readingTime,
  formattedDate,
  chromeProvided = false,
}: Props) {
  const t = useTranslations('blog');
  const locale = useLocale();
  const waHref = waRedirect(locale);

  return (
    <>
      {!chromeProvided && <FomoBar />}
      {!chromeProvided && <Navbar />}

      {/* Breadcrumbs — server page renders the canonical breadcrumb when chromeProvided */}
      {!chromeProvided && (
      <nav
        aria-label="Breadcrumb"
        style={{
          background: '#F0F4FA',
          padding: '12px 16px',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            fontSize: 13,
            color: 'rgba(28,58,106,0.65)',
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          <a href={`/${locale}`} style={{ color: 'rgba(28,58,106,0.65)' }}>
            {t('breadcrumbHome')}
          </a>
          <span aria-hidden="true">›</span>
          <a href={`/${locale}/blog`} style={{ color: 'rgba(28,58,106,0.65)' }}>
            {t('breadcrumbBlog')}
          </a>
          <span aria-hidden="true">›</span>
          <span style={{ color: '#1c3a6a', fontWeight: 600 }}>{post.title}</span>
        </div>
      </nav>
      )}

      {/* Article */}
      <section style={{ padding: '40px 16px' }}>
        <article
          style={{
            maxWidth: 740,
            margin: '0 auto',
          }}
        >
          {post.cover_image_url && (
            <div
              style={{
                width: '100%',
                height: 340,
                backgroundImage: `url(${post.cover_image_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 16,
                marginBottom: 24,
              }}
            />
          )}

          {!chromeProvided && (
            <h1
              style={{
                fontSize: 'clamp(26px, 4vw, 38px)',
                fontWeight: 800,
                color: '#1c3a6a',
                lineHeight: 1.2,
                letterSpacing: -0.4,
                margin: '0 0 14px',
              }}
            >
              {post.title}
            </h1>
          )}

          {!chromeProvided && (
            <h2
              style={{
                fontSize: 17,
                fontWeight: 500,
                color: '#334155',
                lineHeight: 1.6,
                margin: '0 0 20px',
              }}
            >
              {post.excerpt}
            </h2>
          )}

          {!chromeProvided && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 32,
              fontSize: 13,
              color: 'rgba(28,58,106,0.65)',
            }}
          >
            <span>
              {t('publishedOn')} {formattedDate}
            </span>
            <span
              aria-hidden="true"
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: '#94A3B8',
              }}
            />
            <span>
              {readingTime} {t('minRead')}
            </span>
          </div>
          )}

          {/* TOC is authored inside the DB content (<nav> with correct in-page
              anchors) and rendered by .blog-content below — no client-generated
              duplicate. */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </section>

      {/* WhatsApp CTA banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1c3a6a 0%, #0e2040 100%)',
          padding: '48px 16px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h3
            style={{
              fontSize: 'clamp(20px, 3vw, 28px)',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: '0 0 18px',
            }}
          >
            {t('ctaBannerTitle')}
          </h3>
          <div
            style={{ display: 'inline-flex' }}
            onClick={() => trackClick(`blog-${post.slug}`)}
          >
            <WhatsAppButton href={waHref} label={t('ctaBannerCta')} variant="pill" />
          </div>
        </div>
      </section>

      {/* Recent posts */}
      {recentPosts.length > 0 && (
        <section
          style={{
            padding: '64px 16px',
            background: '#F0F4FA',
          }}
        >
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <h3
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: '#1c3a6a',
                margin: '0 0 20px',
                textAlign: 'center',
              }}
            >
              {t('recentPosts')}
            </h3>
            <div
              style={{
                display: 'grid',
                gap: 20,
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              }}
            >
              {recentPosts.map((rp) => (
                <a
                  key={rp.id}
                  href={`/${locale}/blog/${rp.slug}`}
                  onClick={() => trackClick(`blog-${rp.slug}`)}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 14,
                    overflow: 'hidden',
                    boxShadow:
                      '0 2px 6px rgba(15,31,80,0.04), 0 12px 28px rgba(15,31,80,0.06)',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  {rp.cover_image_url && (
                    <div
                      style={{
                        width: '100%',
                        height: 160,
                        backgroundImage: `url(${rp.cover_image_url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                  )}
                  <div style={{ padding: 16 }}>
                    <h4
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: '#1c3a6a',
                        lineHeight: 1.35,
                        margin: 0,
                      }}
                    >
                      {rp.title}
                    </h4>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {!chromeProvided && <Footer />}
      <WhatsAppButton href={waHref} label="WhatsApp" variant="floating" ariaLabel="WhatsApp" />
    </>
  );
}
