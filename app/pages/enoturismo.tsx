import { useState } from "react";
import { Clock, Users, Wine } from "lucide-react";
import { useCart } from "../lib/cart-context";

export function Enoturismo() {
  const { showToast } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("2");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Pedido de pré-reserva enviado com sucesso! Iremos confirmar em 24h.");
    setName("");
    setEmail("");
    setPhone("");
    setDate("");
    setPeople("2");
  };

  const scrollToForm = () => {
    const el = document.getElementById("booking-form");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="py-28 px-6 lg:px-12 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-[0.3em] text-dourado font-semibold block mb-2">
          Visitas & Degustações
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl text-bege font-bold mb-4">
          Enoturismo no Sabugal
        </h1>
        <p className="text-xs sm:text-sm text-bege-dark leading-relaxed font-light">
          Desfrute de experiências autênticas no coração da Beira Interior, com vista para as encostas graníticas do Rio Côa e o Castelo das Cinco Quinas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Prova 1 */}
        <div className="glass-luxury p-8 rounded-2xl border border-dourado/30 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="px-3 py-1 rounded bg-dourado/20 text-dourado text-xs font-bold uppercase">
                Prova de Assinatura
              </span>
              <span className="text-2xl font-bold text-bege">
                25,00€ <span className="text-xs text-bege-muted font-normal">/ pessoa</span>
              </span>
            </div>
            <h3 className="font-editorial text-2xl font-bold text-bege mb-2">
              Descobrir o Terroir do Sabugal
            </h3>
            <p className="text-xs text-bege-dark mb-4 leading-relaxed font-light">
              Visita guiada à adega e à sala de barricas, seguida de prova comentada de 4 vinhos (Branco Altitude, Rosé e Reservas Tintas), acompanhada de pão de centeio artesanal e azeite regional da Beira.
            </p>
            <div className="text-xs text-bege-muted space-y-1.5 mb-6">
              <p className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-dourado" /> Duração: 1h15
              </p>
              <p className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-dourado" /> Grupos de 2 a 12 pessoas
              </p>
            </div>
          </div>
          <button
            onClick={scrollToForm}
            className="w-full py-3 rounded-xl bg-bordo hover:bg-bordo-light text-bege text-xs font-bold uppercase tracking-wider transition cursor-pointer"
          >
            Reservar Data
          </button>
        </div>

        {/* Prova 2 */}
        <div className="glass-luxury p-8 rounded-2xl border border-dourado/30 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="px-3 py-1 rounded bg-bordo/40 text-bege text-xs font-bold uppercase">
                Grande Reserva
              </span>
              <span className="text-2xl font-bold text-dourado">
                45,00€ <span className="text-xs text-bege-muted font-normal">/ pessoa</span>
              </span>
            </div>
            <h3 className="font-editorial text-2xl font-bold text-bege mb-2">
              Harmonização das Cinco Quinas
            </h3>
            <p className="text-xs text-bege-dark mb-4 leading-relaxed font-light">
              Experiência gastronómica premium com prova vertical de colheitas históricas e Grande Reserva, harmonizada com tábua nobre de queijos curados da serra e presunto de bolota selecionado.
            </p>
            <div className="text-xs text-bege-muted space-y-1.5 mb-6">
              <p className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-dourado" /> Duração: 2h00
              </p>
              <p className="flex items-center gap-2">
                <Wine className="w-3.5 h-3.5 text-dourado" /> Conduzida por Enólogo / Sommelier
              </p>
            </div>
          </div>
          <button
            onClick={scrollToForm}
            className="w-full py-3 rounded-xl bg-dourado hover:bg-dourado-light text-vinicoa-noir text-xs font-bold uppercase tracking-wider transition cursor-pointer"
          >
            Reservar Data
          </button>
        </div>
      </div>

      {/* Formulário de Reserva */}
      <div id="booking-form" className="glass-luxury p-8 sm:p-10 rounded-3xl border border-dourado/20 max-w-2xl mx-auto">
        <h3 className="font-editorial text-2xl font-bold text-bege mb-6 text-center">
          Marcação de Visita
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-dourado font-semibold mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-vinicoa-noir border border-bege/20 text-xs text-bege focus:border-dourado focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase text-dourado font-semibold mb-1">
                E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-vinicoa-noir border border-bege/20 text-xs text-bege focus:border-dourado focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-dourado font-semibold mb-1">
                Contacto Telefónico
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-vinicoa-noir border border-bege/20 text-xs text-bege focus:border-dourado focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase text-dourado font-semibold mb-1">
                Data Pretendida
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-vinicoa-noir border border-bege/20 text-xs text-bege focus:border-dourado focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-dourado font-semibold mb-1">
                N.º de Visitantes
              </label>
              <select
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-vinicoa-noir border border-bege/20 text-xs text-bege focus:border-dourado focus:outline-none cursor-pointer"
              >
                <option value="2">2 Pessoas</option>
                <option value="4">4 Pessoas</option>
                <option value="6">6 Pessoas</option>
                <option value="8+">8 ou mais Pessoas</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-bordo hover:bg-bordo-light text-bege text-xs uppercase font-bold tracking-wider mt-4 transition cursor-pointer shadow-lg"
          >
            Solicitar Pré-Reserva
          </button>
        </form>
      </div>
    </div>
  );
}
export default Enoturismo;
