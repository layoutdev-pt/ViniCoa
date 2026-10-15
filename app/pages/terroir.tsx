import { Mountain, Gem, Sparkles } from "lucide-react";
import { WinePurchaseCTA } from "../components/ui/WinePurchaseCTA";
import { MapAndContactSection } from "../components/ui/MapAndContactSection";

export function Terroir() {
  return (
    <div className="w-full">
      <div className="pt-36 sm:pt-40 md:pt-44 pb-20 px-6 lg:px-12 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-[0.3em] text-dourado font-semibold block mb-2">
          Geologia & Identidade
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl text-bege font-bold mb-4">
          A Pedra, o Rio e o Vento
        </h1>
        <p className="text-xs sm:text-sm text-bege-dark leading-relaxed font-light">
          No Sabugal, a viticultura é de montanha e fronteira. Conheça as características que definem a singularidade inconfundível dos nossos vinhos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="glass-luxury p-8 rounded-2xl border border-dourado/20">
          <div className="w-12 h-12 rounded-xl bg-bordo/40 text-dourado flex items-center justify-center mb-4">
            <Mountain className="w-6 h-6 text-dourado" />
          </div>
          <h3 className="font-editorial text-2xl font-bold text-bege mb-2">
            Altitude e Amplitude Térmica
          </h3>
          <p className="text-xs sm:text-sm text-bege-dark leading-relaxed">
            As nossas parcelas situam-se entre os 700m e os 820m de altitude. Dias quentes e noites acentuadamente frias preservam a acidez natural e prolongam o ciclo de maturação fenólica das castas autóctones, conferindo uma vivacidade ímpar.
          </p>
        </div>

        <div className="glass-luxury p-8 rounded-2xl border border-dourado/20">
          <div className="w-12 h-12 rounded-xl bg-bordo/40 text-dourado flex items-center justify-center mb-4">
            <Gem className="w-6 h-6 text-dourado" />
          </div>
          <h3 className="font-editorial text-2xl font-bold text-bege mb-2">
            Solos de Granito Puro
          </h3>
          <p className="text-xs sm:text-sm text-bege-dark leading-relaxed">
            As raízes das vinhas velhas penetram nas fendas da rocha granítica e xistosa. O resultado é uma tensão mineral vibrante, elegância de taninos finos e uma longevidade extraordinária em garrafa que honra o tempo.
          </p>
        </div>
      </div>

      <div className="rounded-3xl glass-luxury p-8 sm:p-12 border border-dourado/30 relative overflow-hidden mb-16">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-dourado" />
          <h3 className="font-editorial text-3xl font-bold text-bege">
            Castas Autóctones da Beira Interior
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-bege-dark">
          <div className="p-4 rounded-xl bg-white/5 border border-bege/10">
            <strong className="text-dourado block text-sm font-bold mb-1">
              Fonte Cal
            </strong>
            Exclusiva da nossa sub-região, confere estrutura untuosa, notas florais delicadas e uma mineralidade salina e cortante nos vinhos brancos.
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-bege/10">
            <strong className="text-dourado block text-sm font-bold mb-1">
              Rufete
            </strong>
            A casta nobre das altitudes serranas, responsável por vinhos tintos frescos, aromáticos, com aromas a frutos do bosque e enorme elegância.
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-bege/10">
            <strong className="text-dourado block text-sm font-bold mb-1">
              Touriga Nacional
            </strong>
            Expressa no Sabugal bagas silvestres maduras, esteva, violetas e um perfil balsâmico com taninos de seda aveludada.
          </div>
        </div>
      </div>

      </div>

      {/* CTA DE INCENTIVO À COMPRA DE VINHOS */}
      <WinePurchaseCTA />

      {/* SECÇÃO DE MAPA E CONTACTOS */}
      <MapAndContactSection />
    </div>
  );
}
export default Terroir;
