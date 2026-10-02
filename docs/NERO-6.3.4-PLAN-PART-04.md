# Nero 6.3.4 Plan — Part 04

> **ARŞİV NOTU (6.6.0):** Bu dosya 6.3.4 döneminin tarihsel planıdır. Turnuva formülü ve diğer sayısal kurallar daha sonra değişmiştir; güncel değerler için `docs/ARICILIK-REHBERI.md` ve `src/main/bee.js` esas alınır.

Bu dosya 6.3.4 için son plan grubunu tutar. **Madde 10 ve Madde 11 kilitlenmiştir; kullanıcı kapsamın burada tamamlandığını onaylamış ve kodlama aşamasını başlatmıştır.**

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

## 11. Sürüm Yenilikleri penceresine geri navigasyon ve GitHub CHANGELOG bağlantısı

Mevcut **📋 Sürüm Yenilikleri** penceresi yalnızca ileri doğru (`Sonraki Sürüm`) ilerliyor. 6.3.4 ile bu ekran küçük bir sürüm arşivi gibi çalışacak: kullanıcı hem daha yeni hem daha eski kayıtlar arasında dolaşabilecek ve görüntülediği sürümün GitHub Releases sayfasındaki gerçek CHANGELOG/release kaydını açabilecek.

### 11.1. Önceki / sonraki sürüm navigasyonu

- Pencerenin alt kısmına **← Önceki Sürüm** butonu eklenecek.
- Mevcut **Sonraki Sürüm →** davranışı korunacak.
- Kullanıcı bir sürümün içindeyken:
  - **Önceki Sürüm** bir önceki `RELEASE_NOTES` kaydına gider.
  - **Sonraki Sürüm** bir sonraki kayda gider.
- Arşivin en eski kaydında **Önceki Sürüm** pasif olacak.
- Arşivin en yeni kaydında ileri butonu **Çiftliğe Dön** davranışına geçebilecek.
- Kullanıcı ileri/geri giderken modal kapanıp yeniden açılmayacak; içerik aynı pencere içinde değişecek.
- Başlık, sürüm numarası, açıklama kartları ve sayaç her geçişte görüntülenen sürüme göre yenilenecek.
- İstenirse küçük bir `X / Y sürüm` konum göstergesi gösterilecek; ancak ana tasarım sade kalacak.

### 11.2. Otomatik güncelleme akışı ile arşiv gezintisi birbirinden ayrılacak

Mevcut `neroBeeLastReleaseSeen` davranışı korunacak.

- Uygulama yeni sürüm sonrası otomatik açıldığında, görülmemiş sürümlerin işaretlenme mantığı ileri yönde çalışmaya devam edecek.
- Kullanıcının **geri dönüp eski bir sürümü incelemesi**, `lastReleaseSeen` değerini geriye çekmeyecek.
- Daha önce görülmüş bir sürüme dönmek, onu yeniden “okunmamış” yapmayacak.
- Rehberdeki **Sürüm Yenilikleri** butonundan manuel açılan arşivde kullanıcı serbestçe ileri/geri gezebilecek.
- Manuel arşiv gezintisi seen-state'i yanlışlıkla değiştirmeyecek.
- Bu nedenle mevcut `releaseQueue.shift()` yaklaşımı yerine sürüm listesini bozmayan bir **cursor/index** yaklaşımı tercih edilecek.

### 11.3. En üstte GitHub CHANGELOG / Release bağlantısı

Her sürüm ekranının **üst bölümünde**, sürüm numarasının hemen yakınında görünür fakat tasarımı bozmayan bir bağlantı olacak:

> **↗ GitHub'da CHANGELOG'u görüntüle**

- Bağlantı o anda ekranda bulunan **tam sürümün GitHub Releases sayfasına** gidecek.
- Örnek: `6.3.0` görüntüleniyorsa hedef gerçek `releases/tag/v6.3.0` kaydı olacak.
- Link genel repository veya genel Releases listesine değil, mümkün olduğunda **o sürümün birebir release sayfasına** gitmeli.
- URL sürüm notu verisinde açık metadata olarak tutulacak (ör. `releaseUrl`); renderer sürüm numarasından körlemesine URL üretmeyecek.
- Böylece tag adı farklı olan veya release sayfası bulunmayan sürümlerde yanlış link üretilmeyecek.
- Release kaydı bulunmayan eski bir sürümde link **gizlenecek veya pasif** olacak; kullanıcı yanlış / 404 sayfasına gönderilmeyecek.
- 6.3.4 release'i yayınlandığında onun gerçek release URL'si de aynı metadata'ya eklenecek.

### 11.4. Bağlantı güvenli biçimde harici tarayıcıda açılacak

- GitHub linkine tıklamak oyun penceresini GitHub sayfasına çevirmeyecek.
- Electron main process tarafında `shell.openExternal(...)` kullanan güvenli bir IPC eylemi eklenecek.
- Renderer yalnızca izin verilen GitHub Releases URL'sini bu IPC üzerinden açacak.
- Keyfi URL çalıştırmaya izin veren genel amaçlı bir kanal oluşturulmayacak; repository release alanı doğrulanacak.
- Link tıklandığında Sürüm Yenilikleri penceresi açık kalabilir; oyun state'i veya seen-state değişmeyecek.

### 11.5. Mevcut release arşiviyle uyumluluk

Kod incelemesinde `release-notes.js` içinde 5.1.0–6.3.3 arası paketlenmiş sürüm özetleri mevcut.

GitHub repository'sinin mevcut Releases listesinde ise bu sürümlerin tamamının birebir release kaydı bulunmuyor. Örneğin bazı ara sürümler paket içi geçmişte mevcutken GitHub'da aynı tag ile yayınlanmış release yok.

Bu nedenle:

- Var olan gerçek GitHub release'leri metadata ile eşleştirilecek.
- Release sayfası bulunmayan kayıtlar için sahte link üretilmeyecek.
- Gelecekte eksik release sayfası eklenirse yalnızca ilgili `releaseUrl` metadata'sı eklenerek link aktif hâle getirilebilecek.
- Sürüm notunun oyun içinde görüntülenmesi GitHub release sayfasının bulunmasına bağlı olmayacak.

### 11.6. Görsel davranış

Mevcut sıcak krem / altın Sürüm Yenilikleri tasarımı korunacak.

- GitHub bağlantısı başlığın üst/başlık bölgesinde küçük ve ikincil aksiyon olarak yer alacak.
- **Önceki Sürüm** butonu mevcut alt buton stil ailesiyle uyumlu olacak fakat ana sarı CTA kadar baskın olmayacak.
- İleri butonu ana aksiyon olarak kalacak.
- Küçük ekranlarda butonlar taşmayacak; gerekirse alt bölüm iki sütun veya mobilde alt alta davranacak.
- Mevcut kartlar, ikonlar ve sürüm başlığı tasarımı değiştirilmeyecek.

### 11.7. Test kapsamı

1. Arşivin ortasındaki bir sürümde hem önceki hem sonraki butonu çalışmalı.
2. En eski sürümde geri butonu pasif olmalı.
3. En yeni sürümde ileri aksiyon doğru şekilde **Çiftliğe Dön** olmalı.
4. Geri gidip tekrar ileri gelmek aynı içerikleri doğru sırayla göstermeli.
5. Geri navigasyon `neroBeeLastReleaseSeen` değerini düşürmemeli.
6. Manuel arşiv gezintisi unread/seen durumunu bozmamalı.
7. Release URL'si bulunan sürümde GitHub CHANGELOG bağlantısı doğru **exact release page**'i harici tarayıcıda açmalı.
8. Release URL'si olmayan sürümde yanlış bağlantı gösterilmemeli.
9. GitHub linkine tıklamak oyun penceresini başka sayfaya yönlendirmemeli ve oyun state'ini değiştirmemeli.

## Kilit Durumu

- Madde 10: KİLİTLİ
- Turnuva puan formüllerinin Rehbere açıkça eklenmesi: KİLİTLİ
- Bal Kalitesi 400 / Arıcılık 250 / Üretim 200 / Köy İtibarı 150: KİLİTLİ
- Rehberin gerçek `judgeFestival()` formülüyle birebir tutarlı olması: KİLİTLİ
- Örnek hesap ve puan artırma ipuçları: KİLİTLİ
- Madde 11: KİLİTLİ
- Sürüm Yenilikleri ekranında ← Önceki Sürüm navigasyonu: KİLİTLİ
- İleri/geri gezinmede seen-state'in bozulmaması: KİLİTLİ
- Üst bölümde görüntülenen sürümün exact GitHub Releases / CHANGELOG linki: KİLİTLİ
- Release kaydı yoksa sahte/404 link gösterilmemesi: KİLİTLİ
- GitHub release sayfasının harici tarayıcıda güvenli biçimde açılması: KİLİTLİ
- 6.3.4 plan kapsamı: TAMAMLANDI — yeni madde eklenmeyecek
