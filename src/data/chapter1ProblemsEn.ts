import { ProofCoachProblem } from '../types/curriculum';

interface RawProblemSeedEn {
  num: string;
  title: string;
  page: string;
  home: boolean;
  diff: 'Temel Türetim' | 'Vize Klasik' | 'İleri Sentez' | 'Basic Derivation' | 'Midterm Classic' | 'Advanced Synthesis';
  tags: string[];
  statement: string;
  givenLatex: string;
  targetLatex: string;
  principle: string;
  startQ: string;
  optCorrect: string;
  optWrong1: string;
  optWrong2: string;
  steps: { title: string; hint: string; text: string; math: string; trick?: string }[];
  sceneMode: string;
  abstractTab: string;
  presetParams: Record<string, number>;
  observe: string;
  finalBoxed: string;
  check: string;
}

const CH1_SEEDS_EN: RawProblemSeedEn[] = [
  {
    num: '1.1',
    title: 'Normal Modes in Coupled LC Circuits',
    page: 'Page 27',
    home: false,
    diff: 'Midterm Classic',
    tags: ['LC Circuit', 'Normal Modes', 'Electromechanical Analogy'],
    statement: 'Two identical inductors L = 10 H and three identical capacitors C = 6 μF form a symmetric coupled LC network. Derive the two normal mode frequencies (nu_1, nu_2) and show that their ratio is sqrt(3).',
    givenLatex: 'L = 10\\text{ H}, \\quad C = C_{12} = 6\\times 10^{-6}\\text{ F}',
    targetLatex: '\\nu_1 = \\frac{1}{2\\pi\\sqrt{LC}}, \\quad \\nu_2 = \\frac{\\sqrt{3}}{2\\pi\\sqrt{LC}}',
    principle: 'Kirchhoff Voltage Law (KVL) and electromechanical duality (m <-> L, k <-> 1/C).',
    startQ: 'What is the system of coupled second-order differential equations for loop charges Q_a and Q_b?',
    optCorrect: 'L\\ddot{Q}_a + \\frac{1}{C}Q_a + \\frac{1}{C}(Q_a - Q_b) = 0',
    optWrong1: 'L\\ddot{Q}_a + C Q_a + C(Q_a - Q_b) = 0',
    optWrong2: 'L\\dot{Q}_a + \\frac{1}{C}(Q_a + Q_b) = 0',
    steps: [
      {
        title: 'Symmetric Mode (Q_a = Q_b) Frequency',
        hint: 'When Q_a = Q_b, no net current flows through the central coupling capacitor.',
        text: 'Adding the two loop equations decouples the symmetric coordinate q_1 = Q_a + Q_b as the coupling term drops out:',
        math: 'L\\ddot{q}_1 + \\frac{1}{C}q_1 = 0 \\implies \\omega_1 = \\frac{1}{\\sqrt{LC}} \\approx 129.1\\text{ rad/s} \\implies \\nu_1 \\approx 20.55\\text{ Hz}',
        trick: 'trick-determinant'
      },
      {
        title: 'Antisymmetric Mode (Q_a = -Q_b) Frequency',
        hint: 'When Q_a = -Q_b, the central capacitor experiences double charge 2Q_a.',
        text: 'Subtracting the two equations decouples the antisymmetric coordinate q_2 = Q_a - Q_b, with effective elastance 3/C:',
        math: 'L\\ddot{q}_2 + \\frac{3}{C}q_2 = 0 \\implies \\omega_2 = \\sqrt{\\frac{3}{LC}} = \\sqrt{3}\\omega_1 \\implies \\nu_2 \\approx 35.6\\text{ Hz}',
        trick: 'trick-determinant'
      }
    ],
    sceneMode: 'coupled-modes',
    abstractTab: 'normal-coords',
    presetParams: { modeSelect: 2, couplingKc: 1.0 },
    observe: 'Observe the frequency ratio sqrt(3) approx 1.732 between Mode 1 and Mode 2, and the doubled potential across the central element in Mode 2.',
    finalBoxed: '\\nu_1 \\approx 20.5\\text{ Hz}, \\qquad \\nu_2 = \\sqrt{3}\\nu_1 \\approx 35.6\\text{ Hz}',
    check: '[1/sqrt(LC)] = s^-1. In the limit C_12 -> infinity (short circuit), the coupling disappears and modes decouple.'
  },
  {
    num: '1.2',
    title: 'Turntable and Pendulum: Projection of Circular Motion',
    page: 'Page 27',
    home: true,
    diff: 'Basic Derivation',
    tags: ['Phasor Projection', 'Simple Pendulum', 'Home Experiment'],
    statement: 'Show that the side view (orthogonal projection) of an object at the edge of a turntable rotating at 45 rpm executes simple harmonic motion (SHM), and determine the exact length L of a simple pendulum that oscillates synchronously with it (g = 980 cm/s^2).',
    givenLatex: '\\text{RPM} = 45\\text{ rev/min}, \\quad g = 980\\text{ cm/s}^2',
    targetLatex: 'x(t) = R\\cos(\\omega t), \\quad L = \\frac{g}{\\omega^2} \\approx 44.1\\text{ cm}',
    principle: 'The orthogonal projection of uniform circular motion onto a single Cartesian axis is simple harmonic motion.',
    startQ: 'What is the angular frequency omega in rad/s corresponding to 45 rpm, and what is the pendulum synchronicity condition?',
    optCorrect: '\\omega = 45 \\times \\frac{2\\pi}{60} = 1.5\\pi\\text{ rad/s}, \\quad \\sqrt{\\frac{g}{L}} = \\omega',
    optWrong1: '\\omega = 45 \\times 2\\pi\\text{ rad/s}, \\quad \\sqrt{\\frac{L}{g}} = \\omega',
    optWrong2: '\\omega = \\frac{45}{60}\\text{ rad/s}',
    steps: [
      {
        title: 'Orthogonal Projection of Circular Phasor',
        hint: 'In the xy-plane, project the trajectory (R cos omega t, R sin omega t) onto the x-axis.',
        text: 'Viewed edge-on along the y-axis, the observer sees only the x-component x(t) = R cos(omega t), satisfying Hookes law:',
        math: '\\ddot{x}(t) = -\\omega^2 R\\cos(\\omega t) = -\\omega^2 x(t)',
        trick: 'trick-phasor'
      },
      {
        title: 'Synchronous Pendulum Length Calculation',
        hint: 'Isolate L from omega^2 = g/L.',
        text: 'Substituting omega = 1.5pi approx 4.712 rad/s into L = g / omega^2 yields:',
        math: 'L = \\frac{g}{\\omega^2} = \\frac{980}{(1.5\\pi)^2} \\approx 44.13\\text{ cm}'
      }
    ],
    sceneMode: 'shm-phasor',
    abstractTab: 'phasor',
    presetParams: { omega0: 2.4, amplitude: 1.2 },
    observe: 'Watch the horizontal projection of the 3D rotating phasor helix track the mass-spring and pendulum displacements in exact synchrony.',
    finalBoxed: 'L = \\frac{g}{(1.5\\pi)^2} \\approx 44.1\\text{ cm}',
    check: '[g/omega^2] = (cm/s^2)/(s^-2) = cm.'
  },
  {
    num: '1.3',
    title: 'Phase Difference and Energy Flow Direction in Weakly Coupled Pendulums',
    page: 'Page 27',
    home: true,
    diff: 'Midterm Classic',
    tags: ['Beats', 'Phase Difference', 'Energy Transfer'],
    statement: 'In two weakly coupled pendulums, at t = 0 pendulum A oscillates with amplitude x_0 while pendulum B is at rest. At t = T_beat / 4, both amplitudes are equal. How can one determine the direction of net energy flow solely by observing the relative phase of the two pendulums?',
    givenLatex: 'x_a(t) = x_0\\cos(\\omega_{\\text{mod}}t)\\cos(\\omega_{\\text{avg}}t), \\quad x_b(t) = x_0\\sin(\\omega_{\\text{mod}}t)\\sin(\\omega_{\\text{avg}}t)',
    targetLatex: '\\Delta\\phi = \\frac{\\pi}{2} \\implies \\text{The pendulum lagging by } 90^\\circ \\text{ phase RECEIVES energy.}',
    principle: 'Instantaneous mechanical power P = F · v: positive work is done when force and velocity share the same algebraic sign.',
    startQ: 'What is the phase relationship between the coupling force exerted by pendulum A on B and the velocity of B?',
    optCorrect: 'P_{a\\to b} = K_c x_a \\dot{x}_b > 0 \\quad (x_b \\text{ lags } x_a \\text{ by } 90^\\circ)',
    optWrong1: 'P_{a\\to b} = K_c x_a x_b',
    optWrong2: '\\text{Energy flow ceases when both amplitudes become equal.}',
    steps: [
      {
        title: 'Carrier Wave Phase Comparison',
        hint: 'Use the trigonometric identity sin(omega_avg t) = cos(omega_avg t - pi/2).',
        text: 'During the first quarter beat (0 < omega_mod t < pi/2), both envelope terms are positive. In the fast carrier oscillations, pendulum B lags pendulum A by exactly 90 degrees:',
        math: 'v_b(t) = \\dot{x}_b \\approx \\omega_{\\text{avg}} A_b \\cos(\\omega_{\\text{avg}} t) \\propto +x_a(t)',
        trick: 'trick-trig-beats'
      },
      {
        title: 'Coupling Spring Power Delivered to Pendulum B',
        hint: 'Notice that velocity v_b and position x_a oscillate in phase!',
        text: 'The driving force exerted by A on B, +K_c x_a, has the same sign as B velocity v_b; therefore cycle-averaged power flows positively from A into B:',
        math: '\\langle P_{a \\to b} \\rangle = K_c \\langle x_a \\dot{x}_b \\rangle = \\frac{1}{2} K_c \\omega_{\\text{avg}} x_0^2 \\sin(\\omega_{\\text{mod}}t)\\cos(\\omega_{\\text{mod}}t) > 0'
      }
    ],
    sceneMode: 'beats-energy',
    abstractTab: 'energy-beats',
    presetParams: { couplingKc: 0.2, omega0: 2.2 },
    observe: 'Observe that the brightness of the energy transfer tube reaches its MAXIMUM at t = T_beat / 4 when the two amplitudes are equal.',
    finalBoxed: '\\text{The } 90^\\circ \\text{ phase-leading oscillator is the DRIVER; the } 90^\\circ \\text{ lagging oscillator is the DRIVEN.}',
    check: 'After t = T_beat / 2, the envelope signs invert and phase precedence shifts to B, reversing energy flow.'
  },
  {
    num: '1.4',
    title: 'Selective Damping Design for Coupled Normal Modes',
    page: 'Page 27',
    home: false,
    diff: 'Midterm Classic',
    tags: ['Normal Modes', 'Symmetry', 'Selective Damping'],
    statement: 'In a system of two identical coupled pendulums, design mechanical damping mechanisms that: (a) damp Mode 2 rapidly while leaving Mode 1 completely unaffected, and (b) damp Mode 1 rapidly while leaving Mode 2 completely unaffected.',
    givenLatex: 'q_1 = x_a + x_b \\text{ (Mode 1)}, \\quad q_2 = x_a - x_b \\text{ (Mode 2)}',
    targetLatex: '(a)\ harvest\\; F_{\\text{damp}} \\propto (\\dot{x}_a - \\dot{x}_b) = \\dot{q}_2, \\qquad (b)\ harvest\\; F_{\\text{damp}} \\propto \\frac{\\dot{x}_a + \\dot{x}_b}{2} = \\frac{1}{2}\\dot{q}_1'.replace('harvest', ''),
    principle: 'A damper placed at a stationary nodal point of a normal mode dissipates zero energy and leaves that mode undisturbed.',
    startQ: 'Which geometric quantities identically vanish in Mode 1 and in Mode 2?',
    optCorrect: '\\text{Mode 1: } x_a - x_b = 0 \\text{ (zero relative velocity); Mode 2: } x_{\\text{mid}} = \\frac{x_a+x_b}{2} = 0 \\text{ (midpoint node)}',
    optWrong1: '\\text{The midpoint of the coupling spring remains stationary in both modes.}',
    optWrong2: '\\text{Frictional damping at the ceiling suspension damps only Mode 1.}',
    steps: [
      {
        title: 'Selectively Damping Only Mode 2',
        hint: 'Connect a viscous dashpot damper directly between mass A and mass B.',
        text: 'A damper connected between the two masses exerts a force proportional to relative velocity (x_dot_a - x_dot_b = q_dot_2). In Mode 1, x_a = x_b at all times, so the piston never moves; Mode 2 is rapidly damped:',
        math: '\\ddot{q}_1 + \\omega_1^2 q_1 = 0, \\qquad \\ddot{q}_2 + 2\\gamma\\dot{q}_2 + \\omega_2^2 q_2 = 0'
      },
      {
        title: 'Selectively Damping Only Mode 1',
        hint: 'Immerse the exact midpoint of the coupling spring (x_mid = (x_a + x_b)/2) into a viscous pot.',
        text: 'In Mode 2, the center of the coupling spring is a stationary NODE (x_mid = 0); hence a damper attached to this midpoint exerts zero force in Mode 2, damping only Mode 1:',
        math: '\\ddot{q}_1 + \\gamma_1\\dot{q}_1 + \\omega_1^2 q_1 = 0, \\qquad \\ddot{q}_2 + \\omega_2^2 q_2 = 0'
      }
    ],
    sceneMode: 'coupled-modes',
    abstractTab: 'normal-coords',
    presetParams: { modeSelect: 2, couplingKc: 0.8 },
    observe: 'Verify in the 3D scene that when Mode 2 is active, the exact center of the coupling spring remains completely motionless.',
    finalBoxed: '\\text{Mode 2 Damper: Relative dashpot between masses} \\;\\;|\\;\\; \\text{Mode 1 Damper: Midpoint node damper on coupling spring}',
    check: 'The symmetry argument holds universally for any linear symmetric coupled system.'
  },
  {
    num: '1.5',
    title: 'Acoustic Beats with Coupled Hacksaw Blades',
    page: 'Page 27',
    home: true,
    diff: 'Basic Derivation',
    tags: ['Cantilever Beam', 'Beats', 'Home Experiment'],
    statement: 'Two identical hacksaw blades clamped to a table are coupled by a rubber band stretched between them. Explain mathematically why moving the rubber band closer to the clamp (fixed base) causes the beat period to increase toward infinity.',
    givenLatex: '\\omega_2^2 - \\omega_1^2 = \\frac{2 K_{\\text{eff}}(d)}{m}',
    targetLatex: 'T_{\\text{beat}} = \\frac{2\\pi}{\\omega_2 - \\omega_1} \\approx \\frac{2\\pi m \\omega_0}{K_{\\text{eff}}(d)}',
    principle: 'Effective coupling stiffness K_eff is proportional to the square of the deflection amplitude at the attachment point d.',
    startQ: 'How does the effective coupling constant K_eff behave as the rubber band is moved toward the clamp (d -> 0)?',
    optCorrect: 'K_{\\text{eff}}(d) \\propto y^2(d) \\to 0 \\implies \\omega_2 - \\omega_1 \\to 0 \\implies T_{\\text{beat}} \\to \\infty',
    optWrong1: 'K_{\\text{eff}} \\text{ increases, causing beats to speed up.}',
    optWrong2: 'T_{\\text{beat}} \\text{ is completely independent of the position of the rubber band.}',
    steps: [
      {
        title: 'Beat Period Formula in Weak Coupling',
        hint: 'Use omega_2 - omega_1 approx omega_0 (K_eff / k).',
        text: 'As the rubber band approaches the clamped base (d -> 0), cantilever deflection amplitude y(d) -> 0; the band barely stretches, making coupling vanish:',
        math: 'd \\to 0 \\implies K_{\\text{eff}}(d) \\ll k \\implies \\Delta\\omega = \\omega_2 - \\omega_1 \\approx \\omega_0 \\frac{K_{\\text{eff}}(d)}{k} \\to 0',
        trick: 'trick-taylor'
      }
    ],
    sceneMode: 'beats-energy',
    abstractTab: 'energy-beats',
    presetParams: { couplingKc: 0.12, omega0: 2.5 },
    observe: 'Observe that as coupling parameter K_c is dialed down, the beat envelope widens dramatically (beat period T_beat extends).',
    finalBoxed: 'T_{\\text{beat}} \\propto \\frac{1}{K_{\\text{eff}}(d)} \\quad (d \\to 0 \\text{ as } T_{\\text{beat}} \\to \\infty)',
    check: 'In the limit K_eff = 0, the blades are completely uncoupled and no energy transfer occurs.'
  },
  {
    num: '1.6',
    title: 'Longitudinal and Transverse Modes of Slinky-Coupled Pendulums',
    page: 'Page 27',
    home: true,
    diff: 'Midterm Classic',
    tags: ['Coupled Pendulums', 'Longitudinal vs Transverse', 'Home Experiment'],
    statement: 'Two identical pendulums of length L = 50 cm and bob mass m = 200 g are coupled by a weak Slinky spring. Derive the formula that determines the spring constant K_c of the Slinky from the measured pendulum natural frequency nu_1 and the longitudinal beat frequency nu_beat.',
    givenLatex: 'L = 0.5\\text{ m}, \\quad m = 0.2\\text{ kg}, \\quad \\omega_1 = \\sqrt{g/L}',
    targetLatex: 'K_c \\approx m \\omega_1 (\\omega_2 - \\omega_1) = 4\\pi^2 m \\nu_1 \\nu_{\\text{beat}}',
    principle: 'In weak coupling, the difference of squared frequencies relates to beat frequency by omega_2^2 - omega_1^2 approx 2 omega_1 Delta omega = 2 K_c / m.',
    startQ: 'What is the angular frequency omega_2 of the antisymmetric longitudinal normal mode?',
    optCorrect: '\\omega_2 = \\sqrt{\\frac{g}{L} + \\frac{2 K_c}{m}}',
    optWrong1: '\\omega_2 = \\sqrt{\\frac{g}{L} + \\frac{K_c}{m}}',
    optWrong2: '\\omega_2 = \\sqrt{\\frac{2 K_c}{m}}',
    steps: [
      {
        title: 'Extracting Spring Constant K_c via Frequency Difference',
        hint: 'In omega_2^2 - omega_1^2 = 2K_c / m, factor the difference of squares: (omega_2 - omega_1)(omega_2 + omega_1) approx 2 omega_1 Delta omega.',
        text: 'Factoring the difference of squares provides an exact identity without needing higher-order Taylor terms:',
        math: '\\omega_2^2 - \\omega_1^2 = (\\omega_2 - \\omega_1)(\\omega_2 + \\omega_1) \\approx \\omega_{\\text{beat}} (2\\omega_1) = \\frac{2 K_c}{m} \\implies K_c \\approx m \\omega_1 \\omega_{\\text{beat}}',
        trick: 'trick-taylor'
      }
    ],
    sceneMode: 'beats-energy',
    abstractTab: 'energy-beats',
    presetParams: { couplingKc: 0.22, omega0: 2.1 },
    observe: 'Notice how measuring the slow beat period enables extremely sensitive measurement of the minute spring constant of a delicate Slinky.',
    finalBoxed: 'K_c = \\frac{1}{2} m (\\omega_2^2 - \\omega_1^2) \\approx 4\\pi^2 m \\nu_1 \\nu_{\\text{beat}}',
    check: '[m omega^2] = kg · s^-2 = N/m.'
  },
  {
    num: '1.7',
    title: 'Air Drag Damping Comparison between Wooden and Brass Pendulums',
    page: 'Page 28',
    home: false,
    diff: 'Midterm Classic',
    tags: ['Damped Oscillation', 'Inertia and Damping'],
    statement: 'Two spherical pendulum bobs of identical radius—one made of wood (rho_w approx 0.7 g/cm^3) and one of brass (rho_b approx 8.4 g/cm^3)—are released with identical initial amplitudes. If the amplitude of the wooden pendulum drops to 1/e of its initial value in 3 minutes, what will be the amplitude of the brass pendulum after the same duration?',
    givenLatex: 'A(t) = A_0 e^{-\\gamma t}, \\quad \\gamma = \\frac{b}{2m}, \\quad \\frac{m_b}{m_w} = \\frac{\\rho_b}{\\rho_w} = 12',
    targetLatex: 'A_b(180\\text{ s}) = A_0 e^{-1/12} \\approx 0.92 A_0',
    principle: 'The drag coefficient b depends solely on sphere geometry (radius r) and air viscosity, whereas damping rate gamma = b/(2m) is inversely proportional to mass.',
    startQ: 'Since both spheres have identical radii and velocities, how do drag coefficient b and damping rate gamma scale with mass?',
    optCorrect: 'b_b = b_w \\implies \\frac{\\gamma_b}{\\gamma_w} = \\frac{m_w}{m_b} = \\frac{1}{12}',
    optWrong1: '\\gamma_b = \\gamma_w \\quad (\\text{Mass does not affect damping})',
    optWrong2: '\\frac{\\gamma_b}{\\gamma_w} = \\frac{m_b}{m_w} = 12',
    steps: [
      {
        title: 'Ratio of Damping Rates and Exponential Decay',
        hint: 'For the wooden bob, gamma_w T = 1 at T = 180 s. Compute gamma_b T.',
        text: 'Since t = 3 min = 180 s corresponds to gamma_w t = 1, for the brass bob gamma_b t = (gamma_w / 12) t = 1/12:',
        math: 'A_b(t) = A_0 e^{-\\gamma_b t} = A_0 e^{-(\\gamma_w t)/12} = A_0 e^{-1/12} \\approx 0.920 A_0'
      }
    ],
    sceneMode: 'shm-phasor',
    abstractTab: 'phase',
    presetParams: { omega0: 2.0, amplitude: 1.3, dampingGamma: 0.08 },
    observe: 'In the phase portrait, observe that the spiral inward is 12 times slower for the higher-inertia brass oscillator than for the wooden one.',
    finalBoxed: 'A_b = A_0 e^{-\\rho_w / \\rho_b} = A_0 e^{-1/12} \\approx 0.92 A_0 \\; (92\\%)',
    check: 'In the limit m -> infinity, gamma -> 0 and A_b -> A_0 (infinite inertia eliminates damping decay).'
  },
  {
    num: '1.8',
    title: 'Equilibrium and Maximum Extension of a Mass Released on a Vertical Spring',
    page: 'Page 28',
    home: false,
    diff: 'Basic Derivation',
    tags: ['Vertical Spring', 'Conservation of Energy', 'Equilibrium Shift'],
    statement: 'A mass m is attached to the lower end of an unstretched vertical spring with constant k and released from rest at y = 0 (with y directed downwards). Determine: (a) the maximum displacement y_max the mass reaches, and (b) the final equilibrium position y_eq where it comes to rest after oscillations damp out.',
    givenLatex: 'U_{\\text{total}}(y) = \\frac{1}{2}ky^2 - mgy',
    targetLatex: 'y_{\\text{eq}} = \\frac{mg}{k}, \\qquad y_{\\max} = \\frac{2mg}{k} = 2y_{\\text{eq}}',
    principle: 'At static equilibrium the net force is zero (F = 0), whereas at the lowest turning point instantaneous velocity is zero and mechanical energy is conserved (Delta E = 0).',
    startQ: 'To determine the lowest turning point y_max, should one apply F = 0 or conservation of mechanical energy K + U = 0?',
    optCorrect: '\\text{At turning point } v=0 \\implies \\frac{1}{2}ky_{\\max}^2 - mgy_{\\max} = 0 \\implies y_{\\max} = \\frac{2mg}{k}',
    optWrong1: 'ky_{\\max} = mg \\implies y_{\\max} = \\frac{mg}{k}',
    optWrong2: 'y_{\\max} = \\sqrt{\\frac{2mg}{k}}',
    steps: [
      {
        title: 'Proof of Vertical SHM by Completing the Square',
        hint: 'Substitute the shifted coordinate y_tilde = y - mg/k.',
        text: 'The equation of motion is m y_ddot = mg - ky = -k(y - mg/k). Gravity does not change oscillation frequency omega_0; it merely shifts equilibrium to y_eq = mg/k:',
        math: 'm\\frac{d^2}{dt^2}\\left(y - \\frac{mg}{k}\\right) + k\\left(y - \\frac{mg}{k}\\right) = 0 \\implies y(t) = \\frac{mg}{k}(1 - \\cos\\omega_0 t)'
      }
    ],
    sceneMode: 'shm-phasor',
    abstractTab: 'phase',
    presetParams: { omega0: 2.2, amplitude: 1.0 },
    observe: 'The mass reaches its maximum downward speed as it passes y_eq, overshooting all the way to 2y_eq before momentarily stopping.',
    finalBoxed: 'y_{\\text{eq}} = \\frac{mg}{k}, \\qquad y_{\\max} = \\frac{2mg}{k}',
    check: 'At t = pi / omega_0, cos(pi) = -1 yielding y = 2mg/k exactly.'
  },
  {
    num: '1.9',
    title: 'Measurement of Unknown Mass and Spring Constant by Mass Addition',
    page: 'Page 28',
    home: false,
    diff: 'Basic Derivation',
    tags: ['Frequency Ratio', 'Parameter Estimation'],
    statement: 'A spring oscillates with frequency nu_1 when loaded with an unknown mass m. When an additional known mass Delta m is attached, the frequency becomes nu_2. Express the unknown mass m and the spring constant k in terms of nu_1, nu_2, and Delta m.',
    givenLatex: '\\nu_1 = \\frac{1}{2\\pi}\\sqrt{\\frac{k}{m}}, \\quad \\nu_2 = \\frac{1}{2\\pi}\\sqrt{\\frac{k}{m + \\Delta m}}',
    targetLatex: 'm = \\Delta m \\frac{\\nu_2^2}{\\nu_1^2 - \\nu_2^2}, \\qquad k = 4\\pi^2 \\Delta m \\frac{\\nu_1^2 \\nu_2^2}{\\nu_1^2 - \\nu_2^2}',
    principle: 'The squared oscillation frequency is inversely proportional to total inertial mass: nu^2 proportional to 1/m.',
    startQ: 'How can the two frequency equations be combined to eliminate the unknown spring constant k?',
    optCorrect: '\\left(\\frac{\\nu_1}{\\nu_2}\\right)^2 = \\frac{m + \\Delta m}{m} = 1 + \\frac{\\Delta m}{m}',
    optWrong1: '\\frac{\\nu_1}{\\nu_2} = 1 + \\frac{\\Delta m}{m}',
    optWrong2: '\\left(\\frac{\\nu_2}{\\nu_1}\\right)^2 = 1 + \\frac{\\Delta m}{m}',
    steps: [
      {
        title: 'Isolating Unknown Mass m and Stiffness k',
        hint: 'Invert the ratio relation Delta m / m = (nu_1^2 - nu_2^2) / nu_2^2.',
        text: 'Solving for m from the squared ratio and substituting into k = 4 pi^2 nu_1^2 m:',
        math: 'm = \\Delta m \\frac{\\nu_2^2}{\\nu_1^2 - \\nu_2^2}, \\qquad k = 4\\pi^2 \\nu_1^2 m = 4\\pi^2 \\Delta m \\frac{\\nu_1^2 \\nu_2^2}{\\nu_1^2 - \\nu_2^2}'
      }
    ],
    sceneMode: 'shm-phasor',
    abstractTab: 'phase',
    presetParams: { omega0: 1.8, amplitude: 1.1 },
    observe: 'Adding mass decreases the oscillation frequency and stretches the phase space trajectory along the displacement axis.',
    finalBoxed: 'm = \\frac{\\Delta m\\,\\nu_2^2}{\\nu_1^2 - \\nu_2^2}, \\qquad k = \\frac{4\\pi^2 \\Delta m\\,\\nu_1^2 \\nu_2^2}{\\nu_1^2 - \\nu_2^2}',
    check: 'Since nu_2 < nu_1, the denominator nu_1^2 - nu_2^2 is strictly positive.'
  },
  {
    num: '1.10',
    title: 'Tuning Fork Mass Loading and Beat Method',
    page: 'Page 28',
    home: true,
    diff: 'Basic Derivation',
    tags: ['Acoustic Beats', 'Perturbation', 'Home Experiment'],
    statement: 'When a small elastic band of mass Delta m is wrapped around one tine of a tuning fork of effective mass m, acoustic beats are heard when sounded together with an identical unloaded fork of frequency nu_0. Using a first-order Taylor expansion for Delta m << m, show that the beat frequency is nu_beat approx 1/2 nu_0 (Delta m / m).',
    givenLatex: '\\nu(\\Delta m) = \\nu_0 \\left(1 + \\frac{\\Delta m}{m}\\right)^{-1/2}',
    targetLatex: '\\nu_{\\text{beat}} = \\nu_0 - \\nu(\\Delta m) \\approx \\frac{1}{2}\\nu_0 \\frac{\\Delta m}{m}',
    principle: 'First-order binomial (Taylor) approximation: (1 + epsilon)^(-1/2) approx 1 - epsilon/2 for |epsilon| << 1.',
    startQ: 'What is the first-order Taylor expansion of (1 + Delta m / m)^(-1/2) for Delta m << m?',
    optCorrect: '\\left(1 + \\frac{\\Delta m}{m}\\right)^{-1/2} \\approx 1 - \\frac{1}{2}\\frac{\\Delta m}{m}',
    optWrong1: '\\left(1 + \\frac{\\Delta m}{m}\\right)^{-1/2} \\approx 1 - \\frac{\\Delta m}{m}',
    optWrong2: '\\left(1 + \\frac{\\Delta m}{m}\\right)^{-1/2} \\approx 1 + \\frac{1}{2}\\frac{\\Delta m}{m}',
    steps: [
      {
        title: 'Binomial Expansion for Beat Frequency',
        hint: 'Use (1+epsilon)^p approx 1 + p epsilon with p = -1/2.',
        text: 'Loading the tine lowers its resonant frequency; the beat frequency heard when both forks ring simultaneously is:',
        math: '\\nu_{\\text{beat}} = \\nu_0 - \\nu_0\\left(1 - \\frac{\\Delta m}{2m}\\right) = \\frac{1}{2}\\nu_0 \\frac{\\Delta m}{m}',
        trick: 'trick-taylor'
      }
    ],
    sceneMode: 'beats-energy',
    abstractTab: 'energy-beats',
    presetParams: { couplingKc: 0.15, omega0: 2.4 },
    observe: 'Observe that a minute fractional frequency discrepancy produces an audible, slow modulation envelope (beats).',
    finalBoxed: '\\nu_{\\text{beat}} \\approx \\frac{\\nu_0}{2}\\frac{\\Delta m}{m}',
    check: 'When Delta m = 0, nu_beat = 0 identically.'
  },
  {
    num: '1.11',
    title: 'Superposition of Initial Displacements in Two-Mass Three-Spring System',
    page: 'Page 28',
    home: false,
    diff: 'Midterm Classic',
    tags: ['Superposition', 'Initial Conditions', 'Normal Modes'],
    statement: 'In a symmetric two-mass system released from rest with (x_a(0), x_b(0)) = (2, 0), show that this state decomposes into the sum of Mode 1 (1, 1) and Mode 2 (1, -1) initial states, and derive the trajectories x_a(t) and x_b(t).',
    givenLatex: '\\begin{bmatrix} 2 \\\\ 0 \\end{bmatrix} = \\begin{bmatrix} 1 \\\\ 1 \\end{bmatrix} + \\begin{bmatrix} 1 \\\\ -1 \\end{bmatrix}, \\quad \\dot{x}_a(0)=\\dot{x}_b(0)=0',
    targetLatex: 'x_a(t) = \\cos(\\omega_1 t) + \\cos(\\omega_2 t), \\quad x_b(t) = \\cos(\\omega_1 t) - \\cos(\\omega_2 t)',
    principle: 'In linear differential systems, the sum of initial condition vectors generates the sum of their independent normal mode solutions.',
    startQ: 'What are the time-dependent state vectors for the pure initial conditions (1, 1) and (1, -1)?',
    optCorrect: '\\vec{x}^{(1)}(t) = \\begin{bmatrix} 1 \\\\ 1 \\end{bmatrix}\\cos(\\omega_1 t), \\qquad \\vec{x}^{(2)}(t) = \\begin{bmatrix} 1 \\\\ -1 \\end{bmatrix}\\cos(\\omega_2 t)',
    optWrong1: '\\vec{x}^{(1)}(t) = \\begin{bmatrix} 1 \\\\ 1 \\end{bmatrix}\\sin(\\omega_1 t)',
    optWrong2: '\\vec{x}^{(1)}(t) = \\begin{bmatrix} 2 \\\\ 0 \\end{bmatrix}\\cos(\\omega_1 t)',
    steps: [
      {
        title: 'Direct Sum of Eigenmode Solutions',
        hint: 'Write x_vec(t) = x_vec^(1)(t) + x_vec^(2)(t).',
        text: 'Each normal mode evolves independently at its own eigenfrequency; their sum satisfies both the differential equations and initial conditions:',
        math: 'x_a(t) = \\cos(\\omega_1 t) + \\cos(\\omega_2 t), \\qquad x_b(t) = \\cos(\\omega_1 t) - \\cos(\\omega_2 t)',
        trick: 'trick-determinant'
      }
    ],
    sceneMode: 'coupled-modes',
    abstractTab: 'normal-coords',
    presetParams: { modeSelect: 0, couplingKc: 0.5 },
    observe: 'In Mode 0 (where only the left mass is displaced initially), observe that both normal coordinates q_1 and q_2 oscillate with equal amplitudes.',
    finalBoxed: 'x_a(t) = \\cos\\omega_1 t + \\cos\\omega_2 t, \\qquad x_b(t) = \\cos\\omega_1 t - \\cos\\omega_2 t',
    check: 'At t = 0, x_a(0) = 1 + 1 = 2 and x_b(0) = 1 - 1 = 0 match exactly.'
  },
  {
    num: '1.12',
    title: 'Superposition of Initial Velocities (Impulse) in Two-Mass System',
    page: 'Page 29',
    home: false,
    diff: 'Midterm Classic',
    tags: ['Initial Velocity', 'Impulse', 'Normal Modes'],
    statement: 'Starting from equilibrium (x_a(0) = x_b(0) = 0), the left mass receives an impulsive tap at t = 0, giving initial velocities v_a(0) = 2v_0, v_b(0) = 0. Derive the subsequent motion x_a(t) and x_b(t).',
    givenLatex: 'x_a(0) = x_b(0) = 0, \\quad \\dot{x}_a(0) = 2v_0, \\quad \\dot{x}_b(0) = 0',
    targetLatex: 'x_a(t) = \\frac{v_0}{\\omega_1}\\sin(\\omega_1 t) + \\frac{v_0}{\\omega_2}\\sin(\\omega_2 t), \\quad x_b(t) = \\frac{v_0}{\\omega_1}\\sin(\\omega_1 t) - \\frac{v_0}{\\omega_2}\\sin(\\omega_2 t)',
    principle: 'Zero initial displacement requires sin(omega_n t) terms; differentiating brings out omega_n, so displacement amplitudes scale as 1 / omega_n.',
    startQ: 'What are the initial normal coordinate velocities q_dot_1(0) and q_dot_2(0) at t = 0?',
    optCorrect: '\\dot{q}_1(0) = \\dot{x}_a(0) + \\dot{x}_b(0) = 2v_0, \\qquad \\dot{q}_2(0) = \\dot{x}_a(0) - \\dot{x}_b(0) = 2v_0',
    optWrong1: '\\dot{q}_1(0) = v_0, \\qquad \\dot{q}_2(0) = 0',
    optWrong2: 'q_1(0) = 2v_0',
    steps: [
      {
        title: 'Time Evolution of Normal Coordinates',
        hint: 'Use q_n(t) = (q_dot_n(0) / omega_n) sin(omega_n t).',
        text: 'For each normal coordinate with initial velocity 2v_0 and zero initial displacement:',
        math: 'q_1(t) = \\frac{2v_0}{\\omega_1}\\sin(\\omega_1 t), \\qquad q_2(t) = \\frac{2v_0}{\\omega_2}\\sin(\\omega_2 t)'
      },
      {
        title: 'Transformation Back to Physical Coordinates',
        hint: 'Substitute x_a = 1/2(q_1 + q_2) and x_b = 1/2(q_1 - q_2).',
        text: 'Note that the amplitude of the higher-frequency mode (v_0 / omega_2) is SMALLER than that of the lower-frequency mode (v_0 / omega_1):',
        math: 'x_a(t) = \\frac{v_0}{\\omega_1}\\sin(\\omega_1 t) + \\frac{v_0}{\\omega_2}\\sin(\\omega_2 t), \\qquad x_b(t) = \\frac{v_0}{\\omega_1}\\sin(\\omega_1 t) - \\frac{v_0}{\\omega_2}\\sin(\\omega_2 t)',
        trick: 'trick-determinant'
      }
    ],
    sceneMode: 'coupled-modes',
    abstractTab: 'normal-coords',
    presetParams: { modeSelect: 0, couplingKc: 0.7 },
    observe: 'Observe that impulsive excitation imparts smaller displacement amplitude to the higher-frequency mode due to the 1 / omega_2 factor.',
    finalBoxed: 'x_{a,b}(t) = \\frac{v_0}{\\omega_1}\\sin(\\omega_1 t) \\pm \\frac{v_0}{\\omega_2}\\sin(\\omega_2 t)',
    check: 'Differentiating at t = 0 yields x_dot_a(0) = v_0 + v_0 = 2v_0 and x_dot_b(0) = v_0 - v_0 = 0.'
  },
  {
    num: '1.13',
    title: 'Failure of Superposition in Non-linear Differential Equations',
    page: 'Page 29',
    home: false,
    diff: 'Basic Derivation',
    tags: ['Linearity', 'Superposition', 'Nonlinear'],
    statement: 'Let x_1(t) and x_2(t) be solutions of the non-linear differential equation d^2x/dt^2 + alpha x^2 = 0. Prove algebraically that the linear combination x(t) = x_1(t) + x_2(t) is NOT a solution to this differential equation.',
    givenLatex: '\\ddot{x}_1 + \\alpha x_1^2 = 0, \\quad \\ddot{x}_2 + \\alpha x_2^2 = 0',
    targetLatex: '\\frac{d^2(x_1+x_2)}{dt^2} + \\alpha(x_1+x_2)^2 = 2\\alpha x_1(t)x_2(t) \\neq 0',
    principle: 'The cross-term in (x_1 + x_2)^2 = x_1^2 + x_2^2 + 2x_1x_2 generates a non-linear interaction that breaks linear superposition.',
    startQ: 'When x = x_1 + x_2 is substituted into the differential operator, what does the left-hand side evaluate to?',
    optCorrect: '(\\ddot{x}_1 + \\alpha x_1^2) + (\\ddot{x}_2 + \\alpha x_2^2) + 2\\alpha x_1 x_2 = 2\\alpha x_1 x_2 \\neq 0',
    optWrong1: '0 + 0 = 0',
    optWrong2: '\\alpha(x_1^2 + x_2^2)',
    steps: [
      {
        title: 'Quadratic Expansion and Residual Interaction Term',
        hint: 'Differentiation is a linear operation, but squaring is non-linear.',
        text: 'While individual solution terms vanish by definition, the cross-term 2 alpha x_1 x_2 remains non-zero:',
        math: '\\mathcal{N}[x_1 + x_2] = 2\\alpha x_1(t) x_2(t) \\neq 0'
      }
    ],
    sceneMode: 'shm-phasor',
    abstractTab: 'phase',
    presetParams: { omega0: 2.0, amplitude: 1.3, anharmonicAlpha: 0.35 },
    observe: 'In the phase portrait, observe how the anharmonic term distorts elliptical symmetry into an egg-shaped closed orbit.',
    finalBoxed: '\\text{Residual Term} = 2\\alpha x_1(t)x_2(t) \\neq 0 \\implies \\text{Superposition is invalid.}',
    check: 'In the limit alpha -> 0, linearity and the superposition principle are fully restored.'
  },
  {
    num: '1.14',
    title: 'N = 3 Degrees of Freedom System and Secular Determinant',
    page: 'Page 29',
    home: false,
    diff: 'Advanced Synthesis',
    tags: ['3 Degrees of Freedom', 'Secular Determinant', 'Eigenvalue'],
    statement: 'From the equations of motion for three identical masses m coupled between rigid walls by four identical springs k, set up the 3x3 secular determinant and show that it yields three distinct normal mode eigenfrequencies omega_1^2, omega_2^2, omega_3^2.',
    givenLatex: '\\mathbf{M}\\ddot{\\mathbf{x}} + \\mathbf{K}\\mathbf{x} = \\mathbf{0}, \\quad \\mathbf{x}(t) = \\mathbf{A}\\cos(\\omega t)',
    targetLatex: '\\det(\\mathbf{K} - \\omega^2\\mathbf{M}) = 0 \\implies c_3(\\omega^2)^3 + c_2(\\omega^2)^2 + c_1(\\omega^2) + c_0 = 0',
    principle: 'For a homogeneous linear algebraic system to admit non-trivial mode amplitudes, the secular determinant must vanish.',
    startQ: 'What is the characteristic matrix (K - m omega^2 I) for three identical masses between fixed walls?',
    optCorrect: '\\begin{vmatrix} 2k - m\\omega^2 & -k & 0 \\\\ -k & 2k - m\\omega^2 & -k \\\\ 0 & -k & 2k - m\\omega^2 \\end{vmatrix} = 0',
    optWrong1: '\\begin{vmatrix} k - m\\omega^2 & -k & 0 \\\\ -k & k - m\\omega^2 & -k \\\\ 0 & -k & k - m\\omega^2 \\end{vmatrix} = 0',
    optWrong2: '\\begin{vmatrix} 2k & k & k \\\\ k & 2k & k \\\\ k & k & 2k \\end{vmatrix} = 0',
    steps: [
      {
        title: 'Secular Determinant Factorization and Three Eigenfrequencies',
        hint: 'Let X = 2k - m omega^2 and factor the determinant as X(X^2 - 2k^2) = 0.',
        text: 'Setting X = 2k - m omega^2, the cubic determinant factors directly:',
        math: 'X(X^2 - 2k^2) = 0 \\implies X = 0 \\text{ or } X = \\pm\\sqrt{2}k \\implies m\\omega^2 = (2 - \\sqrt{2})k, \\; 2k, \\; (2 + \\sqrt{2})k',
        trick: 'trick-determinant'
      }
    ],
    sceneMode: 'coupled-modes',
    abstractTab: 'normal-coords',
    presetParams: { modeSelect: 1, couplingKc: 0.8 },
    observe: 'Any system with N degrees of freedom possesses exactly N normal modes arising from the roots of its NxN secular determinant.',
    finalBoxed: '\\omega_1^2 = (2-\\sqrt{2})\\frac{k}{m}, \\quad \\omega_2^2 = 2\\frac{k}{m}, \\quad \\omega_3^2 = (2+\\sqrt{2})\\frac{k}{m}',
    check: 'These three roots match Crawford general formula omega_m = 2 sqrt(k/m) sin(m pi / 8) for m = 1, 2, 3 identically.'
  },
  {
    num: '1.15',
    title: 'Partial Energy Transfer between Mistuned Guitar Strings',
    page: 'Page 29',
    home: true,
    diff: 'Midterm Classic',
    tags: ['Frequency Detuning', 'Resonance', 'Home Experiment'],
    statement: 'Two guitar strings coupled weakly across the bridge have unequal uncoupled natural frequencies (omega_a != omega_b). When one string is plucked, explain why energy never transfers 100% to the other string, leaving residual energy in the first string.',
    givenLatex: '\\Delta\\omega_0 = \\omega_a - \\omega_b \\neq 0',
    targetLatex: '\\eta_{\\max} = \\frac{(2\\kappa)^2}{(2\\kappa)^2 + (\\omega_a^2 - \\omega_b^2)^2} < 1',
    principle: 'Complete energy transfer (100% modulation depth) requires equal amplitude excitation of both normal modes, which occurs only in degenerate/symmetric systems (omega_a = omega_b).',
    startQ: 'When omega_a = omega_b, what is the maximum energy transfer efficiency eta_max?',
    optCorrect: '\\omega_a = \\omega_b \\implies \\eta_{\\max} = 1 \\; (100\\% \\text{ complete energy transfer})',
    optWrong1: '\\eta_{\\max} = 0.5',
    optWrong2: '\\eta_{\\max} = 0',
    steps: [
      {
        title: 'Asymmetric Normal Modes and Incomplete Beat Modulation',
        hint: 'When uncoupled frequencies differ, each normal mode is localized predominantly on one of the strings.',
        text: 'If |Delta omega_0| >> kappa, Mode 1 is largely localized on string A while Mode 2 lives on string B; consequently, energy remains trapped and string A never becomes completely silent:',
        math: '\\Delta\\omega_0 \\neq 0 \\implies E_{a,\\min} > 0 \\quad (\\text{The driven string never comes to a complete rest!})'
      }
    ],
    sceneMode: 'beats-energy',
    abstractTab: 'energy-beats',
    presetParams: { couplingKc: 0.25, omega0: 2.2 },
    observe: 'In identical oscillators E_a(t) drops all the way to zero, whereas with mistuned oscillators minimum energy remains strictly positive.',
    finalBoxed: '\\omega_a \\neq \\omega_b \\implies \\text{Energy transfer is always strictly less than } 100\\%.',
    check: 'This principle provides the physical foundation for resonance tuning and acoustic pitch discrimination.'
  },
  {
    num: '1.16',
    title: 'Non-identical Coupled Pendulums (M_a != M_b) and Reduced Mass',
    page: 'Page 29',
    home: false,
    diff: 'Advanced Synthesis',
    tags: ['Unequal Masses', 'Secular Determinant', 'Reduced Mass'],
    statement: 'Two pendulums of equal length L but unequal bob masses M_a and M_b are coupled by a spring with constant K. Derive the equations of motion and find the two normal mode frequencies (omega_1, omega_2) and the mode amplitude ratios.',
    givenLatex: 'M_a\\ddot{x}_a + \\frac{M_a g}{L}x_a + K(x_a - x_b) = 0, \\quad M_b\\ddot{x}_b + \\frac{M_b g}{L}x_b + K(x_b - x_a) = 0',
    targetLatex: '\\omega_1^2 = \\frac{g}{L}, \\qquad \\omega_2^2 = \\frac{g}{L} + K\\left(\\frac{1}{M_a} + \\frac{1}{M_b}\\right)',
    principle: 'In Mode 1, x_a = x_b and the spring remains unextended regardless of mass values; in Mode 2, the center of mass remains stationary and effective inertia is the reduced mass 1/mu = 1/M_a + 1/M_b.',
    startQ: 'Which linear coordinate combinations decouple the equations of motion when divided by their respective masses?',
    optCorrect: 'q_2 = x_a - x_b \\text{ (relative coordinate)} \\quad \\text{and} \\quad q_1 = M_a x_a + M_b x_b \\text{ (center of mass coordinate)}',
    optWrong1: 'q_1 = x_a + x_b, \\quad q_2 = x_a - x_b',
    optWrong2: '\\text{It is impossible to decouple the equations.}',
    steps: [
      {
        title: 'Mode 1 (x_a = x_b) and Center of Mass Mode',
        hint: 'Add the two equations directly: M_a x_ddot_a + M_b x_ddot_b.',
        text: 'Direct addition cancels the internal spring force terms +K(x_a - x_b) - K(x_a - x_b) = 0, leaving pure gravitational oscillation:',
        math: '\\omega_1^2 = \\frac{g}{L}, \\qquad A_a = A_b',
        trick: 'trick-determinant'
      },
      {
        title: 'Mode 2 (Stationary Center of Mass: M_a x_a + M_b x_b = 0) and Reduced Mass',
        hint: 'Divide each equation by its mass and subtract to form q_2 = x_a - x_b.',
        text: 'Subtracting mass-normalized equations yields the decoupled relative coordinate equation involving reduced mass 1/mu = 1/M_a + 1/M_b:',
        math: '\\ddot{q}_2 + \\left[\\frac{g}{L} + K\\left(\\frac{1}{M_a} + \\frac{1}{M_b}\\right)\\right] q_2 = 0 \\implies \\omega_2^2 = \\frac{g}{L} + \\frac{K}{\\mu}, \\quad \\frac{A_a}{A_b} = -\\frac{M_b}{M_a}',
        trick: 'trick-determinant'
      }
    ],
    sceneMode: 'coupled-modes',
    abstractTab: 'normal-coords',
    presetParams: { modeSelect: 2, couplingKc: 0.85 },
    observe: 'In Mode 2, oscillation amplitudes are inversely proportional to masses (M_a A_a + M_b A_b = 0).',
    finalBoxed: '\\omega_1 = \\sqrt{\\frac{g}{L}}, \\qquad \\omega_2 = \\sqrt{\\frac{g}{L} + K\\left(\\frac{1}{M_a} + \\frac{1}{M_b}\\right)}',
    check: 'Setting M_a = M_b = m recovers the standard symmetric formula omega_2^2 = g/L + 2K/m.'
  },
  {
    num: '1.17',
    title: 'Transverse Normal Modes of Two Beads on a Stretched String',
    page: 'Page 29',
    home: false,
    diff: 'Midterm Classic',
    tags: ['Transverse Oscillation', 'Two Beads on String', 'Normal Modes'],
    statement: 'Two identical beads of mass M are attached at intervals of ell along a massless string of total length 3ell held under tension T_0. Derive the transverse equations of motion and the two normal mode frequencies (omega_1, omega_2).',
    givenLatex: 'L_{\\text{total}} = 3\\ell, \\quad \\text{Masses: } M, M, \\quad \\text{Tension: } T_0',
    targetLatex: '\\omega_1 = \\sqrt{\\frac{T_0}{M\\ell}}, \\qquad \\omega_2 = \\sqrt{\\frac{3T_0}{M\\ell}} = \\sqrt{3}\\omega_1',
    principle: 'Restoring transverse force on each bead from adjacent string segments is T_0 sin theta approx T_0 (Delta y / ell).',
    startQ: 'What is the equation of transverse motion for the first bead y_a?',
    optCorrect: 'M\\ddot{y}_a = -T_0\\frac{y_a}{\\ell} - T_0\\frac{y_a - y_b}{\\ell} = -\\frac{T_0}{\\ell}(2y_a - y_b)',
    optWrong1: 'M\\ddot{y}_a = -\\frac{T_0}{\\ell}(y_a - y_b)',
    optWrong2: 'M\\ddot{y}_a = -\\frac{T_0}{\\ell}(y_a + y_b)',
    steps: [
      {
        title: 'Symmetric Mode (y_a = y_b) Frequency',
        hint: 'When y_a = y_b, the central string segment remains horizontal (slope is zero).',
        text: 'Setting y_a = y_b, the central segment exerts zero vertical force; only the outer segments pull back:',
        math: 'M\\ddot{y}_1 + \\frac{T_0}{\\ell}y_1 = 0 \\implies \\omega_1 = \\sqrt{\\frac{T_0}{M\\ell}}',
        trick: 'trick-determinant'
      },
      {
        title: 'Antisymmetric Mode (y_a = -y_b) Frequency',
        hint: 'When y_b = -y_a, the slope of the central segment is 2y_a / ell, tripling restoring stiffness.',
        text: 'Substituting y_b = -y_a yields a restoring force factor of 3 T_0 / ell:',
        math: 'M\\ddot{y}_2 + \\frac{3T_0}{\\ell}y_2 = 0 \\implies \\omega_2 = \\sqrt{\\frac{3T_0}{M\\ell}} = \\sqrt{3}\\omega_1'
      }
    ],
    sceneMode: 'coupled-modes',
    abstractTab: 'normal-coords',
    presetParams: { modeSelect: 2, couplingKc: 1.0 },
    observe: 'This problem represents the N = 2 case of the N-bead loaded string: omega_m = 2 sqrt(T_0 / M ell) sin(m pi / 6).',
    finalBoxed: '\\omega_1 = \\sqrt{\\frac{T_0}{M\\ell}}, \\qquad \\omega_2 = \\sqrt{\\frac{3T_0}{M\\ell}}',
    check: 'Isomorphic to two masses and three springs with outer spring constant k = T_0 / ell and coupling K_c = T_0 / ell.'
  },
  {
    num: '1.18',
    title: 'Two LC Circuits Coupled by Mutual Inductance',
    page: 'Page 30',
    home: false,
    diff: 'Midterm Classic',
    tags: ['Magnetic Coupling', 'Mutual Inductance', 'LC Circuit'],
    statement: 'Two identical LC circuits are coupled magnetically through mutual inductance M_c. The governing loop equations are L Q_ddot_a + M_c Q_ddot_b + Q_a / C = 0 and L Q_ddot_b + M_c Q_ddot_a + Q_b / C = 0. Derive the normal coordinates and eigenfrequencies.',
    givenLatex: 'L\\ddot{Q}_a + M_c\\ddot{Q}_b + \\frac{1}{C}Q_a = 0, \\quad L\\ddot{Q}_b + M_c\\ddot{Q}_a + \\frac{1}{C}Q_b = 0',
    targetLatex: '\\omega_1 = \\frac{1}{\\sqrt{(L + M_c)C}}, \\qquad \\omega_2 = \\frac{1}{\\sqrt{(L - M_c)C}}',
    principle: 'In acceleration-based (inertial) coupling, sum and difference coordinates diagonalize the inductance matrix with effective inductances L +- M_c.',
    startQ: 'Adding the two loop equations directly (q_1 = Q_a + Q_b) yields which differential equation?',
    optCorrect: '(L + M_c)\\ddot{q}_1 + \\frac{1}{C}q_1 = 0',
    optWrong1: 'L\\ddot{q}_1 + \\left(\\frac{1}{C} + M_c\\right)q_1 = 0',
    optWrong2: '(L - M_c)\\ddot{q}_1 + \\frac{1}{C}q_1 = 0',
    steps: [
      {
        title: 'Eigenfrequencies via Sum and Difference Coordinates',
        hint: 'Define q_1 = Q_a + Q_b and q_2 = Q_a - Q_b.',
        text: 'Adding and subtracting the two equations immediately decouples the system into two independent harmonic oscillators:',
        math: '\\omega_1 = \\frac{1}{\\sqrt{(L + M_c)C}} \\; (\\text{Symmetric}), \\qquad \\omega_2 = \\frac{1}{\\sqrt{(L - M_c)C}} \\; (\\text{Antisymmetric})',
        trick: 'trick-determinant'
      }
    ],
    sceneMode: 'coupled-modes',
    abstractTab: 'normal-coords',
    presetParams: { modeSelect: 1, couplingKc: 0.6 },
    observe: 'Unlike capacitive coupling, in magnetic coupling the symmetric mode has larger effective inductance and therefore LOWER frequency (omega_1 < omega_0).',
    finalBoxed: '\\omega_1 = \\frac{1}{\\sqrt{(L+M_c)C}}, \\qquad \\omega_2 = \\frac{1}{\\sqrt{(L-M_c)C}}',
    check: 'Physically M_c < L ensures L - M_c > 0, keeping omega_2 real and stable.'
  },
  {
    num: '1.19',
    title: 'Natural Frequency from Static Sag of Elastic Cushion / Suspension',
    page: 'Page 30',
    home: true,
    diff: 'Basic Derivation',
    tags: ['Static Sag', 'Natural Frequency', 'Home Experiment'],
    statement: 'When a mass sits on an elastic cushion, the cushion compresses (sags) statically by h = 1 cm. Without knowing either the mass m or the elastic stiffness constant k, calculate the vertical natural oscillation frequency nu in Hz.',
    givenLatex: 'h = 1\\text{ cm}, \\quad g = 980\\text{ cm/s}^2, \\quad kh = mg',
    targetLatex: '\\nu = \\frac{1}{2\\pi}\\sqrt{\\frac{g}{h}} \\approx 5.0\\text{ Hz}',
    principle: 'Static equilibrium requires kh = mg, so the stiffness-to-mass ratio k/m is identically equal to g/h.',
    startQ: 'Substituting the static equilibrium condition into omega_0^2 = k/m yields which relationship?',
    optCorrect: '\\frac{k}{m} = \\frac{g}{h} \\implies \\omega_0 = \\sqrt{\\frac{g}{h}}',
    optWrong1: '\\omega_0 = \\sqrt{gh}',
    optWrong2: '\\omega_0 = \\sqrt{\\frac{h}{g}}',
    steps: [
      {
        title: 'Numerical Frequency Evaluation',
        hint: 'Substitute g = 980 cm/s^2 and h = 1 cm.',
        text: 'Dividing omega_0 = sqrt(980) approx 31.305 rad/s by 2 pi:',
        math: '\\nu = \\frac{\\sqrt{980}}{2\\pi} \\approx \\frac{31.305}{6.283} \\approx 4.98\\text{ Hz} \\approx 5.0\\text{ Hz}'
      }
    ],
    sceneMode: 'shm-phasor',
    abstractTab: 'phase',
    presetParams: { omega0: 2.5, amplitude: 1.0 },
    observe: 'The natural period of any spring with static sag h is mathematically identical to that of a simple pendulum of length h.',
    finalBoxed: '\\nu = \\frac{1}{2\\pi}\\sqrt{\\frac{g}{h}} \\approx 5.0\\text{ Hz}',
    check: '[sqrt(g/h)] = sqrt((m/s^2)/m) = s^-1.'
  },
  {
    num: '1.20',
    title: 'Direct Secular Determinant Solution of Two-Mass System and Mode Ratios',
    page: 'Page 30',
    home: false,
    diff: 'Midterm Classic',
    tags: ['Secular Determinant', 'Eigenvector Ratio'],
    statement: 'Without guessing normal coordinates in advance, substitute trial harmonic solutions x_a = A_a cos(omega t) and x_b = A_b cos(omega t) into the two-mass three-spring system, set the secular determinant to zero to find omega_1, omega_2, and determine the amplitude ratio A_b / A_a for each mode.',
    givenLatex: '\\begin{bmatrix} k + K_c - m\\omega^2 & -K_c \\\\ -K_c & k + K_c - m\\omega^2 \\end{bmatrix} \\begin{bmatrix} A_a \\\\ A_b \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 0 \\end{bmatrix}',
    targetLatex: '(k + K_c - m\\omega^2)^2 - K_c^2 = 0 \\implies \\omega_1^2 = \\frac{k}{m}, \\; \\omega_2^2 = \\frac{k+2K_c}{m}',
    principle: 'Matrix eigenvalue problem (K - m omega^2 I) A = 0.',
    startQ: 'When the secular determinant equation is factored as a difference of squares, which roots emerge?',
    optCorrect: '(k + K_c - m\\omega^2 - K_c)(k + K_c - m\\omega^2 + K_c) = 0',
    optWrong1: '(k - m\\omega^2)^2 + K_c^2 = 0',
    optWrong2: 'k^2 - (m\\omega^2)^2 = 0',
    steps: [
      {
        title: 'Substituting Eigenvalues into Eigenvector Equations',
        hint: 'Substitute omega_1^2 and omega_2^2 back into the first row equation to extract A_b / A_a.',
        text: 'For omega_1^2 = k/m, K_c A_a - K_c A_b = 0 implies A_b / A_a = +1; for omega_2^2 = (k+2K_c)/m, -K_c A_a - K_c A_b = 0 implies A_b / A_a = -1:',
        math: '\\text{Mode 1: } \\frac{A_b}{A_a} = +1, \\qquad \\text{Mode 2: } \\frac{A_b}{A_a} = -1',
        trick: 'trick-determinant'
      }
    ],
    sceneMode: 'coupled-modes',
    abstractTab: 'normal-coords',
    presetParams: { modeSelect: 1, couplingKc: 0.75 },
    observe: 'The secular determinant is a universal algorithmic procedure that works reliably even when visual symmetry is absent.',
    finalBoxed: '\\omega_1 = \\sqrt{\\frac{k}{m}} \\; (A_b = A_a), \\qquad \\omega_2 = \\sqrt{\\frac{k+2K_c}{m}} \\; (A_b = -A_a)',
    check: 'Matches 100% with results derived from normal coordinates.'
  },
  {
    num: '1.21',
    title: 'Sloshing Mode Derivation in a Rectangular Basin',
    page: 'Page 30',
    home: true,
    diff: 'Advanced Synthesis',
    tags: ['Sloshing Mode', 'Fluid Oscillation', 'Energy Method'],
    statement: 'Water of mean depth h fills a rectangular tank of total length 2L (h << L). When the water surface tilts planarly as y(x) = theta x (for -L <= x <= L), derive the sloshing frequency omega approx sqrt(3gh / L^2) using Crawford equivalent center-of-mass energy method.',
    givenLatex: '\\text{Tank length} = 2L, \\quad \\text{Depth} = h, \\quad y(x) = \\theta x \\; (-L \\le x \\le L)',
    targetLatex: '\\omega = \\sqrt{\\frac{3gh}{L^2}} \\implies \\nu = \\frac{1}{2\\pi}\\sqrt{\\frac{3gh}{L^2}}',
    principle: 'Equating gravitational potential energy increase U = 1/2 rho g w integral y^2(x) dx to horizontal kinetic energy of bulk water displacement.',
    startQ: 'When the water surface tilts by an angle theta (y(x) = theta x), what is the total potential energy increase U(theta)?',
    optCorrect: 'U(\\theta) = \\int_{-L}^{L} \\frac{1}{2}\\rho g w y^2(x) dx = \\frac{1}{2}\\rho g w \\theta^2 \\int_{-L}^{L} x^2 dx = \\frac{1}{3}\\rho g w L^3 \\theta^2',
    optWrong1: 'U(\\theta) = \\rho g w L^2 \\theta',
    optWrong2: 'U(\\theta) = \\frac{1}{2}\\rho g w L h^2',
    steps: [
      {
        title: 'Horizontal Center of Mass Motion and Kinetic Energy',
        hint: 'The horizontal center of mass of water (M = 2 rho w h L) shifts by x_cm = -L^2 theta / (3h).',
        text: 'Expressing potential energy in terms of center-of-mass shift x_cm, U = 1/2 (3Mgh / L^2) x_cm^2, and kinetic energy K approx 1/2 M x_dot_cm^2:',
        math: 'U = \\frac{1}{2}\\left(\\frac{3 M g h}{L^2}\\right) x_{\\text{cm}}^2 \\implies k_{\\text{eff}} = \\frac{3 M g h}{L^2} \\implies \\omega = \\sqrt{\\frac{3gh}{L^2}}'
      }
    ],
    sceneMode: 'shm-phasor',
    abstractTab: 'potential',
    presetParams: { omega0: 1.9, amplitude: 1.1 },
    observe: 'In shallow-water sloshing, as depth h increases, wave speed sqrt(gh) increases, raising sloshing frequency as sqrt(h).',
    finalBoxed: '\\nu \\approx \\frac{1}{2\\pi}\\sqrt{\\frac{3gh}{L^2}} \\quad (\\text{Exact hydrodynamic standing wave: } \\frac{\\pi}{2} \\approx 1.571 \\text{ vs } \\sqrt{3} \\approx 1.732)',
    check: '[gh/L^2] = (m/s^2 · m)/m^2 = s^-2.'
  },
  {
    num: '1.22',
    title: 'Seiche (Basin Oscillation) Period of Lake Geneva',
    page: 'Page 30',
    home: false,
    diff: 'Basic Derivation',
    tags: ['Seiche Waves', 'Geophysics', 'Standing Wave'],
    statement: 'Lake Geneva has a total length of 2L = 70 km (L = 35 km) and an average depth of h = 150 m. Using the sloshing formula, calculate the fundamental longitudinal seiche period T and compare it with the historically observed value of 73 minutes.',
    givenLatex: '2L = 70\\times 10^3\\text{ m} \\implies L = 35\\times 10^3\\text{ m}, \\quad h = 150\\text{ m}, \\quad g = 9.8\\text{ m/s}^2',
    targetLatex: 'T = \\frac{2\\pi L}{\\sqrt{3gh}} \\approx 54\\text{ min} \\quad \\left(\\text{or Merian\'s formula } T = \\frac{4L}{\\sqrt{gh}} \\approx 61\\text{ min}\\right)',
    principle: 'A closed lake basin acts as a standing wave resonator with closed boundary conditions (lambda_1 = 2 x Lake Length).',
    startQ: 'Substituting L = 35,000 m and h = 150 m into T = 2 pi L / sqrt(3gh), what is the period in seconds and minutes?',
    optCorrect: 'T = \\frac{2\\pi (35000)}{\\sqrt{3 \\times 9.8 \\times 150}} = \\frac{219911}{66.4} \\approx 3312\\text{ s} \\approx 55\\text{ min}',
    optWrong1: 'T \\approx 5\\text{ s}',
    optWrong2: 'T \\approx 24\\text{ h}',
    steps: [
      {
        title: 'Numerical Value and Comparison with Observed 73 Minutes',
        hint: 'Lake margin shallowing and bathymetric curving lengthen the actual wave travel time.',
        text: 'A uniform rectangular basin predicts roughly 55 to 61 minutes; the actual measured seiche period in Lake Geneva is 73 minutes due to topography:',
        math: 'T \\approx 55 - 61\\text{ min (approximately 1 hour)}'
      }
    ],
    sceneMode: 'shm-phasor',
    abstractTab: 'phase',
    presetParams: { omega0: 1.5, amplitude: 1.2 },
    observe: 'The same harmonic oscillator equations govern phenomena across scales from microscopic CO_2 molecules (10^13 Hz) to 70 km lakes (0.0002 Hz).',
    finalBoxed: 'T \\approx 55 - 61\\text{ min (Observed: 73 min)}',
    check: 'Dimensionality is seconds.'
  }
];

export const CHAPTER_1_PROBLEMS_EN: ProofCoachProblem[] = CH1_SEEDS_EN.map((s) => ({
  id: `prob-${s.num.replace('.', '-')}`,
  chapter: 1,
  number: `Problem ${s.num}`,
  title: s.title,
  bookPage: `Berkeley Vol. 3 · ${s.page}`,
  isHomeExperiment: s.home,
  difficulty: s.diff as any,
  tags: s.tags,
  statement: s.statement,
  givenLatex: s.givenLatex,
  targetLatex: s.targetLatex,
  stage1Setup: {
    diagramDescription: `Physical free-body diagram and coordinate setup for ${s.title}.`,
    physicalPrinciple: s.principle,
    startingEquationQuestion: s.startQ,
    options: [
      {
        latex: s.optCorrect,
        explanation: 'Correct! Fully consistent with physical conservation laws and sign conventions.',
        isCorrect: true
      },
      {
        latex: s.optWrong1,
        explanation: 'Caution: Dimensional or sign mismatch; verify the restoring force terms.',
        isCorrect: false
      },
      {
        latex: s.optWrong2,
        explanation: 'This expression fails to satisfy the boundary conditions and coupling symmetry.',
        isCorrect: false
      }
    ]
  },
  stage2Derivation: s.steps.map((st) => ({
    stepTitle: st.title,
    hint: st.hint,
    derivationText: st.text,
    mathLatex: st.math,
    trickUsedId: st.trick
  })),
  stage3VisualVerify: {
    description: `Live interactive verification of Problem ${s.num} in the right-side 3D Physical and 2D Abstract spaces.`,
    chapter: 1,
    sceneMode: s.sceneMode,
    abstractTab: s.abstractTab,
    presetParams: s.presetParams,
    whatToObserve: s.observe
  },
  stage4ExamSheet: {
    fullAcademicSolutionMarkdown: `**Given:** $${s.givenLatex}$  \n**To Prove / Derive:** $${s.targetLatex}$  \n**Governing Principle:** ${s.principle}`,
    finalBoxedLatex: s.finalBoxed,
    limitAndDimensionCheck: s.check,
    examGradingRubric: [
      'Correct construction of free-body diagram / circuit loop and governing differential equations (30 pts)',
      'Complete demonstration of normal coordinate transformation or algebraic factorization steps (40 pts)',
      'Accurate final boxed expression along with physical limiting cases and dimensional verification (30 pts)'
    ]
  }
}));