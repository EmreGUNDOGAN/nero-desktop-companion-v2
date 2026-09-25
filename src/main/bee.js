// Arıcılık mini oyunu: oyun mantığı.
// Nero'nun ana sürecinde çalışır; oyun penceresi kapalıyken de üretim sürer.
// Durum JsonStore ile %APPDATA%\Nero\bee.json dosyasında tutulur.

const VILLAGE = require('./village-data');
const HOUR_MS = 60 * 60 * 1000;
const DAY_GAME_MS = 15 * 60 * 1000;      // 1 oyun günü = 1x hızda 15 gerçek dakika
const DAYS_PER_SEASON = 15;               // bir oyun ayı/mevsim dönemi = 15 gün
const SEASONS = ['ilkbahar', 'yaz', 'sonbahar', 'kis'];
const SEASON_NAMES = { ilkbahar: 'İlkbahar', yaz: 'Yaz', sonbahar: 'Sonbahar', kis: 'Kış' };
const UNATTENDED_CAP_MS = 2 * HOUR_MS;   // oyuna bakılmazsa en fazla 2 saatlik üretim birikir
const BASE_KG_PER_BEE_HOUR = 0.5;        // 1 arı, +%0 çiçekle saatte 0.5 kg (uzun vadeli tempo)
// 5.3.0: satın alma fiyatları %25 indirildi
const HIVE_COST = 900;
const START_COINS = 200;
const FLOWER_LIFE_DAYS = 30;             // çiçekler 2 oyun ayı/mevsim dönemi sonra solar
const OUT_OF_SEASON = 0.25;              // mevsimi dışındaki çiçek
const WINTER_FACTOR = 0.1;               // kışın (şurup 2. aşamada)
const ISLAND_RADIUS = 5;
const WINTER_SYRUP_FACTOR = 0.35;        // kışın şurubu olan kovan biraz daha üretir
const SYRUP_COST = 45;
const SYRUP_KG = 6;
const BREED_EVERY_DAYS = 2;
const WORK_MS = 5000;                    // arıcının kovanda çalışma süresi
const WALK_MS_PER_TILE = 700;

const SEASON_PRICE = { ilkbahar: 1, yaz: 0.85, sonbahar: 1, kis: 1.35 };
const STORAGE_UPGRADES = [
  { cap: 100, cost: 340 }, { cap: 200, cost: 900 }, { cap: 400, cost: 2250 },
  { cap: 800, cost: 4000 }, { cap: 1500, cost: 7500 }, { cap: 2500, cost: 12000 },
  { cap: 4000, cost: 20000 }, { cap: 6000, cost: 30000 }, { cap: 10000, cost: 50000 }
];
const HISTORY_DAYS = 7;
const ORDER_EVERY_REAL_MS = 5 * 60 * 1000; // gerçek zamanla 5 dakikada bir sipariş (oyun hızından bağımsız)
const ORDER_CATCHUP_MAX = 3;              // uzun aradan sonra tek açılışta en fazla 3 normal sipariş birikir
const ORDER_EVERY_MS = ORDER_EVERY_REAL_MS;
const ORDER_MAX = 5;
const ORDER_SWAP_COST = 19;
const ORDER_PENALTY = 0.2;
// Rakipler: her birinin kendi büyüme eğilimi (drift) ve oynaklığı (vol) var.
const RIVALS = [
  { id: 'ali', name: 'Temkinli Ali', style: 'Temkinli', drift: 0.015, vol: 0.02, luck: 0.03 },
  { id: 'kaya', name: 'Riskçi Kaya', style: 'Riskçi', drift: 0.02, vol: 0.08, luck: 0.14 },
  { id: 'nur', name: 'Dengeli Nur', style: 'Dengeli', drift: 0.018, vol: 0.04, luck: 0.07 }
];
const RIVAL_GOOD = ['büyük bir sipariş kaptı', 'yeni bir kovan kurdu', 'festivalde tüm balını sattı', 'yeni bir çayır satın aldı'];
const RIVAL_BAD = ['kovanları hastalandı', 'depoda bal döküldü', 'kötü bir hasat geçirdi', 'arıları kaçtı'];
const HISTORY_NW = 14;

// Hava durumu: her gün mevsime göre seçilir, üretimi etkiler
const WEATHER = {
  gunesli: { name: 'Güneşli', icon: '☀️', mult: 1.1 },
  bulutlu: { name: 'Bulutlu', icon: '⛅', mult: 1.0 },
  yagmurlu: { name: 'Yağmurlu', icon: '🌧️', mult: 0.6 },
  karli: { name: 'Karlı', icon: '🌨️', mult: 1.0 }
};
// Mevsime göre hava: yaz hep güneşli; sonbahar bulutlu/yağmurlu; ilkbahar karışık; kış yağmurlu/karlı
const WEATHER_ODDS = {
  ilkbahar: [['gunesli', 0.45], ['bulutlu', 0.3], ['yagmurlu', 0.25]],
  yaz: [['gunesli', 1]],
  sonbahar: [['bulutlu', 0.55], ['yagmurlu', 0.45]],
  kis: [['karli', 0.6], ['yagmurlu', 0.4]]
};

// Günlük görevler (gerçek güne bağlı, her gün 3 görev)
const QUEST_TYPES = [
  'harvest', 'harvestFlower', 'sell', 'deliver', 'candle', 'plant',
  'harvest2Hives', 'harvest3Hives', 'harvestSingle10', 'harvest2Types', 'harvest3Types', 'harvestPremium',
  'sell2Transactions', 'sell2Types', 'sellFlower', 'saleIncome', 'winterSell',
  'acceptOrder', 'deliver2', 'deliverNoPenalty', 'deliverPerson', 'deliverRegular',
  'buyBee', 'buy3Bees', 'syrup1', 'syrup2Hives', 'cureHive', 'changeBreed', 'queenUpgrade', 'hiveUpgrade', 'placeHive',
  'plant2', 'plantFlower', 'reviveFlower', 'plant2Types', 'sellCandles', 'candle2', 'claim2', 'merchantBuy', 'merchantSell'
];
const LABEL_DESIGNS = { klasik: 'Klasik', cicekli: 'Çiçekli', petek: 'Petek', sade: 'Sade' };
const LABEL_BONUS = 0.05;          // etiketli kavanoz: müdavimler %5 fazla öder
const HISTORY_KEEP = 20;
const SICK_CHANCE = 0.03;          // kış dışında, kovan başına günlük hastalanma ihtimali
const SICK_MULT = 0.7;             // hasta kovan %30 daha az üretir
const MEDICINE_COST = 90;
const SICK_IMMUNE_YEARS = 1;              // hastalık bittiğinde 1 oyun yılı bağışıklık başlar
const SICK_MIN_BEES = 4;                   // hastalık kovanı 4 arının altına düşüremez
const SICK_DEATH_DIVISOR = 3;              // vaka başına başlangıç arılarının yaklaşık üçte biri ölebilir
const BEE_PRICE_BASE_NUMBER = 7;           // ilk kovanda satın alınan ilk arı: 7. arı
const BEE_PRICE_BASE = 34;
const BEE_PRICE_STEP = 7;
const REVIVE_RATE = 0.1;                  // solan çiçeği canlandırmak: tohum fiyatının %10'u
const REJECT_REL = 0.2;                   // reddetmek ilişkiyi %2 azaltır (1 teslim = %10)
const NOTIF_KEEP = 20;

// Köylü mektupları: birkaç oyun gününde bir; yaklaşık üçte biri küçük hediye içerir
const LETTER_EVERY = [3, 5];
const LETTER_KEEP = 30;
// Belirli köylülere özel mektuplar; diğerleri rolüne göre genel mektuplardan seçer
const LETTERS_BY_NAME = {
  'Ayşe Teyze': ['Torunum doğdu! Mahalleye lokum dağıtıyorum, sana da ayırdım.', 'Eski bir tarif defteri buldum. Bal kurabiyesi var içinde, bir gün yaparım.', 'Pencereye yeni saksılar koydum. Arıların uğrarsa ayıp olmaz.'],
  'Mehmet Usta': ['Kovanlarının kapakları gıcırdıyorsa söyle, bir bakarım.', 'Bisikletimi tamir ettim. Artık yokuşları sadece ben değil o da sevmiyor.'],
  'Küçük Elif': ['Sana arı resmi çizdim! Kanatları biraz büyük oldu ama o uçabiliyor.', 'Okulda arıları anlattım. Herkes senin kovanlarını merak etti.', 'Bugün bir arı elime kondu ve ısırmadı. Arkadaş olduk sanırım.'],
  'Hacer Nine': ['Kapının önünde oturup arılarını izledim. Eskiden de böyle çalışırdık.', 'Ihlamur çayı demledim. Balın olsa daha güzel olurdu, haber veriyorum.'],
  'Muhtar Rıza': ['Köy toplantısında adın geçti. İyi anlamda, merak etme.', 'Muhtarlık panosuna senin balını astık. Herkes soruyor.'],
  'Balıkçı Kemal': ['Bu sabah gölde dev bir sazan gördüm. Tutamadım ama gördüm, o da bir şey.', 'Ağlarımı onarırken arılarının vızıltısı iyi geldi.'],
  'Kasabalı Cem': ['Kasabada senin balını anlattım. Bir arkadaşım ziyarete gelmek istiyor.', 'Köy hayatına alışıyorum. Sessizlik bazen fazla sessiz.'],
  'Öğretmen Selin': ['Öğrencilerim bal hakkında kompozisyon yazdı. En iyisi "Arılar yorulmaz mı?" diye bitiyordu.', 'Kütüphaneye arıcılık kitabı sipariş ettim. Bitince sana da veririm.'],
  'Doktor Aslı': ['Ballı ıhlamur boğaza iyi gelir. Reçete değil, tavsiye.', 'Köyde bu kış kimse hastalanmadı. Senin balının payı var bence.'],
  'Arıcı Hasan': ['Kovanlarının sesi iyi geliyor, bu işi seviyorsun belli.', 'Gençken bir kovanım oğul verdi, üç gün peşinden koştum. Sen koşma, izle.'],
  'Ressam Deniz': ['Arılarını resmettim. Bir tanesi fırçama kondu, imzası da resimde.', 'Gün batımında kovanların çok güzel görünüyor. Işık sende.'],
  'Kerim Dede ve Kedileri': ['Kedilerden biri bu sabah kovanının oraya gitmiş. Arılar kovalayınca geri döndü, gururu kırıldı.', 'Yedinci kedi yavruladı. Sekiz oldular. Hesap tutamıyorum artık.']
};
const LETTERS_GENERIC = [
  'Bugün pencereden arılarını izledim. Çok çalışkanlar, biraz kıskandım.',
  'Kahvaltıda senin balını yedik. Çocuklar kavanozu sıyırdı.',
  'Köyde yağmurdan sonra her yer mis gibi çiçek kokuyor.',
  'Geçen gün yolda karşılaştık ama selam veremedim, telaşlıydım. Selam olsun!',
  'Bahçemdeki çiçekler bu yıl çok güzel açtı. Arıların uğrarsa ikram ederim.',
  'Akşam yürüyüşünde kovanlarının oradan geçtim. Vızıltı insanı dinlendiriyor.'
];

// Ayarlar (oyun içi): görüntü, ses, bildirim tercihleri
const GAME_SETTINGS_DEFAULT = {
  graphics: 'dengeli', night: true, sfx: true, ambient: true,
  notify: { full: true, due: true, sick: true, winter: true, rival: true, merchant: true, letter: true }
};

// Gezgin satıcı: Seyyah Yakup
const MERCHANT_EVERY = [6, 9];            // 6-9 oyun gününde bir gelir
const MERCHANT_STAY = 2;                  // 2 oyun günü kalır
const MERCHANT_MAX_BUY = 2;               // bir ziyarette en fazla 2 farklı ürün (her birinden 1)
const MERCHANT_ITEMS = {
  surup:    { name: 'Ballı şurup', icon: '🍯', desc: 'Seçtiğin kovan 1 oyun günü boyunca %50 fazla üretir.', target: 'hive' },
  kralice:  { name: 'İndirimli kraliçe', icon: '👑', desc: 'Seçtiğin kovanın sıradaki kraliçe yükseltmesi %30 ucuza.', target: 'hiveQueen' },
  tohum:    { name: 'Tohum paketi', icon: '🌱', desc: '3 rastgele hediye tohum (papatya–lavanta arası).', target: null },
  dortMevsim: { name: 'Dört mevsim tohumu', icon: '🌸', desc: 'Seçtiğin tarh 30 gün boyunca mevsim dışı cezası almaz.', target: 'flower' },
  suru:     { name: 'Arı sürüsü', icon: '🐝', desc: 'Seçtiğin kovana 3 arı (kapasiteyi aşmaz).', target: 'hiveRoom' },
  sut:      { name: 'Arı sütü', icon: '🥛', desc: 'Seçtiğin kovan 3 gün boyunca her gün 1 arı doğurur (kışta da).', target: 'hive' },
  kit:      { name: 'Bakım kiti', icon: '🩺', desc: 'Hasta bir kovanı iyileştirir; bağışıklığı hemen başlatır.', target: 'hiveSick' },
  sandik:   { name: 'Depo sandığı', icon: '📦', desc: 'Depoya kalıcı +10 kg (en fazla 3 kez).', target: null },
  mum:      { name: 'Balmumu çuvalı', icon: '🕯️', desc: '1 kg balmumu.', target: null }
};

// Köylü hikâyeleri: ilişki %50'yi geçince açılır, 3 adım; son ödül küçük ve kalıcı (en fazla %5)
const STORIES = [
  { id: 'hasan', who: 'Arıcı Hasan', title: 'Ustalık yolu', bonus: 'prodAll', value: 0.03, bonusText: 'Tüm bal üretimi +%3',
    steps: [{ t: 'maxBees', n: 20, text: 'Bir kovanı 20 arıya çıkar' }, { t: 'harvestKg', f: 'kestane', n: 10, text: '10 kg kestane balı hasat et' }, { t: 'festivalCup', n: 1, text: 'Bal Festivali\'nde derece al' }] },
  { id: 'ayse', who: 'Ayşe Teyze', title: 'Eski tarifler', bonus: 'candle', value: 0.05, bonusText: 'Mum fiyatı +%5',
    steps: [{ t: 'deliverKg', f: 'papatya', n: 15, text: '15 kg papatya balı teslim et' }, { t: 'candles', n: 3, text: '3 mum yap' }, { t: 'deliverOrders', f: 'ihlamur', n: 1, text: 'Bir ıhlamur siparişini tamamla' }] },
  { id: 'kemal', who: 'Balıkçı Kemal', title: 'Göl kıyısında', bonus: 'yonca', value: 0.05, bonusText: 'Yonca balı fiyatı +%5',
    steps: [{ t: 'nearWater', n: 1, text: 'Göle bitişik bir kareye tarh ek' }, { t: 'harvestKg', f: 'yonca', n: 30, text: '30 kg yonca balı hasat et' }, { t: 'orders', n: 5, text: '5 sipariş teslim et' }] },
  { id: 'elif', who: 'Küçük Elif', title: 'Arı okulu', bonus: 'quest', value: 0.05, bonusText: 'Günlük görev ödülleri +%5',
    steps: [{ t: 'planted', f: 'aycicegi', n: 1, text: 'Ayçiçeği ek' }, { t: 'hiveNamed', n: 1, text: 'Bir kovana isim ver' }, { t: 'quests', n: 10, text: '10 günlük görev tamamla' }] },
  { id: 'selin', who: 'Öğretmen Selin', title: 'Bal Defteri', bonus: 'market', value: 0.02, bonusText: 'Pazar satışları +%2',
    steps: [{ t: 'pages', n: 4, text: 'Bal Defteri\'nde 4 sayfa aç' }, { t: 'label', n: 1, text: 'Kavanoz etiketi tasarla' }, { t: 'soldTypes', n: 3, text: '3 farklı baldan sat' }] },
  { id: 'riza', who: 'Muhtar Rıza', title: 'Köyün sesi', bonus: 'orderPay', value: 0.03, bonusText: 'Köylü siparişleri +%3 ödeme',
    steps: [{ t: 'village', n: 13, text: 'Köyü 13 yerleşimciye ulaştır' }, { t: 'muhtarlik', n: 1, text: 'Bir köy isteğini tamamla' }, { t: 'friends', n: 3, text: '3 köylüyle %50 ilişki kur' }] },
  { id: 'asli', who: 'Doktor Aslı', title: 'Sağlıklı kovanlar', bonus: 'medicine', value: 0.1, bonusText: 'İlaç %10 ucuz',
    steps: [{ t: 'syrup', n: 3, text: '3 kez şurup ver' }, { t: 'cured', n: 1, text: 'Hasta bir kovanı iyileştir' }, { t: 'cleanWinter', n: 1, text: 'Bir kışı arı kaybetmeden geçir' }] },
  { id: 'kerim', who: 'Kerim Dede ve Kedileri', title: 'Kedi dostu', bonus: 'sick', value: 0.05, bonusText: 'Hastalanma ihtimali %5 az',
    steps: [{ t: 'deliverTo', n: 3, text: 'Ona 3 sipariş teslim et' }, { t: 'deliverKg', f: 'ihlamur', n: 5, text: '5 kg ıhlamur balı teslim et' }, { t: 'relation', n: 80, text: 'Onunla %80 ilişkiye ulaş' }] }
];
const CLUSTER_BONUS = 0.15;        // aynı türden en az 3 tarh yan yanaysa
const AWAY_SUMMARY_MS = 20 * 60 * 1000; // 5.5.0: dönüş özeti 20 gerçek dakikadan sonra

// 1) Odak bonusu: Nero'da odaklandıkça arılar da coşar
const FOCUS_BOOST = 0.25;                 // +%25 üretim
const FOCUS_BOOST_MS = 60 * 60 * 1000;    // odak seansı başına 1 gerçek saat (üst üste eklenir, en fazla 4 saat)
const TODO_REWARD = 10;                   // Nero'da bitirilen her iş: +10 jeton

// 2) Müdavim köylüler
const HEART_EVERY = 2;                    // her 2 teslimde +1 kalp
const HEART_MAX = 5;
const HEART_BONUS = 0.02;                 // 5.5.0: kalp başına +%2 ödeme

// 3) Dekorlar (kare kaplamaz, karenin kenarına konur)
const DECOR = {
  cit:    { name: 'Çit', cost: 30, desc: 'Tarhların etrafına sevimli bir çit.' },
  bank:   { name: 'Bank', cost: 90, desc: 'Arıları seyretmek için.' },
  fener:  { name: 'Fener', cost: 115, desc: 'Akşamları sıcak bir ışık.' },
  kemer:  { name: 'Çiçekli kemer', cost: 225, desc: 'Adanın girişine romantik bir kemer.' },
  cesme:  { name: 'Çeşme', cost: 300, desc: 'Yanındaki tarhlar +%5 üretir.', bonus: 0.05 },
  kupa:   { name: 'Festival kupası', cost: 0, desc: 'Yıllık festivalde kazanıldı.', prize: true }
};

// 4) Yıllık bal festivali: kışın son 3 günü başvuru açık, yeni yılda sonuç
const FESTIVAL_OPEN_DAY = DAYS_PER_SEASON * 4 - 3; // yılın son 3 günü
const FESTIVAL_MAX_KG = 10;
const FESTIVAL_PRIZES = [{ coins: 1500, cup: 'altın' }, { coins: 800, cup: 'gümüş' }, { coins: 400, cup: 'bronz' }];

// 5) Arı ırkları
const BREEDS = {
  anadolu: { name: 'Anadolu arısı', desc: 'Çalışkan: +%10 üretim, ama hastalığa daha açık.', prod: 1.1, sick: 1.5, breedDays: 2, winter: 1 },
  kafkas:  { name: 'Kafkas arısı', desc: 'Soğuğa dayanıklı: kışın yarı yarıya az kayıp.', prod: 1.0, sick: 1.0, breedDays: 2, winter: 2 },
  italyan: { name: 'İtalyan arısı', desc: 'Hızlı çoğalır: her gün yeni arı, biraz daha az üretim.', prod: 0.95, sick: 1.0, breedDays: 1, winter: 1 }
};
const BREED_CHANGE_COST = 225;

// 6) Balmumu ve mum
const WAX_PER_KG = 0.05;                  // her 1 kg hasatta 50 g balmumu
const CANDLE_WAX = 0.5;                   // 1 mum = 0.5 kg balmumu
const CANDLE_PRICE = 45;

const CUSTOMERS = ['Ayşe Teyze', 'Mehmet Usta', 'Küçük Elif', 'Fırıncı Leyla', 'Kasabalı Cem', 'Hacer Nine', 'Muhtar Rıza',
  'Pastacı Nur', 'Öğretmen Selin', 'Balıkçı Kemal', 'Doktor Aslı', 'Bakkal Hüseyin'];

const QUEEN_NAMES = ['Genç Kraliçe', 'Sağlıklı Kraliçe', 'Güçlü Kraliçe', 'Olgun Kraliçe', 'Asil Kraliçe', 'Efsane Kraliçe'];
// Sıra: önce arı, sonra kovan, sonra yine arı. Arı üst sınırı 20.
const UPGRADES = [
  { type: 'queen', capBees: 12, cost: 340 },
  { type: 'hive', capKg: 30, cost: 565 },
  { type: 'queen', capBees: 14, cost: 900 },
  { type: 'hive', capKg: 40, cost: 1350 },
  { type: 'queen', capBees: 16, cost: 2025 },
  { type: 'hive', capKg: 60, cost: 2925 },
  { type: 'queen', capBees: 18, cost: 4275 },
  { type: 'queen', capBees: 20, cost: 6300 },
  { type: 'hive', capKg: 80, cost: 6750 }
];

const FLOWERS = {
  yonca:    { name: 'Yonca',    seed: 45,  buff: 0.00, price: 8,  seasons: ['ilkbahar', 'yaz'], color: '#C9E6A0', petal: '#FFFFFF' },
  papatya:  { name: 'Papatya',  seed: 90,  buff: 0.08, price: 12, seasons: ['ilkbahar', 'yaz'], color: '#F0DE7A', petal: '#FFFFFF' },
  aycicegi: { name: 'Ayçiçeği', seed: 190, buff: 0.18, price: 18, seasons: ['yaz'],             color: '#F5C851', petal: '#F7C22E' },
  kekik:    { name: 'Kekik',    seed: 340, buff: 0.30, price: 26, seasons: ['ilkbahar', 'yaz'], color: '#D8A6E0', petal: '#C98BD6' },
  lavanta:  { name: 'Lavanta',  seed: 600, buff: 0.45, price: 38, seasons: ['yaz'],             color: '#B79BE0', petal: '#9C7BD6' },
  ihlamur:  { name: 'Ihlamur',  seed: 975, buff: 0.65, price: 55, seasons: ['ilkbahar'],        color: '#9FD6C9', petal: '#F3EBAE' },
  kestane:  { name: 'Kestane',  seed: 1650, buff: 0.90, price: 80, seasons: ['sonbahar'],        color: '#B98A5A', petal: '#E8D9A0' }
};

// Eksenel altıgen koordinatları: bir karenin 6 komşusu
const DIRS = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
const key = (q, r) => `${q},${r}`;
const parse = (k) => k.split(',').map(Number);
const hexDist = (q, r) => (Math.abs(q) + Math.abs(r) + Math.abs(q + r)) / 2;

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

// Başlangıç adası: merkez 7 kare sahip; çevresi satın alınabilir; birkaç göl karesi.
function makeIsland() {
  const tiles = {};
  const water = new Set(['-3,1', '-3,2', '-2,2', '3,-3', '4,-3', '3,-2', '-1,-3', '0,-4']);
  for (let q = -ISLAND_RADIUS; q <= ISLAND_RADIUS; q++) {
    for (let r = -ISLAND_RADIUS; r <= ISLAND_RADIUS; r++) {
      if (hexDist(q, r) > ISLAND_RADIUS) continue;
      const k = key(q, r);
      const owned = hexDist(q, r) <= 1;
      tiles[k] = {
        q, r,
        kind: water.has(k) ? 'water' : 'grass',
        owned: owned && !water.has(k),
        item: null // { type: 'hive', id } | { type: 'flower', flower } | { type: 'house' }
      };
    }
  }
  // Ağaçlar: sahip olunmayan bazı çim karelerde süs
  const decor = ['-4,2', '2,-4', '4,-1', '-2,-2', '1,3', '-4,4', '3,1', '-1,4', '4,-4', '-5,3', '0,5', '5,-2'];
  for (const k of decor) if (tiles[k] && tiles[k].kind === 'grass' && !tiles[k].owned) tiles[k].tree = true;
  return tiles;
}

function newHive(id, name, bees, invested) {
  return { breed: 'anadolu', id, name, bees, capBees: 10, capKg: 20, honey: {}, level: 0, queens: 0, syrup: 0, beesBought: 0, invested, breedDay: 0, sickDeaths: 0 };
}

function freshState() {
  const tiles = makeIsland();
  tiles['0,0'].item = { type: 'house' };
  const hiveId = uid();
  tiles['1,0'].item = { type: 'hive', id: hiveId };
  tiles['1,-1'].item = { type: 'flower', flower: 'yonca' };
  tiles['0,1'].item = { type: 'flower', flower: 'papatya' };
  return {
    v: 1,
    coins: START_COINS,
    speed: 1,              // 0 = duraklatıldı
    gameMs: 0,             // toplam oyun zamanı
    tilesBought: 0,
    lastSeenAt: Date.now(),
    tiles,
    hives: {
      [hiveId]: newHive(hiveId, 'Kovan 1', 6, 0)
    },
    storage: {},           // bal türü -> kg
    storageBaseCap: 50,
    storageCap: 50,
    keeper: { queue: [], job: null },
    market: null,
    orders: { list: [], nextAt: ORDER_EVERY_MS },
    rivals: null,
    nwHistory: [],
    weather: 'gunesli',
    tutorialDone: false,
    counters: { produced: 0, born: 0, ordersIn: 0, died: 0 },
    away: null,
    focusBoostUntil: 0,
    focusDaily: { day: '', earnedMs: 0 },
    questRefresh: null,
    merchantEffects: {},
    marketLocks: {},
    customers: {},
    vouchers: {},
    wax: 0,
    candles: 0,
    festival: { entry: null, cups: [], lastYear: 0 }
  };
}

class BeeGame {
  constructor(store) {
    this.store = store;
    const s = store.get();
    this.state = s && s.v === 1 && s.tiles ? s : freshState();
    this.state.keeper = this.state.keeper || { queue: [], job: null };
    for (const h of Object.values(this.state.hives)) {
      Object.assign(h, { level: 0, queens: 0, syrup: 0, beesBought: 0, invested: 0, breedDay: 0, sickDeaths: 0, ...h });
      if (h.sick) {
        h.sickStartBees = h.sickStartBees || h.bees;
        h.sickDeaths = h.sickDeaths || 0;
        h.immuneUntil = 0;
      } else if (h.immuneUntil) {
        h.immuneUntil = Math.min(h.immuneUntil, this.dayIndex() + DAYS_PER_SEASON * 4 * SICK_IMMUNE_YEARS);
      }
    }
    this.state.weather = this.state.weather || 'gunesli';
    this.state.counters = this.state.counters || { produced: 0, born: 0, ordersIn: 0, died: 0 };
    if (this.state.tutorialDone === undefined) this.state.tutorialDone = true; // eski kayıtlarda tanıtım gösterilmez
    for (const t of Object.values(this.state.tiles)) {
      if (t.item && t.item.type === 'flower' && t.item.plantedDay === undefined) t.item.plantedDay = this.dayIndex();
    }
    Object.assign(this.state, {
      focusBoostUntil: 0, focusDaily: { day: '', earnedMs: 0 }, questRefresh: null, merchantEffects: {}, marketLocks: {},
      customers: {}, vouchers: {}, wax: 0, candles: 0,
      festival: { entry: null, cups: [], lastYear: 0 }, ...this.state
    });
    this.state.focusDaily = this.state.focusDaily || { day: '', earnedMs: 0 };
    this.state.merchantEffects = this.state.merchantEffects || {};
    this.state.marketLocks = this.state.marketLocks || {};
    for (const h of Object.values(this.state.hives)) if (!h.breed) h.breed = 'anadolu';
    Object.assign(this.state, {
      farmName: 'Nero Çiftliği', quests: null, questsDone: 0, milestones: {}, history: [],
      label: null, ledger: { honey: {}, harvests: 0, ordersDone: 0, candlesMade: 0, bestSale: null, maxBees: 0 },
      ...this.state
    });
    this.state.counters.earned = this.state.counters.earned || 0;
    if (!this.state.village) {
      // Eski kayıtlar: teslim edilen siparişlerden kabaca bir başlangıç miktarı çıkar
      const est = (this.state.ledger && this.state.ledger.ordersDone ? this.state.ledger.ordersDone : 0) * 6;
      this.state.village = { deliveredKg: est, arrived: [], slots: {}, special: {} };
    }
    this.checkVillage(true);
    if (!this.state.merchant) this.state.merchant = { nextDay: this.dayIndex() + 3, active: false, stock: [], bought: [], sandik: 0 };
    const crateBonus = (this.state.merchant.sandik || 0) * 10;
    if (this.state.storageBaseCap == null) this.state.storageBaseCap = Math.max(50, (this.state.storageCap || 50) - crateBonus);
    this.state.storageCap = this.state.storageBaseCap + crateBonus;
    if (!this.state.stories) this.state.stories = {};
    if (!this.state.letters) this.state.letters = [];
    if (this.state.nextLetterDay == null) this.state.nextLetterDay = this.dayIndex() + 2;
    const gs = this.state.gameSettings || {};
    this.state.gameSettings = { ...GAME_SETTINGS_DEFAULT, ...gs, notify: { ...GAME_SETTINGS_DEFAULT.notify, ...(gs.notify || {}) } };
    const L0 = this.state.ledger;
    Object.assign(L0, { deliveredKgBy: {}, deliveredOrdersBy: {}, deliveredTo: {}, syrupGiven: 0, cured: 0, cleanWinters: 0, muhtarlikDone: 0, ...L0 });
    this.state.winterDeaths = this.state.winterDeaths || 0;
    this.dayStart = { produced: this.state.counters.produced, earned: this.state.counters.earned };
    // Eski kayıtlarda mevsime uymayan hava kalmışsa (ör. kışın güneş) düzelt
    const season0 = this.calendar().season;
    if (!WEATHER_ODDS[season0].some(([w]) => w === this.state.weather)) this.rollWeather(season0, true);
    this.alertSeen = {};
    this.events = [];
    this.lastDay = this.dayIndex();
    if (!this.state.market) this.state.market = this.newMarket();
    if (!this.state.orders) this.state.orders = { list: [], nextAt: this.state.gameMs + ORDER_EVERY_MS };
    if (this.state.orders.nextAtReal && this.state.orders.nextAtReal > Date.now() + ORDER_EVERY_REAL_MS) this.state.orders.nextAtReal = Date.now() + ORDER_EVERY_REAL_MS;
    if (!this.state.rivals) {
      const base = this.netWorth();
      this.state.rivals = RIVALS.map((r, i) => ({ id: r.id, nw: Math.round(base * (0.85 + i * 0.12)), history: [], last: 0 }));
      this.state.nwHistory = [];
    }
    this.lastTickAt = Date.now();
    this.save();
  }

  save() { this.store.set(this.state); }

  dayIndex() { return Math.floor(this.state.gameMs / DAY_GAME_MS); }

  // --- Takvim -------------------------------------------------------------
  calendar() {
    const day = Math.floor(this.state.gameMs / DAY_GAME_MS);
    const seasonIdx = Math.floor(day / DAYS_PER_SEASON) % 4;
    const season = SEASONS[seasonIdx];
    return {
      day: (day % DAYS_PER_SEASON) + 1,
      daysPerMonth: DAYS_PER_SEASON,
      yearDays: DAYS_PER_SEASON * 4,
      year: Math.floor(day / (DAYS_PER_SEASON * 4)) + 1,
      season,
      seasonName: SEASON_NAMES[season],
      dayProgress: (this.state.gameMs % DAY_GAME_MS) / DAY_GAME_MS
    };
  }

  // --- Üretim ---------------------------------------------------------------
  // Kovanın komşu karelerindeki çiçekler
  flowersNear(hiveTileKey) {
    const [q, r] = parse(hiveTileKey);
    const out = [];
    for (const [dq, dr] of DIRS) {
      const t = this.state.tiles[key(q + dq, r + dr)];
      if (t && t.owned && t.item && t.item.type === 'flower' && !t.item.wilted) out.push(t.item.flower);
    }
    return out;
  }

  flowerTilesNear(hiveTileKey) {
    const [q, r] = parse(hiveTileKey);
    const out = [];
    for (const [dq, dr] of DIRS) {
      const k2 = key(q + dq, r + dr);
      const t = this.state.tiles[k2];
      if (t && t.owned && t.item && t.item.type === 'flower' && !t.item.wilted) out.push({ flower: t.item.flower, key: k2 });
    }
    return out;
  }

  // Aynı türden tarhlar birbirine değiyorsa ve grup en az 3 tarhsa bonus
  clusterBonus(flowerKey) {
    const start = this.state.tiles[flowerKey];
    if (!start || !start.item || start.item.type !== 'flower') return 0;
    const type = start.item.flower;
    const seen = new Set([flowerKey]);
    const stack = [flowerKey];
    while (stack.length && seen.size < 3) {
      const [q, r] = parse(stack.pop());
      for (const [dq, dr] of DIRS) {
        const k2 = key(q + dq, r + dr);
        const t = this.state.tiles[k2];
        if (!seen.has(k2) && t && t.owned && t.item && t.item.type === 'flower' && t.item.flower === type) { seen.add(k2); stack.push(k2); }
      }
    }
    return seen.size >= 3 ? CLUSTER_BONUS : 0;
  }

  hiveTileKey(hiveId) {
    for (const [k, t] of Object.entries(this.state.tiles)) {
      if (t.item && t.item.type === 'hive' && t.item.id === hiveId) return k;
    }
    return null;
  }

  // Bal türü başına saatlik üretim (kg/saat, 1x hızda)
  hiveRates(hiveId) {
    const hive = this.state.hives[hiveId];
    const k = this.hiveTileKey(hiveId);
    if (!hive || !k) return {};
    const near = this.flowerTilesNear(k);
    if (!near.length) return {};
    const season = this.calendar().season;
    const rates = {};
    const weather = WEATHER[this.state.weather] || WEATHER.bulutlu;
    const share = (hive.bees * BASE_KG_PER_BEE_HOUR) / near.length;
    for (const { flower: f, key: fk } of near) {
      const def = FLOWERS[f];
      const breed = BREEDS[hive.breed] || BREEDS.anadolu;
      const focus = Date.now() < (this.state.focusBoostUntil || 0) ? 1 + FOCUS_BOOST : 1;
      let mult = (1 + def.buff) * weather.mult * (hive.sick ? SICK_MULT : 1) * (1 + this.clusterBonus(fk) + this.fountainBonus(fk))
        * breed.prod * focus * (1 + this.fx('prodBonus') + this.storyFx('prodAll'))
        * (this.dayIndex() < (hive.boostUntilDay || 0) ? 1.5 : 1);
      const allSeason = (this.state.tiles[fk].item.allSeasonUntil || 0) > this.dayIndex();
      if (season === 'kis') mult *= hive.syrup > 0 ? WINTER_SYRUP_FACTOR : WINTER_FACTOR;
      else if (!def.seasons.includes(season) && !allSeason) mult *= OUT_OF_SEASON;
      rates[f] = (rates[f] || 0) + share * mult;
    }
    return rates;
  }

  hiveTotal(hive) { return Object.values(hive.honey).reduce((a, b) => a + b, 0); }

  // Gerçek zaman ilerledikçe çağrılır
  tick(now = Date.now(), speedCap = null) {
    const realDt = Math.max(0, Math.min(now - this.lastTickAt, 60 * 1000));
    this.lastTickAt = now;
    const keeperChanged = this.processKeeper(now);
    const selectedSpeed = this.state.speed;
    const speed = speedCap == null ? selectedSpeed : Math.min(selectedSpeed, speedCap);
    if (!speed || !realDt) return keeperChanged;

    const gameDt = realDt * speed;
    this.state.gameMs += gameDt;
    const today = this.dayIndex();
    while (this.lastDay < today) { this.lastDay += 1; this.onNewDay(this.lastDay); }
    this.processOrders();
    this.checkStories();

    // Oyuncu 2 saattir bakmadıysa üretim durur (takvim devam eder)
    if (now - this.state.lastSeenAt > UNATTENDED_CAP_MS) return true;

    const hours = gameDt / HOUR_MS;
    for (const hive of Object.values(this.state.hives)) {
      const rates = this.hiveRates(hive.id);
      let room = hive.capKg - this.hiveTotal(hive);
      if (room <= 0) continue;
      const total = Object.values(rates).reduce((a, b) => a + b, 0) * hours;
      if (total <= 0) continue;
      const scale = Math.min(1, room / total);
      for (const [f, rate] of Object.entries(rates)) {
        hive.honey[f] = (hive.honey[f] || 0) + rate * hours * scale;
      }
      this.state.counters.produced += total * scale;
    }
    return true;
  }

  markSeen() { this.state.lastSeenAt = Date.now(); }

  // --- Hastalık ---------------------------------------------------------------
  sicknessDeathLimit(h) {
    const start = Math.max(SICK_MIN_BEES, Number(h.sickStartBees) || h.bees || SICK_MIN_BEES);
    const roundedThird = Math.max(1, Math.round(start / SICK_DEATH_DIVISOR));
    return Math.max(0, Math.min(start - SICK_MIN_BEES, roundedThird));
  }

  recoverHive(h, dayIdx, notify = true) {
    h.sick = false;
    h.immuneUntil = dayIdx + DAYS_PER_SEASON * 4 * SICK_IMMUNE_YEARS;
    h.sickSince = null;
    h.sickStartBees = null;
    h.sickDeaths = 0;
    if (notify) this.events.push({ msg: `🛡️ ${h.name} hastalığı atlattı. 1 oyun yılı bağışık.` });
  }

  // --- Günlük olaylar: üreme, kış kaybı -------------------------------------
  onNewDay(dayIdx) {
    this.merchantDay(dayIdx);
    if (dayIdx >= this.state.nextLetterDay) this.sendLetter(dayIdx);
    const seasonToday = SEASONS[Math.floor(dayIdx / DAYS_PER_SEASON) % 4];
    const seasonYesterday = SEASONS[Math.floor((dayIdx - 1) / DAYS_PER_SEASON) % 4];
    if (seasonYesterday === 'kis' && seasonToday !== 'kis') {
      if (!this.state.winterDeaths) this.state.ledger.cleanWinters += 1;
      this.state.winterDeaths = 0;
    }
    for (const h of Object.values(this.state.hives)) {
      if ((h.milkDays || 0) > 0 && h.bees < h.capBees) { h.bees += 1; h.milkDays -= 1; this.state.counters.born += 1; this.events.push({ msg: `🥛 ${h.name}: arı sütü sayesinde yeni bir arı doğdu.` }); }
      else if ((h.milkDays || 0) > 0) h.milkDays -= 1;
    }
    const c = this.state.counters;
    this.state.history = [...(this.state.history || []), {
      day: dayIdx - 1,
      produced: Math.round((c.produced - this.dayStart.produced) * 10) / 10,
      earned: Math.round(c.earned - this.dayStart.earned)
    }].slice(-HISTORY_KEEP);
    this.dayStart = { produced: c.produced, earned: c.earned };
    this.rollMarket();
    this.rollRivals();
    const season = SEASONS[Math.floor(dayIdx / DAYS_PER_SEASON) % 4];
    this.rollWeather(season);
    if (dayIdx % (DAYS_PER_SEASON * 4) === 0 && dayIdx > 0) this.judgeFestival(Math.floor(dayIdx / (DAYS_PER_SEASON * 4)));
    for (const t of Object.values(this.state.tiles)) {
      if (t.item && t.item.type === 'flower' && !t.item.wilted && dayIdx - (t.item.plantedDay || 0) >= FLOWER_LIFE_DAYS + this.fx('flowerLife')) {
        t.item.wilted = true;
        this.events.push({ msg: `🥀 Bir ${FLOWERS[t.item.flower].name} tarhı soldu. Yeniden ekmen gerekiyor.`, err: true });
      }
    }
    for (const h of Object.values(this.state.hives)) {
      const k = this.hiveTileKey(h.id);
      if (!k) continue;
      const wasSick = !!h.sick;
      // Hastalık: 2 günde bir kayıp olabilir; tek vakada en fazla başlangıç nüfusunun yaklaşık üçte biri ölür.
      if (h.sick) {
        const limit = this.sicknessDeathLimit(h);
        if (h.bees <= SICK_MIN_BEES || (h.sickDeaths || 0) >= limit) {
          this.recoverHive(h, dayIdx);
        } else if ((dayIdx - h.sickSince) % 2 === 1 && h.bees > SICK_MIN_BEES) {
          h.bees -= 1;
          h.sickDeaths = (h.sickDeaths || 0) + 1;
          this.state.counters.died += 1;
          this.events.push({ msg: `${h.name}: hasta kovanda bir arı öldü.`, err: true });
          if (h.bees <= SICK_MIN_BEES || h.sickDeaths >= limit) this.recoverHive(h, dayIdx);
        }
      } else if (season !== 'kis' && h.bees > SICK_MIN_BEES && dayIdx >= (h.immuneUntil || 0) && Math.random() < SICK_CHANCE * (BREEDS[h.breed] || BREEDS.anadolu).sick * (1 - this.fx('sickReduce') - this.storyFx('sick'))) {
        h.sick = true;
        h.sickSince = dayIdx;
        h.sickStartBees = h.bees;
        h.sickDeaths = 0;
        h.immuneUntil = 0;
        this.events.push({ msg: `🤒 ${h.name} hastalandı! Üretim düştü, ilaç ver.`, err: true });
      }
      if (season === 'kis') {
        if (h.syrup >= 1) h.syrup -= 1;
        else if (h.bees > 1 && dayIdx % (BREEDS[h.breed] || BREEDS.anadolu).winter === 0) {
          h.bees -= 1;
          this.state.counters.died += 1;
          this.state.winterDeaths = (this.state.winterDeaths || 0) + 1;
          this.events.push({ msg: `${h.name}: kışın aç kalan bir arı öldü. Şurup ver!`, err: true });
        }
      } else if (!wasSick && h.bees < h.capBees && this.flowersNear(k).length && dayIdx - h.breedDay >= (BREEDS[h.breed] || BREEDS.anadolu).breedDays) {
        h.bees += 1;
        h.breedDay = dayIdx;
        this.state.counters.born += 1;
        this.events.push({ msg: `${h.name}: yeni bir arı doğdu 🐝` });
      }
    }
    this.save();
  }

  // --- 1) Nero'dan gelen odak ve iş ödülleri ----------------------------------
  focusCompleted(minutes) {
    if (!minutes || minutes < 10) return null;
    const now = Date.now();
    const day = this.todayKey();
    if (!this.state.focusDaily || this.state.focusDaily.day !== day) this.state.focusDaily = { day, earnedMs: 0 };
    const dailyMax = 4 * FOCUS_BOOST_MS;
    const dailyLeft = Math.max(0, dailyMax - this.state.focusDaily.earnedMs);
    if (!dailyLeft) {
      this.events.push({ msg: '🔥 Bugünkü 4 saatlik odak bonusu limitine ulaştın.' });
      this.save();
      return false;
    }
    const requested = FOCUS_BOOST_MS * (minutes / 25) + this.fx('focusExtraMin') * 60000;
    const activeRemaining = Math.max(0, (this.state.focusBoostUntil || 0) - now);
    const activeRoom = Math.max(0, 4 * FOCUS_BOOST_MS - activeRemaining);
    const granted = Math.max(0, Math.min(requested, dailyLeft, activeRoom));
    if (!granted) {
      this.events.push({ msg: '🔥 Odak bonusu şu an 4 saatlik aktif tavanda. Süre azaldığında yeniden ekleyebilirsin.' });
      this.save();
      return false;
    }
    const base = Math.max(now, this.state.focusBoostUntil || 0);
    this.state.focusBoostUntil = base + granted;
    this.state.focusDaily.earnedMs += granted;
    const grantedMin = Math.round(granted / 60000);
    const earnedMin = Math.round(this.state.focusDaily.earnedMs / 60000);
    this.events.push({ msg: `🔥 ${minutes} dakika odaklandın: Arıcılığa ${grantedMin} dk bonus eklendi. Bugün ${earnedMin}/240 dk.` });
    this.save();
    return true;
  }

  todoCompleted() {
    this.state.coins += TODO_REWARD;
    this.events.push({ msg: `✅ Nero'da bir iş bitirdin: +${TODO_REWARD} 🪙` });
    this.save();
  }

  // --- 2) Müdavim köylüler --------------------------------------------------------
  bond(who, extraRelationPoints = 0) {
    const c = this.state.customers[who] || { delivered: 0, hearts: 0 };
    c.delivered += 1 + Math.max(0, Number(extraRelationPoints) || 0) / 10;
    let hearts = Math.min(HEART_MAX, Math.floor(c.delivered / HEART_EVERY));
    if (this.fx('firstHeart') && c.delivered >= 1) hearts = Math.max(1, hearts);
    if (hearts > c.hearts) {
      c.hearts = hearts;
      this.events.push({ msg: `💛 ${who} ile aranız ısınıyor (${hearts}/${HEART_MAX} kalp). Siparişleri artık daha iyi ödüyor.` });
      if (hearts === 2 || hearts === 4) {
        const keys = Object.keys(FLOWERS);
        const f = keys[Math.min(keys.length - 1, 2 + Math.floor(Math.random() * (keys.length - 2)))];
        this.state.vouchers[f] = (this.state.vouchers[f] || 0) + 1;
        this.events.push({ msg: `✉️ ${who} bir teşekkür mektubu ve hediye gönderdi: 1 ${FLOWERS[f].name} tohumu 🎁` });
      }
    }
    this.state.customers[who] = c;
  }

  // --- 3) Dekorlar ----------------------------------------------------------------
  fountainBonus(flowerKey) {
    const [q, r] = parse(flowerKey);
    for (const [dq, dr] of [[0, 0], ...DIRS]) {
      const t = this.state.tiles[key(q + dq, r + dr)];
      if (t && t.decor === 'cesme') return DECOR.cesme.bonus;
    }
    return 0;
  }

  placeDecor(k, id) {
    const t = this.state.tiles[k];
    const d = DECOR[id];
    if (!d || d.prize) return this.fail('Bu dekor satılmıyor.');
    if (!t || !t.owned || t.kind !== 'grass') return this.fail('Dekor sadece adandaki karelere konur.');
    if (t.decor) return this.fail('Bu karede zaten bir dekor var.');
    const cost = this.decorCost(id);
    if (this.state.coins < cost) return this.fail(`Yeterli jeton yok (${cost} gerekli).`);
    this.state.coins -= cost;
    t.decor = id;
    this.save();
    return { ok: true, msg: `${d.name} yerleştirildi (-${cost} 🪙).` };
  }

  removeDecor(k) {
    const t = this.state.tiles[k];
    if (!t || !t.decor) return this.fail('Burada dekor yok.');
    const d = DECOR[t.decor];
    const back = Math.floor((d ? d.cost : 0) / 2);
    this.state.coins += back;
    t.decor = null;
    this.save();
    return { ok: true, msg: `Dekor kaldırıldı (+${back} 🪙).` };
  }

  // --- 4) Yıllık bal festivali --------------------------------------------------
  festivalOpen() { const d = this.dayIndex() % (DAYS_PER_SEASON * 4); return d >= FESTIVAL_OPEN_DAY; }

  enterFestival(flower, kg) {
    if (!this.festivalOpen()) return this.fail('Festival başvuruları kışın son 3 gününde açılır.');
    if (this.state.festival.entry) return this.fail('Bu yıl zaten başvurdun.');
    const have = this.state.storage[flower] || 0;
    const amount = Math.min(FESTIVAL_MAX_KG, Number(kg) || 0, have);
    if (!FLOWERS[flower] || amount < 1) return this.fail('Festivale en az 1 kg bal göndermelisin.');
    this.state.storage[flower] = have - amount;
    if (this.state.storage[flower] < 0.001) delete this.state.storage[flower];
    this.state.festival.entry = { flower, kg: amount, score: Math.round(amount * FLOWERS[flower].price * (1 + FLOWERS[flower].buff) * (1 + this.fx('festivalBonus'))) };
    this.save();
    return { ok: true, msg: `Festivale ${amount.toFixed(1)} kg ${FLOWERS[flower].name} balı gönderdin. Sonuç yeni yılda!` };
  }

  judgeFestival(year) {
    const f = this.state.festival;
    if (f.lastYear >= year) return;
    f.lastYear = year;
    const entry = f.entry;
    f.entry = null;
    if (!entry) { this.events.push({ msg: '🎪 Bal festivali bitti. Bu yıl katılmadın; seneye bekleriz!' }); return; }
    const rivals = this.state.rivals.map((r) => ({
      name: RIVALS.find((x) => x.id === r.id).name,
      score: Math.round(entry.score * (0.55 + Math.random() * 0.9))
    }));
    const all = [{ name: 'Sen', score: entry.score, me: true }, ...rivals].sort((a, b) => b.score - a.score);
    const place = all.findIndex((x) => x.me) + 1;
    const prize = FESTIVAL_PRIZES[place - 1];
    if (prize) {
      this.state.coins += prize.coins;
      f.cups.push({ year, cup: prize.cup, flower: entry.flower });
      this.state.counters.earned += prize.coins;
      this.milestone('ilk_kupa', 'İlk festival kupanı kazandın');
      this.events.push({ msg: `🏆 Bal festivalinde ${place}. oldun! ${prize.cup[0].toUpperCase() + prize.cup.slice(1)} kupa ve +${prize.coins} 🪙` });
    } else {
      this.events.push({ msg: `🎪 Bal festivalinde ${place}. oldun. Birinci: ${all[0].name}. Seneye!`, err: true });
    }
  }

  // --- 5) Arı ırkları -------------------------------------------------------------
  changeBreed(hiveId, breed) {
    const h = this.state.hives[hiveId];
    if (!h || !BREEDS[breed]) return this.fail('Geçersiz seçim.');
    if (h.breed === breed) return this.fail('Bu kovan zaten bu ırktan.');
    if (this.state.coins < BREED_CHANGE_COST) return this.fail(`Yeterli jeton yok (${BREED_CHANGE_COST} gerekli).`);
    this.state.coins -= BREED_CHANGE_COST;
    h.breed = breed;
    h.invested += BREED_CHANGE_COST;
    this.questEvent('breedChange', { hiveId, breed });
    this.save();
    return { ok: true, msg: `${h.name} artık ${BREEDS[breed].name} kraliçesiyle.` };
  }

  // --- 6) Balmumu ve mum ------------------------------------------------------
  makeCandle() {
    if (this.state.wax + 1e-6 < CANDLE_WAX) return this.fail(`Mum için ${CANDLE_WAX * 1000} g balmumu gerekli (${Math.round(this.state.wax * 1000)} g var).`);
    this.state.wax -= CANDLE_WAX;
    this.state.candles += 1;
    this.state.ledger.candlesMade += 1;
    this.questEvent('candleMake');
    this.questProgress('candle', 1);
    this.save();
    return { ok: true, msg: '🕯️ Bir mum yaptın.' };
  }

  candlePrice() {
    const season = this.calendar().season;
    return Math.round(CANDLE_PRICE * (season === 'kis' ? 1.4 : 1) * (this.state.market.mult.yonca || 1) * (1 + this.fx('candleBonus') + this.storyFx('candle')));
  }

  sellCandles() {
    if (this.state.candles < 1) return this.fail('Satacak mum yok.');
    const gain = this.state.candles * this.candlePrice();
    const n = this.state.candles;
    this.state.candles = 0;
    this.state.coins += gain;
    this.state.counters.earned += gain;
    this.questEvent('candleSell', { count: n, gain });
    this.save();
    return { ok: true, msg: `${n} mum satıldı (+${gain} 🪙).` };
  }

  // --- Köylü mektupları ------------------------------------------------------------
  sendLetter(day) {
    this.state.nextLetterDay = day + LETTER_EVERY[0] + Math.floor(Math.random() * (LETTER_EVERY[1] - LETTER_EVERY[0] + 1));
    const people = this.state.village.arrived.map((n) => VILLAGE[n - 1]).filter((e) => e.type === 'koylu');
    if (!people.length) return;
    const p = people[Math.floor(Math.random() * people.length)];
    const own = LETTERS_BY_NAME[p.name];
    const pool = own && Math.random() < 0.75 ? own : LETTERS_GENERIC;
    const text = pool[Math.floor(Math.random() * pool.length)];
    let gift = null;
    const r = Math.random();
    if (r < 0.2) gift = { coins: 10 + Math.floor(Math.random() * 3) * 10 };
    else if (r < 0.3) gift = { wax: 0.1 };
    else if (r < 0.34) gift = { seed: ['papatya', 'aycicegi', 'kekik'][Math.floor(Math.random() * 3)] };
    const letter = { id: uid(), from: p.name, role: p.role, text, gift, day, read: false, claimed: false };
    this.state.letters = [...this.state.letters, letter].slice(-LETTER_KEEP);
    this.events.push({ msg: `✉️ ${p.name} sana bir mektup gönderdi${gift ? ' (içinde küçük bir hediye var)' : ''}.`, go: { to: 'letters' } });
  }

  readLetter(id) {
    const l = this.state.letters.find((x) => x.id === id);
    if (!l) return this.fail('Mektup bulunamadı.');
    l.read = true;
    let msg = '';
    if (l.gift && !l.claimed) {
      l.claimed = true;
      if (l.gift.coins) { this.state.coins += l.gift.coins; msg = `+${l.gift.coins} 🪙`; }
      if (l.gift.wax) { this.state.wax += l.gift.wax; msg = '+100 g balmumu'; }
      if (l.gift.seed) { this.state.vouchers[l.gift.seed] = (this.state.vouchers[l.gift.seed] || 0) + 1; msg = `1 ${FLOWERS[l.gift.seed].name} tohumu 🎁`; }
    }
    this.save();
    return { ok: true, msg: msg ? `${l.from} hediyesi: ${msg}` : '' };
  }

  // --- Oyun ayarları ---------------------------------------------------------------
  setGameSetting(keyName, value) {
    const s = this.state.gameSettings;
    if (keyName === 'graphics' && ['yuksek', 'dengeli', 'hafif'].includes(value)) s.graphics = value;
    else if (['night', 'sfx', 'ambient'].includes(keyName)) s[keyName] = !!value;
    else if (keyName.startsWith('notify.') && keyName.slice(7) in s.notify) s.notify[keyName.slice(7)] = !!value;
    else return this.fail('Geçersiz ayar.');
    this.save();
    return { ok: true, msg: '' };
  }

  // --- Toplu işlemler ----------------------------------------------------------
  syrupAllCost() { return this.syrupCost() * Object.keys(this.state.hives).length; }

  giveSyrupAll() {
    const hives = Object.values(this.state.hives);
    const cost = this.syrupAllCost();
    if (this.state.coins < cost) return this.fail(`Yeterli jeton yok (${cost} gerekli).`);
    this.state.coins -= cost;
    for (const h of hives) { h.syrup += SYRUP_KG; this.state.ledger.syrupGiven += 1; }
    this.save();
    return { ok: true, msg: `${hives.length} kovana şurup verildi: +${SYRUP_KG} kg kış erzakı (-${cost} 🪙).` };
  }

  // Kabul edilmiş ve depodan hemen karşılanabilen siparişlerin hepsini teslim et
  deliverReady() {
    const ready = this.state.orders.list.filter((o) => o.status === 'accepted');
    let n = 0;
    let gain = 0;
    for (const o of ready) {
      const before = this.state.coins;
      const r = this.deliverOrder(o.id);
      if (r.ok) { n += 1; gain += this.state.coins - before; }
    }
    if (!n) return this.fail('Depodan hemen teslim edilebilecek kabul edilmiş sipariş yok.');
    return { ok: true, msg: `${n} sipariş teslim edildi (+${gain} 🪙).` };
  }

  // --- Nero'dan durum ipuçları --------------------------------------------------------
  hints() {
    const out = [];
    const used = Object.values(this.state.storage).reduce((a, b) => a + b, 0);
    if (used >= this.state.storageCap * 0.9) out.push({ id: 'storage', text: `Depo %${Math.round((used / this.state.storageCap) * 100)} dolu. Satmazsan arıcı hasat edemeyecek.`, go: { to: 'market' } });
    for (const h of Object.values(this.state.hives)) {
      const k = this.hiveTileKey(h.id);
      if (k && !this.flowersNear(k).length) out.push({ id: `nof:${h.id}`, text: `Yanında hiç çiçek olmayan bir kovan var: ${h.name}. Bal üretmiyor.`, go: { to: 'hive', id: h.id } });
    }
    const ready = this.state.orders.list.filter((o) => (this.state.storage[o.flower] || 0) + 1e-6 >= o.kg).length;
    if (ready) out.push({ id: `ready:${ready}`, text: `${ready} siparişin depodan hemen karşılanabilir.`, go: { to: 'orders' } });
    const wilted = Object.values(this.state.tiles).filter((t) => t.item && t.item.type === 'flower' && t.item.wilted).length;
    if (wilted) out.push({ id: `wilt:${wilted}`, text: `${wilted} tarh soldu. Tohumun %10'una canlandırabilirsin.` });
    if (this.calendar().season === 'sonbahar' && this.calendar().day >= 12 && Object.values(this.state.hives).some((h) => h.syrup < 1)) {
      out.push({ id: 'prewinter', text: 'Kış yaklaşıyor ve bazı kovanlarda erzak yok. Toplu şurup verebilirsin.', go: { to: 'hives' } });
    }
    return out;
  }

  // --- Gezgin satıcı: Seyyah Yakup ---------------------------------------------
  merchantDay(day) {
    const m = this.state.merchant;
    if (m.active && day >= m.until) {
      m.active = false;
      m.stock = [];
      m.nextDay = day + MERCHANT_EVERY[0] + Math.floor(Math.random() * (MERCHANT_EVERY[1] - MERCHANT_EVERY[0] + 1));
      this.events.push({ msg: '🛒 Seyyah Yakup köyden ayrıldı. Bir sonraki ziyaretini bekle.' });
      return;
    }
    if (m.active && day === m.until - 1) this.events.push({ msg: '🛒 Seyyah Yakup yarın gidiyor! Almak istediğin bir şey varsa acele et.' });
    if (!m.active && day >= m.nextDay) this.merchantArrive(day);
  }

  merchantArrive(day) {
    const m = this.state.merchant;
    const pool = Object.keys(MERCHANT_ITEMS).filter((k) => k !== 'sandik' || (m.sandik || 0) < 3);
    const stock = [];
    while (stock.length < 4 && pool.length) stock.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    const planted = this.plantedFlowers();
    const wants = (planted.length ? planted : Object.keys(FLOWERS))[Math.floor(Math.random() * (planted.length || 7))];
    // Boş bir köy karesi: arabası orada durur
    const used = new Set(Object.values(this.state.village.slots));
    const free = this.ringKeys(ISLAND_RADIUS + 1).filter((k) => !used.has(k));
    Object.assign(m, {
      active: true, arrivedDay: day, until: day + MERCHANT_STAY, stock: stock.map((id) => ({ id, sold: false })), bought: [],
      wants, wantsLeft: 10, slot: free.length ? free[Math.floor(Math.random() * free.length)] : null
    });
    this.events.push({ msg: `🛒 Gezgin satıcı Seyyah Yakup köye geldi! 2 gün kalacak. ${FLOWERS[wants].name} balı da arıyor.` });
  }

  merchantPrice(id, target) {
    const h = target && this.state.hives[target];
    switch (id) {
      case 'surup': return 110;
      case 'kralice': { const u = h && this.nextUpgrade(h); return u && u.type === 'queen' ? Math.round(u.cost * 0.7) : null; }
      case 'tohum': return Math.round((this.seedCost('papatya') + this.seedCost('aycicegi') + this.seedCost('kekik')) * 0.6);
      case 'dortMevsim': { const t = target && this.state.tiles[target]; return t && t.item && t.item.type === 'flower' ? this.seedCost(t.item.flower) * 2 : null; }
      case 'suru': { const hh = h || Object.values(this.state.hives)[0]; return Math.round(this.beePrice(hh) * 3 * 0.7); }
      case 'sut': return 150;
      case 'kit': return Math.round(this.medicineCost() * 0.6);
      case 'sandik': return 190;
      case 'mum': return 45;
      default: return null;
    }
  }

  merchantBuy(id, target) {
    const m = this.state.merchant;
    if (!m.active) return this.fail('Satıcı şu an köyde değil.');
    const item = m.stock.find((x) => x.id === id);
    if (!item || item.sold) return this.fail('Bu ürün kalmadı.');
    if (m.bought.length >= MERCHANT_MAX_BUY) return this.fail(`Bu ziyarette en fazla ${MERCHANT_MAX_BUY} farklı ürün alabilirsin.`);
    const def = MERCHANT_ITEMS[id];
    const h = target && this.state.hives[target];
    if (def.target && def.target.startsWith('hive') && !h) return this.fail('Önce bir kovan seç.');
    if (def.target === 'hiveQueen' && !(this.nextUpgrade(h) && this.nextUpgrade(h).type === 'queen')) return this.fail('Bu kovanın sıradaki yükseltmesi kraliçe değil.');
    if (def.target === 'hiveRoom' && h.bees >= h.capBees) return this.fail('Bu kovan dolu.');
    if (def.target === 'hiveSick' && !h.sick) return this.fail('Bu kovan hasta değil.');
    if (def.target === 'flower') { const t = this.state.tiles[target]; if (!t || !t.item || t.item.type !== 'flower') return this.fail('Önce bir tarh seç.'); }
    const price = this.merchantPrice(id, target);
    if (price == null) return this.fail('Bu ürün seçtiğin şeye uygulanamaz.');
    if (this.state.coins < price) return this.fail(`Yeterli jeton yok (${price} gerekli).`);
    this.state.coins -= price;
    item.sold = true;
    m.bought.push(id);
    const day = this.dayIndex();
    let msg = '';
    if (id === 'surup') { h.boostUntilDay = day + 1; msg = `${h.name} 1 gün boyunca %50 fazla üretecek.`; }
    if (id === 'kralice') { const u = this.nextUpgrade(h); h.level += 1; h.queens += 1; h.capBees = u.capBees; h.invested += price; msg = `${QUEEN_NAMES[h.queens]} geldi! (${h.name})`; }
    if (id === 'tohum') {
      const got = [];
      for (let i = 0; i < 3; i++) { const f = ['papatya', 'aycicegi', 'kekik', 'lavanta'][Math.floor(Math.random() * 4)]; this.state.vouchers[f] = (this.state.vouchers[f] || 0) + 1; got.push(FLOWERS[f].name); }
      msg = `Hediye tohumlar: ${got.join(', ')}.`;
    }
    if (id === 'dortMevsim') { this.state.tiles[target].item.allSeasonUntil = day + 30; msg = 'Tarh 30 gün boyunca mevsim dışı cezası almayacak.'; }
    if (id === 'suru') { const add = Math.min(3, h.capBees - h.bees); h.bees += add; msg = `${h.name}: +${add} arı.`; }
    if (id === 'sut') { h.milkDays = 3; msg = `${h.name} 3 gün boyunca her gün yeni bir arı doğuracak.`; }
    if (id === 'kit') { this.recoverHive(h, day, false); this.state.ledger.cured += 1; msg = `${h.name} iyileşti ve 1 oyun yılı bağışık oldu.`; }
    if (id === 'sandik') { m.sandik = (m.sandik || 0) + 1; this.state.storageCap = this.state.storageBaseCap + m.sandik * 10; msg = 'Depo kalıcı olarak +10 kg büyüdü.'; }
    if (id === 'mum') { this.state.wax += 1; msg = '+1 kg balmumu.'; }
    this.save();
    return { ok: true, msg: `🛒 ${def.name} alındı (-${price} 🪙). ${msg}` };
  }

  merchantSell(kg) {
    const m = this.state.merchant;
    if (!m.active) return this.fail('Satıcı şu an köyde değil.');
    const f = m.wants;
    const have = this.state.storage[f] || 0;
    const amount = Math.min(m.wantsLeft, have, kg === 'all' ? Infinity : Number(kg) || 0);
    if (amount < 0.05) return this.fail(`Depoda ${FLOWERS[f].name} balı yok ya da satıcı yeterince aldı.`);
    const gain = Math.round(amount * this.price(f) * 1.4);
    this.state.storage[f] = have - amount;
    if (this.state.storage[f] < 0.001) delete this.state.storage[f];
    m.wantsLeft -= amount;
    this.state.coins += gain;
    this.state.counters.earned += gain;
    const L = this.ledgerHoney(f); L.soldKg += amount; L.earned += gain;
    this.save();
    return { ok: true, msg: `Seyyah Yakup ${amount.toFixed(1)} kg ${FLOWERS[f].name} balını aldı (+${gain} 🪙).` };
  }

  merchantView() {
    const m = this.state.merchant;
    if (!m.active) return { active: false };
    return {
      active: true, slot: m.slot, leftMs: Math.max(0, m.until * DAY_GAME_MS - this.state.gameMs), maxBuy: MERCHANT_MAX_BUY, bought: m.bought.length,
      wants: m.wants, wantsLeft: Math.round(m.wantsLeft * 10) / 10, wantsPrice: Math.round(this.price(m.wants) * 1.4 * 10) / 10,
      stock: m.stock.map((x) => ({ ...x, ...MERCHANT_ITEMS[x.id], basePrice: this.merchantPrice(x.id, Object.keys(this.state.hives)[0]) }))
    };
  }

  // --- Köylü hikâyeleri --------------------------------------------------------------
  storyFx(key) {
    let v = 0;
    for (const s of STORIES) if (s.bonus === key && this.state.stories[s.id] && this.state.stories[s.id].done) v += s.value;
    return v;
  }

  // Adımın ölçtüğü şeyin şu anki değeri (baz alınarak ilerleme hesaplanır)
  storyMetric(step, who) {
    const L = this.state.ledger;
    switch (step.t) {
      case 'maxBees': return Math.max(0, ...Object.values(this.state.hives).map((h) => h.bees));
      case 'harvestKg': return (L.honey[step.f] || {}).kg || 0;
      case 'festivalCup': return (this.state.festival.cups || []).length;
      case 'deliverKg': return L.deliveredKgBy[step.f] || 0;
      case 'deliverOrders': return L.deliveredOrdersBy[step.f] || 0;
      case 'candles': return L.candlesMade || 0;
      case 'orders': return L.ordersDone || 0;
      case 'quests': return this.state.questsDone || 0;
      case 'syrup': return L.syrupGiven || 0;
      case 'cured': return L.cured || 0;
      case 'cleanWinter': return L.cleanWinters || 0;
      case 'muhtarlik': return L.muhtarlikDone || 0;
      case 'deliverTo': return L.deliveredTo[who] || 0;
      default: return 0;
    }
  }

  // Durum adımları (baz gerekmez)
  storyState(step, who) {
    switch (step.t) {
      case 'nearWater': return Object.values(this.state.tiles).some((t) => t.owned && t.item && t.item.type === 'flower' && DIRS.some(([dq, dr]) => { const n = this.state.tiles[key(t.q + dq, t.r + dr)]; return n && n.kind === 'water'; })) ? 1 : 0;
      case 'planted': return this.plantedFlowers().includes(step.f) ? 1 : 0;
      case 'hiveNamed': return Object.values(this.state.hives).some((h) => !/^Kovan \d+$/.test(h.name)) ? 1 : 0;
      case 'pages': return Object.values(this.state.ledger.honey).filter((x) => x.first).length;
      case 'label': return this.state.label ? 1 : 0;
      case 'soldTypes': return Object.values(this.state.ledger.honey).filter((x) => x.soldKg > 0).length;
      case 'village': return this.state.village.arrived.length;
      case 'friends': return Object.keys(this.state.customers).filter((n) => this.relation(n) >= 50).length;
      case 'relation': return this.relation(who);
      case 'maxBees': return this.storyMetric(step, who);
      default: return null;
    }
  }

  storyProgress(s, st) {
    const step = s.steps[st.step];
    const stateVal = this.storyState(step, s.who);
    if (stateVal !== null) return Math.min(step.n, stateVal);
    return Math.min(step.n, this.storyMetric(step, s.who) - (st.base || 0));
  }

  checkStories() {
    const arrivedNames = new Set(this.villagePeople().map((p) => p.name));
    for (const s of STORIES) {
      let st = this.state.stories[s.id];
      if (!st) {
        if (!arrivedNames.has(s.who) || this.relation(s.who) < 50) continue;
        st = this.state.stories[s.id] = { step: 0, base: this.storyMetric(s.steps[0], s.who), done: false };
        this.events.push({ msg: `📖 ${s.who} sana bir hikâye anlatmak istiyor: "${s.title}". İlk adım: ${s.steps[0].text}.` });
      }
      if (st.done) continue;
      if (this.storyProgress(s, st) < s.steps[st.step].n) continue;
      // Adım tamam: ödül
      const last = st.step === s.steps.length - 1;
      if (last) {
        st.done = true;
        this.state.coins += 150;
        this.events.push({ msg: `🌟 "${s.title}" hikâyesi tamamlandı! ${s.who}: +150 🪙 ve kalıcı ödül: ${s.bonusText}.` });
        this.state.milestones[`hikaye_${s.id}`] = Date.now(); // rozetlere bağlanabilsin diye sessiz kayıt
      } else {
        if (st.step === 0) { this.state.coins += 60; this.events.push({ msg: `📖 ${s.who}: "${s.steps[0].text}" tamam! +60 🪙. Sıradaki: ${s.steps[1].text}.` }); }
        else {
          const f = ['papatya', 'aycicegi', 'kekik'][Math.floor(Math.random() * 3)];
          this.state.vouchers[f] = (this.state.vouchers[f] || 0) + 1;
          this.state.coins += 80;
          this.events.push({ msg: `📖 ${s.who}: "${s.steps[1].text}" tamam! +80 🪙 ve 1 ${FLOWERS[f].name} tohumu. Son adım: ${s.steps[2].text}.` });
        }
        st.step += 1;
        st.base = this.storyMetric(s.steps[st.step], s.who);
      }
    }
  }

  storiesView() {
    return STORIES.map((s) => {
      const st = this.state.stories[s.id];
      return {
        id: s.id, who: s.who, title: s.title, bonusText: s.bonusText,
        unlocked: !!st, done: !!(st && st.done),
        step: st ? Math.min(st.step, s.steps.length - 1) : 0,
        progress: st && !st.done ? this.storyProgress(s, st) : 0,
        steps: s.steps.map((x) => ({ text: x.text, n: x.n }))
      };
    });
  }

  effectsView() {
    const day = this.dayIndex();
    const effects = [];
    for (const s of STORIES) {
      const st = this.state.stories[s.id];
      if (st && st.done) effects.push({ id: `story:${s.id}`, icon: 'story', title: s.bonusText, source: `${s.who} · ${s.title}`, permanent: true });
    }
    for (const n of this.state.village.arrived) {
      const e = VILLAGE[n - 1];
      if (e.effect && e.effectText) effects.push({ id: `village:${e.n}`, icon: 'building', title: e.effectText, source: e.name, permanent: true });
    }
    for (const h of Object.values(this.state.hives)) {
      if (day < (h.boostUntilDay || 0)) effects.push({ id: `syrup:${h.id}`, icon: 'syrup', title: '+%50 bal üretimi', source: `${h.name} · Ballı şurup`, daysLeft: h.boostUntilDay - day });
      if ((h.milkDays || 0) > 0) effects.push({ id: `milk:${h.id}`, icon: 'milk', title: 'Her gün +1 arı', source: `${h.name} · Arı sütü`, daysLeft: h.milkDays });
      if (!h.sick && day < (h.immuneUntil || 0)) effects.push({ id: `immune:${h.id}`, icon: 'immunity', title: 'Hastalığa karşı bağışık', source: h.name, daysLeft: h.immuneUntil - day });
    }
    for (const [k, t] of Object.entries(this.state.tiles)) {
      if (t.item && t.item.type === 'flower' && day < (t.item.allSeasonUntil || 0)) {
        effects.push({ id: `season:${k}`, icon: 'season', title: 'Mevsim dışı üretim cezası yok', source: `${FLOWERS[t.item.flower].name} tarhı · Dört mevsim`, daysLeft: t.item.allSeasonUntil - day });
      }
    }
    const crates = (this.state.merchant && this.state.merchant.sandik) || 0;
    if (crates) effects.push({ id: 'storage:crates', icon: 'storage', title: `+${crates * 10} kg depo kapasitesi`, source: `Seyyah Yakup · ${crates} depo sandığı`, permanent: true });
    return {
      focus: { active: Date.now() < (this.state.focusBoostUntil || 0), icon: 'focus', title: 'Odak Bonusu', text: `+%${Math.round(FOCUS_BOOST * 100)} bal üretimi`, leftMs: Math.max(0, (this.state.focusBoostUntil || 0) - Date.now()) },
      list: effects
    };
  }

  // --- Köy ------------------------------------------------------------------------
  // Teslim edilen toplam bala göre köyde kaç yerleşimci olmalı
  villageTarget(kg) {
    // Başlangıçta 6 yerleşimci; sonra her eşikte yalnızca 1 kişi gelir
    let n = 6;
    if (kg >= 50) n += 1;
    if (kg >= 150) n += 1;
    if (kg >= 400) n += 1;
    if (kg >= 1000) n += 1 + Math.floor((kg - 1000) / 500);
    return Math.min(VILLAGE.length, n);
  }

  // Adanın (yarıçap 5) etrafındaki halka: yarıçap 6 (36 kare) ve 7 (42 kare)
  ringKeys(radius) {
    const out = [];
    let q = -radius;
    let r = radius;
    for (const [dq, dr] of [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]]) {
      for (let i = 0; i < radius; i++) { out.push(key(q, r)); q += dq; r += dr; }
    }
    return out;
  }

  // n. yerleşimcinin karesi: halkanın etrafına aralıklı dağılır (7 ve 11 adımla)
  villageSlot(n) {
    if (n <= 36) { const ring = this.ringKeys(ISLAND_RADIUS + 1); return ring[((n - 1) * 7) % 36]; }
    const ring = this.ringKeys(ISLAND_RADIUS + 2);
    return ring[((n - 37) * 11) % 42];
  }

  checkVillage(silent = false) {
    const v = this.state.village;
    const target = this.villageTarget(v.deliveredKg);
    while (v.arrived.length < target) {
      const e = VILLAGE[v.arrived.length];
      v.arrived.push(e.n);
      v.slots[e.n] = this.villageSlot(e.n);
      if (e.effect === 'firin' || e.effect === 'pastane' || e.effect === 'muhtarlik') v.special[e.effect] = this.dayIndex();
      if (silent) continue;
      if (e.type === 'koylu') this.events.push({ msg: `🏘️ Köye yeni biri taşındı: ${e.name} (${e.role}). ${FLOWERS[e.fav].name} balını çok sever.`, villager: e.n });
      else this.events.push({ msg: `${e.type === 'dukkan' ? '🏪' : '🏛️'} Köyde ${e.name} açıldı! ${e.effectText}`, villager: e.n });
      if (v.arrived.length === 37) this.events.push({ msg: '🏘️ Köyün ilk halkası doldu! Artık ikinci halkaya yerleşiyorlar.' });
      if (v.arrived.length === VILLAGE.length) this.milestone('koy_tamam', 'Köy tamamlandı: 78 yerleşimcinin hepsi geldi');
    }
    for (const [lvl, kg] of [[1, 50], [2, 150], [3, 400], [4, 1000]]) if (v.deliveredKg >= kg && !silent) this.milestone(`koy_seviye_${lvl}`, `Köy ${lvl}. seviyeye ulaştı`);
  }

  // Köyde yaşayıp sipariş verebilen kişiler (köylüler + dükkân sahipleri)
  villagePeople() {
    const out = [];
    for (const n of this.state.village.arrived) {
      const e = VILLAGE[n - 1];
      if (e.type === 'koylu') out.push({ name: e.name, fav: e.fav });
      else if (e.owner) out.push({ name: e.owner, fav: null });
    }
    return out;
  }

  // Açılmış yapıların etkileri
  fx(effect) {
    let v = 0;
    for (const n of this.state.village.arrived) { const e = VILLAGE[n - 1]; if (e.effect === effect) v += e.value; }
    return v;
  }

  seedCost(f) { return Math.round(FLOWERS[f].seed * (1 - this.fx('seedDiscount'))); }
  reviveCost(f) { return Math.max(1, Math.round(this.seedCost(f) * REVIVE_RATE)); }
  decorCost(id) { return Math.round(DECOR[id].cost * (1 - this.fx('decorDiscount'))); }
  syrupCost() { return Math.round(SYRUP_COST * (1 - this.fx('syrupDiscount'))); }
  medicineCost() { return Math.round(MEDICINE_COST * (1 - this.fx('medicineDiscount') - this.storyFx('medicine'))); }
  orderMax() { return ORDER_MAX + this.fx('orderMax'); }
  seasonOrderMult() {
    const s = this.calendar().season;
    return 1 + (s === 'yaz' ? this.fx('summerOrders') : 0) + (s === 'kis' ? this.fx('winterOrders') : 0);
  }

  // Fırın (7 günde bir), Pastane (5 günde bir), Muhtarlık (7 günde bir) düzenli siparişleri
  specialOrders() {
    const v = this.state.village;
    const day = this.dayIndex();
    const planted = this.plantedFlowers();
    const defs = [
      { key: 'firin', who: '🍞 Fırın', every: 7, flowers: ['yonca', 'papatya'], kg: [8, 12], mult: 1.6, days: 4 },
      { key: 'pastane', who: '🍰 Pastane', every: 5, flowers: ['lavanta', 'ihlamur', 'kestane'], kg: [2, 4], mult: 2.2, days: 4 },
      { key: 'muhtarlik', who: '🏛️ Muhtarlık (köy isteği)', every: 7, flowers: null, kg: [20, 20], mult: 1.8, days: 6 }
    ];
    for (const d of defs) {
      if (!this.fx(d.key)) continue;
      if (day - (v.special[d.key] || 0) < d.every) continue;
      if (this.state.orders.list.some((x) => x.special === d.key)) continue;
      const options = (d.flowers || planted).filter((f) => planted.includes(f));
      if (!options.length) continue;
      v.special[d.key] = day;
      const f = options[Math.floor(Math.random() * options.length)];
      const kg = d.kg[0] + Math.floor(Math.random() * (d.kg[1] - d.kg[0] + 1));
      const reward = Math.round(kg * FLOWERS[f].price * d.mult * this.seasonOrderMult());
      this.state.orders.list.push({ id: uid(), who: d.who, flower: f, kg, reward, days: d.days + this.fx('orderDays'), status: 'open', deadline: null, special: d.key });
      this.state.counters.ordersIn += 1;
      this.events.push({ msg: `📜 ${d.who}: ${kg} kg ${FLOWERS[f].name} balı istiyor (düzenli sipariş, +${reward} 🪙).` });
    }
  }

  villageView() {
    const v = this.state.village;
    const kg = v.deliveredKg;
    const n = v.arrived.length;
    let nextKg = null;
    if (n < VILLAGE.length) { let x = kg; while (this.villageTarget(x) <= n) x = Math.floor(x / 50 + 1) * 50; nextKg = x; }
    return {
      deliveredKg: Math.round(kg * 10) / 10,
      nextKg,
      total: VILLAGE.length,
      rings: n > 36 ? 2 : 1,
      ring1: this.ringKeys(ISLAND_RADIUS + 1),
      ring2: n > 36 ? this.ringKeys(ISLAND_RADIUS + 2) : [],
      residents: v.arrived.map((i) => ({ ...VILLAGE[i - 1], slot: v.slots[i], hearts: ((this.state.customers[VILLAGE[i - 1].owner || VILLAGE[i - 1].name] || {}).hearts) || 0 }))
    };
  }

  // --- Bal Defteri -----------------------------------------------------------------
  ledgerHoney(f) {
    const h = this.state.ledger.honey;
    if (!h[f]) h[f] = { kg: 0, soldKg: 0, earned: 0, bestPrice: 0, first: null };
    return h[f];
  }

  recordHarvest(hive, moved, scale) {
    const cal = this.calendar();
    const byFlower = {};
    for (const [f, kg] of Object.entries(this.lastHoney || {})) {
      const L = this.ledgerHoney(f);
      const took = kg * scale;
      byFlower[f] = took;
      if (!L.first && took > 0.01) {
        L.first = { day: cal.day, season: cal.seasonName, year: cal.year };
        this.events.push({ msg: `📖 Bal Defteri'ne yeni sayfa: ilk ${FLOWERS[f].name} balın!` });
      }
      L.kg += took;
    }
    this.state.ledger.harvests += 1;
    this.questEvent('harvest', { kg: moved, hiveId: hive.id, byFlower });
    const total = Object.values(this.state.ledger.honey).reduce((a, x) => a + x.kg, 0);
    if (total >= 20) this.milestone('ilk_kavanoz', 'İlk kavanoz: toplam 20 kg bal hasat ettin');
    if (Object.keys(FLOWERS).every((f) => (this.state.ledger.honey[f] || {}).first)) this.milestone('tum_ballar', 'Yedi balın hepsini ürettin');
  }

  milestone(id, text) {
    if (this.state.milestones[id]) return;
    this.state.milestones[id] = Date.now();
    this.events.push({ msg: `🌟 ${text}`, milestone: id });
  }

  // --- Günlük görevler -------------------------------------------------------------
  todayKey() { return new Date().toDateString(); }

  questCandidates() {
    const out = [];
    const choose = (a) => a[Math.floor(Math.random() * a.length)];
    const add = (type, family, target, reward, extra = {}) => out.push({ type, family, target, reward, heavy: false, ...extra });
    const hives = Object.values(this.state.hives);
    const planted = this.plantedFlowers();
    const stored = Object.keys(this.state.storage).filter((f) => (this.state.storage[f] || 0) >= 0.05);
    const orders = this.state.orders.list.filter((o) => o.status === 'open' || o.status === 'accepted');
    const openOrders = orders.filter((o) => o.status === 'open');
    const affordableSeeds = Object.keys(FLOWERS).filter((x) => this.seedCost(x) <= this.state.coins);
    const emptyTiles = Object.values(this.state.tiles).filter((t) => t.owned && t.kind === 'grass' && !t.item).length;
    const wilted = Object.entries(this.state.tiles).filter(([, t]) => t.owned && t.item && t.item.type === 'flower' && t.item.wilted);
    const rooms = hives.reduce((n, h) => n + Math.max(0, h.capBees - h.bees), 0);

    { const vals = [5, 10, 15], i = Math.floor(Math.random() * vals.length); add('harvest', 'harvest', vals[i], [50, 70, 90][i]); }
    if (planted.length) { const f = choose(planted), target = 3 + Math.floor(Math.random() * 4); add('harvestFlower', 'harvest', target, target <= 3 ? 60 : target <= 5 ? 75 : 90, { flower: f }); }
    if (stored.length) { const vals = [5, 8, 11], i = Math.floor(Math.random() * vals.length); add('sell', 'market', vals[i], [45, 60, 80][i]); }
    if (orders.length) add('deliver', 'orders', 1, 90);
    if (this.state.wax >= 0.5) add('candle', 'craft', 1, 50);
    if (emptyTiles && affordableSeeds.length) add('plant', 'plant', 1, 45);

    if (hives.length >= 2) add('harvest2Hives', 'harvest', 2, 65);
    if (hives.length >= 3) add('harvest3Hives', 'harvest', 3, 95);
    if (hives.some((h) => h.capKg >= 10) && planted.length) add('harvestSingle10', 'harvest', 1, 80, { minKg: 10 });
    if (planted.length >= 2) add('harvest2Types', 'harvest', 2, 70);
    if (planted.length >= 3) add('harvest3Types', 'harvest', 3, 105);
    { const premium = planted.filter((x) => ['lavanta', 'ihlamur', 'kestane'].includes(x)); if (premium.length) add('harvestPremium', 'harvest', 3, 110); }

    if (stored.length) add('sell2Transactions', 'market', 2, 55);
    if (stored.length >= 2) add('sell2Types', 'market', 2, 75);
    if (stored.length) { const flower = choose(stored), target = (this.state.storage[flower] || 0) >= 5 ? (Math.random() < 0.5 ? 3 : 5) : Math.min(3, Math.max(1, Math.floor(this.state.storage[flower] || 1))); add('sellFlower', 'market', target, target >= 5 ? 90 : 70, { flower }); }
    if (stored.length) { const maxGain = Math.max(...stored.map((x) => (this.state.storage[x] || 0) * this.price(x))); if (maxGain >= 100) { const minGain = maxGain >= 200 && Math.random() < 0.5 ? 200 : 100; add('saleIncome', 'market', 1, minGain === 200 ? 115 : 75, { minGain }); } }
    if (this.calendar().season === 'kis' && stored.length) add('winterSell', 'market', 5, 90);

    if (openOrders.length) add('acceptOrder', 'orders', 1, 45);
    if (orders.length >= 2) add('deliver2', 'orders', 2, 140);
    if (orders.length) add('deliverNoPenalty', 'orders', 1, 95);
    if (orders.length) { const ord = choose(orders); add('deliverPerson', 'orders', 1, 120, { who: ord.who }); }
    { const regs = orders.filter((o) => ((this.state.customers[o.who] || {}).hearts || 0) > 0); if (regs.length) add('deliverRegular', 'orders', 1, 100); }

    if (rooms >= 1 && hives.some((h) => h.bees < h.capBees && this.beePrice(h) <= this.state.coins)) add('buyBee', 'bees', 1, 45);
    if (rooms >= 3) { const prices = []; for (const h of hives) for (let n = h.bees + 1; n <= h.capBees; n++) prices.push(this.beeNumberPrice(n)); prices.sort((x, y) => x - y); if (prices.slice(0, 3).reduce((x, y) => x + y, 0) <= this.state.coins) add('buy3Bees', 'bees', 3, 90); }
    if (hives.length && this.state.coins >= this.syrupCost()) add('syrup1', 'bees', 1, 55);
    if (hives.length >= 2 && this.state.coins >= this.syrupCost() * 2) add('syrup2Hives', 'bees', 2, 95);
    if (hives.some((h) => h.sick) && this.state.coins >= this.medicineCost()) add('cureHive', 'bees', 1, 110);
    if (hives.length && this.state.coins >= BREED_CHANGE_COST) add('changeBreed', 'bees', 1, 120, { heavy: true });
    { const x = hives.map((h) => this.nextUpgrade(h)).filter((u) => u && u.type === 'queen' && u.cost <= this.state.coins); if (x.length) { const c = Math.min(...x.map((u) => u.cost)); add('queenUpgrade', 'bees', 1, Math.min(400, Math.max(100, Math.round(c * 0.12))), { heavy: true }); } }
    { const x = hives.map((h) => this.nextUpgrade(h)).filter((u) => u && u.type === 'hive' && u.cost <= this.state.coins); if (x.length) { const c = Math.min(...x.map((u) => u.cost)); add('hiveUpgrade', 'bees', 1, Math.min(450, Math.max(100, Math.round(c * 0.10))), { heavy: true }); } }
    if (emptyTiles && this.state.coins >= HIVE_COST) add('placeHive', 'bees', 1, 180, { heavy: true });

    if (emptyTiles >= 2 && affordableSeeds.length) add('plant2', 'plant', 2, 75);
    if (emptyTiles && affordableSeeds.length) { const flower = choose(affordableSeeds); add('plantFlower', 'plant', 1, Math.min(220, Math.max(50, 40 + Math.round(this.seedCost(flower) * 0.15))), { flower, heavy: true }); }
    if (wilted.some(([k, t]) => this.reviveCost(t.item.flower) <= this.state.coins)) add('reviveFlower', 'plant', 1, 60);
    if (emptyTiles >= 2 && affordableSeeds.length >= 2) add('plant2Types', 'plant', 2, 90);
    if (this.state.candles >= 1) { const target = this.state.candles >= 2 && Math.random() < 0.5 ? 2 : 1; add('sellCandles', 'craft', target, target === 2 ? 75 : 50); }
    if (this.state.wax >= 1) add('candle2', 'craft', 2, 80);
    add('claim2', 'meta', 2, 65);
    if (this.state.merchant && this.state.merchant.active && this.state.merchant.stock.some((x) => !x.sold)) add('merchantBuy', 'special', 1, 70);
    if (this.state.merchant && this.state.merchant.active && (this.state.storage[this.state.merchant.wants] || 0) >= 0.05 && this.state.merchant.wantsLeft > 0) add('merchantSell', 'special', 1, 85);
    return out;
  }

  makeQuest(excluded = [], usedFamilies = [], heavyUsed = false) {
    let pool = this.questCandidates().filter((q) => !excluded.includes(q.type) && (!heavyUsed || !q.heavy));
    if (!pool.length) return null;
    const diverse = pool.filter((q) => !usedFamilies.includes(q.family));
    if (diverse.length) pool = diverse;
    const q = { ...pool[Math.floor(Math.random() * pool.length)], id: uid(), progress: 0, claimed: false, seen: [] };
    if (Math.random() < 0.2) { const tiers = ['papatya', 'aycicegi', 'kekik']; q.voucher = tiers[Math.floor(Math.random() * tiers.length)]; }
    return q;
  }

  ensureQuests() {
    const day = this.todayKey();
    const old = this.state.quests;
    if (old && old.day === day) {
      if (old.refreshFree == null) old.refreshFree = 2;
      if (old.paidUsed == null) old.paidUsed = false;
      return;
    }
    const list = [];
    const families = [];
    let heavy = false;
    while (list.length < 3) {
      const q = this.makeQuest(list.map((x) => x.type), families, heavy);
      if (!q) break;
      list.push(q); families.push(q.family); heavy = heavy || q.heavy;
    }
    this.state.quests = { day, list, refreshFree: 2, paidUsed: false };
  }

  questEvent(event, data = {}) {
    this.ensureQuests();
    const complete = (q, amount = 1) => {
      const before = q.progress;
      q.progress = Math.min(q.target, q.progress + amount);
      if (before < q.target && q.progress >= q.target) this.events.push({ msg: '✅ Günlük görev tamamlandı! Ödülünü almayı unutma.' });
    };
    const seen = (q, value) => { if (value == null) return; q.seen = Array.isArray(q.seen) ? q.seen : []; if (!q.seen.includes(value)) q.seen.push(value); q.progress = Math.min(q.target, q.seen.length); };
    for (const q of this.state.quests.list) {
      if (q.claimed || q.progress >= q.target) continue;
      if (event === 'harvest') {
        if (q.type === 'harvest') complete(q, data.kg || 0);
        if (q.type === 'harvestFlower' && q.flower) complete(q, (data.byFlower || {})[q.flower] || 0);
        if (q.type === 'harvest2Hives' || q.type === 'harvest3Hives') { const before = q.progress; seen(q, data.hiveId); if (before < q.target && q.progress >= q.target) this.events.push({ msg: '✅ Günlük görev tamamlandı! Ödülünü almayı unutma.' }); }
        if (q.type === 'harvestSingle10' && (data.kg || 0) >= (q.minKg || 10)) complete(q, 1);
        if (q.type === 'harvest2Types' || q.type === 'harvest3Types') { const before = q.progress; for (const [f, kg] of Object.entries(data.byFlower || {})) if (kg > 0.01) seen(q, f); if (before < q.target && q.progress >= q.target) this.events.push({ msg: '✅ Günlük görev tamamlandı! Ödülünü almayı unutma.' }); }
        if (q.type === 'harvestPremium') complete(q, ['lavanta', 'ihlamur', 'kestane'].reduce((n, f) => n + ((data.byFlower || {})[f] || 0), 0));
      }
      if (event === 'sell') {
        if (q.type === 'sell') complete(q, data.kg || 0);
        if (q.type === 'sell2Transactions') complete(q, 1);
        if (q.type === 'sell2Types') { const before = q.progress; seen(q, data.flower); if (before < q.target && q.progress >= q.target) this.events.push({ msg: '✅ Günlük görev tamamlandı! Ödülünü almayı unutma.' }); }
        if (q.type === 'sellFlower' && q.flower === data.flower) complete(q, data.kg || 0);
        if (q.type === 'saleIncome' && (data.gain || 0) >= (q.minGain || 100)) complete(q, 1);
        if (q.type === 'winterSell' && this.calendar().season === 'kis') complete(q, data.kg || 0);
      }
      if (event === 'acceptOrder' && q.type === 'acceptOrder') complete(q, 1);
      if (event === 'deliver') {
        if (q.type === 'deliver' || q.type === 'deliver2' || q.type === 'deliverNoPenalty') complete(q, 1);
        if (q.type === 'deliverPerson' && q.who === data.who) complete(q, 1);
        if (q.type === 'deliverRegular' && data.regular) complete(q, 1);
      }
      if (event === 'buyBee' && (q.type === 'buyBee' || q.type === 'buy3Bees')) complete(q, 1);
      if (event === 'syrup') { if (q.type === 'syrup1') complete(q, 1); if (q.type === 'syrup2Hives') { const before = q.progress; seen(q, data.hiveId); if (before < q.target && q.progress >= q.target) this.events.push({ msg: '✅ Günlük görev tamamlandı! Ödülünü almayı unutma.' }); } }
      if (event === 'cure' && q.type === 'cureHive') complete(q, 1);
      if (event === 'breedChange' && q.type === 'changeBreed') complete(q, 1);
      if (event === 'upgrade' && q.type === (data.kind === 'queen' ? 'queenUpgrade' : 'hiveUpgrade')) complete(q, 1);
      if (event === 'placeHive' && q.type === 'placeHive') complete(q, 1);
      if (event === 'plant') { if (q.type === 'plant' || q.type === 'plant2') complete(q, 1); if (q.type === 'plantFlower' && q.flower === data.flower) complete(q, 1); if (q.type === 'plant2Types') { const before = q.progress; seen(q, data.flower); if (before < q.target && q.progress >= q.target) this.events.push({ msg: '✅ Günlük görev tamamlandı! Ödülünü almayı unutma.' }); } }
      if (event === 'revive' && q.type === 'reviveFlower') complete(q, 1);
      if (event === 'candleMake' && (q.type === 'candle' || q.type === 'candle2')) complete(q, 1);
      if (event === 'candleSell' && q.type === 'sellCandles') complete(q, data.count || 1);
      if (event === 'claim' && q.type === 'claim2' && data.sourceId !== q.id) complete(q, 1);
      if (event === 'merchantBuy' && q.type === 'merchantBuy') complete(q, 1);
      if (event === 'merchantSell' && q.type === 'merchantSell') complete(q, 1);
    }
  }

  questProgress(type, amount, flower) {
    this.ensureQuests();
    for (const q of this.state.quests.list) {
      if (q.type !== type || q.claimed || q.progress >= q.target) continue;
      if (type === 'harvestFlower' && q.flower !== flower) continue;
      const before = q.progress;
      q.progress = Math.min(q.target, q.progress + amount);
      if (before < q.target && q.progress >= q.target) this.events.push({ msg: '✅ Günlük görev tamamlandı! Ödülünü almayı unutma.' });
    }
  }

  refreshQuest(id) {
    this.ensureQuests();
    const Q = this.state.quests;
    const i = Q.list.findIndex((x) => x.id === id);
    if (i < 0) return this.fail('Görev bulunamadı.');
    const old = Q.list[i];
    if (old.claimed || old.progress >= old.target) return this.fail('Tamamlanmış görev değiştirilemez.');
    const others = Q.list.filter((_, n) => n !== i);
    const fresh = this.makeQuest([...others.map((x) => x.type), old.type], others.map((x) => x.family), others.some((x) => x.heavy));
    if (!fresh) return this.fail('Şu an uygun başka görev bulunamadı. Hakkın harcanmadı.');
    let cost = 0;
    if (Q.refreshFree > 0) Q.refreshFree -= 1;
    else {
      if (Q.paidUsed) return this.fail('Bugünkü değiştirme hakkın bitti.');
      cost = 100;
      if (this.state.coins < cost) return this.fail('Ücretli görev değişimi için 100 🪙 gerekli.');
      this.state.coins -= cost;
      Q.paidUsed = true;
    }
    Q.list[i] = fresh;
    this.save();
    return { ok: true, msg: cost ? `Görev değiştirildi (-${cost} 🪙).` : `Görev ücretsiz değiştirildi. Kalan ücretsiz hak: ${Q.refreshFree}.` };
  }

  claimQuest(id) {
    this.ensureQuests();
    const q = this.state.quests.list.find((x) => x.id === id);
    if (!q || q.claimed) return this.fail('Görev bulunamadı.');
    if (q.progress < q.target) return this.fail('Görev henüz tamamlanmadı.');
    q.claimed = true;
    const reward = Math.round(q.reward * (1 + this.fx('questBonus') + this.storyFx('quest')));
    this.state.coins += reward;
    this.state.questsDone += 1;
    if (q.voucher) this.state.vouchers[q.voucher] = (this.state.vouchers[q.voucher] || 0) + 1;
    this.questEvent('claim', { sourceId: q.id });
    this.save();
    return { ok: true, msg: `Görev ödülü: +${reward} 🪙${q.voucher ? ` ve 1 ${FLOWERS[q.voucher].name} tohumu 🎁` : ''}` };
  }

  questText(q) {
    const f = q.flower ? FLOWERS[q.flower].name : '';
    const map = {
      harvest: `${q.target} kg bal hasat et`, harvestFlower: `${q.target} kg ${f} balı hasat et`, sell: `Pazarda ${q.target} kg bal sat`, deliver: 'Bir siparişi teslim et', candle: 'Bir mum yap', plant: 'Bir tarh ek ya da yeniden ek',
      harvest2Hives: '2 farklı kovandan hasat yap', harvest3Hives: '3 farklı kovandan hasat yap', harvestSingle10: 'Tek hasatta en az 10 kg bal al', harvest2Types: '2 farklı bal türü hasat et', harvest3Types: '3 farklı bal türü hasat et', harvestPremium: 'Lavanta, ıhlamur veya kestane balından toplam 3 kg hasat et',
      sell2Transactions: 'Pazarda 2 ayrı satış yap', sell2Types: '2 farklı bal türü sat', sellFlower: `${q.target} kg ${f} balı sat`, saleIncome: `Tek satıştan en az ${q.minGain} 🪙 kazan`, winterSell: 'Kışın pazarda 5 kg bal sat',
      acceptOrder: 'Bir sipariş kabul et', deliver2: '2 sipariş teslim et', deliverNoPenalty: 'Bir siparişi başarıyla tamamla', deliverPerson: `${q.who} için bir sipariş teslim et`, deliverRegular: 'Bir müdavim köylüye sipariş teslim et',
      buyBee: '1 arı satın al', buy3Bees: '3 arı satın al', syrup1: 'Bir kovana şurup ver', syrup2Hives: '2 farklı kovana şurup ver', cureHive: 'Hasta bir kovanı iyileştir', changeBreed: 'Bir kovanın arı ırkını değiştir', queenUpgrade: 'Bir kraliçe yükseltmesi yap', hiveUpgrade: 'Bir kovan kapasite yükseltmesi yap', placeHive: 'Yeni bir kovan kur',
      plant2: '2 tarh ek', plantFlower: `1 ${f} tarhı ek`, reviveFlower: 'Solmuş bir tarhı canlandır', plant2Types: '2 farklı çiçek türü ek', sellCandles: `${q.target} mum sat`, candle2: '2 mum üret', claim2: 'Diğer 2 günlük görev ödülünü al', merchantBuy: "Seyyah Yakup'tan 1 ürün al", merchantSell: "Seyyah Yakup'a bal sat"
    };
    return map[q.type] || q.type;
  }
  // --- İsimler ve kavanoz etiketi -----------------------------------------------
  cleanName(name, max = 24) { return String(name || '').replace(/[<>]/g, '').trim().slice(0, max); }

  renameHive(hiveId, name) {
    const h = this.state.hives[hiveId];
    const n = this.cleanName(name);
    if (!h || !n) return this.fail('Geçerli bir isim yaz.');
    h.name = n;
    this.save();
    return { ok: true, msg: `Kovanın yeni adı: ${n}` };
  }

  setFarmName(name) {
    const n = this.cleanName(name, 28);
    if (!n) return this.fail('Geçerli bir isim yaz.');
    this.state.farmName = n;
    this.save();
    return { ok: true, msg: `Çiftliğinin adı artık "${n}".` };
  }

  setLabel(design, color) {
    if (!LABEL_DESIGNS[design] || !/^#[0-9a-fA-F]{6}$/.test(String(color))) return this.fail('Geçersiz etiket.');
    const first = !this.state.label;
    this.state.label = { design, color };
    this.save();
    return { ok: true, msg: first ? 'Kavanoz etiketin hazır! Müdavimlerin artık %5 bahşiş verir.' : 'Etiket güncellendi.' };
  }

  // --- Hava durumu, hastalık, tanıtım -----------------------------------------
  rollWeather(season, silent = false) {
    const odds = WEATHER_ODDS[season];
    let x = Math.random();
    let pick = odds[odds.length - 1][0];
    for (const [w, p] of odds) { if (x < p) { pick = w; break; } x -= p; }
    this.state.weather = pick;
    if (silent) return;
    if (pick === 'yagmurlu') this.events.push({ msg: '🌧️ Bugün yağmurlu, arılar kovandan pek çıkmıyor.' });
    else if (pick === 'karli') this.events.push({ msg: '🌨️ Bugün kar yağıyor. Arılar kovanda ısınıyor.' });
  }

  giveMedicine(hiveId) {
    const h = this.state.hives[hiveId];
    if (!h) return this.fail('Kovan bulunamadı.');
    if (!h.sick) return this.fail('Bu kovan sağlıklı.');
    const medCost = this.medicineCost();
    if (this.state.coins < medCost) return this.fail(`Yeterli jeton yok (${medCost} gerekli).`);
    this.state.coins -= medCost;
    this.recoverHive(h, this.dayIndex(), false);
    this.state.ledger.cured += 1;
    this.questEvent('cure');
    this.save();
    return { ok: true, msg: `${h.name} iyileşti 💊` };
  }

  finishTutorial() { this.state.tutorialDone = true; this.save(); return { ok: true, msg: '' }; }

  // --- Sen yokken özeti -------------------------------------------------------
  myRank() { const me = this.leaderboard().find((r) => r.me); return me ? me.rank : 1; }

  markAway() {
    this.state.away = { at: Date.now(), ...this.state.counters, rank: this.myRank() };
    this.save();
  }

  takeAwaySummary() {
    const a = this.state.away;
    this.state.away = null;
    if (!a || Date.now() - a.at < AWAY_SUMMARY_MS) return null;
    const c = this.state.counters;
    const board = this.leaderboard();
    const rank = this.myRank();
    const passedBy = rank > a.rank ? board[rank - 2] : null;
    return {
      minutes: Math.round((Date.now() - a.at) / 60000),
      produced: c.produced - a.produced,
      born: c.born - a.born,
      died: c.died - a.died,
      ordersIn: c.ordersIn - a.ordersIn,
      rank,
      oldRank: a.rank,
      passedBy: passedBy ? passedBy.name : null,
      full: Object.values(this.state.hives).filter((h) => this.hiveTotal(h) >= h.capKg - 0.05).length,
      sick: Object.values(this.state.hives).filter((h) => h.sick).length
    };
  }

  // Masaüstündeki Nero için: oyun penceresi kapalıyken söylenecek yeni durumlar
  pendingAlerts() {
    const out = [];
    const seen = this.alertSeen;
    for (const h of Object.values(this.state.hives)) {
      const full = this.hiveTotal(h) >= h.capKg - 0.05;
      if (full && !seen[`full:${h.id}`]) out.push({ kind: 'bee_hive_full', vars: { hive: h.name } });
      seen[`full:${h.id}`] = full;
      if (h.sick && !seen[`sick:${h.id}`]) out.push({ kind: 'bee_sick', vars: { hive: h.name } });
      seen[`sick:${h.id}`] = !!h.sick;
    }
    for (const o of this.state.orders.list) {
      const due = o.status === 'accepted' && o.deadline - this.state.gameMs < DAY_GAME_MS;
      if (due && !seen[`due:${o.id}`]) out.push({ kind: 'bee_order_due', vars: { who: o.who } });
      if (due) seen[`due:${o.id}`] = true;
    }
    const winterHungry = this.calendar().season === 'kis' && Object.values(this.state.hives).some((h) => h.syrup < 1);
    const wKey = `winter:${Math.floor(this.dayIndex() / DAYS_PER_SEASON)}`;
    if (winterHungry && !seen[wKey]) { out.push({ kind: 'bee_winter', vars: {} }); seen[wKey] = true; }
    const rank = this.myRank();
    if (seen.rank && rank > seen.rank) {
      const passer = this.leaderboard()[rank - 2];
      out.push({ kind: 'bee_overtaken', vars: { rival: passer ? passer.name : 'Bir rakip' } });
    }
    seen.rank = rank;
    const m = this.state.merchant;
    if (m && m.active && !seen[`merchant:${m.arrivedDay}`]) { out.push({ kind: 'bee_merchant', vars: {} }); seen[`merchant:${m.arrivedDay}`] = true; }
    const lastLetter = this.state.letters[this.state.letters.length - 1];
    if (lastLetter && !lastLetter.read && !seen[`letter:${lastLetter.id}`]) { out.push({ kind: 'bee_letter', vars: { who: lastLetter.from } }); seen[`letter:${lastLetter.id}`] = true; }
    // Oyun ayarlarındaki bildirim tercihleri
    const pref = this.state.gameSettings.notify;
    const map = { bee_hive_full: 'full', bee_order_due: 'due', bee_sick: 'sick', bee_winter: 'winter', bee_overtaken: 'rival', bee_merchant: 'merchant', bee_letter: 'letter' };
    return out.filter((a) => pref[map[a.kind]] !== false);
  }

  // --- Pazar -------------------------------------------------------------------
  newMarket() {
    const mult = {};
    const history = {};
    for (const f of Object.keys(FLOWERS)) {
      mult[f] = 0.9 + Math.random() * 0.25;
      history[f] = [mult[f]];
    }
    return { mult, prev: { ...mult }, history, event: null };
  }

  // Her gün: fiyatlar bir öncekine yakın kalarak %80-130 arasında dalgalanır
  rollMarket() {
    const m = this.state.market;
    m.prev = { ...m.mult };
    for (const f of Object.keys(FLOWERS)) {
      const drift = (Math.random() - 0.5) * 0.18;
      const pull = (1.05 - m.mult[f]) * 0.15; // ortalamaya hafif çekim
      m.mult[f] = Math.min(1.3, Math.max(0.8, m.mult[f] + drift + pull));
      m.history[f] = [...(m.history[f] || []), m.mult[f]].slice(-HISTORY_DAYS);
    }
    const day = this.dayIndex();
    if (m.event && day >= m.event.until) m.event = null;
    if (!m.event && Math.random() < 0.12) {
      const keys = Object.keys(FLOWERS);
      const f = keys[Math.floor(Math.random() * keys.length)];
      m.event = { flower: f, pct: 50, until: day + 2 };
      this.events.push({ msg: `🎉 Festival! ${FLOWERS[f].name} balı 2 gün boyunca %50 daha değerli.` });
    }
  }

  price(f) {
    const m = this.state.market;
    const season = this.calendar().season;
    let p = FLOWERS[f].price * m.mult[f] * SEASON_PRICE[season];
    if (m.event && m.event.flower === f) p *= 1 + m.event.pct / 100;
    p *= 1 + this.fx('marketBonus') + this.storyFx('market') + (f === 'yonca' ? this.storyFx('yonca') : 0);
    return Math.round(p * 10) / 10;
  }

  prices() {
    const m = this.state.market;
    const season = this.calendar().season;
    const out = {};
    for (const f of Object.keys(FLOWERS)) {
      const change = m.prev[f] ? (m.mult[f] - m.prev[f]) / m.prev[f] : 0;
      out[f] = {
        price: this.price(f),
        change: Math.round(change * 100),
        history: (m.history[f] || []).map((x) => Math.round(FLOWERS[f].price * x * SEASON_PRICE[season] * 10) / 10),
        festival: !!(m.event && m.event.flower === f)
      };
    }
    return out;
  }

  sellHoney(f, amount) {
    const have = this.state.storage[f] || 0;
    if (!FLOWERS[f]) return this.fail('Bilinmeyen bal.');
    if (have < 0.05) return this.fail(`Depoda ${FLOWERS[f].name} balı yok.`);
    const kg = amount === 'all' ? have : Math.min(have, Number(amount) || 0);
    if (kg < 0.05) return this.fail('Satılacak miktar yok.');
    const gain = Math.round(kg * this.price(f));
    this.state.storage[f] = have - kg;
    if (this.state.storage[f] < 0.001) delete this.state.storage[f];
    this.state.coins += gain;
    this.state.counters.earned += gain;
    const L = this.ledgerHoney(f);
    L.soldKg += kg;
    L.earned += gain;
    const unit = gain / kg;
    if (!L.bestPrice || unit > L.bestPrice) L.bestPrice = Math.round(unit * 10) / 10;
    const best = this.state.ledger.bestSale;
    if (!best || gain > best.coins) this.state.ledger.bestSale = { coins: gain, flower: f, kg: Math.round(kg * 10) / 10 };
    this.questEvent('sell', { kg, flower: f, gain });
    this.save();
    return { ok: true, msg: `${kg.toFixed(1)} kg ${FLOWERS[f].name} balı satıldı (+${gain} 🪙).` };
  }

  nextStorage() { return STORAGE_UPGRADES.find((u) => u.cap > (this.state.storageBaseCap || 50)) || null; }

  upgradeStorage() {
    const u = this.nextStorage();
    if (!u) return this.fail('Depo en büyük boyutta.');
    if (this.state.coins < u.cost) return this.fail(`Yeterli jeton yok (${u.cost} gerekli).`);
    this.state.coins -= u.cost;
    this.state.storageBaseCap = u.cap;
    this.state.storageCap = u.cap + ((this.state.merchant && this.state.merchant.sandik) || 0) * 10;
    this.save();
    return { ok: true, msg: `Depo büyüdü: artık ${this.state.storageCap} kg alıyor.` };
  }

  // --- Siparişler ------------------------------------------------------------
  plantedFlowers() {
    const set = new Set();
    for (const t of Object.values(this.state.tiles)) if (t.owned && t.item && t.item.type === 'flower' && !t.item.wilted) set.add(t.item.flower);
    return [...set];
  }

  makeOrder() {
    const planted = this.plantedFlowers();
    if (!planted.length) return null;
    // Sipariş veren: köyde yaşayanlar (tanıdıklar biraz daha sık)
    const used = new Set(this.state.orders.list.filter((x) => !x.special && (x.status === 'open' || x.status === 'accepted')).map((x) => x.who));
    const pool = this.villagePeople().filter((p) => !used.has(p.name));
    if (!pool.length) return null;
    const known = pool.filter((p) => ((this.state.customers[p.name] || {}).hearts || 0) > 0);
    const person = known.length && Math.random() < 0.45 ? known[Math.floor(Math.random() * known.length)] : pool[Math.floor(Math.random() * pool.length)];
    const who = person.name;
    let f = planted[Math.floor(Math.random() * planted.length)];
    let fav = false;
    if (person && person.fav && planted.includes(person.fav) && Math.random() < 0.6) { f = person.fav; fav = true; }
    else if (this.fx('favorOrders') && Math.random() < 0.3) {
      const pick = ['kekik', 'ihlamur'].filter((x) => planted.includes(x));
      if (pick.length) f = pick[Math.floor(Math.random() * pick.length)];
    }
    const def = FLOWERS[f];
    // Değerli bal daha az miktarda istenir
    const maxKg = def.price >= 50 ? 5 : def.price >= 25 ? 8 : 12;
    const kg = Math.max(2, Math.round(2 + Math.random() * (maxKg - 2)));
    const days = 2 + Math.floor(Math.random() * 4) + this.fx('orderDays');
    const hearts = (this.state.customers[who] || {}).hearts || 0;
    const reward = Math.round(kg * def.price * (1.4 + Math.random() * 0.4) * (1 + hearts * HEART_BONUS) * (fav ? 1.15 : 1) * this.seasonOrderMult() * (1 + (person ? this.storyFx('orderPay') : 0))); // piyasadan daha iyi öder
    return { id: uid(), who, flower: f, kg, reward, days, status: 'open', deadline: null, fav };
  }

  processOrders() {
    const o = this.state.orders;
    const now = this.state.gameMs;
    // Süresi geçen kabul edilmiş siparişler: ceza
    for (const ord of [...o.list]) {
      if (ord.status === 'accepted' && now >= ord.deadline) {
        const fine = Math.round(ord.reward * ORDER_PENALTY);
        this.state.coins = Math.max(0, this.state.coins - fine);
        o.list = o.list.filter((x) => x.id !== ord.id);
        this.events.push({ msg: `Sipariş yetişmedi (${ord.who}). -${fine} 🪙 ceza.`, err: true });
      }
    }
    this.specialOrders();
    // Yeni sipariş: gerçek zamanda 5 dakikada bir. Uzun aradan sonra tek seferde en fazla 3 tane birikir.
    const real = Date.now();
    if (!o.nextAtReal) o.nextAtReal = real + ORDER_EVERY_REAL_MS;
    const normalCount = o.list.filter((x) => !x.special).length;
    if (normalCount >= this.orderMax()) { o.nextAtReal = real + ORDER_EVERY_REAL_MS; return; }
    if (real >= o.nextAtReal) {
      const elapsedSlots = Math.floor((real - o.nextAtReal) / ORDER_EVERY_REAL_MS) + 1;
      const addCount = Math.min(elapsedSlots, ORDER_CATCHUP_MAX, this.orderMax() - normalCount);
      o.nextAtReal += elapsedSlots * ORDER_EVERY_REAL_MS;
      for (let i = 0; i < addCount; i++) {
        const ord = this.makeOrder();
        if (!ord) break;
        o.list.push(ord);
        this.state.counters.ordersIn += 1;
        this.events.push({ msg: `📜 Yeni sipariş: ${ord.who} ${ord.kg} kg ${FLOWERS[ord.flower].name} balı istiyor.` });
      }
    }
  }

  findOrder(id) { return this.state.orders.list.find((x) => x.id === id); }

  acceptOrder(id) {
    const ord = this.findOrder(id);
    if (!ord || ord.status !== 'open') return this.fail('Sipariş bulunamadı.');
    ord.status = 'accepted';
    ord.deadline = this.state.gameMs + ord.days * DAY_GAME_MS;
    this.questEvent('acceptOrder', { who: ord.who });
    this.save();
    return { ok: true, msg: `Sipariş kabul edildi (${ord.who}). ${ord.days} gün içinde teslim et.` };
  }

  deliverOrder(id) {
    const ord = this.findOrder(id);
    if (!ord || ord.status !== 'accepted') return this.fail('Önce siparişi kabul et.');
    const have = this.state.storage[ord.flower] || 0;
    if (have + 1e-6 < ord.kg) return this.fail(`Depoda yeterli ${FLOWERS[ord.flower].name} balı yok (${have.toFixed(1)} / ${ord.kg} kg).`);
    this.state.storage[ord.flower] = have - ord.kg;
    if (this.state.storage[ord.flower] < 0.001) delete this.state.storage[ord.flower];
    const known = ((this.state.customers[ord.who] || {}).hearts || 0) > 0;
    const wasRegular = known;
    const extra = known && this.state.label ? Math.round(ord.reward * LABEL_BONUS) : 0;
    this.state.coins += ord.reward + extra;
    this.state.counters.earned += ord.reward + extra;
    this.state.orders.list = this.state.orders.list.filter((x) => x.id !== id);
    this.bond(ord.who);
    this.state.ledger.ordersDone += 1;
    const LD = this.state.ledger;
    LD.deliveredKgBy[ord.flower] = (LD.deliveredKgBy[ord.flower] || 0) + ord.kg;
    LD.deliveredOrdersBy[ord.flower] = (LD.deliveredOrdersBy[ord.flower] || 0) + 1;
    LD.deliveredTo[ord.who] = (LD.deliveredTo[ord.who] || 0) + 1;
    if (ord.special === 'muhtarlik') LD.muhtarlikDone += 1;
    this.questEvent('deliver', { who: ord.who, regular: wasRegular });
    this.state.village.deliveredKg += ord.kg;
    this.checkVillage();
    this.save();
    return { ok: true, msg: `${ord.who} çok memnun kaldı! +${ord.reward} 🪙${extra ? ` (+${extra} etiket bahşişi)` : ''}` };
  }

  // Reddetmek o kişiyle ilişkiyi %2 azaltır (1 teslim = %10; en az %0)
  hurtRelation(who) {
    const c = this.state.customers[who];
    if (!c) return 0;
    const before = c.delivered;
    c.delivered = Math.max(0, Math.round((c.delivered - REJECT_REL) * 100) / 100);
    let hearts = Math.min(HEART_MAX, Math.floor(c.delivered / HEART_EVERY + 1e-9));
    if (this.fx('firstHeart') && c.delivered >= 1) hearts = Math.max(1, hearts);
    c.hearts = Math.min(c.hearts, hearts);
    return before - c.delivered;
  }

  relation(who) {
    const c = this.state.customers[who];
    return c ? Math.min(100, Math.round(c.delivered * 10)) : 0;
  }

  rejectOrder(id) {
    const ord = this.findOrder(id);
    if (!ord) return this.fail('Sipariş bulunamadı.');
    const hurt = ord.special ? 0 : this.hurtRelation(ord.who);
    const relMsg = hurt > 0 ? ` ${ord.who} ile ilişkin %2 azaldı.` : '';
    if (ord.status === 'accepted') {
      // Kabul edilmiş siparişten vazgeçmek de ceza getirir
      const fine = Math.round(ord.reward * ORDER_PENALTY);
      this.state.coins = Math.max(0, this.state.coins - fine);
      this.state.orders.list = this.state.orders.list.filter((x) => x.id !== id);
      this.save();
      return { ok: true, msg: `Siparişten vazgeçtin. -${fine} 🪙 ceza.${relMsg}` };
    }
    this.state.orders.list = this.state.orders.list.filter((x) => x.id !== id);
    this.save();
    return { ok: true, msg: `Sipariş reddedildi.${relMsg}` };
  }

  swapOrder(id) {
    const ord = this.findOrder(id);
    if (!ord || ord.status !== 'open') return this.fail('Sadece açık siparişler değiştirilebilir.');
    if (this.state.coins < ORDER_SWAP_COST) return this.fail(`Yeterli jeton yok (${ORDER_SWAP_COST} gerekli).`);
    const fresh = this.makeOrder();
    if (!fresh) return this.fail('Ekili çiçek yok, yeni sipariş gelmez.');
    this.state.coins -= ORDER_SWAP_COST;
    const i = this.state.orders.list.findIndex((x) => x.id === id);
    this.state.orders.list[i] = fresh;
    this.save();
    return { ok: true, msg: `Yeni sipariş geldi: ${fresh.who} (-${ORDER_SWAP_COST} 🪙).` };
  }

  ordersView() {
    const o = this.state.orders;
    const now = this.state.gameMs;
    return {
      list: o.list.map((x) => ({
        ...x,
        penalty: Math.round(x.reward * ORDER_PENALTY),
        leftMs: x.deadline ? Math.max(0, x.deadline - now) : null,
        have: this.state.storage[x.flower] || 0
      })),
      nextInMs: o.list.filter((x) => !x.special).length >= this.orderMax() ? null : Math.max(0, (o.nextAtReal || Date.now() + ORDER_EVERY_REAL_MS) - Date.now()),
      realTime: true,
      max: this.orderMax(),
      swapCost: ORDER_SWAP_COST,
      planted: this.plantedFlowers().length
    };
  }

  // --- Net değer ve rakipler ---------------------------------------------------
  hiveValue(h) { return Math.round(HIVE_COST * 0.5 + (h.invested || 0) * 0.5 + h.bees * 5); }

  netWorth() {
    let v = this.state.coins;
    for (const [f, kg] of Object.entries(this.state.storage)) v += kg * this.price(f);
    for (const h of Object.values(this.state.hives)) v += this.hiveValue(h) + this.hiveTotal(h) * this.price('yonca') * 0.5;
    v += (this.state.tilesBought || 0) * 20 + (this.state.candles || 0) * this.candlePrice();
    return Math.round(v);
  }

  // Her gün: rakiplerin net değeri kendi tarzlarına göre değişir. Hep yukarı gitmez.
  rollRivals() {
    const me = this.netWorth();
    this.state.nwHistory = [...(this.state.nwHistory || []), me].slice(-HISTORY_NW);
    for (const r of this.state.rivals) {
      const def = RIVALS.find((x) => x.id === r.id);
      // oyuncudan çok uzaklaşırsa yavaşlar, çok geride kalırsa hızlanır (yarış hep canlı kalsın)
      const gap = me > 0 ? r.nw / me : 1;
      const rubber = gap > 1.6 ? -0.015 : gap < 0.6 ? 0.02 : 0;
      const noise = (Math.random() + Math.random() + Math.random() - 1.5) * 2 * def.vol;
      let change = def.drift + rubber + noise;
      if (Math.random() < def.luck) {
        const good = Math.random() < 0.55;
        const size = 0.08 + Math.random() * (def.style === 'Riskçi' ? 0.2 : 0.08);
        change += good ? size : -size;
        const list = good ? RIVAL_GOOD : RIVAL_BAD;
        const what = list[Math.floor(Math.random() * list.length)];
        this.events.push({ msg: `${def.name}: ${what} (${good ? '+' : '-'}%${Math.round(size * 100)})`, err: !good });
      }
      const before = r.nw;
      r.nw = Math.max(50, Math.round(r.nw * (1 + change)));
      r.last = before ? (r.nw - before) / before : 0;
      r.history = [...(r.history || []), r.nw].slice(-HISTORY_NW);
    }
  }

  leaderboard() {
    const me = this.netWorth();
    const hist = this.state.nwHistory || [];
    // Rakiplerle aynı ölçü: bugünün başındaki değer ile dünün başındaki değer
    const meLast = hist.length >= 2 ? (hist[hist.length - 1] - hist[hist.length - 2]) / (hist[hist.length - 2] || 1) : 0;
    const rows = [
      { id: 'me', name: 'Sen', style: 'Oyuncu', nw: me, last: meLast, history: [...hist, me].slice(-HISTORY_NW), me: true },
      ...this.state.rivals.map((r) => {
        const def = RIVALS.find((x) => x.id === r.id);
        return { id: r.id, name: def.name, style: def.style, nw: r.nw, last: r.last, history: r.history, me: false };
      })
    ];
    rows.sort((a, b) => b.nw - a.nw);
    return rows.map((r, i) => ({ ...r, rank: i + 1 }));
  }

  // Son 20 bildirim kalıcı olarak tutulur (sol alttaki zil paneli)
  logNotifs(events) {
    if (!events.length) return;
    const list = this.state.notifs || [];
    for (const e of events) if (e.msg) list.push({ t: Date.now(), msg: e.msg, err: !!e.err, go: e.go || this.notifTarget(e.msg) });
    this.state.notifs = list.slice(-NOTIF_KEEP);
    this.state.notifsUnread = Math.min(NOTIF_KEEP, (this.state.notifsUnread || 0) + events.filter((e) => e.msg).length);
  }

  // Bildirime tıklayınca açılacak yer (mesajın içeriğinden çıkarılır)
  notifTarget(msg) {
    if (msg.startsWith('✉️')) return { to: 'letters' };
    if (msg.startsWith('🛒')) return { to: 'merchant' };
    if (msg.startsWith('📜') || msg.includes('Sipariş')) return { to: 'orders' };
    if (/^(🏘️|🏪|🏛️|📖|🌟)/u.test(msg)) return { to: 'village' };
    if (msg.includes('Festival') || msg.includes('festival')) return { to: 'market' };
    const hive = Object.values(this.state.hives).find((h) => msg.includes(h.name));
    if (hive) return { to: 'hive', id: hive.id };
    return null;
  }

  readNotifs() { this.state.notifsUnread = 0; this.save(); return { ok: true, msg: '' }; }

  drainEvents() { const e = this.events; this.events = []; this.logNotifs(e); return e; }

  // --- Arıcı: evden kovana yürür, 5 sn çalışır, sonra sıradaki kovana geçer --
  houseKey() {
    for (const [k, t] of Object.entries(this.state.tiles)) if (t.item && t.item.type === 'house') return k;
    return '0,0';
  }

  walkMs(fromKey, toKey) {
    const [q1, r1] = parse(fromKey);
    const [q2, r2] = parse(toKey);
    const d = hexDist(q2 - q1, r2 - r1);
    return Math.max(1200, d * WALK_MS_PER_TILE);
  }

  startNextJob(now, fromKey) {
    const kp = this.state.keeper;
    while (kp.queue.length) {
      const hiveId = kp.queue.shift();
      const to = this.hiveTileKey(hiveId);
      if (!to) continue;
      const walk = this.walkMs(fromKey, to);
      kp.job = { kind: 'harvest', hiveId, from: fromKey, to, startAt: now, arriveAt: now + walk, doneAt: now + walk + WORK_MS };
      this.events.push({ msg: `Arıcı ${this.state.hives[hiveId].name}'e gidiyor…` });
      return;
    }
    const home = this.houseKey();
    if (fromKey !== home) {
      const walk = this.walkMs(fromKey, home);
      kp.job = { kind: 'home', from: fromKey, to: home, startAt: now, arriveAt: now + walk, doneAt: now + walk };
    } else {
      kp.job = null;
    }
  }

  processKeeper(now) {
    const kp = this.state.keeper;
    if (!kp.job) {
      if (kp.queue.length) { this.startNextJob(now, this.houseKey()); return true; }
      return false;
    }
    if (now < kp.job.doneAt) return false;
    const job = kp.job;
    if (job.kind === 'harvest') {
      const r = this.harvestHive(job.hiveId);
      this.events.push({ msg: r.msg, err: !r.ok });
    }
    this.startNextJob(now, job.to);
    this.save();
    return true;
  }

  isQueued(hiveId) {
    const kp = this.state.keeper;
    return kp.queue.includes(hiveId) || (kp.job && kp.job.kind === 'harvest' && kp.job.hiveId === hiveId);
  }

  requestHarvest(hiveId) {
    const hive = this.state.hives[hiveId];
    if (!hive) return this.fail('Kovan bulunamadı.');
    if (this.isQueued(hiveId)) return this.fail('Arıcı zaten bu kovana gidiyor.');
    if (this.hiveTotal(hive) < 0.05) return this.fail('Hasat edilecek bal yok.');
    this.state.keeper.queue.push(hiveId);
    this.processKeeper(Date.now());
    this.save();
    return { ok: true, msg: '' };
  }

  // --- Arı alım/satım -----------------------------------------------------
  beeNumberPrice(number) {
    return Math.max(1, BEE_PRICE_BASE + (Number(number) - BEE_PRICE_BASE_NUMBER) * BEE_PRICE_STEP);
  }

  beePrice(h) { return this.beeNumberPrice(h.bees + 1); }
  beeSellPrice(h) { return Math.floor(this.beeNumberPrice(h.bees) / 2); }

  buyBee(hiveId) {
    const h = this.state.hives[hiveId];
    if (!h) return this.fail('Kovan bulunamadı.');
    if (h.bees >= h.capBees) return this.fail('Kovan dolu. Kraliçeyi yükselterek yer aç.');
    const price = this.beePrice(h);
    if (this.state.coins < price) return this.fail(`Yeterli jeton yok (${price} gerekli).`);
    this.state.coins -= price;
    h.bees += 1;
    h.beesBought += 1;
    h.invested += price;
    this.questEvent('buyBee', { hiveId });
    this.save();
    return { ok: true, msg: `Yeni bir arı aldın (-${price} 🪙).` };
  }

  sellBee(hiveId) {
    const h = this.state.hives[hiveId];
    if (!h) return this.fail('Kovan bulunamadı.');
    if (h.bees <= 1) return this.fail('Kovanda en az bir arı kalmalı.');
    const gain = this.beeSellPrice(h);
    h.bees -= 1;
    this.state.coins += gain;
    this.save();
    return { ok: true, msg: `Bir arı sattın (+${gain} 🪙).` };
  }

  // --- Yükseltmeler ---------------------------------------------------------
  nextUpgrade(h) { return UPGRADES[h.level] || null; }

  upgrade(hiveId) {
    const h = this.state.hives[hiveId];
    if (!h) return this.fail('Kovan bulunamadı.');
    const u = this.nextUpgrade(h);
    if (!u) return this.fail('Bu kovan tamamen gelişti.');
    if (this.state.coins < u.cost) return this.fail(`Yeterli jeton yok (${u.cost} gerekli).`);
    this.state.coins -= u.cost;
    h.invested += u.cost;
    h.level += 1;
    if (u.type === 'queen') {
      this.questEvent('upgrade', { kind: 'queen', hiveId });
      h.queens += 1;
      h.capBees = u.capBees;
      if (u.capBees >= 20) this.milestone('kovan_20', `${h.name} 20 arılık dev bir kovan oldu`);
      this.save();
      return { ok: true, msg: `${QUEEN_NAMES[h.queens]} geldi! Kapasite ${u.capBees} arı.` };
    }
    h.capKg = u.capKg;
    this.questEvent('upgrade', { kind: 'hive', hiveId });
    this.save();
    return { ok: true, msg: `Kovan büyüdü: artık ${u.capKg} kg bal alıyor.` };
  }

  giveSyrup(hiveId) {
    const h = this.state.hives[hiveId];
    if (!h) return this.fail('Kovan bulunamadı.');
    const syrupCost = this.syrupCost();
    if (this.state.coins < syrupCost) return this.fail(`Yeterli jeton yok (${syrupCost} gerekli).`);
    this.state.coins -= syrupCost;
    h.syrup += SYRUP_KG;
    this.state.ledger.syrupGiven += 1;
    this.questEvent('syrup', { hiveId });
    this.save();
    return { ok: true, msg: `${h.name}: +${SYRUP_KG} kg kış erzakı.` };
  }

  sellValue(h) { return Math.round((h.invested || 0) * 0.5 + h.bees * 5); }

  sellHive(hiveId) {
    const h = this.state.hives[hiveId];
    if (!h) return this.fail('Kovan bulunamadı.');
    if (Object.keys(this.state.hives).length <= 1) return this.fail('Son kovanını satamazsın.');
    const k = this.hiveTileKey(hiveId);
    const gain = this.sellValue(h);
    this.state.coins += gain;
    if (k) this.state.tiles[k].item = null;
    delete this.state.hives[hiveId];
    const kp = this.state.keeper;
    kp.queue = kp.queue.filter((id) => id !== hiveId);
    this.save();
    return { ok: true, msg: `${h.name} satıldı (+${gain} 🪙).` };
  }

  // --- Oyuncu eylemleri ---------------------------------------------------
  fail(msg) { return { ok: false, msg }; }

  // Sahip olunan bir kareye komşu mu (satın alınabilir mi)
  isBuyable(k) {
    const t = this.state.tiles[k];
    if (!t || t.owned || t.kind === 'water') return false;
    return DIRS.some(([dq, dr]) => {
      const n = this.state.tiles[key(t.q + dq, t.r + dr)];
      return n && n.owned;
    });
  }

  tilePrice() { return Math.round(60 * Math.pow(1.4, this.state.tilesBought)); }

  buyTile(k) {
    if (!this.isBuyable(k)) return this.fail('Bu kare satın alınamaz.');
    const price = this.tilePrice();
    if (this.state.coins < price) return this.fail(`Yeterli jeton yok (${price} gerekli).`);
    this.state.coins -= price;
    this.state.tilesBought += 1;
    const t = this.state.tiles[k];
    t.owned = true;
    t.tree = false;
    this.save();
    return { ok: true, msg: `Yeni kare alındı (-${price} 🪙).` };
  }

  placeHive(k) {
    const t = this.state.tiles[k];
    if (!t || !t.owned || t.item || t.kind !== 'grass') return this.fail('Buraya kovan konamaz.');
    if (this.state.coins < HIVE_COST) return this.fail(`Yeterli jeton yok (${HIVE_COST} gerekli).`);
    this.state.coins -= HIVE_COST;
    const id = uid();
    const n = Object.keys(this.state.hives).length + 1;
    this.state.hives[id] = newHive(id, `Kovan ${n}`, 4, HIVE_COST);
    this.questEvent('placeHive', { hiveId: id });
    t.item = { type: 'hive', id };
    this.save();
    return { ok: true, msg: `${this.state.hives[id].name} kuruldu (-${HIVE_COST} 🪙).` };
  }

  plantSeed(k, flower) {
    const t = this.state.tiles[k];
    const def = FLOWERS[flower];
    if (!def) return this.fail('Bilinmeyen tohum.');
    if (!t || !t.owned || t.item || t.kind !== 'grass') return this.fail('Buraya tohum ekilemez.');
    const free = (this.state.vouchers[flower] || 0) > 0;
    const seedCost = this.seedCost(flower);
    if (!free && this.state.coins < seedCost) return this.fail(`Yeterli jeton yok (${seedCost} gerekli).`);
    if (free) this.state.vouchers[flower] -= 1; else this.state.coins -= seedCost;
    t.item = { type: 'flower', flower, plantedDay: this.dayIndex(), wilted: false };
    this.questEvent('plant', { flower });
    this.save();
    return { ok: true, msg: free ? `${def.name} hediye tohumla ekildi 🎁` : `${def.name} ekildi (-${seedCost} 🪙).` };
  }

  replant(k) {
    const t = this.state.tiles[k];
    if (!t || !t.item || t.item.type !== 'flower') return this.fail('Burada çiçek yok.');
    const def = FLOWERS[t.item.flower];
    const seedCost = t.item.wilted ? this.reviveCost(t.item.flower) : this.seedCost(t.item.flower);
    if (this.state.coins < seedCost) return this.fail(`Yeterli jeton yok (${seedCost} gerekli).`);
    this.state.coins -= seedCost;
    t.item.plantedDay = this.dayIndex();
    t.item.wilted = false;
    this.questEvent('revive', { flower: t.item.flower });
    this.save();
    return { ok: true, msg: `${def.name} yeniden canlandı (-${seedCost} 🪙).` };
  }

  removeFlower(k) {
    const t = this.state.tiles[k];
    if (!t || !t.item || t.item.type !== 'flower') return this.fail('Burada çiçek yok.');
    t.item = null;
    this.save();
    return { ok: true, msg: 'Tarh temizlendi.' };
  }

  // 1. aşamada anında hasat; arıcının yürüyüşü 2. aşamada gelecek.
  harvestHive(hiveId) {
    const hive = this.state.hives[hiveId];
    if (hive) this.lastHoney = { ...hive.honey };
    if (!hive) return this.fail('Kovan bulunamadı.');
    const total = this.hiveTotal(hive);
    if (total < 0.05) return this.fail('Hasat edilecek bal yok.');
    const stored = Object.values(this.state.storage).reduce((a, b) => a + b, 0);
    const room = this.state.storageCap - stored;
    if (room <= 0.05) return this.fail('Depo dolu.');
    const scale = Math.min(1, room / total);
    let moved = 0;
    for (const [f, kg] of Object.entries(hive.honey)) {
      const take = kg * scale;
      this.state.storage[f] = (this.state.storage[f] || 0) + take;
      hive.honey[f] = kg - take;
      if (hive.honey[f] < 0.001) delete hive.honey[f];
      moved += take;
    }
    const wax = moved * WAX_PER_KG;
    this.state.wax += wax;
    this.recordHarvest(hive, moved, scale);
    this.save();
    return { ok: true, msg: `+${moved.toFixed(1)} kg bal depoya eklendi (+${Math.round(wax * 1000)} g balmumu).`, kg: moved };
  }

  harvestAll() {
    let n = 0;
    for (const h of Object.values(this.state.hives)) {
      if (this.hiveTotal(h) >= 0.05 && !this.isQueued(h.id)) { this.state.keeper.queue.push(h.id); n += 1; }
    }
    if (!n) return this.fail('Hasat edilecek bal yok.');
    this.processKeeper(Date.now());
    this.save();
    return { ok: true, msg: n > 1 ? `Arıcı ${n} kovanı sırayla hasat edecek.` : '' };
  }

  setSpeed(speed) {
    if (![0, 1, 2, 4].includes(speed)) return this.fail('Geçersiz hız.');
    this.state.speed = speed;
    this.save();
    return { ok: true };
  }

  // --- Pencereye gönderilen görünüm -----------------------------------------
  view() {
    const s = this.state;
    const storageKg = Object.values(s.storage).reduce((a, b) => a + b, 0);
    const hives = {};
    for (const h of Object.values(s.hives)) {
      const rates = this.hiveRates(h.id);
      hives[h.id] = {
        ...h,
        immuneDays: Math.max(0, (h.immuneUntil || 0) - this.dayIndex()),
        sickDeaths: h.sickDeaths || 0,
        sickDeathLimit: h.sick ? this.sicknessDeathLimit(h) : 0,
        total: this.hiveTotal(h),
        ratePerHour: Object.values(rates).reduce((a, b) => a + b, 0),
        near: this.flowersNear(this.hiveTileKey(h.id) || '0,0'),
        queenName: QUEEN_NAMES[h.queens] || QUEEN_NAMES[0],
        nextQueenName: QUEEN_NAMES[h.queens + 1] || null,
        next: this.nextUpgrade(h),
        beePrice: this.beePrice(h),
        beeSellPrice: this.beeSellPrice(h),
        sellValue: this.sellValue(h),
        queued: !!this.isQueued(h.id)
      };
    }
    return {
      coins: s.coins,
      speed: s.speed,
      storage: s.storage,
      storageKg,
      storageCap: s.storageCap,
      calendar: this.calendar(),
      tiles: s.tiles,
      hives,
      tilePrice: this.tilePrice(),
      hiveCost: HIVE_COST,
      syrupCost: this.syrupCost(),
      syrupKg: SYRUP_KG,
      keeper: this.state.keeper,
      market: this.prices(),
      orders: this.ordersView(),
      weather: { id: this.state.weather, ...(WEATHER[this.state.weather] || WEATHER.bulutlu) },
      tutorialDone: this.state.tutorialDone,
      medicineCost: this.medicineCost(),
      focusBoostLeftMs: Math.max(0, (this.state.focusBoostUntil || 0) - Date.now()),
      focusBoost: FOCUS_BOOST,
      customers: this.state.customers,
      heartMax: HEART_MAX,
      vouchers: this.state.vouchers,
      decor: Object.fromEntries(Object.entries(DECOR).map(([k, d]) => [k, { ...d, cost: this.decorCost(k) }])),
      breeds: BREEDS,
      breedChangeCost: BREED_CHANGE_COST,
      wax: this.state.wax,
      candles: this.state.candles,
      candleWax: CANDLE_WAX,
      candlePrice: this.candlePrice(),
      festival: { open: this.festivalOpen(), entry: this.state.festival.entry, cups: this.state.festival.cups, maxKg: FESTIVAL_MAX_KG },
      flowerLife: FLOWER_LIFE_DAYS + this.fx('flowerLife'),
      dayIndex: this.dayIndex(),
      clusterBonus: CLUSTER_BONUS,
      clusterTiles: Object.fromEntries(Object.entries(this.state.tiles)
        .filter(([, t]) => t.item && t.item.type === 'flower').map(([k]) => [k, this.clusterBonus(k) > 0])),
      leaderboard: this.leaderboard(),
      farmName: this.state.farmName,
      quests: (this.ensureQuests(), this.state.quests.list.map((q) => ({ ...q, text: this.questText(q) }))),
      questsDone: this.state.questsDone,
      ledger: this.state.ledger,
      history: this.state.history,
      today: {
        produced: Math.round((this.state.counters.produced - this.dayStart.produced) * 10) / 10,
        earned: Math.round(this.state.counters.earned - this.dayStart.earned)
      },
      label: this.state.label,
      labelDesigns: LABEL_DESIGNS,
      labelBonus: LABEL_BONUS,
      milestones: this.state.milestones,
      merchant: this.merchantView(),
      letters: this.state.letters.slice().reverse(),
      lettersUnread: this.state.letters.filter((l) => !l.read).length,
      gameSettings: this.state.gameSettings,
      syrupAllCost: this.syrupAllCost(),
      hints: this.hints(),
      stories: this.storiesView(),
      effects: this.effectsView(),
      notifs: (this.state.notifs || []).slice().reverse(),
      notifsUnread: this.state.notifsUnread || 0,
      reviveRate: REVIVE_RATE,
      soldTotalKg: Math.round((Object.values(this.state.ledger.honey).reduce((a, x) => a + (x.soldKg || 0), 0) + (this.state.village ? this.state.village.deliveredKg : 0)) * 10) / 10,
      relations: Object.fromEntries(Object.keys(this.state.customers).map((n) => [n, this.relation(n)])),
      dayMs: DAY_GAME_MS,
      marketEvent: this.state.market.event,
      seasonPrice: SEASON_PRICE[this.calendar().season],
      nextStorage: this.nextStorage(),
      houseKey: this.houseKey(),
      now: Date.now(),
      flowers: Object.fromEntries(Object.entries(FLOWERS).map(([k, f]) => [k, { ...f, seed: this.seedCost(k) }])),
      village: this.villageView(),
      unattended: Date.now() - s.lastSeenAt > UNATTENDED_CAP_MS
    };
  }
}

module.exports = { BeeGame, FLOWERS, freshState };
