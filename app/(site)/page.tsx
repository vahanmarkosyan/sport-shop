import { Hero } from "@/components/Hero";
import { BornToWin } from "@/components/BornToWin";
import { CollectionSection } from "@/components/CollectionSection";
import { StoreSection } from "@/components/StoreSection";
import { dbGetProductsByCollection } from "@/lib/repo";

export default async function Home() {
  const [newCollection, bestSellers] = await Promise.all([
    dbGetProductsByCollection("new-collection"),
    dbGetProductsByCollection("best-sellers"),
  ]);

  return (
    <main className="flex-1">
      <Hero />
      {/* Desktop: video band right after the hero */}
      <div className="hidden md:block">
        <BornToWin />
      </div>
      <CollectionSection
        titleKey="home.newCollection"
        href="/collections/new-collection"
        products={newCollection}
      />
      {/* Mobile: video band between the two collection sections */}
      <div className="md:hidden">
        <BornToWin />
      </div>
      <CollectionSection
        titleKey="home.bestSellers"
        href="/collections/best-sellers"
        products={bestSellers}
      />
      <StoreSection />
    </main>
  );
}
