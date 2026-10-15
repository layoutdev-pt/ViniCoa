interface VinicoaLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "gold" | "bordo" | "light";
}

export function VinicoaLogo({
  className = "",
  showText = true,
  size = "md",
  variant = "gold", 
}: VinicoaLogoProps) {
  const iconSizes = {
    sm: "w-7 h-9",
    md: "w-10 h-12",
    lg: "w-16 h-20",
  };

  const colorClasses = {
    gold: "text-dourado",
    bordo: "text-bordo",
    light: "text-bege",
  };

  return (
    <div className={`flex flex-col items-center group ${className}`}>
      {/* Brasão Heráldico Fiel ao Manual de Identidade (Cinco Quinas + Uvas + Socalcos do Côa) */}
      <div
        className={`${iconSizes[size]} ${colorClasses[variant]} flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}
      >
        <svg
          viewBox="0 0 100 130"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Silhueta Exterior do Castelo das Cinco Quinas */}
          <path d="M14 52 L14 30 L28 30 L28 16 L50 24 L72 16 L72 30 L86 30 L86 52" />
          <path d="M14 52 C14 96 50 122 50 122 C50 122 86 96 86 52 Z" />

          {/* Divisão Horizontal da Fortaleza */}
          <line x1="16" y1="52" x2="84" y2="52" strokeWidth="2.5" />

          {/* Arquitetura da Torre Esquerda (Janelas da Fortaleza) */}
          <rect x="22" y="60" width="6" height="7" strokeWidth="2" />
          <rect x="32" y="60" width="6" height="7" strokeWidth="2" />
          <line x1="20" y1="52" x2="20" y2="82" strokeWidth="2" />
          <line x1="39" y1="52" x2="39" y2="78" strokeWidth="2" />

          {/* Arquitetura da Torre Direita (Arcos defensivos) */}
          <path d="M68 60 C68 56 74 56 74 60 L74 72" strokeWidth="2" />
          <path d="M78 60 C78 56 82 56 82 60 L82 72" strokeWidth="2" />
          <line x1="62" y1="52" x2="62" y2="78" strokeWidth="2" />
          <line x1="81" y1="52" x2="81" y2="82" strokeWidth="2" />

          {/* Cacho de Uvas Central (Coração da Marca) */}
          <circle cx="50" cy="62" r="3.6" fill="currentColor" />
          <circle cx="44" cy="68" r="3.6" fill="currentColor" />
          <circle cx="56" cy="68" r="3.6" fill="currentColor" />
          <circle cx="50" cy="74" r="3.6" fill="currentColor" />
          <circle cx="50" cy="80" r="3" fill="currentColor" />

          {/* Curvas Orgânicas da Base (Socalcos do Côa e Ondas de Vinho) */}
          <path d="M22 92 Q50 110 78 92" strokeWidth="2.5" />
          <path d="M28 102 Q50 118 72 102" strokeWidth="2.5" />
          <path d="M42 84 Q50 90 58 84" strokeWidth="2" />
        </svg>
      </div>

      {showText && (
        <div className="text-center mt-1">
          <span className="font-brand font-bold text-xl lg:text-2xl tracking-[0.24em] text-bege group-hover:text-dourado transition-colors block">
            VINICÔA
          </span>
          <span className="font-downey text-[9px] uppercase tracking-[0.5em] text-dourado font-medium -mt-1 block">
            SABUGAL
          </span>
        </div>
      )}
    </div>
  );
}
