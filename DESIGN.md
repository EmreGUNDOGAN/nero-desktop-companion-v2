# Nero finans tasarım kuralları

Finans masaüstü penceresi için tasarlanır: 440 × 660 temel boyut; küçük ve geniş pencerelerde de okunabilir. Finans tema seçimi Nero'nun genel tema tercihinden bağımsızdır.

## Görünümler

- `nero`: genel Nero temasının tipografisi, renkleri ve yüzeyleri.
- `modern`: sabit açık renkler ve sol finans menüsü.
- `cards`: sabit açık kart görünümü ve üst finans menüsü.
- `premium-black`: kömür siyahı yüzeyler, limon yeşili ana vurgu, lavanta grafikler ve kırmızı gider/uyarı tutarları.

Premium Black sekiz finans sayfasını, bütün yerel finans diyaloglarını ve yalnız Bütçe açıkken uygulama çerçevesini kapsar. Bütçeden çıkılınca normal Nero görünümü geri gelir. Seçim ayarlarda saklanır; kullanıcı verilerini değiştirmez.

## Bileşenler

Renk, ölçü ve boşluk değerleri `budget-tokens.css` dosyasında tutulur. Ortak yapı `budget-modern.css`, kart/premium yapıları `budget-premium.css`, SVG ikonları `budget-icons.js` dosyasındadır. Aynı işlem, plan, grafik, takvim, hedef ve ders bileşenleri tüm görünümlerde kullanılır.

Sabit menü ve kaydırılabilir içerik ayrı alanlardır. Aktif menü durumu ve klavye odağı belirgindir. Ok/Home/End tuşlarıyla finans sekmelerinde gezinilir. Aktif menü renkleri geçiş sırasında düşük kontrasta düşmez. Hareket azaltma tercihi uygulanır.

Hesapların gerçek kayıtları üst sıradadır; açıklama gerektiğinde açılır. İşlem ayrıntıları diyalogdan düzenlenir; diyaloglarda başlık ve eylemler erişilebilir kalır. Gelir/gider türleri renk yanında işaret ve metinle belirtilir.

Mevcut para, beklenen gelir, ödenecek tutar ve toplam borç farklı değerlerdir. Tema değişimi hesaplamayı veya kayıtları değiştirmez. Önizleme verileri yalnız testlerde bulunur.

Marka ikonları yereldir; koyu görünümde okunabilir bir yüzeyde gösterilir. Ağ olmadan kullanılabilir. Yeni dekoratif gradyan, parıltı, gürültü veya gölge kullanılmaz. Grafik renkleri tokenlardan alınır. Özgün tasarımlar doğrudan kopyalanmaz.

Dış kaynaklar ve uygulanan ilkeler `docs/FINANS-TASARIM-REFERANSLARI.md` dosyasında belgelenir.
