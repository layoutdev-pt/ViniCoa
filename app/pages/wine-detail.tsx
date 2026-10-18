import { useParams, Link } from "react-router";
import { ArrowLeft, Trophy, Utensils, ShoppingBag } from "lucide-react";
import { useCart } from "../lib/cart-context";
import { useAdmin } from "../lib/admin-context";
import { getWineById, formatMoney } from "../lib/wines";
import { WinePurchaseCTA } from "../components/ui/WinePurchaseCTA";
import { GlobeSection } from "../components/ui/GlobeSection";

export function WineDetail() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { wines } = useAdmin();

  const wine = wines.find((w) => String(w.id) === id || w.slug === id) || getWineById(id || "1");

  if (!wine) {
    return (
      <div className="pt-40 sm:pt-44 pb-28 px-6 max-w-xl mx-auto text-center">
        <h1 className="font-brand text-3xl font-bold text-bege mb-4">
          Vinho Não Encontrado
        </h1>
        <p className="text-xs text-bege-dark mb-6">
          A referência que procura não existe na nossa garrafeira.
        </p>
        <Link
          to="/vinhos"
          className="px-8 py-3.5 rounded-xl bg-bordo text-bege text-xs uppercase font-bold tracking-wider inline-block"
        >
          Voltar ao Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="pt-36 sm:pt-40 md:pt-44 pb-20 px-6 lg:px-12 max-w-6xl mx-auto">
      <Link
        to="/vinhos"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-dourado font-bold mb-8 hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Voltar à Garrafeira
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
        {/* Imagem e Selo */}
        <div data-reveal="left" className="glass-luxury rounded-3xl p-10 flex items-center justify-center relative border border-dourado/30">
          <span className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-bordo text-bege text-xs uppercase font-bold tracking-widest border border-dourado/40">
            {wine.badge}
          </span>
          <img
            src={wine.image}
            alt={wine.title}
            className="h-96 sm:h-[450px] object-contain drop-shadow-2xl"
          />
        </div>

        {/* Dados Comerciais e Sensoriais */}
        <div data-reveal="right" data-reveal-delay="1">
          <span className="text-xs uppercase tracking-[0.25em] text-dourado font-semibold block mb-1">
            {wine.color} · {wine.range}
          </span>
          <h1 className="font-brand text-3xl sm:text-5xl font-bold text-bege mb-2">
            {wine.title}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-extrabold text-dourado">
              {formatMoney(wine.price)}
            </span>
            <span className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-bege/20 text-bege-dark font-medium">
              {wine.volume} • Colheita {wine.year}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-bege-dark leading-relaxed mb-6 font-light">
            {wine.desc}
          </p>

          {/* Prémios / Distinções */}
          <div className="mb-6 p-4 rounded-xl bg-bordo/20 border border-bordo/40">
            <h4 className="text-xs uppercase tracking-wider text-dourado font-bold mb-2 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-dourado" /> Prémios & Pontuações
            </h4>
            <ul className="text-xs text-bege space-y-1">
              {wine.awards.map((award, i) => (
                <li key={i}>• {award}</li>
              ))}
            </ul>
          </div>

          {/* Ficha Organolética */}
          <div className="space-y-3 mb-8 p-5 rounded-2xl glass-luxury border border-bege/10">
            <h4 className="text-xs uppercase tracking-wider text-dourado font-bold mb-3">
              Ficha Organolética
            </h4>
            <div>
              <div className="flex justify-between text-xs text-bege-muted mb-1">
                <span>Corpo</span>
                <span className="text-bege">{wine.corpo}%</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-dourado h-full rounded-full" style={{ width: `${wine.corpo}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-bege-muted mb-1">
                <span>Taninos</span>
                <span className="text-bege">{wine.taninos}%</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-bordo-light h-full rounded-full" style={{ width: `${wine.taninos}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-bege-muted mb-1">
                <span>Acidez & Frescura</span>
                <span className="text-bege">{wine.acidez}%</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-dourado-light h-full rounded-full" style={{ width: `${wine.acidez}%` }} />
              </div>
            </div>
          </div>

          {/* Harmonização */}
          <div className="mb-8">
            <h5 className="text-xs uppercase tracking-wider text-bege font-semibold mb-2 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-dourado" /> Harmonização Recomendada:
            </h5>
            <p className="text-xs text-bege-dark italic bg-white/5 p-3 rounded-lg border border-bege/10">
              {wine.pairing}
            </p>
          </div>

          {/* Botão Desktop */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              onClick={() => addToCart(wine.id)}
              className="flex-1 py-4 px-8 rounded-xl bg-bordo hover:bg-bordo-light text-bege font-bold text-xs uppercase tracking-widest border border-dourado/40 shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" /> Adicionar ao Cesto • {formatMoney(wine.price)}
            </button>
          </div>
        </div>
      </div>
    </div>

      {/* CTA DE INCENTIVO À COMPRA DE VINHOS */}
      <WinePurchaseCTA />

      {/* DO SABUGAL PARA O MUNDO */}
      <GlobeSection />

      {/* BARRA FIXA MOBILE PARA ADICIONAR AO CESTO */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 glass-luxury border-t border-dourado/30 p-4 flex items-center justify-between">
        <div>
          <span className="text-xs text-bege-muted block">{wine.title}</span>
          <span className="text-base font-extrabold text-dourado">{formatMoney(wine.price)}</span>
        </div>
        <button
          onClick={() => addToCart(wine.id)}
          className="px-6 py-3 rounded-xl bg-bordo text-bege text-xs font-bold uppercase tracking-wider shadow-lg cursor-pointer"
        >
          Adicionar ao Cesto
        </button>
      </div>
    </div>
  );
}
export default WineDetail;
