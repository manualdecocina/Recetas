-- Rollback-only regression checks. No test recipe or editorial edit is retained.
BEGIN;
SET LOCAL lock_timeout='10s';
SET LOCAL statement_timeout='60s';
DO $test$
DECLARE rid uuid; diagnostic text; original jsonb;
BEGIN
  SELECT id,ingredients INTO rid,original FROM public.recipes WHERE language='es' AND slug='receta-de-pan-matza' AND published;
  IF rid IS NULL THEN RAISE EXCEPTION 'Test source is missing'; END IF;
  -- An edit that removes all recognized ingredients cannot commit.
  BEGIN
    UPDATE public.recipes SET ingredients='[{"name":"qa-unrecognized-pantry-ingredient-20261009","amount":"1","unit":"g"}]'::jsonb WHERE id=rid;
    SET CONSTRAINTS ALL IMMEDIATE;
    RAISE EXCEPTION 'FAIL: zero-link published edit accepted';
  EXCEPTION WHEN check_violation THEN
    GET STACKED DIAGNOSTICS diagnostic=CONSTRAINT_NAME;
    IF diagnostic<>'recipes_require_pantry_ingredient' THEN RAISE EXCEPTION 'Unexpected constraint: %',diagnostic; END IF;
  END;
  SET CONSTRAINTS ALL DEFERRED;
  -- Publication cannot bypass the rule by staging the ingredient edit as a draft.
  BEGIN
    UPDATE public.recipes SET published=false,ingredients='[{"name":"qa-unrecognized-pantry-ingredient-20261009","amount":"1","unit":"g"}]'::jsonb WHERE id=rid;
    UPDATE public.recipes SET published=true WHERE id=rid;
    SET CONSTRAINTS ALL IMMEDIATE;
    RAISE EXCEPTION 'FAIL: zero-link publication accepted';
  EXCEPTION WHEN check_violation THEN
    GET STACKED DIAGNOSTICS diagnostic=CONSTRAINT_NAME;
    IF diagnostic<>'recipes_require_pantry_ingredient' THEN RAISE EXCEPTION 'Unexpected constraint: %',diagnostic; END IF;
  END;
  SET CONSTRAINTS ALL DEFERRED;
  -- Removing the last association independently of the recipe row is also rejected.
  BEGIN
    DELETE FROM public.recipe_ingredients WHERE recipe_id=rid;
    SET CONSTRAINTS ALL IMMEDIATE;
    RAISE EXCEPTION 'FAIL: last associations deleted';
  EXCEPTION WHEN check_violation THEN
    GET STACKED DIAGNOSTICS diagnostic=CONSTRAINT_NAME;
    IF diagnostic<>'recipes_require_pantry_ingredient' THEN RAISE EXCEPTION 'Unexpected constraint: %',diagnostic; END IF;
  END;
  SET CONSTRAINTS ALL DEFERRED;
  -- Synchronization can replace links without failing while its graph is rebuilding.
  PERFORM private.sync_recipe_ingredient_catalog(rid);
  SET CONSTRAINTS ALL IMMEDIATE;
  IF(SELECT count(*) FROM public.recipe_ingredients WHERE recipe_id=rid)<>2 THEN RAISE EXCEPTION 'FAIL: normal rebuild'; END IF;
  SET CONSTRAINTS ALL DEFERRED;
  -- D-087: a known ingredient plus a pending expression remains publishable.
  UPDATE public.recipes SET ingredients='[{"name":"Harina de trigo común","amount":"250","unit":"g"},{"name":"qa-unrecognized-pantry-ingredient-20261009","amount":"1","unit":"g"}]'::jsonb WHERE id=rid;
  SET CONSTRAINTS ALL IMMEDIATE;
  IF(SELECT count(*) FROM public.recipe_ingredients WHERE recipe_id=rid)<>1
    OR(SELECT count(*) FROM public.recipe_ingredient_pending WHERE recipe_id=rid)<>1
  THEN RAISE EXCEPTION 'FAIL: pending expression policy changed'; END IF;
END $test$;
ROLLBACK;
SELECT 'PASS: publication, edits and last-link deletion rejected; rebuild and pending policy preserved; all test mutations rolled back' as regression_result;
