import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useCart } from "../../lib/cart-context";
import logoSimples from "../../assets/logos/logo_simples.svg";

export function AgeGateModal() {
  const { isAgeVerified, verifyAge } = useCart();
  const [underageState, setUnderageState] = useState(false);

  if (isAgeVerified) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-title"
    >
      <div className="relative w-full max-w-lg p-8 sm:p-12 rounded-2xl bg-vinicoa-noir border border-dourado/30 text-center">
        <div className="mb-8 flex justify-center">
          <img src={logoSimples} alt="Vinicôa Sabugal" className="h-28 w-auto object-contain" />
        </div>

        <h2 id="age-title" className="font-brand text-2xl sm:text-3xl uppercase tracking-[0.12em] text-bege mb-4">
          Confirmação de Maioridade
        </h2>

        {!underageState ? (
          <div>
            <p className="text-bege-dark text-sm sm:text-base mb-8 leading-relaxed font-light">
              Para entrar na garrafeira digital da <strong className="text-bege font-semibold">Vinicôa</strong>, deve ter idade legal para consumo de bebidas alcoólicas em Portugal (+18 anos).
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={verifyAge}
                className="px-8 py-3.5 rounded-xl bg-bordo hover:bg-bordo-light text-bege font-downey text-xs tracking-[0.2em] uppercase border border-bordo transition-colors duration-300 cursor-pointer"
              >
                Tenho 18 anos ou mais
              </button>
              <button
                onClick={() => setUnderageState(true)}
                className="px-8 py-3.5 rounded-xl bg-transparent hover:border-bege/50 text-bege-dark hover:text-bege font-downey text-xs tracking-[0.2em] uppercase border border-bege/20 transition-colors duration-300 cursor-pointer"
              >
                Sou menor de idade
              </button>
            </div>
          </div>
        ) : (
          <div className="text-left p-5 rounded-xl bg-bordo/20 border border-bordo/40 mt-4">
            <h3 className="text-sm font-bold text-bege mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-dourado" /> Acesso Condicionado
            </h3>
            <p className="text-xs text-bege-dark leading-relaxed mb-4">
              De acordo com o Decreto-Lei n.º 106/2015 da legislação portuguesa, a disponibilização, venda e consumo de bebidas alcoólicas em locais públicos e na internet é exclusivamente permitida a maiores de 18 anos.
            </p>
            <button
              onClick={() => setUnderageState(false)}
              className="text-xs text-dourado underline font-semibold uppercase tracking-wider cursor-pointer"
            >
              Voltar a tentar
            </button>
          </div>
        )}

        <p className="text-xs text-bege-muted mt-8">
          A Vinicôa promove o consumo moderado e responsável de vinho.
        </p>
      </div>
    </div>
  );
}
