# Nero 6.3.3 — Kıyafetler Baştan Tasarlandı

## Masaüstü Nero

- Eski 88 kıyafet aktif dolaptan çıkarıldı. Önceki tam-karakter dönüştürme ve otomatik gövde reshape sistemi tamamen emekliye ayrıldı.
- İlk 10 kıyafet doğrudan Nero’nun gerçek 220×260 default gövdesine göre sıfırdan hazırlandı: Kot Ceket, Çizgili Tişört, Soft Yeşil Hoodie, Kamp Günü, Baharlık Gömlek, Krem Hırka, Kar Tanesi Kazağı, Pijamaları, Parti Kıyafeti ve Kış Montu.
- Yeni kıyafetler `themes/default/assets/wardrobe-v2/` altında Nero’ya özel SVG giysi katmanlarıdır. Başka bir karakterin gövdesi, yüzü, eli veya ayağı kıyafetin içine gömülmez.
- Nero’nun kendi `body.svg` gövdesi her zaman yerinde kalır. Kıyafet bunun üstüne tam ölçüde oturur; gerçek göz, pupil, göz kapağı, kaş ve ağız katmanları üstte çalışmaya devam eder.
- Kıyafet Dolabı kartları masaüstündekiyle aynı katman sırasını kullanır: gerçek Nero gövdesi + yeni kıyafet + gerçek yüz katmanları.
- Yeni dolap ilk aşamada yalnızca Default Nero’da aktiftir; başka temalarda eski uyumsuz kıyafetler gösterilmez.
- Gece 21.00–06.00 arasında yeni `Pijamaları` tasarımı otomatik kullanılır. Kullanıcı gece başka bir yeni kıyafete dokunursa o gece seçimi hemen uygulanır.
- Eski özel-gün otomatik kostümleri, yeni özel tasarımlar tamamlanana kadar devre dışıdır.

## İlk 10 Kıyafet

1. Kot Ceket
2. Çizgili Tişört
3. Soft Yeşil Hoodie
4. Kamp Günü
5. Baharlık Gömlek
6. Krem Hırka
7. Kar Tanesi Kazağı
8. Pijamaları
9. Parti Kıyafeti
10. Kış Montu

## Teknik

- Sürüm: `6.3.3`
- `appId`: `com.stenwick.nero`
- Eski `wardrobe-canonical.js` çalışma zamanı dönüştürücüsü kaldırıldı.
- Kıyafet seçimi artık gerçek animasyonlu Nero’nun render katmanlarına doğrudan bağlanır.
