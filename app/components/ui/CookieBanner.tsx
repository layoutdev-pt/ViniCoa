import { useState, useEffect } from "react";

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
      className="fixed bottom-0 inset-x-0 z-40 bg-vinicoa-noir/95 backdrop-blur-sm border-t border-dourado/25 px-6 lg:px-12 py-4"
      role="region"
      aria-label="Preferências de Cookies"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center gap-3 md:gap-8">
        <p className="flex-1 text-xs text-bege-dark leading-relaxed">
          <span className="font-downey uppercase tracking-[0.24em] text-dourado mr-3">Cookies</span>
          Utilizamos cookies essenciais para o funcionamento do cesto de compras e para personalizar a sua navegação.
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => handleChoice("essential")}
            className="px-4 py-2 rounded-lg font-downey text-[11px] uppercase tracking-[0.2em] text-bege border border-bege/30 hover:border-bege transition cursor-pointer"
          >
            Apenas essenciais
          </button>
          <button
            onClick={() => handleChoice("all")}
            className="px-4 py-2 rounded-lg font-downey text-[11px] uppercase tracking-[0.2em] bg-bordo text-bege border border-bordo hover:bg-bordo-light transition cursor-pointer"
          >
            Aceitar todos
          </button>
        </div>
      </div>
    </aside>
  );
}
