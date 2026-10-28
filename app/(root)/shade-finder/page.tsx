import ShadeFinderComponent from "@/components/pages/shade-finder/shade-finder";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shade Finder",
  description: "Find the perfect shade for your skin tone.",

  keywords: ["shade finder", "skin tone", "shade", "skin", "tone"],

  openGraph: {
    title: "Shade Finder | The Shine Cartel",
    description: "Find the perfect shade for your skin tone.",
    images: ["/opengraph-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function ShadeFinder() {
  return (
    <section className="max-w-7xl mx-auto min-h-[80vh] pt-25 md:pt-35 px-5 lg:px-0 pb-20">
      <ShadeFinderComponent />
    </section>
  );
}
