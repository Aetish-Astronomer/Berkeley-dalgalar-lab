import { ProofCoachProblem } from '../types/curriculum';

interface RawProblemSeed {
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

const CH1_SEEDS: RawProblemSeed[] = [
  {
    num: '1.1',
    title: 'Çiftlenimli LC Devresinde Normal Kipler',
    page: 'Sayfa 27',
    home: false,
    diff: 'Vize Klasik',
    tags: ['LC Devresi', 'Normal Kipler', 'Elektromekanik Benzeşim'],
    statement: 'İki özdeş L = 10 H bobini ve üç adet özdeş C = 6 μF kondansatörden oluşan çiftlenimli LC devresinin iki normal kip frekansını (ν₁, ν₂) türetiniz.',
    givenLatex: 'L = 10\\text{ H}, \\quad C = C_{12} = 6\\times 10^{-6}\\text{ F}',
    targetLatex: '\\nu_1 = \\frac{1}{2\\pi\\sqrt{LC}}, \\quad \\nu_2 = \\frac{\\sqrt{3}}{2\\pi\\sqrt{LC}}',
    principle: 'Kirchhoff Gerilim Yasası (KVL) ve m ↔ L, k ↔ 1/C elektromekanik dualitesi.',
    startQ: 'Sol ve sağ döngü yükleri Q_a ve Q_b için çiftlenimli diferansiyel denklem sistemi hangisidir?',
    optCorrect: 'L\\ddot{Q}_a + \\frac{1}{C}Q_a + \\frac{1}{C}(Q_a - Q_b) = 0',
    optWrong1: 'L\\ddot{Q}_a + C Q_a + C(Q_a - Q_b) = 0',
    optWrong2: 'L\\dot{Q}_a + \\frac{1}{C}(Q_a + Q_b) = 0',
    steps: [
      {
        title: 'Simetrik Kip (Q_a = Q_b) Frekansı',
        hint: 'Q_a = Q_b olduğunda orta kondansatöre net yük akışı sıfırdır.',
        text: 'Denklemleri taraf tarafa toplarsak (q₁ = Q_a + Q_b) orta kondansatör terimi düşer:',
        math: 'L\\ddot{q}_1 + \\frac{1}{C}q_1 = 0 \\implies \\omega_1 = \\frac{1}{\\sqrt{LC}} \\approx 129.1\\text{ rad/s} \\implies \\nu_1 \\approx 20.55\\text{ Hz}',
        trick: 'trick-determinant'
      },
      {
        title: 'Antisimetrik Kip (Q_a = -Q_b) Frekansı',
        hint: 'Q_a = -Q_b olduğunda orta kondansatör 2Q_a yüküyle dolar.',
        text: 'Denklemleri taraf tarafa çıkarırsak (q₂ = Q_a - Q_b) etkin ters kapasitans 3/C olur:',
        math: 'L\\ddot{q}_2 + \\frac{3}{C}q_2 = 0 \\implies \\omega_2 = \\sqrt{\\frac{3}{LC}} = \\sqrt{3}\\omega_1 \\implies \\nu_2 \\approx 35.6\\text{ Hz}',
        trick: 'trick-determinant'
      }
    ],
    sceneMode: 'coupled-modes',
    abstractTab: 'normal-coords',
    presetParams: { modeSelect: 2, couplingKc: 1.0 },
    observe: 'Kip 1 ve Kip 2 arasındaki √3 ≈ 1.732 frekans oranını ve orta elemanın Kip 2’deki iki kat gerilimini gözlemleyin.',
    finalBoxed: '\\nu_1 \\approx 20.5\\text{ Hz}, \\qquad \\nu_2 = \\sqrt{3}\\nu_1 \\approx 35.6\\text{ Hz}',
    check: '[1/√(LC)] = s⁻¹. C_12 → ∞ (kısa devre) limitinde kipler bağımsızlaşır.'
  },
  {
    num: '1.2',
    title: 'Pikap Tablası ve Sarkaç: Dairesel Hareketin İzdüşümü',
    page: 'Sayfa 27',
    home: true,
    diff: 'Temel Türetim',
    tags: ['Fazör İzdüşümü', 'Basit Sarkaç', 'Ev Deneyi'],
    statement: '45 devir/dakika (rpm) hızla dönen bir pikap tablasının kenarındaki cismin yandan görünüşünün BHH olduğunu gösteriniz ve onunla senkronize salınacak sarkacın boyunu (L) bulunuz.',
    givenLatex: '\\text{RPM} = 45\\text{ dev/dk}, \\quad g = 980\\text{ cm/s}^2',
    targetLatex: 'x(t) = R\\cos(\\omega t), \\quad L = \\frac{g}{\\omega^2} \\approx 44.1\\text{ cm}',
    principle: 'Düzgün dairesel hareketin tek bir eksene dik izdüşümü basit harmonik harekettir.',
    startQ: '45 rpm açısal hızının radyan/saniye cinsinden karşılığı ve sarkaç eşzamanlılık koşulu nedir?',
    optCorrect: '\\omega = 45 \\times \\frac{2\\pi}{60} = 1.5\\pi\\text{ rad/s}, \\quad \\sqrt{\\frac{g}{L}} = \\omega',
    optWrong1: '\\omega = 45 \\times 2\\pi\\text{ rad/s}, \\quad \\sqrt{\\frac{L}{g}} = \\omega',
    optWrong2: '\\omega = \\frac{45}{60}\\text{ rad/s}',
    steps: [
      {
        title: 'Dairesel Fazörün İzdüşümü',
        hint: 'xy düzleminde (R cos ωt, R sin ωt) konumunun x bileşenini alın.',
        text: 'Gözlemci tablayı yandan (y ekseni boyunca) izlediğinde yalnızca x(t) = R cos(ωt) hareketini görür:',
        math: '\\ddot{x}(t) = -\\omega^2 R\\cos(\\omega t) = -\\omega^2 x(t)',
        trick: 'trick-phasor'
      },
      {
        title: 'Sarkaç Boyunun Hesabı',
        hint: 'ω² = g/L bağıntısından L’yi çekin.',
        text: 'ω = 1.5π ≈ 4.712 rad/s değeri yerine konursa:',
        math: 'L = \\frac{g}{\\omega^2} = \\frac{980}{(1.5\\pi)^2} \\approx 44.13\\text{ cm}'
      }
    ],
    sceneMode: 'shm-phasor',
    abstractTab: 'phasor',
    presetParams: { omega0: 2.4, amplitude: 1.2 },
    observe: 'Üstteki 3B fazör helisinin yatay izdüşümünün kütle-yay ve sarkaç konumuyla tam eşzamanlı hareket ettiğini izleyin.',
    finalBoxed: 'L = \\frac{g}{(1.5\\pi)^2} \\approx 44.1\\text{ cm}',
    check: '[g/ω²] = (cm/s²)/(s⁻²) = cm.'
  },
  {
    num: '1.3',
    title: 'Zayıf Çiftlenimli Sarkaçlarda Faz Farkı ve Enerji Akış Yönü',
    page: 'Sayfa 27',
    home: true,
    diff: 'Vize Klasik',
    tags: ['Vuru', 'Faz Farkı', 'Enerji Transferi'],
    statement: 'Zayıf çiftlenimli iki sarkaçta t = 0’da A salınırken B durgundur. t = T_vuru / 4 anında her ikisinin genliği eşittir. Sadece sarkaçların fazına bakarak enerjinin hangi yöne aktığı nasıl anlaşılır?',
    givenLatex: 'x_a(t) = x_0\\cos(\\omega_{\\text{mod}}t)\\cos(\\omega_{\\text{ort}}t), \\quad x_b(t) = x_0\\sin(\\omega_{\\text{mod}}t)\\sin(\\omega_{\\text{ort}}t)',
    targetLatex: '\\Delta\\phi = \\frac{\\pi}{2} \\implies \\text{Geriden gelen (90° faz gecikmeli) sarkaç enerji ALIR.}',
    principle: 'Anlık güç P = F · v bağıntısı: Kuvvet ile hız aynı işaretliyse iş pozitiftir.',
    startQ: 'A sarkacının B sarkacına orta yay üzerinden uyguladığı kuvvet ve B’nin hızı arasındaki faz ilişkisi nedir?',
    optCorrect: 'P_{a\\to b} = K_c x_a \\dot{x}_b > 0 \\quad (x_b \\text{ fazca } x_a\\text{\'dan } 90^\\circ \\text{ gerideyken})',
    optWrong1: 'P_{a\\to b} = K_c x_a x_b',
    optWrong2: '\\text{Genlikler eşit olduğunda enerji akışı durur.}',
    steps: [
      {
        title: 'Taşıyıcı Dalgaların Faz Karşılaştırması',
        hint: 'sin(ω_ort t) = cos(ω_ort t - π/2) özdeşliğini kullanın.',
        text: 'İlk yarı vuru süresince (0 < ω_mod t < π/2) cos(ω_mod t) > 0 ve sin(ω_mod t) > 0’dır. Taşıyıcı terimlerde B sarkacı sin(ω_ort t) = cos(ω_ort t - π/2) ile A’dan 90° geridedir:',
        math: 'v_b(t) = \\dot{x}_b \\approx \\omega_{\\text{ort}} A_b \\cos(\\omega_{\\text{ort}} t) \\propto +x_a(t)',
        trick: 'trick-trig-beats'
      },
      {
        title: 'Orta Yayın B Üzerinde Yaptığı Güç',
        hint: 'B’nin hızı v_b ile A’nın konumu x_a aynı fazdadır!',
        text: 'A’nın B’ye uyguladığı çekme kuvveti +K_c x_a, B’nin hızı v_b ile aynı işaretlidir; dolayısıyla bir periyot ortalamasında A’dan B’ye pozitif güç akar:',
        math: '\\langle P_{a \\to b} \\rangle = K_c \\langle x_a \\dot{x}_b \\rangle = \\frac{1}{2} K_c \\omega_{\\text{ort}} x_0^2 \\sin(\\omega_{\\text{mod}}t)\\cos(\\omega_{\\text{mod}}t) > 0'
      }
    ],
    sceneMode: 'beats-energy',
    abstractTab: 'energy-beats',
    presetParams: { couplingKc: 0.2, omega0: 2.2 },
    observe: 'Enerji akış tüpünün parlaklığının genliklerin eşit olduğu t = T_vuru/4 anında MAKSİMUM olduğuna dikkat edin.',
    finalBoxed: '\\text{Fazca } 90^\\circ \\text{ önde olan sarkaç SÜRÜCÜ (enerji veren), } 90^\\circ \\text{ geride olan SÜRÜLEN (enerji alan) sarkaçtır.}',
    check: 't = T_vuru/2 sonrasında sin(ω_mod t) ve cos(ω_mod t) zıt işaretli olur ve faz önceliği B’ye geçer.'
  },
  {
    num: '1.4',
    title: 'Normal Kipler İçin Seçici Sönüm (Selective Damping) Tasarımı',
    page: 'Sayfa 27',
    home: false,
    diff: 'Vize Klasik',
    tags: ['Normal Kipler', 'Simetri', 'Seçici Sönüm'],
    statement: 'Çiftlenimli iki sarkaç sisteminde (a) Kip 1’e hiç dokunmayıp sadece Kip 2’yi söndüren, (b) Kip 2’ye hiç dokunmayıp sadece Kip 1’i söndüren mekanizmalar tasarlayınız.',
    givenLatex: 'q_1 = x_a + x_b \\text{ (Kip 1)}, \\quad q_2 = x_a - x_b \\text{ (Kip 2)}',
    targetLatex: '(a)\\; F_{\\text{sönüm}} \\propto (\\dot{x}_a - \\dot{x}_b) = \\dot{q}_2, \\qquad (b)\\; F_{\\text{sönüm}} \\propto \\frac{\\dot{x}_a + \\dot{x}_b}{2} = \\frac{1}{2}\\dot{q}_1',
    principle: 'Bir kipin düğüm (hareketsiz) noktasına yerleştirilen sönümleyici o kipi hiç etkilemez.',
    startQ: 'Kip 1’de sıfır olan ve Kip 2’de sıfır olan geometrik büyüklükler hangileridir?',
    optCorrect: '\\text{Kip 1\'de } x_a - x_b = 0 \\text{ (bağıl hız sıfır)}; \\quad \\text{Kip 2\'de } x_{\\text{orta}} = \\frac{x_a+x_b}{2} = 0 \\text{ (orta nokta düğüm)}',
    optWrong1: '\\text{Her iki kipte de orta nokta hareketsizdir.}',
    optWrong2: '\\text{Tavana konan sürtünme sadece Kip 1\'i söndürür.}',
    steps: [
      {
        title: 'Sadece Kip 2’yi Söndürmek',
        hint: 'İki kütle arasına pistonlu bir viskoz sönümleyici (dashpot) bağlayın.',
        text: 'Kütleler arasına bağlanan sönümleyici bağıl hızla (ẋ_a - ẋ_b = q̇₂) orantılı kuvvet üretir. Kip 1’de x_a = x_b olduğu için piston hiç çalışmaz; Kip 2 ise hızla sönümlenir:',
        math: '\\ddot{q}_1 + \\omega_1^2 q_1 = 0, \\qquad \\ddot{q}_2 + 2\\gamma\\dot{q}_2 + \\omega_2^2 q_2 = 0'
      },
      {
        title: 'Sadece Kip 1’i Söndürmek',
        hint: 'Orta yayın tam merkez noktasını (x_m = (x_a+x_b)/2) viskoz sıvıya daldırın.',
        text: 'Kip 2’de orta yayın merkezi hareketsiz bir DÜĞÜM noktasıdır (x_m = 0); dolayısıyla merkeze bağlı sönümleyici Kip 2’ye hiç etki etmez, sadece Kip 1’i söndürür:',
        math: '\\ddot{q}_1 + \\gamma_1\\dot{q}_1 + \\omega_1^2 q_1 = 0, \\qquad \\ddot{q}_2 + \\omega_2^2 q_2 = 0'
      }
    ],
    sceneMode: 'coupled-modes',
    abstractTab: 'normal-coords',
    presetParams: { modeSelect: 2, couplingKc: 0.8 },
    observe: 'Kip 2 seçildiğinde orta yayın tam merkezinin hiç kıpırdamadığını (düğüm noktası) 3B sahnede doğrulayın.',
    finalBoxed: '\\text{Kip 2 Sönümleyici: Kütleler arası bağıl damper} \\;\\;|\\;\\; \\text{Kip 1 Sönümleyici: Orta yay merkez düğüm damperi}',
    check: 'Simetri argümanı doğrusal tüm çiftlenimli sistemlerde geçerlidir.'
  },
  {
    num: '1.5',
    title: 'Çiftlenimli Çelik Testere Yaprakları ile Akustik Vuru',
    page: 'Sayfa 27',
    home: true,
    diff: 'Temel Türetim',
    tags: ['Konsol Kiriş', 'Vuru', 'Ev Deneyi'],
    statement: 'Masaya kıskaçla tutturulmuş iki özdeş testere yaprağı arasına bir lastik bant geriliyor. Lastik bant kıskaca yaklaştırıldıkça vuru periyodunun neden uzadığını matematiksel olarak açıklayınız.',
    givenLatex: '\\omega_2^2 - \\omega_1^2 = \\frac{2 K_{\\text{eff}}(d)}{m}',
    targetLatex: 'T_{\\text{vuru}} = \\frac{2\\pi}{\\omega_2 - \\omega_1} \\approx \\frac{2\\pi m \\omega_0}{K_{\\text{eff}}(d)}',
    principle: 'Etkin çiftlenim sabiti K_eff, bağlantı noktasındaki hareket genliğinin karesiyle orantılıdır.',
    startQ: 'Lastik bant kıskaca (sabit uca, d → 0) yaklaştırıldığında etkin kuplaj sabiti K_eff nasıl değişir?',
    optCorrect: 'K_{\\text{eff}}(d) \\propto y^2(d) \\to 0 \\implies \\omega_2 - \\omega_1 \\to 0 \\implies T_{\\text{vuru}} \\to \\infty',
    optWrong1: 'K_{\\text{eff}} \\text{ artar ve vuru hızlanır.}',
    optWrong2: 'T_{\\text{vuru}} \\text{ lastiğin konumundan bağımsızdır.}',
    steps: [
      {
        title: 'Zayıf Çiftlenimde Vuru Periyodu İfadesi',
        hint: 'ω₂ - ω₁ ≈ ω₀ (K_eff / k) bağıntısını kullanın.',
        text: 'Lastik bant kıskaca yaklaştıkça yaprağın o noktadaki esneme genliği sıfıra yaklaşır; dolayısıyla lastik neredeyse hiç gerilmez:',
        math: 'd \\to 0 \\implies K_{\\text{eff}}(d) \\ll k \\implies \\Delta\\omega = \\omega_2 - \\omega_1 \\approx \\omega_0 \\frac{K_{\\text{eff}}(d)}{k} \\to 0',
        trick: 'trick-taylor'
      }
    ],
    sceneMode: 'beats-energy',
    abstractTab: 'energy-beats',
    presetParams: { couplingKc: 0.12, omega0: 2.5 },
    observe: 'Çiftlenim parametresi K_c küçültüldüğünde vuru zarfının genişlediğini (T_vuru süresinin uzadığını) izleyin.',
    finalBoxed: 'T_{\\text{vuru}} \\propto \\frac{1}{K_{\\text{eff}}(d)} \\quad (d \\to 0 \\text{ iken } T_{\\text{vuru}} \\to \\infty)',
    check: 'K_eff = 0 limitinde yapraklar bağımsızdır, enerji aktarımı olmaz.'
  },
  {
    num: '1.6',
    title: 'Slinky ile Çiftlenimli Sarkaçlarda Boyuna ve Enine Kipler',
    page: 'Sayfa 27',
    home: true,
    diff: 'Vize Klasik',
    tags: ['Çiftlenimli Sarkaç', 'Boyuna vs Enine', 'Ev Deneyi'],
    statement: 'Boyları L = 50 cm, kütleleri m = 200 g olan iki sarkaç zayıf bir Slinky ile bağlanıyor. Boyuna vuru frekansından Slinky’nin yay sabitini (K_c) veren formülü türetiniz.',
    givenLatex: 'L = 0.5\\text{ m}, \\quad m = 0.2\\text{ kg}, \\quad \\omega_1 = \\sqrt{g/L}',
    targetLatex: 'K_c \\approx m \\omega_1 (\\omega_2 - \\omega_1) = 4\\pi^2 m \\nu_1 \\nu_{\\text{vuru}}',
    principle: 'Zayıf çiftlenimde frekans farkı Δω ≈ K_c / (m ω₁) bağıntısı.',
    startQ: 'İki sarkacın boyuna antisimetrik kip açısal frekansı ω₂ nedir?',
    optCorrect: '\\omega_2 = \\sqrt{\\frac{g}{L} + \\frac{2 K_c}{m}}',
    optWrong1: '\\omega_2 = \\sqrt{\\frac{g}{L} + \\frac{K_c}{m}}',
    optWrong2: '\\omega_2 = \\sqrt{\\frac{2 K_c}{m}}',
    steps: [
      {
        title: 'Taylor Açılımı ile K_c Yay Sabitinin Çekilmesi',
        hint: 'ω₂² - ω₁² = 2K_c / m eşitliğinde ω₂² - ω₁² = (ω₂ - ω₁)(ω₂ + ω₁) ≈ 2ω₁ Δω yazın.',
        text: 'İki kare farkı özdeşliği kullanıldığında Taylor açılımına bile gerek kalmadan çok temiz bir bağıntı elde edilir:',
        math: '\\omega_2^2 - \\omega_1^2 = (\\omega_2 - \\omega_1)(\\omega_2 + \\omega_1) \\approx \\omega_{\\text{vuru}} (2\\omega_1) = \\frac{2 K_c}{m} \\implies K_c \\approx m \\omega_1 \\omega_{\\text{vuru}}',
        trick: 'trick-taylor'
      }
    ],
    sceneMode: 'beats-energy',
    abstractTab: 'energy-beats',
    presetParams: { couplingKc: 0.22, omega0: 2.1 },
    observe: 'Sarkaçların vuru frekansını ölçerek çok zayıf bir yayın esneklik sabitinin nasıl hassasca bulunduğunu inceleyin.',
    finalBoxed: 'K_c = \\frac{1}{2} m (\\omega_2^2 - \\omega_1^2) \\approx 4\\pi^2 m \\nu_1 \\nu_{\\text{vuru}}',
    check: '[m ω²] = kg · s⁻² = N/m.'
  },
  {
    num: '1.7',
    title: 'Tahta ve Pirinç Sarkaçlarda Hava Direnci Sönüm Kıyaslaması',
    page: 'Sayfa 28',
    home: false,
    diff: 'Vize Klasik',
    tags: ['Sönümlü Salınım', 'Atalet ve Sönüm'],
    statement: 'Aynı yarıçaplı tahta küre (ρ_t ≈ 0.7 g/cm³) ve pirinç küre (ρ_p ≈ 8.4 g/cm³) sarkaçlar aynı genlikle bırakılıyor. Tahta sarkacın genliği 3 dakikada 1/e’sine düşüyorsa, aynı sürede pirinç sarkacın genliği ne olur?',
    givenLatex: 'A(t) = A_0 e^{-\\gamma t}, \\quad \\gamma = \\frac{b}{2m}, \\quad \\frac{m_p}{m_t} = \\frac{\\rho_p}{\\rho_t} = 12',
    targetLatex: 'A_p(180\\text{ s}) = A_0 e^{-1/12} \\approx 0.92 A_0',
    principle: 'Hava direnç katsayısı b sadece küre yarıçapına (geometriye) bağlıdır; sönüm oranı γ = b/(2m) ise kütleyle ters orantılıdır.',
    startQ: 'İki kürenin yarıçapları ve hızları aynı olduğuna göre b sürtünme katsayısı ve γ sönüm sabiti nasıl oranlanır?',
    optCorrect: 'b_p = b_t \\implies \\frac{\\gamma_p}{\\gamma_t} = \\frac{m_t}{m_p} = \\frac{1}{12}',
    optWrong1: '\\gamma_p = \\gamma_t \\quad (\\text{Kütle sönümü etkilemez})',
    optWrong2: '\\frac{\\gamma_p}{\\gamma_t} = \\frac{m_p}{m_t} = 12',
    steps: [
      {
        title: 'Sönüm Sabitlerinin Oranlanması',
        hint: 'Tahta küre için γ_t · T = 1’dir. Pirinç küre için γ_p · T değerini bulun.',
        text: 't = 3 dk = 180 s sonunda γ_t t = 1 olduğuna göre, γ_p t = (γ_t / 12) t = 1/12 olur:',
        math: 'A_p(t) = A_0 e^{-\\gamma_p t} = A_0 e^{-(\\gamma_t t)/12} = A_0 e^{-1/12} \\approx 0.920 A_0'
      }
    ],
    sceneMode: 'shm-phasor',
    abstractTab: 'phase',
    presetParams: { omega0: 2.0, amplitude: 1.3, dampingGamma: 0.08 },
    observe: 'Sönüm terimi aktifken faz uzayındaki elipsin merkeze doğru sarmal çizerek daraldığını gözlemleyin.',
    finalBoxed: 'A_p = A_0 e^{-\\rho_t / \\rho_p} = A_0 e^{-1/12} \\approx 0.92 A_0 \\; (\\%92)',
    check: 'm → ∞ limitinde γ → 0 ve A_p → A₀ (sonsuz atalet sönümü sıfırlar).'
  },
  {
    num: '1.8',
    title: 'Düşey Yayda Serbest Bırakılan Kütlenin Denge ve Maksimum Uzaması',
    page: 'Sayfa 28',
    home: false,
    diff: 'Temel Türetim',
    tags: ['Düşey Yay', 'Enerji Korunumu', 'Denge Kayması'],
    statement: 'Yay sabiti k olan düşey bir yayın ucuna m kütlesi takılıp yay hiç uzamadan (y=0) tutuluyor ve aniden bırakılıyor. (a) Kütlenin ineceği maksimum derinliği y_max, (b) Salınımlar sönümlendiğinde duracağı denge noktasını y_denge bulunuz.',
    givenLatex: 'U_{\\text{toplam}}(y) = \\frac{1}{2}ky^2 - mgy',
    targetLatex: 'y_{\\text{denge}} = \\frac{mg}{k}, \\qquad y_{\\max} = \\frac{2mg}{k} = 2y_{\\text{denge}}',
    principle: 'Denge noktasında net kuvvet sıfırdır (F=0); en alt dönüş noktasında ise anlık hız ve toplam enerji değişimi sıfırdır (ΔE=0).',
    startQ: 'En alt noktayı bulmak için F = 0 mı yoksa K + U = 0 mı yazılmalıdır?',
    optCorrect: '\\text{En alt noktada } v=0 \\implies \\frac{1}{2}ky_{\\max}^2 - mgy_{\\max} = 0 \\implies y_{\\max} = \\frac{2mg}{k}',
    optWrong1: 'ky_{\\max} = mg \\implies y_{\\max} = \\frac{mg}{k}',
    optWrong2: 'y_{\\max} = \\sqrt{\\frac{2mg}{k}}',
    steps: [
      {
        title: 'Tam Kareye Tamamlama ile Düşey BHH İspatı',
        hint: 'ỹ = y - mg/k dönüşümü yapın.',
        text: 'Hareket denklemi m ÿ = mg - ky = -k(y - mg/k) olduğundan, yerçekimi frekansı hiç değiştirmez; sadece denge merkezini y_denge = mg/k noktasına kaydırır:',
        math: 'm\\frac{d^2}{dt^2}\\left(y - \\frac{mg}{k}\\right) + k\\left(y - \\frac{mg}{k}\\right) = 0 \\implies y(t) = \\frac{mg}{k}(1 - \\cos\\omega_0 t)'
      }
    ],
    sceneMode: 'shm-phasor',
    abstractTab: 'phase',
    presetParams: { omega0: 2.2, amplitude: 1.0 },
    observe: 'Kütle y_denge noktasından geçerken maksimum hıza sahiptir; bu yüzden duramaz ve 2y_denge noktasına kadar iner.',
    finalBoxed: 'y_{\\text{denge}} = \\frac{mg}{k}, \\qquad y_{\\max} = \\frac{2mg}{k}',
    check: 't = π/ω₀ anında cos(π) = -1 olduğundan y = 2mg/k olur.'
  },
  {
    num: '1.9',
    title: 'Yaya Ek Kütle Eklenmesiyle Bilinmeyen Kütle ve Yay Sabitinin Ölçümü',
    page: 'Sayfa 28',
    home: false,
    diff: 'Temel Türetim',
    tags: ['Frekans Oranı', 'Parametre Tayini'],
    statement: 'Bir yay m kütlesiyle ν₁ frekansında, Δm kütlesi eklendiğinde ise ν₂ frekansında salınıyor. m ve k değerlerini ν₁, ν₂ ve Δm cinsinden türetiniz.',
    givenLatex: '\\nu_1 = \\frac{1}{2\\pi}\\sqrt{\\frac{k}{m}}, \\quad \\nu_2 = \\frac{1}{2\\pi}\\sqrt{\\frac{k}{m + \\Delta m}}',
    targetLatex: 'm = \\Delta m \\frac{\\nu_2^2}{\\nu_1^2 - \\nu_2^2}, \\qquad k = 4\\pi^2 \\Delta m \\frac{\\nu_1^2 \\nu_2^2}{\\nu_1^2 - \\nu_2^2}',
    principle: 'Frekansların karesi kütle ile ters orantılıdır: ν² ∝ 1/m.',
    startQ: 'k sabitini yok etmek için iki frekans denklemini nasıl oranlarız?',
    optCorrect: '\\left(\\frac{\\nu_1}{\\nu_2}\\right)^2 = \\frac{m + \\Delta m}{m} = 1 + \\frac{\\Delta m}{m}',
    optWrong1: '\\frac{\\nu_1}{\\nu_2} = 1 + \\frac{\\Delta m}{m}',
    optWrong2: '\\left(\\frac{\\nu_2}{\\nu_1}\\right)^2 = 1 + \\frac{\\Delta m}{m}',
    steps: [
      {
        title: 'm ve k’nın Çekilmesi',
        hint: 'Δm/m = (ν₁² - ν₂²)/ν₂² eşitliğini ters çevirin.',
        text: 'Orandan m çekilip k = 4π² ν₁² m denkleminde yerine yazılır:',
        math: 'm = \\Delta m \\frac{\\nu_2^2}{\\nu_1^2 - \\nu_2^2}, \\qquad k = 4\\pi^2 \\nu_1^2 m = 4\\pi^2 \\Delta m \\frac{\\nu_1^2 \\nu_2^2}{\\nu_1^2 - \\nu_2^2}'
      }
    ],
    sceneMode: 'shm-phasor',
    abstractTab: 'phase',
    presetParams: { omega0: 1.8, amplitude: 1.1 },
    observe: 'Kütle artırıldığında periyodun uzadığını ve faz uzayında hız ölçeğinin küçüldüğünü inceleyin.',
    finalBoxed: 'm = \\frac{\\Delta m\\,\\nu_2^2}{\\nu_1^2 - \\nu_2^2}, \\qquad k = \\frac{4\\pi^2 \\Delta m\\,\\nu_1^2 \\nu_2^2}{\\nu_1^2 - \\nu_2^2}',
    check: 'ν₂ < ν₁ olduğundan payda pozitiftir.'
  },
  {
    num: '1.10',
    title: 'Diyapazonun (Akort Çatalının) Kütle İle Yüklenmesi ve Vuru Yöntemi',
    page: 'Sayfa 28',
    home: true,
    diff: 'Temel Türetim',
    tags: ['Akustik Vuru', 'Pertürbasyon', 'Ev Deneyi'],
    statement: 'Özdeş iki diyapazondan birinin koluna küçük bir Δm lastik halkası takıldığında vuru duyuluyor. Küçük Δm ≪ m için vuru frekansının Δν ≈ ½ ν₀ (Δm/m) olduğunu Taylor açılımıyla gösteriniz.',
    givenLatex: '\\nu(\\Delta m) = \\nu_0 \\left(1 + \\frac{\\Delta m}{m}\\right)^{-1/2}',
    targetLatex: '\\nu_{\\text{vuru}} = \\nu_0 - \\nu(\\Delta m) \\approx \\frac{1}{2}\\nu_0 \\frac{\\Delta m}{m}',
    principle: '(1 + ε)^{-1/2} ≈ 1 - ε/2 birinci mertebe binom (Taylor) yaklaşımı.',
    startQ: '(1 + Δm/m)^{-1/2} ifadesinin Δm ≪ m için birinci mertebe açılımı nedir?',
    optCorrect: '\\left(1 + \\frac{\\Delta m}{m}\\right)^{-1/2} \\approx 1 - \\frac{1}{2}\\frac{\\Delta m}{m}',
    optWrong1: '\\left(1 + \\frac{\\Delta m}{m}\\right)^{-1/2} \\approx 1 - \\frac{\\Delta m}{m}',
    optWrong2: '\\left(1 + \\frac{\\Delta m}{m}\\right)^{-1/2} \\approx 1 + \\frac{1}{2}\\frac{\\Delta m}{m}',
    steps: [
      {
        title: 'Binom Açılımı ile Vuru Frekansı',
        hint: 'p = -1/2 için (1+ε)^p ≈ 1 + pε kullanın.',
        text: 'Yüklenen çatalın frekansı düşer; iki çatal aynı anda çalındığında oluşan vuru frekansı:',
        math: '\\nu_{\\text{vuru}} = \\nu_0 - \\nu_0\\left(1 - \\frac{\\Delta m}{2m}\\right) = \\frac{1}{2}\\nu_0 \\frac{\\Delta m}{m}',
        trick: 'trick-taylor'
      }
    ],
    sceneMode: 'beats-energy',
    abstractTab: 'energy-beats',
    presetParams: { couplingKc: 0.15, omega0: 2.4 },
    observe: 'Küçük bir frekans farkının yavaş modülasyon zarfı (vuru) oluşturduğunu gözlemleyin.',
    finalBoxed: '\\nu_{\\text{vuru}} \\approx \\frac{\\nu_0}{2}\\frac{\\Delta m}{m}',
    check: 'Δm = 0 iken ν_vuru = 0 olur.'
  },
  {
    num: '1.11',
    title: 'İki Kütle Üç Yayda Başlangıç Konumlarının Süperpozisyonu',
    page: 'Sayfa 28',
    home: false,
    diff: 'Vize Klasik',
    tags: ['Süperpozisyon', 'Başlangıç Koşulları', 'Normal Kipler'],
    statement: 'İki kütleli sistemde (x_a(0), x_b(0)) = (2, 0) durgun başlangıç koşulunun, Kip 1 (1, 1) ve Kip 2 (1, -1) başlangıç koşullarının toplamı olduğunu göstererek x_a(t) ve x_b(t)’yi türetiniz.',
    givenLatex: '\\begin{bmatrix} 2 \\\\ 0 \\end{bmatrix} = \\begin{bmatrix} 1 \\\\ 1 \\end{bmatrix} + \\begin{bmatrix} 1 \\\\ -1 \\end{bmatrix}, \\quad \\dot{x}_a(0)=\\dot{x}_b(0)=0',
    targetLatex: 'x_a(t) = \\cos(\\omega_1 t) + \\cos(\\omega_2 t), \\quad x_b(t) = \\cos(\\omega_1 t) - \\cos(\\omega_2 t)',
    principle: 'Doğrusal diferansiyel denklemlerde başlangıç koşullarının toplamı, çözümlerin toplamını üretir.',
    startQ: '(1, 1) ve (1, -1) başlangıç durumlarının zamana bağlı çözümleri nelerdir?',
    optCorrect: '\\vec{x}^{(1)}(t) = \\begin{bmatrix} 1 \\\\ 1 \\end{bmatrix}\\cos(\\omega_1 t), \\qquad \\vec{x}^{(2)}(t) = \\begin{bmatrix} 1 \\\\ -1 \\end{bmatrix}\\cos(\\omega_2 t)',
    optWrong1: '\\vec{x}^{(1)}(t) = \\begin{bmatrix} 1 \\\\ 1 \\end{bmatrix}\\sin(\\omega_1 t)',
    optWrong2: '\\vec{x}^{(1)}(t) = \\begin{bmatrix} 2 \\\\ 0 \\end{bmatrix}\\cos(\\omega_1 t)',
    steps: [
      {
        title: 'Özvektörlerin Doğrudan Toplanması',
        hint: 'x(t) = x^(1)(t) + x^(2)(t) toplamını yazın.',
        text: 'Her bir normal kip kendi özfrekansıyla bağımsız evrilir; toplamları hem hareket denklemini hem de t=0 koşulunu sağlar:',
        math: 'x_a(t) = \\cos(\\omega_1 t) + \\cos(\\omega_2 t), \\qquad x_b(t) = \\cos(\\omega_1 t) - \\cos(\\omega_2 t)',
        trick: 'trick-determinant'
      }
    ],
    sceneMode: 'coupled-modes',
    abstractTab: 'normal-coords',
    presetParams: { modeSelect: 0, couplingKc: 0.5 },
    observe: 'Sadece sol kütlenin çekilip bırakıldığı karma modda (Mod 0) q₁ ve q₂ normal koordinatlarının her ikisinin de eşit genlikle salındığını görün.',
    finalBoxed: 'x_a(t) = \\cos\\omega_1 t + \\cos\\omega_2 t, \\qquad x_b(t) = \\cos\\omega_1 t - \\cos\\omega_2 t',
    check: 't = 0 koyulduğunda x_a(0) = 1 + 1 = 2 ve x_b(0) = 1 - 1 = 0 tam sağlanır.'
  },
  {
    num: '1.12',
    title: 'İki Kütleli Sistemde Başlangıç Hızlarının (İmpulsun) Süperpozisyonu',
    page: 'Sayfa 29',
    home: false,
    diff: 'Vize Klasik',
    tags: ['Başlangıç Hızı', 'İmpuls', 'Normal Kipler'],
    statement: 'Denge konumunda (x_a(0) = x_b(0) = 0) duran iki kütleli sistemde sol kütleye t=0 anında çekiçle vurularak v_a(0) = 2v₀, v_b(0) = 0 ilk hızı veriliyor. x_a(t) ve x_b(t) hareketini türetiniz.',
    givenLatex: 'x_a(0) = x_b(0) = 0, \\quad \\dot{x}_a(0) = 2v_0, \\quad \\dot{x}_b(0) = 0',
    targetLatex: 'x_a(t) = \\frac{v_0}{\\omega_1}\\sin(\\omega_1 t) + \\frac{v_0}{\\omega_2}\\sin(\\omega_2 t), \\quad x_b(t) = \\frac{v_0}{\\omega_1}\\sin(\\omega_1 t) - \\frac{v_0}{\\omega_2}\\sin(\\omega_2 t)',
    principle: 'İlk konum sıfır olduğundan çözümler sin(ω_n t) formundadır; türev alındığında ω_n çarpanı gelir!',
    startQ: 'Normal koordinatların t=0 anındaki hızları q̇₁(0) ve q̇₂(0) nedir?',
    optCorrect: '\\dot{q}_1(0) = \\dot{x}_a(0) + \\dot{x}_b(0) = 2v_0, \\qquad \\dot{q}_2(0) = \\dot{x}_a(0) - \\dot{x}_b(0) = 2v_0',
    optWrong1: '\\dot{q}_1(0) = v_0, \\qquad \\dot{q}_2(0) = 0',
    optWrong2: 'q_1(0) = 2v_0',
    steps: [
      {
        title: 'Normal Koordinatların Zaman Çözümü',
        hint: 'q_n(t) = (q̇_n(0) / ω_n) sin(ω_n t) bağıntısını kullanın.',
        text: 'Her bir normal koordinat için başlangıç hızı 2v₀ olduğundan:',
        math: 'q_1(t) = \\frac{2v_0}{\\omega_1}\\sin(\\omega_1 t), \\qquad q_2(t) = \\frac{2v_0}{\\omega_2}\\sin(\\omega_2 t)'
      },
      {
        title: 'Fiziksel Koordinatlara Geri Dönüşüm',
        hint: 'x_a = ½(q₁ + q₂) ve x_b = ½(q₁ - q₂) yazın.',
        text: 'Yüksek frekanslı kipin genliğinin (v₀/ω₂), alçak frekanslı kipin genliğinden (v₀/ω₁) DAHA KÜÇÜK olduğuna dikkat edin:',
        math: 'x_a(t) = \\frac{v_0}{\\omega_1}\\sin(\\omega_1 t) + \\frac{v_0}{\\omega_2}\\sin(\\omega_2 t), \\qquad x_b(t) = \\frac{v_0}{\\omega_1}\\sin(\\omega_1 t) - \\frac{v_0}{\\omega_2}\\sin(\\omega_2 t)',
        trick: 'trick-determinant'
      }
    ],
    sceneMode: 'coupled-modes',
    abstractTab: 'normal-coords',
    presetParams: { modeSelect: 0, couplingKc: 0.7 },
    observe: 'İlk hız verildiğinde yüksek frekanslı kipin genliğinin 1/ω₂ çarpanı nedeniyle daha küçük uyarıldığını inceleyin.',
    finalBoxed: 'x_{a,b}(t) = \\frac{v_0}{\\omega_1}\\sin(\\omega_1 t) \\pm \\frac{v_0}{\\omega_2}\\sin(\\omega_2 t)',
    check: 't=0’da türev alındığında ẋ_a(0) = v₀ + v₀ = 2v₀ ve ẋ_b(0) = v₀ - v₀ = 0 doğrulanır.'
  },
  {
    num: '1.13',
    title: 'Doğrusal Olmayan Diferansiyel Denklemde Süperpozisyonun İflası',
    page: 'Sayfa 29',
    home: false,
    diff: 'Temel Türetim',
    tags: ['Doğrusallık', 'Süperpozisyon', 'Non-lineer'],
    statement: 'd²x/dt² + αx² = 0 denkleminin iki çözümü x₁(t) ve x₂(t) olsun. x(t) = x₁(t) + x₂(t) toplamının bu denklemin bir çözümü OLMADIĞINI cebirsel olarak kanıtlayınız.',
    givenLatex: '\\ddot{x}_1 + \\alpha x_1^2 = 0, \\quad \\ddot{x}_2 + \\alpha x_2^2 = 0',
    targetLatex: '\\frac{d^2(x_1+x_2)}{dt^2} + \\alpha(x_1+x_2)^2 = 2\\alpha x_1(t)x_2(t) \\neq 0',
    principle: '(x₁ + x₂)² = x₁² + x₂² + 2x₁x₂ açılımındaki çapraz terim doğrusal olmayan etkileşim üretir.',
    startQ: 'x = x₁ + x₂ denkleme konulduğunda sol taraf neye eşit olur?',
    optCorrect: '(\\ddot{x}_1 + \\alpha x_1^2) + (\\ddot{x}_2 + \\alpha x_2^2) + 2\\alpha x_1 x_2 = 2\\alpha x_1 x_2 \\neq 0',
    optWrong1: '0 + 0 = 0',
    optWrong2: '\\alpha(x_1^2 + x_2^2)',
    steps: [
      {
        title: 'Karesel Terimin Açılımı ve Artık Terim',
        hint: 'Türev doğrusaldır ama kare alma doğrusal değildir.',
        text: 'İlk iki parantez x₁ ve x₂ çözüm olduğu için sıfırdır; ancak 2αx₁x₂ çapraz terimi sıfırdan farklıdır:',
        math: '\\mathcal{N}[x_1 + x_2] = 2\\alpha x_1(t) x_2(t) \\neq 0'
      }
    ],
    sceneMode: 'shm-phasor',
    abstractTab: 'phase',
    presetParams: { omega0: 2.0, amplitude: 1.3, anharmonicAlpha: 0.35 },
    observe: 'Anharmonik terim açıldığında faz uzayı yörüngesinin simetrisinin nasıl bozulduğunu gözlemleyin.',
    finalBoxed: '\\text{Artık Terim} = 2\\alpha x_1(t)x_2(t) \\neq 0 \\implies \\text{Süperpozisyon geçersizdir.}',
    check: 'α → 0 limitinde doğrusallık geri kazanılır.'
  },
  {
    num: '1.14',
    title: 'N = 3 Serbestlik Dereceli Sistem ve Seküler Determinant',
    page: 'Sayfa 29',
    home: false,
    diff: 'İleri Sentez',
    tags: ['3 Serbestlik Derecesi', 'Seküler Determinant', 'Özdeğer'],
    statement: 'Yaylarla bağlı 3 kütleli bir sistemin hareket denklemlerinden 3×3 karakteristik determinantı kurunuz ve ω² için 3. dereceden bir polinom oluştuğunu (3 normal kip bulunduğunu) gösteriniz.',
    givenLatex: '\\mathbf{M}\\ddot{\\mathbf{x}} + \\mathbf{K}\\mathbf{x} = \\mathbf{0}, \\quad \\mathbf{x}(t) = \\mathbf{A}\\cos(\\omega t)',
    targetLatex: '\\det(\\mathbf{K} - \\omega^2\\mathbf{M}) = 0 \\implies c_3(\\omega^2)^3 + c_2(\\omega^2)^2 + c_1(\\omega^2) + c_0 = 0',
    principle: 'Homojen doğrusal denklem sisteminin sıfırdan farklı çözümü için determinant sıfır olmalıdır.',
    startQ: 'Özdeş m kütleleri ve k yaylarıyla iki duvar arasına dizilmiş 3 kütle için (K - mω²I) matrisi nedir?',
    optCorrect: '\\begin{vmatrix} 2k - m\\omega^2 & -k & 0 \\\\ -k & 2k - m\\omega^2 & -k \\\\ 0 & -k & 2k - m\\omega^2 \\end{vmatrix} = 0',
    optWrong1: '\\begin{vmatrix} k - m\\omega^2 & -k & 0 \\\\ -k & k - m\\omega^2 & -k \\\\ 0 & -k & k - m\\omega^2 \\end{vmatrix} = 0',
    optWrong2: '\\begin{vmatrix} 2k & k & k \\\\ k & 2k & k \\\\ k & k & 2k \\end{vmatrix} = 0',
    steps: [
      {
        title: '3×3 Determinantın Açılımı ve 3 Özfrekans',
        hint: 'X = 2k - mω² tanımlayarak determinantı X(X² - k²) - k²X = X(X² - 2k²) = 0 şeklinde çarpanlarına ayırın!',
        text: 'X = 2k - mω² kısaltmasıyla determinant tek satırda çarpanlarına ayrılır:',
        math: 'X(X^2 - 2k^2) = 0 \\implies X = 0 \\text{ veya } X = \\pm\\sqrt{2}k \\implies m\\omega^2 = (2 - \\sqrt{2})k, \\; 2k, \\; (2 + \\sqrt{2})k',
        trick: 'trick-determinant'
      }
    ],
    sceneMode: 'coupled-modes',
    abstractTab: 'normal-coords',
    presetParams: { modeSelect: 1, couplingKc: 0.8 },
    observe: 'N serbestlik dereceli her sistemin N×N determinanttan gelen tam N adet normal kipi vardır.',
    finalBoxed: '\\omega_1^2 = (2-\\sqrt{2})\\frac{k}{m}, \\quad \\omega_2^2 = 2\\frac{k}{m}, \\quad \\omega_3^2 = (2+\\sqrt{2})\\frac{k}{m}',
    check: 'Bu 3 kök, Bölüm 2.4’teki ω_m = 2√(k/m) sin(mπ/8) formülünün m=1,2,3 değerleriyle BİREBİR aynıdır!'
  },
  {
    num: '1.15',
    title: 'Akordu Bozuk Gitar Telleri Arasında Kısmi Enerji Aktarımı',
    page: 'Sayfa 29',
    home: true,
    diff: 'Vize Klasik',
    tags: ['Frekans Uyuşmazlığı', 'Rezonans', 'Ev Deneyi'],
    statement: 'Gitar köprüsü üzerinden zayıfça çiftlenmiş iki telin doğal frekansları eşit değilse (ω_a ≠ ω_b), bir tel çekildiğinde enerjinin neden diğer tele %100 geçemediğini açıklayınız.',
    givenLatex: '\\Delta\\omega_0 = \\omega_a - \\omega_b \\neq 0',
    targetLatex: '\\eta_{\\max} = \\frac{(2\\kappa)^2}{(2\\kappa)^2 + (\\omega_a^2 - \\omega_b^2)^2} < 1',
    principle: 'Tam enerji transferi (%100 modülasyon derinliği) yalnızca iki normal kip eşit genlikle uyarıldığında (simetrik/dejenere sistemde) mümkündür.',
    startQ: 'ω_a = ω_b olduğunda maksimum enerji aktarım oranı η_max ne olur?',
    optCorrect: '\\omega_a = \\omega_b \\implies \\eta_{\\max} = 1 \\; (\\%100 \\text{ tam enerji aktarımı})',
    optWrong1: '\\eta_{\\max} = 0.5',
    optWrong2: '\\eta_{\\max} = 0',
    steps: [
      {
        title: 'Asimetrik Normal Kipler ve Sınırlı Vuru Derinliği',
        hint: 'Frekanslar farklı olduğunda normal kiplerde bir tel diğerinden daha büyük genlikle salınır.',
        text: 'Δω₀ ≫ κ (akort farkı çiftlenimden çok büyükse) Kip 1 neredeyse sadece A telinde, Kip 2 ise neredeyse sadece B telinde yaşar; enerji A telinde hapsolur:',
        math: '\\Delta\\omega_0 \\neq 0 \\implies E_{a,\\min} > 0 \\quad (\\text{Birinci tel hiçbir an tamamen susmaz!})'
      }
    ],
    sceneMode: 'beats-energy',
    abstractTab: 'energy-beats',
    presetParams: { couplingKc: 0.25, omega0: 2.2 },
    observe: 'Özdeş sarkaçlarda E_a(t) sıfıra kadar inerken, özdeş olmayan sistemde minimum enerji sıfırın üzerinde kalır.',
    finalBoxed: '\\omega_a \\neq \\omega_b \\implies \\text{Enerji aktarımı daima \\%100\'ün altındadır.}',
    check: 'Rezonans akort kontrolünün temel fiziksel ilkesidir.'
  },
  {
    num: '1.16',
    title: 'Özdeş Olmayan Kütleli Çiftlenimli Sarkaçlar (M_a ≠ M_b)',
    page: 'Sayfa 29',
    home: false,
    diff: 'İleri Sentez',
    tags: ['Farklı Kütleler', 'Seküler Determinant', 'Empedans'],
    statement: 'Boyları L aynı, kütleleri M_a ve M_b farklı iki sarkaç K yay sabitiyle bağlanıyor. Hareket denklemlerini kurunuz ve seküler determinanttan iki normal kip frekansını (ω₁, ω₂) türetiniz.',
    givenLatex: 'M_a\\ddot{x}_a + \\frac{M_a g}{L}x_a + K(x_a - x_b) = 0, \\quad M_b\\ddot{x}_b + \\frac{M_b g}{L}x_b + K(x_b - x_a) = 0',
    targetLatex: '\\omega_1^2 = \\frac{g}{L}, \\qquad \\omega_2^2 = \\frac{g}{L} + K\\left(\\frac{1}{M_a} + \\frac{1}{M_b}\\right)',
    principle: 'Denklemleri kendi kütlelerine böldüğümüzde x_a = x_b simetrik kipi kütlelerden bağımsız olarak korunur; ikinci kipte ise indirgenmiş kütle 1/μ = 1/M_a + 1/M_b ortaya çıkar!',
    startQ: 'Her iki denklemi kendi kütlesine (M_a ve M_b) böldüğümüzde hangi koordinatlar denklemleri doğrudan ayrıştırır?',
    optCorrect: 'q_2 = x_a - x_b \\text{ (bağıl koordinat)} \\quad \\text{ve} \\quad q_1 = M_a x_a + M_b x_b \\text{ (kütle merkezi koordinatı!)}',
    optWrong1: 'q_1 = x_a + x_b, \\quad q_2 = x_a - x_b',
    optWrong2: '\\text{Ayrıştırmak imkansızdır.}',
    steps: [
      {
        title: 'Kip 1 (x_a = x_b) ve Kütle Merkezi Kipi',
        hint: 'İki denklemi M_a ve M_b ile ağırlıklı toplayın: M_a ẍ_a + M_b ẍ_b.',
        text: 'Denklemler doğrudan toplandığında K(x_a - x_b) terimleri birbirini götürür ve x_a = x_b için yay hiç gerilmez:',
        math: '\\omega_1^2 = \\frac{g}{L}, \\qquad A_a = A_b',
        trick: 'trick-determinant'
      },
      {
        title: 'Kip 2 (Kütle Merkezi Sabit: M_a x_a + M_b x_b = 0) ve İndirgenmiş Kütle',
        hint: 'ẍ_a ve ẍ_b denklemlerini birbirinden çıkarıp q₂ = x_a - x_b oluşturun.',
        text: 'Her denklemi kendi kütlesine bölüp birbirinden çıkardığımızda q₂ = x_a - x_b için denklem doğrudan kapanır:',
        math: '\\ddot{q}_2 + \\left[\\frac{g}{L} + K\\left(\\frac{1}{M_a} + \\frac{1}{M_b}\\right)\\right] q_2 = 0 \\implies \\omega_2^2 = \\frac{g}{L} + \\frac{K}{\\mu}, \\quad \\frac{A_a}{A_b} = -\\frac{M_b}{M_a}',
        trick: 'trick-determinant'
      }
    ],
    sceneMode: 'coupled-modes',
    abstractTab: 'normal-coords',
    presetParams: { modeSelect: 2, couplingKc: 0.85 },
    observe: 'Farklı kütlelerde Kip 2’de genlikler kütlelerle ters orantılıdır (M_a A_a + M_b A_b = 0).',
    finalBoxed: '\\omega_1 = \\sqrt{\\frac{g}{L}}, \\qquad \\omega_2 = \\sqrt{\\frac{g}{L} + K\\left(\\frac{1}{M_a} + \\frac{1}{M_b}\\right)}',
    check: 'M_a = M_b = m konulduğunda ω₂² = g/L + 2K/m standart formülü elde edilir.'
  },
  {
    num: '1.17',
    title: 'Gergin Tel Üzerindeki İki Boncuğun Enine (Transverse) Normal Kipleri',
    page: 'Sayfa 29',
    home: false,
    diff: 'Vize Klasik',
    tags: ['Enine Salınım', '2 Boncuklu Tel', 'Normal Kipler'],
    statement: 'Toplam 3ℓ uzunluğundaki T₀ gerilimli kütlesiz tel üzerine ℓ aralıklarla iki adet M kütlesi dizilmiştir. Küçük enine salınımların hareket denklemlerini ve iki normal kip frekansını (ω₁, ω₂) türetiniz.',
    givenLatex: 'L_{\\text{toplam}} = 3\\ell, \\quad \\text{Kütleler: } M, M, \\quad \\text{Gerilim: } T_0',
    targetLatex: '\\omega_1 = \\sqrt{\\frac{T_0}{M\\ell}}, \\qquad \\omega_2 = \\sqrt{\\frac{3T_0}{M\\ell}} = \\sqrt{3}\\omega_1',
    principle: 'Her boncuğa sol ve sağ tel parçalarından gelen enine kuvvet T₀ sin θ ≈ T₀ (Δy / ℓ)’dir.',
    startQ: 'Sol kütle y_a için enine hareket denklemi nedir?',
    optCorrect: 'M\\ddot{y}_a = -T_0\\frac{y_a}{\\ell} - T_0\\frac{y_a - y_b}{\\ell} = -\\frac{T_0}{\\ell}(2y_a - y_b)',
    optWrong1: 'M\\ddot{y}_a = -\\frac{T_0}{\\ell}(y_a - y_b)',
    optWrong2: 'M\\ddot{y}_a = -\\frac{T_0}{\\ell}(y_a + y_b)',
    steps: [
      {
        title: 'Kip 1 (Simetrik: y_a = y_b) Frekansı',
        hint: 'y_a = y_b olduğunda iki kütle arasındaki orta tel parçası yatay kalır (eğimi sıfırdır!).',
        text: 'y_a = y_b koyduğumuzda orta tel parçası hiç düşey kuvvet uygulamaz; sadece uçlardaki teller çeker:',
        math: 'M\\ddot{y}_1 + \\frac{T_0}{\\ell}y_1 = 0 \\implies \\omega_1 = \\sqrt{\\frac{T_0}{M\\ell}}',
        trick: 'trick-determinant'
      },
      {
        title: 'Kip 2 (Antisimetrik: y_a = -y_b) Frekansı',
        hint: 'y_b = -y_a koyduğunuzda 2y_a - y_b = 3y_a olur!',
        text: 'Zıt fazlı kipte orta telin eğimi (y_a - (-y_a))/ℓ = 2y_a/ℓ olduğundan geri çağırıcı kuvvet 3 katına çıkar:',
        math: 'M\\ddot{y}_2 + \\frac{3T_0}{\\ell}y_2 = 0 \\implies \\omega_2 = \\sqrt{\\frac{3T_0}{M\\ell}} = \\sqrt{3}\\omega_1'
      }
    ],
    sceneMode: 'coupled-modes',
    abstractTab: 'normal-coords',
    presetParams: { modeSelect: 2, couplingKc: 1.0 },
    observe: 'Bu problem Bölüm 2.4’teki N-boncuklu telin N = 2 özel halidir: ω_m = 2√(T₀/Mℓ) sin(mπ/6) formülü m=1 için sin(30°)=1/2 ⇒ ω₁, m=2 için sin(60°)=√3/2 ⇒ √3 ω₁ verir!',
    finalBoxed: '\\omega_1 = \\sqrt{\\frac{T_0}{M\\ell}}, \\qquad \\omega_2 = \\sqrt{\\frac{3T_0}{M\\ell}}',
    check: 'Dış yay sabiti k = T₀/ℓ ve orta yay sabiti K_c = T₀/ℓ olan 2 kütle 3 yay sistemiyle birebir eşdeğerdir.'
  },
  {
    num: '1.18',
    title: 'Karşılıklı İndüktans (M_c) ile Çiftlenimli İki LC Devresi',
    page: 'Sayfa 30',
    home: false,
    diff: 'Vize Klasik',
    tags: ['Manyetik Kuplaj', 'Karşılıklı İndüktans', 'LC Devresi'],
    statement: 'Karşılıklı indüktans M_c ile manyetik olarak çiftlenmiş iki özdeş LC devresinin denklemleri L Q̈_a + M_c Q̈_b + Q_a/C = 0 ve L Q̈_b + M_c Q̈_a + Q_b/C = 0’dır. Normal koordinatları ve özfrekansları türetiniz.',
    givenLatex: 'L\\ddot{Q}_a + M_c\\ddot{Q}_b + \\frac{1}{C}Q_a = 0, \\quad L\\ddot{Q}_b + M_c\\ddot{Q}_a + \\frac{1}{C}Q_b = 0',
    targetLatex: '\\omega_1 = \\frac{1}{\\sqrt{(L + M_c)C}}, \\qquad \\omega_2 = \\frac{1}{\\sqrt{(L - M_c)C}}',
    principle: 'İvme (ikinci türev) üzerinden çiftlenimde toplam ve fark koordinatları etkin indüktansı L ± M_c yapar.',
    startQ: 'İki denklemi taraf tarafa topladığımızda (q₁ = Q_a + Q_b) hangi diferansiyel denklem elde edilir?',
    optCorrect: '(L + M_c)\\ddot{q}_1 + \\frac{1}{C}q_1 = 0',
    optWrong1: 'L\\ddot{q}_1 + \\left(\\frac{1}{C} + M_c\\right)q_1 = 0',
    optWrong2: '(L - M_c)\\ddot{q}_1 + \\frac{1}{C}q_1 = 0',
    steps: [
      {
        title: 'Toplam ve Fark Koordinatlarıyla Özfrekanslar',
        hint: 'q₁ = Q_a + Q_b ve q₂ = Q_a - Q_b tanımlayın.',
        text: 'Taraf tarafa toplama ve çıkarma işlemleriyle denklemler anında ayrışır:',
        math: '\\omega_1 = \\frac{1}{\\sqrt{(L + M_c)C}} \\; (\\text{Simetrik}), \\qquad \\omega_2 = \\frac{1}{\\sqrt{(L - M_c)C}} \\; (\\text{Antisimetrik})',
        trick: 'trick-determinant'
      }
    ],
    sceneMode: 'coupled-modes',
    abstractTab: 'normal-coords',
    presetParams: { modeSelect: 1, couplingKc: 0.6 },
    observe: 'Manyetik kuplajda simetrik kipte indüktans büyüdüğü için ω₁ < ω₀ olur!',
    finalBoxed: '\\omega_1 = \\frac{1}{\\sqrt{(L+M_c)C}}, \\qquad \\omega_2 = \\frac{1}{\\sqrt{(L-M_c)C}}',
    check: 'Fiziksel olarak M_c < L olduğundan L - M_c > 0’dır.'
  },
  {
    num: '1.19',
    title: 'Elastik Yastık / Süspansiyon Statik Çökme Miktarından Frekans Hesabı',
    page: 'Sayfa 30',
    home: true,
    diff: 'Temel Türetim',
    tags: ['Statik Çökme', 'Doğal Frekans', 'Ev Deneyi'],
    statement: 'Bir kütle elastik bir yastık üzerine konduğunda yastık h = 1 cm çöküyor. Kütleyi ve yay sabitini bilmeden düşey salınım frekansını (Hz) hesaplayınız.',
    givenLatex: 'h = 1\\text{ cm}, \\quad g = 980\\text{ cm/s}^2, \\quad kh = mg',
    targetLatex: '\\nu = \\frac{1}{2\\pi}\\sqrt{\\frac{g}{h}} \\approx 5.0\\text{ Hz}',
    principle: 'Statik denge koşulu kh = mg olduğundan k/m oranı doğrudan g/h’ye eşittir!',
    startQ: 'ω₀² = k/m ifadesinde statik denge bağıntısını kullanırsak ne elde ederiz?',
    optCorrect: '\\frac{k}{m} = \\frac{g}{h} \\implies \\omega_0 = \\sqrt{\\frac{g}{h}}',
    optWrong1: '\\omega_0 = \\sqrt{gh}',
    optWrong2: '\\omega_0 = \\sqrt{\\frac{h}{g}}',
    steps: [
      {
        title: 'Sayısal Değerin Hesaplanması',
        hint: 'g = 980 cm/s² ve h = 1 cm koyun.',
        text: 'ω₀ = √980 ≈ 31.3 rad/s değerini 2π’ye bölersek:',
        math: '\\nu = \\frac{\\sqrt{980}}{2\\pi} \\approx \\frac{31.305}{6.283} \\approx 4.98\\text{ Hz} \\approx 5\\text{ Hz}'
      }
    ],
    sceneMode: 'shm-phasor',
    abstractTab: 'phase',
    presetParams: { omega0: 2.5, amplitude: 1.0 },
    observe: 'Statik çökmesi h olan bir yayın periyodu, boyu h olan bir basit sarkacın periyoduyla birebir aynıdır!',
    finalBoxed: '\\nu = \\frac{1}{2\\pi}\\sqrt{\\frac{g}{h}} \\approx 5.0\\text{ Hz}',
    check: '[√(g/h)] = s⁻¹.'
  },
  {
    num: '1.20',
    title: 'Seküler Determinant Yöntemiyle İki Kütleli Sistemin Doğrudan Çözümü',
    page: 'Sayfa 30',
    home: false,
    diff: 'Vize Klasik',
    tags: ['Seküler Determinant', 'Özvektör Oranı'],
    statement: 'Normal koordinat tahmin etmeden, doğrudan x_a = A_a cos(ωt) ve x_b = A_b cos(ωt) deneme çözümlerini 2 kütle 3 yay denklemine koyup determinantı sıfıra eşitleyerek ω₁, ω₂ ve A_b/A_a oranlarını türetiniz.',
    givenLatex: '\\begin{bmatrix} k + K_c - m\\omega^2 & -K_c \\\\ -K_c & k + K_c - m\\omega^2 \\end{bmatrix} \\begin{bmatrix} A_a \\\\ A_b \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 0 \\end{bmatrix}',
    targetLatex: '(k + K_c - m\\omega^2)^2 - K_c^2 = 0 \\implies \\omega_1^2 = \\frac{k}{m}, \\; \\omega_2^2 = \\frac{k+2K_c}{m}',
    principle: 'Matris özdeğer denklemi (K - mω²I)A = 0.',
    startQ: 'Determinant denklemi çarpanlarına ayrıldığında hangi iki kök gelir?',
    optCorrect: '(k + K_c - m\\omega^2 - K_c)(k + K_c - m\\omega^2 + K_c) = 0',
    optWrong1: '(k - m\\omega^2)^2 + K_c^2 = 0',
    optWrong2: 'k^2 - (m\\omega^2)^2 = 0',
    steps: [
      {
        title: 'Özdeğerlerin Özvektör Denklemlerine Geri Yazılması',
        hint: 'Bulunan ω₁² ve ω₂² değerlerini birinci satır denklemine koyup A_b/A_a oranını çekin.',
        text: 'ω₁² = k/m için K_c A_a - K_c A_b = 0 ⇒ A_b = +A_a; ω₂² = (k+2K_c)/m için -K_c A_a - K_c A_b = 0 ⇒ A_b = -A_a bulunur:',
        math: '\\text{Kip 1: } \\frac{A_b}{A_a} = +1, \\qquad \\text{Kip 2: } \\frac{A_b}{A_a} = -1',
        trick: 'trick-determinant'
      }
    ],
    sceneMode: 'coupled-modes',
    abstractTab: 'normal-coords',
    presetParams: { modeSelect: 1, couplingKc: 0.75 },
    observe: 'Determinant yöntemi simetrik olmayan sistemlerde bile her zaman çalışan genel algoritmadır.',
    finalBoxed: '\\omega_1 = \\sqrt{\\frac{k}{m}} \\; (A_b = A_a), \\qquad \\omega_2 = \\sqrt{\\frac{k+2K_c}{m}} \\; (A_b = -A_a)',
    check: 'Normal koordinat yöntemiyle bulunan sonuçlarla %100 özdeştir.'
  },
  {
    num: '1.21',
    title: 'Dikdörtgen Kapta Su Çalkalanma Kipi (Sloshing Mode) Türetimi',
    page: 'Sayfa 30',
    home: true,
    diff: 'İleri Sentez',
    tags: ['Sloshing Mode', 'Akışkan Salınımı', 'Enerji Yöntemi'],
    statement: 'Uzunluğu L_kap = 2L, su derinliği h (h ≪ L) olan dikdörtgen bir kapta su yüzeyi düzlem kalarak çalkalanıyor. Enerji veya geri çağırıcı kuvvet yöntemiyle çalkalanma frekansının ω ≈ √(3gh / L²) olduğunu türetiniz.',
    givenLatex: '\\text{Kap boyu} = 2L, \\quad \\text{Derinlik} = h, \\quad y(x) = \\theta x \\; (-L \\le x \\le L)',
    targetLatex: '\\omega = \\sqrt{\\frac{3gh}{L^2}} \\implies \\nu = \\frac{1}{2\\pi}\\sqrt{\\frac{3gh}{L^2}}',
    principle: 'Eğilen su yüzeyinin yerçekimi potansiyel enerji artışı U = ½ ρ g w ∫ y²(x) dx ile yatay akış kinetik enerjisi K’nın eşitlenmesi.',
    startQ: 'Su yüzeyi y(x) = θx şeklinde eğildiğinde kaptaki suyun potansiyel enerji artışı U(θ) nedir?',
    optCorrect: 'U(\\theta) = \\int_{-L}^{L} \\frac{1}{2}\\rho g w y^2(x) dx = \\frac{1}{2}\\rho g w \\theta^2 \\int_{-L}^{L} x^2 dx = \\frac{1}{3}\\rho g w L^3 \\theta^2',
    optWrong1: 'U(\\theta) = \\rho g w L^2 \\theta',
    optWrong2: 'U(\\theta) = \\frac{1}{2}\\rho g w L h^2',
    steps: [
      {
        title: 'Kütle Merkezinin Yatay Hareketi ve Kinetik Enerji Yaklaşımı',
        hint: 'Su kütlesi M = 2ρwhL’nin yatay kütle merkezi x_cm = -L²θ / (3h) kadar kayar.',
        text: 'Crawford’un eşdeğer kütle merkezi yaklaşımıyla (x_cm = ∫ x y dm / M = L²θ / 3h), potansiyel enerji U = (3Mgh / 2L²) x_cm² ve kinetik enerji K ≈ ½ M ẋ_cm² yazılırsa:',
        math: 'U = \\frac{1}{2}\\left(\\frac{3 M g h}{L^2}\\right) x_{\\text{cm}}^2 \\implies k_{\\text{eff}} = \\frac{3 M g h}{L^2} \\implies \\omega = \\sqrt{\\frac{3gh}{L^2}}'
      }
    ],
    sceneMode: 'shm-phasor',
    abstractTab: 'potential',
    presetParams: { omega0: 1.9, amplitude: 1.1 },
    observe: 'Sığ su çalkantısında derinlik h arttıkça salınım frekansı √h ile artar.',
    finalBoxed: '\\nu \\approx \\frac{1}{2\\pi}\\sqrt{\\frac{3gh}{L^2}} \\quad (\\text{Tam hidrodinamik çözümde } \\sqrt{3} \\approx 1.732 \\text{ yerine } \\frac{\\pi}{2} \\approx 1.571 \\text{ gelir})',
    check: '[gh/L²] = (m/s² · m)/m² = s⁻².'
  },
  {
    num: '1.22',
    title: 'Cenevre Gölünde Seiche (Göl Çalkantısı) Periyodu',
    page: 'Sayfa 30',
    home: false,
    diff: 'Temel Türetim',
    tags: ['Seiche Dalgaları', 'Jeofizik', 'Duran Dalga'],
    statement: 'Uzunluğu 2L = 70 km ve ortalama derinliği h = 150 m olan Cenevre Gölü’nün temel çalkalanma (Seiche) periyodunu hesaplayınız.',
    givenLatex: '2L = 70\\times 10^3\\text{ m} \\implies L = 35\\times 10^3\\text{ m}, \\quad h = 150\\text{ m}, \\quad g = 9.8\\text{ m/s}^2',
    targetLatex: 'T = \\frac{2\\pi L}{\\sqrt{3gh}} \\approx 54\\text{ dk} \\quad \\left(\\text{veya Merian formülü } T = \\frac{4L}{\\sqrt{gh}} \\approx 61\\text{ dk}\\right)',
    principle: 'Kapalı bir göl havzası iki ucu kapalı bir duran dalga rezonatörüdür (λ₁ = 2 × Göl Boyu).',
    startQ: 'Problem 1.21’deki formüle L = 35.000 m ve h = 150 m koyduğumuzda periyot kaç saniye çıkar?',
    optCorrect: 'T = \\frac{2\\pi (35000)}{\\sqrt{3 \\times 9.8 \\times 150}} = \\frac{219911}{66.4} \\approx 3312\\text{ s} \\approx 55\\text{ dakika}',
    optWrong1: 'T \\approx 5\\text{ saniye}',
    optWrong2: 'T \\approx 24\\text{ saat}',
    steps: [
      {
        title: 'Sayısal Değer ve Gözlenen 73 Dakika ile Karşılaştırma',
        hint: 'Göl tabanının kıvrımlı ve uçlarda daha sığ olması periyodu biraz uzatır.',
        text: 'Düzgün dikdörtgen kesit yaklaşık 55–61 dakika verir; Cenevre Gölü’nde ölçülen gerçek Seiche periyodu 73 dakikadır:',
        math: 'T \\approx 55 - 61\\text{ dakika (yaklaşık 1 saat)}'
      }
    ],
    sceneMode: 'shm-phasor',
    abstractTab: 'phase',
    presetParams: { omega0: 1.5, amplitude: 1.2 },
    observe: 'Aynı harmonik osilatör denklemi mikroskobik CO₂ molekülünden (10¹³ Hz) 70 km’lik göle (0.0002 Hz) kadar tüm ölçekleri yönetir!',
    finalBoxed: 'T \\approx 55 - 61\\text{ dakika (Gözlenen: 73 dk)}',
    check: 'Boyut saniyedir.'
  }
];

export const CHAPTER_1_PROBLEMS: ProofCoachProblem[] = CH1_SEEDS.map((s) => ({
  id: `prob-${s.num.replace('.', '-')}`,
  chapter: 1,
  number: `Problem ${s.num}`,
  title: s.title,
  bookPage: `Berkeley Cilt 3 · ${s.page}`,
  isHomeExperiment: s.home,
  difficulty: s.diff,
  tags: s.tags,
  statement: s.statement,
  givenLatex: s.givenLatex,
  targetLatex: s.targetLatex,
  stage1Setup: {
    diagramDescription: `${s.title} için fiziksel serbest cisim ve koordinat kurulumu.`,
    physicalPrinciple: s.principle,
    startingEquationQuestion: s.startQ,
    options: [
      {
        latex: s.optCorrect,
        explanation: 'Doğru! Fiziksel korunum yasası ve işaret kurallarıyla tam uyumlu başlangıç denklemi.',
        isCorrect: true
      },
      {
        latex: s.optWrong1,
        explanation: 'Dikkat: Boyut veya işaret uyumsuzluğu var; geri çağırıcı terimleri kontrol et.',
        isCorrect: false
      },
      {
        latex: s.optWrong2,
        explanation: 'Bu ifade sınır koşullarını ve çiftlenim simetrisini sağlamıyor.',
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
    description: `${s.num} sonucunun sağ paneldeki 3B Fiziksel ve 2B Soyut uzayda canlı doğrulanması.`,
    chapter: 1,
    sceneMode: s.sceneMode,
    abstractTab: s.abstractTab,
    presetParams: s.presetParams,
    whatToObserve: s.observe
  },
  stage4ExamSheet: {
    fullAcademicSolutionMarkdown: `**Verilenler:** $${s.givenLatex}$  \n**İstenen:** $${s.targetLatex}$  \n**Temel İlke:** ${s.principle}`,
    finalBoxedLatex: s.finalBoxed,
    limitAndDimensionCheck: s.check,
    examGradingRubric: [
      'Serbest cisim diyagramı / devre döngüsü ve başlangıç diferansiyel denkleminin doğru kurulması (30p)',
      'Normal koordinat dönüşümü veya Taylor/trigonometrik sadeleştirme adımlarının eksiksiz gösterilmesi (40p)',
      'Sonuç formülünün ve birim/limit kontrolünün yazılması (30p)'
    ]
  }
}));

