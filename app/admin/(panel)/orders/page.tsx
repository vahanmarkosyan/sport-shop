"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { formatPrice } from "@/lib/products";
import { useLang } from "@/lib/lang";
import { SearchIcon, TrashIcon } from "@/components/Icons";
import type { Order } from "@/lib/repo";

const inputCls =
  "w-full bg-background border border-line rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-foreground transition-colors placeholder:text-muted";

// Status → color accents (row dot + select styling)
const STATUS_STYLES: Record<Order["status"], { dot: string; select: string }> = {
  new: { dot: "bg-sky-400", select: "border-sky-400/60 text-sky-300" },
  processing: { dot: "bg-amber-400", select: "border-amber-400/60 text-amber-300" },
  done: { dot: "bg-emerald-400", select: "border-emerald-400/60 text-emerald-300" },
  cancelled: { dot: "bg-red-400", select: "border-red-400/60 text-red-300" },
};

const STATUSES: Order["status"][] = ["new", "processing", "done", "cancelled"];

function formatDate(iso: string, locale: string): string {
  const map: Record<string, string> = { hy: "hy-AM", en: "en-GB", ru: "ru-RU" };
  return new Date(iso).toLocaleString(map[locale] ?? "hy-AM", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminOrdersPage() {
  const { t, locale } = useLang();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async (q: string) => {
    const url = q.trim() ? `/api/orders?q=${encodeURIComponent(q.trim())}` : "/api/orders";
    const data = await fetch(url).then((r) => r.json());
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  // debounced search (also does the initial load)
  useEffect(() => {
    const timer = setTimeout(() => load(query), 250);
    return () => clearTimeout(timer);
  }, [query, load]);

  const setStatus = async (order: Order, status: Order["status"]) => {
    await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
  };

  const removeOrder = async (order: Order) => {
    if (!confirm(t("admin.confirmRemoveOrder", { number: order.number }))) return;
    const res = await fetch(`/api/orders/${order.id}`, { method: "DELETE" });
    if (res.ok) {
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative max-w-md flex-1 min-w-64">
          <SearchIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("admin.ordersSearch")}
            className={`${inputCls} pl-10`}
          />
        </div>
        <p className="text-sm text-muted ml-auto">
          {orders.length} {t("admin.orderCount")}
        </p>
      </div>

      {loading ? (
        <p className="text-muted py-10">{t("admin.loading")}</p>
      ) : orders.length === 0 ? (
        <p className="text-muted py-16 text-center border border-line rounded-xl">
          {t("admin.noOrders")}
        </p>
      ) : (
        <div className="border border-line rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-muted uppercase text-xs tracking-wider">
                <th className="px-4 py-3">{t("admin.order")}</th>
                <th className="px-4 py-3">{t("admin.date")}</th>
                <th className="px-4 py-3">{t("admin.customer")}</th>
                <th className="px-4 py-3">{t("admin.contact")}</th>
                <th className="px-4 py-3">{t("admin.amount")}</th>
                <th className="px-4 py-3">{t("admin.status")}</th>
                <th className="px-4 py-3 text-right">{t("admin.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const style = STATUS_STYLES[o.status];
                return (
                  <Fragment key={o.id}>
                    <tr
                      onClick={() => setOpenId(openId === o.id ? null : o.id)}
                      className="border-b border-line/50 last:border-b-0 hover:bg-surface/60 cursor-pointer"
                    >
                      <td className="px-4 py-3 font-semibold whitespace-nowrap">
                        <span className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                          {o.number}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-muted">
                        {formatDate(o.createdAt, locale)}
                      </td>
                      <td className="px-4 py-3">
                        {o.customer.firstName} {o.customer.lastName}
                        <span className="block text-xs text-muted">
                          {o.customer.city}, {t(`region.${o.customer.region}`)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {o.customer.phone}
                        <span className="block text-xs">{o.customer.email}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-semibold">
                        {formatPrice(o.total)}
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={o.status}
                          onChange={(e) => setStatus(o, e.target.value as Order["status"])}
                          className={`bg-background border rounded-full px-3 py-1.5 text-xs font-semibold outline-none transition-colors ${style.select}`}
                        >
                          {STATUSES.map((value) => (
                            <option key={value} value={value} className="text-foreground">
                              {t(`status.${value}`)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => removeOrder(o)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-400/40 text-xs uppercase tracking-wider text-red-300 hover:bg-red-400/10 hover:border-red-400 transition-colors"
                          title={t("admin.removeOrder")}
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                          {t("admin.delete")}
                        </button>
                      </td>
                    </tr>
                    <AnimatePresence>
                      {openId === o.id && (
                        <tr className="border-b border-line/50">
                          <td colSpan={7} className="px-4 py-0">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="py-4 grid gap-6 md:grid-cols-2">
                                <div>
                                  <h3 className="text-xs uppercase tracking-widest text-muted mb-2">
                                    {t("admin.itemsHeader")}
                                  </h3>
                                  <div className="space-y-1.5">
                                    {o.items.map((it, i) => (
                                      <div key={i} className="flex justify-between gap-4">
                                        <span>
                                          {it.name}
                                          <span className="text-muted">
                                            {" "}
                                            · {it.size} × {it.qty}
                                          </span>
                                        </span>
                                        <span className="whitespace-nowrap">
                                          {formatPrice(it.price * it.qty)}
                                        </span>
                                      </div>
                                    ))}
                                    <div className="flex justify-between gap-4 border-t border-line pt-1.5 font-semibold">
                                      <span>
                                        {t("ui.total")} ({t("checkout.freeDelivery")})
                                      </span>
                                      <span>{formatPrice(o.total)}</span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="text-xs uppercase tracking-widest text-muted mb-2">
                                    {t("admin.shippingAddr")}
                                  </h3>
                                  <p className="leading-relaxed text-foreground/85">
                                    {o.customer.firstName} {o.customer.lastName}
                                    <br />
                                    {o.customer.address}
                                    <br />
                                    {o.customer.city}, {t(`region.${o.customer.region}`)}
                                    {o.customer.postalCode ? `, ${o.customer.postalCode}` : ""}
                                    <br />
                                    {o.customer.country}
                                    <br />
                                    {o.customer.phone} · {o.customer.email}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
