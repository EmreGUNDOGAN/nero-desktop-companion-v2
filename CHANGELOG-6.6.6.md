# Nero 6.6.6

Kaynak paketi: mevcut 88 kıyafet korunarak 100 yeni kıyafet eklendi. Beş yeni temanın her birinde 20 kıyafet bulunur. Toplam katalog: 188; kullanıcı tarafından seçilebilir kıyafet: 172.

## Kıyafet dolabı

- Temel olarak kullanıcının 6.6.2 kaynak paketi alındı. Önceki 88 kıyafetin görsel dosyaları korundu.
- Mevcut dolabın kart düzeni ve Nero üzerinde giyilmiş önizlemeleri korundu.
- Retro Gardırop, Masal Dünyası, Cozy Ev Hayatı, Uzay ve Bilim ve Absürt Şıklık için ayrı sekmeler eklendi. Her temada 20 yeni çizim bulunur.
- Yeni gövdeler yüzü boş çiziliyor; bakış, göz kırpma, kaş ve konuşma katmanları ayrı kalıyor. Tam karakter portresi, animasyonlu karakterin yerine kullanılmıyor.
- Kıyafet değişimi bütün katmanlar yüklenince birlikte uygulanıyor. Gece rastgele pijama ve zorunlu özel gün kıyafeti kuralları korunuyor; gündüz seçimi kaybolmuyor.

## Hareketler

- 6.6.4'teki 13 hareketin oynatıcısı ve tetikleme kuralları aktarıldı: gülüşünü bastırma, düşünme, merakla bakma, dengeyi toparlama, zafer, tempo tutma, küsme, yan bakma, sevilme, utanma, esneme, uyuklama ve dans.
- Gövdeden parça kesmek yerine bağlı bir çizim yüzeyi kullanılıyor. Kıyafetli kol hareketleri, dikişlerin ayrılmaması için daha küçük açıyla uygulanıyor; önceki bağımsız vektör kolların geniş hareketleri birebir kullanılmıyor.
- Ayarlara aç/kapat ve hareketleri deneme düğmeleri eklendi. Uyku, gizlenme, sürükleme ve kıyafet değişimi aktif hareketi temizliyor.
- Geç yüklenen gövdenin hareket katmanına bağlanması ve yenileme sırasında iç içe sıfırlama sorunları düzeltildi.
- Grafik desteği başarısız olduğunda normal gövde görünür kalır; bağımsız kol/ayak hareketi yerine yüz ve gövde hareketleri sürer.

## Oyun düzeltmeleri

- 6.6.3/6.6.4'teki kesirli stok ve sipariş rezervasyonu düzeltmeleri korundu.
- Atölye maliyetleri gerçek malzemeye göre hesaplanıyor; parti değeri ağırlıklı olarak saklanıyor.
- Bir günden kısa üretim süreleri korunuyor. Yan ürün siparişlerinin üretici ve stok uygunluğu kontrol ediliyor.
- Sipariş süre tahminlerinde hız sınırı, duraklama ve ayrılmış stok dikkate alınıyor.

## Doğrulama sınırı

273 kod testi geçti; 100 yeni kıyafet toplu durağan önizlemelerde kontrol edildi. Eski görsel dosyalarının aynı kaldığı SHA-256 karşılaştırmasıyla doğrulandı. Bu ortamda Windows uygulaması, kurulum EXE'si ve canlı Electron/WebGL görünümü doğrulanmamıştır. Kaynak paketi bu sınırı açıkça bildirir.

## Arayüz temaları — aynı 6.6.6 sürümü

- Tema paketi ayrı bir 6.6.7 olarak değil, Nero 6.6.6 içinde yayınlanacak.
- İlk yeni arayüz teması `Nero OS ’98` eklendi. Bugün, Notlar, İşler, Sayaç ve Rozetler sayfaları klasik masaüstü işletim sistemi metaforuna dönüştürülür.
- Rozet çizimleri korunur; tema yalnızca rozetlerin çevresindeki pencere ve sekme dilini değiştirir.
- Yerleşik UI temalarının varsayılan Nero karakter katmanlarını dosya çoğaltmadan miras alabilmesi için tema yöneticisine güvenli `inherits` desteği eklendi.
- Varsayılan 440×660 panel düzeni korunur; dar panel için özel sıkıştırma kuralları bulunur.
- İkinci yeni arayüz teması `Erteleme Bakanlığı` eklendi: numaralı evrak kartları, işlem sırası, mesai takip formu ve hizmet kayıtları beş ana sayfaya yayıldı.
- `Radyo Nero` eklendi: fiziksel preset sekmeleri, dinleyici istek kartları, yayın akışı ve analog frekans/sinyal dili tüm ana sayfalara uygulanır.
- `Son Seans Sineması` eklendi: senaryo sayfaları, çekim listesi, film geri sayım/seans paneli ve ödül duvarı ile sinema metaforu işlevlere bağlandı.
- `Gece Ekspresi` eklendi: bilet/yolculuk notları, durak çizelgesi, rota hattı ve istasyon saati aynı gece treni dilinde birleşir.
