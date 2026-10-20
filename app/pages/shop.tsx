import { useState, useMemo } from "react";
import { Link } from "react-router";
import {
  Filter,
  Sliders,
  Wine as WineIcon,
  Search,
  X,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Check,
  Tag,
  Euro,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpDown,
  Boxes,
} from "lucide-react";
import { useCart } from "../lib/cart-context";
import { useAdmin } from "../lib/admin-context";
import { formatMoney } from "../lib/wines";
import { WinePurchaseCTA } from "../components/ui/WinePurchaseCTA";
import { GlobeSection } from "../components/ui/GlobeSection";
import type { Wine } from "../types/wine";

// 1. Capacidades solicitadas
export const CAPACITIES = [
  "0,5L",
  "0,75L",
  "1,5L",
  "60ml",
  "Caixa",
] as const;

// 2. Preço solicitado: 4€ a 900€
export const PRICE_MIN = 4;
export const PRICE_MAX = 900;

// 3. Categorias de Produto solicitadas
export const PRODUCT_CATEGORIES = [
  "Vinhos",
  "Adega Velha",
  "Aveleda",
  "Casal Garcia",
  "Mandriola de Lisboa",
  "Outras Marcas",
  "Quinta d'Aguieira",
  "Quinta Vale D. Maria",
  "Villa Alvor",
] as const;

// 4. Tipo de Vinho solicitados
export const WINE_TYPES = [
  "Aguardente",
  "Bebida Aromatizada à Base deVinho",
  "Branco",
  "Espumante",
  "O Fortificado",
  "Rosé",
  "Sangria",
  "Tinto",
] as const;

// 5. Colheitas solicitadas
export const HARVEST_YEARS = [
  "2022",
  "2021",
  "2017",
  "2014",
  "2012",
  "2007",
  "1969",
  "1940",
] as const;

// Helper para normalizar e comparar capacidade/volume
function matchesCapacity(wineVolume: string | undefined, selectedCapacity: string): boolean {
  if (!selectedCapacity || selectedCapacity === "all") return true;
  if (!wineVolume) return false;

  const w = wineVolume.toLowerCase().replace(/\s+/g, "").replace(",", ".");
  const s = selectedCapacity.toLowerCase().replace(/\s+/g, "").replace(",", ".");

  if (w === s) return true;

  // 0,75L vs 750ml / 75cl / 0.75l
  if ((s === "0.75l" || s === "0,75l") && (w.includes("750") || w.includes("0.75") || w.includes("0,75") || w.includes("75cl"))) {
    return true;
  }
  // 0,5L vs 500ml / 50cl / 0.5l
  if ((s === "0.5l" || s === "0,5l") && (w.includes("500") || w.includes("0.5") || w.includes("0,5") || w.includes("50cl"))) {
    return true;
  }
  // 1,5L vs 1500ml / 1.5l / magnum
  if ((s === "1.5l" || s === "1,5l") && (w.includes("1500") || w.includes("1.5") || w.includes("1,5") || w.includes("magnum"))) {
    return true;
  }
  // 60ml
  if (s === "60ml" && w.includes("60")) {
    return true;
  }
  // Caixa
  if (s === "caixa" && (w.includes("caixa") || w.includes("box") || w.includes("pack"))) {
    return true;
  }

  return w.includes(s);
}

// Helper para comparar categoria
function matchesCategory(wine: Wine, selectedCategory: string): boolean {
  if (!selectedCategory || selectedCategory === "all") return true;

  const wCat = (wine.category || "").toLowerCase().trim();
  const sCat = selectedCategory.toLowerCase().trim();
  const title = (wine.title || "").toLowerCase();

  if (selectedCategory === "Vinhos") {
    // Se explicitamente marcada como Vinhos, ou produto padrão sem marca externa
    return (
      wCat === "vinhos" ||
      (!wine.category &&
        !title.includes("aveleda") &&
        !title.includes("adega velha") &&
        !title.includes("casal garcia") &&
        !title.includes("mandriola") &&
        !title.includes("quinta") &&
        !title.includes("villa alvor"))
    );
  }

  if (wCat === sCat) return true;
  return title.includes(sCat);
}

// Helper para comparar tipo de vinho
function matchesWineType(wineColor: string | undefined, selectedType: string): boolean {
  if (!selectedType || selectedType === "all") return true;
  if (!wineColor) return false;

  const w = wineColor.toLowerCase().replace(/\s+/g, "");
  const s = selectedType.toLowerCase().replace(/\s+/g, "");

  if (w === s) return true;

  // Fortificado
  if (s.includes("fortificado") && w.includes("fortificado")) return true;

  // Bebida Aromatizada
  if (s.includes("aromatizada") && w.includes("aromatizada")) return true;

  // Normalização de acentos (Rosé / Rose)
  const normW = w.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const normS = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (normW === normS) return true;

  return w.includes(s);
}

export function Shop() {
  const { addToCart, openQuickView } = useCart();
  const { wines } = useAdmin();

  // Estados dos Filtros
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCapacity, setSelectedCapacity] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<number>(PRICE_MIN);
  const [maxPrice, setMaxPrice] = useState<number>(PRICE_MAX);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");

  // Controlo mobile do painel de filtros
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Estados de acordeão na sidebar
  const [openSections, setOpenSections] = useState<{
    category: boolean;
    type: boolean;
    capacity: boolean;
    price: boolean;
    year: boolean;
  }>({
    category: true,
    type: true,
    capacity: true,
    price: true,
    year: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Contagem de filtros ativos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "all") count++;
    if (selectedType !== "all") count++;
    if (selectedCapacity !== "all") count++;
    if (selectedYear !== "all") count++;
    if (minPrice > PRICE_MIN || maxPrice < PRICE_MAX) count++;
    if (searchTerm.trim() !== "") count++;
    return count;
  }, [selectedCategory, selectedType, selectedCapacity, selectedYear, minPrice, maxPrice, searchTerm]);

  // Limpar todos os filtros
  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedType("all");
    setSelectedCapacity("all");
    setSelectedYear("all");
    setMinPrice(PRICE_MIN);
    setMaxPrice(PRICE_MAX);
    setSearchTerm("");
    setSortBy("featured");
  };

  // Filtragem dos vinhos
  const filteredWines = useMemo(() => {
    let list = wines.filter((wine) => {
      const matchCat = matchesCategory(wine, selectedCategory);
      const matchType = matchesWineType(wine.color, selectedType);
      const matchCap = matchesCapacity(wine.volume, selectedCapacity);
      const matchYear = selectedYear === "all" || wine.year?.trim() === selectedYear.trim();
      const matchPrice = wine.price >= minPrice && wine.price <= maxPrice;

      const matchSearch =
        searchTerm.trim() === "" ||
        wine.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wine.grapes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wine.desc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wine.range?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchCat && matchType && matchCap && matchYear && matchPrice && matchSearch;
    });

    // Ordenação
    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "year-desc") {
      list.sort((a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0));
    } else if (sortBy === "name-asc") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [wines, selectedCategory, selectedType, selectedCapacity, selectedYear, minPrice, maxPrice, searchTerm, sortBy]);

  // Conteúdo da barra lateral de filtros (reutilizado em desktop e no drawer mobile)
  const FilterSidebarContent = (
    <div className="space-y-6">
      {/* Cabeçalho da Sidebar */}
      <div className="flex items-center justify-between pb-4 border-b border-bege/10">
        <div className="flex items-center gap-2.5">
          <Sliders className="w-4 h-4 text-dourado" />
          <h2 className="font-brand uppercase text-lg text-bege tracking-wide">Filtros</h2>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-dourado text-[#0D0B0C] text-[10px] font-bold font-downey">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-[11px] font-downey uppercase tracking-wider text-dourado hover:underline transition cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Limpar
          </button>
        )}
      </div>

      {/* 1. Categorias de Produto */}
      <div className="border-b border-bege/10 pb-5">
        <button
          type="button"
          onClick={() => toggleSection("category")}
          className="w-full flex items-center justify-between py-1 text-left group cursor-pointer"
        >
          <span className="flex items-center gap-2 font-downey text-xs uppercase tracking-[0.16em] text-dourado font-semibold">
            <Layers className="w-3.5 h-3.5" />
            Categorias de Produto
          </span>
          {openSections.category ? (
            <ChevronUp className="w-4 h-4 text-bege-muted group-hover:text-dourado transition" />
          ) : (
            <ChevronDown className="w-4 h-4 text-bege-muted group-hover:text-dourado transition" />
          )}
        </button>

        {openSections.category && (
          <div className="mt-3 space-y-1.5">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-dourado/15 text-dourado border border-dourado/40 font-medium"
                  : "text-bege-dark hover:bg-white/[0.04] hover:text-bege"
              }`}
            >
              <span>Todas as Categorias</span>
              {selectedCategory === "all" && <Check className="w-3.5 h-3.5 text-dourado" />}
            </button>
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(selectedCategory === cat ? "all" : cat)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-dourado/15 text-dourado border border-dourado/40 font-medium"
                    : "text-bege-dark hover:bg-white/[0.04] hover:text-bege"
                }`}
              >
                <span>{cat}</span>
                {selectedCategory === cat && <Check className="w-3.5 h-3.5 text-dourado" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Tipo de Vinho */}
      <div className="border-b border-bege/10 pb-5">
        <button
          type="button"
          onClick={() => toggleSection("type")}
          className="w-full flex items-center justify-between py-1 text-left group cursor-pointer"
        >
          <span className="flex items-center gap-2 font-downey text-xs uppercase tracking-[0.16em] text-dourado font-semibold">
            <WineIcon className="w-3.5 h-3.5" />
            Tipo de Vinho
          </span>
          {openSections.type ? (
            <ChevronUp className="w-4 h-4 text-bege-muted group-hover:text-dourado transition" />
          ) : (
            <ChevronDown className="w-4 h-4 text-bege-muted group-hover:text-dourado transition" />
          )}
        </button>

        {openSections.type && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedType("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-downey tracking-wider uppercase transition cursor-pointer ${
                selectedType === "all"
                  ? "bg-bordo text-bege border border-dourado/50 font-bold"
                  : "bg-vinicoa-noir/60 text-bege-dark border border-bege/15 hover:border-dourado/40 hover:text-bege"
              }`}
            >
              Todos
            </button>
            {WINE_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(selectedType === type ? "all" : type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-downey tracking-wider uppercase transition cursor-pointer ${
                  selectedType === type
                    ? "bg-bordo text-bege border border-dourado/50 font-bold"
                    : "bg-vinicoa-noir/60 text-bege-dark border border-bege/15 hover:border-dourado/40 hover:text-bege"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Capacidade */}
      <div className="border-b border-bege/10 pb-5">
        <button
          type="button"
          onClick={() => toggleSection("capacity")}
          className="w-full flex items-center justify-between py-1 text-left group cursor-pointer"
        >
          <span className="flex items-center gap-2 font-downey text-xs uppercase tracking-[0.16em] text-dourado font-semibold">
            <Boxes className="w-3.5 h-3.5" />
            Capacidade
          </span>
          {openSections.capacity ? (
            <ChevronUp className="w-4 h-4 text-bege-muted group-hover:text-dourado transition" />
          ) : (
            <ChevronDown className="w-4 h-4 text-bege-muted group-hover:text-dourado transition" />
          )}
        </button>

        {openSections.capacity && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedCapacity("all")}
              className={`px-2.5 py-2 rounded-xl text-center text-xs font-downey tracking-wider uppercase transition cursor-pointer ${
                selectedCapacity === "all"
                  ? "bg-dourado text-[#0D0B0C] font-bold border border-dourado"
                  : "bg-vinicoa-noir/60 text-bege-dark border border-bege/15 hover:border-dourado/40 hover:text-bege"
              }`}
            >
              Todas
            </button>
            {CAPACITIES.map((cap) => (
              <button
                key={cap}
                type="button"
                onClick={() => setSelectedCapacity(selectedCapacity === cap ? "all" : cap)}
                className={`px-2.5 py-2 rounded-xl text-center text-xs font-downey tracking-wider uppercase transition cursor-pointer ${
                  selectedCapacity === cap
                    ? "bg-dourado text-[#0D0B0C] font-bold border border-dourado"
                    : "bg-vinicoa-noir/60 text-bege-dark border border-bege/15 hover:border-dourado/40 hover:text-bege"
                }`}
              >
                {cap}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. Preço (4€ a 900€) */}
      <div className="border-b border-bege/10 pb-5">
        <button
          type="button"
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between py-1 text-left group cursor-pointer"
        >
          <span className="flex items-center gap-2 font-downey text-xs uppercase tracking-[0.16em] text-dourado font-semibold">
            <Euro className="w-3.5 h-3.5" />
            Preço ({PRICE_MIN}€ a {PRICE_MAX}€)
          </span>
          {openSections.price ? (
            <ChevronUp className="w-4 h-4 text-bege-muted group-hover:text-dourado transition" />
          ) : (
            <ChevronDown className="w-4 h-4 text-bege-muted group-hover:text-dourado transition" />
          )}
        </button>

        {openSections.price && (
          <div className="mt-3 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-bege-muted">Intervalo:</span>
              <span className="font-brand text-dourado font-bold text-sm">
                {minPrice} € — {maxPrice} €
              </span>
            </div>

            {/* Slider de Preço Máximo */}
            <div>
              <div className="flex justify-between text-[11px] text-bege-muted mb-1">
                <span>Até: {formatMoney(maxPrice)}</span>
                <span>{PRICE_MAX}€</span>
              </div>
              <input
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={1}
                value={maxPrice}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMaxPrice(val);
                  if (val < minPrice) setMinPrice(val);
                }}
                className="w-full accent-dourado cursor-pointer h-2 bg-vinicoa-noir rounded-lg"
              />
            </div>

            {/* Inputs Manuais de Min e Max */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="block text-[10px] uppercase font-downey text-bege-muted mb-1">Mínimo</label>
                <div className="relative">
                  <input
                    type="number"
                    min={PRICE_MIN}
                    max={maxPrice}
                    value={minPrice}
                    onChange={(e) => setMinPrice(Math.max(PRICE_MIN, Math.min(Number(e.target.value), maxPrice)))}
                    className="w-full bg-vinicoa-noir border border-bege/20 rounded-lg px-2.5 py-1.5 text-xs text-bege focus:border-dourado focus:outline-none"
                  />
                  <span className="absolute right-2 top-1.5 text-xs text-bege-muted">€</span>
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-downey text-bege-muted mb-1">Máximo</label>
                <div className="relative">
                  <input
                    type="number"
                    min={minPrice}
                    max={PRICE_MAX}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Math.min(PRICE_MAX, Math.max(Number(e.target.value), minPrice)))}
                    className="w-full bg-vinicoa-noir border border-bege/20 rounded-lg px-2.5 py-1.5 text-xs text-bege focus:border-dourado focus:outline-none"
                  />
                  <span className="absolute right-2 top-1.5 text-xs text-bege-muted">€</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Colheita */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection("year")}
          className="w-full flex items-center justify-between py-1 text-left group cursor-pointer"
        >
          <span className="flex items-center gap-2 font-downey text-xs uppercase tracking-[0.16em] text-dourado font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            Colheita
          </span>
          {openSections.year ? (
            <ChevronUp className="w-4 h-4 text-bege-muted group-hover:text-dourado transition" />
          ) : (
            <ChevronDown className="w-4 h-4 text-bege-muted group-hover:text-dourado transition" />
          )}
        </button>

        {openSections.year && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedYear("all")}
              className={`px-2.5 py-2 rounded-xl text-center text-xs font-downey tracking-wider uppercase transition cursor-pointer ${
                selectedYear === "all"
                  ? "bg-dourado text-[#0D0B0C] font-bold border border-dourado"
                  : "bg-vinicoa-noir/60 text-bege-dark border border-bege/15 hover:border-dourado/40 hover:text-bege"
              }`}
            >
              Todas
            </button>
            {HARVEST_YEARS.map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setSelectedYear(selectedYear === yr ? "all" : yr)}
                className={`px-2.5 py-2 rounded-xl text-center text-xs font-downey tracking-wider uppercase transition cursor-pointer ${
                  selectedYear === yr
                    ? "bg-dourado text-[#0D0B0C] font-bold border border-dourado"
                    : "bg-vinicoa-noir/60 text-bege-dark border border-bege/15 hover:border-dourado/40 hover:text-bege"
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="pt-36 sm:pt-40 md:pt-44 pb-20 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
        {/* Top Header */}
        <div data-reveal className="mb-8 pb-5 border-b border-bege/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-dourado font-semibold block mb-1">
                Coleção Vinicôa
              </span>
              <h1 className="font-brand text-3xl sm:text-5xl text-bege font-bold">
                A Nossa Garrafeira
              </h1>
            </div>

            {/* Mobile / Tablet Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileDrawerOpen(true)}
                className="lg:hidden px-4 py-2.5 rounded-xl glass-luxury border border-dourado/40 text-bege text-xs uppercase font-bold flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Filter className="w-3.5 h-3.5 text-dourado" />
                <span>Filtros</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-dourado text-[#0D0B0C] text-[10px] flex items-center justify-center font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2 bg-vinicoa-noir/70 border border-bege/15 rounded-xl px-3 py-2 text-xs text-bege">
                <ArrowUpDown className="w-3.5 h-3.5 text-dourado" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-bege focus:outline-none cursor-pointer pr-2"
                >
                  <option value="featured" className="bg-[#0D0B0C] text-bege">Destaques</option>
                  <option value="price-asc" className="bg-[#0D0B0C] text-bege">Preço: Menor para Maior</option>
                  <option value="price-desc" className="bg-[#0D0B0C] text-bege">Preço: Maior para Menor</option>
                  <option value="year-desc" className="bg-[#0D0B0C] text-bege">Colheita Mais Recente</option>
                  <option value="name-asc" className="bg-[#0D0B0C] text-bege">Nome: A - Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Barra de Pesquisa e Tags de Filtro Ativo */}
          <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-bege-muted" />
              <input
                type="text"
                placeholder="Pesquisar vinho, produtor, castas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-vinicoa-noir/80 border border-bege/20 rounded-xl pl-10 pr-9 py-2 text-xs text-bege placeholder-bege-muted/60 focus:border-dourado focus:outline-none transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-bege-muted hover:text-dourado"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Contagem de Resultados */}
            <span className="text-xs text-bege-muted font-medium self-center md:self-auto">
              A apresentar <strong className="text-dourado">{filteredWines.length}</strong> {filteredWines.length === 1 ? "produto" : "produtos"}
            </span>
          </div>

          {/* Chips de Filtros Ativos */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-bege/5">
              <span className="text-[11px] font-downey uppercase tracking-wider text-bege-muted">Filtros ativos:</span>

              {selectedCategory !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dourado/15 border border-dourado/40 text-dourado text-xs">
                  <span>Categoria: {selectedCategory}</span>
                  <button onClick={() => setSelectedCategory("all")} className="hover:text-white"><X className="w-3 h-3" /></button>
                </span>
              )}

              {selectedType !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dourado/15 border border-dourado/40 text-dourado text-xs">
                  <span>Tipo: {selectedType}</span>
                  <button onClick={() => setSelectedType("all")} className="hover:text-white"><X className="w-3 h-3" /></button>
                </span>
              )}

              {selectedCapacity !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dourado/15 border border-dourado/40 text-dourado text-xs">
                  <span>Capacidade: {selectedCapacity}</span>
                  <button onClick={() => setSelectedCapacity("all")} className="hover:text-white"><X className="w-3 h-3" /></button>
                </span>
              )}

              {selectedYear !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dourado/15 border border-dourado/40 text-dourado text-xs">
                  <span>Ano: {selectedYear}</span>
                  <button onClick={() => setSelectedYear("all")} className="hover:text-white"><X className="w-3 h-3" /></button>
                </span>
              )}

              {(minPrice > PRICE_MIN || maxPrice < PRICE_MAX) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dourado/15 border border-dourado/40 text-dourado text-xs">
                  <span>Preço: {minPrice}€ - {maxPrice}€</span>
                  <button onClick={() => { setMinPrice(PRICE_MIN); setMaxPrice(PRICE_MAX); }} className="hover:text-white"><X className="w-3 h-3" /></button>
                </span>
              )}

              {searchTerm.trim() !== "" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dourado/15 border border-dourado/40 text-dourado text-xs">
                  <span>Busca: "{searchTerm}"</span>
                  <button onClick={() => setSearchTerm("")} className="hover:text-white"><X className="w-3 h-3" /></button>
                </span>
              )}

              <button
                onClick={resetFilters}
                className="text-xs text-dourado hover:underline uppercase tracking-wider font-downey ml-2 cursor-pointer"
              >
                Limpar todos
              </button>
            </div>
          )}
        </div>

        {/* Layout Principal: Sidebar ao Alto à Esquerda + Grid de Produtos */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* SIDEBAR DE FILTROS (AO ALTO, À ESQUERDA) */}
          <aside className="hidden lg:block w-72 xl:w-80 shrink-0 lg:sticky lg:top-28">
            <div className="glass-luxury p-6 rounded-2xl border border-dourado/20 shadow-2xl">
              {FilterSidebarContent}
            </div>
          </aside>

          {/* GRID DE PRODUTOS (À DIREITA) */}
          <main className="flex-1 min-w-0 w-full">
            {filteredWines.length === 0 ? (
              <div className="text-center py-24 glass-luxury rounded-2xl border border-bege/10 p-8">
                <WineIcon className="w-14 h-14 mx-auto text-dourado/40 mb-4" />
                <h3 className="text-xl text-bege font-brand uppercase mb-2">
                  Nenhum vinho encontrado
                </h3>
                <p className="text-sm text-bege-dark max-w-md mx-auto mb-6">
                  Não encontramos produtos que correspondam a todos os filtros selecionados.
                  Tente alargar os critérios de pesquisa ou limpar os filtros.
                </p>
                <button
                  onClick={resetFilters}
                  className="btn-brand btn-bordo !py-2.5 !px-6 !text-xs cursor-pointer inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Limpar Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredWines.map((wine, i) => (
                  <div
                    key={wine.id}
                    data-reveal
                    data-reveal-delay={String(Math.min((i % 3) + 1, 6))}
                    className="rounded-2xl glass-luxury border border-bege/10 p-5 flex flex-col justify-between group hover:border-dourado/50 transition-all duration-300 shadow-lg hover:shadow-2xl"
                  >
                    <Link to={`/vinhos/${wine.id}`} className="block">
                      {/* Imagem do Produto com Selo */}
                      <div className="relative bg-vinicoa-noir/80 rounded-xl p-6 mb-4 flex items-center justify-center overflow-hidden min-h-[240px]">
                        {wine.badge && (
                          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-bordo/80 text-bege text-[9px] uppercase font-bold tracking-widest border border-dourado/30 z-10">
                            {wine.badge}
                          </span>
                        )}
                        <img
                          src={wine.image}
                          alt={wine.title}
                          className="h-56 object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-[0_20px_25px_rgba(0,0,0,0.65)]"
                        />
                      </div>

                      {/* Meta Informações */}
                      <div className="flex items-center justify-between text-xs text-dourado mb-1">
                        <span className="font-downey uppercase tracking-wider">
                          {wine.color} • {wine.range}
                        </span>
                        <span className="font-downey text-[11px] text-bege-muted">
                          {wine.volume}
                        </span>
                      </div>

                      {/* Título do Vinho */}
                      <h3 className="font-brand text-xl text-bege font-bold mb-1 group-hover:text-dourado transition line-clamp-1">
                        {wine.title}
                      </h3>

                      {/* Descrição */}
                      <p className="text-xs text-bege-dark line-clamp-2 mb-4 leading-relaxed font-light">
                        {wine.grapes ? `${wine.grapes}. ` : ""}{wine.desc}
                      </p>
                    </Link>

                    {/* Preço e Botões */}
                    <div className="pt-4 border-t border-bege/10 flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-lg font-bold text-dourado font-brand">
                          {formatMoney(wine.price)}
                        </span>
                        <span className="block text-[10px] text-bege-muted">Colheita {wine.year}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openQuickView(wine.id)}
                          className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-bege hover:text-dourado transition border border-bege/20 cursor-pointer"
                          aria-label="Ver perfil sensorial"
                          title="Ver perfil sensorial"
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
          </main>
        </div>
      </div>

      {/* DRAWER MOBILE SLIDE-OVER */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Painel lateral deslizante */}
          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div className="w-screen max-w-sm glass-luxury bg-[#0D0B0C] border-r border-dourado/30 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-bege/15">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-dourado" />
                    <h3 className="font-brand uppercase text-xl text-bege">Filtros</h3>
                  </div>
                  <button
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-bege hover:bg-white/10 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {FilterSidebarContent}
              </div>

              {/* Botão de Fechar e Aplicar */}
              <div className="pt-6 mt-6 border-t border-bege/15">
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="w-full btn-brand btn-bordo !py-3 text-center !text-xs cursor-pointer"
                >
                  Ver {filteredWines.length} {filteredWines.length === 1 ? "Produto" : "Produtos"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA DE INCENTIVO À COMPRA DE VINHOS */}
      <WinePurchaseCTA />

      {/* DO SABUGAL PARA O MUNDO */}
      <GlobeSection />
    </div>
  );
}

export default Shop;
