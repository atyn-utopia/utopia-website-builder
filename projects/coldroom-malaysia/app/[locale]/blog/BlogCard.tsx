'use client';
import { trackBlog } from '@/lib/track';

interface Props {
  locale: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string | null;
  formattedDate: string;
  readMoreLabel: string;
}

export function BlogCard({ locale, slug, title, excerpt, coverImageUrl, formattedDate, readMoreLabel }: Props) {
  return (
    <a
      href={`/${locale}/blog/${slug}`}
      onClick={() => trackBlog(slug)}
      style={{
        display: 'block',
        background: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
        transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {coverImageUrl && (
        <div
          style={{
            width: '100%',
            height: '200px',
            backgroundImage: `url(${coverImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      <div style={{ padding: 'var(--space-lg)' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)' }}>
          {formattedDate}
        </p>
        <h3
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: 'var(--navy)',
            lineHeight: 'var(--leading-snug)',
            marginBottom: 'var(--space-sm)',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: '14px',
            color: 'var(--text-muted)',
            lineHeight: 'var(--leading-relaxed)',
            marginBottom: 'var(--space-md)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {excerpt}
        </p>
        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--orange)' }}>
          {readMoreLabel} &rarr;
        </span>
      </div>
    </a>
  );
}
