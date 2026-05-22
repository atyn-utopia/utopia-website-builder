import { Eyebrow } from '@/components/PageShell'

interface Props {
  eyebrow: string
  labels: string[]
}

export default function BrandStrip({ eyebrow, labels }: Props) {
  return (
    <section className="border-b border-[var(--hairline-soft)] bg-white py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-6">
        <Eyebrow>{eyebrow}</Eyebrow>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-12">
          {labels.map((label, i) => (
            <li
              key={i}
              className="text-[13px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-muted)] hover:text-[var(--forest-deep)]"
              style={{ transition: 'color 180ms ease' }}
            >
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
