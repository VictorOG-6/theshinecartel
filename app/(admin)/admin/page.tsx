"use client";

import { useUserContext } from "@/contexts/user/user-context";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import useFetchDashboardSummary from "@/hooks/dashboard/use-fetch-dashboard-summary";
import CategoryBreakdown from "@/components/admin/category-breakdown";
import StatCard from "@/components/admin/stat-card";
import RecentOrders from "@/components/admin/recent-orders";
import TopProducts from "@/components/admin/top-products";

const Admin = () => {
  const { user } = useUserContext();
  const { data: dashboardSummary } = useFetchDashboardSummary();
  if (!user) return null;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-black text-2xl md:text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-neutral-500 text-sm mt-1">
          Welcome back {user.name}. Here's your store overview.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          icon={DollarSign}
          value={dashboardSummary?.total_revenue || 0}
          change={dashboardSummary?.revenue_change_percent || ""}
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Orders"
          icon={ShoppingCart}
          value={dashboardSummary?.total_orders || 0}
          change={dashboardSummary?.orders_change_percent || ""}
          iconBg="bg-primary/10"
        />
        <StatCard
          title="Products"
          icon={Package}
          value={dashboardSummary?.total_products || 0}
          iconBg="bg-violet-50"
        />
        <StatCard
          title="Customers"
          icon={Users}
          value={dashboardSummary?.total_customers || 0}
          change={dashboardSummary?.customers_change_percent || ""}
          iconBg="bg-amber-50"
        />
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CategoryBreakdown />
        </div>
        <div className="lg:col-span-1">
          <TopProducts />
        </div>
        <div className="lg:col-span-1">
          <RecentOrders />
        </div>
      </div>
    </div>
  );
};

export default Admin;
