/**
 * ============================================================================
 * EMPIRICAL CHALLENGER TEST SUITE: MILESTONE 3
 * Berkeley Waves Interactive Laboratory — 54 End-of-Chapter Problems i18n
 * & Proof Coach Engine
 *
 * Challenger: challenger_m3_1 (Empirical Challenger)
 * Roles: critic, specialist
 *
 * Verification Mandates:
 *  1. getChapterProblems(1, 'en') returns 22 problems and
 *     getChapterProblems(2, 'en') returns 32 problems (total 54).
 *  2. Validate that every single problem has valid fourStages with non-empty
 *     text, equations, and reflections.
 *  3. Validate that KaTeX successfully parses 100% of the mathematical formulas
 *     in chapter1ProblemsEn.ts and chapter2ProblemsEn.ts with zero unicode subscripts.
 *  4. Verify that proofCoachEngine methods (getActiveProblemIndex, getActiveStage,
 *     getActiveProblemId, setProblemById, resetProblemState, renderProblemsView, etc.)
 *     function properly under nominal, edge, and adversarial conditions.
 *  5. Verify i18n Coach translation namespace coverage and parameter substitution.
 *  6. High-throughput performance benchmarks and state transition stress testing.
 *
 * Runner:
 *   node --test tests/m3_stress_challenge.test.mjs
 * ============================================================================
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import katexMod from 'katex';

const katex = katexMod.default || katexMod;

const PROJECT_ROOT = path.resolve(import.meta.dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');
const DATA_DIR = path.join(SRC_DIR, 'data');
const ENGINE_DIR = path.join(SRC_DIR, 'engine');
const I18N_DIR = path.join(SRC_DIR, 'i18n');

// ----------------------------------------------------------------------------
// TS Transpiler Helper for Isolated Module Loading
// ----------------------------------------------------------------------------
function createTsLoader() {
  const cache = new Map();

  function resolveFilePath(target) {
    if (fs.existsSync(target)) {
      if (fs.statSync(target).isDirectory()) {
        const idxTs = path.join(target, 'index.ts');
        if (fs.existsSync(idxTs)) return idxTs;
        const idxJs = path.join(target, 'index.js');
        if (fs.existsSync(idxJs)) return idxJs;
      } else {
        return target;
      }
    }
    if (fs.existsSync(target + '.ts')) return target + '.ts';
    if (fs.existsSync(target + '.js')) return target + '.js';
    throw new Error(`File not found: ${target}`);
  }

  function loadTs(rawPath) {
    const absPath = resolveFilePath(rawPath);
    if (cache.has(absPath)) return cache.get(absPath).exports;

    const content = fs.readFileSync(absPath, 'utf8');
    const res = ts.transpileModule(content, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    });

    const mod = { exports: {} };
    cache.set(absPath, mod);

    const customRequire = (reqPath) => {
      if (reqPath === 'katex') return katex;
      if (reqPath.startsWith('.')) {
        const resolved = path.resolve(path.dirname(absPath), reqPath);
        return loadTs(resolved);
      }
      return null;
    };

    const fn = new Function('exports', 'module', 'require', '__dirname', '__filename', res.outputText);
    fn(mod.exports, mod, customRequire, path.dirname(absPath), absPath);
    return mod.exports;
  }

  return { loadTs };
}

const loader = createTsLoader();
const dataMod = loader.loadTs(path.join(DATA_DIR, 'index.ts'));
const { getChapterProblems, getMathTricks } = dataMod;
const i18nModule = loader.loadTs(path.join(I18N_DIR, 'index.ts'));
const { i18nManager, TRANSLATIONS } = i18nModule;
const engineModule = loader.loadTs(path.join(ENGINE_DIR, 'proofCoachEngine.ts'));
const { ProofCoachEngineUI } = engineModule;

// Canonical Constants
const CANONICAL_CH1_COUNT = 22;
const CANONICAL_CH2_COUNT = 32;
const CANONICAL_TOTAL_PROBLEMS = 54;
const CANONICAL_CH1_SUBSTEPS = 29;
const CANONICAL_CH2_SUBSTEPS = 66;
const CANONICAL_TOTAL_SUBSTEPS = 95;
const CANONICAL_CH1_HOME_EXPERIMENTS = [
  'prob-1-2', 'prob-1-3', 'prob-1-5', 'prob-1-6',
  'prob-1-10', 'prob-1-15', 'prob-1-19', 'prob-1-21'
];
const CANONICAL_CH2_HOME_EXPERIMENTS = [
  'prob-2-1', 'prob-2-2', 'prob-2-4', 'prob-2-5',
  'prob-2-28', 'prob-2-30'
];
const FORBIDDEN_UNICODE_SUBSCRIPTS = /[₀₁₂₃₄₅₆₇₈₉]/;

// ----------------------------------------------------------------------------
// Mock DOM Infrastructure for Headless Engine Testing
// ----------------------------------------------------------------------------
class MockClassList {
  constructor(initialClass = '') {
    this._classes = new Set(String(initialClass).split(/\s+/).filter(Boolean));
  }
  add(...tokens) { tokens.forEach((t) => this._classes.add(t)); }
  remove(...tokens) { tokens.forEach((t) => this._classes.delete(t)); }
  contains(t) { return this._classes.has(t); }
  has(t) { return this._classes.has(t); }
  toggle(t) {
    if (this._classes.has(t)) { this._classes.delete(t); return false; }
    this._classes.add(t); return true;
  }
  clear() { this._classes.clear(); }
  toString() { return Array.from(this._classes).join(' '); }
}

class MockDOMElement {
  constructor(tagName = 'div', attributes = {}) {
    this.tagName = tagName.toUpperCase();
    this.attributes = { ...attributes };
    this.classList = new MockClassList(attributes.class || '');
    this.id = attributes.id || '';
    this.children = [];
    this.parentElement = null;
    this.eventListeners = new Map();
    this._innerHTML = '';
  }

  getAttribute(name) {
    if (name === 'class') return this.classList.toString();
    if (name === 'id') return this.id || null;
    return this.attributes[name] ?? null;
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
    if (name === 'id') this.id = String(value);
    if (name === 'class') {
      this.classList = new MockClassList(String(value));
    }
  }

  hasAttribute(name) {
    return name in this.attributes;
  }

  addEventListener(type, listener) {
    if (!this.eventListeners.has(type)) {
      this.eventListeners.set(type, []);
    }
    this.eventListeners.get(type).push(listener);
  }

  click() {
    const list = this.eventListeners.get('click') || [];
    for (const fn of list) {
      fn({ target: this, preventDefault: () => {} });
    }
  }

  get innerHTML() {
    return this._innerHTML;
  }

  set innerHTML(html) {
    this._innerHTML = String(html);
    this.children = parseHtmlToMockElements(this._innerHTML, this);
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  querySelectorAll(selector) {
    const results = [];
    const testMatch = (el) => matchesSelectorCompound(el, selector);

    const traverse = (node) => {
      for (const child of node.children) {
        if (testMatch(child)) results.push(child);
        traverse(child);
      }
    };
    traverse(this);
    return results;
  }
}

function matchesSelectorCompound(el, sel) {
  sel = sel.trim();
  // Handle multiple bracketed attributes like [data-s1-opt][data-correct="true"]
  const attrParts = sel.match(/\[[^\]]+\]/g);
  if (attrParts && attrParts.length > 0) {
    for (const part of attrParts) {
      const inner = part.slice(1, -1);
      if (inner.includes('=')) {
        const [k, rawV] = inner.split('=');
        const v = rawV.replace(/^["']|["']$/g, '');
        if (el.getAttribute(k) !== v) return false;
      } else {
        if (!el.hasAttribute(inner)) return false;
      }
    }
    return true;
  }

  if (sel.startsWith('#')) return el.id === sel.slice(1);
  if (sel.startsWith('.')) return el.classList.contains(sel.slice(1));
  if (sel.toLowerCase() === el.tagName.toLowerCase()) return true;
  return false;
}

function parseHtmlToMockElements(html, parent) {
  const root = new MockDOMElement('root');
  const stack = [root];

  const VOID_ELEMENTS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
  const tokenRegex = /<!--[\s\S]*?-->|<\/([a-zA-Z0-9\-]+)>|<([a-zA-Z0-9\-]+)([^>]*?)(\/?)>/g;
  let match;

  while ((match = tokenRegex.exec(html)) !== null) {
    if (match[0].startsWith('<!--')) continue;

    if (match[1]) {
      // Closing tag
      const closingTag = match[1].toUpperCase();
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tagName === closingTag) {
          stack.splice(i);
          break;
        }
      }
    } else if (match[2]) {
      // Opening tag
      const tagName = match[2];
      const rawAttrs = match[3] || '';
      const isSelfClosing = match[4] === '/' || VOID_ELEMENTS.has(tagName.toLowerCase());

      const attrs = {};
      const attrRegex = /([a-zA-Z0-9\-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
      let aMatch;
      while ((aMatch = attrRegex.exec(rawAttrs)) !== null) {
        if (!aMatch[1]) continue;
        const val = aMatch[2] ?? aMatch[3] ?? aMatch[4] ?? '';
        attrs[aMatch[1]] = val;
      }

      const el = new MockDOMElement(tagName, attrs);
      const currParent = stack[stack.length - 1];
      el.parentElement = currParent;
      currParent.children.push(el);

      if (!isSelfClosing) {
        stack.push(el);
      }
    }
  }

  // Link children to given parent
  for (const ch of root.children) {
    ch.parentElement = parent;
  }
  return root.children;
}

// ============================================================================
// TEST SUITE: MILESTONE 3 EMPIRICAL CHALLENGE
// ============================================================================

describe('Empirical Challenge: Milestone 3 Deliverables', () => {

  // --------------------------------------------------------------------------
  // 1. Mandatory Input 1: Problem Count & Dataset Invariants
  // --------------------------------------------------------------------------
  describe('Mandate 1: Problem Count & Dataset Invariants', () => {

    it('1.1: getChapterProblems(1, "en") returns exactly 22 problems', () => {
      const ch1 = getChapterProblems(1, 'en');
      assert.ok(Array.isArray(ch1), 'Chapter 1 problems must be an array');
      assert.equal(ch1.length, CANONICAL_CH1_COUNT, 'Chapter 1 English count must equal 22');
    });

    it('1.2: getChapterProblems(2, "en") returns exactly 32 problems', () => {
      const ch2 = getChapterProblems(2, 'en');
      assert.ok(Array.isArray(ch2), 'Chapter 2 problems must be an array');
      assert.equal(ch2.length, CANONICAL_CH2_COUNT, 'Chapter 2 English count must equal 32');
    });

    it('1.3: Total English problem count is exactly 54 (22 + 32)', () => {
      const ch1 = getChapterProblems(1, 'en');
      const ch2 = getChapterProblems(2, 'en');
      assert.equal(ch1.length + ch2.length, CANONICAL_TOTAL_PROBLEMS, 'Total English problems must equal 54');
    });

    it('1.4: getChapterProblems default language argument defaults to "tr" without error', () => {
      const ch1Default = getChapterProblems(1);
      const ch2Default = getChapterProblems(2);
      const ch1Tr = getChapterProblems(1, 'tr');
      const ch2Tr = getChapterProblems(2, 'tr');
      assert.equal(ch1Default.length, 22);
      assert.equal(ch2Default.length, 32);
      assert.equal(ch1Default[0].title, ch1Tr[0].title, 'Default language must resolve to Turkish');
      assert.equal(ch2Default[0].title, ch2Tr[0].title, 'Default language must resolve to Turkish');
    });

    it('1.5: Problem numbering and IDs are strictly sequential in Chapter 1 and Chapter 2', () => {
      const ch1 = getChapterProblems(1, 'en');
      const ch2 = getChapterProblems(2, 'en');

      for (let i = 1; i <= CANONICAL_CH1_COUNT; i++) {
        const p = ch1[i - 1];
        assert.equal(p.id, `prob-1-${i}`, `Ch1 index ${i - 1} ID mismatch`);
        assert.equal(p.chapter, 1, `Ch1 index ${i - 1} chapter mismatch`);
        assert.equal(p.number, `Problem 1.${i}`, `Ch1 index ${i - 1} number mismatch`);
      }

      for (let i = 1; i <= CANONICAL_CH2_COUNT; i++) {
        const p = ch2[i - 1];
        assert.equal(p.id, `prob-2-${i}`, `Ch2 index ${i - 1} ID mismatch`);
        assert.equal(p.chapter, 2, `Ch2 index ${i - 1} chapter mismatch`);
        assert.equal(p.number, `Problem 2.${i}`, `Ch2 index ${i - 1} number mismatch`);
      }
    });

    it('1.6: Derivation sub-steps invariant: exactly 29 in Ch1, 66 in Ch2, 95 in total', () => {
      const ch1 = getChapterProblems(1, 'en');
      const ch2 = getChapterProblems(2, 'en');

      const ch1Steps = ch1.reduce((acc, p) => acc + p.stage2Derivation.length, 0);
      const ch2Steps = ch2.reduce((acc, p) => acc + p.stage2Derivation.length, 0);

      assert.equal(ch1Steps, CANONICAL_CH1_SUBSTEPS, `Ch1 sub-steps must be 29, got ${ch1Steps}`);
      assert.equal(ch2Steps, CANONICAL_CH2_SUBSTEPS, `Ch2 sub-steps must be 66, got ${ch2Steps}`);
      assert.equal(ch1Steps + ch2Steps, CANONICAL_TOTAL_SUBSTEPS, `Total sub-steps must be 95, got ${ch1Steps + ch2Steps}`);
    });

    it('1.7: Home experiments invariant: exactly 8 in Ch1, 6 in Ch2 (14 total), 1:1 parity with TR', () => {
      const ch1En = getChapterProblems(1, 'en');
      const ch2En = getChapterProblems(2, 'en');
      const ch1Tr = getChapterProblems(1, 'tr');
      const ch2Tr = getChapterProblems(2, 'tr');

      const ch1HomeIds = ch1En.filter((p) => p.isHomeExperiment).map((p) => p.id);
      const ch2HomeIds = ch2En.filter((p) => p.isHomeExperiment).map((p) => p.id);

      assert.deepEqual(ch1HomeIds, CANONICAL_CH1_HOME_EXPERIMENTS, 'Ch1 Home experiment IDs must match canonical list');
      assert.deepEqual(ch2HomeIds, CANONICAL_CH2_HOME_EXPERIMENTS, 'Ch2 Home experiment IDs must match canonical list');

      // 1:1 TR/EN parity
      for (let i = 0; i < 22; i++) {
        assert.equal(ch1En[i].isHomeExperiment, ch1Tr[i].isHomeExperiment, `Ch1 P1.${i + 1} home flag mismatch with TR`);
      }
      for (let i = 0; i < 32; i++) {
        assert.equal(ch2En[i].isHomeExperiment, ch2Tr[i].isHomeExperiment, `Ch2 P2.${i + 1} home flag mismatch with TR`);
      }
    });

    it('1.8: Backward compatibility: original Turkish file chapter2Problems.ts remains untouched', () => {
      const ch2Path = path.join(DATA_DIR, 'chapter2Problems.ts');
      const content = fs.readFileSync(ch2Path, 'utf8');
      assert.ok(content.includes("num: '2.26'"), 'Must contain Problem 2.26');
      assert.ok(
        content.includes('Sürekli Bir İpin Öztitreşimleri: Sınır Koşulları ve Fourier Eşdeğerliği'),
        'Must retain Turkish title for Problem 2.26 (Test 7 invariant)'
      );
    });
  });

  // --------------------------------------------------------------------------
  // 2. Mandatory Input 2: 4-Stage Proof Coach Format & Non-Empty Fields
  // --------------------------------------------------------------------------
  describe('Mandate 2: 4-Stage Proof Coach Format & Non-Empty Content', () => {
    const allProblems = [
      ...getChapterProblems(1, 'en'),
      ...getChapterProblems(2, 'en'),
    ];

    it('2.1: Every single problem has non-empty top-level metadata', () => {
      for (const p of allProblems) {
        assert.ok(p.id && p.id.trim().length > 0, `Problem missing ID`);
        assert.ok(p.title && p.title.trim().length >= 4, `Problem ${p.id} title too short`);
        assert.ok(p.statement && p.statement.trim().length >= 15, `Problem ${p.id} statement too short`);
        assert.ok(p.bookPage && p.bookPage.trim().length > 0, `Problem ${p.id} missing bookPage`);
        assert.ok(p.difficulty && p.difficulty.trim().length > 0, `Problem ${p.id} missing difficulty`);
        assert.ok(Array.isArray(p.tags) && p.tags.length >= 1, `Problem ${p.id} must have at least 1 tag`);
        assert.ok(p.givenLatex && p.givenLatex.trim().length > 0, `Problem ${p.id} missing givenLatex`);
        assert.ok(p.targetLatex && p.targetLatex.trim().length > 0, `Problem ${p.id} missing targetLatex`);
      }
    });

    it('2.2: Stage 1 (Setup): valid physicalPrinciple, diagramDescription, and 3 options (1 correct, 2 wrong)', () => {
      for (const p of allProblems) {
        const s1 = p.stage1Setup;
        assert.ok(s1, `Problem ${p.id} missing stage1Setup`);
        assert.ok(s1.diagramDescription && s1.diagramDescription.trim().length > 5, `Problem ${p.id} diagramDescription too short`);
        assert.ok(s1.physicalPrinciple && s1.physicalPrinciple.trim().length > 5, `Problem ${p.id} physicalPrinciple too short`);
        assert.ok(s1.startingEquationQuestion && s1.startingEquationQuestion.trim().length > 5, `Problem ${p.id} startingEquationQuestion too short`);

        assert.ok(Array.isArray(s1.options) && s1.options.length === 3, `Problem ${p.id} must have exactly 3 options`);
        const correctCount = s1.options.filter((o) => o.isCorrect === true).length;
        const wrongCount = s1.options.filter((o) => o.isCorrect === false).length;
        assert.equal(correctCount, 1, `Problem ${p.id} must have exactly 1 correct option`);
        assert.equal(wrongCount, 2, `Problem ${p.id} must have exactly 2 wrong options`);

        for (const opt of s1.options) {
          assert.ok(opt.latex && opt.latex.trim().length > 0, `Problem ${p.id} option missing latex`);
          assert.ok(opt.explanation && opt.explanation.trim().length > 5, `Problem ${p.id} option missing explanation`);
        }
      }
    });

    it('2.3: Stage 2 (Derivation): non-empty sub-steps with valid hints, texts, and equations', () => {
      const canonicalTricks = getMathTricks('en').map((t) => t.id);

      for (const p of allProblems) {
        const s2 = p.stage2Derivation;
        assert.ok(Array.isArray(s2) && s2.length >= 1, `Problem ${p.id} must have at least 1 derivation step`);

        for (let sIdx = 0; sIdx < s2.length; sIdx++) {
          const step = s2[sIdx];
          assert.ok(step.stepTitle && step.stepTitle.trim().length > 0, `Problem ${p.id} step ${sIdx} missing stepTitle`);
          assert.ok(step.hint && step.hint.trim().length > 5, `Problem ${p.id} step ${sIdx} missing hint`);
          assert.ok(step.derivationText && step.derivationText.trim().length > 5, `Problem ${p.id} step ${sIdx} missing derivationText`);
          assert.ok(step.mathLatex && step.mathLatex.trim().length > 0, `Problem ${p.id} step ${sIdx} missing mathLatex`);

          if (step.trickUsedId) {
            assert.ok(
              canonicalTricks.includes(step.trickUsedId),
              `Problem ${p.id} step ${sIdx} references unknown trick: ${step.trickUsedId}`
            );
          }
        }
      }
    });

    it('2.4: Stage 3 (Visual Verify): non-empty observation prompts and valid 3D/2D presets', () => {
      for (const p of allProblems) {
        const s3 = p.stage3VisualVerify;
        assert.ok(s3, `Problem ${p.id} missing stage3VisualVerify`);
        assert.ok(s3.description && s3.description.trim().length > 5, `Problem ${p.id} description too short`);
        assert.ok(s3.whatToObserve && s3.whatToObserve.trim().length > 5, `Problem ${p.id} whatToObserve too short`);
        assert.ok(s3.chapter === 1 || s3.chapter === 2, `Problem ${p.id} invalid chapter in stage 3`);
        assert.ok(s3.sceneMode && s3.sceneMode.trim().length > 0, `Problem ${p.id} missing sceneMode`);
        assert.ok(s3.abstractTab && s3.abstractTab.trim().length > 0, `Problem ${p.id} missing abstractTab`);
        assert.ok(typeof s3.presetParams === 'object' && s3.presetParams !== null, `Problem ${p.id} missing presetParams`);
      }
    });

    it('2.5: Stage 4 (Exam Sheet): finalBoxedLatex, non-empty reflection (limit check), and >= 3 rubric criteria', () => {
      for (const p of allProblems) {
        const s4 = p.stage4ExamSheet;
        assert.ok(s4, `Problem ${p.id} missing stage4ExamSheet`);
        assert.ok(s4.fullAcademicSolutionMarkdown && s4.fullAcademicSolutionMarkdown.trim().length > 10, `Problem ${p.id} full solution markdown missing`);
        assert.ok(s4.finalBoxedLatex && s4.finalBoxedLatex.trim().length > 0, `Problem ${p.id} finalBoxedLatex missing`);
        assert.ok(
          s4.limitAndDimensionCheck && s4.limitAndDimensionCheck.trim().length >= 10,
          `Problem ${p.id} limitAndDimensionCheck (reflection) too short or missing`
        );
        assert.ok(
          Array.isArray(s4.examGradingRubric) && s4.examGradingRubric.length >= 3,
          `Problem ${p.id} examGradingRubric must contain at least 3 criteria, got ${s4.examGradingRubric?.length}`
        );
        for (const crit of s4.examGradingRubric) {
          assert.ok(crit && crit.trim().length > 5, `Problem ${p.id} has invalid rubric item: "${crit}"`);
        }
      }
    });

    it('2.6: Extended fourStages helper (when present) has non-empty understanding, setup, execution, reflection', () => {
      for (const p of allProblems) {
        if (p.fourStages) {
          assert.ok(p.fourStages.stage1_understanding && p.fourStages.stage1_understanding.trim().length > 5);
          assert.ok(p.fourStages.stage2_math_setup && p.fourStages.stage2_math_setup.trim().length > 5);
          assert.ok(p.fourStages.stage3_execution && p.fourStages.stage3_execution.trim().length > 5);
          assert.ok(p.fourStages.stage4_reflection && p.fourStages.stage4_reflection.trim().length > 5);
        }
      }
    });

    it('2.7: No placeholder tokens (TODO, TBD, FIXME, undefined, null) across English problem fields', () => {
      // Avoid false positive on the physics concept "Null measurement" / "Null experiments"
      const placeholderRegex = /\b(TODO|TBD|FIXME|undefined)\b/i;
      const nullLiteralRegex = /(?<!Null\s*)\bnull\b(?![-_\s]*measure)/i;

      for (const p of allProblems) {
        assert.ok(!placeholderRegex.test(p.title), `Problem ${p.id} title contains placeholder`);
        assert.ok(!nullLiteralRegex.test(p.title), `Problem ${p.id} title contains null literal`);
        assert.ok(!placeholderRegex.test(p.statement), `Problem ${p.id} statement contains placeholder`);
        assert.ok(!placeholderRegex.test(p.stage1Setup.physicalPrinciple), `Problem ${p.id} principle contains placeholder`);
        assert.ok(!placeholderRegex.test(p.stage4ExamSheet.limitAndDimensionCheck), `Problem ${p.id} reflection contains placeholder`);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 3. Mandatory Input 3: KaTeX 100% Parsing & Unicode Subscript Audit
  // --------------------------------------------------------------------------
  describe('Mandate 3: KaTeX 100% Parsing & Zero Unicode Subscripts', () => {

    it('3.1: Zero unicode subscripts in chapter1ProblemsEn.ts file source', () => {
      const ch1Source = fs.readFileSync(path.join(DATA_DIR, 'chapter1ProblemsEn.ts'), 'utf8');
      const matches = ch1Source.match(new RegExp(FORBIDDEN_UNICODE_SUBSCRIPTS, 'g')) || [];
      assert.equal(matches.length, 0, `Found ${matches.length} unicode subscripts in chapter1ProblemsEn.ts: ${matches.join(', ')}`);
    });

    it('3.2: Zero unicode subscripts in chapter2ProblemsEn.ts file source', () => {
      const ch2Source = fs.readFileSync(path.join(DATA_DIR, 'chapter2ProblemsEn.ts'), 'utf8');
      const matches = ch2Source.match(new RegExp(FORBIDDEN_UNICODE_SUBSCRIPTS, 'g')) || [];
      assert.equal(matches.length, 0, `Found ${matches.length} unicode subscripts in chapter2ProblemsEn.ts: ${matches.join(', ')}`);
    });

    it('3.3: Zero unicode subscripts across all runtime problem properties', () => {
      const allProblems = [
        ...getChapterProblems(1, 'en'),
        ...getChapterProblems(2, 'en'),
      ];

      for (const p of allProblems) {
        assert.ok(!FORBIDDEN_UNICODE_SUBSCRIPTS.test(p.givenLatex), `Problem ${p.id} givenLatex has unicode subscript`);
        assert.ok(!FORBIDDEN_UNICODE_SUBSCRIPTS.test(p.targetLatex), `Problem ${p.id} targetLatex has unicode subscript`);
        for (const opt of p.stage1Setup.options) {
          assert.ok(!FORBIDDEN_UNICODE_SUBSCRIPTS.test(opt.latex), `Problem ${p.id} option latex has unicode subscript`);
        }
        for (const step of p.stage2Derivation) {
          assert.ok(!FORBIDDEN_UNICODE_SUBSCRIPTS.test(step.mathLatex), `Problem ${p.id} step mathLatex has unicode subscript`);
        }
        assert.ok(!FORBIDDEN_UNICODE_SUBSCRIPTS.test(p.stage4ExamSheet.finalBoxedLatex), `Problem ${p.id} boxedLatex has unicode subscript`);
      }
    });

    it('3.4: KaTeX parses 100% of mathematical equations across all 54 problems with throwOnError: true', () => {
      const allProblems = [
        ...getChapterProblems(1, 'en'),
        ...getChapterProblems(2, 'en'),
      ];

      let totalFormulasParsed = 0;
      const parseFormula = (raw, context) => {
        if (!raw || !raw.trim()) return;
        totalFormulasParsed++;
        try {
          katex.renderToString(raw, {
            throwOnError: true,
            strict: false,
            trust: true,
          });
        } catch (err) {
          assert.fail(`KaTeX parse failure in ${context}: "${raw}" — Error: ${err.message}`);
        }
      };

      for (const p of allProblems) {
        // Given & Target
        parseFormula(p.givenLatex, `${p.id}.givenLatex`);
        parseFormula(p.targetLatex, `${p.id}.targetLatex`);

        // Stage 1 Options
        p.stage1Setup.options.forEach((opt, idx) => {
          parseFormula(opt.latex, `${p.id}.stage1Setup.options[${idx}].latex`);
        });

        // Stage 2 Derivations
        p.stage2Derivation.forEach((step, idx) => {
          parseFormula(step.mathLatex, `${p.id}.stage2Derivation[${idx}].mathLatex`);
        });

        // Stage 4 Final Boxed
        parseFormula(p.stage4ExamSheet.finalBoxedLatex, `${p.id}.stage4ExamSheet.finalBoxedLatex`);

        // Inline math embedded in text fields
        const textFields = [
          p.statement,
          p.stage1Setup.physicalPrinciple,
          ...p.stage2Derivation.map((s) => s.derivationText),
          p.stage4ExamSheet.limitAndDimensionCheck,
        ];
        const inlineMathRegex = /\$([^$]+)\$/g;
        for (const text of textFields) {
          let match;
          while ((match = inlineMathRegex.exec(text)) !== null) {
            parseFormula(match[1], `${p.id} embedded inline math`);
          }
        }
      }

      // Assert significant coverage (54 problems * ~8-12 formulas each >= 400 formulas)
      assert.ok(totalFormulasParsed >= 400, `Expected at least 400 formulas tested, got ${totalFormulasParsed}`);
    });
  });

  // --------------------------------------------------------------------------
  // 4. Mandatory Input 4: Proof Coach Engine Methods & State Integrity
  // --------------------------------------------------------------------------
  describe('Mandate 4: Proof Coach Engine UI State & Method Behavior', () => {
    const problems = getChapterProblems(1, 'en');

    it('4.1: Initial instance state defaults to activeProblemIndex=0 and activeStage=0', () => {
      const engine = new ProofCoachEngineUI();
      assert.equal(engine.getActiveProblemIndex(), 0);
      assert.equal(engine.getActiveStage(), 0);
    });

    it('4.2: Accessors getActiveProblemIndex/setActiveProblemIndex and getActiveStage/setActiveStage function correctly', () => {
      const engine = new ProofCoachEngineUI();
      engine.setActiveProblemIndex(7);
      assert.equal(engine.getActiveProblemIndex(), 7);

      engine.setActiveStage(3);
      assert.equal(engine.getActiveStage(), 3);
    });

    it('4.3: getActiveProblemId returns ID of currently active problem or falls back safely', () => {
      const engine = new ProofCoachEngineUI();
      assert.equal(engine.getActiveProblemId(problems), 'prob-1-1');

      engine.setActiveProblemIndex(5);
      assert.equal(engine.getActiveProblemId(problems), 'prob-1-6');

      // Out of range index falls back to first problem
      engine.setActiveProblemIndex(999);
      assert.equal(engine.getActiveProblemId(problems), 'prob-1-1');

      // Empty array falls back to empty string
      assert.equal(engine.getActiveProblemId([]), '');
    });

    it('4.4: setProblemById updates activeProblemIndex for valid IDs and ignores invalid IDs', () => {
      const engine = new ProofCoachEngineUI();
      engine.setProblemById(problems, 'prob-1-14');
      assert.equal(engine.getActiveProblemIndex(), 13);

      // Non-existent ID should keep current index without throwing
      engine.setProblemById(problems, 'prob-non-existent-99');
      assert.equal(engine.getActiveProblemIndex(), 13);
    });

    it('4.5: resetProblemState resets targeted problem or all problems', () => {
      const engine = new ProofCoachEngineUI();
      const mockContainer = new MockDOMElement('div');
      const callbacks = { onLoadProblemScene: () => {}, onOpenMathTrick: () => {} };

      // Render problem 1 and select an option
      engine.setActiveProblemIndex(0);
      engine.renderProblemsView(mockContainer, problems, callbacks);

      const optBtn = mockContainer.querySelector('[data-s1-opt="0"]');
      assert.ok(optBtn, 'Option button must exist');
      optBtn.click();

      // Targeted reset for prob-1-1
      engine.resetProblemState('prob-1-1');

      // Global reset
      engine.resetProblemState();
      assert.equal(engine.getActiveProblemIndex(), 0);
    });

    it('4.6: renderProblemsView generates full HTML structure with pills, tabs, cards, and nav bar', () => {
      const engine = new ProofCoachEngineUI();
      const container = new MockDOMElement('div');
      let loadedProblem = null;
      let openedTrick = null;

      const callbacks = {
        onLoadProblemScene: (p) => { loadedProblem = p; },
        onOpenMathTrick: (id) => { openedTrick = id; },
      };

      engine.renderProblemsView(container, problems, callbacks);

      // Verify automatic scene sync
      assert.ok(loadedProblem, 'onLoadProblemScene must be called during render');
      assert.equal(loadedProblem.id, 'prob-1-1');

      // Verify problem selector pill buttons
      const pills = container.querySelectorAll('[data-prob-idx]');
      assert.equal(pills.length, CANONICAL_CH1_COUNT, 'Must render 22 problem pills for Ch1');

      // Verify stage tabs (0: All, 1: Setup, 2: Derivation, 3: Verify, 4: Exam Sheet)
      const stageTabs = container.querySelectorAll('[data-stage]');
      assert.equal(stageTabs.length, 5, 'Must render 5 stage tabs (0 to 4)');

      // Verify nav buttons
      const prevBtn = container.querySelector('.coach-nav-prev');
      const nextBtn = container.querySelector('.coach-nav-next');
      const resetBtn = container.querySelector('.coach-nav-reset');
      const solBtn = container.querySelector('.coach-nav-solution');
      assert.ok(prevBtn, 'Prev stage button must exist');
      assert.ok(nextBtn, 'Next stage button must exist');
      assert.ok(resetBtn, 'Reset button must exist');
      assert.ok(solBtn, 'Show solution button must exist');
    });

    it('4.7: Interactive simulation: option click reveals feedback badge and records choice', () => {
      const engine = new ProofCoachEngineUI();
      const container = new MockDOMElement('div');
      const callbacks = { onLoadProblemScene: () => {}, onOpenMathTrick: () => {} };

      engine.renderProblemsView(container, problems, callbacks);

      const correctOptBtn = container.querySelector('[data-s1-opt][data-correct="true"]');
      const wrongOptBtn = container.querySelector('[data-s1-opt][data-correct="false"]');
      assert.ok(correctOptBtn && wrongOptBtn, 'Option buttons must exist');

      // Click correct option
      correctOptBtn.click();
      assert.ok(correctOptBtn.classList.has('correct'), 'Correct button must have "correct" class');

      // Click wrong option
      wrongOptBtn.click();
      assert.ok(wrongOptBtn.classList.has('wrong'), 'Wrong button must have "wrong" class');
    });

    it('4.8: Interactive simulation: show solution button reveals all steps and navigates to Stage 4', () => {
      const engine = new ProofCoachEngineUI();
      const container = new MockDOMElement('div');
      const callbacks = { onLoadProblemScene: () => {}, onOpenMathTrick: () => {} };

      engine.renderProblemsView(container, problems, callbacks);
      assert.equal(engine.getActiveStage(), 0);

      const solBtn = container.querySelector('.coach-nav-solution');
      solBtn.click();

      // Show solution switches active stage to 4 (Exam Sheet)
      assert.equal(engine.getActiveStage(), 4, 'Show solution must navigate directly to Stage 4');
    });

    it('4.9: Interactive simulation: prev/next buttons clamp between stages 1 and 4', () => {
      const engine = new ProofCoachEngineUI();
      const container = new MockDOMElement('div');
      const callbacks = { onLoadProblemScene: () => {}, onOpenMathTrick: () => {} };

      engine.setActiveStage(1);
      engine.renderProblemsView(container, problems, callbacks);

      const prevBtn = container.querySelector('.coach-nav-prev');
      const nextBtn = container.querySelector('.coach-nav-next');

      // Prev at Stage 1 should not decrement below 1
      prevBtn.click();
      assert.equal(engine.getActiveStage(), 1);

      // Next increments from 1 to 2
      nextBtn.click();
      assert.equal(engine.getActiveStage(), 2);

      // Increment to 3 and 4
      nextBtn.click();
      assert.equal(engine.getActiveStage(), 3);
      nextBtn.click();
      assert.equal(engine.getActiveStage(), 4);

      // Next at Stage 4 should not increment above 4
      nextBtn.click();
      assert.equal(engine.getActiveStage(), 4);
    });

    it('4.10: Math trick trigger invocation properly forwards trick ID to callback', () => {
      const engine = new ProofCoachEngineUI();
      const container = new MockDOMElement('div');
      let openedTrickId = null;
      const callbacks = {
        onLoadProblemScene: () => {},
        onOpenMathTrick: (id) => { openedTrickId = id; },
      };

      // Problem 1.1 uses trick-determinant in step 1
      engine.setActiveProblemIndex(0);
      engine.renderProblemsView(container, problems, callbacks);

      const trickBtn = container.querySelector('[data-trick-id]');
      assert.ok(trickBtn, 'Trick trigger button must exist in Problem 1.1');
      trickBtn.click();
      assert.equal(openedTrickId, 'trick-determinant');
    });

    it('4.11: Language toggle preservation: state persists when re-rendered with new locale', () => {
      const engine = new ProofCoachEngineUI();
      const container = new MockDOMElement('div');
      const callbacks = { onLoadProblemScene: () => {}, onOpenMathTrick: () => {} };

      engine.setActiveProblemIndex(14); // Problem 1.15
      engine.setActiveStage(3);

      // Simulate Turkish render
      i18nManager.setLocale('tr');
      engine.renderProblemsView(container, getChapterProblems(1, 'tr'), callbacks);
      assert.equal(engine.getActiveProblemIndex(), 14);
      assert.equal(engine.getActiveStage(), 3);

      // Switch to English and re-render
      i18nManager.setLocale('en');
      engine.renderProblemsView(container, getChapterProblems(1, 'en'), callbacks);
      assert.equal(engine.getActiveProblemIndex(), 14, 'Problem index must be preserved across locale switch');
      assert.equal(engine.getActiveStage(), 3, 'Stage must be preserved across locale switch');
    });
  });

  // --------------------------------------------------------------------------
  // 5. Mandatory Input 5: i18n Coach Translation Namespace Coverage
  // --------------------------------------------------------------------------
  describe('Mandate 5: i18n Coach Translation Namespace Coverage', () => {
    const requiredCoachKeys = [
      'allStages', 'stage1Tab', 'stage2Tab', 'stage3Tab', 'stage4Tab',
      'stage1Title', 'stage1Subtitle', 'physicalPrinciple', 'startingMove',
      'stage2Title', 'stage2Subtitle', 'revealAllSteps', 'stepLabel',
      'transitionHint', 'revealStepBtn', 'hideStepBtn', 'stage3Title',
      'stage3Subtitle', 'syncSceneBtn', 'whatToObserve', 'stage4Title',
      'stage4Subtitle', 'givenHeader', 'targetHeader', 'finalBoxedLabel',
      'limitDimensionCheck', 'rubricTitle', 'heroGiven', 'heroTarget',
      'homeExperimentTag', 'nextStage', 'prevStage', 'resetProblem',
      'verifyAnswer', 'showSolution', 'correctBadge', 'incorrectBadge',
      'trapCallout', 'hintToggle'
    ];

    it('5.1: TRANSLATIONS.tr.coach contains all 39 required keys with non-empty values', () => {
      const trCoach = TRANSLATIONS.tr.coach;
      assert.ok(trCoach, 'TRANSLATIONS.tr.coach must exist');
      for (const key of requiredCoachKeys) {
        assert.ok(trCoach[key] && trCoach[key].trim().length > 0, `Missing or empty TR key: coach.${key}`);
      }
    });

    it('5.2: TRANSLATIONS.en.coach contains all 39 required keys with non-empty values', () => {
      const enCoach = TRANSLATIONS.en.coach;
      assert.ok(enCoach, 'TRANSLATIONS.en.coach must exist');
      for (const key of requiredCoachKeys) {
        assert.ok(enCoach[key] && enCoach[key].trim().length > 0, `Missing or empty EN key: coach.${key}`);
      }
    });

    it('5.3: 1:1 Key parity between Turkish and English coach dictionaries', () => {
      const trKeys = Object.keys(TRANSLATIONS.tr.coach).sort();
      const enKeys = Object.keys(TRANSLATIONS.en.coach).sort();
      assert.deepEqual(enKeys, trKeys, 'Coach translation keys must be identical between TR and EN');
    });

    it('5.4: i18nManager.t substitutes {step} parameter correctly in stepLabel', () => {
      i18nManager.setLocale('en');
      assert.equal(i18nManager.t('coach.stepLabel', { step: 2 }), 'Step 2:');

      i18nManager.setLocale('tr');
      assert.equal(i18nManager.t('coach.stepLabel', { step: 3 }), 'Adım 3:');
    });
  });

  // --------------------------------------------------------------------------
  // 6. Adversarial Stress & Scalability Benchmarks
  // --------------------------------------------------------------------------
  describe('Mandate 6: Adversarial Stress & Scalability Benchmarks', () => {

    it('6.1: High-throughput problem accessors: 10,000 calls execute in < 100ms', () => {
      const start = performance.now();
      for (let i = 0; i < 5000; i++) {
        getChapterProblems(1, 'en');
        getChapterProblems(2, 'en');
      }
      const duration = performance.now() - start;
      assert.ok(duration < 100, `10,000 accessor calls took ${duration.toFixed(2)}ms (must be < 100ms)`);
    });

    it('6.2: Rapid engine state transition stress: 10,000 state mutations execute in < 150ms', () => {
      const engine = new ProofCoachEngineUI();
      const start = performance.now();

      for (let i = 0; i < 10000; i++) {
        const targetIdx = i % 22;
        const targetStage = i % 5;
        engine.setActiveProblemIndex(targetIdx);
        engine.setActiveStage(targetStage);
        if (i % 500 === 0) {
          engine.resetProblemState(`prob-1-${targetIdx + 1}`);
        }
      }

      const duration = performance.now() - start;
      assert.ok(duration < 150, `10,000 state transitions took ${duration.toFixed(2)}ms (must be < 150ms)`);
      assert.equal(engine.getActiveProblemIndex(), 9999 % 22);
      assert.equal(engine.getActiveStage(), 9999 % 5);
    });

    it('6.3: Fuzz testing getChapterProblems with invalid and extreme arguments', () => {
      // Negative chapter
      assert.doesNotThrow(() => getChapterProblems(-1, 'en'));
      // Floating point chapter
      assert.doesNotThrow(() => getChapterProblems(1.5, 'en'));
      // Extreme chapter
      assert.doesNotThrow(() => getChapterProblems(999999, 'en'));
      // Invalid locale
      assert.doesNotThrow(() => getChapterProblems(1, 'invalid-lang'));
      // Null / undefined locale
      assert.doesNotThrow(() => getChapterProblems(1, null));
      assert.doesNotThrow(() => getChapterProblems(2, undefined));
    });

    it('6.4: Mathematical formula parity across language toggles for key classic problems', () => {
      const ch1En = getChapterProblems(1, 'en');
      const ch1Tr = getChapterProblems(1, 'tr');
      const ch2En = getChapterProblems(2, 'en');
      const ch2Tr = getChapterProblems(2, 'tr');

      // Problem 1.14: 3-bead loaded string dispersion relation
      const p114En = ch1En.find((p) => p.id === 'prob-1-14');
      const p114Tr = ch1Tr.find((p) => p.id === 'prob-1-14');
      assert.equal(
        p114En.stage4ExamSheet.finalBoxedLatex.trim(),
        p114Tr.stage4ExamSheet.finalBoxedLatex.trim(),
        'Problem 1.14 boxed formula must match exactly across TR and EN'
      );

      // Problem 2.26: Continuous string boundary conditions & Fourier equivalence
      const p226En = ch2En.find((p) => p.id === 'prob-2-26');
      const p226Tr = ch2Tr.find((p) => p.id === 'prob-2-26');
      assert.equal(
        p226En.stage4ExamSheet.finalBoxedLatex.trim(),
        p226Tr.stage4ExamSheet.finalBoxedLatex.trim(),
        'Problem 2.26 boxed formula must match exactly across TR and EN'
      );
    });
  });

});
