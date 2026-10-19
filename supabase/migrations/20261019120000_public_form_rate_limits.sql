-- Durable, atomic rate limits for public contact and review submissions.
-- The raw client address is never stored; the server sends an HMAC digest.
create table public.form_rate_limits (
  key_hash text primary key check (key_hash ~ '^[0-9a-f]{64}$'),
  window_started_at timestamptz not null default now(),
  attempts integer not null check (attempts > 0),
  updated_at timestamptz not null default now()
);

alter table public.form_rate_limits enable row level security;
revoke all on public.form_rate_limits from public, anon, authenticated;
grant all on public.form_rate_limits to service_role;
create index form_rate_limits_updated_at_idx
  on public.form_rate_limits (updated_at);

-- Record when the user accepted each form's stated data-use consent.
alter table public.contact_messages
  add column consent_at timestamptz default now();
alter table public.review_submitters
  add column consent_at timestamptz default now();

create or replace function public.consume_form_rate_limit(
  p_key_hash text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_allowed boolean;
begin
  if p_key_hash is null or p_key_hash !~ '^[0-9a-f]{64}$'
     or p_limit < 1 or p_limit > 100
     or p_window_seconds < 1 or p_window_seconds > 86400 then
    raise exception 'Invalid rate limit parameters';
  end if;

  -- Opportunistic pruning prevents unbounded growth without an external scheduler.
  delete from public.form_rate_limits
  where updated_at < now() - interval '2 days';

  insert into public.form_rate_limits (key_hash, window_started_at, attempts, updated_at)
  values (p_key_hash, now(), 1, now())
  on conflict (key_hash) do update
  set window_started_at = case
        when public.form_rate_limits.window_started_at <= now() - p_window_seconds * interval '1 second'
          then now()
        else public.form_rate_limits.window_started_at
      end,
      attempts = case
        when public.form_rate_limits.window_started_at <= now() - p_window_seconds * interval '1 second'
          then 1
        else public.form_rate_limits.attempts + 1
      end,
      updated_at = now()
  returning attempts <= p_limit into v_allowed;

  return v_allowed;
end;
$$;

revoke all on function public.consume_form_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_form_rate_limit(text, integer, integer) to service_role;

-- Keep a submitted review and its private email in one transaction.
create or replace function public.create_review_submission(
  p_display_name text,
  p_product_id uuid,
  p_rating smallint,
  p_title text,
  p_body text,
  p_email text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  review_id uuid;
begin
  insert into public.reviews (display_name, product_id, rating, title, body)
  values (p_display_name, p_product_id, p_rating, p_title, p_body)
  returning id into review_id;

  insert into public.review_submitters (review_id, email)
  values (review_id, lower(trim(p_email)));

  return review_id;
end;
$$;

revoke all on function public.create_review_submission(text, uuid, smallint, text, text, text) from public, anon, authenticated;
grant execute on function public.create_review_submission(text, uuid, smallint, text, text, text) to service_role;
