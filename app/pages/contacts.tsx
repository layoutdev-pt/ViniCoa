import { useState } from "react";
import { MessageSquare, Send, CheckCircle2, PackageCheck, UtensilsCrossed } from "lucide-react";
import { useCart } from "../lib/cart-context";
import { WinePurchaseCTA } from "../components/ui/WinePurchaseCTA";
import { MapAndContactSection } from "../components/ui/MapAndContactSection";

export function Contacts() {
  const { showToast } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Dúvida Comercial");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Mensagem enviada com sucesso! A nossa equipa entrará em contacto brevemente.");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="w-full">
      <div className="pt-36 sm:pt-40 md:pt-44 pb-20 px-6 lg:px-12 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="font-downey text-xs uppercase tracking-[0.35em] text-dourado font-semibold block mb-2">
            Linha Direta com a Adega
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-bege font-bold mb-4">
            Contacte a Vinicôa
          </h1>
          <p className="text-xs sm:text-sm text-bege-dark leading-relaxed font-light">
            Estamos inteiramente disponíveis para esclarecer dúvidas sobre os nossos vinhos, apoiar na sua encomenda particular ou apresentar condições de distribuição para o canal HoReCa e garrafeiras.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          {/* Informação e Apoio ao Cliente */}
          <div className="md:col-span-5 space-y-5">
            <div className="glass-luxury p-7 rounded-3xl border border-dourado/20">
              <h3 className="font-downey text-xs uppercase tracking-wider text-dourado font-bold mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-dourado" /> Apoio Especializado
              </h3>
              <p className="text-xs text-bege-dark leading-relaxed font-light mb-6">
                A nossa equipa acompanha cada pedido com a dedicação que as nossas edições merecem. Envie-nos a sua mensagem ou utilize os nossos contactos diretos abaixo.
              </p>

              <div className="space-y-4 text-xs text-bege-dark">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-bege/10">
                  <PackageCheck className="w-4 h-4 text-dourado shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-bege block font-semibold mb-0.5">Encomendas Particulares</strong>
                    <span className="text-[11px] text-bege-muted">Apoio na seleção de garrafas, personalização e acompanhamento de envios.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-bege/10">
                  <UtensilsCrossed className="w-4 h-4 text-dourado shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-bege block font-semibold mb-0.5">Restauração & Garrafeiras</strong>
                    <span className="text-[11px] text-bege-muted">Condições especiais para profissionais, sommeliers e distribuidores.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-bege/10">
                  <CheckCircle2 className="w-4 h-4 text-dourado shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-bege block font-semibold mb-0.5">Resposta Rápida</strong>
                    <span className="text-[11px] text-bege-muted">Compromisso de resposta a todos os pedidos num prazo máximo de 24 horas úteis.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de Contacto */}
          <div className="md:col-span-7 glass-luxury p-8 sm:p-10 rounded-3xl border border-dourado/25 shadow-2xl relative">
            <h3 className="font-editorial text-2xl text-bege font-bold mb-2">
              Envie-nos uma Mensagem
            </h3>
            <p className="text-xs text-bege-muted mb-6">
              Preencha os campos abaixo para obter uma resposta personalizada.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-dourado font-semibold mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="O seu nome"
                    className="w-full px-4 py-3 rounded-xl bg-vinicoa-noir border border-bege/20 text-xs text-bege focus:border-dourado focus:outline-none placeholder:text-bege-muted/50"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-dourado font-semibold mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@exemplo.pt"
                    className="w-full px-4 py-3 rounded-xl bg-vinicoa-noir border border-bege/20 text-xs text-bege focus:border-dourado focus:outline-none placeholder:text-bege-muted/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase text-dourado font-semibold mb-1">
                  Assunto
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-vinicoa-noir border border-bege/20 text-xs text-bege focus:border-dourado focus:outline-none"
                >
                  <option value="Dúvida Comercial">Dúvida sobre os Vinhos / Loja Online</option>
                  <option value="Distribuição HoReCa">Parcerias de Distribuição / Restaurantes</option>
                  <option value="Apoio a Encomenda">Estado de Encomenda Existente</option>
                  <option value="Outro">Outro Assunto</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase text-dourado font-semibold mb-1">
                  Mensagem
                </label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Como o podemos ajudar?"
                  className="w-full px-4 py-3 rounded-xl bg-vinicoa-noir border border-bege/20 text-xs text-bege focus:border-dourado focus:outline-none placeholder:text-bege-muted/50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-bordo hover:bg-bordo-light text-bege text-xs uppercase font-bold tracking-[0.15em] transition cursor-pointer shadow-xl border border-dourado/30 flex items-center justify-center gap-2 group"
              >
                <span>Enviar Mensagem</span>
                <Send className="w-3.5 h-3.5 text-dourado group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
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

export default Contacts;
