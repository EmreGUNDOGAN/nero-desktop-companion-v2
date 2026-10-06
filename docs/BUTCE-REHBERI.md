# Nero 9.6.5 — Bütçe rehberi

## Kaynaktan çalıştırma

Node.js 22.12 veya daha yeni bir sürümle proje kökünde:

```sh
npm ci
npm start
```

Windows kurulum dosyasını yerel olarak üretmek için Windows üzerinde:

```sh
npm run dist
```

Kaynak paketinde `node_modules` ve derleme çıktısı bulunmaz. Üstteki komut bağımlılıkları indirir. Sürüm `package.json` ve kilit dosyasında 9.6.5'dir. Bütçe için yeni npm bağımlılığı eklenmedi.

## İlk kullanım

Ana menüden Bütçe'yi aç. İlk işlem ekleme düğmesi hesap oluşturmayı başlatır. Banka, nakit veya kredi kartı hesabını, para birimini ve başlangıç bakiyesini gir. Kartta başlangıç tutarı mevcut borçtur; otomatik eksi bakiye olur. Başlangıç bakiyesi aylık gelir değildir.

Sonra ayrı **Gelir ekle** ve **Gider ekle** düğmelerini kullan. Maaş veya YouTube ödemesi için Gelir ekle’de paranın geldiği banka hesabını ve gelir kategorisini seç. Hesaplar paranın bulunduğu yerdir; kategori ise geliş veya harcama nedenidir. Başlangıç rehberi dört adımda bu ayrımı anlatır. Üstteki dönem seçimi özet, bütçeler ve raporların ayını değiştirir. İşlemler sekmesi seçilen ayı başlangıç filtresi olarak kullanır; tarih filtrelerini değiştirerek daha geniş döneme bakabilirsin. Hesap bakiyeleri bugünü gösterir. Gelecek tarihli işlemler listede işaretlenir ve o tarihe kadar güncel hesap bakiyesini değiştirmez.

## İşlem kuralları

- Tutarlar en fazla iki ondalık içerir: `1250,50` veya `1250.50`. Kurlar en fazla altı ondalık içerir.
- Bir işlemi birkaç kategoriye bölüyorsan payların toplamı işlem tutarıyla aynı olmalı.
- İade giderden düşülür. Bir harcamaya bağlı iadelerin toplamı o harcamayı aşamaz. Bağlı iade varken ilk harcama silinemez; önce iadeyi kaldır.
- Transferde kaynak ve hedef hesap farklı olmalı. Aynı para biriminde hedef tutarı eşitlenir; farklı para biriminde hedefe geçen gerçek tutarı ayrıca gir.
- Kart borcu ödemesi banka/nakitten karta transferdir. Kart alışverişi gider kaydedilir; borcu ödeme gideri ikinci kez artırmaz.
- Kart taksit planında alışveriş toplam tutarı alışveriş tarihinde gider/borç kaydedilir. Ödemeler karta transferdir. Banka/nakit taksitleri ödendikçe gider olur. Kuruş farkları taksitler arasında dağıtılır.
- Planlarda otomatik kayıt isteğe bağlıdır. Kapalıysa Ödendi/Alındı ile gerçek tarihini kaydet; açıksa vadesi geldiğinde Nero işlemi oluşturur. Aynı plan tarihi iki kez kaydedilmez. Abonelik tutarı ileri bir yürürlük tarihiyle değiştirilebilir; geçmiş işlemler korunur.
- Kart kesim ve ödeme günleri ayda o gün yoksa son güne ayarlanır. Gösterilen dönem borcu kayıtlarından hesaplanan bir tahmindir; banka ekstresi yerine geçmez.

## Bütçe ve hedefler

Toplam bütçeyi ve gerekirse ayrı kategori limitlerini belirle. Bir ana kategori limiti alt kategorilerini de kapsar. Devir açık olduğunda önceki ayın kullanılmayan limiti sonraki aya eklenir; en fazla 24 önceki ay hesaplanır.

Birikim hedefinde para ayırmak yeni bir harcama veya gerçek banka transferi oluşturmaz. Seçilen hesapta rezerv tutar gösterilir; mevcut bakiye değişmez. Ayrılabilecek tutar güncel bakiye eksi aktif hedef rezervleridir. Normal harcamalar rezervi engellemez; hedefler para blokajı değildir. Arşivlenen hedefin rezervi serbest kalır.

## Para birimleri

TRY, USD, EUR, GBP, CHF, CAD ve AUD desteklenir. Hesaplar → Kurlar'da 1 yabancı birimin ana para biriminde karşılığını gir. Kurlar manuel yönetilir. Eksik kurlu hesaplar toplam bakiyeye dahil edilmez ve uyarı görünür.

Net varlık güncel kayıtlı kurları kullanır. Gelir/gider raporu her işlemin kayıt anındaki kurunu korur. Ana para birimi işlemler, planlar veya bütçeler oluşturulmadan önce değiştirilebilir. Para birimini değiştirmek eski kuru otomatik çeviremez; yeni kurları girmen gerekir.

## Fişler ve veri aktarımı

Kaydedilmiş bir işlemi açıp Fiş ekle ile PNG, JPEG veya PDF seç. Belge başına en fazla 8 MB kabul edilir. Belgeler bütçe verisine dahil edilir. Aç düğmesi sistemin varsayılan görüntüleyicisini kullanır.

CSV içe aktarmadan önce hesap ve kategorileri oluştur. İsimler tam eşleşir. CSV'de noktalı virgül veya virgül ayraç, UTF-8 ve tırnaklı metin desteklenir. Önizleme geçerli yeni işlemleri, hataları ve tekrarları gösterir. Yalnız geçerli yeni işlemler alınır. Her aktarım en fazla 5000 işlem ve 8 MB olabilir.

Zorunlu başlıklar: `tarih;tur;hesap;kategori;tutar`. İsteğe bağlı başlıklar: `para_birimi;kur;aciklama;alici;etiketler;hedef_hesap;hedef_tutar;bolunmus_kategoriler`.

```csv
tarih;tur;hesap;kategori;tutar;para_birimi;kur;aciklama
2026-10-06;gider;Banka;Market;125.50;TRY;1;Haftalık alışveriş
2026-10-06;gelir;Banka;Maaş;30000.00;TRY;1;Ekim maaşı
```

Türler `gelir`, `gider`, `iade`, `transfer` olabilir. Transferde kategori boş bırakılır, hedef hesap ve farklı para biriminde hedef tutarı girilir. Bölünmüş kategoriler JSON biçiminde taşınır; ilk dışa aktarımını örnek olarak kullanabilirsin. CSV fişleri, plan bağlantılarını ve bağlı iade kimliklerini taşımaz; tam geri yükleme için JSON yedeğini kullan. Excel formülü gibi başlayabilen metinler güvenli dışa aktarım için tek tırnakla öneklenir.

İşlemler ve raporlardaki CSV çıkar düğmesi seçilen ayı dışa aktarır. Hesaplar → Yedek & Ayarlar → CSV şablonu / tüm işlemler tüm tarihleri çıkarır; henüz işlem yoksa yalnız başlıklar çıkar.

Bütçe yedeği JSON olarak fişleri de içerir. Geri yüklemede mevcut bütçe önce yerel yedeğe alınır. Notlar, görevler ve oyun bu işlemle değişmez. Nero'nun genel yedeği bütçeyi de içerir; bütçe alanı olmayan eski genel yedek mevcut bütçeyi silmez.

PDF raporu seçilen ayın özetini, kategorilerini, limitlerini, güncel hesap bakiyelerini ve işlem dökümünü içerir.

## Kayıt ve hatırlatmalar

Bütçe `%APPDATA%/Nero/budget.json` altında mevcut Nero JSON deposuyla saklanır. Veriler ve yedekler şifrelenmemiş yerel dosyalardır. Bankaya bağlanma, otomatik banka hareketi indirme ve canlı kur servisi bulunmaz.

Vade bildirimi uygulama açıkken ve ekran kilitli değilken 30 saniyelik kontrol sırasında gelir. Seçilen her hatırlatma günü için bir kez bildirilir. Bildirim tutar ve hesap adı göstermez. Windows bildirim ayarları bildirimin görünürlüğünü belirler; uygulama kapalıyken zamanlanmış bildirim gönderilmez. Gecikmiş ödemeler Ödemeler sekmesinde görünür.

## Doğrulama

```sh
npm test
```

Electron ile arayüz testi:

```sh
npx electron test/budget-ui-smoke.js
```

Testler gerçek bütçe motorunu ve IPC'yi kullanır; pencere görünmeden formlar, fiş, CSV, yedek ve PDF çalıştırılır. Linux ortamında başsız kullanım için `--no-sandbox --disable-gpu --ozone-platform=headless` parametreleri kullanılabilir. Bu testlerde sistem dosya seçim pencereleri kontrollü test dosyalarıyla değiştirilir.


## Yeni finans çalışma alanı

Bölümler: Özet, İşlemler, Hesaplar, Bütçeler, Ödemeler, Raporlar, Takvim, Akademi. Bölüm içindeki “?” düğmeleri açıklama penceresi açar. Hesap formunda bu pencereyi kapatmak yazdığın taslak alanları silmez. Finans ayarlarındaki Rahat/Büyük yazı seçimi kaydedilir; diğer Nero sayfalarının yazı boyutunu değiştirmez.

Halka grafiği yalnız pozitif net kategori tutarlarını gösterir. İadeler nedeniyle negatif olan kategoriler dökümde ayrı görünür; halkanın ortasındaki toplam pozitif payların toplamıdır. Kategoriye basınca o ayın ilgili işlemleri açılır. Kategori adları, tutarlar ve yüzdeler renk olmadan da okunabilir.

Raporlarda Bu ay görünümü günlük toplamları; 3/6/12 ay görünümleri seçilen aya kadar aylık toplamları gösterir. Noktalarda tam tutar, grafiğin altında erişilebilir tutar dökümü vardır. Aylık özet ve PDF; gelir, net gider, fark, gelirden kalan oran, büyük kategori ve limit aşımını içerir. Devam eden ay geçici olarak işaretlenir; yalnız kayıtlı veri değerlendirilir. Gelir-gider farkı gerçek banka nakit akışı değildir.

### Kart son ödeme günü

Kart hesabını düzenleyip **Kart ödeme hatırlatmaları** seçeneğini aç. Takvim seçilen ayın vade gününü gösterir. Ayın o günü yoksa son gün kullanılır. Kayıtlı kart borcu pozitifse, uygulama açık ve ekran kilitli değilken finans ayarlarında seçtiğin günlerde ve saatten sonra bir kez bildirim verilir. Bildirime basınca ilgili ödeme açılır. Aynı gün uygulamayı yeniden başlatmak aynı bildirimi tekrarlamaz. Arşivli, bildirimi kapalı veya borcu sıfır kartlar bildirilmez.

Bu, bankanın çevrimiçi ekstresinden alınan bir tarih değildir; her ay aynı seçili güne dayanır. Gerçek son ödeme tarihini bankadan doğrula. Windows izinleri görünürlüğü etkiler. Paneli kapatıp Nero’yu tepside çalışır bırakmak ile uygulamadan tamamen çıkmak farklıdır; tamamen kapalı uygulama bildirim göndermez.

### Şablon ve benzer kayıt kontrolü

Bir işlemi açıp **Şablon olarak sakla** seç. İşlemler → Şablonlar → Kullan ile güncel tarihli yeni bir form açılır. Tutarı değiştirebilirsin. Şablon kendi başına gelir, gider veya banka ödemesi oluşturmaz. Aynı gün/hesap/tür/tutarda benzer işlem varsa yeni kayıt uyarı verir. Ayrı bir işlem olduğundan eminsen Kaydet’e ikinci kez basabilirsin; mevcut işlem değiştirilmez.

### Düzenlemeyi geri alma

İşlem silmeyi Silinenler’den geri alabilirsin. Hesaplar → Yedek & Ayarlar’daki **Son düzenlemeyi geri al** düğmesi son uygun hesap, kategori, limit, hedef, rezerv, kur, plan veya şablon değişikliğini geri alır. Başka kayıtların tutarlılığını bozacak geri alma engellenir. Tam tutarlı alışveriş kaydı oluşturan kart taksit planı bu genel geri alma düğmesine dahil değildir; planın bağlı alışverişi borç tutarlılığı için korunur. Yanlış taksit ödemesini plan ayrıntısındaki Geri al düğmesiyle düzelt. JSON yedeklerini ayrıca sakla.

### El Kitabı

14 konu grubu ve 94 ders. Her derste Anlatım, Örnek, Uygula ve Kontrol adımları bulunur; özgün açıklamalar, çözümlü örnek, uygulanabilir adımlar, sık hata, üç seçenekli bilgi kontrolü ve kaynaklar içerir. Okudum/Kaydet, cevaplar ve kaldığın ders yedekte korunur. Hiçbir ders kilitli değildir. 46 terimlik sözlük ve dört hesaplayıcı bulunur:

- Hedefe gereken aylık katkı: (hedef − mevcut birikim) / kalan ay.
- Acil durum tamponu: zorunlu aylık gider × kullanıcının seçtiği ay sayısı. Evrensel bir ay sayısı önerilmez.
- Nominal/reel değişim: (1 + nominal oran) / (1 + aynı dönem enflasyonu) − 1.
- Bileşik büyüme: sabit yıllık efektif varsayım aylık eşdeğere çevrilir, katkı ay sonunda eklenir. Toplam katkı ile varsayımsal artış/kayıp ayrı gösterilir; %0 ve negatif oranlar da denenebilir. Masraf, vergi, enflasyon ve gerçek piyasa oynaklığı dahil değildir.

Hesaplayıcılar bütçe hesabına işlem eklemez. El kitabının metin sürümü `FINANS-EL-KITABI.md` içindedir. İçeriğin kaynak kontrol tarihi 6 Ekim 2026’dır; güncel faiz, vergi oranı veya yatırım getirisi vaat edilmez.


## Finans teması ve gezinme

Finans menüsündeki **Finans ayarları → Finans teması** seçimi kaydedilir:

- **Modern finans:** Sabit profesyonel palet, sistem yazısı ve sol bölüm menüsü. Nero’nun dış çerçevesi mevcut uygulama temasında kalır.
- **Nero temasına uyumlu:** Bütçe, mevcut Nero temasının renk, yazı ve yüzeylerini kullanır. Uygulama temasını değiştirdiğinde finans görünümü de uyarlanır.

İki görünüm de aynı verileri kullanır. Menüler içerik kaydırılırken görünür kalır; sağ/sol ay okları seçili dönemi değiştirir. Tarih girişleri GG.AA.YYYY biçimindedir. Yeni kayıtların başlangıç tarihi bugündür; istediğin tarihe değiştirilebilir.

## Maaş ve otomatik abonelik

Gelir ekle’de **İleride gelecek**, hesap, tutar ve tarih seç. Para henüz gerçekleşmiş gelir değildir. **Tarihi gelince otomatik kaydet** açıksa o gün Nero bakiyesi güncellenir; kapalıysa Alındı ile onaylanır. Nero bankaya bağlanmaz ve para transferi yapmaz.

Netflix gibi aboneliklerde Gider ekle → Tekrarlansın → Her ay seç. Gelecek ilk ödeme için İleride ödenecek, daha önce gerçekleşmiş ilk ödeme için Ödendi kullan. Otomatik kayıt açıkken uygulamanın kapalı kaldığı sürede vadesi gelen kayıtlar yeniden açılınca yakalanır; aynı tarih tekrar yazılmaz. Çok eski bir günlük planda işlem grubu 250 kayıtla sınırlıdır ve sonraki kontrolle devam eder. Aylık 31 gibi tarihler kısa ayda son güne uyarlanır; sonraki ayda asıl gün korunur.

Düzenli kaydı duraklatmak gelecekteki otomatik kayıtları durdurur. Bankadaki gerçek aboneliği iptal etmez. Geçmiş ödemelerin ardından fiyat değişirse Düzenle → Yeni tekrar tutarı ve başlangıç tarihi gir; geçmiş kayıtlar değiştirilmez.

## Mevcut para ve borç

**Mevcut paran** yalnız güncel nakit ve banka bakiyelerinin toplamıdır. **Toplam taksit borcu** gelecekte ödenecek kalan taksitlerin toplamıdır; mevcut banka parasından topluca düşülmez. **Bu ay ödenecek**, seçilen ayın henüz kaydedilmemiş nakit/banka giderleri ve planlı kart ödemeleridir. **Ödemeler sonrası kalan** mevcut paradan bunları düşer; henüz gelmemiş gelir eklenmez.

Örnek: 50.000 TL banka, 60.000 TL toplam taksit borcu ve bu ay 10.000 TL taksit varsa mevcut para 50.000 TL, ödeme sonrası tahmin 40.000 TL’dir. Kart alışverişi toplam tutarı satın alma tarihinde bir kez gider/borç oluşturur; taksit transferi gideri tekrar artırmaz. Herhangi bir ekstreyi Nero otomatik içe almaz; banka ekstresinden bilinmeyen ücret ve borçlar bu tahmine otomatik eklenmez.

Taksit borçları ayrıntısında toplam kalan, ödenen tutar, taksit sayısı ve her vade görünür. Yanlış ödeme için **Geri al** bakiyeyi düzeltir ve taksiti tekrar bekleyen yapar. Geri alınan otomatik ödeme, bilerek yeniden onaylanana kadar otomatik yazılmaz. Planı duraklatmak toplam gerçek borcu silmez.

Yaklaşan ödemeler, bulunulan ay ve sonraki ayla sınırlıdır. Daha eski ödenmemiş kayıtlar Gecikmiş başlığında bulunur. Takvim oklarıyla başka aylar incelenebilir. Gelirler/Giderler seçimi o ayın tam listesini sayfalayarak gösterir; önceki ay farkı para ve yüzde olarak hesaplanır. Önceki ay sıfırsa sahte bir yüzde verilmez.

## Bildirim günleri ve marka ikonları

Finans ayarlarında 1 hafta önce, 1 gün önce ve ödeme günü ayrı ayrı seçilebilir. Varsayılan üçü de açıktır; saat 09:00’dır. Saat bilgisayarın yerel saatidir. Uygulama seçilen saatten sonra aynı gün açılırsa hatırlatma gelir; eski günlerin bildirimleri topluca gönderilmez. Ekran kilitliyken bildirim bekletilir; uygulama tamamen kapalıyken bildirim gönderilmez. Her plan/vade/hatırlatma günü yalnız bir kez bildirilir.

İşlem ve düzenli plan formlarında 100 çevrimdışı firma ikonu vardır. Netflix, YouTube ve ChatGPT dahildir. Firma adından otomatik eşleşir veya ikon seçicisinden seçilebilir. İkon seçicisi form taslağını korur. Marka varlıkları ve atıfları `MARKA-IKONLARI.md` içindedir.

İleri tarihli kayıtlar bugünkü gelir/gider toplamına ve bütçe kullanımına dahil edilmez. Gelecek gelir/ödemeler projeksiyonda, kayıt listesinde ise Gelecek tarihli etiketiyle görünür.
