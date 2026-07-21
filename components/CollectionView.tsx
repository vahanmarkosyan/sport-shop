"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Collection, Product } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { FiltersModal, EMPTY_FILTERS, type Filters } from "@/components/FiltersModal";
import { FilterIcon } from "@/components/Icons";
import { useLang } from "@/lib/lang";

export function CollectionView({
  collection,
  products,
}: {
  collection: Collection;
  products: Product[];
}) {
  const { t, tc } = useLang();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (filters.types.length && !filters.types.includes(p.type)) return false;
      if (filters.sizes.length && !p.sizes.some((s) => filters.sizes.includes(s))) return false;
      if (filters.genders.length && !filters.genders.includes(p.gender)) return false;
      if (filters.colors.length && !p.colors.some((c) => filters.colors.includes(c))) return false;
      return true;
    });
  }, [products, filters]);

  const activeCount =
    filters.types.length + filters.sizes.length + filters.genders.length + filters.colors.length;

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10 md:py-14">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-wrap items-end justify-between gap-4 mb-8"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted mb-2">{t("ui.dn8Collection")}</p>
          <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight">
            {tc(collection.slug, collection.title)}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted">{filtered.length} {t("ui.products")}</p>
          <button
            onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-line text-sm uppercase tracking-wider hover:border-muted transition-colors"
          >
            <FilterIcon />
            {t("ui.filters")}
            {activeCount > 0 && (
              <span className="min-w-5 h-5 px-1 rounded-full bg-foreground text-background text-[11px] font-bold flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </motion.div>

      {filtered.length === 0 ? (
        <div className="py-24 text-center text-muted">
          <p className="mb-4">{t("ui.noProductsFiltered")}</p>
          <button
            onClick={() => setFilters(EMPTY_FILTERS)}
            className="px-6 py-2.5 border border-line rounded-full text-sm text-foreground hover:bg-foreground hover:text-background transition-colors"
          >
            {t("ui.clearFilters")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}

      <FiltersModal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        products={products}
        filters={filters}
        setFilters={setFilters}
        resultCount={filtered.length}
      />
    </main>
  );
}
