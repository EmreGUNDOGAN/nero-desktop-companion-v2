# Nero finans tasarımı

## Finans Merkezi

Kullanıcının sağladığı FinancialDashboard React bileşenini ve ardından paylaştığı koyu renk referansını temel alan yeni finans görünümü. Siyah dış zemin, antrasit kartlar, gri ikon alanları, beyaz metinler ve yeşil/kırmızı tutarlar kullanılır. Arama, yuvarlak hızlı eylemler, gerçek marka ikonlarıyla hizalı işlem satırları ve yönlendiren araç kartları sekiz Bütçe sayfasına uyarlanır. Ayrıntılar ve kaynak yapısı `docs/FINANS-MERKEZI.md` içindedir. Mevcut dört finans görünümü korunur; seçim kayıtları değiştirmez.

440 × 660 masaüstü penceresi temel boyuttur; içerik kaydırılır ve büyük pencerede genişler. Finans görünümü Nero'nun genel temasından bağımsız saklanan, geri alınabilir bir tercihtir. Kullanıcı kayıtları tema seçiminden etkilenmez.

## Premium Black

Kullanıcının paylaştığı @reddiodesigns Analytics / Saving Plans görseli bu görünümün esas referansıdır. Önceki Nero ekranının yalnız renk değiştirmesi yeterli değildir. Premium Black'in sayfa hiyerarşisi ve grafik geometrisi ayrı olarak uygulanır:

- Büyük kutuya alınmayan beyaz bakiye, Tümü/Gelir/Gider/Birikim kapsülleri.
- Gerçek günlük veya aylık kayıtlardan geçen, taşma yapmayan ince limon yeşili ve lavanta Chart.js Canvas eğrileri; seçilebilir aylar ve tutarlar. Kayıt yokken sıfır çizgisi ve açıklama; sahte dalga yok.
- Yuvarlak ikonlu gelir/gider özetleri ve lavanta önceki ay karşılaştırması.
- Kalın, yuvarlak uçlu, boşluklu birikim/harcama halkası; gerçek paylar ve merkez toplamı.
- Kompakt hedef satırlarında tutar/tarih, ince ilerleme çubuğu ve para ayırma eylemi; kapsül biçiminde yeni hedef düğmesi.
- Hesap kartları, filtrelenebilir işlem geçmişi, ödeme akışı, raporlar, yuvarlak tarihli takvim ve ders ilerlemesi aynı tipografi, yüzey ve ikon dilini kullanır.

Mobil çerçeve kopyalanmaz. Nero'nun sekiz finans bölümü, fare/klavye erişimi ve kayıt düzenleme davranışları korunur. 680 CSS pikselinden itibaren sol menü ve iki sütun kullanılır; küçük pencerede kompakt üst menü ve tek sütun vardır. 900 piksel pencerede yüzde 125 ölçek ayrıca kontrol edilir. Finans menüsü kaydırmadan bağımsızdır. Ok/Home/End tuşlarıyla bölüm seçimi; grafik aylarında klavye odağını koruyan düğmeler; azaltılmış hareket tercihi desteklenir.

## Kaynak yapısı

- `budget-tokens.css`: tüm görünüm renkleri, ölçüler ve boşluklar.
- `budget-premium-react.css`: HTML bileşenlerinin sayfa, menü ve diyalog yerleşimi; kapsüller, lavanta şerit deseni, hedef kartları.
- `premium/index.jsx`: sekiz finans sayfasının React bileşenleri; yerel veri motoru ve eylemlerle bağlantı.
- `premium/charts.js`: Chart.js Canvas çizgi, halka ve sütun grafikleri; CSS pikselinden bağımsız ekran yoğunluğu hesabı.
- `premium/data.js`: gerçek günlük/haftalık seriler ve tam sayı kur dönüşümü; dört birim testi.
- `budget-premium-app.js`: uygulamaya dahil edilmiş yerel üretim paketi; internetten kod yüklemez.
- `scripts/build-finance-ui.js`: JSX / Chart.js kaynaklarını esbuild ile derler (`npm run finance:build`).
- `budget.js`: mevcut olay, form, filtre ve finans motoru bağlantıları.
- `budget-icons.js`: yerel SVG ikonları; marka ikonları ayrı yerel dosyalardır.

`nero`, `modern`, `cards` görünümleri kendi yerleşimlerini korur. Premium Black yalnız Bütçe açıkken uygulama çerçevesini değiştirir; çıkınca normal Nero görünümü döner. Ayarlar, işlem, plan, taksit, ders, hesaplayıcı ve yardım diyalogları da koyu temayı kullanır.

## Finans anlamı

Mevcut banka/nakit para, hedef rezervleri, beklenen gelir, ödeme ve toplam borç ayrı kavramlardır. Başlangıç bakiyesi gelir sayılmaz. Birikime ayırma hesap içi rezervdir; yeni işlem üretmez. Halka toplamı mevcut kurla temel paraya dönüştürülür; eksik kurlar hariç tutulur ve açıklanır. Negatif net kategori giderleri halkaya girmez, ayrıntılı dökümde görünür. Boş ekrana sahte veri konmaz. Önizleme örnekleri yalnız geçici test verileridir.

## Uygulama yöntemi

React bileşen ve durum yapısını yönetir; CSS yerleşim, renk, tipografi ve şekilleri oluşturur. SCSS, CSS üreten bir ön işlemcidir; bu projede ayrıca gerekmez. Grafikler SVG olarak esnetilmez: Chart.js Canvas üzerinde tekrar hesaplayarak çizilir. Finans ikonları mevcut yerel SVG ikonlarıdır; grafik değildir.
