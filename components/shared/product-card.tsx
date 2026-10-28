import { formatToNaira } from "@/lib/utils";
import { Product } from "@/types";
import Link from "next/link";
import { useCart } from "@/contexts/cart/cart-context";
import { toast } from "sonner";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem, isMutating } = useCart();
  const quantity = 1;
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants?.[0]?.id,
  );
  const variants = product.variants ?? [];
  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) ?? variants[0];
  const displayedImage = selectedVariant?.image_url || product.image_url;

  const handleAddToCart = () => {
    if (!product) return;

    addItem(product, quantity, selectedVariant?.id);
    toast.success("Product added to cart");
  };

  const content = (
    <>
      <Link
        href={`/products/${product.slug}`}
        className="relative block cursor-pointer"
      >
        <img
          src={displayedImage}
          alt={selectedVariant?.name || product.name}
          className="w-37.5 h-50 md:w-60 md:h-80 object-cover border border-gray-200"
        />
        {selectedVariant && (
          <span className="absolute bottom-2 left-2 font-roboto-mono text-xs text-primary text-shadow-xs">
            {selectedVariant.name}
          </span>
        )}
      </Link>
      <div className="flex flex-col items-center gap-2.5 font-roboto-mono">
        <h3 className="text-black text-sm md:text-xl">{product.name}</h3>
        <span className="text-primary text-sm md:text-xl">
          {formatToNaira(product.price)}
        </span>
        {product.average_rating !== 0 && (
          <div className="flex items-center justify-between">
            <img
              src="/images/5star.png"
              alt={`${product.average_rating} Stars`}
              className="w-16 h-4 md:w-25 md:h-5"
            />
            <span className="text-[#96959A] text-xs md:text-xl">{`(${product.total_reviews} reviews)`}</span>
          </div>
        )}
      </div>
      {variants.length > 0 && (
        <div
          className="flex flex-wrap items-center justify-center gap-2"
          aria-label={`Choose a ${product.name} color`}
        >
          {variants.map((variant) => {
            const isSelected = variant.id === selectedVariant?.id;

            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedVariantId(variant.id)}
                title={variant.name}
                aria-label={`Select ${variant.name}`}
                aria-pressed={isSelected}
                className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/30 ring-offset-2"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: variant.color }}
              />
            );
          })}
        </div>
      )}
      <button
        disabled={isMutating}
        onClick={handleAddToCart}
        className="w-9/10 py-2 flex items-center justify-center bg-white text-primary text-sm md:text-bases border border-primary transition-all duration-300 cursor-pointer hover:bg-primary hover:text-white"
      >
        ADD TO CART
      </button>
    </>
  );

  if (product.id) {
    return (
      <div className="flex flex-col items-center gap-5 transition-transform duration-300 hover:-translate-y-1">
        {content}
      </div>
    );
  }

  return <div className="flex flex-col items-center gap-5">{content}</div>;
};

export default ProductCard;
