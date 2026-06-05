'use client';

export function trackWhatsApp(phone: string) {
  if (typeof window !== 'undefined' && window.uwc) {
    try { window.uwc('click', { label: `whatsapp-${phone}` }); } catch {}
  }
}

export function trackBlog(slug: string) {
  if (typeof window !== 'undefined' && window.uwc) {
    try { window.uwc('click', { label: `blog-${slug}` }); } catch {}
  }
}

export function trackProductImpression(slug: string) {
  if (typeof window !== 'undefined' && window.uwc) {
    try { window.uwc('impression', { label: `product-${slug}` }); } catch {}
  }
}
