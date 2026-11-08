import test from 'node:test';
import assert from 'node:assert/strict';

test('1. Bölüm 1.1: RK4 Harmonik Salıngan Enerji Korunumu ve Faz Uzayı Çemberi', () => {
  const omega0 = 2.5;
  const A = 1.4;
  let x = A;
  let v = 0;
  const dt = 0.002;
  const initialEnergy = 0.5 * omega0 * omega0 * x * x + 0.5 * v * v;

  const accel = (pos) => -omega0 * omega0 * pos;

  for (let i = 0; i < 2000; i++) {
    const k1x = v;
    const k1v = accel(x);
    const k2x = v + 0.5 * dt * k1v;
    const k2v = accel(x + 0.5 * dt * k1x);
    const k3x = v + 0.5 * dt * k2v;
    const k3v = accel(x + 0.5 * dt * k2x);
    const k4x = v + dt * k3v;
    const k4v = accel(x + dt * k3x);

    x += (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
    v += (dt / 6) * (k1v + 2 * k2v + 2 * k3v + k4v);
  }

  const finalEnergy = 0.5 * omega0 * omega0 * x * x + 0.5 * v * v;
  const normPhaseRadiusSq = Math.pow(x / A, 2) + Math.pow(v / (omega0 * A), 2);

  assert.ok(Math.abs(finalEnergy - initialEnergy) < 1e-9, 'Enerji RK4 altında korunmalıdır');
  assert.ok(Math.abs(normPhaseRadiusSq - 1.0) < 1e-8, 'Normalize faz uzayı yarıçapı 1 kalmalıdır');
});

test('2. Bölüm 1.4 & 1.5: Normal Kip Özdeğerleri ve Zayıf Çiftlenim Taylor Yaklaşımı', () => {
  const k = 100;
  const Kc = 1.0; // Zayıf çiftlenim Kc << k
  const m = 1.0;

  const w1 = Math.sqrt(k / m);
  const w2 = Math.sqrt((k + 2 * Kc) / m);
  const exactBeatFreq = w2 - w1;
  const taylorBeatFreq = w1 * (Kc / k);

  const relError = Math.abs(exactBeatFreq - taylorBeatFreq) / exactBeatFreq;
  assert.ok(relError < 0.006, 'Kc/k = 0.01 için Taylor vuru yaklaşımı %0.6 hatadan küçük olmalıdır');
});

test('3. Bölüm 2.3: Gitar Teli Fourier Katsayıları, Eksik Harmonikler ve Parseval Özdeşliği', () => {
  const computeAn = (n, x0Ratio, h = 1.0) => {
    const denom = Math.PI * Math.PI * n * n * x0Ratio * (1 - x0Ratio);
    return ((2 * h) / denom) * Math.sin(n * Math.PI * x0Ratio);
  };

  // Ortadan çekilen telde (x0 = 0.5) çift harmonikler sıfır olmalı ve x=0.5 noktasında toplam h=1 vermeli
  assert.ok(Math.abs(computeAn(2, 0.5)) < 1e-15, 'Ortadan çekilen telde A_2 = 0 olmalıdır');
  assert.ok(Math.abs(computeAn(4, 0.5)) < 1e-15, 'Ortadan çekilen telde A_4 = 0 olmalıdır');

  let centerSum = 0;
  for (let n = 1; n <= 999; n += 2) {
    centerSum += computeAn(n, 0.5, 1.0) * Math.sin((n * Math.PI) / 2);
  }
  assert.ok(Math.abs(centerSum - 1.0) < 1e-3, 'Fourier serisi tepe noktasında h=1.0 değerine yakınsamalıdır');

  // x0 = 1/3 noktasından çekildiğinde n = 3, 6, 9 harmonikleri sıfır olmalı
  assert.ok(Math.abs(computeAn(3, 1 / 3)) < 1e-14, 'L/3 noktasından çekilen telde 3. harmonik yok olmalıdır');
  assert.ok(Math.abs(computeAn(6, 1 / 3)) < 1e-14, 'L/3 noktasından çekilen telde 6. harmonik yok olmalıdır');
});

test('4. Bölüm 2.4 & Problem 1.14 / 2.9: N=3 Boncuklu Tel Dispersiyonu ile 3x3 Determinant Eşdeğerliği', () => {
  const N = 3;
  const w0 = 1.0;

  // Dispersiyon formülü: w_m = 2 * w0 * sin(m * pi / (2*(N+1)))
  const w1DispSq = Math.pow(2 * w0 * Math.sin((1 * Math.PI) / 8), 2);
  const w2DispSq = Math.pow(2 * w0 * Math.sin((2 * Math.PI) / 8), 2);
  const w3DispSq = Math.pow(2 * w0 * Math.sin((3 * Math.PI) / 8), 2);

  // 3x3 Seküler Determinant kökleri: (2 - sqrt(2)), 2, (2 + sqrt(2))
  assert.ok(Math.abs(w1DispSq - (2 - Math.SQRT2)) < 1e-12);
  assert.ok(Math.abs(w2DispSq - 2.0) < 1e-12);
  assert.ok(Math.abs(w3DispSq - (2 + Math.SQRT2)) < 1e-12);
});

test('5. Bölüm 2.1 & 2.4: N -> Sonsuz Limitinde Kesikli Örgünün Sürekli Tel Frekansına Yakınsaması', () => {
  // Uzunluğu L, toplam kütlesi M_tot, gerilimi T0 olan telde 1. kip sürekli frekansı: w1_cont = (pi / L) * sqrt(T0 / rho0)
  const L = 1.0;
  const T0 = 10.0;
  const Mtot = 2.0;
  const rho0 = Mtot / L;
  const w1Continuous = (Math.PI / L) * Math.sqrt(T0 / rho0);

  // N = 500 boncuklu kesikli yaklaşımda a = L/(N+1), M = Mtot/N
  const N = 500;
  const a = L / (N + 1);
  const M = Mtot / N;
  const w0Discrete = Math.sqrt(T0 / (M * a));
  const w1Discrete = 2 * w0Discrete * Math.sin(Math.PI / (2 * (N + 1)));

  const relDiff = Math.abs(w1Discrete - w1Continuous) / w1Continuous;
  assert.ok(relDiff < 0.002, 'N=500 için kesikli örgü 1. kip frekansı sürekli tele %0.2 içinde yakınsamalıdır');
});

test('6. Tüm Müfredat (Bölüm 1: 22 Problem, Bölüm 2: 32 Problem, Toplam 54 Problem, 6 Hile, Bölüm 3-9) KaTeX ve Referans Bütünlüğü', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const katexMod = await import('katex');
  const katex = katexMod.default || katexMod;

  const dataDir = path.resolve(import.meta.dirname, '../src/data');
  const files = fs.readdirSync(dataDir).filter((f) => f.endsWith('.ts'));

  const validTrickIds = new Set([
    'trick-taylor',
    'trick-phasor',
    'trick-determinant',
    'trick-trig-beats',
    'trick-separation',
    'trick-orthogonality'
  ]);

  const validCh1Modes = new Set([
    'shm-phasor',
    'transverse-force',
    'lissajous-2d',
    'coupled-modes',
    'beats-energy'
  ]);

  const validCh2Modes = new Set([
    'continuous-dx',
    'standing-modes',
    'plucked-fourier',
    'discrete-lattice'
  ]);

  const validAbstractTabs = new Set([
    'phase',
    'phasor',
    'potential',
    'normal-coords',
    'energy-beats',
    'lissajous',
    'dispersion',
    'fourier-spectrum'
  ]);

  const validSceneParamKeys = new Set([
    'omega0',
    'amplitude',
    'anharmonicAlpha',
    'dampingGamma',
    'tensionRatio',
    'freqRatio',
    'phaseDiff',
    'couplingKc',
    'modeSelect',
    'modeN',
    'numBeads',
    'boundaryCondition',
    'showCurvatureVectors',
    'fourierMaxN',
    'pluckPosRatio',
    'diatomicRatio'
  ]);

  let totalLatexCount = 0;
  const katexErrors = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf8');

    // Validate all LaTeX fields
    const latexRegex =
      /(?:latex|formulaLatex|mainEquationLatex|latexBadge|coreIdentityLatex|governingEquationLatex|givenLatex|targetLatex|optCorrect|optWrong1|optWrong2|math|finalBoxed|mathLatex)\s*:\s*\n?\s*'((?:\\'|[^'])*)'/g;
    let m;
    while ((m = latexRegex.exec(content)) !== null) {
      totalLatexCount++;
      const raw = m[1].replace(/\\\\/g, '\\').replace(/\\'/g, "'");
      if (/[₀₁₂₃₄₅₆₇₈₉]/.test(raw)) {
        katexErrors.push(`${file} Unicode subscript in LaTeX: ${raw}`);
      }
      try {
        katex.renderToString(raw, { throwOnError: true, strict: false, trust: true });
      } catch (err) {
        katexErrors.push(`${file}: ${err.message} -> ${raw}`);
      }
    }

    // Validate trick IDs
    const trickRegex = /(?:trick|trickUsedId)\s*:\s*'([^']+)'/g;
    while ((m = trickRegex.exec(content)) !== null) {
      assert.ok(validTrickIds.has(m[1]), `${file} içinde geçersiz trick ID: ${m[1]}`);
    }

    const trickArrRegex = /mathTrickIds\s*:\s*\[([^\]]*)\]/g;
    while ((m = trickArrRegex.exec(content)) !== null) {
      const inner = m[1];
      const itemRegex = /'([^']+)'/g;
      let im;
      while ((im = itemRegex.exec(inner)) !== null) {
        assert.ok(validTrickIds.has(im[1]), `${file} mathTrickIds içinde geçersiz trick ID: ${im[1]}`);
      }
    }

    // Validate scene modes
    const modeRegex = /(?:modeId|sceneMode)\s*:\s*'([^']+)'/g;
    while ((m = modeRegex.exec(content)) !== null) {
      const mode = m[1];
      assert.ok(
        validCh1Modes.has(mode) || validCh2Modes.has(mode),
        `${file} içinde tanımsız sahne modu: ${mode}`
      );
    }

    // Validate abstractTab
    const tabRegex = /abstractTab\s*:\s*'([^']+)'/g;
    while ((m = tabRegex.exec(content)) !== null) {
      assert.ok(validAbstractTabs.has(m[1]), `${file} içinde tanımsız abstractTab: ${m[1]}`);
    }

    // Validate sceneParamKey
    const paramKeyRegex = /sceneParamKey\s*:\s*'([^']+)'/g;
    while ((m = paramKeyRegex.exec(content)) !== null) {
      assert.ok(validSceneParamKeys.has(m[1]), `${file} içinde tanımsız sceneParamKey: ${m[1]}`);
    }
  }

  assert.ok(totalLatexCount > 350, `En az 350 LaTeX denklemi taranmalıdır (Taranan: ${totalLatexCount})`);
  assert.deepEqual(katexErrors, [], `KaTeX sözdizimi hataları bulundu:\n${katexErrors.join('\n')}`);
});

test('7. Bölüm 2: 32 Problemin Eksiksizliği ve Problem 2.26 Sınır Koşulları / Fourier Analizi Doğrulaması', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');

  const ch2Content = fs.readFileSync(
    path.resolve(import.meta.dirname, '../src/data/chapter2Problems.ts'),
    'utf8'
  );

  // Check all numbers 2.1 to 2.32 exist
  for (let i = 1; i <= 32; i++) {
    const numStr = `num: '2.${i}'`;
    assert.ok(ch2Content.includes(numStr), `Bölüm 2 içinde Problem 2.${i} bulunmalıdır!`);
  }

  // Specifically verify Problem 2.26
  assert.ok(ch2Content.includes("num: '2.26'"), 'Problem 2.26 eksiksiz mevcut olmalıdır');
  assert.ok(
    ch2Content.includes('Sürekli Bir İpin Öztitreşimleri: Sınır Koşulları ve Fourier Eşdeğerliği'),
    'Problem 2.26 başlığı doğru olmalıdır'
  );
  assert.ok(ch2Content.includes('f(0) = 0'), 'Problem 2.26 (i) sınır koşulu içermelidir');
  assert.ok(ch2Content.includes("f\\'(0) = 0") || ch2Content.includes("f'(0) = 0"), 'Problem 2.26 (ii) ve (iii) serbest sınır koşulu içermelidir');
  assert.ok(ch2Content.includes('k_1 L = \\pi/2'), 'Problem 2.26 çeyrek dalga boyu kuantizasyonunu içermelidir');
});



