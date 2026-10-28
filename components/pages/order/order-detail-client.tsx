"use client";

import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { useCancelOrder } from "@/hooks/order/use-cancel-order";
import { useFetchOrder } from "@/hooks/order/use-fetch-order";
import { useInitializePayment } from "@/hooks/payment/use-initialize-payment";
import processError from "@/lib/error";
import { redirectToPaystack } from "@/lib/paystack";
import { formatToNaira } from "@/lib/utils";
import { OrderItem } from "@/types";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { ArrowLeft, CreditCard, Loader2, Package, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export const OrderDetailContent = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, isError } = useFetchOrder(id);
  const { mutate: cancelOrder, isPending: isCancellingOrder } =
    useCancelOrder();
  const { mutate: initializePayment, isPending: isInitializingPayment } =
    useInitializePayment();

  const canCancelOrder =
    order?.status === "pending" ||
    order?.status === "processing" ||
    order?.status === "failed";
  const canPay = canCancelOrder;

  const handleCancelOrder = () => {
    if (!order) return;

    cancelOrder(
      { orderId: order.id },
      {
        onSuccess: () => {
          toast.success("Order cancelled successfully");
        },
        onError: () => {
          toast.error("Unable to cancel order");
        },
      },
    );
  };

  const handlePayment = () => {
    if (!order) return;

    initializePayment(order.id, {
      onSuccess: (payment) => {
        try {
          redirectToPaystack(payment.authorization_url);
        } catch {
          toast.error(
            "Payment was initialized, but Paystack checkout could not be opened.",
          );
        }
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          processError(error);
          return;
        }

        toast.error("Unable to start payment. Please try again.");
      },
    });
  };

  if (isLoading) {
    return (
      <main className="pt-28 md:pt-36">
        <section className="max-w-5xl mx-auto px-5 md:px-0 py-10 md:py-20">
          <div className="rounded-[32px] bg-foreground p-6 md:p-10 animate-pulse">
            <div className="h-8 w-48 bg-white rounded mb-8" />
            <div className="space-y-4">
              <div className="h-24 bg-white rounded-2xl" />
              <div className="h-24 bg-white rounded-2xl" />
              <div className="h-24 bg-white rounded-2xl" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (isError || !order) {
    return (
      <main className="pt-28 md:pt-36">
        <section className="max-w-5xl mx-auto px-5 md:px-0 py-20 text-center">
          <h1 className="font-roboto-mono text-2xl md:text-4xl text-primary">
            Order not found
          </h1>
          <p className="mt-3 text-secondary">
            We could not find the order you are looking for.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 mt-8 text-primary font-semibold"
          >
            <ArrowLeft size={18} />
            Back to shop
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="pt-28 md:pt-36">
      <section className="max-w-5xl mx-auto px-5 md:px-0 py-10 md:py-20">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          Back to shop
        </Link>

        <div className="rounded-[32px] bg-foreground p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 border-b border-[#D9D9D9] pb-6">
            <div>
              <p className="font-roboto-mono text-primary text-sm">
                Order details
              </p>
              <h1 className="font-roboto-mono text-2xl md:text-4xl text-primary mt-2">
                #{order.id}
              </h1>
              <p className="text-sm text-secondary mt-2">
                Placed {format(new Date(order.created_at), "PPP 'at' p")}
              </p>
            </div>

            <div className="flex flex-col md:items-end gap-3">
              <OrderStatusBadge status={order.status} />
              <div className="flex flex-wrap justify-end gap-2">
                {canPay && (
                  <button
                    type="button"
                    disabled={isInitializingPayment || isCancellingOrder}
                    onClick={handlePayment}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/80 disabled:opacity-60"
                  >
                    {isInitializingPayment ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard size={16} />
                    )}
                    Pay with Paystack
                  </button>
                )}
                {canCancelOrder && (
                  <button
                    type="button"
                    disabled={isCancellingOrder || isInitializingPayment}
                    onClick={handleCancelOrder}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-60"
                  >
                    {isCancellingOrder ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle size={16} />
                    )}
                    Cancel order
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-6 border-b border-[#D9D9D9] text-secondary">
            <div>
              <p className="text-xs uppercase tracking-wide text-primary">
                Customer
              </p>
              <p className="font-semibold mt-2">{order.user?.name}</p>
              <p className="text-sm">{order.user?.email}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-primary">
                Products
              </p>
              <p className="font-semibold mt-2">{order.total_products}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-primary">
                Total
              </p>
              <p className="font-semibold mt-2">
                {formatToNaira(order.total_price)}
              </p>
            </div>
          </div>

          <div className="py-6">
            <h2 className="font-roboto-mono text-primary text-xl md:text-2xl mb-5">
              Items
            </h2>
            {order.order_items?.length ? (
              <div className="space-y-4">
                {order.order_items.map((item: OrderItem) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl bg-white p-4"
                  >
                    {item.product?.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="h-24 w-24 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-2xl bg-foreground flex items-center justify-center text-primary">
                        <Package size={28} />
                      </div>
                    )}

                    <div className="flex-1">
                      <Link
                        href={`/products/${item.product_id}`}
                        className="font-semibold text-primary hover:underline"
                      >
                        {item.product?.name ?? "Product"}
                      </Link>
                      <p className="text-sm text-secondary mt-1">
                        Qty: {item.quantity} x{" "}
                        {formatToNaira(item.price_at_purchase)}
                      </p>
                    </div>

                    <p className="font-semibold text-primary">
                      {formatToNaira(item.quantity * item.price_at_purchase)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-white p-8 text-center text-secondary">
                No items found for this order.
              </div>
            )}
          </div>

          <div className="border-t border-[#D9D9D9] pt-6">
            <div className="ml-auto max-w-sm space-y-3 text-secondary">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatToNaira(order.total_price)}</span>
              </div>
              <div className="flex items-center justify-between font-semibold text-primary text-lg">
                <span>Total</span>
                <span>{formatToNaira(order.total_price)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
