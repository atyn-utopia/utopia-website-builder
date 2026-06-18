const FRAMES = ["11", "12", "13", "14", "15", "16", "17", "18"];

/** Auto-scrolling, looping horizontal film strip. */
export default function FilmStrip() {
  // Duplicate the set so the -50% translate loops seamlessly.
  const frames = [...FRAMES, ...FRAMES];
  return (
    <section
      aria-hidden
      className="relative w-full overflow-hidden bg-[#0a0a0a] border-y border-gold-500/20 py-2"
    >
      <div className="film-perf" />
      <div className="film-track flex gap-2 py-2">
        {frames.map((n, i) => (
          <div
            key={`${n}-${i}`}
            className="film-grain shrink-0 border border-black/80 bg-black overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/film-strip/${n}.png`}
              alt=""
              className="h-36 sm:h-48 w-auto object-cover block"
            />
          </div>
        ))}
      </div>
      <div className="film-perf" />
    </section>
  );
}
