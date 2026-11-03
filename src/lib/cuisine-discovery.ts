import type { RecipeLanguage } from '@/types/recipe'
import { cuisineFilterLabel } from '@/lib/listing-filter-localization'

type CuisineRow = { recipe_group_id: string; cuisine: string | null }
const LANGS: RecipeLanguage[] = ['es', 'en', 'de', 'fr', 'it', 'ja', 'pt']
// Discovery groups classify the published editorial labels; Recipe.recipeCuisine
// retains the exact authored origin/adaptation wording in every language.
const GROUPS: Array<[string, string[]]> = [
  ['internacional', ['Internacional y casera', 'International & home cooking', 'International & Hausmannskost', 'Cuisine internationale et maison', 'Cucina internazionale e di casa', '世界の料理・家庭料理', 'Internacional e caseira']],
  ['colombiana', ['Cocina colombiana', 'Colombian cuisine', 'Kolumbianische Küche', 'Cuisine colombienne', 'Cucina colombiana', 'コロンビア料理', 'Cozinha colombiana']],
  ['italiana', ['Cocina e inspiración italiana', 'Italian & Italian-inspired', 'Italienische Küche & Inspiration', 'Cuisine et inspirations italiennes', 'Cucina e ispirazione italiana', 'イタリア料理・イタリア風', 'Cozinha e inspiração italiana']],
  ['espanola', ['Cocina e inspiración española', 'Spanish & Spanish-inspired', 'Spanische Küche & Inspiration', 'Cuisine et inspirations espagnoles', 'Cucina e ispirazione spagnola', 'スペイン料理・スペイン風', 'Cozinha e inspiração espanhola']],
  ['andaluza', ['Cocina andaluza', 'Andalusian cuisine', 'Andalusische Küche', 'Cuisine andalouse', 'Cucina andalusa', 'アンダルシア料理', 'Cozinha andaluza']],
  ['gallega', ['Cocina gallega', 'Galician cuisine', 'Galicische Küche', 'Cuisine galicienne', 'Cucina galiziana', 'ガリシア料理', 'Cozinha galega']],
  ['salmantina', ['Cocina salmantina', 'Salamanca cuisine', 'Küche aus Salamanca', 'Cuisine de Salamanque', 'Cucina di Salamanca', 'サラマンカ料理', 'Cozinha de Salamanca']],
  ['latinoamericana', ['Cocina latinoamericana', 'Latin American cuisine', 'Lateinamerikanische Küche', 'Cuisine latino-américaine', 'Cucina latinoamericana', 'ラテンアメリカ料理', 'Cozinha latino-americana']],
  ['mexicana', ['Cocina mexicana', 'Mexican cuisine', 'Mexikanische Küche', 'Cuisine mexicaine', 'Cucina messicana', 'メキシコ料理', 'Cozinha mexicana']],
  ['estadounidense', ['Cocina e inspiración estadounidense', 'American & American-inspired', 'US-Küche & Inspiration', 'Cuisine et inspirations américaines', 'Cucina e ispirazione statunitense', 'アメリカ料理・アメリカ風', 'Cozinha e inspiração dos Estados Unidos']],
  ['mediterranea', ['Cocina e inspiración mediterránea', 'Mediterranean & Mediterranean-inspired', 'Mediterrane Küche & Inspiration', 'Cuisine et inspirations méditerranéennes', 'Cucina e ispirazione mediterranea', '地中海料理・地中海風', 'Cozinha e inspiração mediterrânea']],
  ['japonesa', ['Cocina e inspiración japonesa', 'Japanese & Japanese-inspired', 'Japanische Küche & Inspiration', 'Cuisine et inspirations japonaises', 'Cucina e ispirazione giapponese', '日本料理・和風', 'Cozinha e inspiração japonesa']],
  ['francesa', ['Cocina e inspiración francesa', 'French & French-inspired', 'Französische Küche & Inspiration', 'Cuisine et inspirations françaises', 'Cucina e ispirazione francese', 'フランス料理・フランス風', 'Cozinha e inspiração francesa']],
  ['fusion', ['Cocina de fusión', 'Fusion cooking', 'Fusionsküche', 'Cuisine fusion', 'Cucina fusion', 'フュージョン料理', 'Cozinha de fusão']],
  ['alemana', ['Cocina alemana', 'German cuisine', 'Deutsche Küche', 'Cuisine allemande', 'Cucina tedesca', 'ドイツ料理', 'Cozinha alemã']],
  ['coreana', ['Cocina coreana', 'Korean cuisine', 'Koreanische Küche', 'Cuisine coréenne', 'Cucina coreana', '韓国料理', 'Cozinha coreana']],
  ['argentina', ['Cocina argentina', 'Argentine cuisine', 'Argentinische Küche', 'Cuisine argentine', 'Cucina argentina', 'アルゼンチン料理', 'Cozinha argentina']],
  ['brasilena', ['Cocina e inspiración brasileña', 'Brazilian & Brazilian-inspired', 'Brasilianische Küche & Inspiration', 'Cuisine et inspirations brésiliennes', 'Cucina e ispirazione brasiliana', 'ブラジル料理・ブラジル風', 'Cozinha e inspiração brasileira']],
  ['europea', ['Cocina e inspiración europea', 'European & European-inspired', 'Europäische Küche & Inspiration', 'Cuisine et inspirations européennes', 'Cucina e ispirazione europea', 'ヨーロッパ料理・ヨーロッパ風', 'Cozinha e inspiração europeia']],
  ['medio-oriente', ['Cocina e inspiración de Oriente Medio', 'Middle Eastern & Middle Eastern-inspired', 'Nahöstliche Küche & Inspiration', 'Cuisine et inspirations du Moyen-Orient', 'Cucina e ispirazione mediorientale', '中東料理・中東風', 'Cozinha e inspiração do Oriente Médio']],
  ['venezolana', ['Cocina venezolana', 'Venezuelan cuisine', 'Venezolanische Küche', 'Cuisine vénézuélienne', 'Cucina venezuelana', 'ベネズエラ料理', 'Cozinha venezuelana']],
  ['asiatica', ['Cocina asiática', 'Asian cuisine', 'Asiatische Küche', 'Cuisine asiatique', 'Cucina asiatica', 'アジア料理', 'Cozinha asiática']],
  ['britanica', ['Cocina e inspiración británica', 'British & British-inspired', 'Britische Küche & Inspiration', 'Cuisine et inspirations britanniques', 'Cucina e ispirazione britannica', 'イギリス料理・イギリス風', 'Cozinha e inspiração britânica']],
  ['tailandesa', ['Cocina tailandesa', 'Thai cuisine', 'Thailändische Küche', 'Cuisine thaïlandaise', 'Cucina thailandese', 'タイ料理', 'Cozinha tailandesa']],
  ['tex-mex', ['Cocina Tex-Mex', 'Tex-Mex cuisine', 'Tex-Mex-Küche', 'Cuisine tex-mex', 'Cucina tex-mex', 'テクス・メクス料理', 'Cozinha Tex-Mex']],
  ['india', ['Inspiración india', 'Indian-inspired cooking', 'Indisch inspirierte Küche', 'Inspirations indiennes', 'Ispirazione indiana', 'インド風料理', 'Inspiração indiana']],
  ['filipina', ['Cocina filipina', 'Filipino cuisine', 'Philippinische Küche', 'Cuisine philippine', 'Cucina filippina', 'フィリピン料理', 'Cozinha filipina']],
  ['china', ['Cocina e inspiración china', 'Chinese & Chinese-inspired', 'Chinesische Küche & Inspiration', 'Cuisine et inspirations chinoises', 'Cucina e ispirazione cinese', '中国料理・中国風', 'Cozinha e inspiração chinesa']],
  ['sueca', ['Cocina sueca', 'Swedish cuisine', 'Schwedische Küche', 'Cuisine suédoise', 'Cucina svedese', 'スウェーデン料理', 'Cozinha sueca']],
  ['judia', ['Inspiración de la tradición judía', 'Jewish-inspired cooking', 'Jüdisch inspirierte Küche', 'Inspirations de la tradition juive', 'Ispirazione della tradizione ebraica', 'ユダヤ料理に着想を得た料理', 'Inspiração da tradição judaica']],
  ['indonesia', ['Cocina indonesia', 'Indonesian cuisine', 'Indonesische Küche', 'Cuisine indonésienne', 'Cucina indonesiana', 'インドネシア料理', 'Cozinha indonésia']],
  ['puertorriquena', ['Inspiración puertorriqueña', 'Puerto Rican-inspired cooking', 'Puerto-ricanisch inspirierte Küche', 'Inspirations portoricaines', 'Ispirazione portoricana', 'プエルトリコ風料理', 'Inspiração porto-riquenha']],
  ['peruana', ['Cocina peruana', 'Peruvian cuisine', 'Peruanische Küche', 'Cuisine péruvienne', 'Cucina peruviana', 'ペルー料理', 'Cozinha peruana']],
  ['rusa', ['Ensalada de inspiración rusa', 'Russian-inspired salad', 'Russisch inspirierter Salat', 'Salade d’inspiration russe', 'Insalata di ispirazione russa', 'ロシア風サラダ', 'Salada de inspiração russa']],
  ['australia-nueva-zelanda', ['Australia y Nueva Zelanda', 'Australia & New Zealand', 'Australien & Neuseeland', 'Australie et Nouvelle-Zélande', 'Australia e Nuova Zelanda', 'オーストラリア・ニュージーランド', 'Austrália e Nova Zelândia']],
  ['griega', ['Inspiración griega', 'Greek-inspired cooking', 'Griechisch inspirierte Küche', 'Inspirations grecques', 'Ispirazione greca', 'ギリシャ風料理', 'Inspiração grega']],
  ['hong-kong', ['Cocina de Hong Kong', 'Hong Kong cuisine', 'Hongkonger Küche', 'Cuisine de Hong Kong', 'Cucina di Hong Kong', '香港料理', 'Cozinha de Hong Kong']],
]

const ALIASES: Record<string, string[]> = {
  'Internacional': ['internacional'], 'Casera': ['internacional'], 'Cocina casera': ['internacional'],
  'Colombiana': ['colombiana'], 'Colombiana, antioqueña': ['colombiana'], 'Colombiana, Valle del Cauca': ['colombiana'], 'Colombiana, postre de fusión': ['colombiana', 'fusion'], 'Colombiana, Caribe': ['colombiana'], 'Colombiana, Santa Rosa de Cabal': ['colombiana'],
  'Italiana': ['italiana'], 'Inspiración italiana': ['italiana'], 'Italiana, adaptación casera': ['italiana'], 'Italiana inspirada': ['italiana'],
  'Española': ['espanola'], 'Inspiración española': ['espanola'], 'Española, adaptación en freidora de aire': ['espanola'], 'Andaluza': ['espanola', 'andaluza'], 'Gallega, España': ['espanola', 'gallega'], 'Salmantina': ['espanola', 'salmantina'],
  'Latinoamericana': ['latinoamericana'], 'Mexicana': ['mexicana'], 'Mexicana, horchata de arroz': ['mexicana'],
  'Estadounidense': ['estadounidense'], 'Americana': ['estadounidense'], 'Inspiración estadounidense': ['estadounidense'], 'Inspiración del sur de Estados Unidos': ['estadounidense'],
  'Estadounidense de inspiración italiana': ['estadounidense', 'italiana'], 'Italoamericana': ['estadounidense', 'italiana'],
  'Mediterránea': ['mediterranea'], 'Inspiración mediterránea': ['mediterranea'],
  'Japonesa': ['japonesa'], 'Inspiración japonesa, Osaka': ['japonesa'],
  'Francesa': ['francesa'], 'Francesa, Saboya': ['francesa'], 'Inspiración francesa': ['francesa'],
  'Fusión': ['fusion'], 'Fusión italo-latina': ['fusion', 'italiana', 'latinoamericana'],
  'Alemana': ['alemana'], 'Coreana': ['coreana'], 'Argentina': ['argentina'],
  'Brasileña': ['brasilena'], 'Brasileña, adaptación casera': ['brasilena'], 'Inspiración brasileña': ['brasilena'],
  'Europea': ['europea'], 'Inspiración europea': ['europea'],
  'Medio Oriente': ['medio-oriente'], 'Inspiración de Oriente Medio': ['medio-oriente'],
  'Venezolana': ['venezolana'], 'Asiática': ['asiatica'], 'Británica': ['britanica'], 'Inspiración británica': ['britanica'],
  'Tailandesa': ['tailandesa'], 'Tailandesa, adaptación casera': ['tailandesa'], 'Tex-Mex': ['tex-mex'],
  'Inspiración india': ['india'], 'Filipina, adaptación casera': ['filipina'],
  'Chinoamericana': ['china', 'estadounidense'], 'Inspiración chino-estadounidense': ['china', 'estadounidense'],
  'Sueca': ['sueca'], 'Inspiración de la tradición judía': ['judia'], 'Indonesia': ['indonesia'],
  'Inspiración puertorriqueña': ['puertorriquena'], 'Peruana': ['peruana'],
  'Versión casera de ensalada rusa': ['rusa'], 'Australia y Nueva Zelanda': ['australia-nueva-zelanda'],
  'Inspiración griega': ['griega'], 'Hong Kong': ['hong-kong'],
}
const fold = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').trim().toLowerCase()
const aliases = new Map(Object.entries(ALIASES).map(([name, groups]) => [fold(name), groups]))

export function cuisineDiscoverySlugs(label: string | null): string[] {
  return (aliases.get(fold(label ?? '')) ?? []).map(group => 'cocina-' + group)
}

export function cuisineDiscoveryGroupIds(rows: CuisineRow[], slug: string): string[] {
  return [...new Set(rows.filter(row => cuisineDiscoverySlugs(row.cuisine).includes(slug)).map(row => row.recipe_group_id))]
}

export function cuisineDiscoveryOptions(lang: RecipeLanguage, rows: CuisineRow[], legacy: Array<{ slug: string; name: string }>) {
  const used = new Set(rows.flatMap(row => cuisineDiscoverySlugs(row.cuisine)))
  const options = new Map(legacy.map(item => [item.slug, { value: item.slug, label: cuisineFilterLabel(lang, item.slug, item.name) }]))
  for (const [group, labels] of GROUPS) {
    const slug = 'cocina-' + group
    if (used.has(slug)) options.set(slug, { value: slug, label: labels[LANGS.indexOf(lang)] })
  }
  return [...options.values()].sort((a, b) => a.label.localeCompare(b.label, lang))
}
