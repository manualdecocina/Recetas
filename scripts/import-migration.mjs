import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

const file = process.argv[2] || "./migration-data.json";
const data = JSON.parse(fs.readFileSync(file, "utf8"));
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) throw new Error("Missing Supabase environment variables");
const supabase = createClient(url, key);

const recipes = data.recipes || [];
const pages = [
  ...(data.pages || []),
  ...(data.posts || []).filter(p => !new Set(recipes.map(r => r.source_post_id).filter(Boolean)).has(p.id))
];

for (let i = 0; i < recipes.length; i += 20) {
  const { error } = await supabase.from("recipes").upsert(recipes.slice(i, i + 20), { onConflict: "language,slug" });
  if (error) throw error;
  console.log("recipes", Math.min(i + 20, recipes.length), "/", recipes.length);
}
for (let i = 0; i < pages.length; i += 20) {
  const { error } = await supabase.from("content_pages").upsert(pages.slice(i, i + 20), { onConflict: "language,slug" });
  if (error) throw error;
  console.log("pages", Math.min(i + 20, pages.length), "/", pages.length);
}
console.log("MIGRATION_OK");