import { siteConfig } from "@/config/site";

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.brandName,
    url: siteConfig.siteUrl,
    // /logo.png never existed in public/. app/icon.svg is served at /icon.svg
    // by the App Router, so this resolves instead of 404ing in JSON-LD.
    logo: `${siteConfig.siteUrl}/icon.svg`,
    description:
      "Motorcycle rental service across 128 locations in Malaysia. Daily, weekly, and monthly rentals.",
    areaServed: {
      "@type": "Country",
      name: "Malaysia",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+${siteConfig.fallbackPhone}`,
      contactType: "customer service",
      availableLanguage: ["English", "Malay", "Chinese"],
    },
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
