import { CartContent } from "@/components/pages/cart/cart-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your cart and checkout securely with Paystack.",

  keywords: [
    "cart",
    "checkout",
    "beauty",
    "skincare",
    "online store",
    "The Shine Cartel",
  ],

  openGraph: {
    title: "Cart | The Shine Cartel",
    description: "Review your cart and checkout securely with Paystack.",
    images: ["/opengraph-image.jpg"],
  },

  robots: {
    index: false,
    follow: true,
  },
};

export default function CartPage() {
  return <CartContent />;
}
