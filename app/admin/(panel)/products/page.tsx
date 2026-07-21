"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { useLang } from "@/lib/lang";
import { CloseIcon, PlusIcon, TrashIcon } from "@/components/Icons";

type CollectionRecord = { id: string; slug: string; title: string; custom: boolean };

const inputCls =
  "w-full bg-background border border-line rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-foreground transition-colors placeholder:text-muted";

const GENDERS = ["Unisex", "Male", "Female"] as const;

type FormState = {
  name: string;
  price: string;
  type: string;
  sizes: string;
  gender: (typeof GENDERS)[number];
  colors: string;
  description: string;
  image: string;
  collections: string[];
};

const EMPTY: FormState = {
  name: "",
  price: "",
  type: "",
  sizes: "XS, S, M, L, XL, XXL",
  gender: "Unisex",
  colors: "Սև",
  description: "",
  image: "",
  collections: [],
};

function toForm(p: Product): FormState {
  return {
    name: p.name,
    price: String(p.price),
    type: p.type,
    sizes: p.sizes.join(", "),
    gender: p.gender,
    colors: p.colors.join(", "),
    description: p.description,
    image: p.image ?? "",
    collections: p.collections,
  };
}

function splitList(s: string): string[] {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function AdminProductsPage() {
  const { t } = useLang();
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<CollectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const load = useCallback(async () => {
    const [p, c] = await Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/collections").then((r) => r.json()),
    ]);
    setProducts(p);
    setCollections(c);
    setLoading(false);
  }, []);

  useEffect(() => {
    // initial load; subsequent reloads go through load()
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  const openNew = () => {
    setForm(EMPTY);
    setError(null);
    setEditing("new");
  };

  const openEdit = (p: Product) => {
    setForm(toForm(p));
    setError(null);
    setEditing(p);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const price = Number(form.price);
    if (!form.name.trim() || !Number.isFinite(price) || price <= 0) {
      setError(t("admin.nameAndPrice"));
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      price,
      type: form.type.trim(),
      sizes: splitList(form.sizes),
      gender: form.gender,
      colors: splitList(form.colors),
      description: form.description.trim(),
      image: form.image.trim() || null,
      collections: form.collections,
    };
    const res =
      editing === "new"
        ? await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch(`/api/products/${(editing as Product).id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? t("admin.saveFailed"));
      return;
    }
    setEditing(null);
    load();
  };

  const remove = async (p: Product) => {
    if (!confirm(t("admin.confirmDeleteProduct", { name: p.name }))) return;
    await fetch(`/api/products/${p.id}`, { method: "DELETE" });
    load();
  };

  const toggleCollection = (slug: string) => {
    setForm((f) => ({
      ...f,
      collections: f.collections.includes(slug)
        ? f.collections.filter((s) => s !== slug)
        : [...f.collections, slug],
    }));
  };

  const shown = products.filter(
    (p) =>
      !filter.trim() ||
      p.name.toLowerCase().includes(filter.trim().toLowerCase()) ||
      p.type.toLowerCase().includes(filter.trim().toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={t("admin.searchProduct")}
          className={`${inputCls} max-w-xs`}
        />
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold uppercase tracking-wider hover:bg-white transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          {t("admin.newProduct")}
        </button>
        <p className="text-sm text-muted ml-auto">{shown.length} {t("ui.products")}</p>
      </div>

      {loading ? (
        <p className="text-muted py-10">{t("admin.loading")}</p>
      ) : (
        <div className="border border-line rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-muted uppercase text-xs tracking-wider">
                <th className="px-4 py-3">{t("admin.name")}</th>
                <th className="px-4 py-3">{t("admin.priceCol")}</th>
                <th className="px-4 py-3">{t("admin.type")}</th>
                <th className="px-4 py-3">{t("ui.gender")}</th>
                <th className="px-4 py-3">{t("admin.collections")}</th>
                <th className="px-4 py-3 text-right">{t("admin.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((p) => (
                <tr key={p.id} className="border-b border-line/50 last:border-b-0 hover:bg-surface/60">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">{p.type}</td>
                  <td className="px-4 py-3">{p.gender}</td>
                  <td className="px-4 py-3 text-muted max-w-60">
                    {p.collections
                      .map((s) => collections.find((c) => c.slug === s)?.title ?? s)
                      .join(", ")}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => openEdit(p)}
                      className="px-3 py-1.5 rounded-full border border-line text-xs uppercase tracking-wider hover:border-muted mr-2"
                    >
                      {t("admin.edit")}
                    </button>
                    <button
                      onClick={() => remove(p)}
                      className="p-1.5 rounded-full text-muted hover:text-foreground"
                      aria-label={t("admin.delete")}
                    >
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
              {shown.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted">
                    {t("admin.noProducts")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit / create modal */}
      <AnimatePresence>
        {editing && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={() => setEditing(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.97 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-surface border border-line rounded-2xl shadow-2xl shadow-black/70 flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-line shrink-0">
                <h2 className="uppercase tracking-widest text-sm">
                  {editing === "new" ? t("admin.newProduct") : t("admin.editProduct")}
                </h2>
                <button onClick={() => setEditing(null)} aria-label={t("nav.close")} className="p-2 text-foreground/70 hover:text-foreground">
                  <CloseIcon />
                </button>
              </div>

              <form onSubmit={save} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-muted mb-1.5">{t("admin.name")} *</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-1.5">{t("admin.price")} *</label>
                    <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-1.5">{t("admin.type")}</label>
                    <input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputCls} placeholder={t("admin.typePlaceholder")} />
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-1.5">{t("admin.sizes")}</label>
                    <input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-1.5">{t("ui.gender")}</label>
                    <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as FormState["gender"] })} className={inputCls}>
                      {GENDERS.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-1.5">{t("admin.colors")}</label>
                    <input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-1.5">{t("admin.imageUrl")}</label>
                    <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={inputCls} placeholder="https://… կամ /media/…" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-muted mb-1.5">{t("admin.description")}</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3}
                      className={`${inputCls} resize-y`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-muted mb-2">{t("admin.collections")}</label>
                  <div className="flex flex-wrap gap-2">
                    {collections.map((c) => {
                      const active = form.collections.includes(c.slug);
                      return (
                        <button
                          type="button"
                          key={c.id}
                          onClick={() => toggleCollection(c.slug)}
                          className={`px-3 py-1.5 rounded-full border text-xs transition-all ${
                            active
                              ? "bg-foreground text-background border-foreground font-semibold"
                              : "border-line text-foreground/70 hover:border-muted"
                          }`}
                        >
                          {c.title}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <div className="flex gap-3 pt-2 pb-1">
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="flex-1 py-3 rounded-full border border-line text-sm uppercase tracking-wider text-foreground/75 hover:border-muted"
                  >
                    {t("admin.cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 rounded-full bg-foreground text-background text-sm font-semibold uppercase tracking-wider hover:bg-white disabled:opacity-60"
                  >
                    {saving ? t("admin.saving") : t("admin.save")}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
