# Nero'da neler değişti?

Her sürümde eklenenler, değişenler ve düzeltilenler burada. En yeni sürüm en üstte.

## 4.2.0: Arşivler, çift moodboard ve arayüz iyileştirmeleri

### Yeni
- **İş arşivi:** tamamlanan işler artık kullanıcı tarafından manuel olarak arşivlenebiliyor. Arşivlenen işler ana listeden ayrılıyor, ay ay gruplanıyor ve istenirse yeniden aktif listeye alınabiliyor.
- **Not arşivi:** notlar silinmeden arşivlenebiliyor. Arşivler aylık accordion yapısında tutuluyor ve notlar tek tıkla geri alınabiliyor.
- **Benim Moodboard’um:** her takvim günü için yeşil, sarı veya kırmızı ruh hali seçilebilen yeni kişisel moodboard eklendi. Ayın gerçek gün sayısı kullanılıyor; gelecek günler seçilemiyor.
- **Nero’nun Moodboard’u:** Nero’nun mevcut otomatik happiness günlüğü yeni aylık moodboard tasarımına taşındı ve kullanıcı moodboard’undan ayrı tutuldu.
- **Aylık Moodboard PNG arşivi:** kapanan ayların kullanıcı + Nero moodboard’u tek görselde saklanabiliyor. PNG üretimi Electron/Chromium `capturePage()` akışıyla güvenilir biçimde oluşturuluyor.
- **Tema uyumlu Ayarlar dişlisi:** Ayarlar ana sekme çubuğundan çıkarıldı ve panelin sağ üstünde, pin düğmesinin soluna taşındı. Dişli tüm temalarda o temanın görsel diline uyum sağlıyor.

### Değişti
- Ana navigasyon artık daha sade: **Bugün, Notlar, İşler, Zaman ve Rozetler** olmak üzere beş ana sekmeden oluşuyor.
- **“Bu ay yaptıkların”** alanı ilk 5 tamamlanan işi doğrudan gösteriyor; daha eski işler açılır bölümde tutuluyor. En yeni tamamlanan iş her zaman en üstte.
- İşler sayfasındaki eski **“Bitenleri temizle”** davranışı veri silmek yerine tamamlanan işleri arşivlemeye yönlendirildi.
- Eski **“Son 30 gün”** mood noktaları kaldırıldı; yerine takvim ayına bağlı iki ayrı moodboard geldi.
- Arşiv, moodboard ve yeni Ayarlar kontrolü tüm mevcut temalarda özel stil kurallarıyla uyumlu hale getirildi.

### Düzeltildi
- Tüm temalarda ana sayfa istatistik kartlarının gereksiz büyük görünmesine neden olan ortak yükseklik çakışmaları giderildi.
- Disket, Kasaba, Yağmur, Kar, Çilekli Piknik, Mum Işığı ve Ege Yazı temalarında istatistik kartlarının ve “Bu hafta odak” alanının aşırı büyümesine neden olan override kuralları düzeltildi.
- Moodboard aylık PNG üretiminde güvenilir olmayan SVG → image dönüşüm yolu kaldırıldı; gerçek Chromium render/capture akışına geçirildi.
- Ana sayfa konuşma kartına tıklanınca yazının kaybolup kartın boş kalması engellendi.

### Rozetler ve başarımlar
- **125 achievement** sistemi korunuyor.
- Rozetler **Yaygın, Sıradışı, Nadir ve Efsanevi** sekmelerine ayrılıyor; Gizli sekmesi yalnızca keşfedilmiş gizli başarımlar varsa görünür.
- Tamamlanan achievement rozetlerinde hover ile görevin tamamlanmış açıklaması gösteriliyor.
- Achievement tamamlandığında Nero tepkisine ek olarak Windows bildirimi de destekleniyor.

### Home Dialogue
- **665 Home Dialogue repliği** ve bağlama duyarlı konuşma motoru korunuyor.
- Replikler doğal kullanımda rastgele **5–10 dakika** aralığında otomatik değişiyor.
- Son 20 replik, rare/ultra-rare görünürlük durumu ve kategori cooldownları kalıcı olarak saklanıyor.
- Aktif odak seansında Home replik rotasyonu erteleniyor.

### Veri güvenliği
- Güncelleme mevcut notları, işleri, arşivleri, moodboard kayıtlarını, ayarları, istatistikleri ve rozetleri koruyacak şekilde devam ediyor.
- Eski not ve görev verileri `archivedAt` alanı olmasa da aktif kayıt olarak kabul ediliyor; geriye dönük uyumluluk korunuyor.
- Moodboard geçmişi JSON olarak saklanmaya devam ediyor; PNG dışa aktarma geçmiş veriyi silmiyor.
- Kurulum ve kaldırma sırasında mevcut iki aşamalı veri güvenliği davranışı korunuyor.

### Teknik
- Yeni moodboard yardımcıları ve Chromium tabanlı PNG görüntüleme katmanı eklendi.
- Arşivleme için yeni IPC akışları ve renderer durumları eklendi.
- Ay bazlı arşiv gruplama, kullanıcı mood seçimi, gerçek ay uzunluğu, Home ilk-5 görünümü, Ayarlar dişlisi ve tema uyumu için regression testleri eklendi.
- Kaynak bütünlüğü, 125 achievement dağılımı, 665 Home repliği, tema istatistik düzeni ve gerçek Electron PNG üretimi otomatik testlerle doğrulandı.

## 4.1.0: Ana sayfa konuşma motoru

### Yeni
- **665 yeni ana sayfa Nero repliği:** günlük düşünceler, roast, motivasyon, şefkat, piksel/masaüstü mizahı, üretkenlik bağlamı, saate göre konuşmalar, ilişki süresi, nadir sözler ve uzun aradan dönüş cümleleri.
- **Bağlama duyarlı Home Dialogue Engine:** görev, odak, seri, timer geçmişi, günün saati, Nero ile geçirilen süre, ruh hali ve geri dönüş süresini tek snapshot üzerinden değerlendirir.
- **Nadir replik güvenliği:** rare/ultra-rare sözler kullanıcı Home ekranında gerçekten görmeden tüketilmiş sayılmaz ve bekleyen nadir replik durumu kalıcı saklanır.
- **Kalıcı tekrar önleme:** son 20 ana sayfa repliği uygulama yeniden başlatılsa da hatırlanır.
- **Konu cooldownları ve kategori dengesi:** Nero'nun arka arkaya sürekli aynı istatistiği veya aynı tür cümleyi söylemesi engellenir.
- **Gelişmiş koşullar:** son 7 gün/önceki 7 gün karşılaştırmaları ve son timer sonuçları gibi trend tabanlı replikler desteklenir.

### Düzeltildi
- **Tüm temalarda ana sayfa istatistik alanı yeniden sıkılaştırıldı:** dört günlük istatistik kartı gereksiz dikey boşluk bırakmıyor.
- **“Bu hafta odak” grafiği kompaktlaştırıldı;** grafik alanı paneli gereksiz yere uzatmıyor.
- Disket, Kasaba, Yağmur, Kar, Çilekli Piknik, Mum Işığı ve Ege Yazı temalarının özel istatistik stilleri ortak boyut kurallarıyla çakışmayacak şekilde düzenlendi.
- Hava/resimli temalardaki sonradan gelen CSS override artık kartları tekrar `110px` yüksekliğe zorlamıyor.

### Değişti
- Ana sayfadaki Nero repliği artık **rastgele 5–10 dakikada bir**, panel açık olmasa da normal kullanım sırasında arka planda değişir.
- Ana sayfayı açmak/kapatmak veya sekme değiştirmek artık yeni replik üretmez.
- **↻ konuşma yenileme butonu kaldırıldı;** replikler manuel olarak spamlanamaz.
- Aktif odak seansında Home replik rotasyonu ertelenir; seans sonrasında doğal bir 1–3 dakikalık gecikmeyle devam eder.
- Ana sayfadaki konuşma kartı yanlışlıkla boş kalmasın diye tıklayarak gizleme davranışı kaldırıldı; replikler yalnız 5–10 dakikalık doğal döngüyle değişir.
- Ana sayfa replik geçişine yumuşak fade eklendi.
- Günlük timer istatistikleri artık tamamlanan/yarıda bırakılan sayaç sayılarını da saklar.

### Teknik
- Yeni `src/data/home-dialogues.tr.json` veri dosyası ve `src/main/home-dialogue.js` motoru eklendi.
- Home replik sistemi mevcut `Dialogue` / masaüstü konuşma balonu sisteminden bağımsız tutuldu.
- Veri doğrulama, placeholder kontrolü, saat sınırı kontrolü, fallback ve debug desteği eklendi.
- Ana sayfa konuşma motoru için otomatik test paketi eklendi.

## 4.0.4: Ege Yazı teması, duygu günlüğü, masa köşen, hızlı yakalama

### Yeni
- **Ege Yazı teması:** kullanıcının kendi görselleriyle hazırlandı. Üç tam sahne (Bugün, Notlar/Ayarlar, Sayaç), limon dalı ve begonvil başlık süsleri, güneş simgesi, kutucuk ikonları, köşede uyuyan kedi, kitap yığını, limonata bardağı. Hafif bir güneş parıltısı animasyonu var.
- **Günün ritüeli:** Nero her sabah "Bugün nasıl bir gün olsun?" diye soruyor (Sakin / Üretken / Kendime iyi davranacağım). Seçim gün boyu tonunu ve davranışını etkiliyor.
- **"Bugünlük yeter" modu:** günün işleri bitince panel sakin bir ekrana dönüyor, Nero günü özetliyor. "İyi geceler" ya da "Yine de devam et" seçilebiliyor. Sağ tık menüsünden de başlatılabiliyor.
- **Duygu günlüğü:** son 30 günün ruh hali Bugün sayfasında küçük renkli noktalar olarak görünüyor.
- **Küçük başarı arşivi:** tamamlanan işler artık bir yere kaydediliyor; "Bu ay yaptıkların" kutusunda görülebiliyor.
- **Kavanoz:** tek cümlelik güzel anlar bırakılabiliyor; Nero bazen birini geri getiriyor.
- **Haftalık mektup:** her hafta ilk açılışta Nero'dan o haftayı özetleyen bir mektup.
- **Masa köşen:** toplam odak saatine göre 10 obje birikiyor (fincan, defter, saksı, kitaplar, lamba, çerçeve, plak, saat, çiçek, radyo).
- **Nero'nun kendi ruh hali:** arada bir kendi durumu oluyor (uykulu / huysuz / enerjik), hiçbir işlevi engellemiyor.
- **Nadir olaylar:** ortalama her 20-30 etkileşimde bir, çok kısa bir sürpriz mesaj.
- **Yaşayan temalar:** Mum Işığı'nda ışık titriyor, Çilekli Piknik'te ince parıltılar süzülüyor. Hepsi için isteğe bağlı, tamamen sentezlenmiş ortam sesi (yağmur, rüzgar, mum çıtırtısı, hafif çan sesi) eklendi — varsayılan kapalı.
- **Hızlı yakalama:** Ayarlar'dan açılırsa Ctrl+Alt+Boşluk ile küçük bir pencere açılıp hızlıca iş ya da not eklenebiliyor — varsayılan kapalı.
- **Rozetler kendi sekmesinde**, kilitli olanların adı ve nasıl açılacağı artık görünüyor; ilk 20'den sonrası "daha fazla göster" ile açılıyor.
- **Masaüstünde hep görünür kal** ayarı: "masaüstünü göster" düğmesine basılsa bile Nero kaybolmuyor. Görev çubuğundaki simgeye tıklayınca artık Nero da geliyor.

### Düzeltildi
- Yenile tuşunun yazının üstüne binmesi.
- Günlük istatistik kutucuklarının hizası.
- Not kartlarındaki başlıkların tek satırda kesilmesi; artık iki satır.
- Güncelleme hata mesajı artık gerçek sebebi gösteriyor.


### Yeni
- **Çilekli Piknik teması:** senin hazırladığın görsellerle. Panelin arkasında sekmeye göre değişen sahneler (piknik çayırı, teras, deniz manzarası), pötikareli başlık, kart görselli kutucuklar ve notlar, çilek ve papatya ikonları.
- **Mum Işığı teması:** yine senin görsellerinle. Örgü battaniyeli oda, gece şehri ve mumlu masa sahneleri, sıcak turuncu vurgular.
- **Rozetler kendi sekmesinde:** ilk 20 rozet görünüyor, kalanı "Kalan X rozeti göster" ile açılıyor.
- **Kilitli rozetlerin adı ve şartı artık görünüyor;** sadece simgesi "?" olarak kalıyor.
- **Masaüstünde hep görünür kal** ayarı: açıkken "masaüstünü göster" düğmesine basılsa bile Nero kayboluyorsa geri geliyor. Ayarlar > Sistem'den kapatılabilir.
- **Arka plan resmi** ayarı: resimli temalarda sahne kapatılabiliyor.

### Düzeltildi
- Görev çubuğundaki Nero simgesine tıklayınca sadece panel geliyordu; artık Nero da geliyor.
- Not kartlarındaki başlıklar tek satıra sığmayınca kesiliyordu; artık iki satır görünüyor.
- Güncelleme hatası mesajı: dosya doğrulanamadığında artık "internet bağlantını kontrol et" yerine sebebi yazıyor (yayındaki kurulum dosyası ile latest.yml'ın farklı sürümlerden olması).
- Sekmeler altıya çıktığı için dar panelde taşıyordu; artık sığıyor.

## 4.0.2: Yağmur ve kar temaları, hata düzeltmeleri

### Yeni
- **Yağmurda Huzur teması:** başlıkta gerçekten yağan yağmur ve sarmaşık, konuşma balonunun yanında uyuyan kedi, köşede bantlı not, yağmurlu şehir manzaralı haftalık grafik, yağmurlu camda notlar ve lambalı, kupalı, kitaplı bir pencere sahnesinde sayaç.
- **Kışta Huzur teması:** başlıkta savrularak yağan kar, karlı çamlar ve kulübe, ekose minderde uyuyan kedi, karlı dağ ve göl manzarası, buğulu camda notlar ve mumlu, kar küreli, kitaplı bir kış sahnesinde sayaç.
- **Hava efektleri** ayarı: yağmur ve kar animasyonu Ayarlar > Davranış'tan kapatılabiliyor.

### Düzeltildi
- Nero sürüklenirken ya da sallanırken panelin yavaş yavaş kayıp Nero'nun altına ya da üstüne girmesi düzeltildi. Panelin yeri artık her seferinde baştan hesaplanıyor; kayma birikmiyor. Ekranın kenarına gelince panel Nero'nun diğer tarafına geçiyor.
- "Her zaman üstte" kapalıyken panelin yine de diğer pencerelerin üstünde kalması düzeltildi. Panel artık Nero ile aynı kurala uyuyor. Sabitle düğmesi sadece panelin Nero'ya tıklayınca kapanmamasını sağlıyor.
- Panelin içeriği kısa olduğunda alt kısmın boş kalması düzeltildi.

## 4.0.1: Yeni kurulum ekranı, güvenli veri sayfası

### Yeni
- **Yeni kurulum ekranı:** yumuşak renkli, Nero'lu karşılama ve bitiş sayfaları; kurulum tamamen Türkçe.

### Düzeltildi
- **Tüm temalarda ana sayfa istatistik alanı yeniden sıkılaştırıldı:** dört günlük istatistik kartı gereksiz dikey boşluk bırakmıyor.
- **“Bu hafta odak” grafiği kompaktlaştırıldı;** grafik alanı paneli gereksiz yere uzatmıyor.
- Disket, Kasaba, Yağmur, Kar, Çilekli Piknik, Mum Işığı ve Ege Yazı temalarının özel istatistik stilleri ortak boyut kurallarıyla çakışmayacak şekilde düzenlendi.
- Hava/resimli temalardaki sonradan gelen CSS override artık kartları tekrar `110px` yüksekliğe zorlamıyor.

### Değişti
- **Veriler artık yanlışlıkla silinemez.** Kurulumdaki "Temiz kurulum?" sorusu kaldırıldı. Eski veri varsa ayrı bir "Verilerin" sayfası çıkıyor: her şeyin korunacağını söylüyor ve varsayılan olarak hiçbir şey seçili değil. Sıfırlamak için "Tüm verilerimi sil" kutucuğunu işaretlemek, ardından çıkan uyarıya ayrıca "Evet" demek gerekiyor (uyarının varsayılan cevabı "Hayır"). O zaman bile veriler `%APPDATA%\Nero-yedek` klasörüne taşınıyor.
- Kaldırırken verileri silmek için de artık iki ayrı soruya "Evet" demek gerekiyor.

### Düzeltildi
- Otomatik güncelleme doğru repoya (nero-desktop-companion-v2) bakıyor.

## 4.0.0: Güncellemeler, hatırlatıcılar ve rozetler

### Yeni
- **Otomatik güncelleme:** Nero açılışta ve 4 saatte bir GitHub'da yeni sürüm olup olmadığına bakıyor, varsa arka planda indiriyor ve sana soruyor: "Şimdi güncelle", "Kapatınca kur" ya da "Şimdi değil". Sormadan asla kurmuyor; notların ve ayarların korunuyor. Ayarlar > Güncellemeler'den kapatılabilir ya da elle denetlenebilir.
- **Hatırlatıcılar:** bir işe saat eklenebiliyor (eklerken ya da sonradan, işin üstüne gelince çıkan saat simgesinden). Zamanı gelince Nero hatırlatıyor, Windows bildirimi de geliyor.
- **Su ve mola hatırlatmaları:** Ayarlar > Hatırlatmalar'dan su (45 dakika - 2 saat arası) ve kesintisiz çalışma sonrası mola hatırlatması açılabiliyor. Sadece bilgisayar başındayken sayılıyor.
- **Rozetler:** 31 rozet. İş, odak, seri, not ve Nero'yla ilgili başarımlar ("Liste avcısı", "Maraton", "Gece kuşu", "Casus avcısı"...). Kazanınca Nero kutluyor; koleksiyon Bugün sayfasında.
- **Gün sonu özeti:** akşam 7'den sonra Nero günü özetliyor.
- **Özel günler ve kıyafetler:** doğum gününde (Ayarlar'dan gün ve ay seçilir) parti şapkası ve kutlama, 15 Aralık - 15 Şubat arası atkı, yılbaşı ve tanışma yıl dönümü mesajları.
- **Yedekleme:** her gün otomatik yedek (son 7 gün). Ayarlar > Yedekler'den dışa aktarma ve yedekten geri yükleme; geri yüklemeden önce mevcut hal ayrıca yedekleniyor.

## 3.9.2: Gece külahı düzeltmesi

### Düzeltildi
- **Tüm temalarda ana sayfa istatistik alanı yeniden sıkılaştırıldı:** dört günlük istatistik kartı gereksiz dikey boşluk bırakmıyor.
- **“Bu hafta odak” grafiği kompaktlaştırıldı;** grafik alanı paneli gereksiz yere uzatmıyor.
- Disket, Kasaba, Yağmur, Kar, Çilekli Piknik, Mum Işığı ve Ege Yazı temalarının özel istatistik stilleri ortak boyut kurallarıyla çakışmayacak şekilde düzenlendi.
- Hava/resimli temalardaki sonradan gelen CSS override artık kartları tekrar `110px` yüksekliğe zorlamıyor.

### Değişti
- Gece külahındaki alna yapışık beyaz bant kaldırıldı. Külah artık doğrudan başın üstüne oturuyor ve çizgileri pijamanın çizgileriyle aynı yönde.

## 3.9.1: Sürüm etiketi

### Yeni
- Panelin sağ alt köşesinde kullanılan sürüm yazıyor (ör. v3.9.1). Tepsi simgesinin üstüne gelince de görünüyor.

## 3.9.0: Daha güzel pijama, güvenli güncelleme

### Düzeltildi
- **Tüm temalarda ana sayfa istatistik alanı yeniden sıkılaştırıldı:** dört günlük istatistik kartı gereksiz dikey boşluk bırakmıyor.
- **“Bu hafta odak” grafiği kompaktlaştırıldı;** grafik alanı paneli gereksiz yere uzatmıyor.
- Disket, Kasaba, Yağmur, Kar, Çilekli Piknik, Mum Işığı ve Ege Yazı temalarının özel istatistik stilleri ortak boyut kurallarıyla çakışmayacak şekilde düzenlendi.
- Hava/resimli temalardaki sonradan gelen CSS override artık kartları tekrar `110px` yüksekliğe zorlamıyor.

### Değişti
- Pijama baştan çizildi: yüzü kapatmayan, ağzın altından başlayan çizgili üst, küçük yaka, çizgili kollar ve başın tepesinden yana sarkan, ponponlu bir gece külahı.
- "Zzz" uyku efekti külahla çakışmasın diye başın sol üstüne taşındı.
- Kestirmeler: gündüz 2-4 saatte bir ve kısa (4-9 dakika); akşam 9'dan sonra 12-35 dakikada bir ve daha uzun (10-25 dakika).

### Düzeltildi
- **Güncellemede veriler artık asla silinmiyor.** Kurulumdaki sıfırlama sorusunun varsayılan cevabı "Hayır"; Enter'a basmak hiçbir şeyi silmez. Sıfırlamak için iki kez onay gerekiyor ve o zaman bile veriler silinmiyor, `%APPDATA%\Nero-yedek` klasörüne taşınıyor.
- Kaldırma sırasında "verilerim de silinsin mi" sorusunun varsayılan cevabı da "Hayır" oldu.

## 3.8.1: Antivirüs düzeltmesi

### Düzeltildi
- Kaspersky gibi antivirüslerin Nero'yu "trojan" sanmasına sebep olabilecek iki özellik tamamen kaldırıldı:
  - Masaüstü şakası için öndeki pencereyi sürekli okuyan kod (başka pencereleri izlemek casus yazılım davranışına benziyordu).
  - 3.7.0'da eklenen, her yerde çalışan klavye kısayolları.
- Nero artık hiçbir yerel kütüphane (native modül) içermiyor.

### Düzeltildi
- **Tüm temalarda ana sayfa istatistik alanı yeniden sıkılaştırıldı:** dört günlük istatistik kartı gereksiz dikey boşluk bırakmıyor.
- **“Bu hafta odak” grafiği kompaktlaştırıldı;** grafik alanı paneli gereksiz yere uzatmıyor.
- Disket, Kasaba, Yağmur, Kar, Çilekli Piknik, Mum Işığı ve Ege Yazı temalarının özel istatistik stilleri ortak boyut kurallarıyla çakışmayacak şekilde düzenlendi.
- Hava/resimli temalardaki sonradan gelen CSS override artık kartları tekrar `110px` yüksekliğe zorlamıyor.

### Değişti
- Masaüstü şakası yerine **geri dönüş şakası** geldi: fare 20 dakikadan uzun süre Nero'dan uzakta kaldıktan sonra yanına gelince Nero seni yakalıyor. Sadece fare konumu kullanılıyor.

## 3.8.0: Pijama ve kestirmeler

### Yeni
- **Pijama:** bilgisayarın saatiyle akşam 9'dan sabah 6'ya kadar Nero pijamasını ve gece külahını giyiyor. Giyerken ve sabah çıkarırken bir şey söylüyor.
- **Kestirmeler:** Nero arada bir kendi kendine uyukluyor, horluyor, uykusunda sayıklıyor. Gece daha sık ve daha uzun uyuyor.
- **Uyandırılınca:** tıklarsan huysuzlanıyor (ilk tık paneli açmaz, sadece uyandırır), sürüklersen kızıyor, seversen mırıldanarak uyanıyor, sayaç biterse yerinden fırlıyor.
- **Uyku sersemliği:** uyandıktan sonra bir buçuk dakika boyunca cevapları uyku sersemi ("Evet evet... ne?... evet.").
- Temalara yeni `outfit` (kıyafet) katmanı eklendi; tema rehberinde anlatılıyor.

## 3.7.0: Sürpriz ziyaretler

### Yeni
- **Sürpriz ziyaretler:** Nero arada bir ekranın ortasında "Bö!" diye belirip ya da ekranın kenarından kafasını uzatıp laf atıyor, sonra yerine dönüyor. O sırada ona tıklarsan "yakalanıyor". Ayarlar > Davranış'tan kapatılabilir.
- **Kaçış kısayolları:** Nero takılsa bile Ctrl + Alt + N paneli açıp kapatır, Ctrl + Alt + Shift + Q programı hemen kapatır.
- **Hata günlüğü:** bir sorun olursa %APPDATA%\Nero\nero.log dosyasına yazılıyor.

### Düzeltildi
- **Tüm temalarda ana sayfa istatistik alanı yeniden sıkılaştırıldı:** dört günlük istatistik kartı gereksiz dikey boşluk bırakmıyor.
- **“Bu hafta odak” grafiği kompaktlaştırıldı;** grafik alanı paneli gereksiz yere uzatmıyor.
- Disket, Kasaba, Yağmur, Kar, Çilekli Piknik, Mum Işığı ve Ege Yazı temalarının özel istatistik stilleri ortak boyut kurallarıyla çakışmayacak şekilde düzenlendi.
- Hava/resimli temalardaki sonradan gelen CSS override artık kartları tekrar `110px` yüksekliğe zorlamıyor.

### Değişti
- Süre rozeti artık sadece sayaç çalışırken ya da duraklatılmışken görünüyor.

### Düzeltildi
- Nero hızlı taşınınca süre rozetinin eski yerinde görüntüsü kalması düzeltildi.

## 3.6.1: Güvenlik düzeltmesi

### Düzeltildi
- Bazı antivirüs programları (ör. Kaspersky) kurulumdan sonra Nero'yu yanlışlıkla "trojan" olarak işaretliyordu. Sebebi, masaüstü şakası için arka planda çalıştırılan gizli bir PowerShell betiğiydi. Bu betik tamamen kaldırıldı; Nero artık hangi pencerenin önde olduğunu doğrudan Windows'tan okuyor ve hiçbir harici komut çalıştırmıyor.

## 3.6.0: Yeni temalar

### Yeni
- **Gece Yarısı teması:** koyu lacivert zemin, ay sarısı ve lavanta vurgular, yıldızlı başlık, keyif arttıkça dolunaya dönen ay göstergesi, üstü parlayan not kartları. Gece çalışırken gözü yormaz.
- **Disket Günleri teması:** 90'lar bilgisayarı havası. NERO.EXE başlık çubuğu, yeşil yazılı komut satırında ruh hali, piksel blok keyif çubuğu, dosya gibi notlar, yükleme çubuklu yapılacaklar, dijital saat ekranlı sayaç.
- **Kasaba Günlüğü teması:** küçük kasaba gazetesi havası. Manşet başlık, "SON DAKİKA" ruh hali, keyif endeksi, Nero'nun köşe yazısı, kütüphane kartı notlar, kafe sipariş fişi yapılacaklar, mutfak saati sayaç.

## 3.5.0: Nero'nun kişiliği

### Yeni
- Nero artık 300'ün üzerinde farklı cümle biliyor. Tıklama, iş ekleme, iş bitirme, sayaç ve sürükleme tepkileri çok daha çeşitli.
- Daha huysuz, daha alaycı: seni bol bol roast ediyor.
- Ayarlar > Nero'ya adını yazarsan bazı lafları doğrudan sana söylüyor.
- Arada günün sözlerinden birini söyleyip kendi yorumunu ekliyor.
- İstatistiklerini laf arasında kullanıyor ("Sayacı 9 kere yarıda bıraktın. Unutmadım.").
- **Sevme:** fareyi Nero'nun üstünde sağa sola gezdir ya da sağ tık > "Nero'yu sev". Kızarıyor, kalp çıkıyor. Abartırsan kızıyor.
- **Sallama:** sürüklerken sallarsan kızıyor. Çok uzun gezdirirsen başı dönüyor, midesi bulanıyor.
- **Masaüstü şakası:** başka bir pencereden masaüstüne dönünce Nero seni yakalayıp bir şey söylüyor. Ayarlar > Davranış'tan kapatılabilir.
- Ana sayfadaki istatistiklere "Nero'yu sevdin" sayacı eklendi.

## 3.4.0: Ana sayfa ve esnek panel

### Yeni
- **Bugün sayfası:** panel artık bununla açılıyor. Adınla selamlama, Nero'nun duruma göre laf sokması, bugün biten işler, odak süresi, günlük seri, kaç gündür birlikte olduğunuz, haftalık odak grafiği, toplam istatistikler, günün sözü ve hızlı düğmeler var.
- **Boyutlandırma:** panelin alt köşelerinden sürükleyerek büyütülüp küçültülebiliyor. Genişletince sayfalar iki sütuna geçiyor. Boyut kaydediliyor.
- **Sabitle düğmesi:** sabitlenen panel hep üstte ve açık kalıyor, program yeniden açılınca da geri geliyor.

## 3.3.0: Düzeltmeler ve küçük eklemeler

### Yeni
- Karakterin altındaki süre rozetinden sayaç başlatılıp duraklatılabiliyor.
- **Yerinde sabit dur:** açıkken Nero yanlışlıkla sürüklenmiyor (Ayarlar ve sağ tık menüsü).
- Panele küçült düğmesi eklendi; küçültülen panel görev çubuğunda kalıyor.
- Bir işi bitirince kısa bir ses çalıyor.

### Düzeltildi
- Nero kapatılıp açıldıktan sonra panelin onunla birlikte hareket etmemesi düzeltildi. Panel ve Nero artık iki yönde de birlikte hareket ediyor.
- Sayaç duraklatılınca Nero bazen hiç konuşmuyordu; artık her seferinde tepki veriyor.

## 3.2.0: İki yeni tema

### Yeni
- **Tarçınlı Latte:** krem ve karamel tonları, pötikare şerit, ataşlı tarif kartları, spiralli bloknot, dolan kahve fincanı.
- **Pazartesi Sendromu:** çizgi roman havası, huysuzluk ölçer, raptiyeli notlar, "OLDU BU İŞ" damgaları, erteleme çubuğu.
- Temalar Ayarlar > Tema'dan değiştiriliyor. Konuşma balonu ve süre rozeti de temaya uyuyor.

## 3.1.0: Yeni görünüm

### Düzeltildi
- **Tüm temalarda ana sayfa istatistik alanı yeniden sıkılaştırıldı:** dört günlük istatistik kartı gereksiz dikey boşluk bırakmıyor.
- **“Bu hafta odak” grafiği kompaktlaştırıldı;** grafik alanı paneli gereksiz yere uzatmıyor.
- Disket, Kasaba, Yağmur, Kar, Çilekli Piknik, Mum Işığı ve Ege Yazı temalarının özel istatistik stilleri ortak boyut kurallarıyla çakışmayacak şekilde düzenlendi.
- Hava/resimli temalardaki sonradan gelen CSS override artık kartları tekrar `110px` yüksekliğe zorlamıyor.

### Değişti
- Panel baştan tasarlandı: yumuşak renkler, yuvarlak köşeler, yapışkan not kartları, el yazısı detaylar.
- Yazı tipleri programın içine gömüldü, internet gerekmiyor.

## 3.0.0: Sıfırdan yeni Nero

### Yeni
- Masaüstünde yaşayan, fareyi gözleriyle takip eden, göz kırpan, konuşan karakter.
- Zamanla değişen ruh hali: ilgilenilmezse sıkılıyor, küsüyor, yalnız hissediyor. Bilgisayardan uzaklaşınca uyuyor.
- Notlar, yapılacaklar ve zamanlayıcı.
- Tema sistemi: karakter görselleri ve renkler dışarıdan eklenebiliyor.
- Kurulum programı: eski sürümü kaldırıp temiz kurulum seçeneği sunuyor.
