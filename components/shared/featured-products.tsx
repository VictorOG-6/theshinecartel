"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useMemo, useState } from "react";
import useFetchProducts from "@/hooks/product/use-fetch-products";
import { useProductSlider } from "@/hooks/use-product-slider";
import { Product } from "@/types";
import ProductCard from "./product-card";

const SLIDE_CLASS =
  "flex-none w-[calc((100%-1.5rem)/2)] md:w-[calc((100%-7.5rem)/4)] snap-start";

const ARROW_CLASS =
  "cursor-pointer text-primary transition-colors disabled:cursor-not-allowed disabled:text-[#D9D9D9]";

const FeaturedProducts = () => {
  const [page, setPage] = useState<number>(1);
  const pageSize = 8;

  const { data: productResponse, isLoading } = useFetchProducts({
    page_size: pageSize,
    page,
    status: "published",
  });

  const products = useMemo<Product[]>(() => {
    if (Array.isArray(productResponse)) return productResponse;
    return productResponse?.data ?? productResponse?.items ?? [];
  }, [productResponse]);

  const { scrollRef, canScrollLeft, canScrollRight, scrollProducts } =
    useProductSlider(products.length);

  return (
    <section className="max-w-7xl mx-auto py-20 px-5 md:px-0 overflow-hidden">
      <div className="flex items-center justify-between text-primary mb-16 md:mb-25">
        <h1 className="text-sm md:text-3xl font-roboto-mono">
          The Shine Cartel Featured
        </h1>
        <div className="flex items-center gap-2.5">
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
          <div className="flex gap-6 md:gap-10 overflow-hidden">
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
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
