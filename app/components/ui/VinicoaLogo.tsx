import logoOriginalSvg from "../../assets/logos/logo_original.svg?raw";

interface VinicoaLogoProps {
  className?: string;
  /** "original": símbolo dourado + lettering bordô (fundos claros). "mono": uma só cor, herdada de `color` (fundos escuros/bordô). */
  variant?: "original" | "mono";
  /** Mostra apenas o brasão, sem o lettering VINICÔA SABUGAL. */
  symbolOnly?: boolean;
  title?: string;
}

// Área do brasão dentro do viewBox original (o lettering começa em y≈974)
const SYMBOL_VIEWBOX = "465 110 513 837";

function prepareSvg(raw: string, mono: boolean, symbolOnly: boolean) {
  let svg = raw
    .replace(/<\?xml[^>]*\?>/, "")
    .replace(/\s(width|height)="[^"]*"/g, "")
    .replace("<svg ", '<svg aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet" ');
  if (mono) svg = svg.replace(/fill="#[0-9A-Fa-f]{3,6}"/g, 'fill="currentColor"');
  if (symbolOnly) svg = svg.replace(/viewBox="[^"]*"/, `viewBox="${SYMBOL_VIEWBOX}"`);
  return svg.trim();
}

const SVGS = {
  original: prepareSvg(logoOriginalSvg, false, false),
  originalSymbol: prepareSvg(logoOriginalSvg, false, true),
  mono: prepareSvg(logoOriginalSvg, true, false),
  monoSymbol: prepareSvg(logoOriginalSvg, true, true),
};

export function VinicoaLogo({
  className = "h-16",
  variant = "original",
  symbolOnly = false,
  title = "Vinicôa Sabugal",
}: VinicoaLogoProps) {
  const key = `${variant}${symbolOnly ? "Symbol" : ""}` as keyof typeof SVGS;

  return (
    <span
      role="img"
      aria-label={title}
      className={`inline-block [&>svg]:h-full [&>svg]:w-auto [&>svg]:block ${className}`}
      dangerouslySetInnerHTML={{ __html: SVGS[key] }}
    />
  );
}
