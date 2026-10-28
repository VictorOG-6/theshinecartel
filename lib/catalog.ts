import { BundleItem, Catalog, Product } from "@/types";

export const BUNDLE_CATEGORY = "Bundle";

export function isBundleCatalog(catalog: Catalog): boolean {
  return catalog.item_type === "bundle" || catalog.slug.endsWith("_bundle");
}

export function catalogToProduct(catalog: Catalog): Product {
  return {
    id: catalog.id,
    slug: catalog.slug,
    created_at: catalog.created_at,
    updated_at: catalog.updated_at,
    name: catalog.name,
    image_url: catalog.image_url,
    price: catalog.price,
    category: catalog.category,
    description: catalog.description,
    variants: catalog.variants,
    reviews: [],
    total_reviews: 0,
    average_rating: 0,
    status: catalog.status,
    quantity: catalog.quantity,
  };
}

export function getCatalogBundleLineItems(catalog: Catalog): BundleItem[] {
  if (!isBundleCatalog(catalog) || !catalog.items?.length) {
    return [];
  }

  return catalog.items.flatMap((entry) =>
    "items" in entry && Array.isArray(entry.items) ? entry.items : [],
  );
}

export async function fetchCatalogBySlug(slug: string): Promise<Catalog | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) return null;

  try {
    const response = await fetch(`${baseUrl}/catalog/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) return null;

    return (await response.json()) as Catalog;
  } catch {
    return null;
  }
}
