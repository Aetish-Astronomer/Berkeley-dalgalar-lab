import { ChapterModule } from '../types/curriculum';

export const CHAPTER_2_MODULES_EN: ChapterModule[] = [
  {
    id: 'mod-2-1',
    chapter: 2,
    code: '2.1',
    title: 'Continuous Limit (N → ∞) and Derivation of the Classical Wave Equation',
    shortTitle: 'Continuous Limit & Wave Equation',
    bookPages: 'Berkeley Volume 3 · Pages 31 – 35',
    summary:
      'Passing from discrete masses to a continuous string, we derive the net transverse force on an infinitesimal dx string element from slope differences (∂ψ/∂x), obtaining the Classical Wave Equation—one of the foundational partial differential equations in physics.',
    coreQuestion:
      'Why is the acceleration (∂²ψ/∂t²) at any point along a taut string proportional neither to its displacement (ψ) nor its slope (∂ψ/∂x), but strictly to its CURVATURE (second spatial derivative ∂²ψ/∂x²)?',
    fundamentalEquations: [
      {
        label: 'Net Transverse Force on an Infinitesimal dx String Element',
        latex: '\\textcolor{#FC6255}{dF_y} = T_0 \\left( \\left.\\frac{\\partial \\psi}{\\partial x}\\right|_{x+dx} - \\left.\\frac{\\partial \\psi}{\\partial x}\\right|_{x} \\right) = T_0 \\textcolor{#FC6255}{\\frac{\\partial^2 \\psi}{\\partial x^2}} dx',
        formulaLatex: '\\textcolor{#FC6255}{dF_y} = T_0 \\left( \\left.\\frac{\\partial \\psi}{\\partial x}\\right|_{x+dx} - \\left.\\frac{\\partial \\psi}{\\partial x}\\right|_{x} \\right) = T_0 \\textcolor{#FC6255}{\\frac{\\partial^2 \\psi}{\\partial x^2}} dx',
        colorNote: 'If slope is constant (straight line), left and right tensions cancel; net force arises exclusively from curvature (∂²ψ/∂x²)!'
      },
      {
        label: 'One-Dimensional Classical Wave Equation',
        latex: '\\textcolor{#FC6255}{\\frac{\\partial^2 \\psi(x,t)}{\\partial t^2}} = \\textcolor{#F7D147}{v^2} \\textcolor{#58C4DD}{\\frac{\\partial^2 \\psi(x,t)}{\\partial x^2}}, \\qquad \\textcolor{#F7D147}{v} = \\sqrt{\\frac{T_0}{\\rho_0}}',
        formulaLatex: '\\textcolor{#FC6255}{\\frac{\\partial^2 \\psi(x,t)}{\\partial t^2}} = \\textcolor{#F7D147}{v^2} \\textcolor{#58C4DD}{\\frac{\\partial^2 \\psi(x,t)}{\\partial x^2}}, \\qquad \\textcolor{#F7D147}{v} = \\sqrt{\\frac{T_0}{\\rho_0}}',
        colorNote: 'T₀: String tension (N), ρ₀: Linear mass density dm/dx (kg/m), v: Phase velocity (m/s)'
      }
    ],
    symbolicTerms: [
      {
        id: 'term-curvature-vec',
        label: 'Spatial Curvature (∂²ψ/∂x²) Vectors',
        latexBadge: 'T_0 \\frac{\\partial^2\\psi}{\\partial x^2}',
        colorRole: 'force',
        description: 'Where the string is concave upward (∂²ψ/∂x² > 0), net force points up; where concave downward (∂²ψ/∂x² < 0), net force points down.',
        defaultActive: true,
        effectOnEquation: 'ρ₀ dx (∂²ψ/∂t²) = T₀ (∂²ψ/∂x²) dx',
        effectOnSpace: 'Displays local curvature and acceleration vectors at each point along the 3D string.',
        sceneParamKey: 'showCurvatureVectors',
        activeValue: 1,
        inactiveValue: 0
      }
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        title: 'Free Body Diagram of an Infinitesimal [x, x + dx] String Element',
        subtitle: 'Crawford Equations (2.5) – (2.11): Right-hand and left-hand T₀ sin θ components',
        physicalMotivation:
          'Consider a small string element [x, x + dx] with linear mass density ρ₀ (dm = ρ₀ dx) and equilibrium tension T₀. The right end pulls upward with +T₀ sin θ(x+dx), while the left end pulls downward with -T₀ sin θ(x).',
        mainEquationLatex:
          '\\textcolor{#FC6255}{dF_y} = T_0 \\sin\\theta(x + dx) - T_0 \\sin\\theta(x) \\approx T_0 \\left[ \\left(\\frac{\\partial \\psi}{\\partial x}\\right)_{x+dx} - \\left(\\frac{\\partial \\psi}{\\partial x}\\right)_{x} \\right]',
        algebraicBreakdown: [
          {
            subStepTitle: 'Step 1a: Small-Slope Approximation (sin θ ≈ tan θ = ∂ψ/∂x)',
            explanation:
              'For small oscillations, angle θ ≪ 1 rad, so cos θ ≈ 1 (tension T₀ remains constant along the string) and sin θ ≈ tan θ = ∂ψ/∂x (local slope):',
            formulaLatex: '\\sin\\theta(x) = \\frac{\\tan\\theta}{\\sqrt{1 + \\tan^2\\theta}} \\approx \\tan\\theta = \\frac{\\partial \\textcolor{#58C4DD}{\\psi(x,t)}}{\\partial x}'
          },
          {
            subStepTitle: 'Step 1b: Taylor Expansion Transition to the Second Derivative',
            explanation:
              'Expanding f(x) ≡ ∂ψ/∂x about x + dx gives f(x+dx) - f(x) = (∂f/∂x) dx = (∂²ψ/∂x²) dx:',
            formulaLatex: '\\left(\\frac{\\partial \\psi}{\\partial x}\\right)_{x+dx} - \\left(\\frac{\\partial \\psi}{\\partial x}\\right)_{x} = \\frac{\\partial}{\\partial x}\\left(\\frac{\\partial \\psi}{\\partial x}\\right) dx = \\textcolor{#FC6255}{\\frac{\\partial^2 \\psi}{\\partial x^2}} dx'
          }
        ],
        mathTrickIds: ['trick-taylor'],
        trainerCheckpoint: {
          questionPrompt:
            'At a point on the string where displacement ψ(x₀, t) > 0 and slope ∂ψ/∂x ≠ 0, but SECOND DERIVATIVE (curvature) ∂²ψ/∂x² = 0 (the string is locally straight), what is the instantaneous acceleration of that dx element?',
          options: [
            {
              label: 'A',
              latex: '\\frac{\\partial^2 \\psi}{\\partial t^2} = 0 \\quad \\text{(Net force is zero, acceleration is zero!)}',
              isCorrect: true,
              feedback: 'Terrific! Even if tilted, if the string is straight (∂²ψ/∂x² = 0), upward pull at the right end exactly balances downward pull at the left end, leaving zero net force!'
            },
            {
              label: 'B',
              latex: '\\frac{\\partial^2 \\psi}{\\partial t^2} < 0 \\quad \\text{(Accelerates toward equilibrium)}',
              isCorrect: false,
              feedback: 'In a continuous string, what drives a segment toward equilibrium is not displacement ψ, but its curvature relative to neighbors (∂²ψ/∂x²).'
            },
            {
              label: 'C',
              latex: '\\frac{\\partial^2 \\psi}{\\partial t^2} \\propto \\frac{\\partial \\psi}{\\partial x}',
              isCorrect: false,
              feedback: 'Slope alone produces no net force; only the difference in slope across dx creates force.'
            }
          ],
          examTip: 'Summary of the wave equation: "Acceleration = (Velocity)² × Curvature". Without curvature (∂²ψ/∂x² = 0), net force is identically zero!'
        },
        sceneDirective: {
          chapter: 2,
          modeId: 'continuous-dx',
          abstractTab: 'dispersion',
          highlightVector: 'force',
          presetParams: { modeN: 2, numBeads: 24, showCurvatureVectors: 1 },
          caption: 'Tangential tension vectors T₀ on the dx string element and the resultant net dF_y force arising from slope differences.'
        }
      },
      {
        stepNumber: 2,
        title: 'Newton’s Second Law (dF_y = dm · a_y) and Phase Velocity Derivation',
        subtitle: 'Cancellation of dx factors and dimensional analysis of v = √(T₀/ρ₀)',
        physicalMotivation:
          'Equating net transverse force dF_y = T₀ (∂²ψ/∂x²) dx to mass dm = ρ₀ dx multiplied by acceleration ∂²ψ/∂t² gives the wave equation.',
        mainEquationLatex:
          '(\\rho_0 dx) \\textcolor{#FC6255}{\\frac{\\partial^2 \\psi}{\\partial t^2}} = T_0 \\textcolor{#58C4DD}{\\frac{\\partial^2 \\psi}{\\partial x^2}} dx \\implies \\frac{\\partial^2 \\psi}{\\partial t^2} = \\left(\\frac{T_0}{\\rho_0}\\right) \\frac{\\partial^2 \\psi}{\\partial x^2}',
        algebraicBreakdown: [
          {
            subStepTitle: 'Step 2a: Connecting the Discrete Bead Chain to the Continuous Limit',
            explanation:
              'Starting from beads of mass M spaced by a: dividing m_n ψ̈_n = (T₀/a)(ψ_{n+1} - 2ψ_n + ψ_{n-1}) by a and taking a → dx → 0 yields M/a → ρ₀ and (ψ_{n+1}-2ψ_n+ψ_{n-1})/a² → ∂²ψ/∂x²:',
            formulaLatex: '\\lim_{a \\to 0} \\frac{\\psi(x+a) - 2\\psi(x) + \\psi(x-a)}{a^2} = \\frac{\\partial^2 \\psi}{\\partial x^2}, \\qquad \\lim_{a \\to 0} \\frac{M}{a} = \\rho_0'
          }
        ],
        mathTrickIds: ['trick-separation'],
        trainerCheckpoint: {
          questionPrompt:
            'For a continuous spring vibrating longitudinally (total spring constant K, total length L, linear density ρ₀), what replaces tension T₀ in the wave equation?',
          options: [
            {
              label: 'A',
              latex: 'T_0 \\longrightarrow K L \\quad (\\text{or Young\'s modulus } Y \\cdot A_{\\text{cross}})',
              isCorrect: true,
              feedback: 'Congratulations! In a longitudinal spring, a piece of length dx has spring constant k_dx = K(L/dx), giving factor KL in place of T₀ in the wave equation.'
            },
            {
              label: 'B',
              latex: 'T_0 \\longrightarrow K',
              isCorrect: false,
              feedback: 'Check dimensions: T₀ is force (N), whereas K is N/m; multiplying K by length L gives units of force!'
            },
            {
              label: 'C',
              latex: 'T_0 \\longrightarrow \\frac{K}{L}',
              isCorrect: false,
              feedback: 'K/L has units N/m², which divided by ρ₀ (kg/m) does not yield velocity squared (m²/s²).'
            }
          ],
          examTip: 'Dimensional analysis is crucial: [T₀ / ρ₀] = [N / (kg/m)] = [(kg·m/s²) / (kg/m)] = m²/s² = v².'
        },
        sceneDirective: {
          chapter: 2,
          modeId: 'continuous-dx',
          abstractTab: 'dispersion',
          highlightVector: 'pos',
          presetParams: { modeN: 1, numBeads: 30, showCurvatureVectors: 1 },
          caption: 'In the continuous limit (a → 0), the dispersion relation becomes linear ω = vk, and all wavelengths travel at phase velocity v = √(T₀/ρ₀).'
        }
      }
    ],
    solvedExamples: [
      {
        id: 'ex-2-1',
        title: 'Independence of Wave Transit Time from Extension Length in a Slinky',
        bookRef: 'Berkeley Volume 3 · Page 38 & Home Experiment',
        problemStatement:
          'A loose Slinky spring of total mass M and spring constant K (with unstretched length L₀ ≪ L) is stretched between two supports to length L. Prove that the wave pulse transit time τ from one end to the other is independent of L!',
        strategy:
          'Substitute T₀ ≈ KL and linear mass density ρ₀ = M/L into v = √(T₀/ρ₀) to calculate τ = L / v.',
        stepsLatex: [
          {
            text: '1. Tension T₀ = K(L - L₀) ≈ KL and linear density ρ₀ = M / L:',
            math: 'v = \\sqrt{\\frac{T_0}{\\rho_0}} = \\sqrt{\\frac{K L}{M / L}} = L \\sqrt{\\frac{K}{M}}'
          },
          {
            text: '2. End-to-end transit time τ = L / v:',
            math: '\\tau = \\frac{L}{v} = \\frac{L}{L \\sqrt{K/M}} = \\sqrt{\\frac{M}{K}} = \\text{sabit (L\'den bağımsız!)}'
          }
        ],
        keyTakeaway:
          'Doubling spring length doubles the path distance, but because tension doubles and linear density halves, wave speed also exactly doubles—leaving transit time completely unchanged!'
      }
    ],
    commonTraps: [
      {
        trap: 'Confusing the transverse velocity of string particles with wave propagation speed v = √(T₀/ρ₀).',
        whyWrong: 'Particles do not move longitudinally along the string; they oscillate purely vertically at speed ∂ψ/∂t (proportional to amplitude). Wave velocity v depends solely on medium properties T₀ and ρ₀.',
        correctApproach: 'Particle velocity v_y = ∂ψ/∂t; wave phase velocity v = ω/k = √(T₀/ρ₀).'
      }
    ]
  },
  {
    id: 'mod-2-2',
    chapter: 2,
    code: '2.2',
    title: 'Normal Modes of Continuous Strings and Boundary Conditions (Fixed, Free, Mixed)',
    shortTitle: 'Standing Wave Modes & Boundary Conditions',
    bookPages: 'Berkeley Volume 3 · Pages 33 – 39',
    summary:
      'Using separation of variables, we reduce the partial differential wave equation to the spatial eigenvalue equation (d²A/dx² + k²A = 0) and derive allowed wavelengths (λ_n) and harmonic frequencies (ω_n) for Fixed-Fixed, Free-Free, and Fixed-Free boundary conditions.',
    coreQuestion:
      'While any frequency can propagate on an infinite string, why can only discrete (quantized) frequencies ω_n exist on a finite string of length L?',
    fundamentalEquations: [
      {
        label: 'Spatial Harmonic Differential Equation and General Solution',
        latex: '\\frac{d^2 A(x)}{dx^2} + \\textcolor{#F7D147}{k^2} A(x) = 0 \\implies \\textcolor{#58C4DD}{A(x)} = C\\sin(\\textcolor{#F7D147}{k}x) + D\\cos(\\textcolor{#F7D147}{k}x) \\quad \\left(\\textcolor{#F7D147}{k} = \\frac{\\omega}{v} = \\frac{2\\pi}{\\lambda}\\right)',
        formulaLatex: '\\frac{d^2 A(x)}{dx^2} + \\textcolor{#F7D147}{k^2} A(x) = 0 \\implies \\textcolor{#58C4DD}{A(x)} = C\\sin(\\textcolor{#F7D147}{k}x) + D\\cos(\\textcolor{#F7D147}{k}x) \\quad \\left(\\textcolor{#F7D147}{k} = \\frac{\\omega}{v} = \\frac{2\\pi}{\\lambda}\\right)',
        colorNote: 'Coefficients C and D as well as allowed k values are dictated entirely by boundary conditions at the ends'
      },
      {
        label: 'Quantization Rules: Fixed-Fixed vs Fixed-Free Ends',
        latex: '\\text{İki Uç Sabit: } \\lambda_n = \\frac{2L}{n}, \\; \\textcolor{#F7D147}{k_n = \\frac{n\\pi}{L}} \\quad (n=1,2,3\\dots) \\qquad \\text{Sabit-Serbest: } \\lambda_n = \\frac{4L}{2n-1}, \\; \\textcolor{#F7D147}{k_n = \\frac{(2n-1)\\pi}{2L}}',
        formulaLatex: '\\text{İki Uç Sabit: } \\lambda_n = \\frac{2L}{n}, \\; \\textcolor{#F7D147}{k_n = \\frac{n\\pi}{L}} \\quad (n=1,2,3\\dots) \\qquad \\text{Sabit-Serbest: } \\lambda_n = \\frac{4L}{2n-1}, \\; \\textcolor{#F7D147}{k_n = \\frac{(2n-1)\\pi}{2L}}',
        colorNote: 'In a fixed-free system (clarinet, quarter-wave antenna), EVEN harmonics are absent; only odd harmonics (1, 3, 5...) exist!'
      }
    ],
    symbolicTerms: [
      {
        id: 'term-right-boundary',
        label: 'Right Boundary Condition: Free End (∂ψ/∂x|_L = 0)',
        latexBadge: '\\left.\\frac{\\partial\\psi}{\\partial x}\\right|_{x=L} = 0',
        colorRole: 'mode',
        description: 'Switching the right end from fixed (ψ(L)=0: Node) to free (∂ψ/∂x(L)=0: Antinode) increases the fundamental wavelength from 2L to 4L and halves the fundamental frequency!',
        defaultActive: false,
        effectOnEquation: 'cos(kL) = 0 ⇒ k_n L = (n - ½)π ⇒ ω_n = (2n - 1)ω₁',
        effectOnSpace: 'The clamp at the right end is removed; the boundary oscillates with maximum amplitude (antinode).',
        sceneParamKey: 'boundaryCondition',
        activeValue: 1,
        inactiveValue: 0
      }
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        title: 'Normal Mode Ansatz ψ(x,t) = A(x)cos(ωt + φ) and Spatial Equation',
        subtitle: 'Reducing the partial differential equation to an ordinary differential equation',
        physicalMotivation:
          'In a normal mode, every particle along the string oscillates with identical frequency ω and phase. Substituting the product ansatz ψ(x,t) = A(x)cos(ωt + φ) separates time and space.',
        mainEquationLatex:
          '-\\omega^2 \\textcolor{#58C4DD}{A(x)}\\cos(\\omega t + \\phi) = v^2 \\frac{d^2 \\textcolor{#58C4DD}{A(x)}}{dx^2}\\cos(\\omega t + \\phi) \\implies \\frac{d^2 A(x)}{dx^2} + \\textcolor{#F7D147}{k^2} A(x) = 0 \\quad \\left(k \\equiv \\frac{\\omega}{v}\\right)',
        algebraicBreakdown: [
          {
            subStepTitle: 'Step 1a: Left Boundary Condition x = 0 (Fixed End: ψ(0,t) = 0)',
            explanation:
              'In general solution A(x) = C sin(kx) + D cos(kx), setting x = 0 forces A(0) = D = 0, eliminating the cosine term:',
            formulaLatex: 'A(0) = 0 \\implies D = 0 \\implies \\textcolor{#58C4DD}{A(x)} = C\\sin(kx)'
          },
          {
            subStepTitle: 'Step 1b: Right Boundary Condition x = L (Case 1: Fixed End vs Case 2: Free End)',
            explanation:
              'If x = L is fixed, A(L) = C sin(kL) = 0 ⇒ kL = nπ. If x = L is free, slope dA/dx|_L = Ck cos(kL) = 0 ⇒ kL = (n - ½)π:',
            formulaLatex: '\\begin{aligned} \\text{Sabit Uç } A(L)=0 &\\implies \\sin(kL) = 0 \\implies k_n = \\frac{n\\pi}{L}, \\quad \\lambda_n = \\frac{2L}{n} \\\\ \\text{Serbest Uç } A\'(L)=0 &\\implies \\cos(kL) = 0 \\implies k_n = \\frac{(2n-1)\\pi}{2L}, \\quad \\lambda_n = \\frac{4L}{2n-1} \\end{aligned}'
          }
        ],
        mathTrickIds: ['trick-separation'],
        trainerCheckpoint: {
          questionPrompt:
            'For a system of length L with BOTH ends FREE (dA/dx|_0 = 0 and dA/dx|_L = 0, such as an open organ pipe or free metal rod), what are the spatial eigenfunctions A_n(x) and wavenumbers k_n?',
          options: [
            {
              label: 'A',
              latex: 'A_n(x) = D_n \\cos\\!\\left(\\frac{n\\pi x}{L}\\right), \\qquad k_n = \\frac{n\\pi}{L} \\quad (n = 0, 1, 2\\dots)',
              isCorrect: true,
              feedback: 'Great! Zero slope at x = 0 eliminates sin(kx), retaining cos(kx). Zero slope at x = L yields dA/dx = -Dk sin(kL) = 0, again requiring k_n = nπ/L!'
            },
            {
              label: 'B',
              latex: 'A_n(x) = C_n \\sin\\!\\left(\\frac{n\\pi x}{L}\\right), \\qquad k_n = \\frac{n\\pi}{L}',
              isCorrect: false,
              feedback: 'sin(kx) has zero displacement at x = 0 (node) and maximum slope!'
            },
            {
              label: 'C',
              latex: 'k_n = \\frac{(2n-1)\\pi}{2L}',
              isCorrect: false,
              feedback: 'This formula applies to asymmetric (one fixed, one free) boundary conditions.'
            }
          ],
          examTip: 'Summary Rule: If both ends are the same type (Fixed-Fixed or Free-Free), λ_n = 2L/n (all harmonics present); if ends are mixed (Fixed-Free), λ_n = 4L/(2n-1) (only odd harmonics present)!'
        },
        sceneDirective: {
          chapter: 2,
          modeId: 'standing-modes',
          abstractTab: 'fourier-spectrum',
          highlightVector: 'mode',
          presetParams: { modeN: 3, boundaryCondition: 0 },
          caption: 'Standing wave normal modes: In the n-th mode (fixed ends), there are n antinodes (half-wavelength loops) and n-1 interior nodes along the string.'
        }
      }
    ],
    solvedExamples: [
      {
        id: 'ex-2-2',
        title: 'Acoustic Resonance in a Half-Filled Bottle / Pipe (Fixed-Free Boundary Condition)',
        bookRef: 'Berkeley Volume 3 · Page 37 Example 2',
        problemStatement:
          'In a cylindrical pipe or bottle of length L = 17 cm closed at one end and open at the other, with sound speed v = 340 m/s, what are the fundamental mode frequency f₁ and the first overtone frequency f₂?',
        strategy:
          'At the closed end, air displacement is zero (node: x = 0); at the open end, pressure variation is zero, making displacement an antinode (∂ψ/∂x|_L = 0).',
        stepsLatex: [
          {
            text: '1. In the fundamental mode (n = 1), pipe length equals one quarter of a wavelength (L = λ₁/4):',
            math: '\\lambda_1 = 4L = 4 \\times 0.17\\text{ m} = 0.68\\text{ m} \\implies f_1 = \\frac{v}{\\lambda_1} = \\frac{340}{0.68} = 500\\text{ Hz}'
          },
          {
            text: '2. The next allowed mode is the 3rd harmonic (L = 3λ₂/4):',
            math: 'f_{\\text{sonraki}} = 3 f_1 = 1500\\text{ Hz} \\quad (\\text{Çift harmonik } 1000\\text{ Hz mevcut değildir!})'
          }
        ],
        keyTakeaway:
          'In acoustic pipes, displacement ψ(x) and pressure fluctuation ΔP(x) = -B(∂ψ/∂x) are derivatives of each other; where displacement has a node, pressure has an antinode!'
      }
    ],
    commonTraps: [
      {
        trap: 'Confusing the number of nodes in the n-th normal mode with n.',
        whyWrong: 'On a string with both ends fixed, the n = 1 fundamental mode has zero interior nodes (2 boundary nodes, 0 interior nodes).',
        correctApproach: 'For fixed ends, the n-th harmonic possesses n ANTINODES and (n - 1) INTERIOR NODES (n + 1 total nodes including boundaries).'
      }
    ]
  },
  {
    id: 'mod-2-3',
    chapter: 2,
    code: '2.3',
    title: 'General Motion of Continuous Strings and Fourier Analysis',
    shortTitle: 'Fourier Analysis & Plucked Guitar String',
    bookPages: 'Berkeley Volume 3 · Pages 39 – 48',
    summary:
      'We represent the general motion of a string released from any initial profile ψ(x,0) as an infinite sum of normal modes, extract Fourier coefficients using orthogonality integrals, and derive the classic "plucked guitar string" midterm problem.',
    coreQuestion:
      'When a string plucked into a sharp triangular shape is released, how does an infinite sum of smooth sine waves reconstruct the sharp corner and describe its time evolution?',
    fundamentalEquations: [
      {
        label: 'Full General Fourier Series Solution for a Continuous String',
        latex: '\\textcolor{#58C4DD}{\\psi(x,t)} = \\sum_{n=1}^{\\infty} \\sin\\!\\left(\\frac{n\\pi x}{L}\\right) \\left[ \\textcolor{#F7D147}{A_n}\\cos(\\omega_n t) + \\textcolor{#83C167}{B_n}\\sin(\\omega_n t) \\right]',
        formulaLatex: '\\textcolor{#58C4DD}{\\psi(x,t)} = \\sum_{n=1}^{\\infty} \\sin\\!\\left(\\frac{n\\pi x}{L}\\right) \\left[ \\textcolor{#F7D147}{A_n}\\cos(\\omega_n t) + \\textcolor{#83C167}{B_n}\\sin(\\omega_n t) \\right]',
        colorNote: 'A_n coefficients are determined by initial position ψ(x,0); B_n coefficients by initial velocity ψ̇(x,0)'
      },
      {
        label: 'Fourier Coefficient Integrals (from Orthogonality)',
        latex: '\\textcolor{#F7D147}{A_n} = \\frac{2}{L}\\int_0^L \\psi(x,0)\\sin\\!\\left(\\frac{n\\pi x}{L}\\right)dx, \\qquad \\textcolor{#83C167}{B_n} = \\frac{2}{\\omega_n L}\\int_0^L \\dot{\\psi}(x,0)\\sin\\!\\left(\\frac{n\\pi x}{L}\\right)dx',
        formulaLatex: '\\textcolor{#F7D147}{A_n} = \\frac{2}{L}\\int_0^L \\psi(x,0)\\sin\\!\\left(\\frac{n\\pi x}{L}\\right)dx, \\qquad \\textcolor{#83C167}{B_n} = \\frac{2}{\\omega_n L}\\int_0^L \\dot{\\psi}(x,0)\\sin\\!\\left(\\frac{n\\pi x}{L}\\right)dx',
        colorNote: 'Whenever released from rest (ψ̇(x,0) = 0), all B_n coefficients vanish!'
      }
    ],
    symbolicTerms: [
      {
        id: 'term-fourier-harmonics',
        label: 'Include / Remove Higher Harmonics (n > 1)',
        latexBadge: '\\sum_{n=1}^{N_{\\max}} A_n \\sin(k_n x)',
        colorRole: 'mode',
        description: 'Retaining only n=1 yields a smooth sinusoidal shape; adding n=3, 5, 7... rapidly converges to the sharp triangular apex at rate 1/n².',
        defaultActive: true,
        effectOnEquation: 'A_n = (8h / π²n²) sin(nπ/2) → n = 1, 3, 5... (Even harmonics vanish)',
        effectOnSpace: 'Displays superposition of the first N harmonics on the 3D string and in the Fourier spectrum.',
        sceneParamKey: 'fourierMaxN',
        activeValue: 9,
        inactiveValue: 1
      }
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        title: 'Extracting Coefficient A_m via Orthogonality Integral',
        subtitle: 'Crawford Equations (2.35) – (2.44): Isolating a single term from an infinite sum',
        physicalMotivation:
          'For a string released from rest (ψ̇(x,0)=0 ⇒ B_n=0) with profile ψ(x,0) = ∑ A_n sin(nπx/L), multiply both sides by sin(mπx/L) and integrate from 0 to L.',
        mainEquationLatex:
          '\\int_0^L \\textcolor{#58C4DD}{\\psi(x,0)} \\sin\\!\\left(\\frac{m\\pi x}{L}\\right) dx = \\sum_{n=1}^{\\infty} A_n \\underbrace{\\int_0^L \\sin\\!\\left(\\frac{n\\pi x}{L}\\right)\\sin\\!\\left(\\frac{m\\pi x}{L}\\right) dx}_{\\frac{L}{2}\\delta_{nm}} = \\frac{L}{2} \\textcolor{#F7D147}{A_m}',
        algebraicBreakdown: [
          {
            subStepTitle: 'Step 1a: Kronecker Delta Property',
            explanation:
              'Every term with n ≠ m integrates to zero; only the n = m term contributes L/2:',
            formulaLatex: '\\textcolor{#F7D147}{A_m} = \\frac{2}{L} \\int_0^L \\psi(x,0) \\sin\\!\\left(\\frac{m\\pi x}{L}\\right) dx'
          }
        ],
        mathTrickIds: ['trick-orthogonality'],
        trainerCheckpoint: {
          questionPrompt:
            'A string of length L with fixed ends is released from rest with initial profile ψ(x,0) = 5 sin(πx/L) - 2 sin(3πx/L). Without calculating any integrals, what are A₁, A₂, and A₃?',
          options: [
            {
              label: 'A',
              latex: 'A_1 = 5, \\quad A_2 = 0, \\quad A_3 = -2 \\quad (\\text{and all other } A_n = 0)',
              isCorrect: true,
              feedback: 'Great! If the initial condition is already a finite combination of basis functions sin(nπx/L), the coefficients are read directly; no integration is required!'
            },
            {
              label: 'B',
              latex: 'A_1 = \\frac{10}{L}, \\quad A_3 = -\\frac{4}{L}',
              isCorrect: false,
              feedback: 'The integration factor L/2 cancels the 2/L prefactor, leaving coefficients 5 and -2.'
            },
            {
              label: 'C',
              latex: '\\text{An infinite number of harmonics are excited.}',
              isCorrect: false,
              feedback: 'Only the 1st and 3rd modes are excited, so the string oscillates exclusively as a superposition of these two frequencies.'
            }
          ],
          examTip: 'If an exam problem gives an initial profile with sin(nπx/L) or cos²(...), NEVER use integration by parts; use trigonometric identities to expand into sines and read the coefficients directly!'
        },
        sceneDirective: {
          chapter: 2,
          modeId: 'plucked-fourier',
          abstractTab: 'fourier-spectrum',
          highlightVector: 'pos',
          presetParams: { fourierMaxN: 9, pluckPosRatio: 0.5 },
          caption: 'Fourier synthesis of a center-plucked guitar string: Even harmonics (n=2,4,6...) are identically zero by symmetry.'
        }
      },
      {
        stepNumber: 2,
        title: 'Classic Midterm Derivation: Plucked Guitar String at Midpoint h',
        subtitle: 'Proof of A_n = (8h / π²n²) sin(nπ/2) for a triangular initial profile',
        physicalMotivation:
          'Pulling the midpoint x = L/2 upward by h creates a triangular profile ψ(x,0) = (2h/L)x on [0, L/2], symmetric on the right half.',
        mainEquationLatex:
          '\\textcolor{#F7D147}{A_n} = 2 \\times \\frac{2}{L} \\int_0^{L/2} \\left(\\frac{2h}{L}x\\right) \\sin\\!\\left(\\frac{n\\pi x}{L}\\right) dx = \\frac{8h}{\\pi^2 n^2} \\sin\\!\\left(\\frac{n\\pi}{2}\\right)',
        algebraicBreakdown: [
          {
            subStepTitle: 'Step 2a: Symmetry Cancellation of Even Harmonics',
            explanation:
              'When n is even, sin(nπx/L) is antisymmetric about x = L/2, making the integral over [0, L] vanish. When n is odd, the left and right integrals are equal:',
            formulaLatex: 'A_n = \\frac{8h}{L^2} \\int_0^{L/2} x \\sin(k_n x) dx'
          },
          {
            subStepTitle: 'Step 2b: Integration by Parts (∫ x sin(kx) dx = -x cos(kx)/k + sin(kx)/k²)',
            explanation:
              'For k_n = nπ/L with n odd, cos(nπ/2) = 0 causes the boundary term to vanish, leaving only sin(nπ/2) / k_n²:',
            formulaLatex: '\\textcolor{#58C4DD}{\\psi(x,t)} = \\frac{8h}{\\pi^2} \\left[ \\frac{1}{1^2}\\sin\\!\\left(\\frac{\\pi x}{L}\\right)\\cos(\\omega_1 t) - \\frac{1}{3^2}\\sin\\!\\left(\\frac{3\\pi x}{L}\\right)\\cos(3\\omega_1 t) + \\frac{1}{5^2}\\sin\\!\\left(\\frac{5\\pi x}{L}\\right)\\cos(5\\omega_1 t) - \\dots \\right]'
          }
        ],
        mathTrickIds: ['trick-orthogonality'],
        trainerCheckpoint: {
          questionPrompt:
            'If the guitar string is plucked at x₀ = L/3 instead of the center (L/2), which harmonics are GUARANTEED NOT to be excited (amplitude zero)?',
          options: [
            {
              label: 'A',
              latex: 'n = 3, 6, 9, \\dots \\quad (x = L/3 \\text{ noktasında düğümü olan tüm } 3k \\text{ harmonikleri!})',
              isCorrect: true,
              feedback: 'Superb physical insight! Plucking at a node of a mode does no work on that mode: A_n ∝ sin(nπ(L/3)/L) = sin(nπ/3) = 0 ⇒ n = 3, 6, 9...'
            },
            {
              label: 'B',
              latex: 'n = 2, 4, 6, \\dots',
              isCorrect: false,
              feedback: 'Even harmonics only vanish when the pluck is centered at x = L/2.'
            },
            {
              label: 'C',
              latex: '\\text{Hiçbir harmonik sıfır olmaz.}',
              isCorrect: false,
              feedback: 'Mode n = 3 has a node at x = L/3; plucking there cannot impart energy to it.'
            }
          ],
          examTip: 'General Rule: If plucked at x₀, A_n ∝ sin(nπ x₀ / L). Any mode with a node at x₀ (n x₀ / L = integer) has zero amplitude!'
        },
        sceneDirective: {
          chapter: 2,
          modeId: 'plucked-fourier',
          abstractTab: 'fourier-spectrum',
          highlightVector: 'mode',
          presetParams: { fourierMaxN: 9, pluckPosRatio: 0.333 },
          caption: 'Plucking at x₀ = L/3: Bars for harmonics n = 3, 6, 9 drop to exactly zero in the Fourier spectrum!'
        }
      }
    ],
    solvedExamples: [
      {
        id: 'ex-2-3',
        title: 'Parseval’s Theorem and Harmonic Energy Partitioning',
        bookRef: 'Berkeley Volume 3 · Chapter 2 Energy Analysis',
        problemStatement:
          'For a guitar string plucked by h at its center and released, what percentage of the total energy resides in the fundamental mode (n = 1)?',
        strategy:
          'Mode energy scales as E_n ∝ ω_n² A_n² ∝ n² (1/n²)² = 1/n². Total energy is given by Euler’s sum ∑_{n=1,3,5...} (1/n²) = π²/8.',
        stepsLatex: [
          {
            text: '1. Energy of each odd harmonic E_n ∝ k_n² A_n² ∝ n² · (1/n⁴) = 1/n²:',
            math: '\\frac{E_1}{E_{\\text{toplam}}} = \\frac{1 / 1^2}{\\sum_{n=1,3,5\\dots}^{\\infty} \\frac{1}{n^2}} = \\frac{1}{\\pi^2 / 8} = \\frac{8}{\\pi^2} \\approx 0.8106 \\; (\\%81.1)'
          }
        ],
        keyTakeaway:
          '81.1% of the total mechanical energy in a center-plucked string resides in the 1st harmonic (fundamental tone), and 9.0% in the 3rd harmonic!'
      }
    ],
    commonTraps: [
      {
        trap: 'Assuming mode energy decays as 1/n⁴ because amplitude A_n scales as 1/n².',
        whyWrong: 'Energy is E_n = ¼ M ω_n² A_n²; since ω_n = nω₁, E_n ∝ n²(1/n⁴) = 1/n²!',
        correctApproach: 'When computing modal energy, always remember to multiply A_n² by the frequency factor n².'
      }
    ]
  },
  {
    id: 'mod-2-4',
    chapter: 2,
    code: '2.4',
    title: 'Modes of an N-Degree-of-Freedom Discrete Lattice and the Dispersion Relation ω(k)',
    shortTitle: 'N-Bead String & ω(k) Dispersion',
    bookPages: 'Berkeley Volume 3 · Pages 49 – 58',
    summary:
      'The pinnacle of Chapter 2: We formulate the equations of motion for a discrete string of N beads of mass M spaced by a, deriving the celebrated dispersion relation ω(k) = 2ω₀ sin(ka/2) and the high-frequency cutoff.',
    coreQuestion:
      'In an atomic or discrete lattice, when wavelength decreases to the inter-bead spacing a, why does wave velocity drop and why can no wave propagate above cutoff frequency ω_max = 2√(T₀/Ma)?',
    fundamentalEquations: [
      {
        label: 'Equation of Motion of the n-th Bead (n = 1, 2, ..., N)',
        latex: 'M\\textcolor{#FC6255}{\\ddot{\\psi}_n} = \\frac{T_0}{a}(\\textcolor{#58C4DD}{\\psi_{n+1} - 2\\psi_n + \\psi_{n-1}})',
        formulaLatex: 'M\\textcolor{#FC6255}{\\ddot{\\psi}_n} = \\frac{T_0}{a}(\\textcolor{#58C4DD}{\\psi_{n+1} - 2\\psi_n + \\psi_{n-1}})',
        colorNote: 'The n-th bead interacts only with its nearest neighbors: right (n+1) and left (n-1)'
      },
      {
        label: 'Discrete Lattice Dispersion Relation',
        latex: '\\textcolor{#F7D147}{\\omega(k)} = 2\\sqrt{\\frac{T_0}{M a}} \\left|\\sin\\!\\left(\\frac{\\textcolor{#B189DF}{k a}}{2}\\right)\\right|, \\qquad k_m = \\frac{m\\pi}{(N+1)a} \\quad (m = 1, 2, \\dots, N)',
        formulaLatex: '\\textcolor{#F7D147}{\\omega(k)} = 2\\sqrt{\\frac{T_0}{M a}} \\left|\\sin\\!\\left(\\frac{\\textcolor{#B189DF}{k a}}{2}\\right)\\right|, \\qquad k_m = \\frac{m\\pi}{(N+1)a} \\quad (m = 1, 2, \\dots, N)',
        colorNote: 'Cutoff frequency ω_max = 2√(T₀/Ma) (ka = π, corresponding to zigzag mode λ_min = 2a!)'
      }
    ],
    symbolicTerms: [
      {
        id: 'term-discrete-n',
        label: 'Discrete Crystal Lattice (Small Bead Count N = 5 vs Continuous Limit)',
        latexBadge: 'N = 5 \\leftrightarrow N \\to \\infty',
        colorRole: 'coupling',
        description: 'For small N, only N discrete eigenvalue points lie on the ω(k) sine curve, which bends downward away from the linear ω = vk line (dispersion!).',
        defaultActive: true,
        effectOnEquation: 'ω_m = 2ω₀ sin(mπ / 2(N+1)), m = 1...N',
        effectOnSpace: 'Displays the N-bead lattice in 3D and the Brillouin dispersion curve below.',
        sceneParamKey: 'numBeads',
        activeValue: 6,
        inactiveValue: 24
      }
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        title: 'Force Balance and Difference Equation for the n-th Bead',
        subtitle: 'Crawford Equations (2.70) – (2.74): Slopes of left and right string segments',
        physicalMotivation:
          'At position x_n = n·a, the right segment exerts force +T₀(ψ_{n+1} - ψ_n)/a, while the left segment exerts -T₀(ψ_n - ψ_{n-1})/a on the n-th bead.',
        mainEquationLatex:
          'M\\textcolor{#FC6255}{\\ddot{\\psi}_n} = T_0\\left(\\frac{\\psi_{n+1} - \\psi_n}{a}\\right) - T_0\\left(\\frac{\\psi_n - \\psi_{n-1}}{a}\\right) = \\frac{T_0}{a}(\\textcolor{#58C4DD}{\\psi_{n+1} - 2\\psi_n + \\psi_{n-1}})',
        algebraicBreakdown: [
          {
            subStepTitle: 'Step 1a: Normal Mode Trial Solution ψ_n(t) = A_n cos(ωt)',
            explanation:
              'Assuming all beads oscillate with frequency ω yields -ω² A_n = (T₀/Ma)(A_{n+1} - 2A_n + A_{n-1}):',
            formulaLatex: '-\\omega^2 A_n = \\omega_0^2 (A_{n+1} - 2A_n + A_{n-1}) \\quad \\left(\\omega_0^2 \\equiv \\frac{T_0}{M a}\\right)'
          }
        ],
        mathTrickIds: ['trick-trig-beats'],
        trainerCheckpoint: {
          questionPrompt:
            'For N beads fixed at walls n = 0 and n = N + 1 (A₀ = 0 and A_{N+1} = 0), what is the appropriate spatial trial function A_n?',
          options: [
            {
              label: 'A',
              latex: 'A_n = A \\sin(n k a) \\quad \\text{ve} \\quad k_m a = \\frac{m\\pi}{N+1} \\;\\; (m=1,2,\\dots,N)',
              isCorrect: true,
              feedback: 'Flawless! At n = 0, sin(0) = 0 is satisfied automatically. At the wall n = N + 1, A_{N+1} = A sin((N+1)ka) = 0 gives ka = mπ/(N+1) quantization!'
            },
            {
              label: 'B',
              latex: 'A_n = A \\sin(n k a) \\quad \\text{ve} \\quad k_m a = \\frac{m\\pi}{N}',
              isCorrect: false,
              feedback: 'Watch out! N beads divide the string between two walls into N + 1 segments, not N (L = (N+1)a)!'
            },
            {
              label: 'C',
              latex: 'A_n = A \\cos(n k a)',
              isCorrect: false,
              feedback: 'A sine function is required so that A₀ = 0 at the left boundary.'
            }
          ],
          examTip: 'Most common exam trap: Total length of an N-bead string between fixed walls is L = (N + 1)a!'
        },
        sceneDirective: {
          chapter: 2,
          modeId: 'discrete-lattice',
          abstractTab: 'dispersion',
          highlightVector: 'mode',
          presetParams: { numBeads: 6, modeN: 2 },
          caption: 'N = 6 bead discrete lattice: Total length L = 7a has exactly N = 6 independent normal modes.'
        }
      },
      {
        stepNumber: 2,
        title: 'Complete Derivation of Dispersion Relation ω(k) = 2ω₀ sin(ka/2)',
        subtitle: 'Crawford Equations (2.77) – (2.82): Trigonometric simplification and Brillouin boundary',
        physicalMotivation:
          'Substitute A_n = A sin(nka) into the difference equation and apply identity A_{n+1} + A_{n-1} = 2 cos(ka) A_n.',
        mainEquationLatex:
          '-\\omega^2 A_n = \\omega_0^2 [2\\cos(ka) - 2] A_n = -4\\omega_0^2 \\sin^2\\!\\left(\\frac{ka}{2}\\right) A_n \\implies \\textcolor{#F7D147}{\\omega(k)} = 2\\omega_0 \\sin\\!\\left(\\frac{\\textcolor{#B189DF}{ka}}{2}\\right)',
        algebraicBreakdown: [
          {
            subStepTitle: 'Step 2a: Half-Angle Identity 1 - cos(ka) = 2 sin²(ka/2)',
            explanation:
              'Canceling A_n and taking the square root reveals the famous dispersion formula:',
            formulaLatex: '\\omega_m = 2\\sqrt{\\frac{T_0}{Ma}} \\sin\\!\\left(\\frac{m\\pi}{2(N+1)}\\right), \\qquad m = 1, 2, \\dots, N'
          },
          {
            subStepTitle: 'Step 2b: Long Wavelength (ka ≪ 1) Continuous Limit vs Short Wavelength (ka → π) Cutoff',
            explanation:
              'For ka ≪ 1 (λ ≫ a), sin(ka/2) ≈ ka/2 yields ω = v₀ k (linear, non-dispersive). At ka = π (λ_min = 2a, adjacent beads in opposite phase), frequency reaches cutoff ω_max = 2ω₀!',
            formulaLatex: 'ka \\ll 1 \\implies \\omega \\approx \\left(\\sqrt{\\frac{T_0 a}{M}}\\right) k, \\qquad ka = \\pi \\implies \\omega_{\\max} = 2\\sqrt{\\frac{T_0}{Ma}}'
          }
        ],
        mathTrickIds: ['trick-trig-beats', 'trick-taylor'],
        trainerCheckpoint: {
          questionPrompt:
            'In an N-bead lattice at the high-frequency cutoff (ka = π, λ = 2a), what is the ratio of phase velocity v_φ = ω/k to continuous limit speed v₀?',
          options: [
            {
              label: 'A',
              latex: '\\frac{v_\\phi(ka=\\pi)}{v_0} = \\frac{2}{\\pi} \\approx 0.637 \\quad (\\text{Faz hızı \\%36 düşer, grup hızı } d\\omega/dk = 0 \\text{ olur!})',
              isCorrect: true,
              feedback: 'Great! Since ω(k) = 2(v₀/a)sin(ka/2), v_φ = ω/k = v₀ [sin(ka/2)/(ka/2)]. At ka = π, this gives 2/π ≈ 0.637!'
            },
            {
              label: 'B',
              latex: '\\frac{v_\\phi}{v_0} = 1',
              isCorrect: false,
              feedback: 'The discrete lattice is dispersive; shorter wavelengths propagate more slowly than long wavelengths.'
            },
            {
              label: 'C',
              latex: '\\frac{v_\\phi}{v_0} = 0',
              isCorrect: false,
              feedback: 'Phase velocity (ω/k) is not zero at ka = π; group velocity (v_g = dω/dk) is zero!'
            }
          ],
          examTip: 'Phase velocity is v_φ = ω/k = v₀ sinc(ka/2), while group velocity (energy transport speed) is v_g = dω/dk = v₀ cos(ka/2). At ka = π, v_g = 0 (standing Bragg reflection)!'
        },
        sceneDirective: {
          chapter: 2,
          modeId: 'discrete-lattice',
          abstractTab: 'dispersion',
          highlightVector: 'coupling',
          presetParams: { numBeads: 6, modeN: 6 },
          caption: 'Cutoff mode (m = N): Adjacent beads oscillate in opposite directions (zigzag), ω(k) reaches its crest, and group velocity dω/dk drops to zero.'
        }
      }
    ],
    solvedExamples: [
      {
        id: 'ex-2-4',
        title: 'All Normal Frequencies and Amplitude Ratios for an N = 3 Bead String (Classic Midterm Problem)',
        bookRef: 'Berkeley Volume 3 · Page 53 & Problem 2.18',
        problemStatement:
          'For N = 3 identical beads of mass M spaced by a between two fixed walls, find the 3 normal frequencies (ω₁, ω₂, ω₃) and the relative bead amplitude ratios (A₁ : A₂ : A₃) for each mode.',
        strategy:
          'For N = 3, N + 1 = 4. Substitute k_m a = mπ/4 (m = 1, 2, 3) into ω_m = 2ω₀ sin(mπ/8) and A_n = sin(nmπ/4).',
        stepsLatex: [
          {
            text: '1. Mode 1 (m = 1, ka = π/4):',
            math: '\\omega_1 = 2\\omega_0 \\sin(\\pi/8) = \\omega_0\\sqrt{2 - \\sqrt{2}} \\approx 0.765\\omega_0, \\quad (A_1 : A_2 : A_3) = (\\sin\\tfrac{\\pi}{4} : \\sin\\tfrac{2\\pi}{4} : \\sin\\tfrac{3\\pi}{4}) = (1 : \\sqrt{2} : 1)'
          },
          {
            text: '2. Mode 2 (m = 2, ka = π/2):',
            math: '\\omega_2 = 2\\omega_0 \\sin(\\pi/4) = \\sqrt{2}\\omega_0 \\approx 1.414\\omega_0, \\quad (A_1 : A_2 : A_3) = (\\sin\\tfrac{\\pi}{2} : \\sin\\pi : \\sin\\tfrac{3\\pi}{2}) = (1 : 0 : -1)'
          },
          {
            text: '3. Mode 3 (m = 3, ka = 3π/4):',
            math: '\\omega_3 = 2\\omega_0 \\sin(3\\pi/8) = \\omega_0\\sqrt{2 + \\sqrt{2}} \\approx 1.848\\omega_0, \\quad (A_1 : A_2 : A_3) = (1 : -\\sqrt{2} : 1)'
          }
        ],
        keyTakeaway:
          'Using A_n = sin(nmπ/(N+1)) delivers the exact eigenmodes in 30 seconds without expanding 3×3 secular determinants!'
      }
    ],
    commonTraps: [
      {
        trap: 'Writing k_m a = mπ / N for an N-bead string.',
        whyWrong: 'The right boundary is at n = N + 1 (A_{N+1} = 0). Writing mπ/N forces the N-th bead to be permanently motionless!',
        correctApproach: 'Always use k_m a = mπ / (N + 1) for fixed boundary conditions.'
      }
    ]
  },
  {
    id: 'mod-2-5',
    chapter: 2,
    code: '2.5',
    title: 'Longitudinal Lattices, LC Transmission Lines (Low-Pass Filter), and Acoustic/Optical Branches',
    shortTitle: 'LC Transmission Line & Acoustic/Optical Modes',
    bookPages: 'Berkeley Volume 3 · Pages 58 – 63',
    summary:
      'Applying discrete lattice mathematics to longitudinal spring-mass chains, N-section LC coaxial transmission lines, and diatomic crystals (M₁, M₂ like NaCl), exploring Acoustic and Optical dispersion branches.',
    coreQuestion:
      'Why does an LC ladder transmission line pass signals freely up to cutoff frequency ω_max = 2/√(LC) while completely attenuating frequencies above it, behaving as a Low-Pass Filter?',
    fundamentalEquations: [
      {
        label: 'Discrete LC Transmission Line Kirchhoff Equation and Dispersion',
        latex: 'L\\textcolor{#FC6255}{\\ddot{Q}_n} = \\frac{1}{C}(\\textcolor{#58C4DD}{Q_{n+1} - 2Q_n + Q_{n-1}}) \\implies \\textcolor{#F7D147}{\\omega(k)} = \\frac{2}{\\sqrt{LC}}\\left|\\sin\\!\\left(\\frac{ka}{2}\\right)\\right|',
        formulaLatex: 'L\\textcolor{#FC6255}{\\ddot{Q}_n} = \\frac{1}{C}(\\textcolor{#58C4DD}{Q_{n+1} - 2Q_n + Q_{n-1}}) \\implies \\textcolor{#F7D147}{\\omega(k)} = \\frac{2}{\\sqrt{LC}}\\left|\\sin\\!\\left(\\frac{ka}{2}\\right)\\right|',
        colorNote: 'Under mechanical duality M ↔ L, T₀/a ↔ 1/C, the derivation is completed in a single line!'
      },
      {
        label: 'Acoustic and Optical Branches in a Diatomic (M₁, M₂) Crystal Lattice',
        latex: '\\textcolor{#F7D147}{\\omega_{\\pm}^2(k)} = K\\left(\\frac{1}{M_1} + \\frac{1}{M_2}\\right) \\pm K\\sqrt{\\left(\\frac{1}{M_1} + \\frac{1}{M_2}\\right)^2 - \\frac{4\\sin^2(ka)}{M_1 M_2}}',
        formulaLatex: '\\textcolor{#F7D147}{\\omega_{\\pm}^2(k)} = K\\left(\\frac{1}{M_1} + \\frac{1}{M_2}\\right) \\pm K\\sqrt{\\left(\\frac{1}{M_1} + \\frac{1}{M_2}\\right)^2 - \\frac{4\\sin^2(ka)}{M_1 M_2}}',
        colorNote: '(-) sign: Acoustic branch (ω→0 as k→0); (+) sign: Optical branch (high-frequency out-of-phase oscillation as k→0!)'
      }
    ],
    symbolicTerms: [
      {
        id: 'term-diatomic-mass',
        label: 'Diatomic Mass Difference (M₁ ≠ M₂: Optical Branch and Band Gap Opening)',
        latexBadge: 'M_1 \\neq M_2 \\implies \\Delta\\omega_{\\text{gap}}',
        colorRole: 'mode',
        description: 'When alternating beads have unequal masses (M₁ ≠ M₂), the dispersion curve splits, opening a forbidden "Band Gap" where no wave can propagate!',
        defaultActive: false,
        effectOnEquation: 'A forbidden band opens between ω_acoustic(max) = √(2K/M₁) and ω_optical(min) = √(2K/M₂).',
        effectOnSpace: 'Displays the Acoustic (lower) and Optical (upper) branches and the forbidden band gap on the dispersion plot.',
        sceneParamKey: 'diatomicRatio',
        activeValue: 2.2,
        inactiveValue: 1.0
      }
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        title: 'Formulation of the LC Ladder Network (Transmission Line) Equations',
        subtitle: 'Crawford Equations (2.94) – (2.99): Node voltages and inductor currents',
        physicalMotivation:
          'In a transmission line with series inductors L and shunt capacitors C to ground, let Q_n be the charge passing through the n-th inductor. Net charge on the n-th capacitor is q_n = Q_{n-1} - Q_n with voltage V_n = (Q_{n-1} - Q_n)/C.',
        mainEquationLatex:
          'L\\textcolor{#FC6255}{\\frac{d^2 Q_n}{dt^2}} = V_n - V_{n+1} = \\frac{Q_{n-1} - Q_n}{C} - \\frac{Q_n - Q_{n+1}}{C} = \\frac{1}{C}(\\textcolor{#58C4DD}{Q_{n+1} - 2Q_n + Q_{n-1}})',
        algebraicBreakdown: [
          {
            subStepTitle: 'Step 1a: Exact Identity with the Mechanical Bead String',
            explanation:
              'Substituting M → L and T₀/a → 1/C into M ψ̈_n = (T₀/a)(ψ_{n+1} - 2ψ_n + ψ_{n-1}) yields the identical dispersion relation without repeating the algebra:',
            formulaLatex: '\\textcolor{#F7D147}{\\omega(k)} = \\frac{2}{\\sqrt{LC}} \\sin\\!\\left(\\frac{ka}{2}\\right), \\qquad \\omega_{\\text{kesim}} = \\frac{2}{\\sqrt{LC}}'
          }
        ],
        mathTrickIds: ['trick-trig-beats'],
        trainerCheckpoint: {
          questionPrompt:
            'In a continuous coaxial cable (limit a → 0) with inductance per unit length L₀ = L/a and capacitance per unit length C₀ = C/a, what is the propagation speed v of electromagnetic waves?',
          options: [
            {
              label: 'A',
              latex: 'v = \\frac{1}{\\sqrt{L_0 C_0}}',
              isCorrect: true,
              feedback: 'Spot on! In the ka ≪ 1 limit, ω ≈ (2/√(LC))(ka/2) = ka / √(LC) = k / √((L/a)(C/a)) = k / √(L₀C₀) ⇒ v = ω/k = 1/√(L₀C₀).'
            },
            {
              label: 'B',
              latex: 'v = \\sqrt{\\frac{L_0}{C_0}}',
              isCorrect: false,
              feedback: '√(L₀/C₀) is characteristic impedance Z₀ (Ohms), not wave velocity!'
            },
            {
              label: 'C',
              latex: 'v = \\frac{2}{\\sqrt{L_0 C_0}}',
              isCorrect: false,
              feedback: 'The factor of 1/2 from sin(ka/2) ≈ ka/2 cancels the prefactor 2.'
            }
          ],
          examTip: 'In a transmission line: Wave velocity is v = 1/√(L₀C₀), while characteristic impedance is Z₀ = √(L₀/C₀). Never confuse the two!'
        },
        sceneDirective: {
          chapter: 2,
          modeId: 'discrete-lattice',
          abstractTab: 'dispersion',
          highlightVector: 'vel',
          presetParams: { numBeads: 10, modeN: 3, diatomicRatio: 1.0 },
          caption: 'The LC transmission line and the longitudinal crystal lattice share the exact same ω(k) = 2ω₀ sin(ka/2) dispersion curve.'
        }
      }
    ],
    solvedExamples: [
      {
        id: 'ex-2-5',
        title: 'Normal Frequencies of a 3-Mass Longitudinal Spring System with Free Ends',
        bookRef: 'Berkeley Volume 3 · Chapter 2 Problem 2.23',
        problemStatement:
          'Three identical masses M connected by springs of constant k oscillate on a frictionless horizontal plane with both ends FREE (not attached to walls). Find the three normal mode frequencies.',
        strategy:
          'With free ends, the system can translate as a rigid body (ω₁ = 0 mode). The other two modes correspond to symmetric and antisymmetric oscillations preserving the center of mass.',
        stepsLatex: [
          {
            text: '1. Mode 1 (Uniform Translation: x₁ = x₂ = x₃, no spring extension):',
            math: '\\omega_1 = 0'
          },
          {
            text: '2. Mode 2 (Center mass stationary x₂ = 0, outer masses opposite x₁ = -x₃):',
            math: 'M\\ddot{x}_1 = -k x_1 \\implies \\omega_2 = \\sqrt{\\frac{k}{M}}'
          },
          {
            text: '3. Mode 3 (Outer masses in phase x₁ = x₃ = 1, center mass opposite x₂ = -2):',
            math: 'M\\ddot{x}_1 = -k(x_1 - x_2) = -3k x_1 \\implies \\omega_3 = \\sqrt{\\frac{3k}{M}}'
          }
        ],
        keyTakeaway:
          'Any system with unconstrained (floating in space) boundaries possesses a zero-frequency translation mode (ω = 0) dictated by translational symmetry!'
      }
    ],
    commonTraps: [
      {
        trap: 'Assuming the cutoff frequency of an LC transmission line is f_max = 1 / (2π√(LC)).',
        whyWrong: 'A single LC circuit has resonance ω₀ = 1/√(LC), but in a periodic LC ladder where adjacent capacitors oscillate out of phase, ω_max = 2/√(LC) (double!).',
        correctApproach: 'In discrete lattices and LC ladder networks, the upper cutoff frequency is always ω_max = 2ω₀ = 2/√(LC).'
      }
    ]
  }
];
