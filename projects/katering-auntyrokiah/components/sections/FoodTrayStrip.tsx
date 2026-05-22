// Horizontal food photo strip — matches the ref's thin buffet-tray banner that sits
// between the Locations grid and the Process section. Pure photo gallery, no copy.

const TRAY_IMAGES = [
  '/photos/gallery-2.jpg',
  '/photos/gallery-3.jpg',
  '/photos/gallery-4.jpg',
  '/photos/gallery-5.jpg',
  '/photos/gallery-6.jpg',
  '/photos/gallery-7.jpg',
]

export default function FoodTrayStrip() {
  return (
    <section className="bg-[var(--cream)] pb-12 md:pb-16">
      <div className="mx-auto max-w-7xl px-2">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {TRAY_IMAGES.map((src, i) => (
            <div
              key={i}
              className="relative aspect-[4/5] overflow-hidden rounded-lg bg-[var(--cream-warm)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
