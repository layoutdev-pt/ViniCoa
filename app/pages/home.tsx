import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Sliders, ArrowLeft, ArrowRight } from "lucide-react";
import { useCart } from "../lib/cart-context";
import { useAdmin } from "../lib/admin-context";
import { formatMoney } from "../lib/wines";
import { BrandStoryBento } from "../components/ui/BrandStoryBento";
import { WinePurchaseCTA } from "../components/ui/WinePurchaseCTA";
import { GlobeSection } from "../components/ui/GlobeSection";
import barricaImg from "../assets/images/carvalho-barrica.jpg";

export function Home() {
  const { addToCart, openQuickView } = useCart();
  const { wines } = useAdmin();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Vinhos em Destaque no Carrossel da Home geridos pelo Admin (ou primeiros vinhos como fallback)
  const featuredWines = wines.filter((w) => w.featuredHome).length > 0
    ? wines.filter((w) => w.featuredHome)
    : wines.slice(0, 5);
  const totalWines = featuredWines.length;

  // 3 Vinhos de Assinatura para o Seletor da Hero (Opção 1 + C)
  const heroWines = featuredWines.slice(0, 3);
  const [heroIdx, setHeroIdx] = useState(0);

  const safeHeroIdx = Math.min(heroIdx, Math.max(0, heroWines.length - 1));
  const safeCurrentIdx = Math.min(currentIdx, Math.max(0, totalWines - 1));
  const activeHero = heroWines[safeHeroIdx] || featuredWines[0];
  const activeWine = featuredWines[safeCurrentIdx] || featuredWines[0];

  const nextSlide = () => setCurrentIdx((prev) => (prev + 1) % totalWines);
  const prevSlide = () => setCurrentIdx((prev) => (prev - 1 + totalWines) % totalWines);

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Gestos de swipe em mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 40) {
      nextSlide();
    } else if (diff < -40) {
      prevSlide();
    }
    setTouchStartX(null);
  };

  return (
    <div className="w-full">
      {/* HERO — ELEGÂNCIA, GARRAFA DE ASSINATURA & SELETOR DE PRESTÍGIO (OPÇÃO 1 + C) */}
      <section className="relative min-h-[94vh] flex items-center overflow-hidden bg-[#0D0B0C] pt-28 pb-16 lg:pt-36 lg:pb-24">
        {/* Imagem de Fundo (Barrica) com Ambient Glow e Zoom Lento Contínuo */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src={barricaImg}
            alt="Barricas de carvalho e adega no Sabugal"
            className="w-full h-full object-cover img-mono opacity-25 scale-105 transition-transform duration-[20000ms] ease-out motion-reduce:transform-none"
          />
          {/* Luz dourada de altitude nas vinhas e halo granítico */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,154,74,0.18)_0%,rgba(13,11,12,0.85)_65%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-vinicoa-noir/80 via-transparent to-vinicoa-noir" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* COLUNA ESQUERDA: Tipografia Editorial, História & Mini-Painel de Vinho */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Badge da Região & Altitude */}
              <div
                data-reveal="fade"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dourado/10 border border-dourado/30 mb-6"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-dourado animate-pulse" />
                <span className="font-downey text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-dourado">
                  Vinicôa · Sabugal | Beira Interior
                </span>
              </div>

              {/* Título Principal de Autor */}
              <h1
                data-reveal
                data-reveal-delay="1"
                className="font-brand uppercase text-dourado text-4xl sm:text-5xl xl:text-6xl leading-[1.12] tracking-[0.14em]"
              >
                Elegância, Carácter
                <br />
                <span className="text-bege">e Tradição</span>
              </h1>

              {/* Filete de Ouro da Identidade */}
              <span
                data-reveal="zoom"
                data-reveal-delay="2"
                className="block w-20 h-px bg-dourado/60 my-6"
                aria-hidden="true"
              />

              {/* Subtítulo da Garrafeira */}
              <p
                data-reveal
                data-reveal-delay="3"
                className="text-sm sm:text-base font-light text-[#E8DCC6]/85 leading-relaxed max-w-xl mb-8"
              >
                Vinhos de altitude cultivados nos solos graníticos do Sabugal a 750 metros. A nobreza e pureza da Beira Interior engarrafadas com rigor artesanal e enviadas para todo o mundo.
              </p>

              {/* CARTÃO INTERATIVO DO VINHO SELECIONADO NA HERO */}
              <div
                data-reveal
                data-reveal-delay="4"
                className="w-full max-w-xl p-5 sm:p-6 rounded-2xl glass-luxury border border-dourado/30 shadow-2xl shadow-black/60 mb-8 backdrop-blur-md transition-all duration-300"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-dourado/15">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-bordo text-bege-light font-downey text-[10px] uppercase tracking-[0.2em] border border-dourado/40">
                      {activeHero.badge || "Destaque da Adega"}
                    </span>
                    <span className="font-downey text-[11px] uppercase tracking-[0.2em] text-dourado">
                      {activeHero.range} · {activeHero.year}
                    </span>
                  </div>
                  <span className="font-brand text-2xl text-dourado tabular-nums">
                    {formatMoney(activeHero.price)}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-brand uppercase text-xl sm:text-2xl text-bege tracking-[0.05em]">
                      {activeHero.title}
                    </h3>
                    <p className="font-downey text-xs text-dourado-soft/85 tracking-[0.1em] mt-0.5">
                      {activeHero.grapes}
                    </p>
                    <p className="text-xs text-bege-muted font-light line-clamp-1 mt-1">
                      {activeHero.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => addToCart(activeHero)}
                      className="px-4 py-2.5 rounded-xl bg-bordo hover:bg-bordo-light text-bege font-downey text-[11px] uppercase tracking-[0.2em] border border-dourado/40 transition cursor-pointer flex items-center gap-2 whitespace-nowrap shadow-lg shadow-black/40"
                    >
                      Comprar Garrafa
                    </button>
                    <Link
                      to={`/vinhos/${activeHero.id}`}
                      className="p-2.5 rounded-xl border border-dourado/30 hover:border-dourado text-dourado hover:text-bege transition cursor-pointer text-xs"
                      title="Ver ficha técnica completa"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Botões de Ação Globais */}
              <div
                data-reveal
                data-reveal-delay="5"
                className="flex flex-wrap items-center gap-5 sm:gap-7"
              >
                <Link to="/vinhos" className="btn-brand btn-bordo">
                  Explorar toda a garrafeira
                </Link>
                <Link
                  to="/sobre-nos"
                  className="font-downey text-xs uppercase tracking-[0.24em] text-[#E8DCC6]/85 hover:text-dourado border-b border-dourado/40 hover:border-dourado pb-1 transition-colors"
                >
                  O Nosso Terroir & História
                </Link>
              </div>

              {/* Selos de Altitude & Granito */}
              <div className="mt-8 pt-6 border-t border-dourado/15 flex flex-wrap items-center gap-6 text-xs text-bege-muted/90 font-light">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-dourado" /> 750m Altitude Média
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-dourado" /> 100% Solos Graníticos
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-dourado" /> Carvalho Francês
                </span>
              </div>
            </div>

            {/* COLUNA DIREITA: Palco da Garrafa Hero 3D + Seletor de Vinhos (Opção 1 + C) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative mt-6 lg:mt-0">
              
              {/* Halo de Luz Dourada de Estúdio / Pedestal */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-dourado/15 blur-3xl pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-bordo/25 blur-2xl pointer-events-none" />

              {/* Palco da Garrafa com Badge Flutuante */}
              <div className="relative z-10 flex flex-col items-center group">
                
                {/* Badge Flutuante de Medalha / Pontuação */}
                {activeHero.awards && activeHero.awards.length > 0 && (
                  <div className="absolute -top-3 sm:top-2 -right-2 sm:right-0 z-20 px-3 py-1.5 rounded-xl bg-vinicoa-noir/90 border border-dourado/50 text-dourado font-downey text-[10px] uppercase tracking-[0.2em] shadow-xl backdrop-blur-md">
                    {activeHero.awards[0]}
                  </div>
                )}

                {/* Garrafa em Destaque com Transição Fluida */}
                <Link
                  to={`/vinhos/${activeHero.id}`}
                  className="relative block cursor-pointer transition-transform duration-500 hover:scale-105"
                  title={`Ver detalhes de ${activeHero.title}`}
                >
                  <img
                    key={activeHero.id}
                    src={activeHero.image}
                    alt={activeHero.title}
                    className="h-[340px] sm:h-[420px] lg:h-[480px] w-auto object-contain rounded-2xl drop-shadow-[0_25px_35px_rgba(0,0,0,0.9)] transition-all duration-700 ease-out"
                  />
                  {/* Reflexo Granítico Suave no Chão */}
                  <div className="w-44 sm:w-56 h-6 bg-black/60 blur-md rounded-full mx-auto mt-2" />
                </Link>
              </div>

              {/* SELETOR INTERATIVO DE GARRAFAS (Opção C) */}
              <div className="mt-6 z-20 flex flex-col items-center w-full max-w-sm">
                <div className="flex items-center justify-center gap-2 sm:gap-3 p-1.5 rounded-full bg-vinicoa-noir/85 border border-dourado/30 backdrop-blur-md shadow-xl">
                  {heroWines.map((wine, idx) => {
                    const isSelected = idx === heroIdx;
                    return (
                      <button
                        key={wine.id}
                        type="button"
                        onClick={() => setHeroIdx(idx)}
                        className={`px-3 sm:px-4 py-1.5 rounded-full font-downey text-[10px] sm:text-[11px] uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? "bg-dourado text-vinicoa-noir font-bold shadow-md shadow-dourado/20"
                            : "text-bege/70 hover:text-dourado hover:bg-dourado/10"
                        }`}
                      >
                        0{idx + 1} {wine.color}
                      </button>
                    );
                  })}
                </div>
                <span className="font-downey text-[10px] uppercase tracking-[0.24em] text-bege-muted/70 mt-2.5">
                  Toque para alternar o vinho em destaque
                </span>
              </div>

            </div>

          </div>
        </div>

        {/* Indicador de Scroll Suave para a Secção Seguinte */}
        <button
          type="button"
          onClick={() => {
            document.getElementById("kpis-section")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-dourado/70 hover:text-dourado transition-colors cursor-pointer group"
          aria-label="Deslizar para a garrafeira"
        >
          <span className="font-downey text-[9px] uppercase tracking-[0.35em] opacity-80 group-hover:opacity-100">
            Descobrir Terroir
          </span>
          <span className="w-px h-7 bg-gradient-to-b from-dourado/80 to-transparent group-hover:h-9 transition-all duration-300" />
        </button>
      </section>

      {/* PILARES DA GARRAFEIRA — bloco bege com tipografia bordô */}
      <section id="kpis-section" className="bg-bege px-6 lg:px-12 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-bordo/20 text-center">
          {KPIS.map((kpi, i) => (
            <div data-reveal data-reveal-delay={String(i)} key={kpi.label} className="py-8 md:py-0 md:px-10 first:pt-0 last:pb-0 flex flex-col items-center">
              <span className="font-brand uppercase text-4xl lg:text-5xl text-bordo tracking-[0.06em] leading-none block mb-5">
                {kpi.value}
              </span>
              <span className="font-downey text-xs uppercase tracking-[0.28em] text-[#0D0B0C] block mb-2">
                {kpi.label}
              </span>
              <p className="text-sm text-[#5C3D42] leading-relaxed max-w-xs">{kpi.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VINHOS EM DESTAQUE — carrossel 3D com gestos touch */}
      <section id="best-sellers" className="py-20 lg:py-28 px-6 lg:px-12 bg-vinicoa-charcoal relative overflow-hidden select-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] pedestal-radial-light pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div data-reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <span className="font-downey text-xs uppercase tracking-[0.35em] text-dourado block mb-4">
                Coleção
              </span>
              <h2 className="font-brand uppercase text-4xl sm:text-5xl text-bege tracking-[0.06em]">
                Vinhos em destaque
              </h2>
            </div>
            <Link
              to="/vinhos"
              className="font-downey text-xs uppercase tracking-[0.28em] text-bege/90 hover:text-dourado transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              Ver todos os vinhos <ArrowRight className="w-3.5 h-3.5 text-dourado" strokeWidth={1.5} />
            </Link>
          </div>

          {/* PALCO 3D */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            data-reveal="fade"
            data-reveal-delay="1"
            className="carousel-3d-stage relative h-[500px] sm:h-[580px] w-full flex items-center justify-center touch-pan-y"
          >
            {/* Setas laterais */}
            <button
              onClick={prevSlide}
              className="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-vinicoa-noir/70 border border-dourado/40 text-dourado hover:border-dourado hover:bg-bordo flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Garrafa anterior"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-vinicoa-noir/70 border border-dourado/40 text-dourado hover:border-dourado hover:bg-bordo flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Garrafa seguinte"
            >
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </button>

            {/* Garrafas */}
            {featuredWines.map((wine, idx) => {
              let diff = (idx - currentIdx) % totalWines;
              if (diff > totalWines / 2) diff -= totalWines;
              if (diff < -totalWines / 2) diff += totalWines;
              const absDiff = Math.abs(diff);

              let transform = "";
              let opacity = 1;
              let filter = "";
              let zIndex = 20;

              if (diff === 0) {
                transform = "translate3d(0px, 0px, 70px) scale(1) rotateY(0deg)";
                filter = "drop-shadow(0 20px 30px rgba(0,0,0,0.75))";
                zIndex = 30;
              } else if (absDiff === 1) {
                transform = `translate3d(${diff * 240}px, 20px, -190px) scale(0.74) rotateY(${diff > 0 ? -15 : 15}deg)`;
                opacity = 0.55;
                filter = "brightness(0.6) blur(0.5px)";
              } else {
                transform = `translate3d(${diff * 360}px, 40px, -340px) scale(0.45) rotateY(${diff > 0 ? -25 : 25}deg)`;
                opacity = 0.15;
                filter = "brightness(0.3) blur(2px)";
                zIndex = 10;
              }

              return (
                <div
                  key={wine.id}
                  onClick={() => setCurrentIdx(idx)}
                  className="carousel-3d-card flex flex-col items-center"
                  style={{ transform, opacity, filter, zIndex }}
                >
                  <div className="relative">
                    <img
                      src={wine.image}
                      alt={wine.title}
                      className="h-[320px] sm:h-[400px] w-auto object-contain rounded-xl pointer-events-none"
                    />
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-bordo font-downey text-[10px] uppercase tracking-[0.2em] text-bege-light border border-dourado/40 whitespace-nowrap">
                      Colheita {wine.year}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Painel do vinho ativo (desktop) */}
            {activeWine && (
              <div className="absolute hidden xl:block xl:right-[6%] z-40 w-80 p-6 rounded-2xl glass-luxury shadow-2xl shadow-black/50">
                <div className="flex items-center justify-between font-downey text-[10px] uppercase tracking-[0.2em] text-dourado mb-3">
                  <span>{activeWine.color} · {activeWine.range}</span>
                  <span>{activeWine.volume}</span>
                </div>
                <h3 className="font-brand uppercase text-2xl text-bege tracking-[0.04em] mb-2">
                  {activeWine.title}
                </h3>
                <p className="text-xs text-bege-dark mb-5 leading-relaxed line-clamp-2">
                  {activeWine.grapes}. {activeWine.desc}
                </p>
                <div className="flex items-baseline gap-2 mb-5">
                  <span className="font-brand text-2xl text-dourado">{formatMoney(activeWine.price)}</span>
                  <span className="text-xs text-bege-muted">IVA incluído</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => addToCart(activeWine.id)}
                    className="btn-brand btn-bordo flex-1 !px-4 !text-[11px] !tracking-[0.18em] whitespace-nowrap"
                  >
                    Adicionar ao cesto
                  </button>
                  <button
                    onClick={() => openQuickView(activeWine.id)}
                    className="p-3 rounded-xl text-bege hover:text-dourado border border-bege/20 hover:border-dourado transition-colors cursor-pointer"
                    aria-label="Ver perfil sensorial"
                  >
                    <Sliders className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Painel do vinho ativo (mobile) */}
          {activeWine && (
            <div className="xl:hidden mt-6 max-w-md mx-auto p-5 rounded-2xl glass-luxury text-center">
              <h3 className="font-brand uppercase text-2xl text-bege tracking-[0.04em] mb-1">{activeWine.title}</h3>
              <p className="text-xs text-bege-dark mb-3">{activeWine.grapes}</p>
              <span className="font-brand text-xl text-dourado block mb-4">{formatMoney(activeWine.price)}</span>
              <div className="flex gap-2">
                <button onClick={() => addToCart(activeWine.id)} className="btn-brand btn-bordo flex-1 !px-4">
                  Adicionar ao cesto
                </button>
                <button
                  onClick={() => openQuickView(activeWine.id)}
                  className="p-3 rounded-xl text-dourado border border-bege/20 cursor-pointer"
                  aria-label="Ver perfil sensorial"
                >
                  <Sliders className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          )}

          {/* Paginação */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className="font-downey text-xs text-bege tracking-[0.2em]">
              {(currentIdx + 1).toString().padStart(2, "0")}
            </span>
            <div className="w-24 h-px bg-white/15 overflow-hidden">
              <div
                className="h-full bg-dourado transition-all duration-500"
                style={{ width: `${((currentIdx + 1) / totalWines) * 100}%` }}
              />
            </div>
            <span className="font-downey text-xs text-bege-muted tracking-[0.2em]">
              {totalWines.toString().padStart(2, "0")}
            </span>
            <div className="flex items-center gap-2 ml-4">
              {featuredWines.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    i === currentIdx ? "w-6 h-2 bg-dourado" : "w-2 h-2 bg-white/20 hover:bg-dourado/60"
                  }`}
                  aria-label={`Ir para a garrafa ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HISTÓRIA DA MARCA */}
      <BrandStoryBento />

      {/* CTA DE INCENTIVO À COMPRA DE VINHOS */}
      <WinePurchaseCTA />

      {/* DO SABUGAL PARA O MUNDO */}
      <GlobeSection />
    </div>
  );
}

const KPIS = [
  {
    value: "Seleção",
    label: "Vários produtores e regiões",
    desc: "Vinhos escolhidos um a um pelo carácter e pela autenticidade, venham de onde vierem.",
  },
  {
    value: "Sabugal",
    label: "A nossa casa",
    desc: "É aqui que a garrafeira nasce e é daqui que parte cada encomenda.",
  },
  {
    value: "Mundo",
    label: "Envios internacionais",
    desc: "Levamos os nossos vinhos a Portugal e a qualquer outro destino.",
  },
];

export default Home;
