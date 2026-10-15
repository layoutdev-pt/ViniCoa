import { useState } from "react";
import { Link } from "react-router";
import { CheckCircle2, ShoppingBag, CreditCard, Lock, Smartphone } from "lucide-react";
import { useCart } from "../lib/cart-context";
import { WINES_DATABASE, formatMoney } from "../lib/wines";

export function Checkout() {
  const { cart, subtotal, shippingCost, total, clearCart, addToCart } = useCart();
  const [payMethod, setPayMethod] = useState<"mbway" | "card" | "wallets">("mbway");
  const [isSuccess, setIsSuccess] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [postal, setPostal] = useState("");
  const [city, setCity] = useState("");
  const [nif, setNif] = useState("");
  const [mbwayPhone, setMbwayPhone] = useState("");

  if (isSuccess) {
    return (
      <div className="pt-40 sm:pt-44 pb-28 px-6 max-w-xl mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto mb-6 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs uppercase tracking-widest text-dourado font-bold block mb-1">
          Pagamento Autorizado
        </span>
        <h1 className="font-editorial text-3xl font-bold text-bege mb-3">
          Obrigado pela sua Encomenda!
        </h1>
        <p className="text-xs sm:text-sm text-bege-dark leading-relaxed mb-8">
          Enviámos a confirmação com o recibo e guia de transporte para o seu e-mail ({email || "o seu e-mail"}). As garrafas serão expedidas em embalagem refrigerada diretamente da nossa adega no Sabugal.
        </p>
        <Link
          to="/vinhos"
          className="px-8 py-3.5 rounded-xl bg-bordo text-bege text-xs uppercase font-bold tracking-wider inline-block hover:bg-bordo-light transition"
        >
          Regressar à Loja
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    const recommended = WINES_DATABASE.slice(0, 2);
    return (
      <div className="pt-36 sm:pt-40 md:pt-44 pb-24 px-6 max-w-3xl mx-auto text-center">
        <ShoppingBag className="w-14 h-14 text-dourado/40 mx-auto mb-4" />
        <h1 className="font-editorial text-3xl font-bold text-bege mb-2">
          O Seu Cesto Está Vazio
        </h1>
        <p className="text-xs text-bege-dark mb-8">
          Adicione vinhos da nossa garrafeira para prosseguir com a encomenda.
        </p>

        {/* Sugestões da Adega com Adição Rápida */}
        <div className="text-left mb-8">
          <span className="text-xs uppercase tracking-widest text-dourado font-semibold block mb-4 text-center">
            Sugestões da Adega do Sabugal
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommended.map((wine) => (
              <div
                key={wine.id}
                className="glass-luxury p-4 rounded-xl border border-dourado/20 flex items-center justify-between gap-3"
              >
                <img
                  src={wine.image}
                  alt={wine.title}
                  className="w-12 h-20 object-contain bg-white/5 rounded p-1"
                />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-bege">{wine.title}</h4>
                  <span className="text-[11px] text-dourado block">{wine.volume} • Colheita {wine.year}</span>
                  <span className="text-xs font-bold text-bege mt-1 block">{formatMoney(wine.price)}</span>
                </div>
                <button
                  onClick={() => addToCart(wine.id)}
                  className="px-3 py-2 rounded-lg bg-bordo hover:bg-bordo-light text-bege text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  Adicionar
                </button>
              </div>
            ))}
          </div>
        </div>

        <Link
          to="/vinhos"
          className="px-8 py-3.5 rounded-xl border border-bege/20 hover:bg-white/5 text-bege text-xs uppercase font-bold tracking-wider inline-block transition"
        >
          Ver Todos os Vinhos
        </Link>
      </div>
    );
  }

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();
    setIsSuccess(true);
  };

  return (
    <div className="pt-36 sm:pt-40 md:pt-44 pb-24 px-6 lg:px-12 max-w-5xl mx-auto">
      <div className="mb-8 pb-4 border-b border-bege/10">
        <span className="text-xs uppercase tracking-[0.3em] text-dourado font-semibold block mb-1">
          Passo Final
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl text-bege font-bold">
          Finalizar Compra
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Formulário de Envio e Faturação */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleCheckout} className="space-y-6">
            {/* 1. Dados de Envio */}
            <div className="glass-luxury p-6 rounded-2xl border border-dourado/20">
              <h3 className="text-xs uppercase tracking-wider text-dourado font-bold mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-dourado text-vinicoa-noir text-[10px] font-black flex items-center justify-center">
                  1
                </span>
                Dados de Contacto & Envio
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs uppercase text-bege-dark font-medium mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="para envio do recibo e tracking"
                    className="w-full px-3 py-2 rounded-xl bg-vinicoa-noir border border-bege/20 text-xs text-bege focus:border-dourado focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase text-bege-dark font-medium mb-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-vinicoa-noir border border-bege/20 text-xs text-bege focus:border-dourado focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-bege-dark font-medium mb-1">
                      Telemóvel
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-vinicoa-noir border border-bege/20 text-xs text-bege focus:border-dourado focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase text-bege-dark font-medium mb-1">
                    Morada de Entrega
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Rua, número de porta, andar"
                    className="w-full px-3 py-2 rounded-xl bg-vinicoa-noir border border-bege/20 text-xs text-bege focus:border-dourado focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase text-bege-dark font-medium mb-1">
                      Código Postal
                    </label>
                    <input
                      type="text"
                      required
                      value={postal}
                      onChange={(e) => setPostal(e.target.value)}
                      placeholder="6320-000"
                      className="w-full px-3 py-2 rounded-xl bg-vinicoa-noir border border-bege/20 text-xs text-bege focus:border-dourado focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-bege-dark font-medium mb-1">
                      Localidade
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-vinicoa-noir border border-bege/20 text-xs text-bege focus:border-dourado focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Faturação & NIF */}
            <div className="glass-luxury p-6 rounded-2xl border border-dourado/20">
              <h3 className="text-xs uppercase tracking-wider text-dourado font-bold mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-dourado text-vinicoa-noir text-[10px] font-black flex items-center justify-center">
                  2
                </span>
                Dados de Faturação
              </h3>
              <div>
                <label className="block text-xs uppercase text-bege-dark font-medium mb-1">
                  NIF para a Fatura (Opcional)
                </label>
                <input
                  type="text"
                  value={nif}
                  onChange={(e) => setNif(e.target.value)}
                  placeholder="ex: 123 456 789 ou Consumidor Final"
                  className="w-full px-3 py-2 rounded-xl bg-vinicoa-noir border border-bege/20 text-xs text-bege focus:border-dourado focus:outline-none"
                />
              </div>
            </div>

            {/* 3. Pagamento */}
            <div className="glass-luxury p-6 rounded-2xl border border-dourado/20">
              <h3 className="text-xs uppercase tracking-wider text-dourado font-bold mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-dourado text-vinicoa-noir text-[10px] font-black flex items-center justify-center">
                  3
                </span>
                Método de Pagamento
              </h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setPayMethod("mbway")}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold text-center cursor-pointer transition ${
                    payMethod === "mbway"
                      ? "border-dourado bg-bordo/20 text-dourado"
                      : "border-bege/20 bg-white/5 text-bege-muted"
                  }`}
                >
                  MB WAY
                </button>
                <button
                  type="button"
                  onClick={() => setPayMethod("card")}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold text-center cursor-pointer transition ${
                    payMethod === "card"
                      ? "border-dourado bg-bordo/20 text-dourado"
                      : "border-bege/20 bg-white/5 text-bege-muted"
                  }`}
                >
                  Cartão
                </button>
                <button
                  type="button"
                  onClick={() => setPayMethod("wallets")}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold text-center cursor-pointer transition ${
                    payMethod === "wallets"
                      ? "border-dourado bg-bordo/20 text-dourado"
                      : "border-bege/20 bg-white/5 text-bege-muted"
                  }`}
                >
                  Apple / Google
                </button>
              </div>

              {payMethod === "mbway" && (
                <div className="space-y-2 animate-in fade-in">
                  <label className="block text-xs uppercase text-bege-dark font-medium">
                    Telemóvel associado ao MB WAY
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 absolute left-3 top-2.5 text-dourado" />
                    <input
                      type="tel"
                      required
                      value={mbwayPhone}
                      onChange={(e) => setMbwayPhone(e.target.value)}
                      placeholder="912 345 678"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-vinicoa-noir border border-bege/20 text-xs text-bege focus:border-dourado focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-bege-muted">
                    Receberá uma notificação na aplicação MB WAY para validar nos próximos 5 minutos.
                  </p>
                </div>
              )}

              {payMethod === "card" && (
                <div className="space-y-3 animate-in fade-in">
                  <input
                    type="text"
                    required
                    placeholder="Nome impresso no cartão"
                    className="w-full px-3 py-2 rounded-xl bg-vinicoa-noir border border-bege/20 text-xs text-bege focus:border-dourado focus:outline-none"
                  />
                  <div className="relative">
                    <CreditCard className="w-4 h-4 absolute left-3 top-2.5 text-dourado" />
                    <input
                      type="text"
                      required
                      placeholder="Número do cartão (•••• •••• •••• ••••)"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-vinicoa-noir border border-bege/20 text-xs text-bege focus:border-dourado focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="MM/AA"
                      className="px-3 py-2 rounded-xl bg-vinicoa-noir border border-bege/20 text-xs text-bege focus:border-dourado focus:outline-none"
                    />
                    <input
                      type="text"
                      required
                      placeholder="CVC"
                      className="px-3 py-2 rounded-xl bg-vinicoa-noir border border-bege/20 text-xs text-bege focus:border-dourado focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {payMethod === "wallets" && (
                <div className="space-y-3 py-2 text-center animate-in fade-in">
                  <p className="text-xs text-bege-muted mb-2">
                    Clique abaixo para autorizar instantaneamente com autenticação biométrica.
                  </p>
                  <div className="p-3 rounded-xl bg-white text-black text-xs font-bold tracking-wider cursor-pointer hover:bg-gray-100 flex items-center justify-center gap-2">
                    <span>Pay with Apple / Google</span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-bordo hover:bg-bordo-light text-bege font-bold text-xs uppercase tracking-widest border border-dourado/40 shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-dourado" /> Confirmar Encomenda • {formatMoney(total)}
            </button>
          </form>
        </div>

        {/* Resumo da Encomenda */}
        <div className="glass-luxury p-6 rounded-2xl border border-bege/20 h-fit space-y-4">
          <h3 className="text-xs uppercase tracking-wider text-dourado font-bold border-b border-bege/10 pb-3">
            Resumo da Compra
          </h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {cart.map((item) => {
              const w = WINES_DATABASE.find((x) => x.id === item.id);
              if (!w) return null;
              return (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-bege font-medium">{w.title}</span>
                    <span className="block text-bege-muted">
                      {item.qty} × {formatMoney(w.price)}
                    </span>
                  </div>
                  <span className="text-dourado font-bold">
                    {formatMoney(w.price * item.qty)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-bege/10 text-xs space-y-2">
            <div className="flex justify-between text-bege-muted">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-between text-bege-muted">
              <span>Envio</span>
              <span>{shippingCost === 0 ? "Grátis" : formatMoney(shippingCost)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-dourado pt-2 border-t border-bege/10">
              <span>Total</span>
              <span>{formatMoney(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Checkout;
