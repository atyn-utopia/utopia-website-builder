// Shared page-level style block used by the homepage and every location page.
// Normalises body copy that is wrapped in heading tags (h5/h6 per the house
// rule "every visible text element sits inside a heading tag") so it still
// reads at body weight, not the browser-default bold heading weight.
export default function PageStyles() {
  return (
    <style>{`
      /* Body copy wrapped in h5/h6 must not pick up the browser's huge bold
         heading defaults — inherit the surrounding body size + weight. */
      h5.body-h5, h6.body-h6 { font-weight: inherit; font-size: inherit; margin: 0; }
      section h3 { font-weight: 700; }
    `}</style>
  )
}
