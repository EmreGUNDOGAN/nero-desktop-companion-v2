# Nero 6.9.1 — Bütçe rehberi

## Kaynaktan çalıştırma

Node.js 22 veya daha yeni bir sürümle proje kökünde:

```sh
npm ci
npm start
```

Windows kurulum dosyasını yerel olarak üretmek için Windows üzerinde:

```sh
npm run dist
```

Kaynak paketinde `node_modules` ve derleme çıktısı bulunmaz. Üstteki komut bağımlılıkları indirir. Sürüm `package.json` ve kilit dosyasında 6.9.1'dir. Bütçe için yeni npm bağımlılığı eklenmedi.

## İlk kullanım

Ana menüden Bütçe'yi aç. İlk işlem ekleme düğmesi hesap oluşturmayı başlatır. Banka, nakit veya kredi kartı hesabını, para birimini ve başlangıç bakiyesini gir. Kartta başlangıç tutarı mevcut borçtur; otomatik eksi bakiye olur. Başlangıç bakiyesi aylık gelir değildir.

Sonra gelir/gider ekle. Üstteki dönem seçimi özet, bütçeler ve raporların ayını değiştirir. İşlemler sekmesi seçilen ayı başlangıç filtresi olarak kullanır; tarih filtrelerini değiştirerek daha geniş döneme bakabilirsin. Hesap bakiyeleri bugünü gösterir. Gelecek tarihli işlemler listede işaretlenir ve o tarihe kadar güncel hesap bakiyesini değiştirmez.

## İşlem kuralları

- Tutarlar en fazla iki ondalık içerir: `1250,50` veya `1250.50`. Kurlar en fazla altı ondalık içerir.
- Bir işlemi birkaç kategoriye bölüyorsan payların toplamı işlem tutarıyla aynı olmalı.
- İade giderden düşülür. Bir harcamaya bağlı iadelerin toplamı o harcamayı aşamaz. Bağlı iade varken ilk harcama silinemez; önce iadeyi kaldır.
- Transferde kaynak ve hedef hesap farklı olmalı. Aynı para biriminde hedef tutarı eşitlenir; farklı para biriminde hedefe geçen gerçek tutarı ayrıca gir.
- Kart borcu ödemesi banka/nakitten karta transferdir. Kart alışverişi gider kaydedilir; borcu ödeme gideri ikinci kez artırmaz.
- Kart taksit planında alışveriş toplam tutarı alışveriş tarihinde gider/borç kaydedilir. Ödemeler karta transferdir. Banka/nakit taksitleri ödendikçe gider olur. Kuruş farkları taksitler arasında dağıtılır.
- Planlanan ödemeler kendiliğinden işlem oluşturmaz. Ödendi/Alındı ile gerçek tarihini kaydet. Aynı plan tarihi iki kez ödenemez. Ödeme içeren planın mali alanları korunur; duraklatıp yeni plan ekleyebilirsin.
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

Vade bildirimi uygulama açıkken ve ekran kilitli değilken 30 saniyelik kontrol sırasında gelir. Aynı plan/vade için bir kez bildirilir. Bildirim tutar ve hesap adı göstermez. Windows bildirim ayarları bildirimin görünürlüğünü belirler; uygulama kapalıyken zamanlanmış bildirim gönderilmez. Gecikmiş ödemeler Ödemeler sekmesinde görünür.

## Doğrulama

```sh
npm test
```

Electron ile arayüz testi:

```sh
npx electron test/budget-ui-smoke.js
```

Testler gerçek bütçe motorunu ve IPC'yi kullanır; pencere görünmeden formlar, fiş, CSV, yedek ve PDF çalıştırılır. Linux ortamında başsız kullanım için `--no-sandbox --disable-gpu --ozone-platform=headless` parametreleri kullanılabilir. Bu testlerde sistem dosya seçim pencereleri kontrollü test dosyalarıyla değiştirilir.