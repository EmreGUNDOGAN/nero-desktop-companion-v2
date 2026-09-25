# Nero 5.5.0 — Arıcılık Dünyası Genişliyor

Nero 5.5.0, Arıcılık oyununu diyaloglar, günlük görevler, Seyyah Yakup ve ilerleme ekonomisi açısından büyük ölçüde genişleten özellik sürümüdür.

## Yeni

- **57 olay başlığı / 2.133 yeni oyun içi Nero repliği:** Kovan sağlığı, günlük çiftlik hayatı, köy, köylü hikâyeleri, dünya olayları ve Nero ↔ Arıcılık bağlantısı için yeni tepkiler.
- **Seyyah Yakup 38 ürünlük havuz:** eski 9 ürünlük sistem 38 ürüne genişletildi. Üretim, kış, hastalık, tarh, balmumu, mum, pazar, sipariş ve festival odaklı yeni ürünler eklendi.
- **Yakup hedef seçimi:** kovan, tarh, bal türü, sipariş ve iki kovan arasında arı taşıma gibi ürünler doğru hedef üzerinden uygulanır.
- **Stok Değişim Jetonu:** Yakup'un henüz alınmamış tekliflerinden birini yeniden çeker ve ziyaret başına 2 normal ürün kotasını tüketmez.
- **40 günlük görev türü:** hasat, pazar, sipariş, arı bakımı, geliştirme, tarh, mum ve koşullu Yakup görevleri.
- **Görev değiştirme sistemi:** gerçek gün başına 2 ücretsiz refresh + 1 adet 100 🪙 ücretli refresh.
- **Koşullu görev seçimi:** o anda yapılamayan görevler günlük havuza girmez; ağır harcama görevlerinden aynı gün en fazla biri seçilir.
- **Etkilerim genişletildi:** Yakup'tan gelen aktif etkiler de Bal Defteri → Etkilerim bölümünde kaynak ve süre bilgileriyle görünür.
- **Odak kartı ayrıntıları:** kalan bonus süresi, bugün kazanılan süre ve 4 saatlik günlük limit birlikte gösterilir.
- **Gerçek ses paketi:** 20 OGG kayıt oyuna entegre edildi. Coin, zil, başarı, yerleştirme, ekim, kâğıt, hasat ve hata efektleri artık gerçek sample kullanır; dosya yüklenemezse sentez fallback korunur.
- **Yeni ambient ses motoru:** kuş, arı, yağmur ve rüzgâr kayıtları hava, mevsim, gece/gündüz, kamera yakınlığı ve kovan konumuna göre dinamik çalınır. Arı sesi stereo konumlandırma kullanır; ortam ve efekt sesleri ayrı ayrı kapatılabilir.
- **Ses kaynakları:** kullanılan kayıtların kaynak/lisans notları `src/renderer/bee/sounds/KAYNAKLAR.md` içinde tutulur.

## Değişti

- **Odak bonusu günlük kazanım limiti:** en az 10 dakikalık seanslar Arıcılığı desteklemeye devam eder; 25 dakika = 1 saat bonus. Bir gerçek takvim gününde toplam en fazla **4 saat** Arıcılık bonusu kazanılabilir. Kota gerçek gece yarısında yenilenir.
- **Müdavim kalp bonusu:** sipariş ödeme bonusu kalp başına **%6'dan %2'ye** düşürüldü; 5 kalpte maksimum **%10**.
- **Tek köylü / tek aktif sipariş:** aynı köylünün aynı anda yalnızca bir açık veya kabul edilmiş normal siparişi olabilir.
- **Geri dönüş özeti:** “Tekrar hoş geldin” özeti artık **20 gerçek dakika** veya daha uzun yoklukta gösterilir.
- **Seyyah Yakup fiyat dengesi:** 38 ürünün fiyatı, etkisi ve ziyaret limiti 5.4.2 ekonomisine göre yeniden dengelendi.
- **Yakup dekor politikası:** Yakup hiçbir koşulda dekor satmaz.
- **Geçici Yakup etkileri:** aynı güç çarpılarak üst üste binmez; yeniden uygulama süreyi uzatır/yeniler.
- **Pazar Mührü:** yalnızca bir sonraki pazar satışında, en fazla 10 kg için +%15 fiyat sağlar.
- **Kovan Yalıtımı:** seçilen kovanda bir sonraki kışın şurup tüketimini %50 azaltır.
- **Irk Değişim Kuponu:** satın alırken seçilen kovanda tek seferlik ırk değişimi uygular.
- **Görev ödülleri:** görev zorluğuna ve gereken harcamaya göre farklılaşır; %20 hediye tohum ihtimali korunur.

## Korunan 5.4.2 kuralları

- Normal siparişler gerçek zamanda 5 dakikada bir gelir; uzun dönüşte en fazla 3 normal sipariş birikir.
- Hastalık vaka başına yaklaşık üçte bir arı kaybıyla sınırlıdır; kovan 4 arıya düştüğünde hastalık sona erer.
- Arı alış fiyatı mevcut arı sırasına bağlıdır; satış fiyatı ilgili alış fiyatının %50'sidir.
- Depo yükseltmeleri 10.000 kg'a kadar devam eder.
- Oyun penceresine 2 saat bakılmazsa üretim durur; takvim devam eder ve geri dönüşte üretim yeniden başlar.

## Teknik

- Hedef sürüm: **5.5.0**
- appId: **com.stenwick.nero** (değişmedi)
- Kayıt alanları eski kayıtlarla uyumlu varsayılanlarla genişletildi.
- Arıcılık rehberi ve oyun içi Rehber 5.5.0 kurallarıyla senkronlandı.
- 57 topic / 2.133 kilitli replik için otomatik sayım kontrolü eklendi.
- 5.5.0 mekanikleri için regresyon testleri eklendi.
