import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LayoutDashboard,
  LogOut,
  Settings,
  Sun,
  Moon,
} from "lucide-react";
import fullLogo from "../../assets/logo/Horizontal Secundário.png";
import simpleLogo from "../../assets/logo/simple.svg";
import { useAuth } from "../../context/authUtils";
import { useTheme } from "../../context/themeUtils";
import { NotificationBell } from "../NotificationBell"; // Caminho corrigido para subir um nível
import { OptimizedImage } from "../OptimizedImage";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/sobre", label: "Sobre" },
  { to: "/consultas", label: "Consultas" },
  { to: "/cursos", label: "Cursos" },
  { to: "/livros", label: "Livros" },
  { to: "/blog", label: "Blog" },
  { to: "/midia", label: "Media" },
];

export const Navbar: React.FC = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          setIsScrolled((prev) => {
            if (!prev && y > 36) return true;
            if (prev && y < 18) return false;
            return prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = () => setUserMenuOpen(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [userMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <header
      className={`fixed z-50 w-full transition-all duration-500 ease-in-out flex justify-center ${
        isScrolled ? "top-2 md:top-4 px-2 md:px-6" : "top-0 left-0 px-0"
      }`}
    >
      {/* O uso de transform-gpu (translateZ(0)) forca o Safari a colocar a navbar numa layer separada de hardware, impedindo que o backdrop-blur colapse os filhos */}
      <nav
        className={`w-full transition-all duration-500 ease-in-out relative transform-gpu ${
          isScrolled
            ? "max-w-[1100px] bg-nav-bg/90 backdrop-blur-xl rounded-2xl md:rounded-[2rem] border border-surface-border/60 shadow-xl"
            : "max-w-full bg-nav-bg/60 backdrop-blur-md border-b border-surface-border/20 rounded-none shadow-none"
        }`}
      >
        <div
          className={`mx-auto flex items-center justify-between w-full transition-all duration-500 ${
            isScrolled
              ? "px-4 md:px-8 h-14 md:h-16"
              : "px-6 lg:px-8 2xl:px-12 max-w-[1400px] 2xl:max-w-[1600px] h-20 md:h-24"
          }`}
        >
          {/* ── Logo ───────────────────────── */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className={`flex items-center relative transition-all duration-500 ${
                isScrolled ? "h-8 md:h-10" : "h-12 md:h-16"
              }`}
            >
              <img
                src={fullLogo}
                alt="Logo Completo"
                className={`w-auto h-full object-contain transition-all duration-300 origin-left ${
                  isScrolled
                    ? "opacity-0 scale-90 absolute left-0 pointer-events-none"
                    : "opacity-100 scale-100 relative"
                } ${theme === "dark" ? "invert brightness-0" : ""}`}
              />
              <img
                src={simpleLogo}
                alt="Logo Simples"
                className={`w-auto h-full object-contain transition-all duration-300 origin-left ${
                  isScrolled
                    ? "opacity-100 scale-100 relative"
                    : "opacity-0 scale-110 absolute left-0 pointer-events-none"
                } ${theme === "dark" ? "invert brightness-0" : ""}`}
              />
            </Link>
          </div>

          {/* ── Desktop Nav Links ─────── */}
          <div className="hidden md:flex flex-1 justify-center items-center">
            <div className="flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-site-text-muted hover:text-secondary px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-surface-muted"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* ── Right Side ───────────────────────── */}
          <div className="flex items-center gap-2 ml-auto md:ml-0 flex-shrink-0">
            {/* Botão Dark Mode Desktop */}
            <button
              onClick={toggleTheme}
              className={`appearance-none hidden md:flex items-center justify-center rounded-full transition-all w-10 h-10 text-site-text-muted hover:text-secondary hover:bg-surface-muted ${
                !isScrolled && "border border-surface-border"
              }`}
              title="Alternar Tema"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* Desktop User Section */}
            <div className="hidden md:flex items-center gap-3 ml-2">
              {user ? (
                <>
                  {/* SINO DE NOTIFICAÇÕES DESKTOP */}
                  <NotificationBell />

                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUserMenuOpen((v) => !v);
                      }}
                      className={`appearance-none flex items-center justify-center rounded-full transition-all ${
                        isScrolled
                          ? "w-10 h-10 border border-secondary/20 hover:border-secondary/50 bg-surface shadow-sm focus:outline-none"
                          : "gap-2.5 px-4 py-2 border border-secondary/30 bg-secondary/5 hover:bg-secondary/10 text-site-text font-semibold text-sm"
                      }`}
                    >
                      {avatarUrl ? (
                        <OptimizedImage
                          src={avatarUrl}
                          alt="Perfil"
                          className={`${isScrolled ? "w-full h-full" : "w-6 h-6"} rounded-full object-cover shadow-sm`}
                        />
                      ) : (
                        <div
                          className={`${isScrolled ? "w-full h-full text-base" : "w-6 h-6 text-xs"} rounded-full bg-secondary flex items-center justify-center text-white font-bold uppercase`}
                        >
                          {user.email?.[0] ?? "U"}
                        </div>
                      )}
                      {!isScrolled && (
                        <span>{isAdmin ? "Admin" : "Conta"}</span>
                      )}
                    </button>

                    <AnimatedDropdown open={userMenuOpen}>
                      <Link
                        to="/perfil"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-site-text hover:bg-surface-muted hover:text-secondary transition-colors rounded-t-xl"
                      >
                        <Settings className="w-4 h-4" /> Meu Perfil
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-site-text hover:bg-surface-muted hover:text-secondary transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                          Admin
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="appearance-none flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors rounded-b-xl w-full text-left border-t border-surface-border"
                      >
                        <LogOut className="w-4 h-4" /> Terminar Sessão
                      </button>
                    </AnimatedDropdown>
                  </div>
                </>
              ) : (
                <Link
                  to="/entrar"
                  className={`flex items-center justify-center rounded-full bg-primary hover:bg-primary/90 text-white transition-all shadow-md ${
                    isScrolled
                      ? "w-10 h-10"
                      : "gap-2 px-5 py-2.5 font-bold text-sm hover:-translate-y-0.5"
                  }`}
                >
                  <User className={`${isScrolled ? "w-5 h-5" : "w-4 h-4"}`} />
                  {!isScrolled && <span>Área Pessoal</span>}
                </Link>
              )}
            </div>

            {/* Botão Dark Mode Mobile */}
            <button
              onClick={toggleTheme}
              className="appearance-none md:hidden p-2 rounded-lg text-site-text hover:text-secondary transition-colors ml-1"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* SINO DE NOTIFICAÇÕES MOBILE */}
            {user && (
              <div className="md:hidden flex items-center ml-1">
                <NotificationBell />
              </div>
            )}

            {/* Ícone de utilizador mobile */}
            <Link
              to={user ? (isAdmin ? "/admin" : "/perfil") : "/entrar"}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-surface-muted border border-surface-border text-site-text hover:text-secondary transition-colors ml-1"
            >
              {user && avatarUrl ? (
                <OptimizedImage
                  src={avatarUrl}
                  alt="Perfil"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5" />
              )}
            </Link>

            {/* Hamburger Mobile */}
            <button
              onClick={toggleMobileMenu}
              className="appearance-none md:hidden p-2 rounded-lg text-site-text hover:text-secondary transition-colors ml-1"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Painel do Menu Mobile */}
        <div
          className={`md:hidden absolute left-0 w-full shadow-2xl transition-all duration-300 ease-in-out transform-gpu ${
            isMobileMenuOpen
              ? "opacity-100 translate-y-0 visible"
              : "opacity-0 -translate-y-4 invisible pointer-events-none"
          } ${isScrolled ? "top-[calc(100%+0.5rem)]" : "top-full"}`}
        >
          <div
            className={`absolute inset-0 bg-site-bg backdrop-blur-2xl border border-surface-border pointer-events-none transition-all duration-300 ${isScrolled ? "rounded-2xl" : ""}`}
          />
          <div className="relative z-10 px-6 pt-3 pb-6 space-y-1 flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={toggleMobileMenu}
                className="text-site-text-muted hover:text-secondary hover:bg-surface-muted block px-4 py-3 rounded-xl text-base font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-1 border-t border-surface-border">
              {user ? (
                <>
                  <Link
                    to="/perfil"
                    onClick={toggleMobileMenu}
                    className="flex items-center gap-2 text-site-text-muted hover:text-secondary hover:bg-surface-muted px-4 py-3 rounded-xl text-base font-medium transition-colors"
                  >
                    <Settings className="w-4 h-4" /> Meu Perfil
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={toggleMobileMenu}
                      className="flex items-center gap-2 text-site-text-muted hover:text-secondary hover:bg-surface-muted px-4 py-3 rounded-xl text-base font-medium transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      toggleMobileMenu();
                      handleSignOut();
                    }}
                    className="w-full flex items-center gap-2 text-red-500 hover:bg-red-500/10 px-4 py-3 rounded-xl text-base font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Terminar Sessão
                  </button>
                </>
              ) : (
                <Link
                  to="/entrar"
                  onClick={toggleMobileMenu}
                  className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 px-4 py-3 rounded-full text-base font-bold transition-colors shadow-md"
                >
                  <User className="w-4 h-4" /> Área Pessoal
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

/* ─── Dropdown Animado ─────────────────────────────────────────────────── */
const AnimatedDropdown: React.FC<{
  open: boolean;
  children: React.ReactNode;
}> = ({ open, children }) => (
  <div
    className={`absolute right-0 top-[calc(100%+0.5rem)] w-56 bg-surface rounded-xl shadow-xl border border-surface-border overflow-hidden transition-all duration-200 origin-top-right ${
      open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
    }`}
  >
    {children}
  </div>
);
