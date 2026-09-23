-- HISTORIAL (migración 1 de 5). No ejecutar sobre una base nueva: usar supabase/schema.sql.
-- Estado inicial. Contiene la política "authenticated write recipes", que la migración 2 elimina.

create extension if not exists "pgcrypto";

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  recipe_group_id uuid not null,
  language text not null check (language in ('es','de','ja','it','fr','en')),
  slug text not null,
  title text not null,
  excerpt text,
  ingredients jsonb not null default '[]'::jsonb,
  steps jsonb not null default '[]'::jsonb,
  category text,
  prep_time_minutes integer,
  cook_time_minutes integer,
  servings integer,
  image_url text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (language, slug)
);

create index recipes_group_idx on public.recipes (recipe_group_id);
create index recipes_published_feed_idx on public.recipes (language, published_at desc) where published = true;
create index recipes_category_idx on public.recipes (language, category) where published = true;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger recipes_set_updated_at
before update on public.recipes
for each row execute function public.set_updated_at();

alter table public.recipes enable row level security;

create policy "public read published recipes"
on public.recipes for select
using (published = true);

create policy "authenticated write recipes"
on public.recipes for all
to authenticated
using (true)
with check (true);
