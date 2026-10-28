import { $http } from "@/lib/http";
import { reviewKeys } from "@/lib/react-query/query-keys";
import { ReviewCreate } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: Partial<ReviewCreate>) => {
      const res = await $http.post("/review", review);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
    },
  });
};
