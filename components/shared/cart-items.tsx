"use client";

import { LocalCartItem, useCart } from "@/contexts/cart/cart-context";
import { formatToNaira } from "@/lib/utils";
import { Minus, Package, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

interface CartItemsProps {
  compact?: boolean;
  maxItems?: number;
}

const CartItemRow = ({
  item,
  compact = false,
}: {
  item: LocalCartItem;
  compact?: boolean;
}) => {
  const { incrementItem, decrementItem, removeItem, isMutating } = useCart();
  const productHref = `/products/${item.product_id}`;

  return (
    <div
      className={`flex gap-3 border-b border-[#E5E5E5] pb-4 last:border-0 ${compact ? "items-start" : "sm:items-center"}`}
    >
      <Link href={productHref} className="shrink-0">
        {item.product.image_url ? (
          <img
            src={item.product.image_url}
            alt={item.product.name}
            className={`${compact ? "h-14 w-14" : "h-24 w-24"} rounded-2xl object-cover`}
          />
        ) : (
          <div
            className={`${compact ? "h-14 w-14" : "h-24 w-24"} rounded-2xl bg-foreground flex items-center justify-center text-primary`}
          >
            <Package size={compact ? 18 : 28} />
          </div>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={productHref}
          className={`block font-semibold text-primary hover:underline ${compact ? "text-xs" : "text-base"}`}
        >
          {item.product.name}
        </Link>
        {item.product.variant_name && (
          <p
            className={`text-secondary ${compact ? "text-[11px] mt-0.5" : "text-sm mt-1"}`}
          >
            {item.product.variant_name}
            {item.product.sub_variant_size
              ? ` · ${item.product.sub_variant_size}`
              : ""}
          </p>
        )}
        {!item.product.variant_name && item.product.sub_variant_size && (
          <p
            className={`text-secondary ${compact ? "text-[11px] mt-0.5" : "text-sm mt-1"}`}
          >
            Size: {item.product.sub_variant_size}
          </p>
        )}
        {!compact && item.product.category && (
          <p className="mt-1 text-xs capitalize text-secondary">
            {item.product.category}
          </p>
        )}
        <p
          className={`text-secondary ${compact ? "text-xs" : "text-sm"} ${item.product.variant_name || item.product.sub_variant_size || !compact ? "mt-2" : "mt-1"}`}
        >
          {formatToNaira(item.price)}
        </p>

        <div className="mt-3 flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-[#F0F0F0] px-2 py-1 text-primary">
            <button
              type="button"
              disabled={isMutating}
              onClick={() =>
                decrementItem(
                  item.product_id,
                  item.product_variant_id,
                  item.product_sub_variant_id,
                )
              }
              className="disabled:opacity-50 cursor-pointer"
              aria-label={`Decrease ${item.product.name} quantity`}
            >
              <Minus size={compact ? 12 : 14} />
            </button>
            <span
              className={`min-w-5 text-center font-semibold text-secondary ${compact ? "text-xs" : "text-sm"}`}
            >
              {item.quantity}
            </span>
            <button
              type="button"
              disabled={isMutating}
              onClick={() =>
                incrementItem(
                  item.product_id,
                  item.product_variant_id,
                  item.product_sub_variant_id,
                )
              }
              className="disabled:opacity-50 cursor-pointer"
              aria-label={`Increase ${item.product.name} quantity`}
            >
              <Plus size={compact ? 12 : 14} />
            </button>
          </div>

          <button
            type="button"
            disabled={isMutating}
            onClick={() =>
              removeItem(
                item.product_id,
                item.product_variant_id,
                item.product_sub_variant_id,
              )
            }
            className="text-red-500 transition-colors hover:text-red-600 disabled:opacity-50 cursor-pointer"
            aria-label={`Remove ${item.product.name} from cart`}
          >
            <Trash2 size={compact ? 14 : 16} />
          </button>
        </div>
      </div>

      {!compact && (
        <p className="hidden sm:block font-semibold text-primary">
          {formatToNaira(item.price * item.quantity)}
        </p>
      )}
    </div>
  );
};

export default function CartItems({
  compact = false,
  maxItems,
}: CartItemsProps) {
  const { items } = useCart();
  const displayedItems = maxItems ? items.slice(0, maxItems) : items;
  const hiddenItemsCount = Math.max(0, items.length - displayedItems.length);

  if (items.length === 0) {
    return (
      <div
        className={`rounded-2xl bg-foreground text-center text-secondary ${compact ? "px-4 py-8 text-xs" : "px-6 py-16"}`}
      >
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className={compact ? "space-y-4" : "space-y-5"}>
      {displayedItems.map((item) => (
        <CartItemRow
          key={`${item.product_id}:${item.product_variant_id ?? ""}:${item.product_sub_variant_id ?? ""}`}
          item={item}
          compact={compact}
        />
      ))}
      {hiddenItemsCount > 0 && (
        <p className="text-center text-xs text-secondary">
          +{hiddenItemsCount} more item{hiddenItemsCount > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
