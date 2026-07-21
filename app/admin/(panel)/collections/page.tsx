"use client";

import { useCallback, useEffect, useState } from "react";
import { PlusIcon, TrashIcon } from "@/components/Icons";
import { useLang } from "@/lib/lang";

type CollectionRecord = { id: string; slug: string; title: string; custom: boolean };

const inputCls =
  "w-full bg-background border border-line rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-foreground transition-colors placeholder:text-muted";

export default function AdminCollectionsPage() {
  const { t } = useLang();
  const [collections, setCollections] = useState<CollectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const load = useCallback(async () => {
    const data = await fetch("/api/collections").then((r) => r.json());
    setCollections(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    // initial load; subsequent reloads go through load()
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newTitle.trim()) {
      setError(t("admin.titleRequired"));
      return;
    }
    const res = await fetch("/api/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle.trim(), slug: newSlug.trim() || undefined }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? t("admin.createFailed"));
      return;
    }
    setNewTitle("");
    setNewSlug("");
    load();
  };

  const saveEdit = async (c: CollectionRecord) => {
    if (editTitle.trim() && editTitle.trim() !== c.title) {
      await fetch(`/api/collections/${c.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle.trim() }),
      });
    }
    setEditingId(null);
    load();
  };

  const remove = async (c: CollectionRecord) => {
    if (!confirm(t("admin.confirmDeleteCollection", { title: c.title }))) return;
    await fetch(`/api/collections/${c.id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="max-w-3xl">
      <form onSubmit={create} className="flex flex-wrap gap-3 mb-8 items-end">
        <div className="flex-1 min-w-48">
          <label className="block text-sm text-muted mb-1.5">{t("admin.name")}</label>
          <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className={inputCls} placeholder="Օր.՝ Arman Edition" />
        </div>
        <div className="flex-1 min-w-48">
          <label className="block text-sm text-muted mb-1.5">{t("admin.slugOptional")}</label>
          <input value={newSlug} onChange={(e) => setNewSlug(e.target.value)} className={inputCls} placeholder="arman-edition" />
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold uppercase tracking-wider hover:bg-white transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          {t("admin.add")}
        </button>
      </form>
      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      {loading ? (
        <p className="text-muted py-10">{t("admin.loading")}</p>
      ) : (
        <div className="border border-line rounded-xl divide-y divide-line/60">
          {collections.map((c) => (
            <div key={c.id} className="flex items-center gap-4 px-4 py-3">
              {editingId === c.id ? (
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className={`${inputCls} max-w-xs`}
                  autoFocus
                />
              ) : (
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{c.title}</p>
                  <p className="text-xs text-muted">/collections/{c.slug}</p>
                </div>
              )}
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider ${
                  c.custom ? "bg-foreground text-background" : "border border-line text-muted"
                }`}
              >
                {c.custom ? t("admin.custom") : t("admin.base")}
              </span>
              {editingId === c.id ? (
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1.5 rounded-full border border-line text-xs uppercase tracking-wider hover:border-muted"
                  >
                    {t("admin.cancel")}
                  </button>
                  <button
                    onClick={() => saveEdit(c)}
                    className="px-3 py-1.5 rounded-full bg-foreground text-background text-xs font-semibold uppercase tracking-wider"
                  >
                    {t("admin.save")}
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={() => {
                      setEditingId(c.id);
                      setEditTitle(c.title);
                    }}
                    className="px-3 py-1.5 rounded-full border border-line text-xs uppercase tracking-wider hover:border-muted"
                  >
                    {t("admin.edit")}
                  </button>
                  <button
                    onClick={() => remove(c)}
                    className="p-1.5 rounded-full text-muted hover:text-foreground"
                    aria-label={t("admin.delete")}
                  >
                    <TrashIcon />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-muted mt-4">
        {t("admin.collectionsNote")}
      </p>
    </div>
  );
}
