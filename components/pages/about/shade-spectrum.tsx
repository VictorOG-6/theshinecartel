import Link from "next/link";
import React from "react";
import { FaArrowRight } from "react-icons/fa";

const ShadeSpectrum = () => {
  return (
    <section className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row gap-20 items-center py-24 md:py-18 px-5 lg:px-0">
      <div className="w-full h-168 lg:w-134 lg:h-201 relative flex items-end pl-11 pb-4.5 lg:pb-6 overflow-hidden">
        <img
          src="/images/shade-hero.avif"
          alt="Shade Spectrum"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="lg:max-w-49 flex flex-col gap-1.5 lg:gap-2.5 text-white z-10">
          <h2 className="font-roboto-mono text-sm">COLOR, WITHOUT RULES</h2>
          <h3 className="text-[28px] lg:text-[38px] leading-9 lg:leading-10.5">
            Meet your <br /> undertone
          </h3>
          <Link
            href="/shade-finder"
            className="text-sm border-b border-white pb-3 cursor-pointer flex items-center gap-1.5 transition-all duration-300 hover:gap-2"
          >
            ENTER THE TRADITION <FaArrowRight size={12} />
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-2.5 items-center lg:items-start text-center lg:text-left">
          <h1 className="text-primary text-base md:text-xl font-roboto-mono font-medium">
            SHADE SPECTRUM
          </h1>
          <h2 className="text-black text-[28px] md:text-[38px] leading-8 md:leading-10.5">
            A shade for <br /> every tone
          </h2>
          <p className="max-w-88 text-tertiary text-sm md:text-xl mt-7 lg:mt-3">
            We believe beauty should never ask you to fit the shade. Our range
            is built around the people who wear it, with shades that reflect the
            breadth of real skin tones.
          </p>
        </div>
        <div className="w-full border-t border-primary pt-7 flex items-center gap-11 lg:gap-20">
          <div className="flex flex-col items-center lg:items-start gap-6">
            <h3 className="text-primary text-[28px] md:text-3xl">48</h3>
            <p className="text-base text-tertiary font-bold font-roboto-mono text-center lg:text-left">
              skin-true shades
            </p>
          </div>
          <div className="flex flex-col items-center lg:items-start gap-6">
            <h3 className="text-primary text-[28px] md:text-3xl">01</h3>
            <p className="text-base text-tertiary font-bold font-roboto-mono text-center lg:text-left">
              personal tradition
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShadeSpectrum;
