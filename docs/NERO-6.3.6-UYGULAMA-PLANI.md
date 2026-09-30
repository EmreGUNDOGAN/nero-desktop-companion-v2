# Nero 6.3.6 — Uygulama Planı

Temel: **6.3.5**

## Arıcılık düzeltmeleri

1. **Mevsim ikonunda flicker**
   - `#season-ico` yalnızca `ui-v2.js` tarafından yönetilecek.
   - `bee.js` mevsim ikonuna emoji yazmayacak.
   - SVG yalnız mevsim gerçekten değiştiğinde güncellenecek.

2. **Nero konuşma animasyonu**
   - Arıcılık Nero'sunun `talk` sınıfı yalnız konuşma balonu görünürken aktif kalacak.
   - Balon kapanınca aynı callback içinde `talk` kaldırılacak.
   - Yeni konuşma önceki timerı güvenli biçimde iptal edecek.

3. **Alt uyarı ünlemi**
   - Yalnız ünlem SVG rengi değişecek.
   - Soft kırmızı palet: ana `#D96F67`, koyu `#8E4A45`, alt vurgu `#B85B55`.
   - Kart, boyut, konum ve diğer ikonlar değişmeyecek.

4. **Saatlik üretim hover açıklaması**
   - Kovan panelindeki saatlik üretimin üzerine gelince “Üretim Etkileri” tooltip'i açılacak.
   - Sadece o anda aktif etkiler gösterilecek.
   - Buff satırları soft yeşil, debuff satırları soft kırmızı olacak.
   - Değerler backendde kullanılan gerçek üretim çarpanlarından üretilecek; hard-code edilmiş sahte oran kullanılmayacak.
   - Hava, ırk, hastalık, odak, vitamin, çiçek besini, altın kupa, geçici kovan boostu, çiçek/yerleşim bonusları, hikâye/kalıcı üretim bonusları, mevsim uyumu ve kış üretim etkisi kapsanacak.

5. **Hasat Et rengi**
   - Alt menü Hasat Et vurgusu soft yeşil olacak.
   - Ana: `#A8C88A`, hover: `#96BA76`, gölge/koyu: `#789B60`.
   - Koyu kahverengi yazı/ikon korunacak.

6. **Kıştan bir gün önce Windows uyarısı**
   - Sonbaharın 15. günü / kışa 1 oyun günü kala kontrol yapılacak.
   - En az bir kovanda hiç şurup yoksa tek Windows bildirimi gönderilecek.
   - Kaç kovan eksik olursa olsun aynı kış için yalnız bir bildirim.
   - Uygulama yeniden açılınca tekrar etmemeli; yıl/mevsim anahtarı save'de tutulmalı.
   - Sonraki yıl yeniden çalışmalı.
   - Arıcılık bildirim tercihleri ve ses ayarlarıyla uyumlu olmalı.

## Yeni program temaları

Yeni temalar mevcut Nero panel yapısını korur. Tema, sadece renk değiştirmek değil; kendi görsel kimliği olan ayrı bir art-direction setidir.

### Ortak kural
- Mevcut sayfa yerleşimleri ve işlevler korunur.
- Tema dekoru yalnız kendi konseptine ait öğelerden oluşur; rastgele “cozy” kahve/çörek/kitap vb. doldurulmaz.
- Kontrollü 2D çizim dili, sınırlı palet ve okunaklı UI kullanılır.
- Fotoğraf/3D/AI-render hissi veren arka planlar kullanılmaz.
- Rozet şekli, ikonu, yerleşimi ve mevcut sistem **değişmez**.
- Rozetlerde yalnız `.badge-icon` arka plan/fill rengi temaya uyarlanır.
- 90'lar Kırtasiye dışında rozet SVG arka planı tema başına **tek renk** kullanır.
- 90'lar Kırtasiye rozet arka planları pastel tema paletinden deterministik farklı renkler alabilir; rozet yapısı yine aynıdır.
- Tema karakter assetleri default Nero katmanlarını kullanır; bu çalışma panel/program görünümünü değiştirir.

### Kilitlenen temalar

1. **Sonbahar Kütüphanesi**
   - krem, kestane, kiremit, soluk zeytin
   - çizilmiş kitap rafı, yağmurlu pencere, sıcak masa lambası, sonbahar yaprakları
   - rozet arka planı: soft sıcak kahverengi

2. **Amalfi Limonları**
   - kobalt mavi, limon sarısı, beyaz, terracotta
   - Akdeniz balkon/seramik/limon görsel dili
   - rozet arka planı: tek soft Akdeniz mavisi

3. **Ortancalı Kır Evi**
   - toz mavi, krem, beyaz, adaçayı
   - ortanca, beyaz kır evi, porselen, hafif sahil/bahçe
   - rozet arka planı: soft dusty blue

4. **Kış Tramvayı**
   - bordo, krem, sıcak amber, koyu yeşil
   - sıcak ahşap tramvay içi + dışarıda kar
   - rozet arka planı: tek muted bordo

5. **90'lar Kırtasiye**
   - pastel pembe, mint, lila, açık mavi, yumuşak sarı
   - spiral defter, mekanik kalem, kaset, washi tape, ataş, kalem kutusu, post-it
   - rozet sistemi default; yalnız arka planlar pastel tema renklerinden farklı tonlar alabilir

6. **Gece Treni**
   - lacivert, bordo, krem, soluk pembe, hardal
   - sıcak çizilmiş kompartıman, gece penceresi, bilet, valiz, okuma lambası
   - rozet arka planı: tek muted gece mavisi/bordo tonu

7. **Eski Fotoğrafçı**
   - sepya/krem, koyu yeşil, terracotta, analog siyah
   - yalnız analog fotoğraf dünyası: film rulosu, kontakt baskı, lens kapağı, pozometre, negatif şerit, instant fotoğraf
   - kahve/çörek/rastgele kitap gibi konsept dışı dekor yok
   - rozet arka planı: tek sepya-kahve tonu

8. **Lavanta Akşamı**
   - lavanta, kırık beyaz, soluk pembe, sıcak mor, akşam mavisi
   - veranda, lavanta, fener, gün batımından geceye geçiş
   - rozet arka planı: tek soft lavanta

9. **Kış Bahçesi**
   - koyu yeşil, krem, buz mavisi, sıcak amber
   - cam sera, kış bitkileri, kar, fener ışığı
   - rozet arka planı: tek muted yeşil

10. **Gece Masası**
    - ana vurgu `#2F456B`, koyu `#1F2F4D`, orta `#5E7396`, soft `#A9B6C9`, krem `#F7F2EA`, amber `#E6B56F`
    - gerçek gece çalışma masası hissi; kahverengi ana renk olmayacak
    - rozet arka planı: tek soft gece mavisi

11. **Analog Radyo**
    - hardal, koyu yeşil, krem, sıcak kahve
    - radyo, kaset, plak, frekans çizgileri, kulaklık ve analog ses ekipmanı
    - rozet arka planı: tek muted analog yeşil/kahve tonu

12. **Pastel Mutfak**
    - mint, krem, pudra, açık sarı
    - mutfak konseptine ait objeler: tartı, karıştırma kabı, kavanoz, tarif kartı, mutfak tekstili
    - tema dışı rastgele dekor kullanılmayacak
    - rozet sistemi default; yalnız arka plan rengi tema yeşiline uyarlanacak

## Sürüm
- Uygulama sürümü: **6.3.6**
- Branch: `feature/bee-v6.3.6`
- Build sonunda GitHub Actions final bundle ve Actions run bağlantısı verilecek.
