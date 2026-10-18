export interface Review {
  id: string;
  nome: string;
  localidade: string;
  data: string; // ISO (AAAA-MM-DD)
  estrelas: 1 | 2 | 3 | 4 | 5;
  titulo: string;
  texto: string;
  vinho?: string;
  /** Avaliação de demonstração, só para desenhar a página. Nunca publicar como real. */
  exemplo?: boolean;
}

/**
 * Avaliações de EXEMPLO para desenvolvimento do layout.
 * Antes de publicar, substituir por avaliações reais de clientes (ou esvaziar a lista).
 * Publicar avaliações inventadas como se fossem reais é proibido (Diretiva Omnibus / DL 109-G/2021).
 */
export const REVIEWS: Review[] = [
  {
    id: "ex-1",
    nome: "Cliente exemplo A.",
    localidade: "Lisboa",
    data: "2026-09-28",
    estrelas: 5,
    titulo: "Texto de exemplo para uma avaliação longa",
    texto:
      "Espaço reservado para o texto de uma avaliação real. Aqui o cliente descreve a experiência de compra, a qualidade do vinho e o estado em que a encomenda chegou.",
    vinho: "Vinicôa Reserva Tinto",
    exemplo: true,
  },
  {
    id: "ex-2",
    nome: "Cliente exemplo B.",
    localidade: "Porto",
    data: "2026-09-14",
    estrelas: 5,
    titulo: "Título de exemplo",
    texto: "Avaliação curta de exemplo, para testar o layout com textos de tamanhos diferentes.",
    vinho: "Vinicôa Branco Altitude",
    exemplo: true,
  },
  {
    id: "ex-3",
    nome: "Cliente exemplo C.",
    localidade: "Guarda",
    data: "2026-08-30",
    estrelas: 4,
    titulo: "Exemplo com quatro estrelas",
    texto:
      "Exemplo de avaliação com nota mais baixa, para confirmar que a distribuição de estrelas e a média são calculadas corretamente.",
    exemplo: true,
  },
  {
    id: "ex-4",
    nome: "Cliente exemplo D.",
    localidade: "Coimbra",
    data: "2026-08-11",
    estrelas: 5,
    titulo: "Exemplo sem vinho associado",
    texto: "Exemplo de avaliação geral da loja, sem um vinho específico associado.",
    exemplo: true,
  },
  {
    id: "ex-5",
    nome: "Cliente exemplo E.",
    localidade: "Braga",
    data: "2026-07-22",
    estrelas: 5,
    titulo: "Mais um título de exemplo",
    texto:
      "Texto de exemplo de tamanho médio. Serve apenas para preencher a grelha enquanto a loja não tem avaliações reais publicadas.",
    vinho: "Cinco Quinas Grande Reserva",
    exemplo: true,
  },
  {
    id: "ex-6",
    nome: "Cliente exemplo F.",
    localidade: "Faro",
    data: "2026-07-03",
    estrelas: 5,
    titulo: "Último exemplo",
    texto: "Avaliação de exemplo número seis.",
    vinho: "Vinicôa Rosé Touriga",
    exemplo: true,
  },
];

export function ratingSummary(reviews: Review[]) {
  const total = reviews.length;
  const counts = [5, 4, 3, 2, 1].map((n) => ({
    estrelas: n,
    total: reviews.filter((r) => r.estrelas === n).length,
  }));
  const media = total ? reviews.reduce((s, r) => s + r.estrelas, 0) / total : 0;
  return { total, media: Math.round(media * 10) / 10, counts };
}
