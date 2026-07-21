"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { useLang } from "@/lib/lang";

export function CollectionSection({
  titleKey,
  href,
  products,
}: {
  titleKey: string;
  href: string;
  products: Product[];
}) {
  const { t } = useLang();
  return (
    <section className="w-full px-4 sm:px-6 lg:px-10 py-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="flex items-end justify-between mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">{t(titleKey)}</h2>
        <Link
          href={href}
          className="text-sm text-muted hover:text-foreground uppercase tracking-wider transition-colors whitespace-nowrap"
        >
          {t("ui.viewAll")}
        </Link>
      </motion.div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.slice(0, 8).map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}
