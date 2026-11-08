/**
 * ============================================================================
 * EMPIRICAL ADVERSARIAL STRESS TEST SUITE: MILESTONE 2
 * Berkeley Waves Interactive Laboratory — Theory Modules & Derivation Engine i18n
 *
 * Challenger: challenger_m2_2 (Stress Challenger)
 * Focus:
 *  1. Locale switching stress: rapid switching (1000x), fuzzing, invalid inputs,
 *     localStorage failure resilience, listener error isolation.
 *  2. Data scanning: forbidden characters (unicode subscripts in LaTeX, control chars,
 *     mojibake), empty strings, and placeholder tokens (TODO, TBD, FIXME) across src/data/*.
 *  3. Fundamental equations validation: formulaLatex & latex dual-property presence,
 *     TR vs EN formula parity, non-empty localized labels, and KaTeX compilation.
 *  4. Theory modules, derivations, tricks & roadmap structural integrity.
 *  5. Build & baseline test verification.
 *
 * Runner command:
 *   node --test tests/m2_adversarial_stress.test.mjs
 * ============================================================================
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import ts from 'typescript';
import katexMod from 'katex';

const katex = katexMod.default || katexMod;

const PROJECT_ROOT = path.resolve(import.meta.dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');
const DATA_DIR = path.join(SRC_DIR, 'data');
const I18N_DIR = path.join(SRC_DIR, 'i18n');

// ----------------------------------------------------------------------------
// TEST HARNESS UTILITIES & MOCKS
// ----------------------------------------------------------------------------

class MockStorage {
  constructor(initial = {}) {
    this.store = new Map(Object.entries(initial));
    this.throwOnGet = false;
    this.throwOnSet = false;
    this.setCallCount = 0;
  }
  getItem(k) {
    if (this.throwOnGet) throw new Error('SecurityError: Access Denied');
    return this.store.has(k) ? this.store.get(k) : null;
  }
  setItem(k, v) {
    this.setCallCount++;
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
    },
  });

  const mod = { exports: {} };
  const customRequire = (reqPath) => {
    if (reqPath.startsWith('.')) {
      let resolved = path.resolve(path.dirname(absPath), reqPath);
      if (!fs.existsSync(resolved) && fs.existsSync(resolved + '.ts')) resolved += '.ts';
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
    querySelector(sel) {
      if (sel.includes('meta[name="description"]')) {
        return {
          setAttribute(k, v) { this[k] = v; },
          getAttribute(k) { return this[k]; },
        };
      }
      return null;
    },
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
// SUITE 1: LOCALE SWITCHING STRESS, CONCURRENCY & ADVERSARIAL INPUTS
// ----------------------------------------------------------------------------
describe('Suite 1: Locale Switching Stress, Concurrency & Adversarial Inputs', () => {

  it('1.1: Rapid back-and-forth toggling (1,000 iterations tr <-> en)', () => {
    const mockStorage = new MockStorage();
    const mockDoc = {
      documentElement: { lang: 'tr' },
      title: '',
      querySelector: () => ({ setAttribute() {} }),
    };
    const i18nMod = loadTsModule('src/i18n/index.ts', {
      localStorage: mockStorage,
      document: mockDoc,
    });
    const manager = new i18nMod.I18nManager();

    let notificationCount = 0;
    manager.subscribe((locale) => {
      notificationCount++;
      assert.ok(locale === 'tr' || locale === 'en');
    });

    for (let i = 0; i < 1000; i++) {
      const targetLocale = i % 2 === 0 ? 'en' : 'tr';
      manager.setLocale(targetLocale);
      assert.equal(manager.getLocale(), targetLocale);
      assert.equal(mockStorage.getItem('berkeley_dalgalar_lang'), targetLocale);
      assert.equal(mockDoc.documentElement.lang, targetLocale);
    }

    assert.equal(manager.getLocale(), 'tr');
    assert.equal(notificationCount, 1000);
  });

  it('1.2: Random fuzzing burst (500 random switches) converges to last set locale', () => {
    const mockStorage = new MockStorage();
    const i18nMod = loadTsModule('src/i18n/index.ts', { localStorage: mockStorage });
    const manager = new i18nMod.I18nManager();

    const sequence = [];
    for (let i = 0; i < 500; i++) {
      const choice = Math.random() < 0.5 ? 'tr' : 'en';
      sequence.push(choice);
      manager.setLocale(choice);
    }

    const expectedLast = sequence[sequence.length - 1];
    assert.equal(manager.getLocale(), expectedLast);
    assert.equal(mockStorage.getItem('berkeley_dalgalar_lang'), expectedLast);
  });

  it('1.3: Redundant calls suppression (setting identical locale does not notify or re-write)', () => {
    const mockStorage = new MockStorage();
    const i18nMod = loadTsModule('src/i18n/index.ts', { localStorage: mockStorage });
    const manager = new i18nMod.I18nManager();

    // Default is 'tr', set it once to sync storage
    manager.setLocale('tr');
    const initialSetCount = mockStorage.setCallCount;

    let triggerCount = 0;
    manager.subscribe(() => {
      triggerCount++;
    });

    // Call setLocale('tr') 50 times redundantly
    for (let i = 0; i < 50; i++) {
      manager.setLocale('tr');
    }

    assert.equal(triggerCount, 0, 'Redundant setLocale must not fire subscriber listeners');
    assert.equal(mockStorage.setCallCount, initialSetCount, 'Redundant setLocale must not invoke storage.setItem');
  });

  it('1.4: Adversarial & invalid input fuzzing (graceful fallback to "tr")', () => {
    const mockStorage = new MockStorage();
    const i18nMod = loadTsModule('src/i18n/index.ts', { localStorage: mockStorage });
    const manager = new i18nMod.I18nManager();

    // First switch to 'en'
    manager.setLocale('en');
    assert.equal(manager.getLocale(), 'en');

    const adversarialInputs = [
      '',
      'fr',
      'de',
      'es',
      'ru',
      'zh',
      null,
      undefined,
      123,
      -1,
      0,
      NaN,
      {},
      [],
      { locale: 'en' },
      ['en'],
      () => 'en',
      'TR',
      'EN',
      'tr-TR',
      'en-US',
      'en-GB',
      '__proto__',
      'constructor',
      'toString',
      '<script>alert("xss")</script>',
      'tr\u0000',
      'en\n',
      ' '.repeat(100),
      'a'.repeat(10000),
    ];

    for (const badInput of adversarialInputs) {
      assert.doesNotThrow(() => {
        manager.setLocale(badInput);
      }, `setLocale must never throw when passed: ${String(badInput)}`);

      // All invalid locales must normalize to 'tr'
      assert.equal(manager.getLocale(), 'tr', `Invalid input ${String(badInput)} must fall back to 'tr'`);
      assert.equal(mockStorage.getItem('berkeley_dalgalar_lang'), 'tr');
    }
  });

  it('1.5: LocalStorage hostile environment (SecurityError & QuotaExceededError handling)', () => {
    // Scenario A: getItem throws SecurityError in constructor
    const restrictedStorage = new MockStorage();
    restrictedStorage.throwOnGet = true;
    const i18nModA = loadTsModule('src/i18n/index.ts', { localStorage: restrictedStorage });

    let managerA;
    assert.doesNotThrow(() => {
      managerA = new i18nModA.I18nManager();
    }, 'Constructor must catch storage SecurityError gracefully');
    assert.equal(managerA.getLocale(), 'tr', 'Default locale must safely be "tr" on SecurityError');

    // Scenario B: setItem throws QuotaExceededError
    const fullStorage = new MockStorage();
    fullStorage.throwOnSet = true;
    const i18nModB = loadTsModule('src/i18n/index.ts', { localStorage: fullStorage });
    const managerB = new i18nModB.I18nManager();

    let notifiedLocale = null;
    managerB.subscribe((loc) => { notifiedLocale = loc; });

    assert.doesNotThrow(() => {
      managerB.setLocale('en');
    }, 'setLocale must not throw if setItem raises QuotaExceededError');
    assert.equal(managerB.getLocale(), 'en', 'In-memory locale must still update to "en"');
    assert.equal(notifiedLocale, 'en', 'Listeners must still be notified on quota error');

    // Scenario C: LocalStorage pre-seeded with corrupt JSON
    const corruptStorage = new MockStorage({
      berkeley_dalgalar_lang: '{"locale":"corrupt","hack":true}',
    });
    const i18nModC = loadTsModule('src/i18n/index.ts', { localStorage: corruptStorage });
    const managerC = new i18nModC.I18nManager();
    assert.equal(managerC.getLocale(), 'tr', 'Corrupted localStorage value must fall back to "tr"');
  });

  it('1.6: Subscriber listener fault isolation & safe unsubscribe', () => {
    const mockStorage = new MockStorage();
    const i18nMod = loadTsModule('src/i18n/index.ts', { localStorage: mockStorage });
    const manager = new i18nMod.I18nManager();

    let listener1Called = false;
    let listener3Called = false;

    // Listener 1: Normal
    manager.subscribe(() => { listener1Called = true; });

    // Listener 2: Throws uncaught exception
    const unsub2 = manager.subscribe(() => {
      throw new Error('Hostile subscriber error');
    });

    // Listener 3: Must still execute despite Listener 2 throwing
    manager.subscribe(() => { listener3Called = true; });

    // Temporarily suppress console.error during expected listener failure
    const originalConsoleError = console.error;
    console.error = () => {};
    try {
      assert.doesNotThrow(() => {
        manager.setLocale('en');
      });
    } finally {
      console.error = originalConsoleError;
    }

    assert.equal(listener1Called, true, 'Listener 1 must have been called');
    assert.equal(listener3Called, true, 'Listener 3 must be called despite Listener 2 failure');

    // Unsubscribe the throwing listener before subsequent tests
    unsub2();

    // Test unsubscribe on a regular listener
    let unsubCallCount = 0;
    const unsubscribe = manager.subscribe(() => { unsubCallCount++; });
    manager.setLocale('tr');
    assert.equal(unsubCallCount, 1);

    unsubscribe();
    manager.setLocale('en');
    assert.equal(unsubCallCount, 1, 'Unsubscribed listener must never be invoked again');
  });

  it('1.7: Translation interpolation stress (params handling & key fallback)', () => {
    const i18nMod = loadTsModule('src/i18n/index.ts');
    const manager = new i18nMod.I18nManager();

    // 1. Missing key
    assert.equal(manager.t('non.existent.deeply.nested.key'), 'non.existent.deeply.nested.key');

    // 2. Special regex characters in param values
    manager.setLocale('en');
    const templateKey = 'shell.pageTitle';
    const originalTitle = manager.t(templateKey);
    assert.ok(typeof originalTitle === 'string' && originalTitle.length > 0);

    // Test with undefined/null/numeric params
    const resWithBadParams = manager.t('shell.pageTitle', {
      foo: null,
      bar: undefined,
      num: 0,
      regex: '$1$$$`',
    });
    assert.ok(typeof resWithBadParams === 'string');
  });
});

// ----------------------------------------------------------------------------
// SUITE 2: EXHAUSTIVE DATA SCANNING ACROSS ALL FILES IN SRC/DATA/
// ----------------------------------------------------------------------------
describe('Suite 2: Exhaustive Data Scanning Across All Files in src/data/', () => {
  const dataFiles = [
    'chapter1Modules.ts',
    'chapter1ModulesEn.ts',
    'chapter1Problems.ts',
    'chapter2Modules.ts',
    'chapter2ModulesEn.ts',
    'chapter2Problems.ts',
    'index.ts',
    'mathTricksData.ts',
    'mathTricksDataEn.ts',
    'roadmapChapters.ts',
    'roadmapChaptersEn.ts',
  ];

  it('2.1: File inventory: All 11 expected data files exist in src/data/', () => {
    for (const file of dataFiles) {
      const fullPath = path.join(DATA_DIR, file);
      assert.ok(fs.existsSync(fullPath), `Required data file missing: ${file}`);
    }
  });

  it('2.2: Forbidden character scan: ZERO Unicode subscripts [₀₁₂₃₄₅₆₇₈₉] in any LaTeX formula field', () => {
    const latexFieldRegex =
      /(?:latex|formulaLatex|mainEquationLatex|latexBadge|coreIdentityLatex|governingEquationLatex|givenLatex|targetLatex|optCorrect|optWrong1|optWrong2|math|finalBoxed|mathLatex|stepsLatex)\s*:\s*\n?\s*'((?:\\'|[^'])*)'/g;

    const violations = [];
    for (const file of dataFiles) {
      const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
      let m;
      while ((m = latexFieldRegex.exec(content)) !== null) {
        const raw = m[1].replace(/\\\\/g, '\\').replace(/\\'/g, "'");
        if (/[₀₁₂₃₄₅₆₇₈₉]/.test(raw)) {
          violations.push({ file, raw });
        }
      }
    }

    assert.deepEqual(violations, [], `Unicode subscripts forbidden in LaTeX formulas:\n${JSON.stringify(violations, null, 2)}`);
  });

  it('2.3: Forbidden character scan: ZERO unprintable control characters across all data files', () => {
    const controlCharRegex = /[\x00-\x08\x0B\x0C\x0E-\x1F]/;
    const violations = [];

    for (const file of dataFiles) {
      const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
      if (controlCharRegex.test(content)) {
        violations.push(file);
      }
    }

    assert.deepEqual(violations, [], `Unprintable control characters found in: ${violations.join(', ')}`);
  });

  it('2.4: Forbidden character scan: ZERO mojibake / encoding corruption artifacts across all data files', () => {
    const mojibakeRegex = /[\ufffd]|Ã§|ÄŸ|ÅŸ|Ã¼|Ã¶|Ä±|Ã‡|Äž|Åž|Ãœ|Ã–|Ä°|â€™/;
    const violations = [];

    for (const file of dataFiles) {
      const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
      if (mojibakeRegex.test(content)) {
        violations.push(file);
      }
    }

    assert.deepEqual(violations, [], `Mojibake / encoding corruption found in: ${violations.join(', ')}`);
  });

  it('2.5: Placeholder token scan: ZERO "TODO", "TBD", "FIXME", "PLACEHOLDER" tokens in M2 theory datasets', () => {
    const m2Files = [
      'chapter1Modules.ts',
      'chapter1ModulesEn.ts',
      'chapter2Modules.ts',
      'chapter2ModulesEn.ts',
      'mathTricksData.ts',
      'mathTricksDataEn.ts',
      'roadmapChapters.ts',
      'roadmapChaptersEn.ts',
    ];

    const placeholderRegex = /\b(TODO|TBD|FIXME|PLACEHOLDER|UNDONE)\b/i;
    const violations = [];

    for (const file of m2Files) {
      const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (placeholderRegex.test(line)) {
          violations.push({ file, line: idx + 1, content: line.trim() });
        }
      });
    }

    assert.deepEqual(violations, [], `Placeholder tokens detected in M2 data files:\n${JSON.stringify(violations, null, 2)}`);
  });

  it('2.6: Structural data scan: ZERO empty strings or whitespace-only strings in exported M2 datasets', () => {
    const dataMod = loadTsModule('src/data/index.ts');

    const emptyStringViolations = [];

    function checkObject(obj, currentPath) {
      if (obj == null) return;
      if (typeof obj === 'string') {
        if (obj.trim() === '') {
          emptyStringViolations.push({ path: currentPath, value: obj });
        }
        if (/\b(TODO|TBD|FIXME)\b/i.test(obj)) {
          emptyStringViolations.push({ path: currentPath, value: obj, reason: 'PLACEHOLDER' });
        }
      } else if (Array.isArray(obj)) {
        obj.forEach((item, idx) => checkObject(item, `${currentPath}[${idx}]`));
      } else if (typeof obj === 'object') {
        for (const [key, val] of Object.entries(obj)) {
          checkObject(val, `${currentPath}.${key}`);
        }
      }
    }

    checkObject(dataMod.CHAPTER_1_MODULES, 'Ch1_TR');
    checkObject(dataMod.CHAPTER_1_MODULES_EN, 'Ch1_EN');
    checkObject(dataMod.CHAPTER_2_MODULES, 'Ch2_TR');
    checkObject(dataMod.CHAPTER_2_MODULES_EN, 'Ch2_EN');
    checkObject(dataMod.MATH_TRICKS, 'Tricks_TR');
    checkObject(dataMod.MATH_TRICKS_EN, 'Tricks_EN');
    checkObject(dataMod.ROADMAP_CHAPTERS, 'Roadmap_TR');
    checkObject(dataMod.ROADMAP_CHAPTERS_EN, 'Roadmap_EN');

    assert.deepEqual(emptyStringViolations, [], `Empty strings or placeholders found in data objects:\n${JSON.stringify(emptyStringViolations, null, 2)}`);
  });
});

// ----------------------------------------------------------------------------
// SUITE 3: FORMULALATEX ON FUNDAMENTALEQUATIONS PARITY & KATEX VALIDATION
// ----------------------------------------------------------------------------
describe('Suite 3: formulaLatex on fundamentalEquations Parity & KaTeX Validation', () => {
  const dataMod = loadTsModule('src/data/index.ts');
  const ch1Tr = dataMod.CHAPTER_1_MODULES;
  const ch1En = dataMod.CHAPTER_1_MODULES_EN;
  const ch2Tr = dataMod.CHAPTER_2_MODULES;
  const ch2En = dataMod.CHAPTER_2_MODULES_EN;

  it('3.1: Chapter 1: formulaLatex and latex are both non-empty, identical, and match TR vs EN 1:1', () => {
    assert.equal(ch1Tr.length, 5, 'Chapter 1 TR must have 5 modules');
    assert.equal(ch1En.length, 5, 'Chapter 1 EN must have 5 modules');

    let totalEquations = 0;

    for (let m = 0; m < ch1Tr.length; m++) {
      const modTr = ch1Tr[m];
      const modEn = ch1En[m];

      assert.equal(modTr.id, modEn.id, `Module ID match for index ${m}`);
      assert.ok(Array.isArray(modTr.fundamentalEquations) && modTr.fundamentalEquations.length > 0);
      assert.equal(
        modTr.fundamentalEquations.length,
        modEn.fundamentalEquations.length,
        `fundamentalEquations count mismatch in Ch1 ${modTr.id}`
      );

      for (let eq = 0; eq < modTr.fundamentalEquations.length; eq++) {
        totalEquations++;
        const eqTr = modTr.fundamentalEquations[eq];
        const eqEn = modEn.fundamentalEquations[eq];

        // 1. formulaLatex presence & non-empty
        assert.ok(typeof eqTr.formulaLatex === 'string' && eqTr.formulaLatex.trim().length > 0, `Ch1 TR ${modTr.id} eq ${eq} must have non-empty formulaLatex`);
        assert.ok(typeof eqEn.formulaLatex === 'string' && eqEn.formulaLatex.trim().length > 0, `Ch1 EN ${modEn.id} eq ${eq} must have non-empty formulaLatex`);

        // 2. latex presence & non-empty (backward compatibility)
        assert.ok(typeof eqTr.latex === 'string' && eqTr.latex.trim().length > 0, `Ch1 TR ${modTr.id} eq ${eq} must have non-empty latex`);
        assert.ok(typeof eqEn.latex === 'string' && eqEn.latex.trim().length > 0, `Ch1 EN ${modEn.id} eq ${eq} must have non-empty latex`);

        // 3. formulaLatex === latex within each record
        assert.equal(eqTr.formulaLatex.trim(), eqTr.latex.trim(), `Ch1 TR ${modTr.id} eq ${eq} formulaLatex must match latex`);
        assert.equal(eqEn.formulaLatex.trim(), eqEn.latex.trim(), `Ch1 EN ${modEn.id} eq ${eq} formulaLatex must match latex`);

        // 4. Parity: TR formula === EN formula
        assert.equal(
          eqEn.formulaLatex.trim(),
          eqTr.formulaLatex.trim(),
          `Ch1 ${modTr.id} eq ${eq} formulaLatex must be identical between TR and EN`
        );

        // 5. Localized metadata non-empty
        assert.ok(eqTr.label.trim().length > 0, 'TR equation label must be non-empty');
        assert.ok(eqEn.label.trim().length > 0, 'EN equation label must be non-empty');
        assert.ok(eqTr.colorNote.trim().length > 0, 'TR colorNote must be non-empty');
        assert.ok(eqEn.colorNote.trim().length > 0, 'EN colorNote must be non-empty');
      }
    }

    assert.equal(totalEquations, 12, 'Chapter 1 must have exactly 12 fundamental equations');
  });

  it('3.2: Chapter 2: formulaLatex and latex are both non-empty, identical, and match TR vs EN 1:1', () => {
    assert.equal(ch2Tr.length, 5, 'Chapter 2 TR must have 5 modules');
    assert.equal(ch2En.length, 5, 'Chapter 2 EN must have 5 modules');

    let totalEquations = 0;

    for (let m = 0; m < ch2Tr.length; m++) {
      const modTr = ch2Tr[m];
      const modEn = ch2En[m];

      assert.equal(modTr.id, modEn.id, `Module ID match for index ${m}`);
      assert.ok(Array.isArray(modTr.fundamentalEquations) && modTr.fundamentalEquations.length > 0);
      assert.equal(
        modTr.fundamentalEquations.length,
        modEn.fundamentalEquations.length,
        `fundamentalEquations count mismatch in Ch2 ${modTr.id}`
      );

      for (let eq = 0; eq < modTr.fundamentalEquations.length; eq++) {
        totalEquations++;
        const eqTr = modTr.fundamentalEquations[eq];
        const eqEn = modEn.fundamentalEquations[eq];

        // 1. formulaLatex presence & non-empty
        assert.ok(typeof eqTr.formulaLatex === 'string' && eqTr.formulaLatex.trim().length > 0, `Ch2 TR ${modTr.id} eq ${eq} must have non-empty formulaLatex`);
        assert.ok(typeof eqEn.formulaLatex === 'string' && eqEn.formulaLatex.trim().length > 0, `Ch2 EN ${modEn.id} eq ${eq} must have non-empty formulaLatex`);

        // 2. latex presence & non-empty
        assert.ok(typeof eqTr.latex === 'string' && eqTr.latex.trim().length > 0, `Ch2 TR ${modTr.id} eq ${eq} must have non-empty latex`);
        assert.ok(typeof eqEn.latex === 'string' && eqEn.latex.trim().length > 0, `Ch2 EN ${modEn.id} eq ${eq} must have non-empty latex`);

        // 3. formulaLatex === latex
        assert.equal(eqTr.formulaLatex.trim(), eqTr.latex.trim(), `Ch2 TR ${modTr.id} eq ${eq} formulaLatex must match latex`);
        assert.equal(eqEn.formulaLatex.trim(), eqEn.latex.trim(), `Ch2 EN ${modEn.id} eq ${eq} formulaLatex must match latex`);

        // 4. Parity: TR formula === EN formula
        assert.equal(
          eqEn.formulaLatex.trim(),
          eqTr.formulaLatex.trim(),
          `Ch2 ${modTr.id} eq ${eq} formulaLatex must be identical between TR and EN`
        );

        // 5. Localized metadata non-empty
        assert.ok(eqTr.label.trim().length > 0, 'TR equation label must be non-empty');
        assert.ok(eqEn.label.trim().length > 0, 'EN equation label must be non-empty');
        assert.ok(eqTr.colorNote.trim().length > 0, 'TR colorNote must be non-empty');
        assert.ok(eqEn.colorNote.trim().length > 0, 'EN colorNote must be non-empty');
      }
    }

    assert.equal(totalEquations, 10, 'Chapter 2 must have exactly 10 fundamental equations');
  });

  it('3.3: KaTeX compilation: All 22 fundamental equations compile without error in TR and EN', () => {
    const allModules = [...ch1Tr, ...ch1En, ...ch2Tr, ...ch2En];
    let compiledCount = 0;

    for (const mod of allModules) {
      for (const eq of mod.fundamentalEquations) {
        compiledCount++;
        assert.doesNotThrow(() => {
          katex.renderToString(eq.formulaLatex, { throwOnError: true, strict: false });
        }, `KaTeX failed on formulaLatex in ${mod.id}: ${eq.formulaLatex}`);

        assert.doesNotThrow(() => {
          katex.renderToString(eq.latex, { throwOnError: true, strict: false });
        }, `KaTeX failed on latex in ${mod.id}: ${eq.latex}`);
      }
    }

    assert.equal(compiledCount, 44, 'Total equations compiled (22 TR + 22 EN) must equal 44');
  });
});

// ----------------------------------------------------------------------------
// SUITE 4: THEORY DERIVATIONS, MATHEMATICAL TRICKS & ROADMAP INVARIANTS
// ----------------------------------------------------------------------------
describe('Suite 4: Theory Derivations, Mathematical Tricks & Roadmap Invariants', () => {
  const dataMod = loadTsModule('src/data/index.ts');

  it('4.1: Derivation steps count, IDs, and structure match 1:1 between TR and EN in Ch1 & Ch2', () => {
    const ch1Tr = dataMod.getChapterModules(1, 'tr');
    const ch1En = dataMod.getChapterModules(1, 'en');
    const ch2Tr = dataMod.getChapterModules(2, 'tr');
    const ch2En = dataMod.getChapterModules(2, 'en');

    let ch1StepsTotal = 0;
    let ch2StepsTotal = 0;

    for (let m = 0; m < 5; m++) {
      assert.equal(ch1Tr[m].derivationSteps.length, ch1En[m].derivationSteps.length, `Ch1 mod ${ch1Tr[m].id} step count mismatch`);
      for (let s = 0; s < ch1Tr[m].derivationSteps.length; s++) {
        ch1StepsTotal++;
        const sTr = ch1Tr[m].derivationSteps[s];
        const sEn = ch1En[m].derivationSteps[s];
        assert.equal(sTr.id, sEn.id, `Ch1 step ID mismatch at mod ${m} step ${s}`);
        assert.equal(sTr.algebraicBreakdown.length, sEn.algebraicBreakdown.length, `Breakdown length mismatch`);
        assert.ok(sEn.title.trim().length > 0);
        assert.ok(sEn.physicalMotivation.trim().length > 0);
      }
    }
    assert.equal(ch1StepsTotal, 9, 'Chapter 1 must have exactly 9 derivation steps');

    for (let m = 0; m < 5; m++) {
      assert.equal(ch2Tr[m].derivationSteps.length, ch2En[m].derivationSteps.length, `Ch2 mod ${ch2Tr[m].id} step count mismatch`);
      for (let s = 0; s < ch2Tr[m].derivationSteps.length; s++) {
        ch2StepsTotal++;
        const sTr = ch2Tr[m].derivationSteps[s];
        const sEn = ch2En[m].derivationSteps[s];
        assert.equal(sTr.id, sEn.id, `Ch2 step ID mismatch at mod ${m} step ${s}`);
        assert.equal(sTr.algebraicBreakdown.length, sEn.algebraicBreakdown.length, `Breakdown length mismatch`);
        assert.ok(sEn.title.trim().length > 0);
        assert.ok(sEn.physicalMotivation.trim().length > 0);
      }
    }
    assert.equal(ch2StepsTotal, 8, 'Chapter 2 must have exactly 8 derivation steps');
  });

  it('4.2: Mathematical Tricks: Exactly 6 tricks with matching IDs, identical coreIdentityLatex, and KaTeX rendering', () => {
    const trTricks = dataMod.getMathTricks('tr');
    const enTricks = dataMod.getMathTricks('en');

    assert.equal(trTricks.length, 6, 'Must have 6 Turkish math tricks');
    assert.equal(enTricks.length, 6, 'Must have 6 English math tricks');

    const canonicalIds = [
      'trick-taylor',
      'trick-phasor',
      'trick-determinant',
      'trick-trig-beats',
      'trick-separation',
      'trick-orthogonality',
    ];

    for (let i = 0; i < 6; i++) {
      assert.equal(trTricks[i].id, canonicalIds[i], `TR trick ${i} ID mismatch`);
      assert.equal(enTricks[i].id, canonicalIds[i], `EN trick ${i} ID mismatch`);

      // coreIdentityLatex parity
      assert.equal(
        enTricks[i].coreIdentityLatex.trim(),
        trTricks[i].coreIdentityLatex.trim(),
        `Trick ${canonicalIds[i]} coreIdentityLatex must match 1:1`
      );

      // KaTeX compilation
      assert.doesNotThrow(() => {
        katex.renderToString(enTricks[i].coreIdentityLatex, { throwOnError: true });
      }, `KaTeX failed on EN trick ${canonicalIds[i]}`);

      // English content non-empty and translated
      assert.ok(enTricks[i].title.trim().length > 0);
      assert.ok(enTricks[i].summary.trim().length > 0);
      assert.ok(enTricks[i].whenUsedInBerkeley.trim().length > 0);
      assert.notEqual(enTricks[i].title, trTricks[i].title, `Trick ${canonicalIds[i]} title must be translated`);
    }
  });

  it('4.3: Roadmap Chapters 3-9: All 7 chapters present in EN, pedagogical text non-empty, formulas compile in KaTeX', () => {
    const trRoadmap = dataMod.getRoadmapChapters('tr');
    const enRoadmap = dataMod.getRoadmapChapters('en');

    assert.equal(trRoadmap.length, 7, 'TR roadmap must have 7 chapters');
    assert.equal(enRoadmap.length, 7, 'EN roadmap must have 7 chapters');

    for (let i = 0; i < 7; i++) {
      const trCh = trRoadmap[i];
      const enCh = enRoadmap[i];

      assert.equal(trCh.chapterNumber, enCh.chapterNumber, `Roadmap chapter number mismatch at ${i}`);
      assert.equal(trCh.id, enCh.id, `Roadmap ID mismatch at ${i}`);
      assert.ok(enCh.title.trim().length > 0, `EN roadmap title missing for ch ${enCh.chapterNumber}`);
      assert.ok(enCh.coreTheme.trim().length > 0, `EN roadmap theme missing for ch ${enCh.chapterNumber}`);

      // Check key derivation cards
      assert.equal(trCh.keyDerivations.length, enCh.keyDerivations.length);
      for (let k = 0; k < trCh.keyDerivations.length; k++) {
        const kdTr = trCh.keyDerivations[k];
        const kdEn = enCh.keyDerivations[k];

        assert.ok(typeof kdEn.governingEquationLatex === 'string' && kdEn.governingEquationLatex.trim().length > 0);
        // KaTeX compilation check
        assert.doesNotThrow(() => {
          katex.renderToString(kdEn.governingEquationLatex, { throwOnError: true });
        }, `KaTeX error on roadmap ch ${enCh.chapterNumber} derivation ${k}: ${kdEn.governingEquationLatex}`);

        assert.doesNotThrow(() => {
          katex.renderToString(kdTr.governingEquationLatex, { throwOnError: true });
        }, `KaTeX error on TR roadmap ch ${trCh.chapterNumber} derivation ${k}: ${kdTr.governingEquationLatex}`);
      }
    }
  });
});

// ----------------------------------------------------------------------------
// SUITE 5: BUILD CLEANLINESS & TEST SUITE VERIFICATION
// ----------------------------------------------------------------------------
describe('Suite 5: Build Cleanliness & Baseline Test Suite Verification', () => {

  it('5.1: Baseline physics & derivation tests pass (npm test / 7 tests)', () => {
    const env = getSubprocessEnv();
    let output;
    assert.doesNotThrow(() => {
      output = execSync('npm test', { cwd: PROJECT_ROOT, env, encoding: 'utf8' });
    }, 'npm test must exit with code 0');

    assert.ok(output.includes('pass 7') || output.includes('✔ 7.'), 'npm test must report all 7 tests passing');
    assert.ok(!output.includes('fail [1-9]'), 'npm test must have zero failures');
  });

  it('5.2: TypeScript compilation and Vite build pass with zero errors (npm run build)', () => {
    const env = getSubprocessEnv();
    let output;
    assert.doesNotThrow(() => {
      output = execSync('npm run build', { cwd: PROJECT_ROOT, env, encoding: 'utf8' });
    }, 'npm run build must succeed');

    assert.ok(output.includes('built in') || output.includes('dist/index.html'), 'Vite production build must output bundle');
  });

  it('5.3: Milestone 2 features in e2e_i18n_and_deploy.test.mjs pass 100% (50/50 tests)', () => {
    const env = getSubprocessEnv();
    let output;
    assert.doesNotThrow(() => {
      output = execSync(
        'node --test --test-name-pattern="Feature 5|Feature 6|Feature 7|Feature 8|Feature 9" tests/e2e_i18n_and_deploy.test.mjs',
        { cwd: PROJECT_ROOT, env, encoding: 'utf8' }
      );
    }, 'M2 E2E tests must pass with exit code 0');

    assert.ok(output.includes('50 / 50 passed'), 'M2 E2E test suite must pass all 50 tests');
    assert.ok(output.includes('(0 failed)'), 'M2 E2E test suite must have 0 failures');
    assert.ok(!output.includes('✖'), 'M2 E2E test suite must not report failing test marks');
  });
});
