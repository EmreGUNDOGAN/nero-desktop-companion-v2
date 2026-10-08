# Nero 6.9.13 — Gilmore Girls, The Office ve açılış düzeltmesi

Bu **tam kaynak paketi**, önceki bütün özellikleri ve temaları içerir. Harry Potter eklenmemiştir. Kurulu Nero dosyalarını veya kişisel kayıtları otomatik değiştirmez.

## Başlatma

Node.js kuruluysa kaynak klasöründe:

```text
npm ci
npm start
```

Finansın derlenmiş dosyaları hazırdır. Finans kaynaklarını değiştirirseniz `npm run finance:build` kullanın. Otomatik kontroller için `npm test`, finans tip kontrolü için `npm run finance:check` çalıştırılabilir. İsteğe bağlı yerel kurulum paketi `npm run dist` ile oluşturulur; yayınlama yapılmaz.

## Yeni temalar

Ayarlar → Görünüm → Tema listesinden:

- **Gilmore Girls · Stars Hollow** (`stars-hollow`): Lorelai/Rory ana sayfası, Rory/Paris kütüphanesi, Lorelai/Sookie Dragonfly Inn çalışma alanı, Luke’un kahve sayacı, kasaba hatıraları.
- **The Office · Scranton** (`scranton`): seçilen dört karakterli ana sayfa; Pam/Jim resepsiyon notları; Dwight’ın çalışma tahtası; Michael/Stanley toplantı saati; Dundies ödül rafı.

Her temada Bugün, Notlar, İşler, Sayaç ve Rozetler ayrı sahne ve düzen kullanır. Bütçe mevcut finans görünümüyle çalışır; Ayarlar, hızlı not, konuşma balonu ve odak bildirimi tema renkleriyle uyumludur. Nero’nun mevcut karakteri, kıyafetleri ve animasyonları korunur.

Notlarda üstteki **Yeni not** ve karttaki **⋯** menüsü kullanılır. Uzun not alttaki defterde, geniş Scranton penceresinde sağdaki panoda yazılır; kısa beklemeden sonra otomatik kaydedilir. Etiket, sabitleme, renk, arşiv ve kontrol listesi özeti korunur. Liste araçları Markdown işaretleri ekler; karttaki kontrol kutuları işaretlenebilir.

Scranton İşler sayfasında geniş pencerelerde Bugün / Sonra sütunları, dar pencerelerde dikey liste kullanılır. Asıl sıralama ve sürükleme işleyicileri korunmuştur. Sayaçta mevcut iş seçimi, duraklatma, devam, bırakma ve oturum geçmişi çalışır. Büyük özel sürelerde rakam boyutu otomatik küçülür.

## Açılmama hatası

Görev yöneticisinde görünüp pencerelerin oluşmamasının nedeni, odak kayıtlarını yöneten `Productivity` bölümünün `Timer` oluşturulmadan başlatılmasıydı. Önce sayaç, sonra ona bağlanan kayıt bölümü oluşturulur. Bu hata kullanıcı kaydını silerek veya temayı sıfırlayarak giderilmemiştir.

İki yeni temada **gerçek main.js**, üretim ön yükleyicisi ve ayrı test profilleriyle açılış doğrulandı: karakter penceresi oluşturuluyor, sabitlenmiş panel yeniden açılıyor, gösterme isteği yapılıyor ve sayaç oturumu başlayabiliyor. Testler kullanıcının `%APPDATA%\Nero` kayıtlarını kullanmaz.

## Görseller ve doğrulama

Onaylanan tasarımlar `docs/tv-themes/concepts` içinde, gerçek uygulama ekranları `docs/tv-themes/screens` içindedir. `*-full.png` dosyaları kaydırılan sayfanın tamamını gösterir. Test ekranlarındaki kayıtlar yalnız izole örnek veridir; uygulamaya başlangıç kaydı olarak eklenmez.

Sahneler onaylı görsellerden çıkarıldı. Arka plandaki örnek selamlama, rozet tarihleri ve sayaç rakamları canlı arayüzle karışmaması için temizlendi veya ayrı üretim parçalarıyla değiştirildi. Gerçek yazılar, süreler, sayılar ve kontroller HTML arayüzüdür. Üretim görsellerinde yer alan mağaza/kupa işaretleri dekor olarak kalır. Yeni temiz görseller yerleşik imagegen aracıyla üretildi; dosyalar ve kullanılan açıklamalar kaynakta bulunur.

Konseptler referanstır; gerçek arayüz farklı pencere boyutlarında uyarlanır. Özellikle dar pencerelerde iki sütun tek sütuna geçer. Bu yüzden konsept görselleri gerçek uygulama ekranı olarak sunulmaz.

352 otomatik test, yeni temalar için 60 panel yerleşimi, 136 finans yerleşimi ve 24 çizgi roman finans yerleşimi doğrulandı. Karakter, odak bildirimi, hızlı not gönderimi, not kaydı, kontrol listesi, bağlı sayaç ve temalar arası geri dönüş ayrıca kontrol edildi. Son kaynak ZIP’i dosya dosya içerik karşılaştırmasıyla doğrulanır.

Önceki bütün özelliklerin rehberi: `TUM-GELISTIRMELER-OKU.md`.
