'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { SectionHead } from '@/components/PageShell'

interface QA {
  q: string
  a: string
}

interface Props {
  eyebrow: string
  heading: string
  items: QA[]
}

export default function Faq({ eyebrow, heading, items }: Props) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="bg-[var(--cream)] py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-10 flex justify-center">
          <SectionHead eyebrow={eyebrow} heading={heading} align="center" />
        </div>
        <ul className="flex flex-col divide-y divide-[var(--hairline)] rounded-2xl border border-[var(--hairline)] bg-white shadow-[0_10px_30px_-22px_var(--shadow-tint)]">
          {items.map((it, i) => {
            const isOpen = open === i
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-start justify-between gap-4 p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--saffron)] focus-visible:ring-inset"
                >
                  <h4 className="text-[16px] font-bold leading-[1.4] text-[var(--ink)]">
                    {it.q}
                  </h4>
                  <ChevronDown
                    size={20}
                    strokeWidth={1.75}
                    className="shrink-0 text-[var(--honey-dark)]"
                    style={{
                      transform: `rotate(${isOpen ? 180 : 0}deg)`,
                      transition: 'transform 200ms ease-out',
                    }}
                  />
                </button>
                {isOpen ? (
                  <div className="px-6 pb-6">
                    <p className="text-[15px] leading-[1.7] text-[var(--ink-soft)]">
                      {it.a}
                    </p>
                  </div>
                ) : null}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
