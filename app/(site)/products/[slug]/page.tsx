import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { dbGetProduct, dbGetCollections } from "@/lib/repo";
import { ProductDetail } from "@/components/ProductDetail";

export async function generateMetadata(props: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await dbGetProduct(decodeURIComponent(slug));
  return { title: product ? `${product.name} — DN8` : "DN8" };
}

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const product = await dbGetProduct(decodeURIComponent(slug));
  if (!product) notFound();

  const all = await dbGetCollections();
  const collectionTitles = product.collections
    .map((s) => all.find((c) => c.slug === s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .map((c) => ({ slug: c.slug, title: c.title }));

  return <ProductDetail product={product} collectionTitles={collectionTitles} />;
}
