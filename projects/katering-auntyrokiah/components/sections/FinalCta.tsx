import { Button, Eyebrow, WhatsAppIcon } from '@/components/PageShell'
import WhatsAppClickTracker from '@/components/tracking/WhatsAppClickTracker'

interface Props {
  eyebrow: string
  heading: string
  body: string
  buttonLabel: string
  waHref: string
  phone: string
}

export default function FinalCta({
  eyebrow,
  heading,
  body,
  buttonLabel,
  waHref,
  phone,
}: Props) {
  return (
    <section
      className="relative overflow-hidden bg-[var(--charcoal-deep)]"
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 50%, rgba(244, 193, 21, 0.18) 0%, transparent 65%)',
      }}
    >
      {/* Top honey seam */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: 'var(--grad-honey)' }}
      />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 py-16 text-center md:py-20">
        <Eyebrow variant="light" className="mb-4">
          {eyebrow}
        </Eyebrow>

        <h3 className="text-[clamp(26px,3.6vw,38px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-white">
          {heading}
        </h3>

        <p className="mt-4 max-w-[42ch] text-[15px] leading-[1.7] text-white/75 md:text-[16px]">
          {body}
        </p>

        <div className="mt-8 w-full sm:w-auto">
          <WhatsAppClickTracker phone={phone}>
            <Button
              href={waHref}
              variant="whatsapp"
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
              fullWidth
              className="sm:!w-auto"
            >
              <WhatsAppIcon size={20} />
              {buttonLabel}
            </Button>
          </WhatsAppClickTracker>
        </div>
      </div>
    </section>
  )
}
