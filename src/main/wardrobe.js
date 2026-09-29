'use strict';

// All dates use the player's local clock. Seasonal pieces remain selectable year-round.
const GROUPS = {
  costume: ['Yağmurluk', 'Lavanta Hırka', 'Denizci', 'Kedi Kapüşonu', 'Ressam', 'Kahve Molası', 'Yıldız Gezgini', 'Festival'],
  daily: ['Kot Ceket', 'Çizgili Tişört', 'Soft Yeşil Hoodie', 'Kamp Günü', 'Baharlık Gömlek', 'Krem Hırka', 'Spor Günü', 'Hafta Sonu', 'Mint Gömlek', 'Kırmızı Kazak', 'Papatya Tulum', 'Mavi Gömlek', 'Bomber Ceket', 'Bahçe Önlüğü', 'Kolej Hırkası', 'Retro Polo'],
  spring: ['Çiçek İşlemeli Yelek', 'Leylak Gömlek', 'Kiraz Çiçeği Hırkası', 'Bahar Pikniği', 'Lale Desenli Süveter', 'Nane Trenç', 'Mavi Papyonlu Gömlek', 'Yağmur Sonrası', 'Fıstık Yeşili Salopet', 'Kelebek Fular', 'Çilek Cepli Yelek', 'Bahar Esintisi'],
  summer: ['Limonata', 'Sahil Gömleği', 'Hasır Şapkalı', 'Karpuz Pikniği', 'Tropik Yaprak', 'Gün Batımı', 'Dondurma Cepli', 'Mavi Şort Tulum', 'Keten Takım', 'Şeftali Gömlek', 'Dondurma Deseni', 'Güneş Şapkası'],
  autumn: ['Tarçın Hırka', 'Bal Kabağı', 'Ekose Fular', 'Orman Yeleği', 'Kestane Hırka', 'Hardal Boğazlı', 'Bordo Yağmur Ceketi', 'Kiremit Salopet', 'Akçaağaç Ceketi', 'Kahve Yolu', 'Mor Sonbahar', 'Altın Yaprak'],
  winter: ['Örgü Bere', 'Kulaklıklı Şapka', 'Kar Tanesi Kazağı', 'Krem Şişme Yelek', 'Yün Pardösü', 'Kırmızı Ekose', 'Kutup Mavisi', 'Sıcak Çikolata', 'Buz Grisi', 'Bordo Örgü', 'Kış Yürüyüşü', 'Nar Kırmızısı']
};
const SLEEP = ['Ay Bulut Pijaması', 'Çizgili Gecelik', 'Yıldızlı Uyku', 'Uyku Tulumu', 'Kakao Pijaması', 'Ponponlu Uyku', 'Yumuşak Ekose', 'Gece Mavisi'];
const SPECIAL = { '01-01': 'newyear', '02-14': 'valentine', '04-01': 'april', '04-23': 'children', '05-20': 'bee', '10-29': 'republic', '10-31': 'halloween', '12-31': 'newyear' };
const slug = (name) => name.toLocaleLowerCase('tr-TR').replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const ITEMS = Object.entries(GROUPS).flatMap(([group, names]) => names.map((name) => ({ id: `${group}-${slug(name)}`, name, group })));
const VALID = new Set(ITEMS.map((item) => item.id));
function special(date, birthday = '') {
  const key = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return birthday === key ? 'birthday' : SPECIAL[key] || null;
}
function sleepNight(date) {
  const start = new Date(date);
  if (date.getHours() < 6) start.setDate(start.getDate() - 1);
  return `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;
}
function choose(settings, date, persist, random = Math.random) {
  const celebration = special(date, settings.birthday);
  if (celebration) return { outfit: `special-${celebration}`, special: celebration };
  if (date.getHours() >= 21 || date.getHours() < 6) {
    const night = sleepNight(date);
    if (VALID.has(settings.wardrobeOutfit) && settings.wardrobeSelectedNight === night) {
      return { outfit: settings.wardrobeOutfit };
    }
    if (settings.sleepNight !== night || !/^sleep-[0-7]$/.test(settings.sleepOutfit || '')) {
      const picked = `sleep-${Math.min(7, Math.floor(Math.max(0, random()) * 8))}`;
      persist({ sleepNight: night, sleepOutfit: picked });
      return { outfit: picked };
    }
    return { outfit: settings.sleepOutfit };
  }
  return { outfit: VALID.has(settings.wardrobeOutfit) ? settings.wardrobeOutfit : null };
}
module.exports = { GROUPS, SLEEP, SPECIAL, ITEMS, VALID, special, sleepNight, choose };
