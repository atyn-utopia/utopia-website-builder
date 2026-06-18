const LOGOS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const ROWS = 5;
const PER_ROW = 12;

/** Red-carpet style step-and-repeat backdrop of company logos (white on dark). */
export default function LogoBackdrop() {
  return (
    <section
      aria-hidden
      className="relative w-full overflow-hidden bg-[#0b0b0b] border-t border-gold-500/15 py-8"
    >
      <div className="flex flex-col items-center gap-6 sm:gap-9">
        {Array.from({ length: ROWS }).map((_, r) => (
          <div
            key={r}
            className="flex shrink-0 items-center justify-center gap-9 sm:gap-16"
            style={{ transform: r % 2 === 1 ? "translateX(3.5rem)" : "translateX(-1.5rem)" }}
          >
            {Array.from({ length: PER_ROW }).map((_, i) => {
              const n = LOGOS[(r * 4 + i) % LOGOS.length];
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={`/logo-backdrop/${n}.png`}
                  alt=""
                  className="shrink-0 w-14 h-14 sm:w-20 sm:h-20 object-contain opacity-80"
                  style={{
                    mixBlendMode: "screen",
                    filter: "grayscale(1) brightness(6) contrast(4)",
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
