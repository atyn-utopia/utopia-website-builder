export function ProductSchema() {
  const products = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'OxiHome Mesin 5L Oxygen Concentrator',
      description: 'Medical-grade 5-liter oxygen concentrator with 96% purity. Lightweight, whisper-quiet at 45 dB. Includes nasal cannula and humidifier bottle.',
      brand: { '@type': 'Brand', name: 'Oxihome' },
      offers: [
        {
          '@type': 'Offer',
          price: '250',
          priceCurrency: 'MYR',
          availability: 'https://schema.org/InStock',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '250',
            priceCurrency: 'MYR',
            billingDuration: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' },
          },
        },
        { '@type': 'Offer', price: '2599', priceCurrency: 'MYR', availability: 'https://schema.org/InStock' },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Tangki Oksigen Kecemasan (Emergency Oxygen Tank)',
      description: '10-litre emergency oxygen tank for home use. Compact and ready when you need it most.',
      brand: { '@type': 'Brand', name: 'Oxihome' },
      offers: [
        {
          '@type': 'Offer',
          price: '90',
          priceCurrency: 'MYR',
          availability: 'https://schema.org/InStock',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '90',
            priceCurrency: 'MYR',
            billingDuration: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' },
          },
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Pakej Combo Jimat (Value Combo Package)',
      description: 'Oxygen concentrator and emergency tank combo with free oximeter. Complete home oxygen therapy package.',
      brand: { '@type': 'Brand', name: 'Oxihome' },
      offers: [
        {
          '@type': 'Offer',
          price: '320',
          priceCurrency: 'MYR',
          availability: 'https://schema.org/InStock',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '320',
            priceCurrency: 'MYR',
            billingDuration: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' },
          },
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Pulse Oximeter',
      description: 'Check blood oxygen levels in seconds with 99% accuracy. Clip-on finger pulse oximeter for home respiratory health monitoring.',
      brand: { '@type': 'Brand', name: 'Oxihome' },
      offers: [
        { '@type': 'Offer', price: '40', priceCurrency: 'MYR', availability: 'https://schema.org/InStock' },
      ],
    },
  ]

  return (
    <>
      {products.map((product, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(product) }}
        />
      ))}
    </>
  )
}
