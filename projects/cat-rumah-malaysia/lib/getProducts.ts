import { supabase } from './supabase'
import { site } from '@/config/site'

export interface ProductPhoto {
  url: string
  alt_text: string | null
  sort_order: number
}

export interface ProductRow {
  id: string
  name: string
  slug: string
  description: string | null
  parent_id: string | null
  sale_price: number | null
  rental_price: number | null
  sort_order: number
  is_active: boolean
  product_photos: ProductPhoto[]
}

export async function getProducts(): Promise<ProductRow[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, description, parent_id, sale_price, rental_price, sort_order, is_active, product_photos(url, alt_text, sort_order)')
    .eq('website', site.domain)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Failed to fetch products:', error.message)
    return []
  }

  // Sort photos within each product
  return (data ?? []).map((p) => ({
    ...p,
    product_photos: (p.product_photos ?? []).sort(
      (a: ProductPhoto, b: ProductPhoto) => a.sort_order - b.sort_order
    ),
  }))
}
