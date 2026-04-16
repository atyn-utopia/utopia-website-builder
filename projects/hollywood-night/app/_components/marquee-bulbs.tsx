export default function MarqueeBulbs({ count = 18 }: { count?: number }) {
  return (
    <div
      className="flex items-center justify-center gap-3 overflow-hidden no-scrollbar"
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="bulb inline-block w-1.5 h-1.5 rounded-full bg-gold-400"
          style={{
            boxShadow: "0 0 8px rgba(230,198,89,0.8)",
            animationDelay: `${(i % 4) * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}
