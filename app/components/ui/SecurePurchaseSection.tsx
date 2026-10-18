import { Wine, ShieldCheck, PackageCheck, Home } from "lucide-react";

const PASSOS = [
  {
    icon: Wine,
    titulo: "Escolha os vinhos",
    texto: "Explore a garrafeira online e adicione ao cesto os vinhos que quer levar para a sua mesa.",
  },
  {
    icon: ShieldCheck,
    titulo: "Pagamento seguro",
    texto: "Escolha o método de pagamento que preferir e conclua a compra num ambiente protegido.",
  },
  {
    icon: PackageCheck,
    titulo: "Preparação cuidada",
    texto: "Preparamos a sua encomenda com cuidado, em embalagens de proteção para cada garrafa.",
  },
  {
    icon: Home,
    titulo: "Entrega em casa",
    texto: "Receba os vinhos à porta e acompanhe a encomenda com o número de seguimento enviado por e-mail.",
  },
];

// Nomes dos métodos aceites; substituir por logótipos oficiais quando estiverem disponíveis
const METODOS = ["MB WAY", "Multibanco", "PayPal", "Apple Pay", "Google Pay"];

export function SecurePurchaseSection() {
  return (
    <section className="bg-bege px-6 lg:px-12 py-20 lg:py-28" aria-labelledby="compra-segura-titulo">
      <div className="max-w-7xl mx-auto">
        <div data-reveal className="text-center max-w-2xl mx-auto mb-14 lg:mb-20">
          <span className="font-downey text-xs uppercase tracking-[0.35em] text-bordo block mb-4">
            Caminho do cliente
          </span>
          <h2
            id="compra-segura-titulo"
            className="font-brand uppercase text-4xl sm:text-5xl text-bordo tracking-[0.05em]"
          >
            Compra segura em 4 passos
          </h2>
          <span className="block w-14 h-px bg-dourado-dark/60 mx-auto mt-8" aria-hidden="true" />
        </div>

        <ol className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-14">
          {/* Filete que une os passos (desktop) */}
          <span
            className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-px bg-bordo/25"
            aria-hidden="true"
          />

          {PASSOS.map(({ icon: Icon, titulo, texto }, i) => (
            <li data-reveal data-reveal-delay={String(i + 1)} key={titulo} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 w-14 h-14 rounded-full bg-bege border border-bordo/40 flex items-center justify-center mb-6">
                <Icon className="w-6 h-6 text-bordo" strokeWidth={1.25} />
              </div>
              <span className="font-downey text-xs text-dourado-dark tracking-[0.3em] mb-3">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-brand uppercase text-xl text-[#0D0B0C] tracking-[0.06em] mb-3">{titulo}</h3>
              <p className="text-base text-[#5C3D42] leading-relaxed max-w-[17rem]">{texto}</p>
            </li>
          ))}
        </ol>

        {/* Métodos de pagamento */}
        <div data-reveal="fade" className="mt-16 lg:mt-20 border-y border-bordo/20 py-6 flex flex-col xl:flex-row items-center justify-between gap-5">
          <p className="font-downey text-xs uppercase tracking-[0.3em] text-bordo shrink-0">Métodos de pagamento</p>
          <ul
            className="flex flex-wrap justify-center xl:justify-end items-center gap-x-6 gap-y-3"
            aria-label="Métodos de pagamento aceites"
          >
            {METODOS.map((m, i) => (
              <li key={m} className="flex items-center gap-6">
                {i > 0 && <span className="hidden sm:block w-px h-4 bg-bordo/25" aria-hidden="true" />}
                <span className="font-downey text-xs sm:text-sm uppercase tracking-[0.2em] text-[#0D0B0C]">{m}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default SecurePurchaseSection;
