# Nero 6.7.7

## Yörünge Kontrol Merkezi — Asset‑First Yeniden Tasarım

Bu sürüm Yörünge Kontrol Merkezi temasını 6.6.7'deki CSS ağırlıklı pilot yapıdan çıkarıp asset-first bir tasarım sistemine taşır.

### Ortak sistem
- Tema `yorunge-v2` skin kimliğinde izole çalışmaya devam eder; eski `[data-skin="yorunge"]` kuralları kullanılmaz.
- Görsel kimlik `src/renderer/panel/deco/yorunge-v677/` altında düzenli PNG/SVG asset klasörlerine taşındı.
- Üst pencere kontrol ikonları ve beş ana sekme için tema-özel SVG ikon seti kullanılır.
- Pencere yeniden boyutlandırıldığında taşmayı azaltmak için 620 px ve 420 px container kuralları bulunur.

### Görev / Bugün
- Gerçek uzay istasyonu + Dünya sahnesi görsel arka plan olarak kullanılır.
- Nero ayrı transparan görsel asset katmanıdır; en-boy oranı korunur.
- Masa/foreground ayrı transparan görsel asset katmanıdır.
- Crew monitor ayrı SVG frame assetidir ve içindeki ruh hâli / konum / aktif görev canlı veridir.
- Sticky mission note ayrı PNG assetidir.
- Dört istatistik kartı tema-özel SVG ikonları kullanır.
- Haftalık odak alanı bar grafik görünümünden yedi gezegenli yörünge rotasına dönüştürülür; gerçek odak dakikaları korunur.

### Loglar
- Ayrı `logs/hero-bg.svg` sahnesi kullanılır.
- Notlar mission log / kayıt kartı yapısına dönüştürülür.
- Yeni log ve arşiv alanları Yörünge tasarımına özel görünür.
- Not editörü orbital control kayıt formu görünümündedir.

### Kontrol
- Ayrı `control/hero-bg.svg` ve `control/switch-bank.svg` assetleri kullanılır.
- Açık görev sayısı canlı `OPEN CHECKS` ekranına bağlıdır.
- Görev listesi flight checklist düzenine dönüştürülür.
- Tamamlanan görevler `NOMINAL` durumuyla işaretlenir.

### T‑Zamanı
- Ayrı `timer/hero-bg.svg` sahnesi kullanılır.
- Nero sahne içinde bağımsız PNG katmanı olarak konumlanır.
- İlk dört açık görev gerçek zamanlı odak listesinde görünür.
- Sayaç, görev parametreleri ve kontrol butonları görev modülü kompozisyonuna ayrılır.

### Yamalar / Rozetler
- Ayrı `badges/hero-bg.svg` ve `badges/patch-frame.svg` assetleri kullanılır.
- Kazanılmış rozet sayısı canlı PATCHES ekranına bağlıdır.
- Rozetlerin kendi mevcut ikonları değiştirilmez; yalnız taşıyıcı çerçeve ve sayfa kompozisyonu temalaştırılır.

### Doğrulama
- `npm test`: **294 / 294 geçti**.
- `node scripts/wardrobe-v665/check-release.js`: başarılı.
- Yörünge CSS'inde referans verilen 26 asset yolunun tamamı source içinde doğrulandı.

## Sürüm
- Paket: **6.7.7**
- Hedef branch: `feature/bee-v6.7.7`
