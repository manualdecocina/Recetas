-- Applied in production as Supabase migration version 20260924214154.
create or replace function public.sync_public_path()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.public_path is null or new.public_path = '' then
    if new.source_url is not null and (
      new.source_url like 'https://manualdecocina.com/%'
      or new.source_url like 'https://www.manualdecocina.com/%'
    ) then
      new.public_path := regexp_replace(
        replace(replace(new.source_url, 'https://manualdecocina.com', ''), 'https://www.manualdecocina.com', ''),
        '/+$',
        ''
      );
    else
      new.public_path := '/' || new.language || '/receta/' || new.slug;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists recipes_sync_public_path on public.recipes;
create trigger recipes_sync_public_path
before insert on public.recipes
for each row execute function public.sync_public_path();

create or replace function public.sync_content_page_public_path()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.public_path is null or new.public_path = '' then
    if new.source_url is not null and (
      new.source_url like 'https://manualdecocina.com/%'
      or new.source_url like 'https://www.manualdecocina.com/%'
    ) then
      new.public_path := regexp_replace(
        replace(replace(new.source_url, 'https://manualdecocina.com', ''), 'https://www.manualdecocina.com', ''),
        '/+$',
        ''
      );
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists content_pages_sync_public_path on public.content_pages;
create trigger content_pages_sync_public_path
before insert on public.content_pages
for each row execute function public.sync_content_page_public_path();

revoke execute on function public.sync_public_path() from public, anon, authenticated;
revoke execute on function public.sync_content_page_public_path() from public, anon, authenticated;
