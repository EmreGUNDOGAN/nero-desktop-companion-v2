# Arıcılık — Kilitlenen Yeni Sistemler

> **ARŞİV NOTU (6.6.0):** Bu dosya geçmiş bir tasarım/kilitleme kaydıdır; aşağıdaki sayısal değerler güncel oyun kuralı kaynağı değildir. Güncel davranış için `docs/ARICILIK-REHBERI.md`, `src/main/bee.js` ve 6.6.0 regresyon testleri esas alınır.

Durum: Tasarım kararları kayda alındı. Bu dalda **Çiçek Ekosistemi + yeni Kovan Paneli** uygulanacak; diğer maddeler sonraki adımlarda tek tek işlenecek.

## 1. Arıcılık Atölyesi — KİLİTLİ / SONRAKİ MADDE

- Köy ilerledikçe açılan fiziksel bir **Arıcılık Atölyesi** binası olacak.
- Temel sistem Mumcu ile açılacak; Eczane, Arıcılar Derneği, Köy Serası ve ileri köy aşamaları yeni tarif kategorileri açabilecek.
- Üretim **gerçek zamanla değil oyun zamanı** ile ilerleyecek.
- Başlangıçta 1 aktif üretim ve sınırlı üretim kuyruğu olacak.
- Bal kavanozları, mum, propolis ürünleri, polen ürünleri, aromalı bal ve ileri aşamada hediye setleri gibi işlenmiş ürünler üretilecek.
- İşlenmiş ürünler ham bal pazarından ayrı ekonomi kullanacak; normal bal pazarındaki bütün çarpanları zincirleme almaları engellenecek.
- Oyuncunun henüz açmadığı / ilk kez üretmediği bir işlenmiş ürün sipariş havuzuna girmeyecek.
- Mevcut mum üretimi Atölye açıldığında Atölye sistemine taşınacak; mevcut mum ve balmumu kayıtları korunacak.
- Köylü meslekleri işlenmiş ürün siparişleriyle bağlanacak (Pastane, Eczane, Mumcu, Reçelci, Bakkal, Muhtarlık vb.).
- Rehbere ayrı ve ayrıntılı **Arıcılık Atölyesi** bölümü eklenecek: açılma şartları, seviyeler, kuyruk, oyun zamanı, tarifler, malzemeler, fiyat mantığı ve sipariş ilişkileri.

## 2. Kış Bal Fiyatı — KİLİTLİ / SONRAKİ MADDE

- Kış mevsiminde bal satış fiyatı artık **+%35 değil +%15** olacak.
- Gerçek fiyat katsayısı ve bu değeri anlatan bütün rehber / tooltip / metinler birlikte güncellenecek.
- Mumların ayrı kış fiyat kuralı bu madde kapsamında değişmeyecek.

## 3. Polen, Propolis ve Arı Sütü — KİLİTLİ / SONRAKİ MADDE

Yeni gerçek arıcılık hammaddeleri:
- 🌼 Polen — yaygın
- 🟤 Propolis — daha nadir
- 🥛 Arı Sütü — çok nadir

Temel kurallar:
- Yan ürünler **hasat tıklaması başına rastgele drop olmayacak**.
- Kovan gerçek bal üretirken arka planda üretim miktarına orantılı olarak birikecek.
- Hasatta, kovandaki balın ne kadarı alındıysa yan ürün rezervlerinin de aynı oranı oyuncuya aktarılacak.
- Böylece 100 g balı 100 kez hasat etmek ile 10 kg balı bir kez hasat etmek ekonomik olarak aynı sonucu verecek; mikro-hasat exploit'i olmayacak.
- Ondalıklı gramlar içeride korunacak; ekranda okunabilir gram değerleri gösterilecek.
- Yan ürünler normal bal deposu kapasitesini tüketmeyecek; ayrı **Arıcılık Malzemeleri** envanterinde tutulacak.
- Ham Polen / Propolis / Arı Sütü normal pazarda doğrudan para için satılmayacak.
- Ana kullanım alanları Atölye, kovan bakımı ve özel siparişler olacak.
- Yakup'un hazır Polen Keki, Özel Polen Karışımı, Propolis Kalkanı ve Arı Sütü gibi ürünleri korunacak; oyuncu para verip hazır almak veya kendi hammaddesiyle üretmek arasında seçim yapacak.
- Polen: Polen Keki / Özel Polen Karışımı.
- Propolis: Propolis Kalkanı / Propolis Merhemi.
- Arı Sütü: mevcut 3 gün boyunca +1 arı etkisinin üretilebilir karşılığı; ileride kraliçe sistemi için ana kaynak olmaya uygun.
- Kovan panelinde **Yan Ürün Potansiyeli** açıklanacak; oyuncudan kuralları ezberlemesi beklenmeyecek.

## 4. Çiçek Ekosistemi ve Tozlaşma — BU DALDA UYGULANACAK

### Mekanik
Her kovanın menzilindeki aktif tarhlar üzerinden ekosistem hesaplanacak.

**Biyoçeşitlilik bonusu**
- 0–1 farklı tür: bonus yok.
- En az 2 farklı tür ve baskın tür oranı <%80: **+%4 bal üretimi**.
- En az 3 farklı tür ve baskın tür oranı <%70: **+%8 bal üretimi**.

**Monokültür baskısı**
- Menzilde en az 5 aktif tarh varsa ve tek tür tarhların ≥%80'ini oluşturuyorsa monokültür baskısı oluşur.
- Bal üretimini doğrudan düşürmez.
- Kovanın doğal hastalanma riskini küçük ölçüde **%5 göreli artırır**.
- İleride yan ürün sistemi açıldığında Polen tarafıyla bağlantı kurulabilecek; bu dalda henüz sahte Polen ekonomisi eklenmeyecek.

### Kovan paneli
Mevcut tasarım dili korunacak; yeni bir oyun stili yaratılmayacak.

Kovan paneline sekmeler:
- **Genel**
- **Ekosistem**
- **Yan Ürün**
- **Üretim**
- **Ayrıntılar**

**Genel:** mevcut arı, bal, ırk, erzak, hasat ve kovan işlemleri korunur.

**Ekosistem:**
- Biyoçeşitlilik seviyesi ve gerçek bonusu.
- Monokültür durumu ve varsa etkisi.
- Menzildeki aktif çiçek türleri ve adetleri.
- Baskın çiçek ve oranı.
- Oyuncunun bonusu / riski neden aldığı açık metinle gösterilir.

**Yan Ürün:**
- Yan ürün sistemi henüz kodlanmadığı sürece bunun gelecekte açılacağı açıkça belirtilir; sahte değer gösterilmez.

**Üretim:**
- Saatlik üretim.
- Mevcut gerçek buff/debuff listesinin panel içinde sürekli okunabilir görünümü.
- Biyoçeşitlilik bonusu da gerçek üretim formülünden gelen bir buff olarak listelenir.

**Ayrıntılar:**
- Kraliçe, ırk, kapasite, erzak, bağışıklık / hastalık bilgileri ve kovanın diğer durum özeti.

### Tarh bilgisi
Tarha tıklandığında:
- Yakındaki hangi kovanların ekosistemine katkı verdiği.
- Biyoçeşitlilik katkısı olup olmadığı.
- Varsa bulunduğu bölgede monokültür baskısı bilgisi gösterilecek.

### Görsel yaşam
- Yüksek biyoçeşitlilik alanları görsel olarak biraz daha canlı hissedilecek.
- Mevcut 3D sanat dili korunacak.
- Kelebek / uğur böceği gibi hafif ambient detaylar yüksek ekosistemli alanlarda sınırlı şekilde kullanılabilir; performans ağırlaştırılmayacak.

## Sonraki büyük fikir — Bu patch kapsamında değil

**Araştırma / Arıcılık Bilgisi Ağacı** daha sonraki büyük geliştirme için saklanacak. Klasik RPG skill tree yerine Arıcılık Defteri / araştırma panosu görünümü hedefleniyor; QoL ve bilgi açan küçük uzmanlaşmalar verecek.
