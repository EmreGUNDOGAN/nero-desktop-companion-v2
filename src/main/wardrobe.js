'use strict';

// 6.3.3: wardrobe reset. Only Nero-native outfits are selectable.
// Every outfit is drawn specifically for the canonical 220x260 Nero body.
const GROUPS = {
  daily: ['Kot Ceket', 'Çizgili Tişört', 'Soft Yeşil Hoodie', 'Kamp Günü', 'Baharlık Gömlek', 'Krem Hırka'],
  winter: ['Kar Tanesi Kazağı', 'Kış Montu'],
  sleep: ['Pijamaları'],
  special: ['Parti Kıyafeti']
};

const SLEEP_ID = 'sleep-pijamalari';
const SPECIAL = {};
const slug = (name) => name.toLocaleLowerCase('tr-TR')
  .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i')
  .replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const ITEMS = Object.entries(GROUPS)
  .flatMap(([group, names]) => names.map((name) => ({ id: `${group}-${slug(name)}`, name, group })));
const VALID = new Set(ITEMS.map((item) => item.id));

function special() {
  // Eski özel-gün çizimleri 6.3.3'te emekliye ayrıldı.
  // Yeni özel set tamamlanana kadar otomatik kostüm dayatılmaz.
  return null;
}

function sleepNight(date) {
  const start = new Date(date);
  if (date.getHours() < 6) start.setDate(start.getDate() - 1);
  return `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;
}

function choose(settings, date, persist) {
  if (date.getHours() >= 21 || date.getHours() < 6) {
    const night = sleepNight(date);
    if (VALID.has(settings.wardrobeOutfit) && settings.wardrobeSelectedNight === night) {
      return { outfit: settings.wardrobeOutfit };
    }
    if (settings.sleepNight !== night || settings.sleepOutfit !== SLEEP_ID) {
      persist({ sleepNight: night, sleepOutfit: SLEEP_ID });
    }
    return { outfit: SLEEP_ID };
  }
  return { outfit: VALID.has(settings.wardrobeOutfit) ? settings.wardrobeOutfit : null };
}

module.exports = { GROUPS, SLEEP_ID, SPECIAL, ITEMS, VALID, special, sleepNight, choose };
