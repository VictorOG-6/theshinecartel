import { $http } from "@/lib/http";
import { orderKeys, paymentKeys } from "@/lib/react-query/query-keys";
import { Payment } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useVerifyPayment = (reference: string | null) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: paymentKeys.verification(reference ?? ""),
    queryFn: async (): Promise<Payment> => {
      const response = await $http.post<Payment>(
        `/payment/reference/${encodeURIComponent(reference!)}/verify`,
      );

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: orderKeys.lists() }),
        queryClient.invalidateQueries({
          queryKey: orderKeys.detail(response.data.order_id),
        }),
      ]);

      return response.data;
    },
    enabled: Boolean(reference),
    retry: false,
    staleTime: Infinity,
  });
};
