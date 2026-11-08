import { ChapterModule } from '../types/curriculum';

export const CHAPTER_1_MODULES: ChapterModule[] = [
  {
    id: 'mod-1-1',
    chapter: 1,
    code: '1.1',
    title: 'Giriş, Taylor Doğrusallaştırması ve Harmonik Hareketin Anatomisi',
    shortTitle: 'Taylor Doğrusallaştırması & BHH',
    bookPages: 'Berkeley Cilt 3 · Sayfa 1 – 6',
    summary:
      'Kararlı denge konumu etrafında salınan herhangi bir fiziksel dizgenin neden kaçınılmaz olarak Basit Harmonik Hareket (BHH) yaptığını Taylor serisiyle ispatlıyor, diferansiyel denklemini kuruyor ve kompleks fazör uzayına taşıyoruz.',
    coreQuestion:
      'Doğadaki kuvvetler (moleküller arası potansiyel, sarkaç, yay) aslında doğrusal olmadığı halde, neden küçük salınımların tamamı aynı d²x/dt² + ω₀²x = 0 denklemiyle yönetilir?',
    fundamentalEquations: [
      {
        label: 'Taylor Doğrusallaştırılmış Geri Çağırıcı Kuvvet',
        latex: '\\textcolor{#FC6255}{F(x)} = F(0) + F\'(0)\\textcolor{#58C4DD}{x} + \\frac{1}{2}F\'\'(0)\\textcolor{#58C4DD}{x^2} + \\dots \\approx -k_{\\text{eff}}\\textcolor{#58C4DD}{x}',
        formulaLatex: '\\textcolor{#FC6255}{F(x)} = F(0) + F\'(0)\\textcolor{#58C4DD}{x} + \\frac{1}{2}F\'\'(0)\\textcolor{#58C4DD}{x^2} + \\dots \\approx -k_{\\text{eff}}\\textcolor{#58C4DD}{x}',
        colorNote: 'Kırmızı: Geri çağırıcı kuvvet, Mavi: Denge konumundan yerdeğiştirme'
      },
      {
        label: 'Kanonik Harmonik Osilatör Denklemi',
        latex: '\\textcolor{#FC6255}{\\frac{d^2 x}{dt^2}} + \\textcolor{#F7D147}{\\omega_0^2} \\textcolor{#58C4DD}{x} = 0, \\qquad \\textcolor{#F7D147}{\\omega_0} = \\sqrt{\\frac{k_{\\text{eff}}}{m}}',
        formulaLatex: '\\textcolor{#FC6255}{\\frac{d^2 x}{dt^2}} + \\textcolor{#F7D147}{\\omega_0^2} \\textcolor{#58C4DD}{x} = 0, \\qquad \\textcolor{#F7D147}{\\omega_0} = \\sqrt{\\frac{k_{\\text{eff}}}{m}}',
        colorNote: 'Sarı: Özfrekans (sistemin içsel kimliği), Mavi: Durum değişkeni'
      },
      {
        label: 'Kompleks Fazör ve Reel İzdüşüm Çözümü',
        latex: '\\textcolor{#58C4DD}{x(t)} = \\text{Re}\\!\\left[ A e^{i(\\textcolor{#F7D147}{\\omega_0} t + \\phi)} \\right] = A\\cos(\\textcolor{#F7D147}{\\omega_0} t + \\phi)',
        formulaLatex: '\\textcolor{#58C4DD}{x(t)} = \\text{Re}\\!\\left[ A e^{i(\\textcolor{#F7D147}{\\omega_0} t + \\phi)} \\right] = A\\cos(\\textcolor{#F7D147}{\\omega_0} t + \\phi)',
        colorNote: 'Kompleks düzlemde ω₀ hızıyla dönen fazörün reel eksendeki gölgesi'
      }
    ],
    symbolicTerms: [
      {
        id: 'term-anharmonic',
        label: 'Anharmonik Taylor Terimi (-βx³)',
        latexBadge: '-\\beta x^3',
        colorRole: 'coupling',
        description: 'Taylor serisindeki 3. mertebe terimi tuttuğumuzda (büyük genlik) periyot genliğe bağımlı hale gelir ve faz uzayı elipsi deforme olur.',
        defaultActive: false,
        effectOnEquation: 'm ẍ + kx + βx³ = 0 (Duffing Osilatörü — İzokronizm bozulur)',
        effectOnSpace: 'Faz uzayındaki elips basıklaşır, frekans genlikle değişir.',
        sceneParamKey: 'anharmonicAlpha',
        activeValue: 0.35,
        inactiveValue: 0.0
      },
      {
        id: 'term-damping',
        label: 'Viskoz Sönüm Terimi (-b ẋ)',
        latexBadge: '-b\\dot{x}',
        colorRole: 'vel',
        description: 'Hızla orantılı enerji kaybı eklendiğinde toplam mekanik enerji üstel olarak azalır.',
        defaultActive: false,
        effectOnEquation: 'ẍ + γ ẋ + ω₀² x = 0 (Genlik e^{-γt/2} ile sönümlenir)',
        effectOnSpace: 'Faz uzayındaki kapalı elips merkeze doğru sarmal (spiral) çizer.',
        sceneParamKey: 'dampingGamma',
        activeValue: 0.15,
        inactiveValue: 0.0
      }
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        title: 'Kararlı Denge ve Taylor Serisi ile Doğrusallaştırma',
        subtitle: 'Herhangi bir V(x) potansiyel çukurunun dibinde parabolik yaklaşım',
        physicalMotivation:
          'Bir parçacık kararlı denge noktası x = 0’da dururken net kuvvet sıfırdır: F(0) = 0. Parçacığı x kadar kaydırdığımızda oluşan F(x) kuvvetini Taylor serisine açalım.',
        mainEquationLatex:
          '\\textcolor{#FC6255}{F(x)} = \\underbrace{F(0)}_{=0} + \\left(\\frac{dF}{dx}\\right)_0 \\textcolor{#58C4DD}{x} + \\frac{1}{2!}\\left(\\frac{d^2F}{dx^2}\\right)_0 \\textcolor{#58C4DD}{x^2} + \\frac{1}{3!}\\left(\\frac{d^3F}{dx^3}\\right)_0 \\textcolor{#58C4DD}{x^3} + \\dots',
        algebraicBreakdown: [
          {
            subStepTitle: 'Adım 1a: Kararlı Denge Şartı (Eğimin Negatif Olması)',
            explanation:
              'Denge noktasının kararlı olması için x > 0 iken kuvvet negatif (-x yönünde), x < 0 iken kuvvet pozitif (+x yönünde) olmalıdır. Dolayısıyla birinci türev negatiftir ve biz bu sabite -k_eff deriz:',
            formulaLatex: 'k_{\\text{eff}} \\equiv -\\left(\\frac{dF}{dx}\\right)_{x=0} = +\\left(\\frac{d^2 V}{dx^2}\\right)_{x=0} > 0'
          },
          {
            subStepTitle: 'Adım 1b: Küçük Genlik Limiti (Hooke Yasasının Doğuşu)',
            explanation:
              'x yeterince küçükse, x² ve x³ gibi yüksek mertebeli terimler doğrusal x teriminin yanında ihmal edilebilir düzeyde küçülür:',
            formulaLatex: '\\textcolor{#FC6255}{F(x)} \\approx -k_{\\text{eff}} \\textcolor{#58C4DD}{x}'
          }
        ],
        mathTrickIds: ['trick-taylor'],
        trainerCheckpoint: {
          questionPrompt:
            'Bir molekülün potansiyel enerjisi U(x) ile veriliyor. Kararlı denge noktası x₀ etrafında küçük salınımların etkin yay sabiti k_eff aşağıdakilerden hangisidir?',
          options: [
            {
              label: 'A',
              latex: 'k_{\\text{eff}} = \\left.\\frac{d^2 U}{dx^2}\\right|_{x=x_0}',
              isCorrect: true,
              feedback: 'Tebrikler! Kuvvet F = -dU/dx olduğundan, F\'(x₀) = -d²U/dx²|_{x₀} olur ve k_eff = -F\'(x₀) = +U\'\'(x₀) bulunur.'
            },
            {
              label: 'B',
              latex: 'k_{\\text{eff}} = \\left.\\frac{dU}{dx}\\right|_{x=x_0}',
              isCorrect: false,
              feedback: 'Dikkat: Denge noktasında birinci türev dU/dx = -F(x₀) zaten sıfıra eşittir!'
            },
            {
              label: 'C',
              latex: 'k_{\\text{eff}} = -\\left.\\frac{d^2 U}{dx^2}\\right|_{x=x_0}',
              isCorrect: false,
              feedback: 'İşaret hatası! Kararlı denge çukurunda U(x) yukarı konkavdır (U\'\' > 0), k_eff pozitif olmalıdır.'
            }
          ],
          examTip: 'Vizede "Verilen U(x) potansiyelinde küçük salınımların periyodunu bulunuz" sorusu gelirse: (1) dU/dx = 0 ile x₀’ı bul, (2) k_eff = d²U/dx²|_{x₀} hesapla, (3) ω₀ = √(k_eff/m) yaz!'
        },
        sceneDirective: {
          chapter: 1,
          modeId: 'shm-phasor',
          abstractTab: 'phase',
          highlightVector: 'force',
          presetParams: { omega0: 2.2, amplitude: 1.2, anharmonicAlpha: 0 },
          caption: 'Denge konumu etrafında geri çağırıcı kuvvet vektörü (kırmızı) daima yerdeğiştirmeye (mavi) zıt yönlüdür.'
        }
      },
      {
        stepNumber: 2,
        title: 'Newton’un 2. Yasası ve Kanonik Diferansiyel Denklem',
        subtitle: 'İkinci türevi kendisiyle ters işaretli olan fonksiyonların aranması',
        physicalMotivation:
          'Doğrusallaştırılmış geri çağırıcı kuvveti F = ma = m(d²x/dt²) denkleminde yerine koyup her iki tarafı m kütlesine böleriz.',
        mainEquationLatex:
          'm \\textcolor{#FC6255}{\\frac{d^2 x}{dt^2}} = -k_{\\text{eff}} \\textcolor{#58C4DD}{x} \\implies \\textcolor{#FC6255}{\\frac{d^2 x}{dt^2}} + \\textcolor{#F7D147}{\\omega_0^2} \\textcolor{#58C4DD}{x} = 0 \\quad \\left(\\textcolor{#F7D147}{\\omega_0^2} \\equiv \\frac{k_{\\text{eff}}}{m}\\right)',
        algebraicBreakdown: [
          {
            subStepTitle: 'Adım 2a: Diferansiyel Denklemin Fiziksel Okunuşu',
            explanation:
              'Denklem şunu söyler: "Bana öyle bir x(t) fonksiyonu bul ki, zamana göre iki kez türevini aldığımda fonksiyonun kendisinin -ω₀² katını versin."',
            formulaLatex: '\\frac{d^2}{dt^2} x(t) = -\\omega_0^2 x(t)'
          },
          {
            subStepTitle: 'Adım 2b: İki Bağımsız Çözümün Birleşimi',
            explanation:
              'İkinci mertebeden doğrusal bir diferansiyel denklemin genel çözümü iki keyfi sabit (başlangıç konumu ve başlangıç hızı) içermek zorundadır:',
            formulaLatex: '\\textcolor{#58C4DD}{x(t)} = A\\cos(\\textcolor{#F7D147}{\\omega_0} t) + B\\sin(\\textcolor{#F7D147}{\\omega_0} t) = C\\cos(\\textcolor{#F7D147}{\\omega_0} t + \\phi)'
          }
        ],
        mathTrickIds: ['trick-phasor'],
        trainerCheckpoint: {
          questionPrompt:
            'x(t) = A cos(ω₀t) + B sin(ω₀t) genel çözümünde t = 0 anındaki başlangıç konumu x(0) = x₀ ve başlangıç hızı ẋ(0) = v₀ verilirse A ve B katsayıları nedir?',
          options: [
            {
              label: 'A',
              latex: 'A = x_0, \\qquad B = \\frac{v_0}{\\omega_0}',
              isCorrect: true,
              feedback: 'Kesinlikle! x(0) = A cos(0) = A = x₀ ve ẋ(0) = B ω₀ cos(0) = B ω₀ = v₀ ⇒ B = v₀/ω₀. Bu ilişkiyi ezbere bilmek sınavda 5 dakika kazandırır.'
            },
            {
              label: 'B',
              latex: 'A = x_0, \\qquad B = v_0',
              isCorrect: false,
              feedback: 'Boyut hatası! sin(ω₀t) boyutsuz olduğundan B’nin boyutu metre olmalıdır; v₀’ı ω₀’a bölmeyi unutma.'
            },
            {
              label: 'C',
              latex: 'A = \\frac{v_0}{\\omega_0}, \\qquad B = x_0',
              isCorrect: false,
              feedback: 't = 0 anında sin(0) = 0 olduğu için x(0) doğrudan cos(0) katsayısı olan A’yı verir.'
            }
          ],
          examTip: 'Herhangi bir BHH sorusunda başlangıç koşulları verildiğinde hiç faz açısı aramadan doğrudan x(t) = x₀ cos(ω₀t) + (v₀/ω₀) sin(ω₀t) yazabilirsin!'
        },
        sceneDirective: {
          chapter: 1,
          modeId: 'shm-phasor',
          abstractTab: 'phasor',
          highlightVector: 'vel',
          presetParams: { omega0: 2.5, amplitude: 1.3, anharmonicAlpha: 0 },
          caption: 'Kompleks düzlemde dönen fazör: Hız vektörü (yeşil) konumdan 90° ileride, ivme vektörü (kırmızı) 180° ileridedir.'
        }
      },
      {
        stepNumber: 3,
        title: 'Mekanik Enerji Korunumu ve Faz Uzayı Elipsi',
        subtitle: 'Zamandan bağımsız birinci integral ve (x, v/ω₀) çemberi',
        physicalMotivation:
          'Hareket denklemini ẋ = dx/dt ile çarpıp zamana göre integre edersek toplam mekanik enerjinin her an sabit kaldığını ve faz uzayında kapalı bir yörünge çizdiğini kanıtlarız.',
        mainEquationLatex:
          'E = \\frac{1}{2}m \\textcolor{#83C167}{\\dot{x}^2} + \\frac{1}{2}k \\textcolor{#58C4DD}{x^2} = \\frac{1}{2}k A^2 = \\text{sabit}',
        algebraicBreakdown: [
          {
            subStepTitle: 'Adım 3a: Hareket Denklemini ẋ İle Çarpma Hilesi',
            explanation:
              'm ẍ + kx = 0 denklemini ẋ ile çarparsak tam diferansiyel elde ederiz:',
            formulaLatex: 'm \\dot{x}\\ddot{x} + k x\\dot{x} = \\frac{d}{dt}\\left(\\frac{1}{2}m\\dot{x}^2 + \\frac{1}{2}kx^2\\right) = 0'
          },
          {
            subStepTitle: 'Adım 3b: Normalize Faz Uzayı Koordinatları',
            explanation:
              'Enerji denklemini ½kA² ile bölersek (x, v/ω₀) düzleminde yarıçapı A olan kusursuz bir çember denklemi çıkar:',
            formulaLatex: '\\left(\\frac{\\textcolor{#58C4DD}{x}}{A}\\right)^2 + \\left(\\frac{\\textcolor{#83C167}{v / \\omega_0}}{A}\\right)^2 = \\cos^2(\\omega_0 t + \\phi) + \\sin^2(\\omega_0 t + \\phi) = 1'
          }
        ],
        mathTrickIds: ['trick-phasor'],
        trainerCheckpoint: {
          questionPrompt:
            'Harmonik bir salınganda konum x(t) = A cos(ω₀t) iken, potansiyel enerjinin U(t) = ½kx²(t) salınım frekansı nedir?',
          options: [
            {
              label: 'A',
              latex: '2\\omega_0 \\quad \\left(U(t) = \\frac{1}{4}kA^2 [1 + \\cos(2\\omega_0 t)]\\right)',
              isCorrect: true,
              feedback: 'Harika! cos²(ω₀t) = ½(1 + cos(2ω₀t)) yarım açı özdeşliği gereği kinetik ve potansiyel enerji bir periyotta İKİ KEZ maksimum olur (2ω₀).'
            },
            {
              label: 'B',
              latex: '\\omega_0',
              isCorrect: false,
              feedback: 'Unutma: Kütle hem +A hem de -A uç noktasındayken potansiyel enerji maksimumdur!'
            },
            {
              label: 'C',
              latex: '\\text{Sıfır (Sabittir)}',
              isCorrect: false,
              feedback: 'Toplam enerji E = K + U sabittir, ancak K(t) ve U(t) kendi aralarında 2ω₀ frekansıyla enerji takas eder.'
            }
          ],
          examTip: 'Karesel büyüklükler (Kinetik enerji, Potansiyel enerji, Anlık güç) daima hareket frekansının İKİ KATI (2ω₀) frekansla salınır.'
        },
        sceneDirective: {
          chapter: 1,
          modeId: 'shm-phasor',
          abstractTab: 'phase',
          highlightVector: 'pos',
          presetParams: { omega0: 2.0, amplitude: 1.4, anharmonicAlpha: 0 },
          caption: 'Normalize faz uzayında (x, v/ω₀) yörünge sabit yarıçaplı bir çemberdir; toplam enerji yarıçapın karesiyle orantılıdır.'
        }
      }
    ],
    solvedExamples: [
      {
        id: 'ex-1-1',
        title: 'Moleküler Lennard-Jones Benzeri Potansiyelde Salınım Frekansı',
        bookRef: 'Berkeley Cilt 3 · Bölüm 1 Ek Türetim',
        problemStatement:
          'İki atomlu bir molekülde atomlar arası potansiyel enerji U(r) = U₀ [ (r₀/r)² - 2(r₀/r) ] olarak modelleniyor. Denge konumunu ve küçük titreşimlerin açısal frekansını m, U₀, r₀ cinsinden türetiniz.',
        strategy:
          'Önce dU/dr = 0 ile denge uzaklığı r_denge bulunur, ardından ikinci türev d²U/dr² alınarak etkin yay sabiti k_eff elde edilir.',
        stepsLatex: [
          {
            text: '1. Birinci türevi sıfıra eşitleyerek denge noktasını bulalım:',
            math: '\\frac{dU}{dr} = U_0 \\left( -\\frac{2r_0^2}{r^3} + \\frac{2r_0}{r^2} \\right) = 0 \\implies r_{\\text{denge}} = r_0'
          },
          {
            text: '2. İkinci türevi r = r₀ noktasında hesaplayarak k_eff bulalım:',
            math: 'k_{\\text{eff}} = \\left.\\frac{d^2 U}{dr^2}\\right|_{r=r_0} = U_0 \\left[ \\frac{6r_0^2}{r^4} - \\frac{4r_0}{r^3} \\right]_{r=r_0} = \\frac{2 U_0}{r_0^2}'
          },
          {
            text: '3. Küçük salınımların açısal frekansı:',
            math: '\\omega_0 = \\sqrt{\\frac{k_{\\text{eff}}}{m}} = \\sqrt{\\frac{2 U_0}{m r_0^2}}'
          }
        ],
        keyTakeaway:
          'Potansiyel fonksiyonu ne kadar karmaşık görünürse görünsün, denge noktası etrafındaki küçük salınımlar sadece ikinci türeve (eğriliğe) bakar.'
      }
    ],
    commonTraps: [
      {
        trap: 'Kompleks çözümde kinetik enerjiyi ½ m (Re[ż²]) olarak hesaplamak.',
        whyWrong: 'Kare alma işlemi doğrusal değildir; Re[z²] ifadesi cos²(ωt) - sin²(ωt) = cos(2ωt) verir ve negatif değerler alır!',
        correctApproach: 'Önce hızın reel kısmını al: v(t) = Re[ż] = -ω₀ A sin(ω₀t + φ), sonra karesini al: ½ m v²(t).'
      }
    ]
  },
  {
    id: 'mod-1-2',
    chapter: 1,
    code: '1.2',
    title: 'Tek Özgürlük Dereceli Fiziksel Sistemlerin Türetimleri (Boyuna vs Enine)',
    shortTitle: 'Sarkaç, LC ve Enine/Boyuna Yay',
    bookPages: 'Berkeley Cilt 3 · Sayfa 6 – 12',
    summary:
      'Crawford’un en sevdiği vize konusu: Basit sarkaç, LC devresi, U-borusu ve özellikle "iki yay arasındaki kütlenin boyuna vs enine salınımları" için geri çağırıcı kuvvet türetimleri ve gevşek yay (Slinky) yaklaşımı.',
    coreQuestion:
      'Aynı kütle ve yay sistemi boyuna titreşirken yay geriliminden bağımsız salındığı halde, enine (transverse) titreşirken neden teldeki T₀ ön-gerilimine bağımlı hale gelir?',
    fundamentalEquations: [
      {
        label: 'Boyuna (Longitudinal) Kütle-Yay Frekansı',
        latex: 'm\\textcolor{#FC6255}{\\ddot{x}} = -2k\\textcolor{#58C4DD}{x} \\implies \\textcolor{#F7D147}{\\omega_{\\text{boyuna}}^2} = \\frac{2k}{m}',
        formulaLatex: 'm\\textcolor{#FC6255}{\\ddot{x}} = -2k\\textcolor{#58C4DD}{x} \\implies \\textcolor{#F7D147}{\\omega_{\\text{boyuna}}^2} = \\frac{2k}{m}',
        colorNote: 'Yayların doğal boyu L₀ ne olursa olsun geri çağırıcı kuvvet 1. mertebeden -2kx’tir'
      },
      {
        label: 'Enine (Transverse) Salınım Tam ve Yaklaşık Geri Çağırıcı Kuvveti',
        latex: '\\textcolor{#FC6255}{F_y} = -2 T \\sin\\theta \\approx -\\frac{2 T_0}{a} \\textcolor{#58C4DD}{y} \\implies \\textcolor{#F7D147}{\\omega_{\\text{enine}}^2} = \\frac{2 T_0}{m a}',
        formulaLatex: '\\textcolor{#FC6255}{F_y} = -2 T \\sin\\theta \\approx -\\frac{2 T_0}{a} \\textcolor{#58C4DD}{y} \\implies \\textcolor{#F7D147}{\\omega_{\\text{enine}}^2} = \\frac{2 T_0}{m a}',
        colorNote: 'a: Denge yarı-uzunluğu, T₀ = k(a - a₀): Ön-gerilim kuvveti'
      },
      {
        label: 'Elektromekanik Dualite (LC Devresi)',
        latex: 'L\\textcolor{#FC6255}{\\ddot{Q}} + \\frac{1}{C}\\textcolor{#58C4DD}{Q} = 0 \\quad \\Longleftrightarrow \\quad m\\textcolor{#FC6255}{\\ddot{x}} + k\\textcolor{#58C4DD}{x} = 0 \\quad \\left(\\textcolor{#F7D147}{\\omega_0} = \\frac{1}{\\sqrt{LC}}\\right)',
        formulaLatex: 'L\\textcolor{#FC6255}{\\ddot{Q}} + \\frac{1}{C}\\textcolor{#58C4DD}{Q} = 0 \\quad \\Longleftrightarrow \\quad m\\textcolor{#FC6255}{\\ddot{x}} + k\\textcolor{#58C4DD}{x} = 0 \\quad \\left(\\textcolor{#F7D147}{\\omega_0} = \\frac{1}{\\sqrt{LC}}\\right)',
        colorNote: 'Kütle m ↔ İndüktans L, Yay sabiti k ↔ Ters Kapasitans 1/C, Konum x ↔ Yük Q'
      }
    ],
    symbolicTerms: [
      {
        id: 'term-slinky-limit',
        label: 'Gevşek Yay (Slinky: a₀ ≪ a) Limiti',
        latexBadge: 'a_0 \\to 0',
        colorRole: 'mode',
        description: 'Yayın gerilmemiş boyu a₀, gerilmiş boyu a yanında ihmal edildiğinde T₀ = k(a - a₀) ≈ ka olur ve enine frekans boyuna frekansa eşitlenir!',
        defaultActive: true,
        effectOnEquation: 'T₀ = ka ⇒ ω_enine² = 2T₀/(ma) = 2k/m = ω_boyuna²',
        effectOnSpace: 'Kuvvet üçgeninde enine geri çağırıcı kuvvet maksimum doğrusal değere ulaşır.',
        sceneParamKey: 'tensionRatio',
        activeValue: 1.0,
        inactiveValue: 0.25
      }
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        title: 'Enine (Transverse) Salınımın Geometrik Kuvvet Üçgeni Türetimi',
        subtitle: 'Crawford Denklem (1.29) – (1.35): Neden sin θ ve binom açılımı gerekir?',
        physicalMotivation:
          'İki duvar arasına gerilmiş, her birinin yay sabiti k, serbest boyu a₀ ve gerilmiş boyu a olan iki yayın ortasındaki m kütlesini y yönünde (enine) çekelim. Yayların yeni boyu l = √(a² + y²) olur.',
        mainEquationLatex:
          '\\textcolor{#FC6255}{F_y} = -2 T(l) \\sin\\theta = -2 k (l - a_0) \\frac{\\textcolor{#58C4DD}{y}}{l} = -2k \\textcolor{#58C4DD}{y} \\left(1 - \\frac{a_0}{\\sqrt{a^2 + \\textcolor{#58C4DD}{y^2}}}\\right)',
        algebraicBreakdown: [
          {
            subStepTitle: 'Adım 1a: Binom Açılımı ile √(a² + y²) İfadesinin Doğrusallaştırılması',
            explanation:
              'y ≪ a için 1 / √(a² + y²) = (1/a)(1 + y²/a²)^{-1/2} ≈ (1/a)(1 - y²/2a²) yazılır:',
            formulaLatex: '\\textcolor{#FC6255}{F_y} \\approx -2k \\textcolor{#58C4DD}{y} \\left[ 1 - \\frac{a_0}{a}\\left(1 - \\frac{y^2}{2a^2}\\right) \\right] = -\\frac{2k(a - a_0)}{a}\\textcolor{#58C4DD}{y} - \\frac{k a_0}{a^3}\\textcolor{#58C4DD}{y^3}'
          },
          {
            subStepTitle: 'Adım 1b: Ön-Gerilim T₀ = k(a - a₀) Cinsinden İfade',
            explanation:
              'Denge durumundaki yay gerilimi T₀ = k(a - a₀) > 0 ise y³ terimi ihmal edilir ve sistem T₀ gerilimiyle kontrol edilen bir BHH yapar:',
            formulaLatex: 'm\\textcolor{#FC6255}{\\ddot{y}} + \\left(\\frac{2 T_0}{a}\\right)\\textcolor{#58C4DD}{y} = 0 \\implies \\textcolor{#F7D147}{\\omega_{\\text{enine}}^2} = \\frac{2 T_0}{m a}'
          }
        ],
        mathTrickIds: ['trick-taylor'],
        trainerCheckpoint: {
          questionPrompt:
            'Eğer yaylar başlangıçta HİÇ gerilmemişse (a = a₀, yani ön-gerilim T₀ = 0 ise) kütleyi enine y kadar çekip bıraktığımızda ne olur?',
          options: [
            {
              label: 'A',
              latex: 'F_y \\approx -\\frac{k}{a^2} y^3 \\text{ olur; doğrusal terim yok olur ve hareket BHH OLMAZ!}',
              isCorrect: true,
              feedback: 'Mükemmel! T₀ = 0 iken birinci mertebe terim sıfırlanır, geri çağırıcı kuvvet y³ ile orantılı olur ve periyot genliğe ters orantılı (T ∝ 1/y₀) hale gelir!'
            },
            {
              label: 'B',
              latex: '\\text{Yine } \\omega = \\sqrt{2k/m} \\text{ ile harmonik salınır.}',
              isCorrect: false,
              feedback: 'a = a₀ koyduğunda doğrusal -2T₀y/a terimi sıfır olur!'
            },
            {
              label: 'C',
              latex: '\\text{Hiç geri çağırıcı kuvvet oluşmaz, kütle olduğu yerde kalır.}',
              isCorrect: false,
              feedback: 'Kütle çekildiğinde yay uzadığı için 3. mertebeden (-ky³/a²) bir geri çağırıcı kuvvet oluşur.'
            }
          ],
          examTip: 'Crawford’un en ünlü kavramsal sorusu budur: Gerilimsiz (T₀ = 0) bir telde küçük enine salınımlar doğrusal DEĞİLDİR (F_y ∝ -y³).'
        },
        sceneDirective: {
          chapter: 1,
          modeId: 'transverse-force',
          abstractTab: 'potential',
          highlightVector: 'force',
          presetParams: { omega0: 2.0, amplitude: 1.1, tensionRatio: 1.0 },
          caption: 'Enine salınımda geri çağırıcı kuvvet, yaylardaki T₀ geriliminin düşey izdüşümü olan -2T₀ sin θ ≈ -2T₀(y/a) bileşeninden doğar.'
        }
      },
      {
        stepNumber: 2,
        title: 'Basit Sarkaç ve LC Devresi Benzeşim Türetimi',
        subtitle: 'Açısal momentum ve Kirchhoff denklemlerinin aynı matematiksel kalıba dökülmesi',
        physicalMotivation:
          'Uzunluğu ℓ olan basit sarkaçta teğetsel geri çağırıcı kuvvet F_θ = -mg sin θ’dır. LC devresinde ise indüktör ve kondansatör gerilimleri toplamı sıfırdır.',
        mainEquationLatex:
          '\\textcolor{#FC6255}{\\ddot{\\theta}} + \\textcolor{#F7D147}{\\frac{g}{\\ell}} \\sin\\theta \\approx \\textcolor{#FC6255}{\\ddot{\\theta}} + \\textcolor{#F7D147}{\\frac{g}{\\ell}} \\textcolor{#58C4DD}{\\theta} = 0, \\qquad L\\textcolor{#FC6255}{\\ddot{Q}} + \\frac{1}{C}\\textcolor{#58C4DD}{Q} = 0',
        algebraicBreakdown: [
          {
            subStepTitle: 'Adım 2a: Basit Sarkaçta Yay Uzunluğu s = ℓθ Geçişi',
            explanation:
              'Küçük açılarda sin θ ≈ θ ≈ x/ℓ olduğundan yatay hareket denklemi etkin yay sabiti k_eff = mg/ℓ olan bir kütle-yay denklemine dönüşür:',
            formulaLatex: 'm\\ddot{x} + \\left(\\frac{mg}{\\ell}\\right)x = 0 \\implies \\omega_0 = \\sqrt{\\frac{g}{\\ell}}'
          },
          {
            subStepTitle: 'Adım 2b: LC Devresinde Enerji Eşdeğerliği',
            explanation:
              'Manyetik enerji ½LI² mekanik kinetik enerjiye (½mv²), elektriksel enerji ½Q²/C ise yay potansiyel enerjisine (½kx²) karşılık gelir:',
            formulaLatex: 'E_{\\text{elektrik}} = \\frac{1}{2}L \\textcolor{#83C167}{\\dot{Q}^2} + \\frac{1}{2C}\\textcolor{#58C4DD}{Q^2} = \\text{sabit}'
          }
        ],
        mathTrickIds: ['trick-taylor'],
        trainerCheckpoint: {
          questionPrompt:
            'Slinky (gevşek yay, a₀ ≪ a) приближımında enine salınım frekansı ω_enine ile boyuna salınım frekansı ω_boyuna arasındaki ilişki nedir?',
          options: [
            {
              label: 'A',
              latex: '\\omega_{\\text{enine}} = \\omega_{\\text{boyuna}} = \\sqrt{\\frac{2k}{m}}',
              isCorrect: true,
              feedback: 'Doğru! Gevşek yayda a₀ ≪ a olduğundan T₀ = k(a - a₀) ≈ ka olur. Bunu ω_enine² = 2T₀/(ma) içine koyunca a’lar sadeleşir ve 2k/m çıkar!'
            },
            {
              label: 'B',
              latex: '\\omega_{\\text{enine}} \\ll \\omega_{\\text{boyuna}}',
              isCorrect: false,
              feedback: 'Bu durum sadece a - a₀ ≪ a₀ (az gerilmiş sert yay) durumunda geçerlidir.'
            },
            {
              label: 'C',
              latex: '\\omega_{\\text{enine}} = 2\\omega_{\\text{boyuna}}',
              isCorrect: false,
              feedback: 'Her iki durumda da etkin geri çağırıcı sabit 2k olur.'
            }
          ],
          examTip: 'Slinky yaklaşımı (T₀ ≈ ka) Bölüm 2’de sürekli yay/tel dalga hızını hesaplarken de kilit rol oynar.'
        },
        sceneDirective: {
          chapter: 1,
          modeId: 'transverse-force',
          abstractTab: 'phase',
          highlightVector: 'pos',
          presetParams: { omega0: 2.2, amplitude: 1.0, tensionRatio: 1.0 },
          caption: 'Slinky limitinde (T₀ ≈ ka) enine ve boyuna salınımların faz uzayı yörüngeleri birebir çakışır.'
        }
      }
    ],
    solvedExamples: [
      {
        id: 'ex-1-2',
        title: 'U-Borusunda Sıvı Sütununun Salınımı',
        bookRef: 'Berkeley Cilt 3 · Bölüm 1 Klasik Türetim',
        problemStatement:
          'Kesit alanı A, toplam sıvı uzunluğu L ve özkütlesi ρ olan düzgün bir U-borusundaki sıvı denge düzeyinden y kadar yükseltilip bırakılıyor. Salınım periyodunu türetiniz.',
        strategy:
          'Toplam sıvı kütlesi M = ρAL’dir. Bir koldaki sıvı y kadar yükseldiğinde diğer kolda y kadar alçalır; seviye farkı 2y olur.',
        stepsLatex: [
          {
            text: '1. Seviye farkı 2y olan sıvı sütununun ağırlığı geri çağırıcı kuvveti oluşturur:',
            math: 'F = -(A \\cdot 2y \\cdot \\rho) g = -2\\rho A g y'
          },
          {
            text: '2. Toplam hareketli sıvı kütlesi M = ρAL için Newton denklemi:',
            math: '(\\rho A L)\\ddot{y} + 2\\rho A g y = 0 \\implies \\ddot{y} + \\left(\\frac{2g}{L}\\right)y = 0'
          },
          {
            text: '3. Açısal frekans ve periyot:',
            math: '\\omega_0 = \\sqrt{\\frac{2g}{L}}, \\qquad T = 2\\pi\\sqrt{\\frac{L}{2g}}'
          }
        ],
        keyTakeaway:
          'Bir koldaki yükselme y iken iki kol arasındaki basınç/yükseklik farkının 2y olduğuna dikkat etmek bu tip soruların püf noktasıdır.'
      }
    ],
    commonTraps: [
      {
        trap: 'Enine salınımda yayların uzama miktarını Δl = y sanmak.',
        whyWrong: 'Dik üçgende hipotenüs l = √(a² + y²) ≈ a + y²/(2a)’dır; yani yay uzaması y ile değil y² ile orantılıdır!',
        correctApproach: 'Enine geri çağırıcı kuvvet yayların uzamasından değil, mevcut T₀ ön-geriliminin sin θ ≈ y/a eğim bileşeninden gelir.'
      }
    ]
  },
  {
    id: 'mod-1-3',
    chapter: 1,
    code: '1.3',
    title: 'Çizgisellik (Linearity), Üstüste Gelme İlkesi ve Lissajous Yörüngeleri',
    shortTitle: 'Süperpozisyon İlkesi & 2B Osilatör',
    bookPages: 'Berkeley Cilt 3 · Sayfa 12 – 15',
    summary:
      'Diferansiyel operatör L[x]’in doğrusallığının matematiksel tanımını yapıyor, doğrusal olmayan (anharmonik) terimler eklendiğinde süperpozisyonun neden çöktüğünü çapraz terimlerle ispatlıyor ve 2 boyutlu dik harmonik hareketleri inceliyoruz.',
    coreQuestion:
      'İki ayrı çözümün toplamının yine bir çözüm olması (Süperpozisyon İlkesi) hangi matematiksel şarta bağlıdır ve bu şart bozulursa dalgalara ne olur?',
    fundamentalEquations: [
      {
        label: 'Doğrusal Diferansiyel Operatör Şartı',
        latex: '\\mathcal{L}[c_1 \\textcolor{#58C4DD}{x_1(t)} + c_2 \\textcolor{#58C4DD}{x_2(t)}] = c_1 \\mathcal{L}[\\textcolor{#58C4DD}{x_1(t)}] + c_2 \\mathcal{L}[\\textcolor{#58C4DD}{x_2(t)}] = 0',
        formulaLatex: '\\mathcal{L}[c_1 \\textcolor{#58C4DD}{x_1(t)} + c_2 \\textcolor{#58C4DD}{x_2(t)}] = c_1 \\mathcal{L}[\\textcolor{#58C4DD}{x_1(t)}] + c_2 \\mathcal{L}[\\textcolor{#58C4DD}{x_2(t)}] = 0',
        colorNote: 'Türev operatörü d²/dt² ve birinci kuvvetten x çarpımı doğrusaldır'
      },
      {
        label: '2 Boyutlu Harmonik Osilatör ve Faz Farkı Elipsi',
        latex: '\\textcolor{#58C4DD}{x(t)} = A_x\\cos(\\omega_x t), \\quad \\textcolor{#83C167}{y(t)} = A_y\\cos(\\omega_y t + \\Delta\\phi)',
        formulaLatex: '\\textcolor{#58C4DD}{x(t)} = A_x\\cos(\\omega_x t), \\quad \\textcolor{#83C167}{y(t)} = A_y\\cos(\\omega_y t + \\Delta\\phi)',
        colorNote: 'ω_x = ω_y iken Δφ faz farkı elipsin eksen eğikliğini ve dönüş yönünü belirler'
      }
    ],
    symbolicTerms: [
      {
        id: 'term-nonlinear-cross',
        label: 'Karesel Non-Lineer Terim (+αx²)',
        latexBadge: '+\\alpha x^2',
        colorRole: 'force',
        description: '(x₁ + x₂)² = x₁² + x₂² + 2x₁x₂ açılımındaki 2αx₁x₂ çapraz terimi yüzünden iki çözümün toplamı denklemi SAĞLAMAZ!',
        defaultActive: false,
        effectOnEquation: 'L[x₁ + x₂] = 2α x₁(t) x₂(t) ≠ 0 (Süperpozisyon Çöker)',
        effectOnSpace: 'Frekanslar birbirine karışır (harmonik üretimi ve frekans karıştırma doğar).',
        sceneParamKey: 'anharmonicAlpha',
        activeValue: 0.4,
        inactiveValue: 0.0
      }
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        title: 'Süperpozisyon İlkesinin Cebirsel İspatı ve Çöküş Testi',
        subtitle: 'Problem 1.13 ve Bölüm 1.3: Doğrusal vs Doğrusal Olmayan Operatörler',
        physicalMotivation:
          'L[x] = ẍ + ω₀²x + αx² = 0 denkleminde x₁(t) ve x₂(t) ayrı ayrı birer çözüm olsun. Toplamları olan x(t) = x₁(t) + x₂(t)’yi denkleme koyup ne kaldığına bakalım.',
        mainEquationLatex:
          '\\frac{d^2(x_1+x_2)}{dt^2} + \\omega_0^2(x_1+x_2) + \\alpha(x_1+x_2)^2 = \\underbrace{(\\ddot{x}_1 + \\omega_0^2 x_1 + \\alpha x_1^2)}_{=0} + \\underbrace{(\\ddot{x}_2 + \\omega_0^2 x_2 + \\alpha x_2^2)}_{=0} + \\textcolor{#FC6255}{2\\alpha x_1 x_2}',
        algebraicBreakdown: [
          {
            subStepTitle: 'Adım 1a: Doğrusal Durum (α = 0)',
            explanation:
              'α = 0 olduğunda sağdaki kırmızı 2αx₁x₂ artık terimi yok olur ve x₁ + x₂ toplamı denklemi kusursuz sağlar.',
            formulaLatex: '\\alpha = 0 \\implies \\mathcal{L}[x_1 + x_2] = 0'
          },
          {
            subStepTitle: 'Adım 1b: Doğrusal Olmayan Etkileşim (α ≠ 0)',
            explanation:
              'α ≠ 0 ise 2αx₁x₂ = 2α cos(ω₁t)cos(ω₂t) = α[cos((ω₁+ω₂)t) + cos((ω₁-ω₂)t)] terimi doğar; yani sistemde başlangıçta olmayan toplam ve fark frekansları üretilir (Non-lineer Optik!).',
            formulaLatex: '2\\alpha \\cos(\\omega_1 t)\\cos(\\omega_2 t) = \\alpha\\cos((\\omega_1+\\omega_2)t) + \\alpha\\cos((\\omega_1-\\omega_2)t)'
          }
        ],
        mathTrickIds: ['trick-trig-beats'],
        trainerCheckpoint: {
          questionPrompt:
            'Aşağıdaki diferansiyel denklemlerden hangisinde x₁(t) ve x₂(t) çözüm olduğunda x₁(t) + x₂(t) de kesinlikle bir çözümdür (Homojen ve Doğrusal)?',
          options: [
            {
              label: 'A',
              latex: '\\ddot{x} + \\gamma(t)\\dot{x} + \\omega_0^2(t) x = 0',
              isCorrect: true,
              feedback: 'Doğru! Katsayılar zamana bağlı olsa bile x, ẋ ve ẍ birinci kuvvetten bulunduğu ve sağ taraf 0 olduğu için denklem homojen ve doğrusaldır.'
            },
            {
              label: 'B',
              latex: '\\ddot{x} + \\omega_0^2 x = F_0 \\cos(\\omega t) \\quad (F_0 \\neq 0)',
              isCorrect: false,
              feedback: 'Dikkat! Bu denklem homojen DEĞİLDİR. İki çözümü toplarsan sağ tarafta 2 F₀ cos(ωt) elde edersin!'
            },
            {
              label: 'C',
              latex: '\\ddot{x} + \\omega_0^2 \\sin(x) = 0',
              isCorrect: false,
              feedback: 'sin(x₁ + x₂) ≠ sin(x₁) + sin(x₂) olduğu için tam sarkaç denklemi doğrusal değildir.'
            }
          ],
          examTip: 'Homojen olmayan denklemde (sağ tarafta sürücü kuvvet F(t) varsa) iki özel çözümün toplamı F(t) yerine 2F(t) kuvvetine karşılık gelir!'
        },
        sceneDirective: {
          chapter: 1,
          modeId: 'lissajous-2d',
          abstractTab: 'lissajous',
          highlightVector: 'pos',
          presetParams: { freqRatio: 1.0, phaseDiff: 1.57, amplitude: 1.2 },
          caption: 'İki dik doğrusal salınımın (x ve y) bağımsız süperpozisyonu düzlemde Lissajous yörüngelerini oluşturur.'
        }
      }
    ],
    solvedExamples: [
      {
        id: 'ex-1-3',
        title: 'Dik Salınımlardan Faz Farkı ve Kutuplanma Elipsinin Türetimi',
        bookRef: 'Berkeley Cilt 3 · Sayfa 14 (Bölüm 8 Kutuplanmaya Hazırlık)',
        problemStatement:
          'x(t) = A cos(ωt) ve y(t) = A cos(ωt + Δφ) olarak verilen 2 boyutlu salınganın Δφ = 0, π/2 ve π değerleri için yörünge denklemini (t’yi yok ederek) bulunuz.',
        strategy:
          'y(t) = A [cos(ωt)cos(Δφ) - sin(ωt)sin(Δφ)] açılımında cos(ωt) = x/A ve sin(ωt) = √(1 - (x/A)²) yerine konur.',
        stepsLatex: [
          {
            text: '1. Trigonometrik toplam açılımından t’yi yok edersek genel elips denklemi:',
            math: '\\left(\\frac{x}{A}\\right)^2 + \\left(\\frac{y}{A}\\right)^2 - 2\\left(\\frac{x}{A}\\right)\\left(\\frac{y}{A}\\right)\\cos(\\Delta\\phi) = \\sin^2(\\Delta\\phi)'
          },
          {
            text: '2. Özel faz farkları:',
            math: '\\Delta\\phi = 0 \\implies y = +x \\text{ (Doğrusal)}, \\quad \\Delta\\phi = \\frac{\\pi}{2} \\implies x^2 + y^2 = A^2 \\text{ (Çembersel)}, \\quad \\Delta\\phi = \\pi \\implies y = -x'
          }
        ],
        keyTakeaway:
          'Bu denklem hem mekanik 2B salınganın yörüngesidir hem de Bölüm 8’deki ışığın doğrusal, dairesel ve eliptik polarizasyonunun (kutuplanmasının) tam matematiksel temelidir!'
      }
    ],
    commonTraps: [
      {
        trap: 'Homojen olmayan denklemde (ẍ + ω₀²x = F₀ cos ωt) iki çözümün toplamının yine aynı denklemi sağladığını sanmak.',
        whyWrong: 'L[x₁ + x₂] = L[x₁] + L[x₂] = F₀ cos ωt + F₀ cos ωt = 2 F₀ cos ωt olur.',
        correctApproach: 'Homojen olmayan denklemde genel çözüm = (Homojen denklemin genel çözümü) + (1 adet özel çözüm) şeklindedir.'
      }
    ]
  },
  {
    id: 'mod-1-4',
    chapter: 1,
    code: '1.4',
    title: 'İki Özgürlük Dereceli Dizgelerin Özgür Salınımları ve Normal Kipler',
    shortTitle: '2 Özgürlük Derecesi & Normal Kipler',
    bookPages: 'Berkeley Cilt 3 · Sayfa 15 – 21',
    summary:
      'Birbirine yayla bağlı iki kütle (veya iki sarkaç / iki LC devresi) için çiftlenimli diferansiyel denklemleri kuruyor, Normal Koordinatlar (q₁, q₂) ve Seküler Determinant yöntemleriyle özfrekansları (ω₁, ω₂) baştan sona türetiyoruz.',
    coreQuestion:
      'Karmaşık ve birbirine dolanmış iki hareket denklemini (x_a ve x_b), birbirinden tamamen habersiz iki bağımsız harmonik osilatöre (q₁ ve q₂) nasıl ayrıştırırız?',
    fundamentalEquations: [
      {
        label: 'Çiftlenimli Hareket Denklemleri (2 Kütle 3 Yay)',
        latex: '\\begin{aligned} m\\textcolor{#FC6255}{\\ddot{x}_a} &= -k\\textcolor{#58C4DD}{x_a} - \\textcolor{#B189DF}{K_c}(\\textcolor{#58C4DD}{x_a - x_b}) \\\\ m\\textcolor{#FC6255}{\\ddot{x}_b} &= -k\\textcolor{#58C4DD}{x_b} - \\textcolor{#B189DF}{K_c}(\\textcolor{#58C4DD}{x_b - x_a}) \\end{aligned}',
        formulaLatex: '\\begin{aligned} m\\textcolor{#FC6255}{\\ddot{x}_a} &= -k\\textcolor{#58C4DD}{x_a} - \\textcolor{#B189DF}{K_c}(\\textcolor{#58C4DD}{x_a - x_b}) \\\\ m\\textcolor{#FC6255}{\\ddot{x}_b} &= -k\\textcolor{#58C4DD}{x_b} - \\textcolor{#B189DF}{K_c}(\\textcolor{#58C4DD}{x_b - x_a}) \\end{aligned}',
        colorNote: 'Mor K_c: Orta çiftlenim (kuplaj) yayı sabiti; k: Dış yayların sabiti'
      },
      {
        label: 'Normal Koordinatlar ve Ayrışmış Özdeğer Denklemleri',
        latex: '\\textcolor{#58C4DD}{q_1} = x_a + x_b \\implies \\ddot{q}_1 + \\textcolor{#F7D147}{\\omega_1^2} q_1 = 0, \\qquad \\textcolor{#58C4DD}{q_2} = x_a - x_b \\implies \\ddot{q}_2 + \\textcolor{#F7D147}{\\omega_2^2} q_2 = 0',
        formulaLatex: '\\textcolor{#58C4DD}{q_1} = x_a + x_b \\implies \\ddot{q}_1 + \\textcolor{#F7D147}{\\omega_1^2} q_1 = 0, \\qquad \\textcolor{#58C4DD}{q_2} = x_a - x_b \\implies \\ddot{q}_2 + \\textcolor{#F7D147}{\\omega_2^2} q_2 = 0',
        colorNote: 'q₁ (Simetrik Kip): ω₁² = k/m | q₂ (Antisimetrik Kip): ω₂² = (k + 2K_c)/m'
      }
    ],
    symbolicTerms: [
      {
        id: 'term-coupling-kc',
        label: 'Çiftlenim Yayı (K_c) Etkisi',
        latexBadge: 'K_c(\\psi_a - \\psi_b)',
        colorRole: 'coupling',
        description: 'Orta yay sabiti K_c artırıldığında simetrik kip frekansı ω₁ hiç değişmezken, antisimetrik kip frekansı ω₂ = √((k+2K_c)/m) hızla yükselir!',
        defaultActive: true,
        effectOnEquation: 'ω₂² - ω₁² = 2K_c / m (Frekans yarılması kuplajla doğru orantılıdır)',
        effectOnSpace: 'Kip 2’de orta yay 2 kat sıkışır/gerilir, Kip 1’de orta yay sabit boyda sadece öteleme yapar.',
        sceneParamKey: 'couplingKc',
        activeValue: 0.8,
        inactiveValue: 0.15
      }
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        title: 'Kuvvet Analizi ve Çiftlenimli Denklemlerin Kurulumu',
        subtitle: 'Orta yayın uzama miktarı (x_b - x_a) ve işaret kuralları',
        physicalMotivation:
          'Sol kütle x_a kadar sağa, sağ kütle x_b kadar sağa kaysın. Sol yay x_a kadar uzar (-kx_a çeker). Orta yay ise (x_b - x_a) kadar uzar; dolayısıyla a kütlesini sağa doğru +K_c(x_b - x_a) = -K_c(x_a - x_b) kuvvetiyle çeker.',
        mainEquationLatex:
          '\\begin{cases} m\\textcolor{#FC6255}{\\ddot{x}_a} + (k + \\textcolor{#B189DF}{K_c})\\textcolor{#58C4DD}{x_a} - \\textcolor{#B189DF}{K_c}\\textcolor{#58C4DD}{x_b} = 0 \\\\ m\\textcolor{#FC6255}{\\ddot{x}_b} + (k + \\textcolor{#B189DF}{K_c})\\textcolor{#58C4DD}{x_b} - \\textcolor{#B189DF}{K_c}\\textcolor{#58C4DD}{x_a} = 0 \\end{cases}',
        algebraicBreakdown: [
          {
            subStepTitle: 'Adım 1a: İşaret Kontrolü ("Fizikçi Sağlama Testi")',
            explanation:
              'Yazdığımız denklemin işaretlerini kontrol etmek için x_a = 0 tutup x_b > 0 (sağ kütleyi sağa çekelim) düşünelim: Birinci denklem m ẍ_a = +K_c x_b > 0 verir; yani a kütlesi de sağa doğru ivmelenir! İşaretlerimiz %100 doğrudur.',
            formulaLatex: 'x_a = 0, \\; x_b > 0 \\implies m\\ddot{x}_a = +K_c x_b > 0 \\quad (\\checkmark)'
          }
        ],
        mathTrickIds: ['trick-determinant'],
        trainerCheckpoint: {
          questionPrompt:
            'Eğer iki kütle arasındaki orta yay K_c yerine, iki sarkaç kütleleri arasına K_c yayları bağlanmış olsaydı, tek bir sarkacın kendi geri çağırıcı sabiti k yerine ne gelirdi?',
          options: [
            {
              label: 'A',
              latex: 'k \\longrightarrow \\frac{mg}{\\ell} \\quad \\left(\\omega_0^2 = \\frac{g}{\\ell}\\right)',
              isCorrect: true,
              feedback: 'Tam isabet! Sarkaçta yerçekiminin geri çağırıcı kuvveti -(mg/ℓ)x olduğundan, kütle-yay denklemindeki dış yay sabiti k’nın yerini doğrudan mg/ℓ alır.'
            },
            {
              label: 'B',
              latex: 'k \\longrightarrow mg\\ell',
              isCorrect: false,
              feedback: 'Boyut kontrolü yap: mgℓ tork birimindedir (N·m), yay sabiti ise N/m olmalıdır (mg/ℓ).'
            },
            {
              label: 'C',
              latex: 'k \\longrightarrow 0',
              isCorrect: false,
              feedback: 'Yerçekimi her bir sarkacı kendi denge konumuna çağıran dış yay görevi görür.'
            }
          ],
          examTip: 'Çiftlenimli sarkaç sorusu ile 2 kütle 3 yay sorusu matematiksel olarak BİREBİR aynıdır; sadece k/m yerine g/ℓ yazarsın!'
        },
        sceneDirective: {
          chapter: 1,
          modeId: 'coupled-modes',
          abstractTab: 'normal-coords',
          highlightVector: 'coupling',
          presetParams: { modeSelect: 0, couplingKc: 0.8 },
          caption: 'İki kütle ve üç yay: Orta yay (mor) iki kütlenin bağıl yerdeğiştirmesi (x_a - x_b) ile gerilir.'
        }
      },
      {
        stepNumber: 2,
        title: 'Normal Koordinat Dönüşümü (Köşegenleştirme)',
        subtitle: 'Denklemleri taraf tarafa toplayarak ve çıkararak bağımsızlaştırma',
        physicalMotivation:
          'İki denklemi taraf tarafa toplarsak K_c terimleri birbirini götürür; taraf tarafa çıkarırsak K_c terimleri iki katına çıkar. İşte bu toplam ve fark değişkenlerine Normal Koordinatlar (q₁, q₂) denir.',
        mainEquationLatex:
          '\\begin{aligned} (1) + (2): & \\quad m(\\ddot{x}_a + \\ddot{x}_b) + k(x_a + x_b) = 0 \\implies \\textcolor{#FC6255}{\\ddot{q}_1} + \\left(\\frac{k}{m}\\right)\\textcolor{#58C4DD}{q_1} = 0 \\\\ (1) - (2): & \\quad m(\\ddot{x}_a - \\ddot{x}_b) + (k + 2\\textcolor{#B189DF}{K_c})(x_a - x_b) = 0 \\implies \\textcolor{#FC6255}{\\ddot{q}_2} + \\left(\\frac{k + 2\\textcolor{#B189DF}{K_c}}{m}\\right)\\textcolor{#58C4DD}{q_2} = 0 \\end{aligned}',
        algebraicBreakdown: [
          {
            subStepTitle: 'Adım 2a: Kip 1 (Simetrik / Eş-Fazlı Kip: q₂ = 0 ⇒ x_a = x_b)',
            explanation:
              'Kütleler eşit miktarda ve aynı yönde salınırsa orta yay hiç sıkışmaz veya uzamaz (hayali olarak orta yayı kesip atabilirsin):',
            formulaLatex: '\\textcolor{#F7D147}{\\omega_1} = \\sqrt{\\frac{k}{m}}, \\qquad x_a(t) = x_b(t) = A_1\\cos(\\omega_1 t + \\phi_1)'
          },
          {
            subStepTitle: 'Adım 2b: Kip 2 (Antisimetrik / Zıt-Fazlı Kip: q₁ = 0 ⇒ x_a = -x_b)',
            explanation:
              'Kütleler zıt yönde eşit genlikle salınırsa, orta yay 2x_a kadar sıkışır; dolayısıyla her kütleye hem dış yay (-kx_a) hem de orta yaydan iki kat kuvvet (-2K_c x_a) etki eder:',
            formulaLatex: '\\textcolor{#F7D147}{\\omega_2} = \\sqrt{\\frac{k + 2K_c}{m}}, \\qquad x_a(t) = -x_b(t) = A_2\\cos(\\omega_2 t + \\phi_2)'
          }
        ],
        mathTrickIds: ['trick-determinant'],
        trainerCheckpoint: {
          questionPrompt:
            'Normal koordinatlar q₁ = x_a + x_b ve q₂ = x_a - x_b bulunduktan sonra, asıl fiziksel kütle konumları x_a(t) ve x_b(t) bu koordinatlar cinsinden nasıl geri yazılır?',
          options: [
            {
              label: 'A',
              latex: 'x_a(t) = \\frac{1}{2}[q_1(t) + q_2(t)], \\qquad x_b(t) = \\frac{1}{2}[q_1(t) - q_2(t)]',
              isCorrect: true,
              feedback: 'Harika! Bu ters dönüşüm sayesinde herhangi bir başlangıç koşulunun çözümünü anında yazabiliriz.'
            },
            {
              label: 'B',
              latex: 'x_a(t) = q_1(t) + q_2(t), \\qquad x_b(t) = q_1(t) - q_2(t)',
              isCorrect: false,
              feedback: 'q₁ + q₂ = (x_a + x_b) + (x_a - x_b) = 2x_a eder; 1/2 çarpanını unutma!'
            },
            {
              label: 'C',
              latex: 'x_a(t) = q_1(t), \\qquad x_b(t) = q_2(t)',
              isCorrect: false,
              feedback: 'q₁ ve q₂ tekil kütlelerin değil, kolektif kiplerin koordinatlarıdır.'
            }
          ],
          examTip: 'Herhangi bir genel hareket sorusunda: (1) Başlangıç koşullarından q₁(0) ve q₂(0) bul, (2) q₁(t) = q₁(0)cos(ω₁t), q₂(t) = q₂(0)cos(ω₂t) yaz, (3) x_a = ½(q₁+q₂) ile bitir!'
        },
        sceneDirective: {
          chapter: 1,
          modeId: 'coupled-modes',
          abstractTab: 'normal-coords',
          highlightVector: 'mode',
          presetParams: { modeSelect: 2, couplingKc: 0.9 },
          caption: 'Antisimetrik Kip 2 (x_a = -x_b): Orta nokta hareketsiz bir DÜĞÜM (node) noktasıdır ve frekans ω₂ en yüksek değerindedir.'
        }
      }
    ],
    solvedExamples: [
      {
        id: 'ex-1-4',
        title: 'Doğrusal Triatomik Molekülün (CO₂) Boyuna Normal Kipleri',
        bookRef: 'Berkeley Cilt 3 · Klasik Vize Sorusu',
        problemStatement:
          'Ortada M kütleli Karbon atomu, iki yanında m kütleli Oksijen atomları ve aralarında k sabitli iki bağ bulunan doğrusal O=C=O molekülünün boyuna titreşim özfrekanslarını türetiniz.',
        strategy:
          'Üç kütle (x₁, x₂, x₃) vardır. Merkez kütle hareketsizken uçların zıt hareket ettiği antisimetrik kip ve uçların aynı büyüklükte zıt yöne giderken merkez kütlenin ters yöne gittiği (kütle merkezi sabit: mx₁ + Mx₂ + mx₃ = 0) kip incelenir.',
        stepsLatex: [
          {
            text: '1. Kip 1 (Simetrik Gerilme: Karbon hareketsiz x₂ = 0, Oksijenler zıt yönlü x₁ = -x₃):',
            math: 'm\\ddot{x}_1 + kx_1 = 0 \\implies \\omega_1 = \\sqrt{\\frac{k}{m}}'
          },
          {
            text: '2. Kip 2 (Asimetrik Gerilme: Kütle merkezi sabit mx₁ + Mx₂ + mx₃ = 0 ve x₁ = x₃):',
            math: 'x_2 = -\\frac{2m}{M}x_1 \\implies m\\ddot{x}_1 = -k(x_1 - x_2) = -k\\left(1 + \\frac{2m}{M}\\right)x_1 \\implies \\omega_2 = \\sqrt{\\frac{k}{m}\\left(1 + \\frac{2m}{M}\\right)}'
          }
        ],
        keyTakeaway:
          'Fiziksel simetri ve kütle merkezi korunumu (∑ m_i x_i = 0) kullanıldığında 3×3 determinant açmaya gerek kalmadan özfrekanslar 2 satırda bulunur!'
      }
    ],
    commonTraps: [
      {
        trap: 'Antisimetrik kipte orta yayın k_eff katkısını K_c sanmak (2K_c yerine).',
        whyWrong: 'Sol kütle +x kadar sağa giderken sağ kütle -x kadar sola gelir; orta yay toplam 2x kadar sıkışır!',
        correctApproach: 'Orta yayın her bir kütleye uyguladığı kuvvet -K_c(x_a - (-x_a)) = -2K_c x_a’dır; bu yüzden ω₂² = (k + 2K_c)/m olur.'
      }
    ]
  },
  {
    id: 'mod-1-5',
    chapter: 1,
    code: '1.5',
    title: 'Vurular (Beats) ve Zayıf Çiftlenimli Sistemlerde Enerji Takası',
    shortTitle: 'Vurular (Beats) & Enerji Transferi',
    bookPages: 'Berkeley Cilt 3 · Sayfa 21 – 26',
    summary:
      'Birbirine çok yakın iki frekansın (ω₁ ve ω₂) üstüste binmesinden doğan vuru (beats) olayını ve zayıf çiftlenimli (K_c ≪ k) iki sarkaç arasında enerjinin E_a(t) ↔ E_b(t) periyodik olarak %100 el değiştirmesini türetiyoruz.',
    coreQuestion:
      'Zayıf yayla bağlı iki sarkaçtan sadece birini çekip bıraktığımızda, neden bir süre sonra ilk sarkaç tamamen durup tüm enerjiyi ikinci sarkaca devreder?',
    fundamentalEquations: [
      {
        label: 'Modülasyon (Zarf) ve Taşıyıcı Frekans Tanımları',
        latex: '\\textcolor{#F7D147}{\\omega_{\\text{ort}}} = \\frac{\\omega_1 + \\omega_2}{2}, \\qquad \\textcolor{#B189DF}{\\omega_{\\text{mod}}} = \\frac{\\omega_2 - \\omega_1}{2}, \\qquad \\textcolor{#FC6255}{\\omega_{\\text{vuru}}} = |\\omega_2 - \\omega_1| = 2\\textcolor{#B189DF}{\\omega_{\\text{mod}}}',
        formulaLatex: '\\textcolor{#F7D147}{\\omega_{\\text{ort}}} = \\frac{\\omega_1 + \\omega_2}{2}, \\qquad \\textcolor{#B189DF}{\\omega_{\\text{mod}}} = \\frac{\\omega_2 - \\omega_1}{2}, \\qquad \\textcolor{#FC6255}{\\omega_{\\text{vuru}}} = |\\omega_2 - \\omega_1| = 2\\textcolor{#B189DF}{\\omega_{\\text{mod}}}',
        colorNote: 'Sarı: Hızlı taşıyıcı frekans | Mor: Genlik zarfı frekansı | Kırmızı: Enerji/Şiddet vuru frekansı'
      },
      {
        label: 'Zayıf Çiftlenimli Sarkaçlarda Enerji Takası Denklemleri',
        latex: '\\begin{aligned} \\textcolor{#58C4DD}{x_a(t)} &= x_0 \\cos(\\textcolor{#B189DF}{\\omega_{\\text{mod}}} t)\\cos(\\textcolor{#F7D147}{\\omega_{\\text{ort}}} t) \\implies E_a(t) = E_0 \\cos^2(\\textcolor{#B189DF}{\\omega_{\\text{mod}}} t) \\\\ \\textcolor{#83C167}{x_b(t)} &= x_0 \\sin(\\textcolor{#B189DF}{\\omega_{\\text{mod}}} t)\\sin(\\textcolor{#F7D147}{\\omega_{\\text{ort}}} t) \\implies E_b(t) = E_0 \\sin^2(\\textcolor{#B189DF}{\\omega_{\\text{mod}}} t) \\end{aligned}',
        formulaLatex: '\\begin{aligned} \\textcolor{#58C4DD}{x_a(t)} &= x_0 \\cos(\\textcolor{#B189DF}{\\omega_{\\text{mod}}} t)\\cos(\\textcolor{#F7D147}{\\omega_{\\text{ort}}} t) \\implies E_a(t) = E_0 \\cos^2(\\textcolor{#B189DF}{\\omega_{\\text{mod}}} t) \\\\ \\textcolor{#83C167}{x_b(t)} &= x_0 \\sin(\\textcolor{#B189DF}{\\omega_{\\text{mod}}} t)\\sin(\\textcolor{#F7D147}{\\omega_{\\text{ort}}} t) \\implies E_b(t) = E_0 \\sin^2(\\textcolor{#B189DF}{\\omega_{\\text{mod}}} t) \\end{aligned}',
        colorNote: 'E_a(t) + E_b(t) = E₀ (Toplam enerji her an korunur!)'
      }
    ],
    symbolicTerms: [
      {
        id: 'term-weak-approx',
        label: 'Zayıf Çiftlenim Taylor Yaklaşımı (K_c ≪ k)',
        latexBadge: '\\omega_2 - \\omega_1 \\approx \\omega_1 \\frac{K_c}{k}',
        colorRole: 'coupling',
        description: 'K_c ≪ k iken √(1 + 2K_c/k) ≈ 1 + K_c/k binom açılımıyla vuru frekansı doğrudan çiftlenim sabitiyle orantılı hale gelir.',
        defaultActive: true,
        effectOnEquation: 'ω_vuru = ω₂ - ω₁ ≈ ω₀ (K_c / k)',
        effectOnSpace: 'Bir vuru zarfı içine çok sayıda hızlı taşıyıcı salınım sığar.',
        sceneParamKey: 'couplingKc',
        activeValue: 0.18,
        inactiveValue: 0.65
      }
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        title: 'Tek Sarkacı Çekip Bırakma Başlangıç Koşulu ve Kip Süperpozisyonu',
        subtitle: 't = 0 anında x_a(0) = x₀, x_b(0) = 0 durumunun iki normal kipe ayrıştırılması',
        physicalMotivation:
          'Başlangıçta sadece a sarkacını x₀ kadar çekip b sarkacını x_b(0) = 0’da tutarak serbest bırakalım. Normal koordinatların başlangıç değerleri q₁(0) = x₀ ve q₂(0) = x₀ olur; yani her iki normal kipi EŞİT genlikle uyarmış oluruz!',
        mainEquationLatex:
          '\\begin{aligned} \\textcolor{#58C4DD}{x_a(t)} &= \\frac{1}{2}x_0 [\\cos(\\omega_1 t) + \\cos(\\omega_2 t)] \\\\ \\textcolor{#83C167}{x_b(t)} &= \\frac{1}{2}x_0 [\\cos(\\omega_1 t) - \\cos(\\omega_2 t)] \\end{aligned}',
        algebraicBreakdown: [
          {
            subStepTitle: 'Adım 1a: Toplam-Çarpım Trigonometrik Dönüşümü',
            explanation:
              'ω₁ = ω_ort - ω_mod ve ω₂ = ω_ort + ω_mod koyup cos(α) ± cos(β) kimliklerini uygularsak:',
            formulaLatex: '\\begin{aligned} \\textcolor{#58C4DD}{x_a(t)} &= \\underbrace{x_0 \\cos(\\textcolor{#B189DF}{\\omega_{\\text{mod}}} t)}_{A_a(t)\\text{ Zarfı}} \\cos(\\textcolor{#F7D147}{\\omega_{\\text{ort}}} t) \\\\ \\textcolor{#83C167}{x_b(t)} &= \\underbrace{x_0 \\sin(\\textcolor{#B189DF}{\\omega_{\\text{mod}}} t)}_{A_b(t)\\text{ Zarfı}} \\sin(\\textcolor{#F7D147}{\\omega_{\\text{ort}}} t) \\end{aligned}'
          },
          {
            subStepTitle: 'Adım 1b: 90° Faz Farkı ve Enerji Akış Yönü',
            explanation:
              'Dikkat edilirse x_b(t) hem zarfında (sin ω_mod t) hem de hızlı taşıyıcısında (sin ω_ort t) x_a(t)’dan 90° (π/2) faz farkıyla gelir! İlk yarı-vuru süresince b sarkacı a’dan 90° geridedir ve a’dan enerji çeker.',
            formulaLatex: 't = \\frac{\\pi}{2\\omega_{\\text{mod}}} = \\frac{T_{\\text{vuru}}}{2} \\implies x_a = 0 \\text{ (Tamamen durur)}, \\; |A_b| = x_0 \\text{ (Tüm enerji b\'de!)}'
          }
        ],
        mathTrickIds: ['trick-trig-beats', 'trick-taylor'],
        trainerCheckpoint: {
          questionPrompt:
            'Zayıf çiftlenimli (K_c ≪ k) sistemde ω₁ = √(k/m) ve ω₂ = √((k + 2K_c)/m) olduğuna göre, 1. mertebe Taylor (binom) yaklaşımıyla vuru açısal frekansı ω_vuru = ω₂ - ω₁ nedir?',
          options: [
            {
              label: 'A',
              latex: '\\omega_{\\text{vuru}} \\approx \\omega_1 \\left(\\frac{K_c}{k}\\right)',
              isCorrect: true,
              feedback: 'Kusursuz! ω₂ = ω₁ √(1 + 2K_c/k) ≈ ω₁ (1 + ½ · 2K_c/k) = ω₁ + ω₁(K_c/k) ⇒ ω₂ - ω₁ ≈ ω₁(K_c/k).'
            },
            {
              label: 'B',
              latex: '\\omega_{\\text{vuru}} \\approx 2\\omega_1 \\left(\\frac{K_c}{k}\\right)',
              isCorrect: false,
              feedback: 'Binom açılımındaki 1/2 çarpanı, 2K_c içindeki 2 ile sadeleşir!'
            },
            {
              label: 'C',
              latex: '\\omega_{\\text{vuru}} \\approx \\omega_1 \\sqrt{\\frac{2K_c}{k}}',
              isCorrect: false,
              feedback: '√(1 + ε) ≠ 1 + √ε! Taylor açılımı √(1 + ε) ≈ 1 + ε/2 verir.'
            }
          ],
          examTip: 'Crawford Denklem (1.86): ω₂ - ω₁ ≈ ω₀(K_c/k) türetimi vize sınavlarında en sık sorulan klasik türetim sorusudur!'
        },
        sceneDirective: {
          chapter: 1,
          modeId: 'beats-energy',
          abstractTab: 'energy-beats',
          highlightVector: 'coupling',
          presetParams: { couplingKc: 0.18, omega0: 2.4 },
          caption: 'Zayıf çiftlenimde enerji E_a(t) ve E_b(t) sarkaçlar arasında cos²(ω_mod t) ve sin²(ω_mod t) zarflarıyla kesintisiz el değiştirir.'
        }
      }
    ],
    solvedExamples: [
      {
        id: 'ex-1-5',
        title: 'İki Özdeş Sarkaçta Vuru Periyodundan Yay Sabitinin Bulunması',
        bookRef: 'Berkeley Cilt 3 · Sayfa 24 Örnek 13',
        problemStatement:
          'Doğal frekansları f₁ = 1.00 Hz olan iki özdeş sarkaç zayıf bir yayla bağlanıyor. Bir sarkaç çekilip bırakıldığında diğer sarkacın maksimum genliğe ulaşması (ilk sarkacın tamamen durması) 25 saniye sürüyor. Kip 2 frekansı f₂ nedir?',
        strategy:
          'İlk sarkacın maksimumdan sıfıra inme süresi vuru periyodunun YARISIDIR (T_vuru / 2 = 25 s).',
        stepsLatex: [
          {
            text: '1. Tam enerji takası periyodu (vuru periyodu):',
            math: '\\frac{T_{\\text{vuru}}}{2} = 25\\text{ s} \\implies T_{\\text{vuru}} = 50\\text{ s} \\implies f_{\\text{vuru}} = \\frac{1}{50} = 0.02\\text{ Hz}'
          },
          {
            text: '2. Antisimetrik kip frekansı f₂:',
            math: 'f_{\\text{vuru}} = f_2 - f_1 \\implies f_2 = 1.00 + 0.02 = 1.02\\text{ Hz}'
          }
        ],
        keyTakeaway:
          'En sık yapılan hata "enerjinin diğer sarkaca ilk kez tam geçme süresini" T_vuru sanmaktır. Enerjinin A’dan B’ye geçip tekrar A’ya dönmesi 1 tam T_vuru sürer; A’dan B’ye tek yönlü geçiş T_vuru / 2’dir!'
      }
    ],
    commonTraps: [
      {
        trap: 'Enerjinin A sarkacından B sarkacına ilk kez tam aktarıldığı süreyi T_vuru sanmak.',
        whyWrong: 't = 0’da E_a maksimumdur; E_a’nın ilk kez sıfır olması cos(ω_mod t) = 0 ⇒ ω_mod t = π/2, yani t = T_vuru / 2 anında gerçekleşir!',
        correctApproach: 'A → B geçiş süresi = T_vuru / 2; A → B → A tam döngü süresi = T_vuru = 1 / |f₂ - f₁|.'
      }
    ]
  }
];

