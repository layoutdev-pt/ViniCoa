import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router";
import { useCart } from "../../lib/cart-context";
import { useAdmin } from "../../lib/admin-context";
import { formatMoney } from "../../lib/wines";

export function SearchModal() {
  const { isSearchOpen, closeSearch, openQuickView } = useCart();
  const { wines } = useAdmin();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return wines.filter(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        w.grapes.toLowerCase().includes(q) ||
        w.desc.toLowerCase().includes(q) ||
        w.color.toLowerCase().includes(q) ||
        w.range.toLowerCase().includes(q) ||
        w.year.includes(q)
    );
  }, [wines, query]);

  if (!isSearchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/85 backdrop-blur-md transition-all duration-300 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Pesquisa de Vinhos"
    >
      <div className="w-full max-w-2xl glass-luxury border border-dourado/40 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-bege/10">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-5 h-5 text-dourado shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar por nome, casta (ex: Touriga), ano ou nota de prova..."
              className="w-full bg-transparent text-bege placeholder-bege-muted text-sm focus:outline-none"
            />
          </div>
          <button
            onClick={closeSearch}
            className="text-bege-muted hover:text-bege p-2 cursor-pointer"
            aria-label="Fechar pesquisa"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic results */}
        <div className="mt-4 max-h-80 overflow-y-auto space-y-2">
          {query.trim().length < 2 ? (
            <p className="text-xs text-bege-muted text-center py-6">
              Escreva pelo menos 2 caracteres para pesquisar na garrafeira.
            </p>
          ) : results.length === 0 ? (
            <p className="text-xs text-bege-muted text-center py-6">
              Nenhum vinho encontrado com o termo "{query}".
            </p>
          ) : (
            results.map((wine) => (
              <div
                key={wine.id}
                className="flex items-center justify-between p-3 rounded-xl bg-vinicoa-noir/80 border border-bege/10 hover:border-dourado/40 transition group"
              >
                <div
                  className="flex items-center gap-3 cursor-pointer flex-1"
                  onClick={() => {
                    closeSearch();
                    navigate(`/vinhos/${wine.id}`);
                  }}
                >
                  <img
                    src={wine.image}
                    alt={wine.title}
                    className="w-10 h-14 object-contain"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-bege group-hover:text-dourado transition">
                      {wine.title}
                    </h5>
                    <span className="text-[11px] text-dourado">
                      {wine.color} • {wine.range} • {wine.year}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-dourado mr-2">
                    {formatMoney(wine.price)}
                  </span>
                  <button
                    onClick={() => {
                      closeSearch();
                      openQuickView(wine.id);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-bordo hover:bg-bordo-light text-bege text-xs uppercase font-bold cursor-pointer transition"
                  >
                    Ver
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
