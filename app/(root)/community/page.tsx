import React from "react";
import WeeklyWinner from "@/components/pages/community/weekly-winner";
import CTA from "@/components/pages/community/cta";
import Creators from "@/components/pages/community/creators";
import ResultArchive from "@/components/pages/community/result-archive";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community",
  description: "Join our community and get the latest news and updates.",

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
    title: "Community | The Shine Cartel",
    description: "Join our community and get the latest news and updates.",
    images: ["/opengraph-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

const Community = () => {
  return (
    <main className="pt-20 md:pt-28">
      <WeeklyWinner />
      <CTA />
      <Creators />
      <ResultArchive />
    </main>
  );
};

export default Community;
