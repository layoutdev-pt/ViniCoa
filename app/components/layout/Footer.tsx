import { Link } from "react-router";
import { MapPin, Phone, Mail, ExternalLink, ShieldCheck } from "lucide-react";
import { useCart } from "../../lib/cart-context";
import logoOriginal from "../../assets/logos/logo_original.svg";

export function Footer() {
  const { theme } = useCart();
  const isLight = theme === "light";

  return (
    <footer
      id="contacto"
      className={`border-t transition-colors duration-300 pt-16 md:pt-20 pb-12 px-6 lg:px-12 ${
        isLight
          ? "bg-[#EFE7DA] border-[#6B0015]/20 text-[#381219]"
          : "bg-vinicoa-noir border-dourado/20 text-bege"
      }`}
    >
      <div
        className={`max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 lg:gap-16 pb-14 border-b ${
          isLight ? "border-[#6B0015]/15" : "border-dourado/20"
        }`}
      >
        {/* Coluna 1: Marca & Brasão */}
        <div className="space-y-6">
          <Link to="/" className="inline-block" aria-label="Vinicôa Sabugal - Página Inicial">
            <img
              src={logoOriginal}
              alt="Vinicôa Sabugal"
              className="h-28 md:h-32 w-auto object-contain"
            />
          </Link>
          <p
            className={`text-sm md:text-[15px] leading-relaxed max-w-sm ${
              isLight ? "text-[#5C3D42]" : "text-bege/80"
            }`}
          >
            Garrafeira online com raízes no Sabugal. Selecionamos vinhos de vários produtores e regiões e enviamo-los para todo o mundo.
          </p>
          <div className="flex space-x-3.5 pt-1">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition ${
                isLight
                  ? "border-[#6B0015]/30 text-[#6B0015] hover:text-[#C49A4A] hover:border-[#C49A4A] hover:bg-[#6B0015]/5"
                  : "border-dourado/30 text-dourado hover:text-bege hover:border-dourado hover:bg-dourado/10"
              }`}
              aria-label="Siga-nos no Instagram"
            >
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition ${
                isLight
                  ? "border-[#6B0015]/30 text-[#6B0015] hover:text-[#C49A4A] hover:border-[#C49A4A] hover:bg-[#6B0015]/5"
                  : "border-dourado/30 text-dourado hover:text-bege hover:border-dourado hover:bg-dourado/10"
              }`}
              aria-label="Siga-nos no Facebook"
            >
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition ${
                isLight
                  ? "border-[#6B0015]/30 text-[#6B0015] hover:text-[#C49A4A] hover:border-[#C49A4A] hover:bg-[#6B0015]/5"
                  : "border-dourado/30 text-dourado hover:text-bege hover:border-dourado hover:bg-dourado/10"
              }`}
              aria-label="Siga-nos no LinkedIn"
            >
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Coluna 2: Contactos */}
        <div>
          <h4
            className={`font-downey text-sm uppercase tracking-[0.22em] mb-5 ${
              isLight ? "text-[#9A7530]" : "text-dourado"
            }`}
          >
            Contactos
          </h4>
          <ul className="text-sm md:text-[15px] space-y-4">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-dourado mt-0.5 shrink-0" />
              <span className={`leading-relaxed ${isLight ? "text-[#381219]" : "text-bege/85"}`}>
                Quinta do Vale das Quinas<br />6320-112 Sabugal, Portugal
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-dourado shrink-0" />
              <a
                href="tel:+351271000000"
                className={`transition hover:text-dourado ${
                  isLight ? "text-[#381219]" : "text-bege/85"
                }`}
              >
                +351 271 000 000
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-dourado shrink-0" />
              <a
                href="mailto:geral@vinicoa.pt"
                className={`transition hover:text-dourado ${
                  isLight ? "text-[#381219]" : "text-bege/85"
                }`}
              >
                geral@vinicoa.pt
              </a>
            </li>
          </ul>
        </div>

        {/* Coluna 3: Navegação & Informação Legal */}
        <div>
          <h4
            className={`font-downey text-sm uppercase tracking-[0.22em] mb-5 ${
              isLight ? "text-[#9A7530]" : "text-dourado"
            }`}
          >
            Navegação & Legal
          </h4>
          <ul className="text-sm md:text-[15px] space-y-3">
            <li>
              <Link
                to="/vinhos"
                className={`transition hover:text-dourado ${
                  isLight ? "text-[#381219]" : "text-bege/85"
                }`}
              >
                Garrafeira de Vinhos
              </Link>
            </li>
            <li>
              <Link
                to="/sobre-nos"
                className={`transition hover:text-dourado ${
                  isLight ? "text-[#381219]" : "text-bege/85"
                }`}
              >
                Sobre a Vinicôa
              </Link>
            </li>
            <li>
              <Link
                to="/avaliacoes"
                className={`transition hover:text-dourado ${
                  isLight ? "text-[#381219]" : "text-bege/85"
                }`}
              >
                Avaliações & Críticas
              </Link>
            </li>
            <li>
              <Link
                to="/contactos"
                className={`transition hover:text-dourado ${
                  isLight ? "text-[#381219]" : "text-bege/85"
                }`}
              >
                Contactos & Visitas
              </Link>
            </li>
            <li className={`pt-2 border-t ${isLight ? "border-[#6B0015]/15" : "border-dourado/15"}`}>
              <a
                href="https://www.livroreclamacoes.pt"
                target="_blank"
                rel="noopener noreferrer"
                className={`transition flex items-center gap-2 text-xs md:text-sm hover:text-dourado ${
                  isLight ? "text-[#5C3D42]" : "text-bege/75"
                }`}
              >
                <ExternalLink className="w-3.5 h-3.5 text-dourado shrink-0" /> Livro de Reclamações Eletrónico
              </a>
            </li>
            <li>
              <a
                href="https://www.cniacc.pt"
                target="_blank"
                rel="noopener noreferrer"
                className={`transition flex items-center gap-2 text-xs md:text-sm hover:text-dourado ${
                  isLight ? "text-[#5C3D42]" : "text-bege/75"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-dourado shrink-0" /> Resolução de Litígios (RAL - CNIACC)
              </a>
            </li>
            <li>
              <span className={`text-xs md:text-sm ${isLight ? "text-[#7D5D62]" : "text-bege-muted"}`}>
                Política de Privacidade & RGPD
              </span>
            </li>
            <li>
              <span className={`text-xs md:text-sm ${isLight ? "text-[#7D5D62]" : "text-bege-muted"}`}>
                Termos & Condições de Venda
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div
        className={`max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm gap-4 ${
          isLight ? "text-[#7D5D62]" : "text-bege-muted"
        }`}
      >
        <p>© 2026 Vinicôa Sabugal, Lda. Todos os direitos reservados. NIF: 512 000 000.</p>
        <p className="text-center sm:text-right">Seja responsável. Beba com moderação.</p>
      </div>
    </footer>
  );
}
