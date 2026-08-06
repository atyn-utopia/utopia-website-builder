'use client';

import { useState } from 'react';

export interface Faq {
  q: string;
  a: string;
}

/**
 * Single-open accordion — matches the static page, where opening one answer
 * closed every other.
 */
export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => {
        const open = openIndex === i;
        return (
          <div
            key={faq.q}
            className={`faq-item bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden reveal ${open ? 'open' : ''}`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              aria-controls={`faq-answer-${i}`}
              className="w-full flex items-center justify-between p-4 md:p-5 text-left"
            >
              <span className="font-semibold text-gray-800 text-sm md:text-base pr-4">{faq.q}</span>
              <svg
                className="w-5 h-5 text-gray-400 shrink-0 faq-chevron"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div id={`faq-answer-${i}`} className="faq-answer px-4 md:px-5">
              <h6 className="body-text text-gray-600 text-sm pb-4">{faq.a}</h6>
            </div>
          </div>
        );
      })}
    </div>
  );
}
