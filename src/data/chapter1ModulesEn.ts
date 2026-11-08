import { ChapterModule } from '../types/curriculum';

export const CHAPTER_1_MODULES_EN: ChapterModule[] = [
  {
    id: 'mod-1-1',
    chapter: 1,
    code: '1.1',
    title: 'Introduction, Taylor Linearization, and the Anatomy of Harmonic Motion',
    shortTitle: 'Taylor Linearization & SHM',
    bookPages: 'Berkeley Volume 3 · Pages 1 – 6',
    summary:
      'We prove using Taylor series why any physical system oscillating about a stable equilibrium position inevitably undergoes Simple Harmonic Motion (SHM), formulate its canonical differential equation, and map it onto complex phasor space.',
    coreQuestion:
      'Forces in nature (intermolecular potential, pendulum, spring) are fundamentally nonlinear; why, then, are all small oscillations governed by the exact same equation d²x/dt² + ω₀²x = 0?',
    fundamentalEquations: [
      {
        label: 'Taylor-Linearized Restoring Force',
        latex: '\\textcolor{#FC6255}{F(x)} = F(0) + F\'(0)\\textcolor{#58C4DD}{x} + \\frac{1}{2}F\'\'(0)\\textcolor{#58C4DD}{x^2} + \\dots \\approx -k_{\\text{eff}}\\textcolor{#58C4DD}{x}',
        formulaLatex: '\\textcolor{#FC6255}{F(x)} = F(0) + F\'(0)\\textcolor{#58C4DD}{x} + \\frac{1}{2}F\'\'(0)\\textcolor{#58C4DD}{x^2} + \\dots \\approx -k_{\\text{eff}}\\textcolor{#58C4DD}{x}',
        colorNote: 'Red: Restoring force, Blue: Displacement from equilibrium'
      },
      {
        label: 'Canonical Harmonic Oscillator Equation',
        latex: '\\textcolor{#FC6255}{\\frac{d^2 x}{dt^2}} + \\textcolor{#F7D147}{\\omega_0^2} \\textcolor{#58C4DD}{x} = 0, \\qquad \\textcolor{#F7D147}{\\omega_0} = \\sqrt{\\frac{k_{\\text{eff}}}{m}}',
        formulaLatex: '\\textcolor{#FC6255}{\\frac{d^2 x}{dt^2}} + \\textcolor{#F7D147}{\\omega_0^2} \\textcolor{#58C4DD}{x} = 0, \\qquad \\textcolor{#F7D147}{\\omega_0} = \\sqrt{\\frac{k_{\\text{eff}}}{m}}',
        colorNote: 'Yellow: Natural frequency (intrinsic identity of system), Blue: State variable'
      },
      {
        label: 'Complex Phasor and Real Projection Solution',
        latex: '\\textcolor{#58C4DD}{x(t)} = \\text{Re}\\!\\left[ A e^{i(\\textcolor{#F7D147}{\\omega_0} t + \\phi)} \\right] = A\\cos(\\textcolor{#F7D147}{\\omega_0} t + \\phi)',
        formulaLatex: '\\textcolor{#58C4DD}{x(t)} = \\text{Re}\\!\\left[ A e^{i(\\textcolor{#F7D147}{\\omega_0} t + \\phi)} \\right] = A\\cos(\\textcolor{#F7D147}{\\omega_0} t + \\phi)',
        colorNote: 'Shadow on the real axis of a phasor rotating at angular velocity ω₀ in the complex plane'
      }
    ],
    symbolicTerms: [
      {
        id: 'term-anharmonic',
        label: 'Anharmonic Taylor Term (-βx³)',
        latexBadge: '-\\beta x^3',
        colorRole: 'coupling',
        description: 'Retaining the 3rd-order term in the Taylor expansion (large amplitudes) makes the period amplitude-dependent and deforms the phase space ellipse.',
        defaultActive: false,
        effectOnEquation: 'm ẍ + kx + βx³ = 0 (Duffing Oscillator — Isochronism broken)',
        effectOnSpace: 'The ellipse in phase space flattens, and the oscillation frequency shifts with amplitude.',
        sceneParamKey: 'anharmonicAlpha',
        activeValue: 0.35,
        inactiveValue: 0.0
      },
      {
        id: 'term-damping',
        label: 'Viscous Damping Term (-b ẋ)',
        latexBadge: '-b\\dot{x}',
        colorRole: 'vel',
        description: 'Adding energy dissipation proportional to velocity causes total mechanical energy to decay exponentially.',
        defaultActive: false,
        effectOnEquation: 'ẍ + γ ẋ + ω₀² x = 0 (Amplitude decays as e^{-γt/2})',
        effectOnSpace: 'The closed ellipse in phase space spirals inward toward the origin.',
        sceneParamKey: 'dampingGamma',
        activeValue: 0.15,
        inactiveValue: 0.0
      }
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        title: 'Stable Equilibrium and Linearization via Taylor Series',
        subtitle: 'Parabolic approximation at the bottom of an arbitrary potential well V(x)',
        physicalMotivation:
          'When a particle rests at a stable equilibrium point x = 0, the net force is zero: F(0) = 0. Expanding the restoring force F(x) in a Taylor series about x = 0 yields the linear Hooke approximation.',
        mainEquationLatex:
          '\\textcolor{#FC6255}{F(x)} = \\underbrace{F(0)}_{=0} + \\left(\\frac{dF}{dx}\\right)_0 \\textcolor{#58C4DD}{x} + \\frac{1}{2!}\\left(\\frac{d^2F}{dx^2}\\right)_0 \\textcolor{#58C4DD}{x^2} + \\frac{1}{3!}\\left(\\frac{d^3F}{dx^3}\\right)_0 \\textcolor{#58C4DD}{x^3} + \\dots',
        algebraicBreakdown: [
          {
            subStepTitle: 'Step 1a: Stable Equilibrium Condition (Negative Slope)',
            explanation:
              'For equilibrium to be stable, displacing x > 0 must produce a restoring force in the -x direction, and x < 0 must produce a force in the +x direction. Thus the first derivative is negative, defining positive constant k_eff:',
            formulaLatex: 'k_{\\text{eff}} \\equiv -\\left(\\frac{dF}{dx}\\right)_{x=0} = +\\left(\\frac{d^2 V}{dx^2}\\right)_{x=0} > 0'
          },
          {
            subStepTitle: 'Step 1b: Small-Amplitude Limit (Emergence of Hooke’s Law)',
            explanation:
              'For sufficiently small x, higher-order terms such as x² and x³ become negligible compared to the linear x term:',
            formulaLatex: '\\textcolor{#FC6255}{F(x)} \\approx -k_{\\text{eff}} \\textcolor{#58C4DD}{x}'
          }
        ],
        mathTrickIds: ['trick-taylor'],
        trainerCheckpoint: {
          questionPrompt:
            'The potential energy of a molecule is given by U(x). What is the effective spring constant k_eff for small oscillations about a stable equilibrium point x₀?',
          options: [
            {
              label: 'A',
              latex: 'k_{\\text{eff}} = \\left.\\frac{d^2 U}{dx^2}\\right|_{x=x_0}',
              isCorrect: true,
              feedback: 'Correct! Since force F = -dU/dx, F\'(x₀) = -d²U/dx²|_{x₀}, giving k_eff = -F\'(x₀) = +U\'\'(x₀).'
            },
            {
              label: 'B',
              latex: 'k_{\\text{eff}} = \\left.\\frac{dU}{dx}\\right|_{x=x_0}',
              isCorrect: false,
              feedback: 'Careful: At equilibrium, the first derivative dU/dx = -F(x₀) is already identically zero!'
            },
            {
              label: 'C',
              latex: 'k_{\\text{eff}} = -\\left.\\frac{d^2 U}{dx^2}\\right|_{x=x_0}',
              isCorrect: false,
              feedback: 'Sign error! In a stable potential well U(x) is concave upward (U\'\' > 0), so k_eff must be positive.'
            }
          ],
          examTip: 'On exams asking to "find the small-oscillation period in potential U(x)": (1) solve dU/dx = 0 for x₀, (2) compute k_eff = d²U/dx²|_{x₀}, (3) write ω₀ = √(k_eff/m)!'
        },
        sceneDirective: {
          chapter: 1,
          modeId: 'shm-phasor',
          abstractTab: 'phase',
          highlightVector: 'force',
          presetParams: { omega0: 2.2, amplitude: 1.2, anharmonicAlpha: 0 },
          caption: 'About equilibrium, the restoring force vector (red) is always directed opposite to displacement (blue).'
        }
      },
      {
        stepNumber: 2,
        title: 'Newton’s Second Law and the Canonical Differential Equation',
        subtitle: 'Seeking functions whose second derivative is proportional to the negative of the function',
        physicalMotivation:
          'Substituting the linearized restoring force into F = ma = m(d²x/dt²) and dividing by mass m gives the canonical harmonic oscillator equation.',
        mainEquationLatex:
          'm \\textcolor{#FC6255}{\\frac{d^2 x}{dt^2}} = -k_{\\text{eff}} \\textcolor{#58C4DD}{x} \\implies \\textcolor{#FC6255}{\\frac{d^2 x}{dt^2}} + \\textcolor{#F7D147}{\\omega_0^2} \\textcolor{#58C4DD}{x} = 0 \\quad \\left(\\textcolor{#F7D147}{\\omega_0^2} \\equiv \\frac{k_{\\text{eff}}}{m}\\right)',
        algebraicBreakdown: [
          {
            subStepTitle: 'Step 2a: Physical Interpretation of the Differential Equation',
            explanation:
              'The equation states: "Find an x(t) whose second time derivative equals -ω₀² times the function itself." Sines, cosines, and complex exponentials satisfy this property.',
            formulaLatex: '\\frac{d^2}{dt^2} x(t) = -\\omega_0^2 x(t)'
          },
          {
            subStepTitle: 'Step 2b: Superposition of Two Linearly Independent Solutions',
            explanation:
              'A second-order linear ordinary differential equation requires two arbitrary constants to satisfy initial position and initial velocity:',
            formulaLatex: '\\textcolor{#58C4DD}{x(t)} = A\\cos(\\textcolor{#F7D147}{\\omega_0} t) + B\\sin(\\textcolor{#F7D147}{\\omega_0} t) = C\\cos(\\textcolor{#F7D147}{\\omega_0} t + \\phi)'
          }
        ],
        mathTrickIds: ['trick-phasor'],
        trainerCheckpoint: {
          questionPrompt:
            'In the general solution x(t) = A cos(ω₀t) + B sin(ω₀t), given initial position x(0) = x₀ and initial velocity ẋ(0) = v₀ at t = 0, what are the coefficients A and B?',
          options: [
            {
              label: 'A',
              latex: 'A = x_0, \\qquad B = \\frac{v_0}{\\omega_0}',
              isCorrect: true,
              feedback: 'Exactly! x(0) = A cos(0) = A = x₀, and ẋ(0) = B ω₀ cos(0) = B ω₀ = v₀ ⇒ B = v₀/ω₀. Memorizing this saves valuable exam time.'
            },
            {
              label: 'B',
              latex: 'A = x_0, \\qquad B = v_0',
              isCorrect: false,
              feedback: 'Dimensional inconsistency! Since sin(ω₀t) is dimensionless, B must have units of meters; do not forget to divide v₀ by ω₀.'
            },
            {
              label: 'C',
              latex: 'A = \\frac{v_0}{\\omega_0}, \\qquad B = x_0',
              isCorrect: false,
              feedback: 'At t = 0, sin(0) = 0, so x(0) directly determines the cosine coefficient A.'
            }
          ],
          examTip: 'Whenever initial conditions are provided for SHM, skip the phase angle algebra and write directly: x(t) = x₀ cos(ω₀t) + (v₀/ω₀) sin(ω₀t)!'
        },
        sceneDirective: {
          chapter: 1,
          modeId: 'shm-phasor',
          abstractTab: 'phasor',
          highlightVector: 'vel',
          presetParams: { omega0: 2.5, amplitude: 1.3, anharmonicAlpha: 0 },
          caption: 'Phasor rotating in the complex plane: Velocity vector (green) leads displacement by 90°, acceleration (red) leads by 180°.'
        }
      },
      {
        stepNumber: 3,
        title: 'Conservation of Mechanical Energy and the Phase Space Ellipse',
        subtitle: 'Time-independent first integral and the normalized (x, v/ω₀) circle',
        physicalMotivation:
          'Multiplying the equation of motion by ẋ = dx/dt and integrating over time proves that total mechanical energy is conserved and traces a closed orbit in phase space.',
        mainEquationLatex:
          'E = \\frac{1}{2}m \\textcolor{#83C167}{\\dot{x}^2} + \\frac{1}{2}k \\textcolor{#58C4DD}{x^2} = \\frac{1}{2}k A^2 = \\text{sabit}',
        algebraicBreakdown: [
          {
            subStepTitle: 'Step 3a: The Multiplying by ẋ Trick',
            explanation:
              'Multiplying m ẍ + kx = 0 by ẋ produces an exact total time derivative:',
            formulaLatex: 'm \\dot{x}\\ddot{x} + k x\\dot{x} = \\frac{d}{dt}\\left(\\frac{1}{2}m\\dot{x}^2 + \\frac{1}{2}kx^2\\right) = 0'
          },
          {
            subStepTitle: 'Step 3b: Normalized Phase Space Coordinates',
            explanation:
              'Dividing the energy equation by ½kA² reveals a perfect circle of radius A in the (x, v/ω₀) plane:',
            formulaLatex: '\\left(\\frac{\\textcolor{#58C4DD}{x}}{A}\\right)^2 + \\left(\\frac{\\textcolor{#83C167}{v / \\omega_0}}{A}\\right)^2 = \\cos^2(\\omega_0 t + \\phi) + \\sin^2(\\omega_0 t + \\phi) = 1'
          }
        ],
        mathTrickIds: ['trick-phasor'],
        trainerCheckpoint: {
          questionPrompt:
            'For a harmonic oscillator with position x(t) = A cos(ω₀t), at what angular frequency does the potential energy U(t) = ½kx²(t) oscillate?',
          options: [
            {
              label: 'A',
              latex: '2\\omega_0 \\quad \\left(U(t) = \\frac{1}{4}kA^2 [1 + \\cos(2\\omega_0 t)]\\right)',
              isCorrect: true,
              feedback: 'Great! Due to the double-angle identity cos²(ω₀t) = ½(1 + cos(2ω₀t)), kinetic and potential energies reach their maxima TWICE per cycle (frequency 2ω₀).'
            },
            {
              label: 'B',
              latex: '\\omega_0',
              isCorrect: false,
              feedback: 'Remember: Potential energy is maximized at both +A and -A extreme positions during every cycle!'
            },
            {
              label: 'C',
              latex: '\\text{Sıfır (Sabittir)}',
              isCorrect: false,
              feedback: 'Total energy E = K + U is constant, but K(t) and U(t) periodically exchange energy at frequency 2ω₀.'
            }
          ],
          examTip: 'Quadratic physical quantities (Kinetic energy, Potential energy, Instantaneous power) always oscillate at TWICE the fundamental motion frequency (2ω₀).'
        },
        sceneDirective: {
          chapter: 1,
          modeId: 'shm-phasor',
          abstractTab: 'phase',
          highlightVector: 'pos',
          presetParams: { omega0: 2.0, amplitude: 1.4, anharmonicAlpha: 0 },
          caption: 'In normalized phase space (x, v/ω₀), the trajectory is a circle of constant radius; total energy is proportional to the square of the radius.'
        }
      }
    ],
    solvedExamples: [
      {
        id: 'ex-1-1',
        title: 'Oscillation Frequency in a Lennard-Jones Type Molecular Potential',
        bookRef: 'Berkeley Volume 3 · Chapter 1 Supplementary Derivation',
        problemStatement:
          'The interatomic potential energy in a diatomic molecule is modeled as U(r) = U₀ [ (r₀/r)² - 2(r₀/r) ]. Derive the equilibrium separation and the angular frequency of small vibrations in terms of m, U₀, and r₀.',
        strategy:
          'First find the equilibrium distance r_eq by setting dU/dr = 0, then compute the second derivative d²U/dr² to obtain the effective spring constant k_eff.',
        stepsLatex: [
          {
            text: '1. Find the equilibrium point by setting the first derivative to zero:',
            math: '\\frac{dU}{dr} = U_0 \\left( -\\frac{2r_0^2}{r^3} + \\frac{2r_0}{r^2} \\right) = 0 \\implies r_{\\text{denge}} = r_0'
          },
          {
            text: '2. Compute the second derivative at r = r₀ to find k_eff:',
            math: 'k_{\\text{eff}} = \\left.\\frac{d^2 U}{dr^2}\\right|_{r=r_0} = U_0 \\left[ \\frac{6r_0^2}{r^4} - \\frac{4r_0}{r^3} \\right]_{r=r_0} = \\frac{2 U_0}{r_0^2}'
          },
          {
            text: '3. Angular frequency of small oscillations:',
            math: '\\omega_0 = \\sqrt{\\frac{k_{\\text{eff}}}{m}} = \\sqrt{\\frac{2 U_0}{m r_0^2}}'
          }
        ],
        keyTakeaway:
          'No matter how complex the potential energy function appears, small oscillations about equilibrium depend exclusively on the local curvature (second derivative).'
      }
    ],
    commonTraps: [
      {
        trap: 'Computing kinetic energy in complex representation as ½ m (Re[ż²]).',
        whyWrong: 'Squaring is nonlinear; Re[z²] yields cos²(ωt) - sin²(ωt) = cos(2ωt), which assumes unphysical negative values!',
        correctApproach: 'First take the real part of the velocity: v(t) = Re[ż] = -ω₀ A sin(ω₀t + φ), then square it: ½ m v²(t).'
      }
    ]
  },
  {
    id: 'mod-1-2',
    chapter: 1,
    code: '1.2',
    title: 'Derivations of Single Degree of Freedom Physical Systems (Longitudinal vs Transverse)',
    shortTitle: 'Pendulum, LC & Transverse/Longitudinal Spring',
    bookPages: 'Berkeley Volume 3 · Pages 6 – 12',
    summary:
      'Crawford’s favorite midterm topics: Simple pendulum, LC circuit, U-tube manometer, and restoring force derivations for longitudinal versus transverse oscillations of a mass between two springs, including the Slinky approximation.',
    coreQuestion:
      'Why do longitudinal vibrations of a spring-mass system oscillate independently of spring tension, whereas transverse oscillations depend directly on the wire’s equilibrium pre-tension T₀?',
    fundamentalEquations: [
      {
        label: 'Longitudinal Mass-Spring Frequency',
        latex: 'm\\textcolor{#FC6255}{\\ddot{x}} = -2k\\textcolor{#58C4DD}{x} \\implies \\textcolor{#F7D147}{\\omega_{\\text{boyuna}}^2} = \\frac{2k}{m}',
        formulaLatex: 'm\\textcolor{#FC6255}{\\ddot{x}} = -2k\\textcolor{#58C4DD}{x} \\implies \\textcolor{#F7D147}{\\omega_{\\text{boyuna}}^2} = \\frac{2k}{m}',
        colorNote: 'Regardless of unstretched length L₀, the first-order longitudinal restoring force is -2kx'
      },
      {
        label: 'Exact and Approximate Transverse Restoring Force',
        latex: '\\textcolor{#FC6255}{F_y} = -2 T \\sin\\theta \\approx -\\frac{2 T_0}{a} \\textcolor{#58C4DD}{y} \\implies \\textcolor{#F7D147}{\\omega_{\\text{enine}}^2} = \\frac{2 T_0}{m a}',
        formulaLatex: '\\textcolor{#FC6255}{F_y} = -2 T \\sin\\theta \\approx -\\frac{2 T_0}{a} \\textcolor{#58C4DD}{y} \\implies \\textcolor{#F7D147}{\\omega_{\\text{enine}}^2} = \\frac{2 T_0}{m a}',
        colorNote: 'a: Equilibrium half-length, T₀ = k(a - a₀): Equilibrium pre-tension'
      },
      {
        label: 'Electromechanical Duality (LC Circuit)',
        latex: 'L\\textcolor{#FC6255}{\\ddot{Q}} + \\frac{1}{C}\\textcolor{#58C4DD}{Q} = 0 \\quad \\Longleftrightarrow \\quad m\\textcolor{#FC6255}{\\ddot{x}} + k\\textcolor{#58C4DD}{x} = 0 \\quad \\left(\\textcolor{#F7D147}{\\omega_0} = \\frac{1}{\\sqrt{LC}}\\right)',
        formulaLatex: 'L\\textcolor{#FC6255}{\\ddot{Q}} + \\frac{1}{C}\\textcolor{#58C4DD}{Q} = 0 \\quad \\Longleftrightarrow \\quad m\\textcolor{#FC6255}{\\ddot{x}} + k\\textcolor{#58C4DD}{x} = 0 \\quad \\left(\\textcolor{#F7D147}{\\omega_0} = \\frac{1}{\\sqrt{LC}}\\right)',
        colorNote: 'Mass m ↔ Inductance L, Spring constant k ↔ Inverse Capacitance 1/C, Position x ↔ Charge Q'
      }
    ],
    symbolicTerms: [
      {
        id: 'term-slinky-limit',
        label: 'Slinky (a₀ ≪ a) Limit',
        latexBadge: 'a_0 \\to 0',
        colorRole: 'mode',
        description: 'When unstretched length a₀ is negligible compared to stretched length a, T₀ = k(a - a₀) ≈ ka, making the transverse frequency equal to the longitudinal frequency!',
        defaultActive: true,
        effectOnEquation: 'T₀ = ka ⇒ ω_transverse² = 2T₀/(ma) = 2k/m = ω_longitudinal²',
        effectOnSpace: 'In the force triangle, the transverse restoring force reaches its maximum linear value.',
        sceneParamKey: 'tensionRatio',
        activeValue: 1.0,
        inactiveValue: 0.25
      }
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        title: 'Geometric Force Triangle Derivation for Transverse Oscillations',
        subtitle: 'Crawford Equations (1.29) – (1.35): Why sin θ and binomial expansion are required',
        physicalMotivation:
          'Consider mass m between two identical springs of unstretched length a₀ and stretched equilibrium length a. When displaced transversely by y, the spring length becomes l = √(a² + y²).',
        mainEquationLatex:
          '\\textcolor{#FC6255}{F_y} = -2 T(l) \\sin\\theta = -2 k (l - a_0) \\frac{\\textcolor{#58C4DD}{y}}{l} = -2k \\textcolor{#58C4DD}{y} \\left(1 - \\frac{a_0}{\\sqrt{a^2 + \\textcolor{#58C4DD}{y^2}}}\\right)',
        algebraicBreakdown: [
          {
            subStepTitle: 'Step 1a: Binomial Linearization of 1/√(a² + y²)',
            explanation:
              'For y ≪ a, 1/√(a² + y²) = (1/a)(1 + y²/a²)^{-1/2} ≈ (1/a)(1 - y²/2a²):',
            formulaLatex: '\\textcolor{#FC6255}{F_y} \\approx -2k \\textcolor{#58C4DD}{y} \\left[ 1 - \\frac{a_0}{a}\\left(1 - \\frac{y^2}{2a^2}\\right) \\right] = -\\frac{2k(a - a_0)}{a}\\textcolor{#58C4DD}{y} - \\frac{k a_0}{a^3}\\textcolor{#58C4DD}{y^3}'
          },
          {
            subStepTitle: 'Step 1b: Formulation in Terms of Pre-Tension T₀ = k(a - a₀)',
            explanation:
              'When equilibrium pre-tension T₀ = k(a - a₀) > 0, the y³ term is negligible, yielding simple harmonic motion governed by T₀:',
            formulaLatex: 'm\\textcolor{#FC6255}{\\ddot{y}} + \\left(\\frac{2 T_0}{a}\\right)\\textcolor{#58C4DD}{y} = 0 \\implies \\textcolor{#F7D147}{\\omega_{\\text{enine}}^2} = \\frac{2 T_0}{m a}'
          }
        ],
        mathTrickIds: ['trick-taylor'],
        trainerCheckpoint: {
          questionPrompt:
            'If the springs are completely unstretched initially (a = a₀, so pre-tension T₀ = 0), what happens when the mass is displaced transversely by y and released?',
          options: [
            {
              label: 'A',
              latex: 'F_y \\approx -\\frac{k}{a^2} y^3 \\text{ olur; doğrusal terim yok olur ve hareket BHH OLMAZ!}',
              isCorrect: true,
              feedback: 'Excellent! When T₀ = 0, the first-order restoring force vanishes, leaving an anharmonic -y³ force where period is inversely proportional to amplitude (T ∝ 1/y₀)!'
            },
            {
              label: 'B',
              latex: '\\text{Yine } \\omega = \\sqrt{2k/m} \\text{ ile harmonik salınır.}',
              isCorrect: false,
              feedback: 'Setting a = a₀ eliminates the linear -2T₀y/a term!'
            },
            {
              label: 'C',
              latex: '\\text{Hiç geri çağırıcı kuvvet oluşmaz, kütle olduğu yerde kalır.}',
              isCorrect: false,
              feedback: 'Displacing the mass stretches the springs, producing a 3rd-order (-ky³/a²) restoring force.'
            }
          ],
          examTip: 'Crawford’s classic conceptual question: In an unstressed (T₀ = 0) wire, small transverse vibrations are NONLINEAR (F_y ∝ -y³).'
        },
        sceneDirective: {
          chapter: 1,
          modeId: 'transverse-force',
          abstractTab: 'potential',
          highlightVector: 'force',
          presetParams: { omega0: 2.0, amplitude: 1.1, tensionRatio: 1.0 },
          caption: 'In transverse oscillations, the restoring force arises from the vertical projection -2T₀ sin θ ≈ -2T₀(y/a) of spring tension T₀.'
        }
      },
      {
        stepNumber: 2,
        title: 'Simple Pendulum and LC Circuit Analogous Derivations',
        subtitle: 'Mapping angular momentum and Kirchhoff loop laws into the same mathematical template',
        physicalMotivation:
          'For a simple pendulum of length ℓ, the tangential restoring force is F_θ = -mg sin θ. In an LC circuit, the sum of inductive and capacitive voltages is zero.',
        mainEquationLatex:
          '\\textcolor{#FC6255}{\\ddot{\\theta}} + \\textcolor{#F7D147}{\\frac{g}{\\ell}} \\sin\\theta \\approx \\textcolor{#FC6255}{\\ddot{\\theta}} + \\textcolor{#F7D147}{\\frac{g}{\\ell}} \\textcolor{#58C4DD}{\\theta} = 0, \\qquad L\\textcolor{#FC6255}{\\ddot{Q}} + \\frac{1}{C}\\textcolor{#58C4DD}{Q} = 0',
        algebraicBreakdown: [
          {
            subStepTitle: 'Step 2a: Pendulum Arc Length s = ℓθ Approximation',
            explanation:
              'At small angles sin θ ≈ θ ≈ x/ℓ, transforming horizontal motion into a spring-mass equation with effective constant k_eff = mg/ℓ:',
            formulaLatex: 'm\\ddot{x} + \\left(\\frac{mg}{\\ell}\\right)x = 0 \\implies \\omega_0 = \\sqrt{\\frac{g}{\\ell}}'
          },
          {
            subStepTitle: 'Step 2b: Energy Equivalence in the LC Circuit',
            explanation:
              'Magnetic energy ½LI² corresponds to mechanical kinetic energy (½mv²), and electric energy ½Q²/C corresponds to spring potential energy (½kx²):',
            formulaLatex: 'E_{\\text{elektrik}} = \\frac{1}{2}L \\textcolor{#83C167}{\\dot{Q}^2} + \\frac{1}{2C}\\textcolor{#58C4DD}{Q^2} = \\text{sabit}'
          }
        ],
        mathTrickIds: ['trick-taylor'],
        trainerCheckpoint: {
          questionPrompt:
            'In the Slinky (slack spring, a₀ ≪ a) approximation, what is the relation between transverse frequency ω_transverse and longitudinal frequency ω_longitudinal?',
          options: [
            {
              label: 'A',
              latex: '\\omega_{\\text{enine}} = \\omega_{\\text{boyuna}} = \\sqrt{\\frac{2k}{m}}',
              isCorrect: true,
              feedback: 'Correct! For a slack spring a₀ ≪ a, T₀ = k(a - a₀) ≈ ka. Substituting into ω_transverse² = 2T₀/(ma) cancels a, leaving 2k/m!'
            },
            {
              label: 'B',
              latex: '\\omega_{\\text{enine}} \\ll \\omega_{\\text{boyuna}}',
              isCorrect: false,
              feedback: 'This only holds when a - a₀ ≪ a₀ (stiff spring with slight stretch).'
            },
            {
              label: 'C',
              latex: '\\omega_{\\text{enine}} = 2\\omega_{\\text{boyuna}}',
              isCorrect: false,
              feedback: 'In both regimes the effective restoring constant is 2k.'
            }
          ],
          examTip: 'The Slinky approximation (T₀ ≈ ka) also plays a central role in Chapter 2 when computing continuous string wave velocities.'
        },
        sceneDirective: {
          chapter: 1,
          modeId: 'transverse-force',
          abstractTab: 'phase',
          highlightVector: 'pos',
          presetParams: { omega0: 2.2, amplitude: 1.0, tensionRatio: 1.0 },
          caption: 'In the Slinky limit (T₀ ≈ ka), the phase space trajectories of transverse and longitudinal oscillations coincide exactly.'
        }
      }
    ],
    solvedExamples: [
      {
        id: 'ex-1-2',
        title: 'Oscillation of a Liquid Column in a U-Tube',
        bookRef: 'Berkeley Volume 3 · Chapter 1 Classical Derivation',
        problemStatement:
          'A uniform U-tube of cross-sectional area A containing a liquid of total column length L and density ρ is displaced from equilibrium by y and released. Derive the oscillation period.',
        strategy:
          'Total liquid mass is M = ρAL. When the column rises by y in one limb, it drops by y in the other, creating a height difference of 2y.',
        stepsLatex: [
          {
            text: '1. Weight of the unbalanced liquid column of height 2y provides the restoring force:',
            math: 'F = -(A \\cdot 2y \\cdot \\rho) g = -2\\rho A g y'
          },
          {
            text: '2. Newton’s equation for the total moving mass M = ρAL:',
            math: '(\\rho A L)\\ddot{y} + 2\\rho A g y = 0 \\implies \\ddot{y} + \\left(\\frac{2g}{L}\\right)y = 0'
          },
          {
            text: '3. Angular frequency and period:',
            math: '\\omega_0 = \\sqrt{\\frac{2g}{L}}, \\qquad T = 2\\pi\\sqrt{\\frac{L}{2g}}'
          }
        ],
        keyTakeaway:
          'Notice that while displacement in one limb is y, the net head difference across the two limbs is 2y—the crucial factor in U-tube problems.'
      }
    ],
    commonTraps: [
      {
        trap: 'Assuming spring elongation in transverse oscillation is Δl = y.',
        whyWrong: 'In the right triangle, hypotenuse l = √(a² + y²) ≈ a + y²/(2a); spring elongation scales with y², not y!',
        correctApproach: 'The transverse restoring force comes from the tilt angle sin θ ≈ y/a of the existing pre-tension T₀, not from additional stretching.'
      }
    ]
  },
  {
    id: 'mod-1-3',
    chapter: 1,
    code: '1.3',
    title: 'Linearity, the Principle of Superposition, and Lissajous Figures',
    shortTitle: 'Superposition Principle & 2D Oscillator',
    bookPages: 'Berkeley Volume 3 · Pages 12 – 15',
    summary:
      'We formulate the mathematical definition of linear differential operators L[x], prove why nonlinear (anharmonic) terms destroy superposition through cross terms, and analyze 2D perpendicular harmonic motions.',
    coreQuestion:
      'Under what mathematical condition is the sum of two independent solutions guaranteed to be a solution itself (Superposition Principle), and what happens to waves when this condition fails?',
    fundamentalEquations: [
      {
        label: 'Linear Differential Operator Condition',
        latex: '\\mathcal{L}[c_1 \\textcolor{#58C4DD}{x_1(t)} + c_2 \\textcolor{#58C4DD}{x_2(t)}] = c_1 \\mathcal{L}[\\textcolor{#58C4DD}{x_1(t)}] + c_2 \\mathcal{L}[\\textcolor{#58C4DD}{x_2(t)}] = 0',
        formulaLatex: '\\mathcal{L}[c_1 \\textcolor{#58C4DD}{x_1(t)} + c_2 \\textcolor{#58C4DD}{x_2(t)}] = c_1 \\mathcal{L}[\\textcolor{#58C4DD}{x_1(t)}] + c_2 \\mathcal{L}[\\textcolor{#58C4DD}{x_2(t)}] = 0',
        colorNote: 'The derivative operator d²/dt² and multiplication by x to the first power are linear'
      },
      {
        label: '2D Harmonic Oscillator and Phase-Difference Ellipse',
        latex: '\\textcolor{#58C4DD}{x(t)} = A_x\\cos(\\omega_x t), \\quad \\textcolor{#83C167}{y(t)} = A_y\\cos(\\omega_y t + \\Delta\\phi)',
        formulaLatex: '\\textcolor{#58C4DD}{x(t)} = A_x\\cos(\\omega_x t), \\quad \\textcolor{#83C167}{y(t)} = A_y\\cos(\\omega_y t + \\Delta\\phi)',
        colorNote: 'When ω_x = ω_y, phase difference Δφ determines the tilt and rotation direction of the ellipse'
      }
    ],
    symbolicTerms: [
      {
        id: 'term-nonlinear-cross',
        label: 'Quadratic Nonlinear Term (+αx²)',
        latexBadge: '+\\alpha x^2',
        colorRole: 'force',
        description: 'Because (x₁ + x₂)² = x₁² + x₂² + 2x₁x₂ contains the cross term 2αx₁x₂, the sum of two solutions FAILS to satisfy the equation!',
        defaultActive: false,
        effectOnEquation: 'L[x₁ + x₂] = 2α x₁(t) x₂(t) ≠ 0 (Superposition Collapses)',
        effectOnSpace: 'Frequencies mix together, generating harmonic generation and sum/difference sidebands.',
        sceneParamKey: 'anharmonicAlpha',
        activeValue: 0.4,
        inactiveValue: 0.0
      }
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        title: 'Algebraic Proof of Superposition and the Breakdown Test',
        subtitle: 'Problem 1.13 and Chapter 1.3: Linear vs Nonlinear Operators',
        physicalMotivation:
          'In L[x] = ẍ + ω₀²x + αx² = 0, let x₁(t) and x₂(t) be separate solutions. We substitute the sum x(t) = x₁(t) + x₂(t) into the equation and examine the remainder.',
        mainEquationLatex:
          '\\frac{d^2(x_1+x_2)}{dt^2} + \\omega_0^2(x_1+x_2) + \\alpha(x_1+x_2)^2 = \\underbrace{(\\ddot{x}_1 + \\omega_0^2 x_1 + \\alpha x_1^2)}_{=0} + \\underbrace{(\\ddot{x}_2 + \\omega_0^2 x_2 + \\alpha x_2^2)}_{=0} + \\textcolor{#FC6255}{2\\alpha x_1 x_2}',
        algebraicBreakdown: [
          {
            subStepTitle: 'Step 1a: Linear Case (α = 0)',
            explanation:
              'When α = 0, the red residual term 2αx₁x₂ vanishes, and x₁ + x₂ perfectly satisfies the differential equation.',
            formulaLatex: '\\alpha = 0 \\implies \\mathcal{L}[x_1 + x_2] = 0'
          },
          {
            subStepTitle: 'Step 1b: Nonlinear Interaction (α ≠ 0)',
            explanation:
              'When α ≠ 0, 2αx₁x₂ = 2α cos(ω₁t)cos(ω₂t) = α[cos((ω₁+ω₂)t) + cos((ω₁-ω₂)t)], creating sum and difference sidebands not present in the original inputs (Nonlinear Optics!).',
            formulaLatex: '2\\alpha \\cos(\\omega_1 t)\\cos(\\omega_2 t) = \\alpha\\cos((\\omega_1+\\omega_2)t) + \\alpha\\cos((\\omega_1-\\omega_2)t)'
          }
        ],
        mathTrickIds: ['trick-trig-beats'],
        trainerCheckpoint: {
          questionPrompt:
            'In which of the following differential equations is x₁(t) + x₂(t) guaranteed to be a solution whenever x₁(t) and x₂(t) are solutions (Homogeneous and Linear)?',
          options: [
            {
              label: 'A',
              latex: '\\ddot{x} + \\gamma(t)\\dot{x} + \\omega_0^2(t) x = 0',
              isCorrect: true,
              feedback: 'Correct! Even though coefficients are time-dependent, x, ẋ, and ẍ appear only to the first power and the RHS is zero, making the equation linear and homogeneous.'
            },
            {
              label: 'B',
              latex: '\\ddot{x} + \\omega_0^2 x = F_0 \\cos(\\omega t) \\quad (F_0 \\neq 0)',
              isCorrect: false,
              feedback: 'Careful: This equation is inhomogeneous! Adding two solutions yields 2F₀ cos(ωt) on the right-hand side.'
            },
            {
              label: 'C',
              latex: '\\ddot{x} + \\omega_0^2 \\sin(x) = 0',
              isCorrect: false,
              feedback: 'Because sin(x₁ + x₂) ≠ sin(x₁) + sin(x₂), the exact pendulum equation is nonlinear.'
            }
          ],
          examTip: 'In an inhomogeneous equation (with driving force F(t) on the right), the sum of two particular solutions corresponds to a drive of 2F(t), violating superposition!'
        },
        sceneDirective: {
          chapter: 1,
          modeId: 'lissajous-2d',
          abstractTab: 'lissajous',
          highlightVector: 'pos',
          presetParams: { freqRatio: 1.0, phaseDiff: 1.57, amplitude: 1.2 },
          caption: 'Independent superposition of two perpendicular linear oscillations (x and y) traces Lissajous figures in the plane.'
        }
      }
    ],
    solvedExamples: [
      {
        id: 'ex-1-3',
        title: 'Derivation of Phase Difference and Polarization Ellipse from Perpendicular Oscillations',
        bookRef: 'Berkeley Volume 3 · Page 14 (Preparation for Chapter 8 Polarization)',
        problemStatement:
          'For a 2D oscillator given by x(t) = A cos(ωt) and y(t) = A cos(ωt + Δφ), eliminate time t to find the trajectory equation for Δφ = 0, π/2, and π.',
        strategy:
          'Expand y(t) = A [cos(ωt)cos(Δφ) - sin(ωt)sin(Δφ)], then substitute cos(ωt) = x/A and sin(ωt) = √(1 - (x/A)²).',
        stepsLatex: [
          {
            text: '1. Eliminating t via angle-addition identity yields the general ellipse equation:',
            math: '\\left(\\frac{x}{A}\\right)^2 + \\left(\\frac{y}{A}\\right)^2 - 2\\left(\\frac{x}{A}\\right)\\left(\\frac{y}{A}\\right)\\cos(\\Delta\\phi) = \\sin^2(\\Delta\\phi)'
          },
          {
            text: '2. Special phase shifts:',
            math: '\\Delta\\phi = 0 \\implies y = +x \\text{ (Doğrusal)}, \\quad \\Delta\\phi = \\frac{\\pi}{2} \\implies x^2 + y^2 = A^2 \\text{ (Çembersel)}, \\quad \\Delta\\phi = \\pi \\implies y = -x'
          }
        ],
        keyTakeaway:
          'This relation is both the trajectory of a mechanical 2D oscillator and the exact mathematical foundation for linear, circular, and elliptical polarization of light in Chapter 8!'
      }
    ],
    commonTraps: [
      {
        trap: 'Believing the sum of two solutions to an inhomogeneous equation (ẍ + ω₀²x = F₀ cos ωt) is also a solution.',
        whyWrong: 'L[x₁ + x₂] = L[x₁] + L[x₂] = F₀ cos ωt + F₀ cos ωt = 2F₀ cos ωt.',
        correctApproach: 'For an inhomogeneous linear equation, General Solution = (Homogeneous General Solution) + (One Particular Solution).'
      }
    ]
  },
  {
    id: 'mod-1-4',
    chapter: 1,
    code: '1.4',
    title: 'Free Oscillations of Two Degrees of Freedom Systems and Normal Modes',
    shortTitle: '2 Degrees of Freedom & Normal Modes',
    bookPages: 'Berkeley Volume 3 · Pages 15 – 21',
    summary:
      'For two masses coupled by springs (or two pendulums / two LC circuits), we establish the coupled differential equations and derive normal frequencies (ω₁, ω₂) using Normal Coordinates (q₁, q₂) and secular determinants.',
    coreQuestion:
      'How can two coupled and entangled equations of motion (x_a and x_b) be uncoupled into two completely independent harmonic oscillators (q₁ and q₂)?',
    fundamentalEquations: [
      {
        label: 'Coupled Equations of Motion (2 Masses, 3 Springs)',
        latex: '\\begin{aligned} m\\textcolor{#FC6255}{\\ddot{x}_a} &= -k\\textcolor{#58C4DD}{x_a} - \\textcolor{#B189DF}{K_c}(\\textcolor{#58C4DD}{x_a - x_b}) \\\\ m\\textcolor{#FC6255}{\\ddot{x}_b} &= -k\\textcolor{#58C4DD}{x_b} - \\textcolor{#B189DF}{K_c}(\\textcolor{#58C4DD}{x_b - x_a}) \\end{aligned}',
        formulaLatex: '\\begin{aligned} m\\textcolor{#FC6255}{\\ddot{x}_a} &= -k\\textcolor{#58C4DD}{x_a} - \\textcolor{#B189DF}{K_c}(\\textcolor{#58C4DD}{x_a - x_b}) \\\\ m\\textcolor{#FC6255}{\\ddot{x}_b} &= -k\\textcolor{#58C4DD}{x_b} - \\textcolor{#B189DF}{K_c}(\\textcolor{#58C4DD}{x_b - x_a}) \\end{aligned}',
        colorNote: 'Purple K_c: Coupling spring constant; k: Outer spring constants'
      },
      {
        label: 'Normal Coordinates and Decoupled Eigenvalue Equations',
        latex: '\\textcolor{#58C4DD}{q_1} = x_a + x_b \\implies \\ddot{q}_1 + \\textcolor{#F7D147}{\\omega_1^2} q_1 = 0, \\qquad \\textcolor{#58C4DD}{q_2} = x_a - x_b \\implies \\ddot{q}_2 + \\textcolor{#F7D147}{\\omega_2^2} q_2 = 0',
        formulaLatex: '\\textcolor{#58C4DD}{q_1} = x_a + x_b \\implies \\ddot{q}_1 + \\textcolor{#F7D147}{\\omega_1^2} q_1 = 0, \\qquad \\textcolor{#58C4DD}{q_2} = x_a - x_b \\implies \\ddot{q}_2 + \\textcolor{#F7D147}{\\omega_2^2} q_2 = 0',
        colorNote: 'q₁ (Symmetric Mode): ω₁² = k/m | q₂ (Antisymmetric Mode): ω₂² = (k + 2K_c)/m'
      }
    ],
    symbolicTerms: [
      {
        id: 'term-coupling-kc',
        label: 'Coupling Spring (K_c) Effect',
        latexBadge: 'K_c(\\psi_a - \\psi_b)',
        colorRole: 'coupling',
        description: 'Increasing middle spring constant K_c leaves symmetric mode frequency ω₁ unchanged, while antisymmetric mode frequency ω₂ = √((k+2K_c)/m) increases sharply!',
        defaultActive: true,
        effectOnEquation: 'ω₂² - ω₁² = 2K_c / m (Mode splitting is directly proportional to coupling strength)',
        effectOnSpace: 'In Mode 2 the center spring undergoes double compression/extension; in Mode 1 the center spring remains unstretched and merely translates.',
        sceneParamKey: 'couplingKc',
        activeValue: 0.8,
        inactiveValue: 0.15
      }
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        title: 'Force Analysis and Formulation of Coupled Equations',
        subtitle: 'Center spring extension (x_b - x_a) and sign conventions',
        physicalMotivation:
          'Let left mass displace by x_a and right mass displace by x_b. The outer springs stretch by x_a and x_b. The middle spring stretches by (x_b - x_a), exerting force +K_c(x_b - x_a) = -K_c(x_a - x_b) on mass a.',
        mainEquationLatex:
          '\\begin{cases} m\\textcolor{#FC6255}{\\ddot{x}_a} + (k + \\textcolor{#B189DF}{K_c})\\textcolor{#58C4DD}{x_a} - \\textcolor{#B189DF}{K_c}\\textcolor{#58C4DD}{x_b} = 0 \\\\ m\\textcolor{#FC6255}{\\ddot{x}_b} + (k + \\textcolor{#B189DF}{K_c})\\textcolor{#58C4DD}{x_b} - \\textcolor{#B189DF}{K_c}\\textcolor{#58C4DD}{x_a} = 0 \\end{cases}',
        algebraicBreakdown: [
          {
            subStepTitle: 'Step 1a: Sign Verification (The Physicist’s Sanity Check)',
            explanation:
              'To check signs, hold x_a = 0 and pull x_b > 0 to the right. The first equation gives m ẍ_a = +K_c x_b > 0, pulling mass a to the right as expected! Signs are 100% verified.',
            formulaLatex: 'x_a = 0, \\; x_b > 0 \\implies m\\ddot{x}_a = +K_c x_b > 0 \\quad (\\checkmark)'
          }
        ],
        mathTrickIds: ['trick-determinant'],
        trainerCheckpoint: {
          questionPrompt:
            'If the two masses were replaced by two pendulums coupled by a spring K_c, what replaces the individual restoring spring constant k in the equation of motion?',
          options: [
            {
              label: 'A',
              latex: 'k \\longrightarrow \\frac{mg}{\\ell} \\quad \\left(\\omega_0^2 = \\frac{g}{\\ell}\\right)',
              isCorrect: true,
              feedback: 'Spot on! Gravity provides a restoring force of -(mg/ℓ)x on each pendulum, exactly taking the place of outer spring constant k.'
            },
            {
              label: 'B',
              latex: 'k \\longrightarrow mg\\ell',
              isCorrect: false,
              feedback: 'Check dimensions: mgℓ has units of torque (N·m), whereas spring constant requires N/m (mg/ℓ).'
            },
            {
              label: 'C',
              latex: 'k \\longrightarrow 0',
              isCorrect: false,
              feedback: 'Gravity acts as an external restoring spring pulling each pendulum toward its individual equilibrium.'
            }
          ],
          examTip: 'Coupled pendulums and the 2-mass 3-spring system are mathematically IDENTICAL; simply swap k/m with g/ℓ!'
        },
        sceneDirective: {
          chapter: 1,
          modeId: 'coupled-modes',
          abstractTab: 'normal-coords',
          highlightVector: 'coupling',
          presetParams: { modeSelect: 0, couplingKc: 0.8 },
          caption: 'Two masses and three springs: Center spring (purple) stretches according to relative displacement (x_a - x_b).'
        }
      },
      {
        stepNumber: 2,
        title: 'Normal Coordinate Transformation (Diagonalization)',
        subtitle: 'Decoupling by adding and subtracting equations',
        physicalMotivation:
          'Adding the two equations cancels the K_c terms; subtracting them doubles K_c. These sum and difference variables are the Normal Coordinates (q₁, q₂).',
        mainEquationLatex:
          '\\begin{aligned} (1) + (2): & \\quad m(\\ddot{x}_a + \\ddot{x}_b) + k(x_a + x_b) = 0 \\implies \\textcolor{#FC6255}{\\ddot{q}_1} + \\left(\\frac{k}{m}\\right)\\textcolor{#58C4DD}{q_1} = 0 \\\\ (1) - (2): & \\quad m(\\ddot{x}_a - \\ddot{x}_b) + (k + 2\\textcolor{#B189DF}{K_c})(x_a - x_b) = 0 \\implies \\textcolor{#FC6255}{\\ddot{q}_2} + \\left(\\frac{k + 2\\textcolor{#B189DF}{K_c}}{m}\\right)\\textcolor{#58C4DD}{q_2} = 0 \\end{aligned}',
        algebraicBreakdown: [
          {
            subStepTitle: 'Step 2a: Mode 1 (Symmetric / In-Phase Mode: q₂ = 0 ⇒ x_a = x_b)',
            explanation:
              'When masses oscillate with equal amplitude in the same direction, the center spring is neither compressed nor stretched:',
            formulaLatex: '\\textcolor{#F7D147}{\\omega_1} = \\sqrt{\\frac{k}{m}}, \\qquad x_a(t) = x_b(t) = A_1\\cos(\\omega_1 t + \\phi_1)'
          },
          {
            subStepTitle: 'Step 2b: Mode 2 (Antisymmetric / Out-of-Phase Mode: q₁ = 0 ⇒ x_a = -x_b)',
            explanation:
              'When masses oscillate in opposite directions with equal amplitude, the middle spring compresses by 2x_a, exerting double force on each mass:',
            formulaLatex: '\\textcolor{#F7D147}{\\omega_2} = \\sqrt{\\frac{k + 2K_c}{m}}, \\qquad x_a(t) = -x_b(t) = A_2\\cos(\\omega_2 t + \\phi_2)'
          }
        ],
        mathTrickIds: ['trick-determinant'],
        trainerCheckpoint: {
          questionPrompt:
            'Once normal coordinates q₁ = x_a + x_b and q₂ = x_a - x_b are solved, how are physical positions x_a(t) and x_b(t) recovered?',
          options: [
            {
              label: 'A',
              latex: 'x_a(t) = \\frac{1}{2}[q_1(t) + q_2(t)], \\qquad x_b(t) = \\frac{1}{2}[q_1(t) - q_2(t)]',
              isCorrect: true,
              feedback: 'Great! This inverse transformation allows immediate solution for any set of initial conditions.'
            },
            {
              label: 'B',
              latex: 'x_a(t) = q_1(t) + q_2(t), \\qquad x_b(t) = q_1(t) - q_2(t)',
              isCorrect: false,
              feedback: 'q₁ + q₂ = (x_a + x_b) + (x_a - x_b) = 2x_a; remember the 1/2 factor!'
            },
            {
              label: 'C',
              latex: 'x_a(t) = q_1(t), \\qquad x_b(t) = q_2(t)',
              isCorrect: false,
              feedback: 'q₁ and q₂ represent collective normal modes, not individual mass displacements.'
            }
          ],
          examTip: 'For any general initial conditions: (1) find q₁(0) and q₂(0), (2) write q₁(t) = q₁(0)cos(ω₁t), q₂(t) = q₂(0)cos(ω₂t), (3) recover positions via x_a = ½(q₁+q₂), x_b = ½(q₁-q₂)!'
        },
        sceneDirective: {
          chapter: 1,
          modeId: 'coupled-modes',
          abstractTab: 'normal-coords',
          highlightVector: 'mode',
          presetParams: { modeSelect: 2, couplingKc: 0.9 },
          caption: 'Antisymmetric Mode 2 (x_a = -x_b): The midpoint is a stationary NODE, and frequency ω₂ attains its highest value.'
        }
      }
    ],
    solvedExamples: [
      {
        id: 'ex-1-4',
        title: 'Longitudinal Normal Modes of a Linear Triatomic Molecule (CO₂)',
        bookRef: 'Berkeley Volume 3 · Classical Midterm Problem',
        problemStatement:
          'Consider a linear O=C=O molecule with central Carbon mass M flanked by two Oxygen masses m, connected by bonds of spring constant k. Derive the longitudinal normal mode frequencies.',
        strategy:
          'Three coordinates (x₁, x₂, x₃). Mode 1 has stationary center atom with Oxygen atoms moving in opposite directions. Mode 2 has Oxygen atoms moving together while Carbon moves oppositely to keep center of mass stationary (mx₁ + Mx₂ + mx₃ = 0).',
        stepsLatex: [
          {
            text: '1. Mode 1 (Symmetric Stretch: Carbon at rest x₂ = 0, Oxygens opposite x₁ = -x₃):',
            math: 'm\\ddot{x}_1 + kx_1 = 0 \\implies \\omega_1 = \\sqrt{\\frac{k}{m}}'
          },
          {
            text: '2. Mode 2 (Asymmetric Stretch: Stationary center of mass mx₁ + Mx₂ + mx₃ = 0 with x₁ = x₃):',
            math: 'x_2 = -\\frac{2m}{M}x_1 \\implies m\\ddot{x}_1 = -k(x_1 - x_2) = -k\\left(1 + \\frac{2m}{M}\\right)x_1 \\implies \\omega_2 = \\sqrt{\\frac{k}{m}\\left(1 + \\frac{2m}{M}\\right)}'
          }
        ],
        keyTakeaway:
          'Exploiting physical symmetry and center-of-mass conservation (∑ m_i x_i = 0) eliminates the need to expand a 3×3 determinant, yielding frequencies in two lines!'
      }
    ],
    commonTraps: [
      {
        trap: 'Assuming the center spring contributes K_c to k_eff in the antisymmetric mode (instead of 2K_c).',
        whyWrong: 'When left mass moves right by +x, right mass moves left by -x; the center spring compresses by a total of 2x!',
        correctApproach: 'The center spring exerts force -K_c(x_a - (-x_a)) = -2K_c x_a on each mass; hence ω₂² = (k + 2K_c)/m.'
      }
    ]
  },
  {
    id: 'mod-1-5',
    chapter: 1,
    code: '1.5',
    title: 'Beats and Energy Exchange in Weakly Coupled Systems',
    shortTitle: 'Beats & Energy Transfer',
    bookPages: 'Berkeley Volume 3 · Pages 21 – 26',
    summary:
      'We derive the phenomenon of beats arising from the superposition of two closely spaced frequencies (ω₁ and ω₂), and the 100% periodic exchange of energy E_a(t) ↔ E_b(t) between two weakly coupled pendulums (K_c ≪ k).',
    coreQuestion:
      'When two weakly coupled pendulums are released with only one displaced, why does the first pendulum periodically come to a complete standstill, transferring all its energy to the second?',
    fundamentalEquations: [
      {
        label: 'Modulation (Envelope) and Carrier Frequency Definitions',
        latex: '\\textcolor{#F7D147}{\\omega_{\\text{ort}}} = \\frac{\\omega_1 + \\omega_2}{2}, \\qquad \\textcolor{#B189DF}{\\omega_{\\text{mod}}} = \\frac{\\omega_2 - \\omega_1}{2}, \\qquad \\textcolor{#FC6255}{\\omega_{\\text{vuru}}} = |\\omega_2 - \\omega_1| = 2\\textcolor{#B189DF}{\\omega_{\\text{mod}}}',
        formulaLatex: '\\textcolor{#F7D147}{\\omega_{\\text{ort}}} = \\frac{\\omega_1 + \\omega_2}{2}, \\qquad \\textcolor{#B189DF}{\\omega_{\\text{mod}}} = \\frac{\\omega_2 - \\omega_1}{2}, \\qquad \\textcolor{#FC6255}{\\omega_{\\text{vuru}}} = |\\omega_2 - \\omega_1| = 2\\textcolor{#B189DF}{\\omega_{\\text{mod}}}',
        colorNote: 'Yellow: Fast carrier frequency | Purple: Amplitude envelope frequency | Red: Energy/Intensity beat frequency'
      },
      {
        label: 'Energy Exchange Equations in Weakly Coupled Pendulums',
        latex: '\\begin{aligned} \\textcolor{#58C4DD}{x_a(t)} &= x_0 \\cos(\\textcolor{#B189DF}{\\omega_{\\text{mod}}} t)\\cos(\\textcolor{#F7D147}{\\omega_{\\text{ort}}} t) \\implies E_a(t) = E_0 \\cos^2(\\textcolor{#B189DF}{\\omega_{\\text{mod}}} t) \\\\ \\textcolor{#83C167}{x_b(t)} &= x_0 \\sin(\\textcolor{#B189DF}{\\omega_{\\text{mod}}} t)\\sin(\\textcolor{#F7D147}{\\omega_{\\text{ort}}} t) \\implies E_b(t) = E_0 \\sin^2(\\textcolor{#B189DF}{\\omega_{\\text{mod}}} t) \\end{aligned}',
        formulaLatex: '\\begin{aligned} \\textcolor{#58C4DD}{x_a(t)} &= x_0 \\cos(\\textcolor{#B189DF}{\\omega_{\\text{mod}}} t)\\cos(\\textcolor{#F7D147}{\\omega_{\\text{ort}}} t) \\implies E_a(t) = E_0 \\cos^2(\\textcolor{#B189DF}{\\omega_{\\text{mod}}} t) \\\\ \\textcolor{#83C167}{x_b(t)} &= x_0 \\sin(\\textcolor{#B189DF}{\\omega_{\\text{mod}}} t)\\sin(\\textcolor{#F7D147}{\\omega_{\\text{ort}}} t) \\implies E_b(t) = E_0 \\sin^2(\\textcolor{#B189DF}{\\omega_{\\text{mod}}} t) \\end{aligned}',
        colorNote: 'E_a(t) + E_b(t) = E₀ (Total energy is conserved at all times!)'
      }
    ],
    symbolicTerms: [
      {
        id: 'term-weak-approx',
        label: 'Weak-Coupling Taylor Approximation (K_c ≪ k)',
        latexBadge: '\\omega_2 - \\omega_1 \\approx \\omega_1 \\frac{K_c}{k}',
        colorRole: 'coupling',
        description: 'For K_c ≪ k, the binomial expansion √(1 + 2K_c/k) ≈ 1 + K_c/k shows that beat frequency is directly proportional to coupling strength.',
        defaultActive: true,
        effectOnEquation: 'ω_beat = ω₂ - ω₁ ≈ ω₀ (K_c / k)',
        effectOnSpace: 'Many fast carrier oscillations fit inside each slow beat envelope cycle.',
        sceneParamKey: 'couplingKc',
        activeValue: 0.18,
        inactiveValue: 0.65
      }
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        title: 'Single-Displaced Initial Condition and Mode Superposition',
        subtitle: 'Decomposing x_a(0) = x₀, x_b(0) = 0 at t = 0 into two normal modes',
        physicalMotivation:
          'Displacing pendulum a by x₀ while holding pendulum b at x_b(0) = 0 gives initial normal coordinates q₁(0) = x₀ and q₂(0) = x₀, exciting both modes with EQUAL amplitude.',
        mainEquationLatex:
          '\\begin{aligned} \\textcolor{#58C4DD}{x_a(t)} &= \\frac{1}{2}x_0 [\\cos(\\omega_1 t) + \\cos(\\omega_2 t)] \\\\ \\textcolor{#83C167}{x_b(t)} &= \\frac{1}{2}x_0 [\\cos(\\omega_1 t) - \\cos(\\omega_2 t)] \\end{aligned}',
        algebraicBreakdown: [
          {
            subStepTitle: 'Step 1a: Sum-to-Product Trigonometric Transformation',
            explanation:
              'Substituting ω₁ = ω_avg - ω_mod and ω₂ = ω_avg + ω_mod and applying cos(α) ± cos(β) identities:',
            formulaLatex: '\\begin{aligned} \\textcolor{#58C4DD}{x_a(t)} &= \\underbrace{x_0 \\cos(\\textcolor{#B189DF}{\\omega_{\\text{mod}}} t)}_{A_a(t)\\text{ Zarfı}} \\cos(\\textcolor{#F7D147}{\\omega_{\\text{ort}}} t) \\\\ \\textcolor{#83C167}{x_b(t)} &= \\underbrace{x_0 \\sin(\\textcolor{#B189DF}{\\omega_{\\text{mod}}} t)}_{A_b(t)\\text{ Zarfı}} \\sin(\\textcolor{#F7D147}{\\omega_{\\text{ort}}} t) \\end{aligned}'
          },
          {
            subStepTitle: 'Step 1b: 90° Phase Lag and Direction of Energy Flow',
            explanation:
              'Notice x_b(t) lags x_a(t) by 90° (π/2) in both envelope and carrier. During the first half-beat, pendulum b lags pendulum a and draws energy from it.',
            formulaLatex: 't = \\frac{\\pi}{2\\omega_{\\text{mod}}} = \\frac{T_{\\text{vuru}}}{2} \\implies x_a = 0 \\text{ (Tamamen durur)}, \\; |A_b| = x_0 \\text{ (Tüm enerji b\'de!)}'
          }
        ],
        mathTrickIds: ['trick-trig-beats', 'trick-taylor'],
        trainerCheckpoint: {
          questionPrompt:
            'For a weakly coupled system (K_c ≪ k) with ω₁ = √(k/m) and ω₂ = √((k + 2K_c)/m), what is the first-order Taylor (binomial) approximation for beat frequency ω_beat = ω₂ - ω₁?',
          options: [
            {
              label: 'A',
              latex: '\\omega_{\\text{vuru}} \\approx \\omega_1 \\left(\\frac{K_c}{k}\\right)',
              isCorrect: true,
              feedback: 'Flawless! ω₂ = ω₁ √(1 + 2K_c/k) ≈ ω₁ (1 + ½ · 2K_c/k) = ω₁ + ω₁(K_c/k) ⇒ ω₂ - ω₁ ≈ ω₁(K_c/k).'
            },
            {
              label: 'B',
              latex: '\\omega_{\\text{vuru}} \\approx 2\\omega_1 \\left(\\frac{K_c}{k}\\right)',
              isCorrect: false,
              feedback: 'The factor of 1/2 from the binomial expansion cancels the factor of 2 in 2K_c!'
            },
            {
              label: 'C',
              latex: '\\omega_{\\text{vuru}} \\approx \\omega_1 \\sqrt{\\frac{2K_c}{k}}',
              isCorrect: false,
              feedback: '√(1 + ε) ≠ 1 + √ε! Taylor expansion gives √(1 + ε) ≈ 1 + ε/2.'
            }
          ],
          examTip: 'Crawford Equation (1.86): ω₂ - ω₁ ≈ ω₀(K_c/k) is one of the most frequently asked classical derivations on university physics midterms!'
        },
        sceneDirective: {
          chapter: 1,
          modeId: 'beats-energy',
          abstractTab: 'energy-beats',
          highlightVector: 'coupling',
          presetParams: { couplingKc: 0.18, omega0: 2.4 },
          caption: 'In weak coupling, energy E_a(t) and E_b(t) transfers continuously between pendulums with cos²(ω_mod t) and sin²(ω_mod t) envelopes.'
        }
      }
    ],
    solvedExamples: [
      {
        id: 'ex-1-5',
        title: 'Determining Coupling Spring Constant from Beat Period in Two Identical Pendulums',
        bookRef: 'Berkeley Volume 3 · Page 24 Example 13',
        problemStatement:
          'Two identical pendulums with natural frequency f₁ = 1.00 Hz are connected by a weak spring. Displacing one pendulum causes the other to reach maximum amplitude (with the first completely stopping) after 25 seconds. What is the Mode 2 frequency f₂?',
        strategy:
          'The time for the first pendulum to go from maximum to zero is HALF the beat period (T_beat / 2 = 25 s).',
        stepsLatex: [
          {
            text: '1. Full energy exchange period (beat period):',
            math: '\\frac{T_{\\text{vuru}}}{2} = 25\\text{ s} \\implies T_{\\text{vuru}} = 50\\text{ s} \\implies f_{\\text{vuru}} = \\frac{1}{50} = 0.02\\text{ Hz}'
          },
          {
            text: '2. Antisymmetric mode frequency f₂:',
            math: 'f_{\\text{vuru}} = f_2 - f_1 \\implies f_2 = 1.00 + 0.02 = 1.02\\text{ Hz}'
          }
        ],
        keyTakeaway:
          'The most common pitfall is mistaking the single transfer time for T_beat. Transferring A → B takes T_beat / 2; returning A → B → A takes the full T_beat!'
      }
    ],
    commonTraps: [
      {
        trap: 'Assuming the time for complete energy transfer from pendulum A to pendulum B is T_beat.',
        whyWrong: 'At t = 0, E_a is maximum. E_a first drops to zero when cos(ω_mod t) = 0 ⇒ ω_mod t = π/2, which corresponds to t = T_beat / 2!',
        correctApproach: 'A → B transfer time = T_beat / 2; A → B → A full cycle = T_beat = 1 / |f₂ - f₁|.'
      }
    ]
  }
];
