# Nero 6.3.4 Plan — Part 04

Bu dosya 6.3.4 için 10–12. maddelerin planını tutar. Şu anda yalnızca **Madde 10** kilitlenmiştir. Kullanıcının onaylı çalışma kuralı gereği 11–12 belirlenmeden uygulama koduna başlanmayacaktır.

## 10. Rehbere Mevsim Turnuvası puan hesaplama sistemi eklenecek

Mevcut **📖 Rehber → 🏆 Mevsim Turnuvaları ve rakipler** bölümü yalnızca kategori üst sınırlarını ve ödülleri söylüyor. 6.3.4'te bu bölüm, oyuncunun **puanını tam olarak hangi davranışların artırıp azalttığını** anlayabileceği şekilde genişletilecek.

Rehber metni mevcut gerçek oyun formülleriyle birebir uyumlu olacak; yaklaşık veya belirsiz ifadeler kullanılmayacak.

### 10.1. Genel turnuva özeti

Rehberde mevcut bilgiler korunacak ve daha okunur biçimde sunulacak:

- Turnuva her mevsimin **son 3 oyun gününde** başvuruya açılır.
- En fazla **10 kg bal** gönderilebilir.
- Sonuç, sonraki mevsimin ilk gününde açıklanır.
- Toplam puan **1000** üzerinden hesaplanır.
- Dört kategori vardır:
  - **Bal Kalitesi:** en fazla 400 puan
  - **Arıcılık:** en fazla 250 puan
  - **Üretim:** en fazla 200 puan
  - **Köy İtibarı:** en fazla 150 puan
- Dört kategori puanı toplanır ve toplam puana göre sıralama yapılır.
- İlk üç ödülü:
  - 1. sıra: 750 🪙 + Altın Kupa
  - 2. sıra: 500 🪙 + Gümüş Kupa
  - 3. sıra: 250 🪙 + Bronz Kupa
- Altın kupa, **gelecek yıl aynı mevsimde +%20 bal üretimi** verir.

### 10.2. Bal Kalitesi — maksimum 400 puan

Rehberde formül açıkça gösterilecek:

```text
Bal Kalitesi =
110
+ (turnuvaya gönderilen kg × 15)
+ (gönderilen bal türünün temel değeri × 2)
+ mevsim uyumu bonusu
+ Festival Cilası
+ diğer turnuva bonusları
```

Kurallar:

- Başlangıç puanı: **110**
- Gönderdiğin her 1 kg bal: **+15 puan**
- Bal türünün temel değeri × 2 kadar puan:
  - Yonca: 8 × 2 = **+16**
  - Papatya: 12 × 2 = **+24**
  - Ayçiçeği: 18 × 2 = **+36**
  - Kekik: 26 × 2 = **+52**
  - Lavanta: 38 × 2 = **+76**
  - Kış Fundası: 55 × 2 = **+110**
  - Kestane: 80 × 2 = **+160**
- Gönderilen bal kendi doğal mevsiminde yarışıyorsa: **+45 puan**
- **Festival Cilası** kullanıldıysa: **+20 puan**
- Mevcut `festivalBonus` etkileri ayrıca eklenir.
- Kategori puanı hiçbir durumda **400'ü geçmez**.

Rehberde en az bir anlaşılır örnek olacak:

> **Örnek:** Sonbaharda 10 kg Kestane balı gönderirsen temel hesap 110 + 150 + 160 + 45 = 465 olur. Bal Kalitesi 400 ile sınırlandığı için **400 / 400** alırsın.

Ayrıca daha düşük değerli balın da yüksek kg, doğru mevsim ve ek bonuslarla güçlü puan üretebileceği açıklanacak; yalnızca “en pahalı balı gönder” şeklinde yanıltıcı bir öneri verilmeyecek.

### 10.3. Arıcılık — maksimum 250 puan

Rehberde formül:

```text
Arıcılık =
60
+ (sağlıklı kovan oranı × 130)
+ (toplam yaşayan arı sayısı × 2,5)
- (o mevsimde ölen her arı × 12)
```

Kurallar:

- Başlangıç: **60 puan**
- Mevsim sonunda bütün kovanlar sağlıklıysa: **+130 puana kadar**
- Her yaşayan arı: **+2,5 puan**
- O mevsimde ölen her arı: **−12 puan**
- Sağlıklı kovan oranı, sonuç açıklandığı andaki tüm kovanların sağlıklı/hasta durumuna göre hesaplanır.
- Kategori **0–250** arasında sınırlandırılır.

Rehber oyuncuya açıkça şunu anlatacak:

> Yarışma için yalnızca çok arı sahibi olmak yetmez; hastalıkları kontrol altında tutmak ve mevsim boyunca arı kaybını azaltmak Arıcılık puanını doğrudan etkiler.

### 10.4. Üretim — maksimum 200 puan

Rehberde formül:

```text
Üretim =
(mevsim boyunca üretilen toplam kg × 7)
+ ((mevsim boyunca üretilen toplam kg / kovan sayısı) × 4)
```

Kurallar:

- Son **15 oyun günündeki** gerçek bal üretimi kullanılır.
- Toplam üretimin yanında **kovan başına üretim verimliliği** de puan getirir.
- Çok sayıda düşük verimli kovan açmak otomatik olarak avantaj sağlamaz.
- Kategori en fazla **200 puan** verir.

Rehberde kısa açıklama:

> Hem toplam bal üretimini yükselt, hem de mevcut kovanlarını verimli kullan. Aynı üretimi daha az kovanla yapmak kovan başına verim bölümünü yükseltir.

### 10.5. Köy İtibarı — maksimum 150 puan

Rehberde formül:

```text
Köy İtibarı =
(o mevsimde tamamlanan başarılı sipariş sayısı × 16)
+ (tüm köylülerdeki toplam kalp × 5)
```

Kurallar:

- Mevsim içinde tamamlanan her başarılı sipariş: **+16 puan**
- Mevcut köylü ilişkilerindeki her kalp: **+5 puan**
- İlişkiler önceki mevsimlerden geldiği için uzun vadeli köy ilişkileri de turnuvaya katkı sağlar.
- Kategori **150 puanda** sınırlandırılır.

Rehber oyuncuya:

> Turnuva yalnızca bal üretim yarışı değildir. Siparişleri tamamlamak ve köylülerle uzun vadeli ilişki kurmak da toplam puanın önemli bir parçasıdır.

### 10.6. Rakip puanları hakkında açıklama

Rehberde rakiplerin oyuncuyla birebir aynı formülü kullanmadığı açıkça belirtilecek.

- Temkinli Ali, Riskçi Kaya ve Dengeli Nur kendi simüle edilen çiftlik değerlerinden puan üretir.
- Rakip kategorilerinde üretim, arı sayısı, kovan sayısı, şurup hazırlığı, çiftlik bonusları ve net değer gibi veriler kullanılır.
- Rakip puanlarında her mevsim için sabitlenmiş kontrollü bir değişkenlik de bulunur.
- Bu nedenle rakibin puanı her turnuvada tamamen aynı olmaz.
- Kullanıcıdan rakiplerin gizli matematiğini ezberlemesi beklenmeyecek; rehberin odağı **kendi puanını nasıl yükselteceği** olacak.

### 10.7. Rehber sunumu

Mevcut **🏆 Mevsim Turnuvaları ve rakipler** accordion'u korunacak; ayrı bir karmaşık ekran açılmayacak.

Bölüm içinde okunabilir alt başlıklar / küçük bilgi blokları kullanılacak:

- 🏆 Nasıl katılırım?
- 🍯 Bal Kalitesi — 400
- 🐝 Arıcılık — 250
- 📦 Üretim — 200
- 💛 Köy İtibarı — 150
- 🎯 Puanımı nasıl yükseltirim?
- 🥇 Ödüller

Formüller teknik kod görünümünde değil, oyuncunun anlayabileceği Türkçe ifadelerle gösterilecek. Ancak yukarıdaki sayısal kuralların **hiçbiri gizlenmeyecek veya yaklaşıklaştırılmayacak**.

Bal Defteri → Kupalar'daki mevcut kategori sonuçları ile Rehber'deki açıklamalar birbiriyle tutarlı olacak.

### 10.8. Tutarlılık kontrolü

Uygulama sırasında rehber metni doğrudan mevcut puan hesaplama kodu olan `judgeFestival()` ile karşılaştırılacak.

- Rehberde yazan maksimumlar gerçek kodla aynı olacak.
- Bal türü temel değerleri `FLOWERS` verisinden doğrulanacak.
- Mevsim bonusu, Festival Cilası ve varsa `festivalBonus` etkileri gerçek hesapla tutarlı olacak.
- Arıcılık ölüm cezası ve sağlıklı kovan oranı doğru açıklanacak.
- Üretimde hem toplam kg hem de kovan başına verim bileşeni belirtilecek.
- Köy İtibarı'nda hem o mevsimin siparişleri hem de toplam kalpler anlatılacak.

### Not — mevcut metin tutarsızlığı

Kod incelemesinde **Arıcılar Derneği** için `village-data.js` içinde açıklama `Bal Festivali puanın +%10` yazarken, mevcut `judgeFestival()` hesabı `festivalBonus = 0.1` değerini **Bal Kalitesi kategorisine +10 puan** olarak uyguluyor.

Bu fark şu anda davranış değişikliği olarak kilitlenmemiştir. Madde 10 uygulanırken rehber gerçek hesapla uyumlu yazılacak; Arıcılar Derneği'nin bonus davranışının mı yoksa yalnızca görünen açıklamasının mı düzeltileceği ayrıca kararlaştırılabilir.

## Kilit Durumu

- Madde 10: KİLİTLİ
- Turnuva puan formüllerinin Rehbere açıkça eklenmesi: KİLİTLİ
- Bal Kalitesi 400 / Arıcılık 250 / Üretim 200 / Köy İtibarı 150: KİLİTLİ
- Rehberin gerçek `judgeFestival()` formülüyle birebir tutarlı olması: KİLİTLİ
- Örnek hesap ve puan artırma ipuçları: KİLİTLİ
- Madde 11: HENÜZ BELİRLENMEDİ
- Madde 12: HENÜZ BELİRLENMEDİ
