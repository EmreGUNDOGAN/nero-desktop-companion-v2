# Nero'da neler değişti?

Her sürümde eklenenler, değişenler ve düzeltilenler burada. En yeni sürüm en üstte.

# Nero 6.5.0 — Merkezi Depo ve Fiziksel Atölye

## 📦 Merkezi Depo
- Haritadaki mevcut **Depo binası artık tıklanabilir** ve çiftliğin merkezi envanter panelini açar.
- Depo 5 sekmeye ayrıldı: **Bal · Arıcılık · Tohumlar · Dekorlar · Ürünler**.
- Yalnızca **bal**, mevcut kg depo kapasitesini kullanır.
- Bal sekmesi tür bazlı stokla birlikte kabul edilmiş siparişlere ayrılmış ve serbest miktarı gösterir.
- Arıcılık sekmesi Balmumu, Polen, Propolis ve Arı Sütü stoklarını gram olarak gösterir.
- Tohumlar sekmesi satın alınan ve hediye edilen bütün tohumları tek stokta tutar; ekim bu stoktan tüketir.
- Dekorlar sekmesi satın alınan dekorları saklar. Mağazadan alınan dekor artık doğrudan yerleştirme moduna geçmez; önce Depo'ya gider.
- Haritadan kaldırılan dekor artık yarı fiyat iadesi vermez; **Depo'ya geri döner**.
- Ürünler sekmesi Mumları ve Arıcılık Atölyesi'nin tamamladığı işlenmiş ürünleri gösterir. Kovan ürünleri buradan uygulanır, ticari ürünler buradan satılır.
- Pazar ekranından merkezi Depo'ya geçiş eklendi.

## 🔨 Fiziksel Arıcılık Atölyesi
- Kullanıcının seçtiği çiftlik yanındaki **-1,2** karesi artık kalıcı Atölye alanıdır.
- Atölye binası oyunun başından itibaren haritada görünür.
- Bu kare satın alınamaz ve üzerine kovan, tarh veya dekor yerleştirilemez.
- Eski bir kayıtta bu kare kullanılmışsa oyuncunun içeriği kaybolmadan en yakın uygun boş alana taşınır.
- Atölye kilitliyken bina daha sakin/kapalı görünür ve tıklandığında **Mumcu köye gelince açılacağı** mevcut panelde gösterilir.
- Mumcu geldikten sonra aynı bina aktif hale gelir; pencereler/işlik detayları ve baca dumanıyla canlanır.
- Atölye tamamladığı ürünleri artık kullanıcıya **Depo → Ürünler** üzerinden sunar.

## 🛒 Seyyah Yakup
- Yakup'un aradığı bal için standart alım fiyatı artık **pazar fiyatının +%15'i**.
- Backend fiyat katsayısı ve ekrandaki açıklama aynı değere bağlandı.
- Seyyah Satış Fişi'nin ayrıca verdiği **+%10** ek ödeme korunur.

## 🌱 Mağaza ve envanter akışı
- Mağazadan alınan tohumlar Depo stokuna gider; haritaya ekim yalnız stoktan yapılır.
- Hediye tohumlar aynı Depo stoğunda görünür.
- Mağazadan alınan dekorlar Depo stokuna gider ve yalnız **Depo → Dekorlar → Yerleştir** yoluyla haritaya çıkar.


# Nero 6.4.1 — Depoda Arıcılık Malzemeleri

- Depo paneline yeni **Arıcılık Malzemeleri** kartı eklendi.
- Hasatla Atölye deposuna taşınan **Polen, Propolis ve Arı Sütü** artık Depo ekranında sürekli görülebilir.
- Değerler gram cinsinden ve ondalıklı olarak gösterilir.
- Bu malzemelerin normal bal deposu kapasitesini kullanmadığı açıkça belirtilir.
- Depo açıkken malzeme miktarı değişirse ekran yeniden render edilir.


# Nero 6.4.0 — Yan Ürünler ve Arıcılık Atölyesi

Bu paket, konuşup onayladığımız üç ana maddeyi tek sürümde toplar.

## 1. Kış pazar dengesi
- Normal balın kış mevsimi fiyat çarpanı **+%35'ten +%15'e** indirildi.
- Günlük pazar dalgalanması, festival ve diğer mevcut fiyat etkileri aynen devam eder.
- Mumun kendi kış fiyat davranışı bu değişiklikten bağımsız kalır.

## 2. Gerçek yan ürün sistemi
- Kovanlar artık bal üretirken üç gerçek yan ürün biriktirir: **Polen, Propolis ve Arı Sütü**.
- Yan ürün miktarı hasat tıklamasına göre değil, gerçekten üretilen bal miktarına göre oluşur.
- **Polen** aktif çiçeklerden ve biyoçeşitlilikten etkilenir; yüksek biyoçeşitlilik artırır, monokültür azaltır.
- **Propolis** için kovanın sağlıklı ve en az 8 arılı olması gerekir; güçlü koloniler biraz daha fazla üretir.
- **Arı Sütü** için kovanın sağlıklı, en az 12 arılı ve en az bir kraliçe yükseltmesine sahip olması gerekir.
- Yan ürünler kovanda birikir; bal hasat edildiğinde hasat oranı kadar yan ürün de Atölye deposuna taşınır.
- Kovan → **Yan Ürün** sekmesi artık sahte/placeholder veri değil; gerçek miktar, üretim potansiyeli, oran ve nedeni gösterir.

## 3. Arıcılık Atölyesi
- **Mumcu (30. yerleşimci):** Atölye I açılır; premium bal kavanozları ve mum üretimi.
- **Eczane (44):** Atölye II; Propolis Kalkanı ve Propolis Merhemi.
- **Arıcılar Derneği (53):** Atölye III; aynı anda 2 üretim, daha uzun kuyruk, Polen Keki, Özel Polen Karışımı ve Arı Sütü Kürü.
- **Köy Serası (73):** Aromalı Bal Kavanozu açılır.
- **Bal Müzesi (78):** Bal Hediye Seti açılır.
- Atölye üretimleri **oyun zamanı** ile ilerler; oyun durdurulursa atölye de durur.
- Tarifler gerçek malzeme tüketir; eksik malzeme varsa üretim başlatılamaz.
- Kovana uygulanan ürünler mevcut oyun etkilerine bağlanır.
- Ticari işlenmiş ürünler atölye envanterinde tutulur ve sabit işlenmiş ürün fiyatıyla satılabilir.
- Atölyeye Depo/Pazar ekranından ve ilgili köy yapılarından ulaşılabilir.

## Korunan sistemler
- Mevcut bal üretimi, siparişler, Seyyah Yakup, turnuva, kovan kapasitesi ve çiçek ekosistemi sistemi korunur.
- Yakup'un mevcut özel ürünleri kaldırılmaz; Atölye aynı etkilerin oyuncu tarafından üretilebilen yolunu ekler.


# Nero 6.3.16 — Çiçek Ekosistemi ve Kovan Paneli

## Çiçek Ekosistemi
- Kovan menzilindeki aktif çiçek dağılımı artık gerçek bir ekosistem hesabına sahip.
- 2 dengeli tür +%4, 3+ dengeli tür +%8 bal üretimi sağlar.
- En az 5 tarhın %80+ aynı tür olması monokültür baskısı yaratır; doğal hastalık riski göreli %5 artar.
- Biyoçeşitlilik bonusu gerçek üretim formülüne ve üretim buff/debuff listesine bağlandı.
- Tarh popup'ı hangi kovanların ekosistemine katkı verdiğini gösterir.
- Yüksek biyoçeşitlilikli tarhlarda hafif görsel canlılık / tozlaştırıcı ambient detayı eklenir.

## Kovan Paneli
- Mevcut tasarım korunarak 5 sekmeli yapı eklendi: Genel, Ekosistem, Yan Ürün, Üretim, Ayrıntılar.
- Ekosistem sekmesinde tür dağılımı, baskın tür, gerçek üretim bonusu ve monokültür durumu açıklanır.
- Üretim sekmesinde saatlik üretim ile gerçek buff/debuff listesi sürekli görünür.
- Ayrıntılar sekmesi kraliçe, ırk, kapasite, erzak ve sağlık durumunu toplar.
- Yan Ürün sekmesi ileride gelecek Polen / Propolis / Arı Sütü sistemi için açıkça işaretlenmiş yer tutucudur; sahte değer göstermez.


# Nero 6.3.15 — Arıcılık Denge ve QoL Paketi

## Turnuva ve ekonomi
- Turnuva katılımı 12–14. oyun günlerine taşındı; 15. gün başvuru kapanır.
- 12, 13 ve 14. günlerde katılınmadıysa katılım ekranı günde bir kez otomatik açılır.
- Turnuva ödülleri 1./2./3. için 300 / 200 / 100 🪙 olarak dengelendi.
- İki günlük pazar festivali fiyat bonusu %50’den %15’e düşürüldü.
- Bal hasadından gelen balmumu 25 g/kg’dan 12,5 g/kg’a düşürüldü.
- Nero odak üretim bonusu %25’ten %10’a düşürüldü.
- Nero yapılacaklar ödülü +10 🪙 olarak kalır; günlük en fazla 5 iş (50 🪙) ödül verir.

## Arılar
- Anadolu ve Kafkas doğal üremesi 4 günde 1, İtalyan doğal üremesi 2 günde 1 oldu.
- Polen Keki bu aralıkları yarıya indirir.
- Dolu kovanda doğal veya Arı Sütü kaynaklı doğum artık sayı ve bildirim üretmez.

## Pazar QoL
- “Siparişleri bırak” satışı kabul edilmiş siparişlerin bal ihtiyacını otomatik ayırır ve yalnız fazlayı satar.
- Pazar fiyatının üzerine gelince gerçek fiyat hesabındaki buff/debuff’lar gösterilir.
- Festival, mevsim, günlük pazar, köy/hikâye etkileri ve Pazar Mührü açıklanır.

## Arayüz ve Moodboard
- Sol alttaki ünlem yalnız aktif uyarı olduğunda soft kırmızı olur.
- Nero’nun günlük Moodboard sonucu 23:00’te tek kez kesinleşir; gün içindeki ilgi ve ruh hâli gün boyu hesaba katılır.
- Nero 23:00’te kapalıysa bir önceki günün birikmiş verisi sonraki açılışta finalize edilir.


# Nero 6.3.14 — Tam Kenar Boyutlandırma ve Ayarlar Kaydırma

## Panel
- Panel boyutlandırması pencerenin çevresindeki mevcut şeffaf/gölgeli Windows kenarından yapılmaya devam eder.
- Eski yalnızca alt köşelerde çalışan özel resize grip'leri gizlendi; böylece tek boyutlandırma alanı tüm pencere çevresi oldu.
- Ayarlar sayfasında kaybolan dikey kaydırma geri getirildi.
- Görünüm, Davranış, Hatırlatmalar, Güncellemeler, Yedekler, Hızlı yakalama, Sistem ve Nero kartları artık pencere yüksekliğine sığmadığında diğer sayfalar gibi aşağı kaydırılabilir.
- 6.3.12'de düzeltilen kart yüksekliği/gap davranışı korunur; kartlar tekrar sıkışmaz veya içerikleri kesilmez.


# Nero 6.3.13 — Pencere Boyutlandırma ve Changelog Tekrarı

## Panel
- Nero paneli tekrar Windows pencere kenarlarından ve mevcut alt köşe tutamaçlarından boyutlandırılabilir.
- Frameless pencereye gerçek min/max boyut sınırları eklendi: 380×540 ile 960×1100.
- Alt köşe resize alanları büyütüldü ve tema katmanlarının üstünde kalmaları garanti edildi.
- Native kenar boyutlandırmasıyla seçilen son panel ölçüsü de kaydedilir.

## Arıcılık
- Sürüm yenilikleri penceresinin oyun çalışırken tekrar tekrar açılması düzeltildi.
- GitHub Releases kontrolü otomatik olarak oturum başına yalnız bir kez başlatılır.
- Otomatik changelog ekranda gösterildiği anda görüldü olarak işaretlenir; dışarı tıklayarak kapatmak da tekrar açılmasına neden olmaz.
- Rehberden manuel “Sürüm Yenilikleri” açma davranışı korunur.


# Nero 6.3.12 — Ayarlar Kartı Yerleşim Düzeltmesi

## Panel
- Ayarlar ekranında Görünüm, Davranış, Hatırlatmalar, Güncellemeler, Sistem ve Nero kartlarının alt satırlarının kesilmesine neden olan grid küçülmesi düzeltildi.
- Geniş panelde ayar kartları artık içerik yüksekliğini koruyor; satırlar kart sınırının altına sıkışmıyor.
- Kartlar arasındaki yatay ve dikey boşluk yeniden 14 px olarak sabitlendi.
- Çilekli Piknik dahil görsel temalardaki `overflow: hidden` kart stili korunuyor; yalnız kartın kendisinin yanlış küçülmesi engelleniyor.
- Diğer arayüz, Arıcılık ve sürüm notu davranışlarına dokunulmadı.


# Nero 6.3.11 — Uyarı Merkezi, Resmî Sürüm Notları ve Panel Yerleşimi

## Arıcılık
- Sol alttaki kırmızı ünlem düğmesi artık aktif uyarı olmasa bile görünür; boş durumda “Şu an aktif uyarı yok” bilgisini açar.
- Uyarı olduğunda hasta kovan, solmuş tarh ve dolu depo hedeflerine gitme davranışı aynen korunur.
- Oyun içi Nero'nun 2.4 saniyelik konuşma balonu süresi korunur; masaüstü Nero etkilenmez.

## Sürüm yenilikleri
- Oyun içindeki “Sürüm Yenilikleri” listesi artık statik CHANGELOG verisi kullanmaz.
- Veriler doğrudan GitHub Releases API üzerinden, repository'nin yayımlanmış Releases sayfasından alınır.
- GitHub Releases sayfasında bulunmayan geliştirme sürümleri oyunda gösterilmez.
- Her sürüm için kendi GitHub release bağlantısı ve ayrıca tıklanabilir “Tam inceleme listesi” bağlantısı bulunur.

## Panel
- 6.3.10 sırasında bozulan kart, bölüm ve ayar ekranı boşlukları 6.3.9'daki çalışan panel yerleşimine geri döndürüldü.
- Deneysel tema klasörleri geri getirilmedi; yalnız panelin yerleşim/gap davranışı eski çalışan haline alındı.


# Nero 6.3.10 — Tema Deneylerini Geri Alma ve Arıcılık İnce Ayarı

## Program temaları
- 6.3.6–6.3.9 sırasında birlikte eklediğimiz deneysel 12 program teması tamamen geri alındı.
- Sonbahar Kütüphanesi, Amalfi Limonları, Ortancalı Kır Evi, Kış Tramvayı, 90'lar Kırtasiye, Gece Treni, Eski Fotoğrafçı, Lavanta Akşamı, Kış Bahçesi, Gece Masası, Analog Radyo ve Pastel Mutfak kaldırıldı.
- Panelin tema/skin kodu 6.3.5'teki çalışan haline döndürüldü.
- Mevcut eski temalar ve diğer program özellikleri korunuyor.
- Arıcılık tarafındaki 6.3.6 sonrası ekonomi, kış, üretim tooltip'i, bildirim ve diğer oyun düzeltmeleri geri alınmadı.

## Arıcılık Nero
- Yalnızca oyun içindeki sağ alt Nero'nun konuşma balonu süresi 4.8 saniyeden 2.4 saniyeye indirildi.
- Balon kapanınca konuşma ağız animasyonunun durması korunuyor.
- Masaüstündeki ana Nero'nun konuşma süresine dokunulmadı.

## Uyarı merkezi
- Sol alttaki ünlem işareti daha uyumlu, yumuşak bir kırmızıya geçirildi.
- Uyarı kartı, konumu ve davranışı değişmedi.


# Nero 6.3.9 — 90'lar Kırtasiye PNG Tema Testi

- 90'lar Kırtasiye artık basit SVG çizimleri yerine gerçek PNG tema assetlerini kullanıyor.
- Bugün, Notlar, İşler, Sayaç ve Rozetler için ayrı PNG arka planları eklendi.
- Başlık alanı ayrı PNG asset olarak bağlandı.
- Kalem kutusu, kalemler, washi bant, binder clip, ataç, çiçek, yıldız, sticky note ve defter PNG assetleri temada kullanılıyor.
- Mevcut Nero sekme sırası, grid yapısı ve pencere resize davranışı değiştirilmedi.
- Rozetler klasik Nero sisteminde kaldı; yalnız mevcut daire arka plan renkleri pastel palete uyarlandı.
- Bu patch yalnız 90'lar Kırtasiye temasını doğrulamak için hazırlandı; diğer temalara dokunulmadı.


# Nero 6.3.9 — 90'lar Kırtasiye PNG Asset Denemesi

Bu patch yalnızca **90'lar Kırtasiye** temasını düzeltmek için hazırlandı.

- Basitleştirilmiş SVG kırtasiye çizimleri aktif temadan çıkarıldı.
- Ayrı **PNG assetleri** kullanılıyor: şeffaf pembe kalemlik, pastel kalem seti, washi bant, yıldız, çiçek, sticky ve spiral not kağıdı.
- Çizgili ve kareli **PNG arka plan dokuları** ile pembe gingham başlık zemini eklendi.
- Bugün / Notlar / İşler / Sayaç / Rozetler için dekor yerleşimleri ayrı.
- Tek büyük cover sahnesi yok; orta içerik alanları boş bırakılıyor.
- Menü düzeni, resize davranışı ve klasik rozet sistemi korunuyor.
- Diğer yeni temalara bu patchte dokunulmadı.

Sürüm: **6.3.9**
Branch: `feature/bee-v6.3.9`


# Nero 6.3.9 — 90'lar Kırtasiye PNG Tema Onarımı

## 90'lar Kırtasiye
- Tema artık basit SVG temsilleri yerine **gerçek PNG asset setini** kullanıyor.
- Bugün, Notlar, İşler, Sayaç ve Rozetler için ayrı PNG arka planlar eklendi.
- Üst başlık alanı ayrı PNG asset olarak bağlandı.
- Şeffaf pembe kalem kutusu, pastel kalemler, washi bantlar, binder clip, ataç, çiçek, yıldız, sticky note ve spiral not defteri assetleri eklendi.
- Bugün kartlarında gerçek PNG kırtasiye objeleri kullanılıyor.
- Haftalık odak alanında PNG washi dekoru var.
- Notlar beş farklı pastel spiral defter PNG kartıyla gösteriliyor.
- Yeni Not kartında gerçek spiral not defteri PNG'si kullanılıyor.

## Korunanlar
- Menü sırası ve ana Nero panel layout'u değişmedi.
- Resize tutamaçlarına dokunulmadı.
- Rozetlerin mevcut ikon/SVG/ölçü sistemi değişmedi; yalnız daire arka plan renkleri tema paletine uyarlandı.
- Arıcılık tarafındaki 6.3.5–6.3.8 düzeltmeleri korunuyor.

## Sürüm
- Nero **6.3.9**
- Branch: `feature/bee-v6.3.9`


# Nero 6.3.8 — 90'lar Kırtasiye Asset Testi

Bu patchte yalnızca **90'lar Kırtasiye** program teması yeniden ele alındı. Diğer yeni temalara dokunulmadı.

## Yeni tema mimarisi

- Tema artık tek büyük `background-size: cover` sahnesi kullanmıyor.
- Kalem kutusu, kalemler, washi bantlar, ataçlar, stickerlar, kaset, spiral ve sticky note ayrı ayrı gerçek asset dosyaları.
- Assetler CSS'te kendi ölçüleriyle ve kendi konumlarıyla kompoze ediliyor.
- Pencere büyüyüp küçüldüğünde objeler tek bir dev resim gibi kesilmiyor veya anlamsız biçimde büyümüyor.
- Ana ekran, sayaç ve çalışma ekranlarında aynı asset seti farklı kompozisyonlarla kullanılıyor.

## Görsel dil

- Pastel pembe, mint, lila, açık mavi ve sarı palet.
- Defter çizgileri / kareli kağıt hissi.
- Dört ana istatistik kartı ayrı pastel kırtasiye kartları.
- Tema başlığı ayrı gingham asset.
- Ana kart ikonları ayrı SVG assetleri.

## Rozetler

- Mevcut rozet sistemi, ikonlar, SVG'ler, ölçüler ve yerleşim korunuyor.
- Yalnız klasik dairesel rozet arka planı 90'lar Kırtasiye pastel paletinde dönüşümlü renklendiriliyor.

## Güvenlik

- Resize tutamaçları yine `position:absolute` ve etkileşimli.
- Sekme sırası ve temel Nero HTML düzeni değiştirilmedi.
- Tema için yeni regresyon testleri eklendi.


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


# Nero 6.3.6 — Tema Koleksiyonu ve Arıcılık İnce Ayarları

## Arıcılık düzeltmeleri

- Sonbahar mevsim ikonundaki sürekli emoji/SVG geçişi kaldırıldı; mevsim ikonunu artık yalnızca UI2 yönetiyor.
- Arıcılık ekranındaki Nero'nun konuşma animasyonu, konuşma balonu kapandığı anda duruyor.
- Sol alttaki uyarı ünlemi, kart tasarımına dokunmadan daha yumuşak kırmızı tona geçirildi.
- Alt menüdeki **Hasat Et** vurgusu soft yeşil palete taşındı.

## Üretim etkileri

- Kovan panelindeki saatlik üretimin üzerine gelince **Üretim Etkileri** açıklaması açılıyor.
- Tooltip yalnızca gerçekten aktif üretim etkilerini gösteriyor ve değerleri canlı üretim formülüyle aynı backend kaynaklarından alıyor.
- Hava, arı ırkı, hastalık, odak bonusu, vitamin, çiçek besini, turnuva bonusu, kovan boostu, tarh/çeşme bonusları, köy-hikâye etkileri, mevsim uyumu ve kış üretim çarpanları destekleniyor.
- Buff'lar soft yeşil, debuff'lar soft kırmızı gösteriliyor.

## Kış hazırlık bildirimi

- Sonbaharın son oyun gününde, yani kışa bir gün kala herhangi bir kovanda hiç şurup yoksa Windows bildirimi geliyor.
- Aynı kış için yalnızca bir bildirim gönderiliyor ve bu bilgi save'e yazıldığı için uygulama yeniden açılınca tekrar etmiyor.
- Sonraki oyun yılında yeniden çalışıyor ve arıcılık kış bildirimi/ses tercihlerine uyuyor.

## 12 yeni program teması

Nero'nun mevcut program düzeni korunarak, yalnızca renk değişimi olmayan 12 ayrı görsel dünya eklendi:

- **Sonbahar Kütüphanesi**
- **Amalfi Limonları**
- **Ortancalı Kır Evi**
- **Kış Tramvayı**
- **90'lar Kırtasiye**
- **Gece Treni**
- **Eski Fotoğrafçı**
- **Lavanta Akşamı**
- **Kış Bahçesi**
- **Gece Masası**
- **Analog Radyo**
- **Pastel Mutfak**

Yeni temalarda foto-gerçekçi/AI-raster arka plan kullanılmıyor. Arka plan ve tema işaretleri kontrollü SVG çizimlerden oluşuyor; her tema kendi objelerini, paletini ve küçük UI karakterini taşıyor.

### Rozet kuralı

- Rozetlerin mevcut şekli, ikonları, sıralaması ve davranışı değiştirilmedi.
- Tema değişiminde yalnızca rozet dairesinin arka plan rengi uyarlanıyor.
- **90'lar Kırtasiye** temasında aynı mevcut rozet sistemi korunurken daireler tema paletindeki pastel tonlar arasında dönüşümlü renklendiriliyor.
- Diğer yeni temalarda rozet arka planı tema başına tek renktir.

## Teknik

- Sürüm **6.3.6**.
- Yeni tema klasörleri mevcut kanonik Nero karakter katmanlarını yeniden kullanıyor; karakter anatomisi veya ifadeleri yeniden tasarlanmıyor.
- Arıcılık düzeltmeleri ve tema kuralları için yeni otomatik regresyon testleri eklendi.


# Nero 6.3.5 — Dört Mevsim ve Arıcılık Dengesi

## Arı ekonomisi

- 5. arının alış fiyatı **60 jeton** olarak değiştirildi.
- Sonraki her arının fiyatı bir önceki sıraya göre **%15 artar** ve tam jetona yuvarlanır.
- Fiyat geçmiş satın alma sayısına değil, kovandaki mevcut arı sayısına bağlı kalır; arı ölür veya satılırsa sonraki alış fiyatı geri düşer.
- Arı satış fiyatı ilgili sıranın alış fiyatının **%50'si** olarak korunur.

## Kış ve Seyyah Yakup

- Kış kaynaklı arı kaybı artık oyuncu kovanlarını **4 arının altına düşüremez**. Hastalık sistemindeki 4 arı tabanıyla aynı güvenli sınır kullanılır.
- Seyyah Yakup'un aradığı bal için verdiği fiyat bonusu **pazarın %40 üstünden %20 üstüne** indirildi.

## Arıcılık ekranı

- Sağ alttaki eski/statik Nero kaldırıldı. Yerine ana projedeki **kanonik Nero gövdesi, gözleri, mimikleri ve konuşma animasyonu** kullanılıyor.
- Arıcılık ekranındaki Nero her zaman **kıyafetsiz default görünümde** kalır; pijama, parti veya kış kıyafeti bu köşe karakterine uygulanmaz.
- Alt menüdeki **Hasat Et** altıgeni, diğer menü öğelerini oynatmadan beyaz menünün dikey merkezine alındı.

## Mevsimsel harita

- Harita için dört mevsimli görsel tema genişletildi.
- **İlkbahar:** daha taze yeşil palet, çiçek kümeleri ve çiçeklenmiş ağaçlar.
- **Yaz:** daha güçlü sıcak güneş, daha aydınlık gökyüzü ve canlı bitki tonu.
- **Sonbahar:** sıcak ışık, sarı-turuncu zemin/ağaç paleti ve boş karolarda doğal yaprak kümeleri.
- **Kış:** tamamen beyaza boyanmış bir zemin yerine soğuk doğal çim tonu üzerinde düzensiz kar lekeleri; yapılarda çatı karı, çamlarda kar katmanları ve yaprak döken ağaçlarda çıplak dallar.
- Mevsimsel zemin dekorları koordinat tabanlı deterministik üretildiği için oyun yeniden açıldığında rastgele yer değiştirmez.
- Mevsimsel görünüm kapatıldığında mevcut yaz/default görünüm davranışı korunur.

## Teknik doğrulama

- Yeni arı fiyat eğrisi, kış minimum 4 arı koruması ve Seyyah Yakup'un %20 fiyatı otomatik testlerle doğrulanır.
- Kanonik arıcılık Nero'su, Hasat Et hizası ve dört mevsim görsel altyapısı için regresyon testleri eklendi.


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

# Nero 6.3.2 — Kanonik Nero Kıyafet Sistemi

## Masaüstü Nero

- Kıyafetlerin oturma sistemi tekrar düzenlendi. Kaynak kıyafet çizimleri korunuyor ancak artık çizimlerdeki farklı/şişkin karakter gövdesi doğrudan kullanılmıyor.
- Her PNG çalışma anında Nero’nun gerçek `body.svg` siluetine yeniden kuruluyor: uzun oval gövde, küçük yan eller, ayrı oval ayaklar ve Nero’nun kendi gövde oranları korunuyor.
- Kaynak çizimdeki sabit kafa, gözler, kaşlar, ağız, eller ve ayaklar ayrıştırılıyor. Kıyafetin kumaşı, yaka/kapüşon/ceket formu ve şapka gibi aksesuarları korunarak kanonik Nero gövdesine oturtuluyor.
- Omuz ve yaka bölgesi özel bir geçiş deformasyonuyla yeniden şekillendiriliyor; kıyafet gövdenin üstüne bırakılmış bir PNG gibi değil, Nero için çizilmiş gibi oturuyor.
- Kıyafetli Nero’da canlı göz takibi, göz kırpma, kaşlar, konuşma ağızları ve ifadeler kanonik koordinatlarda çalışmaya devam ediyor.
- Kıyafet Dolabı önizlemeleri de masaüstündeki aynı kanonik dönüştürme motorunu kullanıyor; kartta görülen tasarım ile Nero’nun giydiği tasarım aynı.
- 88 mevcut kıyafet kaynağı korunuyor; ayrı ayrı yeniden export edilmiş ikinci bir karakter seti gerekmiyor.
- Gece manuel seçim düzeltmesi ve özel gün kıyafet kilidi korunuyor.

## Kontrol

- Sürüm `6.3.2`, `appId` `com.stenwick.nero`.
- Ortak kıyafet dönüştürücü hem karakter penceresi hem Kıyafet Dolabı tarafından kullanılır.
- Kaynakta 88 adet 220×260 kıyafet PNG’si doğrulanır; JavaScript sözdizimi, testler, diyalog kontrolü, Electron smoke testi ve Windows paketlemesi GitHub Actions üzerinde çalıştırılır.

## 6.2.0: Köy ve çiftlik yeni bir yüz kazandı

## Yeni

- Köyün 78 evi, dükkânı ve binası kendine özgü üç boyutlu modele kavuştu. Yapıların ad ve tür etiketleri yakından görünür; uzakta üzerine gelinen yapının etiketi açılır. Gece pencereleri ışıldar.
- Arıcı tulumu, peçesi, eklemli kolları ve bacakları, körüğü ve levyesi yenilendi. Kovana vardığında körük dumanı ve çerçeve hareketleri görünür.
- Çiftlik evi kovan ve arazi sayısıyla dört aşamada gelişir. Kovanlar seviyeye göre katlanır, ırka göre renklenir; kraliçesi yükseltilmiş olanlar taç taşır.
- Arılar polen keseleriyle kavisli uçar; tarhlar sıralı çiçek ve ahşap bordürle, göller kıyı taşı, dalga ve ışıltıyla çizilir. Seyyah Yakup'un arabası yenilendi.

## Uyumluluk

- 6.1.0'daki köy halkaları, festival alanı, Nero, mevcut arayüz ve seyrek doğal süsler korunur. Eski kayıtlar yeni modellerle çizilir; oyun kuralları değişmez.

## 6.1.0: Ada genişliyor

- Ada üç tam ekilebilir halka genişledi; köy dış çepere taşındı ve eski kayıtlar korunarak yeni alanlara taşındı.
- Su kenarında beş karelik mevsimsel festival meydanı eklendi; festival günlerinde köylüler alanı ziyaret eder.
- Yeni halkalara seyrek doğal çiçek, saz, taş ve suya nilüfer dekorları eklendi; bunlar tarh ve kovan yerleştirmeyi engellemez.
- Kovan paneli bal/polen/yavru göstergeleri, arı ırkı açıklamaları ve yeni çiçekli arı görseliyle yenilendi.
- Balmumu üretimi 25 g/kg oldu; mumun taban fiyatı tekrar 45 jetona alındı. Rakip günlük üretimi 15 dakikalık oyun gününe göre düzeltildi ve eski şişmiş rakip kayıtları bir kez dengelenir.
- Siparişlerde istenen bal türü depoya göre değil, ekili ve solmamış çiçeklere göre seçilir.
- Masaüstü Nero konuşmaları iki kat uzun görünür; fazla sevilince 5 dakika boyunca tıklamaya kızgın tepki verir.
- Hasat düğmelerindeki içerik ortalandı.

Ayrıntılar: `CHANGELOG-6.1.0.md`

## 6.0.0: Yaşayan köy

- Güncel 3D sahneye yürüyen köy sakinleri, sipariş teslimi ziyaretleri ve adada dolaşıp geceleri uyuyan Nero eklendi. Yürüyen karakter sayısı grafik ayarına bağlıdır.
- Yedi çiçeğin üretim bonusları değişti; Ihlamur Kış Fundası'na dönüştü. Eski kayıtların tarh, bal, tohum ve sipariş verileri dönüştürülür. Çiçek bonusları menzildeki tarhlar arasında toplanır; mevsim çarpanları uygulanır.
- Ek kovanlar 900 jetondan başlar, her satın almada %25 artar ve fiyat en yakın 25'e yuvarlanır.
- Mevsim turnuvaları, dört kategoriyle puanlanan üç bağımsız rakiple yılda dört kez düzenlenir. İlk üç 750/500/250 jeton ve kupa kazanır; birinci sonraki yıl aynı mevsimde %20 üretim bonusu alır. Bal Defteri'ne Kupalar eklendi.
- Bildirimlerde Önemli / Köy / Tümü sekmeleri, kış öncesi eksik erzak uyarısı, sipariş süresi tahmini, hasat rozeti, 10 saniyelik son yerleştirmeyi geri alma ve gece yıldızları eklendi.
- Geçmiş sürümlerin yenilikleri sırayla gösterilir; mevcut 5.6 davranışı sürer.
- Turnuva sonuç penceresi onaylanan krem/altın tasarıma getirildi; kategori sıralamaları, ödül özeti ve gelecek mevsim bonusu tek ekranda şeffaf gösterilir.
- Kış Fundası geçişinden kalan görünür Ihlamur metinleri ve Festival Cilası açıklamaları temizlendi; kışta çiçek mevsim uyumu artık bal katkısına da uygulanır.

## 5.6.0: Arıcılık arayüzü ve liderlik

## Yeni
- Arıcılıkta çizilmiş simgeler, düzenli üst çubuk ve tek parça alt eylem menüsü. Büyük altıgen **Hasat Et** öne çıkar; **Adaya dön** sol altta kalır.
- Kovanların üzerinde bal doluluk halkası, sorunlu kovanlar için uyarılar; sahip olunan arazinin sınırı ve mevsimle değişen arka plan.
- Kovanlar ekranında öncelik sıralaması, durum etiketleri, satırdan uygun işlemler ve toplu hasat/şurup işlemleri.
- İstatistiklerde 7/14 gün ve tümü seçimi; karşılaştırmalar, üretim/kazanç ve net değer grafikleri, bal türüne göre satışlar.
- Rakipler kayıtlı çiftlikleriyle üretim, satış, yatırım ve mevsimsel riskler yaşar. Liderlik ekranında ilerleme hedefi, gerçek değer geçmişi ve son olayın nedeni gösterilir.
- Önceki sürümleri atlayarak güncelleyen oyuncular, arşivdeki yenilikleri sürüm sırasıyla görebilir. Yarıda kapatılan notlar tekrar açılır.

## Düzeltildi
- Mevsim değişimi yeni arayüz ve gece görünümü sınıflarını silmez.
- Nero'nun gözlerinin üzerindeki yeşil çizgi kaldırıldı.
- Günlük rakip simülasyonu aynı oyun gününü iki kez işleyemez; eski kayıtlara rakip çiftlikleri eklenir.

## 5.5.4: Adaya dön düğmesi

- **Adaya dön** düğmesi sağ üstten sol alta taşındı ve biraz büyütüldü.
- Bildirim ve günlük görev düğmelerinin konumu ile davranışı korundu.
- Fotoğraf modunda taşınan düğme de gizlenir.

Ayrıntılar: `CHANGELOG-5.5.4.md`

## 5.5.3: Tohum envanteri ve arayüz iyileştirmeleri

### Yeni
- Sürüm değiştiğinde Arıcılık ilk açılışında bir kez görünen cozy **“Çiftlikte neler değişti?”** penceresi.
- Rehber içinden tekrar açılabilen **📋 Sürüm Yenilikleri**.
- Mağazadan alınan tohumlar için ortak **tohum envanteri**.

### Değişti
- **Yonca +%5**, **Papatya +%10** üretim bonusu sağlar.
- Mağazadan alınan tohumlar anında yerleştirilmek yerine envantere eklenir; ekimde önce envanter kullanıldığı için ikinci kez ücret alınmaz.
- Tohum mağazasında mevcut envanter adedi görünür.

### Düzeltildi
- Günlük görevler tamamlandığında görev panelinin eski görünüme dönmesi engellendi; kompakt ikon ve açılır panel düzeni korunur.

### Korunanlar
- 5.5.2 mekanikleri ve mevcut ses davranışı değişmez.
- Genişletilmiş mektup sistemi bu patch'e dahil değildir.

Ayrıntılar: `CHANGELOG-5.5.3.md`

## 5.5.2: Arıcılık yaşam kalitesi ve denge

### Yeni
- Kovanlarda **🌾 Erzak: X gün** göstergesi ve aktif Ballı Şurup etkisi.
- Sol altta, zilin yanında açılır **📋 günlük görev ikonu**.
- Ayarlar → Ses altında tek tek seçilebilir **İleri Ses Ayarları**.
- **50 kg toplam üretimde Çiçekçi Ezgi** açılışı, tek seferlik hoş geldin tohumu ve günlük **Ezgi'nin Seçimi**.

### Değişti
- Standart şurup **15 kg** verir; günlük temel tüketim kovan başına **1 kg**.
- Eksik günlük erzak artık tamamen tüketilir ve kovan beslenmiş sayılmaz.
- Seyyah Yakup ürün fiyatları satın alma düğmelerinde görünür; hedefe bağlı fiyatlar canlı güncellenir.
- **Kışlık Şurup Fıçısı: 105 🪙 → 45 kg**.
- Arıcılık son görülmeden **3 gerçek saat** sonra üretimle birlikte takvim ve bütün oyun simülasyonu tamamen durur; dönüşte geriye dönük ilerleme yapılmaz.
- Oyun/ortam sesleri yalnız Arıcılık görünürken; bildirim sesleri ise oyun penceresi kapalıyken de Nero üzerinden çalışabilir.

### Korunanlar
- 5.5.1 ses paketi ile 5.5.0'ın **57 topic / 2.133 repliği** korunur.
- Genişletilmiş mektup sistemi bu patch'e dahil değildir.

Ayrıntılar: `CHANGELOG-5.5.2.md`

## 5.5.1: Arıcılık ses entegrasyonu

### Yeni
- Arıcılık bölümüne **20 gerçek OGG ses kaydı** eklendi.
- Coin, zil, başarı, yerleştirme, ekim, kâğıt, hasat ve hata olayları gerçek sample kullanıyor.
- Kuş, arı, yağmur ve rüzgâr için kamera/hava/mevsim duyarlı yeni ambient motoru eklendi.
- Arı uğultusu stereo konumlandırma ve kovan yakınlığına göre değişiyor.
- Efekt ve ortam sesleri birbirinden bağımsız kapatılabiliyor.
- Mevcut sentez sesleri sample yüklenemezse fallback olarak korunuyor.

### Korunanlar
- 5.5.0'ın **57 topic / 2.133 repliği** ve tüm arıcılık mekanikleri değişmeden devam ediyor.

Ayrıntılar: `CHANGELOG-5.5.1.md`

## 5.5.0: Arıcılık dünyası genişliyor

### Yeni
- 57 olay başlığında **2.133 yeni oyun içi Nero repliği**.
- Seyyah Yakup ürün havuzu **9'dan 38 ürüne** çıktı; dekor satışı tamamen dışarıda.
- Günlük görev havuzu **40 göreve** çıktı; günde 2 ücretsiz + 1×100 🪙 görev değiştirme hakkı eklendi.
- Bal Defteri → Etkilerim odak kartına günlük kazanım ve 4 saat limiti eklendi.

### Değişti
- Odak bonusu artık gerçek gün başına toplam **4 saat kazanım** ile sınırlı.
- Müdavim sipariş bonusu kalp başına **%2** (maksimum %10).
- Aynı köylünün aynı anda en fazla **1 açık/kabul edilmiş normal siparişi** olabilir.
- Geri dönüş özeti eşiği **20 gerçek dakika**.
- Yakup ürün fiyatları, hedefleri ve etkileri 5.4.2 ekonomisine göre dengelendi.

Ayrıntılar: `CHANGELOG-5.5.0.md`

## 5.4.0: Gezgin satıcı ve köylü hikâyeleri

### Yeni
- **Gezgin satıcı Seyyah Yakup:** 6–9 oyun gününde bir köye at arabasıyla gelir, 2 gün kalır. Zil, masaüstü Nero ve üstte bir düğmeyle haber verir. Her ziyarette 9 üründen rastgele 4'ünü getirir (ballı şurup, indirimli kraliçe, tohum paketi, dört mevsim tohumu, arı sürüsü, arı sütü, bakım kiti, depo sandığı, balmumu çuvalı; dekor yok). Her üründen 1 tane, bir ziyarette en fazla 2 farklı ürün alınabilir. Bir bal türünü 10 kg'a kadar pazarın %40 üstüne satın alır.
- **Köylü hikâyeleri:** 8 köylünün 3 adımlık hikâyesi; ilişki %50'yi geçince açılır. Adım ödülleri jeton ve tohum, son ödül küçük kalıcı bir bonus (en fazla %5). Köylü penceresinde ve Bal Defteri → Köy'de ilerleme görünür.

## 5.3.0: Arıcılıkta bildirimler, daha uygun fiyatlar

### Yeni
- **Bildirimler (🔔):** sol altta zil; tıklayınca son 20 bildirim açılır. Okunmamış bildirim sayısı zilin üstünde görünür, yeni bildirimde zil sallanır. Bildirimler oyun penceresi kapalıyken de kaydedilir.
- **İstatistikler:** en üstte oyun boyunca satılan toplam bal (ton; pazar + siparişler).
- **Solan çiçeği canlandırma:** solmuş tarh artık tohum fiyatının %10'una canlanır.
- **Hastalık bağışıklığı:** bir kez hastalanan kovan sonraki 3 oyun yılı hastalanmaz; kovan ekranında kalan gün yazar.
- **İlişki yüzdesi:** köylülerle ilişki % olarak görünür (her teslim %10). Bir siparişi reddetmek o kişiyle ilişkiyi %2 azaltır; ilişki %0'ın altına inmez.

### Değişti
- **Yeni sipariş gerçek zamanla 20 dakikada bir** gelir (oyun hızından bağımsız).
- **Satın alma fiyatları %25 indirildi:** tohumlar, kovan, arazi, arılar, kraliçe ve kovan yükseltmeleri, depo, şurup, ilaç, dekorlar, ırk değiştirme ve sipariş değiştirme. Bal satış fiyatları ve ödüller değişmedi.

## 5.2.0: Arıcılıkta köy

### Yeni
- **Köy:** adayı çevreleyen iki halkada (36 + 42 kare) 78 yerleşimcilik bir köy. Bu karelere yalnızca köylüler yerleşir; oyuncunun adasına dokunulmaz, ada hep tam altıgen kalır.
- **Köyün büyümesi:** siparişlerle teslim edilen toplam bala göre. Başlangıçta 6 yerleşimci; 50 / 150 / 400 / 1.000 kg'da birkaç yerleşimci birden, sonra her 500 kg'de bir yeni köylü, dükkân ya da bina. İlk halka dolunca ikinci halka açılır.
- **78 yerleşimci:** 50 köylü, 12 dükkân, 16 bina. Hepsi kodla çizilmiş kendine özgü 3D modellerle (kayıklı balıkçı evi, kedili taş ev, tüten fırın, dönen değirmen, saat kulesi, fener kulesi, Bal Müzesi…). Gece pencereleri ve fenerleri yanar.
- **Sevilen ballar:** her köylünün sevdiği bir bal var; o bal ekiliyse siparişlerinde sık sık onu ister ve %15 daha iyi öder.
- **Dükkân ve bina etkileri (21 yapı):** Fırın, Pastane ve Muhtarlık düzenli siparişler; Bal Dükkânı pazar +%10; Çiçekçi tohum −%10; Bakkal şurup −%20; Eczane ilaç −%30; Marangoz Atölyesi dekor −%20; Mumcu mum +%20; Kahveci odak bonusu +15 dk; Postane sipariş süresi +1 gün; Pazar Yeri sipariş sınırı 6; Okul görev ödülü +%10; Çay Bahçesi ilk kalbi hızlandırır; Veteriner hastalığı %25 azaltır; Arıcılar Derneği festival puanı +%10; Dondurmacı ve Lokumcu yaz/kış siparişleri +%10; Reçelci kekik ve ıhlamur siparişleri; Köy Serası çiçek ömrü +5 gün; Bal Müzesi tüm üretim +%5.
- **Bal Defteri'nde Köy sekmesi:** köyün büyüklüğü, sıradaki yerleşimci için gereken bal, bütün yerleşimciler ve kalpleri.
- Köydeki yapılara tıklayınca kim olduğu ve etkisi görünür. Kamera köyü de kapsayacak şekilde daha uzağa açılabiliyor.

## 5.1.0: Arıcılıkta görevler, Bal Defteri, gece ve hava

### Yeni
- **Günlük görevler:** her gün 3 küçük görev (bal hasat et, sat, sipariş teslim et, mum yap, tarh ek). Ödül jeton, bazen hediye tohum. Sol üstte katlanabilir kart.
- **Bal Defteri (📖, D):** her bal türünün sayfası (ilk üretim, toplam hasat, satış, en iyi fiyat); kilitli sayfalar; kayıtlar ve kupalar.
- **Çiftlik ve kovan isimleri:** kovan adına tıklayarak, çiftlik adını Bal Defteri'nde değiştirme.
- **Kavanoz etiketi:** 4 desen, 6 renk; etiketin varsa müdavim köylüler siparişlerde %5 bahşiş verir.
- **İstatistikler (📊):** bugünkü üretim ve kazanç, son günlerin üretim/kazanç grafikleri, net değer grafiği.
- **Fotoğraf modu (📷, F):** arayüz gizlenir, adanın görüntüsü Resimler\Nero Arıcılık klasörüne kaydedilir.
- **Gece modu:** gerçek saatle 19:00–07:00; gün batımı ve şafak geçişleri, yıldızlı gökyüzü, yanan fenerler ve ev pencereleri, ateş böcekleri. Sadece görünüş, üretim etkilenmez.
- **Ortam sesleri (🎵):** gündüz kuşlar ve arı vızıltısı, gece cırcır böcekleri, yağmurda yağmur sesi. Çok kısık, kapatılabilir.
- **Klavye kısayolları:** H hepsini hasat et, P Pazar, S Siparişler, D Bal Defteri, F fotoğraf, Boşluk duraklat/devam, Esc kapat.
- Büyük anlar (ilk kavanoz, tüm ballar, 20 arılı kovan, ilk kupa) ileride rozetlere bağlanabilmesi için kaydediliyor.

### Değişti
- **Hava artık mevsime uygun:** yaz her gün güneşli; ilkbahar güneşli/bulutlu/yağmurlu; sonbahar bulutlu/yağmurlu; kış karlı/yağmurlu. Kışın güneşli gün yok. Eski kayıtlardaki uyumsuz hava açılışta düzeltiliyor.
- Kar efekti artık sadece karlı günlerde yağıyor; yağmurlu günlerde (kış dahil) yağmur yağıyor.

## 5.0.0: Diyalog sistemi ve Arıcılık oyunu

### Yeni
- **Arıcılık oyunu:** Nero içine ayrı pencerede çalışan, Three.js tabanlı 3D arıcılık çiftliği eklendi.
- Kovan kurma, çiçek ekme, bal üretimi ve hasat, depo, Pazar, siparişler, köylüler, arı ırkları, şurup, hastalık, dekorlar, balmumu/mum, rakipler ve yıllık Bal Festivali destekleniyor.
- Oyun kaydı `%APPDATA%\Nero\bee.json` altında tutuluyor; Nero açıkken oyun penceresi kapalı olsa da çiftlik ilerlemeye devam ediyor.
- Panel başlığına **🐝 Arıcılık** düğmesi ve Nero sağ tık menüsüne **Arıcılık oyunu** girişi eklendi.
- Nero'nun odak sayacı tamamlanınca arıcılık üretim bonusu; yapılacak iş tamamlanınca **+10 jeton** bağlantısı eklendi.
- Dolu/hasta kovan, yaklaşan sipariş, kış erzağı ve rakip uyarıları masaüstü Nero repliklerine bağlandı.
- Arıcılık kaydı Nero'nun genel yedek/dışa aktarma sistemine dahil edildi; ayrıca yalnız çiftliği dışa/içe aktarma desteği eklendi.
- **Oyunu sıfırla** seçeneği Ayarlar > Yedekler'e eklendi. İki onay ister ve sıfırlamadan önce mevcut çiftliği otomatik yedekler.

### Arıcılık zamanı ve rehber
- Oyun takviminde her mevsim/oyun ayı **15 gün**; bir oyun yılı toplam **60 gün**.
- Festival artık sabit gün numarasına değil, yılın otomatik olarak son 3 gününe bağlı.
- Oyun penceresi önde değilken simülasyon hızı en fazla **2x**; 4x seçiliyse pencere tekrar öne geldiğinde 4x devam eder.
- Oyun içi Rehber genişletildi: ilk adımlar, zaman/hız, üretim, kovanlar, kış/hastalık, hasat/depo, Pazar/siparişler, köylüler, Nero bonusları, festival/rakipler ve kayıt/sıfırlama ayrı başlıklarda anlatılıyor.

### Diyalog sistemi
- Diyaloglar için **canonical master + generated runtime + manifest** yapısı eklendi.
- `dialogue.master.tr.json`, `dialogue.tr.json` ve `dialogue-master.manifest.json` senkron doğrulama akışına geçirildi.
- Diyalog build/check/import araçları eklendi.
- Güncel masterda **106 kategori ve 7.998 replik** bulunuyor.
- Fiziksel etkileşim, sayaç, uyku/şekerleme, selamlaşma/dönüş ve masaüstü geri dönüş kategorileri genişletildi; exact duplicate ve placeholder doğrulamaları uygulanıyor.
- Eski kategorilerdeki ifade/efekt metadata nesneleri korunuyor.

### Veri ve geriye uyumluluk
- 4.3.1'deki notlar, işler, arşivler, moodboard kayıtları, istatistikler, rozetler, temalar ve ayarlar korunuyor.
- Arıcılık genel Nero snapshot/yedek yapısına eklendi.
- Arıcılık içe aktarması ve oyun sıfırlaması mevcut çiftliğin üzerine yazmadan önce ayrı güvenlik yedeği alıyor.
- `appId` değişmedi: `com.stenwick.nero`.

### Doğrulama
- **60/60 Node regression testi başarılı.**
- Diyalog master/runtime senkronizasyon kontrolü başarılı.
- Üst pencere kontrolleri gerçek Electron hit-test smoke testiyle doğrulandı.
- Panel sürükleme ve minimize/restore etkileşimleri Electron smoke testiyle doğrulandı.
- Arıcılık penceresi, preload köprüsü ve Three.js sahnesi gerçek Electron smoke testiyle doğrulandı.
- Windows x64 NSIS **Nero-Setup-5.0.0.exe** üretimi başarılı.

## 4.3.1: Pencere etkileşimleri, görev çubuğu, Moodboard ve yardım polish

### Düzeltildi
- Nero ve panel art arda tekrar tekrar sürüklenebiliyor; görev çubuğundan geri dönüş sonrasında sürükleme state'i güvenli biçimde sıfırlanıyor.
- Windows restore sonrasında şeffaf Nero penceresinin mouse hit-test alanının takılı kalması giderildi; Nero'yu sürüklemek için önce paneli hareket ettirmek gerekmiyor.
- Ayarlar / Sabitle / Küçült / Kapat kontrolleri sürükleme yüzeyinden ayrıldı ve tıklanabilirlikleri korunuyor.
- Konum kilidi aktif sürüklemeleri kapatıyor; kilit kaldırılınca hareket yeniden kullanılabiliyor.
- Panel açıksa görev çubuğundan geri çağırmada Nero + panel birlikte öne geliyor; panel kapalıysa yalnız Nero öne geliyor ve panel zorla açılmıyor.

### Moodboard
- 7 sütunlu takvim daha kompakt, doğal içerik yüksekliğinde ve dengeli satır aralığında gösteriliyor.
- Geniş panelde Moodboard tam genişliği kullanıyor; dar panelde 32 px, normal panelde 36 px hücre ritmi korunuyor.
- Duygu adları **Muhteşem / İdare eder / Kötü** olarak güncellendi. Mevcut `green / yellow / red` kayıt biçimi değişmedi.

### Yardım sistemi
- Ana sayfadaki küçük `?` işaretleri tüm temalarda bordersız ve transparan hale getirildi.
- Tooltip kartların overflow/stacking context'inden çıkarılıp body seviyesinde tek bir fixed overlay katmanına taşındı.
- Tooltip viewport içinde tutuluyor, tema dekorlarının veya içeriğin arkasında kalmıyor ve aynı anda yalnız bir yardım açık kalıyor.

### Tema ve test
- Latte, Pazartesi, Gece, Disket, Kasaba, Yağmur, Kar, Çilekli Piknik, Mum Işığı ve Ege Yazı temaları korunuyor.
- Pencere kontrolleri, tekrarlı panel drag, Moodboard ve yardım tooltip davranışları gerçek Electron smoke testleriyle; veri ve UI davranışları regression testleriyle doğrulanıyor.

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

# Nero 6.3.0 — Kıyafet Dolabı ve Canlanan Ada

## Masaüstü Nero

- Ayarlar içine kategori sekmeli Kıyafet Dolabı eklendi: 8 sevimli, 16 gündelik ve dört mevsimin her birinde 12 kıyafet. Çıkarma seçeneği ve gerçek kıyafet önizlemeleri var.
- Yerleşik temaların tümünde yüz ve hareket katmanlarıyla hizalı şeffaf kıyafet varlıkları kullanılır.
- 21.00–06.00 arasında gece başına bir rastgele pijama seçilir. Doğum günü, yılbaşı, Sevgililer Günü, 1 Nisan, 23 Nisan, Dünya Arı Günü, 29 Ekim ve Cadılar Bayramı kıyafetleri kendiliğinden giyilir; o gün değiştirilemez.
- İşler bölümündeki yeni görev ve mevcut görev hatırlatma saatleri 24 saat biçiminde (`00:00–23:59`) girilir ve doğrulanır; işletim sisteminin AM/PM göstergesi kullanılmaz.
- Masa köşesinin 10 öğesi toplam odak süresinde her 30 dakikada bir açılır (30–300 dk); sıradaki eşik için kalan süre dakika olarak gösterilir. Önceden açılmış öğeler korunur.

## Arıcılık

- Mevsimsel görünüm seçeneği, köy evlerinin kış çatılarında kar, ilkbahar ağaçlarında çiçek, sonbaharda yaprak ve yaz tonlarını yönetir. Arıcılık kurallarına etki etmez.
- Çiftlik evinin yanına ayrı, üç aşamalı depo kondu; doluluk %90'ı geçince kasalar görünür.
- Başarılı hasatta bal damlacıkları parlar; arıcı kavanozu depoya taşır. Bal oyun hesabına hasat anında eklenir.
- Q/E ve sağ tuş sürükleme ile kamera döner; Adaya Dön / R dönüşü ve yakınlaştırmayı sıfırlar.
- Sabah, öğlen, akşam ve gecenin ışıkları yerel saate göre yumuşak değişir.
- İlk yeni ev 50 kg üretimde açılır, sonraki evler her 150 kg sipariş teslimatında gelir.
- Tüm solmuş çiçekler tek işlemle ve toplam ücret önceden kontrol edilerek canlandırılabilir.
- Sağ alt Nero'nun yüzü ve arıcı kıyafeti, hasat düğmesinin hizası ve %10'un altında gizlenen kovan etiketleri güncellendi.

## Kontrol

- `npm test`: 114 test geçti; değişen JavaScript dosyalarının sözdizimi kontrol edildi.
- Windows kurulum dosyası bu Linux ortamında oluşturulup Windows üzerinde denenmedi.

# Nero 6.3.1 — Kıyafetler Nero’nun Üzerinde

## Masaüstü Nero

- Kıyafet sistemi yeniden düzeltildi. 88 kıyafetin her biri, daha önce hazırlanan ve Nero’nun gerçekten giydiği tam karakter çizimine geri döndürüldü.
- Giysiyi ayrı bir PNG olarak gövdenin üzerine bırakma yaklaşımı kaldırıldı. Ceket, hoodie, kazak, gömlek, şapka, pijama ve özel gün tasarımlarının kendi silueti, kolu, yakası, eli ve kenar çizgisi korunur.
- Masaüstünde kıyafet açıldığında çizimin içindeki sabit yüz çalışma anında yalnızca görünür yeşil baş bölgesinin içinden temizlenir. Şapka, kapüşon, yaka ve kıyafet kenarları bu işlemden etkilenmez.
- Temizlenen yüzün üstüne Nero’nun gerçek göz, pupil, göz kapağı, kaş ve ağız katmanları çizilir. Göz kırpma, konuşma, bakış ve mevcut mimikler kıyafetliyken çalışmaya devam eder.
- Şapkalı ve başlığı yüzü aşağı taşıyan kıyafetlerde göz konumu çizimin içinden otomatik bulunur; canlı yüz katmanları buna göre hizalanır.
- Ayarlar > Kıyafet Dolabı kartları doğrudan gerçek tam karakter kıyafet çizimini gösterir. Kullanıcı ne seçiyorsa Nero da aynı tasarımı giyer.
- Gece yapılan manuel kıyafet seçimi o gece hemen uygulanır; sonraki gece otomatik pijama döngüsü yeniden devreye girer.
- Sürüm `6.3.1`, `appId` `com.stenwick.nero` olarak korunur.

## Kontrol

- 72 seçilebilir kıyafet, 8 gece görünümü ve 8 özel görünüm olmak üzere 88 adet 220×260 PNG doğrulanır.
- JavaScript sözdizimi, testler, diyalog doğrulaması, Electron smoke testi ve Windows kurulum derlemesi GitHub Actions üzerinde çalıştırılır.

# Nero 6.3.4 — Çiftlik Uyarıları, Köylü Mektupları ve Denge

## Öne çıkanlar

- 6.3.x ile gelen manuel **Kıyafet Dolabı** ve ilgili wardrobe denemeleri kaldırıldı. Nero'nun 6.2.0'daki otomatik pijama, parti ve kış kıyafetleri korunuyor.
- Köydeki 50 isimli karakterin her biri için 100 kişisel metin hazırlandı: toplam **5.000 köylü mektubu**.
- Aynı gönderen, gönderdiği mektuptan sonraki 10 mektupta yeniden seçilemez; aynı karakterin son 30 metni de tekrar edemez. Geçmiş save içinde korunur.
- Hediye içeren mektuplarda dağılım **%66 jeton / %33 balmumu / %1 tohum** olarak dengelendi.
- Oyun simülasyonu durduğunda rakip çiftliklerin gelişimi de durur; pause süresi için sonradan rakip catch-up yapılmaz.
- Sol alta koşullu **ünlem uyarı merkezi** eklendi: hasta kovan, solmuş tarh ve dolu depoyu listeler; uyarıdan doğrudan hedefe gidilir.
- “Hasat Et” yeşil rozeti artık kovan kendi kapasitesinin en az **%10'una** ulaştığında görünür ve birkaç piksel sağa alındı.
- Rehbere Mevsim Turnuvası'nın Bal Kalitesi, Arıcılık, Üretim ve Köy İtibarı puanlarının gerçek hesapları eklendi.
- Sürüm Yenilikleri ekranında **Önceki Sürüm** navigasyonu ve mevcutsa görüntülenen sürümün GitHub Releases / CHANGELOG bağlantısı eklendi.

## Teknik

- Release bağlantıları yalnız izin verilen GitHub Releases adreslerini harici tarayıcıda açar.
- Uyarı durumu save'e eski veri olarak yazılmaz; mevcut çiftlik state'inden canlı hesaplanır.
- 50×100 mektup verisi paketlenmiş gzip JSON parçaları olarak yüklenir ve sabit içerik kimlikleri seçim geçmişinde kullanılır.

