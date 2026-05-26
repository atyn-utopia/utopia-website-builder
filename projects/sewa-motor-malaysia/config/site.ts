// `sewamotor.my` is a separate Wix site that we do not own — siteConfig.domain
// must reflect the alias actually serving this Next deploy so webcore lookups,
// monitor_snapshots.domain, and schema URLs all point at the right place.
const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN ?? 'sewa-motor-malaysia.utopiaai.my'

export const siteConfig = {
  name: 'Sewa Motor Malaysia',
  brandName: 'Sewa Motor Malaysia',
  domain,
  baseUrl: `https://${domain}`,
  siteUrl: `https://${domain}`,
  productSlug: 'sewa-motor',
  fallbackPhone: '60174287801',
}
