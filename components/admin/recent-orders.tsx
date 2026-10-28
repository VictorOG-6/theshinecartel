"use client";

import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useFetchAllOrders } from "@/hooks/order/use-fetch-all-orders";
import { OrderStatus } from "@/types";

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  processing: "bg-violet-50 text-violet-700 border-violet-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  refund_pending: "bg-amber-50 text-amber-700 border-amber-200",
  refunded: "bg-gray-50 text-gray-700 border-gray-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  failed: "bg-red-50 text-red-700 border-red-200",
};

export default function RecentOrders() {
  const { data: orders } = useFetchAllOrders();
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-inter text-lg font-semibold mb-4 text-black">
          Recent Orders
        </h3>
        <p className="text-sm text-neutral-500 text-center py-8">
          No orders yet
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-5 md:p-6">
      <h3 className="font-inter text-lg font-semibold mb-4 text-black">
        Recent Orders
      </h3>
      <div className="space-y-3">
        {orders.slice(0, 5).map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between py-3 border-b border-border last:border-0"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-black">
                {order.user?.name}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">
                {order.public_id} ·{" "}
                {order.created_at
                  ? format(new Date(order.created_at), "MMM d")
                  : ""}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={cn(
                  "text-[11px] font-medium border",
                  statusStyles[order.status],
                )}
              >
                {order.status}
              </Badge>
              <span className="text-sm font-semibold min-w-15 text-right">
                ${order.total_price?.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
