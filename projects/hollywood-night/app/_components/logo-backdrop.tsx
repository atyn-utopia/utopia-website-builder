const LOGOS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const ROWS = 5;
const PER_ROW = 18;

/** Red-carpet style step-and-repeat backdrop of company logos (white on dark). */
export default function LogoBackdrop() {
  return (
    <section
      aria-hidden
      className="relative w-full overflow-hidden bg-[#0b0b0b] border-t border-gold-500/15 py-8"
    >
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        {Array.from({ length: ROWS }).map((_, r) => (
          <div
            key={r}
            className="flex shrink-0 items-center justify-center gap-4 sm:gap-7"
            style={{ transform: r % 2 === 1 ? "translateX(2.5rem)" : "translateX(-1rem)" }}
          >
            {Array.from({ length: PER_ROW }).map((_, i) => {
              const n = LOGOS[(r * 4 + i) % LOGOS.length];
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={`/logo-backdrop/${n}.png`}
                  alt=""
                  className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 object-contain opacity-80"
                  style={{ mixBlendMode: "screen" }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
