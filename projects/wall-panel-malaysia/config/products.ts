// Product data is now fetched dynamically from Supabase via lib/webcore.ts.
// The database is the single source of truth. Only gallery/hero assets remain
// here, and product variant metadata used as a fallback when Supabase is empty.

// Hero image: warm modern Malaysian interior with wood feature wall behind a
// beige sofa — matches the brand-asset photography mood (Pexels).
export const HERO_IMAGE =
  'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600'

// 12 wall-panel installation photos — mix of wood, fluted, PVC, acoustic,
// marble across living rooms, bedrooms, offices, reception and feature walls.
// 12 divides cleanly by 1 / 2 / 3 / 4 / 6 — no empty slots in the gallery
// grid at any breakpoint (CLAUDE rule).
export const GALLERY_IMAGES = [
  'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/3214113/pexels-photo-3214113.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1571470/pexels-photo-1571470.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=1200',
]
