import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const CTA = () => {
  return (
    <section className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-6 lg:gap-0 justify-between py-7 md:py-9 px-5 lg:px-0">
      <div className="flex flex-col items-center lg:items-start gap-3 text-center lg:text-left">
        <h1 className="text-primary font-roboto-mono text-base md:text-xl font-medium">
          A MORE PERSONAL BEAUTY HOUSE
        </h1>
        <h2 className="text-black font-regular text-[28px] md:text-[50px] leading-9 md:leading-10.5">
          Nothing to hide. <br /> Everything to feel.
        </h2>
      </div>
      <div className="max-w-120.5 flex flex-col items-center lg:items-start gap-4 md:gap-5 text-center lg:text-left">
        <p className="text-black text-sm md:text-base leading-7">
          We make the things that live closest to you: a tint that meets your
          skin where it is, a dress that follows your movement, a balm that
          looks like you on your best ordinary day.
        </p>
        <Link
          href="/community"
          className="flex items-center gap-2 text-primary text-base border-b border-primary pb-3 cursor-pointer transition-all duration-300 hover:text-primary/60"
        >
          BE PART OF OUR COMMUNITY
          <ArrowRight size={24} />
        </Link>
      </div>
    </section>
  );
};

export default CTA;
