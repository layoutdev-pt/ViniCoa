import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import casteloImg from "../../assets/images/castelo.webp";
import penedosImg from "../../assets/images/penedos-granito.jpg";

export function BrandStoryBento() {
  return (
    <section id="historia-marca" className="py-20 lg:py-28 px-6 lg:px-12 bg-vinicoa-noir">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho centrado */}
        <div data-reveal className="text-center max-w-2xl mx-auto mb-14">
          <span className="font-downey text-xs uppercase tracking-[0.35em] text-dourado block mb-4">
            A nossa história
          </span>
          <h2 className="font-brand uppercase text-4xl sm:text-5xl text-bege tracking-[0.06em] mb-6">
            Uma garrafeira com alma da Raia
          </h2>
          <p className="text-sm sm:text-base font-light text-bege-dark leading-relaxed">
            Nascemos no Sabugal e escolhemos vinhos de várias origens, com o mesmo cuidado com que se guarda uma tradição.
          </p>
        </div>

        {/* Bento: castelo em destaque + duas peças de apoio */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-5">
          {/* O símbolo — Castelo das Cinco Quinas */}
          <article data-reveal="zoom" className="group relative md:col-span-2 lg:row-span-2 min-h-[420px] lg:min-h-[560px] rounded-3xl overflow-hidden bg-[#0D0B0C] flex items-end">
            <img
              src={casteloImg}
              alt="Castelo das Cinco Quinas no Sabugal sob mar de nuvens"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover img-mono opacity-70 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B0C] via-[#0D0B0C]/30 to-transparent" />
            <div className="relative p-8 sm:p-10 max-w-xl">
              <span className="font-downey text-[11px] uppercase tracking-[0.3em] text-dourado block mb-3">
                O símbolo
              </span>
              <h3 className="font-brand uppercase text-3xl sm:text-4xl text-bege-light tracking-[0.05em] mb-4">
                Castelo das Cinco Quinas
              </h3>
              <p className="text-sm font-light text-bege-light/75 leading-relaxed">
                As cinco formas no topo do brasão reinterpretam as quinas da fortaleza do Sabugal: uma silhueta que
                representa a história, a proteção e a herança cultural do território.
              </p>
            </div>
          </article>

          {/* Raízes no Sabugal */}
          <article data-reveal="zoom" data-reveal-delay="2" className="group relative min-h-[280px] rounded-3xl overflow-hidden bg-[#0D0B0C] flex items-end">
            <img
              src={penedosImg}
              alt="Penedo de granito nas encostas do Sabugal"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover img-mono opacity-60 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B0C] via-[#0D0B0C]/40 to-transparent" />
            <div className="relative p-7">
              <span className="font-downey text-[11px] uppercase tracking-[0.3em] text-dourado block mb-3">
                As nossas raízes
              </span>
              <h3 className="font-brand uppercase text-2xl text-bege-light tracking-[0.05em] mb-2">
                Feita no Sabugal
              </h3>
              <p className="text-xs font-light text-bege-light/75 leading-relaxed">
                Do granito e da fronteira herdámos a identidade. É daqui que cada garrafa parte para o mundo.
              </p>
            </div>
          </article>

          {/* A seleção */}
          <article data-reveal="zoom" data-reveal-delay="3" className="rounded-3xl bg-vinicoa-charcoal border border-dourado/20 p-7 flex flex-col">
            <span className="font-downey text-[11px] uppercase tracking-[0.3em] text-dourado block mb-3">
              A seleção
            </span>
            <h3 className="font-brand uppercase text-2xl text-bege tracking-[0.05em] mb-2">
              Vinhos de várias origens
            </h3>
            <p className="text-xs font-light text-bege-dark leading-relaxed mb-6">
              Não produzimos vinho: escolhemo-lo. Reunimos garrafas de diferentes produtores e regiões, sempre pelo carácter e pela qualidade.
            </p>
            <Link to="/sobre-nos" className="btn-brand btn-bordo mt-auto self-start whitespace-nowrap">
              Conhecer a Vinicôa <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}

export default BrandStoryBento;
