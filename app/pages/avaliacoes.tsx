import { useState, useRef, useEffect } from "react";
import { data, useLoaderData } from "react-router";
import type { Route } from "./+types/avaliacoes";
import { Star, CheckCircle2, ChevronDown, Check } from "lucide-react";
import { ratingSummary, type Review } from "../lib/reviews";
import { WINES_DATABASE } from "../lib/wines";
import { createSupabaseServerClient } from "../lib/supabase.server";
import { isTurnstileConfigured, TurnstileField } from "../components/ui/TurnstileField";
import uvasImg from "../assets/images/uvas-orvalho.jpg";

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const [{ data: reviews, error: reviewError }, { data: products, error: productError }] = await Promise.all([
    supabase
      .from("reviews")
      .select("id, display_name, rating, title, body, created_at, products(name)")
      .eq("status", "published")
      .order("created_at", { ascending: false }),
    supabase.from("products").select("id, slug, name").eq("is_active", true).order("name"),
  ]);
  if (reviewError || productError) {
    console.error("Public reviews load failed:", reviewError ?? productError);
    return data({ reviews: [], products: [] }, { headers });
  }
  return data({ reviews: reviews ?? [], products: products ?? [] }, { headers });
}

export function meta() {
  return [
    { title: "Avaliações — Vinicôa Sabugal" },
    {
      name: "description",
      content: "O que dizem os clientes da Vinicôa. Leia as avaliações e partilhe a sua experiência com os nossos vinhos.",
    },
  ];
}

function Stars({ value, className = "w-4 h-4" }: { value: number; className?: string }) {
  return (
    <span className="inline-flex gap-1" aria-label={`${value} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = Math.max(0, Math.min(1, value - (n - 1)));
        return (
          <span key={n} className={`relative inline-block ${className}`} aria-hidden="true">
            <Star className={`absolute inset-0 ${className} text-dourado/35`} strokeWidth={1.25} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className={`${className} text-dourado fill-dourado`} strokeWidth={1.25} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric" });

const inputClass =
  "w-full px-4 py-3.5 rounded-xl bg-vinicoa-noir border border-bege/20 text-sm text-bege placeholder:text-bege-muted/60 focus:border-dourado focus:outline-none transition-colors";
const labelClass = "block font-downey text-[11px] uppercase tracking-[0.24em] text-dourado mb-2";
const LABELS = ["", "Fraco", "Razoável", "Bom", "Muito bom", "Excelente"];

export function Avaliacoes() {
  const { reviews: reviewRows, products } = useLoaderData<typeof loader>();
  const reviews: Review[] = reviewRows.map((row) => ({
    id: row.id,
    nome: row.display_name,
    localidade: "",
    data: row.created_at.slice(0, 10),
    estrelas: row.rating as Review["estrelas"],
    titulo: row.title,
    texto: row.body,
    vinho: (() => {
      const relatedProduct = row.products as unknown as { name: string } | { name: string }[] | null;
      return Array.isArray(relatedProduct) ? relatedProduct[0]?.name : relatedProduct?.name;
    })(),
  }));
  const { total, media, counts } = ratingSummary(reviews);
  const writtenReviews = reviews.filter((review) => review.texto.trim().length > 0);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [tipoAvaliacao, setTipoAvaliacao] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [ratingError, setRatingError] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);

  // Lista de vinhos disponíveis (Supabase ou fallback de base de dados local)
  const wineList = products && products.length > 0
    ? products
    : WINES_DATABASE.map((w) => ({ id: String(w.id), slug: w.slug, name: w.title }));

  const generalTypes = [
    { value: "", label: "Avaliação geral da loja" },
    { value: "entrega", label: "Envio e entrega" },
    { value: "atendimento", label: "Atendimento e apoio ao cliente" },
  ];

  const currentLabel =
    wineList.find((w) => w.slug === tipoAvaliacao)?.name ||
    generalTypes.find((g) => g.value === tipoAvaliacao)?.label ||
    "Avaliação geral da loja";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!rating) {
      setRatingError(true);
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const isWineSlug = wineList.some((w) => w.slug === tipoAvaliacao);
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          type: "review",
          name: nome,
          email,
          rating,
          title: titulo,
          body: texto,
          productSlug: isWineSlug ? tipoAvaliacao : undefined,
          consent,
          website: honeypot,
          turnstileToken,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Não foi possível enviar a avaliação.");
      setSent(true);
      setRating(0);
      setNome("");
      setEmail("");
      setTipoAvaliacao("");
      setTitulo("");
      setTexto("");
      setConsent(false);
      setHoneypot("");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Não foi possível enviar a avaliação.");
    } finally {
      setTurnstileToken("");
      setTurnstileResetKey((key) => key + 1);
      setSubmitting(false);
    }
  };

  const shown = hover || rating;

  return (
    <div className="w-full">
      {/* CABEÇALHO */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-[#0D0B0C]">
        <img
          src={uvasImg}
          alt="Cacho de uvas tintas com orvalho"
          className="absolute inset-0 w-full h-full object-cover img-mono opacity-40"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,11,12,0.35)_0%,rgba(13,11,12,0.88)_75%)]" />

        <div className="relative w-full max-w-4xl mx-auto px-6 pt-36 pb-20 flex flex-col items-center text-center">
          <p data-reveal="fade" className="font-downey text-[11px] sm:text-xs uppercase tracking-[0.5em] text-[#E8DCC6]/75 mb-8">
            Avaliações
          </p>
          <h1
            data-reveal
            data-reveal-delay="1"
            className="font-brand uppercase text-dourado text-3xl sm:text-4xl lg:text-5xl leading-[1.25] tracking-[0.16em]"
          >
            A palavra de quem prova
          </h1>
          <span data-reveal="zoom" data-reveal-delay="2" className="block w-14 h-px bg-dourado/60 my-8" aria-hidden="true" />
          <p data-reveal data-reveal-delay="3" className="text-base sm:text-lg text-[#E8DCC6]/85 leading-relaxed max-w-xl">
            Opiniões de quem já levou os vinhos do Sabugal para a sua mesa.
          </p>
        </div>
      </section>

      {/* RESUMO DA CLASSIFICAÇÃO */}
      <section className="bg-bege px-6 lg:px-12 py-16 lg:py-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div data-reveal="left" className="text-center md:text-right md:border-r md:border-bordo/20 md:pr-16">
            <span className="font-brand text-7xl lg:text-8xl text-bordo leading-none block mb-4">
              {total ? media.toLocaleString("pt-PT", { minimumFractionDigits: 1 }) : "—"}
            </span>
            <Stars value={media} className="w-6 h-6" />
            <p className="font-downey text-xs uppercase tracking-[0.28em] text-[#0D0B0C] mt-4">
              {total} {total === 1 ? "avaliação" : "avaliações"}
            </p>
          </div>

          <ul data-reveal="right" data-reveal-delay="1" className="space-y-3" aria-label="Distribuição das avaliações">
            {counts.map((c) => (
              <li key={c.estrelas} className="grid grid-cols-[3.5rem_1fr_2rem] items-center gap-4">
                <span className="font-downey text-xs uppercase tracking-[0.2em] text-[#0D0B0C] flex items-center gap-1">
                  {c.estrelas} <Star className="w-3 h-3 text-dourado-dark fill-dourado-dark" />
                </span>
                <span className="h-1.5 rounded-full bg-bordo/10 overflow-hidden">
                  <span
                    className="block h-full rounded-full bg-bordo"
                    style={{ width: total ? `${(c.total / total) * 100}%` : "0%" }}
                  />
                </span>
                <span className="text-sm text-[#5C3D42] text-right tabular-nums">{c.total}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* LISTA DE AVALIAÇÕES */}
      <section className="bg-vinicoa-noir px-6 lg:px-12 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto">
          <div data-reveal className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-downey text-xs uppercase tracking-[0.35em] text-dourado block mb-4">Clientes</span>
            <h2 className="font-brand uppercase text-4xl sm:text-5xl text-bege tracking-[0.05em]">O que nos dizem</h2>
          </div>

          {total === 0 ? (
            <p className="text-center text-base text-bege-dark">Ainda não há avaliações. Seja o primeiro a partilhar a sua.</p>
          ) : writtenReviews.length === 0 ? (
            <p className="text-center text-base text-bege-dark">Ainda não há avaliações escritas para ler.</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {writtenReviews.map((r, i) => (
                <li
                  key={r.id}
                  data-reveal
                  data-reveal-delay={String((i % 3) + 1)}
                  className="rounded-3xl bg-vinicoa-charcoal border border-dourado/20 p-7 flex flex-col"
                >
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <Stars value={r.estrelas} />
                    {r.exemplo && (
                      <span className="font-downey text-[10px] uppercase tracking-[0.2em] text-dourado border border-dourado/40 rounded-full px-2.5 py-1">
                        Exemplo
                      </span>
                    )}
                  </div>
                  <h3 className="font-brand uppercase text-xl text-bege tracking-[0.04em] mb-3">{r.titulo}</h3>
                  <p className="text-base text-bege-dark leading-relaxed mb-6">{r.texto}</p>
                  <div className="mt-auto pt-5 border-t border-dourado/20">
                    <p className="text-sm text-bege">
                      {r.nome}{r.localidade && <span className="text-bege-muted"> · {r.localidade}</span>}
                    </p>
                    <p className="text-xs text-bege-muted mt-1">
                      {formatDate(r.data)}
                      {r.vinho && <> · {r.vinho}</>}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* FORMULÁRIO */}
      <section className="bg-vinicoa-noir px-6 lg:px-12 pb-20 lg:pb-28">
        <div
          data-reveal
          className="max-w-3xl mx-auto rounded-3xl bg-vinicoa-charcoal border border-dourado/20 p-7 sm:p-10"
        >
          {sent ? (
            <div className="py-10 text-center flex flex-col items-center" role="status">
              <CheckCircle2 className="w-10 h-10 text-dourado mb-6" strokeWidth={1.25} />
              <h2 className="font-brand uppercase text-3xl text-bege tracking-[0.05em] mb-4">Obrigado pela avaliação</h2>
              <p className="text-base text-bege-dark leading-relaxed max-w-sm mb-8">
                A classificação será contabilizada depois de revista pela nossa equipa. Se escreveu um comentário, poderá ser publicado com o seu nome.
              </p>
              <button type="button" onClick={() => setSent(false)} className="btn-brand btn-bordo">
                Escrever outra avaliação
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <span className="font-downey text-xs uppercase tracking-[0.35em] text-dourado block mb-4">
                  A sua opinião
                </span>
                <h2 className="font-brand uppercase text-3xl sm:text-4xl text-bege tracking-[0.05em] mb-3">
                  Avalie a sua experiência
                </h2>
                <p className="text-base text-bege-dark">Os campos com * são obrigatórios.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Seletor de estrelas */}
                <fieldset className="text-center">
                  <legend className={`${labelClass} mx-auto`}>Classificação</legend>
                  <div className="flex justify-center gap-2" onMouseLeave={() => setHover(0)}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <label
                        key={n}
                        className="cursor-pointer p-1"
                        onMouseEnter={() => setHover(n)}
                        title={`${n} ${n === 1 ? "estrela" : "estrelas"}`}
                      >
                        <input
                          type="radio"
                          name="rating"
                          value={n}
                          checked={rating === n}
                          onChange={() => {
                            setRating(n);
                            setRatingError(false);
                          }}
                          className="sr-only peer"
                        />
                        <Star
                          className={`w-9 h-9 transition-colors peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-dourado rounded ${
                            n <= shown ? "text-dourado fill-dourado" : "text-dourado/40"
                          }`}
                          strokeWidth={1.25}
                        />
                        <span className="sr-only">
                          {n} {n === 1 ? "estrela" : "estrelas"}
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className={`mt-2 h-5 text-sm ${ratingError ? "text-red-400" : "text-bege-muted"}`} aria-live="polite">
                    {ratingError ? "Escolha uma classificação de 1 a 5 estrelas." : LABELS[shown]}
                  </p>
                </fieldset>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="av-nome" className={labelClass}>
                      Nome *
                    </label>
                    <input
                      id="av-nome"
                      type="text"
                      required
                      autoComplete="name"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Como quer aparecer"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="av-email" className={labelClass}>
                      E-mail *
                    </label>
                    <input
                      id="av-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Não será publicado"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* TIPO DE AVALIAÇÃO — equilíbrio elegante entre minimalismo e personalização */}
                <div ref={dropdownRef} className="relative">
                  <label id="av-tipo-label" className={labelClass}>
                    Tipo de avaliação
                  </label>

                  {/* Gatilho customizado discreto, idêntico aos outros inputs */}
                  <button
                    id="av-tipo"
                    type="button"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    aria-expanded={dropdownOpen}
                    aria-haspopup="listbox"
                    aria-labelledby="av-tipo-label"
                    className={`${inputClass} text-left flex items-center justify-between cursor-pointer transition-all ${
                      dropdownOpen ? "border-dourado ring-1 ring-dourado/40" : "hover:border-dourado/50"
                    }`}
                  >
                    <span className="truncate text-bege">{currentLabel}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-dourado/70 transition-transform duration-200 shrink-0 ml-2 ${
                        dropdownOpen ? "rotate-180 text-dourado" : ""
                      }`}
                      strokeWidth={1.5}
                    />
                  </button>

                  {/* Menu suspenso estilizado (sem parecer a select nativa do Google) */}
                  {dropdownOpen && (
                    <div
                      className="absolute top-full left-0 right-0 mt-1.5 z-40 rounded-xl bg-[#141012] border border-dourado/30 shadow-xl shadow-black/80 backdrop-blur-md overflow-hidden py-1.5 max-h-60 overflow-y-auto"
                      role="listbox"
                    >
                      {/* Âmbito Geral */}
                      <div className="px-3.5 py-1 text-[10px] font-downey uppercase tracking-[0.2em] text-dourado/60">
                        Âmbito Geral
                      </div>
                      {generalTypes.map((item) => {
                        const isSelected = tipoAvaliacao === item.value;
                        return (
                          <button
                            key={item.value}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => {
                              setTipoAvaliacao(item.value);
                              setDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors cursor-pointer ${
                              isSelected
                                ? "text-dourado bg-dourado/10 font-medium"
                                : "text-bege/85 hover:text-dourado hover:bg-white/[0.04]"
                            }`}
                          >
                            <span className="truncate">{item.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-dourado shrink-0 ml-2" />}
                          </button>
                        );
                      })}

                      {/* Vinhos da Garrafeira */}
                      {wineList.length > 0 && (
                        <>
                          <div className="border-t border-white/[0.06] my-1" />
                          <div className="px-3.5 py-1 text-[10px] font-downey uppercase tracking-[0.2em] text-dourado/60">
                            Vinhos da Garrafeira
                          </div>
                          {wineList.map((wine) => {
                            const isSelected = tipoAvaliacao === wine.slug;
                            return (
                              <button
                                key={wine.id}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => {
                                  setTipoAvaliacao(wine.slug);
                                  setDropdownOpen(false);
                                }}
                                className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors cursor-pointer ${
                                  isSelected
                                    ? "text-dourado bg-dourado/10 font-medium"
                                    : "text-bege/85 hover:text-dourado hover:bg-white/[0.04]"
                                }`}
                              >
                                <span className="truncate">{wine.name}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-dourado shrink-0 ml-2" />}
                              </button>
                            );
                          })}
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="av-titulo" className={labelClass}>
                    Título{texto.trim() ? " *" : ""}
                  </label>
                  <input
                    id="av-titulo"
                    type="text"
                    required={texto.trim().length > 0}
                    maxLength={80}
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Resuma a sua experiência"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="av-texto" className={labelClass}>
                    Avaliação <span className="normal-case tracking-normal text-bege-muted">(opcional)</span>
                  </label>
                  <textarea
                    id="av-texto"
                    rows={5}
                    maxLength={1000}
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder="Se quiser, conte-nos o que achou do vinho e da encomenda. (mínimo 20 caracteres)"
                    className={`${inputClass} resize-y`}
                  />
                </div>

                {/* Campo isco anti-spam: invisível para pessoas, preenchido por bots */}
                <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="av-website">Website</label>
                  <input
                    id="av-website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <label htmlFor="av-rgpd" className="flex items-start gap-3 cursor-pointer">
                  <input
                    id="av-rgpd"
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 shrink-0 accent-[#6B0015] cursor-pointer"
                  />
                  <span className="text-sm text-bege-dark leading-relaxed">
                    Autorizo a utilização da minha classificação para calcular a média pública e, se escrever um comentário,
                    a publicação do comentário com o meu nome após revisão. O e-mail não será publicado, de acordo com a Política de Privacidade (RGPD). *
                  </span>
                </label>

                <TurnstileField key={turnstileResetKey} onToken={setTurnstileToken} resetKey={turnstileResetKey} />
                {submitError && <p className="text-sm text-red-300" role="alert">{submitError}</p>}

                <button type="submit" disabled={submitting || (import.meta.env.PROD && !isTurnstileConfigured) || (isTurnstileConfigured && !turnstileToken)} className="btn-brand btn-bordo w-full !py-4 disabled:opacity-50 disabled:cursor-wait">
                  {submitting ? "A enviar…" : "Enviar avaliação"}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default Avaliacoes;
