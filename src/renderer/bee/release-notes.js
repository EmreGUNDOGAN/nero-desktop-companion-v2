// Sürüm yenilikleri yalnızca GitHub Releases sayfasındaki yayımlanmış sürümlerden gelir.
// 6.6.1: başlık ve açıklama ayrı alanlardır; cümle bölerek başlık üretmek yasaktır.
export const RELEASES_PAGE_URL = 'https://github.com/EmreGUNDOGAN/nero-desktop-companion-v2/releases';

export function normalizeReleaseVersion(release) {
  const raw = String(release?.tag_name || release?.name || '');
  const match = raw.match(/\d+\.\d+\.\d+/);
  return match ? match[0] : null;
}

const RECENT_RELEASE_NOTES = {
  '6.5.0': [
    ['📦','Merkezi Depo','Bal, arıcılık malzemeleri, tohumlar, dekorlar ve işlenmiş ürünler tek merkezde ayrı sekmelerle yönetilmeye başladı.'],
    ['🔨','Fiziksel Arıcılık Atölyesi','Atölye çiftliğin yanında fiziksel bir binaya taşındı; üretimler gerçek malzeme tüketiyor ve tamamlanan ürünler Depo’ya gidiyor.'],
    ['🛒','Seyyah Yakup Dengesi','Yakup’un standart bal alım farkı +%15 olarak eşitlendi; Seyyah Satış Fişi’nin ek avantajı korundu.'],
    ['🌱','Tohum ve Dekor Envanteri','Satın alınan tohum ve dekorlar artık önce Depo stoğuna giriyor; yerleştirme ve ekim bu stoktan yapılıyor.']
  ],
  '6.4.0': [
    ['❄️','Kış Pazar Dengesi','Normal balın kış fiyat avantajı +%35’ten +%15’e indirildi; günlük dalgalanma ve diğer pazar etkileri korundu.'],
    ['🐝','Gerçek Yan Ürünler','Polen, Propolis ve Arı Sütü hasat tıklamasına değil gerçek kovan üretimine bağlandı.'],
    ['🔨','Arıcılık Atölyesi','Yan ürünleri işleyen, oyun zamanı ile çalışan ve köy ilerledikçe yeni tarifler açan Atölye sistemi eklendi.']
  ],
  '6.3.14': [
    ['🪟','Tam Kenar Boyutlandırma','Panel yeniden pencerenin tüm gölgeli Windows kenarından boyutlandırılabilir hale getirildi.'],
    ['⚙️','Ayarlar Kaydırması','Ayarlar sayfasındaki dikey kaydırma geri getirildi; uzun kartlar artık kesilmiyor.']
  ],
  '6.3.11': [
    ['⚠️','Uyarı Merkezi','Kırmızı ünlem düğmesi aktif uyarı olmasa da görünür hale geldi ve sorunlu kovan/tarh/depo hedeflerine gitme davranışı korundu.'],
    ['📋','Resmî Sürüm Notları','Sürüm Yenilikleri verisi yayımlanmış GitHub Releases kayıtlarından alınmaya başladı.'],
    ['🧩','Panel Yerleşimi','Bozulan kart ve bölüm boşlukları çalışan panel düzenine geri döndürüldü.']
  ],
  '6.3.0': [
    ['👕','Kıyafet Dolabı','Masaüstü Nero için kategori ve özel gün kıyafetlerini içeren kıyafet sistemi eklendi.'],
    ['🏝️','Canlanan Ada','Mevsimsel görünüm, gelişen çiftlik evi, depo, hasat animasyonları ve günün saatine göre ışık geçişleri eklendi.'],
    ['🎥','Kamera Kontrolleri','Kamera döndürme, Adaya Dön ve yakınlaştırma davranışları genişletildi.']
  ],
  '6.2.0': [
    ['🏡','Köy Yapıları Yenilendi','78 köy evi, dükkânı ve bina kendine özgü üç boyutlu modellere kavuştu.'],
    ['🧑‍🌾','Arıcı Animasyonları','Arıcının kıyafeti, eklemli hareketleri, körük ve hasat animasyonları yenilendi.'],
    ['🐝','Çiftlik Görselleri','Çiftlik evi, kovanlar, arılar, tarhlar, göller ve Seyyah Yakup arabası geliştirildi.']
  ],
  '6.1.0': [
    ['🏝️','Ada Genişlemesi','Ada üç ekilebilir halka genişledi; köy dış çepere taşındı ve eski kayıtlar korundu.'],
    ['🎪','Festival Meydanı','Su kenarında beş karelik festival alanı, sahne/tezgâh ve mevsimsel dekor sistemi eklendi.'],
    ['⚖️','Denge ve Kullanım','Balmumu, mum fiyatı, rakip üretimi, sipariş bal türleri ve Nero konuşma süreleri yeniden dengelendi.']
  ],
  '6.0.0': [
    ['🏘️','Yaşayan Köy','Köylüler gündüz evlerinden çıkıp yürümeye, sipariş teslimlerinde ziyarete gelmeye ve akşam eve dönmeye başladı.'],
    ['🐙','Nero Adada','Nero çiftlikte dolaşmaya, köylülerle karşılaşmaya ve geceleri evin yanında uyumaya başladı.'],
    ['🏆','Dört Mevsim Turnuvası','Bal Kalitesi, Arıcılık, Üretim ve Köy İtibarı kategorileriyle dört mevsim turnuva sistemi eklendi.'],
    ['🌸','Çiçek ve Mevsim Dengesi','Kış Fundası, mevsim uyumu ve yeni çiçek üretim bonusları sisteme eklendi.']
  ],
  '5.5.6': [
    ['🎨','Arıcılık Arayüzü Yenilendi','Arayüz daha okunabilir bir üst çubuk, ana Hasat eylemi ve daha düzenli yönetim kontrollerine kavuştu.'],
    ['🐝','Kovan Yönetimi','Kovan listesine öncelik, durum etiketleri, satır işlemleri ve toplu hasat/şurup araçları eklendi.'],
    ['📊','Gelişmiş İstatistikler','7 gün, 14 gün ve tüm geçmiş için üretim, kazanç, net değer ve bal türü satış grafikleri eklendi.'],
    ['🏆','Rakip Çiftlikler','Rakiplerin üretim, satış, yatırım ve mevsimsel riskleri olan kalıcı çiftlik state’leri oluşturuldu.']
  ],
  '5.5.4': [
    ['🏝️','Adaya Dön Düğmesi','Adaya Dön kontrolü sağ üstten sol alta taşındı, biraz büyütüldü ve R kısayolu korundu.'],
    ['📸','Fotoğraf Modu','Adaya Dön düğmesi fotoğraf modunda gizlenerek temiz ekran görüntüsü davranışına uyarlandı.']
  ]
};

function plain(text) {
  return String(text || '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_~`>#]/g, '')
    .replace(/^[-+•]\s*/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}
function clip(text, max = 330) {
  const clean = plain(text);
  return clean.length <= max ? clean : clean.slice(0, max - 1).trimEnd() + '…';
}
function iconFor(title) {
  const s = String(title || '').toLocaleLowerCase('tr');
  if (/düzelt|fix|hata|kararl/.test(s)) return '🛠️';
  if (/arı|kovan|bal|çiftlik/.test(s)) return '🐝';
  if (/köy|yerleş|ev|ada/.test(s)) return '🏡';
  if (/görsel|tema|arayüz|tasarım|panel/.test(s)) return '🎨';
  if (/ses|müzik/.test(s)) return '🔊';
  if (/yeni|özellik|eklen/.test(s)) return '✨';
  return '📝';
}

const SKIP_HEADING = /^(nero\s+\d+\.\d+\.\d+|kurulum|release dosyaları|assets?|download|geliştirici notları?)$/i;
function releaseSections(body) {
  const lines = String(body || '').replace(/\r\n?/g, '\n').split('\n');
  const sections = [];
  let current = null;
  for (const raw of lines) {
    const line = raw.trim();
    const h = line.match(/^#{1,3}\s+(.+)$/);
    if (h) {
      if (current && current.lines.length) sections.push(current);
      const title = plain(h[1]);
      current = SKIP_HEADING.test(title) ? null : { title, lines: [] };
      continue;
    }
    if (!current || !line || /^---+$/.test(line)) continue;
    if (/^>\s*/.test(line) || /^Developed by/i.test(line)) continue;
    current.lines.push(line);
  }
  if (current && current.lines.length) sections.push(current);
  return sections;
}

export function releaseToNote(release) {
  const version = normalizeReleaseVersion(release);
  if (!version) return null;
  const curated = RECENT_RELEASE_NOTES[version];
  const items = curated
    ? curated.map(([icon, title, text]) => ({ icon, title, text }))
    : releaseSections(release?.body)
      .filter((s) => s.title && s.lines.length)
      .slice(0, 6)
      .map((s) => ({ icon: iconFor(s.title), title: clip(s.title, 90), text: clip(s.lines.join(' ')) }));

  const fallback = items.length ? items : [{
    icon: '📝', title: 'Sürüm notları', text: clip(release?.body || 'Bu sürüm için ayrıntılı not yayımlanmadı.')
  }];
  return {
    version,
    title: `Nero ${version}`,
    items: fallback,
    releaseUrl: String(release?.html_url || '')
  };
}

export const CURATED_RECENT_VERSIONS = Object.freeze(Object.keys(RECENT_RELEASE_NOTES));