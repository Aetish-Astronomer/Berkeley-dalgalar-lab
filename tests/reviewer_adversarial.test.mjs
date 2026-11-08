import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import katexMod from 'katex';

const katex = katexMod.default || katexMod;
const ROOT = 'c:/Users/ati/berkeley-dalgalar-lab';

test('Adv-1: Preserve src/data/chapter2Problems.ts 100% untouched for Test 7', () => {
  const ch2Content = fs.readFileSync(path.join(ROOT, 'src/data/chapter2Problems.ts'), 'utf8');

  // Check all 32 problem num strings exist
  for (let i = 1; i <= 32; i++) {
    const numStr = `num: '2.${i}'`;
    assert.ok(ch2Content.includes(numStr), `Bölüm 2 içinde Problem 2.${i} bulunmalıdır!`);
  }

  // Specifically verify Problem 2.26 assertions from Test 7
  assert.ok(ch2Content.includes("num: '2.26'"), 'Problem 2.26 eksiksiz mevcut olmalıdır');
  assert.ok(
    ch2Content.includes('Sürekli Bir İpin Öztitreşimleri: Sınır Koşulları ve Fourier Eşdeğerliği'),
    'Problem 2.26 başlığı doğru olmalıdır'
  );
  assert.ok(ch2Content.includes('f(0) = 0'), 'Problem 2.26 (i) sınır koşulu içermelidir');
  assert.ok(
    ch2Content.includes("f\\'(0) = 0") || ch2Content.includes("f'(0) = 0"),
    'Problem 2.26 (ii) ve (iii) serbest sınır koşulu içermelidir'
  );
  assert.ok(ch2Content.includes('k_1 L = \\pi/2'), 'Problem 2.26 çeyrek dalga boyu kuantizasyonunu içermelidir');
});

test('Adv-2: Scan for forbidden unicode subscripts across all problem files', () => {
  const unicodeSubscriptRegex = /[₀₁₂₃₄₅₆₇₈₉]/;
  const enFiles = [
    'src/data/chapter1ProblemsEn.ts',
    'src/data/chapter2ProblemsEn.ts'
  ];

  // 1. English files must have ZERO unicode subscripts anywhere in the file
  for (const relPath of enFiles) {
    const fullPath = path.join(ROOT, relPath);
    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      const match = line.match(unicodeSubscriptRegex);
      assert.equal(
        match,
        null,
        `Forbidden unicode subscript found in ${relPath} at line ${idx + 1}: ${line.trim()}`
      );
    });
  }

  // 2. Across all problem files, no LaTeX formula should contain unicode subscripts
  const latexRegex = /(?:givenLatex|targetLatex|finalBoxed|finalBoxedLatex|mathLatex|latex)\s*:\s*['"`](.*?)['"`]/g;
  const allFiles = [
    'src/data/chapter1ProblemsEn.ts',
    'src/data/chapter2ProblemsEn.ts',
    'src/data/chapter1Problems.ts',
    'src/data/chapter2Problems.ts'
  ];
  for (const relPath of allFiles) {
    const content = fs.readFileSync(path.join(ROOT, relPath), 'utf8');
    let m;
    while ((m = latexRegex.exec(content)) !== null) {
      const formula = m[1];
      assert.equal(
        unicodeSubscriptRegex.test(formula),
        false,
        `Unicode subscript inside LaTeX formula in ${relPath}: ${formula}`
      );
    }
  }
});

test('Adv-3: Validate all 54 problems structure, options, rubrics across TR and EN', async () => {
  const ts = await import('typescript');

  function loadTsExport(relPath) {
    const code = fs.readFileSync(path.join(ROOT, relPath), 'utf8');
    const result = ts.default.transpileModule(code, {
      compilerOptions: { module: ts.default.ModuleKind.ESNext, target: ts.default.ScriptTarget.ES2022 }
    });
    const b64 = Buffer.from(result.outputText).toString('base64');
    return import(`data:text/javascript;base64,${b64}`);
  }

  const ch1TrMod = await loadTsExport('src/data/chapter1Problems.ts');
  const ch1EnMod = await loadTsExport('src/data/chapter1ProblemsEn.ts');
  const ch2TrMod = await loadTsExport('src/data/chapter2Problems.ts');
  const ch2EnMod = await loadTsExport('src/data/chapter2ProblemsEn.ts');

  const ch1Tr = ch1TrMod.CHAPTER_1_PROBLEMS;
  const ch1En = ch1EnMod.CHAPTER_1_PROBLEMS_EN;
  const ch2Tr = ch2TrMod.CHAPTER_2_PROBLEMS;
  const ch2En = ch2EnMod.CHAPTER_2_PROBLEMS_EN;

  assert.equal(ch1Tr.length, 22, 'Ch1 TR problem count must be 22');
  assert.equal(ch1En.length, 22, 'Ch1 EN problem count must be 22');
  assert.equal(ch2Tr.length, 32, 'Ch2 TR problem count must be 32');
  assert.equal(ch2En.length, 32, 'Ch2 EN problem count must be 32');

  const allProblems = [
    ...ch1Tr.map((p) => ({ ...p, _lang: 'tr', _ch: 1 })),
    ...ch1En.map((p) => ({ ...p, _lang: 'en', _ch: 1 })),
    ...ch2Tr.map((p) => ({ ...p, _lang: 'tr', _ch: 2 })),
    ...ch2En.map((p) => ({ ...p, _lang: 'en', _ch: 2 }))
  ];

  assert.equal(allProblems.length, 54 * 2, 'Total 108 problem records (54 TR + 54 EN)');

  for (const prob of allProblems) {
    const tag = `[${prob._lang} Ch${prob._ch} ${prob.id} (${prob.number})]`;

    // Basic fields
    assert.ok(prob.id && prob.id.length > 0, `${tag} missing id`);
    assert.ok(prob.number && prob.number.length > 0, `${tag} missing number`);
    assert.ok(prob.title && prob.title.length > 0, `${tag} missing title`);
    assert.ok(prob.bookPage && prob.bookPage.length > 0, `${tag} missing bookPage`);
    assert.ok(prob.difficulty && prob.difficulty.length > 0, `${tag} missing difficulty`);
    assert.ok(prob.statement && prob.statement.length > 0, `${tag} missing statement`);
    assert.ok(prob.givenLatex && prob.givenLatex.length > 0, `${tag} missing givenLatex`);
    assert.ok(prob.targetLatex && prob.targetLatex.length > 0, `${tag} missing targetLatex`);

    // Stage 1 Setup
    assert.ok(prob.stage1Setup, `${tag} missing stage1Setup`);
    assert.ok(prob.stage1Setup.physicalPrinciple, `${tag} missing physicalPrinciple`);
    assert.ok(prob.stage1Setup.startingEquationQuestion, `${tag} missing startingEquationQuestion`);
    assert.ok(Array.isArray(prob.stage1Setup.options), `${tag} stage1Setup.options must be array`);
    assert.equal(prob.stage1Setup.options.length, 3, `${tag} stage1Setup.options must have exactly 3 options`);
    const correctOptions = prob.stage1Setup.options.filter((o) => o.isCorrect === true);
    assert.equal(correctOptions.length, 1, `${tag} stage1Setup.options must have exactly 1 correct option`);
    const wrongOptions = prob.stage1Setup.options.filter((o) => o.isCorrect === false);
    assert.equal(wrongOptions.length, 2, `${tag} stage1Setup.options must have exactly 2 incorrect options`);
    for (let oIdx = 0; oIdx < prob.stage1Setup.options.length; oIdx++) {
      const opt = prob.stage1Setup.options[oIdx];
      assert.ok(opt.latex && opt.latex.length > 0, `${tag} opt ${oIdx} missing latex`);
      assert.ok(opt.explanation && opt.explanation.length > 0, `${tag} opt ${oIdx} missing explanation`);
    }

    // Stage 2 Derivation
    assert.ok(Array.isArray(prob.stage2Derivation), `${tag} stage2Derivation must be array`);
    assert.ok(prob.stage2Derivation.length >= 1, `${tag} stage2Derivation must have at least 1 step`);
    for (let sIdx = 0; sIdx < prob.stage2Derivation.length; sIdx++) {
      const step = prob.stage2Derivation[sIdx];
      assert.ok(step.stepTitle && step.stepTitle.length > 0, `${tag} step ${sIdx} missing stepTitle`);
      assert.ok(step.hint && step.hint.length > 0, `${tag} step ${sIdx} missing hint`);
      assert.ok(step.derivationText && step.derivationText.length > 0, `${tag} step ${sIdx} missing derivationText`);
      assert.ok(step.mathLatex && step.mathLatex.length > 0, `${tag} step ${sIdx} missing mathLatex`);
    }

    // Stage 3 Visual Verify
    assert.ok(prob.stage3VisualVerify, `${tag} missing stage3VisualVerify`);
    assert.ok(prob.stage3VisualVerify.sceneMode, `${tag} missing sceneMode`);
    assert.ok(prob.stage3VisualVerify.abstractTab, `${tag} missing abstractTab`);
    assert.ok(prob.stage3VisualVerify.presetParams, `${tag} missing presetParams`);
    assert.ok(prob.stage3VisualVerify.description, `${tag} missing description`);
    assert.ok(prob.stage3VisualVerify.whatToObserve, `${tag} missing whatToObserve`);

    // Stage 4 Exam Sheet
    assert.ok(prob.stage4ExamSheet, `${tag} missing stage4ExamSheet`);
    assert.ok(prob.stage4ExamSheet.finalBoxedLatex, `${tag} missing finalBoxedLatex`);
    assert.ok(prob.stage4ExamSheet.limitAndDimensionCheck, `${tag} missing limitAndDimensionCheck`);
    assert.ok(Array.isArray(prob.stage4ExamSheet.examGradingRubric), `${tag} examGradingRubric must be array`);
    assert.ok(
      prob.stage4ExamSheet.examGradingRubric.length >= 3,
      `${tag} examGradingRubric must have >= 3 criteria (has ${prob.stage4ExamSheet.examGradingRubric.length})`
    );
    for (let rIdx = 0; rIdx < prob.stage4ExamSheet.examGradingRubric.length; rIdx++) {
      const rubric = prob.stage4ExamSheet.examGradingRubric[rIdx];
      assert.ok(rubric && rubric.length > 0, `${tag} rubric ${rIdx} must be non-empty`);
    }
  }

  // Cross-language alignment (IDs, numbers, derivation steps count, home experiment status)
  for (let i = 0; i < 22; i++) {
    const tr = ch1Tr[i];
    const en = ch1En[i];
    assert.equal(tr.id, en.id, `Ch1 problem ${i} ID mismatch: ${tr.id} vs ${en.id}`);
    assert.equal(tr.number, en.number, `Ch1 problem ${i} number mismatch: ${tr.number} vs ${en.number}`);
    assert.equal(
      Boolean(tr.isHomeExperiment),
      Boolean(en.isHomeExperiment),
      `Ch1 problem ${tr.id} isHomeExperiment mismatch`
    );
    assert.equal(
      tr.stage2Derivation.length,
      en.stage2Derivation.length,
      `Ch1 problem ${tr.id} derivation steps count mismatch: ${tr.stage2Derivation.length} vs ${en.stage2Derivation.length}`
    );
  }

  for (let i = 0; i < 32; i++) {
    const tr = ch2Tr[i];
    const en = ch2En[i];
    assert.equal(tr.id, en.id, `Ch2 problem ${i} ID mismatch: ${tr.id} vs ${en.id}`);
    assert.equal(tr.number, en.number, `Ch2 problem ${i} number mismatch: ${tr.number} vs ${en.number}`);
    assert.equal(
      Boolean(tr.isHomeExperiment),
      Boolean(en.isHomeExperiment),
      `Ch2 problem ${tr.id} isHomeExperiment mismatch`
    );
    assert.equal(
      tr.stage2Derivation.length,
      en.stage2Derivation.length,
      `Ch2 problem ${tr.id} derivation steps count mismatch: ${tr.stage2Derivation.length} vs ${en.stage2Derivation.length}`
    );
  }
});

test('Adv-4: Stress-test KaTeX parsing on all LaTeX expressions in English datasets', async () => {
  const ts = await import('typescript');
  function loadTsExport(relPath) {
    const code = fs.readFileSync(path.join(ROOT, relPath), 'utf8');
    const result = ts.default.transpileModule(code, {
      compilerOptions: { module: ts.default.ModuleKind.ESNext, target: ts.default.ScriptTarget.ES2022 }
    });
    const b64 = Buffer.from(result.outputText).toString('base64');
    return import(`data:text/javascript;base64,${b64}`);
  }

  const ch1EnMod = await loadTsExport('src/data/chapter1ProblemsEn.ts');
  const ch2EnMod = await loadTsExport('src/data/chapter2ProblemsEn.ts');
  const problems = [...ch1EnMod.CHAPTER_1_PROBLEMS_EN, ...ch2EnMod.CHAPTER_2_PROBLEMS_EN];

  let testedLatexCount = 0;
  const errors = [];

  function checkLatex(formula, context) {
    testedLatexCount++;
    try {
      katex.renderToString(formula, { throwOnError: true, strict: false, trust: true });
    } catch (err) {
      errors.push({ context, formula, error: err.message });
    }
  }

  for (const p of problems) {
    checkLatex(p.givenLatex, `${p.id} givenLatex`);
    checkLatex(p.targetLatex, `${p.id} targetLatex`);
    for (let i = 0; i < p.stage1Setup.options.length; i++) {
      checkLatex(p.stage1Setup.options[i].latex, `${p.id} stage1 option ${i}`);
    }
    for (let i = 0; i < p.stage2Derivation.length; i++) {
      checkLatex(p.stage2Derivation[i].mathLatex, `${p.id} stage2 step ${i}`);
    }
    checkLatex(p.stage4ExamSheet.finalBoxedLatex, `${p.id} stage4 finalBoxedLatex`);
  }

  assert.ok(testedLatexCount > 400, `Should have tested > 400 formulas (tested: ${testedLatexCount})`);
  assert.deepEqual(errors, [], `KaTeX errors found: ${JSON.stringify(errors, null, 2)}`);
});

test('Adv-5: Inspect proofCoachEngine.ts for hardcoded Turkish strings and i18n keys completeness', async () => {
  const engineContent = fs.readFileSync(path.join(ROOT, 'src/engine/proofCoachEngine.ts'), 'utf8');

  // Strip comments and imports
  const lines = engineContent.split('\n').filter((l) => !l.trim().startsWith('//') && !l.trim().startsWith('/*'));
  const cleanContent = lines.join('\n');

  // Forbidden Turkish keywords that should NOT appear in UI templates
  const forbiddenTurkishKeywords = [
    'Aşama 1',
    'Aşama 2',
    'Aşama 3',
    'Aşama 4',
    'Tüm Aşamalar',
    'Fiziksel İlke',
    'Başlangıç Hamlesi',
    'Doğru Başlangıç',
    'Hatalı Seçenek',
    'Geçiş İpucu',
    'Adım',
    'Aç',
    'İncele',
    'Sınır ve Boyut Analizi',
    'Sınav Değerlendirme Kriterleri',
    'Önceki Aşama',
    'Sonraki Aşama',
    'Sıfırla',
    'Çözümü Göster',
    'Ev Deneyi'
  ];

  for (const kw of forbiddenTurkishKeywords) {
    assert.ok(
      !cleanContent.includes(kw),
      `Hardcoded Turkish phrase found in proofCoachEngine.ts: "${kw}"`
    );
  }

  // Verify all coach.* keys accessed via i18nManager.t('coach.X') exist in both en and tr
  const ts = await import('typescript');
  const transCode = fs.readFileSync(path.join(ROOT, 'src/i18n/translations.ts'), 'utf8');
  const result = ts.default.transpileModule(transCode, {
    compilerOptions: { module: ts.default.ModuleKind.ESNext, target: ts.default.ScriptTarget.ES2022 }
  });
  const b64 = Buffer.from(result.outputText).toString('base64');
  const transMod = await import(`data:text/javascript;base64,${b64}`);
  const { TRANSLATIONS } = transMod;

  assert.ok(TRANSLATIONS.tr.coach, 'TRANSLATIONS.tr.coach must exist');
  assert.ok(TRANSLATIONS.en.coach, 'TRANSLATIONS.en.coach must exist');

  const trCoachKeys = Object.keys(TRANSLATIONS.tr.coach);
  const enCoachKeys = Object.keys(TRANSLATIONS.en.coach);

  assert.deepEqual(
    trCoachKeys.sort(),
    enCoachKeys.sort(),
    'Coach translation keys in TR and EN must be identical'
  );

  // Extract all coach keys referenced in proofCoachEngine.ts
  const tKeyRegex = /i18nManager\.t\(\s*['"]coach\.([a-zA-Z0-9_]+)['"]/g;
  let m;
  const referencedKeys = new Set();
  while ((m = tKeyRegex.exec(engineContent)) !== null) {
    referencedKeys.add(m[1]);
  }

  for (const k of referencedKeys) {
    assert.ok(
      trCoachKeys.includes(k),
      `proofCoachEngine.ts references unknown coach key: "coach.${k}"`
    );
  }
});
