import type { IPricing } from "../types";

export const pricingData: IPricing[] = [
  {
    name: "Free",
    price: 0,
    period: "month",
    features: [
      "Generate up to 10 thumbnails/month",
      "Standard thumbnail resolution",
      "Basic AI styles",
      "Watermarked downloads",
      "Community support",
    ],
    mostPopular: false,
  },
  {
    name: "Pro",
    price: 29,
    period: "month",
    features: [
      "Generate up to 200 thumbnails/month",
      "High-resolution thumbnails",
      "Advanced AI styles",
      "No watermark",
      "Priority processing",
      "Email support",
    ],
    mostPopular: true,
  },
  {
    name: "Enterprise",
    price: 99,
    period: "month",
    features: [
      "Unlimited thumbnail generation",
      "Ultra HD resolution",
      "Custom AI branding styles",
      "No watermark",
      "API access",
      "Dedicated account manager",
      "24/7 priority support",
    ],
    mostPopular: false,
  },
];
