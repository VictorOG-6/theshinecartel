"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { $http } from "@/lib/http";
import { cartKeys } from "@/lib/react-query/query-keys";
import { Cart, CartFetchProps } from "@/types";

type UseFetchCartProps = CartFetchProps & {
  enabled?: boolean;
};

const useFetchCart = ({
  page_size = 20,
  page = 1,
  enabled = true,
}: UseFetchCartProps) => {
  return useQuery({
    queryKey: cartKeys.list({ page_size, page }),
    queryFn: async (): Promise<Cart> => {
      const response = await $http.get<Cart>("/cart", {
        params: {
          page,
          page_size: page_size,
        },
      });
      return response.data;
    },
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
};

export default useFetchCart;
