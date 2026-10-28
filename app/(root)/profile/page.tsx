import { ProfileContent } from "@/components/pages/profile/profile-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your orders, reviews, and account details.",

  keywords: [
    "profile",
    "orders",
    "reviews",
    "account",
    "The Shine Cartel",
  ],

  openGraph: {
    title: "Profile | The Shine Cartel",
    description: "Manage your orders, reviews, and account details.",
    images: ["/opengraph-image.jpg"],
  },

  robots: {
    index: false,
    follow: true,
  },
};

export default function ProfilePage() {
  return <ProfileContent />;
}
