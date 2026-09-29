# Nero 6.3.2 — Kıyafetler Gerçek Nero Gövdesinde

## Masaüstü Nero

- 88 kıyafetin tamamı, Nero’nun 1.0.0’dan beri kullandığı geniş ve yumuşak oval gövde oranına göre yeniden uyarlanır.
- Tam karakter kıyafet çizimleri korunur; ayrı bir PNG’yi Nero’nun üstüne bırakma yöntemine geri dönülmez.
- Kıyafet çizimi önce üst gövde ve omuzlarda yatay olarak Nero’nun gerçek oranına genişletilir; aşağı indikçe dönüşüm yumuşak biçimde sıfıra iner. Böylece ayaklar ve alt gövde gereksiz yere genişlemez.
- Dönüşümün ardından çizimdeki sabit yüz temizlenir. Nero’nun gerçek gözleri, göz kırpması, bakışı, kaşları, ağzı ve konuşma animasyonu kıyafetin içinde çalışmaya devam eder.
- Yüz katmanları ayrı ayrı esnetilmez; Nero’nun kendi yüz geometrisi korunur ve yalnızca kıyafetin doğal yüz konumuna birlikte taşınır.
- Şapka, bere, kapüşon ve özel kostümlerde yüz konumu görselden otomatik bulunur.
- Ayarlar > Kıyafet Dolabı önizlemeleri de aynı gövde düzeltmesini kullanır; seçilen kıyafetin kartı masaüstündeki biçime karşılık gelir.
- 6.3.1’de düzeltilen anlık kıyafet seçimi, gece pijaması ve özel gün kilidi davranışları korunur.

## Teknik

- Sürüm `6.3.2`.
- `appId` değişmedi: `com.stenwick.nero`.
- 88 tam karakter PNG kaynağı korunur; düzeltme çalışma anında uygulanır, böylece tek bir kanonik kıyafet seti bütün yerleşik temalarda kullanılır.
