"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { $http } from "@/lib/http";
import { catalogKeys } from "@/lib/react-query/query-keys";
import { Catalog, CatalogFetchProps } from "@/types";

const useFetchCatalogs = ({
  page_size = 20,
  page = 1,
  name,
  category,
  status_filter = "published",
  item_type,
}: CatalogFetchProps) => {
  return useQuery({
    queryKey: catalogKeys.list({
      page_size,
      page,
      name,
      category,
      status: status_filter,
      item_type,
    }),
    queryFn: async (): Promise<Catalog[]> => {
      const params: Record<string, string | number> = {
        page,
        page_size,
        status: status_filter,
      };

      if (name) params.name = name;
      if (category) params.category = category;
      if (item_type) params.item_type = item_type;

      const response = await $http.get<Catalog[]>("/catalog", { params });
      return response.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
};

export default useFetchCatalogs;

export const useFetchCatalog = ({ slug }: { slug: string }) => {
  return useQuery({
    queryKey: catalogKeys.detail(slug),
    queryFn: async (): Promise<Catalog> => {
      const response = await $http.get<Catalog>(`/catalog/${slug}`);
      return response.data;
    },
  });
};
