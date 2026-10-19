import { data, Outlet, redirect } from "react-router";
import type { Route } from "./+types/protected-layout";
import { createSupabaseServerClient } from "../../lib/supabase.server";

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    const requestedPath = new URL(request.url).pathname;
    throw redirect(`/admin/login?returnTo=${encodeURIComponent(requestedPath)}`, {
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
    throw redirect("/admin/login?error=not-admin", { headers });
  }

  return data(null, { headers });
}

export default function ProtectedAdminLayout() {
  return <Outlet />;
}
