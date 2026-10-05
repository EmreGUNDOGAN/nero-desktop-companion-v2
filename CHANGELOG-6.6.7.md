# Nero 6.6.7

## Yörünge Kontrol Merkezi — yapısal pilot

- Yörünge Kontrol Merkezi artık yalnızca renk/font skin'i değil; beş ana sayfanın kompozisyonu birbirinden ayrıldı.
- **Görev:** uzay penceresi, görev köprüsü, Nero'nun Space 17 görünümü, crew status ekranı ve yeniden düzenlenmiş günlük dashboard.
- **Loglar:** kart ızgarası yerine mission-log akışı ve görev günlüğü başlığı.
- **Kontrol:** switch bankası, uçuş kontrol hero alanı ve checklist görünümü.
- **T-Zamanı:** iki kolonlu mission timer, görev parametreleri ve açık işlerden beslenen gerçek odak önizlemesi.
- **Yamalar:** görev patch arşivi görünümü; mevcut rozet ikonları korunur.
- Nero görseli en-boy oranı bozulmadan `object-fit: contain` ile kullanılır.
- Pilot yalnızca Yörünge temasını yeniden tasarlar; diğer temaların mevcut görünümü değiştirilmez.

## Sürüm

- Paket sürümü: **6.6.7**
- Branch: `feature/bee-v6.6.7`


### 6.6.7 düzeltmesi — Yörünge v2 izolasyonu

- Yörünge pilotunun UI skin kimliği `yorunge-v2` olarak ayrıldı; 6.6.6'daki `[data-skin="yorunge"]` kuralları artık pilot üzerine uygulanmaz.
- Pilot kendi bağımsız üst bar, sekme, kart ve kontrol merkezi kabuğunu içerir.
- Space 17 Nero görseli paketli uygulamada çalışan `nero-theme://default/assets/wardrobe/outfit-space-17.png` protokolü üzerinden yüklenir.
