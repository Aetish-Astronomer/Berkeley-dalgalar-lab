import { ChapterModule } from '../types/curriculum';

export const CHAPTER_2_MODULES: ChapterModule[] = [
  {
    id: 'mod-2-1',
    chapter: 2,
    code: '2.1',
    title: 'Sürekli Limit (N → ∞) ve Klasik Dalga Denkleminin Türetimi',
    shortTitle: 'Sürekli Limit & Dalga Denklemi',
    bookPages: 'Berkeley Cilt 3 · Sayfa 31 – 35',
    summary:
      'Kesikli kütlelerden sürekli bir tele geçerken sonsuz küçük dx tel elemanına etkiyen net enine kuvveti eğim farkından (∂ψ/∂x) türetiyor ve fizik tarihinin en önemli kısmi diferansiyel denklemlerinden biri olan Klasik Dalga Denklemini elde ediyoruz.',
    coreQuestion:
      'Gergin bir telin bir noktasındaki ivme (∂²ψ/∂t²), neden telin o noktadaki yüksekliğiyle (ψ) ya da eğimiyle (∂ψ/∂x) değil de EĞRİLİĞİYLE (ikinci uzaysal türev ∂²ψ/∂x²) doğru orantılıdır?',
    fundamentalEquations: [
      {
        label: 'Sonsuz Küçük dx Tel Elemanına Etkiyen Net Enine Kuvvet',
        latex: '\\textcolor{#FC6255}{dF_y} = T_0 \\left( \\left.\\frac{\\partial \\psi}{\\partial x}\\right|_{x+dx} - \\left.\\frac{\\partial \\psi}{\\partial x}\\right|_{x} \\right) = T_0 \\textcolor{#FC6255}{\\frac{\\partial^2 \\psi}{\\partial x^2}} dx',
        formulaLatex: '\\textcolor{#FC6255}{dF_y} = T_0 \\left( \\left.\\frac{\\partial \\psi}{\\partial x}\\right|_{x+dx} - \\left.\\frac{\\partial \\psi}{\\partial x}\\right|_{x} \\right) = T_0 \\textcolor{#FC6255}{\\frac{\\partial^2 \\psi}{\\partial x^2}} dx',
        colorNote: 'Eğim sabitse (düz çizgi) sağ ve sol çekme kuvvetleri birbirini sıfırlar; net kuvvet sadece eğrilikten (∂²ψ/∂x²) doğar!'
      },
      {
        label: 'Bir Boyutlu Klasik Dalga Denklemi',
        latex: '\\textcolor{#FC6255}{\\frac{\\partial^2 \\psi(x,t)}{\\partial t^2}} = \\textcolor{#F7D147}{v^2} \\textcolor{#58C4DD}{\\frac{\\partial^2 \\psi(x,t)}{\\partial x^2}}, \\qquad \\textcolor{#F7D147}{v} = \\sqrt{\\frac{T_0}{\\rho_0}}',
        formulaLatex: '\\textcolor{#FC6255}{\\frac{\\partial^2 \\psi(x,t)}{\\partial t^2}} = \\textcolor{#F7D147}{v^2} \\textcolor{#58C4DD}{\\frac{\\partial^2 \\psi(x,t)}{\\partial x^2}}, \\qquad \\textcolor{#F7D147}{v} = \\sqrt{\\frac{T_0}{\\rho_0}}',
        colorNote: 'T₀: Tel gerilimi (N), ρ₀: Birim uzunluk başına kütle dm/dx (kg/m), v: Faz hızı (m/s)'
      }
    ],
    symbolicTerms: [
      {
        id: 'term-curvature-vec',
        label: 'Uzaysal Eğrilik (∂²ψ/∂x²) Vektörleri',
        latexBadge: 'T_0 \\frac{\\partial^2\\psi}{\\partial x^2}',
        colorRole: 'force',
        description: 'Telin çukur olduğu yerde (∂²ψ/∂x² > 0) net kuvvet yukarı, tepe olduğu yerde (∂²ψ/∂x² < 0) net kuvvet aşağı yönlüdür.',
        defaultActive: true,
        effectOnEquation: 'ρ₀ dx (∂²ψ/∂t²) = T₀ (∂²ψ/∂x²) dx',
        effectOnSpace: '3B tel üzerinde her noktanın yerel eğrilik ve ivme vektörlerini gösterir.',
        sceneParamKey: 'showCurvatureVectors',
        activeValue: 1,
        inactiveValue: 0
      }
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        title: 'Sonsuz Küçük [x, x + dx] Tel Elemanının Serbest Cisim Diyagramı',
        subtitle: 'Crawford Denklem (2.5) – (2.11): Sağ uç ve sol uçtaki T₀ sin θ bileşenleri',
        physicalMotivation:
          'Çizgisel kütle yoğunluğu ρ₀ (birim boyun kütlesi dm = ρ₀ dx) ve denge gerilimi T₀ olan bir telin [x, x + dx] aralığındaki küçük parçasını inceleyelim. Sağ uç +T₀ sin θ(x+dx) ile yukarı çekerken, sol uç -T₀ sin θ(x) ile aşağı çeker.',
        mainEquationLatex:
          '\\textcolor{#FC6255}{dF_y} = T_0 \\sin\\theta(x + dx) - T_0 \\sin\\theta(x) \\approx T_0 \\left[ \\left(\\frac{\\partial \\psi}{\\partial x}\\right)_{x+dx} - \\left(\\frac{\\partial \\psi}{\\partial x}\\right)_{x} \\right]',
        algebraicBreakdown: [
          {
            subStepTitle: 'Adım 1a: Küçük Eğim Yaklaşımı (sin θ ≈ tan θ = ∂ψ/∂x)',
            explanation:
              'Küçük salınımlarda telin yatayla yaptığı açı θ ≪ 1 radyan olduğundan cos θ ≈ 1 (tel boyuncaki T₀ gerilimi her yerde sabit kalır) ve sin θ ≈ tan θ = ∂ψ/∂x (yerel teğet eğimi) olur:',
            formulaLatex: '\\sin\\theta(x) = \\frac{\\tan\\theta}{\\sqrt{1 + \\tan^2\\theta}} \\approx \\tan\\theta = \\frac{\\partial \\textcolor{#58C4DD}{\\psi(x,t)}}{\\partial x}'
          },
          {
            subStepTitle: 'Adım 1b: Birinci Mertebe Taylor Açılımı ile İkinci Türeve Geçiş',
            explanation:
              'f(x) ≡ ∂ψ/∂x fonksiyonunu x + dx noktasında Taylor serisine açarsak f(x+dx) - f(x) = (∂f/∂x) dx = (∂²ψ/∂x²) dx elde edilir:',
            formulaLatex: '\\left(\\frac{\\partial \\psi}{\\partial x}\\right)_{x+dx} - \\left(\\frac{\\partial \\psi}{\\partial x}\\right)_{x} = \\frac{\\partial}{\\partial x}\\left(\\frac{\\partial \\psi}{\\partial x}\\right) dx = \\textcolor{#FC6255}{\\frac{\\partial^2 \\psi}{\\partial x^2}} dx'
          }
        ],
        mathTrickIds: ['trick-taylor'],
        trainerCheckpoint: {
          questionPrompt:
            'Telin bir noktasında yerdeğiştirme ψ(x₀, t) > 0 (yukarıda), eğim ∂ψ/∂x ≠ 0 ama İKİNCİ TÜREV (eğrilik) ∂²ψ/∂x² = 0 ise (yani tel o bölgede düz bir doğru parçasıysa) o noktadaki dx elemanının anlık ivmesi nedir?',
          options: [
            {
              label: 'A',
              latex: '\\frac{\\partial^2 \\psi}{\\partial t^2} = 0 \\quad \\text{(Net kuvvet sıfırdır, ivme sıfırdır!)}',
              isCorrect: true,
              feedback: 'Muazzam! Tel eğik bile olsa düz ise (∂²ψ/∂x² = 0), sağ uçtaki yukarı çekiş ile sol uçtaki aşağı çekiş eşit büyüklüktedir ve birbirini tam sıfırlar!'
            },
            {
              label: 'B',
              latex: '\\frac{\\partial^2 \\psi}{\\partial t^2} < 0 \\quad \\text{(Dengeye doğru ivmelenir)}',
              isCorrect: false,
              feedback: 'Sürekli telde parçacığı dengeye çağıran şey yüksekliği (ψ) değil, komşularına göre bükülme miktarı (∂²ψ/∂x²)’dir.'
            },
            {
              label: 'C',
              latex: '\\frac{\\partial^2 \\psi}{\\partial t^2} \\propto \\frac{\\partial \\psi}{\\partial x}',
              isCorrect: false,
              feedback: 'Tek başına eğim net kuvvet üretmez; iki uç arasındaki EĞİM FARKI kuvvet üretir.'
            }
          ],
          examTip: 'Dalga denkleminin özeti: "İvme = (Hız)² × Eğrilik". Tel bükülmemişse (∂²ψ/∂x² = 0) net kuvvet sıfırdır!'
        },
        sceneDirective: {
          chapter: 2,
          modeId: 'continuous-dx',
          abstractTab: 'dispersion',
          highlightVector: 'force',
          presetParams: { modeN: 2, numBeads: 24, showCurvatureVectors: 1 },
          caption: 'Sürekli tel üzerindeki dx elemanının iki ucundaki teğet gerilim vektörleri T₀ ve aralarındaki eğim farkından doğan net dF_y kuvveti.'
        }
      },
      {
        stepNumber: 2,
        title: 'Newton’un 2. Yasası (dF_y = dm · a_y) ve Faz Hızı Türetimi',
        subtitle: 'dx çarpanlarının sadeleşmesi ve v = √(T₀/ρ₀) boyut analizi',
        physicalMotivation:
          'Bulduğumuz net enine kuvveti dF_y = T₀ (∂²ψ/∂x²) dx, elemanın kütlesi dm = ρ₀ dx ile ivmesinin ∂²ψ/∂t² çarpımına eşitleriz.',
        mainEquationLatex:
          '(\\rho_0 dx) \\textcolor{#FC6255}{\\frac{\\partial^2 \\psi}{\\partial t^2}} = T_0 \\textcolor{#58C4DD}{\\frac{\\partial^2 \\psi}{\\partial x^2}} dx \\implies \\frac{\\partial^2 \\psi}{\\partial t^2} = \\left(\\frac{T_0}{\\rho_0}\\right) \\frac{\\partial^2 \\psi}{\\partial x^2}',
        algebraicBreakdown: [
          {
            subStepTitle: 'Adım 2a: Kesikli Kütle-Yay Zincirinden Sürekli Limite Geçiş Bağlantısı',
            explanation:
              'Eğer a aralıklı M kütleli boncuklardan başlasaydık: m_n ψ̈_n = (T₀/a)(ψ_{n+1} - 2ψ_n + ψ_{n-1}) denklemini a’ya bölüp a → dx → 0 limitini aldığımızda M/a → ρ₀ ve (ψ_{n+1}-2ψ_n+ψ_{n-1})/a² → ∂²ψ/∂x² olur!',
            formulaLatex: '\\lim_{a \\to 0} \\frac{\\psi(x+a) - 2\\psi(x) + \\psi(x-a)}{a^2} = \\frac{\\partial^2 \\psi}{\\partial x^2}, \\qquad \\lim_{a \\to 0} \\frac{M}{a} = \\rho_0'
          }
        ],
        mathTrickIds: ['trick-separation'],
        trainerCheckpoint: {
          questionPrompt:
            'Boyuna (longitudinal) salınan sürekli bir yayın (toplam yay sabiti K, toplam uzunluğu L, birim uzunluk kütlesi ρ₀) dalga denkleminde T₀ geriliminin yerini hangi büyüklük alır?',
          options: [
            {
              label: 'A',
              latex: 'T_0 \\longrightarrow K L \\quad (\\text{veya Young modülü } Y \\cdot A_{\\text{kesit}})',
              isCorrect: true,
              feedback: 'Tebrikler! Boyuna yayda dx uzunluğundaki parçanın yay sabiti k_dx = K(L/dx)’tir; bu da dalga denkleminde T₀ yerine KL çarpanını getirir.'
            },
            {
              label: 'B',
              latex: 'T_0 \\longrightarrow K',
              isCorrect: false,
              feedback: 'Boyut kontrolü: T₀ kuvvet (N) birimindedir, K ise N/m birimindedir; kuvvet boyutu için K·L çarpımı gerekir!'
            },
            {
              label: 'C',
              latex: 'T_0 \\longrightarrow \\frac{K}{L}',
              isCorrect: false,
              feedback: 'K/L birimi N/m² olur; ρ₀ (kg/m) ile bölününce hız karesi (m²/s²) vermez.'
            }
          ],
          examTip: 'Boyut analizi hayat kurtarır: [T₀ / ρ₀] = [N / (kg/m)] = [(kg·m/s²) / (kg/m)] = m²/s² = v².'
        },
        sceneDirective: {
          chapter: 2,
          modeId: 'continuous-dx',
          abstractTab: 'dispersion',
          highlightVector: 'pos',
          presetParams: { modeN: 1, numBeads: 30, showCurvatureVectors: 1 },
          caption: 'Sürekli limitte (a → 0) dispersiyon bağıntısı ω = v k doğrusu haline gelir ve tüm dalga boyları aynı v = √(T₀/ρ₀) hızıyla yayılır.'
        }
      }
    ],
    solvedExamples: [
      {
        id: 'ex-2-1',
        title: 'Slinky Yayda Dalga Geçiş Süresinin Yay Uzunluğundan Bağımsızlığı',
        bookRef: 'Berkeley Cilt 3 · Sayfa 38 & Ev Deneyi',
        problemStatement:
          'Kütleleri toplam M, yay sabiti K olan gevşek bir Slinky (L₀ ≪ L) iki ucundan L uzunluğuna kadar geriliyor. Bir uçtan diğer uca bir dalga darbesinin gitme süresi τ’nun gerilme uzunluğu L’den BAĞIMSIZ olduğunu ispatlayınız!',
        strategy:
          'Gevşek yayda T₀ ≈ KL ve çizgisel yoğunluk ρ₀ = M/L ifadelerini v = √(T₀/ρ₀) formülüne koyup τ = L / v süresini hesaplarız.',
        stepsLatex: [
          {
            text: '1. Gerilim T₀ = K(L - L₀) ≈ KL ve birim boy kütlesi ρ₀ = M / L:',
            math: 'v = \\sqrt{\\frac{T_0}{\\rho_0}} = \\sqrt{\\frac{K L}{M / L}} = L \\sqrt{\\frac{K}{M}}'
          },
          {
            text: '2. Boydan boya geçiş süresi τ = L / v:',
            math: '\\tau = \\frac{L}{v} = \\frac{L}{L \\sqrt{K/M}} = \\sqrt{\\frac{M}{K}} = \\text{sabit (L\'den bağımsız!)}'
          }
        ],
        keyTakeaway:
          'Yayı 2 kat uzattığında gideceği yol 2 katına çıkar ama gerilim arttığı ve yoğunluk azaldığı için dalga hızı da tam 2 katına çıkar; böylece varış süresi hiç değişmez!'
      }
    ],
    commonTraps: [
      {
        trap: 'Tel üzerindeki parçacıkların yatay hızını dalga hızı v = √(T₀/ρ₀) ile karıştırmak.',
        whyWrong: 'Parçacıklar yatayda hiç ilerlemez; sadece düşeyde ∂ψ/∂t hızıyla salınırlar (genliğe bağlıdır). Dalga hızı v ise sadece ortamın T₀ ve ρ₀ özelliklerine bağlıdır.',
        correctApproach: 'Parçacık hızı v_y = ∂ψ/∂t, dalga faz hızı ise v = ω/k = √(T₀/ρ₀)’dır.'
      }
    ]
  },
  {
    id: 'mod-2-2',
    chapter: 2,
    code: '2.2',
    title: 'Sürekli Tellerin Normal Kipleri ve Sınır Koşulları (Sabit, Serbest, Karışık)',
    shortTitle: 'Duran Dalga Kipleri & Sınır Koşulları',
    bookPages: 'Berkeley Cilt 3 · Sayfa 33 – 39',
    summary:
      'Değişkenlerine ayırma yöntemiyle kısmi diferansiyel dalga denklemini uzaysal özdeğer denklemine (d²A/dx² + k²A = 0) indirgiyor ve Sabit-Sabit, Serbest-Serbest ve Sabit-Serbest sınır koşulları için izinli dalga boylarını (λ_n) ve harmonik frekansları (ω_n) türetiyoruz.',
    coreQuestion:
      'Sonsuz uzunluktaki bir telde her frekans mümkünken, L uzunluğundaki sonlu bir telde neden sadece kesikli (kuantize) ω_n frekansları yaşayabilir?',
    fundamentalEquations: [
      {
        label: 'Uzaysal Harmonik Diferansiyel Denklem ve Genel Çözümü',
        latex: '\\frac{d^2 A(x)}{dx^2} + \\textcolor{#F7D147}{k^2} A(x) = 0 \\implies \\textcolor{#58C4DD}{A(x)} = C\\sin(\\textcolor{#F7D147}{k}x) + D\\cos(\\textcolor{#F7D147}{k}x) \\quad \\left(\\textcolor{#F7D147}{k} = \\frac{\\omega}{v} = \\frac{2\\pi}{\\lambda}\\right)',
        formulaLatex: '\\frac{d^2 A(x)}{dx^2} + \\textcolor{#F7D147}{k^2} A(x) = 0 \\implies \\textcolor{#58C4DD}{A(x)} = C\\sin(\\textcolor{#F7D147}{k}x) + D\\cos(\\textcolor{#F7D147}{k}x) \\quad \\left(\\textcolor{#F7D147}{k} = \\frac{\\omega}{v} = \\frac{2\\pi}{\\lambda}\\right)',
        colorNote: 'C ve D katsayıları ile izinli k değerleri tamamen uçlardaki sınır koşullarından belirlenir'
      },
      {
        label: 'Sabit-Sabit Uçlar vs Sabit-Serbest Uç Kuantizasyon Kuralları',
        latex: '\\text{İki Uç Sabit: } \\lambda_n = \\frac{2L}{n}, \\; \\textcolor{#F7D147}{k_n = \\frac{n\\pi}{L}} \\quad (n=1,2,3\\dots) \\qquad \\text{Sabit-Serbest: } \\lambda_n = \\frac{4L}{2n-1}, \\; \\textcolor{#F7D147}{k_n = \\frac{(2n-1)\\pi}{2L}}',
        formulaLatex: '\\text{İki Uç Sabit: } \\lambda_n = \\frac{2L}{n}, \\; \\textcolor{#F7D147}{k_n = \\frac{n\\pi}{L}} \\quad (n=1,2,3\\dots) \\qquad \\text{Sabit-Serbest: } \\lambda_n = \\frac{4L}{2n-1}, \\; \\textcolor{#F7D147}{k_n = \\frac{(2n-1)\\pi}{2L}}',
        colorNote: 'Sabit-Serbest sistemde (klarnet, çeyrek dalga anten) ÇİFT harmonikler yoktur; sadece 1, 3, 5... tek harmonikler oluşur!'
      }
    ],
    symbolicTerms: [
      {
        id: 'term-right-boundary',
        label: 'Sağ Uç Sınır Koşulu: Serbest Uç (∂ψ/∂x|_L = 0)',
        latexBadge: '\\left.\\frac{\\partial\\psi}{\\partial x}\\right|_{x=L} = 0',
        colorRole: 'mode',
        description: 'Sağ ucu sabit uçtan (ψ(L)=0: Düğüm) serbest uca (∂ψ/∂x(L)=0: Karın) çevirdiğimizde temel dalga boyu 2L’den 4L’ye çıkar ve frekans yarıya düşer!',
        defaultActive: false,
        effectOnEquation: 'cos(kL) = 0 ⇒ k_n L = (n - ½)π ⇒ ω_n = (2n - 1)ω₁',
        effectOnSpace: 'Sağ uçtaki kelepçe kalkar; uç nokta maksimum genlikle (antinode) salınır.',
        sceneParamKey: 'boundaryCondition',
        activeValue: 1,
        inactiveValue: 0
      }
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        title: 'Normal Kip Varsayımı ψ(x,t) = A(x)cos(ωt + φ) ve Uzaysal Denklem',
        subtitle: 'Kısmi diferansiyel denklemden adi diferansiyel denkleme geçiş',
        physicalMotivation:
          'Bir normal kipte tel üzerindeki her nokta aynı ω frekansıyla ve aynı fazda salınır. Bu yüzden ψ(x,t) = A(x)cos(ωt + φ) çarpım çözümünü dalga denklemine yazarız.',
        mainEquationLatex:
          '-\\omega^2 \\textcolor{#58C4DD}{A(x)}\\cos(\\omega t + \\phi) = v^2 \\frac{d^2 \\textcolor{#58C4DD}{A(x)}}{dx^2}\\cos(\\omega t + \\phi) \\implies \\frac{d^2 A(x)}{dx^2} + \\textcolor{#F7D147}{k^2} A(x) = 0 \\quad \\left(k \\equiv \\frac{\\omega}{v}\\right)',
        algebraicBreakdown: [
          {
            subStepTitle: 'Adım 1a: Sol Sınır Koşulu x = 0 (Sabit Uç: ψ(0,t) = 0)',
            explanation:
              'Genel çözüm A(x) = C sin(kx) + D cos(kx) içinde x = 0 koyduğumuzda A(0) = D = 0 çıkar. Böylece kosinüs terimi elenir:',
            formulaLatex: 'A(0) = 0 \\implies D = 0 \\implies \\textcolor{#58C4DD}{A(x)} = C\\sin(kx)'
          },
          {
            subStepTitle: 'Adım 1b: Sağ Sınır Koşulu x = L (Durum 1: Sabit Uç vs Durum 2: Serbest Uç)',
            explanation:
              'Eğer x = L ucu da sabitse A(L) = C sin(kL) = 0 ⇒ kL = nπ olur. Eğer x = L ucu serbestse eğim dA/dx|_L = Ck cos(kL) = 0 ⇒ kL = (n - ½)π olur:',
            formulaLatex: '\\begin{aligned} \\text{Sabit Uç } A(L)=0 &\\implies \\sin(kL) = 0 \\implies k_n = \\frac{n\\pi}{L}, \\quad \\lambda_n = \\frac{2L}{n} \\\\ \\text{Serbest Uç } A\'(L)=0 &\\implies \\cos(kL) = 0 \\implies k_n = \\frac{(2n-1)\\pi}{2L}, \\quad \\lambda_n = \\frac{4L}{2n-1} \\end{aligned}'
          }
        ],
        mathTrickIds: ['trick-separation'],
        trainerCheckpoint: {
          questionPrompt:
            'Her iki ucu da SERBEST olan (dA/dx|_0 = 0 ve dA/dx|_L = 0, örneğin iki ucu açık flüt borusu veya serbest metal çubuk) L uzunluğundaki bir sistemin uzaysal özfonksiyonları A_n(x) ve dalga sayıları k_n nedir?',
          options: [
            {
              label: 'A',
              latex: 'A_n(x) = D_n \\cos\\!\\left(\\frac{n\\pi x}{L}\\right), \\qquad k_n = \\frac{n\\pi}{L} \\quad (n = 0, 1, 2\\dots)',
              isCorrect: true,
              feedback: 'Harika! x = 0’da eğimin sıfır olması (dA/dx = 0) sin(kx) terimini eler ve cos(kx) bırakır. x = L’de dA/dx = -Dk sin(kL) = 0 şartı yine k_n = nπ/L verir!'
            },
            {
              label: 'B',
              latex: 'A_n(x) = C_n \\sin\\!\\left(\\frac{n\\pi x}{L}\\right), \\qquad k_n = \\frac{n\\pi}{L}',
              isCorrect: false,
              feedback: 'sin(kx) fonksiyonunun x = 0’da değeri sıfırdır (düğüm), eğimi ise maksimumdur!'
            },
            {
              label: 'C',
              latex: 'k_n = \\frac{(2n-1)\\pi}{2L}',
              isCorrect: false,
              feedback: 'Bu formül bir ucu sabit, diğer ucu serbest (asimetrik) sınır koşulu içindir.'
            }
          ],
          examTip: 'Özet Tablo: İki uç aynı tipse (Sabit-Sabit veya Serbest-Serbest) λ_n = 2L/n (tüm harmonikler var); iki uç farklı tipse (Sabit-Serbest) λ_n = 4L/(2n-1) (sadece tek harmonikler var)!'
        },
        sceneDirective: {
          chapter: 2,
          modeId: 'standing-modes',
          abstractTab: 'fourier-spectrum',
          highlightVector: 'mode',
          presetParams: { modeN: 3, boundaryCondition: 0 },
          caption: 'Sürekli telin normal kipleri: n. kipte (sabit uçlar) tel boyunca n adet yarım dalga (karın) ve n-1 adet iç düğüm noktası oluşur.'
        }
      }
    ],
    solvedExamples: [
      {
        id: 'ex-2-2',
        title: 'Yarım Dolu Şişe / Boru Akustik Rezonansı (Sabit-Serbest Sınır Koşulu)',
        bookRef: 'Berkeley Cilt 3 · Sayfa 37 Örnek 2',
        problemStatement:
          'Boyu L = 17 cm olan bir ucu kapalı (tabanı), bir ucu açık silindirik bir boruda (veya şişede) ses hızı v = 340 m/s iken temel kip frekansı f₁ ve ilk üst harmonik frekansı f₂ nedir?',
        strategy:
          'Kapalı uçta hava moleküllerinin yerdeğiştirmesi sıfırdır (düğüm: x=0), açık uçta ise basınç değişimi sıfır yani yerdeğiştirme maksimumdur (karın: ∂ψ/∂x|_L = 0).',
        stepsLatex: [
          {
            text: '1. Temel kipte (n = 1) boru boyu çeyrek dalga boyuna eşittir (L = λ₁/4):',
            math: '\\lambda_1 = 4L = 4 \\times 0.17\\text{ m} = 0.68\\text{ m} \\implies f_1 = \\frac{v}{\\lambda_1} = \\frac{340}{0.68} = 500\\text{ Hz}'
          },
          {
            text: '2. Bir sonraki izinli kip 3. harmoniktir (L = 3λ₂/4):',
            math: 'f_{\\text{sonraki}} = 3 f_1 = 1500\\text{ Hz} \\quad (\\text{Çift harmonik } 1000\\text{ Hz mevcut değildir!})'
          }
        ],
        keyTakeaway:
          'Akustik borularda yerdeğiştirme ψ(x) ile basınç değişimi ΔP(x) = -B(∂ψ/∂x) birbirinin türevidir; birinin düğüm olduğu yerde diğeri karındır!'
      }
    ],
    commonTraps: [
      {
        trap: 'n. normal kipte düğüm noktası sayısını n ile karıştırmak.',
        whyWrong: 'İki ucu sabit telde n = 1 (temel kip) için ortada hiç düğüm yoktur (uçlar hariç 0 iç düğüm, uçlar dahil 2 düğüm).',
        correctApproach: 'İki ucu sabit telde n. harmonikte n adet KARIN (antinode) ve (n - 1) adet İÇ DÜĞÜM (uçlar dahil n + 1 düğüm) bulunur.'
      }
    ]
  },
  {
    id: 'mod-2-3',
    chapter: 2,
    code: '2.3',
    title: 'Sürekli Tellerin Genel Hareketi ve Fourier Analizi',
    shortTitle: 'Fourier Analizi & Çekilen Gitar Teli',
    bookPages: 'Berkeley Cilt 3 · Sayfa 39 – 48',
    summary:
      'Herhangi bir başlangıç profiliyle ψ(x,0) çekilip bırakılan bir telin hareketini sonsuz normal kipin toplamı olarak yazıyor, sinüs fonksiyonlarının diklik (orthogonality) integraliyle Fourier katsayılarını çekiyor ve klasik "ortadan çekilen gitar teli" vize sorusunu tam türetiyoruz.',
    coreQuestion:
      'Köşeli (üçgen veya kare) bir başlangıç şekline sahip tel serbest bırakıldığında, pürüzsüz sinüs dalgalarının toplamı bu keskin köşeyi ve zaman evrimini nasıl oluşturur?',
    fundamentalEquations: [
      {
        label: 'Sürekli Telin Tam Genel Fourier Serisi Çözümü',
        latex: '\\textcolor{#58C4DD}{\\psi(x,t)} = \\sum_{n=1}^{\\infty} \\sin\\!\\left(\\frac{n\\pi x}{L}\\right) \\left[ \\textcolor{#F7D147}{A_n}\\cos(\\omega_n t) + \\textcolor{#83C167}{B_n}\\sin(\\omega_n t) \\right]',
        formulaLatex: '\\textcolor{#58C4DD}{\\psi(x,t)} = \\sum_{n=1}^{\\infty} \\sin\\!\\left(\\frac{n\\pi x}{L}\\right) \\left[ \\textcolor{#F7D147}{A_n}\\cos(\\omega_n t) + \\textcolor{#83C167}{B_n}\\sin(\\omega_n t) \\right]',
        colorNote: 'A_n katsayıları başlangıç konumundan ψ(x,0), B_n katsayıları başlangıç hızından ψ̇(x,0) belirlenir'
      },
      {
        label: 'Fourier Katsayı İntegralleri (Diklik Bağıntısından)',
        latex: '\\textcolor{#F7D147}{A_n} = \\frac{2}{L}\\int_0^L \\psi(x,0)\\sin\\!\\left(\\frac{n\\pi x}{L}\\right)dx, \\qquad \\textcolor{#83C167}{B_n} = \\frac{2}{\\omega_n L}\\int_0^L \\dot{\\psi}(x,0)\\sin\\!\\left(\\frac{n\\pi x}{L}\\right)dx',
        formulaLatex: '\\textcolor{#F7D147}{A_n} = \\frac{2}{L}\\int_0^L \\psi(x,0)\\sin\\!\\left(\\frac{n\\pi x}{L}\\right)dx, \\qquad \\textcolor{#83C167}{B_n} = \\frac{2}{\\omega_n L}\\int_0^L \\dot{\\psi}(x,0)\\sin\\!\\left(\\frac{n\\pi x}{L}\\right)dx',
        colorNote: 'Durgun (ψ̇(x,0) = 0) bırakılan her telde tüm B_n = 0 olur!'
      }
    ],
    symbolicTerms: [
      {
        id: 'term-fourier-harmonics',
        label: 'Yüksek Harmonikleri (n > 1) Ekle / Kaldır',
        latexBadge: '\\sum_{n=1}^{N_{\\max}} A_n \\sin(k_n x)',
        colorRole: 'mode',
        description: 'Sadece n=1 tutulduğunda tel yumuşak bir sinüstür; n=3, 5, 7... eklendikçe ortadaki keskin üçgen tepe noktası 1/n² hızıyla yakınsar.',
        defaultActive: true,
        effectOnEquation: 'A_n = (8h / π²n²) sin(nπ/2) → n = 1, 3, 5... (Çift harmonikler sıfır)',
        effectOnSpace: '3B telde ve Fourier spektrumunda ilk N harmoniğin üstüste binişini gösterir.',
        sceneParamKey: 'fourierMaxN',
        activeValue: 9,
        inactiveValue: 1
      }
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        title: 'Diklik (Orthogonality) İntegrali ile A_m Katsayısının Çekilmesi',
        subtitle: 'Crawford Denklem (2.35) – (2.44): Sonsuz toplamdan tek terimi izole etmek',
        physicalMotivation:
          't = 0 anında durgun (ψ̇(x,0)=0 ⇒ B_n=0) bırakılan telin başlangıç şekli ψ(x,0) = ∑ A_n sin(nπx/L) olsun. Her iki tarafı sin(mπx/L) ile çarpıp x = 0’dan L’ye integre edelim.',
        mainEquationLatex:
          '\\int_0^L \\textcolor{#58C4DD}{\\psi(x,0)} \\sin\\!\\left(\\frac{m\\pi x}{L}\\right) dx = \\sum_{n=1}^{\\infty} A_n \\underbrace{\\int_0^L \\sin\\!\\left(\\frac{n\\pi x}{L}\\right)\\sin\\!\\left(\\frac{m\\pi x}{L}\\right) dx}_{\\frac{L}{2}\\delta_{nm}} = \\frac{L}{2} \\textcolor{#F7D147}{A_m}',
        algebraicBreakdown: [
          {
            subStepTitle: 'Adım 1a: Kronecker Delta Özelliği',
            explanation:
              'Sonsuz toplamdaki n ≠ m olan tüm terimlerin integrali tam olarak sıfır verir; sadece n = m terimi L/2 verir:',
            formulaLatex: '\\textcolor{#F7D147}{A_m} = \\frac{2}{L} \\int_0^L \\psi(x,0) \\sin\\!\\left(\\frac{m\\pi x}{L}\\right) dx'
          }
        ],
        mathTrickIds: ['trick-orthogonality'],
        trainerCheckpoint: {
          questionPrompt:
            'İki ucu sabit L uzunluğundaki tel t = 0 anında ψ(x,0) = 5 sin(πx/L) - 2 sin(3πx/L) şeklinde tutulup durgun bırakılıyor. İntegral almadan A₁, A₂, A₃ katsayılarını söyleyebilir misin?',
          options: [
            {
              label: 'A',
              latex: 'A_1 = 5, \\quad A_2 = 0, \\quad A_3 = -2 \\quad (\\text{ve diğer tüm } A_n = 0)',
              isCorrect: true,
              feedback: 'Harika! Başlangıç fonksiyonu zaten sin(nπx/L) baz fonksiyonlarının sonlu bir toplamıysa, katsayıları doğrudan önlerindeki sayılardır; integral almaya hiç gerek yoktur!'
            },
            {
              label: 'B',
              latex: 'A_1 = \\frac{10}{L}, \\quad A_3 = -\\frac{4}{L}',
              isCorrect: false,
              feedback: 'İntegralden gelen L/2 ile 2/L birbirini götürür; katsayılar doğrudan 5 ve -2 kalır.'
            },
            {
              label: 'C',
              latex: '\\text{Sonsuz tane harmonik oluşur.}',
              isCorrect: false,
              feedback: 'Sadece 1. ve 3. kip uyarıldığı için tel sonsuza dek sadece bu iki frekansın toplamıyla salınır.'
            }
          ],
          examTip: 'Sınavda başlangıç koşulu sin(nπx/L) veya cos²(...) gibi trigonometrik verilirse ASLA kısmi integrasyona girme; trigonometrik özdeşlikle sin(nπx/L) toplamına çevir ve katsayıları doğrudan oku!'
        },
        sceneDirective: {
          chapter: 2,
          modeId: 'plucked-fourier',
          abstractTab: 'fourier-spectrum',
          highlightVector: 'pos',
          presetParams: { fourierMaxN: 9, pluckPosRatio: 0.5 },
          caption: 'Tam ortasından çekilip bırakılan gitar telinin Fourier sentezi: Çift harmonikler (n=2,4,6...) simetri gereği sıfırdır.'
        }
      },
      {
        stepNumber: 2,
        title: 'Klasik Vize Türetimi: Ortadan h Kadar Çekilen Gitar Telinin Fourier Açılımı',
        subtitle: 'Üçgen başlangıç profili için A_n = (8h / π²n²) sin(nπ/2) ispatı',
        physicalMotivation:
          'Telin orta noktası x = L/2’den h kadar yukarı çekildiğinde oluşan üçgen profil sol yarıda [0, L/2] için ψ(x,0) = (2h/L)x, sağ yarıda ise simetriktir.',
        mainEquationLatex:
          '\\textcolor{#F7D147}{A_n} = 2 \\times \\frac{2}{L} \\int_0^{L/2} \\left(\\frac{2h}{L}x\\right) \\sin\\!\\left(\\frac{n\\pi x}{L}\\right) dx = \\frac{8h}{\\pi^2 n^2} \\sin\\!\\left(\\frac{n\\pi}{2}\\right)',
        algebraicBreakdown: [
          {
            subStepTitle: 'Adım 2a: Çift Harmoniklerin Simetriden Elenmesi ve İntegralin İkiye Katlanması',
            explanation:
              'n çift olduğunda sin(nπx/L) fonksiyonu x = L/2 etrafında antisimetriktir; dolayısıyla [0, L] integrali sıfır olur. n tek olduğunda ise sol yarı ile sağ yarı integrali birbirine eşittir:',
            formulaLatex: 'A_n = \\frac{8h}{L^2} \\int_0^{L/2} x \\sin(k_n x) dx'
          },
          {
            subStepTitle: 'Adım 2b: Kısmi İntegrasyon (∫ x sin(kx) dx = -x cos(kx)/k + sin(kx)/k²)',
            explanation:
              'k_n = nπ/L için sınırları koyduğumuzda n tek iken cos(nπ/2) = 0 olduğundan ilk terim düşer ve sadece sin(nπ/2) / k_n² kalır:',
            formulaLatex: '\\textcolor{#58C4DD}{\\psi(x,t)} = \\frac{8h}{\\pi^2} \\left[ \\frac{1}{1^2}\\sin\\!\\left(\\frac{\\pi x}{L}\\right)\\cos(\\omega_1 t) - \\frac{1}{3^2}\\sin\\!\\left(\\frac{3\\pi x}{L}\\right)\\cos(3\\omega_1 t) + \\frac{1}{5^2}\\sin\\!\\left(\\frac{5\\pi x}{L}\\right)\\cos(5\\omega_1 t) - \\dots \\right]'
          }
        ],
        mathTrickIds: ['trick-orthogonality'],
        trainerCheckpoint: {
          questionPrompt:
            'Gitar telini tam ortasından (L/2) değil de L/3 noktasından çekip bırakırsak hangi harmonikler (kipler) KESİNLİKLE uyarılmaz (genliği sıfır olur)?',
          options: [
            {
              label: 'A',
              latex: 'n = 3, 6, 9, \\dots \\quad (x = L/3 \\text{ noktasında düğümü olan tüm } 3k \\text{ harmonikleri!})',
              isCorrect: true,
              feedback: 'Muhteşem fiziksel sezgi! Bir kipi kendi düğüm noktasından çekerek uyaramazsın: A_n ∝ sin(nπ(L/3)/L) = sin(nπ/3) = 0 ⇒ n = 3, 6, 9...'
            },
            {
              label: 'B',
              latex: 'n = 2, 4, 6, \\dots',
              isCorrect: false,
              feedback: 'Çift harmonikler sadece x = L/2 noktasından çekildiğinde sıfırlanır.'
            },
            {
              label: 'C',
              latex: '\\text{Hiçbir harmonik sıfır olmaz.}',
              isCorrect: false,
              feedback: 'n = 3 kipinin tam x = L/3 noktasında düğümü vardır; oradan yapılan uyarma 3. kipe hiç iş yapamaz.'
            }
          ],
          examTip: 'Genel Kural: Tel x₀ noktasından çekilirse A_n ∝ sin(nπ x₀ / L) olur; yani x₀ noktasında düğümü olan tüm kipler (n x₀ / L = tam sayı) yok olur!'
        },
        sceneDirective: {
          chapter: 2,
          modeId: 'plucked-fourier',
          abstractTab: 'fourier-spectrum',
          highlightVector: 'mode',
          presetParams: { fourierMaxN: 9, pluckPosRatio: 0.333 },
          caption: 'Tel x₀ = L/3 noktasından çekildiğinde 3., 6., 9. harmoniklerin spektrum çubukları tam sıfıra düşer!'
        }
      }
    ],
    solvedExamples: [
      {
        id: 'ex-2-3',
        title: 'Parseval Teoremi ve Harmoniklerin Enerji Paylaşımı',
        bookRef: 'Berkeley Cilt 3 · Bölüm 2 Enerji Analizi',
        problemStatement:
          'Ortasından h kadar çekilip bırakılan gitar telinde toplam enerjinin yüzde kaçı temel kipte (n = 1) bulunur?',
        strategy:
          'n. kipin enerjisi E_n ∝ ω_n² A_n² ∝ n² (1/n²)² = 1/n² ile orantılıdır. Toplam enerji ise Euler toplamı ∑_{n=1,3,5...} (1/n²) = π²/8 ile verilir.',
        stepsLatex: [
          {
            text: '1. Her bir tek harmoniğin enerjisi E_n ∝ k_n² A_n² ∝ n² · (1/n⁴) = 1/n²:',
            math: '\\frac{E_1}{E_{\\text{toplam}}} = \\frac{1 / 1^2}{\\sum_{n=1,3,5\\dots}^{\\infty} \\frac{1}{n^2}} = \\frac{1}{\\pi^2 / 8} = \\frac{8}{\\pi^2} \\approx 0.8106 \\; (\\%81.1)'
          }
        ],
        keyTakeaway:
          'Ortadan çekilen bir gitar telinin toplam mekanik enerjisinin %81.1’i sadece 1. harmonikte (temel seste), %9’u ise 3. harmoniktedir!'
      }
    ],
    commonTraps: [
      {
        trap: 'Genlik A_n ∝ 1/n² azaldığı için enerjinin de 1/n⁴ ile azalsa bile frekans çarpanı ω_n² ∝ n²’yi unutmak.',
        whyWrong: 'Bir kipin enerjisi E_n = ¼ M ω_n² A_n²’dir; ω_n = nω₁ olduğundan A_n ∝ 1/n² iken E_n ∝ n²(1/n⁴) = 1/n² olur!',
        correctApproach: 'Kip enerjisi hesaplarken her zaman A_n²’yi n² ile çarpmayı hatırla.'
      }
    ]
  },
  {
    id: 'mod-2-4',
    chapter: 2,
    code: '2.4',
    title: 'N Özgürlük Dereceli Kesikli Dizgenin Kipleri ve Dispersiyon Bağıntısı ω(k)',
    shortTitle: 'N-Boncuklu Tel & ω(k) Dispersiyonu',
    bookPages: 'Berkeley Cilt 3 · Sayfa 49 – 58',
    summary:
      'Bölüm 2’nin zirve noktası: a aralıklarla dizilmiş N adet M kütleli boncuktan oluşan kesikli telin hareket denklemini kuruyor, ünlü ω(k) = 2ω₀ sin(ka/2) dispersiyon bağıntısını ve yüksek frekans kesimini (cut-off frequency) adım adım türetiyoruz.',
    coreQuestion:
      'Atomik/kesikli bir ortamda dalga boyu küçülüp atomlar arası mesafe a mertebesine indiğinde dalga hızı neden yavaşlar ve ω_max = 2√(T₀/Ma) frekansının üzerindeki dalgalar neden ortamda ilerleyemez?',
    fundamentalEquations: [
      {
        label: 'n. Boncuğun Hareket Denklemi (n = 1, 2, ..., N)',
        latex: 'M\\textcolor{#FC6255}{\\ddot{\\psi}_n} = \\frac{T_0}{a}(\\textcolor{#58C4DD}{\\psi_{n+1} - 2\\psi_n + \\psi_{n-1}})',
        formulaLatex: 'M\\textcolor{#FC6255}{\\ddot{\\psi}_n} = \\frac{T_0}{a}(\\textcolor{#58C4DD}{\\psi_{n+1} - 2\\psi_n + \\psi_{n-1}})',
        colorNote: 'n. kütle sadece sağ (n+1) ve sol (n-1) en yakın komşularıyla etkileşir'
      },
      {
        label: 'Kesikli Örgü Dispersiyon (Dağılganlık) Bağıntısı',
        latex: '\\textcolor{#F7D147}{\\omega(k)} = 2\\sqrt{\\frac{T_0}{M a}} \\left|\\sin\\!\\left(\\frac{\\textcolor{#B189DF}{k a}}{2}\\right)\\right|, \\qquad k_m = \\frac{m\\pi}{(N+1)a} \\quad (m = 1, 2, \\dots, N)',
        formulaLatex: '\\textcolor{#F7D147}{\\omega(k)} = 2\\sqrt{\\frac{T_0}{M a}} \\left|\\sin\\!\\left(\\frac{\\textcolor{#B189DF}{k a}}{2}\\right)\\right|, \\qquad k_m = \\frac{m\\pi}{(N+1)a} \\quad (m = 1, 2, \\dots, N)',
        colorNote: 'Kesim frekansı ω_max = 2√(T₀/Ma) (ka = π, yani λ_min = 2a zikzak kipi!)'
      }
    ],
    symbolicTerms: [
      {
        id: 'term-discrete-n',
        label: 'Kesikli Kristal Örgüsü (Az Sayıda Boncuk N = 5 vs Sürekli Limit)',
        latexBadge: 'N = 5 \\leftrightarrow N \\to \\infty',
        colorRole: 'coupling',
        description: 'N küçükken ω(k) sinüs eğrisi üzerinde sadece N adet kesikli özdeğer noktası vardır ve eğri doğrusal ω = vk çizgisinden aşağı bükülür (dispersiyon!).',
        defaultActive: true,
        effectOnEquation: 'ω_m = 2ω₀ sin(mπ / 2(N+1)), m = 1...N',
        effectOnSpace: '3B sahnede N boncuklu örgüyü ve altta Brillouin dispersiyon eğrisini gösterir.',
        sceneParamKey: 'numBeads',
        activeValue: 6,
        inactiveValue: 24
      }
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        title: 'n. Boncuk İçin Kuvvet Dengesi ve Fark Denklemi',
        subtitle: 'Crawford Denklem (2.70) – (2.74): Sol ve sağ tel parçalarının eğimleri',
        physicalMotivation:
          'x_n = n·a konumundaki n. boncuğa sağdaki tel parçası +T₀(ψ_{n+1} - ψ_n)/a kuvveti, soldaki tel parçası ise -T₀(ψ_n - ψ_{n-1})/a kuvveti uygular.',
        mainEquationLatex:
          'M\\textcolor{#FC6255}{\\ddot{\\psi}_n} = T_0\\left(\\frac{\\psi_{n+1} - \\psi_n}{a}\\right) - T_0\\left(\\frac{\\psi_n - \\psi_{n-1}}{a}\\right) = \\frac{T_0}{a}(\\textcolor{#58C4DD}{\\psi_{n+1} - 2\\psi_n + \\psi_{n-1}})',
        algebraicBreakdown: [
          {
            subStepTitle: 'Adım 1a: Normal Kip Deneme Çözümü ψ_n(t) = A_n cos(ωt)',
            explanation:
              'Tüm boncukların aynı ω frekansıyla salındığını varsayıp -ω² A_n = (T₀/Ma)(A_{n+1} - 2A_n + A_{n-1}) elde ederiz:',
            formulaLatex: '-\\omega^2 A_n = \\omega_0^2 (A_{n+1} - 2A_n + A_{n-1}) \\quad \\left(\\omega_0^2 \\equiv \\frac{T_0}{M a}\\right)'
          }
        ],
        mathTrickIds: ['trick-trig-beats'],
        trainerCheckpoint: {
          questionPrompt:
            'Uçları n = 0 ve n = N + 1 noktalarında duvara sabitlenmiş (A₀ = 0 ve A_{N+1} = 0) N boncuklu tel için uzaysal genlik deneme fonksiyonu A_n nasıl seçilmelidir?',
          options: [
            {
              label: 'A',
              latex: 'A_n = A \\sin(n k a) \\quad \\text{ve} \\quad k_m a = \\frac{m\\pi}{N+1} \\;\\; (m=1,2,\\dots,N)',
              isCorrect: true,
              feedback: 'Kusursuz! n = 0 için sin(0) = 0 şartı otomatik sağlanır; n = N + 1 duvarında A_{N+1} = A sin((N+1)ka) = 0 şartı ise ka = mπ/(N+1) kuantizasyonunu verir!'
            },
            {
              label: 'B',
              latex: 'A_n = A \\sin(n k a) \\quad \\text{ve} \\quad k_m a = \\frac{m\\pi}{N}',
              isCorrect: false,
              feedback: 'Çok dikkat! N boncuk varsa iki duvar arasındaki toplam bölme sayısı N değil, N + 1’dir (L = (N+1)a)!'
            },
            {
              label: 'C',
              latex: 'A_n = A \\cos(n k a)',
              isCorrect: false,
              feedback: 'n = 0 sol duvarında A₀ = 0 olması için sinüs seçilmelidir.'
            }
          ],
          examTip: 'Sınavda en çok puan kırdıran tuzak: N boncuklu telin toplam uzunluğu L = (N + 1)a’dır! Çünkü N boncuk teli N + 1 parçaya böler.'
        },
        sceneDirective: {
          chapter: 2,
          modeId: 'discrete-lattice',
          abstractTab: 'dispersion',
          highlightVector: 'mode',
          presetParams: { numBeads: 6, modeN: 2 },
          caption: 'N = 6 boncuklu kesikli örgü: Toplam L = 7a uzunluğundaki telde tam N = 6 adet bağımsız normal kip bulunur.'
        }
      },
      {
        stepNumber: 2,
        title: 'ω(k) = 2ω₀ sin(ka/2) Dispersiyon Bağıntısının Tam Türetimi',
        subtitle: 'Crawford Denklem (2.77) – (2.82): Trigonometrik sadeleştirme ve Brillouin sınırı',
        physicalMotivation:
          'A_n = A sin(nka) ifadesini fark denkleminde yerine koyup A_{n+1} + A_{n-1} = 2 cos(ka) A_n trigonometrik kimliğini kullanalım.',
        mainEquationLatex:
          '-\\omega^2 A_n = \\omega_0^2 [2\\cos(ka) - 2] A_n = -4\\omega_0^2 \\sin^2\\!\\left(\\frac{ka}{2}\\right) A_n \\implies \\textcolor{#F7D147}{\\omega(k)} = 2\\omega_0 \\sin\\!\\left(\\frac{\\textcolor{#B189DF}{ka}}{2}\\right)',
        algebraicBreakdown: [
          {
            subStepTitle: 'Adım 2a: Yarım Açı Özdeşliği 1 - cos(ka) = 2 sin²(ka/2)',
            explanation:
              'A_n çarpanları her iki taraftan sadeleşir ve karekök alındığında ünlü dispersiyon bağıntısı ortaya çıkar:',
            formulaLatex: '\\omega_m = 2\\sqrt{\\frac{T_0}{Ma}} \\sin\\!\\left(\\frac{m\\pi}{2(N+1)}\\right), \\qquad m = 1, 2, \\dots, N'
          },
          {
            subStepTitle: 'Adım 2b: Uzun Dalga Boyu (ka ≪ 1) Sürekli Limiti vs Kısa Dalga Boyu (ka → π) Kesimi',
            explanation:
              'ka ≪ 1 (λ ≫ a) iken sin(ka/2) ≈ ka/2 olur ve ω = √(T₀a/M) k = v_0 k (doğrusal, dispersiyonsuz) çıkar. Ancak ka = π (λ_min = 2a, komşu boncuklar zıt fazda zikzak yapıyor) olduğunda sin(π/2) = 1 olur ve frekans maksimum sınırına (Cut-off: ω_max = 2ω₀) dayanır!',
            formulaLatex: 'ka \\ll 1 \\implies \\omega \\approx \\left(\\sqrt{\\frac{T_0 a}{M}}\\right) k, \\qquad ka = \\pi \\implies \\omega_{\\max} = 2\\sqrt{\\frac{T_0}{Ma}}'
          }
        ],
        mathTrickIds: ['trick-trig-beats', 'trick-taylor'],
        trainerCheckpoint: {
          questionPrompt:
            'Kesikli N-boncuklu örgüde en yüksek frekanslı sınır kipinde (ka = π, yani λ = 2a) dalganın faz hızı v_φ = ω/k ile sürekli limit hızı v₀ arasındaki oran nedir?',
          options: [
            {
              label: 'A',
              latex: '\\frac{v_\\phi(ka=\\pi)}{v_0} = \\frac{2}{\\pi} \\approx 0.637 \\quad (\\text{Faz hızı \\%36 düşer, grup hızı } d\\omega/dk = 0 \\text{ olur!})',
              isCorrect: true,
              feedback: 'Muazzam! ω(k) = 2(v₀/a)sin(ka/2) olduğundan v_φ = ω/k = v₀ [sin(ka/2) / (ka/2)] olur. ka = π koyunca sin(π/2)/(π/2) = 2/π çıkar!'
            },
            {
              label: 'B',
              latex: '\\frac{v_\\phi}{v_0} = 1',
              isCorrect: false,
              feedback: 'Kesikli örgü dağılgandır (dispersive); kısa dalga boyları uzun dalga boylarından daha yavaş ilerler.'
            },
            {
              label: 'C',
              latex: '\\frac{v_\\phi}{v_0} = 0',
              isCorrect: false,
              feedback: 'ka = π sınırında sıfır olan şey faz hızı (ω/k) değil, eğim olan grup hızıdır (v_g = dω/dk = 0)!'
            }
          ],
          examTip: 'Faz hızı v_φ = ω/k = v₀ sinc(ka/2) iken, grup hızı (enerji hızı) v_g = dω/dk = v₀ cos(ka/2)’dir. ka = π sınırında v_g = 0 olur (duran Bragg yansıması)!'
        },
        sceneDirective: {
          chapter: 2,
          modeId: 'discrete-lattice',
          abstractTab: 'dispersion',
          highlightVector: 'coupling',
          presetParams: { numBeads: 6, modeN: 6 },
          caption: 'Sınır kipi (m = N): Komşu boncuklar zıt yönde (zikzak) salınır, ω(k) eğrisi tepe noktasına ulaşır ve grup hızı dω/dk sıfırlanır.'
        }
      }
    ],
    solvedExamples: [
      {
        id: 'ex-2-4',
        title: 'N = 3 Boncuklu Telin Tüm Özfrekansları ve Genlik Oranları (Klasik Vize Sorusu)',
        bookRef: 'Berkeley Cilt 3 · Sayfa 53 & Problem 2.18',
        problemStatement:
          'İki duvar arasına eşit a aralıklarla dizilmiş N = 3 özdeş M kütleli boncuklu telin 3 normal kipinin frekanslarını (ω₁, ω₂, ω₃) ve her kipteki boncuk genlik oranlarını (A₁ : A₂ : A₃) bulunuz.',
        strategy:
          'N = 3 için N + 1 = 4’tür. k_m a = mπ/4 (m = 1, 2, 3) değerlerini ω_m = 2ω₀ sin(mπ/8) ve A_n = sin(n m π / 4) formüllerine yazarız.',
        stepsLatex: [
          {
            text: '1. Kip 1 (m = 1, ka = π/4):',
            math: '\\omega_1 = 2\\omega_0 \\sin(\\pi/8) = \\omega_0\\sqrt{2 - \\sqrt{2}} \\approx 0.765\\omega_0, \\quad (A_1 : A_2 : A_3) = (\\sin\\tfrac{\\pi}{4} : \\sin\\tfrac{2\\pi}{4} : \\sin\\tfrac{3\\pi}{4}) = (1 : \\sqrt{2} : 1)'
          },
          {
            text: '2. Kip 2 (m = 2, ka = π/2):',
            math: '\\omega_2 = 2\\omega_0 \\sin(\\pi/4) = \\sqrt{2}\\omega_0 \\approx 1.414\\omega_0, \\quad (A_1 : A_2 : A_3) = (\\sin\\tfrac{\\pi}{2} : \\sin\\pi : \\sin\\tfrac{3\\pi}{2}) = (1 : 0 : -1)'
          },
          {
            text: '3. Kip 3 (m = 3, ka = 3π/4):',
            math: '\\omega_3 = 2\\omega_0 \\sin(3\\pi/8) = \\omega_0\\sqrt{2 + \\sqrt{2}} \\approx 1.848\\omega_0, \\quad (A_1 : A_2 : A_3) = (1 : -\\sqrt{2} : 1)'
          }
        ],
        keyTakeaway:
          '3×3 determinant açıp 3. dereceden denklem çözmek yerine A_n = sin(nmπ/(N+1)) formülünü kullanmak çözümü 30 saniyede sıfır işlem hatasıyla verir!'
      }
    ],
    commonTraps: [
      {
        trap: 'N boncuklu telde k_m a = mπ / N yazmak.',
        whyWrong: 'Sağ duvar n = N’de değil, n = N + 1 noktasındadır (A_{N+1} = 0). Eğer mπ/N yazarsan sağdaki N. boncuk hareketsiz kalır!',
        correctApproach: 'Daima k_m a = mπ / (N + 1) (sabit uçlar için) kullanılır.'
      }
    ]
  },
  {
    id: 'mod-2-5',
    chapter: 2,
    code: '2.5',
    title: 'Boyuna Örgü, LC İletim Hattı (Alçak Geçiren Filtre) ve Optik/Akustik Dallar',
    shortTitle: 'LC İletim Hattı & Optik/Akustik Kipler',
    bookPages: 'Berkeley Cilt 3 · Sayfa 58 – 63',
    summary:
      'Kesikli örgü matematiğini boyuna yay-kütle zincirine, N-bölümlü LC koaksiyel iletim hattına ve iki farklı atomlu (M₁, M₂) tuz kristali (NaCl) örgüsüne uygulayarak Akustik ve Optik dispersiyon dallarını inceliyoruz.',
    coreQuestion:
      'Neden bir LC iletim hattı ω_max = 2/√(LC) frekansına kadar sinyalleri geçirip bu frekansın üstünü tamamen kesen bir "Alçak Geçiren Filtre" (Low-Pass Filter) gibi davranır?',
    fundamentalEquations: [
      {
        label: 'Kesikli LC İletim Hattı Kirchhoff Denklemi ve Dispersiyonu',
        latex: 'L\\textcolor{#FC6255}{\\ddot{Q}_n} = \\frac{1}{C}(\\textcolor{#58C4DD}{Q_{n+1} - 2Q_n + Q_{n-1}}) \\implies \\textcolor{#F7D147}{\\omega(k)} = \\frac{2}{\\sqrt{LC}}\\left|\\sin\\!\\left(\\frac{ka}{2}\\right)\\right|',
        formulaLatex: 'L\\textcolor{#FC6255}{\\ddot{Q}_n} = \\frac{1}{C}(\\textcolor{#58C4DD}{Q_{n+1} - 2Q_n + Q_{n-1}}) \\implies \\textcolor{#F7D147}{\\omega(k)} = \\frac{2}{\\sqrt{LC}}\\left|\\sin\\!\\left(\\frac{ka}{2}\\right)\\right|',
        colorNote: 'Mekanik M ↔ L, T₀/a ↔ 1/C dualitesiyle türetim tek satırda tamamlanır!'
      },
      {
        label: 'Diyatomik (M₁, M₂) Kristal Örgü Akustik ve Optik Dalları',
        latex: '\\textcolor{#F7D147}{\\omega_{\\pm}^2(k)} = K\\left(\\frac{1}{M_1} + \\frac{1}{M_2}\\right) \\pm K\\sqrt{\\left(\\frac{1}{M_1} + \\frac{1}{M_2}\\right)^2 - \\frac{4\\sin^2(ka)}{M_1 M_2}}',
        formulaLatex: '\\textcolor{#F7D147}{\\omega_{\\pm}^2(k)} = K\\left(\\frac{1}{M_1} + \\frac{1}{M_2}\\right) \\pm K\\sqrt{\\left(\\frac{1}{M_1} + \\frac{1}{M_2}\\right)^2 - \\frac{4\\sin^2(ka)}{M_1 M_2}}',
        colorNote: '(-) işareti Akustik Dal (k→0 iken ω→0), (+) işareti Optik Dal (k→0 iken zıt fazlı yüksek frekans!)'
      }
    ],
    symbolicTerms: [
      {
        id: 'term-diatomic-mass',
        label: 'Diyatomik Kütle Farkı (M₁ ≠ M₂: Optik Dal ve Yasak Bant Açılması)',
        latexBadge: 'M_1 \\neq M_2 \\implies \\Delta\\omega_{\\text{gap}}',
        colorRole: 'mode',
        description: 'Komşu boncukların kütleleri farklı olduğunda (M₁ ≠ M₂) dispersiyon eğrisi ikiye yarılır: Akustik dal ve Optik dal arasında hiçbir dalganın yayılamadığı bir "Yasak Frekans Bandı" (Band Gap) açılır!',
        defaultActive: false,
        effectOnEquation: 'ω_akustik(max) = √(2K/M₁) ile ω_optik(min) = √(2K/M₂) arasında yasak bölge oluşur.',
        effectOnSpace: 'Dispersiyon grafiğinde Akustik (alt) ve Optik (üst) dalları ve aralarındaki band-gap bölgesini gösterir.',
        sceneParamKey: 'diatomicRatio',
        activeValue: 2.2,
        inactiveValue: 1.0
      }
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        title: 'LC Merdiven Ağı (İletim Hattı) Denkleminin Kurulumu',
        subtitle: 'Crawford Denklem (2.94) – (2.99): Boğum gerilimleri ve bobin akımları',
        physicalMotivation:
          'Her birinde L indüktansı ve yere bağlı C kondansatörü bulunan kesikli bir iletim hattında n. bobinden geçen yük Q_n olsun. n. kondansatörde biriken net yük q_n = Q_{n-1} - Q_n ve gerilimi V_n = (Q_{n-1} - Q_n)/C olur.',
        mainEquationLatex:
          'L\\textcolor{#FC6255}{\\frac{d^2 Q_n}{dt^2}} = V_n - V_{n+1} = \\frac{Q_{n-1} - Q_n}{C} - \\frac{Q_n - Q_{n+1}}{C} = \\frac{1}{C}(\\textcolor{#58C4DD}{Q_{n+1} - 2Q_n + Q_{n-1}})',
        algebraicBreakdown: [
          {
            subStepTitle: 'Adım 1a: Mekanik Boncuklu Tel Denklemiyle Birebir Özdeşlik',
            explanation:
              'M ψ̈_n = (T₀/a)(ψ_{n+1} - 2ψ_n + ψ_{n-1}) denkleminde M → L ve T₀/a → 1/C yazıldığında denklemler %100 aynıdır! Yeniden trigonometrik işlem yapmaya gerek kalmadan dispersiyon bağıntısını doğrudan yazarız:',
            formulaLatex: '\\textcolor{#F7D147}{\\omega(k)} = \\frac{2}{\\sqrt{LC}} \\sin\\!\\left(\\frac{ka}{2}\\right), \\qquad \\omega_{\\text{kesim}} = \\frac{2}{\\sqrt{LC}}'
          }
        ],
        mathTrickIds: ['trick-trig-beats'],
        trainerCheckpoint: {
          questionPrompt:
            'Birim uzunluk başına indüktansı L₀ = L/a ve birim uzunluk başına kapasitansı C₀ = C/a olan sürekli bir koaksiyel kabloda (a → 0 limiti) elektromanyetik dalganın yayılma hızı v nedir?',
          options: [
            {
              label: 'A',
              latex: 'v = \\frac{1}{\\sqrt{L_0 C_0}}',
              isCorrect: true,
              feedback: 'Mükemmel! ka ≪ 1 limitinde ω ≈ (2/√(LC))(ka/2) = k a / √(LC) = k / √((L/a)(C/a)) = k / √(L₀C₀) ⇒ v = ω/k = 1/√(L₀C₀).'
            },
            {
              label: 'B',
              latex: 'v = \\sqrt{\\frac{L_0}{C_0}}',
              isCorrect: false,
              feedback: '√(L₀/C₀) dalga hızı değil, Bölüm 4’te göreceğimiz karakteristik empedans Z₀ (Ohm)’dur!'
            },
            {
              label: 'C',
              latex: 'v = \\frac{2}{\\sqrt{L_0 C_0}}',
              isCorrect: false,
              feedback: 'sin(ka/2) ≈ ka/2 açılımındaki 1/2 çarpanı öndeki 2 ile sadeleşir.'
            }
          ],
          examTip: 'Koaksiyel kabloda hız v = 1/√(L₀C₀), karakteristik empedans ise Z₀ = √(L₀/C₀)’dır. İkisini asla karıştırma!'
        },
        sceneDirective: {
          chapter: 2,
          modeId: 'discrete-lattice',
          abstractTab: 'dispersion',
          highlightVector: 'vel',
          presetParams: { numBeads: 10, modeN: 3, diatomicRatio: 1.0 },
          caption: 'LC iletim hattı ve boyuna kristal örgüsü aynı ω(k) = 2ω₀ sin(ka/2) dispersiyon eğrisini paylaşır.'
        }
      }
    ],
    solvedExamples: [
      {
        id: 'ex-2-5',
        title: 'N = 3 Kütleli Boyuna Yay Sisteminde Serbest vs Sabit Uç Özfrekansları',
        bookRef: 'Berkeley Cilt 3 · Bölüm 2 Problem 2.23',
        problemStatement:
          'k yaylarıyla birbirine bağlı 3 özdeş M kütlesi sürtünmesiz yatay düzlemde uçları SERBEST bırakılıyor (duvara bağlı değil). Sistemin 3 normal kip frekansını bulunuz.',
        strategy:
          'Uçlar serbest olduğu için tüm sistemin kütlesi sabit hızla öteleme yapabilir (ω₁ = 0 kipi). Diğer iki kip ise kütle merkezinin sabit kaldığı simetrik ve antisimetrik kiplerdir.',
        stepsLatex: [
          {
            text: '1. Kip 1 (Bütüncül Öteleme: x₁ = x₂ = x₃, yaylar hiç gerilmez):',
            math: '\\omega_1 = 0'
          },
          {
            text: '2. Kip 2 (Ortadaki kütle hareketsiz x₂ = 0, dış kütleler zıt x₁ = -x₃):',
            math: 'M\\ddot{x}_1 = -k x_1 \\implies \\omega_2 = \\sqrt{\\frac{k}{M}}'
          },
          {
            text: '3. Kip 3 (Dış kütleler eşit x₁ = x₃ = 1, orta kütle zıt x₂ = -2):',
            math: 'M\\ddot{x}_1 = -k(x_1 - x_2) = -3k x_1 \\implies \\omega_3 = \\sqrt{\\frac{3k}{M}}'
          }
        ],
        keyTakeaway:
          'Serbest uçlu (uzayda yüzen) her sistemde öteleme simetrisi gereği mutlaka ω = 0 olan bir "sıfır frekanslı" kip bulunur!'
      }
    ],
    commonTraps: [
      {
        trap: 'LC iletim hattında kesim frekansını f_max = 1 / (2π√(LC)) sanmak.',
        whyWrong: 'Tekil bir LC devresinin frekansı ω₀ = 1/√(LC)’dir ama kesikli LC merdiven hattında komşu iki kondansatör zıt fazda dolup boşaldığı için ω_max = 2/√(LC) (iki katı!) olur.',
        correctApproach: 'Kesikli örgü ve LC hattında maksimum kesim frekansı daima ω_max = 2ω₀ = 2/√(LC)’dir.'
      }
    ]
  }
];

