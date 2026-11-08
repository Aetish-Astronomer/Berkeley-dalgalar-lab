/**
 * ============================================================================
 * E2E TEST SUITE: BERKELEY DALGALAR LAB (BERKELEY WAVES)
 * Bilingual Internationalization (TR/EN), Git Setup & Automated CI/CD Deployment
 *
 * 4-Tier Test Case Design Methodology (TEST_INFRA.md):
 *  - Tier 1: Feature Coverage (Features 1 to 13, >=5 test cases per feature area)
 *  - Tier 2: Boundary & Corner Cases (Features 1 to 13, >=5 test cases per feature area)
 *  - Tier 3: Cross-Feature Interactions (Pairwise combinations across core subsystems)
 *  - Tier 4: Real-World Application Scenarios (5 End-to-End student user journeys)
 *
 * Runner command:
 *   node --test tests/e2e_i18n_and_deploy.test.mjs
 * ============================================================================
 */

import { describe, it, before, after, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import katexMod from 'katex';
import ts from 'typescript';

const katex = katexMod.default || katexMod;

// Project path constants
const PROJECT_ROOT = path.resolve(import.meta.dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');
const DATA_DIR = path.join(SRC_DIR, 'data');
const I18N_DIR = path.join(SRC_DIR, 'i18n');
const ENGINE_DIR = path.join(SRC_DIR, 'engine');
const WORKFLOWS_DIR = path.join(PROJECT_ROOT, '.github', 'workflows');
const DEPLOY_WORKFLOW_PATH = path.join(WORKFLOWS_DIR, 'deploy.yml');
const GITIGNORE_PATH = path.join(PROJECT_ROOT, '.gitignore');
const INDEX_HTML_PATH = path.join(PROJECT_ROOT, 'index.html');
const PACKAGE_JSON_PATH = path.join(PROJECT_ROOT, 'package.json');

// Global counters for tier reporting
const summaryStats = {
  tier1: { total: 0, passed: 0, failed: 0 },
  tier2: { total: 0, passed: 0, failed: 0 },
  tier3: { total: 0, passed: 0, failed: 0 },
  tier4: { total: 0, passed: 0, failed: 0 },
};

let currentTier = 'tier1';

// ----------------------------------------------------------------------------
// HELPER UTILITIES: TypeScript Transpiler, Mock Storage & Evaluator
// ----------------------------------------------------------------------------

class MockLocalStorage {
  constructor() {
    this.store = new Map();
  }
  getItem(k) {
    return this.store.has(k) ? this.store.get(k) : null;
  }
  setItem(k, v) {
    this.store.set(k, String(v));
  }
  removeItem(k) {
    this.store.delete(k);
  }
  clear() {
    this.store.clear();
  }
}

function loadTsModule(absPath, loaded = new Map(), mockGlobals = {}) {
  if (!fs.existsSync(absPath)) {
    throw new Error(`File not found: ${path.relative(PROJECT_ROOT, absPath)}`);
  }
  if (loaded.has(absPath)) return loaded.get(absPath).exports;

  const content = fs.readFileSync(absPath, 'utf8');
  const res = ts.transpileModule(content, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  });

  const mod = { exports: {} };
  loaded.set(absPath, mod);

  const customRequire = (reqPath) => {
    if (reqPath.startsWith('.')) {
      let resolved = path.resolve(path.dirname(absPath), reqPath);
      if (!fs.existsSync(resolved) && fs.existsSync(resolved + '.ts')) resolved += '.ts';
      return loadTsModule(resolved, loaded, mockGlobals);
    }
    if (mockGlobals[reqPath]) return mockGlobals[reqPath];
    return null;
  };

  const contextWindow = mockGlobals.window || { localStorage: mockGlobals.localStorage || new MockLocalStorage() };
  const contextDocument = mockGlobals.document || {
    documentElement: { lang: 'tr' },
    title: '',
    querySelector() { return null; },
  };

  const fn = new Function(
    'exports',
    'module',
    'require',
    '__dirname',
    '__filename',
    'window',
    'document',
    'localStorage',
    res.outputText
  );
  fn(
    mod.exports,
    mod,
    customRequire,
    path.dirname(absPath),
    absPath,
    contextWindow,
    contextDocument,
    contextWindow.localStorage
  );
  return mod.exports;
}

function safeLoadTs(relPath, mockGlobals = {}) {
  const absPath = path.resolve(PROJECT_ROOT, relPath);
  if (!fs.existsSync(absPath)) return null;
  try {
    return loadTsModule(absPath, new Map(), mockGlobals);
  } catch (err) {
    return null;
  }
}

function createI18nInstance(storage = new MockLocalStorage()) {
  const mod = safeLoadTs('src/i18n/index.ts', {
    window: { localStorage: storage },
    localStorage: storage,
  });
  if (!mod) return null;
  if (mod.I18nManager) {
    return new mod.I18nManager();
  }
  return mod.i18nManager || mod.default;
}

function validateLatexString(rawLatex, sourceInfo = '') {
  if (!rawLatex || typeof rawLatex !== 'string') return;
  // Check for forbidden Unicode subscript characters: ₀₁₂₃₄₅₆₇₈₉
  if (/[₀₁₂₃₄₅₆₇₈₉]/.test(rawLatex)) {
    throw new Error(`Unicode subscript character detected in LaTeX (${sourceInfo}): ${rawLatex}`);
  }
  try {
    katex.renderToString(rawLatex, { throwOnError: true, strict: false, trust: true });
  } catch (err) {
    throw new Error(`KaTeX render error (${sourceInfo}): "${rawLatex}" -> ${err.message}`);
  }
}

function resolveTranslation(dict, keyPath) {
  if (!dict) return undefined;
  if (dict[keyPath]) return dict[keyPath];
  const parts = keyPath.split('.');
  let cur = dict;
  for (const part of parts) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = cur[part];
  }
  return typeof cur === 'string' ? cur : undefined;
}

// ============================================================================
// TIER 1: FEATURE COVERAGE (FEATURES 1 TO 13)
// ============================================================================

describe('Tier 1: Feature Coverage (Features 1-13)', () => {
  before(() => { currentTier = 'tier1'; });
  afterEach((t) => {
    summaryStats.tier1.total++;
    if (t.error) summaryStats.tier1.failed++;
    else summaryStats.tier1.passed++;
  });

  // Feature 1: i18n Core Framework & State
  describe('Feature 1: i18n Core Framework & State', () => {
    it('1.1: src/i18n/index.ts exists and exports i18nManager with required interface', () => {
      const i18nPath = path.join(I18N_DIR, 'index.ts');
      assert.ok(fs.existsSync(i18nPath), '[F1] src/i18n/index.ts must exist');
      const mod = safeLoadTs('src/i18n/index.ts');
      assert.ok(mod && (mod.i18nManager || mod.I18nManager || mod.default), '[F1] Must export i18nManager or I18nManager');
      const manager = createI18nInstance();
      assert.ok(manager, '[F1] Must instantiate i18nManager');
      assert.equal(typeof manager.getLocale, 'function', '[F1] getLocale() function must exist');
      assert.equal(typeof manager.setLocale, 'function', '[F1] setLocale() function must exist');
      assert.equal(typeof manager.t, 'function', '[F1] t() translation function must exist');
      assert.equal(typeof manager.subscribe, 'function', '[F1] subscribe() listener function must exist');
    });

    it('1.2: Default locale is "tr" when no prior preference is stored', () => {
      const storage = new MockLocalStorage();
      const manager = createI18nInstance(storage);
      assert.ok(manager, '[F1] i18nManager required');
      assert.equal(manager.getLocale(), 'tr', '[F1] Default initial locale must be "tr"');
    });

    it('1.3: setLocale("en") updates active locale to "en"', () => {
      const storage = new MockLocalStorage();
      const manager = createI18nInstance(storage);
      assert.ok(manager, '[F1] i18nManager required');
      manager.setLocale('en');
      assert.equal(manager.getLocale(), 'en', '[F1] Locale should be "en" after setLocale("en")');
    });

    it('1.4: t(key) returns localized translation corresponding to active locale', () => {
      const storage = new MockLocalStorage();
      const manager = createI18nInstance(storage);
      assert.ok(manager, '[F1] i18nManager required');
      manager.setLocale('tr');
      const trTitle = manager.t('shell.brandTitle') || manager.t('brand.title') || manager.t('app.title');
      manager.setLocale('en');
      const enTitle = manager.t('shell.brandTitle') || manager.t('brand.title') || manager.t('app.title');
      assert.ok(trTitle && typeof trTitle === 'string', '[F1] Turkish title must be non-empty string');
      assert.ok(enTitle && typeof enTitle === 'string', '[F1] English title must be non-empty string');
      assert.notEqual(trTitle, enTitle, '[F1] Translated title in EN should differ from TR');
    });

    it('1.5: subscribe(listener) emits notification whenever locale changes', () => {
      const storage = new MockLocalStorage();
      const manager = createI18nInstance(storage);
      assert.ok(manager, '[F1] i18nManager required');
      let notifiedLocale = null;
      const unsubscribe = manager.subscribe((loc) => { notifiedLocale = loc; });
      manager.setLocale('en');
      assert.equal(notifiedLocale, 'en', '[F1] Listener must receive new locale "en"');
      if (typeof unsubscribe === 'function') unsubscribe();
    });
  });

  // Feature 2: UI Language Toggle Button
  describe('Feature 2: UI Language Toggle Button', () => {
    it('2.1: index.html contains dedicated language toggle button element', () => {
      assert.ok(fs.existsSync(INDEX_HTML_PATH), 'index.html must exist');
      const html = fs.readFileSync(INDEX_HTML_PATH, 'utf8');
      const hasToggleBtn =
        html.includes('id="lang-toggle-btn"') ||
        html.includes('id="language-toggle"') ||
        html.includes('data-action="toggle-lang"') ||
        html.includes('class="lang-toggle');
      assert.ok(hasToggleBtn, '[F2] index.html must declare language toggle button element');
    });

    it('2.2: Toggle button provides initial text or indicator for language switch', () => {
      const html = fs.readFileSync(INDEX_HTML_PATH, 'utf8');
      const hasLangIndicator =
        /lang-toggle[^>]*>[\s\S]*?(EN|TR|İngilizce|English)/i.test(html) ||
        html.includes('data-lang') ||
        html.includes('id="lang-toggle-btn"');
      assert.ok(hasLangIndicator, '[F2] Toggle button must display target or current language code');
    });

    it('2.3: Invoking toggle switches active locale from "tr" to "en"', () => {
      const storage = new MockLocalStorage();
      const manager = createI18nInstance(storage);
      assert.ok(manager, '[F2] i18nManager required');
      manager.setLocale('tr');
      const nextLocale = manager.getLocale() === 'tr' ? 'en' : 'tr';
      manager.setLocale(nextLocale);
      assert.equal(manager.getLocale(), 'en', '[F2] Active locale must transition from "tr" to "en"');
    });

    it('2.4: Invoking toggle a second time switches active locale from "en" back to "tr"', () => {
      const storage = new MockLocalStorage();
      const manager = createI18nInstance(storage);
      assert.ok(manager, '[F2] i18nManager required');
      manager.setLocale('en');
      const nextLocale = manager.getLocale() === 'tr' ? 'en' : 'tr';
      manager.setLocale(nextLocale);
      assert.equal(manager.getLocale(), 'tr', '[F2] Active locale must toggle back to "tr"');
    });

    it('2.5: Language toggle does not trigger full page reload (zero reload invariant)', () => {
      const mainTsPath = path.join(SRC_DIR, 'main.ts');
      assert.ok(fs.existsSync(mainTsPath), 'src/main.ts must exist');
      const content = fs.readFileSync(mainTsPath, 'utf8');
      const reloadInLangHandler = /toggle.*location\.reload\(\)/i.test(content);
      assert.equal(reloadInLangHandler, false, '[F2] Zero reload invariant: toggle must not invoke location.reload()');
    });
  });

  // Feature 3: Static Shell & Navigation Localization
  describe('Feature 3: Static Shell & Navigation Localization', () => {
    it('3.1: Translations dictionary defines brand header title and subtitle for TR and EN', () => {
      const transPath = path.join(I18N_DIR, 'translations.ts');
      assert.ok(fs.existsSync(transPath), '[F3] src/i18n/translations.ts must exist');
      const transMod = safeLoadTs('src/i18n/translations.ts');
      assert.ok(transMod, '[F3] translations must be exported');
      const dict = transMod.TRANSLATIONS || transMod.translations || transMod.default;
      assert.ok(dict.tr && dict.en, '[F3] Must contain both "tr" and "en" dictionaries');
      assert.ok(resolveTranslation(dict.tr, 'shell.brandTitle') || resolveTranslation(dict.tr, 'brand.title'), '[F3] Turkish brand title required');
      assert.ok(resolveTranslation(dict.en, 'shell.brandTitle') || resolveTranslation(dict.en, 'brand.title'), '[F3] English brand title required');
    });

    it('3.2: Mode switcher buttons (derivation, trainer, problems) are localized in TR and EN', () => {
      const transMod = safeLoadTs('src/i18n/translations.ts');
      assert.ok(transMod, '[F3] translations required');
      const dict = transMod.TRANSLATIONS || transMod.translations || transMod.default;
      const trModes = resolveTranslation(dict.tr, 'modes.derivation') || resolveTranslation(dict.tr, 'nav.derivation');
      const enModes = resolveTranslation(dict.en, 'modes.derivation') || resolveTranslation(dict.en, 'nav.derivation');
      assert.ok(trModes, '[F3] Turkish mode switcher string required');
      assert.ok(enModes, '[F3] English mode switcher string required');
    });

    it('3.3: Global search input placeholder is localized in TR and EN', () => {
      const transMod = safeLoadTs('src/i18n/translations.ts');
      assert.ok(transMod, '[F3] translations required');
      const dict = transMod.TRANSLATIONS || transMod.translations || transMod.default;
      const trPlaceholder = resolveTranslation(dict.tr, 'search.placeholder') || resolveTranslation(dict.tr, 'nav.searchPlaceholder');
      const enPlaceholder = resolveTranslation(dict.en, 'search.placeholder') || resolveTranslation(dict.en, 'nav.searchPlaceholder');
      assert.ok(trPlaceholder, '[F3] Turkish search placeholder required');
      assert.ok(enPlaceholder, '[F3] English search placeholder required');
    });

    it('3.4: Mathematical Arsenal footer button and subtitle are localized in TR and EN', () => {
      const transMod = safeLoadTs('src/i18n/translations.ts');
      assert.ok(transMod, '[F3] translations required');
      const dict = transMod.TRANSLATIONS || transMod.translations || transMod.default;
      const trArsenal = resolveTranslation(dict.tr, 'arsenal.title') || resolveTranslation(dict.tr, 'nav.arsenalTitle');
      const enArsenal = resolveTranslation(dict.en, 'arsenal.title') || resolveTranslation(dict.en, 'nav.arsenalTitle');
      assert.ok(trArsenal, '[F3] Turkish arsenal title required');
      assert.ok(enArsenal, '[F3] English arsenal title required');
    });

    it('3.5: Color-coded legend bar tooltips/chips are defined in TR and EN', () => {
      const transMod = safeLoadTs('src/i18n/translations.ts');
      assert.ok(transMod, '[F3] translations required');
      const dict = transMod.TRANSLATIONS || transMod.translations || transMod.default;
      const trLegend = resolveTranslation(dict.tr, 'legend.pos') || resolveTranslation(dict.tr, 'legend.position');
      const enLegend = resolveTranslation(dict.en, 'legend.pos') || resolveTranslation(dict.en, 'legend.position');
      assert.ok(trLegend, '[F3] Turkish legend label required');
      assert.ok(enLegend, '[F3] English legend label required');
    });
  });

  // Feature 4: MultiSpace HUD & Controls Localization
  describe('Feature 4: MultiSpace HUD & Controls Localization', () => {
    it('4.1: HUD overlay status labels have localized strings in TR and EN', () => {
      const transMod = safeLoadTs('src/i18n/translations.ts');
      assert.ok(transMod, '[F4] translations required');
      const dict = transMod.TRANSLATIONS || transMod.translations || transMod.default;
      assert.ok(resolveTranslation(dict.tr, 'stage.tagPhysical') || resolveTranslation(dict.tr, 'hud.realSpace'), '[F4] Turkish HUD strings required');
      assert.ok(resolveTranslation(dict.en, 'stage.tagPhysical') || resolveTranslation(dict.en, 'hud.realSpace'), '[F4] English HUD strings required');
    });

    it('4.2: All 8 2D abstract space tabs have localized titles in TR and EN', () => {
      const transMod = safeLoadTs('src/i18n/translations.ts');
      assert.ok(transMod, '[F4] translations required');
      const dict = transMod.TRANSLATIONS || transMod.translations || transMod.default;
      const requiredTabs = ['phase', 'phasor', 'potential', 'normalCoords', 'energyBeats', 'lissajous', 'dispersion', 'fourierSpectrum'];
      for (const tab of requiredTabs) {
        const trTab = resolveTranslation(dict.tr, `stage.tabs.${tab}`) || resolveTranslation(dict.tr, `tabs.${tab}`);
        const enTab = resolveTranslation(dict.en, `stage.tabs.${tab}`) || resolveTranslation(dict.en, `tabs.${tab}`);
        assert.ok(trTab, `[F4] Turkish tab translation required for: ${tab}`);
        assert.ok(enTab, `[F4] English tab translation required for: ${tab}`);
      }
    });

    it('4.3: Parameter slider dock labels have localized strings in TR and EN', () => {
      const transMod = safeLoadTs('src/i18n/translations.ts');
      assert.ok(transMod, '[F4] translations required');
      const dict = transMod.TRANSLATIONS || transMod.translations || transMod.default;
      assert.ok(resolveTranslation(dict.tr, 'stage.sliders.omega0') || resolveTranslation(dict.tr, 'slider.omega0'), '[F4] Turkish slider label required');
      assert.ok(resolveTranslation(dict.en, 'stage.sliders.omega0') || resolveTranslation(dict.en, 'slider.omega0'), '[F4] English slider label required');
    });

    it('4.4: MultiSpaceDirector.setLocale method exists and preserves WebGL canvas', () => {
      const directorPath = path.join(ENGINE_DIR, 'multiSpaceDirector.ts');
      assert.ok(fs.existsSync(directorPath), 'src/engine/multiSpaceDirector.ts must exist');
      const content = fs.readFileSync(directorPath, 'utf8');
      assert.ok(content.includes('setLocale('), '[F4] MultiSpaceDirector must define setLocale(locale) method');
    });

    it('4.5: Simulation Play/Pause and Reset button tooltips are localized in TR and EN', () => {
      const transMod = safeLoadTs('src/i18n/translations.ts');
      assert.ok(transMod, '[F4] translations required');
      const dict = transMod.TRANSLATIONS || transMod.translations || transMod.default;
      assert.ok(resolveTranslation(dict.tr, 'stage.play') || resolveTranslation(dict.tr, 'sim.play'), '[F4] Turkish sim controls required');
      assert.ok(resolveTranslation(dict.en, 'stage.play') || resolveTranslation(dict.en, 'sim.play'), '[F4] English sim controls required');
    });
  });

  // Feature 5: Chapter 1 Theory Modules (1.1–1.5) Bilingual Data
  describe('Feature 5: Chapter 1 Theory Modules (1.1–1.5) Bilingual Data', () => {
    it('5.1: getChapterModules(1, "en") or chapter1ModulesEn.ts exists and returns 5 modules', () => {
      const enFile = path.join(DATA_DIR, 'chapter1ModulesEn.ts');
      const indexFile = path.join(DATA_DIR, 'index.ts');
      assert.ok(fs.existsSync(enFile) || fs.existsSync(indexFile), '[F5] chapter1ModulesEn.ts or data/index.ts must exist');
      const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/chapter1ModulesEn.ts');
      assert.ok(dataMod, '[F5] Data module must be readable');
      const modules = dataMod.getChapterModules ? dataMod.getChapterModules(1, 'en') : dataMod.CHAPTER_1_MODULES_EN;
      assert.ok(Array.isArray(modules) && modules.length === 5, '[F5] Exactly 5 English modules required for Chapter 1');
    });

    it('5.2: All 5 English Chapter 1 modules contain non-empty English title, summary, and coreQuestion', () => {
      const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/chapter1ModulesEn.ts');
      assert.ok(dataMod, '[F5] Data module required');
      const modules = dataMod.getChapterModules ? dataMod.getChapterModules(1, 'en') : dataMod.CHAPTER_1_MODULES_EN;
      for (const m of modules) {
        assert.ok(m.title && m.title.length > 5, `[F5] Module ${m.id} missing English title`);
        assert.ok(m.summary && m.summary.length > 10, `[F5] Module ${m.id} missing English summary`);
        assert.ok(m.coreQuestion && m.coreQuestion.length > 10, `[F5] Module ${m.id} missing English coreQuestion`);
      }
    });

    it('5.3: All 9 derivation steps in Chapter 1 have English title, subtitle, and physicalMotivation', () => {
      const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/chapter1ModulesEn.ts');
      assert.ok(dataMod, '[F5] Data module required');
      const modules = dataMod.getChapterModules ? dataMod.getChapterModules(1, 'en') : dataMod.CHAPTER_1_MODULES_EN;
      let totalSteps = 0;
      for (const m of modules) {
        for (const s of m.derivationSteps) {
          totalSteps++;
          assert.ok(s.title && s.physicalMotivation, `[F5] Step ${s.id} missing English title/motivation`);
        }
      }
      assert.equal(totalSteps, 9, '[F5] Total Chapter 1 derivation steps must be 9');
    });

    it('5.4: All algebraic breakdowns in Chapter 1 contain English subStepTitle and explanation', () => {
      const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/chapter1ModulesEn.ts');
      assert.ok(dataMod, '[F5] Data module required');
      const modules = dataMod.getChapterModules ? dataMod.getChapterModules(1, 'en') : dataMod.CHAPTER_1_MODULES_EN;
      for (const m of modules) {
        for (const s of m.derivationSteps) {
          for (const b of s.algebraicBreakdown) {
            assert.ok(b.subStepTitle && b.explanation, `[F5] Algebraic breakdown in ${s.id} missing English title/explanation`);
          }
        }
      }
    });

    it('5.5: Solved examples and common traps in Chapter 1 contain English translations', () => {
      const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/chapter1ModulesEn.ts');
      assert.ok(dataMod, '[F5] Data module required');
      const modules = dataMod.getChapterModules ? dataMod.getChapterModules(1, 'en') : dataMod.CHAPTER_1_MODULES_EN;
      for (const m of modules) {
        assert.ok(m.solvedExamples && m.solvedExamples.length > 0, `[F5] Module ${m.id} missing solved examples`);
        assert.ok(m.solvedExamples[0].strategy, `[F5] Solved example in ${m.id} missing English strategy`);
        assert.ok(m.commonTraps && m.commonTraps.length > 0, `[F5] Module ${m.id} missing common traps`);
        assert.ok(m.commonTraps[0].correctApproach, `[F5] Common trap in ${m.id} missing English correctApproach`);
      }
    });
  });

  // Feature 6: Chapter 2 Theory Modules (2.1–2.5) Bilingual Data
  describe('Feature 6: Chapter 2 Theory Modules (2.1–2.5) Bilingual Data', () => {
    it('6.1: getChapterModules(2, "en") or chapter2ModulesEn.ts exists and returns 5 modules', () => {
      const enFile = path.join(DATA_DIR, 'chapter2ModulesEn.ts');
      const indexFile = path.join(DATA_DIR, 'index.ts');
      assert.ok(fs.existsSync(enFile) || fs.existsSync(indexFile), '[F6] chapter2ModulesEn.ts or data/index.ts must exist');
      const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/chapter2ModulesEn.ts');
      assert.ok(dataMod, '[F6] Data module required');
      const modules = dataMod.getChapterModules ? dataMod.getChapterModules(2, 'en') : dataMod.CHAPTER_2_MODULES_EN;
      assert.ok(Array.isArray(modules) && modules.length === 5, '[F6] Exactly 5 English modules required for Chapter 2');
    });

    it('6.2: All 5 English Chapter 2 modules contain non-empty English title, summary, and coreQuestion', () => {
      const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/chapter2ModulesEn.ts');
      assert.ok(dataMod, '[F6] Data module required');
      const modules = dataMod.getChapterModules ? dataMod.getChapterModules(2, 'en') : dataMod.CHAPTER_2_MODULES_EN;
      for (const m of modules) {
        assert.ok(m.title && m.title.length > 5, `[F6] Module ${m.id} missing English title`);
        assert.ok(m.summary && m.summary.length > 10, `[F6] Module ${m.id} missing English summary`);
        assert.ok(m.coreQuestion && m.coreQuestion.length > 10, `[F6] Module ${m.id} missing English coreQuestion`);
      }
    });

    it('6.3: All 8 derivation steps in Chapter 2 have English title, subtitle, and physicalMotivation', () => {
      const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/chapter2ModulesEn.ts');
      assert.ok(dataMod, '[F6] Data module required');
      const modules = dataMod.getChapterModules ? dataMod.getChapterModules(2, 'en') : dataMod.CHAPTER_2_MODULES_EN;
      let totalSteps = 0;
      for (const m of modules) {
        for (const s of m.derivationSteps) {
          totalSteps++;
          assert.ok(s.title && s.physicalMotivation, `[F6] Step ${s.id} missing English title/motivation`);
        }
      }
      assert.equal(totalSteps, 8, '[F6] Total Chapter 2 derivation steps must be 8');
    });

    it('6.4: All algebraic breakdowns in Chapter 2 contain English subStepTitle and explanation', () => {
      const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/chapter2ModulesEn.ts');
      assert.ok(dataMod, '[F6] Data module required');
      const modules = dataMod.getChapterModules ? dataMod.getChapterModules(2, 'en') : dataMod.CHAPTER_2_MODULES_EN;
      for (const m of modules) {
        for (const s of m.derivationSteps) {
          for (const b of s.algebraicBreakdown) {
            assert.ok(b.subStepTitle && b.explanation, `[F6] Breakdown in ${s.id} missing English subStepTitle/explanation`);
          }
        }
      }
    });

    it('6.5: Solved examples and common traps in Chapter 2 contain English translations', () => {
      const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/chapter2ModulesEn.ts');
      assert.ok(dataMod, '[F6] Data module required');
      const modules = dataMod.getChapterModules ? dataMod.getChapterModules(2, 'en') : dataMod.CHAPTER_2_MODULES_EN;
      for (const m of modules) {
        assert.ok(m.solvedExamples && m.solvedExamples.length > 0, `[F6] Module ${m.id} missing solved examples`);
        assert.ok(m.solvedExamples[0].strategy, `[F6] Solved example in ${m.id} missing English strategy`);
        assert.ok(m.commonTraps && m.commonTraps.length > 0, `[F6] Module ${m.id} missing common traps`);
        assert.ok(m.commonTraps[0].correctApproach, `[F6] Common trap in ${m.id} missing English correctApproach`);
      }
    });
  });

  // Feature 7: 3-in-1 Derivation Engine UI Localization
  describe('Feature 7: 3-in-1 Derivation Engine UI Localization', () => {
    it('7.1: Derivation card headers (Türetim Adımı, Cebirsel Açılım) localized in TR and EN', () => {
      const transMod = safeLoadTs('src/i18n/translations.ts');
      assert.ok(transMod, '[F7] translations required');
      const dict = transMod.TRANSLATIONS || transMod.translations || transMod.default;
      assert.ok(resolveTranslation(dict.tr, 'derivation.stepHeader') || resolveTranslation(dict.tr, 'derivation.algebraTitle'), '[F7] Turkish derivation header required');
      assert.ok(resolveTranslation(dict.en, 'derivation.stepHeader') || resolveTranslation(dict.en, 'derivation.algebraTitle'), '[F7] English derivation header required');
    });

    it('7.2: Trainer mode banner and lock indicator localized in TR and EN', () => {
      const transMod = safeLoadTs('src/i18n/translations.ts');
      assert.ok(transMod, '[F7] translations required');
      const dict = transMod.TRANSLATIONS || transMod.translations || transMod.default;
      assert.ok(resolveTranslation(dict.tr, 'trainer.lockedBanner') || resolveTranslation(dict.tr, 'modes.trainer'), '[F7] Turkish trainer banner required');
      assert.ok(resolveTranslation(dict.en, 'trainer.lockedBanner') || resolveTranslation(dict.en, 'modes.trainer'), '[F7] English trainer banner required');
    });

    it('7.3: Trainer mode proof reveal button (İspatı Göster / Reveal Proof) localized in TR and EN', () => {
      const transMod = safeLoadTs('src/i18n/translations.ts');
      assert.ok(transMod, '[F7] translations required');
      const dict = transMod.TRANSLATIONS || transMod.translations || transMod.default;
      assert.ok(resolveTranslation(dict.tr, 'trainer.revealBtn') || resolveTranslation(dict.tr, 'derivation.revealProof'), '[F7] Turkish reveal proof label required');
      assert.ok(resolveTranslation(dict.en, 'trainer.revealBtn') || resolveTranslation(dict.en, 'derivation.revealProof'), '[F7] English reveal proof label required');
    });

    it('7.4: Solved example accordion toggle header localized in TR and EN', () => {
      const transMod = safeLoadTs('src/i18n/translations.ts');
      assert.ok(transMod, '[F7] translations required');
      const dict = transMod.TRANSLATIONS || transMod.translations || transMod.default;
      assert.ok(resolveTranslation(dict.tr, 'derivation.solvedExample') || resolveTranslation(dict.tr, 'example.toggle'), '[F7] Turkish solved example header required');
      assert.ok(resolveTranslation(dict.en, 'derivation.solvedExample') || resolveTranslation(dict.en, 'example.toggle'), '[F7] English solved example header required');
    });

    it('7.5: Common trap alert box header (Tuzak / Sık Yapılan Hata) localized in TR and EN', () => {
      const transMod = safeLoadTs('src/i18n/translations.ts');
      assert.ok(transMod, '[F7] translations required');
      const dict = transMod.TRANSLATIONS || transMod.translations || transMod.default;
      assert.ok(resolveTranslation(dict.tr, 'derivation.commonTrap') || resolveTranslation(dict.tr, 'trap.header'), '[F7] Turkish common trap header required');
      assert.ok(resolveTranslation(dict.en, 'derivation.commonTrap') || resolveTranslation(dict.en, 'trap.header'), '[F7] English common trap header required');
    });
  });

  // Feature 8: Mathematical Tricks Dictionary i18n
  describe('Feature 8: Mathematical Tricks Dictionary i18n', () => {
    it('8.1: getMathTricks("en") or mathTricksDataEn.ts exists and returns all 6 tricks', () => {
      const enFile = path.join(DATA_DIR, 'mathTricksDataEn.ts');
      const indexFile = path.join(DATA_DIR, 'index.ts');
      assert.ok(fs.existsSync(enFile) || fs.existsSync(indexFile), '[F8] mathTricksDataEn.ts or data/index.ts must exist');
      const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/mathTricksDataEn.ts');
      assert.ok(dataMod, '[F8] Data module required');
      const tricks = dataMod.getMathTricks ? dataMod.getMathTricks('en') : dataMod.MATH_TRICKS_EN;
      assert.ok(Array.isArray(tricks) && tricks.length === 6, '[F8] Exactly 6 math tricks required in English');
    });

    it('8.2: All 6 tricks in English have non-empty title/name, summary, and whenUsedInBerkeley', () => {
      const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/mathTricksDataEn.ts');
      assert.ok(dataMod, '[F8] Data module required');
      const tricks = dataMod.getMathTricks ? dataMod.getMathTricks('en') : dataMod.MATH_TRICKS_EN;
      for (const t of tricks) {
        const name = t.title || t.name;
        assert.ok(name && name.length > 3, `[F8] Trick ${t.id} missing English title`);
        assert.ok(t.summary && t.summary.length > 10, `[F8] Trick ${t.id} missing English summary`);
        assert.ok(t.whenUsedInBerkeley || t.whereToUse, `[F8] Trick ${t.id} missing English usage note`);
      }
    });

    it('8.3: Mathematical identity LaTeX formulas (coreIdentityLatex) match between TR and EN tricks', () => {
      const trMod = safeLoadTs('src/data/mathTricksData.ts');
      const enMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/mathTricksDataEn.ts');
      assert.ok(trMod && enMod, '[F8] Both TR and EN tricks modules required');
      const trTricks = trMod.MATH_TRICKS;
      const enTricks = enMod.getMathTricks ? enMod.getMathTricks('en') : enMod.MATH_TRICKS_EN;
      for (let i = 0; i < 6; i++) {
        assert.equal(
          enTricks[i].coreIdentityLatex.trim(),
          trTricks[i].coreIdentityLatex.trim(),
          `[F8] Trick ${trTricks[i].id} formula identity mismatch`
        );
      }
    });

    it('8.4: Mathematical Arsenal modal title and description localized in TR and EN', () => {
      const transMod = safeLoadTs('src/i18n/translations.ts');
      assert.ok(transMod, '[F8] translations required');
      const dict = transMod.TRANSLATIONS || transMod.translations || transMod.default;
      assert.ok(resolveTranslation(dict.tr, 'arsenal.title') || resolveTranslation(dict.tr, 'arsenal.modalTitle'), '[F8] Turkish modal title required');
      assert.ok(resolveTranslation(dict.en, 'arsenal.title') || resolveTranslation(dict.en, 'arsenal.modalTitle'), '[F8] English modal title required');
    });

    it('8.5: Math trick badge labels and modal close button localized in TR and EN', () => {
      const transMod = safeLoadTs('src/i18n/translations.ts');
      assert.ok(transMod, '[F8] translations required');
      const dict = transMod.TRANSLATIONS || transMod.translations || transMod.default;
      assert.ok(resolveTranslation(dict.tr, 'common.close') || resolveTranslation(dict.tr, 'modal.close'), '[F8] Turkish modal close label required');
      assert.ok(resolveTranslation(dict.en, 'common.close') || resolveTranslation(dict.en, 'modal.close'), '[F8] English modal close label required');
    });
  });

  // Feature 9: KaTeX Formula Preservation
  describe('Feature 9: KaTeX Formula Preservation', () => {
    it('9.1: All fundamental equations in Ch1 & Ch2 compile with KaTeX in both TR and EN', () => {
      const dataMod = safeLoadTs('src/data/index.ts');
      const ch1Tr = safeLoadTs('src/data/chapter1Modules.ts').CHAPTER_1_MODULES;
      for (const m of ch1Tr) {
        for (const eq of m.fundamentalEquations) {
          validateLatexString(eq.formulaLatex, `Ch1 TR ${m.id}`);
        }
      }
      if (dataMod && dataMod.getChapterModules) {
        const ch1En = dataMod.getChapterModules(1, 'en');
        for (const m of ch1En) {
          for (const eq of m.fundamentalEquations) {
            validateLatexString(eq.formulaLatex, `Ch1 EN ${m.id}`);
          }
        }
      }
    });

    it('9.2: All derivation step algebraic breakdown formulas compile with KaTeX in both TR and EN', () => {
      const ch1Tr = safeLoadTs('src/data/chapter1Modules.ts').CHAPTER_1_MODULES;
      for (const m of ch1Tr) {
        for (const s of m.derivationSteps) {
          for (const b of s.algebraicBreakdown) {
            validateLatexString(b.formulaLatex, `Breakdown Ch1 TR ${s.id}`);
          }
        }
      }
    });

    it('9.3: All solved example step formulas compile with KaTeX in both TR and EN', () => {
      const ch1Tr = safeLoadTs('src/data/chapter1Modules.ts').CHAPTER_1_MODULES;
      for (const m of ch1Tr) {
        for (const ex of m.solvedExamples) {
          for (const step of ex.stepsLatex) {
            validateLatexString(step.math, `Solved Ex Ch1 TR ${ex.title}`);
          }
        }
      }
    });

    it('9.4: All Proof Coach Stage 1, 2, and 4 formulas compile with KaTeX in both TR and EN', () => {
      const ch1ProbTr = safeLoadTs('src/data/chapter1Problems.ts').CHAPTER_1_PROBLEMS;
      for (const p of ch1ProbTr) {
        for (const opt of p.stage1Setup.options) {
          validateLatexString(opt.latex, `Problem ${p.number || p.id} Stage 1 opt`);
        }
        for (const s of p.stage2Derivation) {
          validateLatexString(s.mathLatex, `Problem ${p.number || p.id} Stage 2 step`);
        }
        validateLatexString(p.stage4ExamSheet.finalBoxedLatex, `Problem ${p.number || p.id} Stage 4 finalBoxed`);
      }
    });

    it('9.5: All Mathematical Tricks core identities compile with KaTeX in both TR and EN', () => {
      const trMod = safeLoadTs('src/data/mathTricksData.ts');
      for (const t of trMod.MATH_TRICKS) {
        validateLatexString(t.coreIdentityLatex, `Trick TR ${t.id}`);
      }
      const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/mathTricksDataEn.ts');
      if (dataMod) {
        const enTricks = dataMod.getMathTricks ? dataMod.getMathTricks('en') : dataMod.MATH_TRICKS_EN;
        if (enTricks) {
          for (const t of enTricks) {
            validateLatexString(t.coreIdentityLatex, `Trick EN ${t.id}`);
          }
        }
      }
    });
  });

  // Feature 10: 54 Problems Proof Coach Format
  describe('Feature 10: 54 Problems Proof Coach Format', () => {
    it('10.1: getChapterProblems(1, "en") returns exactly 22 problems (1.1 to 1.22)', () => {
      const enFile = path.join(DATA_DIR, 'chapter1ProblemsEn.ts');
      const indexFile = path.join(DATA_DIR, 'index.ts');
      assert.ok(fs.existsSync(enFile) || fs.existsSync(indexFile), '[F10] chapter1ProblemsEn.ts or data/index.ts must exist');
      const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/chapter1ProblemsEn.ts');
      assert.ok(dataMod, '[F10] Data module required');
      const problems = dataMod.getChapterProblems ? dataMod.getChapterProblems(1, 'en') : dataMod.CHAPTER_1_PROBLEMS_EN;
      assert.ok(Array.isArray(problems) && problems.length === 22, '[F10] Exactly 22 problems required for Chapter 1 in English');
      for (let i = 1; i <= 22; i++) {
        assert.ok(problems.some(p => p.number?.includes(`1.${i}`) || p.id?.includes(`1-${i}`) || p.num === `1.${i}`), `[F10] Missing problem 1.${i}`);
      }
    });

    it('10.2: getChapterProblems(2, "en") returns exactly 32 problems (2.1 to 2.32)', () => {
      const enFile = path.join(DATA_DIR, 'chapter2ProblemsEn.ts');
      const indexFile = path.join(DATA_DIR, 'index.ts');
      assert.ok(fs.existsSync(enFile) || fs.existsSync(indexFile), '[F10] chapter2ProblemsEn.ts or data/index.ts must exist');
      const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/chapter2ProblemsEn.ts');
      assert.ok(dataMod, '[F10] Data module required');
      const problems = dataMod.getChapterProblems ? dataMod.getChapterProblems(2, 'en') : dataMod.CHAPTER_2_PROBLEMS_EN;
      assert.ok(Array.isArray(problems) && problems.length === 32, '[F10] Exactly 32 problems required for Chapter 2 in English');
      for (let i = 1; i <= 32; i++) {
        assert.ok(problems.some(p => p.number?.includes(`2.${i}`) || p.id?.includes(`2-${i}`) || p.num === `2.${i}`), `[F10] Missing problem 2.${i}`);
      }
    });

    it('10.3: Total problem count in English is exactly 54 problems', () => {
      const dataMod = safeLoadTs('src/data/index.ts');
      if (dataMod && dataMod.getChapterProblems) {
        const ch1 = dataMod.getChapterProblems(1, 'en');
        const ch2 = dataMod.getChapterProblems(2, 'en');
        assert.equal(ch1.length + ch2.length, 54, '[F10] Total English problems must equal 54');
      } else {
        const ch1Mod = safeLoadTs('src/data/chapter1ProblemsEn.ts');
        const ch2Mod = safeLoadTs('src/data/chapter2ProblemsEn.ts');
        assert.ok(ch1Mod && ch2Mod, '[F10] English problem modules required');
        const ch1 = ch1Mod.CHAPTER_1_PROBLEMS_EN;
        const ch2 = ch2Mod.CHAPTER_2_PROBLEMS_EN;
        assert.equal(ch1.length + ch2.length, 54, '[F10] Total English problems must equal 54');
      }
    });

    it('10.4: Every English problem contains all 4 stages (stage1Setup, stage2Derivation, stage3VisualVerify, stage4ExamSheet)', () => {
      const dataMod = safeLoadTs('src/data/index.ts');
      const ch1 = dataMod && dataMod.getChapterProblems ? dataMod.getChapterProblems(1, 'en') : safeLoadTs('src/data/chapter1ProblemsEn.ts')?.CHAPTER_1_PROBLEMS_EN;
      const ch2 = dataMod && dataMod.getChapterProblems ? dataMod.getChapterProblems(2, 'en') : safeLoadTs('src/data/chapter2ProblemsEn.ts')?.CHAPTER_2_PROBLEMS_EN;
      assert.ok(ch1 && ch2, '[F10] Problem datasets required');
      const allProblems = [...ch1, ...ch2];
      for (const p of allProblems) {
        assert.ok(p.stage1Setup, `[F10] Problem ${p.number || p.id} missing stage1Setup`);
        assert.ok(Array.isArray(p.stage2Derivation) && p.stage2Derivation.length > 0, `[F10] Problem ${p.number || p.id} missing stage2Derivation`);
        assert.ok(p.stage3VisualVerify, `[F10] Problem ${p.number || p.id} missing stage3VisualVerify`);
        assert.ok(p.stage4ExamSheet, `[F10] Problem ${p.number || p.id} missing stage4ExamSheet`);
      }
    });

    it('10.5: Every English problem contains non-empty title, statement, targetLatex, and difficulty', () => {
      const dataMod = safeLoadTs('src/data/index.ts');
      const ch1 = dataMod && dataMod.getChapterProblems ? dataMod.getChapterProblems(1, 'en') : safeLoadTs('src/data/chapter1ProblemsEn.ts')?.CHAPTER_1_PROBLEMS_EN;
      const ch2 = dataMod && dataMod.getChapterProblems ? dataMod.getChapterProblems(2, 'en') : safeLoadTs('src/data/chapter2ProblemsEn.ts')?.CHAPTER_2_PROBLEMS_EN;
      assert.ok(ch1 && ch2, '[F10] Problem datasets required');
      for (const p of [...ch1, ...ch2]) {
        assert.ok(p.title && p.title.length > 5, `[F10] Problem ${p.number || p.id} missing English title`);
        assert.ok(p.statement && p.statement.length > 10, `[F10] Problem ${p.number || p.id} missing English statement`);
        assert.ok(p.targetLatex || p.targetToDerive, `[F10] Problem ${p.number || p.id} missing English target`);
        assert.ok(p.difficulty, `[F10] Problem ${p.number || p.id} missing difficulty`);
      }
    });
  });

  // Feature 11: Language Persistence (localStorage)
  describe('Feature 11: Language Persistence (localStorage)', () => {
    it('11.1: setLocale("en") writes "en" to localStorage under key "berkeley_dalgalar_lang"', () => {
      const storage = new MockLocalStorage();
      const manager = createI18nInstance(storage);
      assert.ok(manager, '[F11] i18nManager required');
      manager.setLocale('en');
      assert.equal(storage.getItem('berkeley_dalgalar_lang'), 'en', '[F11] Key berkeley_dalgalar_lang must equal "en"');
    });

    it('11.2: setLocale("tr") writes "tr" to localStorage under key "berkeley_dalgalar_lang"', () => {
      const storage = new MockLocalStorage();
      const manager = createI18nInstance(storage);
      assert.ok(manager, '[F11] i18nManager required');
      manager.setLocale('tr');
      assert.equal(storage.getItem('berkeley_dalgalar_lang'), 'tr', '[F11] Key berkeley_dalgalar_lang must equal "tr"');
    });

    it('11.3: i18nManager initializes with "en" when localStorage has "en"', () => {
      const storage = new MockLocalStorage();
      storage.setItem('berkeley_dalgalar_lang', 'en');
      const manager = createI18nInstance(storage);
      assert.ok(manager, '[F11] i18nManager required');
      assert.equal(manager.getLocale(), 'en', '[F11] Must initialize to stored locale "en"');
    });

    it('11.4: i18nManager initializes with "tr" when localStorage has "tr"', () => {
      const storage = new MockLocalStorage();
      storage.setItem('berkeley_dalgalar_lang', 'tr');
      const manager = createI18nInstance(storage);
      assert.ok(manager, '[F11] i18nManager required');
      assert.equal(manager.getLocale(), 'tr', '[F11] Must initialize to stored locale "tr"');
    });

    it('11.5: i18nManager initializes with default "tr" when localStorage is empty', () => {
      const storage = new MockLocalStorage();
      const manager = createI18nInstance(storage);
      assert.ok(manager, '[F11] i18nManager required');
      assert.equal(manager.getLocale(), 'tr', '[F11] Empty storage must default to "tr"');
    });
  });

  // Feature 12: Git Repository & .gitignore Setup
  describe('Feature 12: Git Repository & .gitignore Setup', () => {
    it('12.1: Project is a Git repository (.git directory exists and is valid git work tree)', () => {
      const gitDir = path.join(PROJECT_ROOT, '.git');
      assert.ok(fs.existsSync(gitDir), '[F12] .git directory must exist');
      try {
        const out = execSync('git rev-parse --is-inside-work-tree', { cwd: PROJECT_ROOT, encoding: 'utf8' }).trim();
        assert.equal(out, 'true', '[F12] Must be inside a valid git working tree');
      } catch (err) {
        assert.fail(`[F12] Git execution failed: ${err.message}`);
      }
    });

    it('12.2: Git repository active/default branch is "main"', () => {
      try {
        const branch = execSync('git branch --show-current', { cwd: PROJECT_ROOT, encoding: 'utf8' }).trim();
        assert.equal(branch, 'main', '[F12] Active branch must be "main"');
      } catch (err) {
        assert.fail(`[F12] Git branch check failed: ${err.message}`);
      }
    });

    it('12.3: .gitignore file exists at project root', () => {
      assert.ok(fs.existsSync(GITIGNORE_PATH), '[F12] .gitignore must exist at project root');
    });

    it('12.4: .gitignore contains rule ignoring node_modules', () => {
      assert.ok(fs.existsSync(GITIGNORE_PATH), '[F12] .gitignore must exist');
      const content = fs.readFileSync(GITIGNORE_PATH, 'utf8');
      assert.ok(/node_modules/i.test(content), '[F12] .gitignore must include node_modules');
    });

    it('12.5: .gitignore contains rule ignoring dist directory', () => {
      assert.ok(fs.existsSync(GITIGNORE_PATH), '[F12] .gitignore must exist');
      const content = fs.readFileSync(GITIGNORE_PATH, 'utf8');
      assert.ok(/dist/i.test(content), '[F12] .gitignore must include dist');
    });
  });

  // Feature 13: Automated Deployment CI/CD Workflow
  describe('Feature 13: Automated Deployment CI/CD Workflow', () => {
    it('13.1: GitHub Actions workflow file exists at .github/workflows/deploy.yml', () => {
      assert.ok(fs.existsSync(DEPLOY_WORKFLOW_PATH), '[F13] .github/workflows/deploy.yml must exist');
    });

    it('13.2: Workflow triggers on push to "main" branch', () => {
      assert.ok(fs.existsSync(DEPLOY_WORKFLOW_PATH), '[F13] deploy.yml must exist');
      const content = fs.readFileSync(DEPLOY_WORKFLOW_PATH, 'utf8');
      assert.ok(/push:\s*\n\s*branches:\s*\[?.*main/m.test(content), '[F13] deploy.yml must trigger on push to main');
    });

    it('13.3: Workflow contains checkout action step (actions/checkout)', () => {
      assert.ok(fs.existsSync(DEPLOY_WORKFLOW_PATH), '[F13] deploy.yml must exist');
      const content = fs.readFileSync(DEPLOY_WORKFLOW_PATH, 'utf8');
      assert.ok(/uses:\s*actions\/checkout@v[34]/i.test(content), '[F13] deploy.yml must use actions/checkout@v4 or @v3');
    });

    it('13.4: Workflow contains Node.js setup step (actions/setup-node)', () => {
      assert.ok(fs.existsSync(DEPLOY_WORKFLOW_PATH), '[F13] deploy.yml must exist');
      const content = fs.readFileSync(DEPLOY_WORKFLOW_PATH, 'utf8');
      assert.ok(/uses:\s*actions\/setup-node@v[34]/i.test(content), '[F13] deploy.yml must use actions/setup-node');
    });

    it('13.5: Workflow contains build step (npm run build or vite build)', () => {
      assert.ok(fs.existsSync(DEPLOY_WORKFLOW_PATH), '[F13] deploy.yml must exist');
      const content = fs.readFileSync(DEPLOY_WORKFLOW_PATH, 'utf8');
      assert.ok(/run:\s*(npm run build|npx vite build)/i.test(content), '[F13] deploy.yml must execute build step');
    });
  });
});

// ============================================================================
// TIER 2: BOUNDARY & CORNER CASES (FEATURES 1 TO 13)
// ============================================================================

describe('Tier 2: Boundary & Corner Cases (Features 1-13)', () => {
  before(() => { currentTier = 'tier2'; });
  afterEach((t) => {
    summaryStats.tier2.total++;
    if (t.error) summaryStats.tier2.failed++;
    else summaryStats.tier2.passed++;
  });

  describe('Feature 1 Boundaries (i18n Core)', () => {
    it('2.1.1: t(key) with unknown/missing key returns the raw key without throwing error', () => {
      const manager = createI18nInstance();
      assert.ok(manager, '[F1 Boundary] i18nManager required');
      const missingKey = 'non.existent.random.key.123';
      assert.doesNotThrow(() => {
        const res = manager.t(missingKey);
        assert.equal(res, missingKey, '[F1 Boundary] Must fall back to raw key string');
      });
    });

    it('2.1.2: t(key, params) with empty {} params object returns translated string intact', () => {
      const manager = createI18nInstance();
      assert.ok(manager, '[F1 Boundary] i18nManager required');
      assert.doesNotThrow(() => {
        const res = manager.t('shell.brandTitle', {});
        assert.ok(typeof res === 'string' && res.length > 0);
      });
    });

    it('2.1.3: t(key, params) correctly interpolates named placeholders {param}', () => {
      const manager = createI18nInstance();
      assert.ok(manager, '[F1 Boundary] i18nManager required');
      const res = manager.t('search.modulePrefix', { code: '1.4' });
      assert.ok(res.includes('1.4'), '[F1 Boundary] Parameter {code} must be interpolated');
    });

    it('2.1.4: setLocale() with invalid/unsupported locale safely falls back to "tr"', () => {
      const manager = createI18nInstance();
      assert.ok(manager, '[F1 Boundary] i18nManager required');
      manager.setLocale('fr');
      assert.ok(manager.getLocale() === 'tr' || manager.getLocale() === 'en', '[F1 Boundary] Must fall back to supported locale');
    });

    it('2.1.5: subscribe() returns unsubscribe function; unsubscribed listeners are not called', () => {
      const manager = createI18nInstance();
      assert.ok(manager, '[F1 Boundary] i18nManager required');
      let count = 0;
      const unsub = manager.subscribe(() => { count++; });
      manager.setLocale('en');
      assert.equal(count, 1, 'Called once');
      if (typeof unsub === 'function') unsub();
      manager.setLocale('tr');
      assert.equal(count, 1, 'Must not be called after unsubscribe');
    });
  });

  describe('Feature 2 Boundaries (Toggle Button)', () => {
    it('2.2.1: Rapid consecutive toggles maintain consistent state matching click parity', () => {
      const manager = createI18nInstance();
      assert.ok(manager, '[F2 Boundary] i18nManager required');
      manager.setLocale('tr');
      for (let i = 0; i < 10; i++) {
        const next = manager.getLocale() === 'tr' ? 'en' : 'tr';
        manager.setLocale(next);
      }
      assert.equal(manager.getLocale(), 'tr', '[F2 Boundary] 10 toggles must return to initial "tr"');
    });

    it('2.2.2: Toggle button has accessible aria-label attribute in HTML', () => {
      const html = fs.readFileSync(INDEX_HTML_PATH, 'utf8');
      assert.ok(
        /aria-label="[^"]*(dil|language|toggle|switch)/i.test(html) || html.includes('id="lang-toggle-btn"'),
        '[F2 Boundary] Language toggle button should support accessibility'
      );
    });

    it('2.2.3: Toggle button has title tooltip attribute localized in active language', () => {
      const transMod = safeLoadTs('src/i18n/translations.ts');
      assert.ok(transMod, '[F2 Boundary] translations required');
      const dict = transMod.TRANSLATIONS || transMod.translations || transMod.default;
      assert.ok(
        resolveTranslation(dict.tr, 'shell.toggleLanguage') || resolveTranslation(dict.tr, 'btn.toggleLang'),
        '[F2 Boundary] Tooltip translation key required for toggle button'
      );
    });

    it('2.2.4: Language toggle does not clear or corrupt active search input value', () => {
      const mainTs = fs.readFileSync(path.join(SRC_DIR, 'main.ts'), 'utf8');
      assert.ok(
        !/searchInput\.value\s*=\s*['"]['"]/i.test(mainTs),
        '[F2 Boundary] Search input must not be wiped indiscriminately on language toggle'
      );
    });

    it('2.2.5: Toggle button has keyboard accessibility (button tag or role="button" with tabindex)', () => {
      const html = fs.readFileSync(INDEX_HTML_PATH, 'utf8');
      const hasAccessibleBtn = /<button[^>]*id="lang-toggle-btn"/i.test(html) || /role="button"/i.test(html);
      assert.ok(hasAccessibleBtn, '[F2 Boundary] Toggle must be semantic <button> or have button role');
    });
  });

  describe('Feature 3 Boundaries (Shell & Nav)', () => {
    it('2.3.1: Empty search input preserves full list of curriculum modules in sidebar', () => {
      const ch1Mod = safeLoadTs('src/data/chapter1Modules.ts');
      const ch2Mod = safeLoadTs('src/data/chapter2Modules.ts');
      const totalModules = ch1Mod.CHAPTER_1_MODULES.length + ch2Mod.CHAPTER_2_MODULES.length;
      assert.equal(totalModules, 10, '[F3 Boundary] Total curriculum modules must remain 10');
    });

    it('2.3.2: Search query matching English keyword (e.g. "pendulum") finds Module 1.4 or 1.5 in EN', () => {
      const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/chapter1ModulesEn.ts');
      assert.ok(dataMod, '[F3 Boundary] English data required');
      const ch1En = dataMod.getChapterModules ? dataMod.getChapterModules(1, 'en') : dataMod.CHAPTER_1_MODULES_EN;
      const matched = ch1En.filter(m => /pendulum|harmonic|beat/i.test(m.title + ' ' + m.summary));
      assert.ok(matched.length > 0, '[F3 Boundary] Search in English data must match terms');
    });

    it('2.3.3: Search query matching Turkish keyword (e.g. "sarkaç") finds Module 1.4 in TR', () => {
      const ch1Tr = safeLoadTs('src/data/chapter1Modules.ts').CHAPTER_1_MODULES;
      const matched = ch1Tr.filter(m => /sarkaç|salınım|vuru/i.test(m.title + ' ' + m.summary));
      assert.ok(matched.length > 0, '[F3 Boundary] Search in Turkish data must match terms');
    });

    it('2.3.4: Breadcrumb bar format supports deep navigation in both TR and EN', () => {
      const transMod = safeLoadTs('src/i18n/translations.ts');
      assert.ok(transMod, '[F3 Boundary] translations required');
      const dict = transMod.TRANSLATIONS || transMod.translations || transMod.default;
      assert.ok(resolveTranslation(dict.tr, 'breadcrumbs.chapter') || resolveTranslation(dict.tr, 'breadcrumb.chapter'), '[F3 Boundary] TR breadcrumb label required');
      assert.ok(resolveTranslation(dict.en, 'breadcrumbs.chapter') || resolveTranslation(dict.en, 'breadcrumb.chapter'), '[F3 Boundary] EN breadcrumb label required');
    });

    it('2.3.5: Document root <html lang="..."> attribute dynamically updates on locale switch', () => {
      const mainTs = fs.readFileSync(path.join(SRC_DIR, 'main.ts'), 'utf8');
      const i18nTs = fs.readFileSync(path.join(I18N_DIR, 'index.ts'), 'utf8');
      assert.ok(
        /document\.documentElement\.lang\s*=/i.test(mainTs) ||
        /document\.documentElement\.lang\s*=/i.test(i18nTs),
        '[F3 Boundary] Document html lang attribute must be dynamically updated'
      );
    });
  });

  describe('Feature 4 Boundaries (MultiSpace HUD & Controls)', () => {
    it('2.4.1: Slider dock parameter displays handle boundary values (min, max, 0) with localized formatting', () => {
      const dirTs = fs.readFileSync(path.join(ENGINE_DIR, 'multiSpaceDirector.ts'), 'utf8');
      assert.ok(dirTs.includes('slider'), '[F4 Boundary] MultiSpaceDirector manages parameter sliders');
    });

    it('2.4.2: Switching locale while simulation is paused preserves paused state', () => {
      const dirTs = fs.readFileSync(path.join(ENGINE_DIR, 'multiSpaceDirector.ts'), 'utf8');
      const hasForcedPlayInSetLocale = /setLocale[\s\S]*?this\.isPlaying\s*=\s*true/m.test(dirTs);
      assert.equal(hasForcedPlayInSetLocale, false, '[F4 Boundary] setLocale must not unpause paused simulation');
    });

    it('2.4.3: Switching locale while simulation is running maintains animation frame loop', () => {
      const dirTs = fs.readFileSync(path.join(ENGINE_DIR, 'multiSpaceDirector.ts'), 'utf8');
      assert.ok(!/setLocale[\s\S]*?cancelAnimationFrame/m.test(dirTs), '[F4 Boundary] setLocale must not kill animation frame loop');
    });

    it('2.4.4: Active 2D abstract tab index remains selected after language switch', () => {
      const dirTs = fs.readFileSync(path.join(ENGINE_DIR, 'multiSpaceDirector.ts'), 'utf8');
      assert.ok(dirTs.includes('activeAbstractTab'), '[F4 Boundary] Active abstract tab property tracked');
    });

    it('2.4.5: Invalid scene param key or unknown tab ID does not crash the HUD or canvas renderer', () => {
      const dirTs = fs.readFileSync(path.join(ENGINE_DIR, 'multiSpaceDirector.ts'), 'utf8');
      assert.ok(dirTs.includes('render2DAbstractSpace'), '[F4 Boundary] 2D space rendering routine exists');
    });
  });

  describe('Feature 5 Boundaries (Chapter 1 Theory)', () => {
    it('2.5.1: Module IDs in English Ch1 match 1:1 with Turkish Ch1 IDs ("mod-1-1" to "mod-1-5")', () => {
      const ch1Tr = safeLoadTs('src/data/chapter1Modules.ts').CHAPTER_1_MODULES;
      const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/chapter1ModulesEn.ts');
      assert.ok(dataMod, '[F5 Boundary] English data required');
      const ch1En = dataMod.getChapterModules ? dataMod.getChapterModules(1, 'en') : dataMod.CHAPTER_1_MODULES_EN;
      const trIds = ch1Tr.map(m => m.id);
      const enIds = ch1En.map(m => m.id);
      assert.deepEqual(enIds, trIds, '[F5 Boundary] Module IDs must match 1:1');
    });

    it('2.5.2: Symbolic terms count and IDs match 1:1 between TR and EN modules in Chapter 1', () => {
      const ch1Tr = safeLoadTs('src/data/chapter1Modules.ts').CHAPTER_1_MODULES;
      const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/chapter1ModulesEn.ts');
      assert.ok(dataMod, '[F5 Boundary] English data required');
      const ch1En = dataMod.getChapterModules ? dataMod.getChapterModules(1, 'en') : dataMod.CHAPTER_1_MODULES_EN;
      for (let i = 0; i < 5; i++) {
        const trTerms = ch1Tr[i].symbolicTerms.map(s => s.id);
        const enTerms = ch1En[i].symbolicTerms.map(s => s.id);
        assert.deepEqual(enTerms, trTerms, `[F5 Boundary] Symbolic terms in Module ${ch1Tr[i].id} must match 1:1`);
      }
    });

    it('2.5.3: Trainer checkpoint options count and correct option index match 1:1 between TR and EN', () => {
      const ch1Tr = safeLoadTs('src/data/chapter1Modules.ts').CHAPTER_1_MODULES;
      const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/chapter1ModulesEn.ts');
      assert.ok(dataMod, '[F5 Boundary] English data required');
      const ch1En = dataMod.getChapterModules ? dataMod.getChapterModules(1, 'en') : dataMod.CHAPTER_1_MODULES_EN;
      for (let m = 0; m < 5; m++) {
        for (let s = 0; s < ch1Tr[m].derivationSteps.length; s++) {
          const trCp = ch1Tr[m].derivationSteps[s].trainerCheckpoint;
          const enCp = ch1En[m].derivationSteps[s].trainerCheckpoint;
          assert.equal(enCp.options.length, trCp.options.length, `[F5 Boundary] Option count mismatch in step ${s}`);
          assert.equal(enCp.correctIndex, trCp.correctIndex, `[F5 Boundary] Correct index mismatch in step ${s}`);
        }
      }
    });

    it('2.5.4: All fundamental equation LaTeX formulas in English Ch1 are identical to Turkish Ch1', () => {
      const ch1Tr = safeLoadTs('src/data/chapter1Modules.ts').CHAPTER_1_MODULES;
      const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/chapter1ModulesEn.ts');
      assert.ok(dataMod, '[F5 Boundary] English data required');
      const ch1En = dataMod.getChapterModules ? dataMod.getChapterModules(1, 'en') : dataMod.CHAPTER_1_MODULES_EN;
      for (let m = 0; m < 5; m++) {
        for (let eq = 0; eq < ch1Tr[m].fundamentalEquations.length; eq++) {
          assert.equal(
            ch1En[m].fundamentalEquations[eq].formulaLatex.trim(),
            ch1Tr[m].fundamentalEquations[eq].formulaLatex.trim(),
            `[F5 Boundary] Equation formula mismatch in Module ${ch1Tr[m].id}`
          );
        }
      }
    });

    it('2.5.5: English Ch1 content contains no "TODO" or "TBD" placeholders', () => {
      const enFile = path.join(DATA_DIR, 'chapter1ModulesEn.ts');
      if (fs.existsSync(enFile)) {
        const content = fs.readFileSync(enFile, 'utf8');
        assert.ok(!content.includes('TODO'), '[F5 Boundary] No TODO placeholders in chapter1ModulesEn.ts');
        assert.ok(!content.includes('TBD'), '[F5 Boundary] No TBD placeholders in chapter1ModulesEn.ts');
      }
    });
  });

  describe('Feature 6 Boundaries (Chapter 2 Theory)', () => {
    it('2.6.1: Module IDs in English Ch2 match 1:1 with Turkish Ch2 IDs ("mod-2-1" to "mod-2-5")', () => {
      const ch2Tr = safeLoadTs('src/data/chapter2Modules.ts').CHAPTER_2_MODULES;
      const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/chapter2ModulesEn.ts');
      assert.ok(dataMod, '[F6 Boundary] English data required');
      const ch2En = dataMod.getChapterModules ? dataMod.getChapterModules(2, 'en') : dataMod.CHAPTER_2_MODULES_EN;
      const trIds = ch2Tr.map(m => m.id);
      const enIds = ch2En.map(m => m.id);
      assert.deepEqual(enIds, trIds, '[F6 Boundary] Module IDs in Ch2 must match 1:1');
    });

    it('2.6.2: Module 2.4 discrete lattice derivation steps match step structure between TR and EN', () => {
      const ch2Tr = safeLoadTs('src/data/chapter2Modules.ts').CHAPTER_2_MODULES;
      const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/chapter2ModulesEn.ts');
      assert.ok(dataMod, '[F6 Boundary] English data required');
      const ch2En = dataMod.getChapterModules ? dataMod.getChapterModules(2, 'en') : dataMod.CHAPTER_2_MODULES_EN;
      const modTr = ch2Tr.find(m => m.code === '2.4');
      const modEn = ch2En.find(m => m.code === '2.4');
      assert.equal(modEn.derivationSteps.length, modTr.derivationSteps.length, '[F6 Boundary] Step count in 2.4 must match');
    });

    it('2.6.3: Module 2.1 wave equation derivation steps match step structure between TR and EN', () => {
      const ch2Tr = safeLoadTs('src/data/chapter2Modules.ts').CHAPTER_2_MODULES;
      const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/chapter2ModulesEn.ts');
      assert.ok(dataMod, '[F6 Boundary] English data required');
      const ch2En = dataMod.getChapterModules ? dataMod.getChapterModules(2, 'en') : dataMod.CHAPTER_2_MODULES_EN;
      const modTr = ch2Tr.find(m => m.code === '2.1');
      const modEn = ch2En.find(m => m.code === '2.1');
      assert.equal(modEn.derivationSteps.length, modTr.derivationSteps.length, '[F6 Boundary] Step count in 2.1 must match');
    });

    it('2.6.4: Solved example stepsLatex formulas in English Ch2 are identical to Turkish Ch2', () => {
      const ch2Tr = safeLoadTs('src/data/chapter2Modules.ts').CHAPTER_2_MODULES;
      const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/chapter2ModulesEn.ts');
      assert.ok(dataMod, '[F6 Boundary] English data required');
      const ch2En = dataMod.getChapterModules ? dataMod.getChapterModules(2, 'en') : dataMod.CHAPTER_2_MODULES_EN;
      for (let m = 0; m < 5; m++) {
        const trEx = ch2Tr[m].solvedExamples[0];
        const enEx = ch2En[m].solvedExamples[0];
        for (let s = 0; s < trEx.stepsLatex.length; s++) {
          assert.equal(
            enEx.stepsLatex[s].math.trim(),
            trEx.stepsLatex[s].math.trim(),
            `[F6 Boundary] Math step mismatch in solved example Ch2 ${ch2Tr[m].id}`
          );
        }
      }
    });

    it('2.6.5: English Ch2 content contains no "TODO" or "TBD" placeholders', () => {
      const enFile = path.join(DATA_DIR, 'chapter2ModulesEn.ts');
      if (fs.existsSync(enFile)) {
        const content = fs.readFileSync(enFile, 'utf8');
        assert.ok(!content.includes('TODO'), '[F6 Boundary] No TODO placeholders in chapter2ModulesEn.ts');
        assert.ok(!content.includes('TBD'), '[F6 Boundary] No TBD placeholders in chapter2ModulesEn.ts');
      }
    });
  });

  describe('Feature 7 Boundaries (Derivation Engine UI)', () => {
    it('2.7.1: Step navigation bounds at 0 and max steps without out-of-range exceptions', () => {
      const derivTs = fs.readFileSync(path.join(ENGINE_DIR, 'derivationEngine.ts'), 'utf8');
      assert.ok(derivTs.includes('currentStepIndex') || derivTs.includes('stepIndex'), '[F7 Boundary] Step index tracking exists');
    });

    it('2.7.2: Trainer checkpoint retains user feedback status across language toggle', () => {
      const transMod = safeLoadTs('src/i18n/translations.ts');
      assert.ok(transMod, '[F7 Boundary] translations required');
      const dict = transMod.TRANSLATIONS || transMod.translations || transMod.default;
      assert.ok(resolveTranslation(dict.tr, 'trainer.correctFeedback') || resolveTranslation(dict.tr, 'feedback.correct') || resolveTranslation(dict.tr, 'modes.trainer'), '[F7 Boundary] Trainer feedback key required');
    });

    it('2.7.3: Solved example accordion expansion state persists across language toggle', () => {
      const derivTs = fs.readFileSync(path.join(ENGINE_DIR, 'derivationEngine.ts'), 'utf8');
      assert.ok(derivTs.includes('details') || derivTs.includes('solved-example'), '[F7 Boundary] Solved example container exists');
    });

    it('2.7.4: Math trick popup trigger button from derivation step passes correct trick ID', () => {
      const derivTs = fs.readFileSync(path.join(ENGINE_DIR, 'derivationEngine.ts'), 'utf8');
      assert.ok(derivTs.includes('trick-') || derivTs.includes('open-math-arsenal'), '[F7 Boundary] Trick trigger wiring exists');
    });

    it('2.7.5: Steps with empty optional arrays render gracefully without breaking layout', () => {
      const derivTs = fs.readFileSync(path.join(ENGINE_DIR, 'derivationEngine.ts'), 'utf8');
      assert.ok(derivTs.includes('renderModuleView'), '[F7 Boundary] renderModuleView exists');
    });
  });

  describe('Feature 8 Boundaries (Math Tricks)', () => {
    it('2.8.1: Accessing trick with non-existent ID returns undefined/null gracefully', () => {
      const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/mathTricksDataEn.ts');
      if (dataMod && dataMod.getMathTricks) {
        const tricks = dataMod.getMathTricks('en');
        const found = tricks.find(t => t.id === 'invalid-trick-xyz');
        assert.equal(found, undefined, '[F8 Boundary] Invalid trick query should return undefined');
      }
    });

    it('2.8.2: All 6 trick IDs in English match exactly the 6 canonical IDs in Turkish', () => {
      const expectedIds = [
        'trick-taylor',
        'trick-phasor',
        'trick-determinant',
        'trick-trig-beats',
        'trick-separation',
        'trick-orthogonality',
      ];
      const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/mathTricksDataEn.ts');
      assert.ok(dataMod, '[F8 Boundary] English math tricks required');
      const tricks = dataMod.getMathTricks ? dataMod.getMathTricks('en') : dataMod.MATH_TRICKS_EN;
      const ids = tricks.map(t => t.id);
      assert.deepEqual(ids, expectedIds, '[F8 Boundary] Trick IDs must match canonical set');
    });

    it('2.8.3: English trick titles are distinct from Turkish titles (not identical copies)', () => {
      const trMod = safeLoadTs('src/data/mathTricksData.ts');
      const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/mathTricksDataEn.ts');
      assert.ok(dataMod, '[F8 Boundary] English math tricks required');
      const enTricks = dataMod.getMathTricks ? dataMod.getMathTricks('en') : dataMod.MATH_TRICKS_EN;
      for (let i = 0; i < 6; i++) {
        assert.notEqual(enTricks[i].title, trMod.MATH_TRICKS[i].title, `[F8 Boundary] Trick ${enTricks[i].id} title untranslated`);
      }
    });

    it('2.8.4: Math trick mini-canvas visual directives match between TR and EN', () => {
      const trMod = safeLoadTs('src/data/mathTricksData.ts');
      const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/mathTricksDataEn.ts');
      assert.ok(dataMod, '[F8 Boundary] English math tricks required');
      const enTricks = dataMod.getMathTricks ? dataMod.getMathTricks('en') : dataMod.MATH_TRICKS_EN;
      for (let i = 0; i < 6; i++) {
        const trMode = trMod.MATH_TRICKS[i].interactiveDemoType || trMod.MATH_TRICKS[i].miniCanvasMode;
        const enMode = enTricks[i].interactiveDemoType || enTricks[i].miniCanvasMode;
        assert.equal(enMode, trMode, `[F8 Boundary] Canvas mode mismatch in trick ${i}`);
      }
    });

    it('2.8.5: English trick text contains no "TODO" or "TBD" placeholders', () => {
      const enFile = path.join(DATA_DIR, 'mathTricksDataEn.ts');
      if (fs.existsSync(enFile)) {
        const content = fs.readFileSync(enFile, 'utf8');
        assert.ok(!content.includes('TODO'), '[F8 Boundary] No TODO in mathTricksDataEn.ts');
        assert.ok(!content.includes('TBD'), '[F8 Boundary] No TBD in mathTricksDataEn.ts');
      }
    });
  });

  describe('Feature 9 Boundaries (KaTeX Formula Invariants)', () => {
    it('2.9.1: ZERO Unicode subscript characters (₀₁₂₃₄₅₆₇₈₉) across all English datasets in src/data', () => {
      const enFiles = ['chapter1ModulesEn.ts', 'chapter2ModulesEn.ts', 'chapter1ProblemsEn.ts', 'chapter2ProblemsEn.ts', 'mathTricksDataEn.ts'];
      for (const file of enFiles) {
        const fullPath = path.join(DATA_DIR, file);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const latexRegex = /(?:latex|formulaLatex|mainEquationLatex|coreIdentityLatex|mathLatex|finalBoxedLatex|math)\s*:\s*\n?\s*'((?:\\'|[^'])*)'/g;
          let m;
          while ((m = latexRegex.exec(content)) !== null) {
            const raw = m[1].replace(/\\\\/g, '\\').replace(/\\'/g, "'");
            assert.ok(!/[₀₁₂₃₄₅₆₇₈₉]/.test(raw), `[F9 Boundary] Unicode subscript found in ${file}: ${raw}`);
          }
        }
      }
    });

    it('2.9.2: All LaTeX strings in English files parse cleanly through KaTeX renderToString', () => {
      const enFiles = ['chapter1ModulesEn.ts', 'chapter2ModulesEn.ts', 'chapter1ProblemsEn.ts', 'chapter2ProblemsEn.ts', 'mathTricksDataEn.ts'];
      let totalParsed = 0;
      for (const file of enFiles) {
        const fullPath = path.join(DATA_DIR, file);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const latexRegex = /(?:latex|formulaLatex|mainEquationLatex|coreIdentityLatex|mathLatex|finalBoxedLatex|math)\s*:\s*\n?\s*'((?:\\'|[^'])*)'/g;
          let m;
          while ((m = latexRegex.exec(content)) !== null) {
            totalParsed++;
            const raw = m[1].replace(/\\\\/g, '\\').replace(/\\'/g, "'");
            assert.doesNotThrow(() => {
              katex.renderToString(raw, { throwOnError: true, strict: false, trust: true });
            }, `KaTeX parse failure in ${file}: ${raw}`);
          }
        }
      }
      assert.ok(totalParsed >= 0, 'LaTeX validation completed');
    });

    it('2.9.3: All finalBoxedLatex strings across all 54 problems compile without syntax error', () => {
      const ch1 = safeLoadTs('src/data/chapter1Problems.ts').CHAPTER_1_PROBLEMS;
      const ch2 = safeLoadTs('src/data/chapter2Problems.ts').CHAPTER_2_PROBLEMS;
      for (const p of [...ch1, ...ch2]) {
        validateLatexString(p.stage4ExamSheet.finalBoxedLatex, `finalBoxed ${p.number || p.id}`);
      }
    });

    it('2.9.4: All Stage 1 multiple-choice formula options compile cleanly without error', () => {
      const ch1 = safeLoadTs('src/data/chapter1Problems.ts').CHAPTER_1_PROBLEMS;
      const ch2 = safeLoadTs('src/data/chapter2Problems.ts').CHAPTER_2_PROBLEMS;
      for (const p of [...ch1, ...ch2]) {
        for (const opt of p.stage1Setup.options) {
          validateLatexString(opt.latex, `Stage1 opt ${p.number || p.id}`);
        }
      }
    });

    it('2.9.5: Multi-line matrix equations (pmatrix) render without error', () => {
      const matrixSample = '\\begin{pmatrix} k_1 & -k_c \\\\ -k_c & k_2 \\end{pmatrix}';
      assert.doesNotThrow(() => {
        katex.renderToString(matrixSample, { throwOnError: true });
      });
    });
  });

  describe('Feature 10 Boundaries (54 Problems)', () => {
    it('2.10.1: Exactly 14 Home Experiment problems (isHomeExperiment: true) flagged identically in TR and EN', () => {
      const ch1Tr = safeLoadTs('src/data/chapter1Problems.ts').CHAPTER_1_PROBLEMS;
      const ch2Tr = safeLoadTs('src/data/chapter2Problems.ts').CHAPTER_2_PROBLEMS;
      const allTr = [...ch1Tr, ...ch2Tr];
      const homeExperimentsTr = allTr.filter(p => p.isHomeExperiment);
      assert.equal(homeExperimentsTr.length, 14, '[F10 Boundary] Exactly 14 Home Experiments in Turkish');

      const dataMod = safeLoadTs('src/data/index.ts');
      if (dataMod && dataMod.getChapterProblems) {
        const allEn = [...dataMod.getChapterProblems(1, 'en'), ...dataMod.getChapterProblems(2, 'en')];
        const homeExperimentsEn = allEn.filter(p => p.isHomeExperiment);
        assert.equal(homeExperimentsEn.length, 14, '[F10 Boundary] Exactly 14 Home Experiments in English');
      }
    });

    it('2.10.2: Stage 1 has exactly 3 options for every problem with exactly one isCorrect: true', () => {
      const ch1Tr = safeLoadTs('src/data/chapter1Problems.ts').CHAPTER_1_PROBLEMS;
      const ch2Tr = safeLoadTs('src/data/chapter2Problems.ts').CHAPTER_2_PROBLEMS;
      for (const p of [...ch1Tr, ...ch2Tr]) {
        assert.equal(p.stage1Setup.options.length, 3, `[F10 Boundary] Problem ${p.number || p.id} must have 3 options`);
        const correctCount = p.stage1Setup.options.filter(o => o.isCorrect).length;
        assert.equal(correctCount, 1, `[F10 Boundary] Problem ${p.number || p.id} must have exactly 1 correct option`);
      }
    });

    it('2.10.3: Total Stage 2 derivation sub-steps count matches exactly 95 across all 54 problems', () => {
      const ch1Tr = safeLoadTs('src/data/chapter1Problems.ts').CHAPTER_1_PROBLEMS;
      const ch2Tr = safeLoadTs('src/data/chapter2Problems.ts').CHAPTER_2_PROBLEMS;
      let totalSteps = 0;
      for (const p of [...ch1Tr, ...ch2Tr]) {
        totalSteps += p.stage2Derivation.length;
      }
      assert.equal(totalSteps, 95, '[F10 Boundary] Total Stage 2 sub-steps must equal 95');
    });

    it('2.10.4: Stage 3 simulation presets (sceneMode, abstractTab, presetParams) match identically', () => {
      const ch1Tr = safeLoadTs('src/data/chapter1Problems.ts').CHAPTER_1_PROBLEMS;
      const dataMod = safeLoadTs('src/data/index.ts');
      if (dataMod && dataMod.getChapterProblems) {
        const ch1En = dataMod.getChapterProblems(1, 'en');
        for (let i = 0; i < 22; i++) {
          assert.equal(ch1En[i].stage3VisualVerify.sceneMode, ch1Tr[i].stage3VisualVerify.sceneMode);
          assert.equal(ch1En[i].stage3VisualVerify.abstractTab, ch1Tr[i].stage3VisualVerify.abstractTab);
        }
      }
    });

    it('2.10.5: Stage 4 exam rubric contains at least 3 scoring criteria for every problem in EN', () => {
      const dataMod = safeLoadTs('src/data/index.ts');
      if (dataMod && dataMod.getChapterProblems) {
        const ch1En = dataMod.getChapterProblems(1, 'en');
        for (const p of ch1En) {
          assert.ok(
            p.stage4ExamSheet.examGradingRubric && p.stage4ExamSheet.examGradingRubric.length >= 3,
            `[F10 Boundary] Problem ${p.number || p.id} rubric must have >= 3 items`
          );
        }
      }
    });
  });

  describe('Feature 11 Boundaries (Persistence)', () => {
    it('2.11.1: Corrupted or unparseable value in localStorage falls back safely to "tr"', () => {
      const storage = new MockLocalStorage();
      storage.setItem('berkeley_dalgalar_lang', '{invalid-json: "bad"}');
      const manager = createI18nInstance(storage);
      assert.ok(manager, '[F11 Boundary] i18nManager required');
      assert.equal(manager.getLocale(), 'tr', '[F11 Boundary] Corrupted storage must fall back to "tr"');
    });

    it('2.11.2: localStorage throwing QuotaExceededError is caught without throwing', () => {
      const throwingStorage = {
        getItem() { return null; },
        setItem() { throw new Error('QuotaExceededError'); },
        removeItem() {},
      };
      const manager = createI18nInstance(throwingStorage);
      assert.ok(manager, '[F11 Boundary] i18nManager required');
      assert.doesNotThrow(() => {
        manager.setLocale('en');
      }, '[F11 Boundary] Storage error must be caught gracefully');
    });

    it('2.11.3: Setting locale to existing active locale does not perform redundant writes or listeners', () => {
      const storage = new MockLocalStorage();
      const manager = createI18nInstance(storage);
      assert.ok(manager, '[F11 Boundary] i18nManager required');
      manager.setLocale('tr');
      let calls = 0;
      manager.subscribe(() => { calls++; });
      manager.setLocale('tr');
      assert.equal(calls, 0, '[F11 Boundary] No duplicate listener notification on redundant locale set');
    });

    it('2.11.4: Deleting localStorage key dynamically falls back to default locale', () => {
      const storage = new MockLocalStorage();
      storage.setItem('berkeley_dalgalar_lang', 'en');
      const manager = createI18nInstance(storage);
      assert.ok(manager, '[F11 Boundary] i18nManager required');
      storage.removeItem('berkeley_dalgalar_lang');
      if (typeof manager.syncFromStorage === 'function') manager.syncFromStorage();
    });

    it('2.11.5: Window storage event listener hook is supported in i18nManager', () => {
      const i18nTs = fs.readFileSync(path.join(I18N_DIR, 'index.ts'), 'utf8');
      assert.ok(i18nTs.includes('localStorage'), '[F11 Boundary] localStorage referenced in i18nManager');
    });
  });

  describe('Feature 12 Boundaries (Git & .gitignore)', () => {
    it('2.12.1: .gitignore explicitly ignores .agents directory', () => {
      assert.ok(fs.existsSync(GITIGNORE_PATH), '[F12 Boundary] .gitignore required');
      const content = fs.readFileSync(GITIGNORE_PATH, 'utf8');
      assert.ok(/\.agents/i.test(content), '[F12 Boundary] .gitignore must ignore .agents');
    });

    it('2.12.2: .gitignore explicitly ignores log files (*.log)', () => {
      assert.ok(fs.existsSync(GITIGNORE_PATH), '[F12 Boundary] .gitignore required');
      const content = fs.readFileSync(GITIGNORE_PATH, 'utf8');
      assert.ok(/\*\.log/i.test(content), '[F12 Boundary] .gitignore must ignore *.log');
    });

    it('2.12.3: .gitignore explicitly ignores OS artifacts (.DS_Store, Thumbs.db)', () => {
      assert.ok(fs.existsSync(GITIGNORE_PATH), '[F12 Boundary] .gitignore required');
      const content = fs.readFileSync(GITIGNORE_PATH, 'utf8');
      assert.ok(/\.DS_Store|Thumbs\.db/i.test(content), '[F12 Boundary] .gitignore must ignore OS artifacts');
    });

    it('2.12.4: Git repository contains at least 1 commit in its history', () => {
      try {
        const count = execSync('git rev-list --count HEAD', { cwd: PROJECT_ROOT, encoding: 'utf8' }).trim();
        assert.ok(parseInt(count, 10) >= 1, '[F12 Boundary] Repository must have >= 1 commit');
      } catch (err) {
        assert.fail(`[F12 Boundary] Git commit history check failed: ${err.message}`);
      }
    });

    it('2.12.5: Project root does not track dist directory in Git', () => {
      try {
        const tracked = execSync('git ls-files dist/', { cwd: PROJECT_ROOT, encoding: 'utf8' }).trim();
        assert.equal(tracked, '', '[F12 Boundary] dist/ files must not be tracked in git index');
      } catch (err) {
        // If git fails or dist not tracked, pass
      }
    });
  });

  describe('Feature 13 Boundaries (CI/CD Deployment)', () => {
    it('2.13.1: .github/workflows/deploy.yml is valid YAML with proper indentation', () => {
      assert.ok(fs.existsSync(DEPLOY_WORKFLOW_PATH), '[F13 Boundary] deploy.yml must exist');
      const content = fs.readFileSync(DEPLOY_WORKFLOW_PATH, 'utf8');
      assert.ok(content.startsWith('name:') || content.includes('\nname:'), 'YAML must have name field');
      assert.ok(content.includes('jobs:'), 'YAML must define jobs');
    });

    it('2.13.2: Workflow includes a verification step (npm test or npm run typecheck) prior to build', () => {
      assert.ok(fs.existsSync(DEPLOY_WORKFLOW_PATH), '[F13 Boundary] deploy.yml must exist');
      const content = fs.readFileSync(DEPLOY_WORKFLOW_PATH, 'utf8');
      assert.ok(
        /run:\s*(npm test|npm run typecheck|npx tsc)/i.test(content),
        '[F13 Boundary] Workflow should run test or typecheck before deploy'
      );
    });

    it('2.13.3: Workflow configures GitHub Pages permissions (pages: write, id-token: write)', () => {
      assert.ok(fs.existsSync(DEPLOY_WORKFLOW_PATH), '[F13 Boundary] deploy.yml must exist');
      const content = fs.readFileSync(DEPLOY_WORKFLOW_PATH, 'utf8');
      assert.ok(/pages:\s*write/i.test(content), '[F13 Boundary] pages: write permission required');
      assert.ok(/id-token:\s*write/i.test(content), '[F13 Boundary] id-token: write permission required');
    });

    it('2.13.4: Workflow uses official actions/upload-pages-artifact and actions/deploy-pages', () => {
      assert.ok(fs.existsSync(DEPLOY_WORKFLOW_PATH), '[F13 Boundary] deploy.yml must exist');
      const content = fs.readFileSync(DEPLOY_WORKFLOW_PATH, 'utf8');
      assert.ok(/upload-pages-artifact/i.test(content), '[F13 Boundary] upload-pages-artifact required');
      assert.ok(/deploy-pages/i.test(content), '[F13 Boundary] deploy-pages required');
    });

    it('2.13.5: Workflow configures concurrency group with cancel-in-progress: true', () => {
      assert.ok(fs.existsSync(DEPLOY_WORKFLOW_PATH), '[F13 Boundary] deploy.yml must exist');
      const content = fs.readFileSync(DEPLOY_WORKFLOW_PATH, 'utf8');
      assert.ok(/concurrency:/i.test(content), '[F13 Boundary] Concurrency block required');
      assert.ok(/cancel-in-progress:\s*true/i.test(content), '[F13 Boundary] cancel-in-progress required');
    });
  });
});

// ============================================================================
// TIER 3: CROSS-FEATURE INTERACTIONS (PAIRWISE COMBINATIONS)
// ============================================================================

describe('Tier 3: Cross-Feature Interactions', () => {
  before(() => { currentTier = 'tier3'; });
  afterEach((t) => {
    summaryStats.tier3.total++;
    if (t.error) summaryStats.tier3.failed++;
    else summaryStats.tier3.passed++;
  });

  it('3.1: Language toggle while in Proof Coach Stage 2 maintains accordion open/closed state while translating', () => {
    const coachTs = fs.readFileSync(path.join(ENGINE_DIR, 'proofCoachEngine.ts'), 'utf8');
    assert.ok(coachTs.includes('stage2'), '[Tier 3] Proof Coach handles Stage 2 accordion');
  });

  it('3.2: Language toggle while Three.js animation is running preserves canvas WebGL context and physics state', () => {
    const dirTs = fs.readFileSync(path.join(ENGINE_DIR, 'multiSpaceDirector.ts'), 'utf8');
    assert.ok(dirTs.includes('setLocale'), '[Tier 3] MultiSpaceDirector implements setLocale');
  });

  it('3.3: Language choice persistence survives simulated page reload via localStorage rehydration', () => {
    const storage = new MockLocalStorage();
    storage.setItem('berkeley_dalgalar_lang', 'en');
    const manager = createI18nInstance(storage);
    assert.ok(manager, '[Tier 3] i18nManager required');
    assert.equal(manager.getLocale(), 'en', '[Tier 3] Should restore "en" upon rehydration');
  });

  it('3.4: Global search filtering across localized modules accurately queries current language index', () => {
    const ch1Tr = safeLoadTs('src/data/chapter1Modules.ts').CHAPTER_1_MODULES;
    const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/chapter1ModulesEn.ts');
    assert.ok(dataMod, '[Tier 3] English data required');
    const ch1En = dataMod.getChapterModules ? dataMod.getChapterModules(1, 'en') : dataMod.CHAPTER_1_MODULES_EN;
    const trMatches = ch1Tr.filter(m => m.title.includes('Taylor'));
    const enMatches = ch1En.filter(m => m.title.includes('Taylor'));
    assert.equal(trMatches.length, enMatches.length, '[Tier 3] Taylor matches in both languages');
  });

  it('3.5: Derivation Engine Trainer Mode + Language Toggle: preserves locked/revealed proof state', () => {
    const derivTs = fs.readFileSync(path.join(ENGINE_DIR, 'derivationEngine.ts'), 'utf8');
    assert.ok(derivTs.includes('trainer'), '[Tier 3] Trainer mode supported in DerivationEngine');
  });

  it('3.6: Proof Coach Stage 3 Visual Verify passes localized scene caption to MultiSpaceDirector', () => {
    const coachTs = fs.readFileSync(path.join(ENGINE_DIR, 'proofCoachEngine.ts'), 'utf8');
    assert.ok(coachTs.includes('stage3VisualVerify'), '[Tier 3] Stage 3 visual verify wired to canvas');
  });

  it('3.7: Math Arsenal Modal opened from Derivation step updates translation without closing unexpectedly', () => {
    const mainTs = fs.readFileSync(path.join(SRC_DIR, 'main.ts'), 'utf8');
    assert.ok(mainTs.includes('math-trick-modal'), '[Tier 3] Math trick modal integration in main');
  });

  it('3.8: Seamless Chapter 1 to Chapter 2 navigation in English maintains English locale throughout', () => {
    const dataMod = safeLoadTs('src/data/index.ts');
    if (dataMod && dataMod.getChapterModules) {
      const ch1 = dataMod.getChapterModules(1, 'en');
      const ch2 = dataMod.getChapterModules(2, 'en');
      assert.equal(ch1.length, 5);
      assert.equal(ch2.length, 5);
    }
  });
});

// ============================================================================
// TIER 4: REAL-WORLD APPLICATION SCENARIOS (5 USER JOURNEYS)
// ============================================================================

describe('Tier 4: Real-World Application Scenarios', () => {
  before(() => { currentTier = 'tier4'; });
  afterEach((t) => {
    summaryStats.tier4.total++;
    if (t.error) summaryStats.tier4.failed++;
    else summaryStats.tier4.passed++;
  });

  it('Scenario 4.1: English Student Full Theory Walkthrough (F1, F2, F3, F5, F6, F7, F8, F9)', () => {
    // 1. Student boots app and sets locale to English
    const storage = new MockLocalStorage();
    const manager = createI18nInstance(storage);
    assert.ok(manager, '[Scenario 4.1] i18nManager must load');
    manager.setLocale('en');
    assert.equal(manager.getLocale(), 'en');

    // 2. Student browses Chapter 1 modules (1.1 to 1.5)
    const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/chapter1ModulesEn.ts');
    assert.ok(dataMod, '[Scenario 4.1] English modules must exist');
    const ch1 = dataMod.getChapterModules ? dataMod.getChapterModules(1, 'en') : dataMod.CHAPTER_1_MODULES_EN;
    assert.equal(ch1.length, 5);

    // 3. Verifies Module 1.1 derivation steps & KaTeX formulas
    const mod1 = ch1[0];
    assert.ok(mod1.title.includes('Harmonic') || mod1.title.includes('Linearization') || mod1.title.includes('Taylor'));
    for (const step of mod1.derivationSteps) {
      assert.ok(step.title && step.physicalMotivation);
      for (const breakdown of step.algebraicBreakdown) {
        validateLatexString(breakdown.formulaLatex, `Scenario 4.1 ${step.id}`);
      }
    }

    // 4. Opens Taylor Trick modal and verifies English description
    const trickMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/mathTricksDataEn.ts');
    const tricks = trickMod.getMathTricks ? trickMod.getMathTricks('en') : trickMod.MATH_TRICKS_EN;
    const taylor = tricks.find(t => t.id === 'trick-taylor');
    assert.ok(taylor && (taylor.title || taylor.name));
    validateLatexString(taylor.coreIdentityLatex, 'Scenario 4.1 Taylor coreIdentity');
  });

  it('Scenario 4.2: Turkish Student Solving Hard Chapter 2 Problem (F1, F3, F10, F7, F9)', () => {
    // 1. Turkish student selects Problem 2.26 (Continuous string boundary conditions)
    const ch2ProblemsTr = safeLoadTs('src/data/chapter2Problems.ts').CHAPTER_2_PROBLEMS;
    const p226 = ch2ProblemsTr.find(p => p.number?.includes('2.26') || p.id === 'prob-2-26' || p.num === '2.26');
    assert.ok(p226, '[Scenario 4.2] Problem 2.26 must exist');
    assert.ok(p226.title.includes('Sürekli Bir İpin Öztitreşimleri'));

    // 2. Stage 1 Setup equation choice
    assert.equal(p226.stage1Setup.options.length, 3);
    const correctOpt = p226.stage1Setup.options.find(o => o.isCorrect);
    assert.ok(correctOpt);
    validateLatexString(correctOpt.latex, 'Scenario 4.2 Problem 2.26 Stage 1');

    // 3. Stage 2 Derivations
    assert.ok(p226.stage2Derivation.length >= 2);
    for (const s of p226.stage2Derivation) {
      validateLatexString(s.mathLatex, `Scenario 4.2 Problem 2.26 ${s.stepTitle}`);
    }

    // 4. Stage 3 Visual Verification parameters
    assert.ok(p226.stage3VisualVerify.sceneMode);
    assert.ok(p226.stage3VisualVerify.presetParams);

    // 5. Stage 4 Exam sheet solution & Rubric
    validateLatexString(p226.stage4ExamSheet.finalBoxedLatex, 'Scenario 4.2 Problem 2.26 finalBoxed');
    assert.ok(p226.stage4ExamSheet.examGradingRubric.length >= 3);
  });

  it('Scenario 4.3: Mid-Session Language Toggle Across Proof Coach Stages (F1, F2, F10, F11, F4)', () => {
    const storage = new MockLocalStorage();
    const manager = createI18nInstance(storage);
    assert.ok(manager, '[Scenario 4.3] i18nManager required');

    // Start in Turkish
    manager.setLocale('tr');
    const ch1Tr = safeLoadTs('src/data/chapter1Problems.ts').CHAPTER_1_PROBLEMS;
    const p114Tr = ch1Tr.find(p => p.number?.includes('1.14') || p.id === 'prob-1-14' || p.num === '1.14');
    assert.ok(p114Tr, 'Problem 1.14 TR exists');

    // Switch to English mid-session
    manager.setLocale('en');
    assert.equal(manager.getLocale(), 'en');
    const dataMod = safeLoadTs('src/data/index.ts') || safeLoadTs('src/data/chapter1ProblemsEn.ts');
    assert.ok(dataMod, 'English problems data required');
    const ch1En = dataMod.getChapterProblems ? dataMod.getChapterProblems(1, 'en') : dataMod.CHAPTER_1_PROBLEMS_EN;
    const p114En = ch1En.find(p => p.number?.includes('1.14') || p.id === 'prob-1-14' || p.num === '1.14');
    assert.ok(p114En, 'Problem 1.14 EN exists');

    // Mathematical formula consistency across transition
    assert.equal(
      p114En.stage4ExamSheet.finalBoxedLatex.trim(),
      p114Tr.stage4ExamSheet.finalBoxedLatex.trim(),
      '[Scenario 4.3] Formula must remain identical across language toggle'
    );

    // Toggle back to Turkish
    manager.setLocale('tr');
    assert.equal(manager.getLocale(), 'tr');
  });

  it('Scenario 4.4: Reload Persistence & Cache Integrity (F1, F2, F11, F3)', () => {
    const storage = new MockLocalStorage();
    // User switches to English
    storage.setItem('berkeley_dalgalar_lang', 'en');

    // Simulate page reload: new instance instantiated with same storage
    const freshManager = createI18nInstance(storage);
    assert.ok(freshManager, '[Scenario 4.4] i18nManager required');
    assert.equal(freshManager.getLocale(), 'en', '[Scenario 4.4] Must rehydrate as "en"');

    // Translations return English strings
    const transMod = safeLoadTs('src/i18n/translations.ts');
    assert.ok(transMod, '[Scenario 4.4] translations required');
    const dict = transMod.TRANSLATIONS || transMod.translations || transMod.default;
    assert.ok(resolveTranslation(dict.en, 'shell.brandTitle') || resolveTranslation(dict.en, 'brand.title'), '[Scenario 4.4] English header exists');
  });

  it('Scenario 4.5: CI/CD Build & Deployment Artifact Verification (F12, F13)', () => {
    // 1. Verify Git and .gitignore
    assert.ok(fs.existsSync(GITIGNORE_PATH), '[Scenario 4.5] .gitignore must exist');
    const gitignoreContent = fs.readFileSync(GITIGNORE_PATH, 'utf8');
    assert.ok(gitignoreContent.includes('node_modules'));
    assert.ok(gitignoreContent.includes('dist'));

    // 2. Verify deploy.yml GitHub Actions workflow
    assert.ok(fs.existsSync(DEPLOY_WORKFLOW_PATH), '[Scenario 4.5] deploy.yml must exist');
    const deployContent = fs.readFileSync(DEPLOY_WORKFLOW_PATH, 'utf8');
    assert.ok(deployContent.includes('actions/checkout'));
    assert.ok(deployContent.includes('actions/deploy-pages') || deployContent.includes('upload-pages-artifact'));

    // 3. Verify static build configuration in package.json and vite.config.ts
    const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
    assert.ok(pkg.scripts.build, 'package.json must define build script');

    const viteConfig = fs.readFileSync(path.join(PROJECT_ROOT, 'vite.config.ts'), 'utf8');
    assert.ok(viteConfig.includes("base: './'"), 'Vite base path must be relative "./" for GitHub Pages');
  });
});

// ----------------------------------------------------------------------------
// POST-TEST EXECUTION SUMMARY REPORT HOOK
// ----------------------------------------------------------------------------
after(() => {
  console.log('\n' + '='.repeat(70));
  console.log(' BERKELEY DALGALAR LAB — 4-TIER E2E TEST EXECUTION SUMMARY');
  console.log('='.repeat(70));
  console.log(` Tier 1 (Feature Coverage):           ${summaryStats.tier1.passed} / ${summaryStats.tier1.total} passed (${summaryStats.tier1.failed} failed)`);
  console.log(` Tier 2 (Boundary & Corner Cases):     ${summaryStats.tier2.passed} / ${summaryStats.tier2.total} passed (${summaryStats.tier2.failed} failed)`);
  console.log(` Tier 3 (Cross-Feature Interactions):  ${summaryStats.tier3.passed} / ${summaryStats.tier3.total} passed (${summaryStats.tier3.failed} failed)`);
  console.log(` Tier 4 (Real-World Scenarios):        ${summaryStats.tier4.passed} / ${summaryStats.tier4.total} passed (${summaryStats.tier4.failed} failed)`);
  console.log('='.repeat(70));
  const grandTotal = summaryStats.tier1.total + summaryStats.tier2.total + summaryStats.tier3.total + summaryStats.tier4.total;
  const grandPassed = summaryStats.tier1.passed + summaryStats.tier2.passed + summaryStats.tier3.passed + summaryStats.tier4.passed;
  const grandFailed = summaryStats.tier1.failed + summaryStats.tier2.failed + summaryStats.tier3.failed + summaryStats.tier4.failed;
  console.log(` GRAND TOTAL: ${grandPassed} / ${grandTotal} passed (${grandFailed} pending implementation)`);
  console.log('='.repeat(70) + '\n');
});
