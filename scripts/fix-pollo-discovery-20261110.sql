-- Applied and verified: seven published translations only; preserve original publication date.
update public.recipes
set ready_at = published_at
where recipe_group_id = '9cd4fa16-5d2b-44ef-afcb-68322a55efd1'
  and published = true and ready_at is null and published_at is not null;
