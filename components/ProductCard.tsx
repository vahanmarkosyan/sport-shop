"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/lang";
import { BagIcon } from "@/components/Icons";
import { ProductImage } from "@/components/ProductImage";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addItem } = useCart();
  const { t } = useLang();

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: 0.05 * (index % 4), ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-line bg-surface transition-all duration-300 group-hover:border-muted group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-black/50">
          <ProductImage name={product.name} image={product.image} />
          {product.collections.includes("new-in") && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-foreground text-background text-[10px] font-bold uppercase tracking-wider">
              {t("ui.new")}
            </span>
          )}
        </div>
      </Link>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={`/products/${product.slug}`}
            className="block text-sm leading-snug hover:underline line-clamp-2"
          >
            {product.name}
          </Link>
          <p className="mt-1 text-sm text-muted">{formatPrice(product.price)}</p>
        </div>
        <button
          onClick={() =>
            addItem({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              size: product.sizes[0] ?? "Մեկ չափս",
              image: product.image,
            })
          }
          className="shrink-0 p-2.5 rounded-full border border-line text-foreground/80 hover:bg-foreground hover:text-background hover:border-foreground transition-all active:scale-90"
          aria-label={`${t("ui.addToCart")}: ${product.name}`}
          title={t("ui.addToCart")}
        >
          <BagIcon className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
