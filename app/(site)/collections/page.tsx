import type { Metadata } from "next";
import { dbGetProducts } from "@/lib/repo";
import { AllProductsView } from "@/components/AllProductsView";

export const metadata: Metadata = {
  title: "DN8 — Բոլոր Ապրանքները",
};

export default async function AllCollectionsPage() {
  const products = await dbGetProducts();
  return <AllProductsView products={products} />;
}
