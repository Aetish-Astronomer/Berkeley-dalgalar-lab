import { ChapterModule, ProofCoachProblem, MathTrickItem, RoadmapChapter } from '../types/curriculum';

// Turkish source datasets (original exports for 100% backward compatibility)
import { CHAPTER_1_MODULES } from './chapter1Modules';
import { CHAPTER_2_MODULES } from './chapter2Modules';
import { CHAPTER_1_PROBLEMS } from './chapter1Problems';
import { CHAPTER_2_PROBLEMS } from './chapter2Problems';
import { MATH_TRICKS } from './mathTricksData';
import { ROADMAP_CHAPTERS } from './roadmapChapters';

// English source datasets
import { CHAPTER_1_MODULES_EN } from './chapter1ModulesEn';
import { CHAPTER_2_MODULES_EN } from './chapter2ModulesEn';
import { CHAPTER_1_PROBLEMS_EN } from './chapter1ProblemsEn';
import { CHAPTER_2_PROBLEMS_EN } from './chapter2ProblemsEn';
import { MATH_TRICKS_EN } from './mathTricksDataEn';
import { ROADMAP_CHAPTERS_EN } from './roadmapChaptersEn';

// Backward compatibility re-exports (required by physics_and_derivations.test.mjs & existing imports)
export {
  CHAPTER_1_MODULES,
  CHAPTER_2_MODULES,
  CHAPTER_1_PROBLEMS,
  CHAPTER_2_PROBLEMS,
  MATH_TRICKS,
  ROADMAP_CHAPTERS,
  CHAPTER_1_MODULES_EN,
  CHAPTER_2_MODULES_EN,
  CHAPTER_1_PROBLEMS_EN,
  CHAPTER_2_PROBLEMS_EN,
  MATH_TRICKS_EN,
  ROADMAP_CHAPTERS_EN
};

/**
 * Returns localized chapter modules for Chapter 1 or Chapter 2.
 */
export function getChapterModules(chapter: 1 | 2, lang: 'tr' | 'en' = 'tr'): ChapterModule[] {
  if (lang === 'en') {
    return chapter === 1 ? CHAPTER_1_MODULES_EN : CHAPTER_2_MODULES_EN;
  }
  return chapter === 1 ? CHAPTER_1_MODULES : CHAPTER_2_MODULES;
}

/**
 * Returns localized Proof Coach problems for Chapter 1 or Chapter 2.
 * Connects English problems when lang === 'en', Turkish problems when lang === 'tr'.
 */
export function getChapterProblems(chapter: 1 | 2, lang: 'tr' | 'en' = 'tr'): ProofCoachProblem[] {
  if (lang === 'en') {
    return chapter === 1 ? CHAPTER_1_PROBLEMS_EN : CHAPTER_2_PROBLEMS_EN;
  }
  return chapter === 1 ? CHAPTER_1_PROBLEMS : CHAPTER_2_PROBLEMS;
}

/**
 * Returns localized Mathematical Tricks dictionary items.
 */
export function getMathTricks(lang: 'tr' | 'en' = 'tr'): MathTrickItem[] {
  return lang === 'en' ? MATH_TRICKS_EN : MATH_TRICKS;
}

/**
 * Returns localized Roadmap entries for Chapters 3 through 9.
 */
export function getRoadmapChapters(lang: 'tr' | 'en' = 'tr'): RoadmapChapter[] {
  return lang === 'en' ? ROADMAP_CHAPTERS_EN : ROADMAP_CHAPTERS;
}
