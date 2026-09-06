import Image from "next/image";
import type { Product } from "@/lib/products";
import ProductImage from "./ProductImage";

/**
 * Renders real product photography when a product has one, falling back to the
 * generated silhouette otherwise. Photography is a single hero shot per product
 * — per-colour shots would need a real shoot, so the colour swatches select the
 * variant without changing the image.
 */
export default function ProductPhoto({
  product,
  color,
  sizes,
  priority = false,
  className = "",
}: {
  product: Product;
  /** Only used by the SVG fallback, which can be tinted. */
  color?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (!product.imageUrl) {
    return (
      <ProductImage
        category={product.category}
        color={color ?? product.colors[0].hex}
        className={`h-full w-full ${className}`}
      />
    );
  }

  return (
    <Image
      src={product.imageUrl}
      alt={product.imageAlt ?? product.name}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
}
