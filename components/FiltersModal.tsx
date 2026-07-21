"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/lib/products";
import { CloseIcon } from "@/components/Icons";
import { useLang } from "@/lib/lang";

export type Filters = {
  types: string[];
  sizes: string[];
  genders: string[];
  colors: string[];
};

export const EMPTY_FILTERS: Filters = { types: [], sizes: [], genders: [], colors: [] };

function countBy(products: Product[], get: (p: Product) => string[]) {
  const map = new Map<string, number>();
  for (const p of products) {
    for (const v of get(p)) map.set(v, (map.get(v) ?? 0) + 1);
  }
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: [string, number][];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  if (options.length === 0) return null;
  return (
    <div className="py-5 border-b border-line last:border-b-0">
      <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map(([value, count]) => {
          const active = selected.includes(value);
          return (
            <button
              key={value}
              onClick={() => onToggle(value)}
              className={`px-3.5 py-1.5 rounded-full border text-sm transition-all active:scale-95 ${
                active
                  ? "bg-foreground text-background border-foreground"
                  : "border-line text-foreground/75 hover:border-muted hover:text-foreground"
              }`}
            >
              {value}
              <span className={`ml-1.5 text-xs ${active ? "text-background/60" : "text-muted"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function FiltersModal({
  open,
  onClose,
  products,
  filters,
  setFilters,
  resultCount,
}: {
  open: boolean;
  onClose: () => void;
  products: Product[];
  filters: Filters;
  setFilters: (f: Filters) => void;
  resultCount: number;
}) {
  const { t } = useLang();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const toggle = (key: keyof Filters) => (value: string) => {
    const current = filters[key];
    setFilters({
      ...filters,
      [key]: current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    });
  };

  const hasAny =
    filters.types.length + filters.sizes.length + filters.genders.length + filters.colors.length > 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 w-full sm:max-w-2xl bg-surface border border-line sm:rounded-2xl rounded-t-2xl shadow-2xl shadow-black/70 flex flex-col max-h-[85vh]"
          >
            <div className="flex items-center justify-between px-6 h-16 border-b border-line shrink-0">
              <h2 className="uppercase tracking-widest text-sm">{t("ui.filters")}</h2>
              <button
                onClick={onClose}
                className="p-2 text-foreground/70 hover:text-foreground transition-colors"
                aria-label={t("ui.closeFilters")}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              <FilterGroup
                title={t("ui.productType")}
                options={countBy(products, (p) => [p.type])}
                selected={filters.types}
                onToggle={toggle("types")}
              />
              <FilterGroup
                title={t("ui.size")}
                options={countBy(products, (p) => p.sizes)}
                selected={filters.sizes}
                onToggle={toggle("sizes")}
              />
              <FilterGroup
                title={t("ui.gender")}
                options={countBy(products, (p) => [p.gender])}
                selected={filters.genders}
                onToggle={toggle("genders")}
              />
              <FilterGroup
                title={t("ui.color")}
                options={countBy(products, (p) => p.colors)}
                selected={filters.colors}
                onToggle={toggle("colors")}
              />
            </div>

            <div className="flex items-center gap-3 px-6 py-4 border-t border-line shrink-0">
              <button
                onClick={() => setFilters(EMPTY_FILTERS)}
                disabled={!hasAny}
                className="flex-1 py-3 rounded-full border border-line text-sm uppercase tracking-wider text-foreground/75 hover:text-foreground hover:border-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t("ui.clear")}
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-full bg-foreground text-background text-sm font-semibold uppercase tracking-wider hover:bg-white transition-colors"
              >
                {t("ui.show")} ({resultCount})
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
