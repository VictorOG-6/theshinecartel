import { $http } from "@/lib/http";
import { productKeys } from "@/lib/react-query/query-keys";
import { ProductCreate } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Partial<ProductCreate>) => {
      const res = await $http.post("/product", product);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};
