'use strict';
// Original Turkish educational explanations and worked examples; source links accompany each chapter.
(function(root){const handbook={
  "reviewed": "2026-10-06",
  "sources": {
    "cashflow": {
      "name": "CFPB · Nakit akışı bütçesi",
      "url": "https://files.consumerfinance.gov/f/documents/cfpb_your-money-your-goals_cash_flow_budget_tool_2018-11_ADA.pdf"
    },
    "spending": {
      "name": "CFPB · Harcama takibi",
      "url": "https://files.consumerfinance.gov/f/documents/cfpb_your-money-your-goals_spending_tracker_2018-11_ADA.pdf"
    },
    "emergency": {
      "name": "CFPB · Acil durum birikimi",
      "url": "https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/"
    },
    "goals": {
      "name": "CFPB · Somut hedefler",
      "url": "https://files.consumerfinance.gov/f/documents/cfpb_your-money-your-goals_SMART-goals_tool_2018-11.pdf"
    },
    "debt": {
      "name": "CFPB · Borç ödeme yöntemleri",
      "url": "https://files.consumerfinance.gov/f/documents/cfpb_your-money-your-goals_debt-action-plan_tool_2018-11.pdf"
    },
    "bills": {
      "name": "CFPB · Ödeme takvimi",
      "url": "https://files.consumerfinance.gov/f/documents/cfpb_your-money-your-goals_bill_calendar_tool_2018-11_ADA.pdf"
    },
    "credit": {
      "name": "CFPB · Kartta kesim ve ödeme aralığı",
      "url": "https://www.consumerfinance.gov/ask-cfpb/what-is-a-grace-period-for-a-credit-card-en-47/"
    },
    "inflation": {
      "name": "TCMB · Enflasyon ve fiyat istikrarı",
      "url": "https://www.tcmb.gov.tr/wps/wcm/connect/TR/TCMB%2BTR/Main%2BMenu/Temel%2BFaaliyetler/Para%2BPolitikasi/Fiyat%2BIstikrari%2Bve%2BEnflasyon/"
    },
    "disinflation": {
      "name": "TCMB · Dezenflasyon nedir?",
      "url": "https://tcmb.gov.tr/wps/wcm/connect/ekonomi/hie/icerik/dezenflasyon"
    },
    "compound": {
      "name": "Investor.gov · Bileşik büyüme hesaplayıcısı",
      "url": "https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator"
    },
    "diversification": {
      "name": "Investor.gov · Varlık dağılımı ve çeşitlendirme",
      "url": "https://www.investor.gov/introduction-investing/getting-started/asset-allocation"
    },
    "risk": {
      "name": "Investor.gov · Risk türleri",
      "url": "https://www.investor.gov/introduction-investing/investing-basics/what-risk"
    },
    "fees": {
      "name": "Investor.gov · Yatırım ücretleri",
      "url": "https://www.investor.gov/introduction-investing/getting-started/understanding-fees"
    },
    "fraud": {
      "name": "Investor.gov · Dolandırıcılıktan korunma",
      "url": "https://www.investor.gov/protect-your-investments/fraud/how-avoid-fraud"
    },
    "save": {
      "name": "Investor.gov · Biriktirme ve yatırım",
      "url": "https://www.investor.gov/introduction-investing/investing-basics/save-and-invest"
    }
  },
  "chapters": [
    {
      "id": "money-map",
      "title": "Paranın haritasını çıkar",
      "group": "Başlangıç",
      "intro": "Banka bakiyesi, aylık gelir ve kullanabileceğin para aynı şeyi anlatmaz.",
      "sections": [
        {
          "heading": "Üç ayrı soru",
          "text": "Nerede ne kadar param var? Bu ay ne kadar kazandım? Önümüzdeki günlerde ne ödeyeceğim? İlk soru bir anlık fotoğrafı, diğerleri bir dönemi ve takvimi anlatır. Hesabında görünen paranın tamamını harcanabilir saymadan önce yaklaşan zorunlu ödemeleri ve borçlarını incele."
        },
        {
          "heading": "Nero’da nasıl düşünmelisin?",
          "text": "Hesap, paranın bulunduğu yerdir: cüzdan, banka veya kredi kartı. Kategori ise paranın neden geldiğini ya da nereye harcandığını anlatır: maaş, market, ulaşım. YouTube geliri bir gelir kategorisi; bu ödemenin yattığı banka ise hesaptır. Bir platformda henüz hesabına yatmamış tahmini kazanç, gerçekleşmiş gelirle aynı değildir."
        },
        {
          "heading": "Kayıtlarının sınırı",
          "text": "Nero yalnız girdiğin kayıtları bilir. Eksik nakit harcamaları, unutulan kartlar ve banka ücretleri özetin doğruluğunu etkiler. Başlangıçta bütün hesaplarını eklemek ve bakiyelerini gerçek kayıtlarla karşılaştırmak, gösterişli bir grafikten daha önemlidir."
        }
      ],
      "example": "Banka hesabında 12.000 TL, cüzdanında 500 TL, kartında 4.000 TL borç varsa kayıtlı net varlığın 8.500 TL’dir. Bankadaki 12.000 TL, bu ay kazandığın gelir değildir. Yarın 7.000 TL kira ödeyeceksen bu ödeme bugünkü banka bakiyende görünmese bile kararını etkiler.",
      "steps": [
        "Banka, cüzdan ve kartlarını ayrı hesaplar olarak ekle.",
        "Bakiyeyi bankadan; nakdi gerçekten sayarak kontrol et.",
        "Gelir kaydını para gerçekleştiğinde oluştur."
      ],
      "pitfall": "Kart limitini sahip olduğun para gibi toplamak, borç kapasitesiyle varlığı karıştırır.",
      "sources": [],
      "related": [
        "income",
        "cash-flow",
        "net-worth"
      ],
      "tool": null,
      "minutes": 4
    },
    {
      "id": "income",
      "title": "Gelirini doğru kaydet",
      "group": "Başlangıç",
      "intro": "Kazanılan para ile hesaplar arasında taşınan parayı ayır.",
      "sections": [
        {
          "heading": "Düzenli ve değişken gelir",
          "text": "Maaş, serbest çalışma, satış ve içerik üretimi farklı gelir kaynaklarıdır. Hangi kaynağın düzenli olduğunu görmek plan yapmayı kolaylaştırır. Tek seferlik yüksek bir ödeme gelecekte her ay aynı tutarı alacağın anlamına gelmez. Geliri hem tutarı hem gerçekleşme tarihiyle kaydet."
        },
        {
          "heading": "Net tutar ve kesintiler",
          "text": "Takip sınırını tutarlı belirle. Kişisel bütçede hesabına geçen net tutarı kaydedebilirsin. Brüt geliri ayrıca izliyorsan kesintileri de ayrı gider olarak kaydetmen gerekir; hem brüt hem net ödemeyi gelir yazmak toplamı şişirir. Vergi ve ticari yükümlülüklerin kişisel bütçeden ayrı muhasebe gerektirebilir."
        },
        {
          "heading": "Hesaplar arası hareket",
          "text": "Kendi bankandan cüzdanına para çekmek yeni kazanç değildir. Bu hareket transferdir. Başlangıç bakiyesi de geçmişten gelen paranın takibe girişidir; o ay kazanılmış sayılmaz."
        }
      ],
      "example": "Bir ödeme için 10.000 TL kazanıp hesabına 9.000 TL geçtiğini varsay. Yalnız kişisel net takibi yapıyorsan 9.000 TL gelir kaydedersin. Brüt takibinde ise 10.000 TL gelir ve 1.000 TL kesinti gideri aynı sonucu verir. İkisini birlikte gelir yazarsan gerçekte olmayan 19.000 TL görünür.",
      "steps": [
        "Gelir ekle düğmesinden paranın geldiği hesabı seç.",
        "Maaş ve değişken iş gelirlerini ayrı kategorilerde tut.",
        "Kayıt açıklamasına dönem veya ödeme kaynağını yaz."
      ],
      "pitfall": "Beklenen ödemenin tarihi ile gerçekten alınan tarihin farklı olabileceğini unutma.",
      "sources": [
        "cashflow"
      ],
      "related": [
        "irregular",
        "money-map"
      ],
      "tool": null,
      "minutes": 4
    },
    {
      "id": "spending",
      "title": "Harcamalarını anlamlandır",
      "group": "Başlangıç",
      "intro": "Harcama takibi kendini suçlamak için değil, kararlarını görmek içindir.",
      "sections": [
        {
          "heading": "Önce gözlemle",
          "text": "Değişiklik kararı vermeden önce bir dönem boyunca gelir ve harcamalarını kaydet. Küçük ödemeler tek tek önemsiz görünse de birlikte fark yaratabilir. Fiş ve açıklama, bir ay sonra işlemin ne olduğunu hatırlatır."
        },
        {
          "heading": "Kategorileri sade tut",
          "text": "Bir kategori sana karar verdirmiyorsa çok ayrıntılı olabilir. Market, ulaşım, ev, sağlık ve keyif harcamalarıyla başlayıp ihtiyaç olduğunda alt kategori aç. Tek fişte birkaç tür alışveriş varsa işlem tutarını kategorilere böl; toplam paylar fişle eşit olsun."
        },
        {
          "heading": "İade ve kıyas",
          "text": "İade, ilk harcamayı kısmen veya tamamen geri alır. İadeyi yeni maaş gibi göstermek gelirini yanıltır. Büyük tek seferlik bir eşya alımını her ay tekrarlanan giderle karşılaştırırken açıklamasını ve dönemini dikkate al."
        }
      ],
      "example": "1.000 TL’lik alışverişin 700 TL’si market, 300 TL’si ev eşyası olsun. İki ayrı 1.000 TL gider yerine tek işlemi bu paylara böl. Bir ürün için 200 TL iade aldığında ilgili gideri iade kaydıyla azalt. Böylece toplam net gider 800 TL olur.",
      "steps": [
        "Bir hafta sonunda kategorisiz veya açıklamasız kayıtları kontrol et.",
        "Harcama grafiğinde büyük kategoriyi açıp işlemlere bak.",
        "Değiştirmek istediğin tek bir harcama alışkanlığını seç."
      ],
      "pitfall": "Çok ayrıntılı kategoriler kayıt tutmayı zorlaştırıyorsa sadeleştirmek daha faydalıdır.",
      "sources": [
        "spending"
      ],
      "related": [
        "needs",
        "monthly-review"
      ],
      "tool": null,
      "minutes": 4
    },
    {
      "id": "needs",
      "title": "İhtiyaç, istek ve esnek gider",
      "group": "Bütçe kurma",
      "intro": "Bir giderin gerekli olması, tutarının hiç değişemeyeceği anlamına gelmez.",
      "sections": [
        {
          "heading": "Sınıflandırmanın amacı",
          "text": "Barınma, gıda ve zorunlu ulaşım gibi ihtiyaçlarla kişisel tercihleri ayırmak, daralan bütçede öncelik belirlemeyi kolaylaştırır. Aynı harcama farklı kişilerin yaşam koşullarında farklı anlam taşıyabilir. İş için gerekli interneti keyif aboneliğiyle aynı şekilde değerlendirme."
        },
        {
          "heading": "Sabit ve değişken ayrı bir eksendir",
          "text": "Sabit gider düzenli veya benzer tutarda gelen ödemedir; değişken gider ay içinde değişir. Sabit gider mutlaka ihtiyaç, değişken gider mutlaka istek değildir. Kira sabit ihtiyaç; yıllık eğlence aboneliği düzenli bir istek olabilir. Gıda ihtiyacı ise tutarı değişen bir giderdir."
        },
        {
          "heading": "Karar soruları",
          "text": "Bu gideri azaltırsam günlük yaşamım veya işim nasıl etkilenir? Aynı ihtiyacı daha düşük maliyetle karşılayabilir miyim? Taahhüt, iptal bedeli veya geçiş maliyeti var mı? Sadece fiyatı düşürmek yerine toplam etkiyi değerlendirmek daha gerçekçi bir plan sağlar."
        }
      ],
      "example": "Aylık internet 600 TL ve kullanılmayan bir abonelik 200 TL olsun. İkisi de düzenli ödenir ama kullanım amaçları farklıdır. Önce kullanılmayan aboneliği gözden geçirmek, iş için gerekli bağlantıyı kesmekten daha uygun bir seçenek olabilir. Bu örnek bütün kullanıcılar için aynı öncelik sırasını dayatmaz.",
      "steps": [
        "Kendi koşullarına göre zorunlu ödemeleri belirle.",
        "Kullanmadığın hizmetleri ayrı bir listeye yaz.",
        "Değişiklikten önce sözleşme ve iptal koşullarını kontrol et."
      ],
      "pitfall": "Her keyif harcamasını yasaklamak sürdürülemeyen bir bütçeye yol açabilir.",
      "sources": [
        "spending"
      ],
      "related": [
        "budget-plan",
        "purchase"
      ],
      "tool": null,
      "minutes": 4
    },
    {
      "id": "budget-plan",
      "title": "Gerçekçi bir aylık bütçe kur",
      "group": "Bütçe kurma",
      "intro": "Bütçe, beklediğin gelire nasıl yön vereceğini anlatan esnek bir plandır.",
      "sections": [
        {
          "heading": "Kayıttan plana geç",
          "text": "Önce yakın dönem gerçekleşen harcamalarını gör. Sonra düzenli ödemelerini, beklenen gelirini ve hedeflerini birlikte değerlendir. Limitleri hiçbir veri olmadan çok düşük koyarsan her ay aşım görmek seni yanıltabilir. Gıda, ulaşım ve mevsimlik giderler için gerçekçi paylar ayır."
        },
        {
          "heading": "Oranlar bir zorunluluk değildir",
          "text": "İnternette gördüğün bütçe yüzdeleri evrensel doğrular değildir. Kira düzeyi, aile yükümlülükleri ve gelir düzeni herkes için farklıdır. Bir oranı hedef diye kullanabilirsin; fakat gerçek ihtiyaçlarını o orana uydurmak için gerekli giderleri görmezden gelme. Gelir yetmiyorsa konu yalnız irade veya küçük harcamalar olmayabilir."
        },
        {
          "heading": "Limit ve devir",
          "text": "Nero’da toplam bütçe ile kategori limitleri birlikte izlenebilir; bunlar birbirine eklenen yeni harcamalar değildir. Devir, kullanılmayan limiti bir sonraki aya taşır. Bankada gerçekten yeni para oluşmaz. Harcama koşulları değişirse limiti gözden geçir ve değişikliğin nedenini not et."
        }
      ],
      "example": "30.000 TL beklenen gelire karşılık kira ve faturalar 16.000, gıda 7.000, ulaşım 2.000, diğer giderler 3.000 TL olsun. Kalan 2.000 TL birikim veya beklenmeyen gider için değerlendirilebilir. Gıda limitini 3.000 TL yazmak matematiksel olarak iyi görünür ama gerçek harcama geçmişi desteklemiyorsa uygulanabilir değildir.",
      "steps": [
        "Toplam aylık gider sınırını belirle.",
        "En çok karar vermek istediğin kategorilere limit koy.",
        "Ay ortasında ve ay sonunda planı gerçekleşenle karşılaştır."
      ],
      "pitfall": "Kategori limitlerinin toplamı ve genel limit farklı amaçlarla izlenir; tutarlılıklarını sen kontrol et.",
      "sources": [
        "cashflow"
      ],
      "related": [
        "cash-flow",
        "annual-costs"
      ],
      "tool": null,
      "minutes": 4
    },
    {
      "id": "cash-flow",
      "title": "Gelir yetiyor ama para neden bitiyor?",
      "group": "Bütçe kurma",
      "intro": "Nakit akışı, paranın ne zaman geldiğini ve ne zaman çıktığını anlatır.",
      "sections": [
        {
          "heading": "Aylık toplam yeterli olmayabilir",
          "text": "Ay sonunda gelir giderden büyük olsa bile ay başında ödeme sıkışması yaşayabilirsin. Gelir ve ödeme tarihlerinin farklı olması buna neden olur. Ödeme takvimi, yalnız toplam tutara bakınca göremediğin bu zaman farkını gösterir."
        },
        {
          "heading": "Kart gideri ile nakit çıkışı",
          "text": "Kartla alışveriş yaptığında gider oluşur, ama banka paran kart borcunu ödediğinde azalır. Bu yüzden Nero’daki gelir-gider farkı ile banka hesabının değişimi her zaman aynı değildir. Transferleri yeniden gider saymak bu farkı çözmez; aynı harcamayı iki kez sayar."
        },
        {
          "heading": "Bir haftalık kontrol",
          "text": "Önümüzdeki yedi günün gerçek bakiyesini, gelecek kesin gelirini ve ödeme tarihlerini yan yana yaz. Tarihi değiştirme veya borçlanma kararını otomatik kabul etme; sağlayıcıyla uygunluk ve maliyeti kontrol et. Planlanan gelir kesinleşmemişse onu garanti para gibi kullanma."
        }
      ],
      "example": "Başlangıç bakiyen 3.000 TL, ayın 5’inde kiran 8.000 TL, 15’inde gelirin 20.000 TL olsun. Aylık gelir yüksek olsa da 5’inde 5.000 TL ödeme açığı vardır. Takvim bu sorunu önceden gösterir. Gelirin 15’inden 3’üne kayması aynı aylık toplamla bambaşka bir nakit akışı yaratır.",
      "steps": [
        "Ödemeler sekmesindeki tarihleri gelir günlerinle karşılaştır.",
        "Önümüzdeki haftanın kullanılabilir nakdini kontrol et.",
        "Planlanan ödeme ile gerçekleşen işlemi ayrı tut."
      ],
      "pitfall": "Gelir−gider farkını gerçek banka nakit akışı olarak etiketlemek yanıltıcıdır.",
      "sources": [
        "cashflow"
      ],
      "related": [
        "cards",
        "irregular"
      ],
      "tool": null,
      "minutes": 4
    },
    {
      "id": "irregular",
      "title": "Düzensiz gelirle plan yapmak",
      "group": "Bütçe kurma",
      "intro": "Serbest çalışma ve içerik üretiminde her ay aynı gelir olmayabilir.",
      "sections": [
        {
          "heading": "İyi ayı kalıcı sanma",
          "text": "Tek yüksek gelirli aya göre yeni düzenli yükümlülükler almak, zayıf aylarda baskı yaratabilir. Gelir kayıtlarında birkaç dönemi birlikte gör; düşük, normal ve yüksek ay senaryolarını kendi geçmişine göre ayrı düşün. Geçmiş gelir geleceği garanti etmez."
        },
        {
          "heading": "Ödeme zamanını izle",
          "text": "İşin tamamlandığı gün, fatura günü ve paranın hesabına yattığı gün farklı olabilir. Kişisel harcama planını gerçekleşen para ve güvenilir ödeme tarihleriyle kur. Beklenen gelir için plan oluşturabilirsin; ancak Alındı demeden bunun gerçekleşmiş gelir sayılmaması bu ayrımı korur."
        },
        {
          "heading": "Temel giderleri görünür kıl",
          "text": "En düşük gelir senaryosunda zorunlu giderlerini nasıl karşılayacağını düşün. Vergi ve işle ilgili yükümlülükleri kişisel harcamadan ayrı değerlendir; gerekli tutarı ve zamanı yetkin bir uzmandan doğrula. İyi aylarda biriken paranın bir bölümü daha düşük aylar için tampon olabilir."
        }
      ],
      "example": "Üç ayın net gelirleri 18.000, 42.000 ve 24.000 TL ise ortalama 28.000 TL’dir. Bu ortalama gelecek ay 28.000 TL alacağın anlamına gelmez. 22.000 TL zorunlu giderin varsa 18.000 TL’lik ayda 4.000 TL açık yaşayacağını ayrıca değerlendirmelisin.",
      "steps": [
        "İş gelirlerini ayrı bir kategori veya etiketle izle.",
        "Düşük gelirli bir ay için ödeme takvimi çıkar.",
        "Beklenen ve alınmış ödemeleri karıştırma."
      ],
      "pitfall": "Ortalama gelir, ödeme tarihleri ve gelir oynaklığı hakkında tek başına yeterli bilgi vermez.",
      "sources": [
        "cashflow"
      ],
      "related": [
        "emergency",
        "annual-costs"
      ],
      "tool": null,
      "minutes": 4
    },
    {
      "id": "annual-costs",
      "title": "Yıllık gideri aylık plana çevir",
      "group": "Bütçe kurma",
      "intro": "Her ay gelmeyen bir ödeme, beklenmedik ödeme demek değildir.",
      "sections": [
        {
          "heading": "Düzensiz ama öngörülebilir",
          "text": "Yıllık üyelikler, bakım, okul ihtiyaçları ve belirli dönemlerde yapılan büyük ödemeler takvimde önceden bilinebilir. Bunları yalnız ödeme ayında düşünmek o ayın bütçesini sıkıştırır. Tutar belirsizse önce tahmin yapıp gerçek teklif veya faturayla güncelle."
        },
        {
          "heading": "Ayırmak ile ödemek farklıdır",
          "text": "Yaklaşan ödemeye para ayırmak hazırlıktır; gerçek ödeme yapılınca gider oluşur. Nero hedef rezervi hesap içindeki ayrımı gösterir, otomatik banka hareketi yaratmaz. Aynı parayı hem hazırlık sırasında hem ödeme sırasında gider yazmak toplamı iki kez artırır."
        },
        {
          "heading": "Yeterlilik kontrolü",
          "text": "Kalan süreye göre gereken aylık katkıyı hesapla. Hedefe az ay kalmışsa toplam tutarı on ikiye bölmek yetersiz olabilir. Para daha sonra başka ihtiyaç için harcanırsa hedef ekranındaki rezerv tek başına ödeme güvencesi değildir; hesabın gerçek bakiyesini de kontrol et."
        }
      ],
      "example": "Altı ay sonra 12.000 TL ödeme yapılacak ve bu iş için 3.000 TL ayrılmış olsun. Kalan 9.000 TL için aylık 1.500 TL katkı gerekir. Sıfır birikimle 12.000/12=1.000 TL ayırmak, ödeme yalnız altı ay uzaktaysa hedefi karşılamaz.",
      "steps": [
        "Büyük ödemeyi tarihli bir hedef olarak oluştur.",
        "Aylık ihtiyaç için Hedef hesaplayıcısını kullan.",
        "Ödeme yaklaşınca gerçek fiyatı ve bakiyeyi yeniden kontrol et."
      ],
      "pitfall": "Öngörülebilir bakım ile gerçek bir acil durumu aynı birikim amacı altında gizleme.",
      "sources": [
        "goals"
      ],
      "related": [
        "goals",
        "emergency"
      ],
      "tool": "goal",
      "minutes": 4
    },
    {
      "id": "emergency",
      "title": "Acil durum birikimini kur",
      "group": "Birikim",
      "intro": "Beklenmeyen gider için ayrılmış para, planlı alışveriş hedefinden farklıdır.",
      "sections": [
        {
          "heading": "Neyi karşılar?",
          "text": "Beklenmeyen onarım, sağlık gideri veya gelir kaybı gibi durumlar için bir nakit tamponu düşün. Gereken tutar yaşam koşullarına, gelir düzenine, sorumluluklarına ve geçmişte karşılaştığın sorunlara bağlıdır. Herkes için tek bir doğru miktar yoktur."
        },
        {
          "heading": "Küçük başlangıç da değerlidir",
          "text": "İlk hedefini ulaşılabilir seç. Düzenli katkı ve ilerlemeyi izlemek, büyük bir rakamı beklemekten daha uygulanabilir olabilir. Bu paranın gerektiğinde erişilebilir olması önemlidir. Riskli bir yatırımda aynı gün satılabilecek olması, değerinin aynı gün korunacağını garanti etmez."
        },
        {
          "heading": "Kullanım ve yenileme",
          "text": "Acil durum için ayrılan parayı hangi durumlarda kullanacağını önceden yaz. Kullanmak başarısızlık değildir; amacı bu tür sorunları karşılamaktır. Durum geçince katkı planını yeniden kur. Yaklaşan bilinen bir masraf için ayrı hedef oluşturarak bu tamponu yanlışlıkla tüketmemeye çalış."
        }
      ],
      "example": "Zorunlu aylık giderlerin 15.000 TL olsun. Deneme amaçlı iki aylık tampon seçersen hedef 30.000 TL olur; bu evrensel bir tavsiye değildir. Mevcut birikimin 6.000 TL ise önce 10.000 TL’lik bir ara hedef belirlemek ilerlemeyi daha görünür kılabilir.",
      "steps": [
        "Geçmişteki beklenmedik giderlerini listele.",
        "Kendi koşullarına göre hedef ve katkı belirle.",
        "Kullanımdan sonra yeniden doldurma planı yap."
      ],
      "pitfall": "Her kullanıcıya aynı ay sayısını dayatmak gelir ve sorumluluk farklarını yok sayar.",
      "sources": [
        "emergency"
      ],
      "related": [
        "goals",
        "risk"
      ],
      "tool": "emergency",
      "minutes": 4
    },
    {
      "id": "goals",
      "title": "Birikim hedefini somutlaştır",
      "group": "Birikim",
      "intro": "Ne için, ne kadar ve ne zamana kadar biriktirdiğini bil.",
      "sections": [
        {
          "heading": "Hedefi ölçülebilir yap",
          "text": "Belirli bir amaç, tutar ve tarih ilerlemeni değerlendirmeyi kolaylaştırır. Daha çok para biriktirmek yerine bir hedef tanımla. Zaman içinde fiyat değişebilir; hedefi yeniden hesaplamak planın doğal parçasıdır."
        },
        {
          "heading": "Katkıyı hesapla",
          "text": "Hedef tutarından mevcut birikimi çıkar ve kalan ay sayısına böl. Bu basit hesap getiri, fiyat değişimi veya masraf içermez. Katkı bütçenin taşıyabileceğinden büyük çıkarsa tutarı, tarihi veya diğer giderlerini yeniden düşün; gerçekçi olmayan bir plan için kendini suçlama."
        },
        {
          "heading": "Rezervin anlamı",
          "text": "Nero’da Para ayır işlemi aynı hesaptaki paranın bir hedefe ayrıldığını gösterir. Banka bu parayı kilitlemez. Gerçek hesabın bakiyesi azaldığında hedefteki eski rezervi gözden geçir. Hedefi arşivlemek uygulamadaki ayrımı kaldırır; yeni gelir yaratmaz."
        }
      ],
      "example": "20.000 TL’lik cihaz için 5.000 TL birikimin ve on ay süren olsun. Aylık basit katkı 1.500 TL’dir. Fiyat sonradan 23.000 TL olursa kalan süre ve birikimle yeniden hesaplamalısın. Hesaplayıcı bu fiyat değişimini kendiliğinden tahmin etmez.",
      "steps": [
        "Amaca uygun ad ve tarih gir.",
        "Katkının aylık bütçeye sığıp sığmadığını kontrol et.",
        "Ay sonunda fiyatı ve ilerlemeyi gözden geçir."
      ],
      "pitfall": "Birikim hedefi tamamlanma yüzdesi, paranın satın alma gücünü tek başına göstermez.",
      "sources": [
        "goals"
      ],
      "related": [
        "inflation",
        "annual-costs"
      ],
      "tool": "goal",
      "minutes": 4
    },
    {
      "id": "cards",
      "title": "Kredi kartının dört ayrı rakamı",
      "group": "Kart ve borç",
      "intro": "Limit, toplam borç, dönem borcu ve ödeme tutarı aynı değildir.",
      "sections": [
        {
          "heading": "Limit ve borç",
          "text": "Limit bankanın tanıdığı kullanım sınırıdır; gelir veya birikim değildir. Toplam borç, kartta henüz karşılanmamış tutarları izler. Dönem borcu belirli bir hesap kesiminde oluşan ekstre tutarıdır. Gelecek taksitler ve yeni alışverişler bu rakamlar arasındaki farkın nedenlerinden olabilir."
        },
        {
          "heading": "Kesim ve son ödeme",
          "text": "Kesim günü bir dönemin hesabı kapanır; son ödeme günü bankanın o dönem için belirttiği son tarihtir. Gerçek tarihleri bankanın ekstresinden doğrula. Tatil, dönem ve sözleşme koşulları farklılaşabilir. Nero seçtiğin ay gününü takip eder ve bankaya bağlı olmadığı için resmi ekstre tutarı üretmez."
        },
        {
          "heading": "İki kez gider yazma",
          "text": "Kart alışverişini yaparken gider kaydet. Daha sonra bankadan karta ödeme yaptığında transfer oluştur. Ödemeyi ikinci kez market gideri gibi yazmak raporu şişirir. İade kart hesabına gelirse ilgili iade işlemiyle borcu ve gideri azalt."
        }
      ],
      "example": "20.000 TL limitli kartla 3.000 TL alışveriş yaptıysan gelirine 20.000 TL eklenmez. Alışveriş 3.000 TL gider olur. Bankadan karta 3.000 TL ödeme transferdir. Ödeme sonrasında bankadaki para azalır ve kart borcu kapanır; aylık gider hâlâ 3.000 TL’dir.",
      "steps": [
        "Kart hesabına limit, mevcut borç ve günleri gir.",
        "Son ödeme günü bildirimini açık tut.",
        "Dönem borcu için bankanın ekstresini kontrol et."
      ],
      "pitfall": "Nero’daki yaklaşık dönem borcu banka ekstresinin yerine geçmez.",
      "sources": [
        "credit"
      ],
      "related": [
        "minimum",
        "cash-flow"
      ],
      "tool": null,
      "minutes": 4
    },
    {
      "id": "minimum",
      "title": "Asgari ödeme borcu neden kapatmaz?",
      "group": "Kart ve borç",
      "intro": "Kısmi ödeme yaptığında kalan borç ortadan kalkmaz.",
      "sections": [
        {
          "heading": "Temel mekanizma",
          "text": "Bir borcun yalnız bir bölümünü ödemek, kalan tutarı sonraki döneme taşıyabilir. Faiz, ücret ve yeni harcamalar borcun ilerleyişini etkiler. Kartın asgari tutarını ödemek ile dönem borcunun tamamını ödemek farklı işlemlerdir."
        },
        {
          "heading": "Sözleşme ve ülke farkı",
          "text": "Faizsiz alışveriş süresi, asgari oran, faiz başlangıcı ve ücretler ülkeye, bankaya ve ürününe göre değişebilir. Bu el kitabı sabit bir Türk asgari ödeme oranı veya güncel faiz vermez. Gerçek ödeme planında kendi bankanın resmi ekstresini ve sözleşmesini esas al."
        },
        {
          "heading": "Kalan bakiyeyi takip et",
          "text": "Ödediğin tutarı karta transfer kaydet ve kalan borcu incele. Faiz veya banka ücreti oluştuğunda onu ayrıca ilgili gider olarak gir; Nero bunları otomatik hesaplamaz. Ödeme güçlüğü varsa son günü beklemeden sağlayıcıyla seçenekleri ve toplam maliyeti konuş."
        }
      ],
      "example": "6.000 TL borcun 2.000 TL’sini ödersen, başka hareket olmadan 4.000 TL kalır. Varsayımsal bir sonraki dönemde 200 TL maliyet ve 500 TL yeni alışveriş eklenirse borç 4.700 TL olur. Bu örnekteki 200 TL herhangi bir bankanın güncel faiz oranı değildir.",
      "steps": [
        "Kalan borcu ve yeni alışverişleri ayrı gör.",
        "Faiz/ücret hareketlerini ekstreden kaydet.",
        "Yalnız ödeme tutarına değil toplam borcun değişimine bak."
      ],
      "pitfall": "Kısmi ödeme sonrasında kartı yeniden kullanmak borcun azalmasını yavaşlatabilir.",
      "sources": [
        "credit"
      ],
      "related": [
        "debt-methods",
        "installments"
      ],
      "tool": null,
      "minutes": 4
    },
    {
      "id": "installments",
      "title": "Taksiti toplam maliyetle değerlendir",
      "group": "Kart ve borç",
      "intro": "Küçük aylık ödeme, küçük toplam harcama anlamına gelmez.",
      "sections": [
        {
          "heading": "Aylık yük ve toplam fiyat",
          "text": "Bir alışverişi değerlendirirken peşin fiyatı, taksitlerin toplamını ve varsa ücretleri birlikte gör. Taksit sayısı arttıkça aylık ödeme küçülebilir; toplam maliyet aynı kalmak zorunda değildir. Yeni bir taksit, gelecek ayların bütçesine yükümlülük ekler."
        },
        {
          "heading": "Nero’daki kayıt yaklaşımı",
          "text": "Kart taksit planında alışveriş tam tutarla satın alma tarihinde gider/borç olarak kaydedilir. Aylık taksit ödemeleri bankadan karta transferdir. Banka veya nakit hesabından yapılan gider taksitleri ise ödendikçe gider olur. Bu iki yaklaşımı aynı alışverişte birlikte kullanma."
        },
        {
          "heading": "Karar kontrolü",
          "text": "Gelirin düşse veya başka zorunlu gider çıksa taksitlerini taşıyabilir misin? Mevcut taksitlerin hangi ayda biteceğini biliyor musun? Faiz, işlem ücreti ve kampanya koşullarını yazılı olarak kontrol et. Bir taksit planını duraklatmak bankadaki gerçek borcu iptal etmez."
        }
      ],
      "example": "Peşin fiyat 9.000 TL, altı taksit toplamı 10.200 TL ise toplam fiyat farkı 1.200 TL, aylık ödeme 1.700 TL’dir. Bu farkın hangi ücret ve koşullardan doğduğunu araştır. Aylık 1.700 TL’ye bakarak alışverişin maliyetini 1.700 TL sanma.",
      "steps": [
        "Peşin ve taksit toplamını yan yana yaz.",
        "Takvimde mevcut ve yeni taksitleri birlikte gör.",
        "Planın gerçek bankadaki koşullarını ayrıca doğrula."
      ],
      "pitfall": "Uygulamadaki planı silmek, atlamak veya duraklatmak sağlayıcıya ödeme yapılmış sayılmaz.",
      "sources": [
        "bills"
      ],
      "related": [
        "cards",
        "purchase"
      ],
      "tool": null,
      "minutes": 4
    },
    {
      "id": "debt-methods",
      "title": "Borç ödeme sırasını seç",
      "group": "Kart ve borç",
      "intro": "Maliyet ve sürdürülebilirlik iki ayrı karar ölçütüdür.",
      "sections": [
        {
          "heading": "İki yaklaşım",
          "text": "Yüksek faizli borca öncelik vermek, diğer şartlar eşitken faiz maliyetini azaltmaya odaklanır. Küçük bakiyeli borcu önce kapatmak ise görünür ilerleme sağlayabilir. İkincisi daha motive edici bulunabilir ama toplam maliyeti daha yüksek olabilir. Yöntemi seçerken koşulları karşılaştır."
        },
        {
          "heading": "Önce tablo kur",
          "text": "Her borcun bakiyesini, faizini, zorunlu ödemesini, tarihini ve varsa erken ödeme koşulunu yaz. Bir borca ek ödeme yaparken diğer yükümlülükleri yok sayma. Gecikme, cezalar veya özel sözleşmeler basit bir sıralamanın sonucunu değiştirebilir."
        },
        {
          "heading": "Ödeme kapasitesini test et",
          "text": "Ek ödemeyi gerekli yaşam giderlerini veya yakın bir ödemeyi karşılayamayacak kadar artırma. Planın düzenli uygulanabilir olması önemlidir. Nero otomatik borç danışmanlığı yapmaz; kart ve plan kayıtları gerçek bankanın hesaplamasıyla karşılaştırılmalıdır."
        }
      ],
      "example": "A borcu 5.000 TL ve aylık varsayımsal maliyet oranı %3; B borcu 2.000 TL ve oranı %1 olsun. Diğer koşullar aynıysa ek ödeme A’ya yöneldiğinde daha pahalı bakiye azalır. B’yi önce kapatmak bir borcu daha çabuk bitirir ama maliyet tercihini ayrıca düşünmelisin. Oranlar eğitim örneğidir.",
      "steps": [
        "Borçları tutar, maliyet ve tarihleriyle listele.",
        "Ödeme yöntemini neden seçtiğini not et.",
        "Her ay kalan toplamı ve gerçekleşen maliyeti kontrol et."
      ],
      "pitfall": "Tek bir yöntem herkesin sözleşmesine ve ödeme gücüne uygun değildir.",
      "sources": [
        "debt"
      ],
      "related": [
        "minimum",
        "cash-flow"
      ],
      "tool": null,
      "minutes": 4
    },
    {
      "id": "net-worth",
      "title": "Net varlık ve harcanabilir para",
      "group": "Birikim",
      "intro": "Varlık eksi borç bir fotoğraftır; aylık kazanç değildir.",
      "sections": [
        {
          "heading": "Nero’nun hesapladığı kapsam",
          "text": "Nero kayıtlı banka/nakit/kart bakiyelerini toplar, kartın eksi bakiyesi borcu azaltıcı değil varlığı düşürücü olarak yer alır. Dövizli bakiyeler kayıtlı güncel kurla ana para birimine çevrilir. Kayıtlı olmayan yatırım, ev, araç veya kredi bu uygulamadaki toplamda bulunmaz."
        },
        {
          "heading": "Nakit ile likidite",
          "text": "Toplam varlığın pozitif olması, yarınki ödemeyi nakit karşılayabileceğin anlamına gelmez. Bazı varlıkları hızla ve kayıp yaşamadan paraya çeviremeyebilirsin. Döviz kurunun artması ana para birimindeki görüntüyü değiştirebilir; yeni maaş aldığın anlamına gelmez."
        },
        {
          "heading": "Doğru etiket",
          "text": "Aylık gelir-gider farkı bir dönem ölçüsüdür. Net varlık ise belirli anda takip edilen hesapların değeridir. Hedeflere ayrılan para mevcut hesabın içindedir; aynı tutarı hedef ve hesap olarak iki kez toplama."
        }
      ],
      "example": "10.000 TL banka ve 3.000 TL kart borcu, 7.000 TL kayıtlı net varlık gösterir. Bunun 5.000 TL’si bir hedefe ayrılmışsa toplam 12.000 TL olmaz. Ayrıca 1.000 USD hesabının kur değişimi net varlığı değiştirebilir; bu hareket işlem gelirine kendiliğinden yazılmaz.",
      "steps": [
        "Eksik kuru tamamla.",
        "Hangi varlıkların uygulama dışında kaldığını not et.",
        "Ödeme kararında net toplamla birlikte kullanılabilir hesap bakiyesine bak."
      ],
      "pitfall": "Grafikte net varlığın artması her zaman tasarruf ettiğini kanıtlamaz.",
      "sources": [
        "risk"
      ],
      "related": [
        "money-map",
        "currency"
      ],
      "tool": null,
      "minutes": 4
    },
    {
      "id": "inflation",
      "title": "Enflasyon satın alma gücünü nasıl etkiler?",
      "group": "Ekonomiyi anlama",
      "intro": "Aynı miktar para zamanla aynı sepeti almayabilir.",
      "sections": [
        {
          "heading": "Genel fiyat düzeyi",
          "text": "Enflasyon, ekonomide mal ve hizmetlerin fiyatlarının genel düzeyindeki sürekli artıştır. Tek bir ürünün bir kez pahalanması bu kavramı tek başına açıklamaz. Enflasyon varken gelir ve birikimini sadece nominal tutarla değerlendirmek satın alma gücündeki değişimi gizleyebilir."
        },
        {
          "heading": "Kişisel sepet farklı olabilir",
          "text": "Harcama bileşimin ortalama tüketim sepetinden farklıdır. Kira, gıda ve ulaşım payların farklı olduğunda kendi bütçende hissettiğin artış yayımlanan oranla aynı olmayabilir. Kategorideki gider artışı da yalnız fiyat artışı değildir; daha çok ürün almış veya ürün türünü değiştirmiş olabilirsin."
        },
        {
          "heading": "Hedefini güncelle",
          "text": "Bir hedefin fiyatı değiştikçe gereken toplamı ve katkıyı yeniden hesapla. Eğitim hesaplayıcısına girilen enflasyon varsayımı gelecek için tahmin değildir. Güncel resmi oran gerektiğinde kaynağı ve dönemi kontrol et."
        }
      ],
      "example": "Geçen yıl 1.000 TL olan aynı sepet bu yıl varsayımsal %20 artışla 1.200 TL olur. Elindeki 1.000 TL artık bu sepetin tamamını alamaz. Aynı dönemde gelirinin %10 artması, bu örnekte sepetin fiyat artışına yetişmez. Bu yüzdeler Türkiye’nin güncel verisi değildir.",
      "steps": [
        "Aynı ürünün veya hedefin farklı tarihlerdeki fiyatını not et.",
        "Harcama artışında miktar değişimini de düşün.",
        "Nominal/reel hesaplayıcıda varsayımları karşılaştır."
      ],
      "pitfall": "Gider kategorisinin büyümesini doğrudan kişisel enflasyon oranı ilan etme.",
      "sources": [
        "inflation"
      ],
      "related": [
        "real-return",
        "disinflation"
      ],
      "tool": "real",
      "minutes": 4
    },
    {
      "id": "disinflation",
      "title": "Enflasyon düşünce fiyatlar düşer mi?",
      "group": "Ekonomiyi anlama",
      "intro": "Fiyat artış hızının azalması ile fiyatların azalmasını ayır.",
      "sections": [
        {
          "heading": "Üç kavram",
          "text": "Enflasyon fiyatların genel düzeyinin artmasıdır. Dezenflasyon bu artış hızının düşmesidir. Deflasyon ise genel fiyat düzeyinin düşmesi yönündeki süreçtir. Enflasyon hâlâ pozitifken oranının azalması, fiyatların geçmişteki seviyesine dönmesi demek değildir."
        },
        {
          "heading": "Bütçedeki etkisi",
          "text": "Fiyatlar daha yavaş yükselse bile bütçende artış devam edebilir. Bir haberdeki oranı hedef fiyatının otomatik ucuzlayacağı şeklinde yorumlama. Karşılaştırılan zaman aralığına ve fiyat düzeyine bak."
        },
        {
          "heading": "Kendi kontrolün",
          "text": "Bütçenin görevi ekonomik veriyi tahmin etmek değil, değişen koşulları fark etmene yardım etmektir. Aynı giderleri dönem dönem karşılaştırırken ürün miktarı, hizmet içeriği ve tek seferlik ödemeleri ayrı düşün."
        }
      ],
      "example": "Bir ürün önce 100 TL’den 120 TL’ye, sonra 132 TL’ye çıkarsa ilk artış %20, ikinci artış %10’dur. Artış oranı düşmüş ama fiyat yükselmeye devam etmiştir. 120 TL’den 114 TL’ye düşmesi ise o ürün için fiyat düşüşüdür; tek ürün ekonominin tamamını temsil etmez.",
      "steps": [
        "Haberde oran mı fiyat düzeyi mi anlatılıyor ayırt et.",
        "Karşılaştırılan dönemleri kontrol et.",
        "Hedef fiyatını oran haberine göre otomatik azaltma."
      ],
      "pitfall": "Enflasyon %20’den %10’a indi ifadesi, fiyatların yarıya indiği anlamına gelmez.",
      "sources": [
        "disinflation"
      ],
      "related": [
        "inflation",
        "monthly-review"
      ],
      "tool": null,
      "minutes": 4
    },
    {
      "id": "real-return",
      "title": "Nominal kazanç ile reel kazanç",
      "group": "Ekonomiyi anlama",
      "intro": "Paranın artması ve alım gücünün artması ayrı sorulardır.",
      "sections": [
        {
          "heading": "Dönemleri eşleştir",
          "text": "Nominal getiri para tutarındaki değişimi; reel getiri fiyat değişimine göre alım gücü değişimini anlatır. Aynı dönemin getiri ve enflasyonunu karşılaştır. Aylık getiri ile yıllık enflasyonu doğrudan yan yana çıkarma."
        },
        {
          "heading": "Hesap mantığı",
          "text": "Eğitim için tam ilişki: reel oran = (1 + nominal oran) / (1 + enflasyon oranı) − 1. Oranları ondalık olarak kullan. Nominal eksi enflasyon, küçük oranlarda yaklaşık fikir verebilir ama tam hesap değildir. Vergi ve masraflar dahil değilse sonuç bunlardan önceki değerdir."
        },
        {
          "heading": "Sonucu yorumla",
          "text": "Reel sonuç negatifse bu varsayımlar altında satın alma gücü azalmıştır. Pozitif sonuç riski ortadan kaldırmaz veya gelecek dönemi garanti etmez. Gerçek yatırım sonucu için maliyet, nakit giriş/çıkışı ve uygun dönem verisi ayrıca gerekir."
        }
      ],
      "example": "10.000 TL, varsayımsal %15 nominal artışla 11.500 TL olsun. Aynı dönemde fiyatlar %20 arttıysa başlangıç fiyatlarıyla alım gücü 11.500/1,20 = 9.583,33 TL’dir. Reel oran yaklaşık −%4,17 olur; doğrudan 15−20=−%5 hesabı tam sonuç değildir.",
      "steps": [
        "Aynı döneme ait oranları gir.",
        "Ücret ve vergilerin dahil olup olmadığını kontrol et.",
        "Hesaplayıcının senaryo olduğunu unutma."
      ],
      "pitfall": "Nominal artışı otomatik satın alma gücü artışı olarak yorumlama.",
      "sources": [
        "inflation"
      ],
      "related": [
        "compound",
        "fees"
      ],
      "tool": "real",
      "minutes": 4
    },
    {
      "id": "compound",
      "title": "Bileşik büyümenin matematiği",
      "group": "Yatırımı anlama",
      "intro": "Önceki dönemin artışı da sonraki dönemin hesap tabanına katılır.",
      "sections": [
        {
          "heading": "Basit ve bileşik farkı",
          "text": "Basit hesap başlangıç tutarı üzerinden ilerler. Bileşik hesapta oluşan tutar bir sonraki dönemin tabanıdır. Düzenli katkı, süre, oran ve büyümenin ne sıklıkla uygulandığı sonucu değiştirir. Uzun süre tek başına garanti kazanç yaratmaz."
        },
        {
          "heading": "Varsayımını açık yaz",
          "text": "Buradaki hesaplayıcı yıllık efektif varsayımı aylık eşdeğere çevirir ve katkıyı ay sonunda ekler. Sabit oran, yeniden yatırıma katılan sonuç ve değişmeyen katkı varsayar. Gerçek piyasa her ay aynı oranda ilerlemez; masraf, vergi ve enflasyon bu basit senaryoya dahil değildir."
        },
        {
          "heading": "Katkıyı ve artışı ayır",
          "text": "Hesaplanan son tutarın ne kadarı senin yatırdığın para, ne kadarı varsayımsal artış? Bu ayrım, birikimin büyüklüğünü getirinin büyüklüğüyle karıştırmanı önler. Negatif oran da denenebilir; bileşik ilişki kayıplar için de geçerlidir."
        }
      ],
      "example": "10.000 TL’nin iki yıl boyunca varsayımsal yıllık %10 büyüdüğünü düşün. İlk yıl 11.000, ikinci yıl 12.100 TL olur. Basit iki yıllık artış 12.000 TL olurdu. 100 TL fark, ilk yılın artışının da ikinci yıl büyümesinden doğar. Bu örnek bir yatırım vaadi değildir.",
      "steps": [
        "Önce %0 ile yalnız katkı etkisini gör.",
        "Sonra farklı pozitif ve negatif varsayımları dene.",
        "Katkı toplamı ile varsayımsal artışı ayrı oku."
      ],
      "pitfall": "Geçmiş getiriyi gelecekte sabit faiz gibi kullanmak yanıltıcıdır.",
      "sources": [
        "compound"
      ],
      "related": [
        "real-return",
        "risk"
      ],
      "tool": "compound",
      "minutes": 4
    },
    {
      "id": "risk",
      "title": "Risk sadece fiyat oynaklığı değildir",
      "group": "Yatırımı anlama",
      "intro": "Kaybetme ihtimali, erişim ve vade birlikte değerlendirilir.",
      "sections": [
        {
          "heading": "Farklı riskler",
          "text": "Piyasa fiyatı düşebilir, borçlanan kurum ödemeyebilir, enflasyon alım gücünü azaltabilir veya varlığı istediğin anda uygun fiyatla satamayabilirsin. Bir yatırımın bir riskini azaltmak bütün risklerini ortadan kaldırmaz."
        },
        {
          "heading": "İstek ve kapasite",
          "text": "Risk almak istemek ile kaybı taşıyabilmek farklıdır. Üç ay sonra zorunlu ödeme için kullanacağın paranın geçici değer düşüşüne dayanma imkânı sınırlı olabilir. Süre, gelir güvencesi ve borçların kararın parçasıdır."
        },
        {
          "heading": "Senaryo düşün",
          "text": "Yüksek getiri ihtimalini tek başına tartışmak yerine ters durumlarda ne olacağını da sor. Ürün nasıl çalışıyor? Kim karşı tarafta? Hangi ücret var? Acil satış gerekirse sonuç ne olabilir? Anlamadığın koşulları öğrenmeden sadece popülerliğe dayanma."
        }
      ],
      "example": "Altı ay sonra 20.000 TL ödeme yapacak bir kişi, bu paranın varsayımsal %25 değer kaybında 15.000 TL’ye düşmesini taşıyamayabilir. Aynı düşüşü uzun vadeli ve ayrı bir birikimde karşılayan başka kişinin koşulları farklıdır. Bu örnek herhangi bir ürünü seçmen için tavsiye değildir.",
      "steps": [
        "Paraya ne zaman ihtiyaç duyacağını yaz.",
        "Kayıp yaşanırsa hangi ödemeler etkilenecek düşün.",
        "Likiditeyi ve ürün koşullarını incele."
      ],
      "pitfall": "Düşük oynaklık etiketi, garantili veya risksiz anlamına gelmez.",
      "sources": [
        "risk"
      ],
      "related": [
        "diversification",
        "emergency"
      ],
      "tool": null,
      "minutes": 4
    },
    {
      "id": "diversification",
      "title": "Çeşitlendirme ne sağlar?",
      "group": "Yatırımı anlama",
      "intro": "Birden çok isim almak her zaman farklı risk almak değildir.",
      "sections": [
        {
          "heading": "Riski dağıtma",
          "text": "Varlık dağılımı farklı varlık türleri arasındaki payı; çeşitlendirme ise riskin birkaç yere dağılmasını anlatır. Seçim süreye ve risk taşıma kapasitesine bağlıdır. Çeşitlendirme belirli bir yatırımla ilgili yoğunlaşmayı azaltabilir; genel piyasa düşüşüne karşı kaybı tamamen önlemez."
        },
        {
          "heading": "Ortak maruziyet",
          "text": "Aynı sektördeki birkaç şirket veya birbirine çok benzeyen fonlar birlikte aynı gelişmeden etkilenebilir. Bir ürünün içinde neler bulunduğunu, ağırlıkları ve örtüşmeleri anlamak önemlidir. Sadece ürün sayısının artması yeterli kanıt değildir."
        },
        {
          "heading": "Bütçeyle bağlantısı",
          "text": "Nero yatırım portföy yönetim aracı değildir; hesap ve gelir/gider kapsamını korur. El kitabının amacı kavramı öğrenmendir. Buradan hisse yüzdesi veya alış/satış sinyali üretilmez."
        }
      ],
      "example": "Beş farklı teknoloji şirketi almak beş farklı isim oluşturur; ancak hepsi aynı sektör haberinden etkilenebilir. Farklı varlık sınıfları ve farklı ekonomik etkilere sahip araçlar başka bir yapı yaratır. Bu örnek belirli bir dağılımın herkes için doğru olduğunu söylemez.",
      "steps": [
        "Ürünlerin altında hangi varlıklar var incele.",
        "Tek sektör veya tek kurumda yoğunlaşmayı fark et.",
        "Çeşitliliğin garanti olmadığını hatırla."
      ],
      "pitfall": "Aynı riski taşıyan çok sayıda ürün, görünüşte çeşitlilik yaratabilir.",
      "sources": [
        "diversification"
      ],
      "related": [
        "risk",
        "fees"
      ],
      "tool": null,
      "minutes": 4
    },
    {
      "id": "fees",
      "title": "Küçük ücretlerin uzun vadeli etkisi",
      "group": "Yatırımı anlama",
      "intro": "Getiriyi değerlendirirken net sonucu oluşturan maliyetleri de gör.",
      "sections": [
        {
          "heading": "Ücret türleri",
          "text": "İşlem başına ücret, yıllık yönetim gideri ve başka hizmet bedelleri farklı şekillerde alınabilir. Tek seferlik bedelle her yıl tekrarlanan oranı aynı sanma. Ücretlerin nasıl ve hangi taban üzerinden hesaplandığını ürünün resmi açıklamasından kontrol et."
        },
        {
          "heading": "Büyüme tabanı etkisi",
          "text": "Bir ücret yalnız o günkü parayı azaltmaz; sonraki dönemlerde üzerinde büyüme hesaplanabilecek tutarı da azaltabilir. Küçük görünen düzenli farkların uzun süreli sonucu bu nedenle daha büyük olabilir. Ücret tek seçim ölçütü değildir; hizmet ve risk özellikleri de önemlidir."
        },
        {
          "heading": "Net kıyas",
          "text": "İki seçenek için aynı dönem, aynı varsayımsal brüt oran ve tüm maliyetlerle kıyas yap. Vergi kuralları ülke, ürün ve kişisel duruma göre değişebilir. El kitabı güncel vergi hesabı veya net yatırım önerisi üretmez."
        }
      ],
      "example": "100.000 TL’de yıllık %1 gider, basit ilk dönem hesabında 1.000 TL’dir. %0,2 gider 200 TL olur. 800 TL fark yalnız ilk dönem örneğidir; yıllar içinde bakiye değişir. Varsayımsal brüt getiri eşit olsa bile net sonuçları eşit sayamazsın.",
      "steps": [
        "Ücret tarifesini ve hesap tabanını oku.",
        "Bir defalık ve tekrarlanan maliyetleri ayır.",
        "Brüt getiriyi net sonuç gibi sunma."
      ],
      "pitfall": "Sadece düşük ücret, bir ürünü uygun veya güvenli yapmaz.",
      "sources": [
        "fees"
      ],
      "related": [
        "compound",
        "purchase"
      ],
      "tool": null,
      "minutes": 4
    },
    {
      "id": "currency",
      "title": "Döviz kurunu doğru yorumla",
      "group": "Ekonomiyi anlama",
      "intro": "Aynı yabancı para bakiyesi yerel para cinsinden farklı görünebilir.",
      "sections": [
        {
          "heading": "İşlem ve değerleme kuru",
          "text": "Yabancı para harcamanın yapıldığı andaki kur, raporun tarihsel giderini belirler. Güncel kur ise bugün elindeki bakiyenin ana para birimindeki görüntüsünü değiştirir. Nero bu iki hesabı ayırır; geçmiş işlemin kuru genel kur güncellemesinden sonra değişmez."
        },
        {
          "heading": "Alış ve satış farkı",
          "text": "Bir para birimini alıp satarken sunulan fiyatlar farklı olabilir. Ücret ve kur farkı işlem maliyetini etkiler. Tek bir referans kurla hesaplanan toplam, o anda gerçekten elde edebileceğin satış tutarını garanti etmez."
        },
        {
          "heading": "Ödeme para birimi",
          "text": "Gelirin bir para biriminde, borcun başka para birimindeyse kur hareketi ödeme yükünü değiştirebilir. Sadece kurun yukarı gitmesi ihtimalini düşünme; ters yöndeki değişimin bütçeni nasıl etkilediğini de hesapla. Burada canlı kur veya kur tahmini bulunmaz."
        }
      ],
      "example": "100 USD’lik hesabın 1 USD = 40 TL varsayımında 4.000 TL; 45 TL’de 4.500 TL görünür. Hesaba yeni 500 TL gelir girmedi. Öte yandan 100 USD borç için ana para biriminde gereken tutar da aynı varsayımlarda artar.",
      "steps": [
        "Hesabı gerçek para biriminde oluştur.",
        "Harcamanın gerçek işlem kurunu kaydet.",
        "Güncel toplam için kurunu güncelle ve fiyat farkını dikkate al."
      ],
      "pitfall": "Kur artışı her durumda kazanç değildir; döviz borcu için maliyeti büyütebilir.",
      "sources": [
        "risk"
      ],
      "related": [
        "net-worth",
        "real-return"
      ],
      "tool": null,
      "minutes": 4
    },
    {
      "id": "purchase",
      "title": "Bir alışverişin gerçek maliyeti",
      "group": "Günlük kararlar",
      "intro": "Etiket fiyatı kararın başlangıcıdır; tamamı değildir.",
      "sections": [
        {
          "heading": "Toplam sahip olma maliyeti",
          "text": "Bir ürünün fiyatına ek olarak bakım, tüketim, üyelik veya aksesuar gerekip gerekmediğini düşün. Düşük ilk fiyat ileride daha yüksek düzenli giderle birlikte gelebilir. İki seçeneği aynı kullanım süresi ve aynı ihtiyaç için kıyasla."
        },
        {
          "heading": "Birim fiyat ve kullanım",
          "text": "Paket fiyatını değil karşılaştırılabilir birimi kontrol et. Kilogram, litre veya kullanım sayısı farklı olabilir. Büyük paket birim başına ucuz görünse bile kullanmadan bozulacaksa gerçek avantaj azalır. İndirim yüzdesi ihtiyacın olup olmadığını söylemez."
        },
        {
          "heading": "Bekleme ve fırsat maliyeti",
          "text": "Bu parayı burada kullanınca hangi başka hedef ertelenecek? Büyük ve zorunlu olmayan alışverişten önce kısa bir düşünme aralığı koymak kendi tercihlerini gözden geçirmene yardım edebilir. Bu bir kural veya psikolojik tedavi değil, deneyebileceğin kişisel alışkanlıktır."
        }
      ],
      "example": "750 gram ürün 150 TL ise kilogram fiyatı 200 TL’dir. Bir kilogram ürün 180 TL ise karşılaştırılabilir fiyatı daha düşüktür. Ancak yarısını kullanmadan atarsan ucuz görünen paket sana daha pahalı gelebilir. Ayrıca 2.000 TL’lik isteğe bağlı alışveriş aylık 1.000 TL hedef katkısını iki ay erteleyebilir.",
      "steps": [
        "Birim fiyatları eşitle.",
        "Tekrarlanan giderleri hesapla.",
        "Kararın hangi hedefe etkisi olduğunu yaz."
      ],
      "pitfall": "Sırf indirimde olduğu için yapılmayan alışveriş bir tasarruf fırsatının kaçması değildir.",
      "sources": [
        "spending"
      ],
      "related": [
        "needs",
        "fees"
      ],
      "tool": null,
      "minutes": 4
    },
    {
      "id": "fraud",
      "title": "Para konusunda kırmızı bayraklar",
      "group": "Günlük kararlar",
      "intro": "Garantili yüksek getiri ve acele baskısı sorgulanmalıdır.",
      "sections": [
        {
          "heading": "Vaat ve baskı",
          "text": "Az veya hiç risk olmadan yüksek kazanç vaatleri, hemen karar verme baskısı ve eksik açıklamalar önemli uyarılardır. Popüler bir isim, şık bir sayfa veya tanıdığın birinin paylaşımı doğrulama yerine geçmez."
        },
        {
          "heading": "Bağımsız doğrula",
          "text": "Kurumu ve yetkisini resmi kanaldan kontrol et. Mesajdaki bağlantıyı kullanmak yerine bilinen resmi adrese kendin git. Para gönderilecek kişi ve kurumun teklif ile tutarlı olduğundan emin ol. Anlamadığın üründe açıklama istemek normaldir."
        },
        {
          "heading": "Bilgi güvenliği",
          "text": "Tek kullanımlık kod, parola veya uzaktan erişim talebini doğrulamadan kabul etme. Nero’ya gerçek kart numarası, CVV veya bankacılık şifresi girmen gerekmez; hesap adı için takma ad yeterlidir. Yerel bütçe yedekleri fişleri içerir ve şifrelenmemiştir; dosyayı paylaşırken bunu dikkate al."
        }
      ],
      "example": "Bir mesaj bugün para gönderirsen aylık garantili yüksek kazanç vaat ediyor olsun. Teklifin acele ettirmesi, belirsiz yetki bilgisi ve risk yok söylemi birlikte incelenmelidir. Mesajın içindeki telefon numarasından teyit almak bağımsız doğrulama sayılmaz; resmi kanalı ayrıca bul.",
      "steps": [
        "Bağımsız resmi kanaldan kontrol et.",
        "Ürünün risk ve ücretlerini yazılı iste.",
        "Şifre, kod ve gereksiz kişisel bilgiyi paylaşma."
      ],
      "pitfall": "Yatırım fırsatını kaçırma korkusu, doğrulama adımlarını atlamak için gerekçe değildir.",
      "sources": [
        "fraud"
      ],
      "related": [
        "risk",
        "money-map"
      ],
      "tool": null,
      "minutes": 4
    },
    {
      "id": "monthly-review",
      "title": "Ay sonunda 15 dakikalık kontrol",
      "group": "Günlük kararlar",
      "intro": "Özet ekranını karar vermek için kullan; kendine not vermek için değil.",
      "sections": [
        {
          "heading": "Önce doğruluk",
          "text": "Banka ve kart hareketleriyle kayıtlarını karşılaştır. Eksik işlem, iki kez eklenen ödeme, yanlış hesap veya yanlış kategori var mı? Fişleri ve açıklamaları kullan. Veri eksikken grafikteki değişimi kesin bir sonuç gibi değerlendirme."
        },
        {
          "heading": "Sonra anlam",
          "text": "Gelir ve net gideri, büyük kategorileri ve limit aşımını incele. Geçen aya göre farkın nedeni daha çok alışveriş, tek seferlik ödeme, fiyat değişimi veya eksik kayıt olabilir. Henüz tamamlanmamış ayı tam geçmiş ayla karşılaştırmak da yanıltıcıdır; dönem durumunu kontrol et."
        },
        {
          "heading": "Bir sonraki adım",
          "text": "Tek bir uygulanabilir değişiklik seç: kullanılmayan aboneliği incelemek, kategoriyi sadeleştirmek veya büyük ödemenin hedefini oluşturmak. Bir sonraki ay kontrol edeceğin somut bir not bırak. Özetin gelir-gider farkı tüm yatırımları, varlık değişimini ve gerçek banka nakit akışını temsil etmez."
        }
      ],
      "example": "Geçen ay market 4.000 TL, bu ay 5.200 TL olsun. Fark 1.200 TL ve %30’dur. Bu ay misafir için toplu alışveriş yaptıysan artışı yalnız fiyatlara bağlayamazsın. Aynı kategorideki işlemleri açıp açıklamalarına bakmak daha anlamlı bir değerlendirme sağlar.",
      "steps": [
        "Kayıtları gerçek hareketlerle eşleştir.",
        "En büyük farkın nedenini bul.",
        "Gelecek ay için tek somut adım seç."
      ],
      "pitfall": "Az gelir veya yüksek zorunlu gider bir karakter kusuru değildir; özet kişisel başarı puanı üretmez.",
      "sources": [],
      "related": [
        "spending",
        "budget-plan"
      ],
      "tool": null,
      "minutes": 4
    }
  ],
  "terms": [
    {
      "name": "Gelir",
      "text": "Seçilen dönemde kaydedilen kazanılmış para; başlangıç bakiyesi ve kendi hesapların arasındaki transfer dahil değildir."
    },
    {
      "name": "Gider",
      "text": "Kaydedilen harcama. Kart alışverişi gider; kart borcuna yapılan transfer ikinci gider değildir."
    },
    {
      "name": "Net gider",
      "text": "Giderlerden iadeler çıkarıldıktan sonra kalan tutar."
    },
    {
      "name": "Gelir−gider farkı",
      "text": "Dönemin geliri eksi net gideri. Banka nakit akışı veya toplam servet değişimiyle aynı değildir."
    },
    {
      "name": "Başlangıç bakiyesi",
      "text": "Takibe başladığın andaki para veya kart borcu; o ayın yeni geliri değildir."
    },
    {
      "name": "Hesap",
      "text": "Paranın bulunduğu veya kart borcunun izlendiği yer."
    },
    {
      "name": "Kategori",
      "text": "Paranın neden geldiğini veya hangi amaçla harcandığını gösteren sınıflama."
    },
    {
      "name": "Alt kategori",
      "text": "Ana kategorinin daha ayrıntılı bir bölümü; ana limitin harcamasına dahil olur."
    },
    {
      "name": "Transfer",
      "text": "Kendi hesapların arasında para hareketi; tek başına gelir veya gider değildir."
    },
    {
      "name": "İade",
      "text": "Önceki harcamadan geri alınan para; gideri azaltır."
    },
    {
      "name": "Bütçe limiti",
      "text": "Bir dönemde harcama için belirlediğin izleme sınırı; banka paranı bloke etmez."
    },
    {
      "name": "Devir",
      "text": "Kullanılmayan bütçe sınırının sonraki dönemin limitine eklenmesi; yeni gelir değildir."
    },
    {
      "name": "Rezerv",
      "text": "Hesap içindeki paranın hedef için ayrılmış görünmesi; banka blokajı değildir."
    },
    {
      "name": "Net varlık",
      "text": "Takip edilen varlıklar eksi takip edilen borçların belirli andaki toplamı."
    },
    {
      "name": "Likidite",
      "text": "Bir varlığı ne kadar kolay ve uygun koşullarla kullanılabilir paraya çevirebildiğin."
    },
    {
      "name": "Nakit akışı",
      "text": "Paranın hangi tarihlerde gerçekten girip çıktığı."
    },
    {
      "name": "Kart limiti",
      "text": "Kart için tanınan kullanım sınırı; sahip olduğun para değildir."
    },
    {
      "name": "Kesim günü",
      "text": "Bankanın belirli bir kart döneminin hesabını kapattığı tarih."
    },
    {
      "name": "Dönem borcu",
      "text": "Belirli bir ekstreye ait borç; toplam kart borcuyla aynı olmak zorunda değildir."
    },
    {
      "name": "Son ödeme günü",
      "text": "Bankanın belirttiği o dönem için ödeme tarihi; resmi ekstreyle doğrulanır."
    },
    {
      "name": "Asgari ödeme",
      "text": "Ekstrede belirtilen en az ödeme tutarı; borcun tamamını kapatmak değildir."
    },
    {
      "name": "Nominal",
      "text": "Enflasyona göre düzeltilmemiş para tutarı veya oran."
    },
    {
      "name": "Reel",
      "text": "Fiyat düzeyi değişimine göre düzeltilmiş tutar veya oran."
    },
    {
      "name": "Enflasyon",
      "text": "Mal ve hizmet fiyatlarının genel düzeyinde sürekli artış."
    },
    {
      "name": "Dezenflasyon",
      "text": "Fiyat artış hızının düşmesi; fiyatların mutlaka düşmesi değildir."
    },
    {
      "name": "Bileşik büyüme",
      "text": "Önceki dönem sonucunun sonraki hesap tabanına katılması."
    },
    {
      "name": "Çeşitlendirme",
      "text": "Riskin farklı yatırımlara dağıtılması; tüm kayıp ihtimalini ortadan kaldırmaz."
    },
    {
      "name": "Fırsat maliyeti",
      "text": "Bir seçimi yaparken vazgeçtiğin alternatifin değeri."
    },
    {
      "name": "Birim fiyat",
      "text": "Karşılaştırılabilir miktar başına fiyat; örneğin TL/kg."
    },
    {
      "name": "Kur",
      "text": "Bir para biriminin diğer para birimi cinsinden değeri; işlem ve değerleme kurları farklı olabilir."
    }
  ],
  "books": [{"id":"housel","title":"The Psychology of Money","author":"Morgan Housel","note":"Yayınevi tanıtımı kitabın para kararlarında davranış, kişisel deneyim ve bakış açısının rolünü ele aldığını belirtir. Bu bir yazarın yaklaşımıdır; yatırım getirisi veya her durumda geçerli bir kural değildir. Burada kitabın metni çoğaltılmaz ve yazara ait uydurma alıntı verilmez.","url":"https://www.harriman-house.com/authors/morgan-housel/the-psychology-of-money/9780857197689"}]
};if(typeof module!=='undefined'&&module.exports)module.exports=handbook;else root.NeroHandbook=handbook;})(typeof window!=='undefined'?window:globalThis);
