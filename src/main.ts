import './styles/obsidian-manim.css';
import {
  getChapterModules,
  getChapterProblems,
  getMathTricks,
  getRoadmapChapters,
  CHAPTER_1_MODULES,
  CHAPTER_2_MODULES,
  CHAPTER_1_PROBLEMS,
  CHAPTER_2_PROBLEMS,
  MATH_TRICKS,
  ROADMAP_CHAPTERS
} from './data';
import { ChapterModule, DerivationStep, ProofCoachProblem, MathTrickItem, RoadmapChapter } from './types/curriculum';
import { DerivationEngineUI } from './engine/derivationEngine';
import { ProofCoachEngineUI } from './engine/proofCoachEngine';
import { MultiSpaceDirector } from './engine/multiSpaceDirector';
import { i18nManager, Locale } from './i18n';

type EngineMode = 'derivation' | 'trainer' | 'problems' | 'roadmap';

class BerkeleyWavesTheoreticalLabApp {
  private allModules: ChapterModule[];
  private currentModule: ChapterModule;
  private currentStepIndex: number = 0;
  private currentMode: EngineMode = 'derivation';
  private activeTrickId: string = 'trick-taylor';

  private derivationUI: DerivationEngineUI;
  private proofCoachUI: ProofCoachEngineUI;
  private spaceDirector: MultiSpaceDirector;

  private navEl: HTMLElement;
  private theoryContainerEl: HTMLElement;
  private breadcrumbEl: HTMLElement;
  private problemCountBadgeEl: HTMLElement;

  private getActiveModules(): ChapterModule[] {
    const lang = i18nManager.getLocale();
    return [...getChapterModules(1, lang), ...getChapterModules(2, lang)];
  }

  private getActiveChapterModules(ch: 1 | 2): ChapterModule[] {
    return getChapterModules(ch, i18nManager.getLocale());
  }

  private getActiveChapterProblems(ch: 1 | 2): ProofCoachProblem[] {
    return getChapterProblems(ch, i18nManager.getLocale());
  }

  private getActiveMathTricks(): MathTrickItem[] {
    return getMathTricks(i18nManager.getLocale());
  }

  private getActiveRoadmapChapters(): RoadmapChapter[] {
    return getRoadmapChapters(i18nManager.getLocale());
  }

  constructor() {
    this.allModules = this.getActiveModules();
    this.currentModule = this.allModules[0];

    this.navEl = document.getElementById('curriculum-nav')!;
    this.theoryContainerEl = document.getElementById('theory-scroll-container')!;
    this.breadcrumbEl = document.getElementById('breadcrumb-bar')!;
    this.problemCountBadgeEl = document.getElementById('problem-count-badge')!;

    this.derivationUI = new DerivationEngineUI();
    this.proofCoachUI = new ProofCoachEngineUI();
    this.spaceDirector = new MultiSpaceDirector();

    const initialLocale = i18nManager.getLocale();
    document.documentElement.lang = initialLocale;
    document.title = i18nManager.t('shell.pageTitle');

    this.renderNavigationSidebar();
    this.updateModeButtonsUI();
    this.wireHeaderAndGlobalControls();
    this.wireSearch();
    this.updateLangButtonUI(initialLocale);
    this.updateStaticShellText(initialLocale);

    i18nManager.subscribe((newLocale) => {
      this.handleLocaleChange(newLocale);
    });

    this.selectModule(this.currentModule.id, 0);
  }

  private handleLocaleChange(locale: Locale) {
    this.updateLangButtonUI(locale);
    this.updateStaticShellText(locale);

    // Refresh active modules and currentModule to current locale
    const currentModId = this.currentModule.id;
    this.allModules = this.getActiveModules();
    this.currentModule = this.allModules.find((m) => m.id === currentModId) || this.allModules[0];

    this.renderNavigationSidebar();
    this.updateModeButtonsUI();
    this.renderActiveWorkspace();
    this.spaceDirector.setLocale(locale);

    const stepBadge = document.getElementById('stage-step-badge');
    if (stepBadge && this.currentMode !== 'problems') {
      const stepNum = this.currentModule.derivationSteps[this.currentStepIndex]?.stepNumber || 1;
      stepBadge.textContent = i18nManager.t('stage.syncedStep', { code: this.currentModule.code, step: stepNum });
    }

    // If math trick modal is open, re-render it with new locale
    const modal = document.getElementById('math-trick-modal');
    if (modal && !modal.classList.contains('hidden')) {
      this.openMathTrickModal(this.activeTrickId);
    }

    const searchInput = document.getElementById('global-search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.placeholder = i18nManager.t('search.placeholder');
      if (searchInput.value.trim().length >= 2) {
        searchInput.dispatchEvent(new Event('input'));
      }
    }
  }

  private updateLangButtonUI(locale: Locale) {
    const langBtn = document.getElementById('lang-toggle-btn');
    if (!langBtn) return;
    const trBadge = langBtn.querySelector('.lang-tr, .lang-pill-tr');
    const enBadge = langBtn.querySelector('.lang-en, .lang-pill-en');
    if (trBadge && enBadge) {
      trBadge.classList.toggle('active', locale === 'tr');
      enBadge.classList.toggle('active', locale === 'en');
    }
    langBtn.title = i18nManager.t('shell.toggleLanguage');
    langBtn.setAttribute('aria-label', i18nManager.t('shell.toggleLanguage'));
  }

  private updateStaticShellText(_locale: Locale) {
    const brandKicker = document.querySelector('.brand-kicker');
    if (brandKicker) brandKicker.textContent = i18nManager.t('shell.brandKicker');
    const brandTitle = document.querySelector('.brand-title');
    if (brandTitle) brandTitle.textContent = i18nManager.t('shell.brandTitle');

    const collapseBtn = document.getElementById('sidebar-collapse-btn');
    if (collapseBtn) collapseBtn.title = i18nManager.t('shell.collapseSidebar');
    const expandBtn = document.getElementById('sidebar-expand-btn');
    if (expandBtn) expandBtn.title = i18nManager.t('shell.expandSidebar');

    const searchInput = document.getElementById('global-search-input') as HTMLInputElement;
    if (searchInput) searchInput.placeholder = i18nManager.t('search.placeholder');

    const legendBar = document.querySelector('.manim-legend-bar');
    if (legendBar) {
      legendBar.setAttribute('title', i18nManager.t('legend.barTitle'));
      const chipPos = legendBar.querySelector('.c-pos');
      if (chipPos) chipPos.textContent = i18nManager.t('legend.pos');
      const chipVel = legendBar.querySelector('.c-vel');
      if (chipVel) chipVel.textContent = i18nManager.t('legend.vel');
      const chipForce = legendBar.querySelector('.c-force');
      if (chipForce) chipForce.textContent = i18nManager.t('legend.force');
      const chipMode = legendBar.querySelector('.c-mode');
      if (chipMode) chipMode.textContent = i18nManager.t('legend.mode');
    }

    const arsenalBtn = document.getElementById('open-math-arsenal-btn');
    if (arsenalBtn) {
      arsenalBtn.title = i18nManager.t('arsenal.buttonTitle');
      const aTitle = arsenalBtn.querySelector('.arsenal-title');
      if (aTitle) aTitle.textContent = i18nManager.t('arsenal.title');
      const aSub = arsenalBtn.querySelector('.arsenal-sub');
      if (aSub) aSub.textContent = i18nManager.t('arsenal.subtitle');
    }

    const trickKicker = document.querySelector('.trick-kicker');
    if (trickKicker) trickKicker.textContent = i18nManager.t('modal.kicker');
    const trickCloseBtn = document.getElementById('trick-modal-close');
    if (trickCloseBtn) trickCloseBtn.title = i18nManager.t('modal.closeTitle');
  }

  private renderNavigationSidebar() {
    const isModMode = this.currentMode === 'derivation' || this.currentMode === 'trainer';
    const ch1List = this.getActiveChapterModules(1);
    const ch2List = this.getActiveChapterModules(2);
    const ch1Probs = this.getActiveChapterProblems(1);
    const ch2Probs = this.getActiveChapterProblems(2);

    const ch1Buttons = ch1List.map(
      (m) => `
        <button class="nav-module-btn ${isModMode && m.id === this.currentModule.id ? 'active' : ''}" data-nav-mod="${m.id}">
          <span class="nav-mod-code">${m.code}</span>
          <span class="nav-mod-text">${m.shortTitle}</span>
        </button>
      `
    ).join('');

    const ch2Buttons = ch2List.map(
      (m) => `
        <button class="nav-module-btn ${isModMode && m.id === this.currentModule.id ? 'active' : ''}" data-nav-mod="${m.id}">
          <span class="nav-mod-code">${m.code}</span>
          <span class="nav-mod-text">${m.shortTitle}</span>
        </button>
      `
    ).join('');

    this.navEl.innerHTML = `
      <div class="nav-chapter-group">
        <div class="nav-chapter-header">
          <span>${i18nManager.t('nav.chapter1Title')}</span>
          <span>${i18nManager.t('nav.chapter1Pages')}</span>
        </div>
        ${ch1Buttons}
        <button class="nav-module-btn ${this.currentMode === 'problems' && this.currentModule.chapter === 1 ? 'active' : ''}" data-nav-probs="1">
          <span class="nav-mod-code" style="color:var(--manim-green);">1.P</span>
          <span class="nav-mod-text">${i18nManager.t('nav.chapter1Problems', { count: ch1Probs.length })}</span>
        </button>
      </div>

      <div class="nav-chapter-group">
        <div class="nav-chapter-header">
          <span>${i18nManager.t('nav.chapter2Title')}</span>
          <span>${i18nManager.t('nav.chapter2Pages')}</span>
        </div>
        ${ch2Buttons}
        <button class="nav-module-btn ${this.currentMode === 'problems' && this.currentModule.chapter === 2 ? 'active' : ''}" data-nav-probs="2">
          <span class="nav-mod-code" style="color:var(--manim-green);">2.P</span>
          <span class="nav-mod-text">${i18nManager.t('nav.chapter2Problems', { count: ch2Probs.length })}</span>
        </button>
      </div>

      <div class="nav-chapter-group">
        <div class="nav-chapter-header">
          <span>${i18nManager.t('nav.roadmapTitle')}</span>
          <span>${i18nManager.t('nav.roadmapMeta')}</span>
        </div>
        <button class="nav-module-btn ${this.currentMode === 'roadmap' ? 'active' : ''}" id="nav-roadmap-btn">
          <span class="nav-mod-code" style="color:var(--manim-purple);">3–9</span>
          <span class="nav-mod-text">${i18nManager.t('nav.roadmapButton')}</span>
        </button>
      </div>
    `;

    this.navEl.querySelectorAll<HTMLButtonElement>('[data-nav-mod]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const modId = btn.getAttribute('data-nav-mod')!;
        if (this.currentMode === 'problems' || this.currentMode === 'roadmap') {
          this.currentMode = 'derivation';
          this.updateModeButtonsUI();
        }
        this.selectModule(modId, 0);
      });
    });

    this.navEl.querySelectorAll<HTMLButtonElement>('[data-nav-probs]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const ch = parseInt(btn.getAttribute('data-nav-probs')!, 10) as 1 | 2;
        this.currentModule = this.getActiveChapterModules(ch)[0];
        const probs = this.getActiveChapterProblems(ch);
        this.proofCoachUI.setProblemById(probs, probs[0].id);
        this.currentMode = 'problems';
        this.updateModeButtonsUI();
        this.renderActiveWorkspace();
        this.renderNavigationSidebar();
      });
    });

    this.navEl.querySelector('#nav-roadmap-btn')?.addEventListener('click', () => {
      this.currentMode = 'roadmap';
      this.updateModeButtonsUI();
      this.renderActiveWorkspace();
      this.renderNavigationSidebar();
    });
  }

  private selectModule(modId: string, stepIdx: number = 0) {
    const found = this.allModules.find((m) => m.id === modId);
    if (!found) return;
    this.currentModule = found;
    this.currentStepIndex = stepIdx;
    this.renderNavigationSidebar();
    this.renderActiveWorkspace();

    const step = this.currentModule.derivationSteps[stepIdx] || this.currentModule.derivationSteps[0];
    if (step) {
      this.syncStageToStep(step);
    }
  }

  private syncStageToStep(step: DerivationStep) {
    const dir = step.sceneDirective;
    this.spaceDirector.syncToDirective(
      dir.chapter,
      dir.modeId,
      dir.abstractTab,
      dir.presetParams,
      i18nManager.t('stage.syncedStep', { code: this.currentModule.code, step: step.stepNumber }),
      dir.caption
    );
  }

  private syncStageToProblem(prob: ProofCoachProblem) {
    const v = prob.stage3VisualVerify;
    this.spaceDirector.syncToDirective(
      v.chapter,
      v.sceneMode,
      v.abstractTab,
      v.presetParams,
      i18nManager.t('stage.liveVerify', { num: prob.number }),
      prob.title
    );
  }

  private updateModeButtonsUI() {
    const derivationBtn = document.querySelector<HTMLButtonElement>('#engine-mode-switcher [data-mode="derivation"]');
    const trainerBtn = document.querySelector<HTMLButtonElement>('#engine-mode-switcher [data-mode="trainer"]');
    const problemsBtn = document.querySelector<HTMLButtonElement>('#engine-mode-switcher [data-mode="problems"]');

    if (derivationBtn) {
      derivationBtn.innerHTML = `<span>📐</span> <span class="mode-btn-text">${i18nManager.t('modes.derivation')}</span>`;
      derivationBtn.title = i18nManager.t('modes.derivationTooltip');
      derivationBtn.classList.toggle('active', this.currentMode === 'derivation');
    }
    if (trainerBtn) {
      trainerBtn.innerHTML = `<span>🎯</span> <span class="mode-btn-text">${i18nManager.t('modes.trainer')}</span>`;
      trainerBtn.title = i18nManager.t('modes.trainerTooltip');
      trainerBtn.classList.toggle('active', this.currentMode === 'trainer');
    }
    if (problemsBtn) {
      const activeCount = this.getActiveChapterProblems(this.currentModule.chapter).length;
      problemsBtn.innerHTML = `<span>✏️</span> <span class="mode-btn-text">${i18nManager.t('modes.problems')}</span> (<span id="problem-count-badge">${activeCount}</span>)`;
      problemsBtn.title = i18nManager.t('modes.problemsTooltip');
      problemsBtn.classList.toggle('active', this.currentMode === 'problems');
      this.problemCountBadgeEl = document.getElementById('problem-count-badge')!;
    }
  }

  private renderActiveWorkspace() {
    const ch = this.currentModule.chapter;
    const activeProblems = this.getActiveChapterProblems(ch);
    if (this.problemCountBadgeEl) {
      this.problemCountBadgeEl.textContent = String(activeProblems.length);
    }

    const chapterLabel = i18nManager.t('breadcrumbs.chapter', { ch });
    const currentLabel =
      this.currentMode === 'problems'
        ? i18nManager.t('breadcrumbs.problems', { ch, count: activeProblems.length })
        : this.currentMode === 'roadmap'
        ? i18nManager.t('breadcrumbs.roadmap')
        : `${this.currentModule.code} ${this.currentModule.shortTitle}`;

    this.breadcrumbEl.innerHTML = `
      <span class="bc-chapter">${chapterLabel}</span>
      <span>›</span>
      <span class="bc-current">${currentLabel}</span>
    `;

    this.theoryContainerEl.scrollTop = 0;

    if (this.currentMode === 'roadmap') {
      this.derivationUI.renderRoadmapView(this.theoryContainerEl, this.getActiveRoadmapChapters());
      return;
    }

    if (this.currentMode === 'problems') {
      this.proofCoachUI.renderProblemsView(this.theoryContainerEl, activeProblems, {
        onLoadProblemScene: (prob) => this.syncStageToProblem(prob),
        onOpenMathTrick: (trickId) => this.openMathTrickModal(trickId)
      });
      return;
    }

    const isTrainer = this.currentMode === 'trainer';
    this.derivationUI.renderModuleView(
      this.theoryContainerEl,
      this.currentModule,
      this.currentStepIndex,
      isTrainer,
      {
        onSelectStep: (step) => {
          this.currentStepIndex = this.currentModule.derivationSteps.indexOf(step);
          this.syncStageToStep(step);
        },
        onToggleSymbolicTerm: (paramKey, value) => {
          this.spaceDirector.updateSingleParam(paramKey, value);
        },
        onOpenMathTrick: (trickId) => this.openMathTrickModal(trickId)
      }
    );
  }

  public openMathTrickModal(trickId: string) {
    this.activeTrickId = trickId;
    const tricks = this.getActiveMathTricks();
    const trick = tricks.find((t) => t.id === trickId) || tricks[0];
    const modal = document.getElementById('math-trick-modal')!;
    const titleEl = document.getElementById('trick-modal-title')!;
    const bodyEl = document.getElementById('trick-modal-body')!;

    modal.classList.remove('hidden');
    this.derivationUI.renderMathTrickModalContent(titleEl, bodyEl, trick, (otherId) => {
      this.openMathTrickModal(otherId);
    });
  }

  private wireHeaderAndGlobalControls() {
    // Mode switcher buttons
    document.querySelectorAll<HTMLButtonElement>('#engine-mode-switcher .mode-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode') as EngineMode;
        this.currentMode = mode;
        this.updateModeButtonsUI();
        this.renderActiveWorkspace();
      });
    });

    // Language Toggle button
    const langBtn = document.getElementById('lang-toggle-btn');
    langBtn?.addEventListener('click', () => {
      const nextLocale: Locale = i18nManager.getLocale() === 'tr' ? 'en' : 'tr';
      i18nManager.setLocale(nextLocale);
    });

    // Sidebar collapse / expand
    const sidebar = document.getElementById('nav-sidebar')!;
    const collapseBtn = document.getElementById('sidebar-collapse-btn')!;
    const expandBtn = document.getElementById('sidebar-expand-btn')!;

    collapseBtn.addEventListener('click', () => {
      sidebar.classList.add('collapsed');
      expandBtn.classList.remove('hidden');
      setTimeout(() => window.dispatchEvent(new Event('resize')), 260);
    });

    expandBtn.addEventListener('click', () => {
      sidebar.classList.remove('collapsed');
      expandBtn.classList.add('hidden');
      setTimeout(() => window.dispatchEvent(new Event('resize')), 260);
    });

    // Open Mathematical Arsenal button
    document.getElementById('open-math-arsenal-btn')?.addEventListener('click', () => {
      this.openMathTrickModal(this.getActiveMathTricks()[0].id);
    });

    // Close modal events
    const closeModal = () => {
      document.getElementById('math-trick-modal')?.classList.add('hidden');
    };
    document.getElementById('trick-modal-close')?.addEventListener('click', closeModal);
    document.getElementById('math-trick-backdrop')?.addEventListener('click', closeModal);

    // Sim play/pause & reset
    const playPauseBtn = document.getElementById('sim-play-pause-btn')!;
    playPauseBtn.addEventListener('click', () => {
      this.spaceDirector.isPaused = !this.spaceDirector.isPaused;
      playPauseBtn.textContent = this.spaceDirector.isPaused
        ? i18nManager.t('stage.play')
        : i18nManager.t('stage.pause');
    });

    document.getElementById('sim-reset-btn')?.addEventListener('click', () => {
      this.spaceDirector.resetCurrentSim();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    });
  }

  private wireSearch() {
    const input = document.getElementById('global-search-input') as HTMLInputElement;
    const dropdown = document.getElementById('search-results-dropdown')!;

    input.placeholder = i18nManager.t('search.placeholder');

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) {
        dropdown.classList.add('hidden');
        return;
      }

      const results: { title: string; sub: string; action: () => void }[] = [];
      const currentMods = this.getActiveModules();
      const currentTricks = this.getActiveMathTricks();
      const currentProbs = [...this.getActiveChapterProblems(1), ...this.getActiveChapterProblems(2)];

      // Search modules
      currentMods.forEach((m) => {
        if (
          m.title.toLowerCase().includes(q) ||
          m.summary.toLowerCase().includes(q) ||
          m.code.includes(q)
        ) {
          results.push({
            title: `${i18nManager.t('search.modulePrefix', { code: m.code })}: ${m.shortTitle}`,
            sub: m.title,
            action: () => {
              this.currentMode = 'derivation';
              this.updateModeButtonsUI();
              this.selectModule(m.id, 0);
            }
          });
        }
      });

      // Search math tricks
      currentTricks.forEach((tr) => {
        if (tr.title.toLowerCase().includes(q) || tr.summary.toLowerCase().includes(q)) {
          results.push({
            title: tr.badgeLabel,
            sub: tr.title,
            action: () => this.openMathTrickModal(tr.id)
          });
        }
      });

      // Search all 54 problems
      currentProbs.forEach((p) => {
        if (
          p.number.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.statement.toLowerCase().includes(q)
        ) {
          results.push({
            title: `${p.number}: ${p.title}`,
            sub: i18nManager.t('search.problemSub', { ch: p.chapter, diff: p.difficulty }),
            action: () => {
              this.currentModule = p.chapter === 1 ? this.getActiveChapterModules(1)[0] : this.getActiveChapterModules(2)[0];
              this.currentMode = 'problems';
              this.updateModeButtonsUI();
              const list = this.getActiveChapterProblems(p.chapter);
              this.proofCoachUI.setProblemById(list, p.id);
              this.renderActiveWorkspace();
              this.renderNavigationSidebar();
            }
          });
        }
      });

      if (results.length === 0) {
        dropdown.innerHTML = `<div class="search-result-item"><div class="sr-sub">${i18nManager.t('search.noResults')}</div></div>`;
      } else {
        dropdown.innerHTML = results
          .slice(0, 8)
          .map(
            (r, i) => `
            <div class="search-result-item" data-sr-idx="${i}">
              <div class="sr-title">${r.title}</div>
              <div class="sr-sub">${r.sub}</div>
            </div>
          `
          )
          .join('');

        dropdown.querySelectorAll<HTMLElement>('[data-sr-idx]').forEach((el) => {
          el.addEventListener('click', () => {
            const idx = parseInt(el.getAttribute('data-sr-idx')!, 10);
            results[idx].action();
            dropdown.classList.add('hidden');
            input.value = '';
          });
        });
      }

      dropdown.classList.remove('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target as Node) && !dropdown.contains(e.target as Node)) {
        dropdown.classList.add('hidden');
      }
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new BerkeleyWavesTheoreticalLabApp();
});

