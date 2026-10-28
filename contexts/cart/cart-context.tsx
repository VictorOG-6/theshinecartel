"use client";

import useFetchCart from "@/hooks/cart/use-fetch-cart";
import { useCreateCartItem } from "@/hooks/cart/use-create-cart-item";
import { useDeleteCartItem } from "@/hooks/cart/use-delete-cart-item";
import { useUpdateCartItem } from "@/hooks/cart/use-update-cart-item";
import { Cart, CartItem, Product } from "@/types";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";
import { toast } from "sonner";

const CART_STORAGE_KEY = "The Shine Cartel_beauty_cart";
const CART_STORAGE_EVENT = "the_shine_cartel-cart-updated";

export type LocalCartProduct = Pick<
  Product,
  "id" | "name" | "image_url" | "price" | "category" | "description"
> & {
  variant_name?: string;
  sub_variant_size?: string;
};

export interface LocalCartItem {
  id?: string;
  product_id: string;
  product_variant_id?: string;
  product_sub_variant_id?: string;
  product: LocalCartProduct;
  quantity: number;
  price: number;
}

interface CartContextValue {
  items: LocalCartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  isMutating: boolean;
  addItem: (
    product: Product,
    quantity?: number,
    productVariantId?: string,
    productSubVariantId?: string,
  ) => void;
  incrementItem: (
    productId: string,
    productVariantId?: string,
    productSubVariantId?: string,
  ) => void;
  decrementItem: (
    productId: string,
    productVariantId?: string,
    productSubVariantId?: string,
  ) => void;
  removeItem: (
    productId: string,
    productVariantId?: string,
    productSubVariantId?: string,
  ) => void;
  clearLocalCart: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const EMPTY_CART_ITEMS: LocalCartItem[] = [];
let cachedCartString = "";
let cachedCartItems: LocalCartItem[] = EMPTY_CART_ITEMS;

const isBrowser = () => typeof window !== "undefined";

const getCartItemKey = (
  productId: string,
  productVariantId?: string | null,
  productSubVariantId?: string | null,
) => `${productId}:${productVariantId ?? ""}:${productSubVariantId ?? ""}`;

const sanitizeCartItem = (item: LocalCartItem): LocalCartItem => ({
  ...item,
  quantity: Math.max(1, Number(item.quantity) || 1),
  price: Number(item.price) || Number(item.product?.price) || 0,
});

const readStoredCartItems = () => {
  if (!isBrowser()) return cachedCartItems;

  const storedCart = window.localStorage.getItem(CART_STORAGE_KEY) ?? "[]";
  if (storedCart === cachedCartString) return cachedCartItems;

  try {
    const parsed = JSON.parse(storedCart);
    cachedCartItems = Array.isArray(parsed)
      ? parsed.map((item: LocalCartItem) => sanitizeCartItem(item))
      : [];
    cachedCartString = storedCart;
  } catch {
    cachedCartItems = [];
    cachedCartString = "[]";
  }

  return cachedCartItems;
};

const writeStoredCartItems = (items: LocalCartItem[]) => {
  const nextItems = items.map(sanitizeCartItem);
  cachedCartItems = nextItems;
  cachedCartString = JSON.stringify(nextItems);

  if (isBrowser()) {
    window.localStorage.setItem(CART_STORAGE_KEY, cachedCartString);
    window.dispatchEvent(new Event(CART_STORAGE_EVENT));
  }
};

const updateStoredCartItems = (
  updater: (items: LocalCartItem[]) => LocalCartItem[],
) => {
  writeStoredCartItems(updater(readStoredCartItems()));
};

const subscribeToCart = (onStoreChange: () => void) => {
  if (!isBrowser()) return () => undefined;

  window.addEventListener(CART_STORAGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(CART_STORAGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
};

const getAccessTokenSnapshot = () => {
  if (!isBrowser()) return "";
  return window.sessionStorage.getItem("access_token") ?? "";
};

const subscribeToAuthStorage = (onStoreChange: () => void) => {
  if (!isBrowser()) return () => undefined;

  window.addEventListener("storage", onStoreChange);
  window.addEventListener("focus", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("focus", onStoreChange);
  };
};

const toLocalProduct = (
  product: Product,
  productVariantId?: string | null,
  productSubVariantId?: string | null,
): LocalCartProduct => {
  const variant = product.variants?.find(
    (productVariant) => productVariant.id === productVariantId,
  );
  const subVariant = variant?.sub_variants?.find(
    (productSubVariant) => productSubVariant.id === productSubVariantId,
  );

  return {
    id: product.id,
    name: product.name,
    image_url: variant?.image_url || product.image_url,
    price: product.price,
    category: product.category,
    description: product.description,
    ...(variant?.name ? { variant_name: variant.name } : {}),
    ...(subVariant?.size ? { sub_variant_size: subVariant.size } : {}),
  };
};

const toLocalCartItem = (item: CartItem): LocalCartItem | null => {
  if (!item.product && !item.product_id) return null;

  const product = item.product;
  const productId = item.product_id || product?.id;
  if (!productId) return null;

  return {
    id: item.id,
    product_id: productId,
    ...(item.product_variant_id
      ? { product_variant_id: item.product_variant_id }
      : {}),
    ...(item.product_sub_variant_id
      ? { product_sub_variant_id: item.product_sub_variant_id }
      : {}),
    product: product
      ? toLocalProduct(
          product,
          item.product_variant_id,
          item.product_sub_variant_id,
        )
      : {
          id: productId,
          name: "Product",
          image_url: "",
          price: item.total_price / Math.max(1, item.quantity),
          category: "",
          description: "",
        },
    quantity: item.quantity,
    price:
      product?.price ||
      item.product?.price ||
      item.total_price / Math.max(1, item.quantity),
  };
};

const extractCartItems = (cartData: Cart | CartItem[] | undefined) => {
  if (!cartData) return [];
  if (Array.isArray(cartData)) return cartData;
  return cartData.items ?? [];
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const items = useSyncExternalStore(
    subscribeToCart,
    readStoredCartItems,
    () => EMPTY_CART_ITEMS,
  );
  const accessToken = useSyncExternalStore(
    subscribeToAuthStorage,
    getAccessTokenSnapshot,
    () => "",
  );
  const hasAccessToken = Boolean(accessToken);
  const pendingServerCreates = useRef<Set<string>>(new Set());

  const { data: serverCart, isLoading } = useFetchCart({
    page_size: 50,
    page: 1,
    enabled: hasAccessToken,
  });
  const { mutate: createServerCartItem, isPending: isCreating } =
    useCreateCartItem();
  const { mutate: updateServerCartItem, isPending: isUpdating } =
    useUpdateCartItem();
  const { mutate: deleteServerCartItem, isPending: isDeleting } =
    useDeleteCartItem();

  const mergeServerItem = useCallback((serverItem: CartItem) => {
    const localItem = toLocalCartItem(serverItem);
    if (!localItem) return;

    updateStoredCartItems((currentItems) => {
      const localItemKey = getCartItemKey(
        localItem.product_id,
        localItem.product_variant_id,
        localItem.product_sub_variant_id,
      );
      const existingItem = currentItems.find(
        (item) =>
          getCartItemKey(
            item.product_id,
            item.product_variant_id,
            item.product_sub_variant_id,
          ) === localItemKey,
      );

      if (!existingItem) return [...currentItems, localItem];

      return currentItems.map((item) =>
        getCartItemKey(
          item.product_id,
          item.product_variant_id,
          item.product_sub_variant_id,
        ) === localItemKey
          ? {
              ...localItem,
              quantity: existingItem.quantity,
            }
          : item,
      );
    });
  }, []);

  const syncCreateToServer = useCallback(
    (item: LocalCartItem) => {
      const itemKey = getCartItemKey(
        item.product_id,
        item.product_variant_id,
        item.product_sub_variant_id,
      );
      if (!hasAccessToken || pendingServerCreates.current.has(itemKey)) {
        return;
      }

      pendingServerCreates.current.add(itemKey);
      createServerCartItem(
        {
          product_id: item.product_id,
          ...(item.product_variant_id
            ? { product_variant_id: item.product_variant_id }
            : {}),
          ...(item.product_sub_variant_id
            ? { product_sub_variant_id: item.product_sub_variant_id }
            : {}),
          quantity: item.quantity,
        },
        {
          onSuccess: mergeServerItem,
          onError: () => {
            toast.error("Cart saved locally. Sign in again to sync it.");
          },
          onSettled: () => {
            pendingServerCreates.current.delete(itemKey);
          },
        },
      );
    },
    [createServerCartItem, hasAccessToken, mergeServerItem],
  );

  const syncUpdateToServer = useCallback(
    (item: LocalCartItem, quantity: number) => {
      if (!hasAccessToken) return;

      if (!item.id) {
        syncCreateToServer({ ...item, quantity });
        return;
      }

      updateServerCartItem(
        {
          id: item.id,
          quantity,
        },
        {
          onError: () => {
            toast.error("Cart updated locally, but could not sync yet.");
          },
        },
      );
    },
    [hasAccessToken, syncCreateToServer, updateServerCartItem],
  );

  useEffect(() => {
    const serverItems = extractCartItems(serverCart)
      .map(toLocalCartItem)
      .filter((item): item is LocalCartItem => Boolean(item));

    if (serverItems.length === 0) return;

    updateStoredCartItems((currentItems) => {
      const mergedItemsByKey = new Map<string, LocalCartItem>();

      serverItems.forEach((item) => {
        mergedItemsByKey.set(
          getCartItemKey(
            item.product_id,
            item.product_variant_id,
            item.product_sub_variant_id,
          ),
          item,
        );
      });

      currentItems.forEach((item) => {
        const itemKey = getCartItemKey(
          item.product_id,
          item.product_variant_id,
          item.product_sub_variant_id,
        );
        const serverItem = mergedItemsByKey.get(itemKey);
        mergedItemsByKey.set(itemKey, {
          ...(serverItem ?? item),
          quantity: item.quantity,
        });
      });

      return Array.from(mergedItemsByKey.values());
    });
  }, [serverCart]);

  useEffect(() => {
    if (!hasAccessToken) return;

    items.forEach((item) => {
      if (!item.id) {
        syncCreateToServer(item);
      }
    });
  }, [hasAccessToken, items, syncCreateToServer]);

  const addItem = useCallback(
    (
      product: Product,
      quantity = 1,
      productVariantId = product.variants?.[0]?.id,
      productSubVariantId?: string,
    ) => {
      const safeQuantity = Math.max(1, quantity);
      const localProduct = toLocalProduct(
        product,
        productVariantId,
        productSubVariantId,
      );
      const itemKey = getCartItemKey(
        product.id,
        productVariantId,
        productSubVariantId,
      );
      let nextItem: LocalCartItem | undefined;

      updateStoredCartItems((currentItems) => {
        const existingItem = currentItems.find(
          (item) =>
            getCartItemKey(
              item.product_id,
              item.product_variant_id,
              item.product_sub_variant_id,
            ) === itemKey,
        );

        if (existingItem) {
          nextItem = {
            ...existingItem,
            product: localProduct,
            price: product.price,
            quantity: existingItem.quantity + safeQuantity,
          };

          return currentItems.map((item) =>
            getCartItemKey(
              item.product_id,
              item.product_variant_id,
              item.product_sub_variant_id,
            ) === itemKey
              ? nextItem!
              : item,
          );
        }

        nextItem = {
          product_id: product.id,
          ...(productVariantId ? { product_variant_id: productVariantId } : {}),
          ...(productSubVariantId
            ? { product_sub_variant_id: productSubVariantId }
            : {}),
          product: localProduct,
          quantity: safeQuantity,
          price: product.price,
        };

        return [...currentItems, nextItem];
      });

      if (!nextItem) return;

      if (nextItem.id) {
        syncUpdateToServer(nextItem, nextItem.quantity);
      } else {
        syncCreateToServer(nextItem);
      }
    },
    [syncCreateToServer, syncUpdateToServer],
  );

  const incrementItem = useCallback(
    (
      productId: string,
      productVariantId?: string,
      productSubVariantId?: string,
    ) => {
      const itemKey = getCartItemKey(
        productId,
        productVariantId,
        productSubVariantId,
      );
      const existingItem = readStoredCartItems().find(
        (item) =>
          getCartItemKey(
            item.product_id,
            item.product_variant_id,
            item.product_sub_variant_id,
          ) === itemKey,
      );
      if (!existingItem) return;

      const nextQuantity = existingItem.quantity + 1;
      updateStoredCartItems((currentItems) =>
        currentItems.map((item) =>
          getCartItemKey(
            item.product_id,
            item.product_variant_id,
            item.product_sub_variant_id,
          ) === itemKey
            ? { ...item, quantity: nextQuantity }
            : item,
        ),
      );
      syncUpdateToServer(existingItem, nextQuantity);
    },
    [syncUpdateToServer],
  );

  const removeItem = useCallback(
    (
      productId: string,
      productVariantId?: string,
      productSubVariantId?: string,
    ) => {
      const itemKey = getCartItemKey(
        productId,
        productVariantId,
        productSubVariantId,
      );
      const existingItem = readStoredCartItems().find(
        (item) =>
          getCartItemKey(
            item.product_id,
            item.product_variant_id,
            item.product_sub_variant_id,
          ) === itemKey,
      );
      if (!existingItem) return;

      updateStoredCartItems((currentItems) =>
        currentItems.filter(
          (item) =>
            getCartItemKey(
              item.product_id,
              item.product_variant_id,
              item.product_sub_variant_id,
            ) !== itemKey,
        ),
      );

      if (hasAccessToken && existingItem.id) {
        deleteServerCartItem(existingItem.id, {
          onError: () => {
            toast.error("Cart item removed locally, but could not sync yet.");
          },
        });
      }
    },
    [deleteServerCartItem, hasAccessToken],
  );

  const decrementItem = useCallback(
    (
      productId: string,
      productVariantId?: string,
      productSubVariantId?: string,
    ) => {
      const itemKey = getCartItemKey(
        productId,
        productVariantId,
        productSubVariantId,
      );
      const existingItem = readStoredCartItems().find(
        (item) =>
          getCartItemKey(
            item.product_id,
            item.product_variant_id,
            item.product_sub_variant_id,
          ) === itemKey,
      );
      if (!existingItem) return;

      const nextQuantity = existingItem.quantity - 1;
      if (nextQuantity <= 0) {
        removeItem(productId, productVariantId, productSubVariantId);
        return;
      }

      updateStoredCartItems((currentItems) =>
        currentItems.map((item) =>
          getCartItemKey(
            item.product_id,
            item.product_variant_id,
            item.product_sub_variant_id,
          ) === itemKey
            ? { ...item, quantity: nextQuantity }
            : item,
        ),
      );
      syncUpdateToServer(existingItem, nextQuantity);
    },
    [removeItem, syncUpdateToServer],
  );

  const clearCart = useCallback(() => {
    const currentItems = readStoredCartItems();
    writeStoredCartItems([]);

    if (!hasAccessToken) return;

    currentItems.forEach((item) => {
      if (item.id) deleteServerCartItem(item.id);
    });
  }, [deleteServerCartItem, hasAccessToken]);

  const clearLocalCart = useCallback(() => {
    writeStoredCartItems([]);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalItems: items.reduce((total, item) => total + item.quantity, 0),
      totalPrice: items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),
      isLoading,
      isMutating: isCreating || isUpdating || isDeleting,
      addItem,
      incrementItem,
      decrementItem,
      removeItem,
      clearLocalCart,
      clearCart,
    }),
    [
      addItem,
      clearCart,
      clearLocalCart,
      decrementItem,
      incrementItem,
      isCreating,
      isDeleting,
      isLoading,
      isUpdating,
      items,
      removeItem,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
};
