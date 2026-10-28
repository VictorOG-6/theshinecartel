import { $http } from "@/lib/http";
import { bundleKeys } from "@/lib/react-query/query-keys";
import { BundleCreate } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateBundle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bundle: BundleCreate) => {
      const res = await $http.post("/bundle", bundle);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bundleKeys.lists() });
    },
  });
};
