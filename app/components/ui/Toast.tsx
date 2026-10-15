import { CheckCircle2 } from "lucide-react";
import { useCart } from "../../lib/cart-context";

export function Toast() {
  const { toast, hideToast, openCart } = useCart();

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-6 right-6 z-50 glass-luxury border border-dourado p-4 rounded-xl shadow-2xl flex items-center gap-3 transition-all duration-300 animate-in fade-in slide-in-from-top-4"
    >
      <CheckCircle2 className="w-5 h-5 text-dourado shrink-0" />
      <span className="text-xs font-medium text-bege">{toast.message}</span>
      {toast.withCartAction && (
        <button
          onClick={() => {
            hideToast();
            openCart();
          }}
          className="ml-2 px-2.5 py-1 rounded bg-dourado text-vinicoa-noir text-xs font-bold hover:bg-dourado-light transition"
        >
          Ver Cesto
        </button>
      )}
    </div>
  );
}
