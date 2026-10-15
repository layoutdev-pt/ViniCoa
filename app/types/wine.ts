export interface Wine {
  id: number;
  slug: string;
  title: string;
  color: "Tinto" | "Branco" | "Rosé";
  range: "Colheita" | "Reserva" | "Grande Reserva";
  year: string;
  volume: string;
  price: number;
  badge: string;
  image: string;
  grapes: string;
  desc: string;
  corpo: number; // 0-100
  taninos: number; // 0-100
  acidez: number; // 0-100
  pairing: string;
  awards: string[];
  stock: number;
}

export interface CartItem {
  id: number;
  qty: number;
}
