"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { $http } from "@/lib/http";
import { bundleKeys } from "@/lib/react-query/query-keys";
import { Bundle, BundleFetchProps } from "@/types";

const useFetchBundles = ({
  page_size = 20,
  page = 1,
  name,
  category,
  status_filter,
}: BundleFetchProps) => {
  return useQuery({
    queryKey: bundleKeys.list({
      page_size,
      page,
      name,
      category,
      status_filter,
    }),
    queryFn: async () => {
      const params: Record<string, string | number> = {
        page,
        page_size,
      };

      if (name) params.name = name;
      if (category) params.category = category;
      if (status_filter) params.status_filter = status_filter;

      const response = await $http.get("/bundle", { params });
      return response.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
};

export default useFetchBundles;

export const useFetchBundle = (bundleId: string | undefined) => {
  return useQuery({
    queryKey: bundleKeys.detail(bundleId!),
    queryFn: async (): Promise<Bundle> => {
      const res = await $http.get(`/bundle/${bundleId}`);
      return res.data;
    },
    enabled: !!bundleId,
  });
};
