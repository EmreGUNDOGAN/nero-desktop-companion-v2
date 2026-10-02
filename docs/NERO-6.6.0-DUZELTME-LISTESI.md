# Nero 6.6.0 — Düzeltme ve Sağlamlaştırma Listesi

Bu dosya 6.6.0 için kanonik düzeltme kontrol listesidir. Amaç 6.5.0 sonrasında yapılan derin kod denetiminde bulunan bütün açıkları tek sürümde kapatmak, backend/UI/rehber/test davranışını aynı kurala bağlamak ve eski kayıtları bozmamaktır.

## A. İlk denetimde bulunan 9 sorun

- [x] Arı al-sat ve geçmiş \`invested\` birikimi net değeri yapay olarak yükseltmemeli; canlı varlık/likidasyon temelli defter değeri kullanılmalı.
- [x] Solmuş veya 10 saniyelik geri alma penceresindeki tarhlar 3'lü tarh bonusuna girmemeli.
- [x] Atölye kabul edilmiş siparişler için ayrılmış balı tüketememeli.
- [x] Atölye kuyruk iptali depo kapasitesini aşan bal iadesi yapamamalı.
- [x] Fırın/Pastane/Muhtarlık özel siparişleri toplam sipariş limitini aşamamalı.
- [x] Hiçbir kovana ulaşmayan çiçek türlerinden normal/özel sipariş üretilmemeli.
- [x] 500+ jetonluk tekli/toplu canlandırma pahalı işlem onayına girmeli.
- [x] Rakip simülasyonu gerçek tarh/ekim maliyeti, depo kapasitesi ve yatırım maliyetlerini hesaba katmalı.
- [x] Turnuva oyuncu/rakip ölçümleri aynı tür gerçek çiftlik verileri üzerinden yürümeli.

## B. İkinci derin denetimde bulunan 18 sorun

- [x] Odak Bonusu backend, Etkilerim, üst gösterge, rehber ve fallback metinlerinde tek değer: **+%10**.
- [x] Rehberde canlandırma **%25**, ekosistem **+%6 / +%12 / -%8 ve ×1.15 hastalık riski**, yan ürün/Atölye gerçek sistem olarak anlatılmalı.
- [x] Turnuva rehberi 6.5+ gerçek formül ve **750 / 500 / 250** ödüllerle eşleşmeli; rakiplerin ortak kategori hesaplayıcısını kullandığı yazılmalı.
- [x] 5 dakikalık gerçek-zaman sipariş sistemi uzun event-loop/uyku/uygulama kapanışı sonrası açılışta en fazla 3 sipariş catch-up yapmalı; 2x/4x bunu hızlandırmamalı.
- [x] Eski şişmiş rakip kayıt migrasyonu \`honeyByFlower\` stokunu da gerçekten küçültmeli.
- [x] Siparişe ayrılmış bal koruması pazar, Atölye, Seyyah Yakup ve turnuvada merkezi kural olmalı.
- [x] İadeler depo limitini aşmamalı; sığmayan festival iadesi kaybolmadan beklemeye alınmalı.
- [x] Rakip turnuva girişi gerçek stoktan bal düşürmeli; derece alan rakip ödül jetonunu da ekonomisine eklemeli.
- [x] Rakip hastalığı tek günlük soyut kayıp yerine hastalık süresi, üretim cezası, ölüm limiti, 4 arı tabanı ve bağışıklık modeline yaklaşmalı.
- [x] Özel siparişler sahte müşteri/kalp oluşturmamalı; Dostluk Jetonu/Öncelikli Kart yalnız normal köylü siparişinde tüketilmeli.
- [x] \`undoPending\` tarhlar ve solmuş tarhlar görev/sipariş/cluster sistemine sızmamalı.
- [x] Günlük görev üreticisi yalnız gerçekten yapılabilir hedefler oluşturmalı; üretim menzili, stok, para ve Yakup uygunluğu dikkate alınmalı.
- [x] Net değer geçmiş harcama toplamı değil mevcut varlık değeri üzerinden hesaplanmalı; tohum/dekor/yan ürün/şurup gibi eldeki varlıklar kaybolmamalı.
- [x] Eski kayıtta depo yatırımı kupon geçmişi bilinmiyorsa nominal tam fiyat net değere yazılmamalı.
- [x] \`counters.earned\` günlük görev, hikâye ve mektup jetonlarını da kapsamalı.
- [x] Pazar Tahmini yarının yalnız çarpanını değil mevsim ve devam eden etkinlik dahil **nihai fiyat yönünü** göstermeli.
- [x] Seyyah Yakup işlemleri atomik olmalı; özellikle Stok Değişim Jetonu başarısız olursa para/stok işaretleri değişmemeli.
- [x] Oyun kuralları mümkün olduğunca tek kaynaktan beslenmeli; en azından CI testleri backend, renderer ve rehber sabitlerinin ayrışmasını yakalamalı.

## C. 6.6.0 ek tutarlılık kararları

- [x] Arıcılık 2 saat hiç görülmezse üretim/takvim/rakip simülasyonu tamamen durur; UI ve rehberde tek değer kullanılmalı.
- [x] Bekleyen bal iadeleri net değerde sayılmalı ve depoda yer açıldığında otomatik içeri alınmalı.
- [x] Normal ve özel siparişlerin toplamı \`orderMax()\` sınırını aşmamalı.
- [x] Kabul edilmiş sipariş rezervasyonu dışındaki hiçbir sistem rezerve balı harcayamamalı.
- [x] 6.6.0 için yeni regresyon testleri eklenmeli ve tüm test paketi yeşil olmalı.
## D. Son doğrulama turunda yakalanan ek açıklar

- [x] Manuel \`speed = 0\` durumunda oyun simülasyonu dururken 5 dakikalık gerçek-zaman sipariş saati işlemeye devam etmeli.
- [x] Rakiplerin ilk mevsimde (\`seasonIndex = 0\`) tohum maliyetini her gün tekrar ödemesine yol açan falsy kontrol kaldırılmalı; mevsimde bir kez ücret alınmalı.
- [x] Rakip depo büyütmesi ücretsiz kapasite artışı yaratmamalı; gerçek depo yükseltme maliyeti ödenmeli.
- [x] Pazar ve Yakup butonları tam stok yerine sipariş rezervasyonu sonrası gerçekten satılabilir miktarı kullanmalı.
- [x] Pazar Tahmini arayüzü ham çarpanı değil yarının nihai jeton/kg fiyatını göstermeli.
- [x] Bekleyen festival iadeleri Depo arayüzünde görünür olmalı.
- [x] Oyun içi kısa rehberde kalan eski \`%10\` canlandırma metni \`%25\` ile eşitlenmeli.
- [x] Aktif proje özeti 2 saat, \`%25\` canlandırma ve Yakup \`+%15\` kurallarına güncellenmeli; tarihsel plan dosyaları arşiv olarak açıkça işaretlenmeli.

## E. Doğrulama

- [x] \`src/main/bee.js\` JavaScript syntax kontrolü geçti.
- [x] \`src/renderer/bee/bee.js\` JavaScript syntax kontrolü geçti.
- [x] 6.6.0 özel regresyon paketi **26/26** geçti.
- [x] Tam Node regresyon paketi **193/193** geçti.
- [x] Güncel oyuncu rehberi \`docs/ARICILIK-REHBERI.md\` ile \`OYUN-REHBERI.md\` aynı içerikte tutuldu.
- [x] 6.6.0 Windows artifact üretimi için ayrı GitHub Actions workflow dosyası hazırlandı; commit/push kullanıcının açık onayı olmadan yapılmayacak.
