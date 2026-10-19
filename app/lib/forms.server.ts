import { createHmac } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Falta configurar ${name} no servidor.`);
  return value;
}

export function createFormsSupabaseClient() {
  return createClient(requiredEnv("SUPABASE_URL"), requiredEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return process.env.NODE_ENV === "development";
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export function isHoneypotFilled(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function isPlaceholderSecret(value: string) {
  return /<[^>]*>|placeholder|chave_de_turnstile|change[_ -]?me|your[_ -]?(site|secret)/i.test(value);
}

export async function verifyTurnstile(request: Request, token: unknown) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || isPlaceholderSecret(secret)) return process.env.NODE_ENV === "development";
  if (typeof token !== "string" || token.length < 10 || token.length > 2048) return false;

  const form = new URLSearchParams({ secret, response: token });
  const clientIp = request.headers.get("cf-connecting-ip");
  if (clientIp) form.set("remoteip", clientIp);

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: form,
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return false;
    const result = (await response.json()) as { success?: boolean; hostname?: string };
    const expectedHostname = new URL(request.url).hostname;
    return result.success === true && result.hostname === expectedHostname;
  } catch {
    return false;
  }
}

export async function allowFormSubmission(request: Request, formType: "contact" | "review") {
  const supabase = createFormsSupabaseClient();
  const forwardedIp = request.headers.get("cf-connecting-ip")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? "unknown";
  const pepper = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const keyHash = createHmac("sha256", pepper).update(`${formType}:${forwardedIp}`).digest("hex");
  const { data, error } = await supabase.rpc("consume_form_rate_limit", {
    p_key_hash: keyHash,
    p_limit: formType === "contact" ? 5 : 3,
    p_window_seconds: 600,
  });

  if (error) {
    console.error("Form rate limit check failed:", error);
    throw new Error("Não foi possível validar o envio. Tenta novamente mais tarde.");
  }
  return data === true;
}
