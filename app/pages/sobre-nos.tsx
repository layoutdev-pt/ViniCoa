import { WinePurchaseCTA } from "../components/ui/WinePurchaseCTA";
import { GlobeSection } from "../components/ui/GlobeSection";
import { LogoDeconstruction } from "../components/ui/LogoDeconstruction";
import casteloImg from "../assets/images/castelo.webp";
import uvasImg from "../assets/images/uvas-orvalho.jpg";
import penedosImg from "../assets/images/penedos-granito.jpg";

export function meta() {
  return [
    { title: "Sobre Nós — Vinicôa Sabugal" },
    {
      name: "description",
      content:
        "A história da Vinicôa: uma garrafeira com raízes no Sabugal que seleciona vinhos de vários produtores e regiões e os envia para todo o mundo.",
    },
  ];
}

const PILARES = [
  {
    img: uvasImg,
    alt: "Cacho de uvas tintas com orvalho",
    valor: "Seleção",
    titulo: "Vinhos de vários produtores",
    texto:
      "Não produzimos vinho: escolhemo-lo. A nossa garrafeira reúne vinhos de diferentes produtores e regiões, selecionados pelo carácter, pela autenticidade e pela ligação à terra de onde vêm.",
  },
  {
    img: penedosImg,
    alt: "Penedo de granito nas encostas do Sabugal",
    valor: "Sabugal",
    titulo: "Raízes na Beira Interior",
    texto:
      "A Vinicôa nasce no Sabugal e é daqui que cada encomenda parte. Do território herdámos a identidade, o símbolo e a forma de olhar para o vinho: com tempo, rigor e respeito pela origem.",
  },
];

const COMPROMISSOS = [
  {
    etapa: "01",
    nome: "Escolher",
    texto: "Cada vinho entra na garrafeira por mérito próprio, venha de que região vier.",
  },
  {
    etapa: "02",
    nome: "Guardar",
    texto: "As garrafas são conservadas com cuidado até ao momento do envio.",
  },
  {
    etapa: "03",
    nome: "Enviar",
    texto: "Preparamos cada encomenda para chegar intacta, em Portugal ou em qualquer parte do mundo.",
  },
];

export function SobreNos() {
  return (
    <div className="w-full">
      {/* CABEÇALHO */}
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden bg-[#0D0B0C]">
        <img
          src={casteloImg}
          alt="Castelo das Cinco Quinas no Sabugal sob mar de nuvens"
          className="absolute inset-0 w-full h-full object-cover img-mono opacity-45"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,11,12,0.35)_0%,rgba(13,11,12,0.88)_75%)]" />

        <div className="relative w-full max-w-4xl mx-auto px-6 pt-36 pb-24 flex flex-col items-center text-center">
          <p data-reveal="fade" className="font-downey text-[11px] sm:text-xs uppercase tracking-[0.5em] text-[#E8DCC6]/75 mb-8">Sobre nós</p>
          <h1 data-reveal data-reveal-delay="1" className="font-brand uppercase text-dourado text-3xl sm:text-4xl lg:text-5xl leading-[1.25] tracking-[0.16em]">
            A pedra, o rio
            <br />e o vento
          </h1>
          <span data-reveal="zoom" data-reveal-delay="2" className="block w-14 h-px bg-dourado/60 my-8" aria-hidden="true" />
          <p data-reveal data-reveal-delay="3" className="text-base sm:text-lg text-[#E8DCC6]/85 leading-relaxed max-w-xl">
            É daqui, entre o granito e o Côa, que nasce a Vinicôa: uma garrafeira que escolhe vinhos de vários
            produtores e regiões e os leva a todo o mundo.
          </p>
        </div>
      </section>

      {/* ORIGEM */}
      <section className="bg-vinicoa-noir px-6 lg:px-12 py-20 lg:py-28">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div data-reveal="left" className="lg:col-span-5">
            <span className="font-downey text-xs uppercase tracking-[0.35em] text-dourado block mb-4">A origem</span>
            <h2 className="font-brand uppercase text-3xl sm:text-4xl text-bege tracking-[0.05em]">
              Uma garrafeira que nasce do território
            </h2>
          </div>
          <div data-reveal="right" data-reveal-delay="1" className="lg:col-span-7 space-y-6 text-base sm:text-lg text-bege-dark leading-relaxed">
            <p>
              A Vinicôa nasce da vontade de transformar o território do Sabugal numa identidade capaz de contar uma
              história: a ligação entre a terra, a tradição e o vinho.
            </p>
            <p>
              Somos uma garrafeira, não um produtor. Selecionamos vinhos de diferentes produtores e regiões e enviamo-los
              a partir do Sabugal para qualquer parte do mundo. Em comum, todos têm aquilo que procuramos numa garrafa:
              carácter, autenticidade e respeito pelo lugar de onde vêm.
            </p>
          </div>
        </div>
      </section>

      {/* DESCONSTRUÇÃO DO SÍMBOLO */}
      <LogoDeconstruction />

      {/* A NOSSA SELEÇÃO */}
      <section className="bg-vinicoa-noir px-6 lg:px-12 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto">
          <div data-reveal className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-downey text-xs uppercase tracking-[0.35em] text-dourado block mb-4">A nossa seleção</span>
            <h2 className="font-brand uppercase text-4xl sm:text-5xl text-bege tracking-[0.05em] mb-6">
              Muitas origens, um só critério
            </h2>
            <p className="text-base sm:text-lg text-bege-dark leading-relaxed">
              Os vinhos vêm de várias regiões. A forma de os escolher é sempre a mesma.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PILARES.map((t, i) => (
              <article data-reveal data-reveal-delay={String(i + 1)} key={t.titulo} className="rounded-3xl overflow-hidden bg-vinicoa-charcoal border border-dourado/20">
                <div className="relative aspect-[16/9] bg-[#0D0B0C]">
                  <img src={t.img} alt={t.alt} loading="lazy" className="w-full h-full object-cover img-mono opacity-80" />
                  <span className="absolute bottom-5 left-6 font-brand uppercase text-4xl sm:text-5xl text-bege-light tracking-[0.04em]">
                    {t.valor}
                  </span>
                </div>
                <div className="p-7 sm:p-9">
                  <h3 className="font-brand uppercase text-2xl text-bege tracking-[0.05em] mb-3">{t.titulo}</h3>
                  <p className="text-base text-bege-dark leading-relaxed">{t.texto}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Como trabalhamos */}
          <div className="mt-20">
            <h3 className="font-brand uppercase text-3xl text-bege tracking-[0.05em] text-center mb-10">
              Como trabalhamos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {COMPROMISSOS.map((c, i) => (
                <div data-reveal data-reveal-delay={String(i + 1)} key={c.nome} className="rounded-2xl border border-dourado/20 p-7">
                  <span className="font-downey text-xs uppercase tracking-[0.3em] text-dourado block mb-3">{c.etapa}</span>
                  <h4 className="font-brand uppercase text-2xl text-bege tracking-[0.05em] mb-3">{c.nome}</h4>
                  <p className="text-base text-bege-dark leading-relaxed">{c.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA DE INCENTIVO À COMPRA DE VINHOS */}
      <WinePurchaseCTA />

      {/* DO SABUGAL PARA O MUNDO */}
      <GlobeSection />
    </div>
  );
}
export default SobreNos;
