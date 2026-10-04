# Nero 6.6.3 — Ekonomi ve sipariş düzeltmeleri

Temel kaynak: Bu görüşmede incelenen Nero-v6_6_1-source.zip (6.6.1).
Bu paket ayrı bir 6.6.2 kaynakla birleştirilmemiştir.

- Atölyenin herhangi bal isteyen tarifleri, gerçekten tüketilecek bal türlerini ve sipariş rezervasyonlarını dikkate alarak fiyatlanır.
- Yeni üretimlerin birim değeri üretime girişte kaydedilir. Aynı ürünün farklı maliyetli partileri ağırlıklı ortalamayla değerlenir; satış ve sipariş tesliminde kayıt azaltılır. Kayıt yüklemede korunur.
- Eski devam eden işlerin iade kaydındaki bal türleri, tamamlanma anındaki fiyatlarıyla değerlendirilir. Eski bitmiş ürünlerin geçmiş maliyeti bilinmediğinden mevcut hesap korunur.
- Kullanılabilir bal miktarı artık onda bir kilograma yuvarlanmaz. Kesirli stoktan fazla malzeme tüketilmesi ve sipariş rezervasyonunun bozulması engellendi.
- 0,6 / 0,7 / 0,8 / 0,9 günlük ticari tarifler bir güne zorlanmaz; belirtilen sürede tamamlanır.
- Ürün sipariş adayları yan ürün stoğunu veya üretim koşullarını kontrol eder. İki adet isteyen siparişler için iki adetlik kaynak erişimi kontrol edilir. Bu kontrol teslim garantisi değildir.
- Bal siparişi tahmini gerçek dakika üzerinden gösterilir; seçili hız, arka plan hız sınırı, duraklama ve diğer sipariş rezervasyonları dikkate alınır. Hazır etiketi de rezerve balı düşer.
- Doğum günü kıyafeti gece pijamasından önceliklidir. Kaldırılmış geniş kıyafet dolabı geri eklenmedi; mevcut animasyonlar değiştirilmedi.
- Paket sürümü 6.6.3 oldu; yeni Windows Actions derleme akışı eklendi.

## Kapsam

Nero'nun ruh hâli algoritması bu hata düzeltme paketinde yeniden tasarlanmadı. İncelemede geçen bağımsız iç ruh hâli konusu yeni bir özellik kararıdır; sayısal kuralları belirlenmeden eklenmedi.
Windows setup ve görsel Electron testi bu ortamda çalıştırılmadı. Kaynak paketi teslim edilir; GitHub'a gönderim yapılmadı.
