import { getTranslations } from "next-intl/server";
import WhatsAppButton from "./WhatsAppButton";
import ProductImpressionTracker from "./tracking/ProductImpressionTracker";

interface Product {
  slug: string;
  nameKey: string;
  descriptionKey: string;
  image: string;
  priceDaily: number;
  priceWeekly: number;
  priceMonthly: number;
  badge?: "mostPopular" | "bestValue" | "budgetPick";
}

interface ProductCardProps {
  product: Product;
  phones: string[];
  locale: string;
}

const badgeStyles: Record<string, { bg: string; text: string }> = {
  mostPopular: {
    bg: "bg-red-600",
    text: "badgeMostPopular",
  },
  bestValue: {
    bg: "bg-amber-500",
    text: "badgeBestValue",
  },
  budgetPick: {
    bg: "bg-emerald-600",
    text: "badgeBudgetPick",
  },
};

export default async function ProductCard({
  product,
  phones,
  locale,
}: ProductCardProps) {
  const t = await getTranslations({ locale, namespace: "home.products" });

  const badgeInfo = product.badge ? badgeStyles[product.badge] : null;

  return (
    <ProductImpressionTracker
      slug={product.slug}
      className="relative flex flex-col bg-white rounded-2xl overflow-hidden
                 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.08),0_8px_32px_rgba(220,38,38,0.04)]
                 hover:shadow-[0_2px_6px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.12),0_16px_48px_rgba(220,38,38,0.08)]
                 transform hover:-translate-y-1 transition-all duration-300
                 border border-gray-100"
    >
      {/* Badge */}
      {badgeInfo && (
        <div
          className={`absolute top-4 right-4 z-10 ${badgeInfo.bg} text-white
                      text-xs font-bold tracking-wider uppercase
                      px-3 py-1.5 rounded-full
                      shadow-[0_2px_8px_rgba(0,0,0,0.2)]`}
        >
          {t(badgeInfo.text)}
        </div>
      )}

      {/* Image placeholder */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Motorcycle silhouette placeholder */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-gray-300"
            aria-hidden="true"
          >
            <circle cx="5.5" cy="17.5" r="3.5" />
            <circle cx="18.5" cy="17.5" r="3.5" />
            <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        {/* Name */}
        <h3
          className="font-serif text-xl font-bold text-gray-900 tracking-tight
                     leading-snug mb-2"
        >
          {t(`${product.nameKey}.name`)}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-5 flex-1">
          {t(`${product.nameKey}.description`)}
        </p>

        {/* Price tiers */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {/* Daily */}
          <div
            className="flex flex-col items-center p-3 rounded-xl
                        bg-gray-50 border border-gray-100"
          >
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">
              {t("daily")}
            </span>
            <span className="font-serif text-lg font-bold text-gray-900 tracking-tight">
              {t(`${product.nameKey}.daily`)}
            </span>
            <span className="text-[11px] text-gray-400">{t("perDay")}</span>
          </div>

          {/* Weekly */}
          <div
            className="flex flex-col items-center p-3 rounded-xl
                        bg-gray-50 border border-gray-100"
          >
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">
              {t("weekly")}
            </span>
            <span className="font-serif text-lg font-bold text-gray-900 tracking-tight">
              {t(`${product.nameKey}.weekly`)}
            </span>
            <span className="text-[11px] text-gray-400">{t("perWeek")}</span>
          </div>

          {/* Monthly */}
          <div
            className="flex flex-col items-center p-3 rounded-xl
                        bg-red-50 border border-red-100"
          >
            <span className="text-[11px] font-medium text-red-400 uppercase tracking-wider mb-1">
              {t("monthly")}
            </span>
            <span className="font-serif text-lg font-bold text-red-600 tracking-tight">
              {t(`${product.nameKey}.monthly`)}
            </span>
            <span className="text-[11px] text-red-400">{t("perMonth")}</span>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <WhatsAppButton phones={phones} className="w-full text-sm" />
      </div>
    </ProductImpressionTracker>
  );
}
