import { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from "react";
import type { CartItem } from "../types/wine";
import { WINES_DATABASE } from "./wines";

interface CartContextType {
  cart: CartItem[];
  addToCart: (wineId: number, qty?: number) => void;
  updateCartItemQty: (wineId: number, delta: number) => void;
  removeFromCart: (wineId: number) => void;
  clearCart: () => void;
  
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;

  quickViewWineId: number | null;
  openQuickView: (wineId: number) => void;
  closeQuickView: () => void;

  isAgeVerified: boolean;
  verifyAge: () => void;

  theme: "dark" | "light";
  toggleTheme: () => void;

  toast: { message: string; withCartAction?: boolean } | null;
  showToast: (message: string, withCartAction?: boolean) => void;
  hideToast: () => void;

  subtotal: number;
  shippingCost: number;
  total: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | null>(null);

const STANDARD_SHIPPING = 5.9;

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewWineId, setQuickViewWineId] = useState<number | null>(null);
  const [isAgeVerified, setIsAgeVerified] = useState(true); // default true for SSR, checked in useEffect
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [toast, setToast] = useState<{ message: string; withCartAction?: boolean } | null>(null);

  // Initialize from localStorage on client
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("vinicoa_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }

      const verifiedAt = localStorage.getItem("vinicoa_age_verified_at");
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      if (!verifiedAt || Date.now() - parseInt(verifiedAt, 10) > thirtyDays) {
        setIsAgeVerified(false);
      } else {
        setIsAgeVerified(true);
      }

      const savedTheme = localStorage.getItem("vinicoa_theme");
      if (savedTheme === "light") {
        setTheme("light");
        document.documentElement.classList.add("light");
      } else {
        setTheme("dark");
        document.documentElement.classList.remove("light");
      }
    } catch {
      // Ignored in SSR or private browsing
    }
  }, []);

  const saveCartToStorage = (updatedCart: CartItem[]) => {
    try {
      localStorage.setItem("vinicoa_cart", JSON.stringify(updatedCart));
    } catch {}
  };

  const showToast = (message: string, withCartAction = false) => {
    setToast({ message, withCartAction });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 4500);
  };

  const hideToast = () => setToast(null);

  const addToCart = (wineId: number, qtyToAdd = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === wineId);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((item) =>
          item.id === wineId ? { ...item, qty: item.qty + qtyToAdd } : item
        );
      } else {
        updated = [...prev, { id: wineId, qty: qtyToAdd }];
      }
      saveCartToStorage(updated);
      return updated;
    });

    const wine = WINES_DATABASE.find((w) => w.id === wineId);
    showToast(`${wine ? wine.title : "Vinho"} adicionado ao cesto!`, true);
  };

  const updateCartItemQty = (wineId: number, delta: number) => {
    setCart((prev) => {
      const updated = prev
        .map((item) => (item.id === wineId ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0);
      saveCartToStorage(updated);
      return updated;
    });
  };

  const removeFromCart = (wineId: number) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.id !== wineId);
      saveCartToStorage(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    saveCartToStorage([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  const openQuickView = (wineId: number) => setQuickViewWineId(wineId);
  const closeQuickView = () => setQuickViewWineId(null);

  const verifyAge = () => {
    setIsAgeVerified(true);
    try {
      localStorage.setItem("vinicoa_age_verified_at", Date.now().toString());
    } catch {}
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("vinicoa_theme", next);
        if (next === "light") {
          document.documentElement.classList.add("light");
        } else {
          document.documentElement.classList.remove("light");
        }
      } catch {}
      return next;
    });
  };

  const totalItems = useMemo(() => cart.reduce((acc, curr) => acc + curr.qty, 0), [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, curr) => {
      const wine = WINES_DATABASE.find((w) => w.id === curr.id);
      return acc + (wine ? wine.price * curr.qty : 0);
    }, 0);
  }, [cart]);

  const shippingCost = useMemo(() => {
    if (cart.length === 0) return 0;
    return STANDARD_SHIPPING;
  }, [cart.length]);

  const total = useMemo(() => subtotal + shippingCost, [subtotal, shippingCost]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateCartItemQty,
        removeFromCart,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        isSearchOpen,
        openSearch,
        closeSearch,
        quickViewWineId,
        openQuickView,
        closeQuickView,
        isAgeVerified,
        verifyAge,
        theme,
        toggleTheme,
        toast,
        showToast,
        hideToast,
        subtotal,
        shippingCost,
        total,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
