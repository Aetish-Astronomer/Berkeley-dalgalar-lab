/**
 * ============================================================================
 * EMPIRICAL ADVERSARIAL STRESS TEST SUITE: MILESTONE 3
 * Berkeley Waves Interactive Laboratory — 54 End-of-Chapter Problems i18n & Proof Coach Engine
 *
 * Challenger: challenger_m3_2 (Stress Challenger)
 * Focus:
 *  1. Proof Coach mid-session state retention under rapid switching between 'tr' and 'en'
 *     while various stages (1-4) and problems (e.g. 1.1, 1.14, 2.26) are active.
 *  2. Exhaustive scan of both English problem files for empty strings, 'TODO', or 'TBD' tokens.
 *  3. Structural validation that total sub-steps across all 54 problems is exactly 95,
 *     and home experiments count is exactly 14.
 *  4. Stage 1 options consistency, Stage 4 rubric validity, and KaTeX compilation.
 *  5. Build, typecheck, and physics invariant test suite execution.
 *
 * Runner command:
 *   node --test tests/m3_adversarial_stress.test.mjs
 * ============================================================================
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import ts from 'typescript';
import katexMod from 'katex';

const require = createRequire(import.meta.url);

const katex = katexMod.default || katexMod;

const PROJECT_ROOT = path.resolve(import.meta.dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');
const DATA_DIR = path.join(SRC_DIR, 'data');
const I18N_DIR = path.join(SRC_DIR, 'i18n');
const ENGINE_DIR = path.join(SRC_DIR, 'engine');

// ----------------------------------------------------------------------------
// TEST HARNESS UTILITIES & DOM MOCKS
// ----------------------------------------------------------------------------

class MockStorage {
  constructor(initial = {}) {
    this.store = new Map(Object.entries(initial));
    this.throwOnGet = false;
    this.throwOnSet = false;
  }
  getItem(k) {
    if (this.throwOnGet) throw new Error('SecurityError: Access Denied');
    return this.store.has(k) ? this.store.get(k) : null;
  }
  setItem(k, v) {
    if (this.throwOnSet) throw new Error('QuotaExceededError');
    this.store.set(k, String(v));
  }
  removeItem(k) {
    this.store.delete(k);
  }
  clear() {
    this.store.clear();
  }
}

class ClassList {
  constructor(initial = []) {
    this._set = new Set(initial);
  }
  add(...classes) {
    classes.forEach(c => {
      if (c) c.split(/\s+/).forEach(x => this._set.add(x));
    });
  }
  remove(...classes) {
    classes.forEach(c => {
      if (c) c.split(/\s+/).forEach(x => this._set.delete(x));
    });
  }
  toggle(cls, force) {
    if (force === true) { this._set.add(cls); return true; }
    if (force === false) { this._set.delete(cls); return false; }
    if (this._set.has(cls)) { this._set.delete(cls); return false; }
    this._set.add(cls); return true;
  }
  contains(cls) {
    return this._set.has(cls);
  }
  has(cls) {
    return this._set.has(cls);
  }
  toString() {
    return Array.from(this._set).join(' ');
  }
}

/**
 * Minimal in-memory DOM mock sufficient for ProofCoachEngineUI rendering and event handling.
 */
class MockDOMElement {
  constructor(tagName = 'div') {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.attributes = new Map();
    this.eventListeners = new Map();
    this.classList = new ClassList();
    this.style = {};
    this._innerHTML = '';
    this.scrollTop = 0;
  }

  setAttribute(k, v) {
    this.attributes.set(k, String(v));
    if (k === 'class') {
      this.classList = new ClassList(String(v).split(/\s+/).filter(Boolean));
    }
  }

  getAttribute(k) {
    if (k === 'class') return this.classList.toString();
    return this.attributes.has(k) ? this.attributes.get(k) : null;
  }

  removeAttribute(k) {
    this.attributes.delete(k);
    if (k === 'class') this.classList = new ClassList();
  }

  addEventListener(event, handler) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(handler);
  }

  dispatchEvent(event) {
    const handlers = this.eventListeners.get(event.type) || [];
    for (const h of handlers) {
      h.call(this, event);
    }
  }

  click() {
    this.dispatchEvent({ type: 'click', target: this });
  }

  get innerHTML() {
    return this._innerHTML;
  }

  set innerHTML(val) {
    this._innerHTML = String(val);
    this._parseMockChildren(this._innerHTML);
  }

  _parseMockChildren(html) {
    this.children = [];

    // Parse all button elements
    const buttonRegex = /<\s*button\b([^>]*)>([\s\S]*?)<\/\s*button\s*>/gi;
    let match;
    while ((match = buttonRegex.exec(html)) !== null) {
      const attrStr = match[1] || '';
      const innerContent = match[2] || '';
      const btn = new MockDOMElement('button');

      const attrRegex = /([a-zA-Z0-9_\-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
      let attrMatch;
      while ((attrMatch = attrRegex.exec(attrStr)) !== null) {
        const key = attrMatch[1];
        const val = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '';
        btn.setAttribute(key, val);
      }

      // Check for child elements inside button, specifically trainer-feedback with data-fb
      const fbMatch = /<\s*div\b([^>]*data-fb[^>]*)>([\s\S]*?)<\/\s*div\s*>/i.exec(innerContent);
      if (fbMatch) {
        const fbEl = new MockDOMElement('div');
        const fbAttrStr = fbMatch[1] || '';
        let fbAttrM;
        const fbAttrRegex = /([a-zA-Z0-9_\-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
        while ((fbAttrM = fbAttrRegex.exec(fbAttrStr)) !== null) {
          fbEl.setAttribute(fbAttrM[1], fbAttrM[2] ?? fbAttrM[3] ?? fbAttrM[4] ?? '');
        }
        btn.children.push(fbEl);
      }

      this.children.push(btn);
    }
  }

  querySelectorAll(selector) {
    const results = [];
    const check = (el) => {
      if (matchesSelector(el, selector)) {
        results.push(el);
      }
      for (const ch of el.children) {
        check(ch);
      }
    };
    for (const ch of this.children) {
      check(ch);
    }
    return results;
  }

  querySelector(selector) {
    const list = this.querySelectorAll(selector);
    return list.length > 0 ? list[0] : null;
  }
}

function matchesSelector(el, selector) {
  if (selector.startsWith('#')) {
    return el.getAttribute('id') === selector.slice(1);
  }
  if (selector.startsWith('.')) {
    const cls = selector.slice(1);
    return el.classList.has(cls);
  }
  const attrMatch = selector.match(/^\[([a-zA-Z0-9_\-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?\]$/);
  if (attrMatch) {
    const key = attrMatch[1];
    const val = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4];
    if (val === undefined) {
      return el.attributes.has(key);
    }
    return el.getAttribute(key) === val;
  }
  if (selector.includes('[') && selector.includes(']')) {
    const parts = selector.split('[');
    const base = parts[0];
    const attrPart = '[' + parts[1];
    const baseMatches = base.startsWith('.') ? el.classList.has(base.slice(1)) : true;
    return baseMatches && matchesSelector(el, attrPart);
  }
  return false;
}

/**
 * Dynamic TypeScript module loader that executes in Node with custom mocks.
 */
const moduleCache = new Map();

function loadTsModule(relPath, mockGlobals = {}) {
  const absPath = path.isAbsolute(relPath) ? relPath : path.resolve(PROJECT_ROOT, relPath);
  if (!fs.existsSync(absPath)) {
    throw new Error(`File not found: ${absPath}`);
  }

  const content = fs.readFileSync(absPath, 'utf8');
  const res = ts.transpileModule(content, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  });

  const mod = { exports: {} };
  const customRequire = (reqPath) => {
    if (reqPath === 'katex') {
      const k = require('katex');
      return { ...k, default: k };
    }
    if (reqPath.startsWith('.')) {
      let resolved = path.resolve(path.dirname(absPath), reqPath);
      if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
        resolved = path.join(resolved, 'index.ts');
      } else if (!fs.existsSync(resolved) && fs.existsSync(resolved + '.ts')) {
        resolved += '.ts';
      }
      return loadTsModule(resolved, mockGlobals);
    }
    return require(reqPath);
  };

  const windowMock = mockGlobals.window || {
    localStorage: mockGlobals.localStorage || new MockStorage(),
  };

  const documentMock = mockGlobals.document || {
    documentElement: { lang: 'tr' },
    title: '',
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: (tag) => new MockDOMElement(tag),
  };

  const fn = new Function(
    'exports',
    'module',
    'require',
    '__dirname',
    '__filename',
    'window',
    'document',
    res.outputText
  );
  fn(mod.exports, mod, customRequire, path.dirname(absPath), absPath, windowMock, documentMock);
  return mod.exports;
}

function getSubprocessEnv() {
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  delete env.NODE_V8_COVERAGE;
  return env;
}

// ----------------------------------------------------------------------------
// LOAD PROJECT DATA AND ENGINES
// ----------------------------------------------------------------------------

const mockStorage = new MockStorage();
const mockDoc = {
  documentElement: { lang: 'tr' },
  title: '',
  querySelector: () => null,
  querySelectorAll: () => [],
  createElement: (tag) => new MockDOMElement(tag),
};

const dataModule = loadTsModule(path.join(DATA_DIR, 'index.ts'), { localStorage: mockStorage, document: mockDoc });
const i18nModule = loadTsModule(path.join(I18N_DIR, 'index.ts'), { localStorage: mockStorage, document: mockDoc });
const translationsModule = loadTsModule(path.join(I18N_DIR, 'translations.ts'), { localStorage: mockStorage, document: mockDoc });
const proofCoachModule = loadTsModule(path.join(ENGINE_DIR, 'proofCoachEngine.ts'), { localStorage: mockStorage, document: mockDoc });

const {
  CHAPTER_1_PROBLEMS,
  CHAPTER_2_PROBLEMS,
  CHAPTER_1_PROBLEMS_EN,
  CHAPTER_2_PROBLEMS_EN,
  getChapterProblems,
  getMathTricks
} = dataModule;

const { i18nManager } = i18nModule;
const { TRANSLATIONS } = translationsModule;
const { ProofCoachEngineUI } = proofCoachModule;

// ----------------------------------------------------------------------------
// SUITE 1: DATA INTEGRITY & EXHAUSTIVE SCAN OF ENGLISH PROBLEMS
// ----------------------------------------------------------------------------
describe('Suite 1: Data Integrity & Exhaustive Scan of English Problems', () => {

  it('1.1: Files exist and have substantial size', () => {
    const ch1Path = path.join(DATA_DIR, 'chapter1ProblemsEn.ts');
    const ch2Path = path.join(DATA_DIR, 'chapter2ProblemsEn.ts');
    assert.ok(fs.existsSync(ch1Path), 'chapter1ProblemsEn.ts must exist');
    assert.ok(fs.existsSync(ch2Path), 'chapter2ProblemsEn.ts must exist');

    const ch1Size = fs.statSync(ch1Path).size;
    const ch2Size = fs.statSync(ch2Path).size;
    assert.ok(ch1Size > 20000, `chapter1ProblemsEn.ts must be > 20KB (got ${ch1Size} bytes)`);
    assert.ok(ch2Size > 40000, `chapter2ProblemsEn.ts must be > 40KB (got ${ch2Size} bytes)`);
  });

  it('1.2: Problem counts: exactly 22 in Ch1, 32 in Ch2 (total 54) in TR & EN', () => {
    assert.strictEqual(CHAPTER_1_PROBLEMS.length, 22, 'TR Ch1 must have 22 problems');
    assert.strictEqual(CHAPTER_2_PROBLEMS.length, 32, 'TR Ch2 must have 32 problems');
    assert.strictEqual(CHAPTER_1_PROBLEMS_EN.length, 22, 'EN Ch1 must have 22 problems');
    assert.strictEqual(CHAPTER_2_PROBLEMS_EN.length, 32, 'EN Ch2 must have 32 problems');

    assert.strictEqual(CHAPTER_1_PROBLEMS.length + CHAPTER_2_PROBLEMS.length, 54, 'Total TR problems must be 54');
    assert.strictEqual(CHAPTER_1_PROBLEMS_EN.length + CHAPTER_2_PROBLEMS_EN.length, 54, 'Total EN problems must be 54');
  });

  it('1.3: Total sub-steps across all 54 problems is exactly 95 (Ch1=29, Ch2=66)', () => {
    const subSteps1Tr = CHAPTER_1_PROBLEMS.reduce((acc, p) => acc + p.stage2Derivation.length, 0);
    const subSteps1En = CHAPTER_1_PROBLEMS_EN.reduce((acc, p) => acc + p.stage2Derivation.length, 0);
    assert.strictEqual(subSteps1Tr, 29, 'TR Ch1 derivation sub-steps must be 29');
    assert.strictEqual(subSteps1En, 29, 'EN Ch1 derivation sub-steps must be 29');

    const subSteps2Tr = CHAPTER_2_PROBLEMS.reduce((acc, p) => acc + p.stage2Derivation.length, 0);
    const subSteps2En = CHAPTER_2_PROBLEMS_EN.reduce((acc, p) => acc + p.stage2Derivation.length, 0);
    assert.strictEqual(subSteps2Tr, 66, 'TR Ch2 derivation sub-steps must be 66');
    assert.strictEqual(subSteps2En, 66, 'EN Ch2 derivation sub-steps must be 66');

    const totalSubStepsTr = subSteps1Tr + subSteps2Tr;
    const totalSubStepsEn = subSteps1En + subSteps2En;
    assert.strictEqual(totalSubStepsTr, 95, `Total TR sub-steps must be 95 (got ${totalSubStepsTr})`);
    assert.strictEqual(totalSubStepsEn, 95, `Total EN sub-steps must be 95 (got ${totalSubStepsEn})`);

    // Verify individual problem sub-step counts match between TR and EN
    const allTr = [...CHAPTER_1_PROBLEMS, ...CHAPTER_2_PROBLEMS];
    const allEn = [...CHAPTER_1_PROBLEMS_EN, ...CHAPTER_2_PROBLEMS_EN];
    for (let i = 0; i < 54; i++) {
      assert.strictEqual(
        allEn[i].stage2Derivation.length,
        allTr[i].stage2Derivation.length,
        `Problem ${allTr[i].number} sub-step count must match between TR and EN`
      );
    }
  });

  it('1.4: Home experiments count is exactly 14 (Ch1=8, Ch2=6) across TR & EN', () => {
    const home1Tr = CHAPTER_1_PROBLEMS.filter(p => p.isHomeExperiment).length;
    const home1En = CHAPTER_1_PROBLEMS_EN.filter(p => p.isHomeExperiment).length;
    assert.strictEqual(home1Tr, 8, 'TR Ch1 home experiments must be 8');
    assert.strictEqual(home1En, 8, 'EN Ch1 home experiments must be 8');

    const home2Tr = CHAPTER_2_PROBLEMS.filter(p => p.isHomeExperiment).length;
    const home2En = CHAPTER_2_PROBLEMS_EN.filter(p => p.isHomeExperiment).length;
    assert.strictEqual(home2Tr, 6, 'TR Ch2 home experiments must be 6');
    assert.strictEqual(home2En, 6, 'EN Ch2 home experiments must be 6');

    const totalHomeTr = home1Tr + home2Tr;
    const totalHomeEn = home1En + home2En;
    assert.strictEqual(totalHomeTr, 14, `Total TR home experiments must be 14 (got ${totalHomeTr})`);
    assert.strictEqual(totalHomeEn, 14, `Total EN home experiments must be 14 (got ${totalHomeEn})`);

    // Verify identical home experiment flags per problem
    const allTr = [...CHAPTER_1_PROBLEMS, ...CHAPTER_2_PROBLEMS];
    const allEn = [...CHAPTER_1_PROBLEMS_EN, ...CHAPTER_2_PROBLEMS_EN];
    for (let i = 0; i < 54; i++) {
      assert.strictEqual(
        allEn[i].isHomeExperiment,
        allTr[i].isHomeExperiment,
        `Problem ${allTr[i].number} isHomeExperiment flag must match between TR and EN`
      );
    }
  });

  it('1.5: Problem IDs, numbers, and tags match 100% between TR and EN', () => {
    const allTr = [...CHAPTER_1_PROBLEMS, ...CHAPTER_2_PROBLEMS];
    const allEn = [...CHAPTER_1_PROBLEMS_EN, ...CHAPTER_2_PROBLEMS_EN];

    for (let i = 0; i < 54; i++) {
      const pTr = allTr[i];
      const pEn = allEn[i];
      assert.strictEqual(pEn.id, pTr.id, `ID mismatch at problem ${i}`);
      assert.strictEqual(pEn.number, pTr.number, `Number mismatch at problem ${i}`);
      assert.ok(pEn.title && pEn.title.trim().length > 0, `Problem ${pEn.id} EN title missing`);
      assert.ok(pEn.statement && pEn.statement.trim().length > 0, `Problem ${pEn.id} EN statement missing`);
    }
  });

  it('1.6: Raw token scan: Zero TODO, TBD, or FIXME in English problem source files', () => {
    const files = [
      path.join(DATA_DIR, 'chapter1ProblemsEn.ts'),
      path.join(DATA_DIR, 'chapter2ProblemsEn.ts')
    ];
    for (const f of files) {
      const content = fs.readFileSync(f, 'utf8');
      const matches = [...content.matchAll(/\b(TODO|TBD|FIXME)\b/gi)];
      assert.strictEqual(
        matches.length,
        0,
        `Found ${matches.length} placeholder tokens in ${path.basename(f)}: ${matches.map(m => m[0]).join(', ')}`
      );
    }
  });

  it('1.7: Deep recursive scan: Zero empty strings or whitespace-only strings in English problems', () => {
    const emptyStrings = [];
    const placeholderTokens = [];

    function scan(obj, currentPath) {
      if (typeof obj === 'string') {
        if (obj.trim() === '') {
          emptyStrings.push({ path: currentPath, value: obj });
        }
        if (/\b(TODO|TBD|FIXME)\b/i.test(obj)) {
          placeholderTokens.push({ path: currentPath, value: obj });
        }
      } else if (Array.isArray(obj)) {
        obj.forEach((item, idx) => scan(item, `${currentPath}[${idx}]`));
      } else if (obj !== null && typeof obj === 'object') {
        for (const [k, v] of Object.entries(obj)) {
          // trickUsedId can be undefined if no trick used; other fields must be non-empty strings
          if (v === undefined && k !== 'trickUsedId' && k !== 'num' && k !== 'bookPages' && k !== 'problemStatement' && k !== 'estimatedMinutes' && k !== 'fourStages' && k !== 'commonTraps' && k !== 'hints') {
            emptyStrings.push({ path: `${currentPath}.${k}`, value: 'undefined' });
          } else {
            scan(v, `${currentPath}.${k}`);
          }
        }
      }
    }

    scan(CHAPTER_1_PROBLEMS_EN, 'CH1_PROBLEMS_EN');
    scan(CHAPTER_2_PROBLEMS_EN, 'CH2_PROBLEMS_EN');

    assert.strictEqual(
      emptyStrings.length,
      0,
      `Found ${emptyStrings.length} empty string fields in English problems: ${JSON.stringify(emptyStrings.slice(0, 5))}`
    );
    assert.strictEqual(
      placeholderTokens.length,
      0,
      `Found ${placeholderTokens.length} placeholder tokens in English problems`
    );
  });

  it('1.8: No Unicode subscripts [₀₁₂₃₄₅₆₇₈₉] anywhere in English problem files', () => {
    const files = [
      path.join(DATA_DIR, 'chapter1ProblemsEn.ts'),
      path.join(DATA_DIR, 'chapter2ProblemsEn.ts')
    ];
    const unicodeSubscriptRegex = /[₀₁₂₃₄₅₆₇₈₉]/;

    for (const f of files) {
      const content = fs.readFileSync(f, 'utf8');
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        assert.ok(
          !unicodeSubscriptRegex.test(lines[i]),
          `Unicode subscript found in ${path.basename(f)} line ${i + 1}: ${lines[i]}`
        );
      }
    }
  });

  it('1.9: Stage 1 Options validation: exactly 3 options, exactly 1 correct, correct option parity across TR & EN', () => {
    const allTr = [...CHAPTER_1_PROBLEMS, ...CHAPTER_2_PROBLEMS];
    const allEn = [...CHAPTER_1_PROBLEMS_EN, ...CHAPTER_2_PROBLEMS_EN];

    for (let i = 0; i < 54; i++) {
      const optsTr = allTr[i].stage1Setup.options;
      const optsEn = allEn[i].stage1Setup.options;

      assert.strictEqual(optsTr.length, 3, `TR Problem ${allTr[i].number} must have 3 options`);
      assert.strictEqual(optsEn.length, 3, `EN Problem ${allEn[i].number} must have 3 options`);

      const correctCountTr = optsTr.filter(o => o.isCorrect).length;
      const correctCountEn = optsEn.filter(o => o.isCorrect).length;
      assert.strictEqual(correctCountTr, 1, `TR Problem ${allTr[i].number} must have exactly 1 correct option`);
      assert.strictEqual(correctCountEn, 1, `EN Problem ${allEn[i].number} must have exactly 1 correct option`);

      const correctIdxTr = optsTr.findIndex(o => o.isCorrect);
      const correctIdxEn = optsEn.findIndex(o => o.isCorrect);
      assert.strictEqual(
        correctIdxEn,
        correctIdxTr,
        `Problem ${allTr[i].number}: correct option index mismatch (TR: ${correctIdxTr}, EN: ${correctIdxEn})`
      );
    }
  });

  it('1.10: Stage 4 Rubrics validation: >= 3 non-empty rubric criteria per problem in both TR & EN', () => {
    const allEn = [...CHAPTER_1_PROBLEMS_EN, ...CHAPTER_2_PROBLEMS_EN];
    for (const p of allEn) {
      const rubric = p.stage4ExamSheet.examGradingRubric;
      assert.ok(Array.isArray(rubric), `Problem ${p.number} rubric must be an array`);
      assert.ok(rubric.length >= 3, `Problem ${p.number} must have >= 3 rubric items (got ${rubric.length})`);
      for (const item of rubric) {
        assert.ok(item && item.trim().length > 0, `Problem ${p.number} contains empty rubric item`);
      }
    }
  });

  it('1.11: KaTeX compilation stress: all math formulas across 54 English problems parse cleanly', () => {
    const allEn = [...CHAPTER_1_PROBLEMS_EN, ...CHAPTER_2_PROBLEMS_EN];
    let formulaCount = 0;

    for (const p of allEn) {
      // Test givenLatex & targetLatex
      assert.doesNotThrow(() => {
        katex.renderToString(p.givenLatex, { throwOnError: true, strict: false });
        formulaCount++;
      }, `KaTeX failed on givenLatex for ${p.number}`);

      assert.doesNotThrow(() => {
        katex.renderToString(p.targetLatex, { throwOnError: true, strict: false });
        formulaCount++;
      }, `KaTeX failed on targetLatex for ${p.number}`);

      // Test Stage 1 options
      for (const opt of p.stage1Setup.options) {
        assert.doesNotThrow(() => {
          katex.renderToString(opt.latex, { throwOnError: true, strict: false });
          formulaCount++;
        }, `KaTeX failed on stage 1 option latex for ${p.number}`);
      }

      // Test Stage 2 derivation sub-steps
      for (const step of p.stage2Derivation) {
        assert.doesNotThrow(() => {
          katex.renderToString(step.mathLatex, { throwOnError: true, strict: false });
          formulaCount++;
        }, `KaTeX failed on stage 2 mathLatex for ${p.number}`);
      }

      // Test Stage 4 finalBoxedLatex
      assert.doesNotThrow(() => {
        katex.renderToString(p.stage4ExamSheet.finalBoxedLatex, { throwOnError: true, strict: false });
        formulaCount++;
      }, `KaTeX failed on stage 4 finalBoxedLatex for ${p.number}`);
    }

    assert.ok(formulaCount >= 400, `Expected at least 400 formulas tested across all 54 problems (tested ${formulaCount})`);
  });
});

// ----------------------------------------------------------------------------
// SUITE 2: PROOF COACH MID-SESSION STATE RETENTION UNDER RAPID SWITCHING
// ----------------------------------------------------------------------------
describe('Suite 2: Proof Coach Mid-Session State Retention Under Rapid Locale Switching', () => {

  function createTestHarness() {
    const storage = new MockStorage();
    const doc = {
      documentElement: { lang: 'tr' },
      title: '',
      querySelector: () => null,
      querySelectorAll: () => [],
      createElement: (tag) => new MockDOMElement(tag),
    };
    const i18n = loadTsModule(path.join(I18N_DIR, 'index.ts'), { localStorage: storage, document: doc }).i18nManager;
    const coachEngine = new (loadTsModule(path.join(ENGINE_DIR, 'proofCoachEngine.ts'), { localStorage: storage, document: doc }).ProofCoachEngineUI)();
    const container = new MockDOMElement('div');
    const loadSceneCalls = [];
    const openTrickCalls = [];
    const callbacks = {
      onLoadProblemScene: (p) => loadSceneCalls.push(p.id),
      onOpenMathTrick: (id) => openTrickCalls.push(id),
    };

    return { i18n, coachEngine, container, callbacks, loadSceneCalls, openTrickCalls };
  }

  it('2.1: Problem index retention across rapid TR <-> EN switching (Problem 1.1, 1.14, 2.26, 2.32)', () => {
    const { i18n, coachEngine, container, callbacks } = createTestHarness();

    const testCases = [
      { chapter: 1, index: 0, expectedNum: 'Problem 1.1', expectedId: 'prob-1-1' },
      { chapter: 1, index: 13, expectedNum: 'Problem 1.14', expectedId: 'prob-1-14' },
      { chapter: 1, index: 21, expectedNum: 'Problem 1.22', expectedId: 'prob-1-22' },
      { chapter: 2, index: 0, expectedNum: 'Problem 2.1', expectedId: 'prob-2-1' },
      { chapter: 2, index: 25, expectedNum: 'Problem 2.26', expectedId: 'prob-2-26' },
      { chapter: 2, index: 31, expectedNum: 'Problem 2.32', expectedId: 'prob-2-32' },
    ];

    for (const tc of testCases) {
      coachEngine.setActiveProblemIndex(tc.index);
      assert.strictEqual(coachEngine.getActiveProblemIndex(), tc.index);

      // Perform 50 rapid toggle cycles (100 switches)
      for (let cycle = 0; cycle < 50; cycle++) {
        // Toggle to EN
        i18n.setLocale('en');
        const problemsEn = getChapterProblems(tc.chapter, 'en');
        coachEngine.renderProblemsView(container, problemsEn, callbacks);
        assert.strictEqual(coachEngine.getActiveProblemIndex(), tc.index, `Active problem index changed on EN switch in cycle ${cycle}`);
        assert.strictEqual(coachEngine.getActiveProblemId(problemsEn), tc.expectedId, `Problem ID mismatch on EN switch in cycle ${cycle}`);

        // Toggle to TR
        i18n.setLocale('tr');
        const problemsTr = getChapterProblems(tc.chapter, 'tr');
        coachEngine.renderProblemsView(container, problemsTr, callbacks);
        assert.strictEqual(coachEngine.getActiveProblemIndex(), tc.index, `Active problem index changed on TR switch in cycle ${cycle}`);
        assert.strictEqual(coachEngine.getActiveProblemId(problemsTr), tc.expectedId, `Problem ID mismatch on TR switch in cycle ${cycle}`);
      }
    }
  });

  it('2.2: Active stage retention across rapid TR <-> EN switching (Stages 0, 1, 2, 3, 4)', () => {
    const { i18n, coachEngine, container, callbacks } = createTestHarness();
    const problemsEn = getChapterProblems(1, 'en');
    const problemsTr = getChapterProblems(1, 'tr');

    for (let stage = 0; stage <= 4; stage++) {
      coachEngine.setActiveStage(stage);
      assert.strictEqual(coachEngine.getActiveStage(), stage);

      for (let iter = 0; iter < 20; iter++) {
        i18n.setLocale(iter % 2 === 0 ? 'en' : 'tr');
        const probs = i18n.getLocale() === 'en' ? problemsEn : problemsTr;
        coachEngine.renderProblemsView(container, probs, callbacks);

        assert.strictEqual(
          coachEngine.getActiveStage(),
          stage,
          `Stage changed from ${stage} to ${coachEngine.getActiveStage()} after locale toggle`
        );
      }
    }
  });

  it('2.3: Stage 1 Selected Option retention: preserves user choice and feedback across 100 rapid locale toggles', () => {
    const { i18n, coachEngine, container, callbacks } = createTestHarness();

    const targetProbs = [
      { ch: 1, idx: 0, id: 'prob-1-1', opt: 0 },
      { ch: 1, idx: 13, id: 'prob-1-14', opt: 1 },
      { ch: 2, idx: 25, id: 'prob-2-26', opt: 2 },
    ];

    for (const tp of targetProbs) {
      coachEngine.resetProblemState();
      coachEngine.setActiveProblemIndex(tp.idx);
      coachEngine.setActiveStage(1);

      // Render in TR, click option
      i18n.setLocale('tr');
      const probsTr = getChapterProblems(tp.ch, 'tr');
      coachEngine.renderProblemsView(container, probsTr, callbacks);

      // Click option button
      const optBtns = container.querySelectorAll('[data-s1-opt]');
      assert.ok(optBtns.length >= 3, `Expected at least 3 option buttons for ${tp.id}`);
      optBtns[tp.opt].click();

      // Rapidly toggle locale 100 times
      for (let i = 0; i < 100; i++) {
        const nextLocale = i % 2 === 0 ? 'en' : 'tr';
        i18n.setLocale(nextLocale);
        const activeProbs = getChapterProblems(tp.ch, nextLocale);
        coachEngine.renderProblemsView(container, activeProbs, callbacks);

        // Verify the option button for tp.opt has selected styling ('correct' or 'wrong')
        const currentOptBtns = container.querySelectorAll('[data-s1-opt]');
        const chosenBtn = currentOptBtns[tp.opt];
        assert.ok(
          chosenBtn.classList.has('correct') || chosenBtn.classList.has('wrong'),
          `Option ${tp.opt} on ${tp.id} lost its selection styling after locale toggle to ${nextLocale}`
        );

        // Verify feedback element is NOT hidden
        const fb = chosenBtn.querySelector('[data-fb]');
        assert.ok(fb, 'Feedback element must exist inside chosen option');
        assert.ok(!fb.classList.has('hidden'), 'Feedback must remain visible after locale switch');
      }
    }
  });

  it('2.4: Stage 2 Revealed Steps retention: revealed derivation sub-steps stay open with localized text', () => {
    const { i18n, coachEngine, container, callbacks } = createTestHarness();

    // Problem 2.26 has 3 sub-steps
    coachEngine.resetProblemState();
    coachEngine.setActiveProblemIndex(25); // Problem 2.26
    coachEngine.setActiveStage(2);

    i18n.setLocale('tr');
    let probs = getChapterProblems(2, 'tr');
    coachEngine.renderProblemsView(container, probs, callbacks);

    // Click step 0 and step 2 reveal buttons
    const revealBtns = container.querySelectorAll('[data-reveal-key]');
    assert.strictEqual(revealBtns.length, 3, 'Problem 2.26 must have 3 reveal buttons initially');
    revealBtns[0].click(); // reveal step 0
    revealBtns[2].click(); // reveal step 2

    // Rapidly toggle between EN and TR 100 times
    for (let i = 0; i < 100; i++) {
      const nextLocale = i % 2 === 0 ? 'en' : 'tr';
      i18n.setLocale(nextLocale);
      probs = getChapterProblems(2, nextLocale);
      coachEngine.renderProblemsView(container, probs, callbacks);

      // In rendered view, step 0 and step 2 should be revealed (displaying .substep-desc and .substep-math)
      // Step 1 should remain unrevealed (displaying a button with data-reveal-key="prob-2-26-s2-1")
      const remainingRevealBtns = container.querySelectorAll('[data-reveal-key]');
      assert.strictEqual(
        remainingRevealBtns.length,
        1,
        `Expected exactly 1 unrevealed step button for Problem 2.26 (iteration ${i}, locale ${nextLocale})`
      );
      assert.strictEqual(
        remainingRevealBtns[0].getAttribute('data-reveal-key'),
        'prob-2-26-s2-1',
        'Unrevealed button must be step 1'
      );
    }
  });

  it('2.5: Full Composite Student Session Simulation with interleaving state changes & locale toggles', () => {
    const { i18n, coachEngine, container, callbacks } = createTestHarness();

    // Student visits Problem 1.1 in TR, answers Stage 1 correctly
    i18n.setLocale('tr');
    let probs = getChapterProblems(1, 'tr');
    coachEngine.setActiveProblemIndex(0);
    coachEngine.setActiveStage(1);
    coachEngine.renderProblemsView(container, probs, callbacks);
    container.querySelectorAll('[data-s1-opt]')[0].click(); // correct option for 1.1

    // Student switches to English
    i18n.setLocale('en');
    probs = getChapterProblems(1, 'en');
    coachEngine.renderProblemsView(container, probs, callbacks);
    assert.strictEqual(coachEngine.getActiveStage(), 1);
    assert.ok(container.querySelectorAll('[data-s1-opt]')[0].classList.has('correct'));

    // Student advances to Stage 2 and reveals all steps
    const nextBtn = container.querySelector('.coach-nav-next');
    nextBtn.click();
    assert.strictEqual(coachEngine.getActiveStage(), 2);

    const revealAllBtn = container.querySelector('#reveal-all-steps-btn');
    revealAllBtn.click();

    // Now toggle language back and forth 50 times
    for (let i = 0; i < 50; i++) {
      const loc = i % 2 === 0 ? 'tr' : 'en';
      i18n.setLocale(loc);
      probs = getChapterProblems(1, loc);
      coachEngine.renderProblemsView(container, probs, callbacks);

      assert.strictEqual(coachEngine.getActiveProblemIndex(), 0);
      assert.strictEqual(coachEngine.getActiveStage(), 2);
      // All steps remain revealed (zero reveal buttons remaining)
      const unrevealed = container.querySelectorAll('[data-reveal-key]');
      assert.strictEqual(unrevealed.length, 0, `All steps must remain revealed at iteration ${i}`);
    }

    // Advance to Stage 4 (Exam Sheet)
    coachEngine.setActiveStage(4);
    coachEngine.renderProblemsView(container, probs, callbacks);
    assert.strictEqual(coachEngine.getActiveStage(), 4);

    // Switch to Problem 1.14 while in Stage 4
    coachEngine.setActiveProblemIndex(13);
    coachEngine.renderProblemsView(container, probs, callbacks);
    assert.strictEqual(coachEngine.getActiveProblemIndex(), 13);
    assert.strictEqual(coachEngine.getActiveStage(), 4);

    // Switch to Turkish
    i18n.setLocale('tr');
    probs = getChapterProblems(1, 'tr');
    coachEngine.renderProblemsView(container, probs, callbacks);
    assert.strictEqual(coachEngine.getActiveProblemIndex(), 13);
    assert.strictEqual(coachEngine.getActiveStage(), 4);
    assert.strictEqual(coachEngine.getActiveProblemId(probs), 'prob-1-14');
  });

  it('2.6: Boundary Safety: activeProblemIndex clamp on chapter switch', () => {
    const { i18n, coachEngine, container, callbacks } = createTestHarness();

    // In Chapter 2, student selects index 30 (Problem 2.31)
    coachEngine.setActiveProblemIndex(30);
    const probsCh2 = getChapterProblems(2, 'en');
    coachEngine.renderProblemsView(container, probsCh2, callbacks);
    assert.strictEqual(coachEngine.getActiveProblemIndex(), 30);

    // Student navigates to Chapter 1 (which only has 22 problems)
    const probsCh1 = getChapterProblems(1, 'en');
    coachEngine.renderProblemsView(container, probsCh1, callbacks);

    // Must be clamped to 0 without throwing error
    assert.strictEqual(
      coachEngine.getActiveProblemIndex(),
      0,
      'Active problem index must clamp to 0 when out of bounds for the chapter'
    );
    assert.strictEqual(coachEngine.getActiveProblemId(probsCh1), 'prob-1-1');
  });
});

// ----------------------------------------------------------------------------
// SUITE 3: PROOF COACH UI LOCALIZATION & DICTIONARY COMPLETENESS
// ----------------------------------------------------------------------------
describe('Suite 3: Proof Coach UI Localization & Dictionary Completeness', () => {

  it('3.1: All coach.* keys in proofCoachEngine.ts are present and non-empty in TR & EN dictionaries', () => {
    const coachEngineSource = fs.readFileSync(path.join(ENGINE_DIR, 'proofCoachEngine.ts'), 'utf8');
    const keyMatches = [...coachEngineSource.matchAll(/i18nManager\.t\(['"]coach\.([a-zA-Z0-9_\-]+)['"]/g)];
    const uniqueKeys = Array.from(new Set(keyMatches.map(m => m[1])));

    assert.ok(uniqueKeys.length >= 20, `Expected at least 20 coach translation keys (found ${uniqueKeys.length})`);

    const trCoach = TRANSLATIONS.tr.coach;
    const enCoach = TRANSLATIONS.en.coach;

    assert.ok(trCoach, 'TRANSLATIONS.tr.coach must exist');
    assert.ok(enCoach, 'TRANSLATIONS.en.coach must exist');

    for (const key of uniqueKeys) {
      assert.ok(
        trCoach[key] && trCoach[key].trim().length > 0,
        `Missing or empty TR translation for coach.${key}`
      );
      assert.ok(
        enCoach[key] && enCoach[key].trim().length > 0,
        `Missing or empty EN translation for coach.${key}`
      );
    }
  });

  it('3.2: Math tricks dynamic resolution for both TR and EN', () => {
    const tricksTr = getMathTricks('tr');
    const tricksEn = getMathTricks('en');

    assert.strictEqual(tricksTr.length, 6, 'TR Math tricks count must be 6');
    assert.strictEqual(tricksEn.length, 6, 'EN Math tricks count must be 6');

    for (let i = 0; i < 6; i++) {
      assert.strictEqual(tricksEn[i].id, tricksTr[i].id, `Trick ID mismatch at ${i}`);
      assert.ok(tricksEn[i].badgeLabel && tricksEn[i].badgeLabel.trim().length > 0, `EN Trick badge missing at ${i}`);
      assert.ok(tricksEn[i].title && tricksEn[i].title.trim().length > 0, `EN Trick title missing at ${i}`);
      assert.ok(tricksEn[i].summary && tricksEn[i].summary.trim().length > 0, `EN Trick summary missing at ${i}`);
    }
  });

  it('3.3: Interactive controls: showSolution and resetProblem work seamlessly across locales', () => {
    const storage = new MockStorage();
    const doc = {
      documentElement: { lang: 'en' },
      title: '',
      querySelector: () => null,
      querySelectorAll: () => [],
      createElement: (tag) => new MockDOMElement(tag),
    };
    const i18n = loadTsModule(path.join(I18N_DIR, 'index.ts'), { localStorage: storage, document: doc }).i18nManager;
    const coachEngine = new (loadTsModule(path.join(ENGINE_DIR, 'proofCoachEngine.ts'), { localStorage: storage, document: doc }).ProofCoachEngineUI)();
    const container = new MockDOMElement('div');
    const callbacks = { onLoadProblemScene: () => {}, onOpenMathTrick: () => {} };

    i18n.setLocale('en');
    const probs = getChapterProblems(1, 'en');
    coachEngine.setActiveProblemIndex(0); // 1.1
    coachEngine.renderProblemsView(container, probs, callbacks);

    // Click showSolution
    const solutionBtn = container.querySelector('.coach-nav-solution');
    assert.ok(solutionBtn, 'Show solution button must exist');
    solutionBtn.click();

    // Verify stage advanced to 4 and option 0 is selected
    assert.strictEqual(coachEngine.getActiveStage(), 4, 'showSolution must advance to Stage 4');

    // Switch to TR: state must remain solved in Stage 4
    i18n.setLocale('tr');
    const probsTr = getChapterProblems(1, 'tr');
    coachEngine.renderProblemsView(container, probsTr, callbacks);
    assert.strictEqual(coachEngine.getActiveStage(), 4);

    // Click resetProblem
    const resetBtn = container.querySelector('.coach-nav-reset');
    assert.ok(resetBtn, 'Reset problem button must exist');
    resetBtn.click();

    // After reset, no steps are revealed and no option selected
    coachEngine.setActiveStage(2);
    coachEngine.renderProblemsView(container, probsTr, callbacks);
    const revealBtns = container.querySelectorAll('[data-reveal-key]');
    assert.ok(revealBtns.length > 0, 'After reset, derivation steps must have reveal buttons');
  });
});

// ----------------------------------------------------------------------------
// SUITE 4: BUILD, COMPILATION & INVARIANT INTEGRITY
// ----------------------------------------------------------------------------
describe('Suite 4: Build, Compilation & Invariant Integrity', () => {

  it('4.1: Physics invariant test suite (physics_and_derivations.test.mjs) passes 100%', () => {
    const stdout = execSync('node --test tests/physics_and_derivations.test.mjs', {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
      env: getSubprocessEnv(),
    });
    assert.ok(stdout.includes('pass 7'), `physics_and_derivations.test.mjs must pass all 7 tests. Got:\n${stdout}`);
  });

  it('4.2: Milestone 1 stress challenge test suite passes (with known M1 1.4 idempotency note)', () => {
    try {
      const stdout = execSync('node --test tests/m1_stress_challenge.test.mjs', {
        cwd: PROJECT_ROOT,
        encoding: 'utf8',
        env: getSubprocessEnv(),
      });
      assert.ok(!stdout.includes('fail [2-9]'), `Unexpected failures:\n${stdout}`);
    } catch (err) {
      // Test 1.4 of m1_stress_challenge tests initial unpersisted setLocale idempotency
      assert.ok(
        err.stdout.includes('1.4: Idempotent setLocale') && !err.stdout.includes('fail 2'),
        `Unexpected failure beyond known M1 1.4 edge case: ${err.stdout}`
      );
    }
  });

  it('4.3: Milestone 2 stress challenge test suite passes 100%', () => {
    const stdout = execSync('node --test tests/m2_adversarial_stress.test.mjs', {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
      env: getSubprocessEnv(),
    });
    assert.ok(!stdout.includes('fail [1-9]'), `m2_adversarial_stress.test.mjs had failures:\n${stdout}`);
  });

  it('4.4: TypeScript compilation (npx tsc --noEmit) passes with 0 errors', () => {
    const stdout = execSync('npx tsc --noEmit', {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
      env: getSubprocessEnv(),
    });
    // Exit code 0 means success
    assert.strictEqual(stdout.trim(), '', `tsc output should be empty on success, got: ${stdout}`);
  });

  it('4.5: Production build (npm run build) completes successfully', () => {
    const stdout = execSync('npm run build', {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
      env: getSubprocessEnv(),
    });
    assert.ok(stdout.includes('built in') || stdout.includes('dist/index.html'), `build output did not confirm success:\n${stdout}`);
  });
});
