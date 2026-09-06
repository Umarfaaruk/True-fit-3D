import type { Metadata } from "next";
import ShopBrowser, { type ShopFilters, type SortKey } from "@/components/shop/ShopBrowser";
import { categories, collections, type Category, type CollectionId } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop — TrueFit3D",
  description: "Browse the full TrueFit3D wardrobe with search, filters, and measurement-led sizing.",
};

type Params = Record<string, string | string[] | undefined>;

function one(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

const SORTS: SortKey[] = ["featured", "price-asc", "price-desc", "rating"];

export default function ShopPage({ searchParams }: { searchParams: Params }) {
  const rawCategory = one(searchParams.category);
  const rawCollection = one(searchParams.collection);
  const rawSort = one(searchParams.sort);
  const rawMax = Number(one(searchParams.max));

  const initial: ShopFilters = {
    q: one(searchParams.q) ?? "",
    category: categories.includes(rawCategory as Category) ? (rawCategory as Category) : null,
    collection: collections.some((c) => c.id === rawCollection)
      ? (rawCollection as CollectionId)
      : null,
    size: one(searchParams.size) ?? null,
    color: one(searchParams.color) ?? null,
    maxPrice: Number.isFinite(rawMax) && rawMax > 0 ? rawMax : 700,
    saleOnly: one(searchParams.sale) === "1",
    sort: SORTS.includes(rawSort as SortKey) ? (rawSort as SortKey) : "featured",
  };

  return <ShopBrowser initial={initial} />;
}
