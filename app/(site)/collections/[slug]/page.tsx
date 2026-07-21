import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { dbGetCollection, dbGetProductsByCollection } from "@/lib/repo";
import { CollectionView } from "@/components/CollectionView";

export async function generateMetadata(props: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const collection = await dbGetCollection(decodeURIComponent(slug));
  return { title: collection ? `${collection.title} — DN8` : "DN8" };
}

export default async function CollectionPage(props: PageProps<"/collections/[slug]">) {
  const { slug } = await props.params;
  const decoded = decodeURIComponent(slug);
  const collection = await dbGetCollection(decoded);
  if (!collection) notFound();

  const products = await dbGetProductsByCollection(decoded);

  return <CollectionView collection={collection} products={products} />;
}
