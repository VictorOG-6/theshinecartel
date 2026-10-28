// hooks/use-delete-transaction.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { $http } from "@/lib/http";
import { cartItemKeys, cartKeys } from "@/lib/react-query/query-keys";
import { CartItem } from "@/types";
import { toast } from "sonner";

type DeleteContext = {
  previousCartItems?: CartItem[];
};

export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string, DeleteContext>({
    mutationFn: async (id) => {
      await $http.delete(`/cart/items/${id}`);
    },
    onMutate: async (cartItemId) => {
      await queryClient.cancelQueries({ queryKey: cartItemKeys.lists() });

      const previousCartItems = queryClient.getQueryData<CartItem[]>(
        cartItemKeys.lists(),
      );

      queryClient.setQueryData<CartItem[]>(cartItemKeys.lists(), (old) =>
        old?.filter((r) => r.id !== cartItemId),
      );

      return { previousCartItems };
    },
    onError: (_error, _id, context) => {
      if (context?.previousCartItems) {
        queryClient.setQueryData(
          cartItemKeys.lists(),
          context.previousCartItems,
        );
      }
    },
    onSuccess: () => {
      toast("Cart Item deleted!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartItemKeys.lists() });
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
};
