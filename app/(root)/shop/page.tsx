import { Metadata } from "next";
import { ShopContent } from "@/components/pages/shop/shop-client";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Shop",
  description: "Shop the latest products from our store.",

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
    title: "Shop | The Shine Cartel",
    description: "Shop the latest products from our store.",
    images: ["/opengraph-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

const Shop = () => (
  <Suspense
    fallback={
      <main className="pt-20 md:pt-28">
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-5 md:px-0">
            <div className="w-full flex flex-col items-center lg:items-start text-center lg:text-left gap-3.5 lg:gap-2.5">
              <h1 className="text-primary text-base md:text-xl font-roboto-mono">
                THE HOUSE EDIT
              </h1>
              <h2 className="text-[40px] md:text-[89px] text-black leading-13.75 md:leading-21.5">
                Shop <br /> slowly.
              </h2>
              <p className="text-black text-sm md:text-base">
                Shop our complete range of botanical powered skincare
                essentials.
              </p>
            </div>
          </div>
        </section>
      </main>
    }
  >
    <ShopContent />
  </Suspense>
);

export default Shop;
