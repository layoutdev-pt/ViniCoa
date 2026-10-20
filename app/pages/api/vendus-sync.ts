import { data } from "react-router";
import type { Route } from "./+types/vendus-sync";
import { createSupabaseServerClient } from "../../lib/supabase.server";

type VendusProduct = {
  id?: string | number;
  title?: string;
  description?: string;
  gross_price?: number | string;
  price_without_tax?: number | string;
  stock?: number | string;
  stock_store?: Array<{ qty?: number | string }>;
  status?: string;
  images?: Array<{ m?: string; xs?: string }>;
};

function env(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Falta configurar ${name} no servidor.`);
  return value;
}

async function isAdmin(supabase: ReturnType<typeof createSupabaseServerClient>["supabase"]) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return false;
  const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  return !error && profile?.role === "admin";
}

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function numericStock(product: VendusProduct) {
  const stock = Number(product.stock);
  if (Number.isFinite(stock)) return Math.max(0, Math.floor(stock));
  if (Array.isArray(product.stock_store)) {
    return product.stock_store.reduce((sum, row) => sum + (Number(row.qty) || 0), 0);
  }
  return 0;
}

function vendusImage(product: VendusProduct) {
  const image = product.images?.find((item) => item.m || item.xs)?.m ?? product.images?.[0]?.xs;
  if (!image) return null;
  try {
    return new URL(image, "https://www.vendus.pt").toString();
  } catch {
    return null;
  }
}

async function fetchVendusProducts(): Promise<VendusProduct[]> {
  const apiKey = env("VENDUS_API_KEY");
  const response = await fetch("https://www.vendus.pt/ws/v1.1/products/?status=on&type=normal", {
    headers: {
      Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`,
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) {
    console.error("Vendus product sync failed with HTTP status:", response.status);
    throw new Error(response.status === 401 || response.status === 403
      ? "O Vendus recusou a chave API. Confirma a chave e as permissões em Apps → API."
      : "Não foi possível obter o catálogo do Vendus.");
  }
  const payload: unknown = await response.json();
  const rows = Array.isArray(payload)
    ? payload
    : payload && typeof payload === "object" && Array.isArray((payload as { data?: unknown }).data)
      ? (payload as { data: unknown[] }).data
      : null;
  if (!rows) throw new Error("O Vendus devolveu um formato de catálogo inesperado.");
  return rows as VendusProduct[];
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") return data({ error: "Método não permitido." }, { status: 405 });
  const { supabase, headers } = createSupabaseServerClient(request);
  if (!(await isAdmin(supabase))) {
    return data({ error: "Acesso reservado à administração." }, { status: 403, headers });
  }

  try {
    const vendusProducts = await fetchVendusProducts();
    const { data: currentProducts, error: queryError } = await supabase
      .from("products")
      .select("id, slug, name, description, image_url, secondary_image_url, category, color, range, year, volume, badge, grapes, characteristics, pairing, awards, featured_home, is_active, vendus_product_id");
    if (queryError) throw new Error("Não foi possível carregar o catálogo atual do site.");

    const byVendusId = new Map((currentProducts ?? []).filter((row) => row.vendus_product_id)
      .map((row) => [String(row.vendus_product_id), row]));
    const byName = new Map((currentProducts ?? []).map((row) => [slugify(row.name), row]));
    let imported = 0;
    let updated = 0;

    for (const product of vendusProducts) {
      const vendusId = product.id == null ? "" : String(product.id);
      const name = product.title?.trim();
      const price = Number(product.gross_price ?? product.price_without_tax);
      if (!vendusId || !name || !Number.isFinite(price) || price < 0) continue;

      const existing = byVendusId.get(vendusId) ?? byName.get(slugify(name));
      const row: Record<string, unknown> = {
        ...(existing ? { id: existing.id } : {}),
        vendus_product_id: vendusId,
        name,
        price,
        stock: numericStock(product),
      };

      if (!existing) {
        const image = vendusImage(product);
        Object.assign(row, {
          slug: `${slugify(name) || "produto"}-${vendusId}`,
          category: "Vinhos",
          color: null,
          range: null,
          year: null,
          volume: null,
          description: product.description ?? "",
          image_url: image,
          secondary_image_url: null,
          characteristics: {},
          awards: [],
          stock: numericStock(product),
          featured_home: false,
          // Vendus is the source of truth for whether an item is on sale.
          // The team can add/replace the storefront photo and copy in the dashboard.
          is_active: true,
        });
      }

      const { error } = await supabase.from("products").upsert(row, { onConflict: "id" });
      if (error) {
        console.error("Vendus product sync database error:", error.message);
        throw new Error("Não foi possível guardar um dos produtos importados no Supabase.");
      }
      if (existing) updated++;
      else imported++;
    }

    return data({ ok: true, imported, updated, total: imported + updated }, { headers });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao sincronizar o catálogo Vendus.";
    const status = message.startsWith("Falta configurar VENDUS_API_KEY") ? 503 : 400;
    return data({ error: message }, { status, headers });
  }
}
