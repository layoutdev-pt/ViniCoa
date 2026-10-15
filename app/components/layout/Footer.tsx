import { useState } from "react";
import { Link } from "react-router";
import { MapPin, Phone, Mail, ExternalLink, ShieldCheck } from "lucide-react";
import { VinicoaLogo } from "../ui/VinicoaLogo";

export function Footer() {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState<{ text: string; error: boolean } | null>(null);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email.trim())) {
      setFeedback({ text: "Por favor introduza um e-mail válido.", error: true });
      return;
    }
    setFeedback({ text: "Obrigado! Inscrição confirmada na garrafeira.", error: false });
    setEmail("");
  };

  return (
    <footer id="contacto" className="bg-vinicoa-noir border-t border-dourado/20 pt-16 pb-12 px-6 lg:px-12 text-bege-dark mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-bege/10">
        
        {/* Coluna 1: Marca & Brasão */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <VinicoaLogo showText={false} size="sm" />
            <span className="font-editorial font-bold text-xl tracking-[0.2em] text-bege">VINICÔA</span>
          </div>
          <p className="text-xs leading-relaxed text-bege-muted mb-5">
            Vinhos de altitude cultivados com alma e identidade nos solos graníticos do Sabugal. A nobreza da Beira Interior engarrafada.
          </p>
          <div className="flex space-x-3 text-dourado">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full glass-luxury flex items-center justify-center hover:text-bege transition"
              aria-label="Siga-nos no Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full glass-luxury flex items-center justify-center hover:text-bege transition"
              aria-label="Siga-nos no Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full glass-luxury flex items-center justify-center hover:text-bege transition"
              aria-label="Siga-nos no LinkedIn"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Coluna 2: Adega & Contactos */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-dourado font-bold mb-4">Adega & Terroir</h4>
          <ul className="text-xs space-y-3">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-dourado mt-0.5 shrink-0" />
              <span>Quinta do Vale das Quinas<br />6320-112 Sabugal, Portugal</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-dourado shrink-0" />
              <a href="tel:+351271000000" className="hover:text-dourado transition">+351 271 000 000</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-dourado shrink-0" />
              <a href="mailto:geral@vinicoa.pt" className="hover:text-dourado transition">geral@vinicoa.pt</a>
            </li>
          </ul>
        </div>

        {/* Coluna 3: Navegação & Legal Obrigatório */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-dourado font-bold mb-4">Informação Legal</h4>
          <ul className="text-xs space-y-2.5">
            <li>
              <Link to="/terroir" className="hover:text-dourado transition">O Terroir do Sabugal</Link>
            </li>
            <li>
              <Link to="/vinhos" className="hover:text-dourado transition">Garrafeira de Vinhos</Link>
            </li>
            <li>
              <a
                href="https://www.livroreclamacoes.pt"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-dourado transition flex items-center gap-1.5"
              >
                <ExternalLink className="w-3 h-3 text-dourado" /> Livro de Reclamações Eletrónico
              </a>
            </li>
            <li>
              <a
                href="https://www.cniacc.pt"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-dourado transition flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3 h-3 text-dourado" /> Resolução de Litígios (RAL - CNIACC)
              </a>
            </li>
            <li>
              <span className="text-bege-muted">Política de Privacidade & RGPD</span>
            </li>
            <li>
              <span className="text-bege-muted">Termos & Condições de Venda</span>
            </li>
          </ul>
        </div>

        {/* Coluna 4: Clube da Garrafeira */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-dourado font-bold mb-3">Clube da Garrafeira</h4>
          <p className="text-xs text-bege-muted mb-3 leading-relaxed">
            Receba alocações antecipadas de edições limitadas e convites para abertura de barricas.
          </p>
          <form onSubmit={handleNewsletter} className="space-y-2">
            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="O seu e-mail"
                className="w-full px-3 py-2 text-xs bg-vinicoa-charcoal border border-bege/20 rounded-l-xl focus:outline-none focus:border-dourado text-bege"
                aria-label="E-mail para subscrever a newsletter"
              />
              <button
                type="submit"
                className="bg-bordo hover:bg-bordo-light text-bege px-4 py-2 text-xs font-bold uppercase rounded-r-xl border border-dourado/30 transition cursor-pointer"
              >
                Aderir
              </button>
            </div>
            {feedback && (
              <span className={`text-[11px] block h-4 ${feedback.error ? "text-red-400" : "text-emerald-400"}`}>
                {feedback.text}
              </span>
            )}
          </form>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-bege-muted gap-4">
        <p>© 2026 Vinicôa Sabugal, Lda. Todos os direitos reservados. NIF: 512 000 000.</p>
        <p className="text-center sm:text-right">Seja responsável. Beba com moderação.</p>
      </div>
    </footer>
  );
}
