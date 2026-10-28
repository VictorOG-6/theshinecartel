"use client";

import { useQuery } from "@tanstack/react-query";
import { $http } from "@/lib/http";
import { dashboardKeys } from "@/lib/react-query/query-keys";
import { DashboardSummary } from "@/types";

const useFetchDashboardSummary = () => {
  return useQuery<DashboardSummary>({
    queryKey: dashboardKeys.metrics(),
    queryFn: async () => {
      const response = await $http.get("/dashboard/summary");
      return response.data;
    },
    staleTime: 60 * 1000, // 1 minute
  });
};

export default useFetchDashboardSummary;
