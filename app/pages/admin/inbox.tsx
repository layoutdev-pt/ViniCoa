import { useState } from "react";
import { data, useFetcher, useLoaderData } from "react-router";
import type { Route } from "./+types/inbox";
import { Check, Mail, MessageSquareText, Star, X } from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { createSupabaseServerClient } from "../../lib/supabase.server";

type InboxTab = "messages" | "reviews";

async function requireAdmin(request: Request) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return { supabase, headers, allowed: false };

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .maybeSingle();

  return { supabase, headers, allowed: !error && profile?.role === "admin" };
}

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers, allowed } = await requireAdmin(request);
  if (!allowed) return data({ messages: [], reviews: [], error: "Acesso reservado à administração." }, { status: 403, headers });

  const [{ data: messages, error: messagesError }, { data: reviews, error: reviewsError }] = await Promise.all([
    supabase
      .from("contact_messages")
      .select("id, name, email, phone, subject, message, status, created_at")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("reviews")
      .select("id, display_name, rating, title, body, product_id, created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  if (messagesError || reviewsError) {
    console.error("Admin inbox load failed:", messagesError ?? reviewsError);
    return data({ messages: [], reviews: [], error: "Não foi possível carregar a caixa de entrada." }, { headers });
  }

  const reviewIds = (reviews ?? []).map((review) => review.id);
  const productIds = [...new Set((reviews ?? []).flatMap((review) => review.product_id ? [review.product_id] : []))];
  const [submittersResult, productsResult] = await Promise.all([
    reviewIds.length
      ? supabase.from("review_submitters").select("review_id, email").in("review_id", reviewIds)
      : Promise.resolve({ data: [], error: null }),
    productIds.length
      ? supabase.from("products").select("id, name").in("id", productIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (submittersResult.error || productsResult.error) {
    console.error("Admin inbox details load failed:", submittersResult.error ?? productsResult.error);
    return data({ messages: messages ?? [], reviews: [], error: "Não foi possível carregar os detalhes das avaliações." }, { headers });
  }

  const submitterEmails = new Map((submittersResult.data ?? []).map((row) => [row.review_id, row.email]));
  const productNames = new Map((productsResult.data ?? []).map((row) => [row.id, row.name]));
  const pendingReviews = (reviews ?? []).map((review) => ({
    ...review,
    email: submitterEmails.get(review.id) ?? "",
    productName: review.product_id ? productNames.get(review.product_id) ?? "Vinho indisponível" : null,
  }));

  return data({ messages: messages ?? [], reviews: pendingReviews, error: null }, { headers });
}

export async function action({ request }: Route.ActionArgs) {
  const { supabase, headers, allowed } = await requireAdmin(request);
  if (!allowed) return data({ error: "Acesso reservado à administração." }, { status: 403, headers });

  const origin = request.headers.get("origin");
  if (!origin || new URL(origin).origin !== new URL(request.url).origin) {
    return data({ error: "Pedido inválido." }, { status: 403, headers });
  }
  if (!(request.headers.get("content-type") ?? "").includes("application/x-www-form-urlencoded")) {
    return data({ error: "Formato de pedido inválido." }, { status: 415, headers });
  }

  const form = await request.formData();
  const intent = form.get("intent");
  const id = form.get("id");
  if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id)) {
    return data({ error: "Registo inválido." }, { status: 400, headers });
  }

  if (intent === "close-message" || intent === "reopen-message") {
    const status = intent === "close-message" ? "closed" : "new";
    const { data: updated, error } = await supabase
      .from("contact_messages")
      .update({ status })
      .eq("id", id)
      .select("id")
      .maybeSingle();
    if (error || !updated) {
      console.error("Contact message status update failed:", error);
      return data({ error: "Não foi possível atualizar a mensagem." }, { status: 400, headers });
    }
    return data({ ok: true }, { headers });
  }

  if (intent === "moderate-review") {
    const status = form.get("status");
    if (status !== "published" && status !== "rejected") {
      return data({ error: "Ação de moderação inválida." }, { status: 400, headers });
    }
    const { data: updated, error } = await supabase
      .from("reviews")
      .update({ status })
      .eq("id", id)
      .eq("status", "pending")
      .select("id")
      .maybeSingle();
    if (error || !updated) {
      console.error("Review moderation failed:", error);
      return data({ error: "Não foi possível atualizar a avaliação." }, { status: 400, headers });
    }
    return data({ ok: true }, { headers });
  }

  return data({ error: "Ação inválida." }, { status: 400, headers });
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-PT", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Lisbon",
  }).format(new Date(value));
}

const actionClass = "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition disabled:cursor-wait disabled:opacity-50";

export default function AdminInboxPage() {
  const { messages, reviews, error } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const [tab, setTab] = useState<InboxTab>("messages");
  const isSubmitting = fetcher.state !== "idle";
  const actionError = fetcher.data && "error" in fetcher.data ? fetcher.data.error : null;

  return (
    <AdminLayout title="Caixa de entrada" subtitle="Mensagens de contacto e avaliações à espera de moderação.">
      <div className="space-y-6">
        {error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-500/5 px-4 py-3 text-sm text-red-200">{error}</p>}
        {actionError && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-500/5 px-4 py-3 text-sm text-red-200">{actionError}</p>}

        <div className="flex gap-2 border-b border-white/[0.08]">
          <button type="button" onClick={() => setTab("messages")} className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm transition ${tab === "messages" ? "border-[#C49A4A] text-white" : "border-transparent text-white/50 hover:text-white"}`}>
            <Mail className="h-4 w-4" /> Mensagens <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-xs">{messages.length}</span>
          </button>
          <button type="button" onClick={() => setTab("reviews")} className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm transition ${tab === "reviews" ? "border-[#C49A4A] text-white" : "border-transparent text-white/50 hover:text-white"}`}>
            <Star className="h-4 w-4" /> Avaliações pendentes <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-xs">{reviews.length}</span>
          </button>
        </div>

        {tab === "messages" ? (
          messages.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.06] bg-[#121112] px-6 py-16 text-center">
              <MessageSquareText className="mx-auto mb-3 h-8 w-8 text-white/25" />
              <p className="text-sm text-white/60">Ainda não há mensagens.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <article key={message.id} className="rounded-2xl border border-white/[0.07] bg-[#121112] p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-medium text-white">{message.name}</h2>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] ${message.status === "closed" ? "bg-white/[0.07] text-white/45" : "bg-[#C49A4A]/15 text-[#D4AE65]"}`}>
                          {message.status === "closed" ? "Fechada" : message.status === "in_progress" ? "Em curso" : message.status === "spam" ? "Spam" : "Nova"}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/45">
                        <a className="hover:text-[#D4AE65]" href={`mailto:${message.email}`}>{message.email}</a>
                        {message.phone && <a className="hover:text-[#D4AE65]" href={`tel:${message.phone}`}>{message.phone}</a>}
                        <time dateTime={message.created_at}>{formatDate(message.created_at)}</time>
                      </div>
                      <h3 className="mt-4 text-sm font-medium text-[#D4AE65]">{message.subject}</h3>
                      <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-white/75">{message.message}</p>
                    </div>
                    <fetcher.Form method="post" className="shrink-0">
                      <input type="hidden" name="id" value={message.id} />
                      <input type="hidden" name="intent" value={message.status === "closed" ? "reopen-message" : "close-message"} />
                      <button type="submit" disabled={isSubmitting || message.status === "spam"} className={`${actionClass} border-white/10 text-white/65 hover:border-[#C49A4A]/40 hover:text-white`}>
                        {message.status === "closed" ? <Mail className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                        {message.status === "closed" ? "Reabrir" : "Fechar"}
                      </button>
                    </fetcher.Form>
                  </div>
                </article>
              ))}
            </div>
          )
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.06] bg-[#121112] px-6 py-16 text-center">
            <Star className="mx-auto mb-3 h-8 w-8 text-white/25" />
            <p className="text-sm text-white/60">Não há avaliações pendentes de revisão.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <article key={review.id} className="rounded-2xl border border-white/[0.07] bg-[#121112] p-5 sm:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-medium text-white">{review.display_name}</h2>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#C49A4A]/15 px-2.5 py-1 text-[11px] text-[#D4AE65]">
                        <Star className="h-3 w-3 fill-current" /> {review.rating}/5
                      </span>
                      {review.productName && <span className="text-xs text-white/40">{review.productName}</span>}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/45">
                      {review.email && <a className="hover:text-[#D4AE65]" href={`mailto:${review.email}`}>{review.email}</a>}
                      <time dateTime={review.created_at}>{formatDate(review.created_at)}</time>
                    </div>
                    {review.title !== "Avaliação por estrelas" && <h3 className="mt-4 text-sm font-medium text-white">{review.title}</h3>}
                    {review.body ? (
                      <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-white/75">{review.body}</p>
                    ) : (
                      <p className="mt-3 text-sm italic text-white/40">Submetida apenas com classificação por estrelas, sem comentário escrito.</p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <fetcher.Form method="post">
                      <input type="hidden" name="id" value={review.id} />
                      <input type="hidden" name="intent" value="moderate-review" />
                      <input type="hidden" name="status" value="published" />
                      <button type="submit" disabled={isSubmitting} className={`${actionClass} border-emerald-400/20 bg-emerald-400/5 text-emerald-200 hover:bg-emerald-400/10`}>
                        <Check className="h-3.5 w-3.5" /> Publicar
                      </button>
                    </fetcher.Form>
                    <fetcher.Form method="post">
                      <input type="hidden" name="id" value={review.id} />
                      <input type="hidden" name="intent" value="moderate-review" />
                      <input type="hidden" name="status" value="rejected" />
                      <button type="submit" disabled={isSubmitting} className={`${actionClass} border-red-400/20 text-red-200 hover:bg-red-400/10`}>
                        <X className="h-3.5 w-3.5" /> Rejeitar
                      </button>
                    </fetcher.Form>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
