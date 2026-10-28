import useFetchTopProducts from "@/hooks/dashboard/use-fetch-top-products";
import type { TopProducts } from "@/types";
import { Package } from "lucide-react";

export default function TopProducts() {
  const { data: products } = useFetchTopProducts({ limit: 5 });

  if (!products || products.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-inter text-lg font-semibold mb-4 text-black">
          Top Products
        </h3>
        <p className="text-sm text-neutral-500 text-center py-8">
          No products yet
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-5 md:p-6">
      <h3 className="font-inter text-lg font-semibold mb-4 text-black">
        Top Products
      </h3>
      <div className="space-y-3">
        {products.map((product: TopProducts) => (
          <div
            key={product.product.id}
            className="flex items-center gap-3 py-2"
          >
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0 overflow-hidden">
              {product.product.image_url ? (
                <img
                  src={product.product.image_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="w-4 h-4 text-accent-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {product.product.name}
              </p>
              <p className="text-xs text-neutral-500 capitalize">
                {product.product.category?.replace("_", " ")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">
                ${product.product.price?.toFixed(2)}
              </p>
              <p className="text-xs text-neutral-500">
                {product.quantity_sold || 0} in stock
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
