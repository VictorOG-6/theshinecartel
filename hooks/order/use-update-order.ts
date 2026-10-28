import { useMutation, useQueryClient } from "@tanstack/react-query";
import { $http } from "@/lib/http";
import { orderKeys } from "@/lib/react-query/query-keys";
import { Order, OrderStatus } from "@/types";
export interface OrderUpdate {
  id: string;
  status: OrderStatus;
}
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: OrderUpdate): Promise<Order> => {
      const res = await $http.patch(`/order/${id}`, { status });
      return res.data;
    },
    onSuccess: (updatedOrder) => {
      queryClient.setQueryData(orderKeys.detail(updatedOrder.id), updatedOrder);
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
};
