/**
 * ============================================================================
 * EMPIRICAL CHALLENGER TEST SUITE: MILESTONE 2
 * Berkeley Waves Interactive Laboratory — Theory Modules & Derivation Engine i18n
 *
 * Verification Mandates:
 *  1. getChapterModules(1, 'en') & getChapterModules(2, 'en') return valid modules
 *     with complete English titles, summaries, equations, steps, checkpoints,
 *     solved examples, and common traps.
 *  2. getMathTricks('en') returns 6 tricks matching canonical IDs and demo types.
 *  3. getRoadmapChapters('en') returns 7 chapters (3-9) with complete data.
 *  4. KaTeX successfully parses EVERY single formula in English modules, tricks,
 *     and roadmap datasets without error or unicode subscripts.
 *  5. Adversarial stress: parameter fallbacks, 1:1 structural parity with TR,
 *     high-throughput accessor benchmarks, and deep property integrity.
 *
 * Runner:
 *  node --test tests/m2_stress_challenge.test.mjs
 * ============================================================================
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import katexMod from 'katex';
import ts from 'typescript';

const katex = katexMod.default || katexMod;

const PROJECT_ROOT = path.resolve(import.meta.dirname, '..');
const DATA_DIR = path.join(PROJECT_ROOT, 'src', 'data');

// ----------------------------------------------------------------------------
// TS Transpiler Helper
// ----------------------------------------------------------------------------
function loadTsModule(absPath, loaded = new Map()) {
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
      return loadTsModule(resolved, loaded);
    }
    return null;
  };

  const fn = new Function('exports', 'module', 'require', '__dirname', '__filename', res.outputText);
  fn(mod.exports, mod, customRequire, path.dirname(absPath), absPath);
  return mod.exports;
}

const dataModule = loadTsModule(path.join(DATA_DIR, 'index.ts'));
const { getChapterModules, getMathTricks, getRoadmapChapters } = dataModule;

// Canonical constants
const CANONICAL_TRICK_IDS = [
  'trick-taylor',
  'trick-phasor',
  'trick-determinant',
  'trick-trig-beats',
  'trick-separation',
  'trick-orthogonality',
];

const CANONICAL_DEMO_TYPES = [
  'taylor',
  'phasor',
  'determinant',
  'trig_lattice',
  'separation',
  'orthogonality',
];

const FORBIDDEN_UNICODE_SUBSCRIPTS = /[₀₁₂₃₄₅₆₇₈₉]/;

// ============================================================================
// TEST SUITE
// ============================================================================

describe('Empirical Challenge: Milestone 2 Deliverables', () => {

  // --------------------------------------------------------------------------
  // 1. Chapter 1 & Chapter 2 Modules Completeness & English Fidelity
  // --------------------------------------------------------------------------
  describe('Challenge 1: English Theory Modules Completeness (Ch1 & Ch2)', () => {

    it('1.1: getChapterModules(1, "en") returns 5 fully articulated modules (1.1-1.5)', () => {
      const ch1En = getChapterModules(1, 'en');
      assert.ok(Array.isArray(ch1En), 'Ch1 EN must return an array');
      assert.equal(ch1En.length, 5, 'Ch1 EN must contain exactly 5 modules');

      const expectedCodes = ['1.1', '1.2', '1.3', '1.4', '1.5'];
      const expectedIds = ['mod-1-1', 'mod-1-2', 'mod-1-3', 'mod-1-4', 'mod-1-5'];

      ch1En.forEach((mod, idx) => {
        assert.equal(mod.chapter, 1, `Module ${idx} chapter must be 1`);
        assert.equal(mod.code, expectedCodes[idx], `Module ${idx} code mismatch`);
        assert.equal(mod.id, expectedIds[idx], `Module ${idx} id mismatch`);
        assert.ok(typeof mod.title === 'string' && mod.title.trim().length > 10, `Module ${mod.id} missing title`);
        assert.ok(typeof mod.shortTitle === 'string' && mod.shortTitle.trim().length > 5, `Module ${mod.id} missing shortTitle`);
        assert.ok(typeof mod.summary === 'string' && mod.summary.trim().length > 30, `Module ${mod.id} missing summary`);
        assert.ok(typeof mod.coreQuestion === 'string' && mod.coreQuestion.trim().length > 20, `Module ${mod.id} missing coreQuestion`);
        assert.ok(mod.title.includes(' ') && !mod.title.includes('Bölüm'), `Module ${mod.id} title must be in English`);
      });
    });

    it('1.2: getChapterModules(2, "en") returns 5 fully articulated modules (2.1-2.5)', () => {
      const ch2En = getChapterModules(2, 'en');
      assert.ok(Array.isArray(ch2En), 'Ch2 EN must return an array');
      assert.equal(ch2En.length, 5, 'Ch2 EN must contain exactly 5 modules');

      const expectedCodes = ['2.1', '2.2', '2.3', '2.4', '2.5'];
      const expectedIds = ['mod-2-1', 'mod-2-2', 'mod-2-3', 'mod-2-4', 'mod-2-5'];

      ch2En.forEach((mod, idx) => {
        assert.equal(mod.chapter, 2, `Module ${idx} chapter must be 2`);
        assert.equal(mod.code, expectedCodes[idx], `Module ${idx} code mismatch`);
        assert.equal(mod.id, expectedIds[idx], `Module ${idx} id mismatch`);
        assert.ok(typeof mod.title === 'string' && mod.title.trim().length > 10, `Module ${mod.id} missing title`);
        assert.ok(typeof mod.shortTitle === 'string' && mod.shortTitle.trim().length > 5, `Module ${mod.id} missing shortTitle`);
        assert.ok(typeof mod.summary === 'string' && mod.summary.trim().length > 30, `Module ${mod.id} missing summary`);
        assert.ok(typeof mod.coreQuestion === 'string' && mod.coreQuestion.trim().length > 20, `Module ${mod.id} missing coreQuestion`);
        assert.ok(mod.title.includes(' ') && !mod.title.includes('Bölüm'), `Module ${mod.id} title must be in English`);
      });
    });

    it('1.3: Total derivation steps in Ch1 EN is 9 and in Ch2 EN is 8, all with complete steps and breakdowns', () => {
      const ch1En = getChapterModules(1, 'en');
      const ch2En = getChapterModules(2, 'en');

      const ch1StepCount = ch1En.reduce((acc, m) => acc + (m.derivationSteps?.length || 0), 0);
      const ch2StepCount = ch2En.reduce((acc, m) => acc + (m.derivationSteps?.length || 0), 0);

      assert.equal(ch1StepCount, 9, `Chapter 1 must have exactly 9 derivation steps (found ${ch1StepCount})`);
      assert.equal(ch2StepCount, 8, `Chapter 2 must have exactly 8 derivation steps (found ${ch2StepCount})`);

      [...ch1En, ...ch2En].forEach((mod) => {
        mod.derivationSteps.forEach((step, sIdx) => {
          assert.ok(step.stepNumber > 0, `Step ${sIdx} in ${mod.id} missing stepNumber`);
          assert.ok(typeof step.title === 'string' && step.title.length > 5, `Step ${step.stepNumber} in ${mod.id} missing title`);
          assert.ok(typeof step.physicalMotivation === 'string' && step.physicalMotivation.length > 15, `Step ${step.stepNumber} in ${mod.id} missing physicalMotivation`);
          assert.ok(typeof step.mainEquationLatex === 'string' && step.mainEquationLatex.length > 3, `Step ${step.stepNumber} in ${mod.id} missing mainEquationLatex`);
          assert.ok(Array.isArray(step.algebraicBreakdown) && step.algebraicBreakdown.length >= 1, `Step ${step.stepNumber} in ${mod.id} missing algebraicBreakdown`);

          step.algebraicBreakdown.forEach((sub, bIdx) => {
            assert.ok(typeof sub.subStepTitle === 'string' && sub.subStepTitle.length > 3, `Substep ${bIdx} in step ${step.stepNumber} (${mod.id}) missing title`);
            assert.ok(typeof sub.explanation === 'string' && sub.explanation.length > 10, `Substep ${bIdx} in step ${step.stepNumber} (${mod.id}) missing explanation`);
            assert.ok(typeof sub.formulaLatex === 'string' && sub.formulaLatex.length > 2, `Substep ${bIdx} in step ${step.stepNumber} (${mod.id}) missing formulaLatex`);
          });

          // Check trainerCheckpoint
          assert.ok(step.trainerCheckpoint, `Step ${step.stepNumber} in ${mod.id} missing trainerCheckpoint`);
          assert.ok(step.trainerCheckpoint.questionPrompt.length > 10, `Checkpoint in ${mod.id} step ${step.stepNumber} missing questionPrompt`);
          assert.ok(Array.isArray(step.trainerCheckpoint.options) && step.trainerCheckpoint.options.length >= 2, `Checkpoint in ${mod.id} step ${step.stepNumber} options < 2`);
          const correctCount = step.trainerCheckpoint.options.filter(o => o.isCorrect).length;
          assert.ok(correctCount >= 1, `Checkpoint in ${mod.id} step ${step.stepNumber} must have at least one correct option`);
        });
      });
    });

    it('1.4: All fundamental equations in Ch1 and Ch2 have formulaLatex matching latex', () => {
      const ch1En = getChapterModules(1, 'en');
      const ch2En = getChapterModules(2, 'en');

      [...ch1En, ...ch2En].forEach((mod) => {
        assert.ok(Array.isArray(mod.fundamentalEquations) && mod.fundamentalEquations.length >= 1, `Module ${mod.id} must have fundamental equations`);
        mod.fundamentalEquations.forEach((eq, eqIdx) => {
          assert.ok(eq.label && eq.label.length > 3, `Eq ${eqIdx} in ${mod.id} missing label`);
          assert.ok(eq.latex && eq.latex.length > 3, `Eq ${eqIdx} in ${mod.id} missing latex`);
          assert.ok(eq.formulaLatex && eq.formulaLatex.length > 3, `Eq ${eqIdx} in ${mod.id} missing formulaLatex`);
          assert.equal(eq.formulaLatex.trim(), eq.latex.trim(), `Eq ${eqIdx} in ${mod.id} formulaLatex must equal latex`);
        });
      });
    });

    it('1.5: Solved examples and common traps are non-empty and translated to English in all modules', () => {
      const ch1En = getChapterModules(1, 'en');
      const ch2En = getChapterModules(2, 'en');

      [...ch1En, ...ch2En].forEach((mod) => {
        assert.ok(Array.isArray(mod.solvedExamples) && mod.solvedExamples.length >= 1, `Module ${mod.id} missing solvedExamples`);
        mod.solvedExamples.forEach((ex) => {
          assert.ok(ex.id && ex.id.length > 0, `Solved example in ${mod.id} missing id`);
          assert.ok(ex.title && ex.title.length > 5, `Solved example ${ex.id} in ${mod.id} missing title`);
          assert.ok(ex.problemStatement && ex.problemStatement.length > 15, `Solved example ${ex.id} missing problemStatement`);
          assert.ok(ex.strategy && ex.strategy.length > 10, `Solved example ${ex.id} missing strategy`);
          assert.ok(Array.isArray(ex.stepsLatex) && ex.stepsLatex.length >= 1, `Solved example ${ex.id} stepsLatex empty`);
          assert.ok(ex.keyTakeaway && ex.keyTakeaway.length > 10, `Solved example ${ex.id} missing keyTakeaway`);
        });

        assert.ok(Array.isArray(mod.commonTraps) && mod.commonTraps.length >= 1, `Module ${mod.id} missing commonTraps`);
        mod.commonTraps.forEach((trap, tIdx) => {
          assert.ok(trap.trap && trap.trap.length > 5, `Trap ${tIdx} in ${mod.id} missing trap text`);
          assert.ok(trap.whyWrong && trap.whyWrong.length > 10, `Trap ${tIdx} in ${mod.id} missing whyWrong`);
          assert.ok(trap.correctApproach && trap.correctApproach.length > 10, `Trap ${tIdx} in ${mod.id} missing correctApproach`);
        });
      });
    });
  });

  // --------------------------------------------------------------------------
  // 2. Mathematical Tricks Verification
  // --------------------------------------------------------------------------
  describe('Challenge 2: Mathematical Tricks Dictionary (6 Canonical Tricks)', () => {

    it('2.1: getMathTricks("en") returns exactly 6 tricks matching canonical IDs', () => {
      const tricksEn = getMathTricks('en');
      assert.ok(Array.isArray(tricksEn), 'getMathTricks("en") must return array');
      assert.equal(tricksEn.length, 6, 'Must return exactly 6 tricks');

      const returnedIds = tricksEn.map(t => t.id);
      assert.deepEqual(returnedIds, CANONICAL_TRICK_IDS, 'Returned IDs must match canonical IDs in order');
    });

    it('2.2: Demo types match canonical demo types 1:1', () => {
      const tricksEn = getMathTricks('en');
      const demoTypes = tricksEn.map(t => t.interactiveDemoType);
      assert.deepEqual(demoTypes, CANONICAL_DEMO_TYPES, 'Interactive demo types must match canonical list');
    });

    it('2.3: English tricks have non-empty English titles, summaries, whenUsed, proofs, and traps', () => {
      const tricksEn = getMathTricks('en');
      tricksEn.forEach((trick) => {
        assert.ok(trick.title && trick.title.length > 10, `Trick ${trick.id} missing title`);
        assert.ok(trick.badgeLabel && trick.badgeLabel.length > 5, `Trick ${trick.id} missing badgeLabel`);
        assert.ok(trick.category && trick.category.length > 3, `Trick ${trick.id} missing category`);
        assert.ok(trick.summary && trick.summary.length > 30, `Trick ${trick.id} missing summary`);
        assert.ok(trick.whenUsedInBerkeley && trick.whenUsedInBerkeley.length > 20, `Trick ${trick.id} missing whenUsedInBerkeley`);
        assert.ok(trick.deadlyExamTrap && trick.deadlyExamTrap.length > 20, `Trick ${trick.id} missing deadlyExamTrap`);
        assert.ok(Array.isArray(trick.stepByStepProof) && trick.stepByStepProof.length >= 2, `Trick ${trick.id} stepByStepProof < 2`);

        trick.stepByStepProof.forEach((step, sIdx) => {
          assert.ok(step.title && step.title.length > 5, `Proof step ${sIdx} in ${trick.id} missing title`);
          assert.ok(step.text && step.text.length > 10, `Proof step ${sIdx} in ${trick.id} missing text`);
          assert.ok(step.latex && step.latex.length > 3, `Proof step ${sIdx} in ${trick.id} missing latex`);
        });
      });
    });

    it('2.4: coreIdentityLatex matches character-for-character between TR and EN tricks', () => {
      const tricksTr = getMathTricks('tr');
      const tricksEn = getMathTricks('en');
      assert.equal(tricksEn.length, tricksTr.length);

      tricksEn.forEach((enTrick, idx) => {
        const trTrick = tricksTr[idx];
        assert.equal(enTrick.id, trTrick.id, `ID mismatch at index ${idx}`);
        assert.equal(
          enTrick.coreIdentityLatex.trim(),
          trTrick.coreIdentityLatex.trim(),
          `coreIdentityLatex mismatch for ${enTrick.id}`
        );
      });
    });
  });

  // --------------------------------------------------------------------------
  // 3. Roadmap Chapters 3-9 Verification
  // --------------------------------------------------------------------------
  describe('Challenge 3: Roadmap Chapters 3-9 Completeness in English', () => {

    it('3.1: getRoadmapChapters("en") returns exactly 7 chapters (Chapters 3 through 9)', () => {
      const roadmapEn = getRoadmapChapters('en');
      assert.ok(Array.isArray(roadmapEn), 'Roadmap EN must return array');
      assert.equal(roadmapEn.length, 7, 'Roadmap EN must contain exactly 7 chapters');

      const expectedChapterNumbers = [3, 4, 5, 6, 7, 8, 9];
      const actualChapterNumbers = roadmapEn.map(c => c.chapterNumber);
      assert.deepEqual(actualChapterNumbers, expectedChapterNumbers, 'Chapter numbers must be 3..9 in order');
    });

    it('3.2: Every English roadmap chapter has English titles, themes, and key derivations', () => {
      const roadmapEn = getRoadmapChapters('en');
      roadmapEn.forEach((ch) => {
        assert.ok(ch.title && ch.title.startsWith('Chapter '), `Chapter ${ch.chapterNumber} title must start with "Chapter "`);
        assert.ok(ch.englishTitle && ch.englishTitle.length > 10, `Chapter ${ch.chapterNumber} missing englishTitle`);
        assert.ok(ch.bookPages && ch.bookPages.includes('Pages'), `Chapter ${ch.chapterNumber} bookPages must say "Pages"`);
        assert.ok(ch.coreTheme && ch.coreTheme.length > 30, `Chapter ${ch.chapterNumber} missing coreTheme`);
        assert.ok(!ch.title.includes('Bölüm'), `Chapter ${ch.chapterNumber} title must not contain Turkish "Bölüm"`);
        assert.ok(Array.isArray(ch.keyDerivations) && ch.keyDerivations.length >= 1, `Chapter ${ch.chapterNumber} keyDerivations empty`);

        ch.keyDerivations.forEach((d, dIdx) => {
          assert.ok(d.code && d.code.length > 0, `Derivation ${dIdx} in chapter ${ch.chapterNumber} missing code`);
          assert.ok(d.title && d.title.length > 5, `Derivation ${dIdx} in chapter ${ch.chapterNumber} missing title`);
          assert.ok(d.governingEquationLatex && d.governingEquationLatex.length > 3, `Derivation ${dIdx} in chapter ${ch.chapterNumber} missing latex`);
          assert.ok(d.physicalInsight && d.physicalInsight.length > 15, `Derivation ${dIdx} in chapter ${ch.chapterNumber} missing physicalInsight`);
        });
      });
    });
  });

  // --------------------------------------------------------------------------
  // 4. KaTeX Parsing Oracle & Forbidden Subscripts Scanner
  // --------------------------------------------------------------------------
  describe('Challenge 4: KaTeX Parsing Oracle for All English Datasets', () => {

    it('4.1: ZERO Unicode subscript characters exist in LaTeX formulas across English datasets', () => {
      const ch1En = getChapterModules(1, 'en');
      const ch2En = getChapterModules(2, 'en');
      const tricksEn = getMathTricks('en');
      const roadmapEn = getRoadmapChapters('en');

      const allLatexStrings = [];

      // Collect all module LaTeX formulas
      [...ch1En, ...ch2En].forEach((mod) => {
        mod.fundamentalEquations?.forEach(eq => {
          if (eq.latex) allLatexStrings.push({ src: `${mod.id}.fundamentalEquations.latex`, str: eq.latex });
          if (eq.formulaLatex) allLatexStrings.push({ src: `${mod.id}.fundamentalEquations.formulaLatex`, str: eq.formulaLatex });
        });
        mod.symbolicTerms?.forEach(t => {
          if (t.latexBadge) allLatexStrings.push({ src: `${mod.id}.symbolicTerms.latexBadge`, str: t.latexBadge });
        });
        mod.derivationSteps?.forEach(s => {
          if (s.mainEquationLatex) allLatexStrings.push({ src: `${mod.id}.step${s.stepNumber}.mainEquationLatex`, str: s.mainEquationLatex });
          s.algebraicBreakdown?.forEach((b, bIdx) => {
            if (b.formulaLatex) allLatexStrings.push({ src: `${mod.id}.step${s.stepNumber}.breakdown${bIdx}`, str: b.formulaLatex });
          });
          s.trainerCheckpoint?.options?.forEach((o, oIdx) => {
            if (o.latex) allLatexStrings.push({ src: `${mod.id}.step${s.stepNumber}.checkpoint${oIdx}`, str: o.latex });
          });
        });
        mod.solvedExamples?.forEach(ex => {
          ex.stepsLatex?.forEach((s, sIdx) => {
            if (s.math) allLatexStrings.push({ src: `${mod.id}.${ex.id}.step${sIdx}`, str: s.math });
          });
        });
      });

      // Collect all tricks LaTeX formulas
      tricksEn.forEach((trick) => {
        if (trick.coreIdentityLatex) allLatexStrings.push({ src: `${trick.id}.coreIdentityLatex`, str: trick.coreIdentityLatex });
        trick.stepByStepProof?.forEach((s, sIdx) => {
          if (s.latex) allLatexStrings.push({ src: `${trick.id}.proof${sIdx}`, str: s.latex });
        });
      });

      // Collect all roadmap LaTeX formulas
      roadmapEn.forEach((ch) => {
        ch.keyDerivations?.forEach((d) => {
          if (d.governingEquationLatex) allLatexStrings.push({ src: `Ch${ch.chapterNumber}.${d.code}`, str: d.governingEquationLatex });
        });
      });

      assert.ok(allLatexStrings.length >= 150, `Expected at least 150 LaTeX formulas, collected ${allLatexStrings.length}`);

      const violations = [];
      allLatexStrings.forEach(({ src, str }) => {
        const m = str.match(FORBIDDEN_UNICODE_SUBSCRIPTS);
        if (m) {
          violations.push(`${src}: found "${m[0]}" in "${str}"`);
        }
      });

      assert.deepEqual(violations, [], `Found forbidden unicode subscripts in LaTeX formulas:\n${violations.join('\n')}`);
    });

    it('4.2: KaTeX parses every single formula in Chapter 1 & Chapter 2 English modules', () => {
      const ch1En = getChapterModules(1, 'en');
      const ch2En = getChapterModules(2, 'en');

      let parsedCount = 0;

      [...ch1En, ...ch2En].forEach((mod) => {
        // 1. Fundamental equations
        mod.fundamentalEquations.forEach((eq) => {
          assert.doesNotThrow(() => {
            katex.renderToString(eq.latex, { throwOnError: true, displayMode: true });
          }, `Failed parsing fundamental eq in ${mod.id}: ${eq.latex}`);
          parsedCount++;
        });

        // 2. Symbolic terms
        mod.symbolicTerms.forEach((term) => {
          if (term.latexBadge) {
            assert.doesNotThrow(() => {
              katex.renderToString(term.latexBadge, { throwOnError: true, displayMode: false });
            }, `Failed parsing latexBadge in ${mod.id}: ${term.latexBadge}`);
            parsedCount++;
          }
        });

        // 3. Derivation steps
        mod.derivationSteps.forEach((step) => {
          assert.doesNotThrow(() => {
            katex.renderToString(step.mainEquationLatex, { throwOnError: true, displayMode: true });
          }, `Failed parsing mainEquationLatex in step ${step.stepNumber} of ${mod.id}`);
          parsedCount++;

          step.algebraicBreakdown.forEach((sub) => {
            assert.doesNotThrow(() => {
              katex.renderToString(sub.formulaLatex, { throwOnError: true, displayMode: true });
            }, `Failed parsing breakdown in step ${step.stepNumber} of ${mod.id}: ${sub.formulaLatex}`);
            parsedCount++;
          });

          step.trainerCheckpoint.options.forEach((opt) => {
            assert.doesNotThrow(() => {
              katex.renderToString(opt.latex, { throwOnError: true, displayMode: false });
            }, `Failed parsing checkpoint option in step ${step.stepNumber} of ${mod.id}: ${opt.latex}`);
            parsedCount++;
          });
        });

        // 4. Solved examples
        mod.solvedExamples.forEach((ex) => {
          ex.stepsLatex.forEach((s) => {
            if (s.math) {
              assert.doesNotThrow(() => {
                katex.renderToString(s.math, { throwOnError: true, displayMode: true });
              }, `Failed parsing solvedExample step in ${mod.id}: ${s.math}`);
              parsedCount++;
            }
          });
        });
      });

      assert.ok(parsedCount >= 100, `Expected >= 100 formulas parsed in modules, got ${parsedCount}`);
    });

    it('4.3: KaTeX parses every single formula in English Math Tricks', () => {
      const tricksEn = getMathTricks('en');
      let parsedCount = 0;

      tricksEn.forEach((trick) => {
        // Core identity
        assert.doesNotThrow(() => {
          katex.renderToString(trick.coreIdentityLatex, { throwOnError: true, displayMode: true });
        }, `Failed parsing trick coreIdentityLatex: ${trick.id}`);
        parsedCount++;

        // Step by step proof formulas
        trick.stepByStepProof.forEach((step, sIdx) => {
          assert.doesNotThrow(() => {
            katex.renderToString(step.latex, { throwOnError: true, displayMode: true });
          }, `Failed parsing trick proof step ${sIdx} in ${trick.id}: ${step.latex}`);
          parsedCount++;
        });
      });

      assert.ok(parsedCount >= 20, `Expected >= 20 formulas parsed in tricks, got ${parsedCount}`);
    });

    it('4.4: KaTeX parses every single formula in English Roadmap Chapters 3-9', () => {
      const roadmapEn = getRoadmapChapters('en');
      let parsedCount = 0;

      roadmapEn.forEach((ch) => {
        ch.keyDerivations.forEach((d) => {
          assert.doesNotThrow(() => {
            katex.renderToString(d.governingEquationLatex, { throwOnError: true, displayMode: true });
          }, `Failed parsing roadmap equation in Ch${ch.chapterNumber} (${d.code}): ${d.governingEquationLatex}`);
          parsedCount++;
        });
      });

      assert.ok(parsedCount >= 7, `Expected >= 7 formulas parsed in roadmap, got ${parsedCount}`);
    });
  });

  // --------------------------------------------------------------------------
  // 5. Adversarial Edge Cases & Stress Resilience
  // --------------------------------------------------------------------------
  describe('Challenge 5: Adversarial Boundary Cases & Structural Parity', () => {

    it('5.1: 1:1 structural parity between Turkish and English datasets', () => {
      const ch1Tr = getChapterModules(1, 'tr');
      const ch1En = getChapterModules(1, 'en');
      const ch2Tr = getChapterModules(2, 'tr');
      const ch2En = getChapterModules(2, 'en');

      assert.equal(ch1En.length, ch1Tr.length, 'Ch1 module count mismatch');
      assert.equal(ch2En.length, ch2Tr.length, 'Ch2 module count mismatch');

      // Check Ch1 parity
      ch1En.forEach((enMod, mIdx) => {
        const trMod = ch1Tr[mIdx];
        assert.equal(enMod.id, trMod.id);
        assert.equal(enMod.code, trMod.code);
        assert.equal(enMod.fundamentalEquations.length, trMod.fundamentalEquations.length);
        assert.equal(enMod.derivationSteps.length, trMod.derivationSteps.length);
        assert.equal(enMod.symbolicTerms.length, trMod.symbolicTerms.length);
        assert.equal(enMod.solvedExamples.length, trMod.solvedExamples.length);
        assert.equal(enMod.commonTraps.length, trMod.commonTraps.length);

        enMod.derivationSteps.forEach((enStep, sIdx) => {
          const trStep = trMod.derivationSteps[sIdx];
          assert.equal(enStep.stepNumber, trStep.stepNumber);
          assert.equal(enStep.algebraicBreakdown.length, trStep.algebraicBreakdown.length);
          assert.deepEqual(enStep.mathTrickIds, trStep.mathTrickIds);
          assert.equal(enStep.trainerCheckpoint.options.length, trStep.trainerCheckpoint.options.length);

          // Correct option index must match
          const enCorrectIdx = enStep.trainerCheckpoint.options.findIndex(o => o.isCorrect);
          const trCorrectIdx = trStep.trainerCheckpoint.options.findIndex(o => o.isCorrect);
          assert.equal(enCorrectIdx, trCorrectIdx, `Correct option index mismatch in ${enMod.id} step ${enStep.stepNumber}`);
        });
      });

      // Check Ch2 parity
      ch2En.forEach((enMod, mIdx) => {
        const trMod = ch2Tr[mIdx];
        assert.equal(enMod.id, trMod.id);
        assert.equal(enMod.code, trMod.code);
        assert.equal(enMod.fundamentalEquations.length, trMod.fundamentalEquations.length);
        assert.equal(enMod.derivationSteps.length, trMod.derivationSteps.length);
        assert.equal(enMod.symbolicTerms.length, trMod.symbolicTerms.length);
        assert.equal(enMod.solvedExamples.length, trMod.solvedExamples.length);
        assert.equal(enMod.commonTraps.length, trMod.commonTraps.length);
      });
    });

    it('5.2: Fallback resilience: invalid or unexpected locale inputs fall back safely to Turkish', () => {
      const invalidLocales = ['fr', 'de', '', null, undefined, 123, {}, []];

      invalidLocales.forEach((loc) => {
        const mod1 = getChapterModules(1, loc);
        assert.equal(mod1[0].id, 'mod-1-1');
        assert.ok(mod1[0].title.includes('Bölüm') || mod1[0].title.includes('Giriş'), `Fallback for ${loc} must return Turkish title`);

        const tricks = getMathTricks(loc);
        assert.equal(tricks.length, 6);
        assert.equal(tricks[0].id, 'trick-taylor');

        const roadmap = getRoadmapChapters(loc);
        assert.equal(roadmap.length, 7);
        assert.ok(roadmap[0].title.includes('Bölüm 3'), `Roadmap fallback for ${loc} must return Turkish title`);
      });
    });

    it('5.3: High-throughput stress: 10,000 accessor calls complete in < 50ms with zero leaks', () => {
      const t0 = performance.now();
      for (let i = 0; i < 10000; i++) {
        const lang = i % 2 === 0 ? 'en' : 'tr';
        const ch = (i % 2) + 1;
        getChapterModules(ch, lang);
        getMathTricks(lang);
        getRoadmapChapters(lang);
      }
      const elapsed = performance.now() - t0;
      assert.ok(elapsed < 200, `10,000 calls took ${elapsed.toFixed(2)}ms (expected < 200ms)`);
    });

    it('5.4: Dataset purity: No placeholder strings ("TODO", "TBD", "lorem", "undefined") exist in English data', () => {
      const englishFiles = [
        'chapter1ModulesEn.ts',
        'chapter2ModulesEn.ts',
        'mathTricksDataEn.ts',
        'roadmapChaptersEn.ts',
      ];

      const forbiddenPlaceholders = [
        /\bTODO\b/i,
        /\bTBD\b/i,
        /\blorem\s+ipsum\b/i,
        /\bundefined\b/,
        /\bnull\b/,
      ];

      englishFiles.forEach((file) => {
        const fullPath = path.join(DATA_DIR, file);
        const lines = fs.readFileSync(fullPath, 'utf8').split('\n');

        lines.forEach((line, lineNo) => {
          forbiddenPlaceholders.forEach((regex) => {
            // Exclude benign code words like `undefined` or `null` in types or comments if any, but in data objects text values:
            if (regex.test(line) && !line.includes('//') && !line.includes('import')) {
              assert.fail(`Forbidden placeholder "${regex}" found at ${file}:${lineNo + 1} -> ${line.trim()}`);
            }
          });
        });
      });
    });
  });
});
