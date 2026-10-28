"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { $http } from "@/lib/http";
import { dashboardKeys } from "@/lib/react-query/query-keys";
import { TopProductsFetchProps } from "@/types";

const useFetchTopProducts = ({ limit }: TopProductsFetchProps) => {
  return useQuery({
    queryKey: dashboardKeys.list({ limit }),
    queryFn: async () => {
      const response = await $http.get("/dashboard/top-products", {
        params: {
          limit: limit || undefined,
        },
      });
      return response.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
};

export default useFetchTopProducts;
