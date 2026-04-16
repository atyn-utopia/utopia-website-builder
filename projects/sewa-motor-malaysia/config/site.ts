const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN ?? 'sewamotor.my'

export const siteConfig = {
  name: 'Sewa Motor Malaysia',
  brandName: 'Sewa Motor Malaysia',
  domain,
  baseUrl: `https://${domain}`,
  siteUrl: `https://${domain}`,
  fallbackPhone: '60174287801',
  defaultWhatsApp: 'https://wa.me/60174287801',
}
