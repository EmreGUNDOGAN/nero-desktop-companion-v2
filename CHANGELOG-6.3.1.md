# Nero 6.3.1 — Hareketli Kıyafet Dolabı

## Masaüstü Nero

- Kıyafet sistemi yeniden kuruldu: 88 kıyafet artık Nero’nun yerine konan tam karakter PNG’leri değildir. Her kıyafet Nero’nun 220×260 gövdesine özel hazırlanmış şeffaf PNG giysi katmanı olarak kullanılır.
- Kıyafet giyildiğinde Nero’nun kendi gövdesi `body-dressed.svg` ile kıyafete uygun siluete geçer; eller `hands-dressed.svg` ile önde kalır. Böylece kol, yaka ve kenarlar Nero’ya tam oturur.
- Nero’nun gerçek göz, pupil, göz kapağı, kaş, ağız ve efekt katmanları kıyafetin üstünde aktif kalır. Göz kırpma, konuşma, mutlu, kızgın, normal ve diğer mevcut mimikler kıyafetliyken de çalışır.
- Eski “kıyafet PNG’sinin içindeki sabit yüzü göster, canlı yüzü gizle” yaklaşımı kaldırıldı.
- Kıyafet çizgileri ve Nero’nun dış çizgileri tam opak tutulur; soluk/çift çizgi görünümü engellenir.
- Ayarlar > Kıyafet Dolabı önizlemeleri oyundaki aynı katman mantığıyla oluşturulur: giyinik Nero gövdesi + seçilen PNG + canlı Nero yüzü + eller.
- Bir kıyafete tıklanınca seçim tamamlanması beklenir ve Nero hemen güncellenir. Gece yapılan manuel seçim o gece anında görünür; sonraki gece otomatik pijama döngüsü yeniden devreye girer.
- Özel gün kıyafet kilidi ve mevcut 6.1.0/6.3.x davranışları korunur.

## Kontrol

- 72 seçilebilir kıyafet, 8 gece görünümü ve 8 özel görünüm olmak üzere 88 şeffaf PNG doğrulanır.
- 11 yerleşik temada giyinik gövde ve el katmanları doğrulanır.
- Sürüm `6.3.1`, `appId` `com.stenwick.nero` olarak korunur.
