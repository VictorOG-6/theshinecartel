import ProductDetailClient from "@/components/pages/product/product-detail-client";
import { fetchCatalogBySlug } from "@/lib/catalog";
import type { Metadata } from "next";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const catalog = await fetchCatalogBySlug(slug);

  if (!catalog) {
    return {
      title: "Product not found",
      description: "We could not find the product you are looking for.",
    };
  }

  return {
    title: catalog.name,
    description: catalog.description,
    openGraph: {
      title: catalog.name,
      description: catalog.description,
      images: catalog.image_url ? [catalog.image_url] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  return <ProductDetailClient slug={slug} />;
}
