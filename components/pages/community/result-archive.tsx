"use client";

import { useProductSlider } from "@/hooks/use-product-slider";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

const ARROW_CLASS =
  "cursor-pointer text-primary transition-colors disabled:cursor-not-allowed disabled:text-[#D9D9D9]";

const SLIDE_CLASS =
  "w-88.5 md:w-113.5 shrink-0 snap-start rounded-t-[15px] overflow-hidden flex items-center";

const RESULTS = [
  {
    before: "/images/results-1be.jpg",
    after: "/images/results-1af.jpg",
  },
  {
    before: "/images/results-2be.jpg",
    after: "/images/results-2af.jpg",
  },
  {
    before: "/images/results-1be.jpg",
    after: "/images/results-1af.jpg",
  },
] as const;

const ResultArchive = () => {
  const { scrollRef, canScrollLeft, canScrollRight, scrollProducts } =
    useProductSlider(RESULTS.length);

  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-0 pt-12 pb-24 md:pt-18 md:pb-30 flex flex-col items-center lg:items-start gap-12 md:gap-15">
      <div className="w-full flex flex-col lg:flex-row lg:items-end justify-between">
        <div className="text-center lg:text-left flex flex-col items-center lg:items-start gap-2.5">
          <h1 className="text-primary font-roboto-mono text-sm md:text-xl font-medium">
            A TRANSFORMATIVE EXPERIENCE
          </h1>
          <h2 className="text-black text-[28px] md:text-[38px] leading-7 md:leading-9.5">
            RESULTS <br /> ARCHIVE
          </h2>
          <div className="flex items-center gap-1.5 text-sm lg:text-base text-black mt-5 lg:mt-2.5">
            <p>UNEDITED TRANSFORMATIONS </p> <span>.</span>{" "}
            <p> DOCUMENTED RESULTS</p>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => scrollProducts(-1)}
            disabled={!canScrollLeft}
            aria-label="View previous results"
            className={ARROW_CLASS}
          >
            <ChevronLeft className="size-5 md:size-10" />
          </button>
          <div className="w-0.5 h-4 bg-[#D9D9D9]" />
          <button
            type="button"
            onClick={() => scrollProducts(1)}
            disabled={!canScrollRight}
            aria-label="View next results"
            className={ARROW_CLASS}
          >
            <ChevronRight className="size-5 md:size-10" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="w-full flex items-center gap-5 md:gap-10 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {RESULTS.map((result, index) => (
          <div key={index} className={SLIDE_CLASS}>
            <div className="relative w-42.5 md:w-56.5 h-70 shrink-0 flex items-end border-r-2 border-[#808080]">
              <img
                src={result.before}
                alt={`Result Archive ${index + 1} Before`}
                className="absolute top-0 left-0 w-full h-full object-center object-cover"
              />
              <div className="bg-[#E6DAD3]/60 w-full py-3 px-4 text-primary font-roboto-mono text-sm font-medium z-10">
                BEFORE
              </div>
            </div>
            <div className="relative w-42.5 md:w-56.5 h-70 shrink-0 flex items-end border-l-2 border-[#808080]">
              <img
                src={result.after}
                alt={`Result Archive ${index + 1} After`}
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
              <div className="bg-[#E6DAD3]/60 w-full py-3 px-4 text-primary font-roboto-mono text-sm font-medium z-10">
                AFTER
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ResultArchive;
