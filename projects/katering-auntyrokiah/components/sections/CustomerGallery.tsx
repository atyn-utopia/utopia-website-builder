import { Eyebrow } from '@/components/PageShell'

interface Props {
  eyebrow: string
  heading: string
  alts: string[]
}

// Local Pexels images — downloaded into /public/photos. Always render reliably.
const GALLERY_IMAGES = [
  '/photos/gallery-1.jpg',
  '/photos/gallery-2.jpg',
  '/photos/gallery-3.jpg',
  '/photos/gallery-4.jpg',
  '/photos/gallery-5.jpg',
  '/photos/gallery-6.jpg',
  '/photos/gallery-7.jpg',
  '/photos/gallery-8.jpg',
]

// Stats hero row above the mosaic — matches the cateringservice.my reference where
// a big yellow numeral sits above a 4-up photo mosaic of past majlis.
export default function CustomerGallery({ eyebrow, heading, alts }: Props) {
  const slots = GALLERY_IMAGES.slice(0, 8)
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <Eyebrow>{eyebrow}</Eyebrow>
          <p className="font-extrabold leading-none tabular text-[var(--honey)]" style={{ fontSize: 'clamp(56px, 9vw, 96px)' }}>
            5,000+
          </p>
          <h3 className="max-w-[28ch] text-[clamp(22px,3vw,32px)] font-extrabold leading-[1.15] tracking-[-0.025em] text-[var(--forest-deep)]">
            {heading}
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {slots.map((src, i) => (
            <figure
              key={i}
              className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-[var(--cream)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alts[i] ?? ''}
                className="h-full w-full object-cover group-hover:scale-[1.04]"
                style={{ transition: 'transform 260ms ease' }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{
                  background: 'linear-gradient(180deg, transparent 50%, rgba(14, 61, 42, 0.35) 100%)',
                  transition: 'opacity 250ms ease',
                }}
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
