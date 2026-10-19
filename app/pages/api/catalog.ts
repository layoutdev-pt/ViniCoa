import { data } from "react-router";
import type { Route } from "./+types/catalog";
import { createSupabaseServerClient } from "../../lib/supabase.server";

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) {
    return data({ error: "Não foi possível carregar o catálogo." }, { status: 500, headers });
  }

  return data(products ?? [], { headers });
}
