"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { format } from "date-fns";
import { Order, OrderStatus, Pagination } from "@/types";
import { LegacyColumnDef } from "@tanstack/react-table/legacy";
import { formatToNaira } from "@/lib/utils";
import { useFetchAllOrders } from "@/hooks/order/use-fetch-all-orders";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import OrderDetailSheet from "@/components/admin/order-detail-sheet";
import { Text } from "@/components/ui/text";
import { DataTable } from "@/components/shared/data-table";

const orderStatusItems = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
  { value: "failed", label: "Failed" },
] as const;

export default function Orders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: orders = [], isLoading } = useFetchAllOrders({
    page_size: pagination.pageSize,
    page: pagination.pageIndex + 1,
    status: statusFilter === "all" ? undefined : (statusFilter as OrderStatus),
    name: search,
  });

  const createColumns = (
    onOrders: (order: Order) => void,
  ): LegacyColumnDef<Order, unknown>[] => [
    {
      accessorKey: "id",
      header: () => (
        <div>
          <Text size={"xs"} className="sm:text-base font-extrabold text-center">
            Order
          </Text>
        </div>
      ),
      cell: ({ row }) => (
        <Text size={"xs"} className="sm:text-sm text-center">
          {row.original.id}
        </Text>
      ),
      meta: { onClick: onOrders },
    },
    {
      accessorKey: "user",
      header: () => (
        <div>
          <Text size={"xs"} className="sm:text-base font-extrabold text-center">
            Customer
          </Text>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <Text size={"sm"} className="sm:text-sm text-center font-bold">
            {row.original.user?.name}
          </Text>
          <Text size={"xs"} className="sm:text-sm text-center">
            {row.original.user?.email}
          </Text>
        </div>
      ),
      meta: { onClick: onOrders },
    },
    {
      accessorKey: "created_at",
      header: () => (
        <div>
          <Text size={"xs"} className="sm:text-base font-extrabold text-center">
            Date
          </Text>
        </div>
      ),
      cell: ({ row }) => (
        <Text size={"xs"} className="sm:text-sm text-center">
          {format(row.original.created_at, "MMM d, yyyy")}
        </Text>
      ),
      meta: { onClick: onOrders },
    },
    {
      accessorKey: "status",
      header: () => (
        <div>
          <Text size={"xs"} className="sm:text-base font-extrabold text-center">
            Status
          </Text>
        </div>
      ),
      cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
      meta: { onClick: onOrders },
    },
    {
      accessorKey: "total_price",
      header: () => (
        <div>
          <Text size={"xs"} className="sm:text-base font-extrabold text-center">
            Total
          </Text>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center items-center">
          <Text size={"sm"} className="sm:text-sm text-center font-bold">
            {formatToNaira(row.original.total_price)}
          </Text>
        </div>
      ),
      meta: { onClick: onOrders },
    },
  ];

  const handleOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  const handlePaginationChange = (newPagination: {
    pageIndex: number;
    pageSize: number;
  }) => {
    setPagination(newPagination);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-black text-2xl md:text-3xl font-bold tracking-tight">
          Orders
        </h1>
        <p className="text-neutral-500 text-sm mt-1">
          {orders.length} total orders
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-black placeholder:text-neutral-500"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value ?? "all")}
          items={orderStatusItems}
        >
          <SelectTrigger className="w-full sm:w-40 cursor-pointer text-black bg-neutral-100">
            <SelectValue placeholder="All Status" className="text-black" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-100">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <DataTable
          columns={createColumns(handleOrder)}
          data={orders}
          pagination={pagination}
          setPagination={handlePaginationChange}
          rowCount={orders.length}
          className="border-0"
        />
      </div>

      {/* Order Detail */}
      <OrderDetailSheet
        order={selectedOrder}
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
