# Nero 6.9.0

- Oyuncu ve yapay zekâ sıralamasından tüketilebilir şurup sermayesi çıkarıldı.
- Pazarın üretilen ürünleri ayrı sekmeye alındı; bağımsız ürün siparişleri en fazla 10, her 5 gerçek dakikada bir gelir.
- Görevler basılı tutularak sıralanır; alt görevler kaydedilir, tamamı bitince ana görev tamamlanır.
- Odak bitişinde gerçek Nero ve kıyafetini kullanan cozy bildirim, kullanıcı tarafından sağlanan tek seferlik bitiş/durdurma sesleri eklendi.
- Radyo Akşamı teması: ortak radyo çerçevesi ve Bugün sayfası, mevcut boyutlarda kaydırılabilir.
- 6.8.1 kullanıcı kayıtları korunur. Oyun ve kullanıcı rehberi güncellendi.

## Doğrulama

`npm test`, `npm run dialogue:check` ve kıyafet koleksiyonu kontrolü. Yeni testler gerçek görev IPC akışını, kaydet/yükle, sipariş kotası/zamanlayıcıları, sipariş rezervasyonlarını ve oyuncu/rakip şurup sıralamasını kapsar.
Windows kurulum paketi GitHub Actions üzerinde oluşturulur; gerçek Windows masaüstü bildirimi ve hoparlör sonucu son kullanıcı cihazında kontrol edilmelidir.
