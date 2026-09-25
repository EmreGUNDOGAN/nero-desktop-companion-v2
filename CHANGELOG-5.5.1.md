# Nero 5.5.1 — Arıcılık Ses Entegrasyonu

Nero 5.5.1, 5.5.0 üzerine gelen ses odaklı bir patch sürümüdür. Oyun mekaniği ve 5.5.0'daki 57 topic / 2.133 repliklik diyalog sistemi korunur; bu sürüm Arıcılık bölümüne gerçek ses efektleri ve dinamik ortam sesleri ekler.

## Yeni

- **20 gerçek OGG ses kaydı** Arıcılık bölümüne entegre edildi.
- Coin, zil, başarı, yerleştirme, ekim, kâğıt, hasat ve hata olayları gerçek sample'larla çalınır.
- Gerçek sample yüklenemezse mevcut sentezlenmiş ses fallback'leri çalışmaya devam eder.
- Kuş, arı, yağmur ve rüzgâr için yeni **ambient ses motoru** eklendi.
- Arı sesi kamera yakınlığı ve kovanların ekrandaki konumuna göre stereo yönlendirilir.
- Kovan içine girildiğinde arı uğultusu yakın ve daha boğuk hale gelir.
- Kuşlar ve arılar sürekli loop yerine doğal sessizlik aralıklarıyla seanslar halinde çalar.
- Hava, mevsim, gece/gündüz ve kamera durumu ambient sesleri etkiler.
- Efekt sesleri ve ortam sesleri ayrı ayrı açılıp kapatılabilir.
- Ses dosyaları `main → preload → renderer` IPC zinciri üzerinden Web Audio'ya aktarılır.
- AudioContext askıda başlarsa ilk kullanıcı etkileşiminde güvenli biçimde `resume()` edilir.
- Ses kaynak/lisans notları `src/renderer/bee/sounds/KAYNAKLAR.md` içinde tutulur.

## Korunan davranışlar

- Nero 5.5.0'daki **57 topic / 2.133 onaylı replik** değişmeden korunur.
- 40 günlük görev, Yakup'un 38 ürünü, günlük 4 saat odak kotası, +%2 kalp bonusu ve diğer 5.5.0 mekanikleri değişmez.
- appId: **com.stenwick.nero** değişmez.

## Test ve paketleme

- Ses paketi için 20 dosya adı ve OGG başlık doğrulaması eklendi.
- Electron smoke testinde preload üzerinden `bee:sounds()` çağrısı ile 20 sesin renderer'a ulaştığı doğrulanır.
- Windows build'de paketlenmiş ses asset'leri ayrıca kontrol edilir.
