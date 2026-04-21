import { getSupabase } from "./supabase";

const WEBSITE = "electrician-24-hour.vercel.app";

export interface ProductPhoto {
  url: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  sale_price: number | null;
  rental_price: number | null;
  sort_order: number;
  photos: ProductPhoto[];
}

export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("products")
    .select(`
      id, name, slug, description, sale_price, rental_price, sort_order,
      product_photos ( url )
    `)
    .eq("website", WEBSITE)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getProducts] error:", error.message);
    return [];
  }

  if (!data) return [];

  return data.map((row: any) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || "",
    sale_price: row.sale_price,
    rental_price: row.rental_price,
    sort_order: row.sort_order || 0,
    photos: Array.isArray(row.product_photos) ? row.product_photos : [],
  }));
}
