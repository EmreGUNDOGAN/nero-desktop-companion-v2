# Nero 6.3.7 — Tema Sistemi Düzeltmesi

## Neden bu patch çıktı?

6.3.6'daki yeni program temaları panelin mevcut layout sistemine fazla müdahale ediyordu. Bu nedenle bazı temalarda menü ve kart geometrisi değişiyor, görseller kocaman ve anlamsız biçimde kırpılıyor ve en önemlisi pencere boyutlandırma tutamaçlarının `position:absolute` davranışı bozulabiliyordu.

## Düzeltilenler

- Yeni temaların **panel düzenine müdahale etmesi tamamen kaldırıldı**.
- Menülerin sırası, konumu, yüksekliği ve boşlukları yeniden temel Nero paneliyle aynı.
- Kartların grid/flex/position yapısı tema CSS'i tarafından artık değiştirilemiyor.
- Sol ve sağ alt boyutlandırma tutamaçları tekrar mutlak konumda ve tıklanabilir; pencere büyütme/küçültme geri geldi.
- 6.3.6'da kullanılan tek dev arka plan katmanı ve `.shell > * { position: relative; ... }` yaklaşımı kaldırıldı.

## Temalar baştan ele alındı

12 yeni tema korunuyor ancak artık her biri gerçekten kendi görsel dünyasına sahip, açıkça tanınabilir **vektör sahneleri** kullanıyor. Her tema için ana ekran, sayaç ve çalışma/ayar ekranlarına ayrı SVG sahnesi hazırlandı.

- **Gece Treni:** gece kompartımanı, büyük tren penceresi, ay, yıldızlar, valiz, okuma lambası ve bilet.
- **Analog Radyo:** retro radyo, frekans ölçeği, kaset, plak ve analog ses çizgileri.
- **Sonbahar Kütüphanesi:** kitap rafı, yağmurlu pencere, masa lambası ve sonbahar yaprakları.
- **Amalfi Limonları:** Akdeniz penceresi, mavi seramik dili, limon dalları ve balkon detayları.
- **Ortancalı Kır Evi:** kır evi, mavi ortancalar, bahçe ve porselen hissi.
- **Kış Tramvayı:** ahşap/bordo tramvay içi, kar pencereleri, oturma alanı ve sıcak lambalar.
- **90'lar Kırtasiye:** çizgili defter, pastel not kâğıtları, kaset ve fosforlu kalemler.
- **Eski Fotoğrafçı:** analog kamera, film şeridi, kontakt baskı ve negatifler.
- **Lavanta Akşamı:** gün batımı, veranda, lavanta sapları ve fener.
- **Kış Bahçesi:** cam sera, kar, kış bitkileri ve sıcak fener.
- **Gece Masası:** gece penceresi, ay, masa lambası, defter ve çalışma masası.
- **Pastel Mutfak:** pastel fayans, tartı, karıştırma kabı, tarif kartı ve kavanoz.

Bu görseller layout'un üstüne oturan etkileşimli katmanlar değil; panelin normal arka plan sisteminde çalışıyor. Böylece görünüm değişirken davranış değişmiyor.

## Rozetler

- Rozet sistemi, ikonlar, boyutlar ve yerleşim **değişmedi**.
- Yalnızca rozet dairesinin arka plan rengi temaya uyarlanıyor.
- 90'lar Kırtasiye'de mevcut rozet dairesi pastel tema renkleri arasında dönüşüyor.

## Regresyon koruması

- Tema CSS'inin `.tabs`, `.card` veya temel panel geometrisine margin/padding/position/display/grid/flex müdahalesi yapmadığını otomatik test kontrol ediyor.
- Boyutlandırma tutamaçlarının `position:absolute` kaldığı ayrıca test ediliyor.
- 12 temanın her birinde ana ekran, sayaç ve çalışma görünümü için vektör sahne assetlerinin varlığı doğrulanıyor.
