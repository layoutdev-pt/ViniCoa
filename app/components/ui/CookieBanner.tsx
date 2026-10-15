import { useState, useEffect } from "react";
import { Cookie } from "lucide-react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const accepted = localStorage.getItem("vinicoa_cookies_accepted");
      if (!accepted) {
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  const handleChoice = (type: "all" | "essential") => {
    try {
      localStorage.setItem("vinicoa_cookies_accepted", type);
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      className="fixed bottom-5 left-5 z-40 max-w-sm p-5 rounded-2xl glass-luxury border border-dourado/20 shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-5"
      role="region"
      aria-label="Preferências de Cookies"
    >
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-lg bg-bordo/30 text-dourado text-sm mt-0.5">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-xs uppercase tracking-widest text-dourado font-bold mb-1">
            Privacidade & Cookies
          </h4>
          <p className="text-xs text-bege-dark leading-relaxed mb-3">
            Utilizamos cookies essenciais para assegurar o funcionamento do cesto de compras e personalizar a sua navegação na adega.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleChoice("all")}
              className="px-3.5 py-2 rounded-lg bg-dourado text-vinicoa-noir text-xs font-bold tracking-wide hover:bg-dourado-light transition cursor-pointer"
            >
              Aceitar Todos
            </button>
            <button
              onClick={() => handleChoice("essential")}
              className="px-3.5 py-2 rounded-lg bg-white/5 text-bege-dark hover:text-bege text-xs transition border border-bege/20 cursor-pointer"
            >
              Apenas Essenciais
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
