"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Mail, Users } from "lucide-react";
import { format } from "date-fns";
import { cn, formatToNaira } from "@/lib/utils";
import useFetchUsers from "@/hooks/user/use-fetch-users";
import { User } from "@/types";
import UserAvatar from "@/components/shared/user-avatar";

export default function UsersPage() {
  const [search, setSearch] = useState("");

  const { data: users = [], isLoading } = useFetchUsers({
    page_size: 10,
    page: 1,
    name: search,
    email: search,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-black text-2xl md:text-3xl font-bold tracking-tight">
          Customers
        </h1>
        <p className="text-neutral-500 text-sm mt-1">
          {users.length} registered customers
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <Input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 text-black placeholder:text-neutral-500"
        />
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F6F4F4] text-black">
                <TableHead className="font-semibold text-black">
                  Customer
                </TableHead>
                <TableHead className="font-semibold text-black">
                  Contact
                </TableHead>
                <TableHead className="font-semibold text-black">
                  Orders
                </TableHead>
                <TableHead className="font-semibold text-black">
                  Total Spent
                </TableHead>
                <TableHead className="font-semibold text-black">
                  Joined
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <TableRow key={i}>
                      {Array(6)
                        .fill(0)
                        .map((_, j) => (
                          <TableCell key={j}>
                            <Skeleton className="h-4 w-20" />
                          </TableCell>
                        ))}
                    </TableRow>
                  ))
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <Users className="w-10 h-10 mx-auto text-neutral-500/40 mb-2" />
                    <p className="text-neutral-500">No customers found</p>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user: User) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          name={user.name}
                          seed={user.email}
                          src={user.profile_image_url}
                          size="sm"
                        />
                        <p className="font-medium text-sm text-black">
                          {user.name}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                          <Mail className="w-3 h-3" /> {user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-black">
                      {user.total_orders || 0}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-black">
                      {formatToNaira(user.total_spent)}
                    </TableCell>
                    <TableCell className="text-sm text-neutral-500">
                      {user.created_at
                        ? format(new Date(user.created_at), "MMM d, yyyy")
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
