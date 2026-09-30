# Nero 6.3.4 Plan — Part 03

Bu dosya 6.3.4 için kilitlenen 7–8. maddeleri içerir. Kullanıcının talebi doğrultusunda maddeler plan aşamasında tek tek kilitlenmektedir. Bu aşamada yalnızca plan güncellenmiştir; uygulama koduna henüz başlanmayacaktır.

## 7. Köylü mektup sistemi 50 karakter × 100 özel mektuba genişletilecek

- Köydeki mevcut **50 isimli karakterin tamamı** mektup gönderebilir olacak.
- Her karakter için **100 özel mektup** kullanılacak.
- Toplam kişiselleştirilmiş mektup havuzu **5.000 metin** olacak.
- Hazırlanan metinler karakterin yalnızca mesleğine bağlı kalmayacak; kişisel hayat, anılar, köy ilişkileri, mizah, mevsimler ve diğer köylülerle etkileşimler de korunacak.
- Mevcut generic/fallback mektuplar korunursa, seçilen nihai metin aşağıdaki tekrar kurallarına yine tabi olacak.

### 7.1. Aynı gönderen için 10 mektupluk global cooldown

- Bir karakter mektup gönderdikten sonra **sonraki 10 gönderilmiş mektubun hiçbirinin göndereni aynı karakter olamaz**.
- Örnek: X karakteri 1. mektubu gönderdiyse X tekrar en erken **12. mektupta** seçilebilir.
- Teknik olarak sistem son **10 başarılı mektubun gönderen kimliğini** rolling history içinde tutacak.
- Yeni gönderen seçilirken bu son 10 gönderen listesinde bulunan karakterler aday havuzundan çıkarılacak.
- Bu cooldown bütün karakterler için aynı şekilde uygulanacak; yalnızca arka arkaya tekrar değil, 10 mektupluk pencere boyunca tekrar tamamen engellenecek.
- Kural save/restart sonrasında sıfırlanmayacak; gerekli gönderen geçmişi oyun state/save verisinde kalıcı tutulacak.
- Eski save dosyalarında geçmiş veri yoksa boş history ile güvenli biçimde başlanacak.
- Aktif mektup gönderebilen karakter sayısı bu kesin kuralı uygulamaya yetmiyorsa cooldown **gevşetilmeyecek**; kuralı ihlal eden mektup göndermek yerine gönderim uygun aday oluşana kadar ertelenecek.

### 7.2. Aynı karakterin son 30 mektubunda aynı içerik tekrar edemez

- Her karakter için ayrı bir mektup geçmişi tutulacak.
- X karakterinin yeni seçilecek mektubu, **X karakterinin daha önce gönderdiği son 30 mektuptan hiçbiriyle aynı olamaz**.
- Bu kontrol diğer karakterlerin mektuplarından bağımsızdır; yalnızca aynı gönderenin kendi son 30 gönderimi dikkate alınır.
- Teknik olarak metni doğrudan karşılaştırmak yerine her mektuba sabit/stable bir kimlik verilmesi tercih edilecek (ör. `villagerId:001` … `villagerId:100`).
- Her karakter için `recentLetterIds` benzeri rolling history en fazla **30 kayıt** tutacak.
- Yeni mektup seçilirken bu 30 ID aday havuzundan çıkarılacak.
- Mektup başarıyla gönderildikten sonra seçilen ID geçmişe eklenecek; 30’u aşınca en eski kayıt çıkarılacak.
- Generic/fallback bir metin kullanılırsa o nihai metin de aynı karakterin 30 mektupluk tekrar geçmişine dahil edilecek.
- Bu geçmiş de save/restart sonrasında korunacak; uygulama kapanıp açıldığında anti-repeat sistemi sıfırlanmayacak.

### 7.3. Gönderim sırası

Bir mektup üretileceğinde seçim sırası şu şekilde olacak:

1. Aktif / mektup gönderebilen köylüler alınacak.
2. Son 10 gönderici içinde bulunan karakterler elenecek.
3. Kalan adaylardan gönderen seçilecek.
4. Seçilen karakterin mektup havuzundan, o karakterin son 30 mektubunda kullanılmamış bir içerik seçilecek.
5. Mektup başarıyla oluşturulduktan sonra hem global son-10 gönderen geçmişi hem de karaktere özel son-30 mektup geçmişi güncellenecek.
6. Hiçbir aşamada anti-repeat kuralı sessizce gevşetilmeyecek.

## 8. Oyun durduğunda rakiplerin gelişimi de tamamen duracak

Mevcut rakip sistemi `src/main/bee.js` içindeki `rollRivals(day)` akışı üzerinden çalışıyor. Rakipler günlük olarak bal üretir, satış yapar, arı/kovan yatırımı yapar, kış/hastalık kaybı yaşayabilir ve net değerleri güncellenir.

6.3.4 ile birlikte temel kural şu olacak:

> **Oyuncunun oyun simülasyonu hangi nedenle durdurulmuşsa, rakip çiftliklerinin simülasyonu da aynı süre boyunca duracak.**

### 8.1. Duraklatma kapsamı

Aşağıdaki durumlardan herhangi biri aktifse rakipler ilerlemeyecek:

- Oyuncu oyunu manuel olarak **duraklattığında** (`speed = 0`).
- Arıcılık penceresi uzun süre görülmediği için mevcut unattended/pause sistemi oyunu dondurduğunda.
- İleride oyunun genel simülasyonunu durduran başka bir resmi pause kuralı eklenirse, rakipler de aynı pause kaynağına bağlı olacak.

Bu madde yalnızca tek bir buton için yazılmayacak; rakipler **oyuncunun ana simülasyon saatini** takip edecek.

### 8.2. Pause sırasında yasak olan rakip değişimleri

Oyun duruyorken rakiplerde aşağıdakilerin hiçbiri gerçekleşmeyecek:

- Bal üretimi
- Bal satışı
- Jeton/para artışı veya azalışı
- Arı satın alma
- Yeni kovan yatırımı
- Hastalık kaynaklı arı kaybı
- Kış/şurup tüketimi veya kış kaybı
- Net değer değişimi
- Günlük performans geçmişine yeni kayıt eklenmesi
- Sıralamanın yalnızca rakip simülasyonu ilerlediği için değişmesi
- Rakip gelişim bildirimi / olay kaydı oluşturulması

### 8.3. Teknik güvenlik kuralı

- Mevcut akışta `rollRivals(day)`, `onNewDay()` içinden çağrılıyor ve oyun günü ilerlemediğinde dolaylı olarak çalışmıyor.
- Buna ek olarak 6.3.4'te rakip tarafına **açık bir pause güvenliği** konulacak; sistem yalnızca çağrının nereden geldiğine güvenmeyecek.
- `rollRivals()` veya onu çağıran ortak simülasyon katmanı, oyun gerçekten ilerlemiyorsa rakip state'ini değiştirmeden çıkacak.
- Böylece ileride kod yeniden düzenlense ve `rollRivals()` başka bir yerden çağrılsa bile, pause sırasında rakiplerin yanlışlıkla ilerlemesi engellenecek.
- Rakip gelişimi gerçek saat farkından catch-up yapmayacak; yalnızca gerçekten ilerlemiş **oyun günleri** kadar simüle edilecek.

### 8.4. Pause sonrası devam davranışı

- Oyuncu oyunu yeniden başlattığında rakipler kaldıkları state'ten devam edecek.
- Pause sırasında kaçırılmış gün varmış gibi toplu rakip üretimi/satışı yapılmayacak.
- Pause süresi rakiplerin geçmişine sonradan eklenmeyecek.
- Oyuncu ve rakipler aynı oyun takviminde kalacak.
- Dönüş özeti / sıralama karşılaştırması, pause sırasında rakiplerin ilerlediğini varsaymayacak.

### 8.5. Test kapsamı

Bu görev uygulanırken en az şu davranışlar test edilecek:

1. `speed = 0` iken rakip state'i değişmemeli.
2. Unattended pause aktifken rakip state'i değişmemeli.
3. Pause kaldırıldıktan sonra yalnızca yeni ilerleyen oyun günü için bir kez `rollRivals` çalışmalı.
4. Pause süresi için sonradan catch-up rakip gelişimi yapılmamalı.
5. Mevcut `bee-rivals-v5.6.test.js` davranışları bozulmamalı; aynı gün rakip simülasyonunun iki kez çalışmaması korunmalı.
6. Save/restart sonrası pause state'i varsa rakipler yanlışlıkla bir veya daha fazla gün ilerlememeli.

## Kilit Durumu

- Madde 7: KİLİTLİ
- 50 köylü × 100 mektup = 5.000 özel mektup: KİLİTLİ
- Aynı gönderen için sonraki 10 mektup cooldown: KİLİTLİ
- Aynı karakterin son 30 mektubunda aynı içerik olmaması: KİLİTLİ
- Save/restart sonrası mektup geçmişinin korunması: KİLİTLİ
- Madde 8: KİLİTLİ
- Oyun durduğunda rakiplerin tüm gelişiminin durması: KİLİTLİ
- Pause sırasında catch-up rakip gelişimi yapılmaması: KİLİTLİ
- Rakip pause davranışının explicit guard + test ile güvenceye alınması: KİLİTLİ
- Madde 9: HENÜZ BELİRLENMEDİ
