"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/lang";
import { formatPrice } from "@/lib/products";
import { ProductImage } from "@/components/ProductImage";

const REGIONS = [
  "Երևան",
  "Արագածոտն",
  "Արարատ",
  "Արմավիր",
  "Գեղարքունիք",
  "Կոտայք",
  "Լոռի",
  "Շիրակ",
  "Սյունիք",
  "Տավուշ",
  "Վայոց Ձոր",
];

type FormState = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  country: string;
  region: string;
  city: string;
  postalCode: string;
  phone: string;
};

const EMPTY_FORM: FormState = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  country: "Հայաստան",
  region: "",
  city: "",
  postalCode: "",
  phone: "",
};

const REQUIRED: (keyof FormState)[] = [
  "email",
  "firstName",
  "lastName",
  "address",
  "region",
  "city",
  "phone",
];

const inputCls =
  "w-full bg-surface border border-line rounded-lg px-4 py-3 text-sm outline-none focus:border-foreground transition-colors placeholder:text-muted";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm text-foreground/80 mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const { t } = useLang();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    for (const key of REQUIRED) {
      if (!form[key].trim()) {
        next[key] =
          key === "region" ? t("checkout.regionRequired") : t("checkout.required");
      }
    }
    if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      next.email = t("checkout.invalidEmail");
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, customer: form }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? t("checkout.orderFailed"));
      }
      const order = await res.json();
      setOrderNumber(order.number);
      clear();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : t("checkout.error"));
    } finally {
      setSubmitting(false);
    }
  };

  // Success screen
  if (orderNumber) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-foreground text-background flex items-center justify-center text-3xl">
            ✓
          </div>
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-3">
            {t("checkout.thanks")}
          </h1>
          <p className="text-muted mb-2">{t("checkout.success")}</p>
          <p className="text-lg mb-8">
            {t("checkout.orderNumber")} <span className="font-bold">{orderNumber}</span>
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3.5 rounded-full bg-foreground text-background text-sm font-semibold uppercase tracking-wider hover:scale-105 transition-transform"
          >
            {t("checkout.backHome")}
          </Link>
        </motion.div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center gap-5 px-4 py-24 text-muted">
        <p className="text-lg">{t("ui.cartEmpty")}</p>
        <Link
          href="/collections/new-in"
          className="px-8 py-3 rounded-full bg-foreground text-background text-sm font-semibold uppercase tracking-wider hover:scale-105 transition-transform"
        >
          {t("ui.newProducts")}
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full px-4 sm:px-6 lg:px-10 py-10 md:py-14">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-10"
      >
        {t("checkout.title")}
      </motion.h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_400px] items-start max-w-6xl">
        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={submit}
          noValidate
          className="space-y-5"
        >
          <h2 className="text-lg font-semibold uppercase tracking-wider">{t("checkout.shippingAddress")}</h2>

          <Field label={t("checkout.email")} error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              className={inputCls}
              placeholder="you@example.com"
            />
            <p className="mt-1 text-xs text-muted">
              {t("checkout.emailNote")}
            </p>
          </Field>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label={t("checkout.firstName")} error={errors.firstName}>
              <input value={form.firstName} onChange={set("firstName")} className={inputCls} />
            </Field>
            <Field label={t("checkout.lastName")} error={errors.lastName}>
              <input value={form.lastName} onChange={set("lastName")} className={inputCls} />
            </Field>
          </div>

          <Field label={t("checkout.address")} error={errors.address}>
            <input
              value={form.address}
              onChange={set("address")}
              className={inputCls}
              placeholder={t("checkout.addressPlaceholder")}
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label={t("checkout.country")}>
              <select value={form.country} onChange={set("country")} className={inputCls}>
                <option value="Հայաստան">{t("checkout.armenia")}</option>
              </select>
            </Field>
            <Field label={t("checkout.region")} error={errors.region}>
              <select value={form.region} onChange={set("region")} className={inputCls}>
                <option value="">{t("checkout.select")}</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {t(`region.${r}`)}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label={t("checkout.city")} error={errors.city}>
              <input value={form.city} onChange={set("city")} className={inputCls} />
            </Field>
            <Field label={t("checkout.postal")}>
              <input value={form.postalCode} onChange={set("postalCode")} className={inputCls} />
            </Field>
          </div>

          <Field label={t("checkout.phone")} error={errors.phone}>
            <input
              type="tel"
              value={form.phone}
              onChange={set("phone")}
              className={inputCls}
              placeholder="+374 __ ______"
            />
          </Field>

          <div>
            <h2 className="text-lg font-semibold uppercase tracking-wider mb-3 mt-8">
              {t("checkout.deliveryMethod")}
            </h2>
            <label className="flex items-center justify-between gap-4 border border-foreground rounded-lg px-4 py-3.5 bg-surface">
              <span className="flex items-center gap-3">
                <input type="radio" checked readOnly className="accent-white" />
                <span className="text-sm">{t("checkout.freeDelivery")}</span>
              </span>
              <span className="text-sm font-semibold">0 AMD</span>
            </label>
          </div>

          {serverError && (
            <p className="text-sm text-red-400 border border-red-400/40 rounded-lg px-4 py-3">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-full bg-foreground text-background text-sm font-semibold uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-60"
          >
            {submitting ? t("checkout.submitting") : t("checkout.submit")}
          </button>
        </motion.form>

        {/* Order summary */}
        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface border border-line rounded-2xl p-6 lg:sticky lg:top-24"
        >
          <h2 className="text-sm uppercase tracking-widest text-muted mb-5">{t("checkout.yourOrder")}</h2>
          <div className="space-y-4 mb-5">
            {items.map((item) => (
              <div key={item.productId + item.size} className="flex gap-3 items-center">
                <div className="group relative w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-line">
                  <ProductImage name={item.name} image={item.image} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm line-clamp-1">{item.name}</p>
                  <p className="text-xs text-muted">
                    {item.size} × {item.qty}
                  </p>
                </div>
                <p className="text-sm whitespace-nowrap">{formatPrice(item.price * item.qty)}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm border-t border-line pt-4">
            <div className="flex justify-between">
              <span className="text-muted">{t("cart.items")}</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">{t("cart.delivery")}</span>
              <span>0 AMD</span>
            </div>
            <div className="flex justify-between items-center pt-2 text-base">
              <span className="uppercase tracking-wider">{t("ui.total")}</span>
              <span className="text-xl font-bold">{formatPrice(total)}</span>
            </div>
          </div>
        </motion.aside>
      </div>
    </main>
  );
}
