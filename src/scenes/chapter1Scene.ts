import * as THREE from 'three';
import {
  MANIM_COLORS,
  MANIM_HEX,
  ManimArrow3D,
  buildHelicalSpringPoints,
  createManimGlowTubeMaterial,
  createManimVectorArrow
} from './shaders/manimGlowShaders';

export interface Chapter1State {
  modeId: string;
  abstractTab: string;
  omega0: number;
  amplitude: number;
  anharmonicAlpha: number;
  dampingGamma: number;
  tensionRatio: number;
  freqRatio: number;
  phaseDiff: number;
  couplingKc: number;
  modeSelect: number; // 0: mixed (beats), 1: symmetric mode 1, 2: antisymmetric mode 2
  time: number;
  // RK4 state for general oscillator
  rkX: number;
  rkV: number;
  phaseTrail: { x: number; v: number }[];
  lissajousTrail: { x: number; y: number }[];
}

export class Chapter1SceneController {
  public rootGroup: THREE.Group;
  public state: Chapter1State;

  // Sub-groups for 3D modes
  private shmGroup: THREE.Group;
  private transverseGroup: THREE.Group;
  private lissajousGroup: THREE.Group;
  private coupledGroup: THREE.Group;
  private beatsGroup: THREE.Group;

  // Dynamic meshes
  private shmMass!: THREE.Mesh;
  private shmSpringLine!: THREE.Line;
  private shmPhasorTip!: THREE.Mesh;
  private shmPhasorRod!: THREE.Line;
  private shmHelixLine!: THREE.Line;
  private posArrow!: ManimArrow3D;
  private velArrow!: ManimArrow3D;
  private forceArrow!: ManimArrow3D;

  // Transverse mode meshes
  private transMass!: THREE.Mesh;
  private transLeftSpring!: THREE.Line;
  private transRightSpring!: THREE.Line;
  private transForceArrow!: ManimArrow3D;

  // Lissajous 3D meshes
  private lissMass!: THREE.Mesh;
  private lissTrailLine!: THREE.Line;

  // Coupled 2-mass 3-spring meshes
  private coupledMassA!: THREE.Mesh;
  private coupledMassB!: THREE.Mesh;
  private coupledSpringL!: THREE.Line;
  private coupledSpringM!: THREE.Line;
  private coupledSpringR!: THREE.Line;
  private coupledNodeMarker!: THREE.Mesh;
  private coupledArrowA!: ManimArrow3D;
  private coupledArrowB!: ManimArrow3D;

  // Beats coupled pendulums
  private pendRodA!: THREE.Line;
  private pendRodB!: THREE.Line;
  private pendBobA!: THREE.Mesh;
  private pendBobB!: THREE.Mesh;
  private pendSpring!: THREE.Line;
  private energyTubeMesh!: THREE.Mesh;
  private energyTubeMat!: THREE.ShaderMaterial;

  constructor() {
    this.rootGroup = new THREE.Group();
    this.shmGroup = new THREE.Group();
    this.transverseGroup = new THREE.Group();
    this.lissajousGroup = new THREE.Group();
    this.coupledGroup = new THREE.Group();
    this.beatsGroup = new THREE.Group();

    this.rootGroup.add(
      this.shmGroup,
      this.transverseGroup,
      this.lissajousGroup,
      this.coupledGroup,
      this.beatsGroup
    );

    this.state = {
      modeId: 'shm-phasor',
      abstractTab: 'phase',
      omega0: 2.2,
      amplitude: 1.25,
      anharmonicAlpha: 0.0,
      dampingGamma: 0.0,
      tensionRatio: 1.0,
      freqRatio: 1.0,
      phaseDiff: 1.57,
      couplingKc: 0.5,
      modeSelect: 0,
      time: 0,
      rkX: 1.25,
      rkV: 0,
      phaseTrail: [],
      lissajousTrail: []
    };

    this.buildSHMScene();
    this.buildTransverseScene();
    this.buildLissajousScene();
    this.buildCoupledScene();
    this.buildBeatsScene();
    this.updateVisibility();
  }

  public resetSimulation() {
    this.state.time = 0;
    this.state.rkX = this.state.amplitude;
    this.state.rkV = 0;
    this.state.phaseTrail = [];
    this.state.lissajousTrail = [];
  }

  public applyDirective(
    modeId: string,
    abstractTab: string,
    presetParams: Record<string, number>
  ) {
    const modeChanged = this.state.modeId !== modeId;
    this.state.modeId = modeId;
    this.state.abstractTab = abstractTab;

    if (presetParams.omega0 !== undefined) this.state.omega0 = presetParams.omega0;
    if (presetParams.amplitude !== undefined) this.state.amplitude = presetParams.amplitude;
    if (presetParams.anharmonicAlpha !== undefined) this.state.anharmonicAlpha = presetParams.anharmonicAlpha;
    if (presetParams.dampingGamma !== undefined) this.state.dampingGamma = presetParams.dampingGamma;
    if (presetParams.tensionRatio !== undefined) this.state.tensionRatio = presetParams.tensionRatio;
    if (presetParams.freqRatio !== undefined) this.state.freqRatio = presetParams.freqRatio;
    if (presetParams.phaseDiff !== undefined) this.state.phaseDiff = presetParams.phaseDiff;
    if (presetParams.couplingKc !== undefined) this.state.couplingKc = presetParams.couplingKc;
    if (presetParams.modeSelect !== undefined) this.state.modeSelect = presetParams.modeSelect;

    if (modeChanged) {
      this.resetSimulation();
    } else {
      this.state.rkX = this.state.amplitude;
      this.state.rkV = 0;
      this.state.phaseTrail = [];
    }
    this.updateVisibility();
  }

  public updateVisibility() {
    this.shmGroup.visible = this.state.modeId === 'shm-phasor';
    this.transverseGroup.visible = this.state.modeId === 'transverse-force';
    this.lissajousGroup.visible = this.state.modeId === 'lissajous-2d';
    this.coupledGroup.visible = this.state.modeId === 'coupled-modes';
    this.beatsGroup.visible = this.state.modeId === 'beats-energy';
  }

  private buildSHMScene() {
    // Anchor wall on left
    const wallGeo = new THREE.BoxGeometry(0.12, 1.4, 1.2);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(-2.8, 0, 0);
    this.shmGroup.add(wall);

    // Equilibrium dashed vertical line
    const eqGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -1.3, 0),
      new THREE.Vector3(0, 1.5, 0)
    ]);
    const eqLine = new THREE.Line(
      eqGeo,
      new THREE.LineBasicMaterial({ color: 0x475569 })
    );
    this.shmGroup.add(eqLine);

    // Mass sphere/block
    const massGeo = new THREE.SphereGeometry(0.32, 32, 32);
    const massMat = new THREE.MeshStandardMaterial({
      color: MANIM_COLORS.blue,
      emissive: MANIM_COLORS.blue,
      emissiveIntensity: 0.35,
      roughness: 0.25
    });
    this.shmMass = new THREE.Mesh(massGeo, massMat);
    this.shmGroup.add(this.shmMass);

    // Helical spring line
    const springGeo = new THREE.BufferGeometry();
    this.shmSpringLine = new THREE.Line(
      springGeo,
      new THREE.LineBasicMaterial({ color: MANIM_COLORS.white })
    );
    this.shmGroup.add(this.shmSpringLine);

    // Upper rotating 3D Phasor circle & helix
    const circlePts: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      circlePts.push(new THREE.Vector3(Math.cos(a), 1.15, Math.sin(a) * 0.65));
    }
    const circleLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(circlePts),
      new THREE.LineBasicMaterial({ color: 0x334155 })
    );
    this.shmGroup.add(circleLine);

    this.shmPhasorTip = new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 20, 20),
      new THREE.MeshBasicMaterial({ color: MANIM_COLORS.yellow })
    );
    this.shmGroup.add(this.shmPhasorTip);

    this.shmPhasorRod = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: MANIM_COLORS.yellow })
    );
    this.shmGroup.add(this.shmPhasorRod);

    this.shmHelixLine = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: MANIM_COLORS.purple })
    );
    this.shmGroup.add(this.shmHelixLine);

    // Vector arrows on mass
    this.posArrow = createManimVectorArrow(MANIM_COLORS.blue, 0.028);
    this.velArrow = createManimVectorArrow(MANIM_COLORS.green, 0.028);
    this.forceArrow = createManimVectorArrow(MANIM_COLORS.red, 0.032);
    this.shmGroup.add(this.posArrow.group, this.velArrow.group, this.forceArrow.group);
  }

  private buildTransverseScene() {
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.6, 0.8), wallMat);
    leftWall.position.set(-2.6, 0, 0);
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.6, 0.8), wallMat);
    rightWall.position.set(2.6, 0, 0);
    this.transverseGroup.add(leftWall, rightWall);

    this.transMass = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 32, 32),
      new THREE.MeshStandardMaterial({
        color: MANIM_COLORS.blue,
        emissive: MANIM_COLORS.blue,
        emissiveIntensity: 0.35
      })
    );
    this.transverseGroup.add(this.transMass);

    this.transLeftSpring = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: MANIM_COLORS.yellow })
    );
    this.transRightSpring = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: MANIM_COLORS.yellow })
    );
    this.transForceArrow = createManimVectorArrow(MANIM_COLORS.red, 0.035);
    this.transverseGroup.add(
      this.transLeftSpring,
      this.transRightSpring,
      this.transForceArrow.group
    );
  }

  private buildLissajousScene() {
    // Frame ring
    const framePts: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      framePts.push(new THREE.Vector3(Math.cos(a) * 1.85, Math.sin(a) * 1.85, 0));
    }
    const frameLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(framePts),
      new THREE.LineBasicMaterial({ color: 0x283548 })
    );
    this.lissajousGroup.add(frameLine);

    this.lissMass = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 24, 24),
      new THREE.MeshBasicMaterial({ color: MANIM_COLORS.yellow })
    );
    this.lissTrailLine = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: MANIM_COLORS.blue })
    );
    this.lissajousGroup.add(this.lissMass, this.lissTrailLine);
  }

  private buildCoupledScene() {
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.3, 0.9), wallMat);
    leftWall.position.set(-3.1, 0, 0);
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.3, 0.9), wallMat);
    rightWall.position.set(3.1, 0, 0);
    this.coupledGroup.add(leftWall, rightWall);

    this.coupledMassA = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 28, 28),
      new THREE.MeshStandardMaterial({
        color: MANIM_COLORS.blue,
        emissive: MANIM_COLORS.blue,
        emissiveIntensity: 0.35
      })
    );
    this.coupledMassB = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 28, 28),
      new THREE.MeshStandardMaterial({
        color: MANIM_COLORS.green,
        emissive: MANIM_COLORS.green,
        emissiveIntensity: 0.35
      })
    );

    this.coupledSpringL = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: MANIM_COLORS.white })
    );
    this.coupledSpringM = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: MANIM_COLORS.purple })
    );
    this.coupledSpringR = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: MANIM_COLORS.white })
    );

    // Center node indicator for antisymmetric mode
    this.coupledNodeMarker = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 16, 16),
      new THREE.MeshBasicMaterial({ color: MANIM_COLORS.red })
    );

    this.coupledArrowA = createManimVectorArrow(MANIM_COLORS.yellow, 0.03);
    this.coupledArrowB = createManimVectorArrow(MANIM_COLORS.yellow, 0.03);

    this.coupledGroup.add(
      this.coupledMassA,
      this.coupledMassB,
      this.coupledSpringL,
      this.coupledSpringM,
      this.coupledSpringR,
      this.coupledNodeMarker,
      this.coupledArrowA.group,
      this.coupledArrowB.group
    );
  }

  private buildBeatsScene() {
    // Top support bar
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.1, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x334155 })
    );
    bar.position.set(0, 1.35, 0);
    this.beatsGroup.add(bar);

    this.pendRodA = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: MANIM_COLORS.white })
    );
    this.pendRodB = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: MANIM_COLORS.white })
    );
    this.pendBobA = new THREE.Mesh(
      new THREE.SphereGeometry(0.26, 28, 28),
      new THREE.MeshStandardMaterial({
        color: MANIM_COLORS.blue,
        emissive: MANIM_COLORS.blue,
        emissiveIntensity: 0.4
      })
    );
    this.pendBobB = new THREE.Mesh(
      new THREE.SphereGeometry(0.26, 28, 28),
      new THREE.MeshStandardMaterial({
        color: MANIM_COLORS.green,
        emissive: MANIM_COLORS.green,
        emissiveIntensity: 0.4
      })
    );
    this.pendSpring = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: MANIM_COLORS.purple })
    );

    // Glowing energy flow tube between pendulums
    this.energyTubeMat = createManimGlowTubeMaterial(MANIM_COLORS.yellow, 1);
    const dummyCurve = new THREE.LineCurve3(
      new THREE.Vector3(-1.2, 0.2, 0),
      new THREE.Vector3(1.2, 0.2, 0)
    );
    this.energyTubeMesh = new THREE.Mesh(
      new THREE.TubeGeometry(dummyCurve, 24, 0.04, 12, false),
      this.energyTubeMat
    );

    this.beatsGroup.add(
      this.pendRodA,
      this.pendRodB,
      this.pendBobA,
      this.pendBobB,
      this.pendSpring,
      this.energyTubeMesh
    );
  }

  public step(dt: number) {
    this.state.time += dt;
    const t = this.state.time;
    const w0 = this.state.omega0;
    const A = this.state.amplitude;

    // Step RK4 for SHM / Anharmonic / Damped oscillator
    const subSteps = 4;
    const h = dt / subSteps;
    const accel = (x: number, v: number) =>
      -w0 * w0 * x -
      this.state.anharmonicAlpha * w0 * w0 * x * x * x -
      this.state.dampingGamma * v;

    for (let i = 0; i < subSteps; i++) {
      const x = this.state.rkX;
      const v = this.state.rkV;
      const k1x = v;
      const k1v = accel(x, v);
      const k2x = v + 0.5 * h * k1v;
      const k2v = accel(x + 0.5 * h * k1x, v + 0.5 * h * k1v);
      const k3x = v + 0.5 * h * k2v;
      const k3v = accel(x + 0.5 * h * k2x, v + 0.5 * h * k2v);
      const k4x = v + h * k3v;
      const k4v = accel(x + h * k3x, v + h * k3v);

      this.state.rkX += (h / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
      this.state.rkV += (h / 6) * (k1v + 2 * k2v + 2 * k3v + k4v);
    }

    this.state.phaseTrail.push({
      x: this.state.rkX,
      v: this.state.rkV / Math.max(0.5, w0)
    });
    if (this.state.phaseTrail.length > 260) {
      this.state.phaseTrail.shift();
    }

    // Update active 3D scene
    if (this.state.modeId === 'shm-phasor') {
      const x = this.state.rkX;
      const v = this.state.rkV;
      const a = accel(x, v);

      this.shmMass.position.set(x, 0, 0);
      const springPts = buildHelicalSpringPoints(
        new THREE.Vector3(-2.74, 0, 0),
        new THREE.Vector3(x - 0.3, 0, 0),
        11,
        0.15
      );
      this.shmSpringLine.geometry.setFromPoints(springPts);

      // Phasor on upper plane
      const phi = w0 * t;
      const px = A * Math.cos(phi);
      const pz = A * Math.sin(phi) * 0.55;
      this.shmPhasorTip.position.set(px, 1.15, pz);
      this.shmPhasorRod.geometry.setFromPoints([
        new THREE.Vector3(0, 1.15, 0),
        new THREE.Vector3(px, 1.15, pz),
        new THREE.Vector3(x, 0, 0)
      ]);

      // Position, velocity, force vectors
      this.posArrow.setVector(
        new THREE.Vector3(0, -0.52, 0),
        new THREE.Vector3(Math.sign(x) || 1, 0, 0),
        Math.abs(x)
      );
      this.velArrow.setVector(
        new THREE.Vector3(x, 0.42, 0),
        new THREE.Vector3(Math.sign(v) || 1, 0, 0),
        Math.abs(v) * 0.35
      );
      this.forceArrow.setVector(
        new THREE.Vector3(x, -0.42, 0),
        new THREE.Vector3(Math.sign(a) || 1, 0, 0),
        Math.abs(a) * 0.16
      );
    } else if (this.state.modeId === 'transverse-force') {
      const y = A * 0.85 * Math.cos(w0 * t);
      this.transMass.position.set(0, y, 0);

      const leftPts = buildHelicalSpringPoints(
        new THREE.Vector3(-2.53, 0, 0),
        new THREE.Vector3(-0.26, y, 0),
        9,
        0.13
      );
      const rightPts = buildHelicalSpringPoints(
        new THREE.Vector3(0.26, y, 0),
        new THREE.Vector3(2.53, 0, 0),
        9,
        0.13
      );
      this.transLeftSpring.geometry.setFromPoints(leftPts);
      this.transRightSpring.geometry.setFromPoints(rightPts);

      const fy = -2 * this.state.tensionRatio * y;
      this.transForceArrow.setVector(
        new THREE.Vector3(0, y, 0),
        new THREE.Vector3(0, Math.sign(fy) || -1, 0),
        Math.abs(fy) * 0.65
      );
    } else if (this.state.modeId === 'lissajous-2d') {
      const lx = A * 1.15 * Math.cos(w0 * t);
      const ly = A * 1.15 * Math.cos(w0 * this.state.freqRatio * t + this.state.phaseDiff);
      this.lissMass.position.set(lx, ly, 0);

      this.state.lissajousTrail.push({ x: lx, y: ly });
      if (this.state.lissajousTrail.length > 320) {
        this.state.lissajousTrail.shift();
      }
      this.lissTrailLine.geometry.setFromPoints(
        this.state.lissajousTrail.map((p) => new THREE.Vector3(p.x, p.y, 0))
      );
    } else if (this.state.modeId === 'coupled-modes') {
      const w1 = w0;
      const w2 = w0 * Math.sqrt(1 + 2 * this.state.couplingKc);
      let xa = 0;
      let xb = 0;
      if (this.state.modeSelect === 1) {
        xa = 0.75 * Math.cos(w1 * t);
        xb = 0.75 * Math.cos(w1 * t);
      } else if (this.state.modeSelect === 2) {
        xa = 0.75 * Math.cos(w2 * t);
        xb = -0.75 * Math.cos(w2 * t);
      } else {
        xa = 0.42 * (Math.cos(w1 * t) + Math.cos(w2 * t));
        xb = 0.42 * (Math.cos(w1 * t) - Math.cos(w2 * t));
      }

      const posA = -1.15 + xa;
      const posB = 1.15 + xb;
      this.coupledMassA.position.set(posA, 0, 0);
      this.coupledMassB.position.set(posB, 0, 0);
      this.coupledNodeMarker.position.set(0.5 * (xa + xb), 0, 0);

      this.coupledSpringL.geometry.setFromPoints(
        buildHelicalSpringPoints(
          new THREE.Vector3(-3.0, 0, 0),
          new THREE.Vector3(posA - 0.28, 0, 0),
          8,
          0.13
        )
      );
      this.coupledSpringM.geometry.setFromPoints(
        buildHelicalSpringPoints(
          new THREE.Vector3(posA + 0.28, 0, 0),
          new THREE.Vector3(posB - 0.28, 0, 0),
          9,
          0.14
        )
      );
      this.coupledSpringR.geometry.setFromPoints(
        buildHelicalSpringPoints(
          new THREE.Vector3(posB + 0.28, 0, 0),
          new THREE.Vector3(3.0, 0, 0),
          8,
          0.13
        )
      );

      this.coupledArrowA.setVector(
        new THREE.Vector3(-1.15, 0.48, 0),
        new THREE.Vector3(Math.sign(xa) || 1, 0, 0),
        Math.abs(xa) * 1.1
      );
      this.coupledArrowB.setVector(
        new THREE.Vector3(1.15, 0.48, 0),
        new THREE.Vector3(Math.sign(xb) || 1, 0, 0),
        Math.abs(xb) * 1.1
      );
    } else if (this.state.modeId === 'beats-energy') {
      const w1 = w0;
      const w2 = w0 * Math.sqrt(1 + 2 * this.state.couplingKc);
      const wAvg = 0.5 * (w1 + w2);
      const wMod = 0.5 * (w2 - w1);

      const xa = 0.72 * Math.cos(wMod * t) * Math.cos(wAvg * t);
      const xb = 0.72 * Math.sin(wMod * t) * Math.sin(wAvg * t);

      const pivotA = new THREE.Vector3(-1.25, 1.32, 0);
      const pivotB = new THREE.Vector3(1.25, 1.32, 0);
      const bobPosA = new THREE.Vector3(-1.25 + xa, -0.55 + 0.12 * xa * xa, 0);
      const bobPosB = new THREE.Vector3(1.25 + xb, -0.55 + 0.12 * xb * xb, 0);

      this.pendBobA.position.copy(bobPosA);
      this.pendBobB.position.copy(bobPosB);
      this.pendRodA.geometry.setFromPoints([pivotA, bobPosA]);
      this.pendRodB.geometry.setFromPoints([pivotB, bobPosB]);

      const midA = new THREE.Vector3().lerpVectors(pivotA, bobPosA, 0.55);
      const midB = new THREE.Vector3().lerpVectors(pivotB, bobPosB, 0.55);
      this.pendSpring.geometry.setFromPoints(buildHelicalSpringPoints(midA, midB, 10, 0.09));

      this.energyTubeMat.uniforms.uTime.value = t;
      this.energyTubeMat.uniforms.uIntensity.value =
        0.5 + 1.2 * Math.abs(Math.sin(2 * wMod * t));
    }
  }

  public renderAbstract2D(ctx: CanvasRenderingContext2D, width: number, height: number): string {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#06080d';
    ctx.fillRect(0, 0, width, height);

    const tab = this.state.abstractTab;
    const t = this.state.time;
    const w0 = this.state.omega0;
    const A = this.state.amplitude;

    if (tab === 'phase' || tab === 'phasor') {
      const cx = width * 0.5;
      const cy = height * 0.53;
      const scale = Math.min(width, height) * 0.28;

      // Grid axes
      ctx.strokeStyle = 'rgba(165, 177, 194, 0.16)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(20, cy);
      ctx.lineTo(width - 20, cy);
      ctx.moveTo(cx, 24);
      ctx.lineTo(cx, height - 16);
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = MANIM_HEX.blue;
      ctx.font = '600 11px JetBrains Mono';
      ctx.fillText(tab === 'phasor' ? 'Re[z] = x(t)' : 'Konum x', width - 92, cy - 6);
      ctx.fillStyle = MANIM_HEX.green;
      ctx.fillText(tab === 'phasor' ? 'Im[z]' : 'Hız v / ω₀', cx + 8, 36);

      if (tab === 'phase') {
        // Draw phase trajectory trail
        if (this.state.phaseTrail.length > 1) {
          ctx.strokeStyle = MANIM_HEX.blue;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          this.state.phaseTrail.forEach((pt, idx) => {
            const px = cx + pt.x * scale;
            const py = cy - pt.v * scale;
            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.stroke();
        }

        const curX = cx + this.state.rkX * scale;
        const curY = cy - (this.state.rkV / Math.max(0.5, w0)) * scale;
        ctx.fillStyle = MANIM_HEX.yellow;
        ctx.beginPath();
        ctx.arc(curX, curY, 5.5, 0, Math.PI * 2);
        ctx.fill();

        const E = 0.5 * w0 * w0 * this.state.rkX * this.state.rkX + 0.5 * this.state.rkV * this.state.rkV;
        return `x(t) = ${this.state.rkX.toFixed(2)} m | v(t) = ${this.state.rkV.toFixed(2)} m/s | E_mek = ${E.toFixed(2)} J`;
      } else {
        // Phasor circle and 90-degree phase vectors
        const r = A * scale * 0.85;
        ctx.strokeStyle = 'rgba(88, 196, 221, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        const phi = w0 * t;
        const zx = cx + r * Math.cos(phi);
        const zy = cy - r * Math.sin(phi);

        // Position phasor (Blue)
        ctx.strokeStyle = MANIM_HEX.blue;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(zx, zy);
        ctx.stroke();

        // Projection dashed line to real axis
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = MANIM_HEX.yellow;
        ctx.beginPath();
        ctx.moveTo(zx, zy);
        ctx.lineTo(zx, cy);
        ctx.stroke();
        ctx.setLineDash([]);

        // Velocity phasor 90 deg ahead (Green)
        const vx = cx + r * 0.75 * Math.cos(phi + Math.PI / 2);
        const vy = cy - r * 0.75 * Math.sin(phi + Math.PI / 2);
        ctx.strokeStyle = MANIM_HEX.green;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(vx, vy);
        ctx.stroke();

        return `Faz Açısı φ(t) = ${((phi * 180) / Math.PI % 360).toFixed(0)}° | Re[z] = ${(A * Math.cos(phi)).toFixed(2)} | Hız Fazörü +90° İleride`;
      }
    }

    if (tab === 'potential') {
      const cx = width * 0.5;
      const baseY = height * 0.82;
      const scaleX = width * 0.22;
      const scaleY = height * 0.48;

      // Parabolic Taylor well vs exact transverse potential
      ctx.strokeStyle = MANIM_HEX.blue;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let px = -1.5; px <= 1.5; px += 0.04) {
        const uTaylor = 0.5 * this.state.tensionRatio * px * px;
        const sx = cx + px * scaleX;
        const sy = baseY - uTaylor * scaleY;
        if (px === -1.5) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      // Current particle position on well
      const curY = A * 0.85 * Math.cos(w0 * t);
      const uCur = 0.5 * this.state.tensionRatio * curY * curY;
      ctx.fillStyle = MANIM_HEX.yellow;
      ctx.beginPath();
      ctx.arc(cx + curY * scaleX, baseY - uCur * scaleY, 6, 0, Math.PI * 2);
      ctx.fill();

      return `Taylor Parabolik Çukur V(y) ≈ ½ k_eff y² | Ön-Gerilim Oranı T₀/ka = ${this.state.tensionRatio.toFixed(2)}`;
    }

    if (tab === 'lissajous') {
      const cx = width * 0.5;
      const cy = height * 0.52;
      const scale = Math.min(width, height) * 0.34;

      ctx.strokeStyle = MANIM_HEX.blue;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let s = 0; s <= 240; s++) {
        const tau = (s / 240) * Math.PI * 4;
        const x = Math.cos(tau);
        const y = Math.cos(this.state.freqRatio * tau + this.state.phaseDiff);
        const px = cx + x * scale;
        const py = cy - y * scale;
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      return `Frekans Oranı ω_y / ω_x = ${this.state.freqRatio.toFixed(2)} | Faz Farkı Δφ = ${((this.state.phaseDiff * 180) / Math.PI).toFixed(0)}°`;
    }

    if (tab === 'normal-coords') {
      const w1 = w0;
      const w2 = w0 * Math.sqrt(1 + 2 * this.state.couplingKc);
      const midY1 = height * 0.34;
      const midY2 = height * 0.74;

      // Draw q1(t) = xa + xb and q2(t) = xa - xb time traces
      ctx.strokeStyle = MANIM_HEX.blue;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < width - 40; i++) {
        const tau = t - (width - 40 - i) * 0.025;
        const q1 =
          this.state.modeSelect === 2 ? 0 : Math.cos(w1 * tau) * (height * 0.16);
        const py = midY1 - q1;
        if (i === 0) ctx.moveTo(20 + i, py);
        else ctx.lineTo(20 + i, py);
      }
      ctx.stroke();

      ctx.strokeStyle = MANIM_HEX.yellow;
      ctx.beginPath();
      for (let i = 0; i < width - 40; i++) {
        const tau = t - (width - 40 - i) * 0.025;
        const q2 =
          this.state.modeSelect === 1 ? 0 : Math.cos(w2 * tau) * (height * 0.16);
        const py = midY2 - q2;
        if (i === 0) ctx.moveTo(20 + i, py);
        else ctx.lineTo(20 + i, py);
      }
      ctx.stroke();

      ctx.fillStyle = MANIM_HEX.blue;
      ctx.font = '600 11px JetBrains Mono';
      ctx.fillText(`q₁(t) = x_a + x_b (Simetrik Kip · ω₁ = ${w1.toFixed(2)} rad/s)`, 24, midY1 - height * 0.18);
      ctx.fillStyle = MANIM_HEX.yellow;
      ctx.fillText(`q₂(t) = x_a - x_b (Antisimetrik Kip · ω₂ = ${w2.toFixed(2)} rad/s)`, 24, midY2 - height * 0.18);

      return `Normal Koordinatlar Ayrışmış: ω₁ = ${w1.toFixed(2)} rad/s | ω₂ = ${w2.toFixed(2)} rad/s | Oran ω₂/ω₁ = ${(w2 / w1).toFixed(2)}`;
    }

    // Default: 'energy-beats'
    const w1 = w0;
    const w2 = w0 * Math.sqrt(1 + 2 * this.state.couplingKc);
    const wMod = 0.5 * (w2 - w1);
    const baseY = height * 0.84;
    const hScale = height * 0.58;

    // Draw E_a(t) = cos²(wMod t) and E_b(t) = sin²(wMod t)
    ctx.strokeStyle = MANIM_HEX.blue;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i < width - 40; i++) {
      const tau = t - (width - 40 - i) * 0.04;
      const ea = Math.pow(Math.cos(wMod * tau), 2);
      const py = baseY - ea * hScale;
      if (i === 0) ctx.moveTo(20 + i, py);
      else ctx.lineTo(20 + i, py);
    }
    ctx.stroke();

    ctx.strokeStyle = MANIM_HEX.green;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i < width - 40; i++) {
      const tau = t - (width - 40 - i) * 0.04;
      const eb = Math.pow(Math.sin(wMod * tau), 2);
      const py = baseY - eb * hScale;
      if (i === 0) ctx.moveTo(20 + i, py);
      else ctx.lineTo(20 + i, py);
    }
    ctx.stroke();

    // Total energy constant line E_a + E_b = E_0
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = MANIM_HEX.yellow;
    ctx.beginPath();
    ctx.moveTo(20, baseY - hScale);
    ctx.lineTo(width - 20, baseY - hScale);
    ctx.stroke();
    ctx.setLineDash([]);

    const curEa = Math.pow(Math.cos(wMod * t), 2) * 100;
    const curEb = Math.pow(Math.sin(wMod * t), 2) * 100;
    return `Enerji Takası: E_a(t) = %${curEa.toFixed(0)} (Mavi) | E_b(t) = %${curEb.toFixed(0)} (Yeşil) | E_a + E_b = %100 (Korunumlu)`;
  }
}

