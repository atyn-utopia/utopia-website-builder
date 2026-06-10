-- 20260610_domain_rename_cascade.sql
--
-- Auto-reflect a website domain change across all its data.
--
-- The domain is denormalised — stored as a `website` text column in many tables
-- (products, phone_numbers, blog_posts, seo_*, website_*, alt_overrides,
-- page_events, writer_permissions, api_keys). When you rename a site's domain in
-- company_websites.domain, those rows would otherwise be orphaned and the live
-- site would show no products/blog and fall back on the phone number.
--
-- This trigger cascades the rename automatically: change company_websites.domain
-- (e.g. from the webcore admin) and every related row is re-stamped in one shot.
-- It is DYNAMIC — it finds every `webcore` table with a `website` column at run
-- time, so tables added later are covered without editing this trigger.
--
-- Run once in the new project's Supabase SQL Editor (schema: webcore).

CREATE OR REPLACE FUNCTION webcore.cascade_domain_rename() RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER          -- run as owner so the cascade bypasses RLS
SET search_path = webcore, public
AS $$
DECLARE r record;
BEGIN
  IF NEW.domain IS DISTINCT FROM OLD.domain THEN
    FOR r IN
      SELECT table_name
      FROM information_schema.columns
      WHERE table_schema = 'webcore'
        AND column_name = 'website'
        AND table_name <> 'audit_logs'   -- keep audit history immutable
    LOOP
      EXECUTE format('UPDATE webcore.%I SET website = $1 WHERE website = $2', r.table_name)
        USING NEW.domain, OLD.domain;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_cascade_domain ON webcore.company_websites;
CREATE TRIGGER trg_cascade_domain
  AFTER UPDATE OF domain ON webcore.company_websites
  FOR EACH ROW
  EXECUTE FUNCTION webcore.cascade_domain_rename();

-- ── Safe self-test (optional) ───────────────────────────────────────────────
-- Runs a fake rename, shows that the data follows, then ROLLBACK undoes it all —
-- nothing is permanently changed. Expect non-zero counts if the trigger works.
--
--   BEGIN;
--     UPDATE webcore.company_websites SET domain = '__cascade_test__'
--       WHERE domain = 'sewaexcavator.my';
--     SELECT 'products'      AS tbl, count(*) FROM webcore.products      WHERE website = '__cascade_test__'
--     UNION ALL SELECT 'phone_numbers', count(*) FROM webcore.phone_numbers WHERE website = '__cascade_test__'
--     UNION ALL SELECT 'blog_posts',    count(*) FROM webcore.blog_posts    WHERE website = '__cascade_test__';
--   ROLLBACK;
