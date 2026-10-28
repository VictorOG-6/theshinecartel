import { useMutation, useQueryClient } from "@tanstack/react-query";
import { $http } from "@/lib/http";
import { BundleUpdate } from "@/types";
import { bundleKeys } from "@/lib/react-query/query-keys";

export const useUpdateBundle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bundle: BundleUpdate) => {
      const res = await $http.put(`/bundle/${bundle.id}`, bundle);
      return res.data;
    },
    onSuccess: (_, updated) => {
      // refresh both single and list cachesz
      queryClient.invalidateQueries({ queryKey: bundleKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: bundleKeys.detail(updated.id!.toString()),
      });
    },
  });
};
