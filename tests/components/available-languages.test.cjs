const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

const languages = ['es', 'de', 'ja', 'it', 'fr', 'en', 'pt'];
// Database order puts Japanese and Portuguese beyond the API's 1,000-row cap.
const rows = ['es', 'en', 'de', 'it', 'fr', 'ja', 'pt']
  .flatMap(language => Array.from({ length: 205 }, () => ({ language, published: true })));

function load(records, failedLanguage) {
  const supabase = {
    from(table) {
      assert.equal(table, 'recipes');
      let filtered = records;
      let selectedLanguage;
      const query = {
        select() { return query; },
        eq(key, value) {
          if (key === 'language') selectedLanguage = value;
          filtered = filtered.filter(row => row[key] === value);
          return query;
        },
        limit(count) {
          return Promise.resolve({ data: filtered.slice(0, Math.min(count, 1000)),
            error: selectedLanguage && selectedLanguage === failedLanguage ? { message: 'unavailable' } : null });
        },
      };
      return query;
    },
  };
  const source = fs.readFileSync('src/lib/md-data.ts', 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
  } }).outputText;
  const mod = { exports: {} };
  const requireMock = name => name === '@/lib/supabase/public' ? { supabase }
    : name === '@/types/recipe' ? { SUPPORTED_LANGUAGES: languages } : {};
  new Function('require', 'module', 'exports', js)(requireMock, mod, mod.exports);
  return mod.exports.getAvailableLanguages;
}

(async () => {
  assert.equal(rows.slice(0, 1000).some(row => row.language === 'ja'), false);
  assert.deepEqual(await load(rows)(), languages, 'all seven languages survive a 1,435-row catalog');
  const withoutPortuguese = rows.map(row => row.language === 'pt' ? { ...row, published: false } : row);
  assert.deepEqual(await load(withoutPortuguese)(), languages.filter(lang => lang !== 'pt'),
    'drafts cannot enable a language');
  assert.deepEqual(await load(rows, 'ja')(), languages.filter(lang => lang !== 'ja'),
    'a failed query must not disable unrelated languages');
  assert.deepEqual(await load([])(), [], 'an empty catalog has no available languages');
  console.log('OK available languages: API row cap, drafts, isolated errors and empty catalog');
})().catch(error => { console.error(error); process.exitCode = 1; });
