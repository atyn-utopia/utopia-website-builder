'use client';

import { useTranslations, useLocale } from 'next-intl';
import FomoBar from '@/components/FomoBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import BlogClickTracker from '@/components/tracking/BlogClickTracker';
import { waRedirect } from '@/lib/waRedirect';

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url: string;
  published_at: string;
}

interface Props {
  posts: Post[];
  chromeProvided?: boolean;
}

export default function BlogListClient({ posts, chromeProvided = false }: Props) {
  const t = useTranslations('blog');
  const locale = useLocale();
  const waHref = waRedirect(locale);

  return (
    <>
      {!chromeProvided && <FomoBar />}
      {!chromeProvided && <Navbar />}

      {/* Header banner — only when this client renders its own chrome. On the
          canonical /blog page the server renders the H1+H2 title, so this is
          gated off to avoid an empty gradient band. */}
      {!chromeProvided && (
        <section
          style={{
            background:
              'linear-gradient(135deg, #1c3a6a 0%, #1877b7 50%, #0e2040 100%)',
            padding: '56px 16px',
            color: '#FFFFFF',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <h1
              style={{
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: -0.5,
                margin: '0 0 10px',
                lineHeight: 1.2,
              }}
            >
              {t('title')}
            </h1>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.88)',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {t('metaDescription')}
            </h2>
          </div>
        </section>
      )}

      <section
        style={{
          padding: '40px 16px 64px',
          background: '#F0F4FA',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontSize: 18, color: 'rgba(28,58,106,0.65)' }}>{t('noPosts')}</p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 24,
              }}
            >
              {posts.map((post) => {
                const date = new Date(post.published_at);
                const formattedDate = date.toLocaleDateString(
                  locale === 'ms' ? 'ms-MY' : locale === 'zh' ? 'zh-CN' : 'en-MY',
                  { year: 'numeric', month: 'long', day: 'numeric' }
                );
                return (
                  <BlogClickTracker key={post.id} slug={post.slug}>
                  <a
                    href={`/${locale}/blog/${post.slug}`}
                    style={{
                      display: 'block',
                      background: '#FFFFFF',
                      borderRadius: 16,
                      overflow: 'hidden',
                      boxShadow:
                        '0 2px 6px rgba(15,31,80,0.04), 0 12px 28px rgba(15,31,80,0.06)',
                      transition:
                        'transform 180ms cubic-bezier(0.16,1,0.3,1), box-shadow 180ms cubic-bezier(0.16,1,0.3,1)',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    {post.cover_image_url && (
                      <div
                        style={{
                          width: '100%',
                          height: 200,
                          backgroundImage: `url(${post.cover_image_url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundColor: '#F0F4FA',
                        }}
                      />
                    )}
                    <div style={{ padding: 20 }}>
                      <p
                        style={{
                          fontSize: 13,
                          color: 'rgba(28,58,106,0.65)',
                          margin: '0 0 8px',
                        }}
                      >
                        {formattedDate}
                      </p>
                      <h3
                        style={{
                          fontSize: 19,
                          fontWeight: 700,
                          color: '#1c3a6a',
                          lineHeight: 1.3,
                          margin: '0 0 10px',
                        }}
                      >
                        {post.title}
                      </h3>
                      <p
                        style={{
                          fontSize: 14,
                          color: 'rgba(28,58,106,0.65)',
                          lineHeight: 1.6,
                          margin: '0 0 12px',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {post.excerpt}
                      </p>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: '#e63030',
                        }}
                      >
                        {t('readMore')} →
                      </span>
                    </div>
                  </a>
                  </BlogClickTracker>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* WhatsApp CTA banner */}
      <section
        style={{
          background:
            'linear-gradient(135deg, #1c3a6a 0%, #0e2040 100%)',
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
          <div style={{ display: 'inline-flex' }}>
            <WhatsAppButton href={waHref} label={t('ctaBannerCta')} variant="pill" />
          </div>
        </div>
      </section>

      {!chromeProvided && <Footer />}
      <WhatsAppButton href={waHref} label="WhatsApp" variant="floating" ariaLabel="WhatsApp" />
    </>
  );
}
