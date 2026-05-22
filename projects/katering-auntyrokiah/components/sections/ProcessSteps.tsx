import { MessageCircle, CalendarCheck, Truck, PartyPopper } from 'lucide-react'
import { SectionHead } from '@/components/PageShell'

interface Step {
  title: string
  body: string
}

interface Props {
  eyebrow: string
  heading: string
  steps: Step[]
}

const ICONS = [MessageCircle, CalendarCheck, Truck, PartyPopper]

export default function ProcessSteps({ eyebrow, heading, steps }: Props) {
  return (
    <section className="bg-[var(--cream)] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex justify-center">
          <SectionHead eyebrow={eyebrow} heading={heading} align="center" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => {
            const Icon = ICONS[i] ?? MessageCircle
            return (
              <article
                key={i}
                className="relative flex h-full flex-col gap-4 rounded-2xl border border-[var(--hairline)] bg-white p-6 text-center shadow-[0_10px_30px_-22px_var(--shadow-tint)] sm:text-left"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[40px] font-extrabold tabular leading-none text-[var(--honey)] opacity-55">
                    0{i + 1}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--honey-soft)]">
                    <Icon size={20} strokeWidth={2} className="text-[var(--forest-deep)]" />
                  </span>
                </div>
                <h4 className="text-[18px] font-extrabold tracking-[-0.02em] text-[var(--ink)]">
                  {s.title}
                </h4>
                <p className="text-[14px] leading-[1.7] text-[var(--ink-soft)]">{s.body}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
