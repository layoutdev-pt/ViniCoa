-- Fields currently used by the product dashboard but not present in the
-- initial catalog schema.
alter table public.products
  add column if not exists category text not null default 'Vinhos',
  add column if not exists featured_home boolean not null default false;

update public.products p
set featured_home = fp.is_active
from public.featured_products fp
where fp.product_id = p.id
  and p.featured_home is distinct from fp.is_active;

create or replace function public.sync_product_featured_row()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.featured_home then
    insert into public.featured_products (product_id, position, is_active)
    values (
      new.id,
      coalesce((select max(position) + 1 from public.featured_products), 0),
      true
    )
    on conflict (product_id) do update set is_active = true;
  else
    delete from public.featured_products where product_id = new.id;
  end if;
  return new;
end;
$$;

create trigger products_sync_featured_row
after insert or update of featured_home on public.products
for each row execute function public.sync_product_featured_row();
