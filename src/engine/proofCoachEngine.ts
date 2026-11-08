import { ProofCoachProblem } from '../types/curriculum';
import { getMathTricks } from '../data';
import { renderLatexToString } from './mathRenderer';
import { i18nManager } from '../i18n';

export interface ProofCoachCallbacks {
  onLoadProblemScene: (prob: ProofCoachProblem) => void;
  onOpenMathTrick: (trickId: string) => void;
}

export class ProofCoachEngineUI {
  private activeProblemIndex: number = 0;
  private activeStage: number = 0; // 0: All/Sequential, 1: Setup, 2: Derivation, 3: 3D Verify, 4: Exam Sheet
  private revealedSteps: Set<string> = new Set();
  private selectedOptions: Map<string, number> = new Map(); // prob.id -> option index

  public getActiveProblemIndex(): number {
    return this.activeProblemIndex;
  }

  public setActiveProblemIndex(idx: number): void {
    this.activeProblemIndex = idx;
  }

  public getActiveStage(): number {
    return this.activeStage;
  }

  public setActiveStage(stage: number): void {
    this.activeStage = stage;
  }

  public getActiveProblemId(problems: ProofCoachProblem[]): string {
    return problems[this.activeProblemIndex]?.id || problems[0]?.id || '';
  }

  public setProblemById(problems: ProofCoachProblem[], id: string) {
    const idx = problems.findIndex((p) => p.id === id);
    if (idx >= 0) {
      this.activeProblemIndex = idx;
    }
  }

  public resetProblemState(probId?: string): void {
    if (probId) {
      for (const key of Array.from(this.revealedSteps)) {
        if (key.startsWith(probId)) this.revealedSteps.delete(key);
      }
      this.selectedOptions.delete(probId);
    } else {
      this.revealedSteps.clear();
      this.selectedOptions.clear();
    }
  }

  public renderProblemsView(
    container: HTMLElement,
    problems: ProofCoachProblem[],
    callbacks: ProofCoachCallbacks
  ) {
    if (this.activeProblemIndex >= problems.length) {
      this.activeProblemIndex = 0;
    }
    const prob = problems[this.activeProblemIndex];
    const currentLocale = i18nManager.getLocale();
    const mathTricks = getMathTricks(currentLocale);

    const selectorHtml = problems
      .map(
        (p, idx) => `
        <button class="prob-pill-btn ${idx === this.activeProblemIndex ? 'active' : ''}" data-prob-idx="${idx}" title="${p.title}">
          ${p.number.replace('Problem ', 'P.')} ${p.isHomeExperiment ? '🏠' : ''}
        </button>
      `
      )
      .join('');

    const stageTabsHtml = `
      <div class="coach-stages-tabs">
        <button class="coach-stage-tab ${this.activeStage === 0 ? 'active' : ''}" data-stage="0">
          ${i18nManager.t('coach.allStages')}
        </button>
        <button class="coach-stage-tab ${this.activeStage === 1 ? 'active' : ''}" data-stage="1">
          ${i18nManager.t('coach.stage1Tab')}
        </button>
        <button class="coach-stage-tab ${this.activeStage === 2 ? 'active' : ''}" data-stage="2">
          ${i18nManager.t('coach.stage2Tab')}
        </button>
        <button class="coach-stage-tab ${this.activeStage === 3 ? 'active' : ''}" data-stage="3">
          ${i18nManager.t('coach.stage3Tab')}
        </button>
        <button class="coach-stage-tab ${this.activeStage === 4 ? 'active' : ''}" data-stage="4">
          ${i18nManager.t('coach.stage4Tab')}
        </button>
      </div>
    `;

    // Stage 1 HTML
    const selectedOptIdx = this.selectedOptions.get(prob.id);
    const stage1Html = `
      <div class="derivation-step-card active-step">
        <div class="step-card-header">
          <div class="step-num-circle">1</div>
          <div class="step-header-titles">
            <div class="step-title">${i18nManager.t('coach.stage1Title')}</div>
            <div class="step-subtitle">${prob.stage1Setup.diagramDescription}</div>
          </div>
        </div>
        <div class="step-card-body">
          <div class="core-question-banner" style="margin-top:0; margin-bottom:14px;">
            <strong>${i18nManager.t('coach.physicalPrinciple')}</strong> ${prob.stage1Setup.physicalPrinciple}
          </div>
          <div class="trainer-checkpoint-box" style="margin-top:0;">
            <div class="trainer-prompt">${i18nManager.t('coach.startingMove')} ${prob.stage1Setup.startingEquationQuestion}</div>
            <div class="trainer-options-list">
              ${prob.stage1Setup.options
                .map(
                  (opt, idx) => {
                    const isSelected = selectedOptIdx === idx;
                    const optClass = isSelected ? (opt.isCorrect ? 'correct' : 'wrong') : '';
                    const fbHidden = isSelected ? '' : 'hidden';
                    const badgeText = opt.isCorrect
                      ? i18nManager.t('coach.correctBadge')
                      : i18nManager.t('coach.incorrectBadge');
                    return `
                      <button class="trainer-option-btn ${optClass}" data-s1-opt="${idx}" data-correct="${opt.isCorrect}">
                        <div style="display:flex; align-items:center; gap:10px;">
                          <span class="nav-mod-code">${String.fromCharCode(65 + idx)}</span>
                          <div>${renderLatexToString(opt.latex, false)}</div>
                        </div>
                        <div class="trainer-feedback ${fbHidden}" data-fb>
                          <div style="font-weight:600; margin-bottom:4px;">${badgeText}</div>
                          ${opt.explanation}
                        </div>
                      </button>
                    `;
                  }
                )
                .join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    // Stage 2 HTML
    const stage2Html = `
      <div class="derivation-step-card">
        <div class="step-card-header">
          <div class="step-num-circle">2</div>
          <div class="step-header-titles">
            <div class="step-title">${i18nManager.t('coach.stage2Title')}</div>
            <div class="step-subtitle">${i18nManager.t('coach.stage2Subtitle')}</div>
          </div>
          <button class="step-sync-btn" id="reveal-all-steps-btn">${i18nManager.t('coach.revealAllSteps')}</button>
        </div>
        <div class="step-card-body">
          <div class="algebra-accordion" style="border-top:none; padding-top:0;">
            ${prob.stage2Derivation
              .map((st, sIdx) => {
                const rKey = `${prob.id}-s2-${sIdx}`;
                const isRevealed = this.revealedSteps.has(rKey);
                const trick = st.trickUsedId
                  ? mathTricks.find((t) => t.id === st.trickUsedId)
                  : undefined;

                return `
                  <div class="algebra-substep" style="padding:12px 15px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:6px;">
                      <div class="substep-head">${i18nManager.t('coach.stepLabel', { step: sIdx + 1 })} ${st.stepTitle}</div>
                      ${
                        trick
                          ? `<button class="math-trick-trigger" data-trick-id="${trick.id}">${trick.badgeLabel}</button>`
                          : ''
                      }
                    </div>
                    <div style="font-size:12.5px; color:var(--manim-yellow); margin-bottom:8px;">
                      💡 <strong>${i18nManager.t('coach.transitionHint')}</strong> ${st.hint}
                    </div>
                    ${
                      isRevealed
                        ? `
                        <div class="substep-desc">${st.derivationText}</div>
                        <div class="substep-math">${renderLatexToString(st.mathLatex, true)}</div>
                      `
                        : `
                        <button class="stage-ctrl-btn" data-reveal-key="${rKey}" style="padding:6px 12px; color:var(--manim-blue); border-color:var(--border-cyan);">
                          ${i18nManager.t('coach.revealStepBtn')}
                        </button>
                      `
                    }
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>
      </div>
    `;

    // Stage 3 HTML
    const stage3Html = `
      <div class="derivation-step-card">
        <div class="step-card-header">
          <div class="step-num-circle">3</div>
          <div class="step-header-titles">
            <div class="step-title">${i18nManager.t('coach.stage3Title')}</div>
            <div class="step-subtitle">${prob.stage3VisualVerify.description}</div>
          </div>
          <button class="step-sync-btn" id="sync-problem-scene-btn">${i18nManager.t('coach.syncSceneBtn')}</button>
        </div>
        <div class="step-card-body">
          <p class="step-motivation" style="margin-bottom:0;">
            🔭 <strong>${i18nManager.t('coach.whatToObserve')}</strong> ${prob.stage3VisualVerify.whatToObserve}
          </p>
        </div>
      </div>
    `;

    // Stage 4 HTML
    const stage4Html = `
      <div class="derivation-step-card">
        <div class="step-card-header">
          <div class="step-num-circle">4</div>
          <div class="step-header-titles">
            <div class="step-title">${i18nManager.t('coach.stage4Title')}</div>
            <div class="step-subtitle">${i18nManager.t('coach.stage4Subtitle')}</div>
          </div>
        </div>
        <div class="step-card-body">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
            <div class="fund-eq-box" style="margin-bottom:0;">
              <div class="fund-eq-header">${i18nManager.t('coach.givenHeader')}</div>
              <div>${renderLatexToString(prob.givenLatex, false)}</div>
            </div>
            <div class="fund-eq-box" style="margin-bottom:0;">
              <div class="fund-eq-header" style="color:var(--manim-yellow);">${i18nManager.t('coach.targetHeader')}</div>
              <div>${renderLatexToString(prob.targetLatex, false)}</div>
            </div>
          </div>
          <div style="font-size:13px; color:var(--text-secondary); margin-bottom:10px;">
            <strong>${i18nManager.t('coach.finalBoxedLabel')}</strong>
          </div>
          <div class="main-equation-stage" style="border-color:var(--manim-green);">
            ${renderLatexToString(prob.stage4ExamSheet.finalBoxedLatex, true)}
          </div>
          <div class="core-question-banner" style="border-left-color:var(--manim-green); background:rgba(131,193,103,0.08);">
            <strong>${i18nManager.t('coach.limitDimensionCheck')}</strong> ${prob.stage4ExamSheet.limitAndDimensionCheck}
          </div>
          <div style="margin-top:14px;">
            <div style="font-size:12px; font-weight:700; color:var(--manim-yellow); margin-bottom:6px;">
              ${i18nManager.t('coach.rubricTitle')}
            </div>
            <ul style="padding-left:18px; font-size:12.5px; color:var(--text-secondary); line-height:1.6;">
              ${prob.stage4ExamSheet.examGradingRubric.map((r) => `<li>${r}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;

    // Step navigation bar HTML
    const navBarHtml = `
      <div class="coach-nav-bar" style="display:flex; justify-content:space-between; align-items:center; margin-top:16px; padding:12px 16px; background:var(--bg-card); border:1px solid var(--border-color); border-radius:8px;">
        <div style="display:flex; gap:8px;">
          <button class="stage-ctrl-btn coach-nav-prev" ${this.activeStage <= 1 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
            ${i18nManager.t('coach.prevStage')}
          </button>
          <button class="stage-ctrl-btn coach-nav-next" ${this.activeStage >= 4 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
            ${i18nManager.t('coach.nextStage')}
          </button>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="stage-ctrl-btn coach-nav-reset" style="color:var(--manim-red); border-color:rgba(235,94,85,0.4);">
            🔄 ${i18nManager.t('coach.resetProblem')}
          </button>
          <button class="stage-ctrl-btn coach-nav-solution" style="color:var(--manim-green); border-color:rgba(131,193,103,0.4);">
            ✨ ${i18nManager.t('coach.showSolution')}
          </button>
        </div>
      </div>
    `;

    container.innerHTML = `
      <div class="proof-coach-layout">
        <div class="problem-selector-bar">
          ${selectorHtml}
        </div>

        <div class="module-hero" style="margin-bottom:4px;">
          <div class="module-meta-pills">
            <span class="meta-pill">${prob.number}</span>
            <span class="meta-pill">📖 ${prob.bookPage}</span>
            <span class="meta-pill" style="color:var(--manim-yellow); border-color:var(--border-gold);">${prob.difficulty}</span>
            ${prob.isHomeExperiment ? `<span class="meta-pill" style="color:var(--manim-green);">${i18nManager.t('coach.homeExperimentTag')}</span>` : ''}
          </div>
          <h2 class="module-title">${prob.number}: ${prob.title}</h2>
          <p class="module-summary">${prob.statement}</p>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:14px;">
            <div class="fund-eq-box">
              <div class="fund-eq-header">${i18nManager.t('coach.heroGiven')}</div>
              <div>${renderLatexToString(prob.givenLatex, false)}</div>
            </div>
            <div class="fund-eq-box">
              <div class="fund-eq-header" style="color:var(--manim-yellow);">${i18nManager.t('coach.heroTarget')}</div>
              <div>${renderLatexToString(prob.targetLatex, false)}</div>
            </div>
          </div>
        </div>

        ${stageTabsHtml}

        ${this.activeStage === 0 || this.activeStage === 1 ? stage1Html : ''}
        ${this.activeStage === 0 || this.activeStage === 2 ? stage2Html : ''}
        ${this.activeStage === 0 || this.activeStage === 3 ? stage3Html : ''}
        ${this.activeStage === 0 || this.activeStage === 4 ? stage4Html : ''}

        ${navBarHtml}
      </div>
    `;

    // Sync right panel scene automatically to this problem
    callbacks.onLoadProblemScene(prob);

    // Wire events
    container.querySelectorAll<HTMLButtonElement>('[data-prob-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.activeProblemIndex = parseInt(btn.getAttribute('data-prob-idx')!, 10);
        this.renderProblemsView(container, problems, callbacks);
      });
    });

    container.querySelectorAll<HTMLButtonElement>('[data-stage]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.activeStage = parseInt(btn.getAttribute('data-stage')!, 10);
        this.renderProblemsView(container, problems, callbacks);
      });
    });

    container.querySelectorAll<HTMLButtonElement>('[data-s1-opt]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const optIdx = parseInt(btn.getAttribute('data-s1-opt')!, 10);
        this.selectedOptions.set(prob.id, optIdx);
        const isCorrect = btn.getAttribute('data-correct') === 'true';
        btn.classList.add(isCorrect ? 'correct' : 'wrong');
        const fb = btn.querySelector('[data-fb]');
        if (fb) fb.classList.remove('hidden');
      });
    });

    container.querySelectorAll<HTMLButtonElement>('[data-reveal-key]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.revealedSteps.add(btn.getAttribute('data-reveal-key')!);
        this.renderProblemsView(container, problems, callbacks);
      });
    });

    const revealAllBtn = container.querySelector('#reveal-all-steps-btn');
    if (revealAllBtn) {
      revealAllBtn.addEventListener('click', () => {
        prob.stage2Derivation.forEach((_, idx) => {
          this.revealedSteps.add(`${prob.id}-s2-${idx}`);
        });
        this.renderProblemsView(container, problems, callbacks);
      });
    }

    const syncSceneBtn = container.querySelector('#sync-problem-scene-btn');
    if (syncSceneBtn) {
      syncSceneBtn.addEventListener('click', () => {
        callbacks.onLoadProblemScene(prob);
      });
    }

    container.querySelectorAll<HTMLButtonElement>('[data-trick-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        callbacks.onOpenMathTrick(btn.getAttribute('data-trick-id')!);
      });
    });

    // Navigation buttons wiring
    container.querySelector<HTMLButtonElement>('.coach-nav-prev')?.addEventListener('click', () => {
      if (this.activeStage > 1) {
        this.activeStage--;
        this.renderProblemsView(container, problems, callbacks);
      } else if (this.activeStage === 0) {
        this.activeStage = 1;
        this.renderProblemsView(container, problems, callbacks);
      }
    });

    container.querySelector<HTMLButtonElement>('.coach-nav-next')?.addEventListener('click', () => {
      if (this.activeStage < 4 && this.activeStage > 0) {
        this.activeStage++;
        this.renderProblemsView(container, problems, callbacks);
      } else if (this.activeStage === 0) {
        this.activeStage = 2;
        this.renderProblemsView(container, problems, callbacks);
      }
    });

    container.querySelector<HTMLButtonElement>('.coach-nav-reset')?.addEventListener('click', () => {
      this.resetProblemState(prob.id);
      this.renderProblemsView(container, problems, callbacks);
    });

    container.querySelector<HTMLButtonElement>('.coach-nav-solution')?.addEventListener('click', () => {
      prob.stage2Derivation.forEach((_, idx) => {
        this.revealedSteps.add(`${prob.id}-s2-${idx}`);
      });
      const correctIdx = prob.stage1Setup.options.findIndex((o) => o.isCorrect);
      if (correctIdx >= 0) {
        this.selectedOptions.set(prob.id, correctIdx);
      }
      this.activeStage = 4;
      this.renderProblemsView(container, problems, callbacks);
    });
  }
}
