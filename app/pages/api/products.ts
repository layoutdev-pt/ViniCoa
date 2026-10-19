import { data } from "react-router";
import type { Route } from "./+types/products";
import { createSupabaseServerClient } from "../../lib/supabase.server";

type ProductInput = {
  id?: string | number;
  slug?: string;
  title?: string;
  category?: string;
  color?: string;
  range?: string;
  year?: string;
  volume?: string;
  price?: number;
  badge?: string;
  image?: string;
  secondaryImage?: string;
  grapes?: string;
  desc?: string;
  pairing?: string;
  corpo?: number;
  taninos?: number;
  acidez?: number;
  awards?: string[];
  stock?: number;
  featuredHome?: boolean;
  paymentUrl?: string;
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function productImageObjectPath(imageUrl: string | null | undefined) {
  if (!imageUrl) return null;
  try {
    const pathname = new URL(imageUrl).pathname;
    const marker = "/storage/v1/object/public/product-images/";
    const markerIndex = pathname.indexOf(marker);
    if (markerIndex < 0) return null;
    const encodedPath = pathname.slice(markerIndex + marker.length);
    return encodedPath ? decodeURIComponent(encodedPath) : null;
  } catch {
    return null;
  }
}

async function removeProductImageObjects(
  supabase: ReturnType<typeof createSupabaseServerClient>["supabase"],
  objectPaths: string[],
) {
  const uniquePaths = [...new Set(objectPaths.filter(Boolean))];
  for (let index = 0; index < uniquePaths.length; index += 100) {
    const { error } = await supabase.storage
      .from("product-images")
      .remove(uniquePaths.slice(index, index + 100));
    if (error) throw error;
  }
  return uniquePaths.length;
}

async function isAdmin(supabase: ReturnType<typeof createSupabaseServerClient>["supabase"]) {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return false;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .maybeSingle();
  return !error && profile?.role === "admin";
}

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const admin = await isAdmin(supabase);
  let query = supabase.from("products").select("*").order("name");
  if (!admin) query = query.eq("is_active", true);

  const { data: products, error } = await query;
  if (error) return data({ error: "Não foi possível carregar os produtos." }, { status: 500, headers });

  return data(products ?? [], { headers });
}

export async function action({ request }: Route.ActionArgs) {
  const { supabase, headers } = createSupabaseServerClient(request);
  if (!(await isAdmin(supabase))) {
    return data({ error: "Acesso reservado à administração." }, { status: 403, headers });
  }

  let body: { intent?: string; product?: ProductInput; id?: string };
  let primaryImage: File | null = null;
  let secondaryImage: File | null = null;
  try {
    if (request.headers.get("content-type")?.includes("multipart/form-data")) {
      const formData = await request.formData();
      body = JSON.parse(String(formData.get("payload") || "{}"));
      const primary = formData.get("primaryImage");
      const secondary = formData.get("secondaryImage");
      primaryImage = primary instanceof File && primary.size > 0 ? primary : null;
      secondaryImage = secondary instanceof File && secondary.size > 0 ? secondary : null;
    } else {
      body = await request.json();
    }
  } catch {
    return data({ error: "Pedido inválido." }, { status: 400, headers });
  }

  if (body.intent === "delete") {
    if (!body.id) return data({ error: "Produto inválido." }, { status: 400, headers });
    const { data: product, error: lookupError } = await supabase
      .from("products")
      .select("image_url, secondary_image_url")
      .eq("id", body.id)
      .maybeSingle();
    if (lookupError) return data({ error: "Não foi possível localizar as fotografias do produto." }, { status: 400, headers });
    try {
      await removeProductImageObjects(supabase, [
        productImageObjectPath(product?.image_url) ?? "",
        productImageObjectPath(product?.secondary_image_url) ?? "",
      ]);
    } catch (error) {
      console.error("Product image cleanup failed:", error);
      return data({ error: "Não foi possível remover as fotografias do produto. O produto foi mantido." }, { status: 400, headers });
    }
    const { error } = await supabase.from("products").delete().eq("id", body.id);
    if (error) return data({ error: "Não foi possível remover o produto." }, { status: 400, headers });
    return data({ ok: true }, { headers });
  }

  const product = body.product;
  const price = Number(product?.price);
  const stock = Number(product?.stock);
  if (!product?.title?.trim() || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
    return data({ error: "Confirma o nome, preço e stock do produto." }, { status: 400, headers });
  }

  const paymentUrl = product.paymentUrl?.trim() || null;
  if (paymentUrl) {
    try {
      if (new URL(paymentUrl).protocol !== "https:") throw new Error("URL inseguro");
    } catch {
      return data({ error: "O link de pagamento tem de ser um URL HTTPS válido." }, { status: 400, headers });
    }
  }

  let previousImageUrls: (string | null)[] = [];
  if (product.id) {
    const { data: previousProduct, error } = await supabase
      .from("products")
      .select("image_url, secondary_image_url")
      .eq("id", String(product.id))
      .maybeSingle();
    if (error) return data({ error: "Não foi possível verificar as fotografias atuais." }, { status: 400, headers });
    previousImageUrls = [previousProduct?.image_url ?? null, previousProduct?.secondary_image_url ?? null];
  }

  const imageTypes: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
  };
  for (const file of [primaryImage, secondaryImage]) {
    if (!file) continue;
    if (!imageTypes[file.type] || file.size > 5 * 1024 * 1024) {
      return data({ error: "As fotografias têm de ser JPG, PNG, WebP ou AVIF e ter no máximo 5 MB." }, { status: 400, headers });
    }
  }

  const uploadProductImage = async (file: File, slot: "principal" | "secundaria") => {
    const extension = imageTypes[file.type];
    const path = `${crypto.randomUUID()}-${slot}.${extension}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, {
      contentType: file.type,
      upsert: false,
      cacheControl: "3600",
    });
    if (error) throw error;
    return supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
  };

  try {
    if (primaryImage) product.image = await uploadProductImage(primaryImage, "principal");
    if (secondaryImage) product.secondaryImage = await uploadProductImage(secondaryImage, "secundaria");
  } catch (error) {
    console.error("Product image upload failed:", error);
    const detail = error instanceof Error ? error.message : "Erro desconhecido";
    return data({ error: `Não foi possível carregar as fotografias: ${detail}` }, { status: 400, headers });
  }

  if (!product.image?.trim()) {
    return data({ error: "Adiciona pelo menos uma fotografia principal do produto." }, { status: 400, headers });
  }

  const row: Record<string, unknown> = {
    slug: product.slug || slugify(product.title),
    name: product.title.trim(),
    category: product.category?.trim() || "Vinhos",
    color: product.color || null,
    range: product.range || null,
    year: product.year || null,
    volume: product.volume || null,
    price,
    badge: product.badge || null,
    image_url: product.image || null,
    secondary_image_url: product.secondaryImage || null,
    grapes: product.grapes || null,
    description: product.desc || "",
    characteristics: {
      corpo: Number(product.corpo) || 0,
      taninos: Number(product.taninos) || 0,
      acidez: Number(product.acidez) || 0,
    },
    pairing: product.pairing || null,
    awards: Array.isArray(product.awards) ? product.awards : [],
    stock,
    featured_home: Boolean(product.featuredHome),
    vendus_payment_url: paymentUrl,
  };
  if (typeof product.id === "string") row.id = product.id;

  const { data: saved, error } = await supabase
    .from("products")
    .upsert(row)
    .select("id")
    .single();
  if (error) {
    console.error("Product database write failed:", error);
    try {
      await removeProductImageObjects(supabase, [
        primaryImage ? productImageObjectPath(product.image) ?? "" : "",
        secondaryImage ? productImageObjectPath(product.secondaryImage) ?? "" : "",
      ]);
    } catch (cleanupError) {
      console.error("Failed to remove unreferenced uploaded images:", cleanupError);
    }
    return data({ error: `Não foi possível guardar o produto: ${error.message}` }, { status: 400, headers });
  }

  const currentImageUrls = [product.image || null, product.secondaryImage || null];
  const replacedPaths = previousImageUrls
    .filter((url) => url && !currentImageUrls.includes(url))
    .map((url) => productImageObjectPath(url));
  try {
    await removeProductImageObjects(supabase, replacedPaths.filter((path): path is string => Boolean(path)));
  } catch (cleanupError) {
    console.error("Failed to remove replaced product images:", cleanupError);
  }

  return data({ ok: true, id: saved.id }, { headers });
}
