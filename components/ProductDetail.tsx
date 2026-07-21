"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/lang";
import { BagIcon, MinusIcon, PlusIcon } from "@/components/Icons";
import { ProductImage } from "@/components/ProductImage";

export function ProductDetail({
  product,
  collectionTitles,
}: {
  product: Product;
  collectionTitles: { slug: string; title: string }[];
}) {
  const { addItem } = useCart();
  const { t, tc } = useLang();
  const [size, setSize] = useState(product.sizes[0] ?? "Մեկ չափս");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const collections = collectionTitles;

  const handleAdd = () => {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        size,
        image: product.image,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10 md:py-14">
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-sm text-muted mb-8 flex flex-wrap gap-1.5"
      >
        <Link href="/" className="hover:text-foreground transition-colors">
          {t("ui.home")}
        </Link>
        <span>/</span>
        {collections[0] && (
          <>
            <Link
              href={`/collections/${collections[0].slug}`}
              className="hover:text-foreground transition-colors"
            >
              {tc(collections[0].slug, collections[0].title)}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-foreground/70">{product.name}</span>
      </motion.nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -40, rotateY: 8 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformPerspective: 1000 }}
          className="group relative aspect-square rounded-2xl overflow-hidden border border-line bg-surface shadow-2xl shadow-black/50"
        >
          <ProductImage name={product.name} image={product.image} />
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-muted mb-2">DN8 · {product.type}</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{product.name}</h1>
          <p className="text-2xl text-foreground/90 mb-6">{formatPrice(product.price)}</p>

          <p className="text-foreground/70 leading-relaxed mb-8">{product.description}</p>

          {/* Colors */}
          <div className="mb-6">
            <p className="text-sm uppercase tracking-wider text-muted mb-2">{t("ui.color")}</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <span key={color} className="px-3.5 py-1.5 rounded-full border border-line text-sm">
                  {color}
                </span>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-6">
            <p className="text-sm uppercase tracking-wider text-muted mb-2">{t("ui.size")}</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-12 px-3.5 py-2 rounded-full border text-sm transition-all active:scale-95 ${
                    size === s
                      ? "bg-foreground text-background border-foreground font-semibold"
                      : "border-line text-foreground/75 hover:border-muted hover:text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex items-center border border-line rounded-full">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="p-3 text-muted hover:text-foreground transition-colors"
                aria-label={t("ui.decreaseQty")}
              >
                <MinusIcon />
              </button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="p-3 text-muted hover:text-foreground transition-colors"
                aria-label={t("ui.increaseQty")}
              >
                <PlusIcon />
              </button>
            </div>
            <motion.button
              onClick={handleAdd}
              whileTap={{ scale: 0.96 }}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-semibold uppercase tracking-wider transition-colors ${
                added
                  ? "bg-surface-2 text-foreground border border-line"
                  : "bg-foreground text-background hover:bg-white"
              }`}
            >
              <BagIcon className="w-4 h-4" />
              {added ? t("ui.added") : t("ui.addToCart")}
            </motion.button>
          </div>

          {/* Collections */}
          {collections.length > 0 && (
            <div className="border-t border-line pt-6">
              <p className="text-sm uppercase tracking-wider text-muted mb-3">{t("ui.collections")}</p>
              <div className="flex flex-wrap gap-2">
                {collections.map(({ slug, title }) => (
                  <Link
                    key={slug}
                    href={`/collections/${slug}`}
                    className="px-3.5 py-1.5 rounded-full border border-line text-sm text-foreground/75 hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
                  >
                    {tc(slug, title)}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
