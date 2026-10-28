// hooks/use-delete-transaction.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { $http } from "@/lib/http";
import { productKeys } from "@/lib/react-query/query-keys";
import { Product } from "@/types";
import { toast } from "sonner";

type DeleteContext = {
  previousProducts?: Product[];
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string, DeleteContext>({
    mutationFn: async (id) => {
      await $http.delete(`/product/${id}`);
    },
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: productKeys.lists() });

      const previousProducts = queryClient.getQueryData<Product[]>(
        productKeys.lists(),
      );

      queryClient.setQueryData<Product[]>(productKeys.lists(), (old) =>
        old?.filter((p) => p.id !== productId),
      );

      return { previousProducts };
    },
    onError: (_error, _id, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(productKeys.lists(), context.previousProducts);
      }
    },
    onSuccess: () => {
      toast("Product deleted!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};
