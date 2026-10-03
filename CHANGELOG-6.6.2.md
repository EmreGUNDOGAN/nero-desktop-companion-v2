# Nero 6.6.2 — Masaüstü kıyafet entegrasyonu

Temel: kullanıcının sağladığı Nero-6.6.1-final-bundle.zip içindeki Nero-v6_6_1-source.zip.
Bu sürüm, önceki 6.3.2 kıyafet çalışmasının 6.6.1 final tabanına taşınmış ve 6.6.2 olarak paketlenmiş halidir.

## Değişiklikler

- 88 kıyafet, ayrı beden ve hareketli yüz katmanlarıyla masaüstü Nero'ya bağlandı.
- Kıyafete özel yüz ölçüleri, ten renkleri ve saydam kenar düzeltmeleri taşındı.
- Kar Tanesi Kazağı için tercih edilen önceki kol konturu korundu. Reddedilen son kumaş kopyalama yaması kullanılmadı.
- Mevcut göz kırpma, göz takibi, konuşma, ifade ve beden animasyonları kullanılır.
- Ayarlara kategorili kıyafet dolabı ve kıyafet çıkarma seçeneği eklendi.
- Yeni kıyafetin bütün katmanları yüklenmeden eski kıyafet kaldırılmaz. Hızlı seçimlerde geç gelen eski yükleme yeni seçimi değiştirmez.
- 21.00–06.00 arasında gecelik rastgele pijama; özel günlerde otomatik kıyafet kuralları bağlandı.
- Kıyafet çıkarılınca orijinal hareketli karakter katmanları geri gelir.
- 6.6.1 oyun kaynakları ve mevcut diğer özellikler korunmuştur. Oyun içindeki Nero'ya kıyafet eklenmedi.

## Kontroller

- 35 test dosyasında toplam 243 test geçti.
- 88 kıyafetin tema katalog yolları ve bağımsız yüz katmanları doğrulandı.
- Değişen mevcut dosyalar yalnızca masaüstü karakteri, dolap arayüzü, ayarlar bağlantısı, tema yükleyicisi ve package.json'dur.
- Windows/Electron üzerinde canlı uçtan uca test yapılmadı. Bu pakette yeni derlenmiş EXE bulunmaz.

## 6.6.2 paketleme

- Sürüm numarası 6.6.2 olarak güncellendi.
- Windows build, Electron smoke testi ve tam test paketi GitHub Actions üzerinde doğrulanacaktır.
- Arıcılık oyun içi Nero kıyafetsiz kalır; kıyafet sistemi yalnız masaüstü Nero içindir.
