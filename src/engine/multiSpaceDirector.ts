import * as THREE from 'three';
import { Chapter1SceneController } from '../scenes/chapter1Scene';
import { Chapter2SceneController } from '../scenes/chapter2Scene';
import { i18nManager, Locale } from '../i18n';

export class MultiSpaceDirector {
  private threeContainer: HTMLElement;
  private abstractCanvas: HTMLCanvasElement;
  private abstractCtx: CanvasRenderingContext2D;
  private abstractTabsEl: HTMLElement;
  private abstractReadoutEl: HTMLElement;
  private physicalTitleEl: HTMLElement;
  private physicalHudEl: HTMLElement;
  private stepBadgeEl: HTMLElement;
  private paramsDockEl: HTMLElement;

  private playPauseBtn: HTMLButtonElement | null = null;
  private resetBtn: HTMLButtonElement | null = null;
  private viewport1TagEl: HTMLElement | null = null;
  private viewport2TagEl: HTMLElement | null = null;

  private locale: Locale = 'tr';

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  public ch1Controller: Chapter1SceneController;
  public ch2Controller: Chapter2SceneController;

  public activeChapter: 1 | 2 = 1;
  public isPaused: boolean = false;

  // Interactive camera spherical coordinates
  private camRadius = 6.2;
  private camTheta = 0.08;
  private camPhi = 1.42;
  private isDragging = false;
  private prevMouse = { x: 0, y: 0 };

  constructor() {
    this.locale = i18nManager.getLocale();
    this.threeContainer = document.getElementById('three-canvas-container')!;
    this.abstractCanvas = document.getElementById('abstract-canvas') as HTMLCanvasElement;
    this.abstractCtx = this.abstractCanvas.getContext('2d')!;
    this.abstractTabsEl = document.getElementById('abstract-space-tabs')!;
    this.abstractReadoutEl = document.getElementById('abstract-readout-bar')!;
    this.physicalTitleEl = document.getElementById('physical-space-title')!;
    this.physicalHudEl = document.getElementById('physical-hud-overlay')!;
    this.stepBadgeEl = document.getElementById('stage-step-badge')!;
    this.paramsDockEl = document.getElementById('stage-parameters-dock')!;

    this.ch1Controller = new Chapter1SceneController();
    this.ch2Controller = new Chapter2SceneController();

    this.initThreeStage();
    this.initResizeObserver();
    this.updateControlsUI();
    this.updatePhysicalHud();
    this.updateViewportTags();
    this.startAnimationLoop();
  }

  private initThreeStage() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x05070b);

    const w = this.threeContainer.clientWidth || 540;
    const h = this.threeContainer.clientHeight || 300;
    this.camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    this.updateCameraPosition();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.threeContainer.innerHTML = '';
    this.threeContainer.appendChild(this.renderer.domElement);

    // Subtle 3Blue1Brown coordinate grid
    const grid = new THREE.GridHelper(10, 20, 0x1e293b, 0x0f172a);
    grid.position.y = -1.35;
    this.scene.add(grid);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.15);
    dirLight.position.set(4, 7, 6);
    this.scene.add(ambient, dirLight);

    this.scene.add(this.ch1Controller.rootGroup);
    this.scene.add(this.ch2Controller.rootGroup);
    this.ch2Controller.rootGroup.visible = false;

    // Mouse orbit interaction
    const dom = this.renderer.domElement;
    dom.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      this.prevMouse = { x: e.clientX, y: e.clientY };
    });
    window.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.prevMouse.x;
      const dy = e.clientY - this.prevMouse.y;
      this.prevMouse = { x: e.clientX, y: e.clientY };
      this.camTheta -= dx * 0.007;
      this.camPhi = Math.max(0.4, Math.min(2.4, this.camPhi - dy * 0.007));
      this.updateCameraPosition();
    });
    window.addEventListener('pointerup', () => {
      this.isDragging = false;
    });
    dom.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        this.camRadius = Math.max(3.4, Math.min(10.5, this.camRadius + e.deltaY * 0.004));
        this.updateCameraPosition();
      },
      { passive: false }
    );
  }

  private updateCameraPosition() {
    const x = this.camRadius * Math.sin(this.camPhi) * Math.sin(this.camTheta);
    const y = this.camRadius * Math.cos(this.camPhi);
    const z = this.camRadius * Math.sin(this.camPhi) * Math.cos(this.camTheta);
    this.camera.position.set(x, y, z);
    this.camera.lookAt(0, 0, 0);
  }

  private initResizeObserver() {
    const handleResize = () => {
      const w3 = this.threeContainer.clientWidth || 500;
      const h3 = this.threeContainer.clientHeight || 280;
      this.camera.aspect = w3 / h3;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w3, h3);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w2 = this.abstractCanvas.clientWidth || 500;
      const h2 = this.abstractCanvas.clientHeight || 220;
      this.abstractCanvas.width = Math.floor(w2 * dpr);
      this.abstractCanvas.height = Math.floor(h2 * dpr);
      this.abstractCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    window.addEventListener('resize', handleResize);
    setTimeout(handleResize, 50);
  }

  public setLocale(locale: Locale): void {
    this.locale = locale;
    this.updateControlsUI();
    this.updatePhysicalHud();
    this.updateViewportTags();
    this.renderAbstractTabs();
    this.renderParameterSliders();
  }

  public updateControlsUI(): void {
    if (!this.playPauseBtn) {
      this.playPauseBtn = document.getElementById('sim-play-pause-btn') as HTMLButtonElement;
    }
    if (!this.resetBtn) {
      this.resetBtn = document.getElementById('sim-reset-btn') as HTMLButtonElement;
    }
    if (this.playPauseBtn) {
      this.playPauseBtn.textContent = this.isPaused
        ? i18nManager.t('stage.play')
        : i18nManager.t('stage.pause');
      this.playPauseBtn.title = i18nManager.t('stage.playPauseTitle');
    }
    if (this.resetBtn) {
      this.resetBtn.textContent = i18nManager.t('stage.reset');
      this.resetBtn.title = i18nManager.t('stage.resetTitle');
    }
  }

  public updatePhysicalHud(): void {
    const dragText = i18nManager.t('stage.hudOrbit');
    const engText = i18nManager.t('stage.hudChapterEngine', { ch: this.activeChapter });
    this.physicalHudEl.innerHTML = `
      <span class="hud-badge">${dragText}</span>
      <span class="hud-badge" style="color:var(--manim-yellow);">${engText}</span>
    `;
  }

  public updateViewportTags(): void {
    if (!this.viewport1TagEl) {
      this.viewport1TagEl = document.querySelector('.viewport-tag.tag-physical');
    }
    if (!this.viewport2TagEl) {
      this.viewport2TagEl = document.querySelector('.viewport-tag.tag-abstract');
    }
    if (this.viewport1TagEl) {
      this.viewport1TagEl.textContent = i18nManager.t('stage.tagPhysical');
    }
    if (this.viewport2TagEl) {
      this.viewport2TagEl.textContent = i18nManager.t('stage.tagAbstract');
    }
  }

  public syncToDirective(
    chapter: 1 | 2,
    modeId: string,
    abstractTab: string,
    presetParams: Record<string, number>,
    badgeLabel: string,
    caption: string
  ) {
    this.activeChapter = chapter;
    this.ch1Controller.rootGroup.visible = chapter === 1;
    this.ch2Controller.rootGroup.visible = chapter === 2;

    this.stepBadgeEl.textContent = badgeLabel;
    this.physicalTitleEl.textContent = caption;

    if (chapter === 1) {
      this.ch1Controller.applyDirective(modeId, abstractTab, presetParams);
    } else {
      this.ch2Controller.applyDirective(modeId, abstractTab, presetParams);
    }

    this.updatePhysicalHud();
    this.renderAbstractTabs();
    this.renderParameterSliders();
  }

  public updateSingleParam(key: string, value: number) {
    if (this.activeChapter === 1) {
      (this.ch1Controller.state as unknown as Record<string, number>)[key] = value;
      this.ch1Controller.resetSimulation();
    } else {
      (this.ch2Controller.state as unknown as Record<string, number>)[key] = value;
    }
    this.renderParameterSliders();
  }

  public resetCurrentSim() {
    if (this.activeChapter === 1) {
      this.ch1Controller.resetSimulation();
    } else {
      this.ch2Controller.state.time = 0;
    }
  }

  private renderAbstractTabs() {
    if (this.activeChapter === 1) {
      const cur = this.ch1Controller.state.abstractTab;
      const tabs = [
        { id: 'phase', label: i18nManager.t('stage.tabs.phase') },
        { id: 'phasor', label: i18nManager.t('stage.tabs.phasor') },
        { id: 'potential', label: i18nManager.t('stage.tabs.potential') },
        { id: 'normal-coords', label: i18nManager.t('stage.tabs.normalCoords') },
        { id: 'energy-beats', label: i18nManager.t('stage.tabs.energyBeats') },
        { id: 'lissajous', label: i18nManager.t('stage.tabs.lissajous') }
      ];
      this.abstractTabsEl.innerHTML = tabs
        .map(
          (t) =>
            `<button class="abs-tab-btn ${t.id === cur ? 'active' : ''}" data-abs-tab="${t.id}">${t.label}</button>`
        )
        .join('');
    } else {
      const cur = this.ch2Controller.state.abstractTab;
      const tabs = [
        { id: 'dispersion', label: i18nManager.t('stage.tabs.dispersion') },
        { id: 'fourier-spectrum', label: i18nManager.t('stage.tabs.fourierSpectrum') }
      ];
      this.abstractTabsEl.innerHTML = tabs
        .map(
          (t) =>
            `<button class="abs-tab-btn ${t.id === cur ? 'active' : ''}" data-abs-tab="${t.id}">${t.label}</button>`
        )
        .join('');
    }

    this.abstractTabsEl.querySelectorAll<HTMLButtonElement>('[data-abs-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-abs-tab')!;
        if (this.activeChapter === 1) {
          this.ch1Controller.state.abstractTab = tabId;
        } else {
          this.ch2Controller.state.abstractTab = tabId;
        }
        this.renderAbstractTabs();
      });
    });
  }

  private renderParameterSliders() {
    if (this.activeChapter === 1) {
      const st = this.ch1Controller.state;
      const getModeLabel = (m: number) => {
        if (m === 1) return i18nManager.t('stage.sliders.mode1');
        if (m === 2) return i18nManager.t('stage.sliders.mode2');
        return i18nManager.t('stage.sliders.modeMixed');
      };

      this.paramsDockEl.innerHTML = `
        <div class="param-slider-group">
          <div class="param-label-row">
            <span>${i18nManager.t('stage.sliders.omega0')}</span>
            <span class="param-val" id="val-omega0">${st.omega0.toFixed(2)} rad/s</span>
          </div>
          <input type="range" id="sl-omega0" min="0.8" max="4.0" step="0.1" value="${st.omega0}" />
        </div>
        <div class="param-slider-group">
          <div class="param-label-row">
            <span>${i18nManager.t('stage.sliders.couplingKc')}</span>
            <span class="param-val" id="val-kc">${st.couplingKc.toFixed(2)}</span>
          </div>
          <input type="range" id="sl-kc" min="0.05" max="1.5" step="0.05" value="${st.couplingKc}" />
        </div>
        <div class="param-slider-group">
          <div class="param-label-row">
            <span>${i18nManager.t('stage.sliders.modeSelect')}</span>
            <span class="param-val" id="val-mode">${getModeLabel(st.modeSelect)}</span>
          </div>
          <input type="range" id="sl-mode" min="0" max="2" step="1" value="${st.modeSelect}" />
        </div>
        <div class="param-slider-group">
          <div class="param-label-row">
            <span>${i18nManager.t('stage.sliders.anharmonicAlpha')}</span>
            <span class="param-val" id="val-anh">${st.anharmonicAlpha.toFixed(2)}</span>
          </div>
          <input type="range" id="sl-anh" min="0" max="0.6" step="0.05" value="${st.anharmonicAlpha}" />
        </div>
      `;

      this.paramsDockEl.querySelector('#sl-omega0')?.addEventListener('input', (e) => {
        st.omega0 = parseFloat((e.target as HTMLInputElement).value);
        this.paramsDockEl.querySelector('#val-omega0')!.textContent = `${st.omega0.toFixed(2)} rad/s`;
      });
      this.paramsDockEl.querySelector('#sl-kc')?.addEventListener('input', (e) => {
        st.couplingKc = parseFloat((e.target as HTMLInputElement).value);
        this.paramsDockEl.querySelector('#val-kc')!.textContent = st.couplingKc.toFixed(2);
      });
      this.paramsDockEl.querySelector('#sl-mode')?.addEventListener('input', (e) => {
        st.modeSelect = parseInt((e.target as HTMLInputElement).value, 10);
        this.paramsDockEl.querySelector('#val-mode')!.textContent = getModeLabel(st.modeSelect);
      });
      this.paramsDockEl.querySelector('#sl-anh')?.addEventListener('input', (e) => {
        st.anharmonicAlpha = parseFloat((e.target as HTMLInputElement).value);
        st.phaseTrail = [];
        this.paramsDockEl.querySelector('#val-anh')!.textContent = st.anharmonicAlpha.toFixed(2);
      });
    } else {
      const st = this.ch2Controller.state;
      const modeUnit = i18nManager.t('stage.sliders.modesUnit');

      this.paramsDockEl.innerHTML = `
        <div class="param-slider-group">
          <div class="param-label-row">
            <span>${i18nManager.t('stage.sliders.modeN')}</span>
            <span class="param-val" id="val-moden">m = ${st.modeN}</span>
          </div>
          <input type="range" id="sl-moden" min="1" max="10" step="1" value="${st.modeN}" />
        </div>
        <div class="param-slider-group">
          <div class="param-label-row">
            <span>${i18nManager.t('stage.sliders.numBeads')}</span>
            <span class="param-val" id="val-beads">N = ${st.numBeads}</span>
          </div>
          <input type="range" id="sl-beads" min="2" max="24" step="1" value="${st.numBeads}" />
        </div>
        <div class="param-slider-group">
          <div class="param-label-row">
            <span>${i18nManager.t('stage.sliders.pluckPosRatio')}</span>
            <span class="param-val" id="val-pluck">${st.pluckPosRatio.toFixed(2)} L</span>
          </div>
          <input type="range" id="sl-pluck" min="0.1" max="0.9" step="0.05" value="${st.pluckPosRatio}" />
        </div>
        <div class="param-slider-group">
          <div class="param-label-row">
            <span>${i18nManager.t('stage.sliders.fourierMaxN')}</span>
            <span class="param-val" id="val-fmax">${st.fourierMaxN} ${modeUnit}</span>
          </div>
          <input type="range" id="sl-fmax" min="1" max="9" step="1" value="${st.fourierMaxN}" />
        </div>
      `;

      this.paramsDockEl.querySelector('#sl-moden')?.addEventListener('input', (e) => {
        st.modeN = parseInt((e.target as HTMLInputElement).value, 10);
        this.paramsDockEl.querySelector('#val-moden')!.textContent = `m = ${st.modeN}`;
      });
      this.paramsDockEl.querySelector('#sl-beads')?.addEventListener('input', (e) => {
        st.numBeads = parseInt((e.target as HTMLInputElement).value, 10);
        if (st.modeN > st.numBeads) st.modeN = st.numBeads;
        this.paramsDockEl.querySelector('#val-beads')!.textContent = `N = ${st.numBeads}`;
      });
      this.paramsDockEl.querySelector('#sl-pluck')?.addEventListener('input', (e) => {
        st.pluckPosRatio = parseFloat((e.target as HTMLInputElement).value);
        this.paramsDockEl.querySelector('#val-pluck')!.textContent = `${st.pluckPosRatio.toFixed(2)} L`;
      });
      this.paramsDockEl.querySelector('#sl-fmax')?.addEventListener('input', (e) => {
        st.fourierMaxN = parseInt((e.target as HTMLInputElement).value, 10);
        this.paramsDockEl.querySelector('#val-fmax')!.textContent = `${st.fourierMaxN} ${modeUnit}`;
      });
    }
  }

  private startAnimationLoop() {
    let lastTime = performance.now();

    const tick = (now: number) => {
      requestAnimationFrame(tick);
      const dt = Math.min(0.04, (now - lastTime) / 1000);
      lastTime = now;

      if (!this.isPaused) {
        if (this.activeChapter === 1) {
          this.ch1Controller.step(dt);
        } else {
          this.ch2Controller.step(dt);
        }
      }

      this.renderer.render(this.scene, this.camera);

      const cw = this.abstractCanvas.clientWidth || 500;
      const ch = this.abstractCanvas.clientHeight || 220;
      const readout =
        this.activeChapter === 1
          ? this.ch1Controller.renderAbstract2D(this.abstractCtx, cw, ch)
          : this.ch2Controller.renderAbstract2D(this.abstractCtx, cw, ch);

      this.abstractReadoutEl.textContent = readout;
    };

    requestAnimationFrame(tick);
  }

  public get activeAbstractTab(): string {
    return this.activeChapter === 1
      ? this.ch1Controller.state.abstractTab
      : this.ch2Controller.state.abstractTab;
  }

  public render2DAbstractSpace(): void {
    const cw = this.abstractCanvas.clientWidth || 500;
    const ch = this.abstractCanvas.clientHeight || 220;
    const readout =
      this.activeChapter === 1
        ? this.ch1Controller.renderAbstract2D(this.abstractCtx, cw, ch)
        : this.ch2Controller.renderAbstract2D(this.abstractCtx, cw, ch);
    if (this.abstractReadoutEl) {
      this.abstractReadoutEl.textContent = readout;
    }
  }
}

