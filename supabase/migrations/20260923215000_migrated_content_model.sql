-- Manual de Cocina: migrated content model
alter table public.recipes
  add column if not exists content_html text,
  add column if not exists summary text,
  add column if not exists notes text,
  add column if not exists difficulty text,
  add column if not exists course text,
  add column if not exists cuisine text,
  add column if not exists total_time_minutes integer,
  add column if not exists keywords text[],
  add column if not exists nutrition jsonb,
  add column if not exists gallery jsonb not null default '[]'::jsonb,
  add column if not exists video_urls jsonb not null default '[]'::jsonb,
  add column if not exists seo jsonb not null default '{}'::jsonb,
  add column if not exists source_post_id integer,
  add column if not exists source_url text;

alter table public.recipes
  alter column recipe_group_id set default gen_random_uuid();

create unique index if not exists recipes_language_slug_uq on public.recipes(language, slug);
create index if not exists recipes_source_post_id_idx on public.recipes(source_post_id);

create table if not exists public.content_pages (
  id uuid primary key default gen_random_uuid(),
  language text not null check (language in ('es','de','ja','it','fr','en')),
  content_group_id uuid,
  slug text not null,
  title text not null,
  excerpt text,
  content_html text,
  featured_image_url text,
  seo jsonb not null default '{}'::jsonb,
  source_post_id integer,
  source_url text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(language, slug)
);

create table if not exists public.content_redirects (
  id uuid primary key default gen_random_uuid(),
  source_path text not null unique,
  target_path text not null,
  status_code integer not null default 301 check (status_code in (301,302,307,308)),
  created_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  source_attachment_id integer unique,
  source_url text,
  url text,
  title text,
  alt_text text,
  created_at timestamptz not null default now()
);

alter table public.content_pages enable row level security;
alter table public.content_redirects enable row level security;
alter table public.media_assets enable row level security;

drop policy if exists "public read content pages" on public.content_pages;
create policy "public read content pages" on public.content_pages for select using (published = true);

drop policy if exists "public read redirects" on public.content_redirects;
create policy "public read redirects" on public.content_redirects for select using (true);

drop policy if exists "public read media" on public.media_assets;
create policy "public read media" on public.media_assets for select using (true);