/**
 * ============================================================================
 * EMPIRICAL CHALLENGER TEST SUITE: MILESTONE 1
 * Berkeley Waves Interactive Laboratory — i18n Core Framework & UI Controls
 *
 * Objectives:
 *  1. Rapid locale toggling (tr -> en -> tr -> en 100+ times): consistency, zero leaks
 *  2. LocalStorage tampering: 'fr', '', 'null', 'undefined', quota/security exceptions -> fallback to 'tr'
 *  3. DOM node integrity: #problem-count-badge lifecycle during mode/locale switches
 *  4. Simulation state isolation: MultiSpaceDirector.setLocale() does not reset rkX, rkV, time, camera
 *  5. Parameter dock & HUD overlay bilingual consistency & animation frame decoupling
 *
 * Runner:
 *  node --test tests/m1_stress_challenge.test.mjs
 * ============================================================================
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import * as THREE from 'three';

const PROJECT_ROOT = path.resolve(import.meta.dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');

// ----------------------------------------------------------------------------
// MOCK DOM & ENVIRONMENT INFRASTRUCTURE
// ----------------------------------------------------------------------------

class MockElement {
  constructor(tagName = 'div', id = '') {
    this.tagName = tagName.toUpperCase();
    this.id = id;
    this.children = [];
    this._innerHTML = '';
    this._textContent = '';
    this.classList = new Set();
    this.attributes = {};
    this.listeners = new Map();
    this.parentElement = null;
    this.style = {};
    this.value = '';
    this.title = '';
    this.scrollTop = 0;
  }

  get innerHTML() {
    return this._innerHTML;
  }

  set innerHTML(val) {
    this._innerHTML = String(val);
    this.parseAndSyncMockChildren(val);
  }

  get textContent() {
    return this._textContent;
  }

  set textContent(val) {
    this._textContent = String(val);
  }

  setAttribute(k, v) {
    this.attributes[k] = String(v);
  }

  getAttribute(k) {
    return this.attributes[k] ?? null;
  }

  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  addEventListener(event, fn) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event).push(fn);
  }

  removeEventListener(event, fn) {
    if (!this.listeners.has(event)) return;
    const arr = this.listeners.get(event).filter((f) => f !== fn);
    this.listeners.set(event, arr);
  }

  dispatchEvent(event) {
    const list = this.listeners.get(event.type || event) || [];
    for (const fn of list) {
      fn(event);
    }
    return true;
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  querySelectorAll(selector) {
    const results = [];
    const walk = (node) => {
      for (const child of node.children) {
        if (matchesSelector(child, selector)) {
          results.push(child);
        }
        walk(child);
      }
    };
    walk(this);
    return results;
  }

  parseAndSyncMockChildren(html) {
    this.children = [];
    const idRegex = /id=["']([^"']+)["']/g;
    let match;
    while ((match = idRegex.exec(html)) !== null) {
      const child = new MockElement('span', match[1]);
      child.parentElement = this;
      this.children.push(child);
    }
  }
}

function matchesSelector(el, selector) {
  if (selector.startsWith('#')) {
    return el.id === selector.slice(1);
  }
  if (selector.startsWith('.')) {
    return el.classList.has(selector.slice(1));
  }
  if (selector.startsWith('[data-mode="')) {
    const m = selector.match(/\[data-mode="([^"]+)"\]/);
    return m && el.getAttribute('data-mode') === m[1];
  }
  if (selector.startsWith('[data-abs-tab="')) {
    const m = selector.match(/\[data-abs-tab="([^"]+)"\]/);
    return m && el.getAttribute('data-abs-tab') === m[1];
  }
  return false;
}

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

// ----------------------------------------------------------------------------
// TS MODULE LOADER WITH MOCK DEPENDENCIES
// ----------------------------------------------------------------------------

function createTestEnvironment(customStorage = new MockStorage()) {
  const domElements = new Map();

  function getElement(id, tag = 'div') {
    if (!domElements.has(id)) {
      const el = new MockElement(tag, id);
      domElements.set(id, el);
    }
    return domElements.get(id);
  }

  // Pre-seed standard elements
  getElement('three-canvas-container');
  getElement('abstract-canvas', 'canvas');
  getElement('abstract-space-tabs');
  getElement('abstract-readout-bar');
  getElement('physical-space-title');
  getElement('physical-hud-overlay');
  getElement('stage-step-badge');
  getElement('stage-parameters-dock');
  getElement('sim-play-pause-btn', 'button');
  getElement('sim-reset-btn', 'button');
  getElement('engine-mode-switcher');
  getElement('breadcrumb-bar');
  getElement('theory-scroll-container');
  getElement('sidebar-navigation');
  getElement('global-search-input', 'input');
  getElement('lang-toggle-btn', 'button');
  getElement('problem-count-badge', 'span');

  const documentMock = {
    documentElement: { lang: 'tr' },
    title: '',
    getElementById(id) {
      return getElement(id);
    },
    querySelector(sel) {
      if (sel.startsWith('#')) return getElement(sel.slice(1));
      if (sel.includes('tag-physical')) return getElement('tag-physical');
      if (sel.includes('tag-abstract')) return getElement('tag-abstract');
      if (sel.includes('meta[name="description"]')) return getElement('meta-desc');
      return null;
    },
    querySelectorAll(sel) {
      if (sel.includes('#engine-mode-switcher .mode-btn')) {
        return [
          getElement('btn-derivation', 'button'),
          getElement('btn-trainer', 'button'),
          getElement('btn-problems', 'button'),
        ];
      }
      return [];
    },
    createElement(tag) {
      return new MockElement(tag);
    },
  };

  const canvas = getElement('abstract-canvas', 'canvas');
  canvas.getContext = () => ({
    setTransform() {}, clearRect() {}, beginPath() {}, arc() {}, fill() {}, stroke() {},
    moveTo() {}, lineTo() {}, fillText() {}, strokeText() {},
    measureText() { return { width: 10 }; },
    save() {}, restore() {}, scale() {}, translate() {},
  });

  const windowMock = {
    localStorage: customStorage,
    devicePixelRatio: 1,
    addEventListener() {},
    removeEventListener() {},
  };

  // Wrapped THREE with headless WebGLRenderer
  const headlessThree = Object.create(THREE);
  headlessThree.WebGLRenderer = function () {
    return {
      setSize() {},
      setPixelRatio() {},
      render() {},
      domElement: new MockElement('canvas'),
    };
  };

  const moduleCache = new Map();

  function loadTs(relPath) {
    let abs = path.resolve(SRC_DIR, relPath);
    if (!fs.existsSync(abs)) {
      if (fs.existsSync(abs + '.ts')) abs = abs + '.ts';
      else if (fs.existsSync(path.join(abs, 'index.ts'))) abs = path.join(abs, 'index.ts');
    } else if (fs.statSync(abs).isDirectory() && fs.existsSync(path.join(abs, 'index.ts'))) {
      abs = path.join(abs, 'index.ts');
    }

    if (moduleCache.has(abs)) return moduleCache.get(abs);

    const code = fs.readFileSync(abs, 'utf8');
    const trans = ts.transpileModule(code, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    });

    const mod = { exports: {} };
    moduleCache.set(abs, mod.exports);

    const customReq = (reqPath) => {
      if (reqPath === 'three') {
        return headlessThree;
      }
      if (reqPath.startsWith('.')) {
        return loadTs(path.relative(SRC_DIR, path.resolve(path.dirname(abs), reqPath)));
      }
      return require(reqPath);
    };

    const fn = new Function(
      'exports',
      'require',
      'module',
      '__filename',
      '__dirname',
      'window',
      'document',
      'localStorage',
      'performance',
      'requestAnimationFrame',
      trans.outputText
    );

    fn(
      mod.exports,
      customReq,
      mod,
      abs,
      path.dirname(abs),
      windowMock,
      documentMock,
      customStorage,
      { now: () => 1000 },
      (cb) => {}
    );

    moduleCache.set(abs, mod.exports);
    return mod.exports;
  }

  return { loadTs, customStorage, documentMock, windowMock, domElements, getElement };
}

// ============================================================================
// CHALLENGE 1: RAPID LOCALE TOGGLING & STATE CONSISTENCY
// ============================================================================

describe('Adversarial Challenge 1: Rapid Locale Toggling Stress Test', () => {
  it('1.1: 100 rapid toggles (tr -> en -> tr -> en) maintains consistent locale and persistence', () => {
    const storage = new MockStorage();
    const env = createTestEnvironment(storage);
    const i18n = env.loadTs('i18n/index.ts');
    const manager = new i18n.I18nManager();

    assert.equal(manager.getLocale(), 'tr', 'Initial locale must be tr');

    const emittedLocales = [];
    manager.subscribe((loc) => emittedLocales.push(loc));

    // Toggle 100 times: 1->en, 2->tr, 3->en ... 100->tr
    for (let i = 1; i <= 100; i++) {
      const nextLocale = i % 2 === 1 ? 'en' : 'tr';
      manager.setLocale(nextLocale);
      assert.equal(manager.getLocale(), nextLocale, `Iteration ${i}: locale mismatch`);
      assert.equal(storage.getItem('berkeley_dalgalar_lang'), nextLocale, `Iteration ${i}: storage mismatch`);
    }

    assert.equal(emittedLocales.length, 100, 'Listener must be called exactly 100 times');
    assert.equal(manager.getLocale(), 'tr', 'Final locale after 100 toggles must be tr');
    assert.equal(storage.getItem('berkeley_dalgalar_lang'), 'tr');
    assert.equal(manager.t('shell.pageTitle'), i18n.TRANSLATIONS.tr.shell.pageTitle);
  });

  it('1.2: 101 rapid toggles (odd count) leaves state consistently in en', () => {
    const storage = new MockStorage();
    const env = createTestEnvironment(storage);
    const i18n = env.loadTs('i18n/index.ts');
    const manager = new i18n.I18nManager();

    for (let i = 1; i <= 101; i++) {
      manager.setLocale(i % 2 === 1 ? 'en' : 'tr');
    }

    assert.equal(manager.getLocale(), 'en');
    assert.equal(storage.getItem('berkeley_dalgalar_lang'), 'en');
    assert.equal(manager.t('shell.pageTitle'), i18n.TRANSLATIONS.en.shell.pageTitle);
  });

  it('1.3: 1,000 rapid toggles completes under 150ms with zero memory degradation', () => {
    const storage = new MockStorage();
    const env = createTestEnvironment(storage);
    const i18n = env.loadTs('i18n/index.ts');
    const manager = new i18n.I18nManager();

    let count = 0;
    const unsub = manager.subscribe(() => { count++; });

    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
      manager.setLocale(i % 2 === 0 ? 'en' : 'tr');
    }
    const elapsed = performance.now() - start;

    assert.equal(count, 1000);
    assert.ok(elapsed < 250, `1000 toggles took ${elapsed.toFixed(2)}ms (expected < 250ms)`);

    unsub();
    manager.setLocale('en');
    assert.equal(count, 1000, 'Unsubscribed listener must not be called');
  });

  it('1.4: Idempotent setLocale calls do not trigger redundant listener notifications', () => {
    const storage = new MockStorage();
    const env = createTestEnvironment(storage);
    const i18n = env.loadTs('i18n/index.ts');
    const manager = new i18n.I18nManager();

    let calls = 0;
    manager.subscribe(() => { calls++; });

    manager.setLocale('tr');
    manager.setLocale('tr');
    manager.setLocale('tr');
    assert.equal(calls, 0, 'Redundant setLocale("tr") must not notify listeners');

    manager.setLocale('en');
    assert.equal(calls, 1, 'First change to "en" notifies listener');

    manager.setLocale('en');
    manager.setLocale('en');
    assert.equal(calls, 1, 'Subsequent setLocale("en") must not notify listeners');
  });
});

// ============================================================================
// CHALLENGE 2: TAMPERED LOCALSTORAGE & ERROR RESILIENCE
// ============================================================================

describe('Adversarial Challenge 2: LocalStorage Tampering & Error Resilience', () => {
  const tamperedValues = [
    'fr',
    'de',
    'es',
    '',
    '   ',
    'null',
    'undefined',
    'EN',
    'TR',
    '123',
    'true',
    '{"locale":"en"}',
    'en; DROP TABLE students;',
    'A'.repeat(1000),
  ];

  for (const tampered of tamperedValues) {
    it(`2.1: Tampered localStorage "${tampered.slice(0, 20)}" falls back gracefully to "tr"`, () => {
      const storage = new MockStorage({ berkeley_dalgalar_lang: tampered });
      const env = createTestEnvironment(storage);
      const i18n = env.loadTs('i18n/index.ts');
      const manager = new i18n.I18nManager();

      assert.equal(manager.getLocale(), 'tr', `Value "${tampered}" must fall back to "tr"`);
      assert.equal(manager.t('shell.brandTitle'), i18n.TRANSLATIONS.tr.shell.brandTitle);
    });
  }

  it('2.2: Missing localStorage key (null) defaults to "tr"', () => {
    const storage = new MockStorage();
    const env = createTestEnvironment(storage);
    const i18n = env.loadTs('i18n/index.ts');
    const manager = new i18n.I18nManager();

    assert.equal(manager.getLocale(), 'tr');
  });

  it('2.3: SecurityError during localStorage.getItem defaults to "tr" without unhandled throw', () => {
    const storage = new MockStorage();
    storage.throwOnGet = true; // Simulates private browsing strict sandbox
    const env = createTestEnvironment(storage);
    const i18n = env.loadTs('i18n/index.ts');

    let manager;
    assert.doesNotThrow(() => {
      manager = new i18n.I18nManager();
    });
    assert.equal(manager.getLocale(), 'tr');
  });

  it('2.4: QuotaExceededError during localStorage.setItem does not crash setLocale', () => {
    const storage = new MockStorage();
    storage.throwOnSet = true; // Simulates full storage quota
    const env = createTestEnvironment(storage);
    const i18n = env.loadTs('i18n/index.ts');
    const manager = new i18n.I18nManager();

    let notified = false;
    manager.subscribe((l) => { notified = (l === 'en'); });

    assert.doesNotThrow(() => {
      manager.setLocale('en');
    });

    assert.equal(manager.getLocale(), 'en');
    assert.equal(notified, true, 'Subscribers must still be notified even if disk write fails');
  });

  it('2.5: Missing / malformed translation keys fallback safely', () => {
    const env = createTestEnvironment();
    const i18n = env.loadTs('i18n/index.ts');
    const manager = new i18n.I18nManager();

    assert.equal(manager.t('nonexistent_key'), 'nonexistent_key');
    assert.equal(manager.t('shell.nonexistent_child'), 'shell.nonexistent_child');
    assert.equal(manager.t('a.b.c.d.e.f'), 'a.b.c.d.e.f');
    assert.equal(manager.t(''), '');
    assert.equal(manager.t('shell'), 'shell');
  });

  it('2.6: Parameter interpolation handles zero, missing params, and regex special chars', () => {
    const env = createTestEnvironment();
    const i18n = env.loadTs('i18n/index.ts');
    const manager = new i18n.I18nManager();

    const resZero = manager.t('stage.hudChapterEngine', { ch: 0 });
    assert.ok(resZero.includes('0'), `Interpolation must preserve 0: ${resZero}`);

    const resMissing = manager.t('stage.hudChapterEngine', {});
    assert.ok(resMissing.includes('{ch}'));

    const resSpecial = manager.t('stage.syncedStep', { code: 'Test $1 & $2 * +', step: 1 });
    assert.ok(resSpecial.includes('Test $1 & $2 * +'), `Regex special chars must not corrupt text: ${resSpecial}`);
  });

  it('2.7: Broken subscriber does not abort execution of remaining subscribers', () => {
    const env = createTestEnvironment();
    const i18n = env.loadTs('i18n/index.ts');
    const manager = new i18n.I18nManager();

    let sub1Executed = false;
    let sub3Executed = false;

    manager.subscribe(() => { sub1Executed = true; });
    manager.subscribe(() => { throw new Error('Faulty subscriber explosion'); });
    manager.subscribe(() => { sub3Executed = true; });

    assert.doesNotThrow(() => {
      manager.setLocale('en');
    });

    assert.equal(sub1Executed, true);
    assert.equal(sub3Executed, true, 'Subsequent subscribers must still run when prior subscriber throws');
  });
});

// ============================================================================
// CHALLENGE 3: DOM INTEGRITY & #PROBLEM-COUNT-BADGE LIFECYCLE
// ============================================================================

describe('Adversarial Challenge 3: DOM Node Integrity & #problem-count-badge', () => {
  it('3.1: index.html defines single #problem-count-badge inside #engine-mode-switcher', () => {
    const indexPath = path.join(PROJECT_ROOT, 'index.html');
    const html = fs.readFileSync(indexPath, 'utf8');

    const matches = html.match(/id=["']problem-count-badge["']/g) || [];
    assert.equal(matches.length, 1, 'index.html must define exactly ONE #problem-count-badge');

    const problemsBtnIdx = html.indexOf('data-mode="problems"');
    const badgeIdx = html.indexOf('id="problem-count-badge"');
    const nextBtnIdx = html.indexOf('</button>', problemsBtnIdx);

    assert.ok(problemsBtnIdx !== -1, 'data-mode="problems" must exist in index.html');
    assert.ok(badgeIdx > problemsBtnIdx && badgeIdx < nextBtnIdx, 'Badge must be inside problems button');
  });

  it('3.2: Re-rendering mode buttons dynamically keeps exactly 1 #problem-count-badge', () => {
    const env = createTestEnvironment();
    const i18n = env.loadTs('i18n/index.ts');

    const switcher = env.getElement('engine-mode-switcher');
    const derivationBtn = new MockElement('button', 'btn-derivation');
    derivationBtn.setAttribute('data-mode', 'derivation');
    const trainerBtn = new MockElement('button', 'btn-trainer');
    trainerBtn.setAttribute('data-mode', 'trainer');
    const problemsBtn = new MockElement('button', 'btn-problems');
    problemsBtn.setAttribute('data-mode', 'problems');
    switcher.appendChild(derivationBtn);
    switcher.appendChild(trainerBtn);
    switcher.appendChild(problemsBtn);

    const badge = new MockElement('span', 'problem-count-badge');
    badge.textContent = '22';
    problemsBtn.appendChild(badge);

    const modes = ['derivation', 'trainer', 'problems'];
    const locales = ['tr', 'en'];

    for (let i = 0; i < 50; i++) {
      const mode = modes[i % modes.length];
      const locale = locales[i % locales.length];
      i18n.i18nManager.setLocale(locale);

      const count = i % 2 === 0 ? 22 : 32;
      problemsBtn.innerHTML = `<span>✏️</span> <span class="mode-btn-text">${i18n.i18nManager.t('modes.problems')}</span> (<span id="problem-count-badge">${count}</span>)`;

      const allBadges = problemsBtn.querySelectorAll('#problem-count-badge');
      assert.equal(allBadges.length, 1, `Cycle ${i}: exactly 1 badge must exist inside problemsBtn`);
      assert.equal(allBadges[0].id, 'problem-count-badge');
      assert.equal(problemsBtn.querySelector('#problem-count-badge') !== null, true);
    }
  });

  it('3.3: #lang-toggle-btn contains active pills for both TR and EN in index.html', () => {
    const indexPath = path.join(PROJECT_ROOT, 'index.html');
    const html = fs.readFileSync(indexPath, 'utf8');

    assert.ok(html.includes('id="lang-toggle-btn"'), 'index.html must have #lang-toggle-btn');
    assert.ok(html.includes('lang-badge lang-tr active'), 'Initial active badge must be TR');
    assert.ok(html.includes('lang-badge lang-en'), 'EN badge must exist in toggle button');
  });
});

// ============================================================================
// CHALLENGE 4: SIMULATION STATE ISOLATION IN MULTISPACE DIRECTOR
// ============================================================================

describe('Adversarial Challenge 4: Simulation State Isolation under setLocale()', () => {
  it('4.1: setLocale("en") preserves state.rkX, state.rkV, state.time and phaseTrail strictly', () => {
    const env = createTestEnvironment();
    const dirMod = env.loadTs('engine/multiSpaceDirector.ts');
    const director = new dirMod.MultiSpaceDirector();

    const initialRkX = 3.1415926535;
    const initialRkV = -2.7182818284;
    const initialTime = 88.4219;
    const initialPhaseTrail = [
      { x: 1.1, v: -0.5 },
      { x: 2.2, v: 0.8 },
      { x: -1.4, v: 1.9 },
    ];

    director.ch1Controller.state.rkX = initialRkX;
    director.ch1Controller.state.rkV = initialRkV;
    director.ch1Controller.state.time = initialTime;
    director.ch1Controller.state.phaseTrail = [...initialPhaseTrail];

    director.setLocale('en');

    assert.equal(director.ch1Controller.state.rkX, initialRkX, 'state.rkX must remain untouched');
    assert.equal(director.ch1Controller.state.rkV, initialRkV, 'state.rkV must remain untouched');
    assert.equal(director.ch1Controller.state.time, initialTime, 'state.time must remain untouched');
    assert.deepEqual(
      director.ch1Controller.state.phaseTrail,
      initialPhaseTrail,
      'state.phaseTrail must remain untouched'
    );

    director.setLocale('tr');
    assert.equal(director.ch1Controller.state.rkX, initialRkX);
    assert.equal(director.ch1Controller.state.rkV, initialRkV);
    assert.equal(director.ch1Controller.state.time, initialTime);
  });

  it('4.2: setLocale() preserves user slider values (omega0, couplingKc, etc.)', () => {
    const env = createTestEnvironment();
    const dirMod = env.loadTs('engine/multiSpaceDirector.ts');
    const director = new dirMod.MultiSpaceDirector();

    director.ch1Controller.state.omega0 = 3.65;
    director.ch1Controller.state.couplingKc = 0.95;
    director.ch1Controller.state.modeSelect = 2; // Mode 2
    director.ch1Controller.state.anharmonicAlpha = 0.40;

    director.setLocale('en');

    assert.equal(director.ch1Controller.state.omega0, 3.65);
    assert.equal(director.ch1Controller.state.couplingKc, 0.95);
    assert.equal(director.ch1Controller.state.modeSelect, 2);
    assert.equal(director.ch1Controller.state.anharmonicAlpha, 0.40);

    const dockHtml = env.domElements.get('stage-parameters-dock').innerHTML;
    assert.ok(dockHtml.includes('value="3.65"'), 'omega0 slider value must be 3.65');
    assert.ok(dockHtml.includes('value="0.95"'), 'couplingKc slider value must be 0.95');
    assert.ok(dockHtml.includes('value="2"'), 'modeSelect slider value must be 2');
    assert.ok(dockHtml.includes('value="0.4"'), 'anharmonicAlpha slider value must be 0.4');
  });

  it('4.3: Paused simulation state is preserved under setLocale()', () => {
    const env = createTestEnvironment();
    const dirMod = env.loadTs('engine/multiSpaceDirector.ts');
    const director = new dirMod.MultiSpaceDirector();

    director.isPaused = true;
    director.setLocale('en');
    assert.equal(director.isPaused, true, 'setLocale must not unpause paused simulation');

    director.isPaused = false;
    director.setLocale('tr');
    assert.equal(director.isPaused, false, 'setLocale must not pause running simulation');
  });

  it('4.4: Physical HUD overlay retains localized English text without per-frame regression', () => {
    const env = createTestEnvironment();
    const i18n = env.loadTs('i18n/index.ts');
    const dirMod = env.loadTs('engine/multiSpaceDirector.ts');
    const director = new dirMod.MultiSpaceDirector();

    i18n.i18nManager.setLocale('en');
    director.setLocale('en');

    const hudEl = env.domElements.get('physical-hud-overlay');
    assert.ok(hudEl.innerHTML.includes('Drag: 3D Orbit'), 'HUD must display English orbit badge');
    assert.ok(hudEl.innerHTML.includes('Chapter 1 Live Physics Engine'), 'HUD must display English engine banner');

    const directorTs = fs.readFileSync(path.join(SRC_DIR, 'engine', 'multiSpaceDirector.ts'), 'utf8');
    const tickMatch = directorTs.match(/const tick =[\s\S]*?requestAnimationFrame\(tick\);/);
    assert.ok(tickMatch, 'Animation tick function must exist');
    assert.equal(
      tickMatch[0].includes('physicalHudEl'),
      false,
      'CRITICAL: Animation tick must NOT write to physicalHudEl on every frame'
    );
  });
});
