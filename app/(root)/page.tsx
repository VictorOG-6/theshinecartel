import CTA from "@/components/pages/home/cta";
import Categories from "@/components/pages/home/categories";
import HeroSection from "@/components/pages/home/hero-section";
import Sale from "@/components/pages/home/sale";
import Exclusive from "@/components/pages/home/exclusive";
import Customers from "@/components/pages/home/customers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "The Shine Cartel is a beauty brand that sells beauty and fashion products.",

  keywords: [
    "fashion",
    "beauty",
    "clothing",
    "products",
    "online store",
    "makeup",
    "beauty products",
  ],

  openGraph: {
    title: "Home | The Shine Cartel",
    description:
      "The Shine Cartel is a beauty brand that sells beauty and fashion products.",
    images: ["/opengraph-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CTA />
      <Categories />
      <Sale />
      <Exclusive />
      <Customers />
    </main>
  );
}
