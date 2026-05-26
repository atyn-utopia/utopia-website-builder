const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN ?? 'sewamotor.my'

export const siteConfig = {
  name: 'Sewa Motor Malaysia',
  brandName: 'Sewa Motor Malaysia',
  domain,
  baseUrl: `https://${domain}`,
  siteUrl: `https://${domain}`,
  productSlug: 'sewa-motor',
  fallbackPhone: '60174287801',
}
