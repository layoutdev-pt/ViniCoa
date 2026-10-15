import { ShoppingBag, X, Trash2, Lock, CreditCard } from "lucide-react";
import { Link } from "react-router";
import { useCart } from "../../lib/cart-context";
import { WINES_DATABASE, formatMoney } from "../../lib/wines";

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateCartItemQty,
    removeFromCart,
    subtotal,
    shippingCost,
    total,
    freeShippingThreshold,
    addToCart,
  } = useCart();

  if (!isCartOpen) return null;

  const progressPercent = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Cesto de compras"
    >
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-luxury border-l border-dourado/30 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-bege/10">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-dourado" />
                <h3 className="font-editorial text-2xl font-bold text-bege">O Seu Cesto</h3>
              </div>
              <button
                onClick={closeCart}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 text-bege hover:text-dourado flex items-center justify-center transition cursor-pointer"
                aria-label="Fechar cesto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Barra de Portes Grátis */}
            <div className="mt-4 p-3.5 rounded-xl bg-bordo-surface border border-dourado/20">
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-bege">Portes Grátis (Portugal Continental)</span>
                <span
                  className={`font-bold ${
                    subtotal >= freeShippingThreshold ? "text-emerald-400" : "text-dourado"
                  }`}
                >
                  {subtotal >= freeShippingThreshold
                    ? "Parabéns! Portes Grátis."
                    : `Faltam ${formatMoney(remainingForFreeShipping)}`}
                </span>
              </div>
              <div className="w-full bg-vinicoa-noir h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-dourado h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Lista de Itens */}
            <div className="mt-6 space-y-4 max-h-[48vh] overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-bege-muted">
                  <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-dourado/40" />
                  <p className="text-sm mb-4">O seu cesto está vazio.</p>
                  
                  {/* Sugestão de Destaque */}
                  <div className="text-left p-3.5 rounded-xl bg-white/5 border border-dourado/20 mb-4">
                    <span className="text-[10px] uppercase tracking-wider text-dourado font-bold block mb-1">
                      Mais Procurado
                    </span>
                    <div className="flex items-center gap-3">
                      <img
                        src={WINES_DATABASE[0].image}
                        alt={WINES_DATABASE[0].title}
                        className="w-9 h-14 object-contain bg-white/5 rounded p-0.5"
                      />
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-bege">{WINES_DATABASE[0].title}</h4>
                        <span className="text-xs font-bold text-dourado">{formatMoney(WINES_DATABASE[0].price)}</span>
                      </div>
                      <button
                        onClick={() => addToCart(WINES_DATABASE[0].id)}
                        className="px-2.5 py-1.5 rounded-lg bg-bordo hover:bg-bordo-light text-bege text-xs font-bold uppercase transition cursor-pointer"
                      >
                        + Adicionar
                      </button>
                    </div>
                  </div>

                  <Link
                    to="/vinhos"
                    onClick={closeCart}
                    className="inline-block px-6 py-2.5 rounded-xl border border-bege/20 text-bege text-xs uppercase font-bold tracking-wider hover:bg-white/5 transition"
                  >
                    Ver Toda a Garrafeira
                  </Link>
                </div>
              ) : (
                cart.map((item) => {
                  const wine = WINES_DATABASE.find((w) => w.id === item.id);
                  if (!wine) return null;
                  const itemTotal = wine.price * item.qty;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3.5 p-3 rounded-xl bg-vinicoa-noir/80 border border-bege/10"
                    >
                      <img
                        src={wine.image}
                        alt={wine.title}
                        className="w-12 h-16 object-contain bg-white/5 rounded p-1"
                      />
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-bege">{wine.title}</h4>
                        <span className="text-xs text-dourado font-medium">
                          {formatMoney(wine.price)} / un
                        </span>
                        {/* Botões ergonómicos com mínimo de 44px */}
                        <div className="flex items-center gap-1.5 mt-2">
                          <button
                            onClick={() => updateCartItemQty(wine.id, -1)}
                            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-bege text-sm font-bold flex items-center justify-center transition cursor-pointer"
                            aria-label="Diminuir quantidade"
                          >
                            −
                          </button>
                          <span className="text-xs font-bold text-bege w-6 text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateCartItemQty(wine.id, 1)}
                            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-bege text-sm font-bold flex items-center justify-center transition cursor-pointer"
                            aria-label="Aumentar quantidade"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-dourado block">
                          {formatMoney(itemTotal)}
                        </span>
                        <button
                          onClick={() => removeFromCart(wine.id)}
                          className="text-xs text-red-400/80 hover:text-red-400 p-2 mt-2 cursor-pointer transition"
                          aria-label="Remover item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Rodapé do Cesto */}
          {cart.length > 0 && (
            <div className="pt-6 border-t border-bege/10">
              <div className="space-y-2 mb-4 text-xs">
                <div className="flex justify-between text-bege-muted">
                  <span>Subtotal</span>
                  <span className="text-bege font-semibold">{formatMoney(subtotal)}</span>
                </div>
                <div className="flex justify-between text-bege-muted">
                  <span>Envio (Garrafeira Refrigerada)</span>
                  <span className="text-bege font-semibold">
                    {shippingCost === 0 ? "Grátis" : formatMoney(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-dourado pt-2 border-t border-bege/10">
                  <span>Total Estimado</span>
                  <span>{formatMoney(total)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                onClick={closeCart}
                className="w-full py-4 rounded-xl bg-bordo hover:bg-bordo-light text-bege font-bold text-xs uppercase tracking-widest border border-dourado/40 shadow-xl transition flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-dourado" /> Finalizar Compra
              </Link>

              <div className="mt-4 flex items-center justify-center gap-3 text-bege-muted text-xs">
                <span className="px-2 py-1 rounded bg-white/5 border border-bege/10 text-[10px] font-bold text-bege">
                  MB WAY
                </span>
                <span className="px-2 py-1 rounded bg-white/5 border border-bege/10 text-[10px] font-bold text-bege">
                  Apple Pay
                </span>
                <span className="px-2 py-1 rounded bg-white/5 border border-bege/10 text-[10px] font-bold text-bege">
                  Google Pay
                </span>
                <span className="px-2 py-1 rounded bg-white/5 border border-bege/10 text-[10px] font-bold text-bege flex items-center gap-1">
                  <CreditCard className="w-3 h-3" /> Cartão
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
