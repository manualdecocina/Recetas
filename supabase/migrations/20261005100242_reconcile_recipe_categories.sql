-- Reconciliación explícita de etiquetas. No publica ninguna receta ni cambia su grupo.
-- Pastas está autorizada por el usuario; Lumpias conserva Entrantes y aperitivos,
-- categoría documentada en el snapshot previo editorial/cinco-recetas-20261005.json.
with aliases(language, previous_label, canonical_label) as (values
  ('es', 'Sopas', 'Sopas y cremas'),
  ('es', 'Entrantes', 'Entrantes y aperitivos'),
  ('es', 'Desayunos', 'Desayunos y brunch'),
  ('en', 'Soups', 'Soups & creams'),
  ('en', 'Starters', 'Starters & appetizers'),
  ('en', 'Breakfast', 'Breakfast & brunch'),
  ('en', 'Breads and doughs', 'Breads & doughs'),
  ('de', 'Suppen', 'Suppen und Cremesuppen'),
  ('de', 'Suppen und Cremes', 'Suppen und Cremesuppen'),
  ('de', 'Frühstück', 'Frühstück und Brunch'),
  ('de', 'Brot und Teig', 'Brote und Teige'),
  ('fr', 'Soupes', 'Soupes et crèmes'),
  ('fr', 'Entrées', 'Entrées et apéritifs'),
  ('fr', 'Petits-déjeuners', 'Petit-déjeuner et brunch'),
  ('it', 'Zuppe', 'Zuppe e creme'),
  ('it', 'Colazioni', 'Colazione e brunch'),
  ('it', 'Piatti principali', 'Secondi piatti'),
  ('ja', 'スープ', 'スープ・ポタージュ'),
  ('ja', '前菜', '前菜・おつまみ'),
  ('ja', '朝食', '朝食・ブランチ'),
  ('ja', 'パン・生地', 'パン・生地料理'),
  ('ja', 'メイン料理', '主菜'),
  ('pt', 'Sopas', 'Sopas e cremes'),
  ('pt', 'Entradas', 'Entradas e aperitivos'),
  ('pt', 'Café da manhã', 'Café da manhã e brunch')
)
update public.recipes r set category = a.canonical_label
from aliases a
where r.published and r.language::text = a.language and r.category = a.previous_label;

-- Lista cerrada: texto libre en borradores no se convierte en una categoría pública.
-- Toda publicación, RPC o escritura SQL debe superar este control.
alter table public.recipes add constraint recipes_published_category_canonical
check (not published or (category is not null and case language::text
    when 'es' then category = any(array['Platos principales', 'Pastas', 'Entrantes y aperitivos', 'Sopas y cremas', 'Ensaladas', 'Guarniciones', 'Salsas y aderezos', 'Panes y masas', 'Postres', 'Desayunos y brunch', 'Bebidas'])
    when 'en' then category = any(array['Main dishes', 'Pasta', 'Starters & appetizers', 'Soups & creams', 'Salads', 'Side dishes', 'Sauces & dressings', 'Breads & doughs', 'Desserts', 'Breakfast & brunch', 'Drinks'])
    when 'de' then category = any(array['Hauptgerichte', 'Pasta', 'Vorspeisen', 'Suppen und Cremesuppen', 'Salate', 'Beilagen', 'Saucen und Dressings', 'Brote und Teige', 'Desserts', 'Frühstück und Brunch', 'Getränke'])
    when 'fr' then category = any(array['Plats principaux', 'Pâtes', 'Entrées et apéritifs', 'Soupes et crèmes', 'Salades', 'Accompagnements', 'Sauces et vinaigrettes', 'Pains et pâtes', 'Desserts', 'Petit-déjeuner et brunch', 'Boissons'])
    when 'it' then category = any(array['Secondi piatti', 'Pasta', 'Antipasti', 'Zuppe e creme', 'Insalate', 'Contorni', 'Salse e condimenti', 'Pane e impasti', 'Dolci', 'Colazione e brunch', 'Bevande'])
    when 'ja' then category = any(array['主菜', 'パスタ', '前菜・おつまみ', 'スープ・ポタージュ', 'サラダ', '付け合わせ', 'ソース・ドレッシング', 'パン・生地料理', 'デザート', '朝食・ブランチ', '飲み物'])
    when 'pt' then category = any(array['Pratos principais', 'Massas', 'Entradas e aperitivos', 'Sopas e cremes', 'Saladas', 'Acompanhamentos', 'Molhos e temperos', 'Pães e massas', 'Sobremesas', 'Café da manhã e brunch', 'Bebidas'])
    else false
  end));
