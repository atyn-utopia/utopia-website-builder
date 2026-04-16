import { supabase } from './supabase'
import { siteConfig } from '@/config/site'

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  sale_price: number | null
  rental_price: number | null
  sort_order: number
  is_active: boolean
  parent_id: string | null
  photos: { url: string }[]
}

export async function getProducts(): Promise<{ core: Product[]; additional: Product[] }> {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_photos(url)')
    .eq('website', siteConfig.domain)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error || !data) {
    console.error('Failed to fetch products:', error)
    // Return empty arrays — site still works, just no products shown
    return { core: [], additional: [] }
  }

  const products = data.map((p: any) => ({
    ...p,
    photos: p.product_photos ?? [],
  }))

  // Core = has rental_price (sort_order 1-6), Additional = rental_price is null
  const core = products.filter((p: Product) => p.rental_price !== null)
  const additional = products.filter((p: Product) => p.rental_price === null)

  return { core, additional }
}
