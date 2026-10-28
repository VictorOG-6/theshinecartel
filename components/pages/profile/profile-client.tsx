"use client";

import UserAvatar from "@/components/shared/user-avatar";
import UserStatCard from "@/components/pages/profile/user-stat-card";
import { OrderHistorySection } from "@/components/pages/profile/order-history-section";
import { ProductsToReviewSection } from "@/components/pages/profile/products-to-review-section";
import { YourReviewsSection } from "@/components/pages/profile/your-reviews-section";
import { useUserContext } from "@/contexts/user/user-context";
import { DollarSign, MessageSquare, Package } from "lucide-react";

export const ProfileContent = () => {
  const { user, isUserLoading } = useUserContext();

  if (isUserLoading || !user) return null;

  return (
    <main className="pt-20 lg:pt-16 bg-[#F6F3EC]">
      <section className="max-w-7xl mx-auto px-5 lg:px-0 py-10 md:py-20">
        <div className="flex flex-col items-center lg:items-start gap-7 pb-12 md:pb-15 border-b border-neutral-300">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-2.5 mb-5">
            <h1 className="text-base lg:text-xl font-medium text-primary font-roboto-mono">
              YOUR STUDIO
            </h1>
            <p className="text-sm lg:text-base text-neutral-500">
              Manage your orders and share your experience.
            </p>
          </div>
          <div className="flex items-center lg:items-start">
            <div className="flex flex-row items-center gap-2">
              <UserAvatar
                name={user.name}
                seed={user.email}
                src={user.profile_image_url}
                className="h-16 w-16"
              />
              <div>
                <h2 className="text-base md:text-xl text-black">{user.name}</h2>
                <p className="text-sm lg:text-base text-neutral-500">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
          <div className="w-full grid grid-cols-3 gap-4">
            <UserStatCard
              title="Total Orders"
              value={user.total_orders}
              icon={Package}
              iconBg="bg-emerald-50"
            />
            <UserStatCard
              title="Total Spent"
              value={user.total_spent}
              icon={DollarSign}
              iconBg="bg-primary/10"
            />
            <UserStatCard
              title="Reviews"
              value={user.total_reviews}
              icon={MessageSquare}
              iconBg="bg-violet-50"
            />
          </div>
        </div>
        <div className="flex flex-col gap-9 md:gap-11.5 py-7.5 md:py-12.5">
          <OrderHistorySection />
          <YourReviewsSection />
          <ProductsToReviewSection />
        </div>
      </section>
    </main>
  );
};
