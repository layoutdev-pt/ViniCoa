export type WineType =
  | "Tinto"
  | "Branco"
  | "Rosé"
  | "Espumante"
  | "O Fortificado"
  | "Aguardente"
  | "Bebida Aromatizada à Base de Vinho"
  | "Sangria"
  | string;

export type WineCategory =
  | "Vinhos"
  | "Adega Velha"
  | "Aveleda"
  | "Casal Garcia"
  | "Mandriola de Lisboa"
  | "Outras Marcas"
  | "Quinta d'Aguieira"
  | "Quinta Vale D. Maria"
  | "Villa Alvor"
  | string;

export interface Wine {
  id: number;
  slug: string;
  title: string;
  color: WineType;
  category?: WineCategory;
  range: "Colheita" | "Reserva" | "Grande Reserva" | string;
  year: string;
  volume: string;
  price: number;
  badge?: string;
  image: string;
  grapes: string;
  desc: string;
  corpo: number; // 0-100
  taninos: number; // 0-100
  acidez: number; // 0-100
  pairing: string;
  awards?: string[];
  stock: number;
  featuredHome?: boolean;
}

export interface CartItem {
  id: number;
  qty: number;
}
