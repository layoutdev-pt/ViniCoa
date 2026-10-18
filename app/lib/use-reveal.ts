import { useEffect } from "react";

/**
 * Animações de entrada: qualquer elemento com `data-reveal` aparece quando entra no ecrã.
 * Variantes: data-reveal="up" (padrão) | "fade" | "zoom" | "left" | "right".
 * Atraso em cascata: data-reveal-delay="1".."6" (100 ms cada).
 * O estado inicial escondido só existe com a classe `reveal-on` no <html>, posta por um script
 * no <head> antes da primeira pintura — sem JS ou com "reduzir movimento", tudo fica visível.
 */
export function useReveal() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("reveal-on")) return;

    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.classList.add("is-revealed");
          io.unobserve(el);
          // No fim, retira o atributo para devolver ao elemento as suas transições (hover, etc.)
          const done = () => {
            el.removeAttribute("data-reveal");
            el.removeAttribute("data-reveal-delay");
          };
          el.addEventListener("transitionend", (e) => e.propertyName === "opacity" && done());
          window.setTimeout(done, 1600 + Number(el.dataset.revealDelay ?? 0) * 100);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    const scan = () => {
      document.querySelectorAll("[data-reveal]:not(.is-revealed)").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        io.observe(el);
      });
    };

    // Apanha também o conteúdo que aparece depois (mudança de página, estados condicionais)
    let raf = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(scan);
    });

    scan();
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      io.disconnect();
    };
  }, []);
}

/** Script inline para o <head>: ativa as animações antes da primeira pintura. */
export const REVEAL_BOOT_SCRIPT = `try{if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("reveal-on")}catch(e){}`;
