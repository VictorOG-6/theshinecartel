import { $http } from "@/lib/http";
import { orderKeys } from "@/lib/react-query/query-keys";
import { Order, OrderFetchProps } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

/**
 * Fetches all orders belonging to the current authenticated user.
 * Maps to: GET /order
 */
export const useFetchOrders = ({
  page_size = 20,
  page = 1,
  status,
}: OrderFetchProps = {}) => {
  return useQuery<Order[]>({
    queryKey: orderKeys.list({ page_size, page, status }),
    queryFn: async (): Promise<Order[]> => {
      const response = await $http.get<Order[]>("/order", {
        params: {
          page,
          page_size: page_size,
          status: status || undefined,
        },
      });
      return response.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
};

/**
 * Fetches a single order by ID.
 * Maps to: GET /order/{order_id}
 *
 * The query is disabled when no orderId is provided so the hook is
 * safe to call conditionally (e.g. before a route param is resolved).
 */
export const useFetchOrder = (orderId: string | undefined) => {
  return useQuery({
    queryKey: orderKeys.detail(orderId!),
    queryFn: async (): Promise<Order> => {
      const res = await $http.get(`/order/${orderId}`);
      return res.data;
    },
    enabled: !!orderId,
  });
};
