import React from "react";

const Backstory = () => {
  return (
    <section className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 lg:gap-0 items-center justify-between pb-12 md:pb-18 px-5 lg:px-0">
      <div className="max-w-131.5 flex flex-col items-center lg:items-start text-center lg:text-left">
        <div className="flex flex-col items-center lg:items-start gap-2.5 mb-9.5 lg:mb-4.5">
          <h1 className="text-primary text-base md:text-xl font-roboto-mono font-medium">
            THE BACKSTORY
          </h1>
          <h2 className="max-w-61 md:max-w-75 text-black text-[28px] md:text-[38px] leading-8 md:leading-10.5">
            The Shine Cartel Blueprint
          </h2>
        </div>
        <p className="text-tertiary text-sm md:text-xl mb-6 md:mb-11">
          At The Shine Cartel, we believe in the power of nature to nurture and
          restore your skin. Our products are crafted with the purest organic
          ingredients, harnessing the gifts of the earth to create a radiant,
          healthy glow for your skin. range of botanical powered skincare
          essentials.
        </p>
        <div className="flex items-center gap-7">
          <div className="space-y-6">
            <h3 className="text-primary text-sm md:text-3xl">50</h3>
            <p className="text-xs md:text-xl text-tertiary font-bold">
              Ingredients
            </p>
          </div>
          <div className="space-y-6">
            <h3 className="text-primary text-sm md:text-3xl">10</h3>
            <p className="text-xs md:text-xl text-tertiary font-bold">
              Countries
            </p>
          </div>
          <div className="space-y-6">
            <h3 className="text-primary text-sm md:text-3xl">4yr</h3>
            <p className="text-xs md:text-xl text-tertiary font-bold">R&D</p>
          </div>
        </div>
      </div>
      <div className="relative">
        <img
          src="/images/about-hero.avif"
          alt="About The Shine Cartel"
          className="w-full md:w-139 md:h-120.5 object-cover"
        />
        <img
          src="/images/package.avif"
          alt="The Shine Cartel Shopping Bag"
          className="absolute w-87.5 h-61.75 z-10 bottom-[-22%] md:-bottom-1/4 right-0 md:-right-14"
        />
      </div>
    </section>
  );
};

export default Backstory;
