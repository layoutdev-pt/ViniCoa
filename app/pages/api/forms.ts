import { data } from "react-router";
import type { Route } from "./+types/forms";
import {
  allowFormSubmission,
  createFormsSupabaseClient,
  isHoneypotFilled,
  isSameOriginRequest,
  verifyTurnstile,
} from "../../lib/forms.server";

type FormPayload = {
  type?: "contact" | "review";
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  rating?: number;
  title?: string;
  body?: string;
  productSlug?: string;
  consent?: boolean;
  website?: string;
  turnstileToken?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const normalizeText = (value: unknown) => typeof value === "string" ? value.trim() : "";

export async function action({ request }: Route.ActionArgs) {
  const headers = new Headers({ "Cache-Control": "no-store" });
  if (request.method !== "POST") return data({ error: "Método não permitido." }, { status: 405, headers });
  if (!isSameOriginRequest(request)) return data({ error: "Pedido inválido." }, { status: 403, headers });
  if (!(request.headers.get("content-type") ?? "").includes("application/json")) {
    return data({ error: "Formato de pedido inválido." }, { status: 415, headers });
  }

  let payload: FormPayload;
  try {
    const rawPayload = await request.text();
    if (new TextEncoder().encode(rawPayload).byteLength > 16_384) {
      return data({ error: "O pedido é demasiado grande." }, { status: 413, headers });
    }
    payload = JSON.parse(rawPayload) as FormPayload;
  } catch {
    return data({ error: "Pedido inválido." }, { status: 400, headers });
  }
  if (!payload || (payload.type !== "contact" && payload.type !== "review")) {
    return data({ error: "Formulário inválido." }, { status: 400, headers });
  }

  // Return the same generic success to bots so they cannot probe the honeypot.
  if (isHoneypotFilled(payload.website)) return data({ ok: true }, { status: 202, headers });

  try {
    if (!(await allowFormSubmission(request, payload.type))) {
      return data({ error: "Atingiste o limite de envios. Tenta novamente mais tarde." }, { status: 429, headers });
    }
    if (!(await verifyTurnstile(request, payload.turnstileToken))) {
      return data({ error: "Confirma a verificação anti-spam e tenta novamente." }, { status: 400, headers });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível validar o envio.";
    return data({ error: message }, { status: 503, headers });
  }

  const name = normalizeText(payload.name);
  const email = normalizeText(payload.email).toLowerCase();
  if (!name || name.length > 120 || !emailPattern.test(email) || email.length > 320 || payload.consent !== true) {
    return data({ error: "Confirma os campos obrigatórios e o consentimento." }, { status: 400, headers });
  }

  const supabase = createFormsSupabaseClient();
  if (payload.type === "contact") {
    const subject = normalizeText(payload.subject);
    const message = normalizeText(payload.message);
    const allowedSubjects = new Set(["Dúvidas sobre os vinhos", "Encomenda existente", "Restauração e garrafeiras", "Outro assunto"]);
    const phone = normalizeText(payload.phone);
    if (!allowedSubjects.has(subject) || !message || message.length > 5000 || phone.length > 40) {
      return data({ error: "Confirma o assunto e a mensagem." }, { status: 400, headers });
    }
    const { error } = await supabase.from("contact_messages").insert({
      name,
      email,
      phone: phone || null,
      subject,
      message,
    });
    if (error) {
      console.error("Contact form save failed:", error);
      return data({ error: "Não foi possível guardar a mensagem. Tenta novamente." }, { status: 503, headers });
    }
    return data({ ok: true }, { status: 201, headers });
  }

  const title = normalizeText(payload.title);
  const body = normalizeText(payload.body);
  const rating = Number(payload.rating);
  const productSlug = normalizeText(payload.productSlug);
  if (
    !Number.isInteger(rating) || rating < 1 || rating > 5 || title.length > 80 || body.length > 1000 ||
    (body.length > 0 && body.length < 20) || (body.length > 0 && !title)
  ) {
    return data({ error: "Confirma a classificação, o título e o texto da avaliação." }, { status: 400, headers });
  }
  const savedTitle = title || "Avaliação por estrelas";

  let productId: string | null = null;
  if (productSlug) {
    const { data: product, error } = await supabase.from("products").select("id").eq("slug", productSlug).maybeSingle();
    if (error || !product) return data({ error: "O vinho selecionado já não está disponível." }, { status: 400, headers });
    productId = product.id;
  }

  const { error: reviewError } = await supabase.rpc("create_review_submission", {
    p_display_name: name,
    p_product_id: productId,
    p_rating: rating,
    p_title: savedTitle,
    p_body: body,
    p_email: email,
  });
  if (reviewError) {
    console.error("Review save failed:", reviewError);
    return data({ error: "Não foi possível guardar a avaliação. Tenta novamente." }, { status: 503, headers });
  }

  return data({ ok: true }, { status: 201, headers });
}
