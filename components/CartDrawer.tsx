"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/lang";
import { formatPrice } from "@/lib/products";
import { BagIcon, CloseIcon, MinusIcon, PlusIcon, TrashIcon } from "@/components/Icons";
import { ProductImage } from "@/components/ProductImage";

export function CartDrawer() {
  const { items, total, isDrawerOpen, closeDrawer, setQty, removeItem } = useCart();
  const { t } = useLang();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={closeDrawer}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-105 bg-surface border-l border-line flex flex-col"
          >
            <div className="flex items-center justify-between px-6 h-16 border-b border-line shrink-0">
              <h2 className="uppercase tracking-widest text-sm">{t("ui.cart")}</h2>
              <button
                onClick={closeDrawer}
                className="p-2 text-foreground/70 hover:text-foreground transition-colors"
                aria-label={t("ui.closeCart")}
              >
                <CloseIcon />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted">
                <BagIcon className="w-12 h-12" />
                <p>{t("ui.cartEmpty")}</p>
                <button
                  onClick={closeDrawer}
                  className="mt-2 px-6 py-2.5 border border-line rounded-full text-sm text-foreground hover:bg-foreground hover:text-background transition-colors"
                >
                  {t("ui.continueShopping")}
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
                  <AnimatePresence initial={false}>
                    {items.map((item) => {
                      return (
                        <motion.div
                          key={item.productId + item.size}
                          layout
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 40 }}
                          className="flex gap-4"
                        >
                          <Link
                            href={`/products/${item.slug}`}
                            onClick={closeDrawer}
                            className="group relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-line"
                          >
                            <ProductImage name={item.name} image={item.image} />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <Link
                                href={`/products/${item.slug}`}
                                onClick={closeDrawer}
                                className="text-sm leading-snug hover:underline line-clamp-2"
                              >
                                {item.name}
                              </Link>
                              <button
                                onClick={() => removeItem(item.productId, item.size)}
                                className="p-1 text-muted hover:text-foreground transition-colors shrink-0"
                                aria-label={t("ui.remove")}
                              >
                                <TrashIcon />
                              </button>
                            </div>
                            <p className="text-xs text-muted mt-0.5">{t("ui.size")}՝ {item.size}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center border border-line rounded-full">
                                <button
                                  onClick={() => setQty(item.productId, item.size, item.qty - 1)}
                                  className="p-1.5 text-muted hover:text-foreground"
                                  aria-label={t("ui.decrease")}
                                >
                                  <MinusIcon className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-7 text-center text-sm">{item.qty}</span>
                                <button
                                  onClick={() => setQty(item.productId, item.size, item.qty + 1)}
                                  className="p-1.5 text-muted hover:text-foreground"
                                  aria-label={t("ui.increase")}
                                >
                                  <PlusIcon className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <p className="text-sm">{formatPrice(item.price * item.qty)}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                <div className="border-t border-line px-6 py-5 space-y-4 shrink-0">
                  <div className="flex items-center justify-between">
                    <span className="text-muted text-sm uppercase tracking-wider">{t("ui.total")}</span>
                    <span className="text-lg font-semibold">{formatPrice(total)}</span>
                  </div>
                  <Link
                    href="/cart"
                    onClick={closeDrawer}
                    className="block w-full py-3.5 rounded-full bg-foreground text-background text-center text-sm font-semibold uppercase tracking-wider hover:bg-white transition-colors"
                  >
                    {t("ui.viewCart")}
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
