const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN ?? 'oxihome.my'

export const siteConfig = {
  name: 'Oxihome Malaysia',
  domain,
  siteUrl: `https://${domain}`,
  fallbackPhone: '60123456789',
  defaultWhatsApp: 'https://wa.me/60123456789',
}
