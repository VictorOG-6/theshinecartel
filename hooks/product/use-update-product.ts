import { useMutation, useQueryClient } from "@tanstack/react-query";
import { $http } from "@/lib/http";
import { ProductUpdate } from "@/types";
import { productKeys } from "@/lib/react-query/query-keys";

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: ProductUpdate) => {
      const res = await $http.put(`/product/${product.id}`, product);
      return res.data;
    },
    onSuccess: (_, updated) => {
      // refresh both single and list cachesz
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(updated.id!.toString()),
      });
    },
  });
};
