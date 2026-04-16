import { useTranslations } from 'next-intl'

const images = [
  { src: '/gallery/gallery-1.webp', alt: { ms: 'Cat pagar rumah — kerja sebenar', en: 'Fence painting — real work', zh: '围栏油漆 — 实际工作' } },
  { src: '/gallery/gallery-2.webp', alt: { ms: 'Cat luar rumah — tukang cat profesional', en: 'Exterior painting — professional painter', zh: '外墙油漆 — 专业油漆工' } },
  { src: '/gallery/gallery-3.webp', alt: { ms: 'Cat luar bangunan — pasukan profesional', en: 'Building exterior — professional team', zh: '建筑外墙 — 专业团队' } },
  { src: '/gallery/gallery-4.webp', alt: { ms: 'Cat siling rumah — kerja dalam rumah', en: 'Ceiling painting — interior work', zh: '天花板油漆 — 室内工作' } },
  { src: '/gallery/gallery-5.webp', alt: { ms: 'Cat dinding hijau — kerja cat dalaman', en: 'Green wall painting — interior work', zh: '绿色墙壁油漆 — 室内工作' } },
  { src: '/gallery/gallery-6.webp', alt: { ms: 'Cat pagar — kerja luar rumah', en: 'Fence painting — outdoor work', zh: '围栏油漆 — 户外工作' } },
]

export function Gallery({ locale }: { locale: string }) {
  const t = useTranslations('gallery')

  return (
    <section id="gallery" className="section bg-cream">
      <div className="container-p">
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 48px' }}>
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="t-h2" style={{ marginTop: 18 }}>{t('heading')}</h2>
          <p className="t-lead" style={{ marginTop: 14 }}>{t('subheading')}</p>
        </div>
        <div
          className="gallery-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
          }}
        >
          {images.map((img, i) => (
            <figure
              key={i}
              style={{
                margin: 0,
                borderRadius: 20,
                overflow: 'hidden',
                aspectRatio: '4 / 3',
                position: 'relative',
                boxShadow: '0 12px 32px -12px rgba(23,168,144,0.22)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt[locale as keyof typeof img.alt] ?? img.alt.ms}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="eager"
              />
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(30,36,48,0) 55%, rgba(30,36,48,0.45) 100%)',
                  pointerEvents: 'none',
                }}
              />
            </figure>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 980px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 620px) {
          .gallery-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
