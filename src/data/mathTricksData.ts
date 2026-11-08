import { MathTrickItem } from '../types/curriculum';

export const MATH_TRICKS: MathTrickItem[] = [
  {
    id: 'trick-taylor',
    title: 'Taylor Serisi Doğrusallaştırması ve Küçük Genlik Yaklaşımı',
    badgeLabel: '🔍 Taylor & Küçük Açı İspatı',
    category: 'Analiz & Yaklaşım',
    summary:
      'Doğadaki neredeyse hiçbir geri çağırıcı kuvvet (sarkaç, molekül bağı, enine tel gerilimi) tam olarak doğrusal değildir. Fizikte harmonik hareketi elde etmemizi sağlayan temel araç, denge noktası x = 0 etrafında Taylor açılımı yapıp yüksek mertebeli (x², x³) terimleri ihmal etmektir.',
    whenUsedInBerkeley:
      'Bölüm 1.2 (Basit sarkaç sin θ ≈ θ, Enine yay salınımı √(L² + x²) binom açılımı), Bölüm 1.5 (Zayıf çiftlenimde √(1 + 2ε) ≈ 1 + ε), Bölüm 2.1 (Sürekli telde sin θ ≈ tan θ ≈ ∂ψ/∂x).',
    coreIdentityLatex:
      'f(x) = f(0) + x f\'(0) + \\frac{x^2}{2!} f\'\'(0) + \\frac{x^3}{3!} f\'\'\'(0) + \\mathcal{O}(x^4)',
    stepByStepProof: [
      {
        title: '1. Genel Geri Çağırıcı Kuvvetin Denge Etrafında Açılımı',
        text: 'Denge konumunda (x = 0) net kuvvet sıfırdır: F(0) = 0. Kuvveti Taylor serisine açarsak:',
        latex: 'F(x) = \\underbrace{F(0)}_{0} + x \\left.\\frac{dF}{dx}\\right|_0 + \\frac{1}{2}x^2 \\left.\\frac{d^2F}{dx^2}\\right|_0 + \\dots \\approx -k_{\\text{eff}} x'
      },
      {
        title: '2. Trigonometrik Küçük Açı Geçişleri (Sarkaç & Tel Eğimi)',
        text: 'Radyan cinsinden θ ≪ 1 iken sin θ, tan θ ve cos θ açılımları:',
        latex: '\\sin\\theta = \\theta - \\frac{\\theta^3}{6} + \\dots, \\quad \\cos\\theta = 1 - \\frac{\\theta^2}{2} + \\dots, \\quad \\tan\\theta = \\theta + \\frac{\\theta^3}{3} + \\dots'
      },
      {
        title: '3. Binom Yaklaşımı (Enine Yay ve Zayıf Çiftlenim Frekansı)',
        text: 'Küçük bir ε ≪ 1 parametresi için (1 + ε)^p ifadesinin birinci mertebe açılımı:',
        latex: '(1 + \\epsilon)^p = 1 + p\\epsilon + \\frac{p(p-1)}{2}\\epsilon^2 + \\dots \\implies \\sqrt{1 + \\epsilon} \\approx 1 + \\frac{1}{2}\\epsilon, \\quad \\frac{1}{\\sqrt{1+\\epsilon}} \\approx 1 - \\frac{1}{2}\\epsilon'
      }
    ],
    deadlyExamTrap:
      'SINAV TUZAĞI: Birinci mertebe terim sıfır çıkıyorsa (örneğin gevşek enine yayda L₀ = L iken F_y içinde 1. mertebe terim birbirini götürür veya enerji hesabında cos θ açılırken) ASLA cos θ ≈ 1 alma! Enerji ve boy değişimi hesaplarında 2. mertebe terimi (cos θ ≈ 1 - θ²/2) tutmak zorundasın, aksi halde geri çağırıcı kuvveti sıfır bulursun.',
    interactiveDemoType: 'taylor'
  },
  {
    id: 'trick-phasor',
    title: 'Kompleks Üstel Gösterim (e^{iωt}) ve Karesel Enerji Tuzağı',
    badgeLabel: '🔍 Kompleks Fazör & Euler Hilesi',
    category: 'Kompleks Cebir',
    summary:
      'Trigonometrik fonksiyonların türevlerini ve toplamlarını almak yerine, hareketi kompleks düzlemde dönen bir vektörün (fazör) reel eksendeki gölgesi olarak yazarız. Böylece diferansiyel denklemler basit cebirsel denklemlere dönüşür.',
    whenUsedInBerkeley:
      'Bölüm 1.2 (Harmonik çözüm), Bölüm 1.3 (Faz farkı olan dalgaların süperpozisyonu), Bölüm 1.5 (Vuru zarfı), Bölüm 2–9 (Tüm dalga ve optik denklemleri).',
    coreIdentityLatex:
      'z(t) = A e^{i(\\omega t + \\phi)} = A\\cos(\\omega t + \\phi) + i A\\sin(\\omega t + \\phi), \\quad x(t) = \\text{Re}[z(t)]',
    stepByStepProof: [
      {
        title: '1. Türev Operatörünün Cebirsel Çarpana Dönüşmesi',
        text: 'Euler formülü sayesinde zamana göre her türev, fazörü iω ile çarpmak (yani kompleks düzlemde 90° ileri döndürüp ω ile ölçeklemek) demektir:',
        latex: '\\frac{d}{dt} z(t) = i\\omega z(t), \\qquad \\frac{d^2}{dt^2} z(t) = (i\\omega)^2 z(t) = -\\omega^2 z(t)'
      },
      {
        title: '2. Doğrusal Diferansiyel Denklemde Yerine Koyma',
        text: 'm ẍ + b ẋ + kx = 0 denkleminde x yerine z koyduğumuzda e^{iωt} çarpanı doğrudan sadeleşir:',
        latex: '(-m\\omega^2 + i b\\omega + k) A e^{i(\\omega t + \\phi)} = 0 \\implies -m\\omega^2 + i b\\omega + k = 0'
      },
      {
        title: '3. Zaman Ortalamalı Enerji İfadesi',
        text: 'Kompleks genlik Z = A e^{iφ} biliniyorsa bir periyot boyunca ortalama karesel değer:',
        latex: '\\langle x^2(t) \\rangle = \\frac{1}{2} |z(t)|^2 = \\frac{1}{2} z \\cdot z^* = \\frac{1}{2} A^2'
      }
    ],
    deadlyExamTrap:
      'SINAV TUZAĞI: Kinetik veya potansiyel enerji (½kx² veya ½mv²) hesaplarken ASLA önce kompleks karesini alıp sonra Re[z²] alma! Çünkü Re[z₁ z₂] ≠ Re[z₁] · Re[z₂]. Enerji gibi doğrusal olmayan (karesel) büyüklüklerde ÖNCE reel kısmı al: x = Re[z] = A cos(ωt+φ), SONra karesini al!',
    interactiveDemoType: 'phasor'
  },
  {
    id: 'trick-determinant',
    title: 'Normal Koordinatlar, Özdeğer Problemi ve Seküler Determinant',
    badgeLabel: '🔍 Normal Koordinat & Determinant',
    category: 'Lineer Cebir & Fourier',
    summary:
      'Çiftlenimli (birbirine bağlı) diferansiyel denklemlerde x_a denklemi içinde x_b, x_b denklemi içinde x_a bulunur. Bu düğümü çözmenin iki eşdeğer yolu vardır: (1) Simetriden faydalanıp denklemleri taraf tarafa toplayıp çıkarmak (Normal Koordinatlar) veya (2) Matris determinantını sıfıra eşitlemek.',
    whenUsedInBerkeley:
      'Bölüm 1.4 (İki kütle üç yay, çiftlenimli sarkaçlar, LC devreleri), Problem 1.14, 1.16, 1.20 ve Bölüm 2.4 (N-serbestlik dereceli sistemler).',
    coreIdentityLatex:
      '\\det(\\mathbf{K} - \\omega^2 \\mathbf{M}) = \\begin{vmatrix} \\omega_0^2 - \\omega^2 & -\\kappa^2 \\\\ -\\kappa^2 & \\omega_0^2 - \\omega^2 \\end{vmatrix} = 0',
    stepByStepProof: [
      {
        title: '1. Yöntem A — Simetrik Sistemlerde Toplam ve Fark Hilesi (Normal Koordinatlar)',
        text: 'Özdeş iki salıngan için ẍ_a = -ω₀² x_a + κ² x_b ve ẍ_b = -ω₀² x_b + κ² x_a denklemlerini taraf tarafa topla (q₁ = x_a + x_b) ve çıkar (q₂ = x_a - x_b):',
        latex: '\\ddot{q}_1 = -(\\omega_0^2 - \\kappa^2) q_1 \\implies \\omega_1^2 = \\omega_0^2 - \\kappa^2, \\qquad \\ddot{q}_2 = -(\\omega_0^2 + \\kappa^2) q_2 \\implies \\omega_2^2 = \\omega_0^2 + \\kappa^2'
      },
      {
        title: '2. Yöntem B — Genel Sistemlerde Seküler Determinant',
        text: 'Kütleler veya yaylar özdeş değilse (M_a ≠ M_b), x_a = A_a cos(ωt) ve x_b = A_b cos(ωt) koyup matris formunda yazarız:',
        latex: '\\begin{bmatrix} \\omega_{aa}^2 - \\omega^2 & -\\kappa_a^2 \\\\ -\\kappa_b^2 & \\omega_{bb}^2 - \\omega^2 \\end{bmatrix} \\begin{bmatrix} A_a \\\\ A_b \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 0 \\end{bmatrix}'
      },
      {
        title: '3. Sıfırdan Farklı Çözüm Şartı ve Özvektör Oranı',
        text: 'A_a = A_b = 0 (hareketsiz) dışında fiziksel çözüm olması için katsayılar matrisinin determinantı sıfır olmalıdır. Bulunan ω₁, ω₂ kökleri birinci satıra geri yazılarak A_b / A_a genlik oranı çekilir:',
        latex: '(\\omega_{aa}^2 - \\omega^2)(\\omega_{bb}^2 - \\omega^2) - \\kappa_a^2 \\kappa_b^2 = 0, \\qquad \\frac{A_b}{A_a} = \\frac{\\omega_{aa}^2 - \\omega_n^2}{\\kappa_a^2}'
      }
    ],
    deadlyExamTrap:
      'SINAV TUZAĞI: Başlangıç koşullarını (ör. x_a(0)=x₀, x_b(0)=0) ASLA tek bir normal kip denklemine eşitlemeye çalışma! Genel hareket DAİMA tüm normal kiplerin toplamıdır: x_a(t) = C₁ cos(ω₁t) + C₂ cos(ω₂t). Başlangıç koşulları sadece en sonda C₁ ve C₂ katsayılarını bulmak için kullanılır.',
    interactiveDemoType: 'determinant'
  },
  {
    id: 'trick-trig-beats',
    title: 'Vuru ve Kesikli Örgü Trigonometrik Dönüşüm Kimlikleri',
    badgeLabel: '🔍 Trigonometrik Toplam-Çarpım & Örgü Hilesi',
    category: 'Analiz & Yaklaşım',
    summary:
      'Hem Bölüm 1.5’teki vuru (beats) zarf denklemini hem de Bölüm 2.4’teki N-boncuklu kristal örgünün ünlü sin(ka/2) dispersiyon bağıntısını tek bir temel trigonometrik kimlik türetir: cos(α ± β) ve sin(α ± β) açılımları.',
    whenUsedInBerkeley:
      'Bölüm 1.5 (Vuru modülasyon zarfı türetimi), Bölüm 2.4 (N-boncuklu telde ψ_{n+1} - 2ψ_n + ψ_{n-1} ikinci fark ifadesinin -4 sin²(ka/2) ψ_n biçimine indirgenmesi).',
    coreIdentityLatex:
      '\\sin(n+1)\\theta + \\sin(n-1)\\theta - 2\\sin(n\\theta) = 2\\sin(n\\theta)(\\cos\\theta - 1) = -4\\sin^2\\!\\left(\\frac{\\theta}{2}\\right)\\sin(n\\theta)',
    stepByStepProof: [
      {
        title: '1. Vuru (Beats) İçin Toplamdan Çarpıma Geçiş',
        text: 'ω₁ t = (ω_ort - ω_mod)t ve ω₂ t = (ω_ort + ω_mod)t tanımlayarak cos(ω₁ t) + cos(ω₂ t) toplamını açalım:',
        latex: '\\cos(\\omega_1 t) + \\cos(\\omega_2 t) = 2 \\underbrace{\\cos\\!\\left(\\frac{\\omega_1 - \\omega_2}{2}t\\right)}_{\\text{Yavaş Zarf } A_{\\text{mod}}(t)} \\underbrace{\\cos\\!\\left(\\frac{\\omega_1 + \\omega_2}{2}t\\right)}_{\\text{Hızlı Taşıyıcı}}'
      },
      {
        title: '2. N-Boncuklu Örgü İçin Komşu Terimlerin Toplamı (Bölüm 2.4 Vize Türetimi)',
        text: 'n. boncuğun uzaysal genliği A_n = A sin(nka) olsun. Sağ ve sol komşuların (n+1 ve n-1) toplamı:',
        latex: 'A_{n+1} + A_{n-1} = A[\\sin(nka + ka) + \\sin(nka - ka)] = 2 A \\sin(nka) \\cos(ka) = 2 \\cos(ka) A_n'
      },
      {
        title: '3. Yarım Açı Kimliği ile sin²(ka/2) Elde Edilişi',
        text: 'Hareket denklemindeki (A_{n+1} + A_{n-1} - 2A_n) ifadesinde 1 - cos(ka) = 2 sin²(ka/2) kimliğini kullanınca A_n sadeleşir ve dispersiyon bağıntısı doğrudan düşer:',
        latex: 'A_{n+1} - 2A_n + A_{n-1} = 2(\\cos(ka) - 1) A_n = -4 \\sin^2\\!\\left(\\frac{ka}{2}\\right) A_n'
      }
    ],
    deadlyExamTrap:
      'SINAV TUZAĞI: Vuru frekansı (işitilen şiddet maksimumlarının frekansı), genlik zarfının frekansı olan |ω₁ - ω₂|/2 DEĞİLDİR! Enerji ve ses şiddeti genliğin KARESİYLE (cos²(ω_mod t)) orantılı olduğu için bir zarf periyodunda tepe noktası 2 kez maksimum olur; yani f_vuru = |f₁ - f₂|’dir.',
    interactiveDemoType: 'trig_lattice'
  },
  {
    id: 'trick-separation',
    title: 'Kısmi Diferansiyel Denklemlerde Değişkenlerine Ayırma ve Sınır Koşulları',
    badgeLabel: '🔍 Değişkenlerine Ayırma & Sınır Koşulu',
    category: 'Diferansiyel Denklemler',
    summary:
      'Sürekli ortam dalga denklemi ∂²ψ/∂t² = v² ∂²ψ/∂x² hem uzaya (x) hem zamana (t) bağlı kısmi türevler içerir. Normal kip aramak demek, tel üzerindeki her noktanın aynı zaman fonksiyonuyla T(t) uyumlu salındığı ψ(x,t) = X(x)T(t) çarpım çözümünü aramak demektir.',
    whenUsedInBerkeley:
      'Bölüm 2.2 (Sürekli telin duran dalga kipleri, sabit ve serbest uç sınır koşulları), Bölüm 7 (2B ve 3B dalga denklemleri).',
    coreIdentityLatex:
      '\\psi(x,t) = X(x)T(t) \\implies \\frac{1}{T(t)}\\frac{d^2 T}{dt^2} = \\frac{v^2}{X(x)}\\frac{d^2 X}{dx^2} = -\\omega^2 = \\text{sabit}',
    stepByStepProof: [
      {
        title: '1. Çarpım Çözümünü Dalga Denklemine Koyup X(x)T(t)’ye Bölme',
        text: '∂²ψ/∂t² = X(x) T̈(t) ve ∂²ψ/∂x² = X\'\'(x) T(t) ifadelerini dalga denklemine yazıp her iki tarafı X(x)T(t) çarpımına böleriz:',
        latex: '\\underbrace{\\frac{1}{T(t)}\\frac{d^2 T(t)}{dt^2}}_{\\text{Sadece } t \\text{ fonksiyonu}} = \\underbrace{\\frac{v^2}{X(x)}\\frac{d^2 X(x)}{dx^2}}_{\\text{Sadece } x \\text{ fonksiyonu}} = -\\omega^2'
      },
      {
        title: '2. Neden Her İki Taraf Sabit Olmak Zorundadır?',
        text: 'Sol taraf x’ten bağımsızdır, sağ taraf ise t’den bağımsızdır. x’i sabit tutup t’yi değiştirdiğimizde sağ taraf değişmediğine göre sol taraf da değişemez! O halde her iki taraf da aynı sabite (-ω²) eşittir:',
        latex: '\\frac{d^2 T}{dt^2} + \\omega^2 T = 0, \\qquad \\frac{d^2 X}{dx^2} + k^2 X = 0 \\quad \\left(k \\equiv \\frac{\\omega}{v}\\right)'
      },
      {
        title: '3. Sınır Koşullarının Dalga Sayısı k_n’yi Kuantize Etmesi',
        text: 'Sabit uçta yerdeğiştirme sıfırdır: X(0)=0, X(L)=0 ⇒ sin(kL)=0 ⇒ k_n = nπ/L. Serbest uçta ise eğim (enine kuvvet) sıfırdır: dX/dx = 0.',
        latex: '\\text{İki Uç Sabit: } k_n = \\frac{n\\pi}{L} \\;\\; (n=1,2,3\\dots), \\qquad \\text{Bir Uç Sabit Bir Uç Serbest: } k_n = \\frac{(2n-1)\\pi}{2L}'
      }
    ],
    deadlyExamTrap:
      'SINAV TUZAĞI: "Serbest uç" dendiğinde X(L) = 0 yazmak en yaygın vize hatasıdır! Serbest uçta kütle halkası sürtünmesiz çubukta rahatça yukarı-aşağı kayar; orada sıfır olan şey konum değil, enine geri çağırıcı kuvvet yani telin EĞİMİDİR: (∂ψ/∂x)|_{x=L} = 0 (Maksimum genlik / Karın noktası!).',
    interactiveDemoType: 'separation'
  },
  {
    id: 'trick-orthogonality',
    title: 'Fourier Diklik (Orthogonality) İntegrali ve Katsayı Çekme Hilesi',
    badgeLabel: '🔍 Fourier Diklik İspatı',
    category: 'Lineer Cebir & Fourier',
    summary:
      'Sonsuz tane normal kipin toplamından oluşan genel bir tel hareketinde ψ(x,0) = ∑ A_n sin(nπx/L), sonsuz bilinmeyenli denklemi tek hamlede çözmemizi sağlayan mucizevi özellik, farklı harmoniklerin [0, L] aralığında birbirine dik (ortogonal) olmasıdır.',
    whenUsedInBerkeley:
      'Bölüm 2.3 (Sürekli tellerin genel hareketi, çekilip bırakılan gitar telinin Fourier katsayılarının hesabı) ve Bölüm 6 (Fourier analizi).',
    coreIdentityLatex:
      '\\int_0^L \\sin\\!\\left(\\frac{n\\pi x}{L}\\right) \\sin\\!\\left(\\frac{m\\pi x}{L}\\right) dx = \\frac{L}{2} \\delta_{nm} = \\begin{cases} L/2 & n = m \\\\ 0 & n \\neq m \\end{cases}',
    stepByStepProof: [
      {
        title: '1. n ≠ m Durumunda İntegralin Sıfır Olduğunun İspatı',
        text: 'sin A sin B = ½ [cos(A - B) - cos(A + B)] kimliğini kullanarak integrali açıkça alalım:',
        latex: '\\frac{1}{2} \\int_0^L \\left[ \\cos\\!\\left(\\frac{(n-m)\\pi x}{L}\\right) - \\cos\\!\\left(\\frac{(n+m)\\pi x}{L}\\right) \\right] dx = \\left[ \\frac{L}{2(n-m)\\pi}\\sin((n-m)\\pi) - \\dots \\right]_0^L = 0'
      },
      {
        title: '2. n = m Durumunda İntegralin L/2 Çıkması',
        text: 'n = m olduğunda ilk terim cos(0) = 1 olur ve [0, L] aralığında integrali L/2 verir:',
        latex: '\\int_0^L \\sin^2\\!\\left(\\frac{n\\pi x}{L}\\right) dx = \\frac{1}{2} \\int_0^L \\left[1 - \\cos\\!\\left(\\frac{2n\\pi x}{L}\\right)\\right] dx = \\frac{L}{2} - 0 = \\frac{L}{2}'
      },
      {
        title: '3. "Cımbızla Katsayı Çekme" Operasyonu',
        text: 'ψ(x,0) = ∑_{n=1}^∞ A_n sin(nπx/L) denkleminin her iki tarafını sin(mπx/L) ile çarpıp 0’dan L’ye integre ettiğimizde sonsuz toplamdan sadece n = m terimi sağ kalır:',
        latex: '\\int_0^L \\psi(x,0) \\sin\\!\\left(\\frac{m\\pi x}{L}\\right) dx = \\sum_{n=1}^{\\infty} A_n \\underbrace{\\int_0^L \\sin\\!\\left(\\frac{n\\pi x}{L}\\right)\\sin\\!\\left(\\frac{m\\pi x}{L}\\right)dx}_{(L/2)\\delta_{nm}} = \\frac{L}{2} A_m \\implies A_m = \\frac{2}{L} \\int_0^L \\psi(x,0) \\sin\\!\\left(\\frac{m\\pi x}{L}\\right) dx'
      }
    ],
    deadlyExamTrap:
      'SINAV TUZAĞI: Simetri kısayolu! Eğer tel tam ortasından (x = L/2) çekilip bırakıldıysa, başlangıç profili x = L/2’ye göre simetriktir. Çift numaralı kiplerin (n = 2, 4, 6...) x = L/2 noktasında DÜĞÜMÜ (node) vardır ve antisimetriktir. Uzun kısmi integrasyon yapmadan doğrudan "Simetri gereği tüm çift harmonikler A₂ = A₄ = ... = 0’dır" yazıp işlem yükünü yarıya indirebilirsin!',
    interactiveDemoType: 'orthogonality'
  }
];

