"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLang } from "@/lib/lang";
import { LanguageSelector } from "@/components/LanguageSelector";

export default function AdminLoginPage() {
  const router = useRouter();
  const { t } = useLang();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setSubmitting(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setSubmitting(false);
    if (!res.ok) {
      setError(true);
      return;
    }
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        <div className="flex justify-end mb-6">
          <LanguageSelector />
        </div>
        <div className="bg-surface border border-line rounded-2xl p-8 shadow-2xl shadow-black/50">
          <Image
            src="/media/logo.jpg"
            alt="DN8"
            width={64}
            height={64}
            className="invert rounded-full mx-auto mb-5"
          />
          <h1 className="text-xl font-bold uppercase tracking-tight text-center mb-8">
            {t("admin.loginTitle")}
          </h1>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm text-muted mb-1.5">{t("admin.password")}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                autoFocus
                className="w-full bg-background border border-line rounded-lg px-4 py-3 text-sm outline-none focus:border-foreground transition-colors"
              />
              {error && <p className="mt-1.5 text-xs text-red-400">{t("admin.wrongPassword")}</p>}
            </div>
            <button
              type="submit"
              disabled={submitting || !password}
              className="w-full py-3.5 rounded-full bg-foreground text-background text-sm font-semibold uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50"
            >
              {t("admin.login")}
            </button>
          </form>
        </div>
      </motion.div>
    </main>
  );
}
