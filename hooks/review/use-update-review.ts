import { useMutation, useQueryClient } from "@tanstack/react-query";
import { $http } from "@/lib/http";
import { ReviewUpdate } from "@/types";
import { reviewKeys } from "@/lib/react-query/query-keys";

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: ReviewUpdate) => {
      const res = await $http.put(`/review/${review.id}`, review);
      return res.data;
    },
    onSuccess: (_, updated) => {
      // refresh both single and list cachesz
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: reviewKeys.detail(updated.id!.toString()),
      });
    },
  });
};
