-- Applied in production as Supabase migration version 20260924213945.
alter table public.recipes add column if not exists public_path text;
alter table public.content_pages add column if not exists public_path text;

update public.recipes
set public_path = case
  when source_url is not null
    then regexp_replace(
      replace(replace(source_url, 'https://manualdecocina.com', ''), 'https://www.manualdecocina.com', ''),
      '/+$',
      ''
    )
  else '/' || language || '/receta/' || slug
end
where public_path is null;

update public.content_pages
set public_path = regexp_replace(
  replace(replace(source_url, 'https://manualdecocina.com', ''), 'https://www.manualdecocina.com', ''),
  '/+$',
  ''
)
where public_path is null and source_url is not null;

create unique index if not exists recipes_public_path_uidx
  on public.recipes(public_path)
  where public_path is not null;

create unique index if not exists content_pages_public_path_uidx
  on public.content_pages(public_path)
  where public_path is not null;
