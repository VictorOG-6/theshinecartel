"use client";

import BundleModal from "@/components/admin/bundle-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCreateBundleContext } from "@/contexts/bundle/create-bundle-context";
import { useSearchValueContext } from "@/contexts/search-value-context";
import { useDeleteBundle } from "@/hooks/bundle/use-delete-bundle";
import useFetchBundles from "@/hooks/bundle/use-fetch-bundle";
import useFetchProductCategoriesSummary from "@/hooks/product/use-fetch-product-categories-summary";
import { cn, formatToNaira } from "@/lib/utils";
import { Bundle, ProductCategoriesSummary, ProductStatus } from "@/types";
import { Layers, Pencil, Plus, Search, Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { useUpdateBundle } from "@/hooks/bundle/use-update-bundle";

const bundleStatusItems = [
  { value: "all", label: "All Status" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
] as const;

const bundleAvailableQuantity = (bundle: Bundle) => {
  if (!bundle.items?.length) return 0;
  return Math.min(...bundle.items.map((item) => item.quantity ?? 0));
};

const Bundles = () => {
  const {
    isOpen,
    isEditMode,
    createBundleData,
    setIsEditMode,
    setIsOpen,
    setCreateBundleData,
    searchValue,
    setSearchValue,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
  } = useCreateBundleContext();
  const { globalSearchValue } = useSearchValueContext();
  const { data: bundles, isLoading: isBundlesLoading } = useFetchBundles({
    page_size: 12,
    page: 1,
    name: globalSearchValue || searchValue,
    category: categoryFilter === "all" ? undefined : categoryFilter,
    status_filter: statusFilter === "all" ? undefined : statusFilter,
  });
  const { data: categories } = useFetchProductCategoriesSummary();
  const { mutate: deleteBundle, isPending: isDeleting } = useDeleteBundle();
  const { mutate: updateBundle, isPending: isUpdating } = useUpdateBundle();
  const [deleteTarget, setDeleteTarget] = React.useState<Bundle | null>(null);

  const deleteTargetHasOrders = Boolean(deleteTarget?.order_items?.length);

  const categoryItems = React.useMemo(
    () => [
      { value: "all", label: "All Categories" },
      ...(categories?.map((category: ProductCategoriesSummary) => ({
        value: category.category,
        label: category.category,
      })) ?? []),
    ],
    [categories],
  );

  const handleDelete = () => {
    if (!deleteTarget) return;

    if (deleteTargetHasOrders) {
      updateBundle(
        { id: deleteTarget.id, status: "archived" },
        {
          onSuccess: () => {
            toast.success("Bundle archived successfully");
            setDeleteTarget(null);
          },
          onError: () => {
            toast.error("Failed to archive bundle");
          },
        },
      );
      return;
    }

    deleteBundle(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
      },
      onError: () => {
        toast.error("Failed to delete bundle");
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-black text-2xl md:text-3xl font-bold tracking-tight">
            Bundles
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            {bundles?.length ?? 0} bundles in catalog
          </p>
        </div>
        <Button
          onClick={() => {
            setCreateBundleData({ id: "" });
            setIsEditMode(false);
            setIsOpen(true);
          }}
          className="cursor-pointer transition-all duration-300 hover:bg-primary/80"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Bundle
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <Input
            placeholder="Search bundles..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9 text-black placeholder:text-neutral-500"
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value ?? "all")}
          items={categoryItems}
        >
          <SelectTrigger className="w-full sm:w-40 cursor-pointer text-black bg-neutral-100">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-100">
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((category: ProductCategoriesSummary) => (
              <SelectItem key={category.category} value={category.category}>
                {category.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as ProductStatus | "all")
          }
          items={bundleStatusItems}
        >
          <SelectTrigger className="w-full sm:w-36 cursor-pointer text-black bg-neutral-100">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-100">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isBundlesLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl border border-border p-4 animate-pulse"
              >
                <div className="w-full aspect-square rounded-xl bg-muted mb-3" />
                <div className="h-4 bg-muted rounded w-2/3 mb-2" />
                <div className="h-3 bg-muted rounded w-1/3" />
              </div>
            ))}
        </div>
      ) : bundles?.length === 0 ? (
        <div className="text-center py-16">
          <Layers className="w-12 h-12 mx-auto text-neutral-500/40 mb-3" />
          <p className="text-neutral-500">No bundles found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {bundles?.map((bundle: Bundle) => {
            const statusStyles: Record<ProductStatus, string> = {
              draft: "bg-yellow-50 text-yellow-600 border-yellow-200",
              published: "bg-green-50 text-green-600 border-green-200",
              archived: "bg-red-50 text-red-600 border-red-200",
            };

            return (
              <div
                key={bundle.id}
                className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="h-50 w-full bg-muted relative overflow-hidden">
                  {bundle.image_url ? (
                    <img
                      src={bundle.image_url}
                      alt={bundle.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Layers className="w-10 h-10 text-neutral-500/30" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] border",
                        statusStyles[bundle.status],
                      )}
                    >
                      {bundle.status}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setCreateBundleData({
                          id: bundle.id,
                          name: bundle.name,
                          description: bundle.description,
                          category: bundle.category,
                          image_url: bundle.image_url,
                          price: bundle.price,
                          status: bundle.status,
                          items: bundle.items,
                        });
                        setIsEditMode(true);
                        setIsOpen(true);
                      }}
                      className="w-8 h-8 bg-white/90 text-gray-500 rounded-lg flex items-center justify-center shadow-sm hover:bg-gray-500 hover:text-white transition-colors cursor-pointer"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(bundle)}
                      className="w-8 h-8 bg-white/90 text-destructive rounded-lg flex items-center justify-center shadow-sm hover:bg-destructive hover:text-white transition-colors duration-300 cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-black capitalize">
                    {bundle.category}
                  </p>
                  <p className="text-black font-medium text-sm mt-0.5 truncate">
                    {bundle.name}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-inter font-bold text-lg text-primary">
                      {formatToNaira(bundle.price)}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {bundle.items?.length ?? 0} items ·{" "}
                      {bundleAvailableQuantity(bundle)} avail.
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {isOpen ? (
            <BundleModal
              key={
                isEditMode && createBundleData.id
                  ? `edit-${createBundleData.id}`
                  : "create"
              }
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteTargetHasOrders ? "Archive Bundle" : "Delete Bundle"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTargetHasOrders
                ? `"${deleteTarget?.name}" has orders attached, so it will be archived instead of deleted.`
                : `Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting || isUpdating}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteTargetHasOrders ? "Archive" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Bundles;
