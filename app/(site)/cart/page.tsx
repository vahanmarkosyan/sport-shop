"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/lang";
import { formatPrice } from "@/lib/products";
import { BagIcon, MinusIcon, PlusIcon, TrashIcon } from "@/components/Icons";
import { ProductImage } from "@/components/ProductImage";

export default function CartPage() {
  const { items, total, setQty, removeItem, clear } = useCart();
  const { t } = useLang();

  return (
    <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 md:py-14">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-10"
      >
        {t("ui.cart")}
      </motion.h1>

      {items.length === 0 ? (
        <div className="py-24 flex flex-col items-center gap-5 text-muted">
          <BagIcon className="w-14 h-14" />
          <p className="text-lg">{t("ui.cartEmpty")}</p>
          <Link
            href="/collections/new-in"
            className="px-8 py-3 rounded-full bg-foreground text-background text-sm font-semibold uppercase tracking-wider hover:scale-105 transition-transform"
          >
            {t("ui.newProducts")}
          </Link>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] items-start">
          {/* Items */}
          <div className="divide-y divide-line border-y border-line">
            <AnimatePresence initial={false}>
              {items.map((item) => {
                return (
                  <motion.div
                    key={item.productId + item.size}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: 60 }}
                    className="py-5 flex gap-5"
                  >
                    <Link
                      href={`/products/${item.slug}`}
                      className="group relative w-24 h-24 md:w-28 md:h-28 shrink-0 rounded-xl overflow-hidden border border-line"
                    >
                      <ProductImage name={item.name} image={item.image} />
                    </Link>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link
                            href={`/products/${item.slug}`}
                            className="font-medium hover:underline leading-snug"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-muted mt-1">
                            {t("ui.size")}՝ {item.size} · {formatPrice(item.price)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId, item.size)}
                          className="p-1.5 text-muted hover:text-foreground transition-colors"
                          aria-label={t("ui.remove")}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                      <div className="mt-auto pt-3 flex items-center justify-between">
                        <div className="flex items-center border border-line rounded-full">
                          <button
                            onClick={() => setQty(item.productId, item.size, item.qty - 1)}
                            className="p-2 text-muted hover:text-foreground"
                            aria-label={t("ui.decrease")}
                          >
                            <MinusIcon />
                          </button>
                          <span className="w-9 text-center">{item.qty}</span>
                          <button
                            onClick={() => setQty(item.productId, item.size, item.qty + 1)}
                            className="p-2 text-muted hover:text-foreground"
                            aria-label={t("ui.increase")}
                          >
                            <PlusIcon />
                          </button>
                        </div>
                        <p className="font-semibold">{formatPrice(item.price * item.qty)}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-surface border border-line rounded-2xl p-6 lg:sticky lg:top-24"
          >
            <h2 className="text-sm uppercase tracking-widest text-muted mb-5">{t("cart.summary")}</h2>
            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between">
                <span className="text-muted">{t("cart.items")}</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">{t("cart.delivery")}</span>
                <span className="text-muted">{t("cart.deliveryCalc")}</span>
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-line pt-4 mb-6">
              <span className="uppercase tracking-wider text-sm">{t("ui.total")}</span>
              <span className="text-xl font-bold">{formatPrice(total)}</span>
            </div>
            <Link
              href="/checkout"
              className="block w-full py-3.5 rounded-full bg-foreground text-background text-center text-sm font-semibold uppercase tracking-wider hover:bg-white transition-colors mb-3"
            >
              {t("cart.checkout")}
            </Link>
            <button
              onClick={clear}
              className="w-full py-3 rounded-full border border-line text-sm uppercase tracking-wider text-muted hover:text-foreground hover:border-muted transition-colors"
            >
              {t("cart.clear")}
            </button>
          </motion.aside>
        </div>
      )}
    </main>
  );
}
