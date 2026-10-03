# Nero – Yeni Sistemler Implementasyon Spesifikasyonu

> **Durum:** Onaylı / henüz implement edilmemiş maddeler  
> **Amaç:** Kodlama sırasında tek referans dosyası olarak kullanılmak.  
> **Kural:** Bu dosyada “KİLİTLİ” olarak belirtilen kararlar kullanıcı onayı olmadan değiştirilmez.

---

## 1. Yeni Dükkân + Ürün Sistemi

### Temel Tasarım Kuralı

Köy dükkânları oyuncuya doğrudan bitmiş arıcılık ürünleri satmaz.

Dükkânlar kendi uzmanlık alanlarına ait **yarı mamul, baz ürün, ambalaj veya sunum malzemeleri** satar. Oyuncu bu ürünleri kendi ürettiği:

- Bal
- Balmumu
- Propolis
- Arı sütü
- Bal çeşitleri
- Diğer arıcılık hammaddeleri

ile birleştirerek daha değerli nihai ürünler üretir.

Bu sistemin amacı:

- Arıcılık üretimini ana oyun döngüsü olarak korumak.
- Köy dükkânlarını anlamlı hâle getirmek.
- İlerledikçe yeni üretim zincirleri açmak.
- Geç oyunda ekonomiye yeni para kazanma yolları eklemek.
- Köylülerin yalnızca dekoratif NPC olmamasını sağlamak.

---

## 2. Dükkân Açılış Sırası ve Ürünleri

| Açılış | Dükkân | Pazarda bize sattığı yarı mamuller | Bizim üretebildiğimiz ürünler |
|---|---|---|---|
| **6** | 🏪 **Bakkal** | Küçük Hediye Kutusu, Kavanoz/Paketleme Seti, Hediye Sepeti | **Bal Hediye Kutusu**, **Bal & Mum Paketi**, **Arıcılık Hediye Sepeti** |
| **7** | 🌷 **Çiçekçi Ezgi** | Kurutulmuş Lavanta, Kekik Demeti, Çiçek Karışımı | **Lavantalı Bal**, **Kekikli Bal**, **Lavanta Kokulu Mum**, **Çiçekli Bal Seti** |
| **9** | 🔨 **Arıcılık Atölyesi** | Temel üretim erişimi; Mumcu tarafından işletilir | Açılmış dükkân tariflerinin üretim merkezi |
| **12** | 🥧 **Pastane** | Sade Turta, Kek Tabanı, Tatlı Tabanı | **Ballı Turta**, **Lavantalı Ballı Kek**, **Kestane Ballı Kek**, **Ballı Tatlı** |
| **14** | 🍯 **Bal Dükkânı** | Tadım Kutusu, Premium Bal Kutusu, Özel Kavanoz | **3'lü Bal Tadım Seti**, **Premium Bal Kutusu**, **Özel Çiçek Balı Koleksiyonu** |
| **19** | ☕ **Kahveci** | Kahve Bazı, Kahve Şişesi, Kahve Hediye Paketi | **Ballı Kahve Şurubu**, **Ballı Soğuk Kahve Konsantresi**, **Bal & Kahve Hediye Seti** |
| **30** | 🥖 **Fırın** | Sade Çörek, Ekmek, Kurabiye Bazı | **Ballı Çörek**, **Ballı Ekmek**, **Ballı Kurabiye** |
| **37** | 🍦 **Dondurmacı** | Sade Dondurma Bazı, Dondurma Kabı | **Ballı Dondurma**, **Lavantalı Ballı Dondurma**, **Kestane Ballı Dondurma** |
| **44** | 💊 **Eczane** | Damlalık Şişesi, Pastil Bazı, Krem Bazı | **Propolis Damlası**, **Propolis Pastili**, **Propolis Kremi**, **Arı Sütlü Bakım Kremi** |
| **50** | 🫙 **Reçelci** | Meyve Bazı, Reçel Bazı, Premium Kavanoz | **Ballı Meyve Reçeli**, **Lavantalı Bal Reçeli**, **Kestane Ballı Reçel**, **Premium Bal-Reçel Seti** |
| **57** | 🪵 **Marangoz Atölyesi** | Ahşap Hediye Kutusu, Premium Sandık, Ahşap Sunum Kasası | **Ahşap Bal Seti**, **Arıcı Hediye Sandığı**, **Lüks Bal & Mum Sandığı** |
| **67** | 🍬 **Lokumcu** | Sade Lokum, Premium Lokum Bazı, Lokum Kutusu | **Ballı Lokum**, **Lavantalı Ballı Lokum**, **Arı Sütlü Ballı Lokum**, **Premium Lokum Kutusu** |

### KİLİTLİ Açılış Sırası

**6 Bakkal → 7 Çiçekçi Ezgi → 9 Arıcılık Atölyesi → 12 Pastane → 14 Bal Dükkânı → 19 Kahveci → 30 Fırın → 37 Dondurmacı → 44 Eczane → 50 Reçelci → 57 Marangoz → 67 Lokumcu**

---

## 3. Fiziksel Pazar Sistemi

### KİLİTLİ Kararlar

- Köyde belirlenen alana **fiziksel bir pazar** kurulacak.
- Oyuncu pazara iki yoldan erişebilecek:
  1. Mevcut **Pazar** butonu.
  2. Köy haritasındaki fiziksel pazar alanına tıklama.
- Her iki erişim şekli de aynı pazar sistemine açılmalı.
- Pazarda sürekli bulunan bir **pazarcı NPC** olacak.
- Pazar yalnızca bir UI butonu değil, köy dünyasının görünen bir parçası olacak.
- Dükkân sahipleri günlük olarak kendi dükkânlarından pazara fiziksel biçimde gidip ürün bırakacak.
- Bu hareketler görsel yaşam sisteminin bir parçası olacak.
- Pazarda oyuncuya satılan ürünler yukarıdaki tabloda belirtilen **yarı mamuller** olacak.
- Köy dükkânları oyuncunun arıcılık üretimini devre dışı bırakacak bitmiş ürünler satmayacak.

### NPC Hareketi

Dükkân sahibi:

**Dükkân → Pazar → ürün bırakma → normal günlük davranışına dönüş**

akışını kullanacak.

NPC hareketleri yalnızca dekoratif teleport olmamalı; mümkün olduğu sürece fiziksel yürüyüş/dolaşım sistemi kullanılmalı.

---

## 4. Yeni Ürünlerin Üretim Sistemi

Her nihai ürün için ayrı reçete tanımlanacak.

Her reçete en az şu alanlara sahip olmalı:

- Ürün ID
- Ürün adı
- Açıldığı dükkân
- Gerekli dükkân yarı mamulü
- Gerekli arıcılık hammaddesi
- Gerekli miktarlar
- Üretim süresi
- Üretim miktarı
- Nihai satış fiyatı
- Gerekirse özel kalite/çeşit şartı
- Kilit/açılış şartı

### Örnek Mantık

`Sade Çörek + Bal → Ballı Çörek`

Ancak gerçek implementasyonda miktarlar ekonomi dengesiyle birlikte ayrıca hesaplanmalı.

### KİLİTLİ Kural

Sadece ürün adı eklenmeyecek. Her yeni ürün:

**yarı mamul + arıcılık girdisi + süre + maliyet + satış değeri**

zincirine sahip olacak.

---

## 5. Üretim Penceresi / UI

Üretim ekranı özellikle **çok kolay anlaşılır ve hızlı kullanılabilir** olacak.

Oyuncu tek bakışta şunları görebilmeli:

- Ne üretiyorum?
- Bunun için ne gerekiyor?
- Her malzemeden elimde kaç tane var?
- Kaç tane gerekiyor?
- Şu anda maksimum kaç adet üretebilirim?
- Üretim ne kadar sürecek?
- Üretim sonunda kaç ürün elde edeceğim?
- Nihai ürünün değeri/satış fiyatı nedir?
- Eksik malzeme varsa hangisi eksik?

### Tasarım Kuralı

- Karmaşık crafting ağacı yapılmayacak.
- Mevcut oyunun görsel dilinden kopulmayacak.
- Gereksiz sekme ve ekstra tıklamalar eklenmeyecek.
- Eksik malzemeler net biçimde gösterilecek.
- Mevcut/yeterli malzemeler ayrı biçimde anlaşılacak.
- Üretim butonu oyuncunun üretim yapıp yapamayacağını açıkça göstermeli.

---

## 6. Fiyatlandırma ve Ekonomi Sistemi

### KİLİTLİ Prensip

Yeni ürünlerin fiyatları elle rastgele belirlenmeyecek.

Fiyatlandırma aşağıdaki bileşenleri dikkate alan tek ve tutarlı bir algoritmaya dayanacak:

1. Dükkândan alınan yarı mamulün maliyeti
2. Kullanılan balın / arıcılık hammaddesinin mevcut ekonomik değeri
3. Kullanılan miktar
4. Üretim süresi
5. Ürünün ilerleme seviyesi
6. Gerekirse nadirlik / premium sunum katsayısı
7. Oyuncuya bırakılacak hedef kâr marjı

### Amaç

- Oyuncu yeni ürün ürettiğinde zarar etmemeli.
- Geç açılan üretimler erken oyundaki ürünlerden anlamsız biçimde kötü olmamalı.
- En yüksek seviye ürünler ekonomiyi tamamen kıracak kadar yüksek kâr vermemeli.
- Ham bal satışı tamamen değersiz hâle gelmemeli.
- Üretim yapmak, ekstra emek ve zaman karşılığında ham ürün satışından daha avantajlı olmalı.

### Kodlama Öncesi

Tüm yeni yarı mamuller ve nihai ürünler için:

- alış fiyatı
- reçete maliyeti
- üretim süresi
- satış fiyatı
- net kâr
- saatlik efektif kâr

hesaplanmalı ve topluca kontrol edilmeli.

---

# 7. Gerçek Saatli Gün / Gece Sistemi

## Temel Kural

Gün/gece görsel döngüsü **oyun içi hızdan bağımsız** olacak.

1× / 2× / 4× gibi oyun hızları:

- Güneşi hızlandırmayacak.
- Ayı hızlandırmayacak.
- Gerçek saat tabanlı gökyüzünü değiştirmeyecek.

Gökyüzü oyuncunun **gerçek yerel saatine** bağlı çalışacak.

---

## 8. Işık Zaman Aralıkları

KİLİTLİ hedef aralıklar:

| Gerçek saat | Görsel durum |
|---|---|
| **06:45–09:00** | Şafak – pembe/serin ışık, hafif sis |
| **09:00–16:30** | Parlak gündüz |
| **16:30–19:15** | Gün batımı – sıcak/turuncu ışık, uzayan gölgeler |
| **19:15–06:45** | Gece |

### Geçiş Kuralı

Saat eşiklerinde görüntü bir anda değişmeyecek.

Örneğin 16:29 → 16:30 olduğunda ani turuncu filtre gelmemeli.

Şu geçişler **smooth interpolation** ile yapılmalı:

**Şafak → Gündüz → Gün Batımı → Gece → Şafak**

---

# 9. Ay, Yıldızlar ve Gökyüzü

### Ay

- Gece başladığında Ay gökyüzünde görünür olacak.
- Ay gece boyunca yavaşça konum değiştirecek.
- Ay bir anda başka konuma ışınlanmayacak.
- Hareket gerçek saat ilerlemesine bağlı olacak.
- Başlangıçta gökyüzünün sol/üst taraflarından görünmesi hedefleniyor.

### Yıldızlar

- Gece gökyüzünde yıldızlar olacak.
- Yıldızlar gece atmosferini destekleyecek, aşırı parlak veya dikkat dağıtıcı olmayacak.

### Kayan Yıldız

- Ara sıra kısa bir **kayan yıldız** animasyonu gerçekleşebilecek.
- Çok sık tekrar etmeyecek.
- Oynanışı veya ekonomiyi etkilemeyecek.

### Performans

Düşük grafik / performans modunda:

- hareketli gökyüzü detayları
- kayan yıldız gibi ambient animasyonlar

kapatılabilir veya azaltılabilir.

---

# 10. Ada Yaşam Olayları Sistemi

Ada yalnızca binaların ve NPC'lerin sabit durduğu bir ekran olmayacak.

Amaç:

**Oyuncu bakmadığı zamanlarda da köyün kendi hayatını yaşadığı hissini vermek.**

---

## 11. Mevsimsel Ana Yaşam Olayları

### KİLİTLİ Kural

Her mevsimde:

**15 benzersiz ana yaşam sahnesi**

bulunacak.

Toplam:

**4 mevsim × 15 = 60 ana yaşam olayı**

### Tekrar Kuralları

- Aynı mevsim sırasında aynı ana yaşam olayı ikinci kez oynatılmayacak.
- Mevsim değiştiğinde ilgili olay havuzu sıfırlanacak.
- Aynı mevsim sonraki oyun yılında tekrar geldiğinde olaylar yeniden kullanılabilir.
- Yeni yılda olay sırası yeniden karıştırılacak.

---

## 12. Küçük / Ambient Yaşam Olayları

Ana olayların yanında daha küçük günlük aktiviteler olacak.

Bunlar örneğin:

- kısa konuşmalar
- bankta oturma
- dükkân önünde durma
- pazar ziyareti
- kısa yürüyüş
- festival alanından geçme
- çevreyi inceleme
- hava durumuna tepki

gibi küçük davranışlar olabilir.

### Tekrar Sistemi

Ambient olaylar tekrar edebilir ancak:

- cooldown kullanılacak.
- aynı davranış art arda spam olmayacak.
- aynı NPC sürekli aynı animasyonu yapmayacak.

---

# 13. Yaşam Olayı Seçim Koşulları

Olay sistemi aşağıdaki değişkenleri dikkate alacak:

- Mevsim
- Gerçek saat
- Günün bölümü
- Hava durumu
- Köyde açılmış NPC'ler
- İlgili dükkânın açılmış olup olmaması
- Festival durumu
- Gerekirse lokasyon uygunluğu

### Kritik Kural

Henüz köye gelmemiş bir NPC'nin bulunduğu sahne seçilmemeli.

Bir sahne iki NPC gerektiriyorsa iki NPC de açılmış olmalı.

---

# 14. Hava Durumu ile Yaşam Olayları

### Yağmur

Yağmur sırasında NPC'ler normal açık alan aktivitelerini azaltabilir.

Örnek:

- dükkân altına sığınma
- tente altında bekleme
- hızlıca dükkâna dönme
- kapalı alan çevresinde vakit geçirme

### Kış

Kışa özel yaşam olayları bulunacak.

Örneğin:

- kardan adam yapma
- karla ilgili kısa aktiviteler
- kış dekorları çevresinde toplanma

Bu tür olaylar diğer mevsimlerde çalışmayacak.

---

# 15. Festival Alanının Günlük Yaşamı

Festival alanı festival olmadığı zamanlarda tamamen ölü/boş görünmeyecek.

Kalıcı çevre unsurları bulunabilir:

- banklar
- lambalar
- çiçekler
- sahne
- tezgâh alanları

### NPC Kullanımı

NPC'ler festival alanında sürekli beklemeyecek.

Normal günlerde:

- kısa süre ziyaret edebilirler.
- oturabilirler.
- geçebilirler.
- başka bir NPC ile kısa etkileşime girebilirler.
- ardından günlük rotalarına devam ederler.

### Festival Zamanı

Festival aktif olduğunda alan çok daha yoğun kullanılacak.

---

# 16. Festival Alanı Mevsim Görünümü

Festival alanının dekorasyonu mevsimlere uyarlanacak.

- **İlkbahar:** çiçek ağırlıklı
- **Yaz:** parlak / güneşli
- **Sonbahar:** hasat temalı
- **Kış:** fener / kış atmosferi

---

# 17. Gün/Gece Sistemi ile Yaşam Olaylarının Entegrasyonu

Yaşam olayları günün saatine uygun olmalı.

Örneğin gece saatinde gündüz işi yapan sahne seçilmemeli.

Olay havuzları gerektiğinde şu bölümlere ayrılabilir:

- Sabah
- Gündüz
- Gün batımı
- Akşam/gece

Bu sistem gerçek saatli gökyüzü sistemiyle aynı zaman kaynağını kullanmalı.

---

# 18. Yaşam Olaylarının Ekonomiye Etkisi

### KİLİTLİ Kural

Ada yaşam olayları oyuncuya doğrudan:

- altın
- ürün
- ilişki puanı
- üretim bonusu
- üretim cezası
- sipariş bonusu
- debuff

vermeyecek.

Bu sistemin amacı **atmosfer ve yaşayan dünya hissi**.

Ekonomik exploit yaratılmamalı.

---

# 19. Nero – Günün Saatine Tepkiler

Nero'nun diyalog/reaksiyon sistemi günün zamanını algılayabilecek.

Özellikle:

- gün batımı
- akşam
- gece
- gün sonuna yaklaşma

gibi durumlara özel reaksiyonlar kullanılabilir.

Bu reaksiyonlar mevcut Nero konuşma sisteminin anti-repeat/cooldown mantığını bozmamalı.

---

# 20. Nero Odak Bonusu – Kritik Düzeltme

## KİLİTLİ DEĞER

**Nero Odak Bonusu = +%10**

`+%25` artık geçerli değildir.

---

## 21. Temizlenecek Eski +%25 Referansları

Kod tabanında kapsamlı arama yapılacak.

Kontrol edilecek alanlar:

- Üretim hesapları
- Sabitler / config
- Menü metinleri
- Ana ekran
- Etkilerim ekranı
- Tooltipler
- Rehber
- Yardım metinleri
- Dialog açıklamaları
- Lokalizasyon/string dosyaları
- Testler
- Hard-coded `%25` metinleri
- `1.25`, `0.25`, `25` gibi Odak Bonusu ile ilişkili sayısal kalıntılar

### Hedef

Odak Bonusu bağlamında eski **+%25** hiçbir yerde kalmamalı.

---

# 22. Odak Bonusu Hesap Tutarlılığı

Sadece metin değiştirmek yeterli değildir.

Gerçek üretim hesabı da **+%10** olmalı.

Örnek:

Normal üretim:

`100 birim/saat`

Odak Bonusu aktif:

`100 × 1.10 = 110 birim/saat`

UI:

`+%10`

Gerçek hesap:

`110`

Tooltip:

`+%10`

Tüm değerler birbirleriyle birebir eşleşmeli.

---

# 23. Odak Bonusu Testleri

Aşağıdaki senaryolar kontrol edilmeli:

### Bonus kapalı

- UI bonus göstermemeli.
- Üretim normal değerde olmalı.

### Bonus açık

- UI +%10 göstermeli.
- Gerçek üretim +%10 olmalı.

### Diğer buff/debufflarla birlikte

Odak Bonusu diğer etkilerle birleştiğinde:

- UI'daki toplam üretim
- saatlik üretim popup'ı
- gerçek üretim
- kayıt sonrası devam eden üretim

aynı matematiksel mantığı kullanmalı.

Rounding kaynaklı küçük ama sürekli farklar bırakılmamalı.

---

# 24. Implementasyon Sırasında Genel Güvenlik Kuralları

## Mevcut Sistemleri Bozmama

Yeni sistemler eklenirken özellikle kontrol edilecekler:

- Mevcut pazar
- Köylü açılış sistemi
- NPC hareket sistemi
- Köy kayıt/save sistemi
- Offline/pause davranışı
- Üretim hesapları
- Depo
- Bal çeşitleri
- Balmumu
- Propolis
- Arı sütü
- Siparişler
- Festival
- Mevsimler
- Hava durumu
- Nero konuşma sistemi
- Odak Bonusu
- Etkilerim ekranı

---

# 25. Save Uyumluluğu

Yeni sistemler eski kayıtları bozmamalı.

Eski save'de yeni alan yoksa güvenli default değer kullanılmalı.

Örneğin:

- yeni ürün recipe state
- pazar state
- günlük NPC pazar ziyareti
- yaşam olayları geçmişi
- o mevsimde oynatılan event ID'leri
- ambient event cooldownları

eksik olduğunda oyun crash vermemeli.

---

# 26. Yaşam Olayı Persistence

Aynı mevsimde ana olayların tekrar etmemesi için oynatılmış olay ID'leri save içinde tutulmalı.

Örnek mantık:

```text
seasonLifeEvents:
  season: autumn
  year: 3
  played:
    - autumn_event_01
    - autumn_event_07
    - autumn_event_12
```

Mevsim/yıl değişiminde gerekli reset yapılmalı.

---

# 27. Kodlama Sonrası Zorunlu Kontrol Listesi

## Dükkânlar

- [ ] Tüm açılış seviyeleri doğru
- [ ] Çiçekçi Ezgi 7. açılış
- [x] Tüm yarı mamuller tanımlı
- [ ] Tüm nihai ürünler tanımlı
- [ ] Kilitli ürünler erken görünmüyor
- [ ] Save/load sonrası açılışlar korunuyor

## Pazar

- [ ] Pazar butonu çalışıyor
- [ ] Fiziksel pazara tıklama çalışıyor
- [ ] İki giriş aynı inventory/data kaynağını kullanıyor
- [ ] Pazarcı NPC görünüyor
- [ ] Dükkân sahipleri günlük ürün bırakabiliyor
- [ ] NPC rota hatası yok

## Üretim

- [ ] Her üründe doğru reçete
- [ ] Malzeme miktarları doğru düşüyor
- [ ] Eksik malzemede üretim yapılamıyor
- [ ] Süre doğru
- [ ] Nihai ürün doğru miktarda veriliyor
- [ ] UI mevcut/maliyet değerlerini doğru gösteriyor

## Ekonomi

- [ ] Yarı mamul alış fiyatları tutarlı
- [ ] Ham madde değeri hesaba katılıyor
- [ ] Nihai ürün zarar ettirmiyor
- [ ] Geç oyun ürünleri anlamlı şekilde değerli
- [ ] Aşırı exploit bulunmuyor

## Gün / Gece

- [ ] Gerçek saat kullanılıyor
- [ ] Oyun hızı gökyüzünü etkilemiyor
- [ ] Şafak geçişi smooth
- [ ] Gün batımı smooth
- [ ] Gece geçişi smooth
- [ ] Ay doğru hareket ediyor
- [ ] Yıldızlar yalnızca uygun zamanda
- [ ] Performans modu çalışıyor

## Ada Yaşam Olayları

- [ ] Her mevsimde 15 ana olay
- [ ] Aynı mevsimde ana olay tekrarlamıyor
- [ ] Yeni yılda havuz yeniden kullanılabiliyor
- [ ] Kilitli NPC'li olay tetiklenmiyor
- [ ] Saat koşulları doğru
- [ ] Hava koşulları doğru
- [ ] Ambient cooldown çalışıyor
- [ ] Yaşam olayları ekonomik bonus vermiyor
- [ ] Save/load sonrası event geçmişi korunuyor

## Festival Alanı

- [ ] Festival yokken alan yaşayan ama sakin
- [ ] NPC'ler sürekli sabit beklemiyor
- [ ] Festival sırasında kullanım artıyor
- [ ] Mevsim dekorasyonu doğru

## Odak Bonusu

- [ ] Gerçek değer +%10
- [ ] Menü +%10
- [ ] Tooltip +%10
- [ ] Rehber +%10
- [ ] Etkilerim ekranı +%10
- [ ] Kodda eski %25 kalıntısı yok
- [ ] Üretim hesabı UI ile eşleşiyor
- [ ] Diğer buff/debuff kombinasyonlarında değer doğru

---

# 28. Değişiklik Yönetimi

Bu dosya mevcut onaylı kararların referansıdır.

Kodlama sırasında bir teknik engel çıkarsa:

1. Önce mevcut davranış bu spesifikasyona göre kontrol edilir.
2. Sorun spesifikasyonu uygulamaktan kaynaklanıyorsa minimum teknik düzeltme yapılır.
3. Oyun tasarımı kararı keyfi biçimde değiştirilmez.
4. Yeni karar gerekiyorsa ayrı olarak değerlendirilir.
5. Kullanıcının kilitlediği değerler sessizce değiştirilmez.

---

## Özet – Bu Paketin Ana Başlıkları

1. **Yeni dükkân ve ürün zincirleri**
2. **Fiziksel köy pazarı**
3. **Yarı mamul ekonomisi**
4. **Kolay üretim/crafting arayüzü**
5. **Tutarlı fiyatlandırma algoritması**
6. **Gerçek saate bağlı gün/gece sistemi**
7. **Hareketli Ay, yıldızlar ve ambient gökyüzü**
8. **Mevsim başına 15 ana Ada Yaşam Olayı**
9. **Ambient NPC yaşam davranışları**
10. **Hava durumu ve festival alanı entegrasyonu**
11. **Nero'nun saat/gün sonu reaksiyonları**
12. **Odak Bonusu +%10 düzeltmesi**
13. **%25 kalıntılarının tamamen temizlenmesi**
14. **UI ve gerçek üretim hesabının birebir eşleşmesi**



---

# 29. Liderlik Tablosu ve Rakip Ekonomisi Düzeltmeleri

## 29.1 Turnuva ödülleri liderlik değerini şişirmeyecek

### KİLİTLİ karar

Turnuva / mevsim yarışması ödülü olarak verilen jetonlar oyuncunun cüzdanına gerçekten eklenecek ve harcanabilir olacak; ancak **liderlik tablosundaki net değer hesabına doğrudan dahil edilmeyecek**.

Amaç: yarışmayı kazanmanın bir sonraki gün liderlikte yapay +%20 / +%30 sıçrama yaratmasını önlemek.

Uygulamada normal ekonomik gelir ile turnuva ödülü ayrı takip edilmeli.

---

## 29.2 Bal satışı net değeri yapay biçimde düşürmemeli

Bal depodayken piyasa değeri liderlik hesabına dahil edilmeye devam edecek. Bal satıldığında aynı ekonomik değerin para tarafına geçmesi gerekir.

Örnek:

- Satış öncesi: 20 kg bal + 100 jeton
- Balın piyasa değeri: 300 jeton
- Satış sonrası: 0 kg bal + yaklaşık 400 jeton

Net değer, satış işleminin kendisi nedeniyle sert düşmemeli. Yalnızca gerçekten piyasa değerinin altında/üstünde satış yapıldıysa fark kadar değişebilir.

---

## 29.3 Oyuncu ve rakipler aynı varlık mantığıyla ölçülecek

Mevcut durumda oyuncunun gerçek çiftlik varlıkları ile rakiplerin daha soyut simülasyon değerleri tam olarak aynı yapıda değil. Liderlik karşılaştırması **aynı ekonomik kavramlara** dayanmalı.

Liderlik değeri temel olarak şu varlıklardan oluşmalı:

- normal jeton bakiyesi
- depodaki balın güncel piyasa değeri
- kovandaki balın ekonomik değeri
- kovanların değeri
- arıların değeri
- kalıcı kovan / kraliçe yatırımları
- satın alınmış ada alanları / kalıcı çiftlik yatırımları
- satılabilir üretim ürünleri

Turnuva ödülü bu toplamın dışında tutulacak.

---

## 29.4 Rakip çiftliklerinin üretim kapasitesi oyuncuyla kıyaslanabilir olmalı

Rakip simülasyonunda yalnızca `hives`, `bees`, `honey`, `coins`, `buff` gibi soyut değerler yeterli değil. Oyuncu 5 tarhla gerçek üretim kapasitesi kurabiliyorsa, rakiplerin üretim kapasitesinde de çiçek/tarh altyapısına karşılık gelen bir değişken bulunmalı.

Rakiplerin üretim başarısı yalnız arı sayısıyla değil, en azından şu bileşenlerle ölçeklenmeli:

- aktif tarh / çiçek kapasitesi
- arı sayısı
- kovan seviyesi
- kalıcı üretim yatırımları
- mevsim / hava etkisi
- rakip karakterinin stratejisi

Bu sayede 12–13 arılı rakipler oyuncunun çok gerisinde üretim yapmaya mahkûm kalmamalı.

---

## 29.5 Rakiplerin kovan yatırımları liderlik değerinde görünmeli

Oyuncunun kovan yükseltmelerine yaptığı yatırım net değere dahil ediliyorsa, rakiplerin de benzer yatırım yapabilmesi ve bu yatırımın liderlik değerine yansıması gerekir.

Rakip state'i en azından aşağıdaki ekonomik alanları izleyebilmeli:

- kovan seviyesi
- kraliçe seviyesi / kapasitesi
- toplam kovan yatırımı
- arı yatırımı
- tarh / üretim altyapısı

Rakiplerin yalnızca temel kovan + arı + coin ile hesaplanması, oyuncu yükseltme yaptıkça farkın yapay biçimde açılmasına neden olmamalı.

---

## 29.6 Günlük yüzde değişim gerçek ekonomik büyümeyi göstermeli

Liderlik tablosundaki `dünden +%X` göstergesi:

- turnuva ödülü
- teknik migration
- save düzeltmesi
- varlığın bir türden diğerine dönüşmesi (bal → coin)

gibi olaylardan dolayı yapay sıçrama göstermemeli.

Yüzde değişim mümkün olduğunca **karşılaştırılabilir net ekonomik değer** üzerinden hesaplanmalı.

---

## 29.7 Denge hedefi

Rakiplerin oyuncuya yapışık şekilde hileli rubber-band yapması istenmiyor. Ancak benzer çiftlik kapasitesinde bulunan rakiplerin sürekli oyuncunun yarısı kadar değer üretmesi de kabul edilmeyecek.

Hedef:

- oyuncu iyi oynadığında öne geçebilsin,
- kötü yönetimde rakipler geçebilsin,
- fark zamanla doğal olarak açılıp kapanabilsin,
- yarışma ödülü tek başına ekonomik liderliği belirlemesin,
- aynı fiziksel/ekonomik varlıklar oyuncu ve rakiplerde aynı prensiple değerlendirilsin.


---

# 29. Rakip AI Ekonomisi – Karakterli Ama Mantıklı Oynama

## Tasarım Amacı

Rakipler oyuncunun kopyası olmayacak. Her rakibin kendi karakteri, risk iştahı ve karar verme biçimi olacak.

Ancak **karakterli oynamak ile rastgele servet kaybetmek aynı şey değildir.**

Rakip AI:

- gerçek bir çiftlik state'ine sahip olacak,
- gerçekten üretim yapacak,
- gerçekten bal biriktirecek veya satacak,
- gerçekten yatırım yapacak,
- gerçekten hata yapabilecek,
- fakat hiçbir zaman yalnızca rastgele yüzde düşüşü ile "aptallaştırılmayacak".

### KİLİTLİ Temel Kural

Rakip net değeri artık rastgele `drift / noise / ±% olay` ile doğrudan değiştirilmeyecek.

Net değer **yapılan gerçek ekonomik eylemlerin sonucu** olacak.

Örnek:

- bal üretti → stok arttı
- bal sattı → stok azaldı, coin arttı
- arı aldı → coin azaldı, arı/kovan değeri arttı
- kovan yükseltti → coin azaldı, yatırım değeri arttı
- kötü satış yaptı → küçük ekonomik kayıp
- sipariş kaçırdı → potansiyel gelir kaybı / gerekiyorsa ceza
- hastalık yaşadı → üretim düştü
- kötü planlama yaptı → birkaç gün verimsizlik

Ama doğrudan:

`nw = nw * 0.62`

gibi ekonomik sebebi olmayan sert düşüşler kullanılmayacak.

---

# 30. Rakiplerin Gerçek Çiftlik State'i

Her rakip en az aşağıdaki bilgileri taşımalı:

- Coin
- Kovan sayısı
- Kovan seviyeleri
- Arı sayısı
- Tarh sayısı
- Ekili çiçek türleri
- Depodaki bal
- Kovandaki bal
- Kış şurubu
- Üretim bonusları
- Hastalık durumu
- Satın alınmış arazi / kalıcı yatırım
- Sezon üretimi
- Sezon satışları
- Tamamlanan siparişler
- Kaçırılan siparişler
- Yatırım geçmişi
- Turnuva geçmişi
- Kupa geçmişi

Rakibin liderlik değeri bu state üzerinden hesaplanmalı.

---

# 31. Oyuncu ve Rakip İçin Aynı Net Değer Mantığı

### KİLİTLİ

Oyuncu ile rakip aynı temel varlık değerleme sistemini kullanacak.

Net değer hesabında:

- normal coin
- depodaki balın piyasa değeri
- kovandaki balın uygun değeri
- arılar
- kovanlar
- kovan yatırımları
- satın alınmış alanlar
- satılabilir üretim varlıkları
- diğer kalıcı çiftlik yatırımları

hesaba katılacak.

### Bal Satışı

Bal satılması tek başına servet kaybı değildir.

Örnek:

**Satıştan önce**

- Bal değeri: 300
- Coin: 100
- Toplam: 400

**Satıştan sonra**

- Bal: 0
- Coin: 400
- Toplam: yaklaşık 400

Piyasa altında satış yapıldıysa yalnızca gerçek fiyat farkı kayıp sayılır.

---

# 32. Turnuva Ödülleri ve Liderlik

### KİLİTLİ

Turnuvadan gelen para ödülü liderlik tablosunda ani yapay sıçrama yaratmayacak.

Gerçek oyun cüzdanına ödül verilmeye devam edebilir; fakat liderlik için kullanılan **rekabetçi net değer** hesabında bu gelir ayrı işaretlenecek.

Kod tarafında normal ekonomik gelir ile:

`nonCompetitiveTournamentIncome`

ayrı tutulmalı.

Liderlik tablosu oyuncunun gerçek çiftlik performansını göstermeli; "turnuvayı kazandığı için bir sonraki liderlik yarışını otomatik kazanan" geri besleme döngüsü oluşmamalı.

---

# 33. Rakip Karakterleri

## 🧓 Temkinli Ali

Temel karakter:

- düşük risk
- yüksek nakit rezervi
- yavaş ama istikrarlı yatırım
- kış hazırlığına önem verir
- pahalı yükseltmeleri aceleyle almaz
- balı aşırı düşük fiyata satmaz
- güvenli siparişleri tercih eder
- kapasitesini zorlamaz

### Mantıklı Hatası

Ali bazen fazla bekler.

Örneğin:
- iyi bir yatırım fırsatını kaçırabilir,
- balı gereğinden fazla depoda tutabilir,
- büyümeyi geç başlatabilir,
- düşük risk yüzünden sezonu ortalama bitirebilir.

**Ama bütün parasını anlamsız bir alışverişe gömmez.**

---

## 🤠 Riskçi Kaya

Temel karakter:

- yüksek risk
- hızlı yatırım
- agresif büyüme
- fiyat fırsatlarını kovalar
- daha yüksek değerli ürünlere yönelir
- daha düşük nakit rezervi tutabilir
- daha hızlı arı/kovan yatırımı yapabilir

### Mantıklı Hatası

Kaya bazen fazla agresif davranır.

Örneğin:

- erken yükseltme yapıp birkaç gün nakitsiz kalabilir,
- pahalı çiçeğe fazla yatırım yapabilir,
- kötü piyasa zamanlamasıyla balı %5–10 daha düşük değerden satabilir,
- kış hazırlığını geciktirebilir,
- riskli siparişi alıp yetiştiremeyebilir.

### Güvenlik Sınırı

Riskçi olması **servetinin %30–40'ını rastgele silmek anlamına gelmez.**

Çok kötü bir karar bile gerçek bir ekonomik olaya bağlı olacak.

---

## 👩‍🌾 Dengeli Nur

Temel karakter:

- üretim, satış ve yatırım arasında denge
- orta düzey nakit rezervi
- düzenli tarh geliştirme
- makul satış eşikleri
- siparişleri istikrarlı tamamlama
- orta hızda büyüme

### Mantıklı Hatası

Nur bazen "fazla ortalama" oynayabilir.

Örneğin:

- çok iyi piyasa fırsatını beklemeden satış yapabilir,
- en kârlı çiçek yerine daha güvenli çeşidi seçebilir,
- büyük sıçramalar yerine küçük ama güvenli yatırımlar yapabilir.

Sonuç olarak genellikle istikrarlı olur, fakat her sezon en iyi performansı göstermesi gerekmez.

---

# 34. AI Karar Motoru

Her oyun gününde rakip önce mevcut durumunu değerlendirecek.

Örnek öncelik sırası:

1. Hayatta kalma / kış hazırlığı
2. Kovan sağlığı
3. Depo ve kapasite kontrolü
4. Hasat
5. Sipariş değerlendirmesi
6. Satış kararı
7. Arı / kovan geliştirme
8. Tarh / çiçek yatırımı
9. Fazla coin varsa uzun vadeli geliştirme

Her karar şu değişkenlere bakmalı:

- mevcut coin
- mevcut bal
- piyasa fiyatı
- mevsim
- yaklaşan kış
- şurup stoku
- arı sayısı
- üretim kapasitesi
- tarh sayısı
- sipariş fırsatı
- karakter risk profili
- son birkaç günlük performans

---

# 35. Hata Sistemi – "Aptallık" Değil Suboptimal Karar

Rakiplerin hata yapması korunacak.

Ancak hata sistemi doğrudan parasal ceza üretmeyecek.

### Kabul Edilebilir Hatalar

- balı optimum günden bir gün erken satmak
- pahalı ama faydalı olmayan tohumu seçmek
- upgrade'i biraz erken almak
- upgrade'i biraz geç almak
- bir siparişi yanlış değerlendirmek
- hasadı geciktirmek
- kış hazırlığını son günlere bırakmak
- stok dengesini iyi kuramamak
- fiyat zirvesini kaçırmak

### Kabul Edilmeyen Hatalar

- sebepsiz %20–40 net değer kaybı
- bal satılınca servetin yok olması
- tüm coin'i gereksiz yere sıfırlamak
- kışta şurup alabilecek parası varken sürekli almamak
- kapasite doluyken günlerce üretimi tamamen kilitlemek
- aynı hatayı sürekli tekrarlamak
- rakibin karakteriyle ilgisiz davranış

---

# 36. Hata Bütçesi

Rakipler her gün kusursuz oynamayacak fakat hataların etkisi sınırlı olacak.

Önerilen yaklaşım:

- küçük hata: sık görülebilir, düşük etkili
- orta hata: ara sıra
- büyük hata: nadir ve gerçek oyun olayına bağlı
- felaket: yalnızca hastalık / kış / ciddi risk zinciri gibi açıklanabilir durumlarda

Tek günlük büyük düşüşler yalnızca gerçek state değişimiyle mümkün olmalı.

Liderlik grafiğinde bir rakip %20+ düşüyorsa sistem bunun **nedenini gösterebilmeli.**

---

# 37. Rakip Tarh ve Üretim Kapasitesi

Rakiplerin yalnızca "1 kovan / X arı" bilgisi yeterli değildir.

Tarh sayısı ve çiçek seçimi de gerçek üretim state'inin parçası olacak.

Rakipler zaman içinde:

- yeni tarh açabilecek,
- çiçek değiştirebilecek,
- daha değerli bal türlerine geçebilecek,
- mevsime uygun ekim yapabilecek.

Oyuncunun 5 tarhlık üretim kapasitesine karşı rakibin görünmez şekilde 1–2 tarhlık kapasitede kalması engellenecek.

### Önemli

Rakiplerin tarh sayısı oyuncuyla birebir aynı olmak zorunda değil.

Karaktere göre değişebilir:

- Ali: daha az ama güvenli tarh
- Kaya: daha hızlı genişleme / daha pahalı çeşit
- Nur: dengeli genişleme

---

# 38. Rakip Satış Stratejileri

## Ali

- fiyat kötü ise bekleme eğilimi yüksek
- depo dolmaya yaklaşınca satar
- büyük risk almaz

## Kaya

- fiyat hareketlerine agresif tepki verir
- bazen erken veya yanlış zamanda satabilir
- iyi piyasa yakalarsa büyük satış yapabilir

## Nur

- belirli stok eşiğini geçince kademeli satış
- çok uzun süre beklemez
- fiyat ile kapasiteyi dengeler

### KİLİTLİ

Satış işlemi:

`bal varlığı → coin varlığı`

dönüşümüdür.

Satış anında liderlik değerinin sebepsiz düşmesi bug olarak kabul edilir.

---

# 39. Rakip Yatırım Stratejileri

Rakipler coin biriktirip hiçbir şey yapmadan beklemeyecek.

Yeterli rezerv varsa:

- arı alabilir
- kraliçe yükseltebilir
- kovan kapasitesini artırabilir
- yeni tarh açabilir
- yeni kovan planlayabilir
- depo / üretim kapasitesini artırabilir

Ancak her karakterin yatırım eşiği farklı olacak.

---

# 40. Yarışma Puanlarının Gerçek Sezon Performansından Gelmesi

Rakip yarışma puanı bağımsız rastgele sayı olmamalı.

Dört kategori gerçek simülasyondan beslenecek:

### Bal Kalitesi

- üretilen bal türleri
- değerli çiçek oranı
- ürün kalitesiyle ilişkili bonuslar
- mevsime uygun üretim

### Arıcılık Ustalığı

- arı/kovan sağlığı
- kış yönetimi
- yükseltmeler
- hastalık yönetimi
- kapasite kullanımı

### Üretim Başarısı

- sezon boyunca üretilen gerçek kg
- hasat verimliliği
- boş kapasite / dolu kovan kaybı
- üretim sürekliliği

### Köy İtibarı

- tamamlanan siparişler
- kaçırılan siparişler
- köylü ilişkileri / ilgili sistem
- varsa itibar olayları

### KİLİTLİ

AI'nın yarışma puanı oyuncunun puanına göre sonradan uydurulmayacak.

AI gerçekten sezon boyunca ne yaptıysa sonuç ekranı onu gösterecek.

---

# 41. Liderlik Tablosunda Fark Açılmasını Önleme Mantığı

Amaç rakipleri oyuncuya yapay biçimde yapıştırmak değildir.

Amaç:

**aynı ekonomik kurallarla oynayan rakiplerin doğal olarak rekabetçi kalmasıdır.**

Bu nedenle eski sistemdeki gibi:

- oyuncu öndeyse AI'ya otomatik +% bonus
- AI öndeyse otomatik yavaşlatma

gibi güçlü rubber-band mekanikleri ana çözüm olmayacak.

Gerekirse çok hafif catch-up mekanizması yalnızca uzun vadede kullanılabilir; ancak oyuncunun yatırımını anlamsızlaştıracak seviyeye çıkmayacak.

---

# 42. Liderlik Debug Kaydı

Rakip sistemi debug edilebilir olmalı.

Her oyun gününün sonunda geliştirici logunda şu bilgiler tutulabilir:

```text
Gün 107 – Riskçi Kaya

Başlangıç net değeri: 596
Bal üretildi: +2.4 kg
Hasat: +2.4 kg stok
Satış: 1.8 kg -> +XX coin
Arı alımı: -XX coin / +1 arı
Piyasa farkı: -4 coin
Sipariş: başarısız
Gün sonu net değeri: 602

Değişim: +%1.0
Ana neden: üretim + yatırım
```

Bu log oyuncuya gösterilmek zorunda değildir.

Ama dengeleme sırasında bir rakip anormal yükselir veya düşerse nedeni bulunabilmeli.

---

# 43. Liderlik / AI Zorunlu Testleri

- [ ] Bal satışı net değeri sebepsiz düşürmüyor
- [ ] Depoda bal tutmak doğru değerleniyor
- [ ] Turnuva para ödülü liderlikte yapay sıçrama yaratmıyor
- [ ] Rakiplerin tarh state'i var
- [ ] Rakipler tarhlarını zamanla geliştirebiliyor
- [ ] Rakipler gerçek üretim yapıyor
- [ ] Rakipler gerçek satış yapıyor
- [ ] Rakipler coin ile yatırım yapıyor
- [ ] Rakip yatırım sonrası servet hesabı mantıklı kalıyor
- [ ] Ali gerçekten temkinli davranıyor
- [ ] Kaya gerçekten riskçi davranıyor
- [ ] Nur gerçekten dengeli davranıyor
- [ ] Hatalar karaktere uygun ve ekonomik olarak açıklanabilir
- [ ] Tek günlük büyük düşüş varsa gerçek nedeni var
- [ ] Yarışma puanları gerçek sezon state'inden hesaplanıyor
- [ ] AI üretim puanı sebepsiz biçimde oyuncunun dörtte birinde kalmıyor
- [ ] Oyuncu başarılıysa yine açık ara öne geçebilir
- [ ] Oyuncu kötü oynarsa rakipler gerçekçi biçimde geçebilir
- [ ] Rakipler oyuncuya yapay olarak sabitlenmiyor


# 44. Nero 6.6.1 — Kilitli Master Uygulama Planı

> **Kanonik çalışma kuralı:** 6.6.1 kodlamasında konu atlanmayacak. Aşağıdaki aşamalar sırayla uygulanacak. Bir aşama tamamlanmadan sonraki aşamanın özellik kodlamasına geçilmeyecek.

## 44.1. Aşama geçiş protokolü

Her aşama yalnızca aşağıdaki dört koşulun tamamı sağlandığında **TAMAMLANDI** sayılır:

- [ ] Kod değişiklikleri tamamlandı.
- [ ] İlgili otomatik/regresyon testleri geçti.
- [ ] Eski save / migration etkisi kontrol edildi.
- [ ] UI, rehber, tooltip, changelog veya metin eşleşmesi gereken yerler aynı kuralla güncellendi.

### Zorunlu sıra

| Aşama | Konu | Durum |
|---|---|---|
| 0 | 6.6.1 temel sürüm / migration / test altyapısı | ✅ TAMAMLANDI |
| 1 | Turnuva + liderlik + rakip ekonomi doğruluğu | ✅ TAMAMLANDI |
| 2 | Üretim buff/debuff sistemini 6.4.0 mantığına döndürme | ✅ TAMAMLANDI |
| 3 | Köy ilerlemesi: Atölye 9 / Fırın 30 + Atölye rehberi | ✅ TAMAMLANDI |
| 4 | Fiziksel Pazar + pazarcı + dükkân sahibi lojistiği | ✅ TAMAMLANDI |
| 5 | Ürün/Mal ekonomisi + Siparişler sekmesi | ✅ TAMAMLANDI |
| 6 | Mektup sistemini gerçek-zamanlı ve kilitlenmez hale getirme | ✅ TAMAMLANDI |
| 7 | Yaşayan Ada + NPC günlük yaşamı + mevsimsel olaylar | ✅ TAMAMLANDI |
| 8 | Güncellemeler ekranı + geçmiş 10 sürümün temizlenmesi | ✅ TAMAMLANDI |
| 9 | Kalan ekonomi/görev/save tutarlılık açıkları | ✅ TAMAMLANDI |
| 10 | Rehber/UI/backend tek-kural doğrulaması | ✅ TAMAMLANDI |
| 11 | Tam regresyon + uzun save simülasyonu | ✅ TAMAMLANDI |
| 12 | Commit / push / Windows build / final artifact | 🟨 ÇALIŞILIYOR |

### Aşama kapatma kuralı

Bir aşama bitince bu tablo içindeki durum:

`⬜ BEKLİYOR → 🟨 ÇALIŞILIYOR → ✅ TAMAMLANDI`

olarak güncellenecek.

Bir aşama **✅ TAMAMLANDI** olmadan bir sonraki aşama **🟨 ÇALIŞILIYOR** yapılamaz.

Ortak bir altyapı değişikliği sonraki aşamayı etkiliyorsa yalnız zorunlu altyapı hazırlanabilir; sonraki aşamanın davranış/özellik kodu erken uygulanmaz.

---

# 45. Aşama 0 — 6.6.1 Temeli ve Güvenli Migration

- [x] Sürüm numarası 6.6.1'e alınacak.
- [x] 6.6.0 save dosyaları doğrudan açılabilecek.
- [x] Yeni state alanlarına güvenli default eklenecek.
- [x] Eski rakip / turnuva / mektup / market / workshop state'i migrate edilecek.
- [x] Migration hiçbir tile, kovan, dekor, bal, ürün, köylü veya ilişki kaybettirmeyecek.
- [x] Migration idempotent olacak; aynı save ikinci kez açıldığında değerleri tekrar değiştirmeyecek.
- [x] 6.6.1'e özel regresyon test paketi açılacak.
- [x] Her sonraki aşamanın testleri bu pakete eklenmeden aşama kapatılmayacak.

---

# 46. Aşama 1 — Turnuva, Liderlik ve Rakip Ekonomisi

## 46.1. Turnuva ödülü — KİLİTLİ

6.6.1'de:

- 🥇 Altın: **300 🪙**
- 🥈 Gümüş: **200 🪙**
- 🥉 Bronz: **100 🪙**

`750 / 500 / 250` tamamen kaldırılacak.

Aşağıdakilerin tamamı aynı kaynaktan beslenecek:

- backend ödülü
- oyuncu ödülü
- rakip ödülü
- sonuç ekranı
- tooltip
- oyun içi rehber
- Markdown rehber
- release/update notu
- testler

## 46.2. Turnuva parası liderliği etkilemeyecek

Turnuva ödülü gerçek cüzdana gelir ve harcanabilir.

Ancak turnuva ödülü:

- liderlik puanında anlık +300/+200/+100 sıçrama üretmeyecek,
- `dünden +%X` değerini şişirmeyecek,
- ödülün bir varlığa çevrilmesiyle dolaylı biçimde liderliğe geri sızmayacak.

**Tek seferlik `netWorth - prize` hilesi kullanılmayacak.**
Turnuva dışı ekonomik performansı ayrı izleyen güvenilir bir **rekabetçi ekonomi/net değer ledger'ı** kullanılacak.

## 46.3. AI hayali bal kullanmayacak

- [x] Rakip turnuvaya yalnız gerçekten stokunda bulunan balı gönderebilir.
- [x] Minimum 1 kg yoksa turnuvaya o bal ile katılamaz.
- [x] Gönderilen bal gerçek stoktan düşer.
- [x] Bal daha 12–14. günlerde turnuva için ayrılır/rezerve edilir.
- [x] Rakip bunu daha sonra normal pazarda satamaz.

## 46.4. Rakipler gerçek çiftlik kurallarına yaklaşacak

Rakip state'i en az şunları ayrı ayrı taşıyacak:

- gerçek tarh sayısı
- tarhlardaki çiçek türleri
- tohum satın alma maliyeti
- kovan bazlı arı sayısı
- kovan kapasitesi
- kraliçe/kovan seviyesi
- kovan bazlı hastalık
- kovan bazlı bağışıklık
- depo kapasitesi
- depodaki bal türleri
- şurup
- sezon üretimi
- sezon siparişleri
- sezon hastalık/ölüm geçmişi
- turnuva için rezerve bal

Kurallar:

- [x] Parası yetmeyen AI pahalı tohumu kullanamaz.
- [x] Her gerçek tarh için maliyet öder.
- [x] Yeni kovan/tarh yatırımının maliyeti gerçek ekonomi state'ine girer.
- [x] 12→14→16→18→20 kapasite sıçramaları oyuncu gibi yükseltme maliyeti gerektirir.
- [x] Kovan bazlı arı ölümü ile turnuvadaki `seasonDeaths` aynı gerçek sayıyı kullanır.
- [x] Hastalık bütün çiftliğe tek seferde uygulanmaz.
- [x] Rakip üretim yapmadan önce dolu depo / satış / kapasite kararını mantıklı sırada değerlendirir.
- [x] Rakipler oyuncuya yapay olarak rubber-band edilmez.

## 46.5. Turnuva puanı aynı veri mantığından gelecek

Oyuncu ve AI için dört kategori aynı ortak scorer'ı ve aynı tür sezon verilerini kullanacak.

### Bal Kalitesi
- gerçek gönderilen bal
- gerçek mevsim uyumu
- gerçek sezon içi biyoçeşitlilik
- gerçek kalite/ilgili bonuslar

### Arıcılık Ustalığı
- sezon boyunca kovan sağlığı
- gerçek hastalık günleri
- gerçek arı kayıpları
- kovan/koloni yönetimi

### Üretim Başarısı
- sezon boyunca gerçek üretim
- kapasite kullanımı
- üretim sürekliliği

### Köy İtibarı
- gerçek başarılı siparişler
- gerçek ilişkiler
- özel siparişlerin sahte ilişki yaratmaması

**Son gün çiftliği yeniden düzenleyerek bütün sezon puanını değiştirme açığı kapatılacak.**

## 46.6. Turnuva zamanlaması

- 12. gün: turnuva uyarısı/katılım penceresi
- 13. gün: turnuva uyarısı/katılım penceresi
- 14. gün: son katılım günü
- **15. gün: turnuva ve sonuç**

Sonucun yeni mevsimin 1. gününe sarkması engellenecek.

---

# 47. Aşama 2 — Üretim Buff / Debuff Sistemini 6.4.0 Mantığına Döndürme

## 47.1. Ana kural — KİLİTLİ

6.4.0'ın üretim çarpanı sistemi referans alınacak.

Yeni eklenen bonusların farklı tarhlardan toplanıp:

`Tarh üretim bonusları +%24`

gibi bütün kovana global çarpan olması kaldırılacak.

Bir tarhın çiçek bonusu **yalnız o tarhın ürettiği paya** uygulanacak.

## 47.2. Görünüm

Üretime etki eden çarpanlar mümkün olduğunca gerçek hesap biçimiyle gösterilecek:

- Güneşli hava → `×1.10`
- Anadolu arısı → `×1.10`
- Altın kupa → `×1.20`
- ilgili çiçek → kendi üretim payında `×1.xx`
- çeşme → gerçekten etkilediği tarhta `×1.05`
- hastalık → `×0.xx`
- mevsim → `×1.00 / ×0.50 / ×0.25`
- Nero Odak Bonusu → `×1.10`

Fiyat indirimi, ilişki veya ödeme oranı gibi üretim çarpanı olmayan değerler yüzde olarak kalabilir.

## 47.3. Biyoçeşitlilik

Biyoçeşitlilik, tarh bonuslarının üstüne ikinci büyük global üretim çarpanı olarak binmeyecek.

- [x] Global `+%12` üretim patlaması kaldırılacak/yeniden dengelenecek.
- [x] Çeşitliliğin faydası kontrollü olacak.
- [x] Monokültür cezası üretimi anlamsız biçimde ezmeyecek.
- [x] UI'daki değer gerçek formülle birebir eşleşecek.
- [x] Yeni tarh eklemek iyi çalışan mevcut tarhların üretimini sebepsiz düşürmeyecek.

## 47.4. Test

Aynı save 6.4.0 referans senaryosuna yakın üretim bandında kalmalı.
Yeni sistemlerin eklenmesi üretimi çarpanların üst üste binmesiyle 2×–3× seviyesine taşımamalı.

---

# 48. Aşama 3 — Köy İlerlemesi: Atölye 9 / Fırın 30

## 48.1. Açılış sırası — KİLİTLİ

- **9. açılış: Atölye**
- **30. açılış: Fırın**

Mevcut kodda 9. sıradaki Fırın kaldırılacak ve 30'a taşınacak.

Temel Atölye'nin açılması Mumcu/Mühendis/geç köylü gibi bir karaktere bağlı olmayacak.

**Mumcu kendi dükkânı olarak kalır ancak temel Atölye'nin kapısını kilitlemez.**

## 48.2. Tarif progression

Çiçekçi Ezgi 7. sırada açıldıktan kısa süre sonra, 9. sıradaki Atölye ile onun ürünleri üretilebilir hale gelecek.

Daha sonraki dükkânlar kendi tarif ailelerini açacak:

- Çiçekçi
- Fırın
- Pastane
- Bal Dükkânı
- Kahveci
- Mumcu
- Dondurmacı
- Eczane
- Reçelci
- Marangoz
- Lokumcu

Geç gelen bina/karakterler temel Atölye'yi açmak yerine:

- ek slot
- daha hızlı üretim
- yeni kategori
- özel tarif
- verim bonusu

gibi ileri geliştirmeler sağlayabilir.

## 48.3. Atölye'ye özel rehber

Atölye sayfasının kendi içinde **Rehber / Nasıl Çalışır?** bölümü olacak.

Şunları anlatacak:

- malzeme nereden gelir
- yarı mamul nedir
- hangi dükkân hangi tarifi açar
- gereken miktar
- eldeki miktar
- eksik miktar
- maksimum üretilebilir adet
- üretim süresi
- aktif slot
- kuyruk
- iptal/iade
- tamamlanan ürün nereye gider
- satış değeri
- ürün siparişinde kullanımı

Rehber başka bir ekrana gitmeden anlaşılabilir olacak.

---

# 49. Aşama 4 — Fiziksel Pazar ve Günlük Lojistik

## 49.1. Fiziksel Pazar — KİLİTLİ

Daha önce kullanıcının işaretlediği ada konumuna fiziksel Pazar kurulacak.

**Kilitli koordinat: `-3,0`** — işaretli ekran görüntüsünde `-3,1` göl karesinin hemen üstündeki çim altıgen. Konum uydurulmamıştır; işaretli kare esas alınmıştır.

Hem:

- alttaki `Pazar` butonu
- haritadaki fiziksel Pazar'a tıklama

aynı Pazar sistemini açacak.

## 49.2. Pazarcı

- Pazarda sürekli bir Pazarcı NPC bulunacak.
- Dekor gibi donmuş karakter olmayacak; küçük idle animasyonları olacak.
- Pazar açık olmasa da alan görsel olarak yaşayan bir nokta olacak.

## 49.3. Dükkân sahibi lojistiği

Her gün uygun dükkân sahipleri:

`Dükkân → Pazar → ürün bırak → günlük davranışa dön`

rotasını fiziksel olarak yürüyecek.

Teleport ana yöntem olmayacak.

Dükkân açılmadıysa onun malı pazarda oluşmayacak.

## 49.4. Ürün stoğu

Pazar yalnız ham bal satış ekranı olmayacak.

Açılmış dükkânların bize sattığı yarı mamuller de burada bulunacak.
Aynı ürün hem Pazar butonundan hem fiziksel Pazar'a tıklayarak alınabilecek.

---

# 50. Aşama 5 — Ürünler / Mallar ve Sipariş Sekmesi

## 50.1. Siparişler ekranı — KİLİTLİ

Siparişler modalı iki ana sekmeye ayrılacak:

1. **🍯 Bal Siparişleri**
2. **📦 Ürünler ve Mallar**

Bal Siparişleri mevcut klasik sistemi korur.

## 50.2. Ürünler ve Mallar

Bu sekmede yalnız:

- kilidi açılmış,
- gerçekten üretilebilir,
- mevcut progression'a uygun

bitmiş ürünler sipariş edilebilir.

Henüz açılmamış dükkânın ürünü sipariş havuzuna giremez.

## 50.3. Sipariş kartı

Her kartta:

- ürün adı ve ikon
- isteyen kişi/dükkân
- istenen adet
- depodaki hazır adet
- gereken hammaddeler
- eldeki hammaddeler
- eksik malzemeler
- üretilebilir maksimum adet
- kalan süre
- ödül
- `✓ Hazır`
- gerekirse `Atölyeye Git`

görünecek.

## 50.4. Ortak sipariş ekonomisi

Bal ve ürün siparişleri:

- aynı toplam sipariş limitini paylaşır
- aynı köylünün aynı anda tek aktif normal sipariş kuralına uyar
- ilişki sistemine doğru kişiyi yazar
- Köy İtibarı'na gerçek teslimat olarak girer
- reddetme/kaçırma kurallarına uyar
- rezerve edilen ürünü/payı başka sistemin yanlışlıkla tüketmesine izin vermez

---

# 51. Aşama 6 — Yeni Mektup Sistemi

## 51.1. Zaman — KİLİTLİ

Mektuplar **30–45 gerçek dakika** arasında gelir.

- 1× / 2× / 4× bunu değiştirmez.
- Oyun duraklatıldığında mektup sayacı durur.
- Oyun kapalıyken sınırsız mektup birikmez.
- Uygulama açıldığında en fazla **1 catch-up mektubu** gelebilir.

## 51.2. Tekrar kuralları

- Aynı metin: **3 oyun günü cooldown**
- Aynı kişi art arda spam yapamaz.
- Gönderen cooldown'u mevcut uygun köylü sayısına göre dinamik olur.
- `son 10 gönderen` gibi küçük köyü kilitleyen sabit pencere kullanılmaz.
- Uygun kişi bulunamazsa en uzun süredir yazmayan uygun köylü fallback olur.
- Sistem hiçbir koşulda kalıcı `aday yok` deadlock'una giremez.

## 51.3. Migration

Eski save'lerdeki:

- `letterSenderHistory`
- eski recent/cooldown listeleri
- sonraki mektup zamanı

güvenli biçimde migrate edilecek.

Yeni oyuna başlamak gerekmez.

## 51.4. Bildirim

Mektup bildirimi kapalıysa:

- mektubun kendisi yine gelir
- yalnız bildirim/ses davranışı kapanır

---

# 52. Aşama 7 — Yaşayan Ada ve NPC Günlük Hayatı

## 52.1. Mevcut dolaşma korunacak, genişletilecek

Mevcut `walkers.js` / `village-life.js` altyapısı kullanılacak.

NPC'ler:

- gündüz dışarı çıkar
- dükkânlara gider
- Pazar'a gider
- meydanı kullanır
- bankta oturur
- birbirleriyle kısa etkileşim yapar
- akşam farklı davranır
- gece herkes aynı anda görünmez olmaz

## 52.2. Günün saatine göre nüfus

18:00'de toplu eve dönüş ve 20:00'de herkesi görünmez yapma kaldırılacak.

Saatlere göre doğal yoğunluk olacak:

- sabah: işe/dükkâna hareket
- öğlen: yüksek hareket
- akşam: meydan/bank/ev çevresi
- gece: daha az kişi ama ada tamamen ölü değil

Grafik ayarlarının NPC performans limiti korunacak.

## 52.3. Festival alanı günlük hayatta da kullanılacak

Festival yokken alan boş kalmayacak.

Kalıcı:

- banklar
- lambalar
- çiçekler
- sahne
- tezgâhlar

NPC davranışları:

- kısa ziyaret
- oturma
- geçiş
- konuşma
- akşam lambaları çevresinde bulunma

Festival zamanında yoğunluk artar.

## 52.4. Island Life Events — KİLİTLİ

Her mevsim **15 benzersiz ana sahne**:

- İlkbahar 15
- Yaz 15
- Sonbahar 15
- Kış 15

Toplam: **60 ana olay**

Kurallar:

- aynı mevsimde aynı ana olay tekrar etmez
- sonraki oyun yılında reshuffle ile tekrar kullanılabilir
- ambient küçük olaylar cooldown ile tekrar edebilir
- koşullar: mevsim, gerçek gün saati, hava, açık dükkân, mevcut NPC, festival, lokasyon
- olmayan/açılmamış NPC kullanılamaz
- yağmur varsa dış etkinliğin yağmurlu alternatifi olur
- kışta kardan adam gibi sezonluk sahneler bulunur
- ekonomik ödül vermez; atmosferiktir
- save'de oynanan event ID'leri tutulur

---

# 53. Aşama 8 — Güncellemeler Ekranının Yeniden Yapılması

## 53.1. Mevcut hata

Changelog cümlesinin ilk parçasını başlık diye kesip kalan kısmını açıklama olarak devam ettiren sistem kaldırılacak.

Başlık **cümle kırpılarak tahmin edilmeyecek.**

## 53.2. Yeni veri modeli

Her update maddesi kaynakta ayrı alanlara sahip olacak:

- `title`
- `description`
- isteğe bağlı `category`
- sürüm
- release linki

## 53.3. Geçmiş 10 sürüm

GitHub Releases'ta bulunan **son 10 yayımlanmış sürümün** update notları geriye dönük temizlenecek.

Her biri:

- gerçek başlık
- bağımsız tamamlanmış açıklama
- doğru sürüm linki
- Markdown artığı olmadan
- yarım cümle olmadan

gösterilecek.

## 53.4. Gelecek sürümler

Yeni sürüm oluşturulurken update kartları yapılandırılmış kaynaktan üretilecek.

Parser:

- cümleden başlık tahmin etmeyecek
- `---`, `#`, bozuk Markdown göstermeyecek
- release olmayan sürümü listelemeyecek
- geriye/ileri sürüm gezinmesini destekleyecek
- o sürümün GitHub Release linkini gösterecek

---

# 54. Aşama 9 — Kalan Ekonomi, Görev ve Save Mantık Açıkları

## 54.1. Pazar Tahmin Kartı
Tahmin kartı sahte bağımsız random üretmeyecek.
Satın alındığında gerçekten yarının kullanılacak piyasa state'i veya deterministik seed'i üzerinden tahmin verecek.

## 54.2. Canlandırma → liderlik exploit'i
Solmuş pahalı çiçeği düşük maliyetle canlandırmak bir anda yüzlerce/1000+ liderlik puanı üretmeyecek.

Canlandırılan varlığın rekabetçi değeri ekonomik maliyet/yaş/amortisman ile tutarlı olacak.

## 54.3. Günlük görev yapılabilirliği
Görev yalnız gerçekten yapılabiliyorsa aday havuzuna girecek.

Kontroller:

- aktif tarh
- kovan menzili
- üretim kapasitesi
- mevcut/rezerve stok
- kalan gerçek gün süresi
- gerekli coin
- açık dükkân
- Yakup stoğu
- Atölye kilidi
- tarif kilidi

`5/10/15 kg hasat` ve `5 kg sat` gibi görevler kör biçimde oluşturulmayacak.

## 54.4. Atölye karesi migration güvenliği
Sabit Atölye karesi eski save'de doluysa:

- önce güvenli boş hedef bulunur
- taşıma ancak hedef bulunduğunda yapılır
- yer bulunamazsa eski obje silinmez
- migration uyarı/fallback uygular

Hiçbir kovan/dekor kaybolamaz.

## 54.5. Liderlik / varlık muhasebesi
Canlı varlık ile harcanmış hizmet maliyeti ayrılacak.

Özellikle:

- arı
- kovan
- kraliçe yükseltmesi
- ırk değişimi
- tohum
- yaşayan tarh
- dekor
- balmumu
- polen
- propolis
- arı sütü
- şurup
- işlenmiş ürün
- bekleyen iade

mantıklı ve exploit üretmeyen değerlemeye sahip olacak.

---

# 55. Aşama 10 — Tek Kural Kaynağı ve Rehber Tutarlılığı

Aynı sayı backend, renderer, HTML rehberi ve Markdown rehberinde bağımsız hard-code edilmeyecek.

Öncelikli tek-kaynak değerleri:

- turnuva ödülleri
- Odak Bonusu
- canlandırma oranı
- Yakup fiyat farkı
- balmumu üretimi
- mektup zamanları
- sipariş aralığı
- turnuva günleri
- biyoçeşitlilik/debuff değerleri
- Atölye unlock seviyesi/sırası
- Fırın açılış sırası
- ürün tarif kilitleri

CI/test, bu değerlerin UI ve rehberle uyuştuğunu ayrıca kontrol edecek.

---

# 56. Aşama 11 — Zorunlu 6.6.1 Regresyon Testi

Aşağıdaki testler geçmeden 6.6.1 tamamlanmış sayılmayacak:

- [x] 6.6.0 save açılıyor, hiçbir varlık kaybolmuyor
- [x] Turnuva 300/200/100 veriyor
- [x] Turnuva ödülü liderlik skorunu şişirmiyor
- [x] AI stokta olmayan balı turnuvaya sokamıyor
- [x] AI parası yoksa tohumu alamıyor/üretmiyor
- [x] AI kraliçe kapasitesini bedava geçemiyor
- [x] AI hastalık/ölüm sayıları kovan state'iyle eşleşiyor
- [x] Turnuva 15. günde sonuçlanıyor
- [x] Son gün tarh düzenleme sezon puanını manipüle etmiyor
- [x] Üretim 6.4.0 referans bandına dönüyor
- [x] Tarh bonusları bütün kovana global yüzde olarak toplanmıyor
- [x] Atölye 9'da açılıyor
- [x] Fırın 30'da açılıyor
- [x] Çiçekçi ürünleri Atölye açıldıktan sonra üretilebiliyor
- [x] Fiziksel Pazar tıklaması Pazar ekranını açıyor
- [x] Pazarcı sürekli mevcut
- [x] Dükkân sahibi Pazar teslim rotası çalışıyor
- [x] Ürünler ve Mallar sipariş sekmesi yalnız açık tarifleri istiyor
- [x] Ürün siparişi ortak sipariş limitine uyuyor
- [x] Mektup 30–45 gerçek dakika aralığında çalışıyor
- [x] Az köylüyle mektup sistemi deadlock olmuyor
- [x] Açılışta en fazla 1 catch-up mektubu geliyor
- [x] Aynı metin 3 oyun günü içinde tekrarlanmıyor
- [x] NPC'ler akşam topluca kaybolmuyor
- [x] Festival alanı festival dışında da kullanılıyor
- [x] 60 ana yaşam olayı sezon/tekrar kurallarına uyuyor
- [x] Geçmiş 10 update notu düzgün başlık+açıklama gösteriyor
- [x] Yeni update parser'ı cümleyi ortadan bölmüyor- [x] Pazar Tahmin Kartı gerçek yarın state'iyle uyumlu
- [x] Canlandırma liderlik exploit'i üretmiyor
- [x] İmkânsız günlük görev oluşturulmuyor
- [x] Dolu eski save'de Atölye migration'ı obje silmiyor

Ek olarak mevcut tüm eski testler de geçecek.

---

# 57. Aşama 12 — Commit, Push ve Artifact

Yalnız Aşama 0–11'in tamamı `✅ TAMAMLANDI` olduktan sonra:

1. Son diff kontrolü
2. Changelog kontrolü
3. Version/package kontrolü
4. Testlerin son tam çalıştırması
5. Commit
6. Push
7. GitHub Actions
8. Windows build
9. Artifact doğrulaması
10. Kullanıcıya **Actions linki + final artifact**

verilecek.

Ara pre-commit paketleri kullanıcıya gönderilmeyecek.