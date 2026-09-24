# Nero 5.0.0

5.0.0, Nero'nun diyalog altyapısını kalıcı bir master/runtime sisteme taşıyan ve uygulamaya tamamen entegre **Arıcılık** mini oyununu ekleyen büyük sürümdür.

## Yeni — Arıcılık
- Three.js tabanlı ayrı Arıcılık penceresi.
- Kovan, çiçek, bal üretimi, hasat, depo, Pazar, siparişler, köylüler, dekorlar, arı ırkları, şurup, hastalık, balmumu/mum, rakipler ve yıllık Bal Festivali.
- Panel başlığında **🐝 Arıcılık** düğmesi ve sağ tık menüsünde ikinci giriş noktası.
- Nero açıkken oyun penceresi kapalı olsa da çiftlik ana süreçte ilerlemeye devam eder.
- Nero odak seansı tamamlandığında arıcılık üretim bonusu; tamamlanan her işte **+10 jeton**.
- Dolu/hasta kovan, yaklaşan sipariş, kış erzağı ve rakip uyarıları masaüstü Nero tarafından bildirilebilir.
- Arıcılık kaydı Nero'nun genel yedeğine dahildir; ayrıca yalnız çiftliği dışa/içe aktarma desteği vardır.
- **Oyunu sıfırla:** Ayarlar > Yedekler altında bulunur, iki aşamalı onay ister ve önce mevcut çiftliği otomatik yedekler.

## Arıcılık takvimi ve hız
- **1 oyun günü = 1x hızda 15 gerçek dakika.**
- Her mevsim/oyun ayı **15 gün** sürer.
- Bir oyun yılı **60 gün**dür.
- Bal Festivali yılın son 3 gününde açılır.
- Oyun arka planda çalışıyorsa seçili hız 4x olsa bile simülasyon en fazla **2x** ilerler; pencere yeniden öne gelince seçili 4x devam eder.

## Rehber
Oyun içi Rehber ayrıntılı bir mekanik rehberine dönüştürüldü:
- ilk 10 dakika ve başlangıç adımları,
- zaman, aylar, mevsimler ve hız,
- çiçek → bal üretim sistemi,
- kovanlar, arılar ve yükseltmeler,
- kış, şurup ve hastalık,
- hasat ve depo,
- Pazar ve siparişler,
- köylüler ve dekor bonusları,
- Nero odak/görev bağlantıları,
- festival ve rakipler,
- kayıt, yedek ve sıfırlama.

## Diyalog altyapısı
- Diyaloglar artık **canonical master + generated runtime + manifest** modeliyle yönetiliyor.
- Yeni dosyalar: `src/data/dialogue.master.tr.json`, `src/data/dialogue-master.manifest.json`.
- Build/check/import scriptleri eklendi.
- Master ve runtime dosyalarının birebir senkron kalması doğrulanıyor.
- Güncel sistemde **106 kategori / 7.998 replik** bulunuyor.
- Fiziksel etkileşim, sayaç, uyku/şekerleme, selamlaşma/dönüş ve masaüstü geri dönüş havuzları genişletildi.
- Exact duplicate, placeholder ve approved-count kontrolleri otomatikleştirildi.
- Mevcut repliklerdeki `e` / `fx` metadata yapıları korunuyor.

## Veri güvenliği
- 4.3.1 verileri korunur: notlar, işler, arşivler, moodboard, istatistikler, rozetler, temalar ve ayarlar.
- Arıcılık kaydı: `%APPDATA%\Nero\bee.json`.
- Genel Nero yedeği Arıcılık verisini de içerir.
- Arıcılık içe aktarma ve oyun sıfırlama işlemlerinde mevcut çiftlik önce ayrı bir güvenlik yedeğine alınır.
- Uygulama kimliği değişmedi: `com.stenwick.nero`.

## Doğrulama
- **60/60 Node regression testi** başarılı.
- Diyalog master/runtime doğrulaması başarılı.
- Electron header hit-test başarılı.
- Electron panel drag/minimize-restore smoke testi başarılı.
- Electron Arıcılık/Three.js pencere smoke testi başarılı.
- Windows x64 NSIS **Nero-Setup-5.0.0.exe** build'i başarılı.
