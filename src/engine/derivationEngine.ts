import {
  ChapterModule,
  DerivationStep,
  MathTrickItem,
  RoadmapChapter
} from '../types/curriculum';
import { getMathTricks } from '../data';
import { i18nManager } from '../i18n';
import { renderLatexToString } from './mathRenderer';

export interface DerivationEngineCallbacks {
  onSelectStep: (step: DerivationStep) => void;
  onToggleSymbolicTerm: (paramKey: string, value: number) => void;
  onOpenMathTrick: (trickId: string) => void;
}

export class DerivationEngineUI {
  private activeTermsState: Map<string, boolean> = new Map();
  private unlockedTrainerSteps: Set<string> = new Set();

  public renderModuleView(
    container: HTMLElement,
    mod: ChapterModule,
    activeStepIndex: number, // currentStepIndex
    isTrainerMode: boolean,
    callbacks: DerivationEngineCallbacks
  ) {
    // Initialize default symbolic term toggles for this module if not yet set
    mod.symbolicTerms.forEach((term) => {
      if (!this.activeTermsState.has(term.id)) {
        this.activeTermsState.set(term.id, term.defaultActive);
      }
    });

    const fundamentalHtml = mod.fundamentalEquations
      .map(
        (eq) => `
        <div class="fund-eq-box">
          <div class="fund-eq-header">
            <span>📌 ${eq.label}</span>
          </div>
          <div class="main-equation-stage" style="margin-bottom:4px;">
            ${renderLatexToString(eq.latex, true)}
          </div>
          <div class="fund-eq-note">${eq.colorNote}</div>
        </div>
      `
      )
      .join('');

    const symbolicTogglesHtml =
      mod.symbolicTerms.length > 0
        ? `
      <div class="symbolic-manipulator-card">
        <div class="sym-header">
          <div class="sym-title">${i18nManager.t('derivation.symTermsTitle')}</div>
          <span style="font-size:11px; color:var(--text-muted);">${i18nManager.t('derivation.symTermsSubtitle')}</span>
        </div>
        <div class="sym-toggles-grid">
          ${mod.symbolicTerms
            .map((term) => {
              const isActive = this.activeTermsState.get(term.id) ?? term.defaultActive;
              return `
                <button class="sym-term-btn ${isActive ? 'active' : ''}" data-term-id="${term.id}">
                  <div class="sym-term-top">
                    <span class="sym-term-label">${term.label}</span>
                    <span class="sym-status-pill">${isActive ? i18nManager.t('derivation.statusActive') : i18nManager.t('derivation.statusOff')}</span>
                  </div>
                  <div style="margin:6px 0;">${renderLatexToString(term.latexBadge, false)}</div>
                  <div class="sym-term-effect">${term.description}</div>
                  <div class="sym-term-effect" style="color:var(--manim-yellow); margin-top:4px;">
                    <strong>${i18nManager.t('derivation.equationEffect')}</strong> ${term.effectOnEquation}
                  </div>
                </button>
              `;
            })
            .join('')}
        </div>
      </div>
    `
        : '';

    const stepsHtml = mod.derivationSteps
      .map((step, idx) => {
        const isCurrent = idx === activeStepIndex;
        const stepKey = `${mod.id}-step-${step.stepNumber}`;
        const isUnlocked = !isTrainerMode || idx === 0 || this.unlockedTrainerSteps.has(stepKey);

        const tricks = getMathTricks(i18nManager.getLocale());
        const trickButtonsHtml = step.mathTrickIds
          .map((tid) => {
            const trick = tricks.find((t) => t.id === tid);
            if (!trick) return '';
            return `
              <button class="math-trick-trigger" data-trick-id="${trick.id}">
                <span>${trick.badgeLabel}</span>
              </button>
            `;
          })
          .join('');

        const substepsHtml =
          isUnlocked
            ? `
          <div class="algebra-accordion">
            ${step.algebraicBreakdown
              .map(
                (sub) => `
              <div class="algebra-substep">
                <div class="substep-head">${sub.subStepTitle}</div>
                <div class="substep-desc">${sub.explanation}</div>
                <div class="substep-math">${renderLatexToString(sub.formulaLatex, true)}</div>
              </div>
            `
              )
              .join('')}
          </div>
        `
            : `
          <div style="padding:14px; background:rgba(247,209,71,0.06); border:1px dashed var(--border-gold); border-radius:8px; margin-bottom:10px; font-size:13px; color:var(--manim-yellow);">
            ${i18nManager.t('trainer.lockedBanner')}
            <button class="stage-ctrl-btn unlock-step-direct-btn" data-step-key="${stepKey}" style="margin-left:10px;">${i18nManager.t('trainer.revealBtn')}</button>
          </div>
        `;

        const trainerHtml = `
          <div class="trainer-checkpoint-box">
            <div class="trainer-prompt">${i18nManager.t('trainer.checkpointPrompt')} ${step.trainerCheckpoint.questionPrompt}</div>
            <div class="trainer-options-list" data-step-idx="${idx}" data-next-key="${mod.id}-step-${step.stepNumber + 1}" data-cur-key="${stepKey}">
              ${step.trainerCheckpoint.options
                .map(
                  (opt, oIdx) => `
                <button class="trainer-option-btn" data-opt-idx="${oIdx}" data-correct="${opt.isCorrect}">
                  <div style="display:flex; align-items:center; gap:10px;">
                    <span class="nav-mod-code">${opt.label}</span>
                    <div>${renderLatexToString(opt.latex, false)}</div>
                  </div>
                  <div class="trainer-feedback hidden" data-fb>${opt.feedback}</div>
                </button>
              `
                )
                .join('')}
            </div>
            <div style="margin-top:10px; font-size:11.5px; color:var(--text-secondary);">
              💡 <strong>${i18nManager.t('trainer.examTip')}</strong> ${step.trainerCheckpoint.examTip}
            </div>
          </div>
        `;

        return `
          <article class="derivation-step-card ${isCurrent ? 'active-step' : ''}" data-step-card="${idx}">
            <div class="step-card-header" data-step-header="${idx}">
              <div class="step-num-circle">${step.stepNumber}</div>
              <div class="step-header-titles">
                <div class="step-title">${step.title}</div>
                <div class="step-subtitle">${step.subtitle}</div>
              </div>
              <button class="step-sync-btn" data-sync-step="${idx}">
                ${isCurrent ? i18nManager.t('derivation.syncedToStage') : i18nManager.t('derivation.projectToStage')}
              </button>
            </div>
            <div class="step-card-body">
              <p class="step-motivation">${step.physicalMotivation}</p>
              <div class="main-equation-stage">
                ${renderLatexToString(step.mainEquationLatex, true)}
              </div>
              ${trickButtonsHtml ? `<div class="trick-badges-row">${trickButtonsHtml}</div>` : ''}
              ${substepsHtml}
              ${trainerHtml}
            </div>
          </article>
        `;
      })
      .join('');

    const examplesHtml = mod.solvedExamples
      .map(
        (ex) => `
        <div class="symbolic-manipulator-card solved-example" style="border-color:rgba(131,193,103,0.3);">
          <div class="sym-header">
            <div class="sym-title" style="color:var(--manim-green);">${i18nManager.t('derivation.solvedExample')} · ${ex.title}</div>
            <span class="meta-pill">${ex.bookRef}</span>
          </div>
          <p class="step-motivation" style="font-size:15.5px;">${ex.problemStatement}</p>
          <div style="font-size:12.5px; color:var(--manim-yellow); margin-bottom:10px;">
            <strong>${i18nManager.t('derivation.solutionStrategy')}</strong> ${ex.strategy}
          </div>
          <div class="algebra-accordion">
            ${ex.stepsLatex
              .map(
                (st) => `
              <div class="algebra-substep">
                <div class="substep-desc">${st.text}</div>
                <div class="substep-math">${renderLatexToString(st.math, true)}</div>
              </div>
            `
              )
              .join('')}
          </div>
          <div class="core-question-banner" style="margin-top:12px;">
            <strong>${i18nManager.t('derivation.keyTakeaway')}</strong> ${ex.keyTakeaway}
          </div>
        </div>
      `
      )
      .join('');

    const trapsHtml = mod.commonTraps
      .map(
        (tr) => `
        <div class="trick-trap-alert" style="margin-bottom:10px;">
          <div style="font-weight:700; color:var(--manim-red); margin-bottom:4px;">${i18nManager.t('derivation.commonTrap')}: ${tr.trap}</div>
          <div style="color:var(--text-secondary); margin-bottom:4px;"><strong>${i18nManager.t('derivation.whyWrong')}</strong> ${tr.whyWrong}</div>
          <div style="color:var(--manim-green);"><strong>${i18nManager.t('derivation.correctApproach')}</strong> ${tr.correctApproach}</div>
        </div>
      `
      )
      .join('');

    container.innerHTML = `
      <div class="module-hero">
        <div class="module-meta-pills">
          <span class="meta-pill">${i18nManager.t('derivation.heroChapterModule', { ch: mod.chapter, code: mod.code })}</span>
          <span class="meta-pill">📖 ${mod.bookPages}</span>
          <span class="meta-pill">${i18nManager.t('derivation.stepCountPill', { count: mod.derivationSteps.length })}</span>
        </div>
        <h2 class="module-title">${mod.code} — ${mod.title}</h2>
        <p class="module-summary">${mod.summary}</p>
        <div class="core-question-banner">
          <strong>${i18nManager.t('derivation.coreQuestion')}</strong> ${mod.coreQuestion}
        </div>
      </div>

      ${symbolicTogglesHtml}

      <div class="fundamental-eq-grid">
        ${fundamentalHtml}
      </div>

      <div style="display:flex; align-items:center; justify-content:space-between; margin: 18px 0 12px 0;">
        <h3 style="font-size:15px; font-weight:700; color:var(--manim-blue); text-transform:uppercase; letter-spacing:0.06em;">
          ${i18nManager.t('derivation.stepHeader')}
        </h3>
        <span style="font-size:11.5px; color:var(--text-secondary);">${i18nManager.t('derivation.treeSubheading')}</span>
      </div>

      <div class="derivation-timeline">
        ${stepsHtml}
      </div>

      <div style="margin-top:28px;">
        <h3 style="font-size:15px; font-weight:700; color:var(--manim-green); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:12px;">
          ${i18nManager.t('derivation.examplesAndTrapsHeading')}
        </h3>
        ${examplesHtml}
        ${trapsHtml}
      </div>
    `;

    // Wire events
    container.querySelectorAll<HTMLButtonElement>('[data-term-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tid = btn.getAttribute('data-term-id')!;
        const term = mod.symbolicTerms.find((t) => t.id === tid);
        if (!term) return;
        const nextState = !(this.activeTermsState.get(tid) ?? term.defaultActive);
        this.activeTermsState.set(tid, nextState);
        callbacks.onToggleSymbolicTerm(
          term.sceneParamKey,
          nextState ? term.activeValue : term.inactiveValue
        );
        this.renderModuleView(container, mod, activeStepIndex, isTrainerMode, callbacks);
      });
    });

    container.querySelectorAll<HTMLElement>('[data-step-header], [data-sync-step]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const idxStr =
          el.getAttribute('data-step-header') ?? el.getAttribute('data-sync-step') ?? '0';
        const idx = parseInt(idxStr, 10);
        const step = mod.derivationSteps[idx];
        if (step) {
          callbacks.onSelectStep(step);
          this.renderModuleView(container, mod, idx, isTrainerMode, callbacks);
        }
      });
    });

    container.querySelectorAll<HTMLButtonElement>('[data-trick-id]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const trickId = btn.getAttribute('data-trick-id')!;
        callbacks.onOpenMathTrick(trickId);
      });
    });

    container.querySelectorAll<HTMLButtonElement>('.unlock-step-direct-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-step-key')!;
        this.unlockedTrainerSteps.add(key);
        this.renderModuleView(container, mod, activeStepIndex, isTrainerMode, callbacks);
      });
    });

    container.querySelectorAll<HTMLButtonElement>('.trainer-option-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const isCorrect = btn.getAttribute('data-correct') === 'true';
        const parent = btn.closest('.trainer-options-list')!;
        btn.classList.add(isCorrect ? 'correct' : 'wrong');
        const fb = btn.querySelector('[data-fb]');
        if (fb) fb.classList.remove('hidden');

        if (isCorrect) {
          const curKey = parent.getAttribute('data-cur-key')!;
          const nextKey = parent.getAttribute('data-next-key')!;
          this.unlockedTrainerSteps.add(curKey);
          this.unlockedTrainerSteps.add(nextKey);
        }
      });
    });
  }

  public renderRoadmapView(container: HTMLElement, roadmap: RoadmapChapter[]) {
    container.innerHTML = `
      <div class="module-hero">
        <div class="module-meta-pills">
          <span class="meta-pill">${i18nManager.t('roadmap.heroPill')}</span>
          <span class="meta-pill">${i18nManager.t('roadmap.archPill')}</span>
        </div>
        <h2 class="module-title">${i18nManager.t('roadmap.heroTitle')}</h2>
        <p class="module-summary">
          ${i18nManager.t('roadmap.heroSummary')}
        </p>
      </div>
      <div class="derivation-timeline">
        ${roadmap
          .map(
            (ch) => `
          <div class="derivation-step-card">
            <div class="step-card-header">
              <div class="step-num-circle">${ch.chapterNumber}</div>
              <div class="step-header-titles">
                <div class="step-title">${ch.title}</div>
                <div class="step-subtitle">${ch.englishTitle} · ${ch.bookPages}</div>
              </div>
              <span class="meta-pill">${i18nManager.t('roadmap.nextPhasePill')}</span>
            </div>
            <div class="step-card-body">
              <p class="step-motivation">${ch.coreTheme}</p>
              <div class="algebra-accordion">
                ${ch.keyDerivations
                  .map(
                    (kd) => `
                  <div class="algebra-substep">
                    <div class="substep-head">${i18nManager.t('search.modulePrefix', { code: kd.code })} — ${kd.title}</div>
                    <div class="substep-math">${renderLatexToString(kd.governingEquationLatex, true)}</div>
                    <div class="substep-desc" style="margin-top:6px;">${kd.physicalInsight}</div>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    `;
  }

  public renderMathTrickModalContent(
    titleEl: HTMLElement,
    bodyEl: HTMLElement,
    trick: MathTrickItem,
    onSelectOtherTrick: (id: string) => void
  ) {
    titleEl.textContent = trick.title;
    const tricks = getMathTricks(i18nManager.getLocale());

    const trickTabsHtml = tricks.map(
      (t) => `
        <button class="prob-pill-btn ${t.id === trick.id ? 'active' : ''}" data-switch-trick="${t.id}">
          ${t.badgeLabel}
        </button>
      `
    ).join('');

    bodyEl.innerHTML = `
      <div style="display:flex; flex-wrap:wrap; gap:6px; padding-bottom:10px; border-bottom:1px solid var(--border-subtle);">
        ${trickTabsHtml}
      </div>

      <div style="display:flex; gap:8px; align-items:center;">
        <span class="meta-pill">${trick.category}</span>
        <span style="font-size:12px; color:var(--text-secondary);"><strong>${i18nManager.t('arsenal.whereUsed')}</strong> ${trick.whenUsedInBerkeley}</span>
      </div>

      <p class="step-motivation" style="margin-bottom:4px;">${trick.summary}</p>

      <div class="main-equation-stage">
        ${renderLatexToString(trick.coreIdentityLatex, true)}
      </div>

      <div class="algebra-accordion">
        ${trick.stepByStepProof
          .map(
            (st) => `
          <div class="algebra-substep">
            <div class="substep-head">${st.title}</div>
            <div class="substep-desc">${st.text}</div>
            <div class="substep-math">${renderLatexToString(st.latex, true)}</div>
          </div>
        `
          )
          .join('')}
      </div>

      <div class="trick-trap-alert">
        ${trick.deadlyExamTrap}
      </div>

      <div style="background:#06080d; border:1px solid var(--border-subtle); border-radius:8px; padding:10px;">
        <div style="font-size:11px; font-family:var(--font-mono); color:var(--manim-yellow); margin-bottom:6px;">
          ${i18nManager.t('arsenal.canvasTitle')}: ${trick.title}
        </div>
        <canvas id="trick-mini-canvas" width="680" height="150" style="width:100%; height:150px; display:block;"></canvas>
      </div>
    `;

    bodyEl.querySelectorAll<HTMLButtonElement>('[data-switch-trick]').forEach((btn) => {
      btn.addEventListener('click', () => {
        onSelectOtherTrick(btn.getAttribute('data-switch-trick')!);
      });
    });

    const canvas = bodyEl.querySelector<HTMLCanvasElement>('#trick-mini-canvas');
    if (canvas) {
      this.drawTrickMiniCanvas(canvas, trick.interactiveDemoType);
    }
  }

  private drawTrickMiniCanvas(
    canvas: HTMLCanvasElement,
    demoType: MathTrickItem['interactiveDemoType']
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = '#05070b';
    ctx.fillRect(0, 0, w, h);

    const midY = h * 0.5;
    ctx.strokeStyle = 'rgba(165,177,194,0.2)';
    ctx.beginPath();
    ctx.moveTo(20, midY);
    ctx.lineTo(w - 20, midY);
    ctx.stroke();

    if (demoType === 'taylor') {
      // Plot sin(theta) vs theta vs theta - theta^3/6
      const scaleX = 95;
      const scaleY = 48;
      const cx = w * 0.5;

      // Exact sin(theta) in Blue
      ctx.strokeStyle = '#58C4DD';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let x = -2.8; x <= 2.8; x += 0.05) {
        const sx = cx + x * scaleX;
        const sy = midY - Math.sin(x) * scaleY;
        if (x === -2.8) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      // Linear approximation y = theta in Yellow
      ctx.strokeStyle = '#F7D147';
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      for (let x = -1.6; x <= 1.6; x += 0.05) {
        const sx = cx + x * scaleX;
        const sy = midY - x * scaleY;
        if (x === -1.6) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#58C4DD';
      ctx.font = '11px JetBrains Mono';
      ctx.fillText(i18nManager.t('arsenal.canvasTaylor'), 24, 22);
    } else if (demoType === 'orthogonality') {
      // Plot sin(x)*sin(2x) showing positive and negative lobes cancelling out to zero
      ctx.strokeStyle = '#B189DF';
      ctx.fillStyle = 'rgba(88, 196, 221, 0.22)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(40, midY);
      for (let i = 0; i <= 200; i++) {
        const u = i / 200;
        const val = Math.sin(Math.PI * u) * Math.sin(2 * Math.PI * u);
        const sx = 40 + u * (w - 80);
        const sy = midY - val * 55;
        ctx.lineTo(sx, sy);
      }
      ctx.lineTo(w - 40, midY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#F7D147';
      ctx.font = '11px JetBrains Mono';
      ctx.fillText(i18nManager.t('arsenal.canvasOrthogonality'), 24, 22);
    } else {
      // Envelope & wave modulation preview
      ctx.strokeStyle = '#58C4DD';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 240; i++) {
        const u = i / 240;
        const y = Math.cos(2 * Math.PI * u) * Math.cos(18 * Math.PI * u);
        const sx = 30 + u * (w - 60);
        const sy = midY - y * 50;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
      ctx.fillStyle = '#F7D147';
      ctx.font = '11px JetBrains Mono';
      ctx.fillText(i18nManager.t('arsenal.canvasBeats'), 24, 22);
    }
  }
}

