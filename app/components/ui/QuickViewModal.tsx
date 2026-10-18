import { X, Utensils } from "lucide-react";
import { Link } from "react-router";
import { useCart } from "../../lib/cart-context";
import { useAdmin } from "../../lib/admin-context";
import { getWineById, formatMoney } from "../../lib/wines";

export function QuickViewModal() {
  const { quickViewWineId, closeQuickView, addToCart } = useCart();
  const { wines } = useAdmin();

  if (!quickViewWineId) return null;
  const wine = wines.find((w) => w.id === quickViewWineId) || getWineById(quickViewWineId);
  if (!wine) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all duration-300 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qv-title"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-luxury border border-dourado/40 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <button
          onClick={closeQuickView}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 text-bege hover:text-dourado flex items-center justify-center transition border border-bege/20 cursor-pointer"
          aria-label="Fechar detalhes rápidos"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative bg-vinicoa-noir/80 rounded-2xl p-8 flex items-center justify-center border border-bege/10">
            <span className="absolute top-3 left-4 px-3 py-1 rounded bg-bordo text-bege text-[10px] uppercase font-bold tracking-widest border border-dourado/30">
              {wine.badge}
            </span>
            <img
              src={wine.image}
              alt={wine.title}
              className="h-72 object-contain drop-shadow-2xl"
            />
          </div>

          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-dourado font-semibold block mb-1">
              Perfil Sensorial & Prova
            </span>
            <h3 id="qv-title" className="font-brand text-3xl font-bold text-bege mb-2">
              {wine.title}
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl font-bold text-dourado">
                {formatMoney(wine.price)}
              </span>
              <span className="text-xs text-bege-dark font-medium">
                {wine.volume} • Colheita {wine.year} • {wine.grapes}
              </span>
            </div>

            <p className="text-xs text-bege-dark leading-relaxed mb-6">
              {wine.desc}
            </p>

            {/* Radar sensorial resumido */}
            <div className="space-y-3 mb-6 p-4 rounded-xl bg-white/5 border border-bege/10">
              <h4 className="text-xs uppercase tracking-wider text-dourado font-bold mb-2">
                Notas Organoléticas
              </h4>
              <div>
                <div className="flex justify-between text-xs text-bege-muted mb-1">
                  <span>Corpo</span>
                  <span className="text-bege">{wine.corpo}%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-dourado h-full rounded-full transition-all duration-500"
                    style={{ width: `${wine.corpo}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-bege-muted mb-1">
                  <span>Taninos</span>
                  <span className="text-bege">{wine.taninos}%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-bordo-light h-full rounded-full transition-all duration-500"
                    style={{ width: `${wine.taninos}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-bege-muted mb-1">
                  <span>Acidez & Frescura</span>
                  <span className="text-bege">{wine.acidez}%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-dourado-light h-full rounded-full transition-all duration-500"
                    style={{ width: `${wine.acidez}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Harmonização */}
            <div className="mb-6">
              <h5 className="text-xs uppercase tracking-wider text-bege font-semibold mb-2 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-dourado" /> Harmonização Sugerida:
              </h5>
              <p className="text-xs text-bege-dark italic bg-white/5 p-3 rounded-lg border border-bege/10">
                "{wine.pairing}"
              </p>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => {
                  addToCart(wine.id);
                  closeQuickView();
                }}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-bordo hover:bg-bordo-light text-bege font-bold text-xs uppercase tracking-widest border border-dourado/40 shadow-xl transition cursor-pointer"
              >
                Adicionar ao Cesto
              </button>
              <Link
                to={`/vinhos/${wine.id}`}
                onClick={closeQuickView}
                className="w-full sm:w-auto text-center py-3.5 px-6 rounded-xl glass-luxury hover:bg-white/10 text-bege text-xs uppercase tracking-wider border border-bege/20 transition cursor-pointer"
              >
                Ver Página Completa
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
