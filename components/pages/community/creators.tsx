"use client";

import { useProductSlider } from "@/hooks/use-product-slider";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

const ARROW_CLASS =
  "cursor-pointer text-primary transition-colors disabled:cursor-not-allowed disabled:text-[#D9D9D9]";

const SLIDE_CLASS = "h-full shrink-0 snap-start flex";

const CREATORS = [
  {
    handle: "@its.priscyy",
    image: "/images/influencer-1.avif",
    imageClass: "w-75 h-75 md:w-100 md:h-100",
    alignClass: "items-start",
  },
  {
    handle: "@_omachu",
    image: "/images/influencer-2.avif",
    imageClass: "w-75 h-75 md:w-80 md:h-100",
    alignClass: "items-start md:items-end",
  },
  {
    handle: "@penley___",
    image: "/images/influencer-3.avif",
    imageClass: "w-75 h-75 md:w-80 md:h-100",
    alignClass: "items-start",
  },
] as const;

const textShadowStyle = {
  textShadow: `
    2px 0 black,
    -2px 0 black,
    0 2px black,
    0 -2px black,
    1.5px 1.5px black,
    -1.5px -1.5px black,
    1.5px -1.5px black,
    -1.5px 1.5px black
  `,
} as const;

const Creators = () => {
  const { scrollRef, canScrollLeft, canScrollRight, scrollProducts } =
    useProductSlider(CREATORS.length);

  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-0 py-12 md:py-18 flex flex-col items-center lg:items-start gap-12 md:gap-15">
      <div className="w-full flex flex-col lg:flex-row items-center justify-between">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-2.5">
          <h1 className="text-base md:text-xl text-primary font-roboto-mono font-medium">
            THE SHINE CARTEL INFLUENCE
          </h1>
          <h2 className="text-[28px] md:text-[50px] text-black leading-9.5 md:leading-10.5">
            From creators to <br /> the faces we love.
          </h2>
        </div>
        <div className="hidden lg:flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => scrollProducts(-1)}
            disabled={!canScrollLeft}
            aria-label="View previous creators"
            className={ARROW_CLASS}
          >
            <ChevronLeft className="size-5 md:size-10" />
          </button>
          <div className="w-0.5 h-4 bg-[#D9D9D9]" />
          <button
            type="button"
            onClick={() => scrollProducts(1)}
            disabled={!canScrollRight}
            aria-label="View next creators"
            className={ARROW_CLASS}
          >
            <ChevronRight className="size-5 md:size-10" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="md:h-135 w-full flex items-center gap-5 lg:gap-14.5 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {CREATORS.map((creator) => (
          <div
            key={creator.handle}
            className={`${SLIDE_CLASS} ${creator.alignClass}`}
          >
            <div
              className={`relative ${creator.imageClass} flex items-end py-4 px-5`}
            >
              <img
                src={creator.image}
                alt={creator.handle}
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
              <span
                className="text-2xl text-white text-shadow-md z-10"
                style={textShadowStyle}
              >
                {creator.handle}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Creators;
