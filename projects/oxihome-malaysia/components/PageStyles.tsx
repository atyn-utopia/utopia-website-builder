// PageStyles for oxihome-malaysia.
//
// The legacy oxihome layout ships its own stylesheet (app/globals.css) with
// the teal brand palette, so this component renders only a minimal heading
// normaliser. When body text is wrapped in heading tags (per the
// keyword-driven heading rule) the browser's default bold/oversized heading
// styles must be reset to inherit, otherwise an <h5> used as a card body
// would render huge and bold.
export default function PageStyles() {
  return (
    <style>{`
      .usp-cell h4, .usp-cell h5, .usp-cell h6,
      .product-card h5, .product-card h6,
      .blog-card h4, .blog-card h5 { font-weight: inherit; }
    `}</style>
  );
}
