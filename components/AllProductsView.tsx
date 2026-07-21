"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/lib/products";
import { useLang } from "@/lib/lang";
import { ProductCard } from "@/components/ProductCard";

const PER_PAGE = 12;

export function AllProductsView({ products }: { products: Product[] }) {
  const { t } = useLang();
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.max(1, Math.ceil(products.length / PER_PAGE));
  const current = products.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const goTo = (p: number) => {
    const next = Math.min(totalPages, Math.max(1, p));
    if (next === page) return;
    setPage(next);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="flex-1 w-full px-4 sm:px-6 lg:px-10 py-10 md:py-14">
      <div ref={topRef} className="scroll-mt-28" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-wrap items-end justify-between gap-4 mb-8"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted mb-2">
            {t("ui.dn8Collection")}
          </p>
          <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight">
            {t("all.title")}
          </h1>
        </div>
        <p className="text-sm text-muted">
          {products.length} {t("ui.products")}
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {current.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>

      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Pagination">
          <button
            onClick={() => goTo(page - 1)}
            disabled={page === 1}
            aria-label={t("ui.prevPage")}
            className="w-10 h-10 rounded-full border border-line text-sm hover:border-muted transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => goTo(p)}
              aria-current={p === page ? "page" : undefined}
              className={`w-10 h-10 rounded-full border text-sm font-semibold transition-all active:scale-95 ${
                p === page
                  ? "bg-foreground text-background border-foreground"
                  : "border-line text-foreground/75 hover:border-muted hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => goTo(page + 1)}
            disabled={page === totalPages}
            aria-label={t("ui.nextPage")}
            className="w-10 h-10 rounded-full border border-line text-sm hover:border-muted transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
          >
            →
          </button>
        </nav>
      )}
    </main>
  );
}
