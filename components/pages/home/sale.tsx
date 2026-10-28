"use client";

import ProductCard from "@/components/shared/product-card";
import useFetchCatalogs from "@/hooks/catalog/use-fetch-catalog";
import { useProductSlider } from "@/hooks/use-product-slider";
import { catalogToProduct } from "@/lib/catalog";
import { Product } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useMemo, useState } from "react";

const ARROW_CLASS =
  "cursor-pointer text-primary transition-colors disabled:cursor-not-allowed disabled:text-[#D9D9D9]";

const SLIDE_CLASS =
  "flex-none w-[calc((100%-1.5rem)/2)] md:w-[calc((100%-7.5rem)/4)] snap-start";

const Sale = () => {
  const [page, setPage] = useState<number>(1);
  const pageSize = 8;

  const { data: catalogs, isLoading } = useFetchCatalogs({
    page_size: pageSize,
    page,
    status_filter: "published",
  });

  const products = useMemo<Product[]>(() => {
    if (!catalogs?.length) return [];
    return catalogs.map(catalogToProduct);
  }, [catalogs]);

  const { scrollRef, canScrollLeft, canScrollRight, scrollProducts } =
    useProductSlider(products.length);
  return (
    <section className="px-5 lg:px-0 py-12 md:py-18">
      <div className="max-w-7xl mx-auto px-5 lg:pl-10 bg-foreground pt-6 pb-10 md:pt-10 md:pb-5 my-7 md:my-9 flex flex-col gap-17">
        <div className="flex lg:items-center justify-center lg:justify-between">
          <div className="flex flex-col items-center lg:items-start gap-3 text-center lg:text-left">
            <h1 className="text-primary text-base md:text-xl font-roboto-mono font-medium">
              THE THE SHINE CARTEL COLLECTION
            </h1>
            <h2 className="text-black text-[28px] lg:text-[50px]">
              On sale now
            </h2>
          </div>
          <div className="hidden lg:flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => scrollProducts(-1)}
              disabled={!canScrollLeft}
              aria-label="View previous products"
              className={ARROW_CLASS}
            >
              <ChevronLeft className="size-5 md:size-10" />
            </button>
            <div className="w-0.5 h-4 bg-[#D9D9D9]" />
            <button
              type="button"
              onClick={() => scrollProducts(1)}
              disabled={!canScrollRight}
              aria-label="View next products"
              className={ARROW_CLASS}
            >
              <ChevronRight className="size-5 md:size-10" />
            </button>
          </div>
        </div>
        <div>
          {isLoading ? (
            <div className="flex gap-6 md:gap-10 pl-7 overflow-hidden">
              {Array.from({ length: pageSize }).map((_, index) => (
                <div key={index} className={SLIDE_CLASS}>
                  <div className="flex flex-col items-center gap-5 animate-pulse">
                    <div className="w-37.5 h-50 md:w-60 md:h-80 bg-foreground rounded-2xl" />
                    <div className="h-4 w-28 bg-foreground rounded" />
                    <div className="h-4 w-20 bg-foreground rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="w-full rounded-2xl bg-foreground px-5 py-16 text-center text-secondary">
              No products found.
            </div>
          ) : (
            <div className="pl-7">
              <div
                ref={scrollRef}
                className="flex gap-6 md:gap-10 overflow-x-auto snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {products.map((product) => (
                  <div key={product.id} className={SLIDE_CLASS}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Sale;
