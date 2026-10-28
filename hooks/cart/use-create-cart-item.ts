import { $http } from "@/lib/http";
import { cartItemKeys, cartKeys } from "@/lib/react-query/query-keys";
import { CartItem, CartItemCreate } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      cartItem: Partial<CartItemCreate>,
    ): Promise<CartItem> => {
      const res = await $http.post<CartItem>("/cart/items", cartItem);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartItemKeys.lists() });
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
};
