// data-table.tsx
"use client";

import { flexRender, RowData } from "@tanstack/react-table";
import {
  getCoreRowModel,
  getPaginationRowModel,
  LegacyColumnDef,
  useLegacyTable,
} from "@tanstack/react-table/legacy";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/shared/data-table-pagination";

// data-table.tsx

// data-table.tsx

type Pagination = {
  pageIndex: number;
  pageSize: number;
};

// Define the meta type for columns
interface ColumnMeta<TData> {
  onClick?: (row: TData) => void;
}

// Extend ColumnDef to include our meta type
type ColumnDefWithMeta<TData extends RowData> = LegacyColumnDef<
  TData,
  unknown
> & {
  meta?: ColumnMeta<TData>;
};

interface DataTableProps<TData extends RowData> {
  columns: ColumnDefWithMeta<TData>[];
  data: TData[];
  pagination?: Pagination;
  setPagination?: (pagination: Pagination) => void;
  rowCount: number;
  className?: string;
  emptyDataMaessage?: string;
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  rowCount,
  pagination,
  setPagination,
  className,
  emptyDataMaessage,
}: DataTableProps<TData>) {
  const table = useLegacyTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    rowCount: rowCount,
    initialState: {
      pagination,
    },
    state: {
      pagination: pagination,
    },
    onPaginationChange: (updater) => {
      if (pagination && setPagination) {
        const newState =
          typeof updater === "function"
            ? updater(table.getState().pagination)
            : updater;
        setPagination({
          pageIndex: newState.pageIndex,
          pageSize: newState.pageSize,
        });
      }

      return updater;
    },
  });

  return (
    <div className={`rounded-md border ${className}`}>
      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader className="border-t border-[#E2E8F0] bg-primary-foreground">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="whitespace-nowrap font-[720] uppercase text-black"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-white">
            {table.getCoreRowModel().rows?.length ? (
              table.getCoreRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    const onClick = (
                      cell.column.columnDef as ColumnDefWithMeta<TData>
                    ).meta?.onClick;
                    return (
                      <TableCell
                        key={cell.id}
                        onClick={() => {
                          if (onClick) {
                            onClick(row.original);
                          }
                        }}
                        className={
                          onClick ? "cursor-pointer text-black" : "text-black"
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-black">
                  {emptyDataMaessage ?? "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && <DataTablePagination table={table} />}
    </div>
  );
}
