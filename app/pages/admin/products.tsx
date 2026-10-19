import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router";
import {
  Plus,
  Search,
  Sparkles,
  Edit2,
  Trash2,
  Check,
  X,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { useAdmin } from "../../lib/admin-context";
import { formatMoney } from "../../lib/wines";
import type { Wine } from "../../types/wine";

// 1. Categorias de Produto solicitadas
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

// 2. Tipos de Vinho solicitados
export const WINE_TYPES = [
  "Tinto",
  "Branco",
  "Rosé",
  "Espumante",
  "O Fortificado",
  "Aguardente",
  "Bebida Aromatizada à Base de Vinho",
  "Sangria",
] as const;

// 3. Capacidades solicitadas
export const CAPACITIES = [
  "0,75L",
  "0,5L",
  "1,5L",
  "60ml",
  "Caixa",
] as const;

// 4. Colheitas / Anos solicitados
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

interface WineFormData {
  title: string;
  category: string;
  color: string; // Tipo de Vinho
  range: string;
  year: string;
  isCustomYear: boolean;
  customYear: string;
  volume: string;
  isCustomVolume: boolean;
  customVolume: string;
  price: string;
  stock: string;
  badge: string;
  grapes: string;
  desc: string;
  pairing: string;
  corpo: number;
  taninos: number;
  acidez: number;
  featuredHome: boolean;
  image: string;
  secondaryImage: string;
  paymentUrl: string;
}

export default function AdminProductsPage() {
  const { wines, addWine, updateWine, deleteWine, toggleFeatured } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filtros na barra superior da lista
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [capacityFilter, setCapacityFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false);

  // Modais & Alertas
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWineId, setEditingWineId] = useState<Wine["id"] | null>(null);
  const [wineToDelete, setWineToDelete] = useState<Wine | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [primaryImageFile, setPrimaryImageFile] = useState<File | null>(null);
  const [secondaryImageFile, setSecondaryImageFile] = useState<File | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Formulário com valores por defeito
  const [formData, setFormData] = useState<WineFormData>({
    title: "",
    category: "Vinhos",
    color: "Tinto",
    range: "Reserva",
    year: "2022",
    isCustomYear: false,
    customYear: "",
    volume: "0,75L",
    isCustomVolume: false,
    customVolume: "",
    price: "24.50",
    stock: "60",
    badge: "Escolha do Enólogo",
    grapes: "Touriga Nacional & Tinta Roriz",
    desc: "Vinho de altitude com identidade granítica do Sabugal.",
    pairing: "Carnes maturadas e queijos curados.",
    corpo: 80,
    taninos: 75,
    acidez: 70,
    featuredHome: true,
    image: "",
    secondaryImage: "",
    paymentUrl: "",
  });

  // Abrir modal se vier via query param ?novo=true
  useEffect(() => {
    if (searchParams.get("novo") === "true") {
      openAddModal();
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  const openAddModal = () => {
    setEditingWineId(null);
    setPriceError(null);
    setPrimaryImageFile(null);
    setSecondaryImageFile(null);
    setFormData({
      title: "",
      category: "Vinhos",
      color: "Tinto",
      range: "Reserva",
      year: "2022",
      isCustomYear: false,
      customYear: "",
      volume: "0,75L",
      isCustomVolume: false,
      customVolume: "",
      price: "24.50",
      stock: "50",
      badge: "",
      grapes: "",
      desc: "",
      pairing: "",
      corpo: 75,
      taninos: 70,
      acidez: 65,
      featuredHome: false,
      image: "",
      secondaryImage: "",
      paymentUrl: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (wine: Wine) => {
    setEditingWineId(wine.id);
    setPriceError(null);
    setPrimaryImageFile(null);
    setSecondaryImageFile(null);

    const isKnownYear = HARVEST_YEARS.includes(wine.year as any);
    const isKnownVolume = CAPACITIES.includes(wine.volume as any);

    setFormData({
      title: wine.title,
      category: wine.category || "Vinhos",
      color: wine.color || "Tinto",
      range: wine.range || "Reserva",
      year: isKnownYear ? wine.year : "custom",
      isCustomYear: !isKnownYear,
      customYear: isKnownYear ? "" : wine.year,
      volume: isKnownVolume ? wine.volume : "custom",
      isCustomVolume: !isKnownVolume,
      customVolume: isKnownVolume ? "" : wine.volume,
      price: wine.price.toString(),
      stock: wine.stock.toString(),
      badge: wine.badge || "",
      grapes: wine.grapes || "",
      desc: wine.desc || "",
      pairing: wine.pairing || "",
      corpo: wine.corpo || 75,
      taninos: wine.taninos || 70,
      acidez: wine.acidez || 65,
      featuredHome: wine.featuredHome ?? false,
      image: wine.image || "",
      secondaryImage: wine.secondaryImage || "",
      paymentUrl: wine.paymentUrl || "",
    });
    setIsModalOpen(true);
  };

  const handlePriceChange = (value: string) => {
    setFormData((prev) => ({ ...prev, price: value }));
    const parsed = parseFloat(value.replace(",", "."));
    if (isNaN(parsed)) {
      setPriceError("Por favor, introduza um valor numérico válido.");
    } else if (parsed < 4 || parsed > 900) {
      setPriceError("O preço deve estar compreendido entre 4€ e 900€.");
    } else {
      setPriceError(null);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    // Validação de Preço (4€ a 900€)
    const parsedPrice = parseFloat(formData.price.replace(",", "."));
    if (isNaN(parsedPrice) || parsedPrice < 4 || parsedPrice > 900) {
      setPriceError("O preço deve estar compreendido entre 4,00 € e 900,00 €.");
      return;
    }

    const parsedStock = parseInt(formData.stock, 10) || 0;
    const finalYear = formData.isCustomYear
      ? formData.customYear.trim() || "2024"
      : formData.year;
    const finalVolume = formData.isCustomVolume
      ? formData.customVolume.trim() || "0,75L"
      : formData.volume;

    const winePayload = {
      title: formData.title.trim(),
      category: formData.category,
      color: formData.color,
      range: formData.range,
      year: finalYear,
      volume: finalVolume,
      price: parsedPrice,
      stock: parsedStock,
      badge: formData.badge.trim() || undefined,
      grapes: formData.grapes.trim() || "Castas Selecionadas",
      desc: formData.desc.trim() || "Vinho de altitude com identidade de excelência.",
      pairing: formData.pairing.trim() || "Gastronomia regional e queijos selecionados.",
      corpo: Number(formData.corpo),
      taninos: Number(formData.taninos),
      acidez: Number(formData.acidez),
      featuredHome: formData.featuredHome,
      image: formData.image.trim(),
      secondaryImage: formData.secondaryImage.trim(),
      paymentUrl: formData.paymentUrl.trim(),
    };

    try {
      if (editingWineId !== null) {
        await updateWine(editingWineId, winePayload, {
          primary: primaryImageFile || undefined,
          secondary: secondaryImageFile || undefined,
        });
        showToast(`Produto "${winePayload.title}" atualizado.`);
      } else {
        await addWine(winePayload, {
          primary: primaryImageFile || undefined,
          secondary: secondaryImageFile || undefined,
        });
        showToast(`Produto "${winePayload.title}" criado.`);
      }
      setIsModalOpen(false);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Não foi possível guardar o produto.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!wineToDelete) return;
    try {
      await deleteWine(wineToDelete.id);
      showToast(`Produto "${wineToDelete.title}" removido.`);
      setWineToDelete(null);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Não foi possível remover o produto.");
    }
  };

  // Filtragem
  const filteredWines = useMemo(() => {
    return wines.filter((wine) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        wine.title.toLowerCase().includes(q) ||
        wine.year.includes(q) ||
        (wine.grapes && wine.grapes.toLowerCase().includes(q)) ||
        (wine.category && wine.category.toLowerCase().includes(q));

      const matchCategory =
        categoryFilter === "all" || wine.category === categoryFilter;
      const matchType = typeFilter === "all" || wine.color === typeFilter;
      const matchCapacity =
        capacityFilter === "all" ||
        wine.volume === capacityFilter ||
        (capacityFilter === "0,75L" && (wine.volume === "750ml" || wine.volume === "0,75L"));
      const matchYear = yearFilter === "all" || wine.year === yearFilter;
      const matchFeatured = !onlyFeatured || wine.featuredHome;

      return matchSearch && matchCategory && matchType && matchCapacity && matchYear && matchFeatured;
    });
  }, [wines, searchTerm, categoryFilter, typeFilter, capacityFilter, yearFilter, onlyFeatured]);

  const hasActiveFilters =
    searchTerm ||
    categoryFilter !== "all" ||
    typeFilter !== "all" ||
    capacityFilter !== "all" ||
    yearFilter !== "all" ||
    onlyFeatured;

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setTypeFilter("all");
    setCapacityFilter("all");
    setYearFilter("all");
    setOnlyFeatured(false);
  };

  return (
    <AdminLayout
      title="Produtos"
      subtitle="Adicionar, editar e filtrar produtos com opções de categoria, tipo, colheita e capacidade."
      action={
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black hover:bg-white/90 text-xs font-medium font-sans transition cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Produto</span>
        </button>
      }
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-[#181718] border border-white/10 text-white text-xs font-sans shadow-2xl flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-[#C49A4A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* BARRA DE FILTROS SUPER CLEAN & MODERNA COM DROPDOWNS ELEGANTES */}
        <div className="p-4 rounded-2xl bg-[#121112] border border-white/[0.07] space-y-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Campo de pesquisa simples */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar por nome, casta ou ano..."
                className="w-full pl-10 pr-8 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition font-sans"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dropdowns Bonitos para Seleção de Filtros */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Dropdown: Categorias de Produto */}
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="appearance-none bg-black/40 border border-white/[0.08] text-xs text-[#E8DCC6] py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:border-[#C49A4A] cursor-pointer"
                >
                  <option value="all">Todas as Categorias</option>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-white/40 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Dropdown: Tipo de Vinho */}
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="appearance-none bg-black/40 border border-white/[0.08] text-xs text-[#E8DCC6] py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:border-[#C49A4A] cursor-pointer"
                >
                  <option value="all">Todos os Tipos</option>
                  {WINE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-white/40 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Dropdown: Capacidade */}
              <div className="relative">
                <select
                  value={capacityFilter}
                  onChange={(e) => setCapacityFilter(e.target.value)}
                  className="appearance-none bg-black/40 border border-white/[0.08] text-xs text-[#E8DCC6] py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:border-[#C49A4A] cursor-pointer"
                >
                  <option value="all">Capacidade (Todas)</option>
                  {CAPACITIES.map((cap) => (
                    <option key={cap} value={cap}>
                      {cap}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-white/40 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Dropdown: Colheita */}
              <div className="relative">
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="appearance-none bg-black/40 border border-white/[0.08] text-xs text-[#E8DCC6] py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:border-[#C49A4A] cursor-pointer"
                >
                  <option value="all">Colheita (Todas)</option>
                  {HARVEST_YEARS.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-white/40 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Toggle: Apenas no Carrossel */}
              <button
                type="button"
                onClick={() => setOnlyFeatured(!onlyFeatured)}
                className={`px-3 py-2 rounded-xl border text-xs font-sans transition cursor-pointer flex items-center gap-1.5 ${
                  onlyFeatured
                    ? "border-[#C49A4A]/50 bg-[#C49A4A]/10 text-[#C49A4A]"
                    : "border-white/[0.08] bg-black/40 text-white/50 hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>No Carrossel</span>
              </button>

              {/* Limpar Filtros */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-[#C49A4A] hover:underline px-2 py-1 transition"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* TABELA DE PRODUTOS ULTRA LIMPA */}
        <div className="bg-[#121112] rounded-2xl border border-white/[0.06] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06] text-[11px] font-sans text-white/40 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Produto / Garrafa</th>
                  <th className="py-3.5 px-4">Categoria & Tipo</th>
                  <th className="py-3.5 px-4">Capacidade</th>
                  <th className="py-3.5 px-4">Preço</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4 text-center">Carrossel Home</th>
                  <th className="py-3.5 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-xs font-sans">
                {filteredWines.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-white/40">
                      Nenhum vinho encontrado com os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  filteredWines.map((wine) => (
                    <tr
                      key={wine.id}
                      className="hover:bg-white/[0.015] transition group"
                    >
                      {/* Vinho */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={wine.image}
                            alt={wine.title}
                            className="w-7 h-10 object-contain shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-medium text-white block truncate">
                              {wine.title}
                            </span>
                            <span className="text-[11px] text-white/40">
                              Colheita {wine.year}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Categoria & Tipo */}
                      <td className="py-3.5 px-4">
                        <span className="text-white block font-medium">
                          {wine.category || "Vinhos"}
                        </span>
                        <span className="text-[11px] text-white/50 block">
                          {wine.color}
                        </span>
                      </td>

                      {/* Capacidade */}
                      <td className="py-3.5 px-4 text-white/60">
                        {wine.volume}
                      </td>

                      {/* Preço */}
                      <td className="py-3.5 px-4 text-white font-medium">
                        {formatMoney(wine.price)}
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-4">
                        <span
                          className={
                            wine.stock < 20
                              ? "text-amber-400 font-medium"
                              : "text-white/60"
                          }
                        >
                          {wine.stock} un.
                        </span>
                      </td>

                      {/* Toggle Carrossel Home */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => void toggleFeatured(wine.id).catch((error) =>
                            showToast(error instanceof Error ? error.message : "Não foi possível atualizar o destaque.")
                          )}
                          className={`px-3 py-1 rounded-lg text-xs font-sans transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                            wine.featuredHome
                              ? "bg-[#C49A4A]/15 text-[#C49A4A] border border-[#C49A4A]/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
                              : "bg-white/[0.04] text-white/40 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
                          }`}
                          title={
                            wine.featuredHome
                              ? "Clique para remover do carrossel"
                              : "Clique para colocar no carrossel da Home"
                          }
                        >
                          {wine.featuredHome ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>No Carrossel</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Adicionar</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Ações */}
                      <td className="py-3.5 px-6 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(wine)}
                            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.05] transition"
                            title="Editar produto"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setWineToDelete(wine)}
                            className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition"
                            title="Remover produto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL ADICIONAR / EDITAR PRODUTO COM OS FILTROS SOLICITADOS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#141314] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1 text-white/40 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h3 className="font-brand uppercase text-xl text-white tracking-wide">
                {editingWineId ? "Editar Produto" : "Adicionar Novo Produto"}
              </h3>
              <p className="text-xs text-white/50 font-sans mt-0.5">
                Preencha os detalhes e selecione os filtros do catálogo.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-sans">
              {/* 1. Nome do Produto (Escrita) */}
              <div>
                <label className="block text-white/70 mb-1.5 font-medium">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Ex: Quinta Vale D. Maria Vinhas Velhas Tinto"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#C49A4A] transition"
                />
              </div>

              {/* 2. Categorias de Produto & Tipo de Vinho (Dropdowns Bonitos) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Categorias de Produto */}
                <div>
                  <label className="block text-white/70 mb-1.5 font-medium">
                    Categoria de Produto *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full appearance-none px-3.5 py-2.5 pr-9 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#C49A4A] transition cursor-pointer"
                    >
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Tipo de Vinho */}
                <div>
                  <label className="block text-white/70 mb-1.5 font-medium">
                    Tipo de Vinho *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      className="w-full appearance-none px-3.5 py-2.5 pr-9 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#C49A4A] transition cursor-pointer"
                    >
                      {WINE_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* 3. Capacidade & Colheita (Dropdowns Bonitos com opção de escrita se necessário) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Capacidade */}
                <div>
                  <label className="block text-white/70 mb-1.5 font-medium">
                    Capacidade *
                  </label>
                  <div className="space-y-2">
                    <div className="relative">
                      <select
                        value={formData.isCustomVolume ? "custom" : formData.volume}
                        onChange={(e) => {
                          if (e.target.value === "custom") {
                            setFormData({
                              ...formData,
                              isCustomVolume: true,
                              volume: "custom",
                            });
                          } else {
                            setFormData({
                              ...formData,
                              isCustomVolume: false,
                              volume: e.target.value,
                            });
                          }
                        }}
                        className="w-full appearance-none px-3.5 py-2.5 pr-9 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#C49A4A] transition cursor-pointer"
                      >
                        {CAPACITIES.map((cap) => (
                          <option key={cap} value={cap}>
                            {cap}
                          </option>
                        ))}
                        <option value="custom">Outra capacidade (escrever manual)...</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {formData.isCustomVolume && (
                      <input
                        type="text"
                        value={formData.customVolume}
                        onChange={(e) =>
                          setFormData({ ...formData, customVolume: e.target.value })
                        }
                        placeholder="Ex: 3L (Jeroboam)"
                        className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:border-[#C49A4A]"
                      />
                    )}
                  </div>
                </div>

                {/* Colheita / Ano */}
                <div>
                  <label className="block text-white/70 mb-1.5 font-medium">
                    Colheita *
                  </label>
                  <div className="space-y-2">
                    <div className="relative">
                      <select
                        value={formData.isCustomYear ? "custom" : formData.year}
                        onChange={(e) => {
                          if (e.target.value === "custom") {
                            setFormData({
                              ...formData,
                              isCustomYear: true,
                              year: "custom",
                            });
                          } else {
                            setFormData({
                              ...formData,
                              isCustomYear: false,
                              year: e.target.value,
                            });
                          }
                        }}
                        className="w-full appearance-none px-3.5 py-2.5 pr-9 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#C49A4A] transition cursor-pointer"
                      >
                        {HARVEST_YEARS.map((yr) => (
                          <option key={yr} value={yr}>
                            Colheita {yr}
                          </option>
                        ))}
                        <option value="custom">Outro ano (escrever manual)...</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {formData.isCustomYear && (
                      <input
                        type="text"
                        value={formData.customYear}
                        onChange={(e) =>
                          setFormData({ ...formData, customYear: e.target.value })
                        }
                        placeholder="Ex: 2023 ou 1982"
                        className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:border-[#C49A4A]"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* 4. Preço (4€ a 900€) & Stock (Escrita Manual) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Preço com validação 4€ a 900€ */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-white/70 font-medium">
                      Preço *
                    </label>
                    <span className="text-[11px] text-[#C49A4A]">
                      4€ a 900€
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.price}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      placeholder="Ex: 24.50"
                      className={`w-full pl-3.5 pr-8 py-2.5 rounded-xl bg-black/40 border text-white focus:outline-none transition ${
                        priceError
                          ? "border-red-500/60 focus:border-red-400"
                          : "border-white/10 focus:border-[#C49A4A]"
                      }`}
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 font-medium">
                      €
                    </span>
                  </div>
                  {priceError && (
                    <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1 font-sans">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span>{priceError}</span>
                    </p>
                  )}
                </div>

                {/* Stock em armazém */}
                <div>
                  <label className="block text-white/70 mb-1.5 font-medium">
                    Stock em Armazém *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    placeholder="50"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#C49A4A] transition"
                  />
                </div>
              </div>

              {/* 5. Castas & Breve Descrição (Opcional / Escrita) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-1.5 font-medium">
                    Castas
                  </label>
                  <input
                    type="text"
                    value={formData.grapes}
                    onChange={(e) =>
                      setFormData({ ...formData, grapes: e.target.value })
                    }
                    placeholder="Ex: Touriga Nacional, Tinta Roriz"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1.5 font-medium">
                    Selo / Destaque Comercial
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) =>
                      setFormData({ ...formData, badge: e.target.value })
                    }
                    placeholder="Ex: Escolha do Enólogo, Edição Limitada"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 mb-1.5 font-medium">
                  Breve Nota de Prova / Descrição
                </label>
                <textarea
                  rows={2}
                  value={formData.desc}
                  onChange={(e) =>
                    setFormData({ ...formData, desc: e.target.value })
                  }
                  placeholder="Vinho aromático com estágio em madeira nobre..."
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-white/30 resize-none"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1.5 font-medium">
                  Fotografia principal * <span className="text-white/40">(aparece no carrossel)</span>
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  required={editingWineId === null && !formData.image}
                  onChange={(e) => setPrimaryImageFile(e.target.files?.[0] || null)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:text-white"
                />
                <p className="mt-1 text-[11px] text-white/40">JPG, PNG, WebP ou AVIF · máximo 5 MB.</p>
                {primaryImageFile ? (
                  <p className="mt-1 text-[11px] text-[#C49A4A]">Nova fotografia: {primaryImageFile.name}</p>
                ) : formData.image ? (
                  <img src={formData.image} alt="Fotografia principal atual" className="mt-2 h-24 rounded-lg object-contain bg-black/30 p-2" />
                ) : null}
              </div>

              <div>
                <label className="block text-white/70 mb-1.5 font-medium">
                  Segunda fotografia <span className="text-white/40">(opcional)</span>
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={(e) => setSecondaryImageFile(e.target.files?.[0] || null)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:text-white"
                />
                <p className="mt-1 text-[11px] text-white/40">JPG, PNG, WebP ou AVIF · máximo 5 MB.</p>
                {secondaryImageFile ? (
                  <p className="mt-1 text-[11px] text-[#C49A4A]">Nova fotografia: {secondaryImageFile.name}</p>
                ) : formData.secondaryImage ? (
                  <img src={formData.secondaryImage} alt="Segunda fotografia atual" className="mt-2 h-24 rounded-lg object-contain bg-black/30 p-2" />
                ) : null}
              </div>

              <div>
                <label className="block text-white/70 mb-1.5 font-medium">
                  Link de pagamento Vendus
                </label>
                <input
                  type="url"
                  inputMode="url"
                  value={formData.paymentUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentUrl: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#C49A4A] transition"
                />
                <p className="mt-1 text-[11px] text-white/40">
                  Opcional. O servidor só aceita links HTTPS.
                </p>
              </div>

              {/* 6. Destaque no Carrossel da Home */}
              <div className="pt-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featuredHome"
                  checked={formData.featuredHome}
                  onChange={(e) =>
                    setFormData({ ...formData, featuredHome: e.target.checked })
                  }
                  className="w-4 h-4 rounded accent-[#C49A4A] cursor-pointer"
                />
                <label
                  htmlFor="featuredHome"
                  className="text-white text-xs cursor-pointer select-none"
                >
                  Colocar este produto em destaque no carrossel da página inicial
                </label>
              </div>

              {/* Botões do Rodapé */}
              <div className="pt-6 flex items-center justify-end gap-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-white/60 hover:text-white transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={Boolean(priceError)}
                  className={`px-5 py-2.5 rounded-xl bg-white text-black font-medium transition cursor-pointer shadow-sm ${
                    priceError ? "opacity-50 cursor-not-allowed" : "hover:bg-white/90"
                  }`}
                >
                  {editingWineId ? "Guardar Alterações" : "Criar Produto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE REMOÇÃO */}
      {wineToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#141314] border border-white/10 rounded-2xl p-6 max-w-sm w-full text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <h4 className="font-brand uppercase text-lg text-white mb-1">
              Remover Produto?
            </h4>
            <p className="text-xs text-white/60 font-sans mb-6">
              Tem a certeza de que pretende remover <strong>"{wineToDelete.title}"</strong> do catálogo?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setWineToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-sans transition"
              >
                Sim, Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
