// Step 8 (Google setup) runs only on a client's PAID domain.
//
// A provisional <slug>.utopiaai.my host or a *.vercel.app preview is not one:
// Google properties are keyed to the URL you submit, so they would have to be
// rebuilt when the paid domain lands, and the GSC verification TXT on a
// utopiaai.my subdomain shadows Vercel's implicit record and takes the site
// offline. On 2026-10-12, 33 GA4 properties, 33 GTM containers and 32 GSC
// properties made for *.utopiaai.my batch sites had to be deleted (#386).
//
// utopiaai.my itself is Utopia's own paid domain and stays allowed.

const PROVISIONAL = [/\.utopiaai\.my$/i, /\.vercel\.app$/i];

export function isPaidDomain(domain) {
  const host = String(domain ?? '').trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '').replace(/^www\./i, '');
  return host !== '' && !PROVISIONAL.some((re) => re.test(host));
}

/** Exit before any Google resource is created when `domain` is not a paid domain. */
export function assertPaidDomain(domain) {
  if (isPaidDomain(domain)) return;
  console.error(`\n❌ ${domain} is not a paid domain — Google setup (Step 8) is on hold for this site.`);
  console.error('   Run it once the client\'s paid domain is connected on Vercel. See docs/full-website-setup.md → Google Integration.');
  process.exit(1);
}
