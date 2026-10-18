import { Link } from "react-router";
import { Plus, ArrowRight, Check, Sparkles } from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { useAdmin } from "../../lib/admin-context";
import { formatMoney } from "../../lib/wines";

export default function AdminDashboard() {
  const { wines, toggleFeatured, featuredCount } = useAdmin();

  const totalStock = wines.reduce((acc, w) => acc + (w.stock || 0), 0);
  const featuredWines = wines.filter((w) => w.featuredHome);

  return (
    <AdminLayout
      title="Geral"
      subtitle="Painel de controlo da garrafeira e destaques da página inicial."
      action={
        <Link
          to="/admin/produtos?novo=true"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black hover:bg-white/90 text-xs font-medium font-sans transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo Vinho</span>
        </Link>
      }
    >
      <div className="space-y-12">
        {/* RESUMO EM 3 NÚMEROS LIMPOS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#121112] border border-white/[0.06]">
            <span className="text-xs text-white/40 block font-sans mb-1">
              Garrafeira Ativa
            </span>
            <div className="font-brand text-3xl text-white">
              {wines.length} <span className="text-sm font-sans text-white/40">referências</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#121112] border border-white/[0.06]">
            <span className="text-xs text-[#C49A4A] block font-sans mb-1">
              Destaques na Home
            </span>
            <div className="font-brand text-3xl text-[#C49A4A]">
              {featuredCount} <span className="text-sm font-sans text-[#C49A4A]/60">garrafas</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#121112] border border-white/[0.06]">
            <span className="text-xs text-white/40 block font-sans mb-1">
              Stock Total
            </span>
            <div className="font-brand text-3xl text-white">
              {totalStock.toLocaleString("pt-PT")}{" "}
              <span className="text-sm font-sans text-white/40">unidades</span>
            </div>
          </div>
        </div>

        {/* SECÇÃO: CARROSSEL DA PÁGINA INICIAL */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div>
              <h2 className="font-brand uppercase text-lg text-white tracking-wide">
                Destaques no Carrossel da Home
              </h2>
              <p className="text-xs text-white/50 font-sans mt-0.5">
                Vinhos atualmente em exibição no carrossel 3D e seletor da página principal.
              </p>
            </div>
            <Link
              to="/admin/produtos"
              className="text-xs text-white/50 hover:text-white flex items-center gap-1 font-sans transition"
            >
              <span>Ver todos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {featuredWines.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-[#121112] border border-white/[0.06]">
              <Sparkles className="w-8 h-8 text-[#C49A4A]/40 mx-auto mb-2" />
              <p className="text-xs text-white/60 mb-3 font-sans">
                Nenhum vinho está selecionado para o carrossel.
              </p>
              <Link
                to="/admin/produtos"
                className="text-xs text-[#C49A4A] hover:underline font-sans"
              >
                Escolher vinhos no catálogo →
              </Link>
            </div>
          ) : (
            <div className="bg-[#121112] rounded-2xl border border-white/[0.06] divide-y divide-white/[0.05] overflow-hidden">
              {featuredWines.map((wine, index) => (
                <div
                  key={wine.id}
                  className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-xs text-white/30 font-sans w-5">
                      {index + 1}
                    </span>
                    <img
                      src={wine.image}
                      alt={wine.title}
                      className="w-8 h-12 object-contain shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-sans text-white font-medium truncate">
                        {wine.title}
                      </h4>
                      <p className="text-xs text-white/40 font-sans truncate">
                        {wine.color} · {wine.range} · {wine.year}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0">
                    <span className="text-xs text-white/60 font-sans hidden sm:inline">
                      {formatMoney(wine.price)}
                    </span>

                    {/* Botão simples para remover do carrossel */}
                    <button
                      type="button"
                      onClick={() => toggleFeatured(wine.id)}
                      className="px-3 py-1.5 rounded-lg border border-[#C49A4A]/30 text-[#C49A4A] hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 text-xs font-sans transition cursor-pointer flex items-center gap-1.5"
                      title="Clique para retirar do carrossel"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>No Carrossel</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ATALHO SIMPLES PARA GESTÃO */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
          <div>
            <h3 className="text-sm text-white font-sans font-medium">
              Precisa de atualizar o catálogo ou adicionar novas colheitas?
            </h3>
            <p className="text-xs text-white/40 font-sans mt-0.5">
              Edite preços, stocks, castas e notas de prova na página de produtos.
            </p>
          </div>
          <Link
            to="/admin/produtos"
            className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs text-white font-sans transition shrink-0"
          >
            Abrir Gestão de Produtos →
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
