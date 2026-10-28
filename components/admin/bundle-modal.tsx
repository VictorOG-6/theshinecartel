"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  Controller,
  FieldErrors,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Upload, Loader2, Plus } from "lucide-react";
import { useCreateBundleContext } from "@/contexts/bundle/create-bundle-context";
import { useCreateBundle } from "@/hooks/bundle/use-create-bundle";
import { useUpdateBundle } from "@/hooks/bundle/use-update-bundle";
import useFetchProducts from "@/hooks/product/use-fetch-products";
import { productKeys } from "@/lib/react-query/query-keys";
import { useQueries } from "@tanstack/react-query";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { BundleItemCreate, BundleUpdate, Product } from "@/types";
import { $http } from "@/lib/http";
import { API_URL } from "@/lib/constants";

const BUNDLE_CATEGORY = "Bundle";
const IMAGE_UPLOAD_ENDPOINT = "/image";
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface ImageUploadResponse {
  image_url: string;
  image_path: string;
}

const bundleItemSchema = z.object({
  product_id: z.string().optional(),
  product_variant_id: z.string().optional(),
  product_sub_variant_id: z.string().optional(),
});

const createBundleSchema = z.object({
  name: z.string().min(2, "Bundle name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image_url: z.string().min(1, "Bundle image is required"),
  price: z
    .number({ error: "Price is required" })
    .positive("Bundle price must be greater than 0"),
  status: z.enum(["draft", "published", "archived"], {
    message: "Status must be draft, published or archived",
  }),
  items: z
    .array(bundleItemSchema)
    .min(2, "Add at least two products to the bundle"),
});

type CreateBundleFormFields = z.infer<typeof createBundleSchema>;

const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <p className="text-sm text-red-600" role="alert">
      {message}
    </p>
  );
};

const getImagePreviewSrc = (imageUrl: string) => {
  if (
    !imageUrl ||
    imageUrl.startsWith("/") ||
    imageUrl.startsWith("data:") ||
    /^https?:\/\//.test(imageUrl)
  ) {
    return imageUrl;
  }

  const baseUrl = API_URL?.replace(/\/$/, "");
  const imagePath = imageUrl.startsWith("uploads/")
    ? imageUrl
    : `uploads/${imageUrl}`;

  return baseUrl ? `${baseUrl}/${imagePath}` : `/${imagePath}`;
};

const getItemSelectionKey = (item: CreateBundleFormFields["items"][number]) =>
  `${item.product_id}:${item.product_variant_id ?? ""}:${item.product_sub_variant_id ?? ""}`;

const getSelectedItemQuantity = (
  product: Product,
  productVariantId?: string,
  productSubVariantId?: string,
): number | null => {
  const variants = product.variants ?? [];

  if (productSubVariantId) {
    for (const variant of variants) {
      const subVariant = variant.sub_variants?.find(
        (entry) => entry.id === productSubVariantId,
      );
      if (subVariant) {
        return subVariant.quantity;
      }
    }
    return null;
  }

  if (productVariantId) {
    const variant = variants.find((entry) => entry.id === productVariantId);
    return variant?.quantity ?? null;
  }

  if (variants.length > 0) {
    return null;
  }

  return product.quantity;
};

const defaultBundleFormItems = (): CreateBundleFormFields["items"] => [
  {
    product_id: undefined,
    product_variant_id: undefined,
    product_sub_variant_id: undefined,
  },
  {
    product_id: undefined,
    product_variant_id: undefined,
    product_sub_variant_id: undefined,
  },
];

const formatItemsForForm = (
  items?: CreateBundleFormFields["items"],
): CreateBundleFormFields["items"] =>
  items?.map((item) => ({
    product_id: item.product_id,
    product_variant_id: item.product_variant_id ?? undefined,
    product_sub_variant_id: item.product_sub_variant_id ?? undefined,
  })) ?? [];

const formatStoredBundleItems = (items: unknown): CreateBundleFormFields["items"] => {
  if (!Array.isArray(items) || items.length < 2) {
    return defaultBundleFormItems();
  }

  return items.map((item) => ({
    product_id:
      typeof item?.product_id === "string" ? item.product_id : undefined,
    product_variant_id:
      typeof item?.product_variant_id === "string"
        ? item.product_variant_id
        : undefined,
    product_sub_variant_id:
      typeof item?.product_sub_variant_id === "string"
        ? item.product_sub_variant_id
        : undefined,
  }));
};

const formatItemsForPayload = (
  items: CreateBundleFormFields["items"],
  resolveProduct: (productId: string) => Product | undefined,
): BundleItemCreate[] =>
  items
    .filter((item): item is typeof item & { product_id: string } =>
      Boolean(item.product_id?.trim()),
    )
    .map(({ product_id, product_variant_id, product_sub_variant_id }) => {
      const product = resolveProduct(product_id);
      if (!product) {
        throw new Error(`Product ${product_id} is unavailable`);
      }

      const quantity = getSelectedItemQuantity(
        product,
        product_variant_id,
        product_sub_variant_id,
      );

      if (quantity === null || quantity < 1) {
        throw new Error(`Invalid quantity for product ${product.name}`);
      }

      return {
        product_id,
        quantity,
        ...(product_variant_id ? { product_variant_id } : {}),
        ...(product_sub_variant_id ? { product_sub_variant_id } : {}),
      };
    });

export default function BundleModal() {
  const { createBundleData, isEditMode, setIsOpen } = useCreateBundleContext();
  const FORM_STORAGE_KEY = "bundleDetailsForm";
  const { mutate: createBundle, isPending: isCreating } = useCreateBundle();
  const { mutate: updateBundle, isPending: isUpdating } = useUpdateBundle();
  const { data: products, isLoading: isProductsLoading } = useFetchProducts({
    page_size: 100,
    page: 1,
  });
  const [uploading, setUploading] = useState(false);

  const productList = useMemo(
    () => (Array.isArray(products) ? products : []),
    [products],
  );

  const productMap = useMemo(() => {
    const map = new Map<string, Product>();
    productList.forEach((product: Product) => map.set(product.id, product));
    return map;
  }, [productList]);

  const productSelectItems = useMemo(
    () =>
      productList.map((product) => ({
        label: product.name,
        value: product.id,
      })),
    [productList],
  );

  const emptyBundleItem = (): CreateBundleFormFields["items"][number] => ({
    product_id: undefined,
    product_variant_id: undefined,
    product_sub_variant_id: undefined,
  });

  const form = useForm<CreateBundleFormFields>({
    resolver: zodResolver(createBundleSchema),
    defaultValues: {
      name: "",
      description: "",
      image_url: "",
      price: undefined,
      status: "draft",
      items: defaultBundleFormItems(),
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const {
    formState: { isValid, errors },
  } = form;

  const watchedItems = form.watch("items");

  const selectedProductIds = useMemo(() => {
    const ids = new Set<string>();
    watchedItems?.forEach((item) => {
      if (item?.product_id?.trim()) {
        ids.add(item.product_id);
      }
    });
    return Array.from(ids);
  }, [watchedItems]);

  const productDetailQueries = useQueries({
    queries: selectedProductIds.map((productId) => ({
      queryKey: productKeys.detail(productId),
      queryFn: async (): Promise<Product> => {
        const res = await $http.get(`/product/${productId}`);
        return res.data;
      },
      staleTime: 60 * 1000,
    })),
  });

  const detailedProductMap = useMemo(() => {
    const map = new Map<string, Product>();
    selectedProductIds.forEach((productId, index) => {
      const product = productDetailQueries[index]?.data;
      if (product) {
        map.set(productId, product);
      }
    });
    return map;
  }, [productDetailQueries, selectedProductIds]);

  const resolveProduct = (productId: string) =>
    detailedProductMap.get(productId) ?? productMap.get(productId);

  const isAnySelectedProductLoading = productDetailQueries.some(
    (query) => query.isLoading,
  );

  useEffect(() => {
    if (isEditMode && createBundleData?.id) {
      form.reset({
        name: createBundleData.name ?? "",
        description: createBundleData.description ?? "",
        image_url: createBundleData.image_url ?? "",
        price: createBundleData.price ?? undefined,
        status: createBundleData.status ?? "draft",
        items: formatItemsForForm(
          createBundleData.items?.map((item) => ({
            product_id: item.product_id,
            product_variant_id: item.product_variant_id ?? undefined,
            product_sub_variant_id: item.product_sub_variant_id ?? undefined,
          })),
        ),
      });
    }
  }, [isEditMode, createBundleData, form]);

  useEffect(() => {
    if (isEditMode) return;

    const stored = localStorage.getItem(FORM_STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      form.reset({
        name: parsed.name || "",
        description: parsed.description || "",
        image_url: parsed.image_url || "",
        price:
          parsed.price === "" || parsed.price == null
            ? undefined
            : Number(parsed.price),
        status: parsed.status || "draft",
        items: formatStoredBundleItems(parsed.items),
      });
    } catch (error) {
      console.error("Failed to parse stored bundle data:", error);
      localStorage.removeItem(FORM_STORAGE_KEY);
    }
  }, [form, isEditMode]);

  useEffect(() => {
    if (isEditMode) return;

    const subscription = form.watch((value) => {
      try {
        localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(value));
      } catch (error) {
        console.error("Failed to store bundle form:", error);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, isEditMode]);

  const validateItemSelections = (
    items: CreateBundleFormFields["items"],
  ): string | null => {
    const filledItems = items.filter((item) => item.product_id?.trim());
    if (filledItems.length < 2) {
      return "Add at least two products to the bundle";
    }

    const keys = new Set<string>();

    for (const item of items) {
      if (!item.product_id?.trim()) {
        return "Select a product for each bundle row";
      }

      const product = resolveProduct(item.product_id);
      if (!product) {
        return "One or more selected products are no longer available";
      }

      const variants = product.variants ?? [];
      if (variants.length > 0 && !item.product_variant_id) {
        return `Select a variant for "${product.name}"`;
      }

      const variant = variants.find((v) => v.id === item.product_variant_id);
      const subVariants = variant?.sub_variants ?? [];
      if (subVariants.length > 0 && !item.product_sub_variant_id) {
        return `Select a size for "${product.name}"`;
      }

      const quantity = getSelectedItemQuantity(
        product,
        item.product_variant_id,
        item.product_sub_variant_id,
      );
      if (quantity === null) {
        return `Could not resolve inventory for "${product.name}"`;
      }
      if (quantity < 1) {
        return `"${product.name}" has no available stock for this selection`;
      }

      const key = getItemSelectionKey(item);
      if (keys.has(key)) {
        return "Each product selection must be unique in the bundle";
      }
      keys.add(key);
    }

    return null;
  };

  const onSubmit: SubmitHandler<CreateBundleFormFields> = (values) => {
    const selectionError = validateItemSelections(values.items);
    if (selectionError) {
      toast.error(selectionError);
      return;
    }

    let items: BundleItemCreate[];
    try {
      items = formatItemsForPayload(values.items, resolveProduct);
    } catch (error) {
      console.error(error);
      toast.error("Could not resolve item quantities. Check your selections.");
      return;
    }
    const payload = {
      name: values.name,
      description: values.description,
      image_url: values.image_url,
      price: values.price,
      status: values.status,
      category: createBundleData.category ?? BUNDLE_CATEGORY,
      items,
    };

    if (isEditMode && createBundleData?.id) {
      const updatePayload: BundleUpdate = {
        ...payload,
        id: createBundleData.id,
      };

      updateBundle(updatePayload, {
        onSuccess: () => {
          toast.success("Bundle updated successfully");
          setIsOpen(false);
        },
        onError: () => {
          toast.error("Failed to update bundle");
        },
      });
      return;
    }

    createBundle(payload, {
      onSuccess: () => {
        form.reset();
        localStorage.removeItem(FORM_STORAGE_KEY);
        toast.success("Bundle created successfully");
        setIsOpen(false);
      },
      onError: () => {
        toast.error("Failed to create bundle");
      },
    });
  };

  const handleClose = () => {
    form.reset();
    setIsOpen(false);
    localStorage.removeItem(FORM_STORAGE_KEY);
  };

  const handleFormError = (formErrors: FieldErrors<CreateBundleFormFields>) => {
    const itemsError = formErrors.items;
    if (itemsError && !Array.isArray(itemsError) && itemsError.message) {
      toast.error(itemsError.message);
      return;
    }

    const firstError = Object.values(formErrors)[0];
    if (
      firstError &&
      "message" in firstError &&
      typeof firstError.message === "string"
    ) {
      toast.error(firstError.message);
    }
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Please upload a JPG, PNG, or WEBP image");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error("Image must be 5MB or smaller");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("purpose", "product");
      formData.append("file", file);

      const response = await $http.post<ImageUploadResponse>(
        IMAGE_UPLOAD_ENDPOINT,
        formData,
      );

      form.setValue("image_url", response.data.image_url, {
        shouldDirty: true,
        shouldValidate: true,
      });

      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const imageUrl = form.watch("image_url");

  const handleAddProductRow = () => {
    append(emptyBundleItem());
  };

  const isSubmitDisabled =
    isCreating ||
    isUpdating ||
    uploading ||
    !isValid ||
    isProductsLoading ||
    isAnySelectedProductLoading;

  const selectTriggerClassName =
    "w-full cursor-pointer bg-neutral-100 text-black";
  const selectContentClassName = "z-[100] bg-neutral-100";

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, handleFormError)}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-inter text-xl font-semibold">
          {isEditMode ? "Edit Bundle" : "Create Bundle"}
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="cursor-pointer transition-all duration-300 hover:text-red-500"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div>
        <Label>Bundle Image</Label>
        <div className="mt-2 flex items-center gap-4">
          {imageUrl ? (
            <div className="relative w-24 h-24 rounded-xl overflow-hidden border">
              <img
                src={getImagePreviewSrc(imageUrl)}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() =>
                  form.setValue("image_url", "", {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center cursor-pointer"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ) : (
            <label className="w-24 h-24 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin text-neutral-500" />
              ) : (
                <Upload className="w-5 h-5 text-neutral-500" />
              )}
              <span className="text-[10px] text-neutral-500 mt-1">Upload</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
        <FieldError message={errors.image_url?.message} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label>Bundle Name *</Label>
          <Input
            type="text"
            {...form.register("name")}
            placeholder="e.g. Glow Essentials Set"
            autoComplete="off"
            className="cursor-text"
          />
          <FieldError message={errors.name?.message} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Description *</Label>
          <Textarea
            {...form.register("description")}
            placeholder="Bundle description..."
            rows={3}
            autoComplete="off"
            className="cursor-text"
          />
          <FieldError message={errors.description?.message} />
        </div>
        <div className="space-y-2">
          <Label>Price *</Label>
          <Input
            type="number"
            step="0.01"
            min="0.01"
            {...form.register("price", {
              valueAsNumber: true,
              setValueAs: (value) =>
                value === "" || value === null ? undefined : Number(value),
            })}
            placeholder="e.g. 15000"
            className="cursor-text"
          />
          <FieldError message={errors.price?.message} />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Controller
            name="status"
            control={form.control}
            render={({ field }) => (
              <Select
                modal={false}
                items={[
                  { label: "Draft", value: "draft" },
                  { label: "Published", value: "published" },
                  { label: "Archived", value: "archived" },
                ]}
                value={field.value}
                onValueChange={(value) => {
                  if (!value) return;
                  field.onChange(value);
                }}
              >
                <SelectTrigger className={selectTriggerClassName}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className={selectContentClassName}>
                  <SelectGroup>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.status?.message} />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <Label>Products in bundle *</Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select at least two products. Choose a variant and size when the
              product offers them. Stock is calculated automatically from each
              item&apos;s inventory.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddProductRow}
            disabled={isProductsLoading}
            className="cursor-pointer shrink-0"
          >
            <Plus size={12} className="mr-1" />
            Add Product
          </Button>
        </div>

        {isProductsLoading && (
          <p className="text-sm text-muted-foreground">Loading products...</p>
        )}

        {!isProductsLoading && productSelectItems.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No products found. Add products in the catalog first.
          </p>
        )}

        <div className="space-y-3">
          {fields.map((field, index) => {
            const row = watchedItems?.[index];
            const selectedProductId = row?.product_id;
            const selectedVariantId = row?.product_variant_id;
            const product = selectedProductId
              ? resolveProduct(selectedProductId)
              : undefined;
            const isLoadingRowProduct = (() => {
              if (!selectedProductId) return false;
              if (detailedProductMap.has(selectedProductId)) return false;
              const queryIndex = selectedProductIds.indexOf(selectedProductId);
              return productDetailQueries[queryIndex]?.isLoading ?? false;
            })();
            const variants = product?.variants ?? [];
            const selectedVariant = variants.find(
              (variant) => variant.id === selectedVariantId,
            );
            const subVariants = selectedVariant?.sub_variants ?? [];
            const showVariantPicker =
              Boolean(selectedProductId) &&
              (isLoadingRowProduct || variants.length > 0);
            const showSubVariantPicker =
              Boolean(selectedVariantId) && subVariants.length > 0;
            const variantSelectItems = variants.map((variant) => ({
              label: variant.name,
              value: variant.id,
            }));
            const subVariantSelectItems = subVariants.map((subVariant) => ({
              label: `${subVariant.size} (${subVariant.quantity} in stock)`,
              value: subVariant.id,
            }));
            const resolvedQuantity =
              product && !isLoadingRowProduct
                ? getSelectedItemQuantity(
                    product,
                    selectedVariantId,
                    row?.product_sub_variant_id,
                  )
                : null;

            return (
              <div
                key={field.id}
                className="grid grid-cols-1 gap-3 rounded-lg border p-3 sm:grid-cols-2"
              >
                <div className="flex items-start justify-between gap-2 sm:col-span-2">
                  <Label className="pt-2">Product {index + 1}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    disabled={fields.length <= 2}
                    className="cursor-pointer text-muted-foreground hover:text-red-500 disabled:cursor-not-allowed"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <Controller
                    name={`items.${index}.product_id`}
                    control={form.control}
                    render={({ field: productField }) => (
                      <Select
                        modal={false}
                        items={productSelectItems}
                        disabled={isProductsLoading || productSelectItems.length === 0}
                        value={productField.value ?? null}
                        onValueChange={(value) => {
                          if (!value) return;
                          productField.onChange(value);
                          form.setValue(
                            `items.${index}.product_variant_id`,
                            undefined,
                            { shouldValidate: true },
                          );
                          form.setValue(
                            `items.${index}.product_sub_variant_id`,
                            undefined,
                            { shouldValidate: true },
                          );
                        }}
                      >
                        <SelectTrigger className={selectTriggerClassName}>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent className={selectContentClassName}>
                          {productSelectItems.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError
                    message={errors.items?.[index]?.product_id?.message}
                  />
                </div>

                {showVariantPicker && (
                  <div className="space-y-1">
                    <Label>
                      Variant{variants.length > 0 ? " *" : ""}
                    </Label>
                    {isLoadingRowProduct ? (
                      <div className="flex h-8 items-center gap-2 rounded-lg border border-input bg-muted/40 px-2.5 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading variants…
                      </div>
                    ) : (
                      <Controller
                        name={`items.${index}.product_variant_id`}
                        control={form.control}
                        render={({ field: variantField }) => (
                          <Select
                            modal={false}
                            items={variantSelectItems}
                            value={variantField.value ?? null}
                            onValueChange={(value) => {
                              if (!value) return;
                              variantField.onChange(value);
                              form.setValue(
                                `items.${index}.product_sub_variant_id`,
                                undefined,
                                { shouldValidate: true },
                              );
                            }}
                          >
                            <SelectTrigger className={selectTriggerClassName}>
                              <SelectValue placeholder="Select variant (color)" />
                            </SelectTrigger>
                            <SelectContent className={selectContentClassName}>
                              {variants.map((variant) => (
                                <SelectItem
                                  key={variant.id}
                                  value={variant.id}
                                >
                                  {variant.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    )}
                  </div>
                )}

                {showSubVariantPicker && (
                  <div className="space-y-1">
                    <Label>Size *</Label>
                    <Controller
                      name={`items.${index}.product_sub_variant_id`}
                      control={form.control}
                      render={({ field: subVariantField }) => (
                        <Select
                          modal={false}
                          items={subVariantSelectItems}
                          value={subVariantField.value ?? null}
                          onValueChange={(value) => {
                            if (!value) return;
                            subVariantField.onChange(value);
                          }}
                        >
                          <SelectTrigger className={selectTriggerClassName}>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent className={selectContentClassName}>
                            {subVariants.map((subVariant) => (
                              <SelectItem
                                key={subVariant.id}
                                value={subVariant.id}
                              >
                                {subVariant.size} ({subVariant.quantity} in
                                stock)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                )}

                {selectedProductId &&
                  !isLoadingRowProduct &&
                  variants.length === 0 && (
                    <p className="text-xs text-muted-foreground sm:col-span-2">
                      This product has no variants — the base product will be
                      used for inventory.
                    </p>
                  )}

                {product &&
                  !isLoadingRowProduct &&
                  resolvedQuantity !== null &&
                  resolvedQuantity >= 1 && (
                    <p className="text-xs text-muted-foreground sm:col-span-2">
                      Item quantity sent with bundle:{" "}
                      <span className="font-medium text-foreground">
                        {resolvedQuantity}
                      </span>{" "}
                      (from selected product inventory)
                    </p>
                  )}
              </div>
            );
          })}
        </div>
        <FieldError
          message={
            !Array.isArray(errors.items) ? errors.items?.message : undefined
          }
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={handleClose}
          className="cursor-pointer"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitDisabled} className="cursor-pointer">
          {isCreating || isUpdating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : isEditMode ? (
            "Update Bundle"
          ) : (
            "Create Bundle"
          )}
        </Button>
      </div>
    </form>
  );
}
