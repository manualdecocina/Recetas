-- Manual de Cocina: exportación temporal, privada y SOLO-LECTURA de votos.
-- No crea accesos anon/authenticated, no publica hashes y no cambia votos.
-- Este RPC es consumido exclusivamente desde Node con SUPABASE_SERVICE_ROLE_KEY.
BEGIN;
CREATE OR REPLACE FUNCTION public.mdc_rating_migration_snapshot()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT pg_catalog.jsonb_build_object(
    'votes', COALESCE((
      SELECT pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object(
        'id', v.id::text,
        'recipe_id', v.recipe_id::text,
        'voter_hash', v.voter_hash,
        'rating', v.rating,
        'created_at', pg_catalog.to_char(v.created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS.US')
      ) ORDER BY v.created_at, v.id)
      FROM private.recipe_rating_votes AS v
    ), '[]'::jsonb),
    'counters', COALESCE((
      SELECT pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object(
        'id', r.id::text, 'rating_count', r.rating_count, 'rating_sum', r.rating_sum
      ) ORDER BY r.id)
      FROM public.recipes AS r
      WHERE r.rating_count <> 0 OR r.rating_sum <> 0
    ), '[]'::jsonb),
    'source_vote_count', (SELECT count(*) FROM private.recipe_rating_votes),
    'source_rating_count', (SELECT COALESCE(sum(r.rating_count),0) FROM public.recipes AS r),
    'source_rating_sum', (SELECT COALESCE(sum(r.rating_sum),0) FROM public.recipes AS r)
  );
$function$;
REVOKE ALL ON FUNCTION public.mdc_rating_migration_snapshot() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mdc_rating_migration_snapshot() TO service_role;
COMMIT;
NOTIFY pgrst, 'reload schema';
