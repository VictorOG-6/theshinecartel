import React from "react";
import CEO from "@/components/pages/about/ceo";
import Backstory from "@/components/pages/about/backstory";
import ShadeSpectrum from "@/components/pages/about/shade-spectrum";
import ShineCartel from "@/components/pages/about/shine-cartel";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "The Shine Cartel is a beauty brand that sells beauty and fashion products.",

  keywords: [
    "fashion",
    "beauty",
    "clothing",
    "products",
    "online store",
    "makeup",
    "beauty products",
  ],

  openGraph: {
    title: "About | The Shine Cartel",
    description:
      "The Shine Cartel is a beauty brand that sells beauty and fashion products.",
    images: ["/opengraph-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

const About = () => {
  return (
    <main className="pt-20 md:pt-28 bg-white">
      <CEO />
      <ShineCartel />
      <Backstory />
      <ShadeSpectrum />
    </main>
  );
};

export default About;
