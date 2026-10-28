import React from "react";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Customers = () => {
  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-0 pt-12 pb-24 md:pt-18 md:pb-30 flex flex-col gap-20 lg:gap-15">
      <div className="flex items-center justify-between">
        <div className="max-w-75 flex flex-col gap-3 text-center lg:text-left">
          <h1 className="text-base md:text-xl text-primary font-roboto-mono font-medium">
            THE THE SHINE CARTEL FACES
          </h1>
          <h2 className="text-[28px] md:text-[50px] text-black leading-9.5 md:leading-10.5">
            Made for real beauty.{" "}
          </h2>
        </div>
        <div className="hidden lg:flex flex-col items-center gap-3.5 text-primary">
          <h2 className="text-sm font-roboto-mono">Follow the glow</h2>
          <div className="flex items-center gap-3">
            <FaInstagram
              href="https://www.instagram.com/The Shine Cartelr.beauty"
              size={24}
              className="cursor-pointer transition-all duration-300 hover:text-primary"
            />
            <div className="bg-[#D9D9D9] w-0.5 h-4" />
            <FaTiktok
              href="https://www.tiktok.com/@The Shine Cartel.beauty"
              size={24}
              className="cursor-pointer transition-all duration-300 hover:text-primary"
            />
            <div className="bg-[#D9D9D9] w-0.5 h-4" />
            <FaXTwitter
              size={24}
              className="cursor-pointer transition-all duration-300 hover:text-primary"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-wrap lg:flex-row items-center lg:justify-between gap-12.5 lg:gap-7">
        <img
          src="/images/customer-1.avif"
          alt="Customer"
          className="w-full lg:w-93 lg:h-125 object-cover"
        />
        <img
          src="/images/customer-2.avif"
          alt="Customer"
          className="w-full lg:w-93 lg:h-125 object-cover"
        />
        <img
          src="/images/customer-3.avif"
          alt="Customer"
          className="w-full lg:w-93 lg:h-125 object-cover"
        />
      </div>
    </section>
  );
};

export default Customers;
