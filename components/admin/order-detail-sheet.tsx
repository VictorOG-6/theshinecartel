"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { formatToNaira } from "@/lib/utils";
import { Order, OrderStatus } from "@/types";
import { useFetchOrder } from "@/hooks/order/use-fetch-order";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUpdateOrder } from "@/hooks/order/use-update-order";
import { OrderStatusBadge } from "./order-status-badge";

interface OrderDetailSheetProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

export default function OrderDetailSheet({
  order,
  open,
  onClose,
}: OrderDetailSheetProps) {
  const { data: orderDetails, isLoading } = useFetchOrder(
    open ? order?.id : undefined,
  );
  const { mutate: updateOrder, isPending: isUpdatingStatus } = useUpdateOrder();
  const currentOrder = orderDetails ?? order;
  const [status, setStatus] = useState<OrderStatus>("pending");

  useEffect(() => {
    if (currentOrder?.status) {
      setStatus(currentOrder.status);
    }
  }, [currentOrder?.status]);

  if (!currentOrder) return null;

  const hasStatusChanged = status !== currentOrder.status;

  const handleSaveStatus = () => {
    if (!hasStatusChanged) return;

    updateOrder(
      {
        id: currentOrder.id,
        status,
      },
      {
        onSuccess: () => {
          toast.success("Order status updated successfully");
        },
        onError: () => {
          toast.error("Failed to update order status");
        },
      },
    );
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="font-inter">
            Order {currentOrder.id}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading latest order details...
            </div>
          )}

          {/* Status */}
          <div className="flex gap-2">
            <OrderStatusBadge status={currentOrder.status} />
          </div>

          {/* Customer */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Customer</h4>
            <p className="text-sm">{currentOrder.user.name}</p>
            <p className="text-xs text-neutral-500">
              {currentOrder.user.email}
            </p>
          </div>

          <Separator />

          {/* Items */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Items</h4>
            <div className="space-y-2">
              {currentOrder.order_items?.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-xs text-neutral-500">
                      Qty: {item.quantity} x{" "}
                      {formatToNaira(item.price_at_purchase)}
                    </p>
                  </div>
                  <p className="font-medium">
                    {formatToNaira(item.quantity * item.price_at_purchase)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal</span>
                <span>{formatToNaira(currentOrder.total_price)}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Products</span>
                <span>{currentOrder.total_products}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>{formatToNaira(currentOrder.total_price)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Update section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Update Order</h4>
            <div className="space-y-2">
              <Label>Order Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as OrderStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select order status" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "pending",
                    "processing",
                    "confirmed",
                    "completed",
                    "cancelled",
                    "failed",
                    "refunded",
                  ].map((orderStatus) => (
                    <SelectItem
                      key={orderStatus}
                      value={orderStatus}
                      className="capitalize"
                    >
                      {orderStatus}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleSaveStatus}
              disabled={!hasStatusChanged || isUpdatingStatus}
              className="w-full"
            >
              {isUpdatingStatus && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Save Status
            </Button>
          </div>

          <Separator />

          {/* Date & Notes */}
          <div className="text-xs text-neutral-500 space-y-1">
            {currentOrder.created_at && (
              <p>
                Created:{" "}
                {format(new Date(currentOrder.created_at), "PPP 'at' p")}
              </p>
            )}
            {currentOrder.updated_at && (
              <p>
                Updated:{" "}
                {format(new Date(currentOrder.updated_at), "PPP 'at' p")}
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
