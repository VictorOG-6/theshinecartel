import Image from "next/image";
import Link from "next/link";
import React from "react";

const Categories = () => {
  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-0 grid grid-cols-1 md:grid-cols-2 gap-11 md:gap-2.5 py-12 md:py-18 justify-items-center lg:justify-items-stretch">
      <Link
        href="/shop?categories=Lip+Kits"
        className="relative px-4 py-5 flex items-end w-full h-96.5 overflow-hidden"
      >
        <img
          src="/images/cat-1.avif"
          alt="Lip Gloss Category"
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="flex flex-col md:gap-4 gap-2 text-white z-10">
          <h2 className="text-2xl md:text-3xl">LIP GLOSS</h2>
          <p className="underline text-base md:text-xl">SHOP NOW</p>
        </div>
      </Link>
      <Link
        href="/shop?categories=Palettes"
        // lg:w-140 md:w-75
        className="relative px-4 py-5 flex items-end w-full h-96.5 overflow-hidden"
      >
        <img
          src="/images/cat-2.avif"
          alt="Palette Category"
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="flex flex-col md:gap-4 gap-2 text-white z-10">
          <h2 className="text-2xl md:text-3xl">PALETTE</h2>
          <p className="underline text-base md:text-xl">SHOP NOW</p>
        </div>
      </Link>
      <Link
        href="/shop?categories=Blushes"
        className="relative px-4 py-5 flex items-end w-full h-96.5 overflow-hidden"
      >
        <img
          src="/images/cat-3.avif"
          alt="Blushes Category"
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="flex flex-col md:gap-4 gap-2 text-white z-10">
          <h2 className="text-2xl md:text-3xl">BLUSHES</h2>
          <p className="underline text-base md:text-xl">SHOP NOW</p>
        </div>
      </Link>
      <Link
        href="/shop?categories=Lip+Kits"
        className="relative px-4 py-5 flex items-end w-full h-96.5 overflow-hidden"
      >
        <img
          src="/images/cat-4.avif"
          alt="Lip Kits Category"
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="flex flex-col gap-2 md:gap-4 text-white z-10">
          <h2 className="text-2xl md:text-3xl">LIP KITS</h2>
          <p className="underline text-base md:text-xl">SHOP NOW</p>
        </div>
      </Link>
    </section>
  );
};

export default Categories;
