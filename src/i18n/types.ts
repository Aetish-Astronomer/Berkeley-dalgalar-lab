export type Locale = 'tr' | 'en';

export type TranslationParams = Record<string, string | number>;

export type LocaleChangeListener = (locale: Locale) => void;

export interface TranslationDictionary {
  shell: {
    pageTitle: string;
    metaDescription: string;
    brandKicker: string;
    brandTitle: string;
    collapseSidebar: string;
    expandSidebar: string;
    toggleLanguage: string;
  };
  search: {
    placeholder: string;
    noResults: string;
    modulePrefix: string;
    problemSub: string;
  };
  legend: {
    barTitle: string;
    pos: string;
    vel: string;
    force: string;
    mode: string;
  };
  arsenal: {
    buttonTitle: string;
    title: string;
    subtitle: string;
    whereUsed: string;
    canvasTitle: string;
    canvasTaylor: string;
    canvasOrthogonality: string;
    canvasBeats: string;
  };
  modes: {
    derivation: string;
    derivationTooltip: string;
    trainer: string;
    trainerTooltip: string;
    problems: string;
    problemsTooltip: string;
    roadmap: string;
  };
  nav: {
    chapter1Title: string;
    chapter1Pages: string;
    chapter1Problems: string;
    chapter2Title: string;
    chapter2Pages: string;
    chapter2Problems: string;
    roadmapTitle: string;
    roadmapMeta: string;
    roadmapButton: string;
  };
  breadcrumbs: {
    chapter: string;
    problems: string;
    roadmap: string;
  };
  stage: {
    syncedStep: string;
    liveVerify: string;
    play: string;
    pause: string;
    playPauseTitle: string;
    reset: string;
    resetTitle: string;
    tagPhysical: string;
    tagAbstract: string;
    hudOrbit: string;
    hudChapterEngine: string;
    defaultPhysicalTitle: string;
    tabs: {
      phase: string;
      phasor: string;
      potential: string;
      normalCoords: string;
      energyBeats: string;
      lissajous: string;
      dispersion: string;
      fourierSpectrum: string;
    };
    sliders: {
      omega0: string;
      couplingKc: string;
      modeSelect: string;
      mode1: string;
      mode2: string;
      modeMixed: string;
      anharmonicAlpha: string;
      modeN: string;
      numBeads: string;
      pluckPosRatio: string;
      fourierMaxN: string;
      modesUnit: string;
    };
  };
  difficulty: {
    fundamental: string;
    midterm: string;
    advanced: string;
    homeExperiment: string;
  };
  modal: {
    kicker: string;
    defaultTitle: string;
    closeTitle: string;
    close: string;
  };
  common: {
    close: string;
  };
  derivation: {
    heroChapterModule: string;
    stepCountPill: string;
    coreQuestion: string;
    symTermsTitle: string;
    symTermsSubtitle: string;
    statusActive: string;
    statusOff: string;
    equationEffect: string;
    stepHeader: string;
    algebraTitle: string;
    treeSubheading: string;
    syncedToStage: string;
    projectToStage: string;
    examplesAndTrapsHeading: string;
    solvedExample: string;
    solutionStrategy: string;
    keyTakeaway: string;
    commonTrap: string;
    whyWrong: string;
    correctApproach: string;
    revealProof: string;
  };
  trainer: {
    lockedBanner: string;
    revealBtn: string;
    checkpointPrompt: string;
    examTip: string;
    correctFeedback: string;
  };
  roadmap: {
    heroPill: string;
    archPill: string;
    heroTitle: string;
    heroSummary: string;
    nextPhasePill: string;
  };
  coach: CoachTranslations;
}

export interface CoachTranslations {
  allStages: string;
  stage1Tab: string;
  stage2Tab: string;
  stage3Tab: string;
  stage4Tab: string;
  stage1Title: string;
  stage1Subtitle: string;
  physicalPrinciple: string;
  startingMove: string;
  stage2Title: string;
  stage2Subtitle: string;
  revealAllSteps: string;
  stepLabel: string;
  transitionHint: string;
  revealStepBtn: string;
  hideStepBtn: string;
  stage3Title: string;
  stage3Subtitle: string;
  syncSceneBtn: string;
  whatToObserve: string;
  stage4Title: string;
  stage4Subtitle: string;
  givenHeader: string;
  targetHeader: string;
  finalBoxedLabel: string;
  limitDimensionCheck: string;
  rubricTitle: string;
  heroGiven: string;
  heroTarget: string;
  homeExperimentTag: string;
  nextStage: string;
  prevStage: string;
  resetProblem: string;
  verifyAnswer: string;
  showSolution: string;
  correctBadge: string;
  incorrectBadge: string;
  trapCallout: string;
  hintToggle: string;
}
