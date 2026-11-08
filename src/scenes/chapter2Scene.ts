import * as THREE from 'three';
import {
  MANIM_COLORS,
  MANIM_HEX,
  ManimArrow3D,
  createManimVectorArrow
} from './shaders/manimGlowShaders';

export interface Chapter2State {
  modeId: string; // 'continuous-dx' | 'standing-modes' | 'plucked-fourier' | 'discrete-lattice'
  abstractTab: string; // 'dispersion' | 'fourier-spectrum'
  modeN: number;
  numBeads: number;
  boundaryCondition: number; // 0: Fixed-Fixed, 1: Fixed-Free
  showCurvatureVectors: number;
  fourierMaxN: number;
  pluckPosRatio: number; // x0 / L in (0.1, 0.9)
  diatomicRatio: number; // M2 / M1 >= 1
  time: number;
}

export class Chapter2SceneController {
  public rootGroup: THREE.Group;
  public state: Chapter2State;

  private leftPost!: THREE.Mesh;
  private rightPost!: THREE.Mesh;
  private freeRingMesh!: THREE.Mesh;

  // Main continuous / Fourier / lattice line
  private mainWaveLine!: THREE.Line;
  private refInitialLine!: THREE.Line;
  private harmonicLines: THREE.Line[] = [];

  // Discrete beads pool (up to 30 beads)
  private beadMeshes: THREE.Mesh[] = [];
  // Node markers pool
  private nodeMeshes: THREE.Mesh[] = [];
  // Curvature / acceleration vector arrows pool
  private curvatureArrows: ManimArrow3D[] = [];

  // Highlighted dx element box for mod 2.1
  private dxHighlightMesh!: THREE.Mesh;
  private dxLeftTangentArrow!: ManimArrow3D;
  private dxRightTangentArrow!: ManimArrow3D;

  private readonly stringSpan = 5.6; // from x = -2.8 to +2.8

  constructor() {
    this.rootGroup = new THREE.Group();
    this.state = {
      modeId: 'continuous-dx',
      abstractTab: 'dispersion',
      modeN: 2,
      numBeads: 6,
      boundaryCondition: 0,
      showCurvatureVectors: 1,
      fourierMaxN: 9,
      pluckPosRatio: 0.5,
      diatomicRatio: 1.0,
      time: 0
    };

    this.buildStageObjects();
  }

  private buildStageObjects() {
    const postMat = new THREE.MeshStandardMaterial({ color: 0x283548, roughness: 0.4 });
    this.leftPost = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.5, 16), postMat);
    this.leftPost.position.set(-this.stringSpan / 2, 0, 0);

    this.rightPost = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.5, 16), postMat);
    this.rightPost.position.set(this.stringSpan / 2, 0, 0);

    // Sliding ring for free right boundary condition
    this.freeRingMesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.11, 0.03, 12, 24),
      new THREE.MeshBasicMaterial({ color: MANIM_COLORS.yellow })
    );
    this.freeRingMesh.rotation.y = Math.PI / 2;

    // Equilibrium axis line
    const eqLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-this.stringSpan / 2, 0, 0),
        new THREE.Vector3(this.stringSpan / 2, 0, 0)
      ]),
      new THREE.LineBasicMaterial({ color: 0x1e293b })
    );

    this.mainWaveLine = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: MANIM_COLORS.blue })
    );

    this.refInitialLine = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineDashedMaterial({ color: 0x64748b, dashSize: 0.12, gapSize: 0.08 })
    );

    // Ghost harmonic lines for Fourier decomposition
    const harmColors = [0xf7d147, 0x83c167, 0xb189df, 0xfc6255];
    for (let h = 0; h < 4; h++) {
      const hLine = new THREE.Line(
        new THREE.BufferGeometry(),
        new THREE.LineBasicMaterial({
          color: harmColors[h % harmColors.length],
          transparent: true,
          opacity: 0.42
        })
      );
      this.harmonicLines.push(hLine);
      this.rootGroup.add(hLine);
    }

    // Pool of 30 beads for discrete lattice
    for (let i = 0; i < 30; i++) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 22, 22),
        new THREE.MeshStandardMaterial({
          color: MANIM_COLORS.yellow,
          emissive: MANIM_COLORS.yellow,
          emissiveIntensity: 0.3,
          roughness: 0.3
        })
      );
      mesh.visible = false;
      this.beadMeshes.push(mesh);
      this.rootGroup.add(mesh);
    }

    // Pool of 16 node markers
    for (let i = 0; i < 16; i++) {
      const node = new THREE.Mesh(
        new THREE.SphereGeometry(0.075, 16, 16),
        new THREE.MeshBasicMaterial({ color: MANIM_COLORS.red })
      );
      node.visible = false;
      this.nodeMeshes.push(node);
      this.rootGroup.add(node);
    }

    // Pool of 15 curvature / restoring force arrows
    for (let i = 0; i < 15; i++) {
      const arr = createManimVectorArrow(MANIM_COLORS.red, 0.022);
      arr.setVisible(false);
      this.curvatureArrows.push(arr);
      this.rootGroup.add(arr.group);
    }

    // Highlighted dx element for Module 2.1
    this.dxHighlightMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.14, 0.14),
      new THREE.MeshBasicMaterial({
        color: MANIM_COLORS.yellow,
        wireframe: true
      })
    );
    this.dxLeftTangentArrow = createManimVectorArrow(MANIM_COLORS.green, 0.025);
    this.dxRightTangentArrow = createManimVectorArrow(MANIM_COLORS.green, 0.025);

    this.rootGroup.add(
      this.leftPost,
      this.rightPost,
      this.freeRingMesh,
      eqLine,
      this.mainWaveLine,
      this.refInitialLine,
      this.dxHighlightMesh,
      this.dxLeftTangentArrow.group,
      this.dxRightTangentArrow.group
    );
  }

  public applyDirective(
    modeId: string,
    abstractTab: string,
    presetParams: Record<string, number>
  ) {
    this.state.modeId = modeId;
    this.state.abstractTab = abstractTab;
    if (presetParams.modeN !== undefined) this.state.modeN = presetParams.modeN;
    if (presetParams.numBeads !== undefined) this.state.numBeads = presetParams.numBeads;
    if (presetParams.boundaryCondition !== undefined) {
      this.state.boundaryCondition = presetParams.boundaryCondition;
    }
    if (presetParams.showCurvatureVectors !== undefined) {
      this.state.showCurvatureVectors = presetParams.showCurvatureVectors;
    }
    if (presetParams.fourierMaxN !== undefined) {
      this.state.fourierMaxN = presetParams.fourierMaxN;
    }
    if (presetParams.pluckPosRatio !== undefined) {
      this.state.pluckPosRatio = presetParams.pluckPosRatio;
    }
    if (presetParams.diatomicRatio !== undefined) {
      this.state.diatomicRatio = presetParams.diatomicRatio;
    }
  }

  public computeFourierCoeffAn(n: number, x0Ratio: number, h: number = 1.05): number {
    const x0 = Math.max(0.08, Math.min(0.92, x0Ratio));
    const denom = Math.PI * Math.PI * n * n * x0 * (1 - x0);
    return ((2 * h) / denom) * Math.sin(n * Math.PI * x0);
  }

  public step(dt: number) {
    this.state.time += dt;
    const t = this.state.time;
    const L = this.stringSpan;
    const xStart = -L / 2;

    // Reset visibility of pools
    this.beadMeshes.forEach((b) => (b.visible = false));
    this.nodeMeshes.forEach((n) => (n.visible = false));
    this.curvatureArrows.forEach((a) => a.setVisible(false));
    this.harmonicLines.forEach((l) => (l.visible = false));
    this.refInitialLine.visible = false;
    this.dxHighlightMesh.visible = false;
    this.dxLeftTangentArrow.setVisible(false);
    this.dxRightTangentArrow.setVisible(false);
    this.freeRingMesh.visible = false;

    const mode = this.state.modeId;

    if (mode === 'continuous-dx' || mode === 'standing-modes') {
      const n = Math.max(1, Math.round(this.state.modeN));
      const isFreeRight = this.state.boundaryCondition === 1;
      const kL = isFreeRight ? ((2 * n - 1) * Math.PI) / 2 : n * Math.PI;
      const omega = 1.6 * (kL / Math.PI);
      const cosWt = Math.cos(omega * t);

      const samples = 140;
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= samples; i++) {
        const s = i / samples;
        const x = xStart + s * L;
        const y = 0.95 * Math.sin(kL * s) * cosWt;
        pts.push(new THREE.Vector3(x, y, 0));
      }
      this.mainWaveLine.geometry.setFromPoints(pts);

      if (isFreeRight) {
        const yEnd = 0.95 * Math.sin(kL) * cosWt;
        this.freeRingMesh.visible = true;
        this.freeRingMesh.position.set(xStart + L, yEnd, 0);
      }

      // Show nodes for standing-modes
      if (mode === 'standing-modes') {
        const nodeCount = isFreeRight ? n : n + 1;
        for (let m = 0; m < nodeCount && m < this.nodeMeshes.length; m++) {
          const sNode = (m * Math.PI) / kL;
          if (sNode <= 1.001) {
            this.nodeMeshes[m].visible = true;
            this.nodeMeshes[m].position.set(xStart + sNode * L, 0, 0);
          }
        }
      }

      // Show curvature vectors d²ψ/dx² = -k² ψ and magnified dx element
      if (this.state.showCurvatureVectors > 0.5 || mode === 'continuous-dx') {
        for (let idx = 0; idx < this.curvatureArrows.length; idx++) {
          const s = (idx + 1) / (this.curvatureArrows.length + 1);
          const x = xStart + s * L;
          const y = 0.95 * Math.sin(kL * s) * cosWt;
          const d2y = -y; // proportional to ∂²ψ/∂x²
          this.curvatureArrows[idx].setVector(
            new THREE.Vector3(x, y, 0),
            new THREE.Vector3(0, Math.sign(d2y) || -1, 0),
            Math.abs(d2y) * 0.55
          );
        }

        if (mode === 'continuous-dx') {
          const sDx = 0.32;
          const xDx = xStart + sDx * L;
          const yDx = 0.95 * Math.sin(kL * sDx) * cosWt;
          const slopeL = (0.95 * (kL / L) * Math.cos(kL * (sDx - 0.03)) * cosWt);
          const slopeR = (0.95 * (kL / L) * Math.cos(kL * (sDx + 0.03)) * cosWt);

          this.dxHighlightMesh.visible = true;
          this.dxHighlightMesh.position.set(xDx, yDx, 0);
          this.dxLeftTangentArrow.setVector(
            new THREE.Vector3(xDx - 0.16, yDx, 0),
            new THREE.Vector3(-1, -slopeL, 0).normalize(),
            0.55
          );
          this.dxRightTangentArrow.setVector(
            new THREE.Vector3(xDx + 0.16, yDx, 0),
            new THREE.Vector3(1, slopeR, 0).normalize(),
            0.55
          );
        }
      }
    } else if (mode === 'plucked-fourier') {
      const maxN = Math.max(1, Math.round(this.state.fourierMaxN));
      const x0Ratio = this.state.pluckPosRatio;
      const samples = 140;

      // Dashed initial triangle profile
      const initPts: THREE.Vector3[] = [];
      for (let i = 0; i <= samples; i++) {
        const s = i / samples;
        const y0 =
          s <= x0Ratio
            ? 1.05 * (s / x0Ratio)
            : 1.05 * ((1 - s) / (1 - x0Ratio));
        initPts.push(new THREE.Vector3(xStart + s * L, y0, -0.05));
      }
      this.refInitialLine.visible = true;
      this.refInitialLine.geometry.setFromPoints(initPts);
      this.refInitialLine.computeLineDistances();

      // Sum first maxN Fourier harmonics
      const sumPts: THREE.Vector3[] = [];
      for (let i = 0; i <= samples; i++) {
        const s = i / samples;
        let ySum = 0;
        for (let n = 1; n <= maxN; n++) {
          const An = this.computeFourierCoeffAn(n, x0Ratio, 1.05);
          const wn = n * 1.45;
          ySum += An * Math.sin(n * Math.PI * s) * Math.cos(wn * t);
        }
        sumPts.push(new THREE.Vector3(xStart + s * L, ySum, 0));
      }
      this.mainWaveLine.geometry.setFromPoints(sumPts);

      // Show individual harmonic component lines in 3D depth (z offset)
      for (let h = 0; h < this.harmonicLines.length; h++) {
        const n = h + 1;
        if (n <= maxN) {
          const An = this.computeFourierCoeffAn(n, x0Ratio, 1.05);
          const wn = n * 1.45;
          const hPts: THREE.Vector3[] = [];
          for (let i = 0; i <= 90; i++) {
            const s = i / 90;
            const yh = An * Math.sin(n * Math.PI * s) * Math.cos(wn * t);
            hPts.push(new THREE.Vector3(xStart + s * L, yh, -0.35 * (h + 1)));
          }
          this.harmonicLines[h].visible = true;
          this.harmonicLines[h].geometry.setFromPoints(hPts);
        }
      }
    } else if (mode === 'discrete-lattice') {
      const N = Math.max(2, Math.min(24, Math.round(this.state.numBeads)));
      const m = Math.max(1, Math.min(N, Math.round(this.state.modeN)));
      const isFreeRight = this.state.boundaryCondition === 1;

      const ka = isFreeRight
        ? ((2 * m - 1) * Math.PI) / (2 * N + 1)
        : (m * Math.PI) / (N + 1);
      const omegaM = 2.6 * Math.sin(ka / 2);
      const cosWt = Math.cos(omegaM * t);

      const polyPts: THREE.Vector3[] = [new THREE.Vector3(xStart, 0, 0)];

      for (let n = 1; n <= N; n++) {
        const s = n / (N + 1);
        const x = xStart + s * L;
        const massMod =
          this.state.diatomicRatio > 1.05 && n % 2 === 0
            ? 1 / Math.sqrt(this.state.diatomicRatio)
            : 1.0;
        const yn = 0.95 * massMod * Math.sin(n * ka) * cosWt;
        const pos = new THREE.Vector3(x, yn, 0);
        polyPts.push(pos);

        const bead = this.beadMeshes[n - 1];
        bead.visible = true;
        bead.position.copy(pos);
        const radiusScale =
          this.state.diatomicRatio > 1.05 && n % 2 === 0 ? 1.28 : 0.95;
        bead.scale.setScalar(radiusScale);
      }

      if (isFreeRight) {
        const yEnd = polyPts[polyPts.length - 1].y;
        polyPts.push(new THREE.Vector3(xStart + L, yEnd, 0));
        this.freeRingMesh.visible = true;
        this.freeRingMesh.position.set(xStart + L, yEnd, 0);
      } else {
        polyPts.push(new THREE.Vector3(xStart + L, 0, 0));
      }

      this.mainWaveLine.geometry.setFromPoints(polyPts);
    }
  }

  public renderAbstract2D(ctx: CanvasRenderingContext2D, width: number, height: number): string {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#06080d';
    ctx.fillRect(0, 0, width, height);

    if (this.state.abstractTab === 'fourier-spectrum') {
      return this.renderFourierSpectrum2D(ctx, width, height);
    }
    return this.renderDispersionCurve2D(ctx, width, height);
  }

  private renderDispersionCurve2D(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): string {
    const padL = 48;
    const padR = 28;
    const padT = 36;
    const padB = 32;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;

    // Axes
    ctx.strokeStyle = 'rgba(165, 177, 194, 0.25)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + plotH);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();

    // Cutoff frequency horizontal line ω_max = 2ω₀
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(252, 98, 85, 0.45)';
    ctx.beginPath();
    ctx.moveTo(padL, padT + plotH * 0.12);
    ctx.lineTo(padL + plotW, padT + plotH * 0.12);
    ctx.stroke();

    // Brillouin zone boundary ka = π vertical line
    ctx.strokeStyle = 'rgba(177, 137, 223, 0.4)';
    ctx.beginPath();
    ctx.moveTo(padL + plotW, padT);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();

    // 1. Continuous limit straight line ω = v₀ k (dashed cyan)
    ctx.strokeStyle = 'rgba(88, 196, 221, 0.45)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(padL, padT + plotH);
    const maxKForLine = 2 / Math.PI;
    ctx.lineTo(padL + plotW * maxKForLine, padT + plotH * 0.12);
    ctx.stroke();
    ctx.setLineDash([]);

    const yMaxScale = plotH * 0.88;

    if (this.state.diatomicRatio > 1.05) {
      // Diatomic lattice: Acoustic & Optical branches + Band Gap
      const r = this.state.diatomicRatio; // M1 / M2 > 1
      ctx.strokeStyle = MANIM_HEX.blue;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i <= 120; i++) {
        const u = i / 120; // ka / π in [0, 1]
        const ka = u * (Math.PI / 2);
        const sum = 1 + 1 / r;
        const rad = Math.sqrt(Math.max(0, sum * sum - (4 * Math.pow(Math.sin(ka), 2)) / r));
        const wAcoustic = Math.sqrt((sum - rad) / 2);
        const sx = padL + u * plotW;
        const sy = padT + plotH - (wAcoustic / 1.45) * yMaxScale;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      // Optical branch
      ctx.strokeStyle = MANIM_HEX.purple;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i <= 120; i++) {
        const u = i / 120;
        const ka = u * (Math.PI / 2);
        const sum = 1 + 1 / r;
        const rad = Math.sqrt(Math.max(0, sum * sum - (4 * Math.pow(Math.sin(ka), 2)) / r));
        const wOptical = Math.sqrt((sum + rad) / 2);
        const sx = padL + u * plotW;
        const sy = padT + plotH - (wOptical / 1.45) * yMaxScale;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      // Band gap shaded zone
      const yGapBottom = padT + plotH - (Math.sqrt(1 / r) / 1.45) * yMaxScale;
      const yGapTop = padT + plotH - (1.0 / 1.45) * yMaxScale;
      ctx.fillStyle = 'rgba(252, 98, 85, 0.12)';
      ctx.fillRect(padL, yGapTop, plotW, yGapBottom - yGapTop);
      ctx.fillStyle = MANIM_HEX.red;
      ctx.font = '600 10.5px JetBrains Mono';
      ctx.fillText('YASAK FREKANS BANDI (Band Gap)', padL + 16, (yGapTop + yGapBottom) / 2 + 4);

      return `Diyatomik Kristal Örgü (M₁/M₂ = ${r.toFixed(1)}): Akustik Dal (Mavi) + Optik Dal (Mor) & Yasak Bant`;
    }

    // 2. Monatomic Lattice Dispersion Curve ω(k) = 2ω₀ sin(ka/2)
    ctx.strokeStyle = MANIM_HEX.yellow;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= 120; i++) {
      const u = i / 120; // ka / π from 0 to 1
      const ka = u * Math.PI;
      const wNorm = Math.sin(ka / 2); // in [0, 1] where 1 corresponds to 2ω₀
      const sx = padL + u * plotW;
      const sy = padT + plotH - wNorm * yMaxScale;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // 3. Plot the N discrete normal mode dots k_m a = mπ / (N + 1)
    const N = Math.max(2, Math.min(24, Math.round(this.state.numBeads)));
    const activeM = Math.max(1, Math.min(N, Math.round(this.state.modeN)));

    for (let m = 1; m <= N; m++) {
      const u = m / (N + 1);
      const ka = u * Math.PI;
      const wNorm = Math.sin(ka / 2);
      const sx = padL + u * plotW;
      const sy = padT + plotH - wNorm * yMaxScale;

      ctx.fillStyle = m === activeM ? MANIM_HEX.red : MANIM_HEX.blue;
      ctx.beginPath();
      ctx.arc(sx, sy, m === activeM ? 6 : 3.8, 0, Math.PI * 2);
      ctx.fill();

      if (m === activeM) {
        ctx.strokeStyle = MANIM_HEX.white;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }
    }

    // Labels
    ctx.fillStyle = MANIM_HEX.yellow;
    ctx.font = '600 11px JetBrains Mono';
    ctx.fillText('ω(k) = 2ω₀ sin(ka/2)', padL + plotW * 0.48, padT + plotH * 0.34);
    ctx.fillStyle = MANIM_HEX.blue;
    ctx.fillText('Sürekli Limit: ω = v₀ k', padL + 10, padT + 22);
    ctx.fillStyle = MANIM_HEX.red;
    ctx.fillText('Kesim: ω_max = 2ω₀', padL + plotW - 125, padT + plotH * 0.1);
    ctx.fillStyle = MANIM_HEX.muted;
    ctx.fillText('ka = 0', padL - 10, padT + plotH + 18);
    ctx.fillText('ka = π (λ_min = 2a)', padL + plotW - 105, padT + plotH + 18);

    const activeKa = (activeM * Math.PI) / (N + 1);
    const activeW = 2 * Math.sin(activeKa / 2);
    const vPhaseRatio = Math.sin(activeKa / 2) / (activeKa / 2);
    return `Kip m = ${activeM}/${N} | k_m a = ${(activeKa / Math.PI).toFixed(2)}π | ω_m / ω₀ = ${activeW.toFixed(3)} | Faz Hızı v_φ / v₀ = ${vPhaseRatio.toFixed(3)}`;
  }

  private renderFourierSpectrum2D(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): string {
    const padL = 44;
    const padR = 24;
    const padT = 36;
    const padB = 30;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;

    const maxBars = 9;
    const x0 = this.state.pluckPosRatio;
    const barGap = plotW / maxBars;

    // Baseline
    ctx.strokeStyle = 'rgba(165, 177, 194, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, padT + plotH);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();

    const a1Ref = Math.abs(this.computeFourierCoeffAn(1, 0.5, 1.0)) || 1;

    for (let n = 1; n <= maxBars; n++) {
      const An = this.computeFourierCoeffAn(n, x0, 1.0);
      const normMag = Math.min(1, Math.abs(An) / a1Ref);
      const barH = normMag * (plotH * 0.84);
      const bx = padL + (n - 0.8) * barGap;
      const by = padT + plotH - barH;
      const bw = barGap * 0.56;

      const isIncluded = n <= this.state.fourierMaxN;
      ctx.fillStyle =
        normMag < 0.005
          ? 'rgba(252, 98, 85, 0.35)'
          : isIncluded
          ? MANIM_HEX.blue
          : 'rgba(108, 122, 137, 0.3)';
      ctx.fillRect(bx, by, bw, Math.max(2, barH));

      // Label n
      ctx.fillStyle = normMag < 0.005 ? MANIM_HEX.red : MANIM_HEX.white;
      ctx.font = '600 10.5px JetBrains Mono';
      ctx.fillText(`n=${n}`, bx + 2, padT + plotH + 16);

      // Value label on top
      ctx.fillStyle = normMag < 0.005 ? MANIM_HEX.red : MANIM_HEX.yellow;
      ctx.font = '500 9.5px JetBrains Mono';
      ctx.fillText(
        normMag < 0.005 ? '0 (DÜĞÜM)' : An.toFixed(2),
        bx - 2,
        by - 6
      );
    }

    const a1 = this.computeFourierCoeffAn(1, x0, 1.0);
    const a2 = this.computeFourierCoeffAn(2, x0, 1.0);
    const a3 = this.computeFourierCoeffAn(3, x0, 1.0);
    return `Çekme Noktası x₀/L = ${x0.toFixed(2)} | A₁ = ${a1.toFixed(3)}, A₂ = ${a2.toFixed(3)}, A₃ = ${a3.toFixed(3)} | Aktif Harmonik: N = ${this.state.fourierMaxN}`;
  }
}

