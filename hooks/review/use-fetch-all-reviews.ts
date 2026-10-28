"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { $http } from "@/lib/http";
import { reviewKeys } from "@/lib/react-query/query-keys";
import { ReviewFetchProps } from "@/types";

const useFetchAllReviews = ({
  page_size = 20,
  page = 1,
  product_id,
  user_id,
}: ReviewFetchProps) => {
  return useQuery({
    queryKey: reviewKeys.list({ page_size, page, product_id, user_id }),
    queryFn: async () => {
      const response = await $http.get("/review", {
        params: {
          page,
          page_size: page_size,
          product_id: product_id || undefined,
          user_id: user_id || undefined,
        },
      });
      return response.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
};

export default useFetchAllReviews;
