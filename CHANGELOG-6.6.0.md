# Nero 6.6.0 — Ekonomi ve Simülasyon Sağlamlaştırması

6.6.0, 6.5.0 sonrası yapılan derin denetimde bulunan ekonomi, sipariş, turnuva, rakip simülasyonu, depo ve rehber tutarsızlıklarını tek pakette kapatır.

## 🍯 Sipariş rezervasyonu ve depo güvenliği
- Kabul edilmiş siparişlere ayrılan bal artık tek merkezi kuralla korunur; Pazar, Arıcılık Atölyesi, Seyyah Yakup ve Mevsim Turnuvası bu balı harcayamaz.
- Pazar ve Yakup arayüzleri toplam stok yerine gerçekten satılabilir balı kullanır ve rezerve miktarı açıkça gösterir.
- Atölye üretim iptali depoyu kapasitenin üstüne çıkaramaz.
- Festival Güvencesi iadeleri depoya sığmıyorsa kaybolmaz; bekleyen iade olarak saklanır, net değerde sayılır ve yer açılınca otomatik depoya döner.
- Normal ve özel siparişler artık aynı toplam sipariş limitini paylaşır.

## ⏱️ Gerçek-zaman siparişleri ve görevler
- 5 dakikalık normal sipariş saati 1x/2x/4x hızdan bağımsız çalışır ve oyun manuel duraklatılmış olsa da gerçek zaman mantığını korur.
- Uygulama kapalı/askıda kaldıktan sonra geri dönüşte en fazla 3 normal sipariş catch-up yapılır.
- Siparişler yalnız gerçekten üretilebilen, aktif ve kovana erişen çiçek türlerinden oluşturulur.
- Günlük görev üreticisi menzil, üretilebilir kovan, rezerve olmayan stok, para ve Yakup uygunluğunu daha sıkı kontrol eder; yapılamaz hedefler azaltıldı.
- Solmuş ve 10 saniyelik geri alma penceresindeki tarhlar sipariş, görev ve 3'lü tarh bonusuna sızmaz.

## 🏆 Turnuva ve rakip simülasyonu
- Oyuncu ve rakipler aynı kategori hesaplayıcısını kullanmaya devam ederken rakipler artık turnuvaya gerçek stoklarından bal gönderir.
- Derece alan rakiplerin 750 / 500 / 250 🪙 turnuva ödülleri kendi ekonomilerine eklenir.
- Rakip çiftlikler tohum maliyetini mevsimde bir kez öder, depo kapasitesine uyar ve depo büyütmelerini gerçek maliyetle yapar.
- Rakip hastalığı artık süre, üretim cezası, ölüm sınırı, 4 arı tabanı ve bağışıklık durumunu taşıyan kalıcı bir modele bağlandı.
- Eski kayıtlardaki aşırı şişmiş rakip balı migrasyonu gerçek `honeyByFlower` stokunu da düzeltir.

## 💰 Net değer ve gelir muhasebesi
- Liderlik net değeri geçmişte harcanmış `invested` toplamı yerine mevcut varlıkların defter değerine dayanır.
- Canlı arılar, mevcut kovan yapısı, depo yatırımı, arazi, bal, tohumlar, ekili tarhlar, dekorlar, balmumu, Polen, Propolis, Arı Sütü, şurup ve Atölye ürünleri uygun şekilde varlık hesabına dahil edilir.
- Arı/kovan satışı geçmiş yatırım toplamından yapay değer üretmez.
- Eski kayıtlarda kupon geçmişi bilinmeyen depo yatırımları nominal tam fiyatla uydurulmaz.
- Günlük görev, hikâye, mektup, festival ve gerçek satış gelirleri `counters.earned` ile tutarlı hale getirildi.

## 🛒 Seyyah Yakup ve Pazar Tahmini
- Pazar Tahmini artık yalnız ham pazar çarpanını değil, yarının mevsimi, etkinliği ve geçerli fiyat kilidi dahil nihai satış fiyatını karşılaştırır.
- Tahmin arayüzü beklenen nihai jeton/kg fiyatını gösterir.
- Stok Değişim Jetonu başarısız olursa para veya stok durumu kısmen değişmez; işlem atomik hale getirildi.
- Yakup satış paneli rezerve ve satılabilir balı ayırır.

## 📖 Rehber ve UI tutarlılığı
- Odak Bonusu backend, üst gösterge, Etkilerim ve rehberde tek değer olan **+%10** ile eşitlendi.
- Solmuş tarh canlandırma maliyeti her yerde tohum fiyatının **%25'i** olarak gösterilir.
- Ekosistem rehberi gerçek **+%6 / +%12** biyoçeşitlilik, **-%8** monokültür üretim etkisi ve **×1.15** hastalık riskiyle eşitlendi.
- Turnuva rehberi mevcut kategori formülü ve **750 / 500 / 250** ödülleriyle güncellendi.
- Proje özeti 2 saatlik hareketsizlik sınırı, %25 canlandırma ve Yakup'un +%15 alım farkıyla güncellendi.
- Eski tasarım/plan belgelerine tarihsel arşiv notu eklendi; güncel oyun kuralı kaynağı olmadıkları açıkça belirtildi.

## 🧪 Regresyon güvenliği
- 6.6.0 için rezervasyon, depo taşması, offline sipariş catch-up, turnuva, rakip ekonomi, net değer, Yakup atomikliği, Pazar Tahmini ve rehber/UI eşleşmesini kapsayan yeni regresyon testleri eklendi.
- Tam Node test paketi 6.6.0 kaynak üzerinde yeşil doğrulandı.
