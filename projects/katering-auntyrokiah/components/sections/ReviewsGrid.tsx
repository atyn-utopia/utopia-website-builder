import { Star } from 'lucide-react'
import { GoogleG, SectionHead } from '@/components/PageShell'

interface Review {
  name: string
  city: string
  body: string
}

interface Props {
  eyebrow: string
  heading: string
  aggregateBadge: string
  aggregateSub: string
  postedOnGoogleLabel: string
  reviews: Review[]
}

export default function ReviewsGrid({
  eyebrow,
  heading,
  aggregateBadge,
  aggregateSub,
  postedOnGoogleLabel,
  reviews,
}: Props) {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex flex-col items-center text-center">
          <SectionHead eyebrow={eyebrow} heading={heading} align="center" />
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-[var(--hairline)] bg-white px-5 py-3 text-[14px]">
            <GoogleG size={22} />
            <span className="font-semibold text-[var(--ink)]">{aggregateBadge}</span>
            <span className="text-[var(--ink-soft)]">·</span>
            <span className="text-[var(--ink-soft)]">{aggregateSub}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {reviews.map((r, i) => (
            <article
              key={i}
              className="relative flex h-full flex-col gap-3 rounded-2xl border border-[var(--hairline)] bg-white p-6 shadow-[0_10px_30px_-22px_var(--shadow-tint)]"
            >
              <div className="absolute right-5 top-5">
                <GoogleG size={22} />
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={16}
                    fill="#FBBC04"
                    strokeWidth={0}
                    className="text-[var(--google-yellow)]"
                  />
                ))}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--honey-dark)]">
                {postedOnGoogleLabel}
              </p>
              <p className="text-[15px] leading-[1.7] text-[var(--ink-soft)]">
                “{r.body}”
              </p>
              <footer className="mt-auto border-t border-[var(--hairline)] pt-3 text-[14px]">
                <cite className="not-italic font-semibold text-[var(--ink)]">{r.name}</cite>
                <span className="text-[var(--ink-soft)]"> · {r.city}</span>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
