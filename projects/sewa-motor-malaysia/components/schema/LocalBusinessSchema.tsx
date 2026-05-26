import { siteConfig } from "@/config/site";

export function LocalBusinessSchema({
  locationName,
  locationSlug,
  state,
  locale,
}: {
  locationName: string;
  locationSlug: string;
  state: string;
  locale: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://sewamotor.my/${locale}/sewa-motor/${locationSlug}#localbusiness`,
    name: `Sewa Motor Malaysia — ${locationName}`,
    description: `Motorcycle rental service in ${locationName}, ${state}, Malaysia. Daily, weekly, and monthly motorbike rentals.`,
    url: `https://sewamotor.my/${locale}/sewa-motor/${locationSlug}`,
    telephone: `+${siteConfig.fallbackPhone}`,
    image: "https://sewamotor.my/og-image.jpg",
    address: {
      "@type": "PostalAddress",
      addressLocality: locationName,
      addressRegion: state,
      addressCountry: "MY",
    },
    geo: {
      "@type": "GeoCoordinates",
    },
    areaServed: {
      "@type": "City",
      name: locationName,
    },
    priceRange: "RM30 - RM1100",
    currenciesAccepted: "MYR",
    paymentAccepted: "Cash, Bank Transfer",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "22:00",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
