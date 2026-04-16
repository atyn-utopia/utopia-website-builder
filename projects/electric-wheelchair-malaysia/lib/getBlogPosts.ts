import { getSupabase } from "./supabase";

const WEBSITE = "electric-wheelchair-malaysia.vercel.app";

export interface BlogPost {
  id: string;
  slug: string;
  cover_image_url: string;
  published_at: string;
  title: string;
  content: string;
  excerpt: string;
  meta_title: string;
  meta_description: string;
}

/**
 * Fetch all published blog posts with translations for the given language.
 * Queries blog_posts first, then joins blog_translations.
 */
export async function getBlogPosts(language: string = "en"): Promise<BlogPost[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("blog_posts")
    .select(`
      id, slug, cover_image_url, published_at, created_at,
      blog_translations!inner (title, content, excerpt, meta_title, meta_description)
    `)
    .eq("website", WEBSITE)
    .eq("status", "published")
    .eq("blog_translations.language", language)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getBlogPosts] error:", error.message);
    return [];
  }

  if (!data) return [];

  return data.map((row: any) => {
    const t = Array.isArray(row.blog_translations) ? row.blog_translations[0] : row.blog_translations;
    return {
      id: row.id,
      slug: row.slug,
      cover_image_url: row.cover_image_url,
      published_at: row.published_at || row.created_at,
      title: t?.title || "",
      content: t?.content || "",
      excerpt: t?.excerpt || "",
      meta_title: t?.meta_title || "",
      meta_description: t?.meta_description || "",
    };
  });
}

/**
 * Fetch a single blog post by slug with translation for the given language.
 */
export async function getBlogPostBySlug(slug: string, language: string = "en"): Promise<BlogPost | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("blog_posts")
    .select(`
      id, slug, cover_image_url, published_at, created_at,
      blog_translations!inner (title, content, excerpt, meta_title, meta_description)
    `)
    .eq("website", WEBSITE)
    .eq("slug", slug)
    .eq("status", "published")
    .eq("blog_translations.language", language)
    .single();

  if (error) {
    console.error("[getBlogPostBySlug] error:", error.message);
    return null;
  }

  if (!data) return null;

  const row = data as any;
  const t = Array.isArray(row.blog_translations) ? row.blog_translations[0] : row.blog_translations;
  return {
    id: row.id,
    slug: row.slug,
    cover_image_url: row.cover_image_url,
    published_at: row.published_at || row.created_at,
    title: t?.title || "",
    content: t?.content || "",
    excerpt: t?.excerpt || "",
    meta_title: t?.meta_title || "",
    meta_description: t?.meta_description || "",
  };
}
