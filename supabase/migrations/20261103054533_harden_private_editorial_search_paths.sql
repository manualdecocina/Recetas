-- Harden only the 14 reviewed private editorial helpers; no grants or RLS changes.
ALTER FUNCTION "private"."tmp_fix_accents"(t text, lng text) SET search_path = '';
ALTER FUNCTION "private"."esc"(t text) SET search_path = '';
ALTER FUNCTION "private"."mkhtml"(s text, n text, esc boolean) SET search_path = '';
ALTER FUNCTION "private"."clean_if"(t text) SET search_path = '';
ALTER FUNCTION "private"."clean_es"(t text) SET search_path = '';
ALTER FUNCTION "private"."fix_pairs_apply"(t text) SET search_path = '';
ALTER FUNCTION "private"."clean_html"(h text) SET search_path = '';
ALTER FUNCTION "private"."split_s"(t text, lang text) SET search_path = '';
ALTER FUNCTION "private"."leaves"(j jsonb) SET search_path = '';
ALTER FUNCTION "private"."patch_es"(t text) SET search_path = '';
ALTER FUNCTION "private"."path_arr"(p text) SET search_path = '';
ALTER FUNCTION "private"."apply_jobs"(p_id uuid, p_col text, base jsonb) SET search_path = '';
ALTER FUNCTION "private"."fix_l10n"(lang text, t text) SET search_path = '';
ALTER FUNCTION "private"."fix_rainbow"(t text) SET search_path = '';
