# Canonical Blog Template

The golden source for the blog **post** (`post/page.tsx`) and **listing**
(`listing/page.tsx`) layouts. Sourced from `service-aircond-malaysia`, which is
the reference because its blog uses **self-contained inline styles** — no
dependency on project-specific CSS variables.

## Why this exists

Several projects had blog pages copied from *other* projects that still
referenced the source project's CSS tokens (`var(--brand-charcoal)`,
`var(--gut)`, `var(--radius-card)`…). Those tokens don't exist in the target
project, so colours/padding/radii silently collapsed and the article rendered
as a broken wall of text — even though every element and `.blog-content` rule
was present. (oxihome's blog is the canonical example of this failure.)

The wizard's `no-undefined-css-vars` check now catches that class of bug, but
the durable fix is: **use this template, which has zero CSS-variable
dependencies in its layout chrome.**

## How to apply to a project

1. Copy `post/page.tsx` → `<project>/app/[locale]/blog/[slug]/page.tsx` and
   `listing/page.tsx` → `<project>/app/[locale]/blog/page.tsx`.
2. Adapt only the **data layer** to the project's `lib/webcore` API:
   - Some projects expose `getBlogPostBySlug(slug, locale)` returning a
     flattened post; others expose `getBlogPost(slug, locale)` returning
     `{ blog_translations: [{ title, content, excerpt, meta_title, … }] }`.
     Map `post.title` → `tr.title`, `post.content` → `tr.content`, etc.
   - Related posts: `getBlogPosts(locale)` + filter, or `getRecentBlogPosts(locale, slug, 3)`.
3. Keep `generateStaticParams` + `generateMetadata` from the target project.
4. Localise the CTA / breadcrumb / "min read" / "back to blog" copy via the
   project's `messages/*.json` `blog` namespace (do NOT hardcode English).
5. Keep `className="blog-content"` on the article body so the project's
   `.blog-content` CSS rules style the rendered HTML.

## Invariants the layout must preserve (checked by the wizard)

- Article in a centred column (`max-width: 760; margin: 0 auto`).
- One `<h1>` (title) + one `<h2>` (excerpt) in the header.
- Breadcrumb (Home › Blog › title), reading-time indicator.
- WhatsApp CTA routing through `/redirect-whatsapp-1` (`waRedirect(locale)`),
  official green `#25D366`, opening in a new tab (`target="_blank"`).
- Article / BlogPosting JSON-LD (inline or `<ArticleSchema />`).
- No `var(--…)` in the layout chrome that isn't defined in the target project.
