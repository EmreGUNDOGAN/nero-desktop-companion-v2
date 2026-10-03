# Nero 6.6.1

## Oyun Mekanikleri ve Yaşayan Ada Düzeltmeleri

Bu sürüm, 6.6.0 sonrasında kilitlenen ekonomi, turnuva, üretim, köy, pazar, sipariş, mektup, yaşayan ada ve güncelleme ekranı düzeltmelerini içerir. Ayrıntılar geliştirme aşamaları tamamlandıkça bu changelog altında güncellenecektir.

## Turnuva ve Liderlik
- Turnuva ödülleri 300 / 200 / 100 🪙 olarak tek kaynağa bağlandı.
- Turnuva ödülü gerçek cüzdana gelir ancak rekabetçi liderlik net değerini şişirmez.
- Rakipler turnuvaya yalnız önceden ayırdıkları gerçek stokla katılır; hayali bal oluşturulmaz.
- Rakip tarh, tohum, kovan kapasitesi, hastalık, şurup ve depo kararları gerçek ekonomik state üzerinden ilerler.
- Turnuva puanı sezon ortalaması sağlık/biyoçeşitlilik verilerini kullanır ve 15. günde sonuçlanır.

## Üretim Çarpanları
- Tarh bonusları tekrar 6.4.0 mantığında yalnız ilgili tarhın bal payına uygulanır; farklı tarh yüzdeleri bütün kovana toplanmaz.
- Biyoçeşitlilik bal üretimine ikinci bir global yüzde eklemez; kalite ve hastalık dayanıklılığı metriği olarak kullanılır.
- Üretim tooltip'i yüzdeler yerine hesapta kullanılan `×1.xx / ×0.xx` çarpanlarını gösterir.

## Atölye İlerlemesi
- Arıcılık Atölyesi artık 9. yerleşimciyle açılır; Fırın 30. sıraya taşındı.
- Atölye ekranına Üretim ve Rehber / Nasıl Çalışır? sekmeleri eklendi.
- Geç köy yapıları temel Atölye erişimini kilitlemek yerine yeni seviye ve tarifler açar.

## Fiziksel Pazar ve Ürün Ekonomisi
- İşaretli `-3,0` karesine fiziksel Pazar eklendi; haritadaki Pazar ile alt menüdeki Pazar aynı ekranı açar.
- Pazarcı kalıcı NPC olarak eklendi; açılmış dükkân sahipleri günlük olarak ürünlerini Pazara yürüyerek bırakır.
- Açılmış dükkânların yarı mamulleri Pazardan satın alınabilir hale geldi.
- Siparişler ekranı **Bal Siparişleri** ve **Ürünler ve Mallar** sekmelerine ayrıldı; ürün rezervasyonu satıştan korunur.

## Mektuplar ve Yaşayan Ada
- Mektuplar 30–45 gerçek dakikaya bağlandı; oyun hızı süreyi değiştirmez, aynı metin 3 oyun günü tekrarlanmaz ve az köylüde sistem kilitlenmez.
- Kapalı süre için en fazla bir catch-up mektubu işlenir.
- NPC'lerin topluca 18:00/20:00'de kaybolması kaldırıldı; sabah, öğle, akşam ve gece yoğunluğu doğal hale getirildi.
- Festival alanı festival dışında da günlük yaşam alanı olarak kullanılır.
- Dört mevsim için 15'er adet, toplam 60 benzersiz Island Life ana sahnesi eklendi.

## Güncellemeler Ekranı
- Güncelleme kartlarının cümleyi ortadan bölerek başlık üretmesi kaldırıldı.
- Son 10 yayımlanmış sürüm için temizlenmiş gerçek başlık ve bağımsız açıklamalar eklendi.
- Gelecek sürümler gerçek Markdown başlıklarından güvenli biçimde ayrıştırılır; release linki ve geri/ileri gezinme korunur.

## Ekonomi, Görev ve Save Güvenliği
- Pazar Tahmin Kartı artık ertesi gün gerçekten uygulanacak piyasa state'ini kilitler.
- Solmuş pahalı çiçekleri düşük maliyetle canlandırıp liderlik puanı üretme açığı kapatıldı; tohum/tarh defter değeri gerçek ekonomik maliyete bağlandı.
- Irk değişimi gibi hizmet harcamaları çiftlik varlığı sayılmaz.
- Üretim yolu olmayan hasat görevleri ve mevcut serbest stoktan fazla satış isteyen görevler elendi.
- Tam dolu eski savelerde sabit Atölye karesi migration'ı taşınacak güvenli yer bulamazsa mevcut objeyi silmez.
- Kritik oyun kuralları backend `rules` görünümünde toplandı; UI/rehber/CI eski değerlerle ayrıştığında testler hata verir.

## Doğrulama
- Gerçek 6.6.0 `bee.json` kaydıyla migration smoke testi: coin, kovan, köy, bal ve tile state'i korunuyor.
- Dört oyun yıllık uzun simülasyon tamamlandı.
- 236 / 236 otomatik test, dialogue master kontrolü ve JavaScript syntax kontrolleri geçti.