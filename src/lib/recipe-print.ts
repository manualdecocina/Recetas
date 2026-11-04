/** Content-only print model. It can also be rendered by a future book exporter.
 * Read the current recipe so interactive serving changes are reflected in print.
 * Never clone the page, advertising containers, or third-party HTML. */
export interface PrintableRecipe {
  title: string;
  excerpt: string;
  author: string;
  category: string;
  url: string;
  cover?: { src: string; alt: string };
  facts: Array<{ label: string; value: string }>;
  ingredientsHeading: string;
  ingredients: Array<{ group: string; text: string }>;
  preparationHeading: string;
  steps: Array<{ title: string; text: string }>;
  notesHeading: string;
  notes: Array<{ heading: boolean; text: string }>;
  nutrition?: { heading: string; serving: string; values: string[]; notes: string[] };
}

export const PRINT_ROOT_ID = 'md-recipe-print-root';

// Covers both known placements and unrelated hidden UI inside an editorial block.
const OMIT = 'script,style,iframe,ins,button,input,select,textarea,svg,video,[hidden],[aria-hidden="true"],.md-sr-only,.md-lightbox,.md-ad-slot,.google-auto-placed,.adsbygoogle-noablate,[data-ad-client],[data-ad-slot],[data-google-query-id],[id^="google_ads_iframe"],[id^="aswift_"],[role="dialog"]';

function omitted(element: Element): boolean {
  // A consent dialog can mark the whole site aria-hidden. That must not hide
  // the requested recipe; only omit controls/ads inside the recipe boundary.
  for (let node: Element | null = element; node && !node.matches('.md-article'); node = node.parentElement) {
    if (node.matches(OMIT)) return true;
  }
  return false;
}

function text(element: Element | null): string {
  if (!element || omitted(element)) return '';
  const copy = element.cloneNode(true) as Element;
  copy.querySelectorAll(OMIT).forEach(node => node.remove());
  return (copy.textContent ?? '').replace(/\s+/g, ' ').trim();
}

function readNotes(container: Element | null): PrintableRecipe['notes'] {
  const notes: PrintableRecipe['notes'] = [];
  let pending = '';
  const flush = () => {
    const value = pending.replace(/\s+/g, ' ').trim();
    if (value) notes.push({ heading: false, text: value });
    pending = '';
  };
  function visit(node: Node) {
    if (node.nodeType === 3) { pending += node.textContent ?? ''; return; }
    if (node.nodeType !== 1) return;
    const element = node as Element;
    if (omitted(element)) return;
    if (element.tagName === 'BR') { flush(); return; }
    if (/^(H[2-6]|P|LI|BLOCKQUOTE|PRE|SUMMARY|TR)$/.test(element.tagName)) {
      flush();
      const value = element.tagName === 'TR'
        ? Array.from(element.children).map(text).filter(Boolean).join(' · ')
        : text(element);
      if (value) notes.push({ heading: /^H[2-6]$/.test(element.tagName), text: value });
    } else element.childNodes.forEach(visit);
  }
  container?.childNodes.forEach(visit);
  flush();
  return notes;
}

export function readPrintableRecipe(article: Element, url: string): PrintableRecipe | null {
  const title = text(article.querySelector('.md-recipe-hero h1'));
  const ingredients = Array.from(article.querySelectorAll('.md-ingredient-checks > li')).map(item => ({
    group: text(item.querySelector('.md-ingredient-group')),
    text: text(item.querySelector('.md-ingredient-checkbox > span')),
  })).filter(item => item.text);
  const steps = Array.from(article.querySelectorAll('.md-step-list > li')).map(item => ({
    title: text(item.querySelector('.md-step-text h3')),
    text: text(item.querySelector('.md-step-text p')),
  })).filter(item => item.text);
  if (!title || !ingredients.length || !steps.length) return null;

  const cover = article.querySelector<HTMLImageElement>('.md-recipe-hero-photo img');
  const notes = readNotes(article.querySelector('.md-notes .md-rich'));
  const nutrition = article.querySelector('.md-nutrition');
  const calories = text(nutrition?.querySelector('.md-nutrition-cal strong') ?? null);
  return {
    title,
    excerpt: text(article.querySelector('.md-recipe-hero .md-lead')),
    author: text(article.querySelector('.md-byline [rel="author"]')),
    category: text(article.querySelector('.md-recipe-hero .md-eyebrow')),
    url,
    cover: cover ? { src: cover.currentSrc || cover.src, alt: cover.alt } : undefined,
    facts: Array.from(article.querySelectorAll('.md-recipe-fact')).map(item => ({
      label: text(item.querySelector('dt')), value: text(item.querySelector('dd')),
    })).filter(item => item.label && item.value),
    ingredientsHeading: text(article.querySelector('#md-ingredients-heading')),
    ingredients,
    preparationHeading: text(article.querySelector('#md-preparation-heading')),
    steps,
    notesHeading: text(article.querySelector('#md-notes-heading')),
    notes,
    nutrition: nutrition ? {
      heading: text(nutrition.querySelector('.md-title')),
      serving: text(nutrition.querySelector('.md-nutrition-serving')),
      values: [calories ? `${calories} kcal` : '', ...Array.from(nutrition.querySelectorAll('.md-nutrition-grid > div'))
        .map(item => `${text(item.querySelector('dt'))}: ${text(item.querySelector('dd'))}`)].filter(Boolean),
      notes: Array.from(nutrition.querySelectorAll('.md-nutrition-note,.md-nutrition-source')).map(text).filter(Boolean),
    } : undefined,
  };
}

function escape(value: string): string {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
}

function webUrl(value: string): string {
  try { const url = new URL(value); return /^(https?:)$/.test(url.protocol) ? url.href : ''; } catch { return ''; }
}

/** All editorial content is escaped, including notes: no embedded controls or ads. */
export function renderPrintableRecipe(recipe: PrintableRecipe): string {
  const coverUrl = recipe.cover && webUrl(recipe.cover.src);
  const url = webUrl(recipe.url);
  return `<div class="md-print-brandline"><img src="/brand/logo-manual-de-cocina.webp" alt="Manual de Cocina" width="640" height="188"><span>MANUAL DE COCINA</span></div>
<header class="md-print-header">
  ${coverUrl ? `<img class="md-print-cover" src="${escape(coverUrl)}" alt="${escape(recipe.cover!.alt)}">` : ''}
  ${recipe.category ? `<p class="md-print-category">${escape(recipe.category)}</p>` : ''}
  <h1>${url ? `<a href="${escape(url)}">${escape(recipe.title)}</a>` : escape(recipe.title)}</h1>
  ${recipe.excerpt ? `<p class="md-print-intro">${escape(recipe.excerpt)}</p>` : ''}
  ${recipe.author ? `<p class="md-print-author">${escape(recipe.author)}</p>` : ''}
</header>
${recipe.facts.length ? `<dl class="md-print-facts">${recipe.facts.map(fact => `<div><dt>${escape(fact.label)}</dt><dd>${escape(fact.value)}</dd></div>`).join('')}</dl>` : ''}
<section class="md-print-ingredients"><h2>${escape(recipe.ingredientsHeading)}</h2><ul>${recipe.ingredients.map(item => `<li>${item.group ? `<h3>${escape(item.group)}</h3>` : ''}<span>${escape(item.text)}</span></li>`).join('')}</ul></section>
<section class="md-print-method"><h2>${escape(recipe.preparationHeading)}</h2><ol>${recipe.steps.map((step, index) => `<li><h3><span>${index + 1}.</span> ${escape(step.title)}</h3><p>${escape(step.text)}</p></li>`).join('')}</ol></section>
${recipe.notes.length ? `<section class="md-print-notes"><h2>${escape(recipe.notesHeading)}</h2>${recipe.notes.map(note => `<${note.heading ? 'h3' : 'p'}>${escape(note.text)}</${note.heading ? 'h3' : 'p'}>`).join('')}</section>` : ''}
${recipe.nutrition?.values.length ? `<section class="md-print-nutrition"><h2>${escape(recipe.nutrition.heading)}</h2>${recipe.nutrition.serving ? `<p>${escape(recipe.nutrition.serving)}</p>` : ''}<p class="md-print-nutrients">${recipe.nutrition.values.map(escape).join(' · ')}</p>${recipe.nutrition.notes.map(note => `<p class="md-print-source">${escape(note)}</p>`).join('')}</section>` : ''}`;
}

export function prepareRecipePrint(document: Document): HTMLElement | null {
  const existing = document.getElementById(PRINT_ROOT_ID);
  if (existing) return existing;
  const article = document.querySelector('.md-article');
  if (!article) return null;
  const recipe = readPrintableRecipe(article, document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href || document.location.href);
  if (!recipe) return null;
  const root = document.createElement('article');
  root.id = PRINT_ROOT_ID;
  root.className = 'md-print-sheet';
  root.lang = document.documentElement.lang;
  root.setAttribute('data-print-template', 'recipe-v1');
  root.innerHTML = renderPrintableRecipe(recipe);
  document.body.append(root);
  return root;
}
