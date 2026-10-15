import { Link } from "react-router";
import { Mountain, Sparkles, Clock, ArrowRight, Shield } from "lucide-react";
import casteloImg from "../../assets/images/castelo.webp";

export function BrandStoryBento() {
  return (
    <section id="historia-marca" className="py-20 lg:py-24 px-6 lg:px-12 bg-vinicoa-noir relative overflow-hidden border-t border-bege/10">
      {/* Luz ambiente de fundo */}
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-dourado/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-bordo/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Cabeçalho Limpo e Direto */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <span className="font-downey text-xs uppercase tracking-[0.35em] text-dourado font-semibold block mb-3">
            História & Terroir
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl text-bege font-bold leading-tight mb-4">
            A Alma da Raia em Cada Garrafa
          </h2>
          <p className="text-xs sm:text-sm text-bege-dark font-light leading-relaxed">
            Uma herança de altitude, solos de granito e tradição secular nas encostas do Sabugal.
          </p>
        </div>

        {/* BENTO GRID SIMPLIFICADO & EQUILIBRADO (3 COLUNAS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          
          {/* CARD 1: O CASTELO DAS CINCO QUINAS (DESTAQUE HERO COM FOTO REAL - 2 COLUNAS) */}
          <div className="md:col-span-2 lg:col-span-2 rounded-3xl glass-luxury relative overflow-hidden p-8 sm:p-10 flex flex-col justify-between border border-dourado/30 hover:border-dourado/60 transition-all duration-700 group min-h-[340px] sm:min-h-[380px]">
            {/* Fotografia Real do Castelo com Zoom Suave */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <img
                src={casteloImg}
                alt="Castelo das Cinco Quinas no Sabugal sob mar de nuvens"
                className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105 opacity-55"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-vinicoa-noir via-vinicoa-noir/70 to-vinicoa-noir/20" />
            </div>

            {/* Topo do Card */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bordo/80 backdrop-blur-md border border-dourado/40 text-bege text-[10px] uppercase tracking-[0.2em] font-semibold">
                <Shield className="w-3.5 h-3.5 text-dourado" />
                <span>Emblema da Marca</span>
              </div>
              <span className="text-xs font-editorial italic text-dourado/90">
                Sabugal, Beira Interior
              </span>
            </div>

            {/* Texto Direto e Legível */}
            <div className="mt-auto pt-10">
              <h3 className="font-editorial text-2xl sm:text-4xl text-bege font-bold mb-3 leading-snug">
                Castelo das Cinco Quinas
              </h3>
              <p className="text-xs sm:text-sm text-bege-dark font-light leading-relaxed max-w-xl">
                O nosso símbolo homenageia a fortaleza única do Sabugal. Entre muralhas e penedos, desafiamos a altitude da fronteira para criar vinhos de perfil nobre e inconfundível.
              </p>
            </div>
          </div>

          {/* CARD 2: ALTITUDE & CLIMA (1 COLUNA) */}
          <div className="rounded-3xl glass-luxury p-7 sm:p-8 flex flex-col justify-between border border-dourado/20 hover:border-dourado/45 transition-all duration-500 group">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-bordo/50 border border-dourado/30 flex items-center justify-center text-dourado mb-6">
                <Mountain className="w-5 h-5 text-dourado" />
              </div>

              <span className="font-editorial text-3xl sm:text-4xl font-bold text-dourado tracking-tight block mb-1">
                750m
              </span>
              <span className="font-downey text-xs uppercase tracking-wider text-bege font-bold block mb-3">
                Altitude & Noites Frias
              </span>

              <p className="text-xs text-bege-dark leading-relaxed font-light">
                A grande amplitude térmica serrana desacelera a maturação das uvas, conferindo uma acidez vibrante e frescura natural inigualável.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-bege/10 text-[11px] text-bege-muted">
              <span>Clima de montanha na Beira Interior</span>
            </div>
          </div>

          {/* CARD 3: CASTAS AUTÓCTONES (1 COLUNA) */}
          <div className="rounded-3xl glass-luxury p-7 sm:p-8 flex flex-col justify-between border border-dourado/20 hover:border-dourado/45 transition-all duration-500 group">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-bordo/50 border border-dourado/30 flex items-center justify-center text-dourado mb-6">
                <Sparkles className="w-5 h-5 text-dourado" />
              </div>

              <span className="font-editorial text-2xl sm:text-3xl font-bold text-bege block mb-1">
                Fonte Cal & Rufete
              </span>
              <span className="font-downey text-xs uppercase tracking-wider text-dourado font-bold block mb-3">
                Castas Autóctones
              </span>

              <p className="text-xs text-bege-dark leading-relaxed font-light">
                Variedades raras e históricas preservadas em vinhas velhas de solo granítico, revelando aromas florais salinos e mineralidade profunda.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-bege/10 text-[11px] text-bege-muted">
              <span>Património vitícola exclusivo</span>
            </div>
          </div>

          {/* CARD 4: A ARTE DO TEMPO & BOTÃO TERROIR (2 COLUNAS) */}
          <div className="md:col-span-2 lg:col-span-2 rounded-3xl glass-luxury p-7 sm:p-9 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-dourado/20 hover:border-dourado/45 transition-all duration-500 group">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-dourado uppercase tracking-wider mb-2">
                <Clock className="w-4 h-4 text-dourado" />
                <span className="font-downey">O Respeito pelo Tempo</span>
              </div>
              <h4 className="font-editorial text-2xl font-bold text-bege mb-2">
                Carvalho Francês & Intervenção Mínima
              </h4>
              <p className="text-xs sm:text-sm text-bege-dark font-light leading-relaxed">
                Cada colheita repousa pacientemente na nossa adega, permitindo que a pureza do terroir se expresse sem artifícios.
              </p>
            </div>

            <Link
              to="/terroir"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-bordo hover:bg-bordo-light text-bege font-bold text-xs uppercase tracking-[0.15em] border border-dourado/40 shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-105 shrink-0 cursor-pointer"
            >
              <span>Conhecer o Terroir</span>
              <ArrowRight className="w-3.5 h-3.5 text-dourado transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

export default BrandStoryBento;
