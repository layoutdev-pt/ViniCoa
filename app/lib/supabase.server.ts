import { createServerClient } from "@supabase/ssr";
import { parse, serialize } from "cookie";

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Falta configurar ${name} no servidor.`);
  return value;
}

export function createSupabaseServerClient(request: Request) {
  const headers = new Headers();
  const cookieHeader = request.headers.get("Cookie") ?? "";

  const supabase = createServerClient(
    requiredEnv("SUPABASE_URL"),
    requiredEnv("SUPABASE_ANON_KEY"),
    {
      cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      },
      cookies: {
        getAll() {
          return Object.entries(parse(cookieHeader)).flatMap(([name, value]) =>
            value === undefined ? [] : [{ name, value }]
          );
        },
        setAll(cookiesToSet, responseCookieHeaders) {
          for (const { name, value, options } of cookiesToSet) {
            headers.append("Set-Cookie", serialize(name, value, options));
          }
          for (const [name, value] of Object.entries(responseCookieHeaders)) {
            headers.set(name, value);
          }
        },
      },
    }
  );

  return { supabase, headers };
}
