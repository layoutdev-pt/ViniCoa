import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Sliders, ArrowLeft, ArrowRight } from "lucide-react";
import { useCart } from "../lib/cart-context";
import { WINES_DATABASE, formatMoney } from "../lib/wines";
import { BrandStoryBento } from "../components/ui/BrandStoryBento";
import { WinePurchaseCTA } from "../components/ui/WinePurchaseCTA";
import { MapAndContactSection } from "../components/ui/MapAndContactSection";

export function Home() {
  const { addToCart, openQuickView } = useCart();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const featuredWines = WINES_DATABASE.slice(0, 5);
  const totalWines = featuredWines.length;

  const nextSlide = () => setCurrentIdx((prev) => (prev + 1) % totalWines);
  const prevSlide = () => setCurrentIdx((prev) => (prev - 1 + totalWines) % totalWines);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Mobile Touch Gestures (Swipe)
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

  const activeWine = featuredWines[currentIdx];

  return (
    <div className="w-full">
      {/* HERO SECTION (SIMPLES & CONVIDATIVO) */}
      <section className="relative min-h-[88vh] lg:min-h-[90vh] flex flex-col justify-center items-center pt-36 sm:pt-40 md:pt-44 lg:pt-48 pb-16 sm:pb-20 px-6 overflow-hidden hero-gradient">
        <div className="absolute inset-0 -z-10 opacity-25 mix-blend-luminosity">
          <img
            src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1600&q=80"
            alt="Vinhas de altitude na Beira Interior"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-vinicoa-noir via-transparent to-vinicoa-noir/80" />

        <div className="max-w-5xl mx-auto text-center z-10 my-auto pt-8 sm:pt-10 flex flex-col items-center">
          {/* Tagline Oficial do Brandbook */}
          <p className="font-downey text-xs sm:text-sm uppercase tracking-[0.38em] text-dourado font-medium mb-5">
            Elegância, Carácter e Tradição
          </p>

          {/* Título Principal */}
          <h1 className="font-editorial text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-bege leading-[1.05] tracking-wide mb-10">
            A Alma da Terra.<br />
            <span className="italic font-normal text-dourado">O Carácter do Sabugal.</span>
          </h1>

          {/* Convite Convidativo & Subtil de Exploração */}
          <div
            onClick={() => document.getElementById("kpis-section")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-4 inline-flex flex-col items-center gap-2.5 cursor-pointer group transition-all duration-300 hover:-translate-y-0.5"
            role="button"
            tabIndex={0}
            aria-label="Descobrir os vinhos da Vinicôa"
          >
            <span className="font-downey text-xs uppercase tracking-[0.28em] text-bege/80 group-hover:text-dourado transition-colors">
              Explorar
            </span>
            <div className="w-6 h-10 rounded-full border border-dourado/40 group-hover:border-dourado flex items-start justify-center p-1.5 transition-colors shadow-sm">
              <div className="w-1.5 h-2 rounded-full bg-dourado animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* SECÇÃO DOS KPIS EM GRANDE (LOGO ABAIXO DO HERO) */}
      <section id="kpis-section" className="relative z-20 py-16 lg:py-20 px-6 lg:px-12 bg-vinicoa-noir border-y border-dourado/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-dourado/15">
            
            {/* KPI 1: Altitude */}
            <div className="pt-6 md:pt-0 md:px-8 flex flex-col items-center group">
              <span className="font-editorial text-6xl sm:text-7xl lg:text-8xl font-bold text-dourado tracking-tight leading-none mb-3 group-hover:scale-105 transition-transform duration-500">
                750m
              </span>
              <span className="font-downey text-xs sm:text-sm uppercase tracking-[0.3em] text-bege font-semibold mb-2">
                Altitude Média
              </span>
              <span className="text-xs text-bege-muted max-w-xs font-light leading-relaxed">
                Noites serranas glaciais que preservam acidez pura e vivacidade
              </span>
            </div>

            {/* KPI 2: Solos */}
            <div className="pt-8 md:pt-0 md:px-8 flex flex-col items-center group">
              <span className="font-editorial text-6xl sm:text-7xl lg:text-8xl font-bold text-dourado tracking-tight leading-none mb-3 group-hover:scale-105 transition-transform duration-500">
                100%
              </span>
              <span className="font-downey text-xs sm:text-sm uppercase tracking-[0.3em] text-bege font-semibold mb-2">
                Solos Graníticos
              </span>
              <span className="text-xs text-bege-muted max-w-xs font-light leading-relaxed">
                Tensão mineral profunda extraída das fendas rochosas do Côa
              </span>
            </div>

            {/* KPI 3: Carvalho Francês */}
            <div className="pt-8 md:pt-0 md:px-8 flex flex-col items-center group">
              <span className="font-editorial text-6xl sm:text-7xl lg:text-8xl font-bold text-dourado tracking-tight leading-none mb-3 group-hover:scale-105 transition-transform duration-500">
                Até 24M
              </span>
              <span className="font-downey text-xs sm:text-sm uppercase tracking-[0.3em] text-bege font-semibold mb-2">
                Carvalho Francês
              </span>
              <span className="text-xs text-bege-muted max-w-xs font-light leading-relaxed">
                Estágio paciente em barrica para taninos sedosos e longevidade
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* BEST SELLERS SHOWCASE — CARROSSEL 3D COM TOUCH GESTURES */}
      <section id="best-sellers" className="py-20 px-6 lg:px-12 bg-vinicoa-charcoal relative overflow-hidden select-none">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-0 overflow-hidden">
          <span className="watermark-exclusive text-[18vw] leading-none text-white/[0.03] select-none font-normal tracking-tight -rotate-3 transform -translate-y-8">
            exclusivo
          </span>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] pedestal-radial-light pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-bege/10">
            <div>
              <span className="text-xs uppercase tracking-[0.35em] text-dourado font-semibold block mb-2">
                Coleção de Destaque
              </span>
              <h2 className="font-editorial italic text-3xl sm:text-5xl text-bege font-normal tracking-tight">
                Vinhos em Destaque
              </h2>
            </div>
            <Link
              to="/vinhos"
              className="text-xs uppercase tracking-[0.25em] text-bege/90 hover:text-dourado font-semibold transition flex items-center gap-2 mt-4 md:mt-0"
            >
              <span>Ver Todos os Vinhos</span>
              <ArrowRight className="w-3.5 h-3.5 text-dourado" />
            </Link>
          </div>

          {/* PALCO 3D COM SUPORTE TOUCH/SWIPE */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="carousel-3d-stage relative h-[500px] sm:h-[580px] w-full flex items-center justify-center touch-pan-y"
          >
            {/* Setas Laterais */}
            <button
              onClick={prevSlide}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full glass-luxury border border-dourado/40 text-bege hover:text-dourado hover:border-dourado hover:bg-bordo/40 flex items-center justify-center transition shadow-2xl cursor-pointer"
              aria-label="Garrafa anterior"
            >
              <ArrowLeft className="w-4 h-4 text-dourado" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full glass-luxury border border-dourado/40 text-bege hover:text-dourado hover:border-dourado hover:bg-bordo/40 flex items-center justify-center transition shadow-2xl cursor-pointer"
              aria-label="Garrafa seguinte"
            >
              <ArrowRight className="w-4 h-4 text-dourado" />
            </button>

            {/* Garrafas 3D */}
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
                opacity = 1;
                filter = "drop-shadow(0 20px 30px rgba(0,0,0,0.75))";
                zIndex = 30;
              } else if (absDiff === 1) {
                const transX = diff * 240;
                const rotY = diff > 0 ? -15 : 15;
                transform = `translate3d(${transX}px, 20px, -190px) scale(0.74) rotateY(${rotY}deg)`;
                opacity = 0.55;
                filter = "brightness(0.6) blur(0.5px)";
                zIndex = 20;
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
                      className="h-[320px] sm:h-[400px] w-auto object-contain pointer-events-none drop-shadow-2xl"
                    />
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-bordo/90 text-[10px] uppercase font-bold tracking-widest text-bege border border-dourado/40 whitespace-nowrap shadow-lg">
                      Colheita {wine.year}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Painel Desktop Flutuante */}
            {activeWine && (
              <div className="absolute hidden md:block md:right-[6%] lg:right-[10%] z-40 max-w-xs p-6 rounded-2xl glass-luxury border border-dourado/30 shadow-2xl animate-in fade-in duration-300">
                <div className="flex items-center justify-between text-xs text-dourado mb-1.5 font-semibold">
                  <span>DOC Beira Interior</span>
                  <span>{activeWine.volume}</span>
                </div>
                <h3 className="font-editorial text-2xl font-bold text-bege mb-2">
                  {activeWine.title}
                </h3>
                <p className="text-xs text-bege-dark mb-4 leading-relaxed line-clamp-2">
                  {activeWine.grapes}. {activeWine.desc}
                </p>
                <div className="flex items-baseline gap-2 mb-5">
                  <span className="text-2xl font-extrabold text-dourado">
                    {formatMoney(activeWine.price)}
                  </span>
                  <span className="text-xs text-bege-muted">IVA incluído</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => addToCart(activeWine.id)}
                    className="flex-1 py-3 px-4 rounded-xl bg-bordo hover:bg-bordo-light text-bege text-xs uppercase font-bold tracking-wider border border-dourado/40 shadow-lg transition cursor-pointer"
                  >
                    Adicionar ao Cesto
                  </button>
                  <button
                    onClick={() => openQuickView(activeWine.id)}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-bege hover:text-dourado border border-bege/20 transition cursor-pointer"
                    aria-label="Ver detalhes organoléticos"
                  >
                    <Sliders className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Painel Mobile */}
          {activeWine && (
            <div className="md:hidden mt-6 p-5 rounded-2xl glass-luxury border border-dourado/30 text-center">
              <h3 className="font-editorial text-2xl font-bold text-bege mb-1">
                {activeWine.title}
              </h3>
              <p className="text-xs text-bege-dark mb-3">
                {activeWine.grapes}
              </p>
              <span className="text-xl font-bold text-dourado block mb-4">
                {formatMoney(activeWine.price)}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => addToCart(activeWine.id)}
                  className="flex-1 py-3 rounded-xl bg-bordo text-bege text-xs uppercase font-bold tracking-wider cursor-pointer"
                >
                  Adicionar ao Cesto
                </button>
                <button
                  onClick={() => openQuickView(activeWine.id)}
                  className="p-3 rounded-xl glass-luxury text-dourado cursor-pointer"
                  aria-label="Ver perfil sensorial"
                >
                  <Sliders className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Paginação com Pontos e Indicador */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className="text-xs font-bold text-bege tracking-widest">
              {(currentIdx + 1).toString().padStart(2, "0")}
            </span>
            <div className="w-24 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-dourado transition-all duration-500 rounded-full"
                style={{ width: `${((currentIdx + 1) / totalWines) * 100}%` }}
              />
            </div>
            <span className="text-xs text-bege-muted tracking-widest">
              {totalWines.toString().padStart(2, "0")}
            </span>
            <div className="flex items-center gap-2 ml-4">
              {featuredWines.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  className={`carousel-dot rounded-full transition-all duration-300 cursor-pointer ${
                    i === currentIdx
                      ? "w-6 h-2 bg-dourado shadow-sm"
                      : "w-2 h-2 bg-white/20 hover:bg-dourado/60"
                  }`}
                  aria-label={`Ir para a garrafa ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BENTO GRID DA HISTÓRIA DA MARCA */}
      <BrandStoryBento />

      {/* CTA DE INCENTIVO À COMPRA DE VINHOS */}
      <WinePurchaseCTA />

      {/* SECÇÃO DE MAPA E CONTACTOS */}
      <MapAndContactSection />
    </div>
  );
}
export default Home;