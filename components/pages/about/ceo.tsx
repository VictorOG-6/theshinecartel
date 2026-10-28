import Link from "next/link";
import React from "react";
import { AiFillInstagram } from "react-icons/ai";
import { FaTiktok, FaYoutube } from "react-icons/fa";

const CEO = () => {
  return (
    <section className="ptx-10 px-5 lg:px-0">
      <div
        className="relative max-w-7xl mx-auto flex-col-reverse flex lg:flex-row items-center lg:pl-14 lg:pr-6 pt-10 text-center lg:text-left lg:pt-35 overflow-hidden text-white rounded-[50px]"
        style={{
          backgroundImage: "url(/images/about-bg.avif)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="hidden lg:flex flex-col justify-center gap-4">
          <p className="max-w-112.5">
            At The Shine Cartel, we believe in the power of nature to nurture
            and restore your skin. Our products are crafted with the purest
            organic ingredients, harnessing the gifts of the earth to create a
            radiant, healthy glow for your skin.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="https://www.instagram.com/The Shine Cartelr.beauty/"
              className="w-12.5 h-12.5 flex rounded-full items-center justify-center bg-primary text-white transition-colors duration-300 cursor-pointer hover:text-primary hover:bg-white"
            >
              <AiFillInstagram size={35} />
            </Link>
            <Link
              href="#"
              className="w-12.5 h-12.5 flex rounded-full items-center justify-center bg-primary text-white transition-colors duration-300 cursor-pointer hover:text-primary hover:bg-white"
            >
              <FaYoutube size={35} />
            </Link>
            <Link
              href="https://www.tiktok.com/@The Shine Cartel.beauty/"
              className="w-12.5 h-12.5 flex rounded-full items-center justify-center bg-primary text-white transition-colors duration-300 cursor-pointer hover:text-primary hover:bg-white"
            >
              <FaTiktok size={35} />
            </Link>
          </div>
        </div>
        <img
          src="/images/diana.avif"
          alt="Diana Enaje"
          className="w-95 h-112.5 lg:w-115.5 md:h-114.5 relative z-10 object-cover"
        />
        <div className="max-w-95.5 px-5 lg:px-0 flex flex-col items-center lg:items-start justify-end pl-1 gap-4 text-sm md:text-xl lg:text-base lg:mt-32.5">
          <p>
            My vision is “To redefine online fashion shopping by merging style
            and technology, empowering everyone to confidently explore, try, and
            wear what suits them best anytime, anywhere
          </p>
          <h2 className="font-inter font-bold">~CEO, DIANA ENEJE</h2>
          <div className="flex lg:hidden items-center gap-4 mt-6 mb-11">
            <Link
              href="https://www.instagram.com/The Shine Cartelr.beauty/"
              className="w-10 h-10 md:w-12.5 md:h-12.5 flex rounded-full items-center justify-center bg-primary text-white transition-colors duration-300 cursor-pointer hover:text-primary hover:bg-white"
            >
              <AiFillInstagram size={30} />
            </Link>
            <Link
              href="#"
              className="w-10 h-10 md:w-12.5 md:h-12.5 flex rounded-full items-center justify-center bg-primary text-white transition-colors duration-300 cursor-pointer hover:text-primary hover:bg-white"
            >
              <FaYoutube size={30} />
            </Link>
            <Link
              href="https://www.tiktok.com/@The Shine Cartel.beauty/"
              className="w-10 h-10 md:w-12.5 md:h-12.5 flex rounded-full items-center justify-center bg-primary text-white transition-colors duration-300 cursor-pointer hover:text-primary hover:bg-white"
            >
              <FaTiktok size={30} />
            </Link>
          </div>
        </div>
        <h1 className="text-[30px] md:text-[85px] px-5 lg:px-0 lg:text-[122.89px] text-center text-primary relative lg:absolute lg:-top-3 lg:left-1/2 lg:-translate-x-1/2 z-0 mb-5 lg:mb-0 font-roboto-mono font-medium text-nowrap">
          THE SHINE CARTEL
        </h1>
      </div>
    </section>
  );
};

export default CEO;
