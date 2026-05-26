import { siteConfig } from "@/config/site";

export function BreadcrumbSchema({
  locationName,
  locationSlug,
  locale,
}: {
  locationName: string;
  locationSlug: string;
  locale: string;
}) {
  const baseUrl = siteConfig.siteUrl;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "zh" ? "首页" : "Home",
        item: `${baseUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: locationName,
        item: `${baseUrl}/${locale}/sewa-motor/${locationSlug}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
