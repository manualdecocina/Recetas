-- Verificación de reglas de BD y permisos por rol (32 comprobaciones).
-- Cada caso negativo exige el error EXACTO esperado (mensaje o SQLSTATE): un error
-- inesperado no cuenta como éxito.
-- Se revierte entera al final: no deja recetas, usuarios ni admins de prueba.
-- Ejecutar en Supabase → SQL Editor. Resultado esperado: un ERROR cuyo texto
-- empieza por "VERIFICACION_OK". Cualquier "FALLO ..." indica qué regla falló.
do $$
declare
  v_admin uuid := gen_random_uuid();
  v_user  uuid := gen_random_uuid();
  ing jsonb := '[{"amount":"1","name":"sal"}]';
  stp jsonb := '[{"title":"Paso","content":"Contenido"}]';
  r public.recipes;
  t public.recipes;
  first_pub timestamptz;
  n int;
  ok boolean;
begin
  insert into auth.users (id, email, aud, role) values
    (v_admin, 'zz-admin@verificacion.invalid', 'authenticated', 'authenticated'),
    (v_user,  'zz-user@verificacion.invalid',  'authenticated', 'authenticated');
  insert into public.admins (user_id, email) values (v_admin, 'zz-admin@verificacion.invalid');

  -- ================= ADMIN =================
  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_admin, 'role', 'authenticated')::text, true);

  if not public.is_admin() then raise exception 'FALLO A0: is_admin() falso para un admin'; end if;

  r := public.create_recipe('es', 'zz-verif-es', 'Verificación', null, ing, stp, null, null, null, null, null, false);
  if r.published_at is not null or r.recipe_group_id is null then raise exception 'FALLO A1: crear borrador'; end if;

  r := public.update_recipe(r.id, r.slug, r.title, null, ing, stp, null, null, null, null, null, true);
  if r.published_at is null then raise exception 'FALLO A2: publicar no fijó published_at'; end if;
  first_pub := r.published_at;

  r := public.update_recipe(r.id, r.slug, r.title, null, ing, stp, null, null, null, null, null, false);
  if r.published_at is distinct from first_pub then raise exception 'FALLO A3: despublicar cambió la fecha'; end if;

  r := public.update_recipe(r.id, r.slug, r.title, null, ing, stp, null, null, null, null, null, true);
  if r.published_at is distinct from first_pub then raise exception 'FALLO A4: republicar cambió la fecha'; end if;

  update public.recipes set published_at = '2000-01-01' where id = r.id returning * into r;
  if r.published_at is distinct from first_pub then raise exception 'FALLO A5: published_at editable a mano'; end if;

  ok := false;
  begin update public.recipes set language = 'de' where id = r.id;
  exception when raise_exception then ok := sqlerrm like 'recipe_group_id y language no se pueden modificar%'; end;
  if not ok then raise exception 'FALLO A6: se pudo cambiar el idioma'; end if;

  ok := false;
  begin update public.recipes set recipe_group_id = gen_random_uuid() where id = r.id;
  exception when raise_exception then ok := sqlerrm like 'recipe_group_id y language no se pueden modificar%'; end;
  if not ok then raise exception 'FALLO A7: se pudo cambiar el grupo'; end if;

  t := public.create_recipe_translation(r.id, 'de', 'zz-verif-de', 'Verifikation', null, ing, stp, null, null, null, null, null, false);
  if t.recipe_group_id is distinct from r.recipe_group_id then raise exception 'FALLO A8: la traducción no heredó el grupo'; end if;
  if t.published_at is not null then raise exception 'FALLO A9: traducción en borrador con fecha'; end if;

  ok := false;
  begin perform public.create_recipe_translation(r.id, 'de', 'zz-verif-de-2', 'Dup', null, ing, stp, null, null, null, null, null, false);
  exception when raise_exception then ok := sqlerrm like 'Ya existe una traducción en de%'; end;
  if not ok then raise exception 'FALLO A10: se duplicó un idioma en el grupo'; end if;

  ok := false;
  begin perform public.create_recipe_translation(t.id, 'es', 'zz-verif-es-2', 'Dup', null, ing, stp, null, null, null, null, null, false);
  exception when raise_exception then ok := sqlerrm like 'Ya existe una traducción en es%'; end;
  if not ok then raise exception 'FALLO A11: se duplicó el idioma de origen desde una hermana'; end if;

  ok := false;
  begin perform public.create_recipe_translation(gen_random_uuid(), 'fr', 'zz-verif-fr', 'X', null, ing, stp, null, null, null, null, null, false);
  exception when raise_exception then ok := sqlerrm = 'La receta de origen no existe'; end;
  if not ok then raise exception 'FALLO A12: aceptó una receta origen inexistente'; end if;

  ok := false;
  begin insert into public.recipes (recipe_group_id, language, slug, title) values (r.recipe_group_id, 'de', 'zz-carrera', 'Carrera');
  exception when unique_violation then ok := sqlerrm like '%recipes_group_language_key%'; end;
  if not ok then raise exception 'FALLO A13: el índice único grupo+idioma no protege'; end if;

  ok := false;
  begin perform public.create_recipe('es', 'zz-verif-es', 'Slug repetido', null, ing, stp, null, null, null, null, null, false);
  exception when unique_violation then ok := sqlerrm like '%recipes_language_slug_key%'; end;
  if not ok then raise exception 'FALLO A14: slug repetido en el mismo idioma aceptado'; end if;

  select count(*) into n from public.recipes where id = t.id;
  if n <> 1 then raise exception 'FALLO A15: el admin no ve borradores'; end if;

  -- ============ AUTENTICADO NO ADMIN ============
  perform set_config('request.jwt.claims', json_build_object('sub', v_user, 'role', 'authenticated')::text, true);

  if public.is_admin() then raise exception 'FALLO U0: is_admin() verdadero para no admin'; end if;

  select count(*) into n from public.recipes where id = t.id;
  if n <> 0 then raise exception 'FALLO U1: un no admin ve borradores'; end if;

  select count(*) into n from public.recipes where id = r.id;
  if n <> 1 then raise exception 'FALLO U2: un no admin no ve una receta publicada'; end if;

  ok := false;
  begin perform public.create_recipe('es', 'zz-hack-1', 'Hack', null, ing, stp, null, null, null, null, null, true);
  exception when raise_exception then ok := sqlerrm = 'No autorizado'; end;
  if not ok then raise exception 'FALLO U3: un no admin creó una receta'; end if;

  update public.recipes set title = 'hack' where id = r.id;
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'FALLO U4: un no admin editó una receta'; end if;

  delete from public.recipes where id = r.id;
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'FALLO U5: un no admin eliminó una receta'; end if;

  ok := false;
  begin insert into public.recipes (recipe_group_id, language, slug, title) values (gen_random_uuid(), 'es', 'zz-hack-2', 'Hack');
  exception when insufficient_privilege then ok := true; end;
  if not ok then raise exception 'FALLO U6: un no admin insertó directo en la tabla'; end if;

  ok := false;
  begin perform public.update_recipe(r.id, r.slug, 'hack', null, ing, stp, null, null, null, null, null, true);
  exception when raise_exception then ok := sqlerrm = 'No autorizado'; end;
  if not ok then raise exception 'FALLO U7: un no admin usó update_recipe'; end if;

  select count(*) into n from public.admins;
  if n <> 0 then raise exception 'FALLO U8: un no admin ve filas de admins'; end if;

  -- ================= ANÓNIMO =================
  perform set_config('role', 'anon', true);
  perform set_config('request.jwt.claims', '{"role":"anon"}', true);

  select count(*) into n from public.recipes where id = t.id;
  if n <> 0 then raise exception 'FALLO N1: anónimo ve borradores'; end if;

  select count(*) into n from public.recipes where id = r.id;
  if n <> 1 then raise exception 'FALLO N2: anónimo no ve una receta publicada'; end if;

  ok := false;
  begin perform public.create_recipe('es', 'zz-hack-3', 'Hack', null, ing, stp, null, null, null, null, null, true);
  exception when insufficient_privilege then ok := true; end;
  if not ok then raise exception 'FALLO N3: anónimo ejecutó create_recipe'; end if;

  ok := false;
  begin select count(*) into n from public.admins; ok := (n = 0);
  exception when insufficient_privilege then ok := true; end;
  if not ok then raise exception 'FALLO N4: anónimo ve la tabla admins'; end if;

  -- ============ ADMIN elimina ============
  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_admin, 'role', 'authenticated')::text, true);

  select count(*) into n from public.admins;
  if n <> 1 then raise exception 'FALLO A16: el admin no ve (solo) su propia fila en admins'; end if;

  delete from public.recipes where id = t.id;
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'FALLO A17: el admin no pudo eliminar'; end if;

  select count(*) into n from public.recipes where id = t.id;
  if n <> 0 then raise exception 'FALLO A18: la receta eliminada sigue existiendo'; end if;

  raise exception 'VERIFICACION_OK: 32 comprobaciones superadas (todo revertido, no quedan datos)';
end $$;
