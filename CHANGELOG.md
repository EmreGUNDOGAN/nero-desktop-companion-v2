# Nero'da neler değişti?

Her sürümde eklenenler, değişenler ve düzeltilenler burada. En yeni sürüm en üstte.

## 4.3.1: Header tıklanabilirliği ve yardım ikonları

### Düzeltildi
- **Ayarlar / Sabitle / Küçült / Kapat kontrollerinin tıklanamaması giderildi.** Tüm header alanını draggable yapan yapı kaldırıldı; bunun yerine pencere kontrolleriyle fiziksel olarak çakışmayan ayrı bir drag zone kullanılıyor.
- Header artık açık biçimde `no-drag`; yalnız güvenli sol üst şerit sürüklenebilir. Böylece Windows paketli uygulamada drag bölgesinin kontrol butonlarının mouse hit-area’sını yutması engellendi.
- Window controls katmanı bağımsız `no-drag` / pointer-events alanı olarak güçlendirildi ve tema dekorasyonlarının üstünde tutuldu.
- Düzeltme Latte, Pazartesi, Gece, Disket, Kasaba, Yağmur, Kar, Çilekli Piknik, Mum Işığı ve Ege Yazı temalarının tamamında doğrulandı.

### UI polish
- Ana sayfadaki büyük ve border’lı `?` yardım butonları kaldırıldı.
- Yardım işareti artık **18 × 18 px hit-area içinde yaklaşık 12 px**, küçük ve bordersız bir mikro işaret olarak görünüyor.
- `?` başlığın hemen sağında ve hafif sağ-üst hizasında konumlanıyor; ayrı bir buton/kutu gibi görünmüyor.
- Varsayılan arka plan tamamen transparent; hover / focus / açık durumda yalnız renk ve çok hafif hareketle belirginleşiyor.
- Tooltip maksimum genişliği, padding’i ve font boyutu küçültülerek daha hafif website tipi yardım balonuna dönüştürüldü.
- Çilekli Piknik, Mum Işığı ve Ege Yazı gibi resimli temalarda yardım işaretinin kart border’larıyla görsel olarak çakışması giderildi.
- Pazartesi, Disket ve Kasaba’da tema karakteri korunurken eski ağır tooltip/buton görünümü sadeleştirildi.

### Teknik ve test
- Header smoke testi 5 tema yerine **10 temanın tamamını** kapsayacak şekilde genişletildi.
- Test artık drag zone ile window controls geometrisinin fiziksel olarak kesişmediğini, header’ın `no-drag`, özel alanın `drag` olduğunu ve dört pencere kontrolüne native click ulaştığını doğruluyor.
- Cross-theme panel testi yardım ikonlarının computed style’da border’sız, transparent ve küçük kaldığını doğruluyor.
- Tooltip’lerin kompakt ölçüde kaldığı ve panel dışına taşmadığı kontrol ediliyor.
- **39/39 Node regression testi başarılı.**
- **10/10 tema gerçek Electron header hit-test başarılı.**
- **10/10 tema cross-theme panel/help smoke testi başarılı.**
- Gerçek Electron ekran görüntüleriyle görsel QA gerçekleştirildi.

## 4.3.0: İş kronometresi, moodboard geçmişi ve ana sayfa yardım sistemi

### Yeni
- **İş bazlı kronometre:** her aktif iş için başlat / duraklat / devam et kontrolü eklendi. Süre birikimli tutuluyor ve uygulama normal şekilde kapanırken çalışan görev kronometresi güvenle duraklatılıyor.
- **Planlanan süre:** iş eklerken dakika bazında isteğe bağlı planlanan süre girilebiliyor. Preset zorunluluğu yok; 65, 120 veya 185 dakika gibi değerler destekleniyor.
- **Plan / Gerçek süre takibi:** tamamlanan ve arşivlenen işlerde planlanan süre ile gerçek çalışma süresi korunuyor ve gösteriliyor.
- **Moodboard geçmişi:** Benim Moodboard’um başlığındaki geçmiş/takvim kontrolü yalnız gerçekten veri bulunan ayları ve yılları listeliyor.
- **Moodboard ay navigasyonu:** önceki / sonraki kontroller yalnız veri bulunan aylara geçiyor; geçmiş görünümden güncel aya dönmek için “Bugün” kontrolü eklendi.
- **Bağlamsal yardım:** Bu hafta odak, Şimdiye kadar, Masa köşen, Haftalık mektup, Moodboard, Kavanoz ve Bu ay yaptıkların bölümlerine küçük tema uyumlu yardım ikonları eklendi.
- **“Şimdiye kadar” için güvenli yeni başlangıç:** karttaki reset kontrolü yalnız görünen istatistik başlangıç noktasını yeniliyor. İşler, notlar, rozetler, moodboard geçmişi ve lifetime sayaçlar silinmiyor.

### Değişti
- İş kronometresi çalışırken iş tamamlanırsa kronometre otomatik duruyor ve geçen süre ayrıca onay istemeden kaydediliyor.
- Tamamlanan iş yeniden açılırsa eski gerçek süre korunuyor; yeni çalışma süresi mevcut toplamın üzerine ekleniyor.
- Aynı anda yalnız bir görev kronometresi çalışıyor. Genel Nero odak sayacı ile görev kronometresi üst üste bindirilmiyor; odak süresinin iki kez sayılması engelleniyor.
- Görev kronometresi odak toplamlarına katkı yapıyor fakat normal timer tamamlanma / yarıda bırakma sayaçlarını ve timer achievement serilerini yapay biçimde tetiklemiyor.
- Moodboard 7 sütunlu gerçek takvim akışına geçirildi; ayın ilk günü doğru haftalık kolondan başlıyor ve 28 / 29 / 30 / 31 günlük aylar otomatik destekleniyor.
- Geçmiş moodboard ayları salt okunur açılıyor; hem kullanıcı moodboard’u hem Nero moodboard’u aynı aya birlikte geçiyor.
- Moodboard alanındaki gereksiz dikey boşluk azaltıldı; boş günlerin görsel ağırlığı düşürüldü ve dar panelde 7 sütun korunuyor.
- “Şimdiye kadar” resetinden sonra Biten iş, Toplam odak, Tamamlanan sayaç, Yarıda bırakılan, Alınan not, En uzun seri ve Nero’yu sevdin değerleri yeni başlangıç noktasından sayılıyor.
- Reset sonrası görünen “En uzun seri” lifetime best streak’ten bağımsız tutuluyor; lifetime achievement ve ilerleme verileri değişmiyor.
- Yardım tooltip’leri hover, klavye focus ve tıklama/tap ile açılıyor; ESC veya dışarı tıklama ile kapanıyor.
- Nero konuşma kartındaki tema ikonları çok satırlı metin bloğuna göre dikey ortalanıyor. Kasaba temasının özel gazete yerleşimi korunuyor.

### Düzeltildi
- **Ayarlar / Sabitle / Küçült / Kapat tıklanabilirliği:** başlık kontrol grubu draggable header alanının dışına taşındı ve bağımsız no-drag hit-area olarak yapılandırıldı. Özellikle Kar, Yağmur, Çilekli Piknik, Mum Işığı ve Ege Yazı temalarında native click hit-test sorunu kalıcı olarak giderildi.
- İş ekleme satırında süre alanının iç içe kutu gibi görünmesine yol açan ortak input selector’ı kaldırıldı; süre ve hatırlatma kontrolleri tek parça kompakt yüzeylere dönüştürüldü.
- Beklenmedik kapanıştan kalan görev kronometresi başlangıç zamanı, uygulama yeniden açıldığında çevrimdışı geçen süreyi çalışma süresine eklemeyecek şekilde temizleniyor.
- Moodboard geçmiş menüsüne boş ayların, boş yılların veya gelecek tarihli kayıtların girmesi engellendi.
- Nero konuşma kartı ikonlarının ilk satıra yapışık görünmesi düzeltildi.

### Tema uyumu
- İş süresi / kronometre kontrolleri, moodboard geçmiş seçici, yardım ikonları, tooltip’ler ve güvenli reset modalı **Latte, Pazartesi, Gece, Disket, Kasaba, Yağmur, Kar, Çilekli Piknik, Mum Işığı ve Ege Yazı** temalarının görsel diline ayrı kurallarla uyarlandı.
- Disket temasının kare/pixel yaklaşımı, Kasaba’nın gazete/kağıt düzeni ve resimli temaların glass/çerçeve dili korunuyor.

### Veri güvenliği ve geriye uyumluluk
- 4.2.x stats verisi yeni `displayBaseline` alanı olmadan açıldığında mevcut lifetime toplamları aynen korunuyor.
- Eski todo kayıtları yeni timing alanları olmadan da güvenli biçimde normalize ediliyor. Yeni alanlar: `plannedDurationMin`, `actualDurationMs`, `stopwatchStartedAt`, `focusCreditedMin`.
- Eski kullanıcı moodboard günleri veri dönüşümü gerektirmeden yeni dinamik ay modelinde okunuyor.
- “Şimdiye kadar” reseti fiziksel veri silmez; yalnız ayrı bir display baseline snapshot’ı oluşturur.
- Mevcut günlük yedek, dışa aktarma ve iki aşamalı kurulum/kaldırma veri güvenliği davranışları korunuyor.

### Teknik ve test
- Görev kronometresi için ayrı, test edilebilir timing yardımcı katmanı eklendi.
- Moodboard geçmişi için yalnız veri bulunan ayları döndüren ortak `dataMonths()` yardımcı fonksiyonu eklendi.
- Güvenli stats reseti için `displayBaseline` modeli ve IPC akışı eklendi.
- 4.2.x → 4.3.0 migration/regression testleri eklendi.
- **39/39 Node regression testi başarılı.**
- Gerçek Electron header native hit-test smoke testi başarılı.
- Gerçek Electron moodboard Chromium `capturePage()` → PNG smoke testi başarılı.
- 10 temanın tamamında cross-theme panel entegrasyon smoke testi başarılı; renderer console error bulunmadı.
- Eski assisted NSIS setup ayarları, Türkçe kurulum dili ve installer assetleri paketleme öncesinde doğrulandı.

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
- **Resimli ve hava temalarında istatistik kartlarının içerik hizası yeniden düzenlendi:** sayı ve açıklamalar Kasaba temasındaki temiz iki satırlı yerleşime yaklaştırıldı; tema ikonları solda korunarak dikey merkez ve okunabilirlik iyileştirildi.
- **Kışta Huzur başlığındaki Ayarlar / Sabitle / Küçült / Kapat düğmelerinin tıklanmaması düzeltildi.** Başlık kontrolleri artık dekor katmanlarından bağımsız, yüksek öncelikli bir `no-drag` hit-area içinde çalışıyor. Aynı koruma Yağmur, Çilekli Piknik, Mum Işığı ve Ege Yazı temalarına da uygulandı.
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
