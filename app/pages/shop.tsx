import { useState, useMemo } from "react";
import { Link } from "react-router";
import { Filter, Sliders, Wine as WineIcon } from "lucide-react";
import { useCart } from "../lib/cart-context";
import { useAdmin } from "../lib/admin-context";
import { formatMoney } from "../lib/wines";
import { WinePurchaseCTA } from "../components/ui/WinePurchaseCTA";
import { GlobeSection } from "../components/ui/GlobeSection";

export function Shop() {
  const { addToCart, openQuickView } = useCart();
  const { wines } = useAdmin();

  const maxPricePossible = useMemo(() => {
    return wines.length > 0 ? Math.ceil(Math.max(...wines.map((w) => w.price))) : 100;
  }, [wines]);

  const [color, setColor] = useState<string>("all");
  const [range, setRange] = useState<string>("all");
  const [year, setYear] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(maxPricePossible);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [isFilterBoxOpen, setIsFilterBoxOpen] = useState(false);

  const availableYears = useMemo(() => {
    return Array.from(new Set(wines.map((w) => w.year))).sort().reverse();
  }, [wines]);

  const filteredWines = useMemo(() => {
    let list = wines.filter((wine) => {
      const matchColor = color === "all" || wine.color === color;
      const matchRange = range === "all" || wine.range === range;
      const matchYear = year === "all" || wine.year === year;
      const matchPrice = wine.price <= maxPrice;
      return matchColor && matchRange && matchYear && matchPrice;
    });

    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "year-desc") {
      list.sort((a, b) => parseInt(b.year) - parseInt(a.year));
    }

    return list;
  }, [wines, color, range, year, maxPrice, sortBy]);

  const resetFilters = () => {
    setColor("all");
    setRange("all");
    setYear("all");
    setMaxPrice(maxPricePossible);
    setSortBy("featured");
  };

  return (
    <div className="w-full">
      <div className="pt-36 sm:pt-40 md:pt-44 pb-20 px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Top Title Bar */}
      <div data-reveal className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-bege/10 gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-dourado font-semibold block mb-1">
            Coleção Vinicôa
          </span>
          <h1 className="font-brand text-3xl sm:text-5xl text-bege font-bold">
            A Nossa Garrafeira
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-bege-muted font-medium">
            {filteredWines.length} {filteredWines.length === 1 ? "vinho" : "vinhos"}
          </span>
          <button
            onClick={() => setIsFilterBoxOpen(!isFilterBoxOpen)}
            className="md:hidden px-4 py-2 rounded-xl glass-luxury border border-dourado/40 text-bege text-xs uppercase font-bold flex items-center gap-2 cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-dourado" /> Filtros
          </button>
        </div>
      </div>

      {/* Filters Box */}
      <div
        className={`glass-luxury p-6 rounded-2xl border border-dourado/20 mb-8 shadow-xl ${
          isFilterBoxOpen ? "block" : "hidden md:block"
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 items-end">
          {/* Cor */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-dourado font-semibold mb-2">
              Cor do Vinho
            </label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full bg-vinicoa-noir border border-bege/20 rounded-xl px-3 py-2 text-xs text-bege focus:border-dourado focus:outline-none transition cursor-pointer"
            >
              <option value="all">Todas as Cores</option>
              <option value="Tinto">Tinto</option>
              <option value="Branco">Branco</option>
              <option value="Rosé">Rosé</option>
            </select>
          </div>

          {/* Gama */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-dourado font-semibold mb-2">
              Gama
            </label>
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="w-full bg-vinicoa-noir border border-bege/20 rounded-xl px-3 py-2 text-xs text-bege focus:border-dourado focus:outline-none transition cursor-pointer"
            >
              <option value="all">Todas as Gamas</option>
              <option value="Colheita">Colheita</option>
              <option value="Reserva">Reserva</option>
              <option value="Grande Reserva">Grande Reserva</option>
            </select>
          </div>

          {/* Ano */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-dourado font-semibold mb-2">
              Colheita
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-vinicoa-noir border border-bege/20 rounded-xl px-3 py-2 text-xs text-bege focus:border-dourado focus:outline-none transition cursor-pointer"
            >
              <option value="all">Todos os Anos</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Preço Máximo */}
          <div>
            <div className="flex justify-between text-xs text-dourado font-semibold mb-2">
              <span className="uppercase tracking-wider">Preço Máx.</span>
              <span className="text-bege">{formatMoney(maxPrice)}</span>
            </div>
            <input
              type="range"
              min={15}
              max={maxPricePossible}
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
              className="w-full accent-dourado cursor-pointer"
            />
          </div>

          {/* Ordenação */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-dourado font-semibold mb-2">
              Ordenar por
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-vinicoa-noir border border-bege/20 rounded-xl px-3 py-2 text-xs text-bege focus:border-dourado focus:outline-none transition cursor-pointer"
            >
              <option value="featured">Destaques</option>
              <option value="price-asc">Preço: Menor para Maior</option>
              <option value="price-desc">Preço: Maior para Menor</option>
              <option value="year-desc">Ano Mais Recente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Wine Grid */}
      {filteredWines.length === 0 ? (
        <div className="text-center py-20">
          <WineIcon className="w-12 h-12 mx-auto text-dourado/40 mb-3" />
          <p className="text-base text-bege font-brand">
            Nenhum vinho encontrado com os filtros selecionados.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 text-xs text-dourado underline uppercase tracking-widest font-bold cursor-pointer"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWines.map((wine, i) => (
            <div
              key={wine.id}
              data-reveal
              data-reveal-delay={String(Math.min((i % 4) + 1, 6))}
              className="rounded-2xl glass-luxury border border-bege/10 p-5 flex flex-col justify-between group hover:border-dourado/50 transition-all duration-300"
            >
              <Link to={`/vinhos/${wine.id}`} className="block">
                <div className="relative bg-vinicoa-noir/80 rounded-xl p-6 mb-4 flex items-center justify-center overflow-hidden">
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-bordo/70 text-bege text-[9px] uppercase font-bold tracking-widest border border-dourado/30">
                    {wine.badge}
                  </span>
                  <img
                    src={wine.image}
                    alt={wine.title}
                    className="h-56 object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-xl"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-dourado mb-1">
                  <span>
                    {wine.color} • {wine.range}
                  </span>
                  <span>{wine.volume}</span>
                </div>
                <h3 className="font-brand text-xl text-bege font-bold mb-1 group-hover:text-dourado transition">
                  {wine.title}
                </h3>
                <p className="text-xs text-bege-dark line-clamp-2 mb-4 leading-relaxed font-light">
                  {wine.desc}
                </p>
              </Link>

              <div className="pt-4 border-t border-bege/10 flex items-center justify-between">
                <span className="text-lg font-bold text-dourado">
                  {formatMoney(wine.price)}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openQuickView(wine.id)}
                    className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-bege hover:text-dourado transition border border-bege/20 cursor-pointer"
                    aria-label="Ver perfil sensorial"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => addToCart(wine.id)}
                    className="px-3.5 py-2 rounded-lg bg-bordo hover:bg-bordo-light text-bege text-xs uppercase font-bold tracking-wider transition border border-dourado/30 cursor-pointer"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>

      {/* CTA DE INCENTIVO À COMPRA DE VINHOS */}
      <WinePurchaseCTA />

      {/* DO SABUGAL PARA O MUNDO */}
      <GlobeSection />
    </div>
  );
}
export default Shop;
