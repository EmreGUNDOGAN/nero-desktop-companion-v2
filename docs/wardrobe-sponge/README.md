# SpongeBob kıyafet provası

Beş kıyafet uygulamaya bağlıdır: SpongeBob, Squidward, Patrick, Mr. Krabs ve Sandy. Karen kapsamdan çıkarılmıştır. Dolapta `SpongeBob` sekmesinde bulunurlar. Bikini Bottom temasına geçişte SpongeBob otomatik giyilir; kullanıcı başka kıyafet seçebilir veya çıkarabilir. Aynı tema içinde ayar değiştirmek ve uygulamayı yeniden açmak elle yapılan seçimi sıfırlamaz.

Saat 21.00'de gecenin rastgele pijaması giyilir. Ardından dolaptan başka kıyafet seçmek ve çıkarmak serbesttir. Gece seçimi gece yarısından sonra 06.00'ya kadar korunur; sabah gündüz kıyafeti geri gelir. Sonraki akşam yeniden rastgele pijama seçilir. Önceden var olan özel gün davranışı korunmuştur.

Mevcut kıyafet sistemi yalnız çıplak gövdenin üzerine bir resim yerleştirmez. `NeroWardrobeRenderer` tam gövdeyle ona ölçülen göz, göz bebeği, göz kapağı, kaş ve ağız katmanlarını birlikte yükler. Kot ceket kaynak paketi aynı yöntemle önizlemeye alındı. SpongeBob taslağı ayrı gövde görselidir; yüz için mevcut kot ceket katmanları ve 220×260 koordinatları kullanılır. Gövde yalnız aynı çalışma boyutuna küçültüldü; rastgele kaydırma ayarı yapılmadı.

- `fitting-preview-fragment.html`: sohbet önizlemesinin bağımsız içerik kopyası.
- `fitting-preview-template.html`: veri ve gerçek renderer kodu yerleştirilmeden önceki düzenlenebilir şablon.
- `fitting-preview.html`: izole görsel doğrulama için kullanılan tam sayfa sarmalayıcı.
- `preview-verification.json`: giydir, çıkar, kot cekete geç, göz kırp ve hızlı değişimler geçti; hatalar yok.
- `prototype-manifest.json`: görsel kaynağı, yüz katmanları ve prototip durumu.

Sandy'nin yüz katmanları daha küçük kask açıklığına ölçülerek oturtulmuştur; göz kapaklarının rengi kendi teninden alınır. Her kostüm 23 katman varyantı içerir; konuşma, bakış ve göz kapağı varyantları korunur. Kostümü çıkarma mevcut varsayılan gövde ve yüzü geri getirir.

- `bikini-costumes-fragment.html`: beş kıyafet için tek sohbet provası.
- `combined-preview-verification.json`: beş kıyafette giydir/çıkar, göz kırpma, hızlı geçiş ve dar ekran kontrolleri.
- `production-verification.json`: gerçek ana süreç, gerçek uygulama sayfası ve dolap düğmeleriyle gece ve tema kuralları.
- `installed-asset-manifest.json`: üretim kimlikleri, kaynak özetleri ve yüz ölçüleri.
- `wardrobe-tab-real.png`: kodlanmış dolap ekranının gerçek uygulama verileriyle çekilmiş görüntüsü.

Üretim dosyaları `themes/default/assets/wardrobe/bikini-*` altında; grup tanımları `src/main/wardrobe-bikini.json`, kurallar `src/main/wardrobe.js` içindedir. Önceki 188 kıyafet korunmuştur; toplam katalog 193 kıyafettir. Beşli prova kullanıcı tarafından incelenmiştir; son düzeltmelerde Patrick'in boyun izi kaldırılmış, SpongeBob'un iki kolundaki soluk çizgiler koyulaştırılmış ve ikisi açıkça onaylanmıştır. Kataloğun üretim gövdeleri bu onaylı v2 dosyalarından gelir. Güncel teslim talebi tüm tema/program değişikliklerini içeren Windows Setup ve GitHub Actions bağlantısıdır.
