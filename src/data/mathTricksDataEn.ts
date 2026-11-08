import { MathTrickItem } from '../types/curriculum';

export const MATH_TRICKS_EN: MathTrickItem[] = [
  {
    id: 'trick-taylor',
    title: 'Taylor Series Linearization and Small-Amplitude Approximation',
    badgeLabel: '🔍 Taylor & Small-Angle Proof',
    category: 'Analysis & Approximation',
    summary:
      'Almost no restoring force in nature (simple pendulum, molecular bond, transverse string tension) is strictly linear. The fundamental tool enabling us to obtain simple harmonic motion in physics is expanding the restoring force into a Taylor series about the equilibrium point x = 0 and neglecting higher-order terms (x², x³).',
    whenUsedInBerkeley:
      'Chapter 1.2 (Simple pendulum sin θ ≈ θ, Transverse spring oscillation √(L² + x²) binomial expansion), Chapter 1.5 (Weak coupling frequency √(1 + 2ε) ≈ 1 + ε), Chapter 2.1 (Continuous string slope sin θ ≈ tan θ ≈ ∂ψ/∂x).',
    coreIdentityLatex:
      'f(x) = f(0) + x f\'(0) + \\frac{x^2}{2!} f\'\'(0) + \\frac{x^3}{3!} f\'\'\'(0) + \\mathcal{O}(x^4)',
    stepByStepProof: [
      {
        title: '1. Expansion of a General Restoring Force Around Equilibrium',
        text: 'At the equilibrium position (x = 0), the net force vanishes: F(0) = 0. Expanding the force in a Taylor series about x = 0 yields:',
        latex: 'F(x) = \\underbrace{F(0)}_{0} + x \\left.\\frac{dF}{dx}\\right|_0 + \\frac{1}{2}x^2 \\left.\\frac{d^2F}{dx^2}\\right|_0 + \\dots \\approx -k_{\\text{eff}} x'
      },
      {
        title: '2. Trigonometric Small-Angle Approximations (Pendulum & String Slope)',
        text: 'For small angles in radians (θ ≪ 1), the series expansions for sin θ, tan θ, and cos θ are:',
        latex: '\\sin\\theta = \\theta - \\frac{\\theta^3}{6} + \\dots, \\quad \\cos\\theta = 1 - \\frac{\\theta^2}{2} + \\dots, \\quad \\tan\\theta = \\theta + \\frac{\\theta^3}{3} + \\dots'
      },
      {
        title: '3. Binomial Approximation (Transverse Spring & Weak Coupling Frequency)',
        text: 'For a small parameter ε ≪ 1, the first-order binomial expansion of (1 + ε)^p yields:',
        latex: '(1 + \\epsilon)^p = 1 + p\\epsilon + \\frac{p(p-1)}{2}\\epsilon^2 + \\dots \\implies \\sqrt{1 + \\epsilon} \\approx 1 + \\frac{1}{2}\\epsilon, \\quad \\frac{1}{\\sqrt{1+\\epsilon}} \\approx 1 - \\frac{1}{2}\\epsilon'
      }
    ],
    deadlyExamTrap:
      'EXAM TRAP: If the first-order term vanishes (for example, in a relaxed transverse spring where L₀ = L and first-order restoring forces cancel, or when calculating potential energy using cos θ), NEVER substitute cos θ ≈ 1! In energy and second-order length-change calculations, you MUST retain the second-order term (cos θ ≈ 1 - θ²/2); otherwise, the restoring force or potential well curvature will erroneously evaluate to zero.',
    interactiveDemoType: 'taylor'
  },
  {
    id: 'trick-phasor',
    title: 'Complex Exponential Representation (e^{iωt}) and the Quadratic Energy Trap',
    badgeLabel: '🔍 Complex Phasor & Euler Method',
    category: 'Complex Algebra',
    summary:
      'Instead of taking tedious trigonometric derivatives and sum identities, we represent oscillatory motion as the real projection of a rotating vector (phasor) in the complex plane. This transforms linear differential equations into elementary algebraic equations.',
    whenUsedInBerkeley:
      'Chapter 1.2 (Harmonic oscillator solution), Chapter 1.3 (Superposition of waves with phase shifts), Chapter 1.5 (Beat envelope), Chapters 2–9 (All wave propagation and physical optics equations).',
    coreIdentityLatex:
      'z(t) = A e^{i(\\omega t + \\phi)} = A\\cos(\\omega t + \\phi) + i A\\sin(\\omega t + \\phi), \\quad x(t) = \\text{Re}[z(t)]',
    stepByStepProof: [
      {
        title: '1. Conversion of Time Derivatives to Algebraic Factors',
        text: 'Thanks to Euler\'s formula, every time derivative corresponds to multiplying the phasor by iω (rotating it 90° counterclockwise in the complex plane and scaling by ω):',
        latex: '\\frac{d}{dt} z(t) = i\\omega z(t), \\qquad \\frac{d^2}{dt^2} z(t) = (i\\omega)^2 z(t) = -\\omega^2 z(t)'
      },
      {
        title: '2. Direct Substitution into Linear Differential Equations',
        text: 'Substituting z in place of x in m ẍ + b ẋ + kx = 0 allows the common time-harmonic factor e^{iωt} to factor out completely:',
        latex: '(-m\\omega^2 + i b\\omega + k) A e^{i(\\omega t + \\phi)} = 0 \\implies -m\\omega^2 + i b\\omega + k = 0'
      },
      {
        title: '3. Time-Averaged Energy Calculation',
        text: 'Given the complex amplitude Z = A e^{iφ}, the time-averaged value of the squared displacement over one full cycle is:',
        latex: '\\langle x^2(t) \\rangle = \\frac{1}{2} |z(t)|^2 = \\frac{1}{2} z \\cdot z^* = \\frac{1}{2} A^2'
      }
    ],
    deadlyExamTrap:
      'EXAM TRAP: When calculating kinetic or potential energy (½kx² or ½mv²), NEVER square the complex phasor first and then take the real part Re[z²]! Because Re[z₁ z₂] ≠ Re[z₁] · Re[z₂]. For nonlinear (quadratic) physical quantities like energy, ALWAYS take the real physical part first: x = Re[z] = A cos(ωt+φ), and ONLY THEN take the square!',
    interactiveDemoType: 'phasor'
  },
  {
    id: 'trick-determinant',
    title: 'Normal Coordinates, Eigenvalue Problems, and the Secular Determinant',
    badgeLabel: '🔍 Normal Coordinates & Determinants',
    category: 'Linear Algebra & Fourier',
    summary:
      'In coupled differential equations, the equation for x_a contains x_b, and the equation for x_b contains x_a. There are two equivalent methods to untangle this system: (1) Exploit symmetry by adding and subtracting equations pairwise (Normal Coordinates), or (2) Set the secular matrix determinant to zero to extract normal mode frequencies.',
    whenUsedInBerkeley:
      'Chapter 1.4 (Two masses with three springs, coupled pendulums, coupled LC circuits), Problems 1.14, 1.16, 1.20, and Chapter 2.4 (N-degree-of-freedom discrete lattice systems).',
    coreIdentityLatex:
      '\\det(\\mathbf{K} - \\omega^2 \\mathbf{M}) = \\begin{vmatrix} \\omega_0^2 - \\omega^2 & -\\kappa^2 \\\\ -\\kappa^2 & \\omega_0^2 - \\omega^2 \\end{vmatrix} = 0',
    stepByStepProof: [
      {
        title: '1. Method A — Sum and Difference Trick in Symmetric Systems (Normal Coordinates)',
        text: 'For two identical coupled oscillators with ẍ_a = -ω₀² x_a + κ² x_b and ẍ_b = -ω₀² x_b + κ² x_a, add (q₁ = x_a + x_b) and subtract (q₂ = x_a - x_b) the equations directly:',
        latex: '\\ddot{q}_1 = -(\\omega_0^2 - \\kappa^2) q_1 \\implies \\omega_1^2 = \\omega_0^2 - \\kappa^2, \\qquad \\ddot{q}_2 = -(\\omega_0^2 + \\kappa^2) q_2 \\implies \\omega_2^2 = \\omega_0^2 + \\kappa^2'
      },
      {
        title: '2. Method B — Secular Determinant for General Asymmetric Systems',
        text: 'When masses or spring constants are unequal (M_a ≠ M_b), substitute trial solutions x_a = A_a cos(ωt) and x_b = A_b cos(ωt) into matrix format:',
        latex: '\\begin{bmatrix} \\omega_{aa}^2 - \\omega^2 & -\\kappa_a^2 \\\\ -\\kappa_b^2 & \\omega_{bb}^2 - \\omega^2 \\end{bmatrix} \\begin{bmatrix} A_a \\\\ A_b \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 0 \\end{bmatrix}'
      },
      {
        title: '3. Non-Trivial Solution Condition and Eigenvector Ratio',
        text: 'For non-trivial solutions where A_a, A_b ≠ 0, the determinant of the coefficient matrix must vanish. Substituting the resulting roots ω₁, ω₂ back yields the eigenvector amplitude ratio A_b / A_a:',
        latex: '(\\omega_{aa}^2 - \\omega^2)(\\omega_{bb}^2 - \\omega^2) - \\kappa_a^2 \\kappa_b^2 = 0, \\qquad \\frac{A_b}{A_a} = \\frac{\\omega_{aa}^2 - \\omega_n^2}{\\kappa_a^2}'
      }
    ],
    deadlyExamTrap:
      'EXAM TRAP: NEVER attempt to match initial conditions (e.g. x_a(0) = x₀, x_b(0) = 0) to a single normal mode! General motion is ALWAYS a linear superposition of all normal modes: x_a(t) = C₁ cos(ω₁t) + C₂ cos(ω₂t). Initial conditions are applied only at the very end to determine the modal weighting coefficients C₁ and C₂.',
    interactiveDemoType: 'determinant'
  },
  {
    id: 'trick-trig-beats',
    title: 'Trigonometric Identities for Beats and Discrete Lattice Dispersion',
    badgeLabel: '🔍 Trig Sum-to-Product & Lattice Identity',
    category: 'Analysis & Approximation',
    summary:
      'Both the beat modulation envelope in Chapter 1.5 and the famous sin(ka/2) dispersion relation of the N-beaded string in Chapter 2.4 are derived from a single class of trigonometric sum-to-product identities originating from cos(α ± β) and sin(α ± β).',
    whenUsedInBerkeley:
      'Chapter 1.5 (Derivation of beat modulation envelope), Chapter 2.4 (Reduction of discrete second-difference ψ_{n+1} - 2ψ_n + ψ_{n-1} into -4 sin²(ka/2) ψ_n in beaded strings).',
    coreIdentityLatex:
      '\\sin(n+1)\\theta + \\sin(n-1)\\theta - 2\\sin(n\\theta) = 2\\sin(n\\theta)(\\cos\\theta - 1) = -4\\sin^2\\!\\left(\\frac{\\theta}{2}\\right)\\sin(n\\theta)',
    stepByStepProof: [
      {
        title: '1. Sum-to-Product Transition for Beat Modulation',
        text: 'Defining ω₁ t = (ω_avg - ω_mod)t and ω₂ t = (ω_avg + ω_mod)t, we expand the superposition cos(ω₁ t) + cos(ω₂ t):',
        latex: '\\cos(\\omega_1 t) + \\cos(\\omega_2 t) = 2 \\underbrace{\\cos\\!\\left(\\frac{\\omega_1 - \\omega_2}{2}t\\right)}_{\\text{Slow Envelope } A_{\\text{mod}}(t)} \\underbrace{\\cos\\!\\left(\\frac{\\omega_1 + \\omega_2}{2}t\\right)}_{\\text{Fast Carrier}}'
      },
      {
        title: '2. Sum of Neighboring Coordinates for Beaded String Lattice (Chapter 2.4 Derivation)',
        text: 'Let the spatial amplitude of the n-th bead be A_n = A sin(nka). Summing the right and left neighboring displacements (n+1 and n-1):',
        latex: 'A_{n+1} + A_{n-1} = A[\\sin(nka + ka) + \\sin(nka - ka)] = 2 A \\sin(nka) \\cos(ka) = 2 \\cos(ka) A_n'
      },
      {
        title: '3. Obtaining sin²(ka/2) via the Half-Angle Identity',
        text: 'In the equation of motion (A_{n+1} + A_{n-1} - 2A_n), applying the identity 1 - cos(ka) = 2 sin²(ka/2) cancels out A_n and directly yields the dispersion relation:',
        latex: 'A_{n+1} - 2A_n + A_{n-1} = 2(\\cos(ka) - 1) A_n = -4 \\sin^2\\!\\left(\\frac{ka}{2}\\right) A_n'
      }
    ],
    deadlyExamTrap:
      'EXAM TRAP: The perceived beat frequency (the frequency of heard acoustic intensity peaks) is NOT the envelope frequency |ω₁ - ω₂|/2! Because wave energy and intensity are proportional to the SQUARE of amplitude (cos²(ω_mod t)), the intensity peaks twice during every envelope modulation cycle; thus f_beat = |f₁ - f₂|.',
    interactiveDemoType: 'trig_lattice'
  },
  {
    id: 'trick-separation',
    title: 'Separation of Variables in PDEs and Boundary Condition Quantization',
    badgeLabel: '🔍 Separation of Variables & BCs',
    category: 'Differential Equations',
    summary:
      'The continuous wave equation ∂²ψ/∂t² = v² ∂²ψ/∂x² contains partial derivatives in both space (x) and time (t). Searching for normal modes means looking for product solutions ψ(x,t) = X(x)T(t) where every point along the continuous string oscillates synchronously with the identical harmonic time factor T(t).',
    whenUsedInBerkeley:
      'Chapter 2.2 (Standing wave normal modes of continuous strings, fixed and free boundary conditions), Chapter 7 (2D and 3D wave equations in membranes and cavity resonators).',
    coreIdentityLatex:
      '\\psi(x,t) = X(x)T(t) \\implies \\frac{1}{T(t)}\\frac{d^2 T}{dt^2} = \\frac{v^2}{X(x)}\\frac{d^2 X}{dx^2} = -\\omega^2 = \\text{sabit}',
    stepByStepProof: [
      {
        title: '1. Substituting Product Solution into Wave Equation and Dividing by X(x)T(t)',
        text: 'Writing ∂²ψ/∂t² = X(x) T̈(t) and ∂²ψ/∂x² = X\'\'(x) T(t) into the wave equation and dividing both sides by the product X(x)T(t):',
        latex: '\\underbrace{\\frac{1}{T(t)}\\frac{d^2 T(t)}{dt^2}}_{\\text{Only } t \\text{ function}} = \\underbrace{\\frac{v^2}{X(x)}\\frac{d^2 X(x)}{dx^2}}_{\\text{Only } x \\text{ function}} = -\\omega^2'
      },
      {
        title: '2. Why Both Separated Sides Must Equal an Identical Constant',
        text: 'The left-hand side is strictly independent of x, while the right-hand side is strictly independent of t. Varying t while holding x fixed cannot alter the right-hand side, so the left-hand side must also remain invariant. Thus, both sides must equal the identical separation constant (-ω²):',
        latex: '\\frac{d^2 T}{dt^2} + \\omega^2 T = 0, \\qquad \\frac{d^2 X}{dx^2} + k^2 X = 0 \\quad \\left(k \\equiv \\frac{\\omega}{v}\\right)'
      },
      {
        title: '3. Quantization of Wavenumber k_n via Boundary Conditions',
        text: 'At a fixed end, displacement vanishes: X(0) = 0, X(L) = 0 ⇒ sin(kL) = 0 ⇒ k_n = nπ/L. At a free end, the transverse slope (transverse restoring force) vanishes: dX/dx = 0:',
        latex: '\\text{Both Ends Fixed: } k_n = \\frac{n\\pi}{L} \\;\\; (n=1,2,3\\dots), \\qquad \\text{One Fixed One Free: } k_n = \\frac{(2n-1)\\pi}{2L}'
      }
    ],
    deadlyExamTrap:
      'EXAM TRAP: Setting X(L) = 0 for a "free end" is the single most common exam mistake! At a free boundary, the massless ring slides frictionlessly along the transverse rod; what vanishes is NOT displacement, but the transverse restoring force, meaning the spatial SLOPE of the string: (∂ψ/∂x)|_{x=L} = 0 (producing an antinode with maximum displacement!).',
    interactiveDemoType: 'separation'
  },
  {
    id: 'trick-orthogonality',
    title: 'Fourier Orthogonality Integral and Mode Coefficient Extraction',
    badgeLabel: '🔍 Fourier Orthogonality Proof',
    category: 'Linear Algebra & Fourier',
    summary:
      'In general string motion represented as an infinite superposition of normal modes ψ(x,0) = ∑ A_n sin(nπx/L), the miraculous mathematical property that solves this infinite system in a single step is the orthogonality of distinct spatial harmonics over the interval [0, L].',
    whenUsedInBerkeley:
      'Chapter 2.3 (General continuous string dynamics, Fourier coefficient calculation for plucked guitar strings), and Chapter 6 (Continuous Fourier transform and wave packet analysis).',
    coreIdentityLatex:
      '\\int_0^L \\sin\\!\\left(\\frac{n\\pi x}{L}\\right) \\sin\\!\\left(\\frac{m\\pi x}{L}\\right) dx = \\frac{L}{2} \\delta_{nm} = \\begin{cases} L/2 & n = m \\\\ 0 & n \\neq m \\end{cases}',
    stepByStepProof: [
      {
        title: '1. Proof That the Integral Vanishes When n ≠ m',
        text: 'Using the product-to-sum identity sin A sin B = ½ [cos(A - B) - cos(A + B)], we evaluate the integral directly:',
        latex: '\\frac{1}{2} \\int_0^L \\left[ \\cos\\!\\left(\\frac{(n-m)\\pi x}{L}\\right) - \\cos\\!\\left(\\frac{(n+m)\\pi x}{L}\\right) \\right] dx = \\left[ \\frac{L}{2(n-m)\\pi}\\sin((n-m)\\pi) - \\dots \\right]_0^L = 0'
      },
      {
        title: '2. Evaluation Yielding L/2 When n = m',
        text: 'When n = m, the first term becomes cos(0) = 1, integrating over [0, L] to yield L/2:',
        latex: '\\int_0^L \\sin^2\\!\\left(\\frac{n\\pi x}{L}\\right) dx = \\frac{1}{2} \\int_0^L \\left[1 - \\cos\\!\\left(\\frac{2n\\pi x}{L}\\right)\\right] dx = \\frac{L}{2} - 0 = \\frac{L}{2}'
      },
      {
        title: '3. The "Tweezer" Coefficient Extraction Operation',
        text: 'Multiplying both sides of ψ(x,0) = ∑_{n=1}^∞ A_n sin(nπx/L) by sin(mπx/L) and integrating from 0 to L isolates the single term where n = m from the infinite sum:',
        latex: '\\int_0^L \\psi(x,0) \\sin\\!\\left(\\frac{m\\pi x}{L}\\right) dx = \\sum_{n=1}^{\\infty} A_n \\underbrace{\\int_0^L \\sin\\!\\left(\\frac{n\\pi x}{L}\\right)\\sin\\!\\left(\\frac{m\\pi x}{L}\\right)dx}_{(L/2)\\delta_{nm}} = \\frac{L}{2} A_m \\implies A_m = \\frac{2}{L} \\int_0^L \\psi(x,0) \\sin\\!\\left(\\frac{m\\pi x}{L}\\right) dx'
      }
    ],
    deadlyExamTrap:
      'EXAM TRAP: The symmetry shortcut! If a string is plucked at its exact midpoint (x = L/2), its initial profile is symmetric about x = L/2. Even harmonics (n = 2, 4, 6...) have a NODE at x = L/2 and are antisymmetric. Without performing tedious integration by parts, you can state directly: "By symmetry, all even harmonics A₂ = A₄ = ... = 0", cutting computational effort in half!',
    interactiveDemoType: 'orthogonality'
  }
];
