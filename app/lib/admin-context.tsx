import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import type { Wine } from "../types/wine";
import { WINES_DATABASE } from "./wines";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Gestor de Garrafeira" | "Editor de Catálogo";
  addedAt: string;
  status: "Ativo" | "Inativo";
  avatarColor?: string;
}

export interface AdminContextType {
  wines: Wine[];
  admins: AdminUser[];
  catalogStatus: "ready" | "loading" | "error";
  addWine: (wineData: Omit<Wine, "id" | "slug">, images?: { primary?: File; secondary?: File }) => Promise<void>;
  updateWine: (id: Wine["id"], updates: Partial<Wine>, images?: { primary?: File; secondary?: File }) => Promise<void>;
  deleteWine: (id: Wine["id"]) => Promise<void>;
  toggleFeatured: (id: Wine["id"]) => Promise<void>;
  addAdmin: (data: { name: string; email: string; role: AdminUser["role"] }) => void;
  removeAdmin: (id: string) => boolean;
  toggleAdminStatus: (id: string) => void;
  featuredCount: number;
}

const DEFAULT_ADMINS: AdminUser[] = [
  { id: "admin-1", name: "Miguel Fernandes", email: "miguel@vinicoa.pt", role: "Super Admin", addedAt: "12 Jan 2026", status: "Ativo", avatarColor: "bg-bordo" },
  { id: "admin-2", name: "Sofia Alvim", email: "sofia.alvim@vinicoa.pt", role: "Gestor de Garrafeira", addedAt: "03 Fev 2026", status: "Ativo", avatarColor: "bg-[#7A1F2D]" },
  { id: "admin-3", name: "Rui Castelo", email: "rui.castelo@vinicoa.pt", role: "Editor de Catálogo", addedAt: "18 Mar 2026", status: "Ativo", avatarColor: "bg-[#8A6520]" },
];

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  category: string | null;
  color: string | null;
  range: string | null;
  year: string | null;
  volume: string | null;
  price: number | string;
  badge: string | null;
  image_url: string | null;
  secondary_image_url: string | null;
  grapes: string | null;
  description: string | null;
  characteristics: { corpo?: number; taninos?: number; acidez?: number } | null;
  pairing: string | null;
  awards: string[] | null;
  stock: number;
  featured_home: boolean;
  vendus_payment_url: string | null;
};

function fromDatabase(row: ProductRow): Wine {
  return {
    id: row.id,
    slug: row.slug,
    title: row.name,
    category: row.category || "Vinhos",
    color: row.color || "Tinto",
    range: row.range || "Colheita",
    year: row.year || "",
    volume: row.volume || "",
    price: Number(row.price),
    badge: row.badge || undefined,
    image: row.image_url || "",
    secondaryImage: row.secondary_image_url || "",
    grapes: row.grapes || "",
    desc: row.description || "",
    corpo: row.characteristics?.corpo ?? 0,
    taninos: row.characteristics?.taninos ?? 0,
    acidez: row.characteristics?.acidez ?? 0,
    pairing: row.pairing || "",
    awards: row.awards || [],
    stock: row.stock,
    featuredHome: row.featured_home,
    paymentUrl: row.vendus_payment_url || "",
  };
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);
const ADMINS_STORAGE_KEY = "vinicoa_admin_users_v1";

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isProtectedAdminPage =
    location.pathname === "/admin" ||
    (location.pathname.startsWith("/admin/") &&
      !location.pathname.startsWith("/admin/login") &&
      !location.pathname.startsWith("/admin/logout") &&
      !location.pathname.startsWith("/admin/api/"));

  const [wines, setWines] = useState<Wine[]>(WINES_DATABASE);
  const [catalogStatus, setCatalogStatus] = useState<"ready" | "loading" | "error">(
    isProtectedAdminPage ? "loading" : "ready"
  );
  const [admins, setAdmins] = useState<AdminUser[]>(DEFAULT_ADMINS);
  const [adminsHydrated, setAdminsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ADMINS_STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) setAdmins(parsed as AdminUser[]);
      }
    } catch {
      // Ignore malformed or inaccessible local storage.
    }
    setAdminsHydrated(true);
  }, []);

  const refreshProducts = async () => {
    const response = await fetch("/admin/api/products", { headers: { Accept: "application/json" } });
    const payload = await response.json();
    if (!response.ok || !Array.isArray(payload)) {
      throw new Error(payload?.error || "Não foi possível carregar o catálogo.");
    }
    setWines(payload.map((row: ProductRow) => fromDatabase(row)));
    setCatalogStatus("ready");
  };

  useEffect(() => {
    const isPublicStorePage = !location.pathname.startsWith("/admin") && !location.pathname.startsWith("/api/");
    if (!isProtectedAdminPage && !isPublicStorePage) {
      setWines(WINES_DATABASE);
      setCatalogStatus("ready");
      return;
    }

    let cancelled = false;
    setCatalogStatus("loading");
    const catalogUrl = isProtectedAdminPage ? "/admin/api/products" : "/api/catalog";
    fetch(catalogUrl, { headers: { Accept: "application/json" } })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok || !Array.isArray(payload)) {
          throw new Error(payload?.error || "Não foi possível carregar o catálogo.");
        }
        if (!cancelled) {
          setWines(payload.map((row: ProductRow) => fromDatabase(row)));
          setCatalogStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) {
          if (isProtectedAdminPage) setCatalogStatus("error");
          else {
            setWines(WINES_DATABASE);
            setCatalogStatus("ready");
          }
        }
      });

    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  useEffect(() => {
    if (!adminsHydrated) return;
    try {
      localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(admins));
    } catch {
      // Ignore storage failures (for example, private browsing mode).
    }
  }, [admins, adminsHydrated]);

  const mutateCatalog = async (body: Record<string, unknown>, images?: { primary?: File; secondary?: File }) => {
    const formData = new FormData();
    formData.set("payload", JSON.stringify(body));
    if (images?.primary) formData.set("primaryImage", images.primary);
    if (images?.secondary) formData.set("secondaryImage", images.secondary);
    const response = await fetch("/admin/api/products", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    });
    const payload = await response.json();
    if (!response.ok || !payload?.ok) {
      throw new Error(payload?.error || "Não foi possível guardar as alterações.");
    }
    await refreshProducts();
  };

  const addWine = async (wineData: Omit<Wine, "id" | "slug">, images?: { primary?: File; secondary?: File }) => {
    await mutateCatalog({ intent: "save", product: wineData }, images);
  };

  const updateWine = async (id: Wine["id"], updates: Partial<Wine>, images?: { primary?: File; secondary?: File }) => {
    const current = wines.find((wine) => wine.id === id);
    if (!current) throw new Error("Produto não encontrado no catálogo.");
    await mutateCatalog({ intent: "save", product: { ...current, ...updates, id } }, images);
  };

  const deleteWine = async (id: Wine["id"]) => {
    await mutateCatalog({ intent: "delete", id: String(id) });
  };

  const toggleFeatured = async (id: Wine["id"]) => {
    const current = wines.find((wine) => wine.id === id);
    if (!current) throw new Error("Produto não encontrado no catálogo.");
    await mutateCatalog({ intent: "save", product: { ...current, featuredHome: !current.featuredHome } });
  };

  const addAdmin = (userData: { name: string; email: string; role: AdminUser["role"] }) => {
    const newAdmin: AdminUser = {
      id: `admin-${Date.now()}`,
      ...userData,
      addedAt: new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "short", year: "numeric" }).format(new Date()),
      status: "Ativo",
    };
    setAdmins((current) => [...current, newAdmin]);
  };

  const removeAdmin = (id: string) => {
    if (admins.length <= 1) return false;
    setAdmins((current) => current.filter((admin) => admin.id !== id));
    return true;
  };

  const toggleAdminStatus = (id: string) => {
    setAdmins((current) => current.map((admin) =>
      admin.id === id ? { ...admin, status: admin.status === "Ativo" ? "Inativo" : "Ativo" } : admin
    ));
  };

  return (
    <AdminContext.Provider
      value={{
        wines,
        admins,
        catalogStatus,
        addWine,
        updateWine,
        deleteWine,
        toggleFeatured,
        addAdmin,
        removeAdmin,
        toggleAdminStatus,
        featuredCount: wines.filter((wine) => wine.featuredHome).length,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within an AdminProvider");
  return context;
}
