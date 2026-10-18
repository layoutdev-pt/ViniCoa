import { useState, useEffect } from "react";
import { MessageCircle, X, Wine } from "lucide-react";

export function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  // Só aparece depois de o visitante começar a explorar a página
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible && !isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Caixa de Diálogo do Concierge */}
      {isOpen && (
        <div
          className="mb-3 w-80 p-5 rounded-2xl glass-luxury shadow-2xl shadow-black/50"
          role="dialog"
          aria-label="Apoio ao cliente"
        >
          <div className="flex items-center gap-3 pb-3 border-b border-bege/10">
            <div className="relative w-10 h-10 rounded-full bg-bordo flex items-center justify-center border border-dourado text-dourado shadow-sm">
              <Wine className="w-5 h-5" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-vinicoa-noir" />
            </div>
            <div>
              <h4 className="font-downey text-xs text-bege uppercase tracking-[0.2em]">
                Apoio ao Cliente Vinicôa
              </h4>
              <span className="text-[11px] text-dourado flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Garrafeira · Sabugal
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="ml-auto text-bege-muted hover:text-bege text-sm p-1 cursor-pointer"
              aria-label="Fechar janela do WhatsApp"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-bege-dark py-3 leading-relaxed">
            Tem dúvidas sobre os vinhos do Sabugal, colheitas ou deseja recomendações para harmonização? Fale diretamente connosco.
          </p>
          <a
            href="https://wa.me/351271000000?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20vinhos%20da%20Vinic%C3%B4a."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-bordo hover:bg-bordo-light text-bege font-downey text-[11px] tracking-[0.2em] uppercase transition"
          >
            <MessageCircle className="w-4 h-4" /> Iniciar Conversa
          </a>
        </div>
      )}

      {/* Botão Flutuante Discreto */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3.5 rounded-full bg-bordo hover:bg-bordo-light text-dourado border border-dourado/40 shadow-lg shadow-black/40 transition-colors duration-300 cursor-pointer"
        aria-label="Abrir conversa WhatsApp de apoio"
      >
        <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
      </button>
    </div>
  );
}
