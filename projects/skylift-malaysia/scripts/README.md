# Supabase seed — run in this order

Repo `.env.local` only ships the anon key, which is blocked by RLS. So seed via the Supabase SQL editor once:

Open https://supabase.com/dashboard/project/xzydvhzcngpxdbyniliy/sql → New query → paste each file below → Run.

| Order | File | Inserts |
|-------|------|---------|
| 1 | `seed-products.sql` | 8 services + 16 product_photos |
| 2 | `seed-blog-posts.sql` | 10 blog_posts + 30 blog_translations (en/ms/zh) |
| 3 | `seed-website-phone.sql` | 1 company_websites row (Encik Beku) + 1 phone_numbers row (60174287801, leads_mode=single) |

Each script ends with a `SELECT` that prints what was inserted — use that as confirmation before closing.

After all three complete, the site at `/en/`, `/en/electrician-service/<city>`, `/en/blog` will render live products + posts (within the 1-hour ISR window; force-refresh with `Ctrl-F5` if you already had a tab open).
