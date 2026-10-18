import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";

interface MapAndContactSectionProps {
  className?: string;
}

export function MapAndContactSection({ className = "" }: MapAndContactSectionProps) {
  return (
    <section className={`py-20 lg:py-28 px-6 lg:px-12 bg-vinicoa-noir ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho da Secção */}
        <div className="max-w-3xl mb-14">
          <span className="font-downey text-xs uppercase tracking-[0.35em] text-dourado block mb-4">
            Localização & Atendimento
          </span>
          <h2 className="font-brand uppercase text-4xl sm:text-5xl text-bege tracking-[0.04em] mb-6">
            No coração da Raia histórica
          </h2>
          <p className="text-base text-bege-dark leading-relaxed max-w-xl">
            No Sabugal, entre a serra, os socalcos do Rio Côa e a fortaleza das Cinco Quinas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
          {/* Contactos */}
          <div className="lg:col-span-5">
            <dl className="border-t border-dourado/25">
              <div className="py-6 border-b border-dourado/25 grid grid-cols-[1.5rem_1fr] gap-4">
                <MapPin className="w-4 h-4 text-dourado mt-0.5" strokeWidth={1.5} />
                <div>
                  <dt className="font-downey text-xs uppercase tracking-[0.24em] text-dourado mb-2">Sede & Adega</dt>
                  <dd className="text-sm text-bege-dark leading-relaxed mb-3">
                    Quinta do Vale das Quinas
                    <br />
                    6320-112 Sabugal, Portugal
                  </dd>
                  <a
                    href="https://maps.google.com/?q=Sabugal,+Portugal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-downey text-[11px] uppercase tracking-[0.2em] text-bege hover:text-dourado border-b border-dourado/50 pb-1 transition-colors"
                  >
                    Abrir no Google Maps <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="py-6 border-b border-dourado/25 grid grid-cols-[1.5rem_1fr] gap-4">
                <Phone className="w-4 h-4 text-dourado mt-0.5" strokeWidth={1.5} />
                <div>
                  <dt className="font-downey text-xs uppercase tracking-[0.24em] text-dourado mb-2">Telefone</dt>
                  <dd>
                    <a href="tel:+351271000000" className="text-sm text-bege hover:text-dourado transition-colors">
                      +351 271 000 000
                    </a>
                  </dd>
                </div>
              </div>

              <div className="py-6 border-b border-dourado/25 grid grid-cols-[1.5rem_1fr] gap-4">
                <Mail className="w-4 h-4 text-dourado mt-0.5" strokeWidth={1.5} />
                <div>
                  <dt className="font-downey text-xs uppercase tracking-[0.24em] text-dourado mb-2">E-mail</dt>
                  <dd>
                    <a href="mailto:geral@vinicoa.pt" className="text-sm text-bege hover:text-dourado transition-colors">
                      geral@vinicoa.pt
                    </a>
                  </dd>
                </div>
              </div>

              <div className="py-6 border-b border-dourado/25 grid grid-cols-[1.5rem_1fr] gap-4">
                <Clock className="w-4 h-4 text-dourado mt-0.5" strokeWidth={1.5} />
                <div>
                  <dt className="font-downey text-xs uppercase tracking-[0.24em] text-dourado mb-2">Horário</dt>
                  <dd className="text-sm text-bege-dark leading-relaxed">
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

          {/* Mapa (P&B, como a fotografia do manual) */}
          <div className="lg:col-span-7 relative min-h-[380px] lg:min-h-[520px] rounded-3xl overflow-hidden border border-dourado/25">
            <iframe
              src="https://maps.google.com/maps?q=Sabugal,+Portugal&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de Localização da Vinicôa - Sabugal, Portugal"
              className="absolute inset-0 w-full h-full grayscale contrast-[1.05]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
export default MapAndContactSection;
