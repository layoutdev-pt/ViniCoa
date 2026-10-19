import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Sliders, ArrowLeft, ArrowRight } from "lucide-react";
import { useCart } from "../lib/cart-context";
import { useAdmin } from "../lib/admin-context";
import { formatMoney, WINES_DATABASE } from "../lib/wines";
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
  const featuredWines = wines.some((w) => w.featuredHome)
    ? wines.filter((w) => w.featuredHome)
    : wines.length > 0 ? wines.slice(0, 5) : WINES_DATABASE.slice(0, 5);
  const totalWines = featuredWines.length;

  const safeCurrentIdx = Math.min(currentIdx, Math.max(0, totalWines - 1));
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
      {/* HERO — narrativa editorial com destaque de produto */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#0D0B0C]">
        <img
          src={barricaImg}
          alt="Barrica de carvalho envelhecida"
          className="absolute inset-0 w-full h-full object-cover img-mono opacity-35"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,11,12,0.94)_0%,rgba(13,11,12,0.78)_48%,rgba(13,11,12,0.58)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_46%,rgba(196,154,74,0.12)_0%,transparent_38%)]" />

        <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 pt-36 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 xl:col-span-7">
            <p data-reveal="fade" className="inline-flex items-center gap-2 font-downey text-[10px] sm:text-xs uppercase tracking-[0.38em] text-dourado mb-7 px-3.5 py-2 rounded-full border border-dourado/30 bg-black/20">
              <span className="w-1.5 h-1.5 rounded-full bg-dourado" /> Vinicôa <span className="text-bege/40">|</span> Sabugal · Beira Interior
            </p>
            <h1 data-reveal data-reveal-delay="1" className="font-brand uppercase text-4xl sm:text-5xl xl:text-6xl leading-[1.08] tracking-[0.11em] max-w-3xl">
              <span className="text-dourado">Elegância, carácter</span>
              <br /><span className="text-[#E8DCC6]">e tradição</span>
            </h1>
            <span data-reveal="zoom" data-reveal-delay="2" className="block w-16 h-px bg-dourado/70 my-7" aria-hidden="true" />
            <p data-reveal data-reveal-delay="3" className="text-sm sm:text-base font-light text-bege/75 leading-relaxed max-w-xl">
              Uma garrafeira com raízes no Sabugal: vinhos de vários produtores e regiões, escolhidos com critério e enviados para todo o mundo.
            </p>

            {activeWine && (
              <div data-reveal data-reveal-delay="4" className="mt-8 max-w-2xl p-5 sm:p-6 rounded-2xl glass-luxury border border-dourado/25 shadow-xl shadow-black/20">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-bege/10">
                  <div className="flex items-center gap-2.5">
                    {activeWine.badge && <span className="px-2.5 py-1 rounded-full bg-bordo text-bege text-[9px] uppercase font-bold tracking-[0.16em] border border-dourado/30">{activeWine.badge}</span>}
                    <span className="font-downey text-[10px] uppercase tracking-[0.2em] text-dourado">{activeWine.range} · {activeWine.year}</span>
                  </div>
                  <span className="font-brand text-xl sm:text-2xl text-dourado">{formatMoney(activeWine.price)}</span>
                </div>
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="font-brand uppercase text-xl sm:text-2xl text-bege tracking-wide">{activeWine.title}</h2>
                    <p className="font-downey text-[10px] uppercase tracking-[0.14em] text-bege-dark">{activeWine.grapes}</p>
                    <p className="text-[11px] text-bege-muted mt-1 line-clamp-1">{activeWine.desc}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button type="button" onClick={() => addToCart(activeWine.id)} className="btn-brand btn-bordo !px-4 !py-3 !text-[10px] !tracking-[0.16em] whitespace-nowrap">Comprar garrafa</button>
                    <Link to={`/vinhos/${activeWine.id}`} aria-label={`Ver ${activeWine.title}`} className="w-11 h-11 rounded-xl border border-dourado/35 text-dourado hover:bg-dourado/10 flex items-center justify-center transition-colors"><ArrowRight className="w-4 h-4" /></Link>
                  </div>
                </div>
              </div>
            )}

            <div data-reveal data-reveal-delay="5" className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8">
              <Link to="/vinhos" className="btn-brand btn-bordo">Descobrir os vinhos</Link>
              <Link to="/sobre-nos" className="font-downey text-xs uppercase tracking-[0.24em] text-bege/85 hover:text-dourado border-b border-dourado/40 hover:border-dourado pb-1 transition-colors">A nossa história</Link>
            </div>
          </div>

          {activeWine && (
            <div data-reveal="fade" data-reveal-delay="2" className="lg:col-span-5 xl:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-md h-[360px] sm:h-[440px] flex items-center justify-center rounded-[2rem] border border-white/[0.06] bg-black/15">
                <div className="absolute inset-8 rounded-full bg-dourado/[0.07] blur-3xl" />
                {activeWine.awards?.[0] && <span className="absolute top-4 left-4 right-4 z-10 px-3 py-2 rounded-xl bg-[#0D0B0C]/90 border border-dourado/30 font-downey text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-dourado">{activeWine.awards[0]}</span>}
                <img src={activeWine.image} alt={activeWine.title} className="relative z-[1] h-[290px] sm:h-[370px] max-w-[78%] object-contain drop-shadow-[0_28px_35px_rgba(0,0,0,0.65)]" />
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2 rounded-full border border-dourado/25 bg-black/25 p-1.5">
                {featuredWines.slice(0, 3).map((wine, idx) => (
                  <button key={wine.id} type="button" onClick={() => setCurrentIdx(idx)} className={`px-4 py-2 rounded-full font-downey text-[9px] uppercase tracking-[0.18em] transition-colors ${idx === safeCurrentIdx ? "bg-dourado text-[#171312]" : "text-bege/65 hover:text-bege"}`}>
                    {String(idx + 1).padStart(2, "0")} {wine.color}
                  </button>
                ))}
              </div>
              <p className="mt-2 font-downey text-[9px] uppercase tracking-[0.2em] text-bege/40">Toque para alternar o vinho em destaque</p>
            </div>
          )}
        </div>

        {/* Indicador de scroll discreto */}
        <span
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-dourado/70 to-transparent"
          aria-hidden="true"
        />
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
