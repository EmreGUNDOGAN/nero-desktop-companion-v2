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

## Üçüncü görünüm: Kartlı finans

6 Ekim 2026: Kullanıcı ilk modern görünümün boşluklarını ve profesyonelliğini yetersiz buldu; lacivert bakiye ve gelir/gider alanı, renkli sıralı kategori kartları ve bütçe ilerlemesi içeren ikinci görseli yeni yön olarak verdi. Bu görsel önceliklidir. Telefon kasası, alt mobil menü, dekoratif köşe şekilleri, gölgeler ve gradient alınmadı. Üçüncü seçenek mevcut iki görünümün yanında, ayarlarda **Kartlı finans** olarak bulunur; mevcut tercih otomatik değiştirilmez.

- Verilen görselden: bakiye/aylık hareket hiyerarşisi, renkli kategori gruplaması, kompakt limit/kalan gösterimi. Fark: Nero'nun gerçek masaüstü boyutlarında sabit üst finans menüsü; fare ve klavye ile mevcut dialoglar; beklenen gelir, mevcut para ve toplam borcun muhasebe ayrımı korunur.
- [Keitoto — Finance Web App: Budget Allocation & Monthly Spending Cards](https://dribbble.com/shots/26393761-Finance-Web-App-Budget-Allocation-Monthly-Spending-Cards): sayfanın açıklaması incelendi. Kategori bazında harcama/limit gruplaması ve gider görünümü seçimi ilkeleri kullanıldı; tasarım birebir alınmadı. Araçta açılan görsel bağlantısı reklam görseline gittiğinden asıl ekranın ayrıntıları incelenmiş sayılmaz.
- [Pinterest — Personal Finance Dashboard](https://www.pinterest.com/pin/259097784806639175/): aramada bulundu, doğrudan sayfa erişilemedi. [Mobbin kataloğu](https://mobbin.com/browse/apps) da bu incelemede erişilemedi. Bu kaynaklardan görünmeyen ayrıntılar aktarılmış gibi değerlendirilmez.

Kartlı görünümün palette değerleri `budget-tokens.css`, yeniden kullanılan yapıları `budget-modern.css`, düzen farkları `budget-cards.css` içindedir. Kategori rengi anlam taşır; özel kategori renkleri korunur ve yazı kontrastı uyarlanır. Gerçek kayıt yoksa açıklama ve kayıt ekleme eylemi gösterilir; üretim verisine örnek para/işlem eklenmez. Arayüz testi ekran görüntüsündeki kayıtlar yalnız geçici test verisidir.

Ana gezinme hatası: modern kök elemanın `display:grid` kuralı, eşit CSS önceliği nedeniyle daha önceki `[hidden]` kuralını geçersiz kılıyordu. Gizli bütçe paneli artık bütün finans görünümlerinde kesin olarak gizlenir; diğer ana sayfalar tek başına görünür.

## Onaylanan görselin koda uygulanması

Kullanıcının 6 Ekim 2026 akşamı paylaştığı Pinterest ekran görüntüsü ve ardından onayladığı Nero önizlemesi esas alındı. Kartlı finans görünümü yerel, tutarlı çizgi SVG ikonları; yuvarlak kategori sembolleri; lacivert bakiye ve aylık gelir/gider grubu; tek satırda harcama/limit/kalan gösteren tam genişlik bütçe kartlarıyla güncellendi. Hesap, işlem listesi, ödemeler, rapor, takvim, akademi ve kayıt dialogları aynı tipografi, aralık ve kontrol kurallarını kullanır.

- Üretim kodu düz renkli tokenlar kullanır; oluşturulan örnekteki raster doku/ışık etkileri CSS'e taşınmaz. Dış Nero çerçevesi seçilen uygulama temasında kalır.
- Menü üstte sabittir; sadece içerik kaydırılır. SVG içindeki tıklamalar da ilgili işlemi açar. Klavyede görünür odak çerçevesi vardır.
- Hover ve basılma durumları tutarlıdır; kısa renk geçişleri azaltılmış hareket tercihinde kapatılır.
- Mevcut iki görünümün ikon/yerleşimleri korunur. Yeni simgeler sadece Kartlı finans görünümünde etkinleşir.
- 100 marka ikonu çevrimdışı mevcut kalır. Firma bilinmiyorsa yerel genel SVG gösterilir; uydurma işlem veya varsayılan bakiye eklenmez.
- SVG seti `budget-icons.js` içinde, stil ölçüleri `budget-tokens.css` içinde merkezi olarak bulunur. Tutar, vade ve muhasebe hesapları değiştirilmedi.

Önizleme temsili tasarımdır; teslimde ayrıca gerçek 440 × 660 Electron ekran görüntüleri verilir. Küçük pencerede tüm içerik sıkıştırılmaz; aşağıdaki kartlar kaydırmayla okunur. Rahat/Büyük yazı seçimi korunur.
