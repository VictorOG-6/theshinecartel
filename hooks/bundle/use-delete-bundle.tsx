// hooks/use-delete-bundle.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { $http } from "@/lib/http";
import { bundleKeys } from "@/lib/react-query/query-keys";
import { Bundle } from "@/types";
import { toast } from "sonner";

type DeleteContext = {
  previousBundles?: Bundle[];
};

export const useDeleteBundle = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string, DeleteContext>({
    mutationFn: async (id) => {
      await $http.delete(`/bundle/${id}`);
    },
    onMutate: async (bundleId) => {
      await queryClient.cancelQueries({ queryKey: bundleKeys.lists() });

      const previousBundles = queryClient.getQueryData<Bundle[]>(
        bundleKeys.lists(),
      );

      queryClient.setQueryData<Bundle[]>(bundleKeys.lists(), (old) =>
        old?.filter((p) => p.id !== bundleId),
      );

      return { previousBundles };
    },
    onError: (_error, _id, context) => {
      if (context?.previousBundles) {
        queryClient.setQueryData(bundleKeys.lists(), context.previousBundles);
      }
    },
    onSuccess: () => {
      toast("Bundle deleted!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: bundleKeys.lists() });
    },
  });
};
