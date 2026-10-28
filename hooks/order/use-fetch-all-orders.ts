import { $http } from "@/lib/http";
import { orderKeys } from "@/lib/react-query/query-keys";
import { Order, OrderFetchProps } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

/**
 * Fetches all orders belonging to the current authenticated user.
 * Maps to: GET /order
 */
export const useFetchAllOrders = ({
  page_size = 20,
  page = 1,
  name,
  status,
}: OrderFetchProps = {}) => {
  return useQuery<Order[]>({
    queryKey: orderKeys.list({ page_size, page, name, status }),
    queryFn: async (): Promise<Order[]> => {
      const response = await $http.get<Order[]>("/order/all", {
        params: {
          page,
          page_size: page_size,
          name: name || undefined,
          status: status || undefined,
        },
      });
      return response.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
};
