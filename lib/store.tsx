"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { activePrice, getProduct, type Product } from "./products";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface CartLine {
  productId: string;
  size: string;
  color: string;
  qty: number;
}

export interface OrderAddress {
  name: string;
  email: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
}

export interface Order {
  id: string;
  placedAt: string;
  lines: CartLine[];
  subtotal: number;
  shipping: number;
  total: number;
  address: OrderAddress;
  status: "Confirmed" | "Packing" | "Shipped";
}

type Theme = "light" | "dark";

/* ------------------------------------------------------------------ */
/* localStorage helpers — every access guarded, per browser quirks     */
/* ------------------------------------------------------------------ */

const KEYS = {
  cart: "truefit3d_cart",
  wishlist: "truefit3d_wishlist",
  orders: "truefit3d_orders",
  theme: "truefit3d_theme",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode, blocked storage — the app still works, just unremembered */
  }
}

export const FREE_SHIPPING_THRESHOLD = 150;
export const SHIPPING_FLAT = 12;

function lineKey(l: Pick<CartLine, "productId" | "size" | "color">) {
  return `${l.productId}::${l.size}::${l.color}`;
}

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

interface StoreValue {
  hydrated: boolean;

  cart: CartLine[];
  cartCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  addToCart: (line: CartLine) => void;
  setQty: (line: CartLine, qty: number) => void;
  removeLine: (line: CartLine) => void;
  clearCart: () => void;

  wishlist: string[];
  isWished: (id: string) => boolean;
  toggleWish: (id: string) => void;

  orders: Order[];
  placeOrder: (address: OrderAddress) => Order;
  findOrder: (id: string, email: string) => Order | undefined;

  theme: Theme;
  toggleTheme: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [theme, setTheme] = useState<Theme>("dark");

  // Load persisted state after mount so server and client markup match.
  useEffect(() => {
    setCart(read<CartLine[]>(KEYS.cart, []));
    setWishlist(read<string[]>(KEYS.wishlist, []));
    setOrders(read<Order[]>(KEYS.orders, []));

    // Theme is stored as a bare string (not JSON) so the inline script in
    // app/layout.tsx can read the same value before first paint.
    let stored: Theme | null = null;
    try {
      const raw = window.localStorage.getItem(KEYS.theme);
      stored = raw === "dark" || raw === "light" ? raw : null;
    } catch {
      stored = null;
    }
    const initial =
      stored ??
      (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    setTheme(initial);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      window.localStorage.setItem(KEYS.theme, theme);
    } catch {
      /* storage blocked — theme still applies for this session */
    }
  }, [theme, hydrated]);

  useEffect(() => {
    if (hydrated) write(KEYS.cart, cart);
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) write(KEYS.wishlist, wishlist);
  }, [wishlist, hydrated]);

  useEffect(() => {
    if (hydrated) write(KEYS.orders, orders);
  }, [orders, hydrated]);

  const addToCart = useCallback((line: CartLine) => {
    setCart((prev) => {
      const i = prev.findIndex((l) => lineKey(l) === lineKey(line));
      if (i === -1) return [...prev, line];
      const next = [...prev];
      next[i] = { ...next[i], qty: next[i].qty + line.qty };
      return next;
    });
  }, []);

  const setQty = useCallback((line: CartLine, qty: number) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((l) => lineKey(l) !== lineKey(line))
        : prev.map((l) => (lineKey(l) === lineKey(line) ? { ...l, qty } : l))
    );
  }, []);

  const removeLine = useCallback((line: CartLine) => {
    setCart((prev) => prev.filter((l) => lineKey(l) !== lineKey(line)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWish = useCallback((id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const isWished = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  const { cartCount, subtotal, shipping, total } = useMemo(() => {
    const count = cart.reduce((n, l) => n + l.qty, 0);
    const sub = cart.reduce((sum, l) => {
      const p = getProduct(l.productId);
      return p ? sum + activePrice(p) * l.qty : sum;
    }, 0);
    const ship = sub === 0 || sub >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
    return { cartCount: count, subtotal: sub, shipping: ship, total: sub + ship };
  }, [cart]);

  const placeOrder = useCallback(
    (address: OrderAddress): Order => {
      const id = `TF${Date.now().toString(36).toUpperCase().slice(-6)}`;
      const order: Order = {
        id,
        placedAt: new Date().toISOString(),
        lines: cart,
        subtotal,
        shipping,
        total,
        address,
        status: "Confirmed",
      };
      setOrders((prev) => [order, ...prev]);
      setCart([]);
      return order;
    },
    [cart, subtotal, shipping, total]
  );

  const findOrder = useCallback(
    (id: string, email: string) =>
      orders.find(
        (o) =>
          o.id.toLowerCase() === id.trim().toLowerCase() &&
          o.address.email.toLowerCase() === email.trim().toLowerCase()
      ),
    [orders]
  );

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const value: StoreValue = {
    hydrated,
    cart,
    cartCount,
    subtotal,
    shipping,
    total,
    addToCart,
    setQty,
    removeLine,
    clearCart,
    wishlist,
    isWished,
    toggleWish,
    orders,
    placeOrder,
    findOrder,
    theme,
    toggleTheme,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

export function cartLineProduct(line: CartLine): Product | undefined {
  return getProduct(line.productId);
}
