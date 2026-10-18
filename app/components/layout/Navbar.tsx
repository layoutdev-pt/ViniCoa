import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router";
import { Search, Sun, Moon, ShoppingBag, X, MapPin, Phone } from "lucide-react";
import { useCart } from "../../lib/cart-context";
// import logoOriginal from "../../assets/logos/logo_simples.svg";
import logoSimples from "../../assets/logos/logo_simples.svg";

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

  // Bloqueio do scroll do body quando o menu mobile está aberto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `font-downey transition-colors duration-300 py-1 hover:text-dourado relative tracking-[0.12em] ${
      isActive
        ? "text-dourado after:content-[''] after:absolute after:-bottom-0.5 after:left-0 after:right-[0.12em] after:h-px after:bg-dourado"
        : theme === "light"
        ? "text-[#381219]/90"
        : "text-bege/90"
    }`;

  return (
    <>
      <header
        id="main-header"
        className={`fixed z-40 w-full transition-all duration-500 ease-in-out flex justify-center pointer-events-none ${
          isScrolled
            ? "top-2 md:top-4 px-3 sm:px-6 md:px-8"
            : "top-0 left-0 px-0"
        }`}
      >
        <nav
          id="navbar"
          role="navigation"
          aria-label="Navegação Principal"
          className={`w-full transition-all duration-500 ease-in-out relative transform-gpu pointer-events-auto ${
            isScrolled
              ? "max-w-5xl lg:max-w-6xl rounded-2xl md:rounded-[2rem] border border-dourado/30 shadow-2xl shadow-black/40 py-2 md:py-2.5 px-4 md:px-8"
              : "max-w-full rounded-none border-b border-dourado/20 shadow-none py-3.5 md:py-4 px-6 lg:px-12"
          } ${
            theme === "light"
              ? "bg-[#EFE7DA] text-[#381219]"
              : "bg-vinicoa-noir text-bege"
          }`}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center w-full">
            {/* 1. BLOCO ESQUERDA: HAMBURGER MOBILE & LINKS DESKTOP */}
            <div className="flex-1 flex items-center justify-start">
              {/* Botão Hamburger Mobile */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className={`md:hidden relative p-2 -ml-2 transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-dourado ${
                  theme === "light"
                    ? "text-[#381219] hover:text-dourado"
                    : "text-bege hover:text-dourado"
                }`}
                aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={mobileMenuOpen}
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span
                    className={`w-full h-px bg-current transition-all duration-300 ${
                      mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                    }`}
                  />
                  <span
                    className={`w-full h-px bg-current transition-opacity duration-200 ${
                      mobileMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  <span
                    className={`w-full h-px bg-current transition-all duration-300 ${
                      mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Links Desktop (Ala Esquerda) */}
              <div className="hidden md:flex items-center space-x-6 lg:space-x-8 xl:space-x-10 text-[11px] lg:text-xs uppercase">
                <NavLink to="/" end className={navLinkClass}>
                  Início
                </NavLink>
                <NavLink to="/vinhos" className={navLinkClass}>
                  Vinhos
                </NavLink>
                <NavLink to="/sobre-nos" className={navLinkClass}>
                  Sobre Nós
                </NavLink>
              </div>
            </div>

            {/* 2. BLOCO CENTRAL: LOGÓTIPO OFICIAL */}
            <div className="flex-shrink-0 flex items-center justify-center px-2 sm:px-4 lg:px-6">
              <Link to="/" className="flex items-center" aria-label="Página inicial da Vinicôa">
                <img
                  src={logoSimples}
                  alt="Vinicôa Sabugal"
                  className={`w-auto object-contain transition-all duration-500 motion-reduce:transition-none ${
                    isScrolled ? "h-9 md:h-10" : "h-12 md:h-16"
                  }`}
                />
              </Link>
            </div>

            {/* 3. BLOCO DIREITA: LINKS DESKTOP & UTILITÁRIOS */}
            <div className="flex-1 flex items-center justify-end space-x-3 sm:space-x-4 lg:space-x-6">
              {/* Links Desktop (Ala Direita) */}
              <div className="hidden md:flex items-center space-x-6 lg:space-x-8 xl:space-x-10 text-[11px] lg:text-xs uppercase">
                <NavLink to="/avaliacoes" className={navLinkClass}>
                  Avaliações
                </NavLink>
                <NavLink to="/contactos" className={navLinkClass}>
                  Contactos
                </NavLink>
              </div>

              {/* Divisor subtil dourado entre navegação e utilitários */}
              <span
                className="hidden md:inline-block h-4 w-px bg-dourado/25 mx-0.5 lg:mx-1"
                aria-hidden="true"
              />

              {/* Grupo de Ações / Utilitários */}
              <div className="flex items-center space-x-1.5 sm:space-x-2.5 lg:space-x-3">
                {/* Ícone de Definições/Tema */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={`hidden sm:inline-flex p-2 transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-dourado rounded-full hover:bg-dourado/10 ${
                    theme === "light"
                      ? "text-[#381219]/80 hover:text-dourado"
                      : "text-bege/80 hover:text-dourado"
                  }`}
                  aria-label="Alternar tema de cor"
                  title="Alternar tema de cor"
                >
                  {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </button>

                {/* Ícone de Pesquisa */}
                <button
                  type="button"
                  onClick={openSearch}
                  className={`p-2 transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-dourado rounded-full hover:bg-dourado/10 ${
                    theme === "light"
                      ? "text-[#381219]/80 hover:text-dourado"
                      : "text-bege/80 hover:text-dourado"
                  }`}
                  aria-label="Abrir pesquisa"
                  title="Pesquisar catálogo"
                >
                  <Search className="w-4 h-4" />
                </button>

                {/* Botão Pílula de Carrinho */}
                <button
                  type="button"
                  onClick={openCart}
                  className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full border border-dourado/50 hover:border-dourado hover:bg-bordo bg-bordo/10 text-current transition-colors duration-300 cursor-pointer"
                  aria-label={`Carrinho de compras com ${totalItems} ${totalItems === 1 ? "item" : "itens"}`}
                >
                  <ShoppingBag className="w-4 h-4 text-dourado" strokeWidth={1.5} />
                  <span className="min-w-5 h-5 px-1.5 rounded-full bg-dourado text-vinicoa-noir text-[11px] font-bold flex items-center justify-center tabular-nums leading-none">
                    {totalItems}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Menu Gaveta Mobile com Animação Fluida de Entrada */}
      <div
        className={`fixed inset-0 z-50 overflow-hidden md:hidden transition-all duration-300 ${
          mobileMenuOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu principal de navegação móvel"
      >
        {/* Backdrop suave */}
        <div
          onClick={() => setMobileMenuOpen(false)}
          className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Gaveta lateral com deslize e curvas suaves */}
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10 pointer-events-auto">
          <div
            className={`w-screen max-w-xs border-l border-dourado/30 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
              mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            } ${
              theme === "light"
                ? "bg-bege-light text-[#381219]"
                : "bg-vinicoa-noir text-bege"
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-dourado/20">
                <img
                  src={logoSimples}
                  alt="Vinicôa Sabugal"
                  className="h-12 w-auto object-contain"
                />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-current hover:text-dourado transition-colors cursor-pointer"
                  aria-label="Fechar menu móvel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-8 flex flex-col space-y-5 font-downey text-sm uppercase tracking-[0.12em]">
                <NavLink
                  to="/"
                  end
                  onClick={() => setMobileMenuOpen(false)}
                  className={`transition-all duration-300 transform hover:text-dourado ${
                    mobileMenuOpen
                      ? "opacity-100 translate-x-0 delay-75"
                      : "opacity-0 translate-x-4"
                  }`}
                >
                  INÍCIO
                </NavLink>
                <NavLink
                  to="/vinhos"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`transition-all duration-300 transform hover:text-dourado ${
                    mobileMenuOpen
                      ? "opacity-100 translate-x-0 delay-100"
                      : "opacity-0 translate-x-4"
                  }`}
                >
                  VINHOS
                </NavLink>
                <NavLink
                  to="/sobre-nos"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`transition-all duration-300 transform hover:text-dourado ${
                    mobileMenuOpen
                      ? "opacity-100 translate-x-0 delay-150"
                      : "opacity-0 translate-x-4"
                  }`}
                >
                  SOBRE NÓS
                </NavLink>
                <NavLink
                  to="/avaliacoes"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`transition-all duration-300 transform hover:text-dourado ${
                    mobileMenuOpen
                      ? "opacity-100 translate-x-0 delay-200"
                      : "opacity-0 translate-x-4"
                  }`}
                >
                  AVALIAÇÕES
                </NavLink>
                <NavLink
                  to="/contactos"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`transition-all duration-300 transform hover:text-dourado ${
                    mobileMenuOpen
                      ? "opacity-100 translate-x-0 delay-300"
                      : "opacity-0 translate-x-4"
                  }`}
                >
                  CONTACTOS
                </NavLink>
              </nav>
            </div>

            <div className="pt-6 border-t border-dourado/20 text-xs opacity-80 space-y-2">
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
    </>
  );
}
