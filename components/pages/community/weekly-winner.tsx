import React from "react";
import { FaInstagram } from "react-icons/fa";

const WeeklyWinner = () => {
  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-0 flex flex-col lg:flex-row items-center justify-between gap-14.5 lg:gap-0 py-12 md:py-18">
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-2.5">
        <h1 className="text-primary font-medium font-roboto-mono text-base md:text-xl">
          THE SHINE BABES / 02
        </h1>
        <h2 className="font-roboto-mono font-medium text-black text-[28px] md:text-[89px] leading-13.75 md:leading-21.5">
          OUR BADDIE <br /> SPOTLIGHT
        </h2>
        <p className="max-w-71.5 md:max-w-114.5 text-black text-sm md:text-base">
          Celebrating the people in our community who embody The Shine Cartel
          spirit - confident, individual and entirely themselves.
        </p>
      </div>
      <div className="relative w-full h-125.5 lg:w-100.5 flex flex-col items-left justify-between overflow-hidden">
        <img
          src="/images/winner-1.avif"
          alt="Jhen"
          className="absolute left-0 top-0 w-full h-full object-cover"
        />
        <div className="flex items-center gap-1.5 text-primary text-base text-shadow-md px-5.5 py-4.5 z-10">
          <FaInstagram size={24} />
          thegirljhen
        </div>
        <div className="w-full bg-[linear-gradient(0deg,rgba(217,217,217,0.33)_20%,rgba(115,115,115,0.68)_50%)] px-5.5 py-1 text-white flex flex-col gap-2 z-10 text-center lg:text-left">
          <h2 className="text-base font-medium font-roboto-mono">Jhen</h2>
          <h3 className="text-sm md:text-base font-medium font-roboto-mono">
            THE SHINE CARTEL BADDIE OF THE WEEK
          </h3>
        </div>
      </div>
    </section>
  );
};

export default WeeklyWinner;
