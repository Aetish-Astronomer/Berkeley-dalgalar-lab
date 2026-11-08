import { ProofCoachProblem } from '../types/curriculum';

interface RawCh2Seed {
  num: string;
  title: string;
  page: string;
  home: boolean;
  diff: 'Temel Türetim' | 'Vize Klasik' | 'İleri Sentez';
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

const CH2_SEEDS: RawCh2Seed[] = [
  {
    num: '2.1',
    title: 'Gevşek Yay Salınım Frekansının Uzunluğa Bağlılığı',
    page: 'Sayfa 62',
    home: true,
    diff: 'Temel Türetim',
    tags: ['Gevşek Yay', 'Ev Deneyi', 'Yay Sabiti Ölçeklemesi'],
    statement: 'N_0 halkalı gevşek bir yayın (Slinky) sadece N halkasını serbest bırakıp iki elinizle tutarak enine ve boyuna salınım yaptırıyorsunuz. Halka başına yay sabiti ve kütle dikkate alındığında, temel salınım frekansının serbest halka sayısı N\'e ve yayın açılma uzunluğuna bağımlılığını türetiniz.',
    givenLatex: 'K(N) = K_0 \\frac{N_0}{N}, \\qquad M(N) = M_0 \\frac{N}{N_0}, \\qquad L = N a',
    targetLatex: '\\nu_1 \\propto \\frac{1}{N} \\sqrt{\\frac{K_0}{M_0}} \\implies \\nu_1(N) = \\nu_1(N_0) \\frac{N_0}{N}',
    principle: 'Bir yayın yarısını kestiğinizde yay sabiti iki katına çıkar (K ~ 1/N), kütlesi yarıya iner (M ~ N). Faz hızı v = L√(K/M) uzunluktan bağımsız bir malzeme sabitidir; bu nedenle temel frekans ν₁ = v/(2L) sadece N ile ters orantılıdır.',
    startQ: 'N halkalı bir gevşek yayın toplam yay sabiti K ve kütlesi M, tam yayın değerleri K₀ ve M₀ cinsinden nasıl değişir?',
    optCorrect: 'K = K_0 \\frac{N_0}{N}, \\quad M = M_0 \\frac{N}{N_0} \\implies K M = K_0 M_0 = \\text{sabit}',
    optWrong1: 'K = K_0 \\frac{N}{N_0}, \\quad M = M_0 \\frac{N}{N_0}',
    optWrong2: 'K = K_0, \\quad M = M_0 \\frac{N}{N_0}',
    steps: [
      {
        title: 'Halka Başına Hooke Yasası ve Toplam Yay Sabiti',
        hint: 'Seri bağlı N özdeş yayın eşdeğer yay sabiti formülünü kullanın: 1/K = ∑ 1/k_halka.',
        text: 'N tane halkanın her birinin esneklik katsayısı k_halka = N₀ K₀ sabittir. N halka seri bağlandığında toplam yay sabiti N ile ters orantılı olur:',
        math: '\\frac{1}{K} = \\sum_{i=1}^N \\frac{1}{k_{\\text{halka}}} = \\frac{N}{N_0 K_0} \\implies K(N) = K_0 \\frac{N_0}{N}',
        trick: 'trick-taylor'
      },
      {
        title: 'Temel Kip Frekansının Halka Sayısı ile Ters Orantısı',
        hint: 'ν₁ = (1/2)√(K/M) formülünde K(N) ve M(N) değerlerini yerine koyun.',
        text: 'Kütle M(N) = M₀ (N/N₀) olduğundan K/M oranı 1/N² ile orantılı hale gelir ve karekök dışına 1/N olarak çıkar:',
        math: '\\nu_1 = \\frac{1}{2}\\sqrt{\\frac{K(N)}{M(N)}} = \\frac{1}{2}\\sqrt{\\frac{K_0 (N_0/N)}{M_0 (N/N_0)}} = \\frac{N_0}{N} \\left(\\frac{1}{2}\\sqrt{\\frac{K_0}{M_0}}\\right) \\propto \\frac{1}{N}'
      },
    ],
    sceneMode: 'standing-modes',
    abstractTab: 'dispersion',
    presetParams: { modeN: 1, boundaryCondition: 0 },
    observe: 'Halka sayısı N yarıya indirildiğinde (L kısaltıldığında) temel frekansın tam iki katına çıktığını inceleyin.',
    finalBoxed: '\\nu_1(N) = \\nu_1(N_0) \\left( \\frac{N_0}{N} \\right)',
    check: 'N = N₀ limitinde tam yay frekansı ν₁(N₀) geri elde edilir; birim s⁻¹.'
  },
  {
    num: '2.2',
    title: 'Gevşek Yayın Sürekli Dizge Davranışı: Enine ve Boyuna Kipler, Oktav ve Vurular',
    page: 'Sayfa 62',
    home: true,
    diff: 'Vize Klasik',
    tags: ['Ev Deneyi', 'Oktav', 'Vuru Frekansı', 'Sürekli Yay'],
    statement: '2.5 – 3 m uzunluğunda gerilmiş gevşek bir yayda düşey enine temel kip (ν_enine,1) ile ikinci boyuna kip (ν_boyuna,2) aynı anda uyartılıyor. Boyuna ikinci kip ile enine temel kipin birinci oktavı (2ν_enine,1) arasındaki vuru frekansını türetiniz ve nasıl ölçüleceğini açıklayınız.',
    givenLatex: '\\nu_{\\text{enine}, 1} = \\frac{v_{\\text{enine}}}{2L}, \\qquad \\nu_{\\text{boyuna}, 2} = \\frac{2 v_{\\text{boyuna}}}{2L} = \\frac{v_{\\text{boyuna}}}{L}',
    targetLatex: '\\nu_{\\text{vuru}} = |\\nu_{\\text{boyuna}, 2} - 2\\nu_{\\text{enine}, 1}| = \\frac{|v_{\\text{boyuna}} - v_{\\text{enine}}|}{L}',
    principle: 'İki bağımsız kip (enine ve boyuna) doğrusal süperpozisyon ilkesi gereği aynı anda var olabilir. İkinci boyuna kipin frekansı temel enine kipin yaklaşık 2 katı (oktavı) olduğunda gözle görülür yavaş enerji ve genlik vuruları oluşur.',
    startQ: 'Enine ve boyuna dalga hızları v_enine = √(T₀/ρ₀) ve v_boyuna = L√(K/M) arasındaki fark nedeniyle oluşan vuru frekansı nedir?',
    optCorrect: '\\nu_{\\text{vuru}} = |\\nu_b - 2\\nu_e| = \\frac{1}{L}|v_{\\text{boyuna}} - v_{\\text{enine}}|',
    optWrong1: '\\nu_{\\text{vuru}} = \\nu_b + 2\\nu_e',
    optWrong2: '\\nu_{\\text{vuru}} = \\frac{1}{2}(\\nu_b - \\nu_e)',
    steps: [
      {
        title: 'Enine ve Boyuna Sürekli Dalga Hızları',
        hint: 'Enine gerilim T₀ = K(L - L₀) ve boyuna yay sabiti K bağıntılarını yazın.',
        text: 'Enine dalgaların hızı gerilime bağlıyken (v_e = √(T₀/ρ₀)), boyuna dalgaların hızı doğrudan elastik gerilme modülüne bağlıdır (v_b = L√(K/M)). Büyük gerilmede v_b ≈ v_e olur:',
        math: '\\nu_{\\text{enine}, 1} = \\frac{v_e}{2L}, \\qquad \\nu_{\\text{boyuna}, 2} = 2\\left(\\frac{v_b}{2L}\\right) = \\frac{v_b}{L}',
        trick: 'trick-trig-beats'
      },
      {
        title: 'Oktav Vuru Frekansının Hesabı',
        hint: 'cos(2π(2ν_e)t) + cos(2π ν_b t) toplamından yavaş modülasyon zarfını çekin.',
        text: 'İki frekans birbirine çok yakın olduğunda (ν_b ≈ 2ν_e), gözlenen vuru frekansı bu iki frekansın mutlak farkına eşittir:',
        math: '\\nu_{\\text{vuru}} = |\\nu_{\\text{boyuna}, 2} - 2\\nu_{\\text{enine}, 1}| = \\left| \\frac{v_b}{L} - \\frac{v_e}{L} \\right| = \\frac{|v_b - v_e|}{L}'
      },
    ],
    sceneMode: 'standing-modes',
    abstractTab: 'fourier-spectrum',
    presetParams: { modeN: 2, boundaryCondition: 0 },
    observe: 'Sağ panelde n=1 ve n=2 kiplerinin eşzamanlı süperpozisyonunda düğüm ve karın noktalarının periyodik genlik modülasyonunu izleyin.',
    finalBoxed: '\\nu_{\\text{vuru}} = |\\nu_{\\text{boyuna}, 2} - 2\\nu_{\\text{enine}, 1}|',
    check: 'v_b = v_e durumunda vuru frekansı sıfır olur (tam rezonans eşzamanlılığı).'
  },
  {
    num: '2.3',
    title: 'Sıfır Ölçmeleri: Periyot ve Vuru Sayımı ile Frekans Ölçüm Duyarlılığı',
    page: 'Sayfa 62',
    home: false,
    diff: 'Temel Türetim',
    tags: ['Hata Analizi', 'Vuru Sayımı', 'Duyarlık Artırımı'],
    statement: 'Kronometre ile 10 saniye süre içinde tam salınımlar sayılarak ν₁ ≈ 1.0 Hz ve ν₂ ≈ 2.0 Hz ölçülüyor (saat hatası ±1 s, dönüm hatası ±1/4 periyot). (a) ν₁ ve ν₂ doğrudan ölçümlerinin bağıl hatasını hesaplayınız. (b) İki kip aynı anda uyarılıp 2ν₁ ile ν₂ arasındaki vuru sayılarak fark frekansının ölçülmesinin duyarlılığı neden 10 kat artırdığını kanıtlayınız.',
    givenLatex: 't = 10\\text{ s}, \\quad \\Delta t = \\pm 1\\text{ s}, \\quad \\Delta N = \\pm 0.25, \\quad \\nu_1 \\approx 1.0\\text{ Hz}, \\quad \\nu_2 \\approx 2.0\\text{ Hz}',
    targetLatex: '\\frac{\\Delta\\nu_1}{\\nu_1} \\approx 10\\%, \\qquad \\Delta(\\nu_2 - 2\\nu_1) \\approx \\frac{\\Delta N_{\\text{vuru}}}{t} \\ll \\Delta\\nu_1',
    principle: 'İki büyük sayıyı birbirinden çıkararak küçük bir farkı bulmak büyük bağıl hataya yol açar; oysa vuru olayında doğa bu çıkarmayı kendisi yapar ve doğrudan fark frekansı sıfır dolayında (sıfır ölçmesi) yüksek duyarlıkla sayılır.',
    startQ: 'N = ν t formülünden ν frekansının bağıl hatası Δν/ν diferansiyel olarak nasıl yazılır?',
    optCorrect: '\\frac{\\Delta\\nu}{\\nu} = \\frac{\\Delta N}{N} + \\frac{\\Delta t}{t}',
    optWrong1: '\\frac{\\Delta\\nu}{\\nu} = \\Delta N \\cdot \\Delta t',
    optWrong2: '\\frac{\\Delta\\nu}{\\nu} = \\frac{\\Delta N - \\Delta t}{N + t}',
    steps: [
      {
        title: 'Doğrudan Tek Frekans Ölçümündeki Hata',
        hint: 'N₁ = ν₁ t = 1.0 × 10 = 10 salınım için ΔN/N ve Δt/t oranlarını toplayın.',
        text: '10 saniyede N₁ = 10 tam salınım için ΔN/N = 0.25/10 = %2.5, zaman hatası Δt/t = 1/10 = %10 olur; toplam bağıl hata yaklaşık %10 - %12 civarındadır:',
        math: '\\frac{\\Delta\\nu_1}{\\nu_1} \\approx \\frac{0.25}{10} + \\frac{1}{10} = 0.125 \\implies \\nu_1 = 1.0 \\pm 0.12\\text{ Hz}'
      },
      {
        title: 'Sıfır Ölçmesi ile Vuru Frekansının Doğrudan Tespiti',
        hint: 'Vuru periyodu T_vuru boyunca geçen sürede saat hatasının etkisini inceleyin.',
        text: 'İki frekansı ayrı ayrı ölçüp çıkarmak yerine, 2ν₁ ile ν₂ arasındaki vuru doğrudan sayılırsa (örneğin 10 saniyede sıfır veya 1 vuru), fark frekansındaki mutlak belirsizlik doğrudan kronometre süresine bölünür:',
        math: '\\Delta(\\nu_2 - 2\\nu_1) \\approx \\frac{\\Delta N_{\\text{vuru}}}{t_{\\text{toplam}}} \\approx \\frac{0.25}{50\\text{ s}} = 0.005\\text{ Hz}'
      },
    ],
    sceneMode: 'standing-modes',
    abstractTab: 'dispersion',
    presetParams: { modeN: 2, boundaryCondition: 0 },
    observe: 'Vuru dalga boyunun tekil kiplere göre çok daha uzun olduğunu ve zaman skalasının nasıl genişlediğini inceleyin.',
    finalBoxed: '\\frac{\\Delta\\nu_1}{\\nu_1} \\approx 10\\%, \\qquad \\Delta(\\nu_{\\text{vuru}}) \\approx \\frac{1}{t_{\\text{gözlem}}}',
    check: 'Gözlem süresi t → ∞ limitinde vuru frekansı mutlak kesinlikle belirlenebilir.'
  },
  {
    num: '2.4',
    title: 'Gevşek Yayın Ton Niteliği (Tınısı) ve Klarnet Analojisi',
    page: 'Sayfa 63',
    home: true,
    diff: 'Temel Türetim',
    tags: ['Tını', 'Fourier Analizi', 'Simetri', 'Klarnet'],
    statement: 'Bir müzik aletinin tınısı (ton niteliği) hangi harmoniklerin uyarıldığına bağlıdır. Örneğin klarnette çift harmonikler yok olur, yalnızca tek harmonikler (ν₁, 3ν₁, 5ν₁...) kalır. Gevşek bir yayın tam ortasına aniden bir itme verildiğinde, simetri nedeniyle tüm çift harmoniklerin neden sıfırlandığını Fourier integrali ile kanıtlayınız.',
    givenLatex: 'x_0 = \\frac{L}{2}, \\qquad \\psi(x, 0) = \\psi(L - x, 0) \\quad (\\text{Merkeze göre simetrik profil})',
    targetLatex: 'A_n = 0 \\quad (\\forall n = 2, 4, 6, 8, \\dots) \\implies \\psi(x,t) = \\sum_{k=0}^\\infty A_{2k+1}\\sin\\!\\left(\\frac{(2k+1)\\pi x}{L}\\right)\\cos(\\omega_{2k+1} t)',
    principle: 'Merkeze göre simetrik olan bir başlangıç fonksiyonu f(L/2 - u) = f(L/2 + u), merkeze göre antisimetrik olan sin(2kπx/L) fonksiyonlarıyla ortogonaldir (diklik integrali sıfır verir).',
    startQ: 'Çift numaralı kiplerin (n = 2, 4, 6...) x = L/2 orta noktasındaki uzanımı sin(nπ/2) değeri nedir?',
    optCorrect: '\\sin\\!\\left(\\frac{2k\\pi}{2}\\right) = \\sin(k\\pi) = 0 \\quad (\\text{Tam orta nokta daima düğüm noktasıdır})',
    optWrong1: '\\sin(k\\pi) = 1',
    optWrong2: '\\sin(k\\pi) = (-1)^k',
    steps: [
      {
        title: 'Fourier Katsayı İntegralinde Simetri Ayrışımı',
        hint: 'A_n integralini [0, L/2] ve [L/2, L] iki parçaya bölün.',
        text: 'f(x) fonksiyonu x = L/2 etrafında simetrik olduğundan, integralin sol yarısı ile sağ yarısı çift harmonikler için birbirini tam olarak yok eder:',
        math: 'A_n = \\frac{2}{L}\\int_0^L f(x)\\sin\\!\\left(\\frac{n\\pi x}{L}\\right) dx = \\frac{2}{L}\\left[1 - (-1)^n\\right]\\int_0^{L/2} f(x)\\sin\\!\\left(\\frac{n\\pi x}{L}\\right) dx',
        trick: 'trick-orthogonality'
      },
      {
        title: 'Çift Harmoniklerin Yok Oluşu (Klarnet Tınısı)',
        hint: 'n çift iken 1 - (-1)ⁿ çarpanının değerine bakın.',
        text: 'n = 2k (çift) olduğunda (-1)²ᵏ = +1 olur ve 1 - 1 = 0 çıkar. Böylece yayda sadece tek harmonikler uyarılır:',
        math: 'A_{2k} = 0, \\qquad A_{2k+1} = \\frac{4}{L}\\int_0^{L/2} f(x)\\sin\\!\\left(\\frac{(2k+1)\\pi x}{L}\\right) dx'
      },
    ],
    sceneMode: 'plucked-fourier',
    abstractTab: 'fourier-spectrum',
    presetParams: { pluckPosRatio: 0.5, fourierMaxN: 8 },
    observe: 'Spektrum çubuklarında n = 2, 4, 6, 8 harmonik genliklerinin tam sıfır olduğunu ve telin orta noktasının tepe noktası olduğunu doğrulayın.',
    finalBoxed: 'A_{2k} = 0 \\quad (k=1, 2, 3, \\dots) \\implies \\text{Sadece tek harmonikler yaşar}',
    check: 'Klarnet gibi bir ucu kapalı bir ucu açık silindirik hava sütunları da tam olarak bu tek harmonik spektrumunu üretir.'
  },
  {
    num: '2.5',
    title: 'Piyanoyu Fourier Çözümleme Aleti Olarak Kullanmak: Kulağın Faz Duymazlığı',
    page: 'Sayfa 63',
    home: true,
    diff: 'Temel Türetim',
    tags: ['Piyano Akustiği', 'Ohm Yasası', 'Rezonans', 'Ev Deneyi'],
    statement: 'Piyanonun sönüm (damper) pedalına basıp tellerin bulunduğu kasaya doğru \'hey\' veya \'ooh\' diye bağırıldığında, teller bu sesin Fourier bileşenlerini rezonansla kaydedip geri yayınlar. Kulağın dalga bileşenlerinin bağıl fazlarına değil sadece genlik spektrumuna duyarlı olduğunu (Ohm Akustik Yasası) Fourier ayrışımı üzerinden kanıtlayınız.',
    givenLatex: 'F(t) = \\sum_{n=1}^\\infty C_n \\cos(n\\omega_1 t + \\phi_n), \\qquad I_n \\propto |C_n|^2',
    targetLatex: 'I_{\\text{işitilen}}(\\omega) = \\sum_{n=1}^\\infty |C_n|^2 \\delta(\\omega - n\\omega_1) \\quad (\\phi_n\\text{\'den bağımsız})',
    principle: 'Piyano telleri her biri dar bantlı bir harmonik filtre gibi davranır; telin mass-yay rezonansı gelen sesin ω_n frekansındaki Fourier katsayısını süzer. İnsan kulağındaki iç kulak (koklea) da benzer şekilde frekans ayrışımı yapar ve faz farklarını algılamaz.',
    startQ: 'Bir telin harmonik sürücü kuvvete verdiği rezonans yanıtı gelen dalganın fazı φ_n\'e mi yoksa genliği C_n\'e mi bağlıdır?',
    optCorrect: '\\text{Salınım genliği doğrudan } |C_n| \\text{ ile orantılıdır; zaman ortalamalı aktarılan güç fazdan bağımsızdır.}',
    optWrong1: '\\text{Salınım genliği sadece } \\phi_n \\text{ fazına bağlıdır.}',
    optWrong2: '\\text{Tel sadece } \\phi_n = 0 \\text{ olduğunda rezonansa girer.}',
    steps: [
      {
        title: 'Piyano Telinin Harmonik Osilatör Rezonansı',
        hint: 'm ẍ + b ẋ + kx = F_n cos(ω t + φ_n) denkleminin kararlı hal genliğini yazın.',
        text: 'Damper kalktığında n. telin rezonans frekansı gelen sesin n. harmoniğiyle tam çakışır (ω = ω_n):',
        math: 'x_n(t) = \\frac{C_n}{b \\omega_n} \\sin(n\\omega_1 t + \\phi_n) \\implies \\langle E_n \\rangle = \\frac{1}{4} m \\left(\\frac{C_n}{b}\\right)^2 \\propto |C_n|^2',
        trick: 'trick-phasor'
      },
      {
        title: 'Ohm Akustik Yasası ve Faz Duymazlığı',
        hint: 'φ_n fazı keyfi değiştirildiğinde dalga şeklinin değişmesine rağmen enerjinin korunduğunu gösterin.',
        text: 'Dalganın zaman profili ψ(t) fazlar değiştikçe tamamen farklı görünse bile, her harmonikte depolanan enerji ve kulağa iletilen güç sadece |C_n|² karesel genliklerine bağlı kalır:',
        math: '\\langle [F(t)]^2 \\rangle = \\frac{1}{2}\\sum_{n=1}^\\infty C_n^2 \\quad (\\text{Parseval Eşitliği})'
      },
    ],
    sceneMode: 'plucked-fourier',
    abstractTab: 'fourier-spectrum',
    presetParams: { pluckPosRatio: 0.35, fourierMaxN: 6 },
    observe: 'Farklı harmonik genliklerinin bağımsız barlar olarak Fourier spektrumunda nasıl ayrıştığını inceleyin.',
    finalBoxed: 'I_n \\propto |C_n|^2 \\quad (\\text{İşitilen ses tınısı } \\phi_n \\text{ fazından bağımsızdır})',
    check: 'Parseval teoremine göre zaman ortalamalı toplam enerji harmoniklerin enerjileri toplamına eşittir.'
  },
  {
    num: '2.6',
    title: 'Kusursuz Sürekli İp ile Boncuklu İp Arasındaki Frekans Oranı Farkı',
    page: 'Sayfa 63',
    home: false,
    diff: 'Temel Türetim',
    tags: ['Dispersiyon', 'Kesikli Örgü', 'Harmonik Oranları'],
    statement: 'İki ucu sabit, homojen sürekli bir ipte harmonik frekanslar tam tamsayı oranlarındadır: ν_n = n ν₁. Oysa N boncuklu bir ipte neden bu oran bozulur ve ν_n / (n ν₁) oranı n arttıkça birden küçülerek doyuma ulaşır? Fiziksel nedenini ve matematiksel ifadesini türetiniz.',
    givenLatex: '\\omega_{\\text{sürekli}, n} = n\\omega_1 = n\\frac{\\pi v_0}{L}, \\qquad \\omega_{\\text{kesikli}, n} = 2\\omega_0 \\sin\\!\\left( \\frac{n\\pi}{2(N+1)} \\right)',
    targetLatex: '\\frac{\\omega_{\\text{kesikli}, n}}{n\\omega_{\\text{kesikli}, 1}} = \\frac{\\sin(n\\theta_1)}{n\\sin(\\theta_1)} \\approx \\frac{\\sin(n\\theta_1)}{n\\theta_1} < 1 \\quad \\left(\\theta_1 \\equiv \\frac{\\pi}{2(N+1)}\\right)',
    principle: 'Sürekli ipte dalga boyu kısaldıkça tel sonsuz esneklikle bükülür; boncuklu ipte ise boncuklar arasındaki yaylar düz doğru parçalarıdır. Dalga boyu boncuk aralığı a\'ya yaklaştıkça komşu parçacıklar arasındaki bağıl bükülme etkinliği azalır ve frekans artışı yavaşlar.',
    startQ: 'x > 0 için sin(x) / x fonksiyonunun davranışı nasıldır?',
    optCorrect: '\\frac{\\sin x}{x} < 1 \\quad (\\forall x > 0) \\implies \\text{Frekanslar daima doğrusal harmonik katların ALTINDA kalır.}',
    optWrong1: '\\frac{\\sin x}{x} > 1',
    optWrong2: '\\frac{\\sin x}{x} = 1',
    steps: [
      {
        title: 'Ayrık Örgü Frekans Bağıntısının Yazılması',
        hint: 'ω_n = 2ω₀ sin(n a k_1 / 2) formülünde a k₁ = π / (N+1) koyun.',
        text: 'Kesikli boncuklu ipte n. normal kipin frekansı sinüs bağıntısıyla verilir:',
        math: '\\omega_n = 2\\omega_0 \\sin\\!\\left( \\frac{n\\pi}{2(N+1)} \\right)',
        trick: 'trick-trig-beats'
      },
      {
        title: 'Küçük ve Büyük n Limitlerinin Karşılaştırılması',
        hint: 'n=1 için sin(θ₁) ≈ θ₁ Taylor açılımı yapıp n. kip ile oranlayın.',
        text: 'Temel kipte (n = 1) açı çok küçük olduğundan sin(θ₁) ≈ θ₁ = π/(2(N+1)) olur ve sürekli tel frekansı yakalanır. Fakat n büyüdükçe sin fonksiyonunun eğimi azalır:',
        math: '\\frac{\\omega_n}{n\\omega_1} = \\frac{\\sin(n\\theta_1)}{n\\sin\\theta_1} \\approx \\frac{\\sin(n\\theta_1)}{n\\theta_1} = 1 - \\frac{(n\\theta_1)^2}{6} + \\dots < 1'
      },
    ],
    sceneMode: 'discrete-lattice',
    abstractTab: 'dispersion',
    presetParams: { numBeads: 10, modeN: 3 },
    observe: 'Dispersiyon eğrisinde mavi noktaların (kesikli modlar) düz kesikli çizginin (sürekli tel limiti) nasıl altında kaldığını gözleyin.',
    finalBoxed: '\\frac{\\omega_n}{\\omega_1} = \\frac{\\sin\\left(\\frac{n\\pi}{2(N+1)}\\right)}{\\sin\\left(\\frac{\\pi}{2(N+1)}\\right)} < n \\quad (n > 1)',
    check: 'N → ∞ limitinde θ₁ → 0 olur ve sin(nθ₁)/(nθ₁) → 1 sürekli harmonik oranına ulaşılır.'
  },
  {
    num: '2.7',
    title: 'Düzgün Olmayan İpte Enine Dalga Denklemi',
    page: 'Sayfa 64',
    home: false,
    diff: 'Vize Klasik',
    tags: ['Düzgün Olmayan Ortam', 'Dalga Denklemi', 'Taylor Türetimi'],
    statement: 'Gerilimi T(x) ve birim uzunluk kütlesi ρ(x) konuma göre değişen homojen olmayan bir tel için enine dalga denkleminin ∂/∂x [T(x) ∂ψ/∂x] = ρ(x) ∂²ψ/∂t² biçiminde olduğunu dx elemanına etkiyen net kuvvetten türetiniz.',
    givenLatex: 'dm = \\rho(x) dx, \\qquad F_y(x) = T(x)\\sin\\theta(x) \\approx T(x)\\frac{\\partial\\psi}{\\partial x}',
    targetLatex: '\\frac{\\partial}{\\partial x}\\left[ T(x)\\frac{\\partial\\psi}{\\partial x} \\right] = \\rho(x)\\frac{\\partial^2\\psi}{\\partial t^2}',
    principle: 'dx uzunluğundaki diferansiyel tel parçasına sağ uçtan T(x+dx) sin θ(x+dx), sol uçtan ise zıt yönde -T(x) sin θ(x) gerilim kuvveti etkir. Bu iki kuvvetin farkı Taylor serisiyle dF_y = ∂/∂x [T ∂ψ/∂x] dx olur.',
    startQ: 'dx elemanının sağ ve sol uçlarındaki düşey kuvvet farkı Taylor serisiyle nasıl ifade edilir?',
    optCorrect: 'dF_y = F_y(x+dx) - F_y(x) = \\frac{\\partial}{\\partial x}\\left( T(x)\\frac{\\partial\\psi}{\\partial x} \\right) dx',
    optWrong1: 'dF_y = T(x)\\frac{\\partial^2\\psi}{\\partial x^2}',
    optWrong2: 'dF_y = \\frac{dT}{dx}\\frac{\\partial\\psi}{\\partial x}',
    steps: [
      {
        title: 'dx Parçacığı İçin Net Düşey Kuvvet',
        hint: 'Küçük açı yaklaşımında sin θ ≈ tan θ = ∂ψ/∂x yazın.',
        text: 'dx elemanının iki ucundaki enine kuvvetler:',
        math: 'dF_y = T(x+dx)\\left.\\frac{\\partial\\psi}{\\partial x}\\right|_{x+dx} - T(x)\\left.\\frac{\\partial\\psi}{\\partial x}\\right|_x = \\frac{\\partial}{\\partial x}\\left[ T(x)\\frac{\\partial\\psi}{\\partial x} \\right] dx',
        trick: 'trick-taylor'
      },
      {
        title: 'Newton\'un 2. Yasası ve Dalga Denklemi',
        hint: 'dF_y = dm (∂²ψ/∂t²) ve dm = ρ(x) dx eşitliğini yazın.',
        text: 'dx her iki taraftan sadeleştiğinde konuma bağlı homojen olmayan dalga denklemi doğrudan çıkar:',
        math: '\\frac{\\partial}{\\partial x}\\left[ T(x)\\frac{\\partial\\psi}{\\partial x} \\right] dx = (\\rho(x) dx)\\frac{\\partial^2\\psi}{\\partial t^2} \\implies \\frac{\\partial}{\\partial x}\\left[ T(x)\\frac{\\partial\\psi}{\\partial x} \\right] = \\rho(x)\\frac{\\partial^2\\psi}{\\partial t^2}'
      },
    ],
    sceneMode: 'continuous-dx',
    abstractTab: 'dispersion',
    presetParams: { modeN: 2, showCurvatureVectors: 1 },
    observe: 'T(x) sabit olduğunda ifadenin T₀ ∂²ψ/∂x² = ρ₀ ∂²ψ/∂t² standart klasik dalga denklemine dönüştüğünü görün.',
    finalBoxed: '\\frac{\\partial}{\\partial x}\\left[ T(x)\\frac{\\partial\\psi}{\\partial x} \\right] = \\rho(x)\\frac{\\partial^2\\psi}{\\partial t^2}',
    check: 'T(x) = T₀ ve ρ(x) = ρ₀ sabit limitinde v² = T₀/ρ₀ klasik formülü elde edilir.'
  },
  {
    num: '2.8',
    title: 'Simetrik Çekilmiş İpin Fourier Katsayıları',
    page: 'Sayfa 64',
    home: false,
    diff: 'Vize Klasik',
    tags: ['Fourier Serisi', 'Üçgen Profil', 'Kısmi İntegrasyon'],
    statement: 'İki ucu sabit L uzunluğundaki telin tam ortasından (x = L/2) h kadar çekilip t = 0 anında ilk hızsız bırakılıyor. Başlangıçtaki üçgen profilin Fourier katsayılarını B_n hesaplayınız ve n\'nin tek değerleri için B_n = (-1)^{(n-1)/2} (8h / π²n²) olduğunu kanıtlayınız.',
    givenLatex: 'f(x) = \\begin{cases} \\frac{2h}{L}x, & 0 \\le x \\le L/2 \\\\ \\frac{2h}{L}(L - x), & L/2 \\le x \\le L \\end{cases}',
    targetLatex: 'B_n = \\begin{cases} \\frac{8h}{\\pi^2 n^2}(-1)^{\\frac{n-1}{2}}, & n = 1, 3, 5, \\dots \\\\ 0, & n = 2, 4, 6, \\dots \\end{cases}',
    principle: 'Simetrik üçgen dalgada tek harmonikler yaşar. Üçgen profilin birinci türevi kare dalga, ikinci türevi ise köşe noktasındaki Dirac delta fonksiyonudur; bu nedenle katsayılar 1/n² hızında azalır.',
    startQ: 'f(x) fonksiyonunun Fourier sinüs açılımı katsayısı B_n integral tanımı nedir?',
    optCorrect: 'B_n = \\frac{2}{L}\\int_0^L f(x)\\sin\\!\\left(\\frac{n\\pi x}{L}\\right) dx',
    optWrong1: 'B_n = \\frac{1}{L}\\int_0^L [f(x)]^2 dx',
    optWrong2: 'B_n = \\frac{2}{L}\\int_0^L f(x)\\cos\\!\\left(\\frac{n\\pi x}{L}\\right) dx',
    steps: [
      {
        title: 'Simetriden Dolayı Yarım Aralık İntegrali',
        hint: 'İntegrali 0\'dan L/2\'ye alıp 2 ile çarpın.',
        text: 'f(x) ve sin(nπx/L) simetrisinden dolayı integral [0, L/2] aralığı üzerinden hesaplanabilir:',
        math: 'B_n = \\frac{4}{L}\\int_0^{L/2} \\left(\\frac{2h}{L}x\\right)\\sin\\!\\left(\\frac{n\\pi x}{L}\\right) dx = \\frac{8h}{L^2}\\int_0^{L/2} x\\sin\\!\\left(\\frac{n\\pi x}{L}\\right) dx',
        trick: 'trick-orthogonality'
      },
      {
        title: 'Kısmi İntegrasyon Uygulaması',
        hint: 'u = x ve dv = sin(nπx/L) dx seçerek ∫ u dv = uv - ∫ v du uygulayın.',
        text: 'Kısmi integrasyon alındığında sınır değerlerden cos(nπ/2) ve sin(nπ/2) terimleri gelir:',
        math: 'B_n = \\frac{8h}{\\pi^2 n^2}\\sin\\!\\left(\\frac{n\\pi}{2}\\right) = \\begin{cases} +\\frac{8h}{\\pi^2}, & n=1 \\\\ 0, & n=2 \\\\ -\\frac{8h}{9\\pi^2}, & n=3 \\\\ 0, & n=4 \\end{cases}'
      },
    ],
    sceneMode: 'plucked-fourier',
    abstractTab: 'fourier-spectrum',
    presetParams: { pluckPosRatio: 0.5, fourierMaxN: 7 },
    observe: 'B₁/B₃ oranının 9 olduğunu, B₁/B₅ oranının 25 olduğunu 2B spektrum çubuklarında doğrulayın.',
    finalBoxed: 'B_n = \\frac{8h}{\\pi^2 n^2}\\sin\\left(\\frac{n\\pi}{2}\\right)',
    check: 'x = L/2\'de f(L/2) = ∑ B_n sin(nπ/2) = (8h/π²)(1 + 1/9 + 1/25 + ...) = (8h/π²)(π²/8) = h sağlar!'
  },
  {
    num: '2.9',
    title: 'Sürekli Bir İpin Öztitreşimleri: İki Ucu Serbest İp ve Neumann Sınır Koşulları',
    page: 'Sayfa 64',
    home: false,
    diff: 'Temel Türetim',
    tags: ['Serbest Uç', 'Neumann Koşulu', 'Duran Dalgalar', 'Kütlesiz Halka'],
    statement: 'Her iki ucunda sürtünmesiz düşey çubuklar üzerinde serbestçe kayan kütlesiz halkalar bulunan, gerilimi T₀, boyu L ve birim kütlesi ρ₀ olan bir ipin enine titreşim kiplerini, sınır koşullarını ve ilk üç normal kip frekansını türetiniz. Sıfır frekanslı modun fiziksel anlamını belirtiniz.',
    givenLatex: '\\left.\\frac{\\partial\\psi}{\\partial x}\\right|_{x=0} = 0, \\qquad \\left.\\frac{\\partial\\psi}{\\partial x}\\right|_{x=L} = 0',
    targetLatex: '\\psi_n(x,t) = B_n \\cos\\!\\left(\\frac{n\\pi x}{L}\\right)\\cos(\\omega_n t), \\qquad k_n = \\frac{n\\pi}{L}, \\quad \\omega_n = \\frac{n\\pi v_0}{L} \\quad (n = 0, 1, 2, \\dots)',
    principle: 'Serbest uçta halka kütlesiz olduğundan net enine kuvvet sıfır olmak zorundadır; bu da telin serbest uçta eğiminin sıfır olması (∂ψ/∂x = 0) demektir. n = 0 modu tüm ipin paralel rijit ötelenmesidir.',
    startQ: 'İki ucu serbest ipte genel duran dalga çözümü ψ(x) = C sin(kx) + D cos(kx) ifadesine x = 0 sınır koşulu uygulandığında hangi katsayı sıfır olur?',
    optCorrect: '\\left.\\frac{d\\psi}{dx}\\right|_0 = k C \\cos(0) = 0 \\implies C = 0 \\implies \\psi(x) = D \\cos(kx)',
    optWrong1: 'D = 0',
    optWrong2: 'C = D',
    steps: [
      {
        title: 'x = 0 ve x = L Neumann Sınır Koşulları',
        hint: 'ψ\'(x) = -k D sin(kx) türevinde x = L koyarak sıfıra eşitleyin.',
        text: 'x = L ucunda eğim sıfır olmalıdır:',
        math: '\\left.\\frac{d\\psi}{dx}\\right|_{x=L} = -k D \\sin(kL) = 0 \\implies \\sin(kL) = 0 \\implies k_n L = n\\pi \\quad (n=0, 1, 2, \\dots)',
        trick: 'trick-separation'
      },
      {
        title: 'n = 0 Sıfır Frekans Kipi (Rijit Öteleme)',
        hint: 'n = 0 koyduğunuzda k₀ = 0 ve ω₀ = 0 çıkar.',
        text: 'n = 0 kipi için ψ₀(x) = B₀ sabittir; tel salınım yapmaksızın düşey çubuklar boyunca sabit hızla veya ötelemeyle kayar:',
        math: '\\omega_0 = 0, \\qquad \\omega_1 = \\frac{\\pi v_0}{L}, \\qquad \\omega_2 = \\frac{2\\pi v_0}{L}'
      },
    ],
    sceneMode: 'standing-modes',
    abstractTab: 'dispersion',
    presetParams: { modeN: 1, boundaryCondition: 1 },
    observe: 'Uç noktalarda tel eğiminin yatay (eğim = 0) kaldığını ve karın noktalarının uçlarda oluştuğunu inceleyin.',
    finalBoxed: '\\psi_n(x,t) = B_n \\cos\\left(\\frac{n\\pi x}{L}\\right)\\cos(\\omega_n t), \\quad \\omega_n = \\frac{n\\pi v_0}{L}',
    check: 'İki ucu serbest telin frekansları iki ucu sabit tel ile aynıdır, fakat düğüm ve karın noktalarının yerleri 90° yer değiştirmiştir.'
  },
  {
    num: '2.10',
    title: 'İki Ucu Serbest 3 Boncuklu Örgünün Normal Kipleri',
    page: 'Sayfa 64',
    home: false,
    diff: 'Vize Klasik',
    tags: ['Ayrık Örgü', 'Serbest Sınır', 'Normal Kipler', 'Matris Determinantı'],
    statement: 'İki ucu serbest, 4 parçalı ve 3 özdeş boncuktan oluşan bir tel dizgesinde serbest uç sınır koşulları ψ₀ = ψ₁ ve ψ₄ = ψ₃ olarak veriliyor. Sistemin 3 normal kipinin dalga sayılarını k_m, özfrekanslarını ω_m ve sıfır frekanslı öteleme modunu türetiniz.',
    givenLatex: '\\psi_0 = \\psi_1, \\quad \\psi_4 = \\psi_3, \\qquad M\\ddot{\\psi}_n = \\frac{T_0}{a}(\\psi_{n+1} - 2\\psi_n + \\psi_{n-1}) \\quad (n=1, 2, 3)',
    targetLatex: 'k_m a = \\frac{m\\pi}{N} = \\frac{m\\pi}{3} \\quad (m = 0, 1, 2), \\qquad \\omega_m = 2\\omega_0 \\sin\\!\\left( \\frac{m\\pi}{6} \\right)',
    principle: 'Ayrık sınır koşulu ψ₀ = ψ₁ demek, 0. ve 1. boncukların tam ortasında (x = a/2) eğimin sıfır olması demektir. Serbest-serbest ayrık sınırda dalga sayıları k_m a = mπ/N biçiminde kuantize olur.',
    startQ: 'Serbest uç sınır koşulu ψ₀ = ψ₁ genel kosinüs çözümü ψ_n = B cos(k a (n - 1/2)) ile nasıl tam uyum sağlar?',
    optCorrect: '\\cos(-ka/2) = \\cos(ka/2) \\implies \\psi_0 = \\psi_1 \\text{ kendiliğinden sağlanır!}',
    optWrong1: '\\cos(-ka/2) = -\\cos(ka/2)',
    optWrong2: '\\psi_0 = -\\psi_1',
    steps: [
      {
        title: 'Serbest Sınır Simetrisi ve Kosinüs Çözümü',
        hint: 'n = 1/2 noktasında ayna simetrisi oluşturun.',
        text: 'ψ_n = B cos[k a (n - 1/2)] deneme çözümü n = 0 ve n = 1 için özdeş değer verir:',
        math: '\\psi_0 = B\\cos(-ka/2) = B\\cos(ka/2) = \\psi_1',
        trick: 'trick-determinant'
      },
      {
        title: 'Sağ Serbest Sınır ve İzinli Frekanslar',
        hint: 'ψ₄ = ψ₃ şartını uygulayarak sin(3ka) = 0 bulun.',
        text: 'n = 3 ve n = 4 eşitliği k a dalga sayısını bağlar:',
        math: '\\psi_4 = \\psi_3 \\implies \\cos(7ka/2) = \\cos(5ka/2) \\implies \\sin(3ka) = 0 \\implies k_m a = \\frac{m\\pi}{3} \\quad (m=0, 1, 2)',
        trick: 'trick-trig-beats'
      },
    ],
    sceneMode: 'discrete-lattice',
    abstractTab: 'dispersion',
    presetParams: { numBeads: 3, modeN: 1 },
    observe: 'm = 0 için tüm boncukların aynı yönde yer değiştirdiğini (öteleme), m = 1 ve 2 için serbest uç salınımlarını izleyin.',
    finalBoxed: '\\omega_0 = 0, \\quad \\omega_1 = 2\\omega_0\\sin\\left(\\frac{\\pi}{6}\\right) = \\omega_0, \\quad \\omega_2 = 2\\omega_0\\sin\\left(\\frac{\\pi}{3}\\right) = \\sqrt{3}\\omega_0',
    check: 'm = 0 kipi enerji gerektirmeyen rijit cisim ötelemesidir (ω = 0).'
  },
  {
    num: '2.11',
    title: 'LC Devresinin Öztitreşim Kipleri: Elektrik İletim Hattı Analoğu',
    page: 'Sayfa 64',
    home: false,
    diff: 'İleri Sentez',
    tags: ['LC Hattı', 'Elektromanyetik Dalga', 'Ayrık Filtre'],
    statement: '3 özdeş indüktör (L₀) ve 4 özdeş sığaçtan (C₀) oluşan, iki dış ucu kısa devre edilmiş bir LC merdiven devresinde akımların hareket denklemlerini kurarak 3 normal kipin akım dağılımını ve rezonans frekanslarını türetiniz. Mekanik boncuklu ip ile tam analog eşleştirmeyi gösteriniz.',
    givenLatex: 'L_0 \\frac{d^2 I_n}{dt^2} = \\frac{1}{C_0}(I_{n+1} - 2I_n + I_{n-1}) \\quad (n=1, 2, 3), \\qquad I_0 = I_4 = 0',
    targetLatex: '\\omega_m = \\frac{2}{\\sqrt{L_0 C_0}} \\sin\\!\\left( \\frac{m\\pi}{8} \\right) \\quad (m = 1, 2, 3)',
    principle: 'Kirchhoff gerilim yasası L₀ dI_n/dt = V_n - V_{n+1} ve akım yasası I_n - I_{n+1} = C₀ dV_n/dt birleştirildiğinde mekanik kütle-yay zinciriyle birebir aynı diferansiyel fark denklemini verir.',
    startQ: 'Elektrik devresindeki L₀ d²I_n/dt² = (1/C₀)(I_{n+1} - 2I_n + I_{n-1}) denklemi ile mekanik boncuklu tel M d²ψ_n/dt² = (T₀/a)(ψ_{n+1} - 2ψ_n + ψ_{n-1}) arasındaki eşdeğerlik nasıldır?',
    optCorrect: 'M \\leftrightarrow L_0, \\quad \\psi_n \\leftrightarrow I_n, \\quad \\frac{T_0}{a} \\leftrightarrow \\frac{1}{C_0}',
    optWrong1: 'M \\leftrightarrow C_0, \\quad \\psi_n \\leftrightarrow V_n',
    optWrong2: 'M \\leftrightarrow R, \\quad \\psi_n \\leftrightarrow Q_n',
    steps: [
      {
        title: 'Düğüm Denklemlerinden İkinci Derece Diferansiyel Denkleme Geçiş',
        hint: 'Kirchhoff voltaj döngüsü türevini alıp sığaç akım denkleminde yerine koyun.',
        text: 'n. indüktörün iki ucundaki gerilim farkı sığaç yükleriyle belirlenir:',
        math: 'L_0 \\frac{d I_n}{dt} = V_{n-1} - V_n \\implies L_0 \\frac{d^2 I_n}{dt^2} = \\frac{1}{C_0}(I_{n-1} - I_n) - \\frac{1}{C_0}(I_n - I_{n+1}) = \\frac{1}{C_0}(I_{n+1} - 2I_n + I_{n-1})',
        trick: 'trick-determinant'
      },
      {
        title: 'Kısa Devre Sınır Koşulları ve Kip Frekansları',
        hint: 'I₀ = 0 ve I₄ = 0 sabit uç koşulunu uygulayın.',
        text: 'N = 3 indüktör için sınır koşulları iki ucu sabit tel ile aynıdır:',
        math: '\\omega_m = 2\\omega_0 \\sin\\!\\left( \\frac{m\\pi}{2(N+1)} \\right) = \\frac{2}{\\sqrt{L_0 C_0}} \\sin\\!\\left( \\frac{m\\pi}{8} \\right) \\quad (m=1, 2, 3)'
      },
    ],
    sceneMode: 'discrete-lattice',
    abstractTab: 'dispersion',
    presetParams: { numBeads: 3, modeN: 2 },
    observe: 'Akım dalgalarının LC hattı üzerinde mekanik duran dalgalarla tamamen aynı sinüs zarfını çizdiğini gözleyin.',
    finalBoxed: '\\omega_m = \\frac{2}{\\sqrt{L_0 C_0}}\\sin\\left(\\frac{m\\pi}{8}\\right) \\quad (m=1, 2, 3)',
    check: 'ω_max = 2/√(L₀C₀) devrenin alçak geçiren filtre kesim frekansıdır (cutoff).'
  },
  {
    num: '2.12',
    title: 'Telin Gerginliği ve Çelik Piyano Telinde Kopma Gerilmesi Sınırı',
    page: 'Sayfa 65',
    home: false,
    diff: 'Temel Türetim',
    tags: ['Piyano Teli', 'Çekme Dayanımı', 'Mersenne Yasası'],
    statement: 'Do 256 sesini veren (ν₁ = 256 Hz), serbest uzunluğu L = 0.62 m olan bir piyano telinin yapıldığı çeliğin özkütlesi ρ = 7.8 × 10³ kg/m³\'tür. Teldeki çekme gerilmesini (T/A) hesaplayınız ve çeliğin kopma dayanımı olan 1.5 × 10⁹ N/m² sınırının neden altında kalındığını tartışınız.',
    givenLatex: '\\nu_1 = 256\\text{ Hz}, \\quad L = 0.62\\text{ m}, \\quad \\rho = 7.8 \\times 10^3\\text{ kg/m}^3, \\quad \\sigma_{\\text{kopma}} \\approx 1.5 \\times 10^9\\text{ N/m}^2',
    targetLatex: '\\sigma = \\frac{T}{A} = 4\\rho L^2 \\nu_1^2 \\approx 7.86 \\times 10^8\\text{ N/m}^2 \\approx 0.52 \\sigma_{\\text{kopma}}',
    principle: 'Temel frekans ν₁ = v/(2L) ve faz hızı v = √(T/ρ₀) = √(T/(ρA)) formülleri birleştirildiğinde çekme gerilmesi σ = T/A telin yarıçapından bağımsız olarak sadece frekansa, boya ve özkütleye bağlanır.',
    startQ: 'ν₁ = (1/(2L)) √(T/(ρA)) ifadesinden birim alana düşen gerilim σ = T/A nasıl çekilir?',
    optCorrect: '\\sigma = \\frac{T}{A} = 4 \\rho L^2 \\nu_1^2',
    optWrong1: '\\sigma = 2 \\rho L \\nu_1',
    optWrong2: '\\sigma = \\frac{\\rho L^2 \\nu_1^2}{4}',
    steps: [
      {
        title: 'Mersenne Bağıntısından Gerilmenin Çekilmesi',
        hint: 'ν₁² = T / (4 ρ A L²) eşitliğini σ = T/A için düzenleyin.',
        text: 'Dalga hızı v = 2L ν₁ olduğundan kütlece yoğunluk ile gerilme doğrudan karesel olarak bağlanır:',
        math: '\\sigma = \\frac{T}{A} = \\rho v^2 = \\rho (2 L \\nu_1)^2 = 4 \\rho L^2 \\nu_1^2'
      },
      {
        title: 'Sayısal Değerlerin Yerine Konması',
        hint: 'L = 0.62, ν₁ = 256, ρ = 7800 değerlerini çarpın.',
        text: 'Sayısal değerler hesaplandığında gerilme kopma sınırının yaklaşık yarısı (güvenlik katsayısı ~ 2) çıkar:',
        math: '\\sigma = 4 \\times (7800) \\times (0.62)^2 \\times (256)^2 = 4 \\times 7800 \\times 0.3844 \\times 65536 \\approx 7.86 \\times 10^8\\text{ N/m}^2'
      },
    ],
    sceneMode: 'standing-modes',
    abstractTab: 'dispersion',
    presetParams: { modeN: 1, boundaryCondition: 0 },
    observe: 'Piyano telinde frekansı artırmak için gerilimi aşırı artırmanın teli kopma sınırına yaklaştıracağını anlayın.',
    finalBoxed: '\\frac{T}{A} = 4\\rho L^2 \\nu_1^2 \\approx 7.86 \\times 10^8\\text{ N/m}^2',
    check: 'Birim: [kg/m³ · m² · s⁻²] = kg/(m·s²) = N/m² (Pascal).'
  },
  {
    num: '2.13',
    title: 'Gevşek Yayda Başlangıç Dalga Profili ve Süperpozisyon',
    page: 'Sayfa 65',
    home: false,
    diff: 'Vize Klasik',
    tags: ['Gevşek Yay', 'Duran Dalga', 'Zaman Evrimi'],
    statement: 't = 0 anında g(z) = h sin(πz/L) + (h/3) sin(3πz/L) biçiminde iki kipin süperpozisyonu ile şekillendirilip ilk hızsız serbest bırakılan gevşek bir yayın t_0 = π / (2ω₁) çeyrek periyot sonraki profilini ψ(z, t₀) türetiniz ve t = 0 anıyla karşılaştırınız.',
    givenLatex: '\\psi(z, 0) = h\\sin\\!\\left(\\frac{\\pi z}{L}\\right) + \\frac{h}{3}\\sin\\!\\left(\\frac{3\\pi z}{L}\\right), \\qquad \\left.\\frac{\\partial\\psi}{\\partial t}\\right|_{t=0} = 0, \\quad t_0 = \\frac{\\pi}{2\\omega_1}',
    targetLatex: '\\psi(z, t_0) = 0 \\quad (\\text{Çeyrek periyot anında tüm potansiyel enerji kinetik enerjiye dönüşür!})',
    principle: 'Her normal kip zaman içinde cos(nω₁ t) ile salınır. n tek olduğunda (n=1 ve n=3) t₀ = π/(2ω₁) anında cos(ω₁ t₀) = cos(π/2) = 0 ve cos(3ω₁ t₀) = cos(3π/2) = 0 olur; böylece tüm uzanımlar aynı anda sıfırdan geçer.',
    startQ: 't₀ = π / (2ω₁) anında n = 1 ve n = 3 kiplerinin zaman çarpanları cos(nω₁ t₀) neye eşittir?',
    optCorrect: '\\cos\\!\\left(\\frac{\\pi}{2}\\right) = 0, \\qquad \\cos\\!\\left(\\frac{3\\pi}{2}\\right) = 0 \\implies \\psi(z, t_0) = 0',
    optWrong1: '\\cos(\\pi/2) = 1',
    optWrong2: '\\cos(3\\pi/2) = -1',
    steps: [
      {
        title: 'Genel Süperpozisyon Çözümünün Yazılması',
        hint: 'İlk hız sıfır olduğu için sadece kosinüs terimleri kalır.',
        text: 'Hareket denkleminin çözümü normal kiplerin zaman evrimiyle verilir:',
        math: '\\psi(z,t) = h\\sin\\!\\left(\\frac{\\pi z}{L}\\right)\\cos(\\omega_1 t) + \\frac{h}{3}\\sin\\!\\left(\\frac{3\\pi z}{L}\\right)\\cos(3\\omega_1 t)',
        trick: 'trick-separation'
      },
      {
        title: 't = t₀ Anında Denge Konumundan Geçiş',
        hint: 't = π/(2ω₁) değerini yerine yazın.',
        text: 'Her iki harmonik de aynı anda düğüm (sıfır uzanım) anına ulaşır; tel anlık olarak tamamen düzdür fakat maksimum hıza sahiptir:',
        math: '\\psi(z, t_0) = h\\sin\\!\\left(\\frac{\\pi z}{L}\\right) \\cdot 0 + \\frac{h}{3}\\sin\\!\\left(\\frac{3\\pi z}{L}\\right) \\cdot 0 = 0'
      },
    ],
    sceneMode: 'plucked-fourier',
    abstractTab: 'fourier-spectrum',
    presetParams: { pluckPosRatio: 0.5, fourierMaxN: 3 },
    observe: 'Tel düz çizgi haline geldiğinde hız vektörlerinin maksimum olduğunu faz uzayında inceleyin.',
    finalBoxed: '\\psi(z, t_0) = 0, \\qquad \\left.\\frac{\\partial\\psi}{\\partial t}\\right|_{t_0} = -h\\omega_1 \\sin\\left(\\frac{\\pi z}{L}\\right) - h\\omega_1 \\sin\\left(\\frac{3\\pi z}{L}\\right)',
    check: 'Mekanik enerji korunumu: U(t₀) = 0 ve E_kin(t₀) = E_toplam.'
  },
  {
    num: '2.14',
    title: 'Çelik Tel ve Bağırsak Tel Gerilim Karşılaştırması',
    page: 'Sayfa 65',
    home: false,
    diff: 'Temel Türetim',
    tags: ['Gitar Teli', 'Mersenne Yasası', 'Yoğunluk Oranı'],
    statement: 'Bir gitarın aynı uzunlukta, aynı çapta ve aynı temel akort perdesine (frekansına) sahip çelik teli (ρ_çelik ≈ 7.8 g/cm³) ile klasik gitar bağırsak/naylon teli (ρ_bağırsak ≈ 1.0 g/cm³) arasındaki gerilim oranını T_çelik / T_bağırsak türetiniz. Elektro gitarların saplarının neden çelik tel gerilimine dayanacak özel metal destek çubukları (truss rod) içerdiğini tartışınız.',
    givenLatex: 'L_1 = L_2 = L, \\quad d_1 = d_2 = d, \\quad \\nu_1 = \\nu_2, \\quad \\rho_{\\text{çelik}} = 7.8\\text{ g/cm}^3, \\quad \\rho_{\\text{bağırsak}} = 1.0\\text{ g/cm}^3',
    targetLatex: '\\frac{T_{\\text{çelik}}}{T_{\\text{bağırsak}}} = \\frac{\\rho_{\\text{çelik}}}{\\rho_{\\text{bağırsak}}} \\approx 7.8',
    principle: 'Aynı frekans ve aynı geometride (L ve kesit alanı A = πd²/4 sabitken) gerilim doğrudan hacimsel özkütle ile orantılıdır: T = 4 L² ν₁² (ρ A) ∝ ρ.',
    startQ: 'Mersenne frekans bağıntısı ν₁ = (1/2L) √(T/(ρ A)) eşitliğinden T gerilimi çekildiğinde yoğunluk ρ ile nasıl orantılıdır?',
    optCorrect: 'T = 4 L^2 A \\nu_1^2 \\rho \\implies T \\propto \\rho \\quad (\\text{Doğrusal orantılı})',
    optWrong1: 'T \\propto \\frac{1}{\\rho}',
    optWrong2: 'T \\propto \\sqrt{\\rho}',
    steps: [
      {
        title: 'İki Tel İçin Gerilim İfadelerinin Oranlanması',
        hint: 'L, A ve ν₁ sadeleşir.',
        text: 'Her iki telin frekansları eşitlendiğinde:',
        math: '\\nu_1 = \\frac{1}{2L}\\sqrt{\\frac{T_{\\text{çelik}}}{\\rho_{\\text{çelik}} A}} = \\frac{1}{2L}\\sqrt{\\frac{T_{\\text{bağırsak}}}{\\rho_{\\text{bağırsak}} A}}',
        trick: 'trick-taylor'
      },
      {
        title: 'Gerilim Oranının Hesaplanması',
        hint: 'Karelerini alıp oranlayın.',
        text: 'Çelik telin gerilimi bağırsak/naylon telin geriliminin yaklaşık 8 katıdır:',
        math: '\\frac{T_{\\text{çelik}}}{T_{\\text{bağırsak}}} = \\frac{\\rho_{\\text{çelik}}}{\\rho_{\\text{bağırsak}}} = \\frac{7.8}{1.0} = 7.8'
      },
    ],
    sceneMode: 'standing-modes',
    abstractTab: 'dispersion',
    presetParams: { modeN: 1, boundaryCondition: 0 },
    observe: 'Yüksek gerilimli çelik telde dalga yayılma hızının aynı kalması için telin kütlesinin büyük gerilimle dengelendiğini görün.',
    finalBoxed: '\\frac{T_{\\text{çelik}}}{T_{\\text{bağırsak}}} = \\frac{\\rho_{\\text{çelik}}}{\\rho_{\\text{bağırsak}}} \\approx 7.8',
    check: 'Bu nedenle klasik gitar sapına çelik tel takılırsa yaklaşık 8 kat fazla çekme kuvveti sapı büker veya kırar.'
  },
  {
    num: '2.15',
    title: 'Ayrık Boncuklu Telden Klasik Dalga Denkleminin Taylor Serisiyle Çıkarılışı',
    page: 'Sayfa 65',
    home: false,
    diff: 'Vize Klasik',
    tags: ['Sürekli Limit', 'Taylor Açılımı', 'Dalga Denklemi'],
    statement: 'N boncuklu ipin hareket denklemi M d²ψ_n/dt² = (T₀/a)(ψ_{n+1} - 2ψ_n + ψ_{n-1}) ile başlayınız. Boncuk aralığı a → 0 sürekli sınırına giderken ψ_{n±1} terimlerini z = na etrafında Taylor serisine açarak klasik dalga denklemini ve ilk yüksek mertebe dağıtkanlık terimini türetiniz.',
    givenLatex: 'M\\ddot{\\psi}_n = \\frac{T_0}{a}(\\psi_{n+1} - 2\\psi_n + \\psi_{n-1}), \\quad M = \\rho_0 a, \\quad z_n = n a, \\quad \\psi_{n\\pm 1} = \\psi(z \\pm a, t)',
    targetLatex: '\\frac{\\partial^2\\psi}{\\partial t^2} = v_0^2 \\frac{\\partial^2\\psi}{\\partial z^2} + \\frac{v_0^2 a^2}{12}\\frac{\\partial^4\\psi}{\\partial z^4} + \\mathcal{O}(a^4) \\implies \\frac{\\partial^2\\psi}{\\partial t^2} = v_0^2 \\frac{\\partial^2\\psi}{\\partial z^2}',
    principle: 'İkinci sonlu fark (ψ_{n+1} - 2ψ_n + ψ_{n-1}) Taylor serisinde tek türevleri birbirini götürür; en baskın terim a² ∂²ψ/∂z² olur. a → 0 limitinde a² çarpanı paydadaki a ile birleşerek sürekli ortam dalga denklemini kurar.',
    startQ: 'ψ(z+a) ve ψ(z-a) terimlerinin toplamı a⁴ mertebesine kadar Taylor serisinde neye eşittir?',
    optCorrect: '\\psi(z+a) + \\psi(z-a) = 2\\psi(z) + a^2 \\frac{\\partial^2\\psi}{\\partial z^2} + \\frac{a^4}{12}\\frac{\\partial^4\\psi}{\\partial z^4}',
    optWrong1: '\\psi(z+a) + \\psi(z-a) = 2\\psi(z) + 2a \\frac{\\partial\\psi}{\\partial z}',
    optWrong2: '\\psi(z+a) + \\psi(z-a) = a^2 \\frac{\\partial^2\\psi}{\\partial z^2}',
    steps: [
      {
        title: 'İkinci Farkın Taylor Açılımı',
        hint: 'ψ(z±a) = ψ ± a ψ\' + (a²/2) ψ\'\' ± (a³/6) ψ\'\'\' + (a⁴/24) ψ\'\'\'\' yazıp toplayın.',
        text: 'Tek dereceli türevler simetri nedeniyle birbirini yok eder:',
        math: '\\psi_{n+1} - 2\\psi_n + \\psi_{n-1} = a^2 \\frac{\\partial^2\\psi}{\\partial z^2} + \\frac{a^4}{12}\\frac{\\partial^4\\psi}{\\partial z^4} + \\mathcal{O}(a^6)',
        trick: 'trick-taylor'
      },
      {
        title: 'Kütle ve Gerilimin Yerine Konması',
        hint: 'M = ρ₀ a koyup her iki tarafı a\'ya bölün.',
        text: 'a → 0 limitinde a²\'li terim ihmal edilir ve klasik sürekli dalga denklemi kalır:',
        math: '(\\rho_0 a)\\frac{\\partial^2\\psi}{\\partial t^2} = \\frac{T_0}{a}\\left[ a^2 \\frac{\\partial^2\\psi}{\\partial z^2} + \\frac{a^4}{12}\\frac{\\partial^4\\psi}{\\partial z^4} \\right] \\implies \\frac{\\partial^2\\psi}{\\partial t^2} = \\frac{T_0}{\\rho_0}\\frac{\\partial^2\\psi}{\\partial z^2} + \\frac{T_0 a^2}{12\\rho_0}\\frac{\\partial^4\\psi}{\\partial z^4}'
      },
    ],
    sceneMode: 'continuous-dx',
    abstractTab: 'dispersion',
    presetParams: { modeN: 2, numBeads: 20 },
    observe: 'a² ∂⁴ψ/∂z⁴ teriminin kesikli boncuk örgüsündeki yüksek frekans dispersiyonunun kaynağı olduğunu inceleyin.',
    finalBoxed: '\\frac{\\partial^2\\psi}{\\partial t^2} = v_0^2 \\frac{\\partial^2\\psi}{\\partial z^2} \\quad \\left(v_0 = \\sqrt{\\frac{T_0}{\\rho_0}}\\right)',
    check: 'a ≪ λ limitinde a²/λ² ≪ 1 olduğundan yüksek mertebe terimler tamamen sıfıra gider.'
  },
  {
    num: '2.16',
    title: 'Boncuklu İpte Dağıtkanlık Bağıntısının Doğrudan Çıkarılışı',
    page: 'Sayfa 65',
    home: false,
    diff: 'Temel Türetim',
    tags: ['Dispersiyon Bağıntısı', 'Trigonometrik Kimlik', 'Hareket Denklemi'],
    statement: 'ψ_n(t) = A_n cos(ωt + φ) harmonik mod çözümünü, katsayılar A_n = A sin(nka) olmak üzere boncuklu ip hareket denkleminde yerine koyarak ω(k) = 2ω₀ sin(ka/2) dispersiyon bağıntısının sınır koşullarından bağımsız olarak çıktığını kanıtlayınız.',
    givenLatex: 'M\\ddot{\\psi}_n = \\frac{T_0}{a}(\\psi_{n+1} - 2\\psi_n + \\psi_{n-1}), \\qquad \\psi_n(t) = A\\sin(nka)\\cos(\\omega t + \\phi)',
    targetLatex: '\\omega^2 = 4\\omega_0^2 \\sin^2\\!\\left(\\frac{ka}{2}\\right) \\implies \\omega(k) = 2\\omega_0 \\sin\\!\\left(\\frac{ka}{2}\\right) \\quad \\left(\\omega_0 = \\sqrt{\\frac{T_0}{Ma}}\\right)',
    principle: 'Komşu boncukların konumları arasındaki fark, trigonometrik toplam-fark dönüşümüyle sin(nka) ortak çarpanını üretir; bu çarpan denklemden sadeleştiğinde geriye frekans ile dalga sayısı arasındaki ω(k) bağıntısı kalır.',
    startQ: 'sin[(n+1)ka] + sin[(n-1)ka] - 2 sin(nka) ifadesi trigonometrik olarak neye eşittir?',
    optCorrect: '-4 \\sin^2\\!\\left(\\frac{ka}{2}\\right) \\sin(nka)',
    optWrong1: '+2 \\cos(ka) \\sin(nka)',
    optWrong2: '-2 \\sin(ka)',
    steps: [
      {
        title: 'Komşu Boncuk Genliklerinin Trigonometrik Sadeleştirmesi',
        hint: 'sin(α+β) + sin(α-β) = 2 sin α cos β ve 1 - cos θ = 2 sin²(θ/2) kimliklerini kullanın.',
        text: 'Parantez içi ikinci fark terimi düzenlenir:',
        math: 'A[\\sin(nka + ka) - 2\\sin(nka) + \\sin(nka - ka)] = 2A\\sin(nka)(\\cos ka - 1) = -4A\\sin(nka)\\sin^2\\!\\left(\\frac{ka}{2}\\right)',
        trick: 'trick-trig-beats'
      },
      {
        title: 'Zamana Göre İkinci Türev ile Eşitleme',
        hint: 'd²ψ_n/dt² = -ω² ψ_n yazın.',
        text: 'A sin(nka) cos(ωt+φ) çarpanı her iki taraftan sadeleştiğinde doğrudan dispersiyon bağıntısı kalır:',
        math: '-M\\omega^2 \\psi_n = -\\frac{4T_0}{a}\\sin^2\\!\\left(\\frac{ka}{2}\\right) \\psi_n \\implies \\omega^2 = \\frac{4T_0}{Ma}\\sin^2\\!\\left(\\frac{ka}{2}\\right)',
        trick: 'trick-taylor'
      },
    ],
    sceneMode: 'discrete-lattice',
    abstractTab: 'dispersion',
    presetParams: { numBeads: 12, modeN: 4 },
    observe: 'Dispersiyon bağıntısının ka = π değerinde maksimum frekansa (2ω₀ kesim frekansı) ulaştığını görün.',
    finalBoxed: '\\omega(k) = 2\\omega_0 \\sin\\left(\\frac{ka}{2}\\right) \\quad \\left(\\omega_0 = \\sqrt{\\frac{T_0}{Ma}}\\right)',
    check: 'ka ≪ 1 limitinde sin(ka/2) ≈ ka/2 yazılırsa ω = ω₀ k a = v₀ k sürekli tel bağıntısı geri kazanılır.'
  },
  {
    num: '2.17',
    title: 'İki Ucu Sabit N = 5 Boncuklu Örgünün Normal Kipleri ve Frekans Oranları',
    page: 'Sayfa 65',
    home: false,
    diff: 'Temel Türetim',
    tags: ['N=5 Boncuk', 'Sabit Sınır', 'Frekans Oranları'],
    statement: 'İki ucu sabit, 5 özdeş boncuktan (N = 5, parça sayısı N+1 = 6) oluşan bir ipin 5 normal kipinin dalga sayılarını k_m, özfrekanslarını ω_m ve temel frekansa oranlarını ω_m / ω₁ tam trigonometrik değerleriyle türetiniz.',
    givenLatex: 'N = 5, \\qquad k_m a = \\frac{m\\pi}{N+1} = \\frac{m\\pi}{6} \\quad (m = 1, 2, 3, 4, 5)',
    targetLatex: '\\omega_m = 2\\omega_0 \\sin\\!\\left( \\frac{m\\pi}{12} \\right) \\implies \\frac{\\omega_m}{\\omega_1} = \\frac{\\sin(m\\pi/12)}{\\sin(\\pi/12)}',
    principle: 'N boncuklu sistemde tam olarak N tane bağımsız normal kip vardır. Sabit uçlarda sin(k L) = sin[(N+1)ka] = 0 şartı k_m dalga sayısını π/6 katlarına kuantize eder.',
    startQ: 'N = 5 için izinli dalga sayıları k_m a hangi değerleri alır?',
    optCorrect: 'k_m a = \\frac{m\\pi}{6} = \\frac{\\pi}{6}, \\frac{2\\pi}{6}, \\frac{3\\pi}{6}, \\frac{4\\pi}{6}, \\frac{5\\pi}{6}',
    optWrong1: 'k_m a = \\frac{m\\pi}{5}',
    optWrong2: 'k_m a = \\frac{m\\pi}{7}',
    steps: [
      {
        title: 'Kip Frekanslarının Hesaplanması',
        hint: 'ω_m = 2ω₀ sin(k_m a / 2) formülünde k_m a = mπ/6 koyun.',
        text: 'Açıların yarısı mπ/12 olur:',
        math: '\\omega_1 = 2\\omega_0\\sin(15^\\circ) = 2\\omega_0 \\frac{\\sqrt{6}-\\sqrt{2}}{4} \\approx 0.518\\omega_0, \\qquad \\omega_2 = 2\\omega_0\\sin(30^\\circ) = \\omega_0',
        trick: 'trick-trig-beats'
      },
      {
        title: 'Üst Kipler ve Oranlar',
        hint: 'm = 3, 4, 5 için sinüs değerlerini hesaplayın.',
        text: 'Frekans oranları sürekli teldeki 1:2:3:4:5 oranından bariz biçimde sapar:',
        math: '\\omega_3 = 2\\omega_0\\sin(45^\\circ) = \\sqrt{2}\\omega_0, \\quad \\omega_4 = 2\\omega_0\\sin(60^\\circ) = \\sqrt{3}\\omega_0, \\quad \\omega_5 = 2\\omega_0\\sin(75^\\circ) \\approx 1.932\\omega_0'
      },
    ],
    sceneMode: 'discrete-lattice',
    abstractTab: 'dispersion',
    presetParams: { numBeads: 5, modeN: 1 },
    observe: 'N = 5 için dispersiyon eğrisinde 5 noktanın yerleşimini ve m=5 kipinde komşu boncukların zıt yönde gittiğini izleyin.',
    finalBoxed: '\\omega_m = 2\\omega_0 \\sin\\left(\\frac{m\\pi}{12}\\right) \\implies \\frac{\\omega_m}{\\omega_1} \\in \\{1, \\; 1.93, \\; 2.73, \\; 3.35, \\; 3.73\\}',
    check: 'Sürekli telde 5. harmonik 5 kat frekanstayken, kesikli örgüde sadece 3.73 kattır (dispersiyon gecikmesi).'
  },
  {
    num: '2.18',
    title: 'Bir Ucu Sabit Bir Ucu Serbest N = 5 Boncuklu İpin Kipleri',
    page: 'Sayfa 65',
    home: false,
    diff: 'Vize Klasik',
    tags: ['Sabit-Serbest Uç', 'N=5 Boncuk', 'Dispersiyon Noktaları'],
    statement: 'Bir ucu bağlı (z = 0\'da ψ₀ = 0), diğer ucu serbest kayan sürtünmesiz halkaya bağlı (z = L\'de ψ₆ = ψ₅) 5 boncuklu bir ipin enine titreşim kiplerinin dalga sayılarını k_m, özfrekanslarını ω_m türetiniz ve Şekil 2.13 dispersiyon eğrisi üzerindeki yerlerini gösteriniz.',
    givenLatex: '\\psi_0 = 0, \\qquad \\psi_6 = \\psi_5, \\qquad N = 5',
    targetLatex: 'k_m a = \\frac{(2m-1)\\pi}{2N+1} = \\frac{(2m-1)\\pi}{11} \\quad (m = 1, 2, 3, 4, 5)',
    principle: 'Sabit uç sinüs çözümünü zorlar: ψ_n = A sin(nka). Serbest uç ψ_{N+1} = ψ_N şartı ise cos[(N + 1/2)ka] = 0 denklemini doğurur; bu da (N + 1/2)ka = (2m-1)π/2 kuantizasyonunu verir.',
    startQ: 'ψ_n = A sin(nka) çözümü ψ₆ = ψ₅ sınır koşuluna konduğunda sin(6ka) - sin(5ka) = 0 trigonometrik olarak ne verir?',
    optCorrect: '2 \\sin\\!\\left(\\frac{ka}{2}\\right) \\cos\\!\\left(\\frac{11ka}{2}\\right) = 0 \\implies \\frac{11ka}{2} = \\frac{(2m-1)\\pi}{2}',
    optWrong1: '\\cos(11ka) = 0',
    optWrong2: '\\sin(11ka) = 0',
    steps: [
      {
        title: 'Serbest Uç Şartının Trigonometrik Çözümü',
        hint: 'sin C - sin D = 2 sin((C-D)/2) cos((C+D)/2) kimliğini kullanın.',
        text: 'ψ₆ - ψ₅ farkı sıfıra eşitlenir:',
        math: '\\sin(6ka) - \\sin(5ka) = 2\\sin\\!\\left(\\frac{ka}{2}\\right)\\cos\\!\\left(\\frac{11ka}{2}\\right) = 0',
        trick: 'trick-trig-beats'
      },
      {
        title: 'İzinli Dalga Sayıları ve Frekanslar',
        hint: '11ka/2 = (2m-1)π/2 yazarak ka\'yı çekin.',
        text: 'k_m a dalga sayıları π/11\'in tek katları olarak kuantize olur:',
        math: 'k_m a = \\frac{(2m-1)\\pi}{11} \\implies \\omega_m = 2\\omega_0 \\sin\\!\\left( \\frac{(2m-1)\\pi}{22} \\right) \\quad (m=1, 2, 3, 4, 5)'
      },
    ],
    sceneMode: 'discrete-lattice',
    abstractTab: 'dispersion',
    presetParams: { numBeads: 5, modeN: 1 },
    observe: 'Serbest uçtaki 5. boncuğun en büyük genlikle salındığını ve tel eğiminin son aralıkta sıfır olduğunu izleyin.',
    finalBoxed: '\\omega_m = 2\\omega_0 \\sin\\left( \\frac{(2m-1)\\pi}{22} \\right) \\quad (m=1, 2, 3, 4, 5)',
    check: 'Temel kipte k₁ a = π/11, en yüksek kipte k₅ a = 9π/11 < π (Brillouin sınırı içinde kalır).'
  },
  {
    num: '2.19',
    title: 'Brillouin Bölgesi Katlama ve Simetri Hilesi: 11 Boncuklu İpe Genişletme',
    page: 'Sayfa 65',
    home: false,
    diff: 'İleri Sentez',
    tags: ['Ayna Simetrisi', 'Katlama Tekniği', '11 Boncuklu İp'],
    statement: 'Şekil 2.13\'teki bir ucu sabit, bir ucu serbest 5 boncuklu sistemin dispersiyon grafiğini inceleyiniz. Sistemin serbest ucuna ayna simetrisiyle 6 nokta daha ekleyerek, bu sistemin iki ucu sabit 11 boncuklu bir ipin tek numaralı kipleriyle (m = 1, 3, 5, 7, 9, 11) nasıl birebir eşleştiğini kanıtlayınız.',
    givenLatex: 'N_{\\text{sabit-serbest}} = 5, \\qquad N_{\\text{sabit-sabit}} = 2N + 1 = 11',
    targetLatex: 'k_{\\text{sabit-serbest}, m} = k_{\\text{sabit-sabit}, 2m-1} = \\frac{(2m-1)\\pi}{12 a}',
    principle: 'Bir ucu sabit diğer ucu serbest olan bir sistem, serbest uçtaki simetri düzlemine göre çift katlı genişletilirse, iki ucu sabit 2N+1 boncuklu bir sistemin orta noktada karın noktası oluşturan tek (simetrik) kiplerine tam olarak denk gelir.',
    startQ: 'İki ucu sabit 11 boncuklu (toplam 12 aralıklı) bir sistemde orta nokta (6. aralık) hangi kiplerde karın noktası (maksimum uzanım, sıfır eğim) oluşturur?',
    optCorrect: '\\text{Tek numaralı kiplerde } (m = 1, 3, 5, 7, 9, 11) \\text{ orta nokta karındır ve serbest uç simetrisini sağlar.}',
    optWrong1: '\\text{Çift numaralı kiplerde}',
    optWrong2: '\\text{Tüm kiplerde}',
    steps: [
      {
        title: 'Ayna Simetrisi ile İki Ucu Sabit Sisteme Genişletme',
        hint: 'z = L serbest ucuna x = L + u ve x = L - u yansıması uygulayın.',
        text: 'Serbest uçta eğim sıfır olduğundan, bu noktaya bir ayna yerleştirilirse ipin sağa doğru yansıması ikinci bir sabit uca kadar uzatılabilir (toplam N\' = 2N + 1 = 11 boncuk):',
        math: '\\psi(2L - z) = \\psi(z) \\implies \\left.\\frac{\\partial\\psi}{\\partial z}\\right|_L = 0',
        trick: 'trick-determinant'
      },
      {
        title: 'Dispersiyon Noktalarının Eşleştirilmesi',
        hint: '11 boncuklu sistemin 11 kipinden tek olanlarını seçin.',
        text: '11 boncuklu iki ucu sabit ipin kipleri k_n = nπ / (12 a)\'dır. n = 2m - 1 tek sayıları doğrudan 5 boncuklu sabit-serbest sistemin frekanslarını üretir:',
        math: 'k_m a = \\frac{(2m-1)\\pi}{12} \\quad (m=1, 2, 3, 4, 5, 6)'
      },
    ],
    sceneMode: 'discrete-lattice',
    abstractTab: 'dispersion',
    presetParams: { numBeads: 11, modeN: 1 },
    observe: '11 boncuklu sistemde orta boncuğun en tepe noktada salındığı simetrik modları inceleyin.',
    finalBoxed: 'k_{\\text{sabit-serbest}, m} = k_{\\text{sabit-sabit}, 2m-1}',
    check: 'Bu katlama hilesi kuantum mekaniğinde periyodik kristallerin ve yarı-sonsuz yüzey durumlarının incelenmesinde temel araçtır.'
  },
  {
    num: '2.20',
    title: 'Boncuk Dispersiyonunun N = 1 ve N = 2 Limitlerinin Bölüm 1 Sonuçlarına İndirgenmesi',
    page: 'Sayfa 65',
    home: false,
    diff: 'Temel Türetim',
    tags: ['N=1 Limit', 'N=2 Limit', 'Bölüm 1 Uyumu', 'Özdeğerler'],
    statement: 'Genel N boncuk dispersiyon bağıntısının ω_m = 2ω₀ sin(mπ / 2(N+1)), N = 1 için Bölüm 1.2\'de bulunan tek kütle iki yay frekansı ω₁ = √2 ω₀ ve N = 2 için Bölüm 1.4\'te bulunan iki kütle üç yay frekansları ω₁ = ω₀, ω₂ = √3 ω₀ ile özdeş olduğunu cebirsel olarak gösteriniz.',
    givenLatex: '\\omega_m(N) = 2\\omega_0 \\sin\\!\\left( \\frac{m\\pi}{2(N+1)} \\right), \\qquad \\omega_0 = \\sqrt{\\frac{T_0}{Ma}} = \\sqrt{\\frac{k}{M}}',
    targetLatex: 'N=1: \\omega_1 = \\sqrt{2}\\omega_0; \\qquad N=2: \\omega_1 = \\omega_0, \\; \\omega_2 = \\sqrt{3}\\omega_0',
    principle: 'Crawford Bölüm 1\'deki küçük sistemler (tek ve çift sarkaç/yay), Bölüm 2\'deki N serbestlik dereceli genel kafes formülünün en küçük tamsayı özel durumlarıdır.',
    startQ: 'N = 1 için m = 1 konulduğunda sinüsün açısı mπ / 2(N+1) ne olur?',
    optCorrect: '\\frac{1\\cdot\\pi}{2(1+1)} = \\frac{\\pi}{4} \\implies \\sin\\!\\left(\\frac{\\pi}{4}\\right) = \\frac{\\sqrt{2}}{2}',
    optWrong1: '\\frac{\\pi}{2}',
    optWrong2: '\\frac{\\pi}{6}',
    steps: [
      {
        title: 'N = 1 Tek Kütle İki Yay Limiti',
        hint: 'ω₁ = 2ω₀ sin(π/4) yazın.',
        text: 'N = 1 durumunda kütleye iki yay bağlıdır ve k_eff = 2k olur:',
        math: '\\omega_1 = 2\\omega_0 \\sin\\!\\left(\\frac{\\pi}{4}\\right) = 2\\omega_0 \\frac{\\sqrt{2}}{2} = \\sqrt{2}\\omega_0 = \\sqrt{\\frac{2k}{M}}',
        trick: 'trick-determinant'
      },
      {
        title: 'N = 2 İki Kütle Üç Yay Limiti',
        hint: 'N = 2 için açılar π/6 ve 2π/6 = π/3 olur.',
        text: 'm = 1 ve m = 2 frekansları Bölüm 1.4\'teki simetrik ve antisimetrik modları aynen verir:',
        math: '\\omega_1 = 2\\omega_0\\sin\\!\\left(\\frac{\\pi}{6}\\right) = 2\\omega_0 \\left(\\frac{1}{2}\\right) = \\omega_0, \\qquad \\omega_2 = 2\\omega_0\\sin\\!\\left(\\frac{\\pi}{3}\\right) = 2\\omega_0 \\left(\\frac{\\sqrt{3}}{2}\\right) = \\sqrt{3}\\omega_0'
      },
    ],
    sceneMode: 'discrete-lattice',
    abstractTab: 'dispersion',
    presetParams: { numBeads: 2, modeN: 1 },
    observe: 'N = 2 için iki boncuğun aynı fazda (ω₁) ve zıt fazda (ω₂) salınışını canlı izleyin.',
    finalBoxed: 'N=1: \\omega_1 = \\sqrt{2}\\omega_0; \\quad N=2: \\omega_1 = \\omega_0, \\; \\omega_2 = \\sqrt{3}\\omega_0',
    check: 'Bölüm 1.4\'teki seküler determinant kökleri det(K - ω²M) = (2k - mω²)² - k² = 0 ile tam uyumludur.'
  },
  {
    num: '2.21',
    title: 'İki Ucu Serbest N = 5 Boncuklu İpin Kipleri ve Periyodik Halka Analojisi',
    page: 'Sayfa 65',
    home: false,
    diff: 'Vize Klasik',
    tags: ['İki Ucu Serbest', 'N=5', 'Periyodik Sınır', 'Öteleme Kipi'],
    statement: 'İki ucunda sürtünmesiz serbest kayıcı halkalar bulunan 5 boncuklu bir ipin sınır koşullarını yazınız, 5 normal kipinin dalga sayılarını ve frekanslarını türetiniz. Bu sistemin çevresi 2L olan kapalı periyodik dairesel bir halka ile olan bağıntısını açıklayınız.',
    givenLatex: '\\psi_0 = \\psi_1, \\qquad \\psi_6 = \\psi_5, \\qquad N = 5',
    targetLatex: 'k_m a = \\frac{m\\pi}{N} = \\frac{m\\pi}{5} \\quad (m = 0, 1, 2, 3, 4), \\qquad \\omega_m = 2\\omega_0 \\sin\\!\\left( \\frac{m\\pi}{10} \\right)',
    principle: 'İki ucu serbest boncuklu ipte uçlar karın noktasıdır; k dalga sayıları π/N adımlarıyla kuantize olur. m = 0 kipi net kuvvet içermeyen serbest rijit ötelemedir.',
    startQ: 'İki ucu serbest N = 5 boncuklu sistemde serbest uç şartı ψ₆ = ψ₅ dalga sayısını nasıl belirler?',
    optCorrect: 'k_m a = \\frac{m\\pi}{5} \\quad (m = 0, 1, 2, 3, 4)',
    optWrong1: 'k_m a = \\frac{m\\pi}{6}',
    optWrong2: 'k_m a = \\frac{(2m-1)\\pi}{10}',
    steps: [
      {
        title: 'Kosinüs Çözümü ve Sınır Denklemi',
        hint: 'ψ_n = B cos(k a (n - 1/2)) ifadesini n=5 ve n=6 için yazıp eşitleyin.',
        text: 'ψ₆ = ψ₅ şartı sin(5ka) = 0 gerektirir:',
        math: '\\cos(11ka/2) = \\cos(9ka/2) \\implies \\sin\\!\\left(\\frac{ka}{2}\\right)\\sin(5ka) = 0 \\implies k_m a = \\frac{m\\pi}{5}',
        trick: 'trick-determinant'
      },
      {
        title: 'Frekans Spektrumu ve m = 0 Kipi',
        hint: 'm = 0, 1, 2, 3, 4 için frekansları yazın.',
        text: 'm = 0 kipi sıfır frekanslı ötelemedir; diğer 4 kip salınım yapar:',
        math: '\\omega_0 = 0, \\quad \\omega_1 = 2\\omega_0\\sin(18^\\circ), \\quad \\omega_2 = 2\\omega_0\\sin(36^\\circ), \\quad \\omega_3 = 2\\omega_0\\sin(54^\\circ), \\quad \\omega_4 = 2\\omega_0\\sin(72^\\circ)'
      },
    ],
    sceneMode: 'discrete-lattice',
    abstractTab: 'dispersion',
    presetParams: { numBeads: 5, modeN: 1 },
    observe: 'Uç boncukların maksimum genlikle hareket ettiğini ve m=0\'da sistemin topluca kaydığını görün.',
    finalBoxed: '\\omega_m = 2\\omega_0 \\sin\\left(\\frac{m\\pi}{10}\\right) \\quad (m=0, 1, 2, 3, 4)',
    check: 'Toplam serbestlik derecesi 5\'tir: 1 öteleme kipi + 4 salınım kipi = 5 bağımsız mod.'
  },
  {
    num: '2.22',
    title: 'İki Yay Sabitli / Kütleli Karmaşık Zincirin (Şekil 2.15) Dispersiyon Grafiği',
    page: 'Sayfa 65',
    home: false,
    diff: 'İleri Sentez',
    tags: ['Diyatomik Zincir', 'Akustik Dal', 'Optik Dal', 'Yasak Bant'],
    statement: 'Şekil 2.15\'te gösterilen, kütleleri M₁ ve M₂ olan atomların K yaylarıyla ardışık dizildiği bir boyutlu kristal kafesin dispersiyon bağıntısının grafiğini çiziniz. Akustik dal, optik dal ve aradaki yasak frekans bandını (band gap) analiz ediniz.',
    givenLatex: 'M_1\\ddot{\\psi}_{2n} = K(\\psi_{2n+1} - 2\\psi_{2n} + \\psi_{2n-1}), \\quad M_2\\ddot{\\psi}_{2n+1} = K(\\psi_{2n+2} - 2\\psi_{2n+1} + \\psi_{2n})',
    targetLatex: '\\omega_\\pm^2 = K\\left(\\frac{1}{M_1}+\\frac{1}{M_2}\\right) \\pm K\\sqrt{\\left(\\frac{1}{M_1}+\\frac{1}{M_2}\\right)^2 - \\frac{4\\sin^2(ka)}{M_1 M_2}}',
    principle: 'Birim hücrede iki farklı atom bulunması iki bağımsız dalga çözümü doğurur: Düşük frekanslı Akustik Dal (komşu atomlar aynı fazda salınır) ve Yüksek frekanslı Optik Dal (komşu atomlar zıt fazda salınır). İki dal arasında hiçbir dalganın yayılamadığı Yasak Bant oluşur.',
    startQ: 'k → 0 (sonsuz dalga boyu) limitinde akustik ve optik frekanslar neye yakınsar?',
    optCorrect: '\\omega_{\\text{akustik}} \\to 0, \\qquad \\omega_{\\text{optik}} \\to \\sqrt{2K\\left(\\frac{1}{M_1} + \\frac{1}{M_2}\\right)}',
    optWrong1: '\\omega_{\\text{akustik}} \\to \\omega_{\\text{optik}}',
    optWrong2: '\\omega_{\\text{optik}} \\to 0',
    steps: [
      {
        title: 'İki Atomlu Hücre İçin Seküler Determinant',
        hint: 'ψ_{2n} = A e^{i(2nka - ωt)} ve ψ_{2n+1} = B e^{i((2n+1)ka - ωt)} koyup 2×2 determinantı sıfırlayın.',
        text: 'Katsayılar matrisinin determinantı sıfıra eşitlenir:',
        math: '\\begin{vmatrix} 2K - M_1\\omega^2 & -2K\\cos(ka) \\\\ -2K\\cos(ka) & 2K - M_2\\omega^2 \\end{vmatrix} = 0',
        trick: 'trick-determinant'
      },
      {
        title: 'Yasak Frekans Bandı (Band Gap)',
        hint: 'Brillouin sınırında ka = π/2 koyarak iki kökü bulun.',
        text: 'ka = π/2 sınırında cos(ka) = 0 olur ve kökler doğrudan ayrışır; aradaki frekanslar yasaktır:',
        math: '\\omega_{\\text{akustik, max}} = \\sqrt{\\frac{2K}{M_{\\text{büyük}}}}, \\qquad \\omega_{\\text{optik, min}} = \\sqrt{\\frac{2K}{M_{\\text{küçük}}}}'
      },
    ],
    sceneMode: 'discrete-lattice',
    abstractTab: 'dispersion',
    presetParams: { numBeads: 8, diatomicRatio: 2.0 },
    observe: 'Sağ panelde \'Diyatomik Kütle Farkı\' aktifken ω(k) grafiğindeki akustik ve optik dallar arasındaki kırmızı yasak bandı inceleyin.',
    finalBoxed: '\\omega_{\\text{gap}} = \\left( \\sqrt{\\frac{2K}{M_1}}, \\; \\sqrt{\\frac{2K}{M_2}} \\right)',
    check: 'M₁ = M₂ limitinde yasak bant sıfırlanır ve tek atomlu örgü eğrisi geri kazanılır.'
  },
  {
    num: '2.23',
    title: 'Çiftlenimli Sarkaç Dizgesi ve Dağıtkanlık Bağıntısı',
    page: 'Sayfa 65',
    home: false,
    diff: 'İleri Sentez',
    tags: ['Çiftlenimli Sarkaç', 'Yerçekimi + Yay', 'Dağıtkanlık Bağıntısı'],
    statement: 'Şekil 2.16\'da gösterilen, uzunlukları l ve kütleleri M olan sarkaçların kütlelerinden K yay sabitiyle birbirine bağlandığı dizgede n. sarkacın hareket denklemini kurunuz. Sınır koşullarından bağımsız genel kip çözümünün ψ_n(t) = cos(ωt + φ)[A sin(nka) + B cos(nka)] olduğunu ve ω² = (g/l) + 4(K/M) sin²(ka/2) dağıtkanlık bağıntısını türetiniz.',
    givenLatex: 'F_{\\text{yerçekimi}} = -M\\frac{g}{l}\\psi_n, \\qquad F_{\\text{yay}} = K(\\psi_{n+1} - \\psi_n) + K(\\psi_{n-1} - \\psi_n)',
    targetLatex: 'M\\frac{d^2\\psi_n}{dt^2} = -M\\frac{g}{l}\\psi_n + K(\\psi_{n+1} - 2\\psi_n + \\psi_{n-1}) \\implies \\omega^2 = \\frac{g}{l} + \\frac{4K}{M}\\sin^2\\!\\left(\\frac{ka}{2}\\right)',
    principle: 'Bu sistemde iki ayrı geri çağırıcı mekanizma vardır: Her sarkacın kendi yerçekimi (yerel kuvvet) ve komşularıyla olan yay çiftlenimi (etkileşme kuvveti). Bu nedenle k = 0 limitinde bile frekans sıfır olmaz; ω₀ = √(g/l) alt kesim frekansıdır.',
    startQ: 'n. sarkaca etkiyen toplam net kuvvet yerçekimi ve iki yanındaki yaylar cinsinden nedir?',
    optCorrect: 'F_n = -M\\frac{g}{l}\\psi_n + K(\\psi_{n+1} - 2\\psi_n + \\psi_{n-1})',
    optWrong1: 'F_n = -M\\frac{g}{l}\\psi_n + K(\\psi_{n+1} - \\psi_n)',
    optWrong2: 'F_n = K(\\psi_{n+1} - 2\\psi_n + \\psi_{n-1})',
    steps: [
      {
        title: 'Newton\'un 2. Yasası ile Diferansiyel Denklem',
        hint: 'F = Ma yazıp her iki tarafı M\'ye bölün.',
        text: 'Sarkaç ipinin açısı küçükken (sin θ ≈ θ = ψ_n/l) geri çağırıcı yerçekimi kuvveti -M(g/l)ψ_n\'dir:',
        math: '\\frac{d^2\\psi_n}{dt^2} = -\\omega_0^2 \\psi_n + \\omega_c^2(\\psi_{n+1} - 2\\psi_n + \\psi_{n-1}) \\quad \\left(\\omega_0^2 = \\frac{g}{l}, \\; \\omega_c^2 = \\frac{K}{M}\\right)',
        trick: 'trick-taylor'
      },
      {
        title: 'Harmonik Deneme Çözümü ve Dağıtkanlık Bağıntısı',
        hint: 'ψ_n = A sin(nka) cos(ωt) koyup ikinci farkı -4 sin²(ka/2) sin(nka) olarak yazın.',
        text: 'Trigonometrik yarım açı sadeleştirmesi yapıldığında doğrudan bağıntı düşer:',
        math: '-\\omega^2 = -\\omega_0^2 - 4\\omega_c^2 \\sin^2\\!\\left(\\frac{ka}{2}\\right) \\implies \\omega^2 = \\frac{g}{l} + \\frac{4K}{M}\\sin^2\\!\\left(\\frac{ka}{2}\\right)',
        trick: 'trick-trig-beats'
      },
    ],
    sceneMode: 'discrete-lattice',
    abstractTab: 'dispersion',
    presetParams: { numBeads: 8, modeN: 2 },
    observe: 'k = 0\'da tüm sarkaçların yaylar gerilmeden aynı fazda ω₀ = √(g/l) frekansıyla salındığını görün.',
    finalBoxed: '\\omega^2(k) = \\frac{g}{l} + \\frac{4K}{M}\\sin^2\\left(\\frac{ka}{2}\\right)',
    check: 'k = 0 için ω = √(g/l); ka = π için ω_max = √[g/l + 4K/M].'
  },
  {
    num: '2.24',
    title: 'Çiftlenimli Sarkaç Dizgesine Eşdeğer LC İletim Hattı Devresi',
    page: 'Sayfa 65',
    home: false,
    diff: 'İleri Sentez',
    tags: ['Elektrik Analojisi', 'LC Merdiven Ağı', 'Yüksek Geçiren Filtre'],
    statement: 'Problem 2.23\'te bulunan çiftlenimli sarkaç hareket denklemi ile birebir aynı diferansiyel denklemi veren indüktör (L₀), paralel sığa (C_p) ve seri çiftlenim sığasından (C_s) oluşan bir elektrik devresi tasarlayınız. Devrenin dağıtkanlık bağıntısını çıkarınız.',
    givenLatex: 'L_0\\frac{d^2 Q_n}{dt^2} = -\\frac{1}{C_p}Q_n + \\frac{1}{C_s}(Q_{n+1} - 2Q_n + Q_{n-1})',
    targetLatex: '\\omega^2 = \\frac{1}{L_0 C_p} + \\frac{4}{L_0 C_s}\\sin^2\\!\\left(\\frac{ka}{2}\\right)',
    principle: 'Mekanik çiftlenimli sarkaç dizgesindeki yerel yerçekimi geri çağırma kuvveti (g/l) paralel sığa C_p\'ye, komşu sarkaçlar arası yay çiftlenimi K ise seri sığa C_s\'ye karşılık gelir.',
    startQ: 'M d²ψ_n/dt² = -M(g/l)ψ_n + K(ψ_{n+1} - 2ψ_n + ψ_{n-1}) denklemi ile tam elektriksel eşdeğerlik nasıldır?',
    optCorrect: 'M \\leftrightarrow L_0, \\quad \\frac{M g}{l} \\leftrightarrow \\frac{1}{C_p}, \\quad K \\leftrightarrow \\frac{1}{C_s}',
    optWrong1: 'M \\leftrightarrow C_p, \\quad K \\leftrightarrow L_0',
    optWrong2: 'M \\leftrightarrow R, \\quad K \\leftrightarrow C_s',
    steps: [
      {
        title: 'Elektrik Devresi Düğüm Denklemlerinin Kurulması',
        hint: 'n. indüktörden geçen yük Q_n olsun.',
        text: 'Paralel kol toprağa bağlı C_p sığacını, seri kol komşular arası C_s sığacını temsil eder:',
        math: 'L_0 \\frac{d^2 Q_n}{dt^2} = -\\frac{Q_n}{C_p} + \\frac{Q_{n+1} - Q_n}{C_s} + \\frac{Q_{n-1} - Q_n}{C_s} = -\\frac{1}{C_p}Q_n + \\frac{1}{C_s}(Q_{n+1} - 2Q_n + Q_{n-1})',
        trick: 'trick-determinant'
      },
      {
        title: 'Dağıtkanlık Bağıntısının Çıkarılması',
        hint: 'Q_n = Q₀ e^{i(nka - ωt)} dalga çözümünü koyun.',
        text: 'Frekans bağıntısı mekanik sarkaç dizgesiyle özdeş çıkar:',
        math: '\\omega^2 = \\frac{1}{L_0 C_p} + \\frac{4}{L_0 C_s}\\sin^2\\!\\left(\\frac{ka}{2}\\right)'
      },
    ],
    sceneMode: 'discrete-lattice',
    abstractTab: 'dispersion',
    presetParams: { numBeads: 8, modeN: 2 },
    observe: 'Frekansın ω_alt = 1/√(L₀C_p) değerinin altına inemediğini (yüksek geçiren filtre karakteri) inceleyin.',
    finalBoxed: '\\omega(k) = \\sqrt{\\frac{1}{L_0 C_p} + \\frac{4}{L_0 C_s}\\sin^2\\left(\\frac{ka}{2}\\right)}',
    check: 'C_s → ∞ (yaylar sonsuz sert) limitinde tüm devre tek bir rezonatör gibi davranır.'
  },
  {
    num: '2.25',
    title: 'Çiftlenimli Sarkaçlarda Sürekli Sınıra Geçiş ve Klein-Gordon Dalga Denklemi',
    page: 'Sayfa 65',
    home: false,
    diff: 'İleri Sentez',
    tags: ['Klein-Gordon', 'Plazma Dalgaları', 'Sürekli Limit', 'Cutoff'],
    statement: 'Problem 2.23\'teki çiftlenimli sarkaç hareket denkleminde sarkaçlar arası uzaklık a → 0 sürekli sınırına gidildiğinde, denklemin ∂²ψ/∂t² = -ω₀² ψ + v₀² ∂²ψ/∂z² biçiminde bir Klein-Gordon dalga denklemine dönüştüğünü gösteriniz. Bu denklemin iyonosferdeki plazma elektromanyetik dalgaları ile olan özdeşliğini açıklayınız.',
    givenLatex: '\\frac{d^2\\psi_n}{dt^2} = -\\omega_0^2\\psi_n + \\frac{K a^2}{M}\\frac{\\psi_{n+1} - 2\\psi_n + \\psi_{n-1}}{a^2}, \\quad v_0^2 = \\lim_{a\\to 0} \\frac{K a^2}{M}',
    targetLatex: '\\frac{\\partial^2\\psi}{\\partial t^2} = -\\omega_0^2 \\psi + v_0^2 \\frac{\\partial^2\\psi}{\\partial z^2} \\implies \\omega^2(k) = \\omega_0^2 + v_0^2 k^2',
    principle: 'Klein-Gordon denklemi hem dalga yayılmasını (v₀² ∂²ψ/∂z²) hem de yerel geri çağırıcı potansiyeli (-ω₀² ψ) içerir. ω < ω₀ frekanslarındaki dalgalar üstel olarak sönümlenir (evanescent waves); bu durum iyonosferin radyo dalgalarını yansıtma prensibidir.',
    startQ: 'a → 0 limitinde (ψ_{n+1} - 2ψ_n + ψ_{n-1}) / a² terimi neye dönüşür?',
    optCorrect: '\\lim_{a\\to 0} \\frac{\\psi(z+a) - 2\\psi(z) + \\psi(z-a)}{a^2} = \\frac{\\partial^2\\psi}{\\partial z^2}',
    optWrong1: '\\frac{\\partial\\psi}{\\partial z}',
    optWrong2: '\\frac{\\partial^3\\psi}{\\partial z^3}',
    steps: [
      {
        title: 'Sürekli Türev Limitinin Alınması',
        hint: 'İkinci farkın Taylor açılımını a²\'ye bölün.',
        text: 'a → 0 iken z = na sürekli konum koordinatı haline gelir:',
        math: '\\frac{\\psi_{n+1} - 2\\psi_n + \\psi_{n-1}}{a^2} \\to \\frac{\\partial^2\\psi}{\\partial z^2}, \\qquad v_0^2 = \\frac{K a}{M/a} = \\frac{K_0 a}{\\rho_0}',
        trick: 'trick-taylor'
      },
      {
        title: 'Sürekli Dispersiyon Bağıntısı ve Plazma Analojisi',
        hint: 'ψ(z,t) = e^{i(kz - ωt)} düzlem dalga çözümünü koyun.',
        text: 'Dalga denklemine konulduğunda ünlü Klein-Gordon / Plazma dispersiyonu çıkar:',
        math: '-\\omega^2 = -\\omega_0^2 - v_0^2 k^2 \\implies \\omega^2 = \\omega_0^2 + v_0^2 k^2'
      },
    ],
    sceneMode: 'continuous-dx',
    abstractTab: 'dispersion',
    presetParams: { modeN: 2, showCurvatureVectors: 1 },
    observe: 'ω(k) eğrisinin k = 0\'da ω₀\'dan başlayıp yukarı doğru hiperbolik olarak açıldığını inceleyin.',
    finalBoxed: '\\frac{\\partial^2\\psi}{\\partial t^2} = -\\omega_0^2 \\psi + v_0^2 \\frac{\\partial^2\\psi}{\\partial z^2} \\implies \\omega(k) = \\sqrt{\\omega_0^2 + v_0^2 k^2}',
    check: 'Özel görelilikteki E² = (mc²)² + (pc)² bağıntısı ħω ve ħk ile tam olarak bu dispersiyon formülüdür!'
  },
  {
    num: '2.26',
    title: 'Sürekli Bir İpin Öztitreşimleri: Sınır Koşulları ve Fourier Eşdeğerliği',
    page: 'Sayfa 66',
    home: false,
    diff: 'Vize Klasik',
    tags: ['Fourier Eşdeğerliği', 'Sınır Koşulları', 'Duran Dalgalar', 'Çeyrek Dalga'],
    statement: 'Aşağıdaki üç sınır koşuluna uyan f(z) fonksiyonlarının Fourier serisi açılımlarını hem (a) duran dalga kipleri (fiziksel yöntem), hem de (b) tek/çift periyodik uzantı (Fourier analizi yöntemi) ile kanıtlayınız:\n(i) z = 0\'da f(0) = 0 (sabit) ve z = L\'de f\'(L) = 0 (serbest) için: f(z) = \sum_{n tek} A_n \sin(n k_1 z), \quad k_1 L = \pi/2.\n(ii) z = 0\'da f\'(0) = 0 ve z = L\'de f\'(L) = 0 (iki ucu serbest) için: f(z) = B_0 + \sum_{n=1}^\infty B_n \cos(n k_1 z), \quad k_1 L = \pi.\n(iii) z = 0\'da f\'(0) = 0 (serbest) ve z = L\'de f(L) = 0 (sabit) için: f(z) = \sum_{n tek} B_n \cos(n k_1 z), \quad k_1 L = \pi/2.',
    givenLatex: '(i) \\; f(0)=0, f\'(L)=0; \\quad (ii) \\; f\'(0)=0, f\'(L)=0; \\quad (iii) \\; f\'(0)=0, f(L)=0',
    targetLatex: '(i) \\; k_n = \\frac{(2n-1)\\pi}{2L}, \\quad (ii) \\; k_n = \\frac{n\\pi}{L}, \\quad (iii) \\; k_n = \\frac{(2n-1)\\pi}{2L}',
    principle: 'Fiziksel duran dalga çözümü ψ(z) = C sin(kz) + D cos(kz)\'dir. z=0\'da sabitlik (f=0) kosinüsü yok eder (D=0); z=0\'da serbestlik (f\'=0) sinüsü yok eder (C=0). İkinci sınır koşulu ise dalga sayılarını kuantize eder ve Fourier serisiyle tam örtüşür.',
    startQ: 'z = 0\'da sabit (f(0) = 0) ve z = L\'de serbest (f\'(L) = 0) olan bir ipte k dalga sayısı hangi şartı sağlamalıdır?',
    optCorrect: '\\cos(kL) = 0 \\implies k_n L = \\frac{(2n-1)\\pi}{2} = \\frac{\\pi}{2}, \\frac{3\\pi}{2}, \\frac{5\\pi}{2}, \\dots \\quad (n=1, 2, 3, \\dots)',
    optWrong1: '\\sin(kL) = 0 \\implies k_n L = n\\pi',
    optWrong2: '\\cos(kL) = 1 \\implies k_n L = 2n\\pi',
    steps: [
      {
        title: '(i) Sabit-Serbest Uç Sınır Koşulunun Türetimi',
        hint: 'f(z) = C sin(kz) alıp f\'(L) = k C cos(kL) = 0 şartını inceleyin.',
        text: 'f(0) = 0 kosinüs terimini sıfırlar (D = 0). z = L\'de türevin sıfır olması cos(kL) = 0 gerektirir:',
        math: 'k_n L = \\left(n - \\frac{1}{2}\\right)\\pi = \\frac{(2n-1)\\pi}{2} \\implies k_1 L = \\frac{\\pi}{2}, \\quad k_n = (2n-1)k_1 \\quad (n=1, 2, 3, \\dots)',
        trick: 'trick-separation'
      },
      {
        title: '(ii) İki Ucu Serbest Sınır Koşulunun Türetimi',
        hint: 'f(z) = D cos(kz) alıp f\'(L) = -k D sin(kL) = 0 şartını inceleyin.',
        text: 'f\'(0) = 0 sinüs terimini sıfırlar (C = 0). z = L\'de türevin sıfır olması sin(kL) = 0 verir:',
        math: 'k_n L = n\\pi \\implies k_1 L = \\pi, \\quad f(z) = B_0 + \\sum_{n=1}^\\infty B_n \\cos\\!\\left(\\frac{n\\pi z}{L}\\right)',
        trick: 'trick-orthogonality'
      },
      {
        title: '(iii) Serbest-Sabit Uç Sınır Koşulunun Türetimi',
        hint: 'f(z) = D cos(kz) alıp f(L) = D cos(kL) = 0 şartını uygulayın.',
        text: 'f\'(0) = 0 nedeniyle çözüm kosinüstür. z = L\'de f(L) = 0 şartı cos(kL) = 0 verir:',
        math: 'k_n L = \\frac{(2n-1)\\pi}{2} \\implies f(z) = \\sum_{n=1,3,5,\\dots} B_n \\cos\\!\\left(\\frac{n\\pi z}{2L}\\right)'
      },
    ],
    sceneMode: 'standing-modes',
    abstractTab: 'fourier-spectrum',
    presetParams: { modeN: 1, boundaryCondition: 1 },
    observe: 'Sağ panelde \'Sabit-Serbest\' sınır seçildiğinde serbest uçtaki halkanın karın noktası oluşturduğunu ve tek harmoniklerin seriyi kurduğunu doğrulayın.',
    finalBoxed: 'f_{(i)}(z) = \\sum_{n=1,3,5,\\dots} A_n \\sin\\left(\\frac{n\\pi z}{2L}\\right), \\qquad f_{(ii)}(z) = B_0 + \\sum_{n=1}^\\infty B_n \\cos\\left(\\frac{n\\pi z}{L}\\right)',
    check: 'Periyodik Fourier yöntemiyle fonksiyon [-L, L] aralığına tek veya çift uzatıldığında tam olarak bu seriler elde edilir.'
  },
  {
    num: '2.27',
    title: 'Periyodlu Olarak Tekrarlanan Kare Atmanın Fourier Analizi ve Belirsizlik İlkesi',
    page: 'Sayfa 66',
    home: false,
    diff: 'İleri Sentez',
    tags: ['Kare Atma', 'Fourier Serisi', 'Belirsizlik İlkesi', 'El Çırpma'],
    statement: 'T₁ periyoduyla tekrarlanan, süresi Δt olan el çırpma sesinin ürettiği F(t) kare basınç atmasının Fourier serisini çıkarınız. (a) Zaman orijinini uygun seçerek yalnız kosinüs terimlerinin göründüğünü kanıtlayınız. (b) B₀ = Δt/T₁ ve B_n = (2 / nπ) sin(nπ ν₁ Δt) olduğunu türetiniz. (c) Spektrumdaki baskın frekansların genişliği Δν ile atma süresi Δt arasındaki Δν · Δt ≈ 1 belirsizlik bağıntısını kanıtlayınız.',
    givenLatex: 'F(t) = \\begin{cases} +1, & -\\Delta t / 2 < t < +\\Delta t / 2 \\\\ 0, & \\text{kalan aralık} \\end{cases}, \\qquad F(t + T_1) = F(t)',
    targetLatex: 'B_n = \\frac{2}{n\\pi}\\sin(n\\pi \\nu_1 \\Delta t) \\implies \\nu_{\\text{max}} \\approx \\frac{1}{\\Delta t} \\implies \\Delta\\nu \\cdot \\Delta t \\approx 1',
    principle: 'Zaman ekseninde dar olan bir atma (küçük Δt), frekans uzayında çok geniş bir spektruma (büyük Δν) yayılmak zorundadır. Bu klasik dalga özelliği, kuantum mekaniğindeki Heisenberg belirsizlik ilkesinin doğrudan kökenidir.',
    startQ: 't = 0 anı atmanın tam merkezine konduğunda F(t) fonksiyonu çift mi tek mi olur?',
    optCorrect: 'F(-t) = F(t) \\implies \\text{Çift fonksiyondur, bu nedenle tüm sinüs katsayıları } A_n = 0 \\text{ olur.}',
    optWrong1: 'F(-t) = -F(t) \\implies \\text{Tek fonksiyondur.}',
    optWrong2: '\\text{Ne tek ne çifttir.}',
    steps: [
      {
        title: 'B₀ Ortalama Değer İntegrali',
        hint: 'B₀ = (1/T₁) ∫ F(t) dt integralini [-Δt/2, Δt/2] üzerinden hesaplayın.',
        text: 'B₀ fonksiyonun bir periyottaki zaman ortalamasıdır:',
        math: 'B_0 = \\frac{1}{T_1}\\int_{-\\Delta t/2}^{+\\Delta t/2} (1) dt = \\frac{\\Delta t}{T_1} = \\nu_1 \\Delta t'
      },
      {
        title: 'B_n Fourier Katsayılarının İntegrali',
        hint: 'B_n = (2/T₁) ∫ cos(nω₁ t) dt integralini alın.',
        text: 'Kosinüs integralinden doğrudan sinc fonksiyonu düşer:',
        math: 'B_n = \\frac{2}{T_1}\\int_{-\\Delta t/2}^{+\\Delta t/2} \\cos(n\\omega_1 t) dt = \\frac{2}{n\\omega_1 T_1}\\left[ 2\\sin\\!\\left(n\\omega_1 \\frac{\\Delta t}{2}\\right) \\right] = \\frac{2}{n\\pi}\\sin(n\\pi \\nu_1 \\Delta t)',
        trick: 'trick-orthogonality'
      },
      {
        title: 'İlk Sıfır Noktası ve Frekans Şerit Genişliği (Δν · Δt ≈ 1)',
        hint: 'B_n katsayısının ilk sıfır olduğu n değerini bulun.',
        text: 'B_n katsayısı nπ ν₁ Δt = π olduğunda ilk kez sıfırlanır; bu frekans bandın sınırıdır:',
        math: 'n_{\\text{ilk sıfır}} \\nu_1 \\Delta t = 1 \\implies \\nu_{\\text{max}} = n\\nu_1 = \\frac{1}{\\Delta t} \\implies \\Delta\\nu \\cdot \\Delta t \\approx 1'
      },
    ],
    sceneMode: 'plucked-fourier',
    abstractTab: 'fourier-spectrum',
    presetParams: { pluckPosRatio: 0.5, fourierMaxN: 9 },
    observe: 'Atma daraldıkça Fourier spektrumundaki barların çok daha yüksek n değerlerine kadar uzandığını izleyin.',
    finalBoxed: 'B_n = \\frac{2}{n\\pi}\\sin(n\\pi \\nu_1 \\Delta t), \\qquad \\Delta\\nu \\cdot \\Delta t \\approx 1',
    check: 'Tek bir darbe (T₁ → ∞) limitinde Fourier serisi Fourier integraline dönüşür ve spektrum sürekli sinc(ωΔt/2) olur.'
  },
  {
    num: '2.28',
    title: 'Sığ-Suda Testere Dişi Duran Dalgalar ve Çalkantı Kipi',
    page: 'Sayfa 66',
    home: true,
    diff: 'Temel Türetim',
    tags: ['Sığ Su Dalgası', 'Çalkantı Kipi', 'Ev Deneyi', 'Yerçekimi Dalgası'],
    statement: 'Derinliği h olan dikdörtgen bir kapta suyun çalkantı kipi (sloshing mode) inceleniyor. Taban ve yüzeydeki su moleküllerinin yatay genliklerinin neredeyse eşit olduğu sığ-su limitinde (h ≪ λ) dalga yayılma hızının v = √(gh) olduğunu ve L boyundaki kapta temel frekansın ν₁ = √(gh) / (2L) olduğunu türetiniz.',
    givenLatex: 'h \\ll \\lambda, \\qquad \\text{Hidrostatik basınç: } P(x, z, t) = \\rho g [h + \\eta(x,t) - z]',
    targetLatex: 'v = \\sqrt{gh} \\implies \\nu_1 = \\frac{\\sqrt{gh}}{2L} \\quad (\\lambda_1 = 2L)',
    principle: 'Sığ su dalgalarında suyun düşey ivmesi yerçekiminin yanında ihmal edilir ve basınç doğrudan su yüksekliğiyle orantılıdır. Yükseklik eğimi ∂η/∂x yatay bir net kuvvet oluşturur ve v² = gh hızında enine/boyuna hibrit yerçekimi dalgası yayılır.',
    startQ: 'Su derinliği h, yerçekimi ivmesi g iken sığ su dalgalarının yayılma hızı formülü nedir?',
    optCorrect: 'v = \\sqrt{gh}',
    optWrong1: 'v = \\sqrt{\\frac{g}{h}}',
    optWrong2: 'v = g h',
    steps: [
      {
        title: 'Yatay Basınç Gradyanı ve Euler Hareketi',
        hint: 'Yatay kuvvet F_x = -∂P/∂x = -ρ g ∂η/∂x ifadesini yazın.',
        text: 'Sığ suda tüm derinlik boyunca su parçacıkları aynı yatay ivmeyle hareket eder:',
        math: '\\frac{\\partial u}{\\partial t} = -\\frac{1}{\\rho}\\frac{\\partial P}{\\partial x} = -g \\frac{\\partial\\eta}{\\partial x}',
        trick: 'trick-taylor'
      },
      {
        title: 'Süreklilik (Kütle Korunumu) ve Dalga Denklemi',
        hint: '∂η/∂t = -h ∂u/∂x süreklilik denklemini zamana göre türetin.',
        text: 'Süreklilik denklemi ile momentum denklemi birleştirildiğinde standart 1D dalga denklemi elde edilir:',
        math: '\\frac{\\partial^2\\eta}{\\partial t^2} = -h \\frac{\\partial}{\\partial x}\\left(\\frac{\\partial u}{\\partial t}\\right) = gh \\frac{\\partial^2\\eta}{\\partial x^2} \\implies v^2 = gh'
      },
    ],
    sceneMode: 'standing-modes',
    abstractTab: 'dispersion',
    presetParams: { modeN: 1, boundaryCondition: 0 },
    observe: 'Kabın iki ucunda su seviyesinin maksimum yükselip alçaldığını (karın), tam ortada ise sıfır seviyede kaldığını (düğüm) inceleyin.',
    finalBoxed: 'v = \\sqrt{gh}, \\qquad \\nu_1 = \\frac{\\sqrt{gh}}{2L}',
    check: 'Birim kontrolü: [√(gh)] = √[(m/s²) · m] = m/s.'
  },
  {
    num: '2.29',
    title: 'Bakışımlı Testere Dişi Fonksiyonu İçin Fourier Analizi',
    page: 'Sayfa 67',
    home: false,
    diff: 'Vize Klasik',
    tags: ['Testere Dişi', 'Fourier Serisi', 'Simetrik Dalga'],
    statement: 'Her dişinin ön ve arka yüz eğimleri eşit (bakışımlı) olan, diş uzunluğu (periyodu) λ₁ ve tepe genliği A olan periyodik bir testere dişi fonksiyonunun tepe noktası z = 0\'a yerleştirildiğinde Fourier serisinin f(z) = (8A / π²) [cos(k₁z) + (1/9) cos(3k₁z) + (1/25) cos(5k₁z) + ...] olduğunu kanıtlayınız.',
    givenLatex: 'f(-z) = f(z), \\qquad f(z) = A\\left(1 - \\frac{4|z|}{\\lambda_1}\\right) \\quad \\text{için } |z| \\le \\frac{\\lambda_1}{2}',
    targetLatex: 'f(z) = \\frac{8A}{\\pi^2}\\sum_{m=0}^\\infty \\frac{1}{(2m+1)^2}\\cos\\!\\left( (2m+1)k_1 z \\right) \\quad \\left(k_1 = \\frac{2\\pi}{\\lambda_1}\\right)',
    principle: 'z = 0 tepe noktası çift simetriye sahiptir (f(-z) = f(z)), bu nedenle tüm sinüs terimleri sıfırlanır. Ayrıca z = λ₁/4 noktasına göre antisimetrik olduğu için çift kosinüs harmonikleri de yok olur; geriye sadece (2m+1) tek kosinüsler kalır.',
    startQ: 'Çift simetriye sahip f(-z) = f(z) testere dişi dalgasının Fourier katsayıları B_n integrali nasıl basitleşir?',
    optCorrect: 'B_n = \\frac{4}{\\lambda_1}\\int_0^{\\lambda_1/2} f(z)\\cos(n k_1 z) dz',
    optWrong1: 'B_n = \\frac{2}{\\lambda_1}\\int_0^{\\lambda_1/2} f(z)\\sin(n k_1 z) dz',
    optWrong2: 'B_n = 0',
    steps: [
      {
        title: 'Doğrusal Eğim İntegralinin Kurulması',
        hint: '[0, λ₁/2] aralığında f(z) = A(1 - 4z/λ₁) yazın.',
        text: 'İntegrali kısmi integrasyon ile hesaplayalım:',
        math: 'B_n = \\frac{4A}{\\lambda_1}\\int_0^{\\lambda_1/2} \\left(1 - \\frac{4z}{\\lambda_1}\\right)\\cos\\!\\left(\\frac{2n\\pi z}{\\lambda_1}\\right) dz',
        trick: 'trick-orthogonality'
      },
      {
        title: 'Kısmi İntegrasyon ve Katsayıların Bulunması',
        hint: '∫ z cos(bz) dz = (z/b) sin(bz) + (1/b²) cos(bz) formülünü uygulayın.',
        text: 'Sınırlar yerine konulduğunda n çift için sıfır, n tek için 1/n² bağıntısı çıkar:',
        math: 'B_n = \\frac{4A}{\\lambda_1} \\left[ \\frac{4}{\\lambda_1}\\frac{\\lambda_1^2}{4n^2 \\pi^2}(1 - \\cos(n\\pi)) \\right] = \\frac{8A}{\\pi^2 n^2} \\quad (n = 1, 3, 5, \\dots)'
      },
    ],
    sceneMode: 'plucked-fourier',
    abstractTab: 'fourier-spectrum',
    presetParams: { pluckPosRatio: 0.5, fourierMaxN: 7 },
    observe: '1/n² hızlı sönümlemesi nedeniyle ilk 3 harmoniğin bile köşeli testere dişini mükemmele yakın temsil ettiğini görün.',
    finalBoxed: 'f(z) = \\frac{8A}{\\pi^2}\\left[ \\cos(k_1 z) + \\frac{1}{9}\\cos(3k_1 z) + \\frac{1}{25}\\cos(5k_1 z) + \\dots \\right]',
    check: 'z = 0\'da f(0) = (8A/π²)(1 + 1/9 + 1/25 + ...) = (8A/π²)(π²/8) = A tam tepe genliğini verir!'
  },
  {
    num: '2.30',
    title: 'Dairesel Yüzey Gerilim Duran Dalgaları (Ev Deneyi)',
    page: 'Sayfa 67',
    home: true,
    diff: 'Temel Türetim',
    tags: ['Yüzey Gerilimi', 'Kılcal Dalgalar', 'Ev Deneyi', 'Anormal Dispersiyon'],
    statement: 'Ağzına kadar su dolu bir bardağa hafifçe vurulduğunda su yüzeyinde gözlenen dairesel duran dalgaların (kapiler dalgalar) geri çağırıcı kuvveti yerçekimi değil yüzey gerilimidir (T). Kısa dalga boylarında (k ≫ √(ρg/T)) yüzey gerilimi dalgalarının dispersiyon bağıntısının ω² = (T/ρ) k³ ve faz hızının v_faz = √(Tk/ρ) olduğunu türetiniz.',
    givenLatex: 'P_{\\text{Laplace}} = -T\\frac{\\partial^2\\eta}{\\partial x^2}, \\qquad \\rho\\frac{\\partial^2\\eta}{\\partial t^2} = -\\frac{\\partial P}{\\partial z}_{z=0} = -k P_{\\text{Laplace}}',
    targetLatex: '\\omega^2 = \\frac{T}{\\rho}k^3 \\implies v_{\\text{faz}} = \\sqrt{\\frac{T k}{\\rho}} = \\sqrt{\\frac{2\\pi T}{\\rho \\lambda}}',
    principle: 'Yüzey gerilimi bükülen su yüzeyini düzleştirmeye çalışır ve geri çağırıcı Laplace basıncı eğrilikle (∂²η/∂x² ~ -k²η) orantılıdır. Bu nedenle dalga sayısı arttıkça (dalga boyu kısaldıkça) frekans k² ile değil k^(3/2) ile artar; kısa dalgalar uzun dalgalardan DAHA HIZLI yayılır (anormal dispersiyon).',
    startQ: 'Yüzey gerilimi dalgalarında dalga boyu λ kısaldıkça faz hızı v_faz nasıl değişir?',
    optCorrect: 'v_{\\text{faz}} \\propto \\frac{1}{\\sqrt{\\lambda}} \\implies \\text{Daha kısa dalgalar DAHA HIZLI ilerler (anormal dispersiyon).}',
    optWrong1: 'v_{\\text{faz}} \\propto \\sqrt{\\lambda}',
    optWrong2: 'v_{\\text{faz}} = \\text{sabit}',
    steps: [
      {
        title: 'Laplace Eğrilik Basıncı',
        hint: 'Yüzey geriliminden kaynaklanan basınç farkı ΔP = -T ∂²η/∂x²\'dir.',
        text: 'η(x,t) = A cos(kx - ωt) dalgası için yüzey eğriliği:',
        math: '\\Delta P = -T \\frac{\\partial^2\\eta}{\\partial x^2} = +T k^2 \\eta',
        trick: 'trick-taylor'
      },
      {
        title: 'Hidrodinamik Dispersiyonun Çıkarılması',
        hint: 'Derin su potansiyel akışında yüzeydeki basınç gradyanı k ile ölçeklenir.',
        text: 'Sıvı yüzeyindeki düşey hareket denklemi ρ ω² η = k ΔP = T k³ η verir:',
        math: '\\rho \\omega^2 = T k^3 \\implies \\omega^2 = \\frac{T}{\\rho}k^3 \\implies v_{\\text{faz}} = \\frac{\\omega}{k} = \\sqrt{\\frac{T k}{\\rho}}'
      },
    ],
    sceneMode: 'continuous-dx',
    abstractTab: 'dispersion',
    presetParams: { modeN: 3, showCurvatureVectors: 1 },
    observe: 'Su bardağına tıklandığında merkezde oluşan ince eşmerkezli halkaların hızla dışarı doğru yayıldığını görün.',
    finalBoxed: '\\omega^2 = \\frac{T}{\\rho}k^3, \\qquad v_{\\text{faz}} = \\sqrt{\\frac{T k}{\\rho}}',
    check: 'Birim kontrolü: [T k³ / ρ] = [(N/m) · m⁻³ / (kg/m³)] = [N/(kg·m)] = s⁻²; karekökü rad/s.'
  },
  {
    num: '2.31',
    title: 'Bir Boncuklu İpin Serbest Ucundaki Sınır Koşulları ve Etkin Tel Boyu',
    page: 'Sayfa 67',
    home: false,
    diff: 'İleri Sentez',
    tags: ['Ayrık Serbest Uç', 'Kütlesiz Halka', 'Etkin Boy', 'Modeller'],
    statement: 'Bir boncuklu ipin serbest ucunu modellemek için kullanılan dört farklı yaklaşımı düşününüz:\n(a) Kütlesiz bir halka sürtünmesiz çubuk üzerinde kayar (ψ_{N+1} = ψ_N).\n(b) Son parçanın uzunluğu tam aralık a değil a/2\'dir.\n(c) Son boncuğun kütlesi M değil M/2\'dir.\n(d) Son boncuktan sonra gerilim T₀ ile çekilen kütlesiz hayali bir boncuk vardır.\nBu modellerin hepsinde sürekli sınıra gidildiğinde serbest uç sınır koşulunun (∂ψ/∂x)|_{x=L} = 0 olduğunu ve etkin ip boyu L_eff\'i türetiniz.',
    givenLatex: '\\psi_{N+1} = \\psi_N \\iff \\frac{\\psi_{N+1} - \\psi_N}{a} = 0',
    targetLatex: '\\lim_{a\\to 0} \\frac{\\psi_{N+1} - \\psi_N}{a} = \\left.\\frac{\\partial\\psi}{\\partial x}\\right|_{x=L} = 0, \\qquad L_{\\text{eff}} = \\left(N + \\frac{1}{2}\\right)a',
    principle: 'Serbest uçta net enine kuvvet uygulayacak bir kütle bulunmadığından, son bağlama parçasının eğimi daima sıfır olmak zorundadır. Kesikli modelde ψ_{N+1} = ψ_N şartı, sürekli modelde ∂ψ/∂x = 0 Neumann şartına denk gelir.',
    startQ: 'ψ_{N+1} = ψ_N şartı a → 0 limitinde ne anlama gelir?',
    optCorrect: '\\left.\\frac{\\partial\\psi}{\\partial x}\\right|_{x=L} = 0 \\quad (\\text{Uç noktada eğim sıfırdır, yani karın noktasıdır})',
    optWrong1: '\\psi(L) = 0',
    optWrong2: '\\left.\\frac{\\partial^2\\psi}{\\partial x^2}\\right|_L = 0',
    steps: [
      {
        title: 'Ayrık Kuvvet Dengesinden Eğim Şartı',
        hint: 'Son boncuğa sağdan etkiyen kuvvet sıfır olmalıdır.',
        text: 'Son halkanın kütlesi sıfır olduğundan F_y = (T₀/a)(ψ_{N+1} - ψ_N) = 0 olmalıdır:',
        math: '\\psi_{N+1} - \\psi_N = 0 \\implies \\frac{\\psi_{N+1} - \\psi_N}{a} = 0 \\xrightarrow{a\\to 0} \\left.\\frac{\\partial\\psi}{\\partial x}\\right|_{x=L} = 0',
        trick: 'trick-separation'
      },
      {
        title: 'Etkin Tel Boyu L_eff ve Kuantizasyon',
        hint: 'Son boncuk L = Na noktasındadır; eğimin sıfır olduğu nokta (N + 1/2)a\'dır.',
        text: 'ψ_{N+1} = ψ_N şartı kosinüs eğrisinin tepe noktasının N ve N+1\'in tam ortasına (N + 1/2)a gelmesini gerektirir:',
        math: 'L_{\\text{eff}} = \\left(N + \\frac{1}{2}\\right)a \\implies k_m = \\frac{(2m-1)\\pi}{2L_{\\text{eff}}}'
      },
    ],
    sceneMode: 'discrete-lattice',
    abstractTab: 'dispersion',
    presetParams: { numBeads: 6, modeN: 1 },
    observe: 'Son boncuk ile hayali komşusu arasındaki yatay teğeti 3B örgü sahnesinde doğrulayın.',
    finalBoxed: '\\left.\\frac{\\partial\\psi}{\\partial x}\\right|_{x=L} = 0, \\qquad L_{\\text{eff}} = \\left(N + \\frac{1}{2}\\right)a',
    check: 'N büyük olduğunda L_eff ≈ Na = L sürekli ip boyuna yakınsar.'
  },
  {
    num: '2.32',
    title: 'Çekiçle Ortasından Vurulan İpte İlk Üç Harmoniğin Genliği',
    page: 'Sayfa 68',
    home: false,
    diff: 'Vize Klasik',
    tags: ['Piyano Çekici', 'Darbe Uyarımı', 'Fourier Hız Analizi'],
    statement: 'L boyunda, gerilimi T ve toplam kütlesi M = ρ₀ L olan iki ucu sabit bir ipin tam ortasında (x = L/2), a uzunluğundaki küçük bir parçasına piyano çekiciyle vurularak t = 0 anında v₀ enine hızı kazandırılıyor (t = 0\'da konum sıfır: ψ(x,0) = 0). Uyarılan ilk üç harmoniğin (n = 1, 2, 3) Fourier genliklerini A_n türetiniz.',
    givenLatex: '\\psi(x,0) = 0, \\qquad \\left.\\frac{\\partial\\psi}{\\partial t}\\right|_{t=0} = \\begin{cases} v_0, & |x - L/2| \\le a/2 \\\\ 0, & \\text{kalan yerler} \\end{cases}',
    targetLatex: 'A_n = \\frac{2 v_0 a}{\\pi n v}\\sin\\!\\left(\\frac{n\\pi}{2}\\right) \\implies A_1 = \\frac{2 v_0 a}{\\pi v}, \\quad A_2 = 0, \\quad A_3 = -\\frac{2 v_0 a}{3\\pi v}',
    principle: 'Başlangıç konumu sıfır iken Fourier katsayıları başlangıç hızı v(x,0) integralinden çekilir: A_n = (2 / nπ v) ∫ v(x,0) sin(nπx/L) dx. Çekiç tam ortaya vurduğu için simetri gereği çift harmonikler (n=2, 4...) uyarılmaz.',
    startQ: 'ψ(x,0) = 0 ve ∂ψ/∂t|_{t=0} = v(x) başlangıç koşulunda genel dalga çözümü nasıldır?',
    optCorrect: '\\psi(x,t) = \\sum_{n=1}^\\infty A_n \\sin\\!\\left(\\frac{n\\pi x}{L}\\right) \\sin(\\omega_n t), \\quad \\text{burada } \\omega_n A_n = \\frac{2}{L}\\int_0^L v(x)\\sin\\!\\left(\\frac{n\\pi x}{L}\\right) dx',
    optWrong1: '\\psi(x,t) = \\sum A_n \\cos(\\omega_n t)',
    optWrong2: '\\psi(x,t) = A_1 \\sin(kx - \\omega t)',
    steps: [
      {
        title: 'Hız Dağılımından Fourier Katsayı İntegrali',
        hint: 'v(x) sadece [L/2 - a/2, L/2 + a/2] aralığında v₀ değerindedir; a ≪ L olduğundan sinüs sabittir.',
        text: 'Darbe genişliği a çok küçük olduğundan integral doğrudan dikdörtgen alanına eşittir:',
        math: '\\omega_n A_n = \\frac{2}{L}\\int_{L/2 - a/2}^{L/2 + a/2} v_0 \\sin\\!\\left(\\frac{n\\pi x}{L}\\right) dx \\approx \\frac{2 v_0 a}{L} \\sin\\!\\left(\\frac{n\\pi}{2}\\right)',
        trick: 'trick-orthogonality'
      },
      {
        title: 'İlk Üç Harmoniğin Genlikleri',
        hint: 'ω_n = nπ v / L değerine bölerek A_n\'yi bulun.',
        text: 'L sadeleşir ve genlikler 1/n ile orantılı olarak çıkar:',
        math: 'A_n = \\frac{2 v_0 a}{\\pi n v} \\sin\\!\\left(\\frac{n\\pi}{2}\\right) \\implies A_1 = \\frac{2 v_0 a}{\\pi v}, \\quad A_2 = 0, \\quad A_3 = -\\frac{2 v_0 a}{3\\pi v}'
      },
    ],
    sceneMode: 'plucked-fourier',
    abstractTab: 'fourier-spectrum',
    presetParams: { pluckPosRatio: 0.5, fourierMaxN: 5 },
    observe: 'A₂ = 0 olduğunu ve A₃\'ün A₁\'in üçte biri genlikte zıt fazda başladığını spektrumda doğrulayın.',
    finalBoxed: 'A_1 = \\frac{2 v_0 a}{\\pi v}, \\qquad A_2 = 0, \\qquad A_3 = -\\frac{2 v_0 a}{3\\pi v}',
    check: 'Piyano çekiçlerinin teli çekmek yerine vurarak uyarması üst harmoniklerin 1/n ile daha zengin tınlamasını sağlar.'
  }
];

export const CHAPTER_2_PROBLEMS: ProofCoachProblem[] = CH2_SEEDS.map((s) => ({
  id: `prob-${s.num.replace('.', '-')}`,
  chapter: 2,
  number: `Problem ${s.num}`,
  title: s.title,
  bookPage: s.page,
  difficulty: s.diff,
  isHomeExperiment: s.home,
  tags: s.tags,
  statement: s.statement,
  givenLatex: s.givenLatex,
  targetLatex: s.targetLatex,
  stage1Setup: {
    diagramDescription: `${s.title} için fiziksel sınır koşulları ve koordinat sistemi kurulumu.`,
    physicalPrinciple: s.principle,
    startingEquationQuestion: s.startQ,
    options: [
      {
        latex: s.optCorrect,
        explanation: 'Doğru başlangıç denklemi! Fiziksel ilkeleri ve sınır koşullarını tam olarak temsil eder.',
        isCorrect: true
      },
      {
        latex: s.optWrong1,
        explanation: 'Eksik veya hatalı türev mertebesi/işaret.',
        isCorrect: false
      },
      {
        latex: s.optWrong2,
        explanation: 'Boyut veya simetri şartı bu ifadeyle sağlanmıyor.',
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
    description: `${s.num} sonucunun sağ paneldeki 3B Tel/Örgü ve 2B Dispersiyon/Fourier uzayında canlı doğrulanması.`,
    chapter: 2,
    sceneMode: s.sceneMode,
    abstractTab: s.abstractTab,
    presetParams: s.presetParams,
    whatToObserve: s.observe
  },
  stage4ExamSheet: {
    fullAcademicSolutionMarkdown: `**Verilenler & Sınır Koşulları:** $${s.givenLatex}$  \\n**Hedef Bağıntı:** $${s.targetLatex}$  \\n**Fiziksel & Matematiksel İlke:** ${s.principle}`,
    finalBoxedLatex: s.finalBoxed,
    limitAndDimensionCheck: s.check,
    examGradingRubric: [
      'Sınır koşullarının (Sabit, Serbest veya Periyodik) matematiksel olarak doğru yazılması (30p)',
      'Diklik integrali, kısmi integrasyon veya trigonometrik örgü indirgemesinin eksiksiz yapılması (40p)',
      'Özfrekans/katsayı spektrumunun ve fiziksel limitlerin yorumlanması (30p)'
    ]
  }
}));
