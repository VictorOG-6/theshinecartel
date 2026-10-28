"use client";

import { Badge } from "@/components/ui/badge";
import { useFetchOrders } from "@/hooks/order/use-fetch-order";
import { cn, formatToNaira } from "@/lib/utils";
import { Order, OrderStatus } from "@/types";
import { format } from "date-fns";
import { Package } from "lucide-react";

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "text-[#1D6939] bg-[#DCFCE7] border-green-200",
  processing: "bg-violet-50 text-violet-700 border-violet-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  refund_pending: "bg-amber-50 text-amber-700 border-amber-200",
  refunded: "bg-gray-50 text-gray-700 border-gray-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  failed: "bg-red-50 text-red-700 border-red-200",
};

export const OrderHistorySection = () => {
  const { data: orders = [], isLoading: isOrdersLoading } = useFetchOrders({
    page_size: 10,
    page: 1,
  });

  return (
    <div className="flex flex-col items-center lg:items-start gap-7.5">
      <div className="flex items-center gap-3 text-sm md:text-2xl text-black">
        <Package className="w-6 h-6" />
        <h2>Order History</h2>
      </div>
      <div className="max-h-80 overflow-y-scroll w-full bg-white rounded-2xl">
        {orders.length <= 0 && !isOrdersLoading && (
          <div className="w-full h-30 md:h-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-xs md:text-base text-neutral-400">
              <Package className="w-7 h-7 md:w-10 md:h-10" />
              <p>You haven&apos;t placed any orders yet.</p>
            </div>
          </div>
        )}
        {isOrdersLoading && (
          <div className="flex flex-col gap-4 md:gap-5.5 py-3.5 md:py-6 px-4 md:px-7 border-b border-neutral-300 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-start gap-1">
                <div className="h-4 w-10 md:w-20 bg-foreground" />
                <div className="h-4 w-8 md:w-15 bg-foreground" />
              </div>
              <div className="flex items-center gap-4 md:gap-5">
                <div className="w-22 h-6 md:h-7 text-xs md:text-sm bg-foreground" />
                <div className="h-4 w-10 md:w-20 font-bold bg-foreground" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-foreground" />
                  <div className="w-18.5 h-6 bg-foreground" />
                </div>
                <div className="w-18.5 h-6 bg-foreground" />
              </div>
            </div>
          </div>
        )}
        {orders.length > 0 &&
          orders.map((order: Order) => (
            <div
              key={order.id}
              className="flex flex-col gap-4 md:gap-5.5 py-3.5 md:py-6 px-4 md:px-7 border-b border-neutral-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-start gap-1">
                  <h3 className="text-black text-base md:text-xl">
                    {order.public_id}
                  </h3>
                  <p className="text-sm md:text-base text-neutral-500">
                    {format(new Date(order.created_at), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-4 md:gap-5">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[11px] font-medium border",
                      statusStyles[order.status],
                    )}
                  >
                    {order.status}
                  </Badge>
                  <p className="text-sm md:text-xl font-bold text-black">
                    {formatToNaira(order.total_price)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {order.order_items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="h-10 object-cover"
                      />
                      <h4 className="text-base text-black">
                        {item.product.name}
                      </h4>
                    </div>
                    <span className="text-base text-neutral-500">
                      x{item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
