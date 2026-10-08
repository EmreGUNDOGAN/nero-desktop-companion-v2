# Nero 6.9.13 — Onaylı temalar, SpongeBob kıyafetleri ve açılış düzeltmesi

Bu sürüm önceki bütün özellikleri ve temaları içerir. Kullanıcının güncel teslim isteği tüm tema/program değişikliklerini içeren Windows Setup, güncel tam GitHub kaynakları ve Actions bağlantısıdır. Harry Potter eklenmemiştir. Kaynak klasörünü açmak kişisel kayıtları otomatik değiştirmez.

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

## SpongeBob kıyafetleri ve gece kuralı

Ayarlar → Kıyafet Dolabı → **SpongeBob** sekmesinde SpongeBob, Squidward, Patrick, Mr. Krabs ve Sandy bulunur. Bikini Bottom temasına geçişte SpongeBob kıyafeti otomatik giyilir; kilitli değildir, başka kıyafet seçilebilir veya çıkarılabilir. Aynı tema içinde ayar değiştirmek ve uygulamayı yeniden açmak elle seçilen kıyafeti sıfırlamaz.

21.00'de rastgele pijama giyilir; sonrasında kıyafet değiştirmek ve çıkarmak serbesttir. Gündüz seçimi saklanır, 06.00'da geri gelir. Ertesi gece yeniden rastgele pijama seçilir. Patrick'in boyun izi olmayan ve SpongeBob'un belirgin kol çizgili v2 gövdeleri kullanıcı tarafından onaylanmıştır. Kıyafet kaynakları ve doğrulamalar `docs/wardrobe-sponge` içindedir.

## Açılmama hatası

Görev yöneticisinde görünüp pencerelerin oluşmamasının nedeni, odak kayıtlarını yöneten `Productivity` bölümünün `Timer` oluşturulmadan başlatılmasıydı. Önce sayaç, sonra ona bağlanan kayıt bölümü oluşturulur. Bu hata kullanıcı kaydını silerek veya temayı sıfırlayarak giderilmemiştir.

İki yeni temada **gerçek main.js**, üretim ön yükleyicisi ve ayrı test profilleriyle açılış doğrulandı: karakter penceresi oluşturuluyor, sabitlenmiş panel yeniden açılıyor, gösterme isteği yapılıyor ve sayaç oturumu başlayabiliyor. Testler kullanıcının `%APPDATA%\Nero` kayıtlarını kullanmaz.

## Görseller ve doğrulama

Onaylanan tasarımlar `docs/tv-themes/concepts` içinde, gerçek uygulama ekranları `docs/tv-themes/screens` içindedir. `*-full.png` dosyaları kaydırılan sayfanın tamamını gösterir. Test ekranlarındaki kayıtlar yalnız izole örnek veridir; uygulamaya başlangıç kaydı olarak eklenmez.

Sahneler onaylı görsellerden çıkarıldı. Arka plandaki örnek selamlama, rozet tarihleri ve sayaç rakamları canlı arayüzle karışmaması için temizlendi veya ayrı üretim parçalarıyla değiştirildi. Gerçek yazılar, süreler, sayılar ve kontroller HTML arayüzüdür. Üretim görsellerinde yer alan mağaza/kupa işaretleri dekor olarak kalır. Yeni temiz görseller yerleşik imagegen aracıyla üretildi; dosyalar ve kullanılan açıklamalar kaynakta bulunur.

Konseptler referanstır; gerçek arayüz farklı pencere boyutlarında uyarlanır. Özellikle dar pencerelerde iki sütun tek sütuna geçer. Bu yüzden konsept görselleri gerçek uygulama ekranı olarak sunulmaz.

359 otomatik test, yeni temalar için 60 panel yerleşimi, 136 finans yerleşimi ve 24 çizgi roman finans yerleşimi doğrulandı. Karakter, odak bildirimi, hızlı not gönderimi, not kaydı, kontrol listesi, bağlı sayaç ve temalar arası geri dönüş ayrıca kontrol edildi. Son kaynak ZIP’i dosya dosya içerik karşılaştırmasıyla doğrulanır.

Önceki bütün özelliklerin rehberi: `TUM-GELISTIRMELER-OKU.md`.
