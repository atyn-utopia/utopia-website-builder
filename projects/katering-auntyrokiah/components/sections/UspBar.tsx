import { Sparkles, ShieldCheck, Clock4 } from 'lucide-react'

interface Props {
  cards: { title: string; body: string }[]
}

const ICONS = [Sparkles, ShieldCheck, Clock4]

export default function UspBar({ cards }: Props) {
  return (
    <section className="gradient-warm-white py-12 md:py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-3">
        {cards.map((c, i) => {
          const Icon = ICONS[i] ?? Sparkles
          return (
            <article
              key={i}
              className="flex h-full flex-col items-center gap-4 rounded-2xl border border-[var(--hairline)] bg-white p-6 text-center shadow-[0_10px_30px_-18px_var(--shadow-tint)] md:p-8"
            >
              <span
                className="flex h-14 w-14 items-center justify-center rounded-full ring-2 ring-[var(--saffron-soft)] [background-image:var(--grad-saffron)]"
              >
                <Icon size={24} strokeWidth={2} className="text-white" />
              </span>
              <h4 className="text-[18px] font-extrabold tracking-[-0.02em] text-[var(--ink)]">
                {c.title}
              </h4>
              <p className="text-[14px] leading-[1.7] text-[var(--ink-soft)]">
                {c.body}
              </p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
