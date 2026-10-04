-- APPLIED — Step 4 security hardening — 2026-10-04
-- Exact SQL already applied to Supabase project eqbdtctxbpepbeickhqi.
-- This file documents the change; it is not a pending migration.

create schema if not exists archive;
revoke all on schema archive from public, anon, authenticated;
grant usage on schema archive to service_role;

alter table public.recipes_backup_20260927 set schema archive;
alter table public.recipes_published_snapshot_20260927 set schema archive;

alter table archive.recipes_backup_20260927 disable row level security;
alter table archive.recipes_published_snapshot_20260927 disable row level security;

revoke all on archive.recipes_backup_20260927 from public, anon, authenticated;
revoke all on archive.recipes_published_snapshot_20260927 from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger
  on archive.recipes_backup_20260927,
     archive.recipes_published_snapshot_20260927
  from service_role;
grant select on archive.recipes_backup_20260927 to service_role;
grant select on archive.recipes_published_snapshot_20260927 to service_role;

create table if not exists private.recipe_rating_votes (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  voter_hash text not null,
  rating smallint not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  unique (recipe_id, voter_hash),
  check (voter_hash ~ '^[0-9a-f]{64}$')
);

revoke all on private.recipe_rating_votes from public, anon, authenticated;
grant select, insert on private.recipe_rating_votes to service_role;

create or replace function public.rate_recipe_once(
  p_recipe_id uuid,
  p_rating integer,
  p_voter_hash text
)
returns table(rating_count integer, rating_sum integer)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_rating is null or p_rating < 1 or p_rating > 5 then
    raise exception 'rating fuera de rango (1-5)';
  end if;
  if p_voter_hash is null or p_voter_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'identificador de voto inválido';
  end if;

  insert into private.recipe_rating_votes(recipe_id, voter_hash, rating)
  select r.id, p_voter_hash, p_rating
  from public.recipes r
  where r.id = p_recipe_id and r.published = true
  on conflict (recipe_id, voter_hash) do nothing;

  if not found then
    if exists (
      select 1 from private.recipe_rating_votes
      where recipe_id = p_recipe_id and voter_hash = p_voter_hash
    ) then
      raise exception 'esta visita ya votó esta receta';
    end if;
    raise exception 'receta no encontrada o no publicada';
  end if;

  return query
  update public.recipes r
  set rating_count = r.rating_count + 1,
      rating_sum = r.rating_sum + p_rating
  where r.id = p_recipe_id
  returning r.rating_count, r.rating_sum;
end;
$$;

revoke execute on function public.rate_recipe_once(uuid, integer, text)
  from public, anon, authenticated;
grant execute on function public.rate_recipe_once(uuid, integer, text)
  to service_role;

drop function if exists public.rate_recipe(uuid, integer);
