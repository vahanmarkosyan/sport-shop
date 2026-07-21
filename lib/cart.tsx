"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  size: string;
  qty: number;
  image?: string | null;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (productId: string, size: string) => void;
  setQty: (productId: string, size: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "dn8-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // One-time hydration from localStorage: must happen after mount so the
    // server-rendered markup (empty cart) matches the first client render.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (it) => it.productId === item.productId && it.size === item.size
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { ...item, qty }];
    });
    setDrawerOpen(true);
  }, []);

  const removeItem = useCallback((productId: string, size: string) => {
    setItems((prev) =>
      prev.filter((it) => !(it.productId === productId && it.size === size))
    );
  }, []);

  const setQty = useCallback((productId: string, size: string, qty: number) => {
    if (qty <= 0) {
      removeItem(productId, size);
      return;
    }
    setItems((prev) =>
      prev.map((it) =>
        it.productId === productId && it.size === size ? { ...it, qty } : it
      )
    );
  }, [removeItem]);

  const clear = useCallback(() => setItems([]), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((n, it) => n + it.qty, 0);
    const total = items.reduce((n, it) => n + it.qty * it.price, 0);
    return {
      items,
      count,
      total,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      addItem,
      removeItem,
      setQty,
      clear,
    };
  }, [items, isDrawerOpen, openDrawer, closeDrawer, addItem, removeItem, setQty, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
