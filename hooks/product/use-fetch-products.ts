"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { $http } from "@/lib/http";
import { productKeys } from "@/lib/react-query/query-keys";
import { Product, ProductFetchProps } from "@/types";

const useFetchProducts = ({
  page_size = 20,
  page = 1,
  name,
  category,
  status,
}: ProductFetchProps) => {
  return useQuery({
    queryKey: productKeys.list({ page_size, page, name, category, status }),
    queryFn: async () => {
      const params: Record<string, string | number> = {
        page,
        page_size,
      };

      if (name) params.name = name;
      if (category) params.category = category;
      if (status) params.status = status;

      const response = await $http.get("/product", { params });
      return response.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
};

export default useFetchProducts;

export const useFetchProduct = (productId: string | undefined) => {
  return useQuery({
    queryKey: productKeys.detail(productId!),
    queryFn: async (): Promise<Product> => {
      const res = await $http.get(`/product/${productId}`);
      return res.data;
    },
    enabled: !!productId,
  });
};
