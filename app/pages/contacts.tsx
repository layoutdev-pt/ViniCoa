import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  Phone,
  Mail,
  MessageCircle,
  Clock,
  PackageCheck,
  UtensilsCrossed,
  ShoppingBag,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { WinePurchaseCTA } from "../components/ui/WinePurchaseCTA";
import { GlobeSection } from "../components/ui/GlobeSection";
import penedosImg from "../assets/images/penedos-granito.jpg";

export function meta() {
  return [
    { title: "Contactos — Vinicôa Sabugal" },
    {
      name: "description",
      content:
        "Fale com a Vinicôa: encomendas online, restauração e garrafeiras. Vinhos selecionados de vários produtores e regiões, com envio para todo o mundo.",
    },
  ];
}

const ASSUNTOS = {
  duvida: "Dúvidas sobre os vinhos",
  encomenda: "Encomenda existente",
  horeca: "Restauração e garrafeiras",
  outro: "Outro assunto",
} as const;

type Assunto = keyof typeof ASSUNTOS;

const isAssunto = (v: string | null): v is Assunto => !!v && v in ASSUNTOS;

// Cada perfil escolhe um assunto do formulário ou leva a outra página
const PERFIS: { assunto?: Assunto; to?: string; icon: typeof PackageCheck; titulo: string; texto: string; acao: string }[] = [
  {
    assunto: "duvida",
    icon: PackageCheck,
    titulo: "Particulares",
    texto: "Ajuda na escolha de vinhos, ofertas personalizadas e acompanhamento de encomendas.",
    acao: "Escrever mensagem",
  },
  {
    assunto: "horeca",
    icon: UtensilsCrossed,
    titulo: "Profissionais",
    texto: "Condições para restauração, garrafeiras, sommeliers e distribuidores.",
    acao: "Escrever mensagem",
  },
  {
    to: "/vinhos",
    icon: ShoppingBag,
    titulo: "Loja online",
    texto: "Toda a nossa garrafeira está disponível online, com entrega em casa em Portugal e no estrangeiro.",
    acao: "Ver os vinhos",
  },
];

const FAQ = [
  {
    p: "Os vinhos são produzidos pela Vinicôa?",
    r: "Não. A Vinicôa é uma garrafeira com raízes no Sabugal: selecionamos e vendemos vinhos de vários produtores e regiões, que enviamos para todo o mundo.",
  },
  {
    p: "Quanto custam os portes de envio?",
    r: "O custo de envio depende do destino e é apresentado no checkout, antes de finalizar a compra.",
  },
  {
    p: "Como acompanho a minha encomenda?",
    r: "Assim que a encomenda for expedida, enviamos-lhe um e-mail com o número de seguimento. Se tiver alguma dúvida, contacte-nos com o número da encomenda.",
  },
  {
    p: "Enviam para fora de Portugal?",
    r: "Sim, enviamos para todo o mundo. O custo de envio depende do destino e é indicado no checkout antes de concluir a compra.",
  },
  {
    p: "E se uma garrafa chegar danificada?",
    r: "Enviamos em embalagens isotérmicas de alta proteção, mas se algo correr mal, envie-nos uma fotografia nas 48 horas seguintes à entrega e substituímos a garrafa sem custos.",
  },
  {
    p: "Posso pedir fatura com NIF?",
    r: "Sim. Indique o NIF no checkout, no passo de faturação. Se já fez a encomenda sem NIF, contacte-nos com o número da encomenda.",
  },
  {
    p: "Vendem para restaurantes e garrafeiras?",
    r: "Sim. Temos condições próprias para o canal HoReCa e garrafeiras, com fichas técnicas de cada vinho. Escolha «Restauração e garrafeiras» no formulário.",
  },
  {
    p: "Têm loja física?",
    r: "Não. A Vinicôa vende exclusivamente online, através desta garrafeira. Se precisar de ajuda a escolher um vinho, fale connosco por telefone, WhatsApp ou e-mail.",
  },
  {
    p: "Porque é pedida a confirmação de idade?",
    r: "A lei portuguesa (Decreto-Lei n.º 106/2015) só permite a venda de bebidas alcoólicas a maiores de 18 anos, incluindo na internet.",
  },
];

const inputClass =
  "w-full px-4 py-3.5 rounded-xl bg-vinicoa-noir border border-bege/20 text-sm text-bege placeholder:text-bege-muted/60 focus:border-dourado focus:outline-none transition-colors";
const labelClass = "block font-downey text-[11px] uppercase tracking-[0.24em] text-dourado mb-2";

export function Contacts() {
  const [searchParams] = useSearchParams();
  const initial = searchParams.get("assunto");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState<Assunto>(isAssunto(initial) ? initial : "duvida");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [sent, setSent] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const openedAt = useRef(Date.now());

  // Links como /contactos?assunto=horeca pré-selecionam o assunto
  useEffect(() => {
    if (isAssunto(initial)) setSubject(initial);
  }, [initial]);

  const chooseSubject = (a: Assunto) => {
    setSubject(a);
    setSent(false);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => messageRef.current?.focus({ preventScroll: true }), 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Anti-spam: campo isco preenchido ou envio em menos de 3 s = bot. Ignora em silêncio.
    const isBot = honeypot.trim() !== "" || Date.now() - openedAt.current < 3000;
    if (!isBot) {
      // Envio real (action + serviço de e-mail) ainda por ligar
    }
    setSent(true);
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setConsent(false);
  };

  return (
    <div className="w-full">
      {/* CABEÇALHO */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-[#0D0B0C]">
        <img
          src={penedosImg}
          alt="Penedo de granito nas encostas do Sabugal"
          className="absolute inset-0 w-full h-full object-cover img-mono opacity-40"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,11,12,0.35)_0%,rgba(13,11,12,0.88)_75%)]" />

        <div className="relative w-full max-w-4xl mx-auto px-6 pt-36 pb-20 flex flex-col items-center text-center">
          <p data-reveal="fade" className="font-downey text-[11px] sm:text-xs uppercase tracking-[0.5em] text-[#E8DCC6]/75 mb-8">Contactos</p>
          <h1 data-reveal data-reveal-delay="1" className="font-brand uppercase text-dourado text-3xl sm:text-4xl lg:text-5xl leading-[1.25] tracking-[0.16em]">
            Fale connosco
          </h1>
          <span data-reveal="zoom" data-reveal-delay="2" className="block w-14 h-px bg-dourado/60 my-8" aria-hidden="true" />
          <p data-reveal data-reveal-delay="3" className="text-base sm:text-lg text-[#E8DCC6]/85 leading-relaxed max-w-xl">
            Encomendas, parcerias ou dúvidas sobre os nossos vinhos: respondemos a todos os pedidos em até 24 horas úteis.
          </p>
        </div>
      </section>

      {/* COMO PODEMOS AJUDAR + FORMULÁRIO */}
      <section className="bg-vinicoa-noir px-6 lg:px-12 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto">
          {/* Perfis: escolhem o assunto do formulário */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
            {PERFIS.map(({ assunto, to, icon: Icon, titulo, texto, acao }, i) => {
              const className = `group block text-left rounded-3xl border p-7 transition-colors cursor-pointer ${
                assunto && subject === assunto ? "border-dourado bg-vinicoa-charcoal" : "border-dourado/20 hover:border-dourado/60"
              }`;
              const content = (
                <>
                  <Icon className="w-6 h-6 text-dourado mb-5" strokeWidth={1.25} />
                  <h2 className="font-brand uppercase text-2xl text-bege tracking-[0.05em] mb-2">{titulo}</h2>
                  <p className="text-base text-bege-dark leading-relaxed mb-5">{texto}</p>
                  <span className="font-downey text-[11px] uppercase tracking-[0.24em] text-dourado border-b border-dourado/40 group-hover:border-dourado pb-1">
                    {acao}
                  </span>
                </>
              );
              return to ? (
                <Link key={titulo} to={to} className={className} data-reveal data-reveal-delay={String(i + 1)}>
                  {content}
                </Link>
              ) : (
                <button key={titulo} data-reveal data-reveal-delay={String(i + 1)} type="button" onClick={() => assunto && chooseSubject(assunto)} className={className}>
                  {content}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Contactos diretos */}
            <div data-reveal="left" className="lg:col-span-5">
              <span className="font-downey text-xs uppercase tracking-[0.35em] text-dourado block mb-4">
                Contactos diretos
              </span>
              <h2 className="font-brand uppercase text-3xl sm:text-4xl text-bege tracking-[0.05em] mb-8">
                Prefere falar diretamente?
              </h2>

              <dl className="border-t border-dourado/25">
                <div className="py-5 border-b border-dourado/25 grid grid-cols-[1.75rem_1fr] gap-4">
                  <Phone className="w-5 h-5 text-dourado mt-0.5" strokeWidth={1.5} />
                  <div>
                    <dt className="font-downey text-[11px] uppercase tracking-[0.24em] text-bege-muted mb-1">Telefone</dt>
                    <dd>
                      <a href="tel:+351271000000" className="text-lg text-bege hover:text-dourado transition-colors">
                        +351 271 000 000
                      </a>
                    </dd>
                  </div>
                </div>
                <div className="py-5 border-b border-dourado/25 grid grid-cols-[1.75rem_1fr] gap-4">
                  <MessageCircle className="w-5 h-5 text-dourado mt-0.5" strokeWidth={1.5} />
                  <div>
                    <dt className="font-downey text-[11px] uppercase tracking-[0.24em] text-bege-muted mb-1">WhatsApp</dt>
                    <dd>
                      <a
                        href="https://wa.me/351271000000?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20vinhos%20da%20Vinic%C3%B4a."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg text-bege hover:text-dourado transition-colors"
                      >
                        Iniciar conversa
                      </a>
                    </dd>
                  </div>
                </div>
                <div className="py-5 border-b border-dourado/25 grid grid-cols-[1.75rem_1fr] gap-4">
                  <Mail className="w-5 h-5 text-dourado mt-0.5" strokeWidth={1.5} />
                  <div>
                    <dt className="font-downey text-[11px] uppercase tracking-[0.24em] text-bege-muted mb-1">E-mail</dt>
                    <dd>
                      <a href="mailto:geral@vinicoa.pt" className="text-lg text-bege hover:text-dourado transition-colors">
                        geral@vinicoa.pt
                      </a>
                    </dd>
                  </div>
                </div>
                <div className="py-5 border-b border-dourado/25 grid grid-cols-[1.75rem_1fr] gap-4">
                  <Clock className="w-5 h-5 text-dourado mt-0.5" strokeWidth={1.5} />
                  <div>
                    <dt className="font-downey text-[11px] uppercase tracking-[0.24em] text-bege-muted mb-1">Horário de apoio</dt>
                    <dd className="text-base text-bege-dark leading-relaxed">
                      Segunda a sexta: 09h00 — 18h00
                      <br />
                      Sábados: 10h00 — 13h00 (encomendas)
                      <br />
                      Domingos e feriados: encerrado
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            {/* Formulário */}
            <div data-reveal="right" data-reveal-delay="1" ref={formRef} className="lg:col-span-7 scroll-mt-28 rounded-3xl bg-vinicoa-charcoal border border-dourado/20 p-7 sm:p-10">
              {sent ? (
                <div className="py-10 text-center flex flex-col items-center" role="status">
                  <CheckCircle2 className="w-10 h-10 text-dourado mb-6" strokeWidth={1.25} />
                  <h2 className="font-brand uppercase text-3xl text-bege tracking-[0.05em] mb-4">Mensagem enviada</h2>
                  <p className="text-base text-bege-dark leading-relaxed max-w-sm mb-8">
                    Obrigado pelo contacto. A nossa equipa responde em até 24 horas úteis.
                  </p>
                  <button type="button" onClick={() => setSent(false)} className="btn-brand btn-bordo">
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-brand uppercase text-3xl text-bege tracking-[0.05em] mb-2">Envie-nos uma mensagem</h2>
                  <p className="text-base text-bege-dark mb-8">Os campos com * são obrigatórios.</p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="ct-nome" className={labelClass}>
                          Nome *
                        </label>
                        <input
                          id="ct-nome"
                          type="text"
                          required
                          autoComplete="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="O seu nome"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="ct-email" className={labelClass}>
                          E-mail *
                        </label>
                        <input
                          id="ct-email"
                          type="email"
                          required
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="email@exemplo.pt"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="ct-telefone" className={labelClass}>
                          Telefone
                        </label>
                        <input
                          id="ct-telefone"
                          type="tel"
                          autoComplete="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Opcional"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="ct-assunto" className={labelClass}>
                          Assunto *
                        </label>
                        <select
                          id="ct-assunto"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value as Assunto)}
                          className={inputClass}
                        >
                          {Object.entries(ASSUNTOS).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="ct-mensagem" className={labelClass}>
                        Mensagem *
                      </label>
                      <textarea
                        id="ct-mensagem"
                        ref={messageRef}
                        rows={6}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={
                          subject === "encomenda"
                              ? "Indique o número da encomenda."
                              : "Como podemos ajudar?"
                        }
                        className={`${inputClass} resize-y`}
                      />
                    </div>

                    {/* Campo isco anti-spam: invisível para pessoas, preenchido por bots */}
                    <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
                      <label htmlFor="ct-website">Website</label>
                      <input
                        id="ct-website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                      />
                    </div>

                    <label htmlFor="ct-rgpd" className="flex items-start gap-3 cursor-pointer">
                      <input
                        id="ct-rgpd"
                        type="checkbox"
                        required
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-1 w-4 h-4 shrink-0 accent-[#6B0015] cursor-pointer"
                      />
                      <span className="text-sm text-bege-dark leading-relaxed">
                        Autorizo a Vinicôa a usar estes dados apenas para responder ao meu pedido, de acordo com a
                        Política de Privacidade (RGPD). *
                      </span>
                    </label>

                    <button type="submit" className="btn-brand btn-bordo w-full !py-4">
                      Enviar mensagem
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* DO SABUGAL PARA O MUNDO */}
      <GlobeSection />

      {/* PERGUNTAS FREQUENTES */}
      <section className="bg-vinicoa-noir px-6 lg:px-12 py-20 lg:py-28">
        <div className="max-w-3xl mx-auto">
          <div data-reveal className="text-center mb-12">
            <span className="font-downey text-xs uppercase tracking-[0.35em] text-dourado block mb-4">
              Perguntas frequentes
            </span>
            <h2 className="font-brand uppercase text-4xl sm:text-5xl text-bege tracking-[0.05em]">
              Antes de nos escrever
            </h2>
          </div>

          <div className="border-t border-dourado/25">
            {FAQ.map((item, i) => (
              <details data-reveal data-reveal-delay={String(Math.min(i + 1, 6))} key={item.p} className="group border-b border-dourado/25">
                <summary className="flex items-center justify-between gap-6 py-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="font-brand uppercase text-lg sm:text-xl text-bege tracking-[0.04em]">{item.p}</span>
                  <ChevronDown
                    className="w-5 h-5 text-dourado shrink-0 transition-transform duration-300 group-open:rotate-180"
                    strokeWidth={1.5}
                  />
                </summary>
                <p className="pb-6 pr-10 text-base text-bege-dark leading-relaxed">{item.r}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA DE INCENTIVO À COMPRA DE VINHOS */}
      <WinePurchaseCTA />
    </div>
  );
}

export default Contacts;
