# Nero finans tasarımı

440 × 660 masaüstü penceresi temel boyuttur; içerik kaydırılır ve büyük pencerede genişler. Finans görünümü Nero'nun genel temasından bağımsız saklanan, geri alınabilir bir tercihtir. Kullanıcı kayıtları tema seçiminden etkilenmez.

## Premium Black

Kullanıcının paylaştığı @reddiodesigns Analytics / Saving Plans görseli bu görünümün esas referansıdır. Önceki Nero ekranının yalnız renk değiştirmesi yeterli değildir. Premium Black'in sayfa hiyerarşisi ve grafik geometrisi ayrı olarak uygulanır:

- Büyük kutuya alınmayan beyaz bakiye, Tümü/Gelir/Gider/Birikim kapsülleri.
- Gerçek aylık örneklerden geçen, taşma yapmayan ince limon yeşili ve lavanta Bézier eğrileri; seçilebilir aylar ve tutarlar. Kayıt yokken sıfır çizgisi ve açıklama; sahte dalga yok.
- Yuvarlak ikonlu gelir/gider özetleri ve lavanta önceki ay karşılaştırması.
- Kalın, yuvarlak uçlu, boşluklu birikim/harcama halkası; gerçek paylar ve merkez toplamı.
- Kompakt hedef satırlarında tutar/tarih, ince ilerleme çubuğu ve para ayırma eylemi; kapsül biçiminde yeni hedef düğmesi.
- Hesap kartları, filtrelenebilir işlem geçmişi, ödeme akışı, raporlar, yuvarlak tarihli takvim ve ders ilerlemesi aynı tipografi, yüzey ve ikon dilini kullanır.

Mobil çerçeve kopyalanmaz. Nero'nun sekiz finans bölümü, fare/klavye erişimi ve kayıt düzenleme davranışları korunur. Geniş pencerede özet iki sütuna yerleşir; küçük pencerede tek sütunda kayar. Finans menüsü kaydırmadan bağımsızdır. Ok/Home/End tuşlarıyla bölüm seçimi; grafik aylarında klavye odağını koruyan düğmeler; azaltılmış hareket tercihi desteklenir.

## Kaynak yapısı

- `budget-tokens.css`: tüm görünüm renkleri, ölçüler ve boşluklar.
- `budget-premium-redesign.css`: Premium Black'in sayfa, grafik, menü ve diyalog yerleşimi.
- `budget-premium-charts.js`: örneklerden eğri oluşturma, halka yayları ve tam sayı kur dönüşümü; saf fonksiyonlar.
- `budget-premium-view.js`: sekiz sayfanın Premium Black sunumu.
- `budget.js`: mevcut olay, form, filtre ve finans motoru bağlantıları.
- `budget-icons.js`: yerel SVG ikonları; marka ikonları ayrı yerel dosyalardır.

`nero`, `modern`, `cards` görünümleri kendi yerleşimlerini korur. Premium Black yalnız Bütçe açıkken uygulama çerçevesini değiştirir; çıkınca normal Nero görünümü döner. Ayarlar, işlem, plan, taksit, ders, hesaplayıcı ve yardım diyalogları da koyu temayı kullanır.

## Finans anlamı

Mevcut banka/nakit para, hedef rezervleri, beklenen gelir, ödeme ve toplam borç ayrı kavramlardır. Başlangıç bakiyesi gelir sayılmaz. Birikime ayırma hesap içi rezervdir; yeni işlem üretmez. Halka toplamı mevcut kurla temel paraya dönüştürülür; eksik kurlar hariç tutulur ve açıklanır. Negatif net kategori giderleri halkaya girmez, ayrıntılı dökümde görünür. Boş ekrana sahte veri konmaz. Önizleme örnekleri yalnız geçici test verileridir.
