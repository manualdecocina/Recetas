-- Publication guard: incomplete Recipe rows must never become public.
-- 2026-09-25

create or replace function public.guard_published_recipe_completeness()
returns trigger
language plpgsql
as $$
begin
  if new.published then
    if nullif(trim(coalesce(new.title, '')), '') is null then
      raise exception 'Published recipe requires title';
    end if;

    if nullif(trim(coalesce(new.image_url, '')), '') is null then
      raise exception 'Published recipe requires image_url';
    end if;

    if nullif(trim(coalesce(new.content_html, '')), '') is null then
      raise exception 'Published recipe requires content_html';
    end if;

    if jsonb_array_length(coalesce(new.ingredients, '[]'::jsonb)) = 0 then
      raise exception 'Published recipe requires ingredients';
    end if;

    if jsonb_array_length(coalesce(new.steps, '[]'::jsonb)) = 0 then
      raise exception 'Published recipe requires steps';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_guard_published_recipe_completeness on public.recipes;

create trigger trg_guard_published_recipe_completeness
before insert or update of title, image_url, content_html, ingredients, steps, published
on public.recipes
for each row
execute function public.guard_published_recipe_completeness();
