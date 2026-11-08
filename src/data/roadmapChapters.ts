import { RoadmapChapter } from '../types/curriculum';

export const ROADMAP_CHAPTERS: RoadmapChapter[] = [
  {
    chapterNumber: 3,
    title: 'Bölüm 3: Zorla Salınımlar (Forced Oscillations)',
    englishTitle: 'Forced Oscillations, Resonance & Evanescent Modes',
    bookPages: 'Sayfa 69 – 107',
    status: 'ready_architecture',
    coreTheme:
      'Sönümlü harmonik salınganın periyodik sürücü kuvvet altındaki geçici (transient) ve kararlı hal (steady-state) tepkisi, soğurma ve esnek genlik (A_soğ, A_esn), rezonans yarı-genişliği Δω = γ = ω₀/Q ve kesim frekansının üzerinde zorlanan dizgede üstel sönümlü (evanescent) dalgalar.',
    keyDerivations: [
      {
        code: '3.2',
        title: 'Sönümlü Sürülen Salıngan: Esnek (Dispersif) ve Soğurma (Absorptif) Genlik Türetimi',
        governingEquationLatex: '\\ddot{x} + \\gamma\\dot{x} + \\omega_0^2 x = \\frac{F_0}{m}\\cos(\\omega t) \\implies A_{\\text{esn}} = \\frac{F_0}{m}\\frac{\\omega_0^2 - \\omega^2}{(\\omega_0^2-\\omega^2)^2 + \\gamma^2\\omega^2}, \\quad A_{\\text{soğ}} = \\frac{F_0}{m}\\frac{\\gamma\\omega}{(\\omega_0^2-\\omega^2)^2 + \\gamma^2\\omega^2}',
        physicalInsight: 'Rezonansta (ω = ω₀) esnek genlik sıfır olur, hız kuvvetle tam eş-fazlı hale gelir ve güç soğurulması maksimuma ulaşır.'
      },
      {
        code: '3.4',
        title: 'Kesim Frekansı Üstünde Zorlama ve Üstel (Evanescent) Dalgaların Türetimi',
        governingEquationLatex: '\\omega > \\omega_{\\max} = 2\\omega_0 \\implies \\psi_n(t) = A (-1)^n e^{-\\kappa n a} \\cos(\\omega t), \\quad \\cosh\\!\\left(\\frac{\\kappa a}{2}\\right) = \\frac{\\omega}{2\\omega_0}',
        physicalInsight: 'Bölüm 2.4’teki sin(ka/2) > 1 olduğunda dalga sayısı k karmaşık sayıya dönüşür ve dalga enerji taşımadan uzayda üstel olarak sönümlenir (Kuantum tünellemenin klasik karşılığı!).'
      }
    ]
  },
  {
    chapterNumber: 4,
    title: 'Bölüm 4: İlerleyen Dalgalar (Traveling Waves)',
    englishTitle: 'Traveling Waves, Phase Velocity & Characteristic Impedance',
    bookPages: 'Sayfa 108 – 154',
    status: 'ready_architecture',
    coreTheme:
      'Açık (sonsuz) ortamlarda ψ(x - vt) ilerleyen dalgaları, karakteristik empedans Z (kuvvetin hıza oranı F_y / v_y = Z), enerji akışı (güç P = Z v_y²) ve elektromanyetik/akustik dalgalarda kırılma indisi ve dispersiyon.',
    keyDerivations: [
      {
        code: '4.2',
        title: 'İlerleyen Dalgalarda Karakteristik Empedans Z = √(T₀ ρ₀) = T₀ / v Türetimi',
        governingEquationLatex: '\\psi(x,t) = A\\cos(\\omega t - kx) \\implies F_y = -T_0\\frac{\\partial\\psi}{\\partial x} = \\left(\\frac{T_0 k}{\\omega}\\right)\\frac{\\partial\\psi}{\\partial t} = Z\\,\\dot{\\psi} \\quad \\left(Z = \\sqrt{T_0\\rho_0}\\right)',
        physicalInsight: 'Duran dalgada konum ve hız 90° faz farklıyken, saf ilerleyen dalgada enine kuvvet F_y ile parçacık hızı ∂ψ/∂t TAM EŞ-FAZLIDIR ve oranları ortamın empedansı Z’dir!'
      }
    ]
  },
  {
    chapterNumber: 5,
    title: 'Bölüm 5: Yansıma ve Geçiş (Reflection)',
    englishTitle: 'Reflection, Transmission & Impedance Matching',
    bookPages: 'Sayfa 155 – 184',
    status: 'ready_architecture',
    coreTheme:
      'İki farklı ortam sınırında (Z₁ ve Z₂) süreklilik sınır koşullarından yansıma (R) ve geçiş (T) katsayılarının türetimi, empedans eşleştirme ve çeyrek dalga (λ/4) yansıma önleyici kaplamalar.',
    keyDerivations: [
      {
        code: '5.2',
        title: 'Sınır Koşullarından Yansıma R = (Z₁ - Z₂)/(Z₁ + Z₂) ve Geçiş T = 2Z₁/(Z₁ + Z₂) İspatı',
        governingEquationLatex: '\\psi_{\\text{gelen}} + \\psi_{\\text{yansıyan}} = \\psi_{\\text{geçen}}, \\quad Z_1(\\dot{\\psi}_{\\text{gelen}} - \\dot{\\psi}_{\\text{yansıyan}}) = Z_2\\dot{\\psi}_{\\text{geçen}} \\implies R_{12} = \\frac{Z_1 - Z_2}{Z_1 + Z_2}',
        physicalInsight: 'Yerdeğiştirme ve enine kuvvetin x = 0 sınırındaki sürekliliği, mekanikten optikteki Fresnel denklemlerine kadar tüm yansıma yasalarını tek başına türetir.'
      }
    ]
  },
  {
    chapterNumber: 6,
    title: 'Bölüm 6: Modülasyonlar, Atmalar ve Dalga Paketleri',
    englishTitle: 'Modulations, Pulses, Wave Packets & Group Velocity',
    bookPages: 'Sayfa 185 – 229',
    status: 'ready_architecture',
    coreTheme:
      'Faz hızı v_φ = ω/k ile grup hızı v_g = dω/dk arasındaki farkın türetimi, AM/FM modülasyonu, sürekli Fourier integrali ve Δx Δk ≥ 1/2 (Δt Δω ≥ 1/2) klasik/kuantum belirsizlik bağıntısı.',
    keyDerivations: [
      {
        code: '6.2',
        title: 'Grup Hızı v_g = dω/dk ve Belirsizlik İlkesi Δω · Δt ≥ 2π Türetimi',
        governingEquationLatex: 'v_g = \\left.\\frac{d\\omega}{dk}\\right|_{k_0} = v_\\phi + k\\frac{dv_\\phi}{dk}, \\qquad \\Delta k \\cdot \\Delta x \\ge 2\\pi',
        physicalInsight: 'Bilgi ve enerji faz hızıyla değil, dalga paketinin zarf hızı olan grup hızıyla (dω/dk) taşınır.'
      }
    ]
  },
  {
    chapterNumber: 7,
    title: 'Bölüm 7: İki ve Üç Boyutlu Dalgalar',
    englishTitle: 'Waves in Two and Three Dimensions',
    bookPages: 'Sayfa 230 – 271',
    status: 'ready_architecture',
    coreTheme:
      'Yayılma vektörü k⃗, 2B/3B dalga denklemi, Snell kırılma yasası, toplam iç yansıma, derin ve sığ su dalgaları (yerçekimi ve yüzey gerilimi dispersiyonu) ve Maxwell elektromanyetik dalga denklemleri.',
    keyDerivations: [
      {
        code: '7.4',
        title: 'Maxwell Denklemlerinden 3B Elektromanyetik Dalga Denklemi ve c = 1/√(μ₀ε₀) Türetimi',
        governingEquationLatex: '\\nabla \\times (\\nabla \\times \\mathbf{E}) = -\\mu_0\\epsilon_0\\frac{\\partial^2\\mathbf{E}}{\\partial t^2} \\implies \\nabla^2\\mathbf{E} = \\frac{1}{c^2}\\frac{\\partial^2\\mathbf{E}}{\\partial t^2}',
        physicalInsight: 'Değişen elektrik alanın manyetik alan, değişen manyetik alanın elektrik alan yaratması uzayda c hızıyla ilerleyen enine dalgaları doğurur.'
      }
    ]
  },
  {
    chapterNumber: 8,
    title: 'Bölüm 8: Kutuplanma (Polarization)',
    englishTitle: 'Polarization, Birefringence & Retarder Plates',
    bookPages: 'Sayfa 272 – 312',
    status: 'ready_architecture',
    coreTheme:
      'Doğrusal, dairesel ve eliptik polarizasyon durumları, Malus yasası (I = I₀ cos²θ), çift kırılma (birefringence), çeyrek dalga (λ/4) ve yarım dalga (λ/2) geciktirici plakalar, Brewster açısı.',
    keyDerivations: [
      {
        code: '8.3',
        title: 'Çift Kırıcı Kristallerde Δφ = (2π/λ)|n_e - n_o|d Faz Gecikmesi ve λ/4 Plakası',
        governingEquationLatex: '\\Delta\\phi = \\frac{\\omega}{c}(n_{\\text{yavaş}} - n_{\\text{hızlı}}) d = \\frac{\\pi}{2} \\implies d_{\\lambda/4} = \\frac{\\lambda_0}{4|n_e - n_o|}',
        physicalInsight: 'Bölüm 1.3’teki 2B Lissajous elipsi, optikte iki dik polarizasyon bileşeninin faz farkıyla birleşmesinin birebir aynısıdır!'
      }
    ]
  },
  {
    chapterNumber: 9,
    title: 'Bölüm 9: Girişim ve Kırınım (Interference and Diffraction)',
    englishTitle: 'Interference, Diffraction, Huygens Principle & Gratings',
    bookPages: 'Sayfa 313 – 378',
    status: 'ready_architecture',
    coreTheme:
      'Çift yarık (Young) girişimi, N-yarık fazör poligonu ve kırınım ağı (grating), tek yarık Fraunhofer kırınımı I(θ) = I₀ (sin β / β)², Rayleigh çözünürlük kriteri ve geometrik optik (Fermat ilkesi).',
    keyDerivations: [
      {
        code: '9.6',
        title: 'Tek Yarık Kırınımı Fazör İntegrali ve I(θ) = I₀ [sin(β)/β]² Türetimi',
        governingEquationLatex: 'E(\\theta) = \\int_{-D/2}^{D/2} \\frac{E_0}{D} e^{i k y \\sin\\theta} dy = E_0 \\frac{\\sin\\beta}{\\beta}, \\qquad \\beta \\equiv \\frac{1}{2}k D\\sin\\theta = \\frac{\\pi D\\sin\\theta}{\\lambda}',
        physicalInsight: 'Yarık içindeki sonsuz tane Huygens nokta kaynağının kompleks fazörlerinin integrali, kırınım desenindeki karanlık saçakları (D sin θ = mλ) verir.'
      }
    ]
  }
];

