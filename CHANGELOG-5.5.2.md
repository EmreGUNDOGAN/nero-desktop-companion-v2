# Nero 5.5.2 — Arıcılık Yaşam Kalitesi ve Denge

Nero 5.5.2, 5.5.1'in ses altyapısı üzerine gelen Arıcılık odaklı bir yaşam kalitesi, denge ve arayüz güncellemesidir. Mevcut oyunun görsel dili korunur; değişiklikler mevcut krem kartlar, sarı işlem düğmeleri ve ada arayüzünün içine yerleştirilir.

## Kovan ve erzak

- Kovan ekranında artık **🌾 Erzak: X gün** bilgisi doğrudan görünür.
- Erzak göstergesi **15+ gün yeşil**, **7–14 gün sarı**, **0–6 gün kırmızı** görünür.
- Günlük temel erzak tüketimi arı sayısından bağımsız olarak **kovan başına 1 kg**.
- **Kovan Yalıtımı** aktif olduğu ilgili kışta tüketim **0,5 kg/gün** olur.
- Günlük ihtiyacı karşılamayan son erzak miktarı tamamen tüketilir; yarım stok ertesi güne taşınarak kovanı beslenmiş göstermez.
- Standart şurup paketi artık **45 🪙 taban fiyatla 15 kg** erzak verir. Mevcut Bakkal indirimi varsa normal şekilde uygulanmaya devam eder.
- Kış üretimi artık yalnız gerçekten o gün beslenmiş veya günlük ihtiyacı karşılayabilecek erzağı bulunan kovanda şuruplu üretim oranını kullanır.

## Seyyah Yakup

- Yakup ürünlerinde satın alma fiyatı doğrudan düğmede görünür: **Satın al · X 🪙**.
- Hedefe bağlı ürünlerde kovan/tarh/sipariş seçimi değiştikçe fiyat canlı olarak güncellenir.
- Uygun hedefi olmayan ürünlerde işlem düğmesi pasifleşir ve durum açıkça gösterilir.
- **Ballı Şurup** seçilen kovana satın alma anında uygulanır; kovan ekranında **+%50 üretim** ve kalan gün görünür.
- **Kışlık Şurup Fıçısı** yeniden dengelendi: **105 🪙 → 45 kg erzak**.
- Aktif Seyyah Satış Fişi kalan miktarı Yakup'un bal alım alanında görünür.

## 3 saatlik tam duraklama

- Arıcılık penceresi son kez görüldükten sonra oyun Nero açıkken ilk **3 gerçek saat** normal şekilde çalışmaya devam eder.
- 3 saatin sonunda Arıcılık tamamen duraklar: **takvim, üretim, hastalık, doğumlar, kış erzağı, festival, Yakup süresi, oyun-zamanlı sipariş süreleri ve arıcının yürüyüşü** ilerlemez.
- Arıcılık tekrar görüldüğünde oyun kaldığı noktadan devam eder; 3 saatten sonraki süre için geriye dönük oyun ilerlemesi yapılmaz.
- Gerçek zamanlı normal sipariş sayacı da tam duraklama boyunca dondurulur; dönüşte duraklama süresi için sipariş birikmez.

## Günlük görevler

- Sol üstte sürekli açık duran günlük görev kartı artık varsayılan görünüm değildir.
- Sol altta, bildirim zilinin yanında **📋 görev ikonu** bulunur.
- İkona tıklayınca mevcut **Bugünün görevleri** kartı aynı tasarımıyla açılır; başlıktan kapatılınca yeniden yalnız ikon kalır.
- Görevlerin içerikleri, 40 görevlik havuz ve 2 ücretsiz + 1 ücretli değiştirme sistemi korunur.

## Ses ayarları

- Ayarlar → Ses bölümünde **Oyun sesleri**, **Ortam sesleri** ve **Bildirim sesleri** ayrı ana kontrollerdir.
- Yeni **İleri Ses Ayarları** açılır bölümü ile sesler tek tek seçilebilir.
- Oyun efektleri: jeton/satış, hasat, yerleştirme, ekim, kâğıt, başarı ve hata.
- Ortam: kuşlar, arılar, yağmur, rüzgâr ve cırcır böcekleri.
- Bildirimler: siparişler, kovan uyarıları, Seyyah Yakup ve festival/özel olaylar.
- Oyun efektleri ve ortam sesleri yalnız Arıcılık penceresi görünürken çalar.
- Arıcılık penceresi kapalıyken önemli bildirimler Nero üzerinden sesli gelmeye devam edebilir.
- Arıcılık görünürken aynı olay için masaüstü Nero'dan ikinci bir bildirim sesi üretilmez.
- Tek tek ses seçimleri kayıt dosyasında saklanır.

## Çiçekçi Ezgi

- **50 kg toplam bal üretimi** yeni bir erken oyun dönüm noktasıdır.
- Bu eşikte **Çiçekçi Ezgi** kasabaya yerleşir ve çiçekçi dükkânını açar.
- İlk açılış bildirimi: **“🌷 Kasabaya yeni biri yerleşti! Çiçekçi Ezgi dükkânını açtı.”**
- Çiçekçi Ezgi'ye ilk tıklamada mevcut oyun stilindeki tek seferlik tanışma kartı gösterilir.
- **Hoş Geldin Hediyesi:** 1 ücretsiz, o güne uygun mevsimlik tohum.
- Sonraki ziyaretlerde **Ezgi'nin Seçimi** görünür: mevcut tohumlardan biri her oyun günü mevcut Çiçekçi indiriminin üzerine ek **%15 indirim** alır.
- Eski Çiçekçi modelinin görseli Ezgi'ye, Kasabalı Cem'in mevcut görseli ise onun yeni köy sırasına taşınmıştır; oyunun genel sanat dili değiştirilmemiştir.

## Korunanlar

- 5.5.1'deki gerçek OGG ses paketi ve Web Audio altyapısı korunur.
- 5.5.0'ın **57 topic / 2.133 onaylı Arıcılık repliği** değiştirilmez.
- Bu sürümde planlanan genişletilmiş **mektup sistemi uygulanmaz**; mevcut mektup davranışı olduğu gibi korunur.
- appId değişmez: **com.stenwick.nero**.
