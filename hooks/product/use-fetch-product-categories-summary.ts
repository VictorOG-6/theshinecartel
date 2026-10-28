"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { $http } from "@/lib/http";
import { productKeys } from "@/lib/react-query/query-keys";
import {
  ProductCategoriesSummary,
  ProductCategoriesSummaryFetchProps,
} from "@/types";

const useFetchProductsCategoriesSummary = ({
  status,
}: ProductCategoriesSummaryFetchProps = {}) => {
  return useQuery<ProductCategoriesSummary[]>({
    queryKey: productKeys.list({ status }),
    queryFn: async () => {
      const response = await $http.get<ProductCategoriesSummary[]>(
        "/product/categories/summary",
        {
          params: {
            status: status || undefined,
          },
        },
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
};

export default useFetchProductsCategoriesSummary;
