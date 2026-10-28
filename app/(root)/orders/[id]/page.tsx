import { OrderDetailContent } from "@/components/pages/order/order-detail-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Details",
  description: "View your order status, items, and payment options.",

  keywords: ["order", "checkout", "payment", "The Shine Cartel"],

  openGraph: {
    title: "Order Details | The Shine Cartel",
    description: "View your order status, items, and payment options.",
    images: ["/opengraph-image.jpg"],
  },

  robots: {
    index: false,
    follow: true,
  },
};

export default function OrderDetailPage() {
  return <OrderDetailContent />;
}
