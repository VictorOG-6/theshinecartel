// hooks/use-delete-transaction.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { $http } from "@/lib/http";
import { reviewKeys } from "@/lib/react-query/query-keys";
import { Review } from "@/types";
import { toast } from "sonner";

type DeleteContext = {
  previousReviews?: Review[];
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string, DeleteContext>({
    mutationFn: async (id) => {
      await $http.delete(`/review/${id}`);
    },
    onMutate: async (reviewId) => {
      await queryClient.cancelQueries({ queryKey: reviewKeys.lists() });

      const previousReviews = queryClient.getQueryData<Review[]>(
        reviewKeys.lists(),
      );

      queryClient.setQueryData<Review[]>(reviewKeys.lists(), (old) =>
        old?.filter((r) => r.id !== reviewId),
      );

      return { previousReviews };
    },
    onError: (_error, _id, context) => {
      if (context?.previousReviews) {
        queryClient.setQueryData(reviewKeys.lists(), context.previousReviews);
      }
    },
    onSuccess: () => {
      toast("Review deleted!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
    },
  });
};
