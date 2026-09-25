// Arıcılık mini oyunu: oyun mantığı.
// Nero'nun ana sürecinde çalışır; oyun penceresi kapalıyken de üretim sürer.
// Durum JsonStore ile %APPDATA%\Nero\bee.json dosyasında tutulur.

const HOUR_MS = 60 * 60 * 1000;
const DAY_GAME_MS = 15 * 60 * 1000;      // 1 oyun günü = 1x hızda 15 gerçek dakika
const DAYS_PER_SEASON = 15;               // bir oyun ayı/mevsim dönemi = 15 gün
const SEASONS = ['ilkbahar', 'yaz', 'sonbahar', 'kis'];
const SEASON_NAMES = { ilkbahar: 'İlkbahar', yaz: 'Yaz', sonbahar: 'Sonbahar', kis: 'Kış' };
const UNATTENDED_CAP_MS = 2 * HOUR_MS;   // oyuna bakılmazsa en fazla 2 saatlik üretim birikir
const BASE_KG_PER_BEE_HOUR = 0.5;        // 1 arı, +%0 çiçekle saatte 0.5 kg (uzun vadeli tempo)
const HIVE_COST = 1200;
const START_COINS = 200;
const FLOWER_LIFE_DAYS = 30;             // çiçekler 2 oyun ayı/mevsim dönemi sonra solar
const OUT_OF_SEASON = 0.25;              // mevsimi dışındaki çiçek
const WINTER_FACTOR = 0.1;               // kışın (şurup 2. aşamada)
const ISLAND_RADIUS = 5;
const WINTER_SYRUP_FACTOR = 0.35;        // kışın şurubu olan kovan biraz daha üretir
const SYRUP_COST = 60;
const SYRUP_KG = 6;
const BREED_EVERY_DAYS = 2;
const WORK_MS = 5000;                    // arıcının kovanda çalışma süresi
const WALK_MS_PER_TILE = 700;

const SEASON_PRICE = { ilkbahar: 1, yaz: 0.85, sonbahar: 1, kis: 1.35 };
const STORAGE_UPGRADES = [{ cap: 100, cost: 450 }, { cap: 200, cost: 1200 }, { cap: 400, cost: 3000 }];
const HISTORY_DAYS = 7;
const ORDER_EVERY_MS = 10 * 60 * 1000;   // 1x hızda 10 dakikada bir sipariş (oyun zamanı)
const ORDER_MAX = 5;
const ORDER_SWAP_COST = 25;
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
const QUEST_TYPES = ['harvest', 'harvestFlower', 'sell', 'deliver', 'candle', 'plant'];
const LABEL_DESIGNS = { klasik: 'Klasik', cicekli: 'Çiçekli', petek: 'Petek', sade: 'Sade' };
const LABEL_BONUS = 0.05;          // etiketli kavanoz: müdavimler %5 fazla öder
const HISTORY_KEEP = 20;
const SICK_CHANCE = 0.03;          // kış dışında, kovan başına günlük hastalanma ihtimali
const SICK_MULT = 0.7;             // hasta kovan %30 daha az üretir
const MEDICINE_COST = 120;
const CLUSTER_BONUS = 0.15;        // aynı türden en az 3 tarh yan yanaysa
const AWAY_SUMMARY_MS = 3 * 60 * 1000;

// 1) Odak bonusu: Nero'da odaklandıkça arılar da coşar
const FOCUS_BOOST = 0.25;                 // +%25 üretim
const FOCUS_BOOST_MS = 60 * 60 * 1000;    // odak seansı başına 1 gerçek saat (üst üste eklenir, en fazla 4 saat)
const TODO_REWARD = 10;                   // Nero'da bitirilen her iş: +10 jeton

// 2) Müdavim köylüler
const HEART_EVERY = 2;                    // her 2 teslimde +1 kalp
const HEART_MAX = 5;
const HEART_BONUS = 0.06;                 // kalp başına +%6 ödeme

// 3) Dekorlar (kare kaplamaz, karenin kenarına konur)
const DECOR = {
  cit:    { name: 'Çit', cost: 40, desc: 'Tarhların etrafına sevimli bir çit.' },
  bank:   { name: 'Bank', cost: 120, desc: 'Arıları seyretmek için.' },
  fener:  { name: 'Fener', cost: 150, desc: 'Akşamları sıcak bir ışık.' },
  kemer:  { name: 'Çiçekli kemer', cost: 300, desc: 'Adanın girişine romantik bir kemer.' },
  cesme:  { name: 'Çeşme', cost: 400, desc: 'Yanındaki tarhlar +%5 üretir.', bonus: 0.05 },
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
const BREED_CHANGE_COST = 300;

// 6) Balmumu ve mum
const WAX_PER_KG = 0.05;                  // her 1 kg hasatta 50 g balmumu
const CANDLE_WAX = 0.5;                   // 1 mum = 0.5 kg balmumu
const CANDLE_PRICE = 45;

const CUSTOMERS = ['Ayşe Teyze', 'Mehmet Usta', 'Küçük Elif', 'Fırıncı Leyla', 'Kasabalı Cem', 'Hacer Nine', 'Muhtar Rıza',
  'Pastacı Nur', 'Öğretmen Selin', 'Balıkçı Kemal', 'Doktor Aslı', 'Bakkal Hüseyin'];

const QUEEN_NAMES = ['Genç Kraliçe', 'Sağlıklı Kraliçe', 'Güçlü Kraliçe', 'Olgun Kraliçe', 'Asil Kraliçe', 'Efsane Kraliçe'];
// Sıra: önce arı, sonra kovan, sonra yine arı. Arı üst sınırı 20.
const UPGRADES = [
  { type: 'queen', capBees: 12, cost: 450 },
  { type: 'hive', capKg: 30, cost: 750 },
  { type: 'queen', capBees: 14, cost: 1200 },
  { type: 'hive', capKg: 40, cost: 1800 },
  { type: 'queen', capBees: 16, cost: 2700 },
  { type: 'hive', capKg: 60, cost: 3900 },
  { type: 'queen', capBees: 18, cost: 5700 },
  { type: 'queen', capBees: 20, cost: 8400 },
  { type: 'hive', capKg: 80, cost: 9000 }
];

const FLOWERS = {
  yonca:    { name: 'Yonca',    seed: 60,  buff: 0.00, price: 8,  seasons: ['ilkbahar', 'yaz'], color: '#C9E6A0', petal: '#FFFFFF' },
  papatya:  { name: 'Papatya',  seed: 120, buff: 0.08, price: 12, seasons: ['ilkbahar', 'yaz'], color: '#F0DE7A', petal: '#FFFFFF' },
  aycicegi: { name: 'Ayçiçeği', seed: 250, buff: 0.18, price: 18, seasons: ['yaz'],             color: '#F5C851', petal: '#F7C22E' },
  kekik:    { name: 'Kekik',    seed: 450, buff: 0.30, price: 26, seasons: ['ilkbahar', 'yaz'], color: '#D8A6E0', petal: '#C98BD6' },
  lavanta:  { name: 'Lavanta',  seed: 800, buff: 0.45, price: 38, seasons: ['yaz'],             color: '#B79BE0', petal: '#9C7BD6' },
  ihlamur:  { name: 'Ihlamur',  seed: 1300, buff: 0.65, price: 55, seasons: ['ilkbahar'],        color: '#9FD6C9', petal: '#F3EBAE' },
  kestane:  { name: 'Kestane',  seed: 2200, buff: 0.90, price: 80, seasons: ['sonbahar'],        color: '#B98A5A', petal: '#E8D9A0' }
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
  return { breed: 'anadolu', id, name, bees, capBees: 10, capKg: 20, honey: {}, level: 0, queens: 0, syrup: 0, beesBought: 0, invested, breedDay: 0 };
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
      Object.assign(h, { level: 0, queens: 0, syrup: 0, beesBought: 0, invested: 0, breedDay: 0, ...h });
    }
    this.state.weather = this.state.weather || 'gunesli';
    this.state.counters = this.state.counters || { produced: 0, born: 0, ordersIn: 0, died: 0 };
    if (this.state.tutorialDone === undefined) this.state.tutorialDone = true; // eski kayıtlarda tanıtım gösterilmez
    for (const t of Object.values(this.state.tiles)) {
      if (t.item && t.item.type === 'flower' && t.item.plantedDay === undefined) t.item.plantedDay = this.dayIndex();
    }
    Object.assign(this.state, {
      focusBoostUntil: 0, customers: {}, vouchers: {}, wax: 0, candles: 0,
      festival: { entry: null, cups: [], lastYear: 0 }, ...this.state
    });
    for (const h of Object.values(this.state.hives)) if (!h.breed) h.breed = 'anadolu';
    Object.assign(this.state, {
      farmName: 'Nero Çiftliği', quests: null, questsDone: 0, milestones: {}, history: [],
      label: null, ledger: { honey: {}, harvests: 0, ordersDone: 0, candlesMade: 0, bestSale: null, maxBees: 0 },
      ...this.state
    });
    this.state.counters.earned = this.state.counters.earned || 0;
    this.dayStart = { produced: this.state.counters.produced, earned: this.state.counters.earned };
    // Eski kayıtlarda mevsime uymayan hava kalmışsa (ör. kışın güneş) düzelt
    const season0 = this.calendar().season;
    if (!WEATHER_ODDS[season0].some(([w]) => w === this.state.weather)) this.rollWeather(season0, true);
    this.alertSeen = {};
    this.events = [];
    this.lastDay = this.dayIndex();
    if (!this.state.market) this.state.market = this.newMarket();
    if (!this.state.orders) this.state.orders = { list: [], nextAt: this.state.gameMs + ORDER_EVERY_MS };
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
        * breed.prod * focus;
      if (season === 'kis') mult *= hive.syrup > 0 ? WINTER_SYRUP_FACTOR : WINTER_FACTOR;
      else if (!def.seasons.includes(season)) mult *= OUT_OF_SEASON;
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

  // --- Günlük olaylar: üreme, kış kaybı -------------------------------------
  onNewDay(dayIdx) {
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
      if (t.item && t.item.type === 'flower' && !t.item.wilted && dayIdx - (t.item.plantedDay || 0) >= FLOWER_LIFE_DAYS) {
        t.item.wilted = true;
        this.events.push({ msg: `🥀 Bir ${FLOWERS[t.item.flower].name} tarhı soldu. Yeniden ekmen gerekiyor.`, err: true });
      }
    }
    for (const h of Object.values(this.state.hives)) {
      const k = this.hiveTileKey(h.id);
      if (!k) continue;
      // Hastalık: yakalanır, ilgilenilmezse 2 günde bir arı kaybettirir
      if (h.sick) {
        if ((dayIdx - h.sickSince) % 2 === 1 && h.bees > 1) {
          h.bees -= 1;
          this.state.counters.died += 1;
          this.events.push({ msg: `${h.name}: hasta kovanda bir arı öldü. İlaç ver!`, err: true });
        }
      } else if (season !== 'kis' && Math.random() < SICK_CHANCE * (BREEDS[h.breed] || BREEDS.anadolu).sick) {
        h.sick = true;
        h.sickSince = dayIdx;
        this.events.push({ msg: `🤒 ${h.name} hastalandı! Üretim düştü, ilaç ver.`, err: true });
      }
      if (season === 'kis') {
        if (h.syrup >= 1) h.syrup -= 1;
        else if (h.bees > 1 && dayIdx % (BREEDS[h.breed] || BREEDS.anadolu).winter === 0) {
          h.bees -= 1;
          this.state.counters.died += 1;
          this.events.push({ msg: `${h.name}: kışın aç kalan bir arı öldü. Şurup ver!`, err: true });
        }
      } else if (h.bees < h.capBees && this.flowersNear(k).length && dayIdx - h.breedDay >= (BREEDS[h.breed] || BREEDS.anadolu).breedDays) {
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
    const base = Math.max(now, this.state.focusBoostUntil || 0);
    this.state.focusBoostUntil = Math.min(now + 4 * FOCUS_BOOST_MS, base + FOCUS_BOOST_MS * (minutes / 25));
    this.events.push({ msg: `🔥 ${minutes} dakika odaklandın, arılar coştu! Kovanlar bir süre %${FOCUS_BOOST * 100} hızlı.` });
    this.save();
    return true;
  }

  todoCompleted() {
    this.state.coins += TODO_REWARD;
    this.events.push({ msg: `✅ Nero'da bir iş bitirdin: +${TODO_REWARD} 🪙` });
    this.save();
  }

  // --- 2) Müdavim köylüler --------------------------------------------------------
  bond(who) {
    const c = this.state.customers[who] || { delivered: 0, hearts: 0 };
    c.delivered += 1;
    const hearts = Math.min(HEART_MAX, Math.floor(c.delivered / HEART_EVERY));
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
    if (this.state.coins < d.cost) return this.fail(`Yeterli jeton yok (${d.cost} gerekli).`);
    this.state.coins -= d.cost;
    t.decor = id;
    this.save();
    return { ok: true, msg: `${d.name} yerleştirildi (-${d.cost} 🪙).` };
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
    this.state.festival.entry = { flower, kg: amount, score: Math.round(amount * FLOWERS[flower].price * (1 + FLOWERS[flower].buff)) };
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
    this.save();
    return { ok: true, msg: `${h.name} artık ${BREEDS[breed].name} kraliçesiyle.` };
  }

  // --- 6) Balmumu ve mum ------------------------------------------------------
  makeCandle() {
    if (this.state.wax + 1e-6 < CANDLE_WAX) return this.fail(`Mum için ${CANDLE_WAX * 1000} g balmumu gerekli (${Math.round(this.state.wax * 1000)} g var).`);
    this.state.wax -= CANDLE_WAX;
    this.state.candles += 1;
    this.state.ledger.candlesMade += 1;
    this.questProgress('candle', 1);
    this.save();
    return { ok: true, msg: '🕯️ Bir mum yaptın.' };
  }

  candlePrice() {
    const season = this.calendar().season;
    return Math.round(CANDLE_PRICE * (season === 'kis' ? 1.4 : 1) * (this.state.market.mult.yonca || 1));
  }

  sellCandles() {
    if (this.state.candles < 1) return this.fail('Satacak mum yok.');
    const gain = this.state.candles * this.candlePrice();
    const n = this.state.candles;
    this.state.candles = 0;
    this.state.coins += gain;
    this.state.counters.earned += gain;
    this.save();
    return { ok: true, msg: `${n} mum satıldı (+${gain} 🪙).` };
  }

  // --- Bal Defteri -----------------------------------------------------------------
  ledgerHoney(f) {
    const h = this.state.ledger.honey;
    if (!h[f]) h[f] = { kg: 0, soldKg: 0, earned: 0, bestPrice: 0, first: null };
    return h[f];
  }

  recordHarvest(hive, moved, scale) {
    const cal = this.calendar();
    for (const [f, kg] of Object.entries(this.lastHoney || {})) {
      const L = this.ledgerHoney(f);
      const took = kg * scale;
      if (!L.first && took > 0.01) {
        L.first = { day: cal.day, season: cal.seasonName, year: cal.year };
        this.events.push({ msg: `📖 Bal Defteri'ne yeni sayfa: ilk ${FLOWERS[f].name} balın!` });
      }
      L.kg += took;
      this.questProgress('harvestFlower', took, f);
    }
    this.state.ledger.harvests += 1;
    this.questProgress('harvest', moved);
    const total = Object.values(this.state.ledger.honey).reduce((a, x) => a + x.kg, 0);
    if (total >= 20) this.milestone('ilk_kavanoz', 'İlk kavanoz: toplam 20 kg bal hasat ettin');
    if (Object.keys(FLOWERS).every((f) => (this.state.ledger.honey[f] || {}).first)) this.milestone('tum_ballar', 'Yedi balın hepsini ürettin');
  }

  // Nero rozetlerine sonradan bağlanabilsin diye büyük anlar kaydedilir (şimdilik sadece kayıt)
  milestone(id, text) {
    if (this.state.milestones[id]) return;
    this.state.milestones[id] = Date.now();
    this.events.push({ msg: `🌟 ${text}`, milestone: id });
  }

  // --- Günlük görevler -------------------------------------------------------------
  todayKey() { return new Date().toDateString(); }

  ensureQuests() {
    const q = this.state.quests;
    if (q && q.day === this.todayKey()) return;
    const planted = this.plantedFlowers();
    const pool = QUEST_TYPES.filter((t) => t !== 'harvestFlower' || planted.length);
    const list = [];
    while (list.length < 3 && pool.length) {
      const type = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
      const quest = { id: uid(), type, progress: 0, claimed: false };
      if (type === 'harvest') Object.assign(quest, { target: 5 + Math.floor(Math.random() * 3) * 5, reward: 60 });
      if (type === 'harvestFlower') Object.assign(quest, { flower: planted[Math.floor(Math.random() * planted.length)], target: 3 + Math.floor(Math.random() * 4), reward: 70 });
      if (type === 'sell') Object.assign(quest, { target: 5 + Math.floor(Math.random() * 3) * 3, reward: 50 });
      if (type === 'deliver') Object.assign(quest, { target: 1, reward: 80 });
      if (type === 'candle') Object.assign(quest, { target: 1, reward: 40 });
      if (type === 'plant') Object.assign(quest, { target: 1, reward: 40 });
      // Arada bir ödül hediye tohum olur
      if (Math.random() < 0.2) {
        const tiers = ['papatya', 'aycicegi', 'kekik'];
        quest.voucher = tiers[Math.floor(Math.random() * tiers.length)];
      }
      list.push(quest);
    }
    this.state.quests = { day: this.todayKey(), list };
  }

  questProgress(type, amount, flower) {
    this.ensureQuests();
    for (const q of this.state.quests.list) {
      if (q.type !== type || q.claimed || q.progress >= q.target) continue;
      if (type === 'harvestFlower' && q.flower !== flower) continue;
      q.progress = Math.min(q.target, q.progress + amount);
      if (q.progress >= q.target) this.events.push({ msg: '✅ Günlük görev tamamlandı! Ödülünü almayı unutma.' });
    }
  }

  claimQuest(id) {
    this.ensureQuests();
    const q = this.state.quests.list.find((x) => x.id === id);
    if (!q || q.claimed) return this.fail('Görev bulunamadı.');
    if (q.progress < q.target) return this.fail('Görev henüz tamamlanmadı.');
    q.claimed = true;
    this.state.coins += q.reward;
    this.state.questsDone += 1;
    if (q.voucher) this.state.vouchers[q.voucher] = (this.state.vouchers[q.voucher] || 0) + 1;
    this.save();
    return { ok: true, msg: `Görev ödülü: +${q.reward} 🪙${q.voucher ? ` ve 1 ${FLOWERS[q.voucher].name} tohumu 🎁` : ''}` };
  }

  questText(q) {
    const f = q.flower ? FLOWERS[q.flower].name : '';
    return {
      harvest: `${q.target} kg bal hasat et`,
      harvestFlower: `${q.target} kg ${f} balı hasat et`,
      sell: `Pazarda ${q.target} kg bal sat`,
      deliver: 'Bir siparişi teslim et',
      candle: 'Bir mum yap',
      plant: 'Bir tarh ek ya da yeniden ek'
    }[q.type];
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
    if (this.state.coins < MEDICINE_COST) return this.fail(`Yeterli jeton yok (${MEDICINE_COST} gerekli).`);
    this.state.coins -= MEDICINE_COST;
    h.sick = false;
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
    return out;
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
    this.questProgress('sell', kg);
    this.save();
    return { ok: true, msg: `${kg.toFixed(1)} kg ${FLOWERS[f].name} balı satıldı (+${gain} 🪙).` };
  }

  nextStorage() { return STORAGE_UPGRADES.find((u) => u.cap > this.state.storageCap) || null; }

  upgradeStorage() {
    const u = this.nextStorage();
    if (!u) return this.fail('Depo en büyük boyutta.');
    if (this.state.coins < u.cost) return this.fail(`Yeterli jeton yok (${u.cost} gerekli).`);
    this.state.coins -= u.cost;
    this.state.storageCap = u.cap;
    this.save();
    return { ok: true, msg: `Depo büyüdü: artık ${u.cap} kg alıyor.` };
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
    const f = planted[Math.floor(Math.random() * planted.length)];
    const def = FLOWERS[f];
    // Değerli bal daha az miktarda istenir
    const maxKg = def.price >= 50 ? 5 : def.price >= 25 ? 8 : 12;
    const kg = Math.max(2, Math.round(2 + Math.random() * (maxKg - 2)));
    const days = 2 + Math.floor(Math.random() * 4);
    // Tanıdık köylüler biraz daha sık gelir
    const known = Object.keys(this.state.customers).filter((n) => this.state.customers[n].hearts > 0);
    const who = known.length && Math.random() < 0.45 ? known[Math.floor(Math.random() * known.length)]
      : CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
    const hearts = (this.state.customers[who] || {}).hearts || 0;
    const reward = Math.round(kg * def.price * (1.4 + Math.random() * 0.4) * (1 + hearts * HEART_BONUS)); // piyasadan daha iyi öder
    return { id: uid(), who, flower: f, kg, reward, days, status: 'open', deadline: null };
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
    // Yeni sipariş
    if (o.list.length >= ORDER_MAX) { o.nextAt = now + ORDER_EVERY_MS; return; }
    if (now >= o.nextAt) {
      const ord = this.makeOrder();
      o.nextAt = now + ORDER_EVERY_MS;
      if (ord) {
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
    const extra = known && this.state.label ? Math.round(ord.reward * LABEL_BONUS) : 0;
    this.state.coins += ord.reward + extra;
    this.state.counters.earned += ord.reward + extra;
    this.state.orders.list = this.state.orders.list.filter((x) => x.id !== id);
    this.bond(ord.who);
    this.state.ledger.ordersDone += 1;
    this.questProgress('deliver', 1);
    this.save();
    return { ok: true, msg: `${ord.who} çok memnun kaldı! +${ord.reward} 🪙${extra ? ` (+${extra} etiket bahşişi)` : ''}` };
  }

  rejectOrder(id) {
    const ord = this.findOrder(id);
    if (!ord) return this.fail('Sipariş bulunamadı.');
    if (ord.status === 'accepted') {
      // Kabul edilmiş siparişten vazgeçmek de ceza getirir
      const fine = Math.round(ord.reward * ORDER_PENALTY);
      this.state.coins = Math.max(0, this.state.coins - fine);
      this.state.orders.list = this.state.orders.list.filter((x) => x.id !== id);
      this.save();
      return { ok: true, msg: `Siparişten vazgeçtin. -${fine} 🪙 ceza.` };
    }
    this.state.orders.list = this.state.orders.list.filter((x) => x.id !== id);
    this.save();
    return { ok: true, msg: 'Sipariş reddedildi.' };
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
      nextInMs: o.list.length >= ORDER_MAX ? null : Math.max(0, o.nextAt - now),
      max: ORDER_MAX,
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

  drainEvents() { const e = this.events; this.events = []; return e; }

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
  beePrice(h) { return 45 + h.beesBought * 9; }
  beeSellPrice(h) { return Math.floor(this.beePrice(h) / 2); }

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
      h.queens += 1;
      h.capBees = u.capBees;
      if (u.capBees >= 20) this.milestone('kovan_20', `${h.name} 20 arılık dev bir kovan oldu`);
      this.save();
      return { ok: true, msg: `${QUEEN_NAMES[h.queens]} geldi! Kapasite ${u.capBees} arı.` };
    }
    h.capKg = u.capKg;
    this.save();
    return { ok: true, msg: `Kovan büyüdü: artık ${u.capKg} kg bal alıyor.` };
  }

  giveSyrup(hiveId) {
    const h = this.state.hives[hiveId];
    if (!h) return this.fail('Kovan bulunamadı.');
    if (this.state.coins < SYRUP_COST) return this.fail(`Yeterli jeton yok (${SYRUP_COST} gerekli).`);
    this.state.coins -= SYRUP_COST;
    h.syrup += SYRUP_KG;
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

  tilePrice() { return Math.round(80 * Math.pow(1.4, this.state.tilesBought)); }

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
    if (!free && this.state.coins < def.seed) return this.fail(`Yeterli jeton yok (${def.seed} gerekli).`);
    if (free) this.state.vouchers[flower] -= 1; else this.state.coins -= def.seed;
    t.item = { type: 'flower', flower, plantedDay: this.dayIndex(), wilted: false };
    this.questProgress('plant', 1);
    this.save();
    return { ok: true, msg: free ? `${def.name} hediye tohumla ekildi 🎁` : `${def.name} ekildi (-${def.seed} 🪙).` };
  }

  replant(k) {
    const t = this.state.tiles[k];
    if (!t || !t.item || t.item.type !== 'flower') return this.fail('Burada çiçek yok.');
    const def = FLOWERS[t.item.flower];
    if (this.state.coins < def.seed) return this.fail(`Yeterli jeton yok (${def.seed} gerekli).`);
    this.state.coins -= def.seed;
    t.item.plantedDay = this.dayIndex();
    t.item.wilted = false;
    this.questProgress('plant', 1);
    this.save();
    return { ok: true, msg: `${def.name} yeniden ekildi (-${def.seed} 🪙).` };
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
      syrupCost: SYRUP_COST,
      syrupKg: SYRUP_KG,
      keeper: this.state.keeper,
      market: this.prices(),
      orders: this.ordersView(),
      weather: { id: this.state.weather, ...(WEATHER[this.state.weather] || WEATHER.bulutlu) },
      tutorialDone: this.state.tutorialDone,
      medicineCost: MEDICINE_COST,
      focusBoostLeftMs: Math.max(0, (this.state.focusBoostUntil || 0) - Date.now()),
      focusBoost: FOCUS_BOOST,
      customers: this.state.customers,
      heartMax: HEART_MAX,
      vouchers: this.state.vouchers,
      decor: DECOR,
      breeds: BREEDS,
      breedChangeCost: BREED_CHANGE_COST,
      wax: this.state.wax,
      candles: this.state.candles,
      candleWax: CANDLE_WAX,
      candlePrice: this.candlePrice(),
      festival: { open: this.festivalOpen(), entry: this.state.festival.entry, cups: this.state.festival.cups, maxKg: FESTIVAL_MAX_KG },
      flowerLife: FLOWER_LIFE_DAYS,
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
      dayMs: DAY_GAME_MS,
      marketEvent: this.state.market.event,
      seasonPrice: SEASON_PRICE[this.calendar().season],
      nextStorage: this.nextStorage(),
      houseKey: this.houseKey(),
      now: Date.now(),
      flowers: FLOWERS,
      unattended: Date.now() - s.lastSeenAt > UNATTENDED_CAP_MS
    };
  }
}

module.exports = { BeeGame, FLOWERS, freshState };
