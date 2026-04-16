// Product data is now fetched dynamically from Supabase via lib/getProducts.ts.
// CORE_PRODUCTS and ADDITIONAL_PRODUCTS have been removed — the database is the
// single source of truth. Only gallery/hero assets remain here.

export const HERO_IMAGE =
  'https://static.wixstatic.com/media/d3104b_dcd312bd5e4d4214bbb3410cd43505ed~mv2.png'

export const GALLERY_HASHES = [
  'd3104b_053726e144234c62ba5dcff8cb1041a7',
  'd3104b_6534d32621bb4a94a93d1370c23d146a',
  'd3104b_299d80bf87f14a0e90a0c94848e8ffb3',
  'd3104b_b4cd51ef1940448ca399bf2b153b6ee9',
  'd3104b_d16705342bc549438ff7792397f3f62c',
  'd3104b_7c85eb82fb734769bef7d0307b10f78e',
  'd3104b_8de363c4749a4d29ae8565662bddd8a6',
  'd3104b_37735d72053941d1be7fefce669ccb2c',
  'd3104b_475eea6601814ca69a712b7f99019b07',
  'd3104b_870aa6e8b831475794b6b63d59bde8cb',
  'd3104b_421b1a8ab5cd4c03b55463d81750f2b7',
  'd3104b_0ab793255a0042d3bf1eeab9e67d49bc',
  'd3104b_88b9ec1ce0e4499d8f3393d7fda7f09c',
  'd3104b_b83c893558fc454298611914541f32bd',
  'd3104b_99dc3234ab00434a8c9b570cec5bebd9',
  'd3104b_99aa3d07096a43c3b800e074ce138e62',
  'd3104b_bd8ce19a318c455ea07fc8af3926f529',
  'd3104b_1c00f7fe44a845f29481232edd56c6a8',
  'd3104b_4bfaef80510c4e218cd232fe5c8f5732',
  'd3104b_660750d9feeb4895a7ad0fb2af5f2c6a',
  'd3104b_4bbe9e2f0289401c8b19b91fbd65be18',
  'd3104b_b3bb32cc790b4573b360710aaa8ea64c',
  'd3104b_2006c86532a34e0d9af60431248f99a7',
  'd3104b_e0c90b69a46843ecb7060ae64ea23e20',
]

export const GALLERY_IMAGES = GALLERY_HASHES.map(
  (h) => `https://static.wixstatic.com/media/${h}~mv2.png`,
)
