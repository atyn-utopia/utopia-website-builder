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
      className="blog-card"
    >
      <div className="blog-card-img">
        <img src={coverImageUrl || '/brand/hero.png'} alt={title} loading="lazy" />
      </div>
      <div className="blog-card-body">
        <span className="blog-card-date">{formattedDate}</span>
        <h3>{title}</h3>
        <p>{excerpt}</p>
        <span className="blog-card-more">{readMoreLabel} →</span>
      </div>
    </a>
  );
}
