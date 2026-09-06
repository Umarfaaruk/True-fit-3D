import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/product/ProductDetail";
import { getProduct, products, relatedProducts } from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const product = getProduct(params.id);
  if (!product) return { title: "Not found — TrueFit3D" };
  return {
    title: `${product.name} — TrueFit3D`,
    description: product.description,
  };
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProduct(params.id);
  if (!product) notFound();

  return <ProductDetail product={product} related={relatedProducts(product)} />;
}
