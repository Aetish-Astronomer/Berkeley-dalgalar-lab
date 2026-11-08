import { Locale, TranslationDictionary } from './types';

export const TRANSLATIONS: Record<Locale, TranslationDictionary> = {
  tr: {
    shell: {
      pageTitle: 'Berkeley Dalgalar Teorik Laboratuvarı · Cilt 3 (F. S. Crawford)',
      metaDescription:
        'Berkeley Fizik Öğretisi Cilt 3: Titreşimler ve Dalgalar — 3Blue1Brown Estetiğinde Etkileşimli Türetim Motoru, Matematiksel Büyüteç ve Çoklu-Uzay WebGL Laboratuvarı',
      brandKicker: 'BERKELEY FİZİK CİLT 3',
      brandTitle: 'Dalgalar & Türetim Lab',
      collapseSidebar: 'Menüyü Daralt/Genişlet',
      expandSidebar: 'Menüyü Aç',
      toggleLanguage: 'Switch to English'
    },
    search: {
      placeholder: 'Teorem, türetim, ω(k) veya soru ara...',
      noResults: 'Sonuç bulunamadı.',
      modulePrefix: 'Modül {code}',
      problemSub: 'Bölüm {ch} İspat Koçu · {diff}'
    },
    legend: {
      barTitle: '3Blue1Brown Renk Kodlu Matematik Anahtarı',
      pos: 'ψ, x: Konum',
      vel: 'v, φ̇: Hız/Faz',
      force: 'F, -ω²ψ: Kuvvet',
      mode: 'ωₙ, kₙ: Kip/Özdeğer'
    },
    arsenal: {
      buttonTitle: 'Matematiksel Cephaneliği Aç',
      title: 'Matematiksel Cephanelik',
      subtitle: 'Taylor, Fazör, Diklik, Determinant',
      whereUsed: 'Nerede Kullanılır?',
      canvasTitle: '📐 GEOMETRİK / GRAFİKSEL DOĞRULAMA',
      canvasTaylor: 'Mavi: Tam sin(θ)   |   Sarı Kesikli: Taylor 1. Mertebe θ (|θ| < 0.5 rad bölgesinde tam örtüşme)',
      canvasOrthogonality: 'n=1, m=2 için sin(πx/L)·sin(2πx/L): Sol pozitif alan (+A) ile sağ negatif alan (-A) toplamı = 0!',
      canvasBeats: 'Fazör & Özdeğer Süperpozisyonu: Hızlı Taşıyıcı × Yavaş Modülasyon Zarfı'
    },
    modes: {
      derivation: 'Türetim & Teori',
      derivationTooltip: 'Adım Adım Açılan Türetim Ağacı ve Sembolik Terimler',
      trainer: 'Kendin Türet (Sınav Modu)',
      trainerTooltip: 'Kritik matematiksel geçişleri kendin tahmin ederek sınav antrenmanı yap',
      problems: 'İspat Koçu',
      problemsTooltip: 'Bölüm sonu türetim problemleri ve ev deneyleri — 4 Aşamalı İspat Koçu',
      roadmap: 'Teorem Haritası'
    },
    nav: {
      chapter1Title: '📘 Bölüm 1: Özgür Salınımlar',
      chapter1Pages: 's. 1–30',
      chapter1Problems: 'Bölüm 1 İspat Koçu ({count} Problem)',
      chapter2Title: '📗 Bölüm 2: Sürekli Ortam & Fourier',
      chapter2Pages: 's. 31–68',
      chapter2Problems: 'Bölüm 2 İspat Koçu ({count} Problem)',
      roadmapTitle: '🗺️ Bölüm 3 – 9: İleri Dalgalar & Optik',
      roadmapMeta: 'Mimari',
      roadmapButton: 'Bölüm 3–9 Teorem Haritası'
    },
    breadcrumbs: {
      chapter: 'Bölüm {ch}',
      problems: 'Bölüm {ch} İspat Koçu ({count} Problem)',
      roadmap: 'Bölüm 3 – 9 Teorem Haritası'
    },
    stage: {
      syncedStep: 'Modül {code} · Adım {step} Senkronize',
      liveVerify: '{num} · Canlı Doğrulama',
      play: '▶ Oynat',
      pause: '⏸ Duraklat',
      playPauseTitle: 'Duraklat / Oynat (Space)',
      reset: '↺ Sıfırla',
      resetTitle: 'Başlangıç Koşullarına Sıfırla',
      tagPhysical: 'UZAY 1 · 3B FİZİKSEL DİZGE & VEKTÖR ALANI',
      tagAbstract: 'UZAY 2 · SOYUT MATEMATİKSEL UZAY',
      hudOrbit: '🖱️ Sürükle: 3B Döndür · Tekerlek: Yakınlaştır',
      hudChapterEngine: 'Bölüm {ch} Canlı Fizik Motoru',
      defaultPhysicalTitle: 'Kütle-Yay & 3B Fazör Helisi',
      tabs: {
        phase: 'Faz Uzayı (x, v/ω₀)',
        phasor: 'Kompleks Fazör',
        potential: 'Taylor Çukuru V(x)',
        normalCoords: 'Normal Koordinatlar (q₁, q₂)',
        energyBeats: 'Vuru & Enerji Takası',
        lissajous: '2B Lissajous',
        dispersion: 'ω(k) Dispersiyon Bağıntısı & Özdeğerler',
        fourierSpectrum: 'Fourier Harmonik Spektrumu (Aₙ)'
      },
      sliders: {
        omega0: 'Özfrekans ω₀',
        couplingKc: 'Çiftlenim Sabiti K_c / k',
        modeSelect: 'Normal Kip Seçimi',
        mode1: 'Kip 1 (Sim)',
        mode2: 'Kip 2 (Anti)',
        modeMixed: 'Karma (Vuru)',
        anharmonicAlpha: 'Anharmonik Terim β',
        modeN: 'Normal Kip İndisi (m / n)',
        numBeads: 'Örgü Boncuk Sayısı (N)',
        pluckPosRatio: 'Çekme Noktası (x₀ / L)',
        fourierMaxN: 'Fourier Üst Harmonik (N_max)',
        modesUnit: 'Kip'
      }
    },
    difficulty: {
      fundamental: 'Temel Türetim',
      midterm: 'Vize Klasik',
      advanced: 'İleri Sentez',
      homeExperiment: '🏠 Ev Deneyi & Teori'
    },
    modal: {
      kicker: '🔍 SATIR İÇİ MATEMATİKSEL BÜYÜTEÇ',
      defaultTitle: 'Matematiksel Hile ve İspat',
      closeTitle: 'Kapat (Esc)',
      close: 'Kapat'
    },
    common: {
      close: 'Kapat'
    },
    derivation: {
      heroChapterModule: 'BÖLÜM {ch} · MODÜL {code}',
      stepCountPill: '{count} Adımlı Tam İspat',
      coreQuestion: 'Teorik Odak Sorusu:',
      symTermsTitle: '🎛️ Tıklanabilir Denklem Terimleri (Canlı Sembolik Manipülatör)',
      symTermsSubtitle: 'Terime tıklayarak denklemi ve sağdaki uzayı değiştirin',
      statusActive: 'AKTİF',
      statusOff: 'KAPALI',
      equationEffect: 'Denklem Etkisi:',
      stepHeader: '📐 Adım Adım Teorik Türetim Ağacı (Sağ Sahne İle Senkronize)',
      algebraTitle: 'Cebirsel Açılım',
      treeSubheading: 'Herhangi bir adıma tıklayarak sağdaki 3B/2B uzayı o adıma kilitleyin',
      syncedToStage: '● Sahneye Kilitli',
      projectToStage: '🌐 Sahneye Yansıt',
      examplesAndTrapsHeading: '🔬 Konu İçi Klasik Türetim Örnekleri & Sınav Tuzakları',
      solvedExample: '📝 Çözümlü Klasik Türetim Örneği',
      solutionStrategy: 'Çözüm Stratejisi:',
      keyTakeaway: 'Anahtar Çıkarım:',
      commonTrap: '⚠️ Sık Yapılan Vize Hatası',
      whyWrong: 'Neden Yanlış?',
      correctApproach: 'Doğru Yaklaşım:',
      revealProof: '🔓 İspatı Göster'
    },
    trainer: {
      lockedBanner: '🔒 <strong>Sınav Antrenmanı Modu Aktif:</strong> Bu adımın ara cebirsel geçişlerini ve bir sonraki adımı açmak için aşağıdaki <em>"Kendin Türet"</em> sorusunu doğrulayın veya doğrudan "İspatı Göster"e tıklayın.',
      revealBtn: '🔓 İspatı Göster',
      checkpointPrompt: '🎯 Kendin Türet / Vize Kontrol Noktası:',
      examTip: '💡 Sınav İpucu:',
      correctFeedback: 'Doğru! Harika türetim sezgisi.'
    },
    roadmap: {
      heroPill: 'BERKELEY CİLT 3 · BÖLÜM 3 – 9 YOL HARİTASI',
      archPill: 'Tam Mimari Hazır',
      heroTitle: 'Bölüm 3 – 9: İleri Dalgalar, Empedans, Dalga Paketleri ve Optik Haritası',
      heroSummary: "Bölüm 1 ve Bölüm 2'deki tüm türetim ve bölüm sonu problemleri %100 tamamlandı. Aşağıda bu 3Blue1Brown türetim mimarisine entegre edilmeye hazır olan Bölüm 3 – 9 ana teorem ve türetim iskeletini inceleyebilirsin.",
      nextPhasePill: 'Sonraki Faz'
    },
    coach: {
      allStages: '1–4 Tüm Aşamalar',
      stage1Tab: '① Fiziksel Sezgi',
      stage2Tab: '② Matematiksel Model',
      stage3Tab: '③ Cebirsel İcraat',
      stage4Tab: '④ Fiziksel Yansıma & Limitler',
      stage1Title: 'Aşama 1 · Fiziksel Kurulum & Başlangıç Denklemini Seçme',
      stage1Subtitle: 'Problemi modellemek için temel korunum yasasını veya hareket denklemini belirleyin',
      physicalPrinciple: 'Fiziksel & Matematiksel İlke:',
      startingMove: '🎯 Başlangıç Hamlesi:',
      stage2Title: 'Aşama 2 · Adım Adım Matematiksel Türetim & Geçiş İpuçları',
      stage2Subtitle: 'Önce ipucunu okuyup kendin yazmayı dene, ardından adımı açarak kontrol et',
      revealAllSteps: 'Tüm Adımları Aç',
      stepLabel: 'Adım {step}:',
      transitionHint: '💡 Geçiş İpucu:',
      revealStepBtn: '👁️ Ara Cebirsel İşlemi ve Denklemi Göster',
      hideStepBtn: 'Cebirsel İşlemi Gizle',
      stage3Title: 'Aşama 3 · 3B Fiziksel & 2B Soyut Uzayda Canlı Doğrulama',
      stage3Subtitle: 'Türetilen analitik çözümü Three.js simülasyonunda canlı gözlemleyin',
      syncSceneBtn: '🌐 Sağ Sahneye Yükle',
      whatToObserve: '🔭 Sahnede Neye Dikkat Etmelisin?',
      stage4Title: 'Aşama 4 · Tam Puanlık Sınav Kağıdı Çözümü & Boyut/Limit Kontrolü',
      stage4Subtitle: 'Vize kağıdında adım adım yazılması gereken nihai sonuç ve puanlama kriterleri',
      givenHeader: '1. Verilenler & Sınır Koşulları',
      targetHeader: '2. İstenen Bağıntı',
      finalBoxedLabel: '3. Kutu İçine Alınacak Nihai Türetim Sonucu:',
      limitDimensionCheck: 'Boyut ve Limit Sağlaması:',
      rubricTitle: '📋 Vize Puanlama Anahtarı (Rubrik):',
      heroGiven: 'Verilen Sistem / Sınır Koşulları',
      heroTarget: 'Türetilecek Hedef İfade',
      homeExperimentTag: '🏠 Ev Deneyi & Teori',
      nextStage: 'Sonraki Aşama →',
      prevStage: '← Önceki Aşama',
      resetProblem: 'Problemi Sıfırla',
      verifyAnswer: 'Cevabı Doğrula',
      showSolution: 'Çözümü Göster',
      correctBadge: 'Doğru Seçim! 🎉',
      incorrectBadge: 'Tekrar Deneyin ⚠️',
      trapCallout: '⚠️ Sık Yapılan Hata / Kavram Tuzağı:',
      hintToggle: 'İpucunu Göster / Gizle'
    }
  },

  en: {
    shell: {
      pageTitle: 'Berkeley Waves Theoretical Laboratory · Vol. 3 (F. S. Crawford)',
      metaDescription:
        'Berkeley Physics Course Vol. 3: Waves — Interactive Derivation Engine, Mathematical Magnifier and Multi-Space WebGL Laboratory in 3Blue1Brown Aesthetics',
      brandKicker: 'BERKELEY PHYSICS VOL. 3',
      brandTitle: 'Waves & Derivation Lab',
      collapseSidebar: 'Collapse/Expand Sidebar',
      expandSidebar: 'Open Sidebar',
      toggleLanguage: "Türkçe'ye Geç"
    },
    search: {
      placeholder: 'Search theorems, derivations, ω(k) or problems...',
      noResults: 'No results found.',
      modulePrefix: 'Module {code}',
      problemSub: 'Chapter {ch} Proof Coach · {diff}'
    },
    legend: {
      barTitle: '3Blue1Brown Color-Coded Math Key',
      pos: 'ψ, x: Position',
      vel: 'v, φ̇: Velocity/Phase',
      force: 'F, -ω²ψ: Force',
      mode: 'ωₙ, kₙ: Mode/Eigenvalue'
    },
    arsenal: {
      buttonTitle: 'Open Mathematical Arsenal',
      title: 'Mathematical Arsenal',
      subtitle: 'Taylor, Phasors, Orthogonality, Determinants',
      whereUsed: 'Where Is It Used?',
      canvasTitle: '📐 GEOMETRIC / GRAPHICAL VERIFICATION',
      canvasTaylor: 'Blue: Exact sin(θ)   |   Yellow Dashed: 1st Order Taylor θ (exact overlap in |θ| < 0.5 rad region)',
      canvasOrthogonality: 'For n=1, m=2 sin(πx/L)·sin(2πx/L): Left positive area (+A) and right negative area (-A) sum to 0!',
      canvasBeats: 'Phasor & Eigenvalue Superposition: Fast Carrier × Slow Modulation Envelope'
    },
    modes: {
      derivation: 'Derivations & Theory',
      derivationTooltip: 'Step-by-step interactive derivation tree and symbolic terms',
      trainer: 'Self-Derive (Exam Trainer)',
      trainerTooltip: 'Predict critical mathematical transitions and train for exams',
      problems: 'Proof Coach',
      problemsTooltip: 'End-of-chapter derivation problems and home experiments — 4-Stage Proof Coach',
      roadmap: 'Theorem Roadmap'
    },
    nav: {
      chapter1Title: '📘 Chapter 1: Free Oscillations',
      chapter1Pages: 'pp. 1–30',
      chapter1Problems: 'Chapter 1 Proof Coach ({count} Problems)',
      chapter2Title: '📗 Chapter 2: Continuous Systems & Fourier',
      chapter2Pages: 'pp. 31–68',
      chapter2Problems: 'Chapter 2 Proof Coach ({count} Problems)',
      roadmapTitle: '🗺️ Chapters 3 – 9: Advanced Waves & Optics',
      roadmapMeta: 'Roadmap',
      roadmapButton: 'Chapters 3–9 Theorem Map'
    },
    breadcrumbs: {
      chapter: 'Chapter {ch}',
      problems: 'Chapter {ch} Proof Coach ({count} Problems)',
      roadmap: 'Chapters 3 – 9 Theorem Map'
    },
    stage: {
      syncedStep: 'Module {code} · Step {step} Synchronized',
      liveVerify: '{num} · Live Verification',
      play: '▶ Play',
      pause: '⏸ Pause',
      playPauseTitle: 'Pause / Play (Space)',
      reset: '↺ Reset',
      resetTitle: 'Reset to Initial Conditions',
      tagPhysical: 'SPACE 1 · 3D PHYSICAL SYSTEM & VECTOR FIELD',
      tagAbstract: 'SPACE 2 · ABSTRACT MATHEMATICAL SPACE',
      hudOrbit: '🖱️ Drag: 3D Orbit · Wheel: Zoom',
      hudChapterEngine: 'Chapter {ch} Live Physics Engine',
      defaultPhysicalTitle: 'Mass-Spring & 3D Phasor Helix',
      tabs: {
        phase: 'Phase Space (x, v/ω₀)',
        phasor: 'Complex Phasor',
        potential: 'Taylor Potential Well V(x)',
        normalCoords: 'Normal Coordinates (q₁, q₂)',
        energyBeats: 'Beats & Energy Exchange',
        lissajous: '2D Lissajous',
        dispersion: 'ω(k) Dispersion Relation & Eigenvalues',
        fourierSpectrum: 'Fourier Harmonic Spectrum (Aₙ)'
      },
      sliders: {
        omega0: 'Natural Frequency ω₀',
        couplingKc: 'Coupling Constant K_c / k',
        modeSelect: 'Normal Mode Selection',
        mode1: 'Mode 1 (Sym)',
        mode2: 'Mode 2 (Anti)',
        modeMixed: 'Mixed (Beats)',
        anharmonicAlpha: 'Anharmonic Term β',
        modeN: 'Normal Mode Index (m / n)',
        numBeads: 'Lattice Bead Count (N)',
        pluckPosRatio: 'Pluck Point (x₀ / L)',
        fourierMaxN: 'Fourier Max Harmonic (N_max)',
        modesUnit: 'Modes'
      }
    },
    difficulty: {
      fundamental: 'Fundamental Derivation',
      midterm: 'Midterm Classic',
      advanced: 'Advanced Synthesis',
      homeExperiment: '🏠 Home Experiment & Theory'
    },
    modal: {
      kicker: '🔍 INLINE MATHEMATICAL MAGNIFIER',
      defaultTitle: 'Mathematical Technique & Proof',
      closeTitle: 'Close (Esc)',
      close: 'Close'
    },
    common: {
      close: 'Close'
    },
    derivation: {
      heroChapterModule: 'CHAPTER {ch} · MODULE {code}',
      stepCountPill: '{count}-Step Complete Proof',
      coreQuestion: 'Theoretical Focus Question:',
      symTermsTitle: '🎛️ Clickable Equation Terms (Live Symbolic Manipulator)',
      symTermsSubtitle: 'Click term to modify equation and the space on the right',
      statusActive: 'ACTIVE',
      statusOff: 'OFF',
      equationEffect: 'Equation Effect:',
      stepHeader: '📐 Step-by-Step Theoretical Derivation Tree (Synchronized with Right Stage)',
      algebraTitle: 'Algebraic Breakdown',
      treeSubheading: 'Click any step to lock the 3D/2D space on the right to that step',
      syncedToStage: '● Locked to Stage',
      projectToStage: '🌐 Project to Stage',
      examplesAndTrapsHeading: '🔬 In-Chapter Classic Derivation Examples & Exam Traps',
      solvedExample: '📝 Solved Classic Derivation Example',
      solutionStrategy: 'Solution Strategy:',
      keyTakeaway: 'Key Takeaway:',
      commonTrap: '⚠️ Common Exam Pitfall',
      whyWrong: 'Why Is It Wrong?',
      correctApproach: 'Correct Approach:',
      revealProof: '🔓 Reveal Proof'
    },
    trainer: {
      lockedBanner: '🔒 <strong>Exam Trainer Mode Active:</strong> Verify the <em>"Self-Derive"</em> checkpoint below or click "Reveal Proof" to reveal intermediate algebraic transitions and unlock the next step.',
      revealBtn: '🔓 Reveal Proof',
      checkpointPrompt: '🎯 Self-Derive / Exam Checkpoint:',
      examTip: '💡 Exam Tip:',
      correctFeedback: 'Correct! Excellent derivation intuition.'
    },
    roadmap: {
      heroPill: 'BERKELEY VOL. 3 · CHAPTERS 3 – 9 ROADMAP',
      archPill: 'Full Architecture Ready',
      heroTitle: 'Chapters 3 – 9: Advanced Waves, Impedance, Wave Packets & Optics Map',
      heroSummary: 'All derivations and end-of-chapter problems in Chapters 1 & 2 are 100% complete. Below you can explore the Chapters 3 – 9 core theorem and derivation framework ready for integration into this 3Blue1Brown interactive engine.',
      nextPhasePill: 'Next Phase'
    },
    coach: {
      allStages: '1–4 All Stages',
      stage1Tab: '① Physical Understanding',
      stage2Tab: '② Math Setup',
      stage3Tab: '③ Algebraic Execution',
      stage4Tab: '④ Reflection & Limits',
      stage1Title: 'Stage 1 · Physical Setup & Starting Equation Selection',
      stage1Subtitle: 'Identify the fundamental conservation law or equation of motion to model the problem',
      physicalPrinciple: 'Physical & Mathematical Principle:',
      startingMove: '🎯 Starting Move:',
      stage2Title: 'Stage 2 · Step-by-Step Derivation & Transition Hints',
      stage2Subtitle: 'Try writing it down before reading the hint, then reveal the step to verify',
      revealAllSteps: 'Reveal All Steps',
      stepLabel: 'Step {step}:',
      transitionHint: '💡 Transition Hint:',
      revealStepBtn: '👁️ Show Intermediate Algebra & Equation',
      hideStepBtn: 'Hide Algebraic Step',
      stage3Title: 'Stage 3 · Live Verification in 3D Physical & 2D Abstract Spaces',
      stage3Subtitle: 'Observe the derived analytical solution live within the Three.js simulation',
      syncSceneBtn: '🌐 Load to 3D Scene',
      whatToObserve: '🔭 What to Observe on Stage?',
      stage4Title: 'Stage 4 · Full Exam Sheet Solution, Dimension & Limit Checks',
      stage4Subtitle: 'Exact exam-sheet steps, boxed final result, and grading rubric criteria',
      givenHeader: '1. Given System & Boundary Conditions',
      targetHeader: '2. Target Expression to Derive',
      finalBoxedLabel: '3. Boxed Final Derivation Result:',
      limitDimensionCheck: 'Dimension & Limiting Cases Check:',
      rubricTitle: '📋 Exam Grading Rubric (Criteria):',
      heroGiven: 'Given System / Boundary Conditions',
      heroTarget: 'Target Expression to Derive',
      homeExperimentTag: '🏠 Home Experiment & Theory',
      nextStage: 'Next Stage →',
      prevStage: '← Previous Stage',
      resetProblem: 'Reset Problem',
      verifyAnswer: 'Verify Answer',
      showSolution: 'Show Solution',
      correctBadge: 'Correct Choice! 🎉',
      incorrectBadge: 'Try Again ⚠️',
      trapCallout: '⚠️ Common Trap & Pitfall:',
      hintToggle: 'Show / Hide Hint'
    }
  }
};
