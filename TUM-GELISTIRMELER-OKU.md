# Nero: SpongeBob teması ve kabul edilen geliştirmeler

Bu paket v9.6.8 kaynaklarının üzerine hazırlanmıştır. Önceki temalar, karakter, kıyafetler, finans kayıtları ve mevcut özellikler korunur. Kaynak paketi kurulu uygulamanın yerine otomatik geçmez.

## Çalıştırma

Node.js kuruluyken bu klasörde `npm ci`, ardından `npm start` çalıştırın. Finans arayüzünün derlenmiş dosyaları pakete dahildir. Finans kaynaklarını değiştirirseniz `npm run finance:build` kullanın. Testler: `npm test`.

Ayarlar → Görünüm → Tema alanından **SpongeBob · Bikini Bottom** seçilir. Tema klasörü de pakete dahildir.

## Tema düzeltmeleri

- Bugün: su altı sahnesi, ananas ev, SpongeBob ve tek canlı konuşma balonu.
- Notlar: sarı / pembe / mavi kağıtlar ve delikli, çizgili yazı defteri.
- İşler: Yengeç Restoranı sahnesi ve ataçlı sipariş defteri.
- Sayaç: rakam içermeyen altın gemi penceresi; canlı süre merkezde. Eski görselden gelen rakam ve ikinci cam katmanı kullanılmaz.
- Rozetler: ayrı koleksiyon panosu. Beş sayfa ayrı düzen ve dekor kullanır.
- Düğmeler, seçili sekmeler, sarı gözenekli üst kısım, mercan renkli vurgu ve deniz tabanı birlikte hazırlanmıştır.

Görseller onaylanan mevcut tasarımdan çıkarılan parçalar ve uygulama için çizilen SVG'lerden oluşur. Görsele gömülü örnek süreler/metinler canlı verinin arkasında kullanılmaz. Yeni görsel üretim isteği araç tarafından reddedildiğinden yeni üretilmiş görsel kullanıldığı iddia edilmez.

## Notlar

Karttaki ⋯ menüsünden sabitleme, etiket, kağıt rengi, arşivleme ve silme yapılır. Sabit not ataş ile görünür. Kişisel, İş, Fikir etiketleri kartta görünür. Uzun metin kartta özetlenir; açık notta geniş yazı alanı vardır. Liste ve `- [ ]` / `- [x]` kontrol listesi desteklenir. Karttaki ilk üç madde işaretlenebilir; tamamlanan/toplam madde sayısı gösterilir. SpongeBob defteri yazmayı bıraktıktan kısa süre sonra otomatik kaydeder.

## İşler ve odak

Bugün / Sonra bölümleri, öncelik ve etiketler, arama ve filtreler, alt adım ilerlemesi, planlanan/çalışılan süre, iş menüsü ve katlanır tamamlanan işler bulunur. Önceki günlerin tamamlanan işleri ayrı başlıktadır. Yeni işin süre ve hatırlatma alanları ayrıntılarda açılır. Bugünün toplam planı ve süresi belirtilmemiş iş sayısı gösterilir. Sürükleyerek sıra değiştirme korunur; sürükleme sırasında açılan alanlarla Bugün / Sonra arasında taşıma yapılır.

Sayaçta Bugün listesinden iş seçilebilir. Aktif odak süresi o işe eklenir; duraklatılan süre eklenmez. Bugünkü oturumlar iş/ad, çalışılan süre ve durum bilgileriyle görünür. Uygulama kapanarak yarıda kalan oturum çevrimdışı süreyi odak olarak saymaz.

## Bugün

Kavanoz sayısı veya Anıları oku düğmesi tarihli geçmişi açar. Rastgele anı, tüm anılar gösterilmeden aynı anıyı tekrar seçmez; döngü ve son gösterilen anı yeniden açılışta korunur. Tek anı varsa açıklanır. Tamamlanan işler işaret ve tarih ile görünür. Odak sütunları günlük süreyi ve ilgili oturumları açar; sıfır süreli günün dolu sütunu yoktur. Ben / Nero seçimi tek takvim gösterir; hafta günleri, renk açıklaması ve bugün çerçevesi eklenmiştir.

Nero'nun normal mutluluğunun ilgisizlikte hiç azalmaması düzeltildi. Uyanıkken ilgilenilmediğinde keyfi zamanla düşer; uyku ve şekerleme ihmal sayılmaz. Günlük Nero kaydı etkileşim durumunu dikkate alır. Geçmiş günler için yeni ruh hali uydurulmaz.

## Finans

- Gerçek işlem tarihi ile planın vadesi ayrı gösterilir. Aynı tarihte yapılmış taksit ödemeleri sırf aynı tarih oldukları için otomatik değiştirilmez.
- Negatif hesap bakiyeleri karşılaştırmada kırmızı ve sıfır eksenine göre gösterilir. Bakiye açıklaması başlangıç ve kayıtların katkısını açar.
- Birikim halkası dağılımı ifade eder; hedefin kalan tutarı ve tarih varsa aylık katkı senaryosu gösterilir.
- Taksitler gruplanabilir; grubun içindeki ödemeler tarih/tutar ile açılır. İşlem kopyalama yeni işlem formunu doldurur. Tutarları gizleme tercihi korunur.
- Transfer formunda aynı para biriminde gereksiz hedef tutarı gizlenir; ek alanlar katlanır. Tek hesap varsa açıklama gösterilir.
- Yaklaşan, gecikmiş, kısmen ödenmiş, kaydedilmiş ve atlanmış kayıtlar ayırt edilir. Gerçek ödeme tarihi ve hesabı seçilir. Bir dönemin gerçek fatura tutarı değiştirilebilir; diğer dönemlerin tutarı korunur.
- Kısmi ödeme yalnız ödenen miktarı bakiyeye işler; kalan borç açık kalır. Geri alma ödeme kayıtlarını ve kalan yükümlülüğü birlikte geri getirir.
- Tek dönem / bu dönem ve sonrası tutar düzenlemesi desteklenir. Ödenmiş tarihlerin değişmesine izin verilmez. Düzenli işlemde sonraki üç tarih önizlenir.
- Raporun tarih aralığı, hesap, tür, kategori ve metin filtreleri saklanır. Önceki dönemde kayıt olmaması sıfır harcama gibi yorumlanmaz. Grafikte dönem ayrıntısı ve ilgili işlemler açılabilir.
- Takvim gerçek kayıtları, gelecek tarihli kayıtları ve planları içerir; gün ayrıntısı ile liste görünümü vardır. Boş ödeme grafiği açıklama gösterir.
- Akademi son ders ve adımı hatırlar. Hesaplayıcı girdileri saklanır. Akademide ay seçimi ve işlem ekleme gizlenir. Mevcut ders kaynakları, uygulamalar ve kısa sorular korunur.

## Doğrulama

352 otomatik test; dört temada 72 panel yerleşimi; 24 çizgi roman finans yerleşimi ve 120 finans yerleşimi kontrolü. Gerçek Electron pencerelerinde not kaydı, etiket/sabitleme, filtreleme, gerçek fare hareketiyle Bugün/Sonra taşıma, bağlı sayaç/duraklatma, anı tekrarı, kısmi ödeme, işlem kopyalama ve rapor ayarlarının korunması kontrol edilir. Karakter ve odak bildirimi ayrıca üretim ön yükleyicisiyle doğrulanır.

Ekran görüntülerindeki örnek kayıtlar yalnız izole test verisidir; uygulamaya başlangıç kaydı olarak eklenmez. Görüntüler `docs/new-features/screens`, finans kontrolleri `docs/new-features/finance-screens` klasöründedir.
