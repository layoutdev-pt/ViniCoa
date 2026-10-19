import React, { useState } from "react";
import { Form, Link, NavLink, useLocation } from "react-router";
import {
  LayoutDashboard,
  Wine,
  Users,
  ExternalLink,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import logoOriginal from "../../assets/logos/logo_original.svg";
import { useAdmin } from "../../lib/admin-context";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function AdminLayout({ children, title, subtitle, action }: AdminLayoutProps) {
  const { wines, admins, catalogStatus } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    {
      to: "/admin",
      label: "Geral",
      icon: LayoutDashboard,
      end: true,
      badge: null,
    },
    {
      to: "/admin/produtos",
      label: "Produtos",
      icon: Wine,
      end: false,
      badge: wines.length,
    },
    {
      to: "/admin/admins",
      label: "Admins",
      icon: Users,
      end: false,
      badge: admins.length,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0C0B0C] text-[#E8DCC6] flex">
      {/* SIDEBAR DESKTOP — ULTRA MINIMALISTA */}
      <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-white/[0.07] bg-[#100F10] shrink-0 sticky top-0 h-screen">
        <div className="p-6">
          {/* Logo & Marca */}
          <Link to="/admin" className="flex items-center gap-3 group pb-6 border-b border-white/[0.06]">
            <img
              src={logoOriginal}
              alt="Vinicôa Sabugal"
              className="h-10 w-auto object-contain opacity-90 group-hover:opacity-100 transition"
            />
            <div>
              <span className="font-brand text-sm uppercase tracking-[0.12em] text-white block">
                Vinicôa
              </span>
              <span className="font-downey text-[10px] uppercase tracking-[0.25em] text-[#C49A4A]">
                Painel Admin
              </span>
            </div>
          </Link>

          {/* Navegação Principal */}
          <nav className="mt-8 space-y-1.5">
            <span className="px-4 text-[11px] uppercase font-downey tracking-[0.25em] text-white/40 block mb-3">
              Menu
            </span>
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = item.end
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-[15px] font-sans font-medium transition-all ${
                    isActive
                      ? "bg-white/[0.09] text-white shadow-sm"
                      : "text-white/60 hover:text-white hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className={`w-5 h-5 ${isActive ? "text-[#C49A4A]" : "text-white/40"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-md tabular-nums font-medium ${
                        isActive
                          ? "bg-[#C49A4A]/20 text-[#C49A4A]"
                          : "text-white/40"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Rodapé do Sidebar: Perfil & Ver Loja */}
        <div className="p-5 border-t border-white/[0.06] space-y-3">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full py-2.5 px-3 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.03] text-sm font-sans transition"
          >
            <span>Ver loja pública</span>
            <ExternalLink className="w-4 h-4 opacity-60" />
          </Link>

          <div className="flex items-center gap-3 pt-2 border-t border-white/[0.04]">
            <div className="min-w-0">
              <span className="block text-sm text-white truncate font-sans font-medium">
                Conta autenticada
              </span>
              <span className="text-xs text-white/40 block font-sans truncate">
                Administrador
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER SUPERIOR */}
        <header className="sticky top-0 z-30 bg-[#0C0B0C]/90 backdrop-blur-md border-b border-white/[0.06] px-6 lg:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Hambúrguer Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 -ml-1 text-white/70 hover:text-white transition"
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="font-brand uppercase text-xl lg:text-2xl text-white tracking-[0.04em]">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-white/50 font-sans mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {action && <div>{action}</div>}
            <Form method="post" action="/admin/logout">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-white/60 hover:border-white/20 hover:text-white transition"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sair
              </button>
            </Form>
          </div>
        </header>

        {/* CONTEÚDO */}
        <main className="flex-1 p-6 lg:p-10 max-w-6xl w-full mx-auto">
          {catalogStatus === "loading" ? (
            <p role="status" className="py-16 text-center text-sm text-white/50 font-sans">
              A carregar catálogo do Supabase…
            </p>
          ) : catalogStatus === "error" ? (
            <div role="alert" className="mx-auto max-w-xl rounded-2xl border border-red-400/20 bg-red-500/5 p-6 text-center">
              <p className="text-sm text-red-200">Não foi possível carregar o catálogo do Supabase.</p>
              <p className="mt-2 text-xs text-white/45">Confirma se a migração do catálogo foi aplicada e se as variáveis do Supabase estão configuradas no servidor.</p>
            </div>
          ) : children}
        </main>
      </div>

      {/* MENU MOBILE */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="relative w-64 bg-[#100F10] border-r border-white/10 p-6 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <img src={logoOriginal} alt="Vinicôa" className="h-8 w-auto" />
                  <span className="font-brand text-xs uppercase text-white">
                    Vinicôa Admin
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-white/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-6 space-y-1">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.end
                    ? location.pathname === item.to
                    : location.pathname.startsWith(item.to);

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition ${
                        isActive
                          ? "bg-white/[0.09] text-white"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <Icon className={`w-5 h-5 ${isActive ? "text-[#C49A4A]" : "text-white/40"}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== null && (
                        <span className="text-xs text-white/40">{item.badge}</span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-white/10">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-white/70 hover:text-white bg-white/[0.04] text-sm font-sans"
              >
                <span>Ver Loja</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
