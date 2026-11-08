export type ManimColorRole = 'pos' | 'vel' | 'force' | 'mode' | 'coupling';

export interface SymbolicTermToggle {
  id: string;
  label: string;
  latexBadge: string;
  colorRole: ManimColorRole;
  description: string;
  defaultActive: boolean;
  effectOnEquation: string;
  effectOnSpace: string;
  sceneParamKey: string;
  activeValue: number;
  inactiveValue: number;
}

export interface TrainerCheckpoint {
  questionPrompt: string;
  options: {
    label: string;
    latex: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  examTip: string;
}

export interface DerivationStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  physicalMotivation: string;
  mainEquationLatex: string;
  algebraicBreakdown: {
    subStepTitle: string;
    explanation: string;
    formulaLatex: string;
  }[];
  mathTrickIds: string[];
  trainerCheckpoint: TrainerCheckpoint;
  sceneDirective: {
    chapter: 1 | 2;
    modeId: string;
    abstractTab: string;
    highlightVector: ManimColorRole;
    presetParams: Record<string, number>;
    caption: string;
  };
}

export interface SolvedExample {
  id: string;
  title: string;
  bookRef: string;
  problemStatement: string;
  strategy: string;
  stepsLatex: { text: string; math: string }[];
  keyTakeaway: string;
}

export interface ChapterModule {
  id: string;
  chapter: 1 | 2;
  code: string;
  title: string;
  shortTitle: string;
  bookPages: string;
  summary: string;
  coreQuestion: string;
  fundamentalEquations: {
    label: string;
    latex: string;
    formulaLatex?: string;
    colorNote: string;
  }[];
  symbolicTerms: SymbolicTermToggle[];
  derivationSteps: DerivationStep[];
  solvedExamples: SolvedExample[];
  commonTraps: {
    trap: string;
    whyWrong: string;
    correctApproach: string;
  }[];
}

export interface ProofCoachProblem {
  id: string;
  chapter: 1 | 2;
  number: string;
  title: string;
  bookPage: string;
  isHomeExperiment: boolean;
  difficulty:
    | 'Temel Türetim'
    | 'Vize Klasik'
    | 'İleri Sentez'
    | 'Basic Derivation'
    | 'Midterm Classic'
    | 'Advanced Synthesis'
    | 'Fundamental Derivation'
    | 'Exam Classic';
  tags: string[];
  statement: string;
  givenLatex: string;
  targetLatex: string;
  stage1Setup: {
    diagramDescription: string;
    physicalPrinciple: string;
    startingEquationQuestion: string;
    options: {
      latex: string;
      explanation: string;
      isCorrect: boolean;
    }[];
  };
  stage2Derivation: {
    stepTitle: string;
    hint: string;
    derivationText: string;
    mathLatex: string;
    trickUsedId?: string;
  }[];
  stage3VisualVerify: {
    description: string;
    chapter: 1 | 2;
    sceneMode: string;
    abstractTab: string;
    presetParams: Record<string, number>;
    whatToObserve: string;
  };
  stage4ExamSheet: {
    fullAcademicSolutionMarkdown: string;
    finalBoxedLatex: string;
    limitAndDimensionCheck: string;
    examGradingRubric: string[];
  };
}

export interface MathTrickItem {
  id: string;
  title: string;
  badgeLabel: string;
  category:
    | 'Analiz & Yaklaşım'
    | 'Kompleks Cebir'
    | 'Diferansiyel Denklemler'
    | 'Lineer Cebir & Fourier'
    | 'Analysis & Approximation'
    | 'Complex Algebra'
    | 'Differential Equations'
    | 'Linear Algebra & Fourier';
  summary: string;
  whenUsedInBerkeley: string;
  coreIdentityLatex: string;
  stepByStepProof: {
    title: string;
    text: string;
    latex: string;
  }[];
  deadlyExamTrap: string;
  interactiveDemoType: 'taylor' | 'phasor' | 'orthogonality' | 'determinant' | 'trig_lattice' | 'separation';
}

export interface RoadmapChapter {
  chapterNumber: number;
  title: string;
  englishTitle: string;
  bookPages: string;
  status: 'completed' | 'ready_architecture';
  coreTheme: string;
  keyDerivations: {
    code: string;
    title: string;
    governingEquationLatex: string;
    physicalInsight: string;
  }[];
}

