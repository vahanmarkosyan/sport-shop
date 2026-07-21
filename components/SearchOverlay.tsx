"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { formatPrice, type Product } from "@/lib/products";
import { useLang } from "@/lib/lang";
import { CloseIcon, SearchIcon } from "@/components/Icons";
import { ProductImage } from "@/components/ProductImage";

// State lives here so it resets naturally each time the overlay opens
// (the panel unmounts on close via AnimatePresence).
function SearchPanel({ onClose }: { onClose: () => void }) {
  const { t } = useLang();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);

  // debounced live search against the API
  useEffect(() => {
    const q = query.trim();
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      if (!q) {
        setResults([]);
        return;
      }
      fetch(`/api/products?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((data) => setResults(Array.isArray(data) ? data.slice(0, 8) : []))
        .catch(() => {});
    }, q ? 200 : 0);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md overflow-y-auto"
    >
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 pb-16"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg uppercase tracking-widest text-muted">{t("ui.search")}</h2>
          <button
            onClick={onClose}
            className="p-2 text-foreground/70 hover:text-foreground transition-colors"
            aria-label={t("ui.closeSearch")}
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-3 border-b-2 border-line focus-within:border-foreground transition-colors pb-3">
          <SearchIcon className="w-6 h-6 text-muted" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("ui.searchPlaceholder")}
            className="w-full bg-transparent text-xl outline-none placeholder:text-muted"
          />
        </div>

        <div className="mt-8">
          {query.trim() && results.length === 0 && (
            <p className="text-muted text-center py-10">
              {t("ui.searchEmpty", { q: query })}
            </p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {results.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i }}
              >
                <Link
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="group block"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden border border-line">
                    <ProductImage name={product.name} image={product.image} />
                  </div>
                  <p className="mt-2 text-sm line-clamp-1">{product.name}</p>
                  <p className="text-sm text-muted">{formatPrice(product.price)}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return <AnimatePresence>{open && <SearchPanel onClose={onClose} />}</AnimatePresence>;
}
