# Nero finans arayüzü: masaüstü referans incelemesi

Kontrol: 6 Ekim 2026. Hedef: mevcut 440 × 660 masaüstü penceresi; mobil uygulama değildir. Uygulama yeniden boyutlandırıldığında aynı bilgi hiyerarşisi korunur.

Öncelik: DESIGN.md → kullanıcı tarafından verilen/onaylanan ekranlar → Nero tasarım sistemi → mevcut bileşenler → dış referanslar. İncelemede mevcut projede DESIGN.md bulunamadı; yerine dış referanslardan yeni bir tasarım sistemi dayatılmadı. Kullanıcının son onayladığı modern örnek esas alınır.

| İncelenen kaynak | Kapsam | Nero'ya aktarılacak ilke |
|---|---|---|
| [Copilot: Transactions (macOS)](https://help.copilot.money/en/articles/9554412-transactions-tab-overview) | Masaüstü işlem listesi, filtreler ve ayrıntı görünümü | Firma adı solda, tutar sağda hizalı; ayrıntılar ayrı pencerede; filtre ve işlem ekleme aynı görev grubunda. |
| [Copilot: Recurrings](https://help.copilot.money/en/articles/9778259-recurrings-tab-overview) | macOS'ta liste düzeni, ödenmiş/bekleyen tekrarlar | Tarih ve durum birlikte okunur; ödenmiş ve bekleyen kayıtlar ayrılır. |
| [Monarch: Dashboard](https://help.monarch.com/hc/en-us/articles/360058127551-Customizing-Your-Dashboard) | Finans bilgilerini özetleyen ayrı kartlar | Mevcut para, beklenen gelir ve toplam borç aynı sayı gibi sunulmaz; görevlerine göre ayrı gruplar. Kartları kullanıcıya sürükleterek özelleştirme gibi yeni özellikler kapsam dışıdır. |
| [Dribbble: Recurring Payment UI](https://dribbble.com/search/recurring-payment-ui) | Abonelik, hizmet ikonu ve ödeme grupları için keşif | Sadece bilgi yoğunluğu ve firma/durum hiyerarşisi; sunumlardaki dekoratif stiller alınmaz. |
| [Pinterest: Personal finance dashboard](https://in.pinterest.com/pin/dashboard-personal-finance--709035535112458400/) | Finans dashboard referansı için keşif | Arama sonucunun ötesinde erişilemeyen görsel ayrıntıları uygulanmış sayılmaz. |
| [Mobbin](https://mobbin.com/) | Herkese açık arayüz örnekleri katalog kontrolü | Belirli finans akışlarına doğrulanmış erişim yok; oturum gerektiren ekranlar incelenmiş gibi gösterilmez. |

## Uygulama sınırları

- Telefon alt menüsü, swipe-only işlem veya mobil bottom sheet yerine fare/klavye erişimi, modern görünümde sabit sol menü, Nero görünümünde sabit bölüm sekmeleri ve mevcut dialog yapısı.
- Onaylanan lacivert, açık yüzey, indigo vurgu ve gelir/gider renkleri ortak finans tokenları üzerinden kullanılır. Firma logoları kendi tanınan renklerini korur.
- Düz renkler; yeni gradient, glow, dekoratif doku, rastgele renk, gölge veya kenarlık sistemi yok.
- Mevcut kart, liste, form, yardım ve dialog bileşenleri yeniden kullanılır; yeni CSS değerleri merkezi tokenlara taşınır.
- Üretim ekranları yalnız gerçek kullanıcı kayıtlarını gösterir. Tasarım örneğindeki sayılar kaynak koda varsayılan bakiye veya sahte işlem olarak eklenmez.
- Ana tutar tek odak noktasıdır. İkincil bilgiler kısa, tutarlar tabular hizalıdır. Boş durumlarda ilgili kayıt oluşturma eylemi bulunur.
- Uzun içerik kaydırılırken finans menüsü görünür kalır. Açılan yardım, kayıt taslağını kaybettirmez.

## Onaylanan modern yerleşim ve tema seçimi

Önceki örnekler aynı kart düzenini tekrarladığı için yeterli tasarım değişikliği göstermedi. Yeni örnek, aynı 440 × 660 masaüstü sınırında finans gezinmesini sabit sol sütuna taşır; büyük koyu bakiye kartı yerine açık yüzeyde tipografik bakiye kullanır. Beklenen gelir ve ödenecek tutar kompakt bir karşılaştırma grubunda, işlem listesi ise ayrı hizalı satırlarda gösterilir. Kullanıcı onayıyla modern görünüm bu düzene geçti. Son ek talebe göre Nero temasına uyumlu görünüm de korunarak finans ayarlarına seçim eklendi.

- [FinanceQ — Dima Strizhak](https://dribbble.com/shots/27333185-Personal-Finance-Dashboard-SaaS-UI-UX-Design): tasarımcının açıklaması incelendi. Ana bakiyeye odaklanma, ikincil bilgileri geri planda tutma ve eylemleri ilgili bilgiye yakın yerleştirme ilkeleri kullanıldı. Sarı paleti ve özgün ekran düzeni alınmadı.
- [Sidebar Navigation — Farhad Ahmed](https://dribbble.com/shots/27658782-Sidebar-Navigation-Dashboard-UI-Component): tasarımcının açıklaması incelendi. Etiketli sabit gezinme, açık aktif durum ve ayrı yardım alanı örnek alındı. Referansın renkleri ve fazladan menüleri eklenmedi.
- [Pinterest — IBanko Finance Dashboard](https://www.pinterest.com/pin/323274079521657921/): görsel aramada bulundu; doğrudan sayfa 403 hatası verdi. Tam görsel incelenmiş veya buradan belirli detaylar aktarılmış gibi değerlendirilmedi.

Dar içerik alanında okunabilirlik ve menü genişliği gerçek Electron penceresinde kontrol edildi. Yeni özellik, örnek işlem verisi veya yeni renk sistemi eklenmeyecek.
