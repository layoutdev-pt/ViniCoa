import { Link } from "react-router";
import { ArrowRight, Truck, ShieldCheck, Wine, Award } from "lucide-react";
import uvasImg from "../../assets/images/uvas-orvalho.jpg";

interface WinePurchaseCTAProps {
  className?: string;
}

const GARANTIAS = [
  { icon: Truck, titulo: "Envio para todo o mundo", texto: "Encomende online e receba os vinhos em casa, em Portugal ou no estrangeiro." },
  { icon: ShieldCheck, titulo: "Embalagens de proteção", texto: "Caixas pensadas para que cada garrafa chegue intacta, perto ou longe." },
  { icon: Wine, titulo: "Conservação em cave", texto: "Garrafas armazenadas com controlo rigoroso de humidade e temperatura." },
  { icon: Award, titulo: "Seleção criteriosa", texto: "Vinhos de diferentes produtores e regiões, escolhidos pelo carácter e pela qualidade." },
];

export function WinePurchaseCTA({ className = "" }: WinePurchaseCTAProps) {
  return (
    <section className={`relative overflow-hidden bg-bordo px-6 lg:px-12 py-20 lg:py-28 ${className}`}>
      {/* Uvas em duotone bordô, como na aplicação sobre fundos do manual */}
      <div className="duotone-bordo absolute inset-0 opacity-40" aria-hidden="true">
        <img src={uvasImg} alt="" loading="lazy" className="w-full h-full object-cover" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div data-reveal className="max-w-3xl">
          <span className="font-downey text-xs uppercase tracking-[0.35em] text-dourado-light block mb-4">
            Garrafeira online · Envios para todo o mundo
          </span>
          <h2 className="font-brand uppercase text-4xl sm:text-5xl lg:text-6xl text-bege-light tracking-[0.04em] mb-6">
            Vinhos escolhidos, onde quer que esteja.
          </h2>
          <p className="text-base text-bege-light/80 leading-relaxed max-w-2xl mb-10">
            Uma seleção de vinhos de vários produtores e regiões, escolhida no Sabugal e enviada para a sua mesa, em
            Portugal ou em qualquer parte do mundo.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link to="/vinhos" className="btn-brand btn-bege">
              Explorar a garrafeira <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </Link>
            <Link to="/contactos?assunto=horeca" className="btn-brand btn-outline-light">
              Apoio comercial & restauração
            </Link>
          </div>
        </div>

        {/* Garantias */}
        <div className="mt-16 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-bege-light/20">
          {GARANTIAS.map(({ icon: Icon, titulo, texto }, i) => (
            <div data-reveal data-reveal-delay={String(i + 1)} key={titulo} className="pt-6 pb-2 sm:pr-8">
              <Icon className="w-5 h-5 text-dourado-light mb-4" strokeWidth={1.25} />
              <h3 className="font-downey text-xs uppercase tracking-[0.22em] text-bege-light mb-2">{titulo}</h3>
              <p className="text-xs text-bege-light/70 leading-relaxed">{texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default WinePurchaseCTA;
