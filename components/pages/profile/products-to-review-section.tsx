"use client";

import useFetchEligibleProducts from "@/hooks/review/use-fetch-eligible-products";
import { Product } from "@/types";
import { Star } from "lucide-react";

export const ProductsToReviewSection = () => {
  const { data: eligibleProducts = [], isLoading: isEligibleProductsLoading } =
    useFetchEligibleProducts({
      page_size: 10,
      page: 1,
    });

  return (
    <div className="flex flex-col items-center lg:items-start gap-7.5">
      <div className="flex items-center gap-3 text-sm md:text-2xl text-black">
        <Star className="w-6 h-6" />
        <h2>Products To Review</h2>
      </div>
      <div className="max-h-80 overflow-y-scroll w-full bg-white rounded-2xl">
        {eligibleProducts.length <= 0 && !isEligibleProductsLoading && (
          <div className="w-full h-30 md:h-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-xs md:text-base text-neutral-400">
              <Star className="w-7 h-7 md:w-10 md:h-10" />
              <p>You haven&apos;t purchased any products yet to review.</p>
            </div>
          </div>
        )}
        {isEligibleProductsLoading && (
          <div className="md:gap-5.5 py-3.5 md:py-6 px-4 md:px-7 border-b border-neutral-300 animate-pulse">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-foreground" />
                  <div className="w-18.5 h-6 bg-foreground" />
                </div>
                <div className="w-20 md:w-27.5 h-10 bg-foreground" />
              </div>
            </div>
          </div>
        )}
        {eligibleProducts.length > 0 &&
          eligibleProducts.map((product: Product) => (
            <div
              key={product.id}
              className="md:gap-5.5 py-3.5 md:py-6 px-4 md:px-7 border-b border-neutral-300"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-10 object-cover"
                    />

                    <h4 className="text-base text-black">{product.name}</h4>
                  </div>
                  <button
                    type="button"
                    className="w-27.5 h-10 rounded-xl text-black text-sm flex items-center justify-center border border-neutral-200 cursor-pointer transition-all duration-300 hover:bg-neutral-200"
                  >
                    Write Review
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
