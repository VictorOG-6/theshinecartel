import { useMutation, useQueryClient } from "@tanstack/react-query";
import { $http } from "@/lib/http";
import { CartItem, CartItemUpdate } from "@/types";
import { cartItemKeys, cartKeys } from "@/lib/react-query/query-keys";

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cartItem: CartItemUpdate): Promise<CartItem> => {
      const res = await $http.put<CartItem>(
        `/cart/items/${cartItem.id}`,
        cartItem,
      );
      return res.data;
    },
    onSuccess: (_, updated) => {
      // refresh both single and list cachesz
      queryClient.invalidateQueries({ queryKey: cartItemKeys.lists() });
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      queryClient.invalidateQueries({
        queryKey: cartItemKeys.detail(updated.id!.toString()),
      });
    },
  });
};
