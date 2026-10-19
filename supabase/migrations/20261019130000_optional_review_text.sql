alter table public.reviews
  alter column body set default '';

alter table public.reviews
  drop constraint if exists reviews_body_check;

alter table public.reviews
  add constraint reviews_body_check
  check (body = '' or char_length(body) between 20 and 1000);
