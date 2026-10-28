import { $http } from "@/lib/http";
import { orderKeys } from "@/lib/react-query/query-keys";
import { Order } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CancelOrderParams {
  orderId: string;
}

/**
 * Cancels a pending or processing order.
 *
 * The backend will attempt a refund immediately after cancellation.
 * On success the returned order will have status "refunded" (or "cancelled"
 * if the payment provider call failed — the server returns a 502 in that
 * case, which will surface as a mutation error).
 */
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId }: CancelOrderParams): Promise<Order> => {
      const res = await $http.patch(`/order/${orderId}/cancel`);
      return res.data;
    },
    onSuccess: (updatedOrder) => {
      // Keep the detail cache fresh with the server-returned order
      queryClient.setQueryData(orderKeys.detail(updatedOrder.id), updatedOrder);

      // Invalidate the list so status changes are reflected everywhere
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
};
