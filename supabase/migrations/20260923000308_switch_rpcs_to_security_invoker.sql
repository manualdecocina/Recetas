-- HISTORIAL. No ejecutar sobre una base nueva: usar supabase/schema.sql.
-- Copia exacta de la migración aplicada en Supabase.
-- Pasa las RPC a SECURITY INVOKER para que la RLS se aplique de verdad a cada operación.
-- Resultado verificado: linter de seguridad de Supabase con 0 alertas.

create policy "user reads own admin row"
on public.admins for select
to authenticated
using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

alter function public.create_recipe(text, text, text, text, jsonb, jsonb, text, integer, integer, integer, text, boolean) security invoker;
alter function public.create_recipe_translation(uuid, text, text, text, text, jsonb, jsonb, text, integer, integer, integer, text, boolean) security invoker;
alter function public.update_recipe(uuid, text, text, text, jsonb, jsonb, text, integer, integer, integer, text, boolean) security invoker;
