// Köy yerleşimcileri (KOY-YERLESIM-LISTESI.md ile aynı sıra). Sıra = varış sırası.
// type: koylu | dukkan | bina · fav: sevdiği bal · effect/value: dükkân ve bina etkileri
module.exports = [
 {
  "n": 1,
  "type": "koylu",
  "name": "Ayşe Teyze",
  "role": "Emekli terzi",
  "fav": "papatya"
 },
 {
  "n": 2,
  "type": "koylu",
  "name": "Mehmet Usta",
  "role": "Tamirci",
  "fav": "yonca"
 },
 {
  "n": 3,
  "type": "koylu",
  "name": "Küçük Elif",
  "role": "Okul çağında bir kız, ailesiyle",
  "fav": "aycicegi"
 },
 {
  "n": 4,
  "type": "koylu",
  "name": "Hacer Nine",
  "role": "Köyün en yaşlısı",
  "fav": "ihlamur"
 },
 {
  "n": 5,
  "type": "koylu",
  "name": "Muhtar Rıza",
  "role": "Köyün muhtarı",
  "fav": "kekik"
 },
 {
  "n": 6,
  "type": "dukkan",
  "name": "Bakkal",
  "role": "Bakkal Hüseyin işletir",
  "effectText": "Şurup %20 ucuz",
  "effect": "syrupDiscount",
  "value": 0.2,
  "owner": "Bakkal Hüseyin"
 },
 {
  "n": 7,
  "type": "dukkan",
  "name": "Çiçekçi Ezgi",
  "role": "Tohum ve fide dükkânı",
  "effectText": "Tohumlar %10 ucuz; Ezgi'nin Seçimi her gün ek %15 indirimli",
  "effect": "seedDiscount",
  "value": 0.1,
  "owner": "Ezgi"
 },
 {
  "n": 8,
  "type": "koylu",
  "name": "Balıkçı Kemal",
  "role": "Göl balıkçısı",
  "fav": "yonca"
 },
 {
  "n": 9,
  "type": "dukkan",
  "name": "Fırın",
  "role": "Fırıncı Leyla işletir",
  "effectText": "Her 7 günde düzenli yonca/papatya siparişi (8–12 kg, ödeme ×1.6)",
  "effect": "firin",
  "value": 1,
  "owner": "Fırıncı Leyla"
 },
 {
  "n": 10,
  "type": "koylu",
  "name": "Öğretmen Selin",
  "role": "Köy okulunun öğretmeni",
  "fav": "papatya"
 },
 {
  "n": 11,
  "type": "koylu",
  "name": "Doktor Aslı",
  "role": "Köy doktoru",
  "fav": "ihlamur"
 },
 {
  "n": 12,
  "type": "dukkan",
  "name": "Pastane",
  "role": "Pastacı Nur işletir",
  "effectText": "Her 5 günde küçük ama çok iyi ödemeli lavanta/ıhlamur/kestane siparişi (2–4 kg, ×2.2)",
  "effect": "pastane",
  "value": 1,
  "owner": "Pastacı Nur"
 },
 {
  "n": 13,
  "type": "bina",
  "name": "Çay Bahçesi",
  "role": "Köyün buluşma yeri",
  "effectText": "Müdavimlik hızlanır: her köylüyle ilk kalp 1 teslimde",
  "effect": "firstHeart",
  "value": 1
 },
 {
  "n": 14,
  "type": "dukkan",
  "name": "Bal Dükkânı",
  "role": "Köyün kendi bal satıcısı",
  "effectText": "Pazar fiyatları +%10",
  "effect": "marketBonus",
  "value": 0.1
 },
 {
  "n": 15,
  "type": "bina",
  "name": "Postane",
  "role": "Köyün postası",
  "effectText": "Siparişlerin süresi +1 gün",
  "effect": "orderDays",
  "value": 1
 },
 {
  "n": 16,
  "type": "koylu",
  "name": "Arıcı Hasan",
  "role": "Emekli arıcı, sana akıl verir",
  "fav": "kekik"
 },
 {
  "n": 17,
  "type": "koylu",
  "name": "Ressam Deniz",
  "role": "Manzara ressamı",
  "fav": "lavanta"
 },
 {
  "n": 18,
  "type": "bina",
  "name": "Muhtarlık",
  "role": "Köy yönetimi",
  "effectText": "Her hafta bir \"köy isteği\": köyün toplu siparişi (20 kg, büyük ödül)",
  "effect": "muhtarlik",
  "value": 1
 },
 {
  "n": 19,
  "type": "dukkan",
  "name": "Kahveci",
  "role": "Köy kahvesi",
  "effectText": "Nero odak bonusu +15 dakika uzar",
  "effect": "focusExtraMin",
  "value": 15
 },
 {
  "n": 20,
  "type": "koylu",
  "name": "Değirmenci Osman",
  "role": "Un değirmeni sahibi",
  "fav": "yonca"
 },
 {
  "n": 21,
  "type": "koylu",
  "name": "Çoban Yusuf",
  "role": "Koyun çobanı",
  "fav": "yonca"
 },
 {
  "n": 22,
  "type": "bina",
  "name": "Okul",
  "role": "Köy okulu",
  "effectText": "Günlük görev ödülleri +%10",
  "effect": "questBonus",
  "value": 0.1
 },
 {
  "n": 23,
  "type": "koylu",
  "name": "Terzi Gülsüm",
  "role": "Ayşe Teyze'nin çırağı",
  "fav": "papatya"
 },
 {
  "n": 24,
  "type": "koylu",
  "name": "Postacı Murat",
  "role": "Köyün postacısı",
  "fav": "aycicegi"
 },
 {
  "n": 25,
  "type": "koylu",
  "name": "Kasabalı Cem",
  "role": "Kasabadan taşınan genç",
  "fav": "lavanta"
 },
 {
  "n": 26,
  "type": "koylu",
  "name": "Marangoz İsmail",
  "role": "Ahşap ustası",
  "fav": "kestane"
 },
 {
  "n": 27,
  "type": "koylu",
  "name": "Bahçıvan Zehra",
  "role": "Köyün bahçıvanı",
  "fav": "aycicegi"
 },
 {
  "n": 28,
  "type": "bina",
  "name": "Kütüphane",
  "role": "Köy kütüphanesi",
  "effectText": "Süs (gece pencereleri geç saate kadar yanar)"
 },
 {
  "n": 29,
  "type": "koylu",
  "name": "Hemşire Canan",
  "role": "Doktor Aslı'nın yardımcısı",
  "fav": "ihlamur"
 },
 {
  "n": 30,
  "type": "dukkan",
  "name": "Mumcu",
  "role": "Balmumundan mum yapar",
  "effectText": "Mum fiyatı +%20",
  "effect": "candleBonus",
  "value": 0.2
 },
 {
  "n": 31,
  "type": "koylu",
  "name": "Kaptan Rüstem",
  "role": "Emekli gemi kaptanı",
  "fav": "kestane"
 },
 {
  "n": 32,
  "type": "koylu",
  "name": "Müzisyen Efe",
  "role": "Köyün sazcısı",
  "fav": "lavanta"
 },
 {
  "n": 33,
  "type": "bina",
  "name": "Meydan Çeşmesi",
  "role": "Köy meydanı",
  "effectText": "Süs"
 },
 {
  "n": 34,
  "type": "bina",
  "name": "Veteriner Kliniği",
  "role": "Arılara da bakar",
  "effectText": "Kovanların hastalanma ihtimali %25 azalır",
  "effect": "sickReduce",
  "value": 0.25
 },
 {
  "n": 35,
  "type": "koylu",
  "name": "Aşçı Fatma",
  "role": "Düğün yemekleri yapar",
  "fav": "kekik"
 },
 {
  "n": 36,
  "type": "koylu",
  "name": "Fotoğrafçı Can",
  "role": "Köyün fotoğrafçısı",
  "fav": "aycicegi"
 },
 {
  "n": 37,
  "type": "dukkan",
  "name": "Dondurmacı",
  "role": "Yazları çok kalabalık",
  "effectText": "Yazın tüm siparişler %10 daha iyi öder",
  "effect": "summerOrders",
  "value": 0.1
 },
 {
  "n": 38,
  "type": "koylu",
  "name": "Yazar Melike",
  "role": "Köyü anlatan romanlar yazar",
  "fav": "ihlamur"
 },
 {
  "n": 39,
  "type": "koylu",
  "name": "Bisikletçi Tolga",
  "role": "Bisiklet tamircisi",
  "fav": "yonca"
 },
 {
  "n": 40,
  "type": "bina",
  "name": "Pazar Yeri",
  "role": "Haftalık köy pazarı",
  "effectText": "Aynı anda bekleyebilecek sipariş sayısı 5 → 6",
  "effect": "orderMax",
  "value": 1
 },
 {
  "n": 41,
  "type": "koylu",
  "name": "Seramikçi Nazlı",
  "role": "Çömlek ustası",
  "fav": "lavanta"
 },
 {
  "n": 42,
  "type": "koylu",
  "name": "Genç Balıkçı Kerem",
  "role": "Balıkçı Kemal'in oğlu",
  "fav": "yonca"
 },
 {
  "n": 43,
  "type": "koylu",
  "name": "Eczacı Burak",
  "role": "Köy eczacısı",
  "fav": "ihlamur"
 },
 {
  "n": 44,
  "type": "dukkan",
  "name": "Eczane",
  "role": "Burak işletir",
  "effectText": "İlaç %30 ucuz",
  "effect": "medicineDiscount",
  "value": 0.3
 },
 {
  "n": 45,
  "type": "koylu",
  "name": "Sütçü Hatice",
  "role": "Köyün sütçüsü",
  "fav": "papatya"
 },
 {
  "n": 46,
  "type": "koylu",
  "name": "Dokumacı Sevim",
  "role": "Kilim dokur",
  "fav": "kekik"
 },
 {
  "n": 47,
  "type": "bina",
  "name": "Değirmen",
  "role": "Rüzgâr değirmeni",
  "effectText": "Süs (kanatları sürekli döner)"
 },
 {
  "n": 48,
  "type": "koylu",
  "name": "Çiftçi Recep",
  "role": "Tarla sahibi",
  "fav": "aycicegi"
 },
 {
  "n": 49,
  "type": "koylu",
  "name": "Saatçi Nihat",
  "role": "Saat tamircisi",
  "fav": "kestane"
 },
 {
  "n": 50,
  "type": "dukkan",
  "name": "Reçelci",
  "role": "Reçel ve pekmez yapar",
  "effectText": "Kekik ve ıhlamur siparişleri daha sık gelir",
  "effect": "favorOrders",
  "value": 1
 },
 {
  "n": 51,
  "type": "koylu",
  "name": "Kuaför Şule",
  "role": "Köyün kuaförü",
  "fav": "lavanta"
 },
 {
  "n": 52,
  "type": "koylu",
  "name": "Oduncu Bayram",
  "role": "Oduncu",
  "fav": "kestane"
 },
 {
  "n": 53,
  "type": "bina",
  "name": "Arıcılar Derneği",
  "role": "Köy arıcıları buluşur",
  "effectText": "Bal Festivali puanın +%10",
  "effect": "festivalBonus",
  "value": 0.1
 },
 {
  "n": 54,
  "type": "koylu",
  "name": "Botanikçi Defne",
  "role": "Bitki araştırmacısı",
  "fav": "ihlamur"
 },
 {
  "n": 55,
  "type": "koylu",
  "name": "Kavalcı Mahmut Dede",
  "role": "Akşamları kaval çalar",
  "fav": "kekik"
 },
 {
  "n": 56,
  "type": "koylu",
  "name": "Kümesçi Emine",
  "role": "Tavuk yetiştirir",
  "fav": "yonca"
 },
 {
  "n": 57,
  "type": "dukkan",
  "name": "Marangoz Atölyesi",
  "role": "İsmail'in atölyesi",
  "effectText": "Dekorlar %20 ucuz",
  "effect": "decorDiscount",
  "value": 0.2
 },
 {
  "n": 58,
  "type": "koylu",
  "name": "Gökbilimci Arda",
  "role": "Yıldızları izler",
  "fav": "aycicegi"
 },
 {
  "n": 59,
  "type": "koylu",
  "name": "Ebru Sanatçısı Pelin",
  "role": "Ebru yapar",
  "fav": "lavanta"
 },
 {
  "n": 60,
  "type": "bina",
  "name": "Su Kulesi",
  "role": "Köyün su deposu",
  "effectText": "Süs"
 },
 {
  "n": 61,
  "type": "koylu",
  "name": "Gezgin Umut",
  "role": "Dünyayı gezip köye yerleşti",
  "fav": "kestane"
 },
 {
  "n": 62,
  "type": "koylu",
  "name": "Hırdavatçı Erol",
  "role": "Hırdavatçı",
  "fav": "papatya"
 },
 {
  "n": 63,
  "type": "koylu",
  "name": "İkizler Ada ve Ela",
  "role": "Afacan ikizler, aileleriyle",
  "fav": "aycicegi"
 },
 {
  "n": 64,
  "type": "bina",
  "name": "Saat Kulesi",
  "role": "Köyün simgesi",
  "effectText": "Süs (gece kadranı ışıklı)"
 },
 {
  "n": 65,
  "type": "koylu",
  "name": "Minik Bora",
  "role": "Ağaç ev sahibi çocuk, ailesiyle",
  "fav": "yonca"
 },
 {
  "n": 66,
  "type": "koylu",
  "name": "Simitçi Hamdi",
  "role": "Sabahları simit satar",
  "fav": "papatya"
 },
 {
  "n": 67,
  "type": "dukkan",
  "name": "Lokumcu",
  "role": "Bal lokumu yapar",
  "effectText": "Kışın tüm siparişler %10 daha iyi öder",
  "effect": "winterOrders",
  "value": 0.1
 },
 {
  "n": 68,
  "type": "koylu",
  "name": "Profesör Nevzat",
  "role": "Emekli tarih profesörü",
  "fav": "kestane"
 },
 {
  "n": 69,
  "type": "koylu",
  "name": "Dans Hocası Irmak",
  "role": "Halk dansları öğretir",
  "fav": "lavanta"
 },
 {
  "n": 70,
  "type": "bina",
  "name": "Çalgı Köşkü",
  "role": "Meydanda müzik köşkü",
  "effectText": "Süs (akşamları ışıkları yanar)"
 },
 {
  "n": 71,
  "type": "koylu",
  "name": "Biyolog Sinem",
  "role": "Arıları inceler",
  "fav": "kekik"
 },
 {
  "n": 72,
  "type": "koylu",
  "name": "Kerim Dede ve Kedileri",
  "role": "Yedi kedisiyle yaşar",
  "fav": "ihlamur"
 },
 {
  "n": 73,
  "type": "bina",
  "name": "Köy Serası",
  "role": "Büyük ortak sera",
  "effectText": "Çiçeklerin ömrü +5 gün",
  "effect": "flowerLife",
  "value": 5
 },
 {
  "n": 74,
  "type": "koylu",
  "name": "Mimar Kaan",
  "role": "Köyün yeni binalarını çizer",
  "fav": "aycicegi"
 },
 {
  "n": 75,
  "type": "koylu",
  "name": "Yörük Gülizar",
  "role": "Yaylalardan gelmiş",
  "fav": "kekik"
 },
 {
  "n": 76,
  "type": "bina",
  "name": "Fener Kulesi",
  "role": "Göl kıyısındaki fener",
  "effectText": "Süs (gece dönen ışık)"
 },
 {
  "n": 77,
  "type": "koylu",
  "name": "Muhabir Bige",
  "role": "Köy gazetesini çıkarır",
  "fav": "papatya"
 },
 {
  "n": 78,
  "type": "bina",
  "name": "Bal Müzesi",
  "role": "Köyün gururu, son yapı",
  "effectText": "Tüm bal üretimi +%5",
  "effect": "prodBonus",
  "value": 0.05
 }
];
