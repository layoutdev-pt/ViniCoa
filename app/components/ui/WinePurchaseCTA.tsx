import { Link } from "react-router";
import { ArrowRight, Truck, ShieldCheck, Wine, Sparkles } from "lucide-react";

interface WinePurchaseCTAProps {
  className?: string;
}

export function WinePurchaseCTA({ className = "" }: WinePurchaseCTAProps) {
  return (
    <section className={`py-20 lg:py-24 px-6 lg:px-12 bg-vinicoa-noir relative overflow-hidden border-t border-dourado/20 ${className}`}>
      {/* Luzes radiais de atmosfera de adega */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-bordo/25 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-dourado/5 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-6xl mx-auto relative z-10 text-center">
        {/* Tagline do Brandbook */}
        <span className="font-downey text-xs sm:text-sm uppercase tracking-[0.35em] text-dourado font-semibold block mb-4">
          Edições Limitadas • Diretamente da Adega
        </span>

        {/* Título Principal de Conversão */}
        <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl text-bege font-bold leading-tight mb-6 max-w-4xl mx-auto">
          Leve a Alma do Sabugal <br />
          <span className="italic font-normal text-dourado">até à Sua Mesa</span>
        </h2>

        {/* Subtítulo Persuasivo */}
        <p className="text-sm sm:text-base text-bege-dark font-light leading-relaxed max-w-2xl mx-auto mb-10">
          Vinhos de altitude e produção artesanal, concebidos para quem valoriza o tempo, o granito e a elegância de um terroir ímpar na Beira Interior.
        </p>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to="/vinhos"
            className="w-full sm:w-auto px-9 py-4 rounded-xl bg-bordo hover:bg-bordo-light text-bege font-bold text-xs uppercase tracking-[0.2em] border border-dourado/40 shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Explorar a Garrafeira Online</span>
            <ArrowRight className="w-4 h-4 text-dourado group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/contactos"
            className="w-full sm:w-auto px-8 py-4 rounded-xl glass-luxury hover:bg-white/5 text-bege text-xs uppercase tracking-[0.2em] border border-bege/20 transition-all duration-300 font-medium"
          >
            Apoio Comercial & Restauração
          </Link>
        </div>

        {/* 4 Garantias de Excelência / Confiança */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left pt-10 border-t border-bege/10">
          {/* Garantia 1: Portes */}
          <div className="p-5 rounded-2xl glass-luxury border border-dourado/15 hover:border-dourado/35 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-bordo/40 border border-dourado/30 flex items-center justify-center text-dourado mb-3.5">
              <Truck className="w-4 h-4" />
            </div>
            <h4 className="font-downey text-xs uppercase tracking-wider text-bege font-bold mb-1">
              Portes Gratuitos
            </h4>
            <p className="text-[11px] text-bege-muted leading-relaxed font-light">
              Envio gratuito para Portugal Continental em compras superiores a 60€.
            </p>
          </div>

          {/* Garantia 2: Embalagens Térmicas */}
          <div className="p-5 rounded-2xl glass-luxury border border-dourado/15 hover:border-dourado/35 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-bordo/40 border border-dourado/30 flex items-center justify-center text-dourado mb-3.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="font-downey text-xs uppercase tracking-wider text-bege font-bold mb-1">
              Embalagens Isotérmicas
            </h4>
            <p className="text-[11px] text-bege-muted leading-relaxed font-light">
              Caixas térmicas de alta proteção contra impacto e variações de temperatura.
            </p>
          </div>

          {/* Garantia 3: Cave Climatizada */}
          <div className="p-5 rounded-2xl glass-luxury border border-dourado/15 hover:border-dourado/35 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-bordo/40 border border-dourado/30 flex items-center justify-center text-dourado mb-3.5">
              <Wine className="w-4 h-4" />
            </div>
            <h4 className="font-downey text-xs uppercase tracking-wider text-bege font-bold mb-1">
              Conservação em Cave
            </h4>
            <p className="text-[11px] text-bege-muted leading-relaxed font-light">
              Garrafas armazenadas sob rigoroso controlo de humidade e temperatura.
            </p>
          </div>

          {/* Garantia 4: Lotes Raros */}
          <div className="p-5 rounded-2xl glass-luxury border border-dourado/15 hover:border-dourado/35 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-bordo/40 border border-dourado/30 flex items-center justify-center text-dourado mb-3.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="font-downey text-xs uppercase tracking-wider text-bege font-bold mb-1">
              Edições Numeradas
            </h4>
            <p className="text-[11px] text-bege-muted leading-relaxed font-light">
              Vinhos exclusivos de altitude com selo de autenticidade da Beira Interior.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
export default WinePurchaseCTA;
