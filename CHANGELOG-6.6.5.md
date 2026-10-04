# Nero 6.6.5

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
