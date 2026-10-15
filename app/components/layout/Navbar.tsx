import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router";
import { Search, Sun, Moon, ShoppingBag, X, MapPin, Phone } from "lucide-react";
import { useCart } from "../../lib/cart-context";

export function Navbar() {
  const { totalItems, openCart, openSearch, theme, toggleTheme } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll listener passivo com requestAnimationFrame e histerese (ativa > 36px, desativa < 10px)
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY || document.documentElement.scrollTop;
          setIsScrolled((prev) => {
            if (!prev && y > 36) return true;
            if (prev && y < 10) return false;
            return prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-all duration-300 py-1 hover:text-dourado relative tracking-[0.2em] ${
      isActive
        ? "text-dourado font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-dourado"
        : "text-bege/90"
    }`;

  return (
    <header
      id="main-header"
      className={`fixed left-0 right-0 z-40 flex justify-center transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none pointer-events-none ${
        isScrolled ? "top-3 md:top-4 px-4 sm:px-6 lg:px-8" : "top-0 px-0"
      }`}
    >
      <nav
        id="navbar"
        role="navigation"
        aria-label="Navegação Principal"
        className={`pointer-events-auto w-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none transform-gpu ${
          isScrolled
            ? "max-w-6xl xl:max-w-7xl rounded-full py-2 px-5 sm:px-7 md:px-9 bg-vinicoa-noir/90 backdrop-blur-xl shadow-2xl shadow-black/60 border border-dourado/30"
            : "max-w-full rounded-none py-3.5 md:py-4 px-6 lg:px-12 bg-vinicoa-noir/80 backdrop-blur-md shadow-none border-b border-dourado/15"
        }`}
      >
        <div className="flex items-center justify-between w-full">
          {/* 1. BLOCO ESQUERDA: NAVEGAÇÃO DESKTOP / HAMBURGER MOBILE */}
          <div className="flex-1 flex items-center justify-start">
            {/* Botão Hamburger Animado Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden relative p-2 -ml-2 text-bege hover:text-dourado transition-colors cursor-pointer rounded-lg focus:outline-none focus-visible:ring-1 focus-visible:ring-dourado"
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileMenuOpen}
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span
                  className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${
                    mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-current rounded-full transition-opacity duration-200 ${
                    mobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${
                    mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>

            {/* Links Desktop */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8 text-xs lg:text-[13px] uppercase font-medium">
              <NavLink to="/vinhos" className={navLinkClass}>
                VINHOS
              </NavLink>
              <NavLink to="/terroir" className={navLinkClass}>
                O TERROIR
              </NavLink>
            </div>
          </div>

          {/* 2. BLOCO CENTRAL: IDENTIDADE (BRASÃO + LETTERING VINICÔA SABUGAL) */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <Link
              to="/"
              className="group flex flex-col items-center text-center transition-transform duration-300 hover:scale-[1.02]"
              aria-label="Página Inicial da VinicÔa"
            >
              {/* Brasão Heráldico Fiel ao Castelo das Cinco Quinas e Socalcos do Côa */}
              <div
                className={`text-dourado flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                  isScrolled ? "w-7 h-9 md:w-8 md:h-10" : "w-9 h-11 md:w-10 md:h-12"
                }`}
              >
                <svg
                  viewBox="0 0 100 130"
                  className="w-full h-full drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M14 52 L14 30 L28 30 L28 16 L50 24 L72 16 L72 30 L86 30 L86 52" />
                  <path d="M14 52 C14 96 50 122 50 122 C50 122 86 96 86 52 Z" />
                  <line x1="16" y1="52" x2="84" y2="52" strokeWidth="2.5" />
                  <rect x="22" y="60" width="6" height="7" strokeWidth="2" />
                  <rect x="32" y="60" width="6" height="7" strokeWidth="2" />
                  <line x1="20" y1="52" x2="20" y2="82" strokeWidth="2" />
                  <line x1="39" y1="52" x2="39" y2="78" strokeWidth="2" />
                  <path d="M68 60 C68 56 74 56 74 60 L74 72" strokeWidth="2" />
                  <path d="M78 60 C78 56 82 56 82 60 L82 72" strokeWidth="2" />
                  <line x1="62" y1="52" x2="62" y2="78" strokeWidth="2" />
                  <line x1="81" y1="52" x2="81" y2="82" strokeWidth="2" />
                  <circle cx="50" cy="62" r="3.6" fill="currentColor" />
                  <circle cx="44" cy="68" r="3.6" fill="currentColor" />
                  <circle cx="56" cy="68" r="3.6" fill="currentColor" />
                  <circle cx="50" cy="74" r="3.6" fill="currentColor" />
                  <circle cx="50" cy="80" r="3" fill="currentColor" />
                  <path d="M22 92 Q50 110 78 92" strokeWidth="2.5" />
                  <path d="M28 102 Q50 118 72 102" strokeWidth="2.5" />
                  <path d="M42 84 Q50 90 58 84" strokeWidth="2" />
                </svg>
              </div>

              {/* Lettering com Colapso Adaptativo Suave */}
              <div
                className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                  isScrolled
                    ? "max-h-0 opacity-0 -translate-y-1.5 pointer-events-none"
                    : "max-h-12 opacity-100 translate-y-0 mt-0.5"
                }`}
              >
                <span className="font-brand font-bold text-lg lg:text-xl tracking-[0.24em] text-bege group-hover:text-dourado transition-colors block leading-tight">
                  VINICÔA
                </span>
                <span className="font-downey text-[8px] uppercase tracking-[0.48em] text-dourado font-medium block leading-none">
                  SABUGAL
                </span>
              </div>
            </Link>
          </div>

          {/* 3. BLOCO DIREITA: UTILITÁRIOS */}
          <div className="flex-1 flex items-center justify-end space-x-2 sm:space-x-3 lg:space-x-4">
            {/* Ícone de Definições/Tema */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-full text-bege/80 hover:text-dourado hover:bg-white/5 transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-dourado"
              aria-label="Alternar tema de cor"
              title="Alternar tema / definições"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Ícone de Pesquisa */}
            <button
              type="button"
              onClick={openSearch}
              className="p-2 rounded-full text-bege/80 hover:text-dourado hover:bg-white/5 transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-dourado"
              aria-label="Abrir pesquisa"
              title="Pesquisar"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Texto "CONTACTOS" (Desktop com adaptação de espaço em cápsula) */}
            <NavLink
              to="/contactos"
              className={({ isActive }) =>
                `hidden ${
                  isScrolled ? "xl:inline-flex" : "lg:inline-flex"
                } items-center text-xs lg:text-[13px] uppercase tracking-[0.2em] font-medium transition-all duration-300 py-1 hover:text-dourado ${
                  isActive ? "text-dourado font-bold" : "text-bege/90"
                }`
              }
            >
              CONTACTOS
            </NavLink>

            {/* Botão Pílula de Carrinho (Fundo Vinho Escuro, Contorno Discreto, Saco e Contador) */}
            <button
              type="button"
              onClick={openCart}
              className="group relative flex items-center gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-[#48000E] hover:bg-[#6B0015] border border-dourado/30 hover:border-dourado/60 text-bege shadow-lg shadow-black/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              aria-label={`Carrinho de compras com ${totalItems} ${totalItems === 1 ? "item" : "itens"}`}
            >
              <ShoppingBag className="w-4 h-4 text-dourado group-hover:scale-110 transition-transform duration-200" />
              <span className="min-w-5 h-5 px-1.5 rounded-full bg-dourado text-vinicoa-noir text-[11px] font-bold flex items-center justify-center tabular-nums leading-none shadow-sm">
                {totalItems}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Menu Gaveta Mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden pointer-events-auto">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs glass-luxury border-l border-dourado/30 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-bege/10">
                  <span className="font-editorial text-xl font-bold text-dourado tracking-widest">
                    VINICÔA
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-bege hover:text-dourado cursor-pointer"
                    aria-label="Fechar menu móvel"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="mt-8 flex flex-col space-y-5 text-sm uppercase tracking-[0.2em] font-semibold text-bege">
                  <NavLink
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-dourado transition"
                  >
                    INÍCIO
                  </NavLink>
                  <NavLink
                    to="/vinhos"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-dourado transition"
                  >
                    VINHOS
                  </NavLink>
                  <NavLink
                    to="/terroir"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-dourado transition"
                  >
                    O TERROIR
                  </NavLink>
                  <NavLink
                    to="/contactos"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-dourado transition"
                  >
                    CONTACTOS
                  </NavLink>
                </nav>
              </div>

              <div className="pt-6 border-t border-bege/10 text-xs text-bege-muted space-y-2">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-dourado" /> Sabugal, Beira Interior
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-dourado" /> +351 271 000 000
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
