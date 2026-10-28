"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { $http } from "@/lib/http";
import { reviewKeys } from "@/lib/react-query/query-keys";

const useFetchEligibleProducts = ({
  page_size = 20,
  page = 1,
}: {
  page_size?: number;
  page?: number;
}) => {
  return useQuery({
    queryKey: reviewKeys.list({ page_size, page }),
    queryFn: async () => {
      const response = await $http.get("/review/eligible-products", {
        params: {
          page,
          page_size: page_size,
        },
      });
      return response.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
};

export default useFetchEligibleProducts;
