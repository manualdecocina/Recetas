drop policy if exists "public read published recipes" on public.recipes;
drop policy if exists "admin read all recipes" on public.recipes;
drop policy if exists "admin write recipes" on public.recipes;

create policy "anon read published recipes"
on public.recipes for select
to anon
using (published = true);

create policy "authenticated read recipes"
on public.recipes for select
to authenticated
using (published = true or public.is_admin());

create policy "admin insert recipes"
on public.recipes for insert
to authenticated
with check (public.is_admin());

create policy "admin update recipes"
on public.recipes for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admin delete recipes"
on public.recipes for delete
to authenticated
using (public.is_admin());

drop policy if exists "user reads own admin row" on public.admins;
create policy "user reads own admin row"
on public.admins for select
to authenticated
using (user_id = (select auth.uid()));

drop index if exists public.recipes_language_slug_uq;
drop index if exists public.content_pages_published_idx;