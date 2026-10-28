import { $http } from "@/lib/http";
import { Payment } from "@/types";
import { useMutation } from "@tanstack/react-query";

export const useInitializePayment = () =>
  useMutation({
    mutationFn: async (orderId: string): Promise<Payment> => {
      const response = await $http.post<Payment>(
        `/payment/order/${encodeURIComponent(orderId)}/initialize`,
      );
      return response.data;
    },
  });
