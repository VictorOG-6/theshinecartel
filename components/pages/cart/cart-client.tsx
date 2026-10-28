"use client";

import CartItems from "@/components/shared/cart-items";
import { useCart } from "@/contexts/cart/cart-context";
import { useCreateOrder } from "@/hooks/order/use-create-order";
import processError from "@/lib/error";
import { redirectToPaystack } from "@/lib/paystack";
import { formatToNaira } from "@/lib/utils";
import { AxiosError } from "axios";
import { ArrowLeft, Loader2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CartContent = () => {
  const { items, totalItems, totalPrice, clearCart, clearLocalCart } =
    useCart();
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();
  const router = useRouter();

  const handleCheckout = () => {
    if (items.length === 0) return;

    const accessToken =
      typeof window !== "undefined"
        ? window.sessionStorage.getItem("access_token")
        : null;

    if (!accessToken) {
      toast.info("Sign in to checkout with your saved cart.");
      router.push("/sign-in?redirectUri=/cart");
      return;
    }

    createOrder(undefined, {
      onSuccess: ({ order, payment }) => {
        clearLocalCart();

        try {
          redirectToPaystack(payment.authorization_url);
        } catch {
          toast.error(
            "Your order was created, but payment could not be opened. You can retry from the order page.",
          );
          router.push(`/orders/${order.id}`);
        }
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          processError(error);
          return;
        }

        toast.error("Unable to create your order. Please try again.");
      },
    });
  };

  return (
    <main className="pt-28 md:pt-36">
      <section className="max-w-7xl mx-auto px-5 md:px-0 py-10 md:py-20">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          Continue shopping
        </Link>

        <div className="flex flex-col gap-3 mb-10">
          <h1 className="text-3xl md:text-6xl text-primary">Your Cart</h1>
          <p className="text-secondary">
            Review your items, update quantities, or remove products before
            checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <div className="rounded-[32px] bg-white border border-[#F0F0F0] p-5 md:p-8">
            <CartItems />
          </div>

          <aside className="h-fit rounded-[32px] bg-foreground p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-[#D9D9D9] pb-5">
              <div>
                <h2 className="font-roboto-mono text-xl text-primary">
                  Summary
                </h2>
                <p className="text-sm text-secondary">
                  {totalItems} item{totalItems === 1 ? "" : "s"}
                </p>
              </div>
              <ShoppingBag className="text-primary" size={28} />
            </div>

            <div className="space-y-4 py-5 text-secondary">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatToNaira(totalPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Delivery</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#D9D9D9] pt-4 text-lg font-semibold text-primary">
                <span>Total</span>
                <span>{formatToNaira(totalPrice)}</span>
              </div>
            </div>

            <button
              type="button"
              disabled={items.length === 0 || isCreatingOrder}
              onClick={handleCheckout}
              className="w-full bg-primary flex items-center justify-center gap-2.5 py-3 px-8 text-white font-semibold rounded-2xl shadow-md cursor-pointer transition-all duration-300 hover:bg-primary/80 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isCreatingOrder && <Loader2 className="h-4 w-4 animate-spin" />}
              Pay securely with Paystack
            </button>

            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="mt-3 w-full text-sm text-red-500 transition-colors hover:text-red-600"
              >
                Clear cart
              </button>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
};
