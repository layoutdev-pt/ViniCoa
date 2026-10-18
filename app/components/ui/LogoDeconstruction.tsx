import { useEffect, useRef, useState } from "react";
import logoOriginalSvg from "../../assets/logos/logo_original.svg?raw";

type Piece = "quinas" | "uvas" | "paisagem" | "selo" | "assinatura";

// Ordem dos <path> em logo_original.svg:
// 0–13 lettering · 14–21 uvas · 22–24 arquitetura e paisagem · 25 cinco quinas · 26 selo
function pieceForIndex(i: number): Piece {
  if (i <= 13) return "assinatura";
  if (i <= 21) return "uvas";
  if (i <= 24) return "paisagem";
  if (i === 25) return "quinas";
  return "selo";
}

const VIEWBOX = logoOriginalSvg.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 100 100";
const PATHS = [...logoOriginalSvg.matchAll(/<path\b[^>]*?\bfill="([^"]+)"[^>]*?\bd="([^"]+)"/g)].map((m, i) => ({
  fill: m[1],
  d: m[2],
  piece: pieceForIndex(i),
}));

interface Step {
  piece: Piece | "todas";
  titulo: string;
  texto: string;
}

const STEPS: Step[] = [
  {
    piece: "quinas",
    titulo: "As cinco quinas",
    texto:
      "O topo do símbolo nasce do Castelo do Sabugal, conhecido como o Castelo das Cinco Quinas. As cinco formas reinterpretam essas quinas de forma contemporânea: uma silhueta forte que representa a história, a proteção e a herança do território.",
  },
  {
    piece: "uvas",
    titulo: "As uvas",
    texto:
      "No interior do símbolo está o coração da marca. Desenhadas de forma simples e geométrica, as uvas representam o vinho, a razão de ser da marca.",
  },
  {
    piece: "paisagem",
    titulo: "A paisagem",
    texto:
      "À volta das uvas, os elementos arquitetónicos lembram a presença histórica da região. Na base, linhas fluidas evocam os campos de vinha e o movimento do vinho no copo: a terra que produz e o vinho que dela nasce.",
  },
  {
    piece: "selo",
    titulo: "O selo",
    texto:
      "A forma final assume a aparência de um selo, um brasão contemporâneo que reforça a autenticidade, a tradição e a origem. O traço minimalista e equilibrado dá-lhe modernidade e elegância.",
  },
  {
    piece: "assinatura",
    titulo: "A assinatura",
    texto:
      "VINICÔA surge numa tipografia de carácter forte e equilibrado. Sabugal, mais leve e espaçado, cria contraste e afirma a origem geográfica da marca.",
  },
  {
    piece: "todas",
    titulo: "A paleta",
    texto:
      "O dourado evoca o valor da terra e a riqueza do património. O bordô liga a marca ao universo do vinho e à sua degustação. O bege dá-lhe uma base natural e autêntica.",
  },
];

const PALETA = [
  { nome: "Bordô", hex: "#6B0015" },
  { nome: "Dourado", hex: "#C49A4A" },
  { nome: "Bege", hex: "#E8DCC6" },
];

export function LogoDeconstruction() {
  const [active, setActive] = useState(-1);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  // O passo ativo é o que atravessa a faixa central do ecrã
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const activePiece = active >= 0 ? STEPS[active].piece : "todas";

  return (
    <section id="o-simbolo" className="bg-bege text-[#0D0B0C]">
      <div data-reveal className="max-w-3xl mx-auto px-6 pt-20 lg:pt-28 text-center">
        <span className="font-downey text-xs uppercase tracking-[0.35em] text-bordo block mb-4">O símbolo</span>
        <h2 className="font-brand uppercase text-4xl sm:text-5xl text-bordo tracking-[0.05em] mb-6">
          A história por trás do símbolo
        </h2>
        <p className="text-base sm:text-lg text-[#3B2A2D] leading-relaxed">
          Mais do que um logótipo, o brasão da Vinicôa é um mapa do território. Percorra-o peça a peça.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 lg:gap-20">
        {/* Logótipo fixo durante o scroll */}
        <div className="sticky top-16 lg:top-0 z-10 self-start h-[40vh] lg:h-screen flex flex-col items-center justify-center bg-bege">
          <svg
            viewBox={VIEWBOX}
            className="h-[30vh] lg:h-[62vh] w-auto max-w-full"
            role="img"
            aria-label="Brasão e lettering da Vinicôa"
          >
            {PATHS.map((p, i) => {
              const on = activePiece === "todas" || activePiece === p.piece;
              return (
                <path
                  key={i}
                  d={p.d}
                  fill={p.fill}
                  style={{
                    opacity: on ? 1 : 0.12,
                    transition: "opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                />
              );
            })}
          </svg>
          <p className="lg:hidden mt-3 font-downey text-[11px] uppercase tracking-[0.3em] text-bordo h-4" aria-hidden="true">
            {active >= 0 ? `${String(active + 1).padStart(2, "0")} · ${STEPS[active].titulo}` : ""}
          </p>
        </div>

        {/* Passos */}
        <ol className="pb-16 lg:pb-0">
          {STEPS.map((step, i) => (
            <li
              key={step.titulo}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              data-index={i}
              className={`min-h-[60vh] lg:min-h-screen flex flex-col justify-center py-10 transition-opacity duration-500 ${
                active === i ? "opacity-100" : "opacity-40"
              }`}
            >
              <span className="font-downey text-sm text-dourado-dark tracking-[0.3em] mb-4">
                {String(i + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
              </span>
              <h3 className="font-brand uppercase text-3xl sm:text-4xl text-bordo tracking-[0.05em] mb-5">
                {step.titulo}
              </h3>
              <p className="text-base sm:text-lg text-[#3B2A2D] leading-relaxed max-w-md">{step.texto}</p>

              {step.piece === "todas" && (
                <ul className="mt-8 flex flex-wrap gap-4">
                  {PALETA.map((c) => (
                    <li key={c.hex} className="flex items-center gap-3">
                      <span
                        className="w-10 h-10 rounded-full border border-[#0D0B0C]/10"
                        style={{ backgroundColor: c.hex }}
                        aria-hidden="true"
                      />
                      <span className="text-sm">
                        <span className="font-downey uppercase tracking-[0.2em] text-[#0D0B0C] block">{c.nome}</span>
                        <span className="text-[#5C3D42]">{c.hex}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default LogoDeconstruction;
