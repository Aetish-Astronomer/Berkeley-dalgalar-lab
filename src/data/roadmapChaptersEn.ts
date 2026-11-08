import { RoadmapChapter } from '../types/curriculum';

export const ROADMAP_CHAPTERS_EN: RoadmapChapter[] = [
  {
    chapterNumber: 3,
    title: 'Chapter 3: Forced Oscillations',
    englishTitle: 'Forced Oscillations, Resonance & Evanescent Modes',
    bookPages: 'Pages 69 – 107',
    status: 'ready_architecture',
    coreTheme:
      'Transient and steady-state response of damped harmonic oscillators under periodic driving force, absorptive and elastic amplitudes (A_abs, A_el), resonance half-width Δω = γ = ω₀/Q, and evanescent modes in discrete lattices driven above the cutoff frequency.',
    keyDerivations: [
      {
        code: '3.2',
        title: 'Damped Driven Oscillator: Elastic (Dispersive) and Absorptive Amplitudes',
        governingEquationLatex: '\\ddot{x} + \\gamma\\dot{x} + \\omega_0^2 x = \\frac{F_0}{m}\\cos(\\omega t) \\implies A_{\\text{el}} = \\frac{F_0}{m}\\frac{\\omega_0^2 - \\omega^2}{(\\omega_0^2-\\omega^2)^2 + \\gamma^2\\omega^2}, \\quad A_{\\text{abs}} = \\frac{F_0}{m}\\frac{\\gamma\\omega}{(\\omega_0^2-\\omega^2)^2 + \\gamma^2\\omega^2}',
        physicalInsight: 'At resonance (ω = ω₀), elastic amplitude vanishes, velocity becomes purely in-phase with the driving force, and power absorption reaches its global maximum.'
      },
      {
        code: '3.4',
        title: 'Driving Above Cutoff Frequency and Derivation of Evanescent Waves',
        governingEquationLatex: '\\omega > \\omega_{\\max} = 2\\omega_0 \\implies \\psi_n(t) = A (-1)^n e^{-\\kappa n a} \\cos(\\omega t), \\quad \\cosh\\!\\left(\\frac{\\kappa a}{2}\\right) = \\frac{\\omega}{2\\omega_0}',
        physicalInsight: 'When sin(ka/2) > 1 as established in Section 2.4, wavenumber k becomes complex, causing waves to decay exponentially without transferring net energy (the classical counterpart of quantum tunneling!).'
      }
    ]
  },
  {
    chapterNumber: 4,
    title: 'Chapter 4: Traveling Waves',
    englishTitle: 'Traveling Waves, Phase Velocity & Characteristic Impedance',
    bookPages: 'Pages 108 – 154',
    status: 'ready_architecture',
    coreTheme:
      'Traveling waves ψ(x - vt) in open/unbounded media, characteristic impedance Z (ratio of transverse force to transverse velocity F_y / v_y = Z), power transmission (P = Z v_y²), and index of refraction and dispersion in electromagnetic and acoustic waves.',
    keyDerivations: [
      {
        code: '4.2',
        title: 'Derivation of Characteristic Impedance Z = √(T₀ ρ₀) = T₀ / v in Traveling Waves',
        governingEquationLatex: '\\psi(x,t) = A\\cos(\\omega t - kx) \\implies F_y = -T_0\\frac{\\partial\\psi}{\\partial x} = \\left(\\frac{T_0 k}{\\omega}\\right)\\frac{\\partial\\psi}{\\partial t} = Z\\,\\dot{\\psi} \\quad \\left(Z = \\sqrt{T_0\\rho_0}\\right)',
        physicalInsight: 'While displacement and velocity are 90° out of phase in a standing wave, in a pure traveling wave the transverse restoring force F_y and particle velocity ∂ψ/∂t are EXACTLY IN PHASE, with their ratio defining the characteristic impedance Z!'
      }
    ]
  },
  {
    chapterNumber: 5,
    title: 'Chapter 5: Reflection and Transmission',
    englishTitle: 'Reflection, Transmission & Impedance Matching',
    bookPages: 'Pages 155 – 184',
    status: 'ready_architecture',
    coreTheme:
      'Derivation of reflection (R) and transmission (T) coefficients from boundary continuity conditions across media impedance discontinuities (Z₁ and Z₂), impedance matching, and quarter-wave (λ/4) anti-reflective coatings.',
    keyDerivations: [
      {
        code: '5.2',
        title: 'Derivation of Reflection R = (Z₁ - Z₂)/(Z₁ + Z₂) and Transmission T = 2Z₁/(Z₁ + Z₂) from Boundary Continuity',
        governingEquationLatex: '\\psi_{\\text{inc}} + \\psi_{\\text{refl}} = \\psi_{\\text{trans}}, \\quad Z_1(\\dot{\\psi}_{\\text{inc}} - \\dot{\\psi}_{\\text{refl}}) = Z_2\\dot{\\psi}_{\\text{trans}} \\implies R_{12} = \\frac{Z_1 - Z_2}{Z_1 + Z_2}',
        physicalInsight: 'The continuity of displacement and transverse force across the boundary at x = 0 derives all wave reflection and transmission laws, from mechanics to Fresnel optics equations.'
      }
    ]
  },
  {
    chapterNumber: 6,
    title: 'Chapter 6: Modulations, Pulses and Wave Packets',
    englishTitle: 'Modulations, Pulses, Wave Packets & Group Velocity',
    bookPages: 'Pages 185 – 229',
    status: 'ready_architecture',
    coreTheme:
      'Derivation of the distinction between phase velocity v_φ = ω/k and group velocity v_g = dω/dk, AM/FM modulation, continuous Fourier integrals, and the classical/quantum uncertainty relation Δx Δk ≥ 2π (Δt Δω ≥ 2π).',
    keyDerivations: [
      {
        code: '6.2',
        title: 'Derivation of Group Velocity v_g = dω/dk and Classical Uncertainty Principle Δω · Δt ≥ 2π',
        governingEquationLatex: 'v_g = \\left.\\frac{d\\omega}{dk}\\right|_{k_0} = v_\\phi + k\\frac{dv_\\phi}{dk}, \\qquad \\Delta k \\cdot \\Delta x \\ge 2\\pi',
        physicalInsight: 'Information and energy are transported not at the phase velocity, but at the envelope velocity of the wave packet, known as the group velocity (dω/dk).'
      }
    ]
  },
  {
    chapterNumber: 7,
    title: 'Chapter 7: Two- and Three-Dimensional Waves',
    englishTitle: 'Waves in Two and Three Dimensions',
    bookPages: 'Pages 230 – 271',
    status: 'ready_architecture',
    coreTheme:
      'Propagation wavevector k⃗, 2D/3D wave equation, Snell\'s law of refraction, total internal reflection, deep and shallow water waves (gravity and surface tension dispersion), and Maxwell\'s electromagnetic wave equations.',
    keyDerivations: [
      {
        code: '7.4',
        title: 'Derivation of the 3D Electromagnetic Wave Equation and c = 1/√(μ₀ε₀) from Maxwell\'s Equations',
        governingEquationLatex: '\\nabla \\times (\\nabla \\times \\mathbf{E}) = -\\mu_0\\epsilon_0\\frac{\\partial^2\\mathbf{E}}{\\partial t^2} \\implies \\nabla^2\\mathbf{E} = \\frac{1}{c^2}\\frac{\\partial^2\\mathbf{E}}{\\partial t^2}',
        physicalInsight: 'A changing electric field creates a magnetic field, and a changing magnetic field creates an electric field, propagating through vacuum as transverse waves traveling at the speed of light c.'
      }
    ]
  },
  {
    chapterNumber: 8,
    title: 'Chapter 8: Polarization',
    englishTitle: 'Polarization, Birefringence & Retarder Plates',
    bookPages: 'Pages 272 – 312',
    status: 'ready_architecture',
    coreTheme:
      'Linear, circular, and elliptical polarization states, Malus\' law (I = I₀ cos²θ), birefringence in anisotropic crystals, quarter-wave (λ/4) and half-wave (λ/2) retardation plates, and Brewster\'s angle.',
    keyDerivations: [
      {
        code: '8.3',
        title: 'Phase Retardation Δφ = (2π/λ)|n_e - n_o|d in Birefringent Crystals and the Quarter-Wave (λ/4) Plate',
        governingEquationLatex: '\\Delta\\phi = \\frac{\\omega}{c}(n_{\\text{slow}} - n_{\\text{fast}}) d = \\frac{\\pi}{2} \\implies d_{\\lambda/4} = \\frac{\\lambda_0}{4|n_e - n_o|}',
        physicalInsight: 'The 2D Lissajous polarization ellipse introduced in Section 1.3 is the exact mechanical analog of combining two orthogonal polarization components with a relative phase delay!'
      }
    ]
  },
  {
    chapterNumber: 9,
    title: 'Chapter 9: Interference and Diffraction',
    englishTitle: 'Interference, Diffraction, Huygens Principle & Gratings',
    bookPages: 'Pages 313 – 378',
    status: 'ready_architecture',
    coreTheme:
      'Double-slit (Young) interference, N-slit phasor polygons and diffraction gratings, single-slit Fraunhofer diffraction I(θ) = I₀ (sin β / β)², Rayleigh criterion for angular resolution, and Fermat\'s principle in geometric optics.',
    keyDerivations: [
      {
        code: '9.6',
        title: 'Single-Slit Diffraction Phasor Integral and Derivation of I(θ) = I₀ [sin(β)/β]²',
        governingEquationLatex: 'E(\\theta) = \\int_{-D/2}^{D/2} \\frac{E_0}{D} e^{i k y \\sin\\theta} dy = E_0 \\frac{\\sin\\beta}{\\beta}, \\qquad \\beta \\equiv \\frac{1}{2}k D\\sin\\theta = \\frac{\\pi D\\sin\\theta}{\\lambda}',
        physicalInsight: 'Integrating the continuous complex phasors of infinite Huygens wavelet sources across the slit aperture produces the characteristic diffraction pattern with minima at D sin θ = mλ.'
      }
    ]
  }
];
