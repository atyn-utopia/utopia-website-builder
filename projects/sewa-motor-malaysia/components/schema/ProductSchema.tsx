interface ProductData {
  name: string;
  description: string;
  image: string;
  priceDaily: number;
  priceWeekly: number;
  priceMonthly: number;
}

export function ProductSchema({
  product,
  locationName,
  locationSlug,
  locale,
}: {
  product: ProductData;
  locationName: string;
  locationSlug: string;
  locale: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} — Rental in ${locationName}`,
    description: product.description,
    image: product.image,
    brand: {
      "@type": "Brand",
      name: product.name.split(" ")[0],
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "MYR",
      lowPrice: product.priceDaily,
      highPrice: product.priceMonthly,
      offerCount: 3,
      offers: [
        {
          "@type": "Offer",
          name: "Daily Rental",
          price: product.priceDaily,
          priceCurrency: "MYR",
          priceValidUntil: "2030-12-31",
          availability: "https://schema.org/InStock",
          url: `https://sewamotor.my/${locale}/sewa-motor/${locationSlug}`,
        },
        {
          "@type": "Offer",
          name: "Weekly Rental",
          price: product.priceWeekly,
          priceCurrency: "MYR",
          priceValidUntil: "2030-12-31",
          availability: "https://schema.org/InStock",
          url: `https://sewamotor.my/${locale}/sewa-motor/${locationSlug}`,
        },
        {
          "@type": "Offer",
          name: "Monthly Rental",
          price: product.priceMonthly,
          priceCurrency: "MYR",
          priceValidUntil: "2030-12-31",
          availability: "https://schema.org/InStock",
          url: `https://sewamotor.my/${locale}/sewa-motor/${locationSlug}`,
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
