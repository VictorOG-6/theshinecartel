import { $http } from "@/lib/http";
import { cartKeys, orderKeys } from "@/lib/react-query/query-keys";
import { Checkout } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<Checkout> => {
      // No request body — the server builds the order from the current user's cart
      const res = await $http.post<Checkout>("/order");
      return res.data;
    },
    onSuccess: ({ order }) => {
      // Invalidate the order list so it reflects the newly created order
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: cartKeys.all });

      // Pre-populate the detail cache so a subsequent navigation to the order
      // page is instant (no extra network round-trip)
      queryClient.setQueryData(orderKeys.detail(order.id), order);
    },
  });
};
