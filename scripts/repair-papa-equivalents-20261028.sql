-- Data-only repair requested by the owner: display Papa, preserve canonical identity.
-- No recipe text, URL, publication date, ingredient quantity or schema changes.
begin;
do $repair$
declare
  v_id constant uuid := '98322e50-1f0c-406c-8681-b5718d3801ee';
  v_previous_links jsonb;
begin
  perform 1 from public.ingredients where id=v_id and slug='papas' and status='canonical' for update;
  if not found then raise exception 'Unexpected canonical potato ingredient'; end if;
  if exists (
    select 1 from public.ingredients where status='canonical' and id<>v_id
    and lower(trim(coalesce(normalized_name,name))) in ('papa','papas','patata','patatas')
  ) or exists (
    select 1 from public.ingredient_aliases where ingredient_id<>v_id
    and lower(trim(normalized_alias)) in ('papa','papas','patata','patatas')
  ) then raise exception 'Conflicting canonical potato identity'; end if;

  -- Alias reconciliation can rebuild related recipes. Abort if any existing mapping changes.
  select coalesce(jsonb_agg(jsonb_build_object(
    'recipe_id',recipe_id,'ingredient_id',ingredient_id,'position',position,
    'amount',amount,'unit',unit,'preparation',preparation,'note',note
  )), '[]'::jsonb) into v_previous_links from public.recipe_ingredients;

  -- Preserve the previous plural before changing the display name.
  insert into public.ingredient_aliases(ingredient_id,alias,normalized_alias)
  values (v_id,'papas','papas') on conflict (ingredient_id,normalized_alias) do nothing;
  update public.ingredients set name='Papa',normalized_name='papa',updated_at=now()
  where id=v_id and (name is distinct from 'Papa' or normalized_name is distinct from 'papa');
  insert into public.ingredient_aliases(ingredient_id,alias,normalized_alias)
  values (v_id,'papa','papa'),(v_id,'patata','patata'),(v_id,'patatas','patatas')
  on conflict (ingredient_id,normalized_alias) do nothing;

  if exists (
    select 1 from jsonb_to_recordset(v_previous_links) old(
      recipe_id uuid,ingredient_id uuid,position int,amount text,unit text,preparation text,note text
    ) where not exists (
      select 1 from public.recipe_ingredients current
      where current.recipe_id=old.recipe_id and current.ingredient_id=old.ingredient_id
      and current.position=old.position
      and current.amount is not distinct from old.amount
      and current.unit is not distinct from old.unit
      and current.preparation is not distinct from old.preparation
      and current.note is not distinct from old.note
    )
  ) then raise exception 'An unrelated existing ingredient mapping changed; repair rolled back'; end if;
  if exists (
    select 1 from public.recipe_ingredient_pending where lower(trim(raw_name)) in ('papa','papas','patata','patatas')
  ) then raise exception 'Potato equivalents remain unresolved'; end if;
end;
$repair$;
commit;

