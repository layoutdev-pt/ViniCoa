import { useState } from "react";
import { data, Form, Link, redirect, useActionData, useSearchParams } from "react-router";
import type { Route } from "./+types/login";
import logoOriginal from "../../assets/logos/logo_original.svg";
import { createSupabaseServerClient } from "../../lib/supabase.server";

function safeReturnPath(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.startsWith("/admin") || value.startsWith("//")) {
    return "/admin";
  }
  return value;
}

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const { data: authData } = await supabase.auth.getUser();

  if (authData.user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .maybeSingle();
    if (profile?.role === "admin") throw redirect("/admin", { headers });
  }

  return data(null, { headers });
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const returnTo = safeReturnPath(formData.get("returnTo"));
  const { supabase, headers } = createSupabaseServerClient(request);

  if (!email || !password) {
    return data({ error: "Preenche o e-mail e a palavra-passe." }, { status: 400, headers });
  }

  const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError || !authData.user) {
    return data({ error: "Não foi possível iniciar sessão. Confirma os dados e tenta novamente." }, {
      status: 400,
      headers,
    });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (profileError || profile?.role !== "admin") {
    await supabase.auth.signOut();
    return data({ error: "Esta conta não tem permissões de administração." }, {
      status: 403,
      headers,
    });
  }

  return redirect(returnTo, { headers });
}

export default function AdminLogin() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const returnTo = safeReturnPath(searchParams.get("returnTo"));
  const accessDenied = searchParams.get("error") === "not-admin";

  return (
    <main className="min-h-screen bg-[#0C0B0C] text-[#E8DCC6] flex items-center justify-center px-5 py-12">
      <section className="w-full max-w-md rounded-3xl border border-[#C49A4A]/20 bg-[#141314] p-7 sm:p-10 shadow-2xl">
        <Link to="/" className="flex justify-center mb-8" aria-label="Voltar à loja">
          <img src={logoOriginal} alt="Vinicôa Sabugal" className="h-14 w-auto" />
        </Link>
        <p className="text-center text-[11px] uppercase tracking-[0.3em] text-[#C49A4A] mb-2">
          Área reservada
        </p>
        <h1 className="text-center font-brand text-2xl uppercase text-white mb-8">
          Iniciar sessão
        </h1>

        {(actionData?.error || accessDenied) && (
          <p role="alert" className="mb-5 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {actionData?.error ?? "A tua conta não tem permissões de administração."}
          </p>
        )}

        <Form method="post" className="space-y-5">
          <input type="hidden" name="returnTo" value={returnTo} />
          <div>
            <label htmlFor="admin-email" className="block text-xs text-white/65 mb-2">E-mail</label>
            <input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="username"
              required
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-[#C49A4A]"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="block text-xs text-white/65 mb-2">Palavra-passe</label>
            <div className="flex rounded-xl border border-white/10 bg-black/30 focus-within:border-[#C49A4A]">
              <input
                id="admin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="px-4 text-xs text-white/50 hover:text-white"
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>
          <button type="submit" className="w-full rounded-xl bg-[#6B0015] px-4 py-3.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#7d1025] transition">
            Entrar no painel
          </button>
        </Form>
        <Link to="/" className="mt-7 block text-center text-xs text-white/40 hover:text-white/70">
          Voltar à loja
        </Link>
      </section>
    </main>
  );
}
