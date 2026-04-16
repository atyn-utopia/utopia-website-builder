# Sewa Motor Malaysia — i18n Implementation

**Brand:** Sewa Motor Malaysia
**Domain:** sewamotor.my
**Languages:** English (`en`), Mandarin Chinese (`zh`)
**Default locale:** `en`
**i18n library:** next-intl
**Author:** Kimmy (Technical Implementation Specialist)

---

## 1. Routing Setup

**File:** `i18n/routing.ts`

```ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
})
```

---

## 2. Request Config

**File:** `i18n/request.ts`

```ts
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  // Validate that the incoming locale is supported
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
```

---

## 3. Middleware

**File:** `middleware.ts` (project root)

```ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Match all pathnames except Next.js internals and static files
  matcher: ['/', '/(en|zh)/:path*'],
}
```

---

## 4. next.config.ts Plugin

**File:** `next.config.ts`

Ensure the next-intl plugin is wired up:

```ts
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig = {
  // other config options
}

export default withNextIntl(nextConfig)
```

---

## 5. Translation Files

### 5a. `messages/en.json`

```json
{
  "nav": {
    "products": "Motorcycles",
    "locations": "Locations",
    "whatsapp": "WhatsApp Us"
  },
  "footer": {
    "tagline": "Malaysia's trusted motorcycle rental service. Same-day delivery from RM30/day.",
    "quickLinks": "Quick Links",
    "topLocations": "Top Locations",
    "copyright": "© {year} Sewa Motor Malaysia. All rights reserved.",
    "home": "Home",
    "products": "Motorcycles",
    "locations": "All Locations"
  },
  "home": {
    "meta": {
      "title": "Sewa Motor Malaysia | #1 Motorcycle Rental from RM30/day | sewamotor.my",
      "description": "Rent motorcycles across Malaysia from RM30/day. Honda Vario, Yamaha NMax, PCX & more. Same-day delivery. WhatsApp to book now. Sewa motor murah seluruh Malaysia."
    },
    "hero": {
      "headline": "Motor Rental Malaysia — Sewa Motor from RM30/day",
      "subheadline": "Rent reliable motorcycles delivered to your doorstep. Honda Vario, Yamaha NMax, PCX and more — daily, weekly, or monthly plans across Malaysia.",
      "cta": "WhatsApp Us to Book Now"
    },
    "stats": {
      "rentals": "6,000+ Rentals",
      "rentalsDesc": "Trusted by riders across Malaysia",
      "delivery": "Same-Day Delivery",
      "deliveryDesc": "Book today, ride today",
      "price": "From RM30/day",
      "priceDesc": "Budget-friendly motorcycle rental",
      "rating": "5-Star Rated",
      "ratingDesc": "Highly reviewed on Google"
    },
    "risk": {
      "heading": "Stuck Without a Ride? That Costs You More Than You Think.",
      "paragraph1": "Getting around Malaysia without your own transport is expensive and frustrating. Grab rides add up fast — RM30 to RM50 per trip, multiple times a day. In a week, you could spend more on ride-hailing than renting a motorcycle for the entire month.",
      "paragraph2": "Public transport does not cover every area, and waiting times eat into your day. If you are a student, a food delivery rider, or a tourist exploring Malaysia, you already know the struggle. You need a fast, affordable way to move around — on your own schedule.",
      "paragraph3": "That is exactly why Sewa Motor Malaysia exists. Rent a motorcycle from RM30/day, get same-day delivery, and take back your freedom to move. No deposits drama, no long-term lock-ins."
    },
    "products": {
      "heading": "Motorcycle Rental Malaysia — Choose Your Ride",
      "cta": "Rent via WhatsApp",
      "daily": "Daily",
      "weekly": "Weekly",
      "monthly": "Monthly",
      "perDay": "/day",
      "perWeek": "/week",
      "perMonth": "/month",
      "badgeMostPopular": "Most Popular",
      "badgeBestValue": "Best Value",
      "badgeBudgetPick": "Budget Pick",
      "hondaVario160": {
        "name": "Honda Vario 160",
        "description": "Smooth automatic scooter — perfect for city commutes and food delivery.",
        "daily": "RM50",
        "weekly": "RM280",
        "monthly": "RM900"
      },
      "yamahaNMax155": {
        "name": "Yamaha NMax 155",
        "description": "Premium ride with ABS braking — comfortable for long distances.",
        "daily": "RM55",
        "weekly": "RM310",
        "monthly": "RM1,000"
      },
      "hondaPCX160": {
        "name": "Honda PCX 160",
        "description": "Top-tier scooter with smart key and smooth suspension. Great for daily riders.",
        "daily": "RM60",
        "weekly": "RM340",
        "monthly": "RM1,100"
      },
      "hondaWave125": {
        "name": "Honda Wave 125",
        "description": "Fuel-efficient and easy to ride. The most affordable option for budget-conscious renters.",
        "daily": "RM35",
        "weekly": "RM200",
        "monthly": "RM650"
      },
      "yamahaY15ZR": {
        "name": "Yamaha Y15ZR",
        "description": "Sporty underbones motorcycle — lightweight and fun to ride around town.",
        "daily": "RM40",
        "weekly": "RM230",
        "monthly": "RM750"
      },
      "modenasKrissMR3": {
        "name": "Modenas Kriss MR3",
        "description": "Classic Malaysian motorcycle — reliable, low-maintenance, and starting from just RM30/day.",
        "daily": "RM30",
        "weekly": "RM170",
        "monthly": "RM550"
      }
    },
    "howItWorks": {
      "heading": "Rent a Motorcycle in 3 Easy Steps",
      "step1Title": "Choose Your Bike",
      "step1Desc": "Browse our motorcycles above and pick the one that fits your needs and budget.",
      "step2Title": "WhatsApp Us",
      "step2Desc": "Send us a message on WhatsApp with your preferred bike, rental period, and delivery location.",
      "step3Title": "Same-Day Delivery",
      "step3Desc": "We deliver the motorcycle to your doorstep on the same day. Ride away."
    },
    "reviews": {
      "heading": "What Our Customers Say About Sewa Motor Malaysia",
      "review1": "Rented a Honda Vario 160 for a month and it was in perfect condition. Same-day delivery as promised. Will definitely rent again.",
      "review1Author": "Ahmad R.",
      "review1Location": "Petaling Jaya",
      "review2": "I needed a motorbike urgently for food delivery work. Sewa Motor delivered a Yamaha Y15ZR to my place the same day I messaged them on WhatsApp. Very reliable.",
      "review2Author": "Wei Liang C.",
      "review2Location": "Kuala Lumpur",
      "review3": "Budget-friendly and hassle-free. I rented the Modenas Kriss MR3 at RM30/day while my own bike was in the workshop. Great service and friendly team.",
      "review3Author": "Priya S.",
      "review3Location": "Shah Alam"
    },
    "authority": {
      "heading": "Malaysia's Trusted Motorcycle Rental Service",
      "paragraph1": "Sewa Motor Malaysia is built for riders who need a motorcycle fast — without the red tape. We maintain a fleet of well-serviced Honda, Yamaha, and Modenas motorcycles ready for same-day delivery across Malaysia. Every bike goes through a safety inspection before it reaches you.",
      "paragraph2": "Whether you are a tourist exploring the country, a student commuting to campus, a delivery rider earning a living, or simply need a temporary replacement while your bike is in the workshop — we have the right motorcycle at the right price. Our team is local, responsive, and available on WhatsApp every day."
    },
    "locations": {
      "heading": "Sewa Motor Near You — We Deliver Across Malaysia",
      "subheading": "Select your city below to see motorcycle rental options with same-day delivery to your area."
    },
    "cta": {
      "heading": "Ready to Ride? Rent a Motorcycle Today.",
      "subheading": "From RM30/day with same-day delivery. Send us a WhatsApp message and we will get your bike to you today.",
      "button": "WhatsApp Us Now"
    }
  },
  "location": {
    "meta": {
      "title": "Sewa Motor {city} | Motorcycle Rental from RM30/day | sewamotor.my",
      "description": "Rent motorcycles in {city} from RM30/day. Honda, Yamaha & Modenas — same-day delivery. WhatsApp to book your motorcycle rental in {city} today."
    },
    "breadcrumbs": {
      "home": "Home",
      "location": "{city}"
    },
    "hero": {
      "headline": "Sewa Motor {city} — Rent Motorcycles from RM30/day",
      "intro": "Looking for motorcycle rental in {city}? Sewa Motor Malaysia delivers motorcycles directly to your location in {city} — on the same day you book. Choose from Honda Vario, Yamaha NMax, Honda PCX, and more, with daily, weekly, and monthly rental plans starting from RM30/day."
    },
    "badges": {
      "sameDayDelivery": "Same-Day Delivery to {city}",
      "affordable": "From RM30/day",
      "maintained": "Safety-Checked Fleet",
      "localSupport": "Local {city} Support"
    },
    "whyChoose": {
      "heading": "Why Choose Sewa Motor in {city}",
      "delivery": "Same-day delivery to {city} — Book on WhatsApp, ride today. No waiting.",
      "affordable": "Affordable rates from RM30/day — Daily, weekly, and monthly plans to fit your budget.",
      "fleet": "Well-maintained fleet — Every motorcycle is safety-checked before delivery.",
      "support": "Local support team — Our {city} team is available on WhatsApp for quick assistance."
    },
    "banner": {
      "heading": "Motorcycle Rental in {city}",
      "description": "Choose from 6 motorcycles available for rent in {city} with same-day delivery."
    },
    "nearby": {
      "heading": "Nearby Locations",
      "description": "Also available with same-day delivery near {city}."
    },
    "cta": {
      "heading": "Ready to rent a motorcycle in {city}?",
      "subheading": "Sewa Motor Malaysia offers same-day delivery straight to your door — starting from just RM30/day. Send us a WhatsApp message now and ride today.",
      "button": "WhatsApp Us to Rent in {city}"
    },
    "faq": {
      "heading": "Frequently Asked Questions — Sewa Motor {city}",
      "q1": "How much does it cost to rent a motorcycle in {city}?",
      "a1": "Motorcycle rental in {city} starts from RM30/day for a Modenas Kriss MR3. Weekly and monthly plans are also available, with prices ranging up to RM1,100/month for a Honda PCX 160. The longer your rental period, the more you save per day.",
      "q2": "Do you deliver motorcycles in {city}?",
      "a2": "Yes, we provide same-day delivery across {city}. Just send us a WhatsApp message with your preferred motorcycle and delivery address, and we will bring it to you on the same day.",
      "q3": "What motorcycles are available for rent in {city}?",
      "a3": "We offer six models in {city}: Honda Vario 160, Yamaha NMax 155, Honda PCX 160, Honda Wave 125, Yamaha Y15ZR, and Modenas Kriss MR3. Each bike is maintained and ready for immediate rental.",
      "q4": "Do I need a deposit to rent a motorcycle in {city}?",
      "a4": "A small refundable deposit may be required depending on the motorcycle and rental duration. Contact us on WhatsApp for the exact deposit amount for your chosen bike in {city}.",
      "q5": "Can I rent a motorcycle in {city} for food delivery work?",
      "a5": "Absolutely. Many of our customers in {city} rent motorcycles for food delivery with Grab, Foodpanda, and ShopeeFood. The Honda Vario 160 and Yamaha Y15ZR are popular choices for delivery riders.",
      "q6": "How do I book a motorcycle rental in {city}?",
      "a6": "Booking is simple. Send us a WhatsApp message with your preferred bike, rental period, and delivery address in {city}. We will confirm availability and arrange same-day delivery.",
      "q7": "Is there a minimum rental period in {city}?",
      "a7": "The minimum rental period is one day. You can rent for a single day, a full week, or an entire month. Monthly plans in {city} offer the best value per day.",
      "q8": "What happens if the motorcycle breaks down during my rental in {city}?",
      "a8": "Contact us immediately on WhatsApp. We will arrange a replacement motorcycle or roadside assistance in {city} as quickly as possible. Your safety and convenience come first.",
      "q9": "Can I extend my motorcycle rental in {city}?",
      "a9": "Yes, you can extend your rental anytime. Just message us on WhatsApp before your current rental period ends, and we will update your booking for {city} without any interruption.",
      "q10": "Do you offer scooter rental in {city}?",
      "a10": "Yes. The Honda Vario 160, Yamaha NMax 155, and Honda PCX 160 are all automatic scooters available for rent in {city}. Scooter rental starts from RM50/day with same-day delivery."
    }
  }
}
```

### 5b. `messages/zh.json`

```json
{
  "nav": {
    "products": "电单车",
    "locations": "服务地区",
    "whatsapp": "立即WhatsApp"
  },
  "footer": {
    "tagline": "马来西亚值得信赖的电单车出租服务。当天送达，每日仅需RM30起。",
    "quickLinks": "快速链接",
    "topLocations": "热门地区",
    "copyright": "© {year} Sewa Motor Malaysia 版权所有。",
    "home": "首页",
    "products": "电单车",
    "locations": "所有地区"
  },
  "home": {
    "meta": {
      "title": "Sewa Motor Malaysia | 马来西亚电单车出租 RM30/天起 | sewamotor.my",
      "description": "马来西亚电单车出租，每日RM30起。Honda Vario、Yamaha NMax、PCX等车型，当天送达。立即WhatsApp预订，便宜实惠的摩托车租赁服务。"
    },
    "hero": {
      "headline": "马来西亚电单车出租 — 每日RM30起",
      "subheadline": "租赁可靠的电单车，直送到您家门口。Honda Vario、Yamaha NMax、PCX等多款车型 — 日租、周租或月租，覆盖马来西亚全国。",
      "cta": "立即WhatsApp预订"
    },
    "stats": {
      "rentals": "6,000+ 次出租",
      "rentalsDesc": "深受马来西亚骑士信赖",
      "delivery": "当天送达",
      "deliveryDesc": "今天预订，今天骑行",
      "price": "RM30/天起",
      "priceDesc": "经济实惠的电单车出租",
      "rating": "五星好评",
      "ratingDesc": "Google高分评价"
    },
    "risk": {
      "heading": "没有交通工具？代价比你想象的更大。",
      "paragraph1": "在马来西亚没有自己的交通工具，出行既贵又麻烦。Grab打车费用每趟RM30到RM50，一天打好几趟，一个星期下来，花在打车上的钱甚至比租一整个月的电单车还多。",
      "paragraph2": "公共交通不是每个地区都覆盖，等车的时间白白浪费。无论你是学生、外卖骑手还是来马来西亚旅游的游客，你一定深有体会。你需要一种快捷、实惠的出行方式 — 按自己的时间安排。",
      "paragraph3": "这正是Sewa Motor Malaysia存在的意义。每日RM30起租一辆电单车，当天送达，重新掌握出行自由。无押金纠纷，无长期绑定。"
    },
    "products": {
      "heading": "马来西亚电单车出租 — 选择你的座驾",
      "cta": "WhatsApp租车",
      "daily": "日租",
      "weekly": "周租",
      "monthly": "月租",
      "perDay": "/天",
      "perWeek": "/周",
      "perMonth": "/月",
      "badgeMostPopular": "最受欢迎",
      "badgeBestValue": "最高性价比",
      "badgeBudgetPick": "经济之选",
      "hondaVario160": {
        "name": "Honda Vario 160",
        "description": "顺滑的自动挡踏板车 — 城市通勤和外卖骑行的理想之选。",
        "daily": "RM50",
        "weekly": "RM280",
        "monthly": "RM900"
      },
      "yamahaNMax155": {
        "name": "Yamaha NMax 155",
        "description": "配备ABS刹车系统的高端车型 — 长途骑行舒适自在。",
        "daily": "RM55",
        "weekly": "RM310",
        "monthly": "RM1,000"
      },
      "hondaPCX160": {
        "name": "Honda PCX 160",
        "description": "顶级踏板车，配备智能钥匙和顺滑悬挂系统。日常骑行的绝佳选择。",
        "daily": "RM60",
        "weekly": "RM340",
        "monthly": "RM1,100"
      },
      "hondaWave125": {
        "name": "Honda Wave 125",
        "description": "省油好骑，预算有限的租车者最经济的选择。",
        "daily": "RM35",
        "weekly": "RM200",
        "monthly": "RM650"
      },
      "yamahaY15ZR": {
        "name": "Yamaha Y15ZR",
        "description": "运动型弯梁车 — 轻便灵活，城市骑行乐趣十足。",
        "daily": "RM40",
        "weekly": "RM230",
        "monthly": "RM750"
      },
      "modenasKrissMR3": {
        "name": "Modenas Kriss MR3",
        "description": "经典马来西亚电单车 — 可靠耐用、维护成本低，每日仅需RM30起。",
        "daily": "RM30",
        "weekly": "RM170",
        "monthly": "RM550"
      }
    },
    "howItWorks": {
      "heading": "三步轻松租车",
      "step1Title": "选择你的电单车",
      "step1Desc": "浏览以上车型，挑选最适合你需求和预算的电单车。",
      "step2Title": "WhatsApp联系我们",
      "step2Desc": "通过WhatsApp发送消息，告诉我们你想要的车型、租期和送车地点。",
      "step3Title": "当天送达",
      "step3Desc": "我们当天将电单车送到你家门口，立即骑行出发。"
    },
    "reviews": {
      "heading": "客户对Sewa Motor Malaysia的评价",
      "review1": "租了一个月的Honda Vario 160，车况非常好。跟承诺的一样当天送达，下次一定还会再租。",
      "review1Author": "Ahmad R.",
      "review1Location": "八打灵再也",
      "review2": "我急需一辆电单车做外卖工作。Sewa Motor在我WhatsApp联系他们的当天就把Yamaha Y15ZR送到了我家。非常靠谱。",
      "review2Author": "Wei Liang C.",
      "review2Location": "吉隆坡",
      "review3": "价格实惠，省心省力。我的电单车在维修期间，以RM30/天租了一辆Modenas Kriss MR3。服务好，团队亲切友善。",
      "review3Author": "Priya S.",
      "review3Location": "莎阿南"
    },
    "authority": {
      "heading": "马来西亚值得信赖的电单车出租服务",
      "paragraph1": "Sewa Motor Malaysia专为需要快速拿到电单车、不想繁琐手续的骑士而生。我们拥有一支定期保养的Honda、Yamaha和Modenas车队，支持马来西亚全国当天送达。每辆车在交付前都经过安全检查。",
      "paragraph2": "无论你是来马来西亚旅游的游客、上学通勤的学生、靠骑行赚取生活费的外卖骑手，还是自己的车在修理厂需要临时替代车辆 — 我们都能为你提供合适的电单车和合理的价格。我们的团队扎根本地，响应迅速，每天都在WhatsApp上为你服务。"
    },
    "locations": {
      "heading": "就近取车 — 我们配送覆盖马来西亚全国",
      "subheading": "选择你所在的城市，查看当天送达的电单车出租选项。"
    },
    "cta": {
      "heading": "准备好骑行了吗？今天就租一辆电单车。",
      "subheading": "每日RM30起，当天送达。发送WhatsApp消息，我们今天就把车送到你手上。",
      "button": "立即WhatsApp"
    }
  },
  "location": {
    "meta": {
      "title": "Sewa Motor {city} | 电单车出租 RM30/天起 | sewamotor.my",
      "description": "在{city}租电单车，每日RM30起。Honda、Yamaha、Modenas车型，当天送达。立即WhatsApp预订{city}电单车出租。"
    },
    "breadcrumbs": {
      "home": "首页",
      "location": "{city}"
    },
    "hero": {
      "headline": "{city}电单车出租 — 每日RM30起",
      "intro": "在{city}找电单车出租？Sewa Motor Malaysia当天直接将电单车送达{city}您的位置。Honda Vario、Yamaha NMax、Honda PCX等多款车型可选，日租、周租、月租，RM30/天起。"
    },
    "badges": {
      "sameDayDelivery": "{city}当天送达",
      "affordable": "RM30/天起",
      "maintained": "安全检测车队",
      "localSupport": "{city}本地支援"
    },
    "whyChoose": {
      "heading": "为什么选择{city}的Sewa Motor",
      "delivery": "{city}当天送达 — 在WhatsApp预订，今天就能骑行。无需等待。",
      "affordable": "RM30/天起的实惠价格 — 日租、周租、月租方案满足你的预算。",
      "fleet": "维护良好的车队 — 每辆电单车在交付前都经过安全检查。",
      "support": "本地支援团队 — 我们的{city}团队随时在WhatsApp上为你提供帮助。"
    },
    "banner": {
      "heading": "{city}电单车出租",
      "description": "6款电单车可供{city}租赁，支持当天送达。"
    },
    "nearby": {
      "heading": "附近地区",
      "description": "{city}附近地区同样支持当天送达。"
    },
    "cta": {
      "heading": "准备好在{city}租电单车了吗？",
      "subheading": "Sewa Motor Malaysia当天送达到您家门口 — 每日仅需RM30起。立即发送WhatsApp消息，今天就骑行出发。",
      "button": "WhatsApp租车 — {city}"
    },
    "faq": {
      "heading": "常见问题 — {city}电单车出租",
      "q1": "在{city}租电单车要多少钱？",
      "a1": "{city}电单车出租最低RM30/天（Modenas Kriss MR3）。也提供周租和月租方案，价格最高至RM1,100/月（Honda PCX 160）。租期越长，每日平均费用越低。",
      "q2": "你们在{city}送车吗？",
      "a2": "是的，我们提供{city}全区当天送达服务。只需通过WhatsApp告知您选择的车型和送车地址，我们当天就送到。",
      "q3": "在{city}有哪些电单车可以租？",
      "a3": "我们在{city}提供六款车型：Honda Vario 160、Yamaha NMax 155、Honda PCX 160、Honda Wave 125、Yamaha Y15ZR和Modenas Kriss MR3。每辆车都维护良好，可立即出租。",
      "q4": "在{city}租电单车需要押金吗？",
      "a4": "根据车型和租期，可能需要缴纳少量可退还押金。请通过WhatsApp联系我们，了解在{city}租赁所选车型的具体押金金额。",
      "q5": "在{city}可以租电单车做外卖吗？",
      "a5": "当然可以。我们在{city}有很多客户租电单车用于Grab、Foodpanda和ShopeeFood外卖工作。Honda Vario 160和Yamaha Y15ZR是外卖骑手的热门选择。",
      "q6": "怎么在{city}预订租车？",
      "a6": "预订非常简单。通过WhatsApp发送消息，告知您选择的车型、租期和{city}的送车地址，我们会确认车辆可用情况并安排当天送达。",
      "q7": "在{city}有最短租期限制吗？",
      "a7": "最短租期为一天。您可以租一天、一周或一个月。{city}的月租方案每日平均费用最划算。",
      "q8": "如果在{city}租赁期间电单车出故障怎么办？",
      "a8": "请立即通过WhatsApp联系我们。我们会尽快在{city}安排更换车辆或道路救援。您的安全和便利是我们的首要考量。",
      "q9": "在{city}可以续租吗？",
      "a9": "可以，随时可以续租。只需在当前租期结束前通过WhatsApp联系我们，我们会为您更新{city}的预订，不会有任何中断。",
      "q10": "在{city}有踏板车出租吗？",
      "a10": "有。Honda Vario 160、Yamaha NMax 155和Honda PCX 160都是可在{city}租赁的自动挡踏板车。踏板车出租RM50/天起，支持当天送达。"
    }
  }
}
```

---

## 6. Language Switcher Component

**File:** `components/LanguageSwitcher.tsx`

This is a CSS-only dropdown (no `useState`). Uses a checkbox hack for the toggle.

```tsx
import { useLocale } from 'next-intl'
import { routing } from '@/i18n/routing'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const languageLabels: Record<string, string> = {
  en: 'English',
  zh: '中文',
}

export default function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()

  // Remove current locale prefix from pathname to get the base path
  const pathnameWithoutLocale = pathname.replace(/^\/(en|zh)/, '') || '/'

  return (
    <div className="language-switcher">
      {/* Globe icon + current locale label */}
      <label htmlFor="lang-toggle" className="language-switcher__trigger">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span>{locale.toUpperCase()}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </label>

      {/* Hidden checkbox for CSS-only toggle */}
      <input
        type="checkbox"
        id="lang-toggle"
        className="language-switcher__checkbox"
        aria-label="Toggle language menu"
      />

      {/* Dropdown menu */}
      <ul className="language-switcher__menu">
        {routing.locales.map((loc) => (
          <li key={loc}>
            <Link
              href={`/${loc}${pathnameWithoutLocale}`}
              className={`language-switcher__option ${
                loc === locale ? 'language-switcher__option--active' : ''
              }`}
              hrefLang={loc}
            >
              {languageLabels[loc]}
            </Link>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .language-switcher {
          position: relative;
          display: inline-block;
        }

        .language-switcher__checkbox {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
          pointer-events: none;
        }

        .language-switcher__trigger {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.2s;
          user-select: none;
        }

        .language-switcher__trigger:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .language-switcher__menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 4px;
          padding: 4px 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          list-style: none;
          min-width: 120px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-4px);
          transition: opacity 0.2s, visibility 0.2s, transform 0.2s;
          z-index: 50;
        }

        .language-switcher__checkbox:checked ~ .language-switcher__menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .language-switcher__menu li {
          margin: 0;
          padding: 0;
        }

        .language-switcher__option {
          display: block;
          padding: 8px 16px;
          color: #374151;
          text-decoration: none;
          font-size: 14px;
          transition: background-color 0.15s;
        }

        .language-switcher__option:hover {
          background-color: #f3f4f6;
        }

        .language-switcher__option--active {
          font-weight: 600;
          color: #111827;
          background-color: #f9fafb;
        }
      `}</style>
    </div>
  )
}
```

**Usage note:** This component uses `useLocale()` and `usePathname()`, so it must be used inside a Client Component or marked with `'use client'` in a parent. Add `'use client'` at the top of this file:

```tsx
'use client'
```

The full file should have `'use client'` as its first line.

---

## 7. Layout Updates

**File:** `app/[locale]/layout.tsx`

```tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home.meta' })

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://sewamotor.my/${locale}`,
      languages: {
        en: 'https://sewamotor.my/en',
        zh: 'https://sewamotor.my/zh',
        'x-default': 'https://sewamotor.my/en',
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `https://sewamotor.my/${locale}`,
      siteName: 'Sewa Motor Malaysia',
      locale: locale === 'zh' ? 'zh_CN' : 'en_MY',
      type: 'website',
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  // Validate locale
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Load all messages for this locale
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

---

## 8. Usage Patterns

### Server Components

Use `getTranslations()` for all server-side rendering:

```tsx
import { getTranslations } from 'next-intl/server'

export default async function HeroSection() {
  const t = await getTranslations('home.hero')

  return (
    <section>
      <h1>{t('headline')}</h1>
      <p>{t('subheadline')}</p>
      <a href="#">{t('cta')}</a>
    </section>
  )
}
```

### Client Components

Use `useTranslations()` in client components:

```tsx
'use client'
import { useTranslations } from 'next-intl'

export default function WhatsAppButton() {
  const t = useTranslations('home.cta')

  return <button>{t('button')}</button>
}
```

### Location Pages with Dynamic Placeholders

For location pages, use ICU message format with `{city}` placeholders:

```tsx
import { getTranslations } from 'next-intl/server'

export default async function LocationPage({
  params,
}: {
  params: Promise<{ locale: string; location: string }>
}) {
  const { location } = await params
  const t = await getTranslations('location')
  const cityName = getCityDisplayName(location) // from config/locations.ts

  return (
    <section>
      <h1>{t('hero.headline', { city: cityName })}</h1>
      <p>{t('hero.intro', { city: cityName })}</p>
    </section>
  )
}
```

---

## 9. Translation Key Reference

| Section | Namespace | Keys |
|---|---|---|
| Navigation | `nav` | products, locations, whatsapp |
| Footer | `footer` | tagline, quickLinks, topLocations, copyright, home, products, locations |
| Homepage Hero | `home.hero` | headline, subheadline, cta |
| Homepage Stats | `home.stats` | rentals, rentalsDesc, delivery, deliveryDesc, price, priceDesc, rating, ratingDesc |
| Homepage Risk | `home.risk` | heading, paragraph1, paragraph2, paragraph3 |
| Homepage Products | `home.products` | heading, cta, daily, weekly, monthly, perDay, perWeek, perMonth, badge*, [product].* |
| Homepage How It Works | `home.howItWorks` | heading, step1Title, step1Desc, step2Title, step2Desc, step3Title, step3Desc |
| Homepage Reviews | `home.reviews` | heading, review[1-3], review[1-3]Author, review[1-3]Location |
| Homepage Authority | `home.authority` | heading, paragraph1, paragraph2 |
| Homepage Locations | `home.locations` | heading, subheading |
| Homepage CTA | `home.cta` | heading, subheading, button |
| Location Meta | `location.meta` | title, description |
| Location Breadcrumbs | `location.breadcrumbs` | home, location |
| Location Hero | `location.hero` | headline, intro |
| Location Badges | `location.badges` | sameDayDelivery, affordable, maintained, localSupport |
| Location Why Choose | `location.whyChoose` | heading, delivery, affordable, fleet, support |
| Location Banner | `location.banner` | heading, description |
| Location Nearby | `location.nearby` | heading, description |
| Location CTA | `location.cta` | heading, subheading, button |
| Location FAQ | `location.faq` | heading, q1-q10, a1-a10 |

---

## 10. Chinese Translation Notes

Key translation decisions for Simplified Chinese:

| English | Chinese | Rationale |
|---|---|---|
| motorcycle | 电单车 | Malaysian Chinese term (not mainland 摩托车) |
| same-day delivery | 当天送达 | Natural Chinese phrasing |
| WhatsApp Us | 立即WhatsApp | Keeps brand name, adds urgency with 立即 |
| budget-friendly | 经济实惠 | Standard Chinese for affordability |
| rent | 租 / 出租 | Context-dependent usage |
| scooter | 踏板车 | Malaysian Chinese common term |
| underbones | 弯梁车 | Standard motorcycle classification term |
| Petaling Jaya | 八打灵再也 | Official Chinese name for PJ |
| Kuala Lumpur | 吉隆坡 | Official Chinese name for KL |
| Shah Alam | 莎阿南 | Official Chinese name |
| food delivery | 外卖 | Common Chinese term for delivery food/riders |
| 5-Star Rated | 五星好评 | Natural Chinese review terminology |

---

## 11. File Checklist

| File | Status | Purpose |
|---|---|---|
| `i18n/routing.ts` | Defined | Locale routing config |
| `i18n/request.ts` | Defined | Server request config |
| `middleware.ts` | Defined | Locale detection middleware |
| `next.config.ts` | Defined | next-intl plugin setup |
| `messages/en.json` | Complete | English translations |
| `messages/zh.json` | Complete | Simplified Chinese translations |
| `components/LanguageSwitcher.tsx` | Complete | CSS-only language dropdown |
| `app/[locale]/layout.tsx` | Complete | Locale-aware root layout |

All files are ready for implementation.
