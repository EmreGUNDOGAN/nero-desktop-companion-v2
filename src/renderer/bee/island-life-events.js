// 6.6.1 — Yaşayan Ada: ekonomik etkisi olmayan 60 mevsimsel ana sahne.
// Her mevsimde 15 benzersiz olay vardır; oynanan ID'ler save state'te tutulur.
const rows = {
  ilkbahar: [
    ['cicek-sepeti','Çiçek Sepetleri','Köylüler festival alanına taze çiçek sepetleri taşıyor.','sabah','festival'],
    ['bank-sohbeti','Sabah Sohbeti','İki komşu bankta güneşli havayı konuşuyor.','sabah','festival'],
    ['pazar-fideleri','Fide Takası','Pazar çevresinde küçük bir fide takası başladı.','ogle','market'],
    ['cocuk-oyunu','Meydanda Oyun','Çocuklar meydanda kısa bir oyun kurdu.','ogle','festival'],
    ['ari-meraki','Arılara Bakış','Köylüler çiçeklenen tarhlara uzaktan bakıyor.','ogle','village'],
    ['bahar-temizligi','Bahar Temizliği','Dükkân önleri süpürülüp çiçeklerle düzenleniyor.','sabah','shop'],
    ['piknik-hazirligi','Piknik Hazırlığı','Meydanda küçük bir piknik hazırlığı var.','ogle','festival'],
    ['kitap-bank','Bankta Kitap','Bir köylü bankta sessizce kitap okuyor.','ogle','festival'],
    ['cay-molasi','Çay Molası','İki dükkân sahibi kısa bir çay molasında buluştu.','ogle','market'],
    ['aksam-lambalari','Bahar Akşamı','Meydan lambaları yanarken birkaç kişi hâlâ dışarıda.','aksam','festival'],
    ['tohum-konusmasi','Tohum Sohbeti','Çiçekler ve yeni sezon tohumları konuşuluyor.','ogle','market'],
    ['yagmur-siginagi','Nisan Yağmuru','Köylüler kısa yağmurdan tezgâh altına sığınıyor.','ogle','market','yagmurlu'],
    ['kus-sesi','Kuş Sesleri','Meydanda herkes bir an kuş seslerini dinliyor.','sabah','festival'],
    ['gunbatimi-yuruyusu','Günbatımı Yürüyüşü','Köy yolunda sakin bir akşam yürüyüşü başladı.','aksam','village'],
    ['gece-lambasi','Geç Bahar Akşamı','Bir iki komşu lambaların altında sohbeti uzatıyor.','gece','festival']
  ],
  yaz: [
    ['limonata','Limonata Molası','Pazarın yanında serin bir içecek molası veriliyor.','ogle','market'],
    ['golge-bank','Gölgede Dinlenme','Banklar öğle sıcağında dolmaya başladı.','ogle','festival'],
    ['sabah-teslimat','Erken Teslimat','Dükkân sahipleri ürünlerini erkenden pazara taşıyor.','sabah','market'],
    ['cocuk-kosusu','Meydan Koşusu','Çocuklar meydanda birbirlerini kovalıyor.','ogle','festival'],
    ['cicek-kokusu','Çiçek Kokusu','Köylüler yaz çiçeklerinin kokusunu konuşuyor.','ogle','village'],
    ['aksam-serinligi','Akşam Serinliği','Sıcak günün ardından meydan yeniden hareketlendi.','aksam','festival'],
    ['gece-sohbeti','Gece Sohbeti','Birkaç komşu geç saate kadar dışarıda kaldı.','gece','festival'],
    ['pazar-kalabaligi','Pazar Kalabalığı','Pazar çevresinde kısa süreli bir kalabalık oluştu.','ogle','market'],
    ['muzik-prova','Sahne Provası','Festival sahnesinde kısa bir müzik provası yapılıyor.','aksam','festival'],
    ['dondurma-molasi','Dondurma Molası','Sıcaktan bunalan köylüler meydanda mola verdi.','ogle','shop'],
    ['bahce-sulama','Bahçe Sulama','Evlerin önündeki bitkiler sulanıyor.','sabah','village'],
    ['yaz-yagmuru','Yaz Yağmuru','Ani yağmur herkesi tente ve tezgâhlara topladı.','ogle','market','yagmurlu'],
    ['gunbatimi','Turuncu Günbatımı','Köylüler günbatımını izlemek için meydanda oyalanıyor.','aksam','festival'],
    ['gece-yuruyusu','Gece Yürüyüşü','Bir komşu serin havada kısa bir tur atıyor.','gece','village'],
    ['tezgah-duzeni','Tezgâh Düzeni','Pazarcı ve dükkân sahipleri tezgâhları birlikte düzenliyor.','sabah','market']
  ],
  sonbahar: [
    ['yaprak-supurme','Yaprakları Süpürme','Meydandaki turuncu yapraklar birlikte süpürülüyor.','sabah','festival'],
    ['hasat-sepeti','Hasat Sepetleri','Pazar çevresine sonbahar sepetleri taşınıyor.','ogle','market'],
    ['sicak-cay','Sıcak Çay','Serin havada birkaç komşu sıcak çayla mola verdi.','ogle','market'],
    ['kestane-sohbeti','Kestane Sohbeti','Kestane sezonu üzerine uzun bir sohbet başladı.','ogle','village'],
    ['aksam-feneri','Fener Akşamı','Meydan fenerleri erken yanmaya başladı.','aksam','festival'],
    ['ruzgarli-gun','Rüzgârlı Gün','Rüzgâr yüzünden herkes şapkasını tutarak yürüyor.','ogle','village'],
    ['pazar-kasalari','Pazar Kasaları','Dükkân sahipleri kasaları tezgâhlara taşıyor.','sabah','market'],
    ['bank-battaniye','Bankta Battaniye','Serin havada bankta kısa bir dinlenme var.','aksam','festival'],
    ['cocuk-yaprak','Yaprak Oyunu','Çocuklar düşen yapraklarla oynuyor.','ogle','festival'],
    ['yagmur-kokusu','Yağmur Kokusu','Yağmurdan sonra meydanda toprak kokusu konuşuluyor.','ogle','festival','yagmurlu'],
    ['gunbatimi-turu','Sonbahar Turu','Köylüler turuncu ağaçların arasında yürüyor.','aksam','village'],
    ['gece-fener','Gece Fenerleri','Birkaç kişi fenerlerin altında sohbete devam ediyor.','gece','festival'],
    ['recel-konusmasi','Kışlık Hazırlık','Köylüler kışlık hazırlıkları ve reçelleri konuşuyor.','ogle','shop'],
    ['sahne-susleme','Sahne Süsleme','Festival sahnesine sonbahar süsleri ekleniyor.','ogle','festival'],
    ['sabah-sis','Sisli Sabah','Sabah sisi köy yollarını sakinleştirdi.','sabah','village']
  ],
  kis: [
    ['kardan-adam','Kardan Adam','Meydanda birlikte küçük bir kardan adam yapılıyor.','ogle','festival'],
    ['sicak-icecek','Sıcak İçecek','Pazar yanında sıcak içecek molası veriliyor.','ogle','market'],
    ['kar-temizligi','Kar Temizliği','Dükkân girişlerindeki kar temizleniyor.','sabah','shop'],
    ['fener-yakma','Fenerleri Yakma','Hava kararırken meydan fenerleri tek tek yanıyor.','aksam','festival'],
    ['kartopu','Kartopu Oyunu','Çocuklar meydanda kısa bir kartopu oyunu başlattı.','ogle','festival'],
    ['kisin-pazar','Kış Pazarı','Pazarcı tezgâhları soğuğa rağmen düzenliyor.','ogle','market'],
    ['ari-kis-sohbeti','Arıların Kışı','Köylüler kovanların kışı nasıl geçirdiğini konuşuyor.','ogle','village'],
    ['kar-yuruyusu','Kar Yürüyüşü','Bir iki komşu karlı yolda ağır ağır yürüyor.','aksam','village'],
    ['gece-fenerleri','Kış Gecesi','Meydanda birkaç kişi fenerlerin altında oyalanıyor.','gece','festival'],
    ['sahne-kar','Karlı Sahne','Festival sahnesinin üzerindeki kar temizleniyor.','sabah','festival'],
    ['sicak-corek','Sıcak Çörek','Köyde sıcak çörek kokusu üzerine sohbet başladı.','sabah','shop'],
    ['tipi-siginagi','Kar Sığınağı','Yoğun yağışta köylüler tezgâhların altına sığınıyor.','ogle','market','yagmurlu'],
    ['kis-gunbatimi','Kış Günbatımı','Erken günbatımı meydanı kısa süreliğine kalabalıklaştırdı.','aksam','festival'],
    ['gece-devriyesi','Sessiz Gece Turu','Bir komşu evine dönmeden önce son bir tur atıyor.','gece','village'],
    ['yeni-yil-susleri','Kış Süsleri','Meydanın küçük kış süsleri birlikte düzeltiliyor.','ogle','festival']
  ]
};

export const ISLAND_LIFE_EVENTS = Object.entries(rows).flatMap(([season, list]) => list.map(([slug,title,line,daypart,target,weather]) => ({
  id: `${season}:${slug}`, season, title, line, daypart, target, weather: weather || null,
  minPeople: target === 'shop' ? 1 : 2,
  rainLine: weather === 'yagmurlu' ? line : `Yağmur başlayınca ${line.charAt(0).toLocaleLowerCase('tr') + line.slice(1)}`
})));

export function lifeDaypart(hour) {
  if (hour >= 6 && hour < 10.5) return 'sabah';
  if (hour >= 10.5 && hour < 17) return 'ogle';
  if (hour >= 17 && hour < 21) return 'aksam';
  return 'gece';
}

export function pickIslandLifeEvent({ season, hour, weather, played = [], peopleCount = 0, shops = [] }) {
  const part = lifeDaypart(hour);
  const used = new Set(played || []);
  const candidates = ISLAND_LIFE_EVENTS.filter((e) => e.season === season && e.daypart === part && !used.has(e.id)
    && peopleCount >= e.minPeople && (!e.weather || e.weather === weather) && (e.target !== 'shop' || shops.length));
  if (!candidates.length) return null;
  const stamp = Math.floor(hour * 6) + used.size * 17 + peopleCount * 3;
  return candidates[Math.abs(stamp) % candidates.length];
}