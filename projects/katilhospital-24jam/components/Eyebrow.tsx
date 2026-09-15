// Section eyebrow: the logo's red cross + a short navy label. Every section
// head is eyebrow → H3 title → subtext. Navy text rather than red because red
// on the pale section grounds falls under 4.5:1 at 13px. Styles: .kh-eyebrow
// in globals.css; `onDark` is the variant for the navy final-CTA band.
export default function Eyebrow({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  return (
    <p className={`kh-eyebrow${onDark ? ' kh-eyebrow--dark' : ''}`}>
      <span className="kh-eyebrow-cross" aria-hidden="true" />
      {children}
    </p>
  );
}
