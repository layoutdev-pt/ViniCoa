import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";

interface MapAndContactSectionProps {
  className?: string;
}

export function MapAndContactSection({ className = "" }: MapAndContactSectionProps) {
  return (
    <section className={`py-20 lg:py-24 px-6 lg:px-12 bg-vinicoa-charcoal relative overflow-hidden border-t border-bege/10 ${className}`}>
      {/* Luz ambiente dourada de fundo */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-dourado/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-bordo/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Cabeçalho da Secção */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-downey text-xs uppercase tracking-[0.35em] text-dourado font-semibold block mb-3">
            Localização & Atendimento
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl text-bege font-bold mb-4">
            No Coração da Raia Histórica
          </h2>
          <p className="text-xs sm:text-sm text-bege-dark font-light leading-relaxed max-w-xl mx-auto">
            Situada no Sabugal, entre as brisas puras da serra, os socalcos do Rio Côa e a fortaleza lendária das Cinco Quinas.
          </p>
        </div>

        {/* Grelha: Contactos (5 cols) + Mapa (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Coluna de Contactos & Sede */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Bloco 1: Sede e Localização */}
            <div className="p-7 rounded-3xl glass-luxury border border-dourado/20 hover:border-dourado/40 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-bordo/40 border border-dourado/30 flex items-center justify-center text-dourado shadow-inner">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-downey text-xs uppercase tracking-wider text-dourado font-bold">
                    Sede & Adega
                  </h3>
                  <span className="text-xs font-editorial text-bege-muted">Sabugal, Beira Interior</span>
                </div>
              </div>
              <p className="text-xs text-bege-dark leading-relaxed font-light mb-4">
                Quinta do Vale das Quinas<br />
                6320-112 Sabugal, Portugal
              </p>
              <a
                href="https://maps.google.com/?q=Sabugal,+Portugal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-dourado font-bold hover:underline"
              >
                <span>Abrir no Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Bloco 2: Linhas Diretas */}
            <div className="p-7 rounded-3xl glass-luxury border border-dourado/20 hover:border-dourado/40 transition-colors">
              <h3 className="font-downey text-xs uppercase tracking-wider text-dourado font-bold mb-4">
                Contactos Diretos
              </h3>
              <ul className="space-y-4 text-xs text-bege-dark">
                <li className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/5 border border-bege/10 flex items-center justify-center text-dourado shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-bege-muted block leading-none mb-1">Telefone</span>
                    <a href="tel:+351271000000" className="text-bege hover:text-dourado font-semibold transition">
                      +351 271 000 000
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/5 border border-bege/10 flex items-center justify-center text-dourado shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-bege-muted block leading-none mb-1">E-mail Geral</span>
                    <a href="mailto:geral@vinicoa.pt" className="text-bege hover:text-dourado font-semibold transition">
                      geral@vinicoa.pt
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Bloco 3: Horário de Atendimento */}
            <div className="p-6 rounded-2xl glass-luxury border border-bege/10">
              <div className="flex items-center gap-2.5 text-xs font-bold text-dourado mb-2">
                <Clock className="w-4 h-4" />
                <span className="font-downey uppercase tracking-wider">Apoio ao Cliente & Logística</span>
              </div>
              <p className="text-xs text-bege-muted leading-relaxed font-light">
                Segunda a Sexta: 09h00 — 18h00<br />
                Sábados: 10h00 — 13h00 (Apoio a Encomendas)<br />
                Domingos e Feriados: Encerrado
              </p>
            </div>

          </div>

          {/* Coluna do Mapa Interativo */}
          <div className="lg:col-span-7 rounded-3xl glass-luxury p-3 border border-dourado/30 shadow-2xl relative min-h-[420px] lg:min-h-[500px] flex flex-col overflow-hidden">
            <div className="relative w-full h-full flex-1 rounded-2xl overflow-hidden border border-bege/10">
              <iframe
                src="https://maps.google.com/maps?q=Sabugal,+Portugal&t=&z=13&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "380px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa de Localização da Vinicôa - Sabugal, Portugal"
                className="w-full h-full rounded-2xl filter contrast-[1.05] opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
export default MapAndContactSection;
