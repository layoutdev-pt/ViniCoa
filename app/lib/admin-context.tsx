import React, { createContext, useContext, useState, useEffect } from "react";
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
  addWine: (wineData: Omit<Wine, "id" | "slug">) => Wine;
  updateWine: (id: number, updates: Partial<Wine>) => void;
  deleteWine: (id: number) => void;
  toggleFeatured: (id: number) => void;
  addAdmin: (data: { name: string; email: string; role: AdminUser["role"] }) => void;
  removeAdmin: (id: string) => boolean;
  toggleAdminStatus: (id: string) => void;
  featuredCount: number;
}

const DEFAULT_ADMINS: AdminUser[] = [
  {
    id: "admin-1",
    name: "Miguel Fernandes",
    email: "miguel@vinicoa.pt",
    role: "Super Admin",
    addedAt: "12 Jan 2026",
    status: "Ativo",
    avatarColor: "bg-bordo",
  },
  {
    id: "admin-2",
    name: "Sofia Alvim",
    email: "sofia.alvim@vinicoa.pt",
    role: "Gestor de Garrafeira",
    addedAt: "03 Fev 2026",
    status: "Ativo",
    avatarColor: "bg-[#7A1F2D]",
  },
  {
    id: "admin-3",
    name: "Rui Castelo",
    email: "rui.castelo@vinicoa.pt",
    role: "Editor de Catálogo",
    addedAt: "18 Mar 2026",
    status: "Ativo",
    avatarColor: "bg-[#8A6520]",
  },
];

// Marcar por defeito os primeiros 3 vinhos como em destaque no carrossel da Home
const INITIAL_WINES: Wine[] = WINES_DATABASE.map((w, index) => ({
  ...w,
  featuredHome: index < 3,
}));

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const WINES_STORAGE_KEY = "vinicoa_admin_wines_v1";
const ADMINS_STORAGE_KEY = "vinicoa_admin_users_v1";

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [wines, setWines] = useState<Wine[]>(() => {
    if (typeof window === "undefined") return INITIAL_WINES;
    try {
      const saved = localStorage.getItem(WINES_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_WINES;
  });

  const [admins, setAdmins] = useState<AdminUser[]>(() => {
    if (typeof window === "undefined") return DEFAULT_ADMINS;
    try {
      const saved = localStorage.getItem(ADMINS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEFAULT_ADMINS;
  });

  // Guardar em localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(WINES_STORAGE_KEY, JSON.stringify(wines));
      } catch {
        // quota limit
      }
    }
  }, [wines]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(admins));
      } catch {
        // quota limit
      }
    }
  }, [admins]);

  const addWine = (wineData: Omit<Wine, "id" | "slug">): Wine => {
    const newId = Math.max(0, ...wines.map((w) => w.id)) + 1;
    const slug = wineData.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newWine: Wine = {
      ...wineData,
      id: newId,
      slug,
      featuredHome: wineData.featuredHome ?? false,
    };

    setWines((prev) => [newWine, ...prev]);
    return newWine;
  };

  const updateWine = (id: number, updates: Partial<Wine>) => {
    setWines((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const updated = { ...w, ...updates };
          if (updates.title && updates.title !== w.title) {
            updated.slug = updates.title
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)+/g, "");
          }
          return updated;
        }
        return w;
      })
    );
  };

  const deleteWine = (id: number) => {
    setWines((prev) => prev.filter((w) => w.id !== id));
  };

  const toggleFeatured = (id: number) => {
    setWines((prev) =>
      prev.map((w) => (w.id === id ? { ...w, featuredHome: !w.featuredHome } : w))
    );
  };

  const addAdmin = (data: { name: string; email: string; role: AdminUser["role"] }) => {
    const colors = ["bg-bordo", "bg-[#7A1F2D]", "bg-[#8A6520]", "bg-[#1E3A8A]", "bg-[#065F46]"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const today = new Intl.DateTimeFormat("pt-PT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date());

    const newAdmin: AdminUser = {
      id: `admin-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      addedAt: today,
      status: "Ativo",
      avatarColor: randomColor,
    };

    setAdmins((prev) => [...prev, newAdmin]);
  };

  const removeAdmin = (id: string): boolean => {
    // Proteger para ter sempre pelo menos 1 admin
    if (admins.length <= 1) {
      return false;
    }
    setAdmins((prev) => prev.filter((a) => a.id !== id));
    return true;
  };

  const toggleAdminStatus = (id: string) => {
    setAdmins((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: a.status === "Ativo" ? "Inativo" : "Ativo" } : a
      )
    );
  };

  const featuredCount = wines.filter((w) => w.featuredHome).length;

  return (
    <AdminContext.Provider
      value={{
        wines,
        admins,
        addWine,
        updateWine,
        deleteWine,
        toggleFeatured,
        addAdmin,
        removeAdmin,
        toggleAdminStatus,
        featuredCount,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
