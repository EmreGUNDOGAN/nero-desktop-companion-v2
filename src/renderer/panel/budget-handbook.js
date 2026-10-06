'use strict';
// Original Turkish lessons, examples and quizzes; no quoted book content.
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
    },
    "stocks": {
      "name": "Investor.gov · Hisse senetleri",
      "url": "https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks"
    },
    "bonds": {
      "name": "Investor.gov · Tahviller",
      "url": "https://www.investor.gov/introduction-investing/investing-basics/investment-products/bonds-or-fixed-income-products/bonds"
    },
    "funds": {
      "name": "SPK · Yatırım fonları tanıtım rehberi",
      "url": "https://www.spk.gov.tr/kurumlar/fonlar/yatirim-fonlari/menkul-kiymet-yatirim-fonlari/tanitim-rehberi"
    },
    "etf": {
      "name": "SPK · Borsa yatırım fonları",
      "url": "https://www.spk.gov.tr/kurumlar/fonlar/yatirim-fonlari/borsa-yatirim-fonlari/tanitim-rehberi"
    },
    "bes": {
      "name": "EGM · Katılımcı bilgilendirme rehberi",
      "url": "https://www.egm.org.tr/katilimcilar/katilimci-bilgilendirme-rehberi/"
    },
    "insurance": {
      "name": "SEDDK · Sigortacılık ve özel emeklilik",
      "url": "https://www.seddk.gov.tr/"
    },
    "spk": {
      "name": "SPK · Finansal okuryazarlık",
      "url": "https://www.spk.gov.tr/finansal-okuryazarlik-platformu"
    },
    "tmsf": {
      "name": "TMSF · Mevduat sigortası",
      "url": "https://www.tmsf.org.tr/tr/Tmsf/Mevduat/mevduat.sss"
    },
    "tbb": {
      "name": "TBB · Bireysel müşteri hakem heyeti",
      "url": "https://www.tbb.org.tr/faaliyetler/bireysel-musteri-hakem-heyeti"
    },
    "gib": {
      "name": "GİB · Rehberler",
      "url": "https://www.gib.gov.tr/yardim-ve-kaynaklar/rehberler"
    }
  },
  "chapters": [
    {
      "id": "money-map",
      "title": "Paranın haritasını çıkar",
      "group": "Paranın temelleri",
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
        "net-worth",
        "money-purpose"
      ],
      "tool": null,
      "minutes": 3,
      "moduleId": "basics",
      "quiz": {
        "question": "Kredi kartı limiti nasıl değerlendirilir?",
        "options": [
          "Borçlanma kapasitesidir; sahip olunan para değildir.",
          "Gelir olarak kaydedilir.",
          "Banka bakiyesine eklenir."
        ],
        "correct": 0,
        "explanation": "Borçlanma kapasitesidir; sahip olunan para değildir. Kart limitini sahip olduğun para gibi toplamak, borç kapasitesiyle varlığı karıştırır."
      },
      "outcomes": [
        "Banka bakiyesi, aylık gelir ve kullanabileceğin para aynı şeyi anlatmaz.",
        "Sık karıştırılan noktayı fark etmek: Kart limitini sahip olduğun para gibi toplamak, borç kapasitesiyle varlığı karıştırır."
      ]
    },
    {
      "id": "money-purpose",
      "title": "Para ne işe yarar?",
      "intro": "Para, alışverişte değişim aracı, fiyatları kıyaslamak için ölçü ve geleceğe değer taşımak için araç olarak kullanılır.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Para, alışverişte değişim aracı, fiyatları kıyaslamak için ölçü ve geleceğe değer taşımak için araç olarak kullanılır. Bu işlevler aynı şey değildir. Hesabındaki tutar değişmese bile satın alabileceğin ürün miktarı değişebilir."
        },
        {
          "heading": "Karar verirken",
          "text": "Paranın miktarını bilmek kararın yalnız ilk adımıdır. Hangi tarihte kullanacağın, erişimin ve fiyatların değişimi de önemlidir. Bir aylık zorunlu ödeme için ayrılmış parayı yıllar sürecek bir hedefle aynı biçimde değerlendirme."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero’da hesap bakiyesi tutarı, bütçe limiti ise kullanım planını anlatır. İkisi aynı sayı olmak zorunda değildir. Limiti artırmak hesabına yeni para eklemez."
        }
      ],
      "example": "Bir ürün geçen yıl 100 TL, bu yıl 125 TL olsun. 1.000 TL geçen yıl 10 ürün alırken şimdi 8 ürün alır. Para tutarın aynı kalsa da bu ürüne göre satın alma gücün azalmıştır. Tek ürünün değişimi genel enflasyon oranı değildir.",
      "pitfall": "Hesapta duran aynı tutarın her zaman aynı yaşam standardını sağlayacağını düşünmek.",
      "steps": [
        "Bir fiyatı iki dönem için karşılaştır",
        "Bakiye ve bütçe limitini ayrı yaz",
        "Yakın vadeli ödemelerini listele"
      ],
      "sources": [
        "inflation"
      ],
      "related": [
        "money-map",
        "income"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Bütçe limitini 5.000 TL artırmak ne yapar?",
        "options": [
          "Kart borcunu otomatik kapatır.",
          "Takip sınırını değiştirir; para yaratmaz.",
          "Banka bakiyesine 5.000 TL ekler."
        ],
        "correct": 1,
        "explanation": "Takip sınırını değiştirir; para yaratmaz. Hesapta duran aynı tutarın her zaman aynı yaşam standardını sağlayacağını düşünmek."
      },
      "group": "Paranın temelleri",
      "moduleId": "basics",
      "outcomes": [
        "Para, alışverişte değişim aracı, fiyatları kıyaslamak için ölçü ve geleceğe değer taşımak için araç olarak kullanılır.",
        "Sık karıştırılan noktayı fark etmek: Hesapta duran aynı tutarın her zaman aynı yaşam standardını sağlayacağını düşünmek."
      ]
    },
    {
      "id": "income",
      "title": "Gelirini doğru kaydet",
      "group": "Paranın temelleri",
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
        "money-map",
        "money-purpose"
      ],
      "tool": null,
      "minutes": 3,
      "moduleId": "basics",
      "quiz": {
        "question": "Banka hesabından cüzdana para çekmek nedir?",
        "options": [
          "Yeni kazanılmış gelir.",
          "Birikim getirisi.",
          "Kendi hesapların arasında transfer."
        ],
        "correct": 2,
        "explanation": "Kendi hesapların arasında transfer. Beklenen ödemenin tarihi ile gerçekten alınan tarihin farklı olabileceğini unutma."
      },
      "outcomes": [
        "Kazanılan para ile hesaplar arasında taşınan parayı ayır.",
        "Sık karıştırılan noktayı fark etmek: Beklenen ödemenin tarihi ile gerçekten alınan tarihin farklı olabileceğini unutma."
      ]
    },
    {
      "id": "spending",
      "title": "Harcamalarını anlamlandır",
      "group": "Paranın temelleri",
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
        "monthly-review",
        "money-map",
        "money-purpose"
      ],
      "tool": null,
      "minutes": 3,
      "moduleId": "basics",
      "quiz": {
        "question": "1.000 TL gider ve 200 TL iade varsa net gider nedir?",
        "options": [
          "800 TL.",
          "1.200 TL.",
          "200 TL."
        ],
        "correct": 0,
        "explanation": "800 TL. Çok ayrıntılı kategoriler kayıt tutmayı zorlaştırıyorsa sadeleştirmek daha faydalıdır."
      },
      "outcomes": [
        "Harcama takibi kendini suçlamak için değil, kararlarını görmek içindir.",
        "Sık karıştırılan noktayı fark etmek: Çok ayrıntılı kategoriler kayıt tutmayı zorlaştırıyorsa sadeleştirmek daha faydalıdır."
      ]
    },
    {
      "id": "net-worth",
      "title": "Net varlık ve harcanabilir para",
      "group": "Paranın temelleri",
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
        "currency",
        "money-purpose"
      ],
      "tool": null,
      "minutes": 3,
      "moduleId": "basics",
      "quiz": {
        "question": "Bankada 40.000 TL, kartta 60.000 TL borç varsa banka bakiyesi nedir?",
        "options": [
          "100.000 TL.",
          "40.000 TL; net varlık farklı bir göstergedir.",
          "−20.000 TL."
        ],
        "correct": 1,
        "explanation": "40.000 TL; net varlık farklı bir göstergedir. Grafikte net varlığın artması her zaman tasarruf ettiğini kanıtlamaz."
      },
      "outcomes": [
        "Varlık eksi borç bir fotoğraftır; aylık kazanç değildir.",
        "Sık karıştırılan noktayı fark etmek: Grafikte net varlığın artması her zaman tasarruf ettiğini kanıtlamaz."
      ]
    },
    {
      "id": "liabilities",
      "title": "Varlık ve borcu ayır",
      "intro": "Varlık sana ait ekonomik değer; borç ise karşı tarafa ödeme yükümlülüğündür.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Varlık sana ait ekonomik değer; borç ise karşı tarafa ödeme yükümlülüğündür. Kredi kartı limiti varlık değildir. Nakit/banka bakiyesi, toplam borç ve net varlık farklı sorulara cevap verir."
        },
        {
          "heading": "Karar verirken",
          "text": "Borçların vadesi önemlidir. Toplam 60.000 TL borcun olması bu ay 60.000 TL ödeyeceğin anlamına gelmez. Öte yandan yalnız aylık taksiti izlemek de gelecekteki yükümlülüğü gizler."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero’da Mevcut paran banka ve nakdi gösterir. Toplam taksit borcu ayrı izlenir. Kart borcu net varlığı etkiler; banka bakiyesi ancak banka hesabından gerçek ödeme kaydıyla azalır."
        }
      ],
      "example": "Bankanda 40.000 TL ve kartında 60.000 TL borç varsa kayıtlı net varlık −20.000 TL’dir. Bu, bankanda −20.000 TL olduğu anlamına gelmez. Bu ay 5.000 TL ödersen banka 35.000 TL, borç 55.000 TL olur; bu iki hareket tek başına net varlığı değiştirmez.",
      "pitfall": "Toplam borcu aylık ödeme sanmak veya kart ödemesini ikinci gider yazmak.",
      "steps": [
        "Banka bakiyeni kontrol et",
        "Toplam ve aylık borcu ayır",
        "Ödemeyi transfer olarak izle"
      ],
      "sources": [
        "debt"
      ],
      "related": [
        "money-map",
        "money-purpose"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "60.000 TL toplam borç, 5.000 TL aylık taksitte banka ne kadar azalır?",
        "options": [
          "Borç oluşturulunca 60.000 TL.",
          "Maaşın tutarı kadar.",
          "5.000 TL ödeme kaydedildiğinde 5.000 TL."
        ],
        "correct": 2,
        "explanation": "5.000 TL ödeme kaydedildiğinde 5.000 TL. Toplam borcu aylık ödeme sanmak veya kart ödemesini ikinci gider yazmak."
      },
      "group": "Paranın temelleri",
      "moduleId": "basics",
      "outcomes": [
        "Varlık sana ait ekonomik değer; borç ise karşı tarafa ödeme yükümlülüğündür.",
        "Sık karıştırılan noktayı fark etmek: Toplam borcu aylık ödeme sanmak veya kart ödemesini ikinci gider yazmak."
      ]
    },
    {
      "id": "budget-plan",
      "title": "Gerçekçi bir aylık bütçe kur",
      "group": "Bütçeni kur",
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
        "annual-costs",
        "budget-methods",
        "needs"
      ],
      "tool": null,
      "minutes": 3,
      "moduleId": "budget",
      "quiz": {
        "question": "Aylık bütçe limitini artırmak ne yapar?",
        "options": [
          "Takip sınırını değiştirir.",
          "Yeni para oluşturur.",
          "Borcu kapatır."
        ],
        "correct": 0,
        "explanation": "Takip sınırını değiştirir. Kategori limitlerinin toplamı ve genel limit farklı amaçlarla izlenir; tutarlılıklarını sen kontrol et."
      },
      "outcomes": [
        "Bütçe, beklediğin gelire nasıl yön vereceğini anlatan esnek bir plandır.",
        "Sık karıştırılan noktayı fark etmek: Kategori limitlerinin toplamı ve genel limit farklı amaçlarla izlenir; tutarlılıklarını sen kontrol et."
      ]
    },
    {
      "id": "budget-methods",
      "title": "Bütçe yöntemlerini seç",
      "intro": "Bütçe yöntemi bir düzen kurma aracıdır; herkes için aynı oran uygun değildir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Bütçe yöntemi bir düzen kurma aracıdır; herkes için aynı oran uygun değildir. Kategori limitleri, sıfır tabanlı planlama ve zarf yaklaşımı farklı biçimlerde paraya görev verir."
        },
        {
          "heading": "Karar verirken",
          "text": "Sıfır tabanlı yaklaşımda kullanılabilir paranın tamamına amaç belirlenir; amaçlar harcama, birikim ve tampon olabilir. Bu, hesabı sıfıra kadar harcamak değildir. Yüzde yöntemleri ise başlangıç karşılaştırmasıdır, zorunlu kural değildir."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero’da toplam limit ve kategori limitleriyle kendi yöntemini uygulayabilirsin. Planın, kesinleşmemiş gelire dayanıyorsa bunu ayrıca işaretle. Ay sonunda yöntemin sana yardımcı olup olmadığını gözden geçir."
        }
      ],
      "example": "30.000 TL’yi 18.000 TL temel gider, 5.000 TL değişken gider, 4.000 TL birikim ve 3.000 TL tampon olarak planlayabilirsin. Toplam görev 30.000 TL’dir. Birikim ve tampon harcanmadığı için banka bakiyesinin sıfırlanması gerekmez.",
      "pitfall": "İnternetteki bütçe yüzdelerini kendi kira ve gelir koşullarını düşünmeden uygulamak.",
      "steps": [
        "Bir yöntem seç",
        "Tüm amaçların toplamını kontrol et",
        "Bir ay sonra limitlerini gözden geçir"
      ],
      "sources": [
        "cashflow"
      ],
      "related": [
        "budget-plan",
        "needs"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Sıfır tabanlı bütçe ne demektir?",
        "options": [
          "Birikim yapmamak.",
          "Paranın tamamına bir amaç vermek.",
          "Hesabı tamamen harcamak."
        ],
        "correct": 1,
        "explanation": "Paranın tamamına bir amaç vermek. İnternetteki bütçe yüzdelerini kendi kira ve gelir koşullarını düşünmeden uygulamak."
      },
      "group": "Bütçeni kur",
      "moduleId": "budget",
      "outcomes": [
        "Bütçe yöntemi bir düzen kurma aracıdır; herkes için aynı oran uygun değildir.",
        "Sık karıştırılan noktayı fark etmek: İnternetteki bütçe yüzdelerini kendi kira ve gelir koşullarını düşünmeden uygulamak."
      ]
    },
    {
      "id": "needs",
      "title": "İhtiyaç, istek ve esnek gider",
      "group": "Bütçeni kur",
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
        "purchase",
        "budget-methods"
      ],
      "tool": null,
      "minutes": 3,
      "moduleId": "budget",
      "quiz": {
        "question": "İhtiyaç ve istek ayrımı hangi bilgiye bağlıdır?",
        "options": [
          "Her zaman tek bir evrensel listeye.",
          "Yalnız ürünün markasına.",
          "Kişinin koşulları ve öncelikleri."
        ],
        "correct": 2,
        "explanation": "Kişinin koşulları ve öncelikleri. Her keyif harcamasını yasaklamak sürdürülemeyen bir bütçeye yol açabilir."
      },
      "outcomes": [
        "Bir giderin gerekli olması, tutarının hiç değişemeyeceği anlamına gelmez.",
        "Sık karıştırılan noktayı fark etmek: Her keyif harcamasını yasaklamak sürdürülemeyen bir bütçeye yol açabilir."
      ]
    },
    {
      "id": "fixed-variable",
      "title": "Sabit ve değişken giderler",
      "intro": "Sabit gider belirli dönemlerde benzer tutarla gelir; değişken gider kullanımına göre değişir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Sabit gider belirli dönemlerde benzer tutarla gelir; değişken gider kullanımına göre değişir. Sabit olmak zorunlu olmakla, değişken olmak gereksiz olmakla aynı değildir."
        },
        {
          "heading": "Karar verirken",
          "text": "Kira çoğunlukla sabit ve zorunludur. Bir eğlence aboneliği sabit ama vazgeçilebilir olabilir. Market değişken ama temel ihtiyaçtır. Bu iki ayrı sınıflandırmayı karıştırmadan karar ver."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero kategorileri harcamanın nedenini gösterir; tekrar kaydı ödeme sıklığını gösterir. Abonelikleri düzenli işlem olarak aç; değişken faturalar için tutarı gerçekleştiğinde kontrol et."
        }
      ],
      "example": "Kira 12.000 TL, abonelik 200 TL ve market 5.000–7.000 TL olsun. Kira ve abonelik benzer biçimde tekrar eder; ancak öncelikleri aynı değildir. Market değiştiği için tamamen sıfırlanabilecek bir gider sayılmaz.",
      "pitfall": "Sabit olan her harcamayı dokunulmaz, değişken olan her harcamayı gereksiz görmek.",
      "steps": [
        "Giderlerini iki eksende sınıflandır",
        "Değişkenler için aralık belirle",
        "Sabit aboneliklerini kontrol et"
      ],
      "sources": [
        "spending"
      ],
      "related": [
        "budget-plan",
        "budget-methods"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Market giderinin değişken olması neyi anlatır?",
        "options": [
          "Tutarının kullanıma göre değişebildiğini.",
          "Temel ihtiyaç olmadığını.",
          "Her ay kaldırılması gerektiğini."
        ],
        "correct": 0,
        "explanation": "Tutarının kullanıma göre değişebildiğini. Sabit olan her harcamayı dokunulmaz, değişken olan her harcamayı gereksiz görmek."
      },
      "group": "Bütçeni kur",
      "moduleId": "budget",
      "outcomes": [
        "Sabit gider belirli dönemlerde benzer tutarla gelir; değişken gider kullanımına göre değişir.",
        "Sık karıştırılan noktayı fark etmek: Sabit olan her harcamayı dokunulmaz, değişken olan her harcamayı gereksiz görmek."
      ]
    },
    {
      "id": "cash-flow",
      "title": "Gelir yetiyor ama para neden bitiyor?",
      "group": "Bütçeni kur",
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
        "irregular",
        "budget-plan",
        "budget-methods"
      ],
      "tool": null,
      "minutes": 3,
      "moduleId": "budget",
      "quiz": {
        "question": "Ayın toplam geliri yeterliyken ödeme sorunu neden olabilir?",
        "options": [
          "Toplam gelirin bilinmesi tüm tarih sorunlarını çözer.",
          "Ödemeler gelirden daha erken geliyor olabilir.",
          "Kart limiti mutlaka azdır."
        ],
        "correct": 1,
        "explanation": "Ödemeler gelirden daha erken geliyor olabilir. Gelir−gider farkını gerçek banka nakit akışı olarak etiketlemek yanıltıcıdır."
      },
      "outcomes": [
        "Nakit akışı, paranın ne zaman geldiğini ve ne zaman çıktığını anlatır.",
        "Sık karıştırılan noktayı fark etmek: Gelir−gider farkını gerçek banka nakit akışı olarak etiketlemek yanıltıcıdır."
      ]
    },
    {
      "id": "irregular",
      "title": "Düzensiz gelirle plan yapmak",
      "group": "Bütçeni kur",
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
        "annual-costs",
        "budget-plan",
        "budget-methods"
      ],
      "tool": null,
      "minutes": 3,
      "moduleId": "budget",
      "quiz": {
        "question": "Düzensiz gelir planında neye dikkat edilmeli?",
        "options": [
          "En yüksek geçmiş ay her ay garanti kabul edilmeli.",
          "Gelir dalgalanması bütçe gerektirmez.",
          "Kesinleşmemiş kazancı garanti saymadan tampon ve gider tarihleri planlanmalı."
        ],
        "correct": 2,
        "explanation": "Kesinleşmemiş kazancı garanti saymadan tampon ve gider tarihleri planlanmalı. Ortalama gelir, ödeme tarihleri ve gelir oynaklığı hakkında tek başına yeterli bilgi vermez."
      },
      "outcomes": [
        "Serbest çalışma ve içerik üretiminde her ay aynı gelir olmayabilir.",
        "Sık karıştırılan noktayı fark etmek: Ortalama gelir, ödeme tarihleri ve gelir oynaklığı hakkında tek başına yeterli bilgi vermez."
      ]
    },
    {
      "id": "annual-costs",
      "title": "Yıllık gideri aylık plana çevir",
      "group": "Bütçeni kur",
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
        "emergency",
        "budget-plan",
        "budget-methods"
      ],
      "tool": "goal",
      "minutes": 3,
      "moduleId": "budget",
      "quiz": {
        "question": "Yılda bir 12.000 TL ödeme için aylık ayırma hedefi ne olabilir?",
        "options": [
          "Getiri ve fiyat değişimi yoksa 1.000 TL.",
          "Her ay 12.000 TL.",
          "Her ay 100 TL."
        ],
        "correct": 0,
        "explanation": "Getiri ve fiyat değişimi yoksa 1.000 TL. Öngörülebilir bakım ile gerçek bir acil durumu aynı birikim amacı altında gizleme."
      },
      "outcomes": [
        "Her ay gelmeyen bir ödeme, beklenmedik ödeme demek değildir.",
        "Sık karıştırılan noktayı fark etmek: Öngörülebilir bakım ile gerçek bir acil durumu aynı birikim amacı altında gizleme."
      ]
    },
    {
      "id": "small-spending",
      "title": "Küçük harcamaların toplamı",
      "intro": "Tek bir küçük harcama bütçeyi açıklamaz; sıklık ve toplam önemlidir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Tek bir küçük harcama bütçeyi açıklamaz; sıklık ve toplam önemlidir. Kararı verirken günlük tutar kadar haftalık ve aylık karşılığını da gör."
        },
        {
          "heading": "Karar verirken",
          "text": "Küçük keyifleri otomatik olarak suçlu ilan etmek yerine sana değer sağlayıp sağlamadıklarını değerlendir. Büyük bir sabit gideri göz ardı edip yalnız kahveyi kısmak bazen asıl sorunu çözmez."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero’da kategori ve tarih filtresi kullan. Aynı açıklamayı arayıp tutarları karşılaştır. Kesmek istediğin harcama için gerçekçi bir limit koy; tamamen yasaklayıp sonra kontrolü kaybetmek yerine sürdürülebilir düzen kur."
        }
      ],
      "example": "Haftada 5 kez 80 TL harcama, dört haftalık örnekte 1.600 TL yapar. Ayların uzunluğu değişebileceğinden gerçek aylık toplamı kayıttan gör. Bu tutarın sana sunduğu değer ile başka bir hedefe katkısını birlikte değerlendir.",
      "pitfall": "Yalnız işlem tutarına bakıp tekrar sayısını unutmak.",
      "steps": [
        "Tekrarlanan küçük bir gider seç",
        "Aylık toplamını bul",
        "Değerine göre yeni limit belirle"
      ],
      "sources": [
        "spending"
      ],
      "related": [
        "impulse",
        "purchase"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "80 TL’lik işlemi değerlendirirken başka ne gerekir?",
        "options": [
          "Harcayan kişinin yaşı.",
          "Tekrar sayısı ve dönem toplamı.",
          "Yalnız en son fiş."
        ],
        "correct": 1,
        "explanation": "Tekrar sayısı ve dönem toplamı. Yalnız işlem tutarına bakıp tekrar sayısını unutmak."
      },
      "group": "Harcama alışkanlıkları",
      "moduleId": "habits",
      "outcomes": [
        "Tek bir küçük harcama bütçeyi açıklamaz; sıklık ve toplam önemlidir.",
        "Sık karıştırılan noktayı fark etmek: Yalnız işlem tutarına bakıp tekrar sayısını unutmak."
      ]
    },
    {
      "id": "impulse",
      "title": "Dürtüsel alışverişi yönet",
      "intro": "Dürtüsel alışveriş planlanmadan, güçlü bir anlık istekle yapılabilir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Dürtüsel alışveriş planlanmadan, güçlü bir anlık istekle yapılabilir. Geri sayım, sınırlı stok ve ücretsiz kargo eşiği kararın hızını artırabilir; bunlar ihtiyacın kanıtı değildir."
        },
        {
          "heading": "Karar verirken",
          "text": "Bekleme süresi koymak, ürünü listeye yazmak ve toplam maliyeti görmek karar için alan açar. Bu süre herkes için aynı olmak zorunda değildir. Amaç keyifli alışverişi yasaklamak değil, seçimini bilinçli yapmaktır."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero’da almak istediğin ürünü birikim hedefi olarak yazabilirsin. Harcama gerçekleşmediyse gider oluşturma. Satın aldıktan sonra hangi ihtiyaç veya isteği karşıladığını açıklamaya ekle."
        }
      ],
      "example": "600 TL’lik ürün almak için sepete gereksiz 300 TL ekleyip 60 TL kargodan kaçındığını düşün. İlk seçenek 660 TL, ikinci seçenek 900 TL’dir. Kargonun ücretsiz olması toplam ödemeyi daha düşük yapmamıştır.",
      "pitfall": "İndirim bitmeden almak zorunda olduğunu düşünmek.",
      "steps": [
        "İstek listesi oluştur",
        "Toplam ödeme tutarını hesapla",
        "Karara bir bekleme süresi ver"
      ],
      "sources": [
        "spending"
      ],
      "related": [
        "small-spending",
        "purchase"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Örnekte daha düşük toplam ödeme hangisi?",
        "options": [
          "Ücretsiz kargolu 900 TL sepet.",
          "İkisi aynı.",
          "Ürün ve kargo için 660 TL."
        ],
        "correct": 2,
        "explanation": "Ürün ve kargo için 660 TL. İndirim bitmeden almak zorunda olduğunu düşünmek."
      },
      "group": "Harcama alışkanlıkları",
      "moduleId": "habits",
      "outcomes": [
        "Dürtüsel alışveriş planlanmadan, güçlü bir anlık istekle yapılabilir.",
        "Sık karıştırılan noktayı fark etmek: İndirim bitmeden almak zorunda olduğunu düşünmek."
      ]
    },
    {
      "id": "purchase",
      "title": "Bir alışverişin gerçek maliyeti",
      "group": "Harcama alışkanlıkları",
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
        "fees",
        "small-spending",
        "impulse"
      ],
      "tool": null,
      "minutes": 3,
      "moduleId": "habits",
      "quiz": {
        "question": "Ucuz görünen bir alışverişin toplam maliyetine ne dahil olabilir?",
        "options": [
          "Kullanım, bakım, teslimat ve vazgeçilen alternatif.",
          "Yalnız etiketteki fiyat.",
          "Yalnız ilk taksit."
        ],
        "correct": 0,
        "explanation": "Kullanım, bakım, teslimat ve vazgeçilen alternatif. Sırf indirimde olduğu için yapılmayan alışveriş bir tasarruf fırsatının kaçması değildir."
      },
      "outcomes": [
        "Etiket fiyatı kararın başlangıcıdır; tamamı değildir.",
        "Sık karıştırılan noktayı fark etmek: Sırf indirimde olduğu için yapılmayan alışveriş bir tasarruf fırsatının kaçması değildir."
      ]
    },
    {
      "id": "subscriptions",
      "title": "Aboneliklerini kontrol et",
      "intro": "Abonelikler küçük tutarlarla başlayıp birlikte önemli bir sabit yük oluşturabilir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Abonelikler küçük tutarlarla başlayıp birlikte önemli bir sabit yük oluşturabilir. Kullanım, yenileme tarihi, fiyat değişimi ve iptal koşulları birlikte değerlendirilmelidir."
        },
        {
          "heading": "Karar verirken",
          "text": "Yıllık ödeme aylığa göre ucuz olabilir ama baştan daha çok nakit ister. Kısa süre kullanacağın hizmet için yıllık sözleşme toplamda pahalı olabilir. Ücretsiz denemenin ne zaman ücretliye döneceğini öğren."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero’da marka ikonunu, hesabı ve aylık tekrarı seç. Otomatik kayıt bankaya ödeme talimatı göndermez. Fiyat değişikliğinde gelecek dönem tutarını güncelle; hizmeti iptal ettiğinde planı da duraklat."
        }
      ],
      "example": "Üç abonelik 150, 200 ve 250 TL olsun: aylık 600 TL, aynı fiyatların 12 ay sürdüğü varsayımıyla yıllık 7.200 TL. 250 TL’lik hizmeti kullanmıyorsan iptal etmek gelecekteki gideri azaltır; geçmiş ödemeleri geri getirmez.",
      "pitfall": "Hizmeti iptal etmekle Nero planını duraklatmayı aynı işlem sanmak.",
      "steps": [
        "Aboneliklerini listele",
        "Yenileme ve iptal tarihlerini kontrol et",
        "Kullanmadıklarını değerlendir"
      ],
      "sources": [
        "bills"
      ],
      "related": [
        "small-spending",
        "impulse"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Nero’da abonelik planını duraklatmak ne yapar?",
        "options": [
          "Bankaya ödeme iadesi talimatı verir.",
          "Nero’nun gelecek kayıtlarını durdurur.",
          "Netflix sözleşmeni iptal eder."
        ],
        "correct": 1,
        "explanation": "Nero’nun gelecek kayıtlarını durdurur. Hizmeti iptal etmekle Nero planını duraklatmayı aynı işlem sanmak."
      },
      "group": "Harcama alışkanlıkları",
      "moduleId": "habits",
      "outcomes": [
        "Abonelikler küçük tutarlarla başlayıp birlikte önemli bir sabit yük oluşturabilir.",
        "Sık karıştırılan noktayı fark etmek: Hizmeti iptal etmekle Nero planını duraklatmayı aynı işlem sanmak."
      ]
    },
    {
      "id": "lifestyle",
      "title": "Yaşam tarzı enflasyonunu fark et",
      "intro": "Gelir artınca harcama standardının da yükselmesi, birikimin artmasını engelleyebilir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Gelir artınca harcama standardının da yükselmesi, birikimin artmasını engelleyebilir. Daha iyi koşullar istemek yanlış değildir; önemli olan artışın hangi amaçlara gittiğini görmektir."
        },
        {
          "heading": "Karar verirken",
          "text": "Gelir artışını önce temel güvence, hedefler ve keyif arasında bilinçli paylaş. Yeni sabit giderlerin gelecekte gelirin azalırsa da süreceğini hesaba kat. Geçici geliri kalıcı yaşam standardının temeli yapmak risk oluşturabilir."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero’da gelir ve gideri önceki aylarla karşılaştır. Gelir büyürken birikim tutarı veya oranı nasıl değişiyor? Tek seferlik yüksek kazanç ayını düzenli ayla doğrudan kıyaslama."
        }
      ],
      "example": "Gelir 30.000 TL’den 40.000 TL’ye, gider 25.000 TL’den 38.000 TL’ye çıkarsa kalan 5.000 TL’den 2.000 TL’ye iner. Daha çok kazanmak tek başına daha çok para ayırdığın anlamına gelmemiştir.",
      "pitfall": "Gelir yükselmesini otomatik finansal iyileşme saymak.",
      "steps": [
        "Gelir artışını amaçlara böl",
        "Yeni sabit giderleri kontrol et",
        "Kalan tutarı dönemler arasında kıyasla"
      ],
      "sources": [
        "spending"
      ],
      "related": [
        "small-spending",
        "impulse"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Örnekte gelir arttığında kalan para ne oldu?",
        "options": [
          "10.000 TL arttı.",
          "Değişmedi.",
          "5.000 TL’den 2.000 TL’ye düştü."
        ],
        "correct": 2,
        "explanation": "5.000 TL’den 2.000 TL’ye düştü. Gelir yükselmesini otomatik finansal iyileşme saymak."
      },
      "group": "Harcama alışkanlıkları",
      "moduleId": "habits",
      "outcomes": [
        "Gelir artınca harcama standardının da yükselmesi, birikimin artmasını engelleyebilir.",
        "Sık karıştırılan noktayı fark etmek: Gelir yükselmesini otomatik finansal iyileşme saymak."
      ]
    },
    {
      "id": "money-emotions",
      "title": "Para ve duygular",
      "intro": "Para kararları yalnız hesaplama değildir; güven, kaygı, kıyas ve geçmiş deneyim de etkiler.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Para kararları yalnız hesaplama değildir; güven, kaygı, kıyas ve geçmiş deneyim de etkiler. Bir harcamayı anlamak için hangi duyguyla yapıldığını fark etmek yararlı olabilir."
        },
        {
          "heading": "Karar verirken",
          "text": "Utanç, takipten kaçınmaya; kaygı, gereksiz aşırı kısıtlamaya yol açabilir. Küçük, düzenli kontrol alışkanlığı uzun süre bakmamaktan daha yönetilebilir bir yol sağlar. Sağlıklı karar, kendini cezalandırmakla aynı değildir."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero açıklamalarında kararın nedenini kısa yaz. Bu notları bir öz yargı listesi yerine öğrenme aracı olarak kullan. Eş veya aileyle para konuşurken ortak hedef ve somut sayılara odaklan."
        }
      ],
      "example": "Zor bir günün ardından 900 TL harcayıp ertesi gün pişman olduğunu düşün. Yalnız harcamayı silmek ne bakiyeyi düzeltir ne nedenini açıklar. Kaydı koruyup bir sonraki benzer durumda nasıl davranacağını planlamak daha anlamlıdır.",
      "pitfall": "Gerçekleşen harcamayı silerek sorunun ortadan kalktığını düşünmek.",
      "steps": [
        "Bir harcamanın nedenini yaz",
        "Yargılamadan bir örüntü ara",
        "Küçük bir sonraki adım belirle"
      ],
      "sources": [
        "spending"
      ],
      "related": [
        "small-spending",
        "impulse"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Takipte pişman olduğun harcama için ne yapmalısın?",
        "options": [
          "Gerçek kaydı koruyup kararını değerlendirmek.",
          "Kaydı silip toplamı güzel göstermek.",
          "Gelir olarak yeniden yazmak."
        ],
        "correct": 0,
        "explanation": "Gerçek kaydı koruyup kararını değerlendirmek. Gerçekleşen harcamayı silerek sorunun ortadan kalktığını düşünmek."
      },
      "group": "Harcama alışkanlıkları",
      "moduleId": "habits",
      "outcomes": [
        "Para kararları yalnız hesaplama değildir; güven, kaygı, kıyas ve geçmiş deneyim de etkiler.",
        "Sık karıştırılan noktayı fark etmek: Gerçekleşen harcamayı silerek sorunun ortadan kalktığını düşünmek."
      ]
    },
    {
      "id": "emergency",
      "title": "Acil durum birikimini kur",
      "group": "Birikim ve hedefler",
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
        "risk",
        "automatic-saving"
      ],
      "tool": "emergency",
      "minutes": 3,
      "moduleId": "saving",
      "quiz": {
        "question": "Acil durum tamponu için ay sayısı nasıl seçilir?",
        "options": [
          "Yalnız yatırım getirisine göre.",
          "Gelir güvenliği, zorunlu gider ve kişisel koşullara göre.",
          "Herkes için zorunlu aynı ay sayısı vardır."
        ],
        "correct": 1,
        "explanation": "Gelir güvenliği, zorunlu gider ve kişisel koşullara göre. Her kullanıcıya aynı ay sayısını dayatmak gelir ve sorumluluk farklarını yok sayar."
      },
      "outcomes": [
        "Beklenmeyen gider için ayrılmış para, planlı alışveriş hedefinden farklıdır.",
        "Sık karıştırılan noktayı fark etmek: Her kullanıcıya aynı ay sayısını dayatmak gelir ve sorumluluk farklarını yok sayar."
      ]
    },
    {
      "id": "goals",
      "title": "Birikim hedefini somutlaştır",
      "group": "Birikim ve hedefler",
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
        "annual-costs",
        "emergency",
        "automatic-saving"
      ],
      "tool": "goal",
      "minutes": 3,
      "moduleId": "saving",
      "quiz": {
        "question": "İyi bir birikim hedefinde hangisi bulunmalı?",
        "options": [
          "Yalnız hedefin adı.",
          "Kesin kazanç vaadi.",
          "Amaç, tutar ve ulaşılabilir zaman planı."
        ],
        "correct": 2,
        "explanation": "Amaç, tutar ve ulaşılabilir zaman planı. Birikim hedefi tamamlanma yüzdesi, paranın satın alma gücünü tek başına göstermez."
      },
      "outcomes": [
        "Ne için, ne kadar ve ne zamana kadar biriktirdiğini bil.",
        "Sık karıştırılan noktayı fark etmek: Birikim hedefi tamamlanma yüzdesi, paranın satın alma gücünü tek başına göstermez."
      ]
    },
    {
      "id": "automatic-saving",
      "title": "Düzenli birikim alışkanlığı",
      "intro": "Birikimi yalnız ay sonunda kalana bırakmak, hedeflerin belirsizleşmesine yol açabilir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Birikimi yalnız ay sonunda kalana bırakmak, hedeflerin belirsizleşmesine yol açabilir. Gelir geldiğinde gerçekçi bir katkı planlamak düzen sağlayabilir; tutar zorunlu ödemelerle uyumlu olmalıdır."
        },
        {
          "heading": "Karar verirken",
          "text": "Banka otomatik transferi ile uygulamada para ayırmak farklıdır. Nero rezervi para göndermez. Gelir düzensizse sabit tutar yerine gerçekleşen gelire göre ayarlanabilir bir katkı düşün."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero’da hedefe para ayırdığında hesap bakiyesi değişmez. Başka banka hesabına gerçekten para taşındığında transfer kaydet. Aynı hareketi ayrıca gider yazma; birikim için harcamadan vazgeçmiş olmak yeni bir harcama değildir."
        }
      ],
      "example": "Bankana 30.000 TL gelir geldi, 3.000 TL’yi hedefe rezerv yaptın: hesap 30.000 TL kalır, serbest bölüm 27.000 TL olur. Başka bankana 3.000 TL gönderirsen hesap dağılımı değişir; toplam banka paran değişmez.",
      "pitfall": "Birikim transferini tüketim gideri saymak.",
      "steps": [
        "Gelir tarihine uygun katkı belirle",
        "Rezerv ile gerçek transferi ayır",
        "Katkıyı değişen koşullara göre gözden geçir"
      ],
      "sources": [
        "goals"
      ],
      "related": [
        "emergency",
        "goals"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Nero hedefinde 3.000 TL rezerv yapmak neyi değiştirir?",
        "options": [
          "Ayrılan para bilgisini; banka bakiyesini değil.",
          "Banka hesabından 3.000 TL gönderir.",
          "3.000 TL gider yaratır."
        ],
        "correct": 0,
        "explanation": "Ayrılan para bilgisini; banka bakiyesini değil. Birikim transferini tüketim gideri saymak."
      },
      "group": "Birikim ve hedefler",
      "moduleId": "saving",
      "outcomes": [
        "Birikimi yalnız ay sonunda kalana bırakmak, hedeflerin belirsizleşmesine yol açabilir.",
        "Sık karıştırılan noktayı fark etmek: Birikim transferini tüketim gideri saymak."
      ]
    },
    {
      "id": "goal-priority",
      "title": "Hedeflerini önceliklendir",
      "intro": "Birden fazla hedef aynı parayı talep edebilir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Birden fazla hedef aynı parayı talep edebilir. Öncelik belirlerken zorunluluk, tarih, gecikmenin sonucu ve mevcut tamponu birlikte değerlendir. Her hedefe eşit dağıtmak her zaman uygun değildir."
        },
        {
          "heading": "Karar verirken",
          "text": "Hedef tutarı, mevcut birikim ve kalan süre aylık gerekli katkıyı belirler. Tutar mümkün değilse süreyi veya kapsamı değiştir. Beklenen yatırım getirisiyle açığı kesin kapanacak gibi göstermemek gerekir."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero hesaplayıcısı getiri varsaymadan gereken katkıyı gösterir. Farklı hedeflerin aynı banka hesabındaki rezervleri o bakiyeyi aşmamalıdır; bütün hedefleri birlikte kontrol et."
        }
      ],
      "example": "İki hedef için aylık 4.000 ve 3.000 TL gerekirken yalnız 5.000 TL ayırabiliyorsan plan 2.000 TL açık verir. Bir hedefin tarihini uzatmak veya daha düşük maliyetli seçenek seçmek bu açığı görünür biçimde çözebilir.",
      "pitfall": "Aynı birikimi iki hedefte birden kullanabileceğini varsaymak.",
      "steps": [
        "Hedefleri tarih ve önemle sırala",
        "Gerekli katkıları topla",
        "Sığmayan hedefin süresini değiştir"
      ],
      "sources": [
        "goals"
      ],
      "related": [
        "emergency",
        "goals"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Toplam katkı kapasiteyi aşıyorsa ne gerekir?",
        "options": [
          "Kesin yüksek getiri varsaymak.",
          "Hedef tutarı, süre veya öncelikleri değiştirmek.",
          "Aynı parayı iki kez saymak."
        ],
        "correct": 1,
        "explanation": "Hedef tutarı, süre veya öncelikleri değiştirmek. Aynı birikimi iki hedefte birden kullanabileceğini varsaymak."
      },
      "group": "Birikim ve hedefler",
      "moduleId": "saving",
      "outcomes": [
        "Birden fazla hedef aynı parayı talep edebilir.",
        "Sık karıştırılan noktayı fark etmek: Aynı birikimi iki hedefte birden kullanabileceğini varsaymak."
      ]
    },
    {
      "id": "protect-saving",
      "title": "Birikimi korumayı düşün",
      "intro": "Birikimin amacı, ne zaman kullanılacağına bağlıdır.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Birikimin amacı, ne zaman kullanılacağına bağlıdır. Yakında ödenecek para için erişilebilirlik ve değer dalgalanması önemlidir; uzun vadeli hedefin koşulları farklı olabilir."
        },
        {
          "heading": "Karar verirken",
          "text": "En yüksek görünen getiri, her hedef için en iyi seçim değildir. Vade bozma koşulları, ücret, kur riski ve kurum güvenilirliği sonuçları etkiler. Anlamadığın ürüne yalnız başkasının kullandığı için girme."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero bir yatırım hesabı veya otomatik piyasa fiyatı kaynağı değildir. Hedef rezervini izler; dışarıdaki birikimin güncel değerini bağımsız kontrol et. Fiyatı değişen hedef tutarını dönemsel yenile."
        }
      ],
      "example": "Üç ay sonra 20.000 TL ödeme yapacaksın. Tüm para o tarihte değerinin ciddi değişebileceği bir araçtaysa, satışta gerekli tutara ulaşamayabilirsin. Beklenen yüksek getiri, ödeme günündeki erişimi garanti etmez.",
      "pitfall": "Kısa vadeli kesin ödeme parasını yalnız getiri oranıyla değerlendirmek.",
      "steps": [
        "Hedefinin kullanım tarihini yaz",
        "Erişim ve ücret koşullarını oku",
        "Hedef fiyatını güncelle"
      ],
      "sources": [
        "risk"
      ],
      "related": [
        "emergency",
        "goals"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Yakın tarihli ödeme için hangi özellik önemlidir?",
        "options": [
          "Yalnız geçmiş en yüksek getiri.",
          "Ürünün sosyal medya popülerliği.",
          "Gerektiğinde paraya erişim ve değer riski."
        ],
        "correct": 2,
        "explanation": "Gerektiğinde paraya erişim ve değer riski. Kısa vadeli kesin ödeme parasını yalnız getiri oranıyla değerlendirmek."
      },
      "group": "Birikim ve hedefler",
      "moduleId": "saving",
      "outcomes": [
        "Birikimin amacı, ne zaman kullanılacağına bağlıdır.",
        "Sık karıştırılan noktayı fark etmek: Kısa vadeli kesin ödeme parasını yalnız getiri oranıyla değerlendirmek."
      ]
    },
    {
      "id": "bank-accounts",
      "title": "Banka hesaplarını tanı",
      "intro": "Banka hesabı paranın tutulduğu takip yeridir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Banka hesabı paranın tutulduğu takip yeridir. Vadesiz hesap, vadeli mevduat ve kredi kartı aynı amaçla kullanılmaz. Kart limiti, kendi birikiminin uzantısı değildir."
        },
        {
          "heading": "Karar verirken",
          "text": "Birden fazla hesap kullanmak düzen sağlayabilir; ancak toplam parayı hesaplarken hesaplar arasındaki transferi gelir saymamak gerekir. Ayrı hesap açmak, gelir kazanmak anlamına gelmez."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero’da gerçek hesaplarını anlaşılır adlarla ekle. Mevcut bakiye başlangıç kaydıdır, yeni gelir değildir. Her hesabın para birimini doğru seç; döviz toplamı için manuel kur gerektiğini unutma."
        }
      ],
      "example": "Bir bankanda 10.000 TL, diğerinde 5.000 TL var. İlkinden ikincisine 2.000 TL gönderince bakiyeler 8.000 ve 7.000 TL olur. Toplam 15.000 TL kalır; 2.000 TL yeni gelir değildir.",
      "pitfall": "Başlangıç bakiyesi ve transferi aylık gelir gibi eklemek.",
      "steps": [
        "Hesaplarına anlaşılır ad ver",
        "Başlangıç bakiyesini doğrula",
        "Transferleri iki hesapla kaydet"
      ],
      "sources": [
        "cashflow"
      ],
      "related": [
        "deposit",
        "simple-interest"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Kendi iki hesabın arasındaki para hareketi nedir?",
        "options": [
          "Transfer.",
          "Maaş geliri.",
          "Yeni kazanç."
        ],
        "correct": 0,
        "explanation": "Transfer. Başlangıç bakiyesi ve transferi aylık gelir gibi eklemek."
      },
      "group": "Bankacılık",
      "moduleId": "banking",
      "outcomes": [
        "Banka hesabı paranın tutulduğu takip yeridir.",
        "Sık karıştırılan noktayı fark etmek: Başlangıç bakiyesi ve transferi aylık gelir gibi eklemek."
      ]
    },
    {
      "id": "deposit",
      "title": "Mevduat ve vade",
      "intro": "Mevduatta tutar, vade, oran ve erken çıkış koşulları birlikte okunmalıdır.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Mevduatta tutar, vade, oran ve erken çıkış koşulları birlikte okunmalıdır. İlan edilen yıllık oran, kısa vadenin sonunda aynı yüzdeyi kazanacağın anlamına gelmez."
        },
        {
          "heading": "Karar verirken",
          "text": "Brüt faiz ile kesintiler sonrası net sonuç farklı olabilir. Bankanın teklifinde net vade sonu tutarı ve uygulanacak koşulları kontrol et. Vade yenilenirken oran değişebilir; ilk oranı yıllarca sabit varsayma."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero’da para taşımayı transfer olarak izle. Hesaba gerçekleşen faiz/kâr payını ayrı gelir yazabilirsin. Güncel vergi oranlarını bu eğitimden ezberlemek yerine banka belgesi ve resmi kaynaktan doğrula."
        }
      ],
      "example": "Basitleştirilmiş 365 gün esaslı senaryoda 10.000 TL, yıllık %12 basit oranla 30 gün için yaklaşık 98,63 TL brüt faiz üretir: 10.000 × 0,12 × 30 / 365. Gerçek hesapta gün esası, kesintiler ve ürün koşulları farklı olabilir.",
      "pitfall": "Yıllık oranı bir aylık getiri sanmak.",
      "steps": [
        "Vade sonu net tutarı öğren",
        "Erken çıkış koşulunu oku",
        "Gerçekleşen getiriyi ayrı kaydet"
      ],
      "sources": [
        "compound"
      ],
      "related": [
        "bank-accounts",
        "simple-interest"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Yıllık %12 oran, bir ayda kesin %12 kazanç mıdır?",
        "options": [
          "Yalnız yüksek tutarlarda evet.",
          "Hayır; süre ve ürün koşulları gerekir.",
          "Evet, her ay aynı yüzde."
        ],
        "correct": 1,
        "explanation": "Hayır; süre ve ürün koşulları gerekir. Yıllık oranı bir aylık getiri sanmak."
      },
      "group": "Bankacılık",
      "moduleId": "banking",
      "outcomes": [
        "Mevduatta tutar, vade, oran ve erken çıkış koşulları birlikte okunmalıdır.",
        "Sık karıştırılan noktayı fark etmek: Yıllık oranı bir aylık getiri sanmak."
      ]
    },
    {
      "id": "simple-interest",
      "title": "Basit faizi hesapla",
      "intro": "Basit faiz hesaplamasında getiri belirli bir başlangıç tutarı üzerinden süreyle orantılı hesaplanır.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Basit faiz hesaplamasında getiri belirli bir başlangıç tutarı üzerinden süreyle orantılı hesaplanır. Bileşik büyümede ise önceki getiriler de sonraki dönem hesabına katılabilir."
        },
        {
          "heading": "Karar verirken",
          "text": "Oranın hangi döneme ait olduğu açık olmalıdır. Aylık oranla yıllık oranı doğrudan karşılaştırma. Ücret ve kesintiler dahil olmadığında çıkan sonuç brüttür; gerçek ödeme taahhüdü değildir."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Hesap yapmak teklifleri anlamaya yardım eder. Ancak bankanın gün esası, erken ödeme veya gecikme şartlarını aynı varsayıma indirgeyip sözleşmeden bağımsız sonuç çıkarma."
        }
      ],
      "example": "10.000 TL için bir yıllık %10 basit varsayımda 1.000 TL getiri, iki yılda 2.000 TL getiri hesaplanır. Her yıl getiri yeniden aynı oranla eklenip büyürse ikinci yılın temeli değişir; bu artık aynı basit senaryo değildir.",
      "pitfall": "Basit ve bileşik hesap sonucunu aynı kabul etmek.",
      "steps": [
        "Oranın dönemini yaz",
        "Süre birimini eşitle",
        "Masraf ve kesintileri ayrıca kontrol et"
      ],
      "sources": [
        "compound"
      ],
      "related": [
        "bank-accounts",
        "deposit"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "İki yıllık basit %10 örneğinde getiri nedir?",
        "options": [
          "2.100 TL.",
          "Her koşulda 10.000 TL.",
          "2.000 TL, başlangıç tutarı 10.000 TL ise."
        ],
        "correct": 2,
        "explanation": "2.000 TL, başlangıç tutarı 10.000 TL ise. Basit ve bileşik hesap sonucunu aynı kabul etmek."
      },
      "group": "Bankacılık",
      "moduleId": "banking",
      "outcomes": [
        "Basit faiz hesaplamasında getiri belirli bir başlangıç tutarı üzerinden süreyle orantılı hesaplanır.",
        "Sık karıştırılan noktayı fark etmek: Basit ve bileşik hesap sonucunu aynı kabul etmek."
      ]
    },
    {
      "id": "compound",
      "title": "Bileşik büyümenin matematiği",
      "group": "Bankacılık",
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
        "risk",
        "bank-accounts",
        "deposit"
      ],
      "tool": "compound",
      "minutes": 3,
      "moduleId": "banking",
      "quiz": {
        "question": "Bileşik büyümede ne değişir?",
        "options": [
          "Sonraki dönem hesabında önceki büyüme de tabana dahil olur.",
          "Getiri kesinleşir.",
          "Masraf ve risk yok olur."
        ],
        "correct": 0,
        "explanation": "Sonraki dönem hesabında önceki büyüme de tabana dahil olur. Geçmiş getiriyi gelecekte sabit faiz gibi kullanmak yanıltıcıdır."
      },
      "outcomes": [
        "Önceki dönemin artışı da sonraki dönemin hesap tabanına katılır.",
        "Sık karıştırılan noktayı fark etmek: Geçmiş getiriyi gelecekte sabit faiz gibi kullanmak yanıltıcıdır."
      ]
    },
    {
      "id": "bank-fees",
      "title": "Banka ücretlerini fark et",
      "intro": "Hesap işletimi, transfer, kart veya başka hizmetlerin ücretleri toplam maliyeti etkileyebilir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Hesap işletimi, transfer, kart veya başka hizmetlerin ücretleri toplam maliyeti etkileyebilir. Hangi ücretin uygulanacağı ürüne ve koşullara bağlıdır; tüm bankalarda aynı değildir."
        },
        {
          "heading": "Karar verirken",
          "text": "Ücretsiz teklifin hangi süre veya kullanım koşuluyla geçerli olduğunu oku. Bir hizmetin fiyatını yalnız ilk ay üzerinden karşılaştırma. Ek ürün alma şartı toplam maliyeti değiştirebilir."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero’da gerçekleşmiş banka ücretini uygun gider kategorisine kaydet. Ücreti fark edince açıklama ve dekontu sakla; itirazın koşullarını güncel resmi kanallardan kontrol et."
        }
      ],
      "example": "Aylık 40 TL ücret ve yılda iki kez 100 TL ek hizmet ödemesi varsa varsayımsal yıllık toplam 680 TL olur. İlk ayın ücretsiz olması geri kalan 11 ayı da ücretsiz yapmaz.",
      "pitfall": "Küçük ücretleri hiç kaydetmemek veya koşullu teklifi koşulsuz sanmak.",
      "steps": [
        "Ücret tarifesini oku",
        "Gerçekleşen ücretleri kaydet",
        "Yıllık toplamı karşılaştır"
      ],
      "sources": [
        "spending"
      ],
      "related": [
        "bank-accounts",
        "deposit"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Bir teklifin ücretsizliği için neye bakmalısın?",
        "options": [
          "Kartın rengine.",
          "Süre, koşullar ve toplam maliyet.",
          "Yalnız reklam başlığına."
        ],
        "correct": 1,
        "explanation": "Süre, koşullar ve toplam maliyet. Küçük ücretleri hiç kaydetmemek veya koşullu teklifi koşulsuz sanmak."
      },
      "group": "Bankacılık",
      "moduleId": "banking",
      "outcomes": [
        "Hesap işletimi, transfer, kart veya başka hizmetlerin ücretleri toplam maliyeti etkileyebilir.",
        "Sık karıştırılan noktayı fark etmek: Küçük ücretleri hiç kaydetmemek veya koşullu teklifi koşulsuz sanmak."
      ]
    },
    {
      "id": "transfers",
      "title": "Transfer ve gelir farkı",
      "intro": "Kendi hesapların arasında taşınan para yeni kazanç değildir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Kendi hesapların arasında taşınan para yeni kazanç değildir. Kaynak hesap azalır, hedef hesap artar. Transfer ücreti varsa o ayrıca giderdir."
        },
        {
          "heading": "Karar verirken",
          "text": "Kredi kartına banka hesabından ödeme de transferdir. Harcama kartla alışveriş yaptığında kaydedildiyse ödemede yeniden gider yazmak aynı tüketimi iki kez sayar. Dövizli transferde her iki hesabın gerçek tutarını bilmek gerekir."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero’da kaynak ve hedef hesabı seç. Farklı para birimlerinde hedefe geçen gerçek tutarı yaz. Kendi banka hesapların arasındaki transfer, toplam nakit/banka paranı ücret dışında değiştirmez."
        }
      ],
      "example": "Bankadan karta 1.000 TL ödersen banka 1.000 TL azalır ve kart borcu 1.000 TL azalır. Önceden kaydedilmiş alışverişin gideri değişmez. İşlem için 5 TL banka ücreti varsa bunu ayrı gider olarak kaydet.",
      "pitfall": "Kart ödemesini alışveriş gideriyle birlikte ikinci kez saymak.",
      "steps": [
        "Kaynak ve hedefi seç",
        "Dekonttaki hedef tutarı kontrol et",
        "Ücreti ayrı gider yaz"
      ],
      "sources": [
        "cashflow"
      ],
      "related": [
        "bank-accounts",
        "deposit"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Kart borcu ödemesi nasıl kaydedilir?",
        "options": [
          "İkinci bir alışveriş gideri.",
          "Maaş geliri.",
          "Banka hesabından karta transfer."
        ],
        "correct": 2,
        "explanation": "Banka hesabından karta transfer. Kart ödemesini alışveriş gideriyle birlikte ikinci kez saymak."
      },
      "group": "Bankacılık",
      "moduleId": "banking",
      "outcomes": [
        "Kendi hesapların arasında taşınan para yeni kazanç değildir.",
        "Sık karıştırılan noktayı fark etmek: Kart ödemesini alışveriş gideriyle birlikte ikinci kez saymak."
      ]
    },
    {
      "id": "account-security",
      "title": "Hesap güvenliği",
      "intro": "Güçlü ve her hizmette farklı parola, uygun çok faktörlü doğrulama ve cihaz güncellemeleri hesap riskini azaltmaya yardımcı olur.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Güçlü ve her hizmette farklı parola, uygun çok faktörlü doğrulama ve cihaz güncellemeleri hesap riskini azaltmaya yardımcı olur. Bir bildirimdeki bağlantı tek başına güvenilirlik göstergesi değildir."
        },
        {
          "heading": "Karar verirken",
          "text": "Bankacılık işlemini kendi açtığın resmi uygulama veya doğruladığın adres üzerinden yap. Şifre, tek kullanımlık kod veya uzaktan erişim talebi geldiğinde talebin kaynağını bağımsız doğrula. Acele baskısı güvenlik kontrolünü kaldırmaz."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero’ya kart numarası, banka parolası veya doğrulama kodu girmen gerekmez. Fiş ve yedek dosyaları kişisel bilgi içerebilir; paylaştığın dosyaları kontrol et."
        }
      ],
      "example": "Bankan adına SMS alıp hesabın kapanacak denildiğini düşün. Mesajdaki adrese girmek yerine bankanın bildiğin uygulamasını açıp durumu kontrol et. Aynı görünen logo, gönderenin banka olduğunu kanıtlamaz.",
      "pitfall": "Tek kullanımlık doğrulama kodunu yardım isteyen kişiye vermek.",
      "steps": [
        "Resmi uygulama adresini doğrula",
        "Parolaları tekrar kullanma",
        "Paylaşacağın yedekleri kontrol et"
      ],
      "sources": [
        "fraud"
      ],
      "related": [
        "bank-accounts",
        "deposit"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Banka adına gelen linki nasıl doğrulamalısın?",
        "options": [
          "Bankaya bildiğin bağımsız resmi kanaldan ulaşarak.",
          "Mesajdaki logoya bakarak.",
          "Gönderen acele diyorsa hemen açarak."
        ],
        "correct": 0,
        "explanation": "Bankaya bildiğin bağımsız resmi kanaldan ulaşarak. Tek kullanımlık doğrulama kodunu yardım isteyen kişiye vermek."
      },
      "group": "Bankacılık",
      "moduleId": "banking",
      "outcomes": [
        "Güçlü ve her hizmette farklı parola, uygun çok faktörlü doğrulama ve cihaz güncellemeleri hesap riskini azaltmaya yardımcı olur.",
        "Sık karıştırılan noktayı fark etmek: Tek kullanımlık doğrulama kodunu yardım isteyen kişiye vermek."
      ]
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
        "cash-flow",
        "statement"
      ],
      "tool": null,
      "minutes": 3,
      "moduleId": "debt",
      "quiz": {
        "question": "Kart alışverişi sonrası banka hesabından kart ödemesi nedir?",
        "options": [
          "Aynı alışverişin ikinci gideri.",
          "Borcu azaltan transfer; ikinci gider değildir.",
          "Yeni gelir."
        ],
        "correct": 1,
        "explanation": "Borcu azaltan transfer; ikinci gider değildir. Nero’daki yaklaşık dönem borcu banka ekstresinin yerine geçmez."
      },
      "outcomes": [
        "Limit, toplam borç, dönem borcu ve ödeme tutarı aynı değildir.",
        "Sık karıştırılan noktayı fark etmek: Nero’daki yaklaşık dönem borcu banka ekstresinin yerine geçmez."
      ]
    },
    {
      "id": "statement",
      "title": "Ekstre ve ödeme tarihleri",
      "intro": "Hesap kesim tarihi bir dönemin hesaplandığı tarih; son ödeme tarihi o dönem için belirtilen ödeme sınırıdır.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Hesap kesim tarihi bir dönemin hesaplandığı tarih; son ödeme tarihi o dönem için belirtilen ödeme sınırıdır. Toplam kart borcu, o ayki ekstre borcu ve gelecek taksitler farklı değerler olabilir."
        },
        {
          "heading": "Karar verirken",
          "text": "Nero’nun hesabı girdiğin verilere dayanır. Faiz, ücret, eski bakiyeler veya eksik kayıtlar banka ekstresinden farklı sonuç doğurabilir. Resmi son ödeme ve tutar için bankanın ekstresini esas al."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Kesim günü ve son ödeme gününü kart hesabına doğru gir. Taksit planında toplam tutar ile ilk taksit tarihini ayır. Ödendi işaretini yanlış seçersen geri al; borç ve banka bakiyesi yeniden hesaplanır."
        }
      ],
      "example": "Toplam 50.000 TL taksit borcu, 5 eşit taksitte ayda 10.000 TL olabilir. Bu ayki taksit 10.000 TL iken toplam borç hâlâ 50.000 TL başlayabilir. Başka alışveriş, faiz veya ücret varsa ekstre tutarı 10.000 TL’den farklı olabilir.",
      "pitfall": "Toplam kart borcunu otomatik olarak bu ayki ekstre borcu sanmak.",
      "steps": [
        "Ekstrede üç tutarı ayır",
        "Kesim ve son ödeme gününü doğrula",
        "Ödeme kaydını banka hareketiyle karşılaştır"
      ],
      "sources": [
        "credit"
      ],
      "related": [
        "cards",
        "minimum"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Toplam borç ve bu ayki ödeme aynı mıdır?",
        "options": [
          "Her zaman aynıdır.",
          "Taksit varsa borç yoktur.",
          "Her zaman değil."
        ],
        "correct": 2,
        "explanation": "Her zaman değil. Toplam kart borcunu otomatik olarak bu ayki ekstre borcu sanmak."
      },
      "group": "Kart ve borç",
      "moduleId": "debt",
      "outcomes": [
        "Hesap kesim tarihi bir dönemin hesaplandığı tarih; son ödeme tarihi o dönem için belirtilen ödeme sınırıdır.",
        "Sık karıştırılan noktayı fark etmek: Toplam kart borcunu otomatik olarak bu ayki ekstre borcu sanmak."
      ]
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
        "installments",
        "cards",
        "statement"
      ],
      "tool": null,
      "minutes": 3,
      "moduleId": "debt",
      "quiz": {
        "question": "Asgari tutarı ödemek ne anlama gelir?",
        "options": [
          "Toplam borcun tamamının kapanması anlamına gelmez.",
          "Borcu otomatik sıfırlar.",
          "Faiz dahil her yükümlülüğü her durumda kaldırır."
        ],
        "correct": 0,
        "explanation": "Toplam borcun tamamının kapanması anlamına gelmez. Kısmi ödeme sonrasında kartı yeniden kullanmak borcun azalmasını yavaşlatabilir."
      },
      "outcomes": [
        "Kısmi ödeme yaptığında kalan borç ortadan kalkmaz.",
        "Sık karıştırılan noktayı fark etmek: Kısmi ödeme sonrasında kartı yeniden kullanmak borcun azalmasını yavaşlatabilir."
      ]
    },
    {
      "id": "card-interest",
      "title": "Kart faizini anlamak",
      "intro": "Kartta tam ödeme, kısmi ödeme, nakit kullanım ve gecikme farklı maliyetler doğurabilir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Kartta tam ödeme, kısmi ödeme, nakit kullanım ve gecikme farklı maliyetler doğurabilir. Asgari tutarın ödenmesi, kalan borcun maliyetsiz olduğu anlamına gelmez."
        },
        {
          "heading": "Karar verirken",
          "text": "Yüzdeyi okurken hangi döneme ait olduğunu, vergi/ücret dahil olup olmadığını ve hangi bakiye üzerinden hesaplandığını öğren. Ülkelerin kart kuralları aynı değildir; yabancı bir örneği Türkiye’ye aynen uygulama."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero faiz veya banka ekstresini kendiliğinden hesaplayan bir banka sistemi değildir. Bankanın gerçekleşmiş faiz/ücret kayıtlarını gider olarak gir; kart borcunu ekstreyle karşılaştır. Eğitimdeki varsayımsal oran güncel kart oranı değildir."
        }
      ],
      "example": "Varsayımsal bir dönem oranı %3 ve hesaplama tabanı 10.000 TL ise yalnız bu sade çarpım 300 TL verir. Gerçek kart maliyeti gün sayısı, işlem türü, kesintiler ve sözleşme nedeniyle bu örnekten farklı olabilir.",
      "pitfall": "Asgari ödeme yaptığında kalan borcun faizsiz olduğunu sanmak.",
      "steps": [
        "Oranın dönemini öğren",
        "Tam ödeme ile asgariyi ayır",
        "Gerçek maliyeti ekstreye göre kaydet"
      ],
      "sources": [
        "debt"
      ],
      "related": [
        "cards",
        "statement"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Asgari ödeme kalan borcu sıfırlar mı?",
        "options": [
          "Kart limiti kadar azaltır.",
          "Hayır, yalnız ödenen tutar azalır.",
          "Evet, her zaman."
        ],
        "correct": 1,
        "explanation": "Hayır, yalnız ödenen tutar azalır. Asgari ödeme yaptığında kalan borcun faizsiz olduğunu sanmak."
      },
      "group": "Kart ve borç",
      "moduleId": "debt",
      "outcomes": [
        "Kartta tam ödeme, kısmi ödeme, nakit kullanım ve gecikme farklı maliyetler doğurabilir.",
        "Sık karıştırılan noktayı fark etmek: Asgari ödeme yaptığında kalan borcun faizsiz olduğunu sanmak."
      ]
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
        "purchase",
        "statement"
      ],
      "tool": null,
      "minutes": 3,
      "moduleId": "debt",
      "quiz": {
        "question": "Taksitli alışverişte hangi tutarlar ayrı izlenmeli?",
        "options": [
          "Yalnız ilk taksit.",
          "Yalnız kart limiti.",
          "Toplam maliyet ve aylık ödeme yükü."
        ],
        "correct": 2,
        "explanation": "Toplam maliyet ve aylık ödeme yükü. Uygulamadaki planı silmek, atlamak veya duraklatmak sağlayıcıya ödeme yapılmış sayılmaz."
      },
      "outcomes": [
        "Küçük aylık ödeme, küçük toplam harcama anlamına gelmez.",
        "Sık karıştırılan noktayı fark etmek: Uygulamadaki planı silmek, atlamak veya duraklatmak sağlayıcıya ödeme yapılmış sayılmaz."
      ]
    },
    {
      "id": "loan-cost",
      "title": "Kredinin toplam maliyeti",
      "intro": "Krediyi yalnız aylık taksitle değerlendirme.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Krediyi yalnız aylık taksitle değerlendirme. Toplam ödeme, vade, başlangıç masrafları ve koşullar aynı anda önemlidir. Uzun vade taksiti azaltırken toplam maliyeti artırabilir."
        },
        {
          "heading": "Karar verirken",
          "text": "Aynı tutarlı teklifler için ödeme planını ve yıllık maliyet bilgilerini incele. Erken kapama veya gecikme gibi durumların koşullarını güncel sözleşmeden öğren. Reklam oranı tek başına bütün maliyeti açıklamaz."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero planı ödemeleri takip eder; amortisman veya resmi kredi faiz hesabı üretmez. Mevcut banka bakiyesine giren kredi parası kazanılmış maaş değildir. Kredi takibini uygun hesap/planla, gelir raporunu şişirmeden yap."
        }
      ],
      "example": "A teklifi 12 × 5.000 TL ve 1.000 TL başlangıç masrafıysa basit toplam 61.000 TL; B teklifi 24 × 3.000 TL ve aynı masrafla 73.000 TL olur. B’nin aylık ödemesi düşük ama toplamı yüksektir; iki teklifin diğer koşulları da incelenmelidir.",
      "pitfall": "En düşük aylık taksiti en ucuz kredi saymak.",
      "steps": [
        "Tüm taksitleri topla",
        "Başlangıç masraflarını ekle",
        "Vadeleri ve koşulları karşılaştır"
      ],
      "sources": [
        "debt"
      ],
      "related": [
        "cards",
        "statement"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Örnekte toplam ödeme hangi teklifte daha düşük?",
        "options": [
          "A teklifinde 61.000 TL.",
          "B teklifinde 73.000 TL.",
          "Aylık taksit küçük olan her zaman ucuz."
        ],
        "correct": 0,
        "explanation": "A teklifinde 61.000 TL. En düşük aylık taksiti en ucuz kredi saymak."
      },
      "group": "Kart ve borç",
      "moduleId": "debt",
      "outcomes": [
        "Krediyi yalnız aylık taksitle değerlendirme.",
        "Sık karıştırılan noktayı fark etmek: En düşük aylık taksiti en ucuz kredi saymak."
      ]
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
        "cash-flow",
        "cards",
        "statement"
      ],
      "tool": null,
      "minutes": 3,
      "moduleId": "debt",
      "quiz": {
        "question": "Çığ yöntemi hangi borcu öne alır?",
        "options": [
          "Her zaman en yeni borcu.",
          "Genellikle en yüksek faiz maliyetli borcu.",
          "Her zaman en küçük bakiyeyi."
        ],
        "correct": 1,
        "explanation": "Genellikle en yüksek faiz maliyetli borcu. Tek bir yöntem herkesin sözleşmesine ve ödeme gücüne uygun değildir."
      },
      "outcomes": [
        "Maliyet ve sürdürülebilirlik iki ayrı karar ölçütüdür.",
        "Sık karıştırılan noktayı fark etmek: Tek bir yöntem herkesin sözleşmesine ve ödeme gücüne uygun değildir."
      ]
    },
    {
      "id": "guarantor",
      "title": "Kefilliği ciddiye al",
      "intro": "Kefillik, başka bir kişinin yükümlülüğü için sorumluluk doğurabilen hukuki bir ilişkidir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Kefillik, başka bir kişinin yükümlülüğü için sorumluluk doğurabilen hukuki bir ilişkidir. Yalnız iyi niyet göstergesi veya formalite değildir. Sorumluluğun sınırı ve şartları sözleşmeye ve hukuka bağlıdır."
        },
        {
          "heading": "Karar verirken",
          "text": "İmza atmadan önce tutar, süre ve hangi yükümlülüğe bağlı olduğunu öğren. Türkiye’deki şekil ve onay şartları için güncel resmi düzenlemeyi ve gerektiğinde uzman desteğini kullan. Bu ders hukuki yeterlilik değerlendirmesi yapmaz."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero’da bir not ve olası ödeme senaryosu oluşturmak riski görünür kılabilir; henüz gerçekleşmemiş yükümlülüğü kesin gider diye yazma. Sözleşme belgelerini güvenli yerde tut."
        }
      ],
      "example": "Bir yakınının 80.000 TL yükümlülüğü için imza düşünüyorsun. Asıl borçlunun ödememesi halinde hangi sorumluluğu üstlendiğini bilmeden yalnız aylık 4.000 TL taksite bakmak yeterli değildir. Önce sözleşmenin kapsamı anlaşılmalıdır.",
      "pitfall": "Kefilliği para çıkmadığı için risksiz saymak.",
      "steps": [
        "Sözleşme kapsamını öğren",
        "Kendi ödeme kapasiteni değerlendir",
        "Gerekli hukuki bilgiyi doğrula"
      ],
      "sources": [
        "debt"
      ],
      "related": [
        "cards",
        "statement"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Kefillik kararında ne bilinmeli?",
        "options": [
          "Yalnız borçlunun sözü.",
          "Sadece ilk taksit tarihi.",
          "Üstlenilen sorumluluğun şartları ve kapsamı."
        ],
        "correct": 2,
        "explanation": "Üstlenilen sorumluluğun şartları ve kapsamı. Kefilliği para çıkmadığı için risksiz saymak."
      },
      "group": "Kart ve borç",
      "moduleId": "debt",
      "outcomes": [
        "Kefillik, başka bir kişinin yükümlülüğü için sorumluluk doğurabilen hukuki bir ilişkidir.",
        "Sık karıştırılan noktayı fark etmek: Kefilliği para çıkmadığı için risksiz saymak."
      ]
    },
    {
      "id": "inflation",
      "title": "Enflasyon satın alma gücünü nasıl etkiler?",
      "group": "Ekonomiyi anla",
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
        "disinflation",
        "deflation"
      ],
      "tool": "real",
      "minutes": 3,
      "moduleId": "economy",
      "quiz": {
        "question": "Tek bir ürünün zam oranı neyi gösterir?",
        "options": [
          "O ürünün fiyat değişimini; tek başına genel enflasyonu göstermez.",
          "Kesin olarak genel enflasyonu.",
          "Tüm gelirlerin artışını."
        ],
        "correct": 0,
        "explanation": "O ürünün fiyat değişimini; tek başına genel enflasyonu göstermez. Gider kategorisinin büyümesini doğrudan kişisel enflasyon oranı ilan etme."
      },
      "outcomes": [
        "Aynı miktar para zamanla aynı sepeti almayabilir.",
        "Sık karıştırılan noktayı fark etmek: Gider kategorisinin büyümesini doğrudan kişisel enflasyon oranı ilan etme."
      ]
    },
    {
      "id": "disinflation",
      "title": "Enflasyon düşünce fiyatlar düşer mi?",
      "group": "Ekonomiyi anla",
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
        "monthly-review",
        "deflation"
      ],
      "tool": null,
      "minutes": 3,
      "moduleId": "economy",
      "quiz": {
        "question": "Dezenflasyon ne demektir?",
        "options": [
          "Fiyatların her zaman sabit kalması.",
          "Fiyatların artış hızının yavaşlaması.",
          "Fiyatların mutlaka düşmesi."
        ],
        "correct": 1,
        "explanation": "Fiyatların artış hızının yavaşlaması. Enflasyon %20’den %10’a indi ifadesi, fiyatların yarıya indiği anlamına gelmez."
      },
      "outcomes": [
        "Fiyat artış hızının azalması ile fiyatların azalmasını ayır.",
        "Sık karıştırılan noktayı fark etmek: Enflasyon %20’den %10’a indi ifadesi, fiyatların yarıya indiği anlamına gelmez."
      ]
    },
    {
      "id": "deflation",
      "title": "Deflasyon nedir?",
      "intro": "Deflasyon genel fiyat düzeyinin düşmesidir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Deflasyon genel fiyat düzeyinin düşmesidir. Tek bir ürünün ucuzlaması genel deflasyon demek değildir. Dezenflasyonda ise fiyatların artış hızı yavaşlar; genel fiyat düzeyi yine artabilir."
        },
        {
          "heading": "Karar verirken",
          "text": "Fiyat hareketini değerlendirirken kapsam ve süreyi kontrol et. Bireysel harcama sepetin genel endeksten farklı olabilir. Fiyatların düşmesi tek başına ekonomide her şeyin iyi olduğu sonucunu vermez."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero harcamalarını ölçer, resmi fiyat endeksi üretmez. Kategori toplamının azalması daha az alışverişten, iadeden veya fiyat değişiminden kaynaklanabilir; nedeni anlamak için kayıtları incele."
        }
      ],
      "example": "Fiyat endeksi 100’den 110’a, sonra 115’e çıkarsa artış sürer ama hızı düşer. 110’dan 105’e gerilerse o karşılaştırmada fiyat düzeyi düşmüştür. Bir telefonun kampanyayla ucuzlaması bu genel endeks hareketini tek başına göstermez.",
      "pitfall": "Enflasyon oranındaki düşüşü tüm fiyatların düşmesi sanmak.",
      "steps": [
        "Oran ile fiyat düzeyini ayır",
        "Kapsam ve dönemi kontrol et",
        "Harcama azalmasının nedenini araştır"
      ],
      "sources": [
        "disinflation"
      ],
      "related": [
        "inflation",
        "disinflation"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "100→110→115 hareketinde ne olmuştur?",
        "options": [
          "Fiyatlar başlangıca dönmüştür.",
          "Genel deflasyon kesindir.",
          "Fiyat düzeyi artmaya devam etmiştir."
        ],
        "correct": 2,
        "explanation": "Fiyat düzeyi artmaya devam etmiştir. Enflasyon oranındaki düşüşü tüm fiyatların düşmesi sanmak."
      },
      "group": "Ekonomiyi anla",
      "moduleId": "economy",
      "outcomes": [
        "Deflasyon genel fiyat düzeyinin düşmesidir.",
        "Sık karıştırılan noktayı fark etmek: Enflasyon oranındaki düşüşü tüm fiyatların düşmesi sanmak."
      ]
    },
    {
      "id": "purchasing-power",
      "title": "Satın alma gücünü izle",
      "intro": "Nominal gelir tutarı ile o gelirle alınabilecek ürün ve hizmet miktarı farklıdır.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Nominal gelir tutarı ile o gelirle alınabilecek ürün ve hizmet miktarı farklıdır. Gelir artışını yorumlarken aynı dönemin fiyat değişimini de düşünmek gerekir."
        },
        {
          "heading": "Karar verirken",
          "text": "Kişisel deneyimin, resmi ortalama enflasyondan farklı olabilir. Kira payı yüksek bir kişinin baskısı başka bir sepetten farklıdır. Bu farklılık tek başına resmi endeksin yanlış olduğunu kanıtlamaz."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero’da önceki dönemin aynı kategorilerini kıyasla. Kullanım miktarı değiştiğinde gider toplamı yalnız fiyat etkisini göstermeyecektir. Reel oran hesaplayıcısında aynı dönem yüzdelerini kullan."
        }
      ],
      "example": "Gelir %10 artarken genel fiyatlar %20 artmış olsun. Reel değişim yaklaşık −%8,33’tür: 1,10 / 1,20 − 1. Yalnız yüzde farkını çıkarmak yaklaşım verir; kesin oran bölme formülüyle hesaplanır.",
      "pitfall": "Gelir tutarı arttığı için alım gücünün mutlaka arttığını düşünmek.",
      "steps": [
        "Aynı dönem oranlarını seç",
        "Kişisel gider sepetini incele",
        "Reel oran hesaplayıcısını dene"
      ],
      "sources": [
        "inflation"
      ],
      "related": [
        "inflation",
        "disinflation"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Örnekte %10 gelir artışı %20 fiyat artışını aşar mı?",
        "options": [
          "Hayır; reel alım gücü azalır.",
          "Evet; gelir artmış olduğu için.",
          "Sonuç her zaman sıfırdır."
        ],
        "correct": 0,
        "explanation": "Hayır; reel alım gücü azalır. Gelir tutarı arttığı için alım gücünün mutlaka arttığını düşünmek."
      },
      "group": "Ekonomiyi anla",
      "moduleId": "economy",
      "outcomes": [
        "Nominal gelir tutarı ile o gelirle alınabilecek ürün ve hizmet miktarı farklıdır.",
        "Sık karıştırılan noktayı fark etmek: Gelir tutarı arttığı için alım gücünün mutlaka arttığını düşünmek."
      ]
    },
    {
      "id": "real-return",
      "title": "Nominal kazanç ile reel kazanç",
      "group": "Ekonomiyi anla",
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
        "fees",
        "inflation",
        "disinflation"
      ],
      "tool": "real",
      "minutes": 3,
      "moduleId": "economy",
      "quiz": {
        "question": "Nominal getiri %15, aynı dönem enflasyonu %20 ise reel getiri nasıldır?",
        "options": [
          "Kesin +%35.",
          "Yaklaşık −%4,17.",
          "Kesin +%15."
        ],
        "correct": 1,
        "explanation": "Yaklaşık −%4,17. Nominal artışı otomatik satın alma gücü artışı olarak yorumlama."
      },
      "outcomes": [
        "Paranın artması ve alım gücünün artması ayrı sorulardır.",
        "Sık karıştırılan noktayı fark etmek: Nominal artışı otomatik satın alma gücü artışı olarak yorumlama."
      ]
    },
    {
      "id": "currency",
      "title": "Döviz kurunu doğru yorumla",
      "group": "Ekonomiyi anla",
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
        "real-return",
        "inflation",
        "disinflation"
      ],
      "tool": null,
      "minutes": 3,
      "moduleId": "economy",
      "quiz": {
        "question": "Döviz yatırımını kendi para biriminde değerlendirirken neye bakılır?",
        "options": [
          "Yalnız yabancı para fiyatına.",
          "Yalnız hesap adının yabancı olmasına.",
          "Varlık getirisi, kur hareketi ve masraflara birlikte."
        ],
        "correct": 2,
        "explanation": "Varlık getirisi, kur hareketi ve masraflara birlikte. Kur artışı her durumda kazanç değildir; döviz borcu için maliyeti büyütebilir."
      },
      "outcomes": [
        "Aynı yabancı para bakiyesi yerel para cinsinden farklı görünebilir.",
        "Sık karıştırılan noktayı fark etmek: Kur artışı her durumda kazanç değildir; döviz borcu için maliyeti büyütebilir."
      ]
    },
    {
      "id": "central-bank",
      "title": "Merkez bankası ve faiz",
      "intro": "Merkez bankası para politikası araçlarıyla fiyat istikrarını hedefler.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Merkez bankası para politikası araçlarıyla fiyat istikrarını hedefler. Politika faizi, senin bankandaki her mevduat veya kredi oranının bire bir aynısı değildir."
        },
        {
          "heading": "Karar verirken",
          "text": "Piyasa beklentileri, risk, vade ve kurum koşulları farklı ürün oranlarını etkileyebilir. Bir faiz kararından tek bir yatırımın kesin yönünü çıkarmak doğru değildir. Açıklamanın gerekçesini ve kullanılan dönemi oku."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero güncel politika faizi çekmez ve faiz kararıyla yatırım tavsiyesi üretmez. Öğrendiğin kavramı bütçenin kredi veya mevduat koşullarını anlamak için kullan; yeni teklifleri doğrudan kurumdan doğrula."
        }
      ],
      "example": "Politika faiziyle ilgili bir haber görüp bütün kredilerin ertesi gün aynı orana döneceğini varsayma. Sabit koşullu mevcut sözleşme ile yeni kredi teklifi aynı şekilde etkilenmeyebilir. Önce kendi sözleşmenin koşullarını kontrol et.",
      "pitfall": "Faiz kararının bütün ürünlerde aynı ve anında sonuç yaratacağını düşünmek.",
      "steps": [
        "Kararın tarihini kontrol et",
        "Politika ve ürün oranını ayır",
        "Kendi sözleşmeni incele"
      ],
      "sources": [
        "inflation"
      ],
      "related": [
        "inflation",
        "disinflation"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Politika faizi banka teklifinin bire bir aynısı mıdır?",
        "options": [
          "Hayır, farklı ürün koşulları vardır.",
          "Her zaman aynıdır.",
          "Yalnız kartta aynıdır."
        ],
        "correct": 0,
        "explanation": "Hayır, farklı ürün koşulları vardır. Faiz kararının bütün ürünlerde aynı ve anında sonuç yaratacağını düşünmek."
      },
      "group": "Ekonomiyi anla",
      "moduleId": "economy",
      "outcomes": [
        "Merkez bankası para politikası araçlarıyla fiyat istikrarını hedefler.",
        "Sık karıştırılan noktayı fark etmek: Faiz kararının bütün ürünlerde aynı ve anında sonuç yaratacağını düşünmek."
      ]
    },
    {
      "id": "economic-news",
      "title": "Ekonomik haberleri oku",
      "intro": "Haberin başlığı kadar veri kaynağı, dönem ve karşılaştırma önemlidir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Haberin başlığı kadar veri kaynağı, dönem ve karşılaştırma önemlidir. Aylık değişim ile yıllık değişim aynı şeyi ölçmez. Tahmin, gerçekleşmiş veri değildir."
        },
        {
          "heading": "Karar verirken",
          "text": "Bir sayı için hangi kurumun yayımladığını, önceki değerin revize edilip edilmediğini ve kullanılan birimi kontrol et. Yorum ile veriyi ayır. Aynı yüzde farklı başlangıç değerlerinde farklı parasal sonuçlar verir."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero raporunda da önceki ay kıyası yapılırken eksik kayıt ve ayın tamamlanmamış olması sonucu etkiler. Ekonomik haber, kişisel bütçendeki bütün değişimi tek başına açıklamaz."
        }
      ],
      "example": "Bir başlıkta harcamaların %20 arttığı yazıyor. 1.000 TL’den 1.200 TL’ye artış 200 TL; 10.000 TL’den 12.000 TL’ye artış 2.000 TL’dir. Dönemi ve tabanı bilmeden yalnız yüzdeyle karar verilemez.",
      "pitfall": "Tahmin edilen oranı gerçekleşmiş sonuç diye kabul etmek.",
      "steps": [
        "Birincil veri kaynağını bul",
        "Dönemi ve birimi yaz",
        "Veri ile yorumu ayır"
      ],
      "sources": [
        "inflation"
      ],
      "related": [
        "inflation",
        "disinflation"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Bir yüzdeyi yorumlamak için ne gerekir?",
        "options": [
          "Haberi paylaşan kişinin takipçi sayısı.",
          "Başlangıç değeri ve karşılaştırma dönemi.",
          "Yalnız başlık."
        ],
        "correct": 1,
        "explanation": "Başlangıç değeri ve karşılaştırma dönemi. Tahmin edilen oranı gerçekleşmiş sonuç diye kabul etmek."
      },
      "group": "Ekonomiyi anla",
      "moduleId": "economy",
      "outcomes": [
        "Haberin başlığı kadar veri kaynağı, dönem ve karşılaştırma önemlidir.",
        "Sık karıştırılan noktayı fark etmek: Tahmin edilen oranı gerçekleşmiş sonuç diye kabul etmek."
      ]
    },
    {
      "id": "saving-investing",
      "title": "Birikim ve yatırım farkı",
      "intro": "Birikim, harcamadığın parayı geleceğe ayırma davranışıdır.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Birikim, harcamadığın parayı geleceğe ayırma davranışıdır. Yatırım, bu kaynakla getiri hedeflerken belirli riskler üstlenmeyi içerir. İkisi birbirine bağlıdır ama aynı işlem değildir."
        },
        {
          "heading": "Karar verirken",
          "text": "Hedefin vadesi, acil ihtiyaçların ve borçların araç seçimini etkiler. Hiç tampon olmadan bütün kaynakla riskli yatırım yapmak, zor zamanda satış baskısı yaratabilir. Getiri ararken kayıp olasılığını da düşün."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero birikim hedefi yatırım alımı yapmaz. Hedef rezervi ile dışarıda aldığın yatırım aracını ayrı düşün. Kaydedilmemiş yatırımın değerini bütçe ekranı otomatik bilemez."
        }
      ],
      "example": "10.000 TL’yi üç ay sonraki taşınma için ayırmak birikim hedefidir. Paranın fiyatı değişen bir araçta tutulması ayrıca yatırım kararıdır. Aracın yükselmesi taşınma ihtiyacını değiştirmez; düşmesi gereken tutara erişimi zorlaştırabilir.",
      "pitfall": "Her birikimin mutlaka riskli yatırıma çevrilmesi gerektiğini düşünmek.",
      "steps": [
        "Hedefi ve vadeyi yaz",
        "Tampon ihtiyacını değerlendir",
        "Araç riskini ayrı incele"
      ],
      "sources": [
        "save"
      ],
      "related": [
        "risk",
        "risk-capacity"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Nero’da hedefe para ayırmak yatırım satın alır mı?",
        "options": [
          "Evet, otomatik fon alır.",
          "Yalnız döviz hesabında alır.",
          "Hayır; yalnız rezerv takibi yapar."
        ],
        "correct": 2,
        "explanation": "Hayır; yalnız rezerv takibi yapar. Her birikimin mutlaka riskli yatırıma çevrilmesi gerektiğini düşünmek."
      },
      "group": "Yatırıma hazırlan",
      "moduleId": "preparation",
      "outcomes": [
        "Birikim, harcamadığın parayı geleceğe ayırma davranışıdır.",
        "Sık karıştırılan noktayı fark etmek: Her birikimin mutlaka riskli yatırıma çevrilmesi gerektiğini düşünmek."
      ]
    },
    {
      "id": "risk",
      "title": "Risk sadece fiyat oynaklığı değildir",
      "group": "Yatırıma hazırlan",
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
        "emergency",
        "saving-investing",
        "risk-capacity"
      ],
      "tool": null,
      "minutes": 3,
      "moduleId": "preparation",
      "quiz": {
        "question": "Yatırım riski yalnız fiyat oynaklığı mıdır?",
        "options": [
          "Hayır; likidite, kur ve kalıcı kayıp gibi boyutlar da vardır.",
          "Evet; başka risk yoktur.",
          "Sadece yüksek getiri anlamına gelir."
        ],
        "correct": 0,
        "explanation": "Hayır; likidite, kur ve kalıcı kayıp gibi boyutlar da vardır. Düşük oynaklık etiketi, garantili veya risksiz anlamına gelmez."
      },
      "outcomes": [
        "Kaybetme ihtimali, erişim ve vade birlikte değerlendirilir.",
        "Sık karıştırılan noktayı fark etmek: Düşük oynaklık etiketi, garantili veya risksiz anlamına gelmez."
      ]
    },
    {
      "id": "risk-capacity",
      "title": "Risk kapasitesi ve toleransı",
      "intro": "Risk toleransı dalgalanmaya psikolojik yaklaşımını; risk kapasitesi ise kaybı maddi olarak taşıyabilme durumunu anlatır.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Risk toleransı dalgalanmaya psikolojik yaklaşımını; risk kapasitesi ise kaybı maddi olarak taşıyabilme durumunu anlatır. Çok rahat hissetmek, zararını karşılayabileceğin anlamına gelmez."
        },
        {
          "heading": "Karar verirken",
          "text": "Gelir düzeni, yakın ödemeler, borçlar ve acil durum tamponu kapasiteyi etkiler. Uzun vade her kaybı garanti olarak telafi etmez. Kendi koşullarını başkasının kazanç hikâyesiyle eşitleme."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero’da gelecek ödemeler ve mevcut para görünümü kapasiteni düşünmene yardımcı olur; uygulama kişisel risk puanı veya uygunluk değerlendirmesi üretmez. Ürün uygunluğu için nitelikli ve yetkili destek gerekebilir."
        }
      ],
      "example": "İki kişinin 20.000 TL’si olsun. Birinin gelecek ay 18.000 TL zorunlu ödemesi, diğerinin ayrı bir acil fonu varsa aynı bakiyeye rağmen kayıp taşıma kapasiteleri farklıdır. İkisi de dalgalanmayı sevdiğini söylese sonuç değişmez.",
      "pitfall": "Cesur hissetmeyi maddi kapasiteyle aynı sanmak.",
      "steps": [
        "Yakın ödemelerini listele",
        "Gelir kaybı senaryosu düşün",
        "Tolerans ve kapasiteyi ayrı değerlendir"
      ],
      "sources": [
        "risk"
      ],
      "related": [
        "saving-investing",
        "risk"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Aynı bakiye aynı risk kapasitesi midir?",
        "options": [
          "Risk sevmek kapasiteyi sınırsız yapar.",
          "Hayır; yükümlülükler ve tampon değişir.",
          "Evet; yalnız tutar önemlidir."
        ],
        "correct": 1,
        "explanation": "Hayır; yükümlülükler ve tampon değişir. Cesur hissetmeyi maddi kapasiteyle aynı sanmak."
      },
      "group": "Yatırıma hazırlan",
      "moduleId": "preparation",
      "outcomes": [
        "Risk toleransı dalgalanmaya psikolojik yaklaşımını; risk kapasitesi ise kaybı maddi olarak taşıyabilme durumunu anlatır.",
        "Sık karıştırılan noktayı fark etmek: Cesur hissetmeyi maddi kapasiteyle aynı sanmak."
      ]
    },
    {
      "id": "horizon",
      "title": "Yatırım vadesini belirle",
      "intro": "Vade, paraya ne zaman ihtiyacın olacağını anlatır.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Vade, paraya ne zaman ihtiyacın olacağını anlatır. Bir aracın uzun vadeli sayılması, kısa vadede ihtiyacın olan parayı onunla tutmanın uygun olduğunu göstermez."
        },
        {
          "heading": "Karar verirken",
          "text": "Erken satış ihtimali dalgalanmayı gerçek kayba çevirebilir. Uzun bir hedef için de koşullar değiştiğinde planı gözden geçirmek gerekir. Süre tek başına getiriyi garanti etmez."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero’da hedef tarihini yaz ve aylık gerekli katkıyı hesapla. Tarihi olmayan bir hedefte bile paranın hangi koşulda kullanılacağını belirle. Acil durum parasını uzak tarihli hedefle karıştırma."
        }
      ],
      "example": "Bir yıl sonra 30.000 TL eğitim ödemesi yapacaksın. Aracın tanıtımı beş yıllık ufuk varsayıyorsa, senin bir yıllık ihtiyacına göre değerlendirme yapılmalıdır. Beş yıl bekleyemediğinde örnek uzun dönem sonucu senin sonucu açıklamaz.",
      "pitfall": "Kendi ihtiyacın yerine ürünün tanıtım vadesini esas almak.",
      "steps": [
        "Kullanım tarihini belirle",
        "Erken çıkış ihtimalini düşün",
        "Hedef tarihi değişince planı yenile"
      ],
      "sources": [
        "risk"
      ],
      "related": [
        "saving-investing",
        "risk"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Yatırım vadesi öncelikle neye dayanır?",
        "options": [
          "Yalnız ürün reklamına.",
          "Başkasının portföy süresine.",
          "Paraya ne zaman ihtiyaç duyacağına."
        ],
        "correct": 2,
        "explanation": "Paraya ne zaman ihtiyaç duyacağına. Kendi ihtiyacın yerine ürünün tanıtım vadesini esas almak."
      },
      "group": "Yatırıma hazırlan",
      "moduleId": "preparation",
      "outcomes": [
        "Vade, paraya ne zaman ihtiyacın olacağını anlatır.",
        "Sık karıştırılan noktayı fark etmek: Kendi ihtiyacın yerine ürünün tanıtım vadesini esas almak."
      ]
    },
    {
      "id": "liquidity",
      "title": "Likiditeyi anla",
      "intro": "Likidite, bir değeri makul koşullarda nakde çevirebilme kolaylığıdır.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Likidite, bir değeri makul koşullarda nakde çevirebilme kolaylığıdır. Hızlı satılabilmek ile değer kaybetmeden satılabilmek aynı şey değildir. İşlem saati ve ödeme süresi de önemlidir."
        },
        {
          "heading": "Karar verirken",
          "text": "Acil ödeme için yalnız ekranda görünen değere güvenme. Paranın hesaba hangi gün geçtiğini, erken çıkış maliyetini ve alıcı bulunup bulunmayacağını öğren. Büyük tutar küçük tutarla aynı kolaylıkta satılmayabilir."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero yalnız kayıtlı bakiyeleri toplar. Bir varlığın tahmini değerini banka nakdi gibi kabul etme. Ödeme planında gerçekten erişebileceğin hesabı kullan."
        }
      ],
      "example": "100.000 TL tahmini değerli bir eşyanın hemen alıcısı olmayabilir. Bugün 5.000 TL fatura ödemen gerekiyorsa bu tahmini değer faturayı doğrudan karşılamaz. Bir fonun satışı da ürün kurallarına göre sonraki iş günü nakde dönebilir.",
      "pitfall": "Tahmini değeri hemen harcanabilir nakit sanmak.",
      "steps": [
        "Satış ve ödeme süresini öğren",
        "Erken çıkış masrafını kontrol et",
        "Acil ödeme için erişimi planla"
      ],
      "sources": [
        "risk"
      ],
      "related": [
        "saving-investing",
        "risk"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Yüksek değerli varlık mutlaka hemen kullanılabilir para mıdır?",
        "options": [
          "Hayır; nakde dönüş koşulları önemlidir.",
          "Evet, değeri yüksekse.",
          "Yalnız uygulamada görünüyorsa evet."
        ],
        "correct": 0,
        "explanation": "Hayır; nakde dönüş koşulları önemlidir. Tahmini değeri hemen harcanabilir nakit sanmak."
      },
      "group": "Yatırıma hazırlan",
      "moduleId": "preparation",
      "outcomes": [
        "Likidite, bir değeri makul koşullarda nakde çevirebilme kolaylığıdır.",
        "Sık karıştırılan noktayı fark etmek: Tahmini değeri hemen harcanabilir nakit sanmak."
      ]
    },
    {
      "id": "diversification",
      "title": "Çeşitlendirme ne sağlar?",
      "group": "Yatırıma hazırlan",
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
        "fees",
        "saving-investing"
      ],
      "tool": null,
      "minutes": 3,
      "moduleId": "preparation",
      "quiz": {
        "question": "Çeşitlendirme ne sağlar?",
        "options": [
          "Bütün araçların aynı anda yükselmesini sağlar.",
          "Yoğunlaşmayı azaltabilir; tüm kayıp ihtimalini kaldırmaz.",
          "Her kaybı önler."
        ],
        "correct": 1,
        "explanation": "Yoğunlaşmayı azaltabilir; tüm kayıp ihtimalini kaldırmaz. Aynı riski taşıyan çok sayıda ürün, görünüşte çeşitlilik yaratabilir."
      },
      "outcomes": [
        "Birden çok isim almak her zaman farklı risk almak değildir.",
        "Sık karıştırılan noktayı fark etmek: Aynı riski taşıyan çok sayıda ürün, görünüşte çeşitlilik yaratabilir."
      ]
    },
    {
      "id": "fees",
      "title": "Küçük ücretlerin uzun vadeli etkisi",
      "group": "Yatırıma hazırlan",
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
        "purchase",
        "saving-investing",
        "risk"
      ],
      "tool": null,
      "minutes": 3,
      "moduleId": "preparation",
      "quiz": {
        "question": "Yatırım ücretlerinde neden küçük oranlar önemlidir?",
        "options": [
          "Sadece ilk günü etkiler.",
          "Her ücret getiri garantisidir.",
          "Tekrarlanan masraflar uzun vadede toplam sonucu etkiler."
        ],
        "correct": 2,
        "explanation": "Tekrarlanan masraflar uzun vadede toplam sonucu etkiler. Sadece düşük ücret, bir ürünü uygun veya güvenli yapmaz."
      },
      "outcomes": [
        "Getiriyi değerlendirirken net sonucu oluşturan maliyetleri de gör.",
        "Sık karıştırılan noktayı fark etmek: Sadece düşük ücret, bir ürünü uygun veya güvenli yapmaz."
      ]
    },
    {
      "id": "investment-checklist",
      "title": "Yatırım öncesi kontrol",
      "intro": "Bir aracı almadan önce neye sahip olacağını, getirinin kaynağını, kayıp ihtimalini ve çıkış koşullarını açıklayabilmelisin.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Bir aracı almadan önce neye sahip olacağını, getirinin kaynağını, kayıp ihtimalini ve çıkış koşullarını açıklayabilmelisin. Anlaşılmaz olması güvenilirlik göstergesi değildir."
        },
        {
          "heading": "Karar verirken",
          "text": "Yetki, saklama, ücret, vergi ve vade bilgilerini kurumun resmi belgelerinden kontrol et. Kişisel hedefle ürünün amacı örtüşmüyorsa popülerlik tek başına gerekçe olmaz. Kazanç ve kayıp senaryolarını birlikte düşün."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero Akademisi kavram öğretir; ürün seçimi veya otomatik alım yapmaz. Bir karar notuna neden aldığını, hangi koşulda gözden geçireceğini ve göze aldığın kaybı yazabilirsin."
        }
      ],
      "example": "Bir araç %20 örnek getiri gösteriyor ancak zarar senaryosu ve ücretleri açıklanmıyor. 10.000 TL yatırmanın yalnız 12.000 TL olabileceğini değil, daha düşük tutara inebileceğini de değerlendirmelisin. Örnek getiri taahhüt değildir.",
      "pitfall": "Ürünü açıklayamadan yalnız beklenen kazanca odaklanmak.",
      "steps": [
        "Getirinin kaynağını yaz",
        "Yetki ve ücretleri doğrula",
        "Çıkış koşulunu öğren"
      ],
      "sources": [
        "risk"
      ],
      "related": [
        "saving-investing",
        "risk"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Alımdan önce hangi bilgiler birlikte gerekir?",
        "options": [
          "Getiri, risk, ücret ve çıkış koşulları.",
          "Yalnız son ayın getirisi.",
          "Yalnız sosyal medya yorumları."
        ],
        "correct": 0,
        "explanation": "Getiri, risk, ücret ve çıkış koşulları. Ürünü açıklayamadan yalnız beklenen kazanca odaklanmak."
      },
      "group": "Yatırıma hazırlan",
      "moduleId": "preparation",
      "outcomes": [
        "Bir aracı almadan önce neye sahip olacağını, getirinin kaynağını, kayıp ihtimalini ve çıkış koşullarını açıklayabilmelisin.",
        "Sık karıştırılan noktayı fark etmek: Ürünü açıklayamadan yalnız beklenen kazanca odaklanmak."
      ]
    },
    {
      "id": "stocks",
      "title": "Hisse senedini tanı",
      "intro": "Hisse bir şirkette ortaklık payını temsil eder.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Hisse bir şirkette ortaklık payını temsil eder. Kazanç yalnız fiyat artışından değil, dağıtılırsa temettüden de gelebilir. Fiyat ve temettü garanti değildir; zarar ve sermaye kaybı mümkündür."
        },
        {
          "heading": "Karar verirken",
          "text": "Şirketin ürününü sevmek finansal durumunu analiz etmekle aynı şey değildir. Şirket bilgileri, borçluluk, kârlılık ve fiyatın hangi beklentileri yansıttığı önemlidir. Tek şirkete ağırlık vermek yoğunlaşma yaratır."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero hisse fiyatı çekmez veya portföy değerlemez. Eğitim örneğini bütçeyle karıştırma. Hisse alımı tüketim gideri değil, varlık edinimi olarak düşünülmelidir; kişisel kayıt yöntemini tutarlı belirle."
        }
      ],
      "example": "100 TL’den 10 pay alırsan başlangıç tutarı 1.000 TL’dir. Fiyat 80 TL’ye düşerse piyasa değeri 800 TL olur, ücretler hariç 200 TL düşüş yaşanır. Henüz satmamış olmak değer kaybı riskinin yok olduğu anlamına gelmez.",
      "pitfall": "Tanınmış şirketin hissesinin zarar ettirmeyeceğini düşünmek.",
      "steps": [
        "Ortaklık kavramını açıkla",
        "Şirketin resmi bilgilerini incele",
        "Yoğunlaşma riskini düşün"
      ],
      "sources": [
        "stocks"
      ],
      "related": [
        "bonds",
        "funds"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Hisse neyi temsil eder?",
        "options": [
          "Şirketin sana sabit borcunu.",
          "Şirkette ortaklık payını.",
          "Bankanın garantili mevduatını."
        ],
        "correct": 1,
        "explanation": "Şirkette ortaklık payını. Tanınmış şirketin hissesinin zarar ettirmeyeceğini düşünmek."
      },
      "group": "Yatırım araçları",
      "moduleId": "products",
      "outcomes": [
        "Hisse bir şirkette ortaklık payını temsil eder.",
        "Sık karıştırılan noktayı fark etmek: Tanınmış şirketin hissesinin zarar ettirmeyeceğini düşünmek."
      ]
    },
    {
      "id": "bonds",
      "title": "Tahvil ve bonoyu tanı",
      "intro": "Borçlanma araçlarında yatırımcı ihraççıya belirli koşullarla kaynak sağlar.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Borçlanma araçlarında yatırımcı ihraççıya belirli koşullarla kaynak sağlar. Vade, kupon veya iskontolu fiyat ve ihraççının ödeme gücü önemlidir. Borç aracı olması risksiz olduğu anlamına gelmez."
        },
        {
          "heading": "Karar verirken",
          "text": "Piyasa fiyatı faiz ve risk koşullarıyla değişebilir. Vadeden önce satmak başlangıçtaki tutarla aynı sonucu vermeyebilir. Para birimi ve enflasyon da gerçek sonucu etkiler."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero’nun borç ödeme planı ile yatırım olarak tahvil almak farklıdır. Ders, tüketici kredisi hesabı değil yatırım aracı kavramıdır. İhraç belgesini ve ödeme şartlarını okumadan yalnız oranı kıyaslama."
        }
      ],
      "example": "Vade sonunda 10.000 TL ödemesi planlanan aracı bugün 9.500 TL’ye alırsan sözleşmedeki ödeme yapılırsa brüt fark 500 TL olur. Erken satış fiyatı farklı olabilir; ihraççı ödeyemezse örnekteki sonuç gerçekleşmeyebilir.",
      "pitfall": "Sabit ödeme vaadini kesin ve risksiz ödeme sanmak.",
      "steps": [
        "İhraççıyı öğren",
        "Vade ve ödeme koşullarını oku",
        "Erken satış riskini düşün"
      ],
      "sources": [
        "bonds"
      ],
      "related": [
        "stocks",
        "funds"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Bir tahvil neden yine risk taşır?",
        "options": [
          "Borç aracı hiç risk taşımaz.",
          "Yalnız adı bono ise risk vardır.",
          "İhraççı ödeme yapamayabilir ve piyasa fiyatı değişebilir."
        ],
        "correct": 2,
        "explanation": "İhraççı ödeme yapamayabilir ve piyasa fiyatı değişebilir. Sabit ödeme vaadini kesin ve risksiz ödeme sanmak."
      },
      "group": "Yatırım araçları",
      "moduleId": "products",
      "outcomes": [
        "Borçlanma araçlarında yatırımcı ihraççıya belirli koşullarla kaynak sağlar.",
        "Sık karıştırılan noktayı fark etmek: Sabit ödeme vaadini kesin ve risksiz ödeme sanmak."
      ]
    },
    {
      "id": "funds",
      "title": "Yatırım fonlarını tanı",
      "intro": "Yatırım fonu, farklı yatırımcıların kaynaklarını bir portföy içinde toplar.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Yatırım fonu, farklı yatırımcıların kaynaklarını bir portföy içinde toplar. Katılma payı fonun portföyüne bağlı ekonomik sonuç taşır. Fon türleri aynı risk, vade veya içerikte değildir."
        },
        {
          "heading": "Karar verirken",
          "text": "Fonun adına ek olarak stratejisini, risklerini, giderlerini ve alım/satım zamanlarını incele. Çok sayıda varlık içermesi her fonu yeterince çeşitlendirilmiş yapmaz. Aynı sektör veya aynı risk faktörü baskın olabilir."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero yalnız manuel bütçe kayıtlarını izler. Fonun günlük fiyatını ve satış sonrası hesaba geçiş zamanını kurum belgesinden kontrol et. Fon getirisini banka hesabına gerçekten geçmeden maaş gibi yazma."
        }
      ],
      "example": "İki fondan biri kısa vadeli borçlanma araçlarına, diğeri tek sektör hisselerine ağırlık veriyorsa ikisinin de fon olması aynı risk taşıdıklarını göstermez. Kendi kullanım tarihin ve kayıp kapasitenle birlikte değerlendir.",
      "pitfall": "Bütün fonları aynı veya garantili ürün kabul etmek.",
      "steps": [
        "Fonun portföy türünü oku",
        "Gider ve işlem zamanını öğren",
        "Hedefinle uyumunu değerlendir"
      ],
      "sources": [
        "funds"
      ],
      "related": [
        "stocks",
        "bonds"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Fon seçerken yalnız adı yeterli midir?",
        "options": [
          "Hayır; strateji, risk ve masraflar da gerekir.",
          "Evet, bütün fonlar benzerdir.",
          "Yalnız en kısa isim yeterlidir."
        ],
        "correct": 0,
        "explanation": "Hayır; strateji, risk ve masraflar da gerekir. Bütün fonları aynı veya garantili ürün kabul etmek."
      },
      "group": "Yatırım araçları",
      "moduleId": "products",
      "outcomes": [
        "Yatırım fonu, farklı yatırımcıların kaynaklarını bir portföy içinde toplar.",
        "Sık karıştırılan noktayı fark etmek: Bütün fonları aynı veya garantili ürün kabul etmek."
      ]
    },
    {
      "id": "etfs",
      "title": "Borsa yatırım fonları",
      "intro": "Borsa yatırım fonunun payları borsada işlem görür.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Borsa yatırım fonunun payları borsada işlem görür. Bir endeksi izleyen fon olabilir; ancak her fonun aynı stratejide olduğu varsayılmamalıdır. Dayanak varlıklar ve izleme yöntemi önemlidir."
        },
        {
          "heading": "Karar verirken",
          "text": "Alım/satım fiyat farkı, komisyon, fon gideri ve likidite maliyeti etkiler. Yabancı para veya yabancı piyasa koşulları ek riskler yaratabilir. Kaldıraçlı veya ters ürünlerin yapısı temel endeks fonundan farklı olabilir."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero aracılık veya piyasa verisi sağlamaz. Bir ETF’yi öğrenmek, onu almak için otomatik öneri değildir. Ürün belgesinde neyi izlediğini, ücretini ve risklerini doğrula."
        }
      ],
      "example": "Fonun iç varlık değerine yakın teorik değeri 100 TL iken alış fiyatı 101, satış fiyatı 99 TL olsun. Fiyat farkı ve komisyon nedeniyle anında alıp satmanın maliyeti olabilir; fonun yıllık gideri bunun ayrı bir unsurudur.",
      "pitfall": "ETF etiketinin tek başına düşük maliyet veya düşük risk garantisi olduğunu sanmak.",
      "steps": [
        "Dayanak portföyü öğren",
        "Alış/satış farkını kontrol et",
        "Ürün giderlerini oku"
      ],
      "sources": [
        "etf"
      ],
      "related": [
        "stocks",
        "bonds"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "ETF’de hangi maliyetler birlikte düşünülebilir?",
        "options": [
          "Hiç maliyet yoktur.",
          "Fon gideri, komisyon ve alış/satış farkı.",
          "Yalnız fonun adı."
        ],
        "correct": 1,
        "explanation": "Fon gideri, komisyon ve alış/satış farkı. ETF etiketinin tek başına düşük maliyet veya düşük risk garantisi olduğunu sanmak."
      },
      "group": "Yatırım araçları",
      "moduleId": "products",
      "outcomes": [
        "Borsa yatırım fonunun payları borsada işlem görür.",
        "Sık karıştırılan noktayı fark etmek: ETF etiketinin tek başına düşük maliyet veya düşük risk garantisi olduğunu sanmak."
      ]
    },
    {
      "id": "gold",
      "title": "Altını değerlendirirken",
      "intro": "Altın fiziksel veya farklı finansal ürün biçimlerinde takip edilebilir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Altın fiziksel veya farklı finansal ürün biçimlerinde takip edilebilir. Fiyat dalgalanması, kur etkisi ve ürünün özel koşulları sonuçları değiştirir. Sürekli yükseliş veya kısa vadeli koruma garantisi yoktur."
        },
        {
          "heading": "Karar verirken",
          "text": "Fiziksel üründe işçilik, saflık, saklama ve alış/satış farkı önemlidir. Hesap veya fon aracılığıyla tutulan ürünün saklama, ücret ve karşı taraf koşulları farklı olabilir. Her altın ürünü aynı şey değildir."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero altın fiyatı çekmez. Alım bedelini gelecekte kesin değer gibi kullanma. Yüksek işçilikli bir ürünü yatırım amacıyla değerlendirirken yeniden satış koşulunu öğren."
        }
      ],
      "example": "Bir ürünü 10.000 TL’ye alıp aynı gün 9.500 TL’ye satabiliyorsan 500 TL fiyat farkı maliyeti vardır. Piyasa yükselse bile bu farkın kapanması gerekir; taşıma ve saklama maliyetleri ayrıca olabilir.",
      "pitfall": "Altını her vadede zarar etmeyen bir araç kabul etmek.",
      "steps": [
        "Ürün biçimini belirle",
        "Alış/satış farkını öğren",
        "Saklama ve ücret koşullarını kontrol et"
      ],
      "sources": [
        "risk"
      ],
      "related": [
        "stocks",
        "bonds"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Altın alımında yalnız fiyat artışı yeterli değerlendirme mi?",
        "options": [
          "Evet, başka maliyet yoktur.",
          "Sadece takıysa yeterlidir.",
          "Hayır; fark, ücret ve ürün biçimi de önemlidir."
        ],
        "correct": 2,
        "explanation": "Hayır; fark, ücret ve ürün biçimi de önemlidir. Altını her vadede zarar etmeyen bir araç kabul etmek."
      },
      "group": "Yatırım araçları",
      "moduleId": "products",
      "outcomes": [
        "Altın fiziksel veya farklı finansal ürün biçimlerinde takip edilebilir.",
        "Sık karıştırılan noktayı fark etmek: Altını her vadede zarar etmeyen bir araç kabul etmek."
      ]
    },
    {
      "id": "fx-investment",
      "title": "Dövizi yatırım gibi değerlendir",
      "intro": "Döviz başka bir para birimidir; yerel para karşısında fiyatı değişebilir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Döviz başka bir para birimidir; yerel para karşısında fiyatı değişebilir. O para biriminde gelecekte ödemen varsa kullanım amacı, yalnız kur kazancı aramaktan farklıdır."
        },
        {
          "heading": "Karar verirken",
          "text": "Kurun yükselmesi tüm yatırımın gerçek kazancını açıklamaz. Alış/satış farkı, ürün getirisi, kesintiler ve kendi harcamalarının para birimi birlikte değerlendirilir. Kur düşüşü de mümkündür."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero döviz hesabının tutarını kendi para biriminde tutar. Ana para toplamı manuel kurla değişebilir; eski gelir/gider raporları kayıt anındaki kuru korur. Kur değişimi yeni maaş değildir."
        }
      ],
      "example": "100 USD’yi 30 TL kurla aldığında 3.000 TL ödersin. 35 TL varsayımında karşılığı 3.500 TL olur; fark 500 TL’dir, işlem maliyetleri hariç. USD bakiyen hâlâ 100’dür; kur farkı hesaba ek 100 USD getirmez.",
      "pitfall": "Ana para karşılığı artışını döviz hesabına yeni birim eklenmiş gibi düşünmek.",
      "steps": [
        "Hedef para birimini yaz",
        "Her hesabın birimini koru",
        "Kur ve ücret etkisini ayır"
      ],
      "sources": [
        "risk"
      ],
      "related": [
        "stocks",
        "bonds"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Kur değişince 100 USD bakiyen kaç USD olur?",
        "options": [
          "Başka işlem yoksa 100 USD.",
          "Kur artışı kadar USD eklenir.",
          "Otomatik TL’ye çevrilir."
        ],
        "correct": 0,
        "explanation": "Başka işlem yoksa 100 USD. Ana para karşılığı artışını döviz hesabına yeni birim eklenmiş gibi düşünmek."
      },
      "group": "Yatırım araçları",
      "moduleId": "products",
      "outcomes": [
        "Döviz başka bir para birimidir; yerel para karşısında fiyatı değişebilir.",
        "Sık karıştırılan noktayı fark etmek: Ana para karşılığı artışını döviz hesabına yeni birim eklenmiş gibi düşünmek."
      ]
    },
    {
      "id": "real-estate",
      "title": "Gayrimenkulün toplam resmi",
      "intro": "Gayrimenkulün satış fiyatı kadar bakım, sigorta, finansman, boş kalma ve işlem maliyetleri de önemlidir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Gayrimenkulün satış fiyatı kadar bakım, sigorta, finansman, boş kalma ve işlem maliyetleri de önemlidir. Kira geliri brüt tutarla net kazanç arasında fark bırakabilir."
        },
        {
          "heading": "Karar verirken",
          "text": "Varlığın nakde çevrilmesi zaman alabilir. Tek mülke yoğunlaşma, bölge ve kiracı riskleri doğurabilir. Geçmiş fiyat artışı gelecekte aynı sonucu garanti etmez. Güncel vergi ve hukuki koşullar ayrı doğrulanmalıdır."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero gayrimenkul değerlemesi yapmaz. Gerçekleşen kira gelirini ve masrafları ayrı kaydet. Tahmini ev değerini günlük banka bakiyesiyle karıştırma; kullanım için gereken nakit erişimini ayrı planla."
        }
      ],
      "example": "Aylık 10.000 TL kira 12 ay dolu kaldığında 120.000 TL brüt tutar yapar. İki ay boşluk ve 15.000 TL masraf varsa bu sade senaryoda 85.000 TL kalır; finansman, vergi ve diğer koşullar ayrıca etkiler.",
      "pitfall": "Brüt kira tutarını bütün maliyetlerden arınmış kazanç saymak.",
      "steps": [
        "Boş kalma senaryosu kur",
        "Bakım ve finansmanı ekle",
        "Nakde dönüş süresini düşün"
      ],
      "sources": [
        "risk"
      ],
      "related": [
        "stocks",
        "bonds"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Kira geliri değerlendirmesinde hangisi gerekir?",
        "options": [
          "Yalnız evin oda sayısı.",
          "Boşluk ve masraflar dahil toplam sonuç.",
          "Yalnız ilan edilen kira."
        ],
        "correct": 1,
        "explanation": "Boşluk ve masraflar dahil toplam sonuç. Brüt kira tutarını bütün maliyetlerden arınmış kazanç saymak."
      },
      "group": "Yatırım araçları",
      "moduleId": "products",
      "outcomes": [
        "Gayrimenkulün satış fiyatı kadar bakım, sigorta, finansman, boş kalma ve işlem maliyetleri de önemlidir.",
        "Sık karıştırılan noktayı fark etmek: Brüt kira tutarını bütün maliyetlerden arınmış kazanç saymak."
      ]
    },
    {
      "id": "bes",
      "title": "BES’i tanı",
      "intro": "Bireysel emeklilik sistemi uzun vadeli birikimi emeklilik fonlarıyla destekleyen bir yapıdır.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Bireysel emeklilik sistemi uzun vadeli birikimi emeklilik fonlarıyla destekleyen bir yapıdır. Fon seçimi, kesintiler, sözleşme ve sistemden çıkış koşulları sonucu etkiler. Sosyal güvenlik sisteminin bire bir yerine geçmez."
        },
        {
          "heading": "Karar verirken",
          "text": "Devlet katkısı ve hak kazanma koşulları değişebileceğinden güncel EGM bilgilerini kontrol et. Katkının tamamını her tarihte serbest banka parası gibi düşünme. Fon getirileri garanti değildir."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero BES sözleşmesi veya fon alımı yönetmez. Ödemeni kişisel nakit planında izleyebilirsin; bu plan resmi BES bakiyesini hesaplamaz. Uygulamada görünen rezerv ile şirketindeki birikimi ayır."
        }
      ],
      "example": "Her ay 1.000 TL katkı düşünüyorsun. Yıllık kendi ödemelerin 12.000 TL olur. Fon değeri, kesintiler ve hak kazanılmış katkılarla ulaşılabilir tutar farklı olabilir; bu örnek güncel devlet katkısı oranı veya çıkış koşulu içermez.",
      "pitfall": "BES ekranındaki bütün tutarı bugün koşulsuz çekilebilir para sanmak.",
      "steps": [
        "EGM rehberini oku",
        "Fon ve kesintileri öğren",
        "Sözleşmendeki çıkış koşullarını kontrol et"
      ],
      "sources": [
        "bes"
      ],
      "related": [
        "stocks",
        "bonds"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "BES’te ekrandaki tutarın tamamı her zaman serbest nakit midir?",
        "options": [
          "Evet, bütün koşullarda.",
          "Yalnız uygulamada rezerv yaparsan evet.",
          "Hayır; hak kazanma ve sözleşme koşulları vardır."
        ],
        "correct": 2,
        "explanation": "Hayır; hak kazanma ve sözleşme koşulları vardır. BES ekranındaki bütün tutarı bugün koşulsuz çekilebilir para sanmak."
      },
      "group": "Yatırım araçları",
      "moduleId": "products",
      "outcomes": [
        "Bireysel emeklilik sistemi uzun vadeli birikimi emeklilik fonlarıyla destekleyen bir yapıdır.",
        "Sık karıştırılan noktayı fark etmek: BES ekranındaki bütün tutarı bugün koşulsuz çekilebilir para sanmak."
      ]
    },
    {
      "id": "crypto-risk",
      "title": "Kripto varlıkların riskleri",
      "intro": "Kripto varlıklarda yüksek fiyat oynaklığı, platform, saklama, teknik hata ve dolandırıcılık riskleri olabilir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Kripto varlıklarda yüksek fiyat oynaklığı, platform, saklama, teknik hata ve dolandırıcılık riskleri olabilir. Platformun çalışıyor olması veya sosyal medyada yaygınlığı bütün riskleri ortadan kaldırmaz."
        },
        {
          "heading": "Karar verirken",
          "text": "Şifreli anahtar ve hesap erişiminin kaybı ciddi sonuçlar doğurabilir. İşlemin geri alınabilirliği, saklama biçimi ve karşı tarafı öğren. Düzenleyici konum, bütün ürünlerde fiyat veya kayıp garantisi anlamına gelmez."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero kripto cüzdanı, alım platformu veya anahtar saklama uygulaması değildir. Anahtar ya da kurtarma kelimelerini not/fiş içine yazma. Bu ders ürün tavsiyesi veya güncel hukuki uygunluk değerlendirmesi sunmaz."
        }
      ],
      "example": "Bir varlık %50 düşerse 10.000 TL karşılığı 5.000 TL olur. Yeniden 10.000 TL’ye ulaşması için kalan değer üzerinden %100 artış gerekir. Yüksek getirili bir örnek bu kayıp aritmetiğini değiştirmez.",
      "pitfall": "Platform veya tanınmış kişi nedeniyle kaybın garantiyle karşılanacağını varsaymak.",
      "steps": [
        "Saklama yöntemini öğren",
        "Kayıp senaryosu kur",
        "Hukuki ve teknik bilgiyi resmi kaynakta doğrula"
      ],
      "sources": [
        "risk"
      ],
      "related": [
        "stocks",
        "bonds"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "%50 düşüşten eski değere dönüş için ne gerekir?",
        "options": [
          "Kalan değer üzerinden %100 artış.",
          "%50 artış yeterlidir.",
          "Hiç artış gerekmez."
        ],
        "correct": 0,
        "explanation": "Kalan değer üzerinden %100 artış. Platform veya tanınmış kişi nedeniyle kaybın garantiyle karşılanacağını varsaymak."
      },
      "group": "Yatırım araçları",
      "moduleId": "products",
      "outcomes": [
        "Kripto varlıklarda yüksek fiyat oynaklığı, platform, saklama, teknik hata ve dolandırıcılık riskleri olabilir.",
        "Sık karıştırılan noktayı fark etmek: Platform veya tanınmış kişi nedeniyle kaybın garantiyle karşılanacağını varsaymak."
      ]
    },
    {
      "id": "regular-investing",
      "title": "Düzenli yatırımın mantığı",
      "intro": "Belirli aralıklarla yatırım yapmak karar sürecini düzenleyebilir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Belirli aralıklarla yatırım yapmak karar sürecini düzenleyebilir. Farklı fiyatlardan alım ortalama maliyeti etkiler; ancak zarar ihtimalini kaldırmaz veya her durumda en iyi sonucu garanti etmez."
        },
        {
          "heading": "Karar verirken",
          "text": "Tutar, ürün, ücret ve süre birlikte değerlendirilir. Küçük alımlarda sabit ücret oran olarak büyük kalabilir. Gelirin ve zorunlu ödemelerin uygun değilse takvime uymak için borçlanmayı otomatik çözüm sayma."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero düzenli işlem kaydıyla katkı tarihlerini izleyebilir; bu bankada veya aracı kurumda otomatik alım emri değildir. Gerçek alım bilgileri kurum kaydında doğrulanır."
        }
      ],
      "example": "İlk ay 100 TL fiyattan 1.000 TL ile 10 birim, ikinci ay 50 TL’den 1.000 TL ile 20 birim alırsan toplam 30 birime 2.000 TL ödemiş olursun. Ortalama birim maliyet yaklaşık 66,67 TL’dir; sonraki fiyatın ne olacağı bilinmez.",
      "pitfall": "Düzenli alımın kesin kâr sağladığını düşünmek.",
      "steps": [
        "Katkı kapasitesini belirle",
        "Birim ve ücretleri takip et",
        "Getiri garantisi olmadığını hatırla"
      ],
      "sources": [
        "save"
      ],
      "related": [
        "long-term",
        "timing"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Düzenli yatırım neyi garanti etmez?",
        "options": [
          "Kayıt düzeni kurmayı.",
          "Kâr veya kayıpsız sonuç.",
          "Birden çok alım tarihini."
        ],
        "correct": 1,
        "explanation": "Kâr veya kayıpsız sonuç. Düzenli alımın kesin kâr sağladığını düşünmek."
      },
      "group": "Yatırım davranışları",
      "moduleId": "behavior",
      "outcomes": [
        "Belirli aralıklarla yatırım yapmak karar sürecini düzenleyebilir.",
        "Sık karıştırılan noktayı fark etmek: Düzenli alımın kesin kâr sağladığını düşünmek."
      ]
    },
    {
      "id": "long-term",
      "title": "Uzun vadeli düşünmek",
      "intro": "Uzun vadeli plan kararlarını günlük haberlerden ayrı değerlendirmeye yardım edebilir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Uzun vadeli plan kararlarını günlük haberlerden ayrı değerlendirmeye yardım edebilir. Ancak uzun süre elde tutmak, her aracın değer kazanacağı garantisi değildir. Araç ve hedef hâlâ önemlidir."
        },
        {
          "heading": "Karar verirken",
          "text": "Planı gözden geçirmek ile her haber üzerine değiştirmek farklıdır. Gelir, vade veya ürünün temel koşulları değiştiğinde değerlendirme yapılabilir. Hiç bakmamak da sürekli işlem yapmak kadar sorun yaratabilir."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero’da hedef tarihi ve düzenli kontrol notları tut. Eğitim örneğinde sabit büyüme hesaplamak, piyasada aynı büyümenin her yıl gerçekleşeceği anlamına gelmez."
        }
      ],
      "example": "Beş yıllık hedef için plan yaptıktan sonra üç ay sonra paraya ihtiyaç duyacağını öğrenirsen başlangıçtaki vade değişmiştir. Yeni ihtiyacı görmezden gelip yalnız uzun vadeli olduğun için aynı düzeni sürdürmek gerekmez.",
      "pitfall": "Uzun vadenin bütün yanlış kararları kendiliğinden düzelteceğini sanmak.",
      "steps": [
        "Hedef tarihini yaz",
        "Kontrol aralığı belirle",
        "Koşul değişikliklerini değerlendir"
      ],
      "sources": [
        "risk"
      ],
      "related": [
        "regular-investing",
        "timing"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Uzun vade tek başına neyi sağlamaz?",
        "options": [
          "Hedef için süre belirlemeyi.",
          "Plan yapabilmeyi.",
          "Her aracın kazandıracağı garantisini."
        ],
        "correct": 2,
        "explanation": "Her aracın kazandıracağı garantisini. Uzun vadenin bütün yanlış kararları kendiliğinden düzelteceğini sanmak."
      },
      "group": "Yatırım davranışları",
      "moduleId": "behavior",
      "outcomes": [
        "Uzun vadeli plan kararlarını günlük haberlerden ayrı değerlendirmeye yardım edebilir.",
        "Sık karıştırılan noktayı fark etmek: Uzun vadenin bütün yanlış kararları kendiliğinden düzelteceğini sanmak."
      ]
    },
    {
      "id": "timing",
      "title": "Piyasayı zamanlama çabası",
      "intro": "En düşük fiyattan alıp en yüksekten satmak geriye bakıldığında kolay görünebilir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "En düşük fiyattan alıp en yüksekten satmak geriye bakıldığında kolay görünebilir. Karar anında gelecekteki fiyat bilinmez. Başarılı birkaç örnek bütün denemelerin sonucunu göstermez."
        },
        {
          "heading": "Karar verirken",
          "text": "Sık işlem ücret, zaman ve davranış baskısı doğurur. Başarı oranı kadar yanlış kararın büyüklüğü de önemlidir. Kesin tarih veya fiyat iddialarını bağımsız kanıt olmadan doğru kabul etme."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero fiyat tahmini veya al/sat sinyali üretmez. Bir finans kararının nedenini ve maliyetini not alabilir; sonucu karar anındaki bilgiyle değerlendirebilirsin."
        }
      ],
      "example": "Üç küçük işlemden 100’er TL kazanıp bir işlemde 600 TL kaybettiğinde ücretler hariç sonuç −300 TL’dir. Dört işlemden üçünün başarılı olması toplam kârı garanti etmemiştir.",
      "pitfall": "Yüksek doğru tahmin sayısını mutlaka pozitif toplam sonuç saymak.",
      "steps": [
        "Bütün işlemleri birlikte değerlendir",
        "Ücretleri ekle",
        "Karar anındaki bilgiye bak"
      ],
      "sources": [
        "risk"
      ],
      "related": [
        "regular-investing",
        "long-term"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Örnekte üç kazanç ve bir kayıp sonucu nedir?",
        "options": [
          "−300 TL, ücretler hariç.",
          "+300 TL.",
          "Başarı sayısı fazla olduğu için kesin kâr."
        ],
        "correct": 0,
        "explanation": "−300 TL, ücretler hariç. Yüksek doğru tahmin sayısını mutlaka pozitif toplam sonuç saymak."
      },
      "group": "Yatırım davranışları",
      "moduleId": "behavior",
      "outcomes": [
        "En düşük fiyattan alıp en yüksekten satmak geriye bakıldığında kolay görünebilir.",
        "Sık karıştırılan noktayı fark etmek: Yüksek doğru tahmin sayısını mutlaka pozitif toplam sonuç saymak."
      ]
    },
    {
      "id": "fomo",
      "title": "FOMO’yu fark et",
      "intro": "FOMO fırsatı kaçırma korkusudur.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "FOMO fırsatı kaçırma korkusudur. Başkalarının hızlı kazanç paylaşımı acele karar baskısı yaratabilir. Görünen kazançların seçilmiş örnekler olabileceğini ve kayıpların daha az paylaşılabileceğini düşün."
        },
        {
          "heading": "Karar verirken",
          "text": "Karar öncesi kendi hedef, vade ve kayıp kapasiteni yeniden yaz. Fırsatın neden sana uygun olduğunu açıklayamıyorsan yalnız kaçırma korkusu yeterli gerekçe değildir. Borç veya acil para kullanmak riski büyütebilir."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero’daki mevcut para ile beklenen gelir ayrımı, henüz elinde olmayan parayı riskli karara ayırmaman için yardımcıdır. Başkasının paylaşımı kendi nakit planını değiştirmesin."
        }
      ],
      "example": "Bir ürün son hafta %30 yükseldi diye gelecekte de aynı hızla gideceğini varsayıyorsun. O artış geçmişteki fiyat hareketidir. Gelecek ayki kira için ayırdığın 10.000 TL ile acele karar, ihtiyaç ve risk açısından ayrıca değerlendirilmelidir.",
      "pitfall": "Geçmişteki hızlı artışı gelecekteki garantili fırsat sanmak.",
      "steps": [
        "Karara bekleme süresi koy",
        "Gerekçeni yaz",
        "Yakın ödemelerine dokunma"
      ],
      "sources": [
        "risk"
      ],
      "related": [
        "regular-investing",
        "long-term"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Son haftanın yüksek getirisi geleceği garanti eder mi?",
        "options": [
          "Yalnız herkes konuşuyorsa eder.",
          "Hayır.",
          "Evet, yükseliş sürmek zorundadır."
        ],
        "correct": 1,
        "explanation": "Hayır. Geçmişteki hızlı artışı gelecekteki garantili fırsat sanmak."
      },
      "group": "Yatırım davranışları",
      "moduleId": "behavior",
      "outcomes": [
        "FOMO fırsatı kaçırma korkusudur.",
        "Sık karıştırılan noktayı fark etmek: Geçmişteki hızlı artışı gelecekteki garantili fırsat sanmak."
      ]
    },
    {
      "id": "herd",
      "title": "Sürü davranışını tanı",
      "intro": "Çok kişinin aynı yönde hareket etmesi, o kararın sana uygun veya doğru olduğunu kanıtlamaz.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Çok kişinin aynı yönde hareket etmesi, o kararın sana uygun veya doğru olduğunu kanıtlamaz. Sosyal kanıt bir karar ipucudur; ürün analizi yerine geçmez."
        },
        {
          "heading": "Karar verirken",
          "text": "Bir gruptaki kişiler aynı kaynaktan etkileniyor olabilir. Farklı seslerin sayısı, bağımsız kanıt sayısıyla aynı değildir. Karşı görüşleri ve olası çıkar ilişkilerini de incele."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero Akademisi kavramları anlamanı amaçlar. Bir topluluğun tavsiyesini bütçe planına doğrudan aktarırken kendi yükümlülüklerini, vade ve zarar kapasiteni tekrar kontrol et."
        }
      ],
      "example": "On hesap aynı kaynağın yatırım iddiasını yeniden paylaşmış olabilir. On paylaşım on bağımsız araştırma değildir. Kaynak zincirini izlemek, aynı iddianın büyütülmesini gerçek doğrulamayla ayırır.",
      "pitfall": "Popülerliği bağımsız doğrulama saymak.",
      "steps": [
        "İlk kaynağı bul",
        "Karşı görüşleri incele",
        "Kendi hedefini tekrar yaz"
      ],
      "sources": [
        "fraud"
      ],
      "related": [
        "regular-investing",
        "long-term"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "On tekrar paylaşım neyi kanıtlamaz?",
        "options": [
          "İddianın çok yayıldığını.",
          "Birden fazla kişinin gördüğünü.",
          "On bağımsız doğrulama olduğunu."
        ],
        "correct": 2,
        "explanation": "On bağımsız doğrulama olduğunu. Popülerliği bağımsız doğrulama saymak."
      },
      "group": "Yatırım davranışları",
      "moduleId": "behavior",
      "outcomes": [
        "Çok kişinin aynı yönde hareket etmesi, o kararın sana uygun veya doğru olduğunu kanıtlamaz.",
        "Sık karıştırılan noktayı fark etmek: Popülerliği bağımsız doğrulama saymak."
      ]
    },
    {
      "id": "past-returns",
      "title": "Geçmiş getiriyi yorumla",
      "intro": "Geçmiş getiri belirli bir dönemde gerçekleşen sonuçtur, gelecek için garanti değildir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Geçmiş getiri belirli bir dönemde gerçekleşen sonuçtur, gelecek için garanti değildir. Dönemin başlangıcı, sonu, para birimi ve masraflar kıyası değiştirebilir."
        },
        {
          "heading": "Karar verirken",
          "text": "Sadece en iyi ayı göstermek yanıltıcı olabilir. Kayıp dönemleri, dalgalanma ve karşılaştırılan aracın riskini incele. Getiri yüzdesinin brüt mü net mi, fiyat mı toplam getiri mi olduğunu öğren."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero raporundaki gelir/gider eğrisi yatırım performansı değildir. Birikim hesabına yatırdığın yeni para, yatırımın kendi kazancıyla karıştırılmamalıdır."
        }
      ],
      "example": "Araç ilk yıl %50 artıp ikinci yıl %50 düşerse 10.000 TL önce 15.000, sonra 7.500 TL olur. Yüzdeleri toplayıp sıfır değişim demek yanlıştır; her dönem farklı tabana uygulanır.",
      "pitfall": "Farklı dönem yüzdelerini doğrudan toplayarak toplam sonucu bulmak.",
      "steps": [
        "Aynı dönemleri karşılaştır",
        "Katkı ile getiriyi ayır",
        "Masrafları ve kayıp dönemlerini kontrol et"
      ],
      "sources": [
        "risk"
      ],
      "related": [
        "regular-investing",
        "long-term"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "%50 artış ardından %50 düşüş başlangıca döndürür mü?",
        "options": [
          "Hayır; örnekte 7.500 TL kalır.",
          "Evet, yüzdeler sıfırlanır.",
          "Sonuç 15.000 TL kalır."
        ],
        "correct": 0,
        "explanation": "Hayır; örnekte 7.500 TL kalır. Farklı dönem yüzdelerini doğrudan toplayarak toplam sonucu bulmak."
      },
      "group": "Yatırım davranışları",
      "moduleId": "behavior",
      "outcomes": [
        "Geçmiş getiri belirli bir dönemde gerçekleşen sonuçtur, gelecek için garanti değildir.",
        "Sık karıştırılan noktayı fark etmek: Farklı dönem yüzdelerini doğrudan toplayarak toplam sonucu bulmak."
      ]
    },
    {
      "id": "portfolio-review",
      "title": "Portföyü gözden geçir",
      "intro": "Portföyü gözden geçirmek, sahip olduklarının hedef, risk ve vade ile hâlâ uyumlu olup olmadığını değerlendirmektir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Portföyü gözden geçirmek, sahip olduklarının hedef, risk ve vade ile hâlâ uyumlu olup olmadığını değerlendirmektir. Her fiyat değişiminde işlem yapmak anlamına gelmez."
        },
        {
          "heading": "Karar verirken",
          "text": "Bir varlığın yükselmesi toplam içindeki ağırlığını büyütebilir. Birden çok fonda aynı şirketlerin tekrar bulunması gizli yoğunlaşma yaratabilir. Değişikliklerin ücret ve vergi etkisini öğren."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero canlı portföy analiz aracı değildir. Finans kontrol notunda dağılımını ve değerlendirme tarihini tutabilirsin; güncel varlık bilgileri kurum kaynaklarından doğrulanmalıdır."
        }
      ],
      "example": "Başlangıçta 5.000 TL A ve 5.000 TL B tuttuğunda ağırlıklar %50/%50’dir. A 10.000 TL’ye çıkıp B 5.000 TL kalırsa dağılım yaklaşık %67/%33 olur. Başlangıçtaki denge otomatik korunmamıştır.",
      "pitfall": "Farklı isimli fonları tamamen farklı içerik sanmak.",
      "steps": [
        "Ağırlıkları kontrol et",
        "Örtüşen varlıkları incele",
        "Değişiklik maliyetini değerlendir"
      ],
      "sources": [
        "diversification"
      ],
      "related": [
        "regular-investing",
        "long-term"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Bir varlık büyüdüğünde portföydeki payı ne olabilir?",
        "options": [
          "Mutlaka sıfır olur.",
          "Artabilir; başlangıç oranı sabit kalmaz.",
          "Daima aynı kalır."
        ],
        "correct": 1,
        "explanation": "Artabilir; başlangıç oranı sabit kalmaz. Farklı isimli fonları tamamen farklı içerik sanmak."
      },
      "group": "Yatırım davranışları",
      "moduleId": "behavior",
      "outcomes": [
        "Portföyü gözden geçirmek, sahip olduklarının hedef, risk ve vade ile hâlâ uyumlu olup olmadığını değerlendirmektir.",
        "Sık karıştırılan noktayı fark etmek: Farklı isimli fonları tamamen farklı içerik sanmak."
      ]
    },
    {
      "id": "buy-rent",
      "title": "Ev almak veya kiralamak",
      "intro": "Ev kararı yalnız taksit ve kira karşılaştırması değildir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Ev kararı yalnız taksit ve kira karşılaştırması değildir. Başlangıç parası, finansman, bakım, taşınma olasılığı ve nakde dönüş süresi birlikte düşünülür. Herkes için aynı seçenek üstün değildir."
        },
        {
          "heading": "Karar verirken",
          "text": "Kirada esneklik, satın almada mülkiyet ve yükümlülükler vardır. Fiyat artışını kesin varsayarak maliyeti yok sayma. Yaşam koşulları ve bulunduğun yerdeki güncel hukuk ayrıca önemlidir."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero’da peşinat hedefi ve aylık ödeme planı kurabilirsin. Tüm borcu banka parandan düşmüş gibi göstermek yerine toplam borçla aylık nakit çıkışını ayrı izle."
        }
      ],
      "example": "Kira 15.000 TL, kredi taksiti 22.000 TL olsun. Yalnız 7.000 TL farkla karar vermek eksiktir; peşinat, bakım, işlem masrafları ve taşınma olasılığı da gerekir. Farklı varsayımlarla birkaç senaryo kur.",
      "pitfall": "Kira ile taksit arasındaki farkı bütün maliyet saymak.",
      "steps": [
        "Peşinat ve masrafları listele",
        "Aylık nakit senaryosu kur",
        "Yaşam planını hesaba kat"
      ],
      "sources": [
        "cashflow"
      ],
      "related": [
        "car-cost",
        "education-cost"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Ev kararında ne birlikte değerlendirilir?",
        "options": [
          "Yalnız ilk taksit.",
          "Yalnız ilan fotoğrafları.",
          "Peşinat, aylık yük, masraf ve yaşam koşulları."
        ],
        "correct": 2,
        "explanation": "Peşinat, aylık yük, masraf ve yaşam koşulları. Kira ile taksit arasındaki farkı bütün maliyet saymak."
      },
      "group": "Büyük kararlar",
      "moduleId": "decisions",
      "outcomes": [
        "Ev kararı yalnız taksit ve kira karşılaştırması değildir.",
        "Sık karıştırılan noktayı fark etmek: Kira ile taksit arasındaki farkı bütün maliyet saymak."
      ]
    },
    {
      "id": "car-cost",
      "title": "Araç sahipliğinin toplam maliyeti",
      "intro": "Araç maliyeti satın alma tutarıyla bitmez.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Araç maliyeti satın alma tutarıyla bitmez. Yakıt/enerji, bakım, sigorta, vergiler, park, finansman ve değer değişimi toplam resmi etkiler. Bunlar ürüne ve kullanımına göre değişir."
        },
        {
          "heading": "Karar verirken",
          "text": "Az kullanılan araçta sabit maliyetlerin kullanım başına payı yüksek olabilir. İki aracı yalnız tüketim değerleriyle karşılaştırma. Beklenmedik bakım için nakit tamponunu düşün."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero’da ulaşım giderlerini alt kategorilere ayırabilir; yıllık ödemeleri aylık katkı hedefiyle hazırlayabilirsin. Değer kaybı günlük banka çıkışı değildir, varlığın değer değişimidir."
        }
      ],
      "example": "Yakıt 2.000 TL, park 500 TL ve yıllık varsayımsal sigorta/bakım toplamı 18.000 TL ise aylık plan karşılığı 4.000 TL olur: 2.000 + 500 + 18.000/12. Alım bedeli ve finansman bu sade örnekte ayrıca değerlendirilir.",
      "pitfall": "Yalnız yakıtı araç maliyeti saymak.",
      "steps": [
        "Sabit ve değişkenleri listele",
        "Yıllık masrafları aya böl",
        "Kullanım miktarını karşılaştır"
      ],
      "sources": [
        "spending"
      ],
      "related": [
        "buy-rent",
        "education-cost"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Yıllık 18.000 TL masrafın aylık hazırlık karşılığı nedir?",
        "options": [
          "1.500 TL.",
          "18.000 TL her ay.",
          "150 TL."
        ],
        "correct": 0,
        "explanation": "1.500 TL. Yalnız yakıtı araç maliyeti saymak."
      },
      "group": "Büyük kararlar",
      "moduleId": "decisions",
      "outcomes": [
        "Araç maliyeti satın alma tutarıyla bitmez.",
        "Sık karıştırılan noktayı fark etmek: Yalnız yakıtı araç maliyeti saymak."
      ]
    },
    {
      "id": "education-cost",
      "title": "Eğitim harcamalarını planla",
      "intro": "Eğitim maliyeti ders/okul ücretine ek olarak malzeme, ulaşım, konaklama ve zaman içerebilir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Eğitim maliyeti ders/okul ücretine ek olarak malzeme, ulaşım, konaklama ve zaman içerebilir. Ödeme tarihi öğrenim döneminin başlangıcından farklı olabilir."
        },
        {
          "heading": "Karar verirken",
          "text": "Burs, indirim veya destek koşullarını yazılı kaynaktan doğrula. Gelecek iş geliri eğitim maliyetini kesin karşılayacak gibi kabul edilmemelidir. Planı seçenek ve belirsizliklerle düşün."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero’da ödeme tarihli hedef aç; kayıt, dönem ve sınav gibi ayrı masrafları listele. Henüz onaylanmamış desteği gerçekleşmiş gelir olarak kaydetme."
        }
      ],
      "example": "Dönem ücreti 20.000 TL, malzeme 2.000 TL ve ulaşım 4.000 TL ise toplam hazırlık 26.000 TL’dir. Dört ayda biriktireceksen, mevcut birikim ve getiri yok varsayımıyla ayda 6.500 TL gerekir.",
      "pitfall": "Yalnız görünen eğitim ücretini toplam bütçe sanmak.",
      "steps": [
        "Yan masrafları ekle",
        "Destek koşullarını doğrula",
        "Ödeme tarihine göre katkı hesapla"
      ],
      "sources": [
        "goals"
      ],
      "related": [
        "buy-rent",
        "car-cost"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Örnekte toplam hazırlık tutarı nedir?",
        "options": [
          "22.000 TL.",
          "26.000 TL.",
          "20.000 TL."
        ],
        "correct": 1,
        "explanation": "26.000 TL. Yalnız görünen eğitim ücretini toplam bütçe sanmak."
      },
      "group": "Büyük kararlar",
      "moduleId": "decisions",
      "outcomes": [
        "Eğitim maliyeti ders/okul ücretine ek olarak malzeme, ulaşım, konaklama ve zaman içerebilir.",
        "Sık karıştırılan noktayı fark etmek: Yalnız görünen eğitim ücretini toplam bütçe sanmak."
      ]
    },
    {
      "id": "insurance",
      "title": "Sigortanın amacını anla",
      "intro": "Sigorta, belirli risklerin sözleşmede tanımlı koşullarla paylaşılmasıdır.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Sigorta, belirli risklerin sözleşmede tanımlı koşullarla paylaşılmasıdır. Poliçe kapsamı, istisnalar, limitler, muafiyet ve prim birlikte okunmalıdır. Her zarar veya masrafın karşılanacağı varsayılmaz."
        },
        {
          "heading": "Karar verirken",
          "text": "Düşük prim tek başına uygun ürün demek değildir. Kapsamın ihtiyacına uyup uymadığını ve başvuru/hasar koşullarını öğren. Sağlık, araç ve konut ürünlerinin kuralları farklıdır."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero prim ödemelerini takip eder; hasar veya teminat kararı vermez. Poliçe belgelerini güvenli tut; güncel kapsamı sigortacı ve resmi bilgilerden doğrula. Beklenen tazminatı kesin gelir diye yazma."
        }
      ],
      "example": "İki ürünün primi 2.000 ve 2.500 TL olsun. İlkinin ilgilendiğin riski kapsamaması halinde yalnız fiyatı düşük diye seçmek amacını karşılamaz. Kapsamı, limit ve muafiyeti eşitlemeden fiyatları karşılaştırma.",
      "pitfall": "Poliçenin her zararı karşılayacağını sanmak.",
      "steps": [
        "Kapsam ve istisnaları oku",
        "Limit ve muafiyeti öğren",
        "Hasar başvuru yolunu kaydet"
      ],
      "sources": [
        "insurance"
      ],
      "related": [
        "buy-rent",
        "car-cost"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Poliçe karşılaştırmasında ne önemlidir?",
        "options": [
          "Yalnız en düşük fiyat.",
          "Yalnız şirket logosu.",
          "Primle birlikte kapsam, limit ve istisnalar."
        ],
        "correct": 2,
        "explanation": "Primle birlikte kapsam, limit ve istisnalar. Poliçenin her zararı karşılayacağını sanmak."
      },
      "group": "Büyük kararlar",
      "moduleId": "decisions",
      "outcomes": [
        "Sigorta, belirli risklerin sözleşmede tanımlı koşullarla paylaşılmasıdır.",
        "Sık karıştırılan noktayı fark etmek: Poliçenin her zararı karşılayacağını sanmak."
      ]
    },
    {
      "id": "retirement",
      "title": "Emeklilik planını düşün",
      "intro": "Emeklilik planı uzun bir dönem için gelir, gider ve birikim kaynaklarını değerlendirmeyi gerektirir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Emeklilik planı uzun bir dönem için gelir, gider ve birikim kaynaklarını değerlendirmeyi gerektirir. Bugünkü yaşam maliyeti gelecekte aynı tutarda kalmayabilir. Sosyal güvenlik, kişisel birikim ve başka gelirler ayrı kaynaklardır."
        },
        {
          "heading": "Karar verirken",
          "text": "Uzun dönemde sağlık, barınma ve aile koşulları değişebilir. Tek bir sabit getiriyle kesin sonuç vaat etmek doğru değildir. Farklı enflasyon ve katkı senaryolarını karşılaştır."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero hesaplayıcıları varsayımsal büyümeyi gösterir; resmi emeklilik hakkı veya aylık tutarı hesaplamaz. Türkiye’de kişisel haklar için SGK ve ilgili kurum kayıtlarını kontrol et."
        }
      ],
      "example": "Bugünkü aylık hedef gider 20.000 TL ise 20 yıl sonra da aynı nominal tutarın yeterli olacağını kabul etme. Fiyatlar ve yaşam koşulları değişebilir. Birikim senaryosunda katkı, süre, masraf ve reel etkiyi ayrı düşün.",
      "pitfall": "Tek sabit tahmini kesin emeklilik geliri kabul etmek.",
      "steps": [
        "Olası gelir kaynaklarını ayır",
        "Birden fazla gider senaryosu kur",
        "Resmi hak bilgilerini doğrula"
      ],
      "sources": [
        "bes"
      ],
      "related": [
        "buy-rent",
        "car-cost"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Nero büyüme hesaplayıcısı ne değildir?",
        "options": [
          "Resmi emeklilik aylığı veya hak hesabı.",
          "Varsayım karşılaştırma aracı.",
          "Eğitim amaçlı hesap aracı."
        ],
        "correct": 0,
        "explanation": "Resmi emeklilik aylığı veya hak hesabı. Tek sabit tahmini kesin emeklilik geliri kabul etmek."
      },
      "group": "Büyük kararlar",
      "moduleId": "decisions",
      "outcomes": [
        "Emeklilik planı uzun bir dönem için gelir, gider ve birikim kaynaklarını değerlendirmeyi gerektirir.",
        "Sık karıştırılan noktayı fark etmek: Tek sabit tahmini kesin emeklilik geliri kabul etmek."
      ]
    },
    {
      "id": "family-money",
      "title": "Aile içinde para yönetimi",
      "intro": "Ortak giderleri yönetmek, kimin ne kazandığı kadar hangi amaçlarda anlaşıldığını da gerektirir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Ortak giderleri yönetmek, kimin ne kazandığı kadar hangi amaçlarda anlaşıldığını da gerektirir. Ortak ve kişisel harcamaların sınırlarını, ödeme sorumluluğunu ve bilgi paylaşımını konuş."
        },
        {
          "heading": "Karar verirken",
          "text": "Gelir farkı olan kişiler için eşit tutar ile gelir oranında katkı aynı sonucu doğurmaz. Her yöntemin adalet hissi ve uygulanabilirliği farklıdır; tek doğru oran yoktur. Büyük kararları önceden konuşmak sürprizi azaltır."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero aynı cihazdaki hesapları izler; çok kullanıcılı banka yetkisi veya ortak hesap hizmeti sunmaz. Ortak bütçede hangi kayıtların paylaşılacağını birlikte belirle."
        }
      ],
      "example": "Bir kişi 30.000, diğeri 20.000 TL kazanıyor ve ortak gider 15.000 TL olsun. Eşit katkı 7.500’er TL; gelir oranında örnek katkı 9.000 ve 6.000 TL olur. Bu hesap yöntem gösterir, hangi paylaşımın doğru olduğunu belirlemez.",
      "pitfall": "Kendi paylaşım yöntemini konuşmadan herkes için adil kabul etmek.",
      "steps": [
        "Ortak giderleri belirle",
        "Katkı yönteminde anlaş",
        "Düzenli kontrol zamanı seç"
      ],
      "sources": [
        "cashflow"
      ],
      "related": [
        "buy-rent",
        "car-cost"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Eşit tutar ve gelir oranlı katkı aynı mıdır?",
        "options": [
          "Yalnız ortak hesap varsa aynıdır.",
          "Gelirler farklıysa sonuçları farklı olabilir.",
          "Her zaman aynıdır."
        ],
        "correct": 1,
        "explanation": "Gelirler farklıysa sonuçları farklı olabilir. Kendi paylaşım yöntemini konuşmadan herkes için adil kabul etmek."
      },
      "group": "Büyük kararlar",
      "moduleId": "decisions",
      "outcomes": [
        "Ortak giderleri yönetmek, kimin ne kazandığı kadar hangi amaçlarda anlaşıldığını da gerektirir.",
        "Sık karıştırılan noktayı fark etmek: Kendi paylaşım yöntemini konuşmadan herkes için adil kabul etmek."
      ]
    },
    {
      "id": "institutions",
      "title": "Finansal kurumları tanı",
      "intro": "Banka, aracı kurum, fon yönetimi ve sigorta şirketi farklı hizmetler sunar.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Banka, aracı kurum, fon yönetimi ve sigorta şirketi farklı hizmetler sunar. Denetim ve yetki alanları da farklıdır. Bir kurumun bir hizmete yetkili olması her ürünü veya getiriyi garanti etmez."
        },
        {
          "heading": "Karar verirken",
          "text": "Türkiye’de ilgili kurumlar hakkında BDDK, SPK, TCMB, TMSF, EGM ve SEDDK gibi resmi kaynaklara başvurabilirsin. Görevi ve başvuru yolunu ürününe göre seç; hepsini aynı garanti kurumu sanma."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero bunlardan biri değildir, para tutmaz veya finansal aracılık yapmaz. Kayıt ve eğitim uygulamasıdır. Dış işlem yapacağın hizmetin resmi kurum/ürün bilgilerini bağımsız doğrula."
        }
      ],
      "example": "Bir platformda şirket adresi bulunması, sunduğu yatırım hizmetine yetkili olduğunu tek başına göstermeyebilir. Yetkiyi ilgili resmi kayıt ve ürün kapsamıyla doğrula; platformun gönderdiği tek bir ekran görüntüsüne dayanma.",
      "pitfall": "Şirket kaydı ile finansal hizmet yetkisini aynı sanmak.",
      "steps": [
        "Hizmet türünü belirle",
        "İlgili resmi kurumu bul",
        "Yetki kapsamını bağımsız doğrula"
      ],
      "sources": [
        "spk"
      ],
      "related": [
        "deposit-insurance",
        "taxes"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Finansal kurumda hangi bilgi doğrulanmalı?",
        "options": [
          "Yalnız uygulama mağazası puanı.",
          "Yalnız adres veya logo.",
          "Sunulan hizmet için yetki ve kapsam."
        ],
        "correct": 2,
        "explanation": "Sunulan hizmet için yetki ve kapsam. Şirket kaydı ile finansal hizmet yetkisini aynı sanmak."
      },
      "group": "Türkiye’de finans",
      "moduleId": "turkey",
      "outcomes": [
        "Banka, aracı kurum, fon yönetimi ve sigorta şirketi farklı hizmetler sunar.",
        "Sık karıştırılan noktayı fark etmek: Şirket kaydı ile finansal hizmet yetkisini aynı sanmak."
      ]
    },
    {
      "id": "deposit-insurance",
      "title": "Mevduat güvencesini anla",
      "intro": "Mevduat sigortasında kapsam, kurum, hesap türü ve kişi başına sınır gibi koşullar vardır.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Mevduat sigortasında kapsam, kurum, hesap türü ve kişi başına sınır gibi koşullar vardır. Bütün finansal ürünlerin aynı korumada olduğu varsayılamaz. Güncel tutar ve istisnalar resmi kaynaktan kontrol edilir."
        },
        {
          "heading": "Karar verirken",
          "text": "Türkiye’de TMSF bilgilerini ilgili yıl ve koşullarla oku. Yabancı ülkedeki mevduat korumasını Türkiye’ye aynen uygulama. Fon, hisse veya kripto ürünü mevduatla aynı hukuki ürün değildir."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero banka bakiyesini toplar; sigortalı tutarı hesaplamaz veya güvence vermez. Bir hesaba banka adı vermek o kaydı mevduat sigortası kapsamına sokmaz."
        }
      ],
      "example": "İki farklı ürün aynı banka uygulamasında görünebilir: mevduat ve yatırım fonu. Aynı ekranda yer almaları aynı güvenceyi taşıdıklarını kanıtlamaz. Ürün türünü ve resmi kapsamı ayrı kontrol et; bu örnekte güncel parasal limit verilmez.",
      "pitfall": "Banka uygulamasındaki her ürünün aynı sigortada olduğunu düşünmek.",
      "steps": [
        "Ürün türünü öğren",
        "TMSF’nin güncel kapsamını oku",
        "İstisna ve sınırları kontrol et"
      ],
      "sources": [
        "tmsf"
      ],
      "related": [
        "institutions",
        "taxes"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Aynı banka ekranı aynı güvence anlamına gelir mi?",
        "options": [
          "Hayır; ürün türü ve kapsam farklı olabilir.",
          "Evet, her ürün aynıdır.",
          "Yalnız toplam bakiye yüksekse evet."
        ],
        "correct": 0,
        "explanation": "Hayır; ürün türü ve kapsam farklı olabilir. Banka uygulamasındaki her ürünün aynı sigortada olduğunu düşünmek."
      },
      "group": "Türkiye’de finans",
      "moduleId": "turkey",
      "outcomes": [
        "Mevduat sigortasında kapsam, kurum, hesap türü ve kişi başına sınır gibi koşullar vardır.",
        "Sık karıştırılan noktayı fark etmek: Banka uygulamasındaki her ürünün aynı sigortada olduğunu düşünmek."
      ]
    },
    {
      "id": "taxes",
      "title": "Vergi ve kesintilerin mantığı",
      "intro": "Brüt gelir veya getiriyle net elde kalan tutar farklı olabilir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Brüt gelir veya getiriyle net elde kalan tutar farklı olabilir. Vergi, kesinti ve beyan koşulları gelirin türüne, ülkeye, döneme ve kişisel duruma bağlıdır. Tek oran bütün durumlara uygulanmaz."
        },
        {
          "heading": "Karar verirken",
          "text": "Ödeme sırasında kesinti yapılması her durumda bütün yükümlülüklerin bittiğini göstermez. İnternetteki eski istisna veya oranları güncel kabul etme. Türkiye’de GİB rehberleri ve gerektiğinde yetkili uzmanla durumu doğrula."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero kişisel takip yapar, beyanname veya yasal muhasebe üretmez. Net gelir kaydediyorsan kesintiyi ikinci kez düşme. Brüt takip ediyorsan kesintileri tutarlı biçimde ayrıca göster."
        }
      ],
      "example": "10.000 TL brüt ödeme ve 1.000 TL kesinti örneğinde hesaba 9.000 TL geçer. Net yöntemde 9.000 TL gelir; brüt yöntemde 10.000 TL gelir ve 1.000 TL kesinti izlenebilir. Bu sayı gerçek vergi oranı veya yükümlülük hesabı değildir.",
      "pitfall": "Net geliri yazıp aynı kesintiyi tekrar gider olarak düşmek.",
      "steps": [
        "Net veya brüt yöntem seç",
        "Belge ve kesintiyi sakla",
        "Güncel yükümlülüğü resmi kaynaktan doğrula"
      ],
      "sources": [
        "gib"
      ],
      "related": [
        "institutions",
        "deposit-insurance"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Net yöntemle 9.000 TL kaydedince aynı kesinti yeniden düşülür mü?",
        "options": [
          "Gelir iki katına çıkarılır.",
          "Hayır; aynı kesinti iki kez sayılmaz.",
          "Evet, mutlaka."
        ],
        "correct": 1,
        "explanation": "Hayır; aynı kesinti iki kez sayılmaz. Net geliri yazıp aynı kesintiyi tekrar gider olarak düşmek."
      },
      "group": "Türkiye’de finans",
      "moduleId": "turkey",
      "outcomes": [
        "Brüt gelir veya getiriyle net elde kalan tutar farklı olabilir.",
        "Sık karıştırılan noktayı fark etmek: Net geliri yazıp aynı kesintiyi tekrar gider olarak düşmek."
      ]
    },
    {
      "id": "consumer-rights",
      "title": "Finansal tüketici hakları",
      "intro": "Ücret, işlem, sözleşme ve hizmet konusunda bilgi istemek ve uygun kanaldan itiraz etmek önemlidir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Ücret, işlem, sözleşme ve hizmet konusunda bilgi istemek ve uygun kanaldan itiraz etmek önemlidir. Başvuru yolu ve koşulları ürününe göre değişir. Her sorun aynı kuruma yöneltilmez."
        },
        {
          "heading": "Karar verirken",
          "text": "Sözleşme, dekont, yazışma ve tarihler uyuşmazlığın anlaşılmasını kolaylaştırır. Güncel süre ve parasal sınırlar değişebileceğinden bu derste sabit mevzuat ezberi yapılmaz. Banka ve ilgili resmi rehberi kontrol et."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero’ya fiş/dekont ekleyebilirsin; uygulama adına kurumlara otomatik başvuru göndermez. Paylaşırken hesap veya kimlik bilgilerinin gereksiz bölümünü koru."
        }
      ],
      "example": "Bir ücretin beklediğinden farklı olduğunu fark ettin. Tutar, işlem tarihi ve hangi tarifeye dayanıldığını yazılı sormak, yalnız sözlü şikâyetten daha izlenebilir kayıt sağlar. Cevap ve başvuru tarihlerini birlikte sakla.",
      "pitfall": "Belge ve tarihleri tutmadan yalnız sonucu hatırlamaya çalışmak.",
      "steps": [
        "Belgeyi sakla",
        "Talebini açık yaz",
        "Ürününe uygun başvuru yolunu doğrula"
      ],
      "sources": [
        "tbb"
      ],
      "related": [
        "institutions",
        "deposit-insurance"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "İtiraz için hangi kayıtlar yararlıdır?",
        "options": [
          "Yalnız banka logosu.",
          "Yalnız sosyal medya paylaşımı.",
          "Tutar, tarih, sözleşme ve yazışmalar."
        ],
        "correct": 2,
        "explanation": "Tutar, tarih, sözleşme ve yazışmalar. Belge ve tarihleri tutmadan yalnız sonucu hatırlamaya çalışmak."
      },
      "group": "Türkiye’de finans",
      "moduleId": "turkey",
      "outcomes": [
        "Ücret, işlem, sözleşme ve hizmet konusunda bilgi istemek ve uygun kanaldan itiraz etmek önemlidir.",
        "Sık karıştırılan noktayı fark etmek: Belge ve tarihleri tutmadan yalnız sonucu hatırlamaya çalışmak."
      ]
    },
    {
      "id": "complaint",
      "title": "Başvuru yolunu bul",
      "intro": "Bir finans sorunu için önce konu, kurum ve istediğin sonucu açık tanımla.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Bir finans sorunu için önce konu, kurum ve istediğin sonucu açık tanımla. Bankacılık, sermaye piyasası ve sigorta başvuruları farklı mekanizmalara gidebilir. Kuruma göre güncel rehberi kullan."
        },
        {
          "heading": "Karar verirken",
          "text": "Başvuru şartı, önce kurum cevabı gerekmesi, süre veya sınır gibi ayrıntılar değişebilir. Eski bir video yerine resmi sayfanın güncel metnini kontrol et. Bu ders hukuki süreç seçimi veya sonuç garantisi sunmaz."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero notlarında olay sırasını ve belge listesini hazırlayabilirsin. Finans yedeğinin tamamını göndermek yerine ihtiyaç duyulan belgeleri seç; ilgili olmayan kişisel kayıtları paylaşma."
        }
      ],
      "example": "500 TL ücret hakkında başvuruda talebin ne olduğunu net yaz: ücretin gerekçesinin açıklanması veya koşullara göre iade değerlendirmesi gibi. Belgeleri tarih sırasına koy; aynı talebi farklı kanallara gönderirken önceki cevapları takip et.",
      "pitfall": "Güncel şartı doğrulamadan her kuruma aynı dosyayı göndermek.",
      "steps": [
        "Sorunu bir cümlede tanımla",
        "Belgeleri sırala",
        "Resmi başvuru koşullarını oku"
      ],
      "sources": [
        "tbb"
      ],
      "related": [
        "institutions",
        "deposit-insurance"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Başvuru yolunu ne belirler?",
        "options": [
          "Sorunun ürünü, kurumu ve güncel koşulları.",
          "Yalnız tutarın büyük olması.",
          "İlk çıkan sosyal medya yorumu."
        ],
        "correct": 0,
        "explanation": "Sorunun ürünü, kurumu ve güncel koşulları. Güncel şartı doğrulamadan her kuruma aynı dosyayı göndermek."
      },
      "group": "Türkiye’de finans",
      "moduleId": "turkey",
      "outcomes": [
        "Bir finans sorunu için önce konu, kurum ve istediğin sonucu açık tanımla.",
        "Sık karıştırılan noktayı fark etmek: Güncel şartı doğrulamadan her kuruma aynı dosyayı göndermek."
      ]
    },
    {
      "id": "fraud",
      "title": "Para konusunda kırmızı bayraklar",
      "group": "Dolandırıcılıktan korun",
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
        "money-map",
        "platform-scams",
        "social-advice"
      ],
      "tool": null,
      "minutes": 3,
      "moduleId": "security",
      "quiz": {
        "question": "Garantili yüksek getiri ve hemen ödeme baskısı neyi gerektirir?",
        "options": [
          "Şifreni gönderme.",
          "Durup bağımsız resmi kaynaklardan doğrulama.",
          "Hızlı para gönderme."
        ],
        "correct": 1,
        "explanation": "Durup bağımsız resmi kaynaklardan doğrulama. Yatırım fırsatını kaçırma korkusu, doğrulama adımlarını atlamak için gerekçe değildir."
      },
      "outcomes": [
        "Garantili yüksek getiri ve acele baskısı sorgulanmalıdır.",
        "Sık karıştırılan noktayı fark etmek: Yatırım fırsatını kaçırma korkusu, doğrulama adımlarını atlamak için gerekçe değildir."
      ]
    },
    {
      "id": "platform-scams",
      "title": "Sahte platformları fark et",
      "intro": "Sahte bir yatırım platformu profesyonel arayüz, logo, yorum ve sahte kazanç gösterebilir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Sahte bir yatırım platformu profesyonel arayüz, logo, yorum ve sahte kazanç gösterebilir. Güzel tasarım ve uygulama mağazasında bulunmak tek başına güvenilirlik kanıtı değildir."
        },
        {
          "heading": "Karar verirken",
          "text": "Yetki, şirket kimliği ve para çekme koşullarını bağımsız doğrula. Kazancı çekmek için sürekli ek ödeme istenmesi şüphe oluşturur. Küçük bir ilk çekime izin verilmesi sonraki işlemleri garanti etmez."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero dış platforma para göndermez. Bir ekran görüntüsündeki kâr, banka hesabına geçmiş gelir değildir. Para aktarmadan önce gerçek kurum kayıtlarına bak."
        }
      ],
      "example": "Ekranda 20.000 TL kazanç var denip çekmek için 3.000 TL yeni ödeme isteniyor. Gösterilen sayı gerçek kazancın kanıtı değildir. Platformun verdiği destek linki yerine bağımsız resmi kaynaktan yetki ve kimliği doğrula.",
      "pitfall": "Ekrandaki bakiye veya ilk küçük çekimi tam güvence saymak.",
      "steps": [
        "Yetkiyi bağımsız doğrula",
        "Para çekme koşullarını oku",
        "Ek ödeme baskısını sorgula"
      ],
      "sources": [
        "fraud"
      ],
      "related": [
        "fraud",
        "social-advice"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Platformdaki kâr ekranı gerçek kazanç kanıtı mı?",
        "options": [
          "Evet, sayı görünüyorsa.",
          "Yalnız ekran yeşilse evet.",
          "Tek başına değil."
        ],
        "correct": 2,
        "explanation": "Tek başına değil. Ekrandaki bakiye veya ilk küçük çekimi tam güvence saymak."
      },
      "group": "Dolandırıcılıktan korun",
      "moduleId": "security",
      "outcomes": [
        "Sahte bir yatırım platformu profesyonel arayüz, logo, yorum ve sahte kazanç gösterebilir.",
        "Sık karıştırılan noktayı fark etmek: Ekrandaki bakiye veya ilk küçük çekimi tam güvence saymak."
      ]
    },
    {
      "id": "social-advice",
      "title": "Sosyal medya tavsiyeleri",
      "intro": "Paylaşan kişinin takipçi sayısı, yatırım bilgisinin doğruluğunu veya sana uygunluğunu kanıtlamaz.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Paylaşan kişinin takipçi sayısı, yatırım bilgisinin doğruluğunu veya sana uygunluğunu kanıtlamaz. Reklam, sponsorluk, ürün sahipliği veya başka çıkar ilişkileri yorumları etkileyebilir."
        },
        {
          "heading": "Karar verirken",
          "text": "Kesin kazanç, acil alım ve kayıpsız sonuç iddialarını sorgula. Kaynak, yöntem ve zarar senaryosu açık mı? Bir kişinin hedef ve maddi koşulları seninkinden farklı olabilir."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero Akademisi yatırım sinyali vermez. Sosyal medya iddiasını karar nedeni olarak not alırsan bunun doğrulanmamış görüş olduğunu belirt. Kendi bütçe sınırını başkasının heyecanıyla değiştirme."
        }
      ],
      "example": "Bir paylaşım yalnız başarılı üç işlemi gösteriyor, toplam işlem sayısını ve kayıpları açıklamıyor. Başarı oranı veya gerçek sonuç çıkarılamaz. Paylaşımın reklam olup olmadığını ve resmi bilgileri ayrı incele.",
      "pitfall": "Takipçi sayısını uzmanlık veya doğrulanmış sonuç saymak.",
      "steps": [
        "Çıkar ilişkisini kontrol et",
        "İlk kaynağı bul",
        "Kayıp senaryosunu sor"
      ],
      "sources": [
        "fraud"
      ],
      "related": [
        "fraud",
        "platform-scams"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Yüksek takipçi sayısı neyi garanti etmez?",
        "options": [
          "Tavsiyenin doğru ve sana uygun olduğunu.",
          "Paylaşımın çok görülebileceğini.",
          "Bir kişinin popüler olduğunu."
        ],
        "correct": 0,
        "explanation": "Tavsiyenin doğru ve sana uygun olduğunu. Takipçi sayısını uzmanlık veya doğrulanmış sonuç saymak."
      },
      "group": "Dolandırıcılıktan korun",
      "moduleId": "security",
      "outcomes": [
        "Paylaşan kişinin takipçi sayısı, yatırım bilgisinin doğruluğunu veya sana uygunluğunu kanıtlamaz.",
        "Sık karıştırılan noktayı fark etmek: Takipçi sayısını uzmanlık veya doğrulanmış sonuç saymak."
      ]
    },
    {
      "id": "phishing",
      "title": "Kimlik avından korun",
      "intro": "Kimlik avı, resmi kurum gibi görünerek parola, kod veya kişisel bilgiyi almaya çalışabilir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Kimlik avı, resmi kurum gibi görünerek parola, kod veya kişisel bilgiyi almaya çalışabilir. E-posta, SMS, sosyal medya ve telefon üzerinden gelebilir. Gönderen adı taklit edilebilir."
        },
        {
          "heading": "Karar verirken",
          "text": "Bağlantı adresini ve talebi bağımsız doğrula. Kısa süre baskısı, ceza tehdidi veya beklenmedik ödül güvenlik kontrolünü kaldırmaz. Şüpheli mesajın numarası yerine bildiğin resmi kanaldan kurumla iletişime geç."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero’nun hesap takibi bankacılık parolası istemez. Belgelerdeki kimlik ve hesap bilgilerini paylaşırken kontrol et. Bir uygulama talebi beklenmedikse izni vermeden kaynağını doğrula."
        }
      ],
      "example": "Bankan gibi görünen mesaj hesabın kapanacak deyip tek kullanımlık kod istiyor. Bankanın bilinen uygulamasını veya resmi numarasını kendin aç. Logo, isim ve acele gerekçesi kodu paylaşmayı güvenli yapmaz.",
      "pitfall": "Mesajdaki telefon veya linki bağımsız doğrulama sanmak.",
      "steps": [
        "Bilinen resmi kanalı kullan",
        "Kodlarını paylaşma",
        "Şüpheli talebi kurumdan doğrula"
      ],
      "sources": [
        "fraud"
      ],
      "related": [
        "fraud",
        "platform-scams"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Bağımsız kontrol nasıl yapılır?",
        "options": [
          "Aynı mesajın numarasını arayarak.",
          "Bildik resmi kanalı kendin açarak.",
          "Mesajın gönderdiği linkten."
        ],
        "correct": 1,
        "explanation": "Bildik resmi kanalı kendin açarak. Mesajdaki telefon veya linki bağımsız doğrulama sanmak."
      },
      "group": "Dolandırıcılıktan korun",
      "moduleId": "security",
      "outcomes": [
        "Kimlik avı, resmi kurum gibi görünerek parola, kod veya kişisel bilgiyi almaya çalışabilir.",
        "Sık karıştırılan noktayı fark etmek: Mesajdaki telefon veya linki bağımsız doğrulama sanmak."
      ]
    },
    {
      "id": "pyramid",
      "title": "Piramit sistemleri fark et",
      "intro": "Kazanç esas olarak yeni katılımcıların para getirmesine bağlıysa sürdürülebilirlik ve dolandırıcılık riski sorgulanmalıdır.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Kazanç esas olarak yeni katılımcıların para getirmesine bağlıysa sürdürülebilirlik ve dolandırıcılık riski sorgulanmalıdır. Ürün görünmesi tek başına bu riski ortadan kaldırmaz."
        },
        {
          "heading": "Karar verirken",
          "text": "Getirinin gerçek kaynağını ve yeni katılımcı olmadan nasıl oluşacağını sor. Erken ödeme yapılmış olması bütün yapının güvenli olduğunu kanıtlamaz. Yüksek ve garantili vaatleri özellikle incele."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero başkasının vaat ettiği kazancı gerçekleşmiş gelir saymamalıdır. Gelecek parayı plan olarak işaretlemek bile platformun güvenilirliğini doğrulamaz; dışarıdaki yetki ve belgeler ayrıca kontrol edilir."
        }
      ],
      "example": "Bir sistem aylık kazancı ancak üç yeni kişi getirirsen artırıyor ve para esas olarak yeni üyelerden geliyor. İlk üyelerin ödeme alması devamlı getirinin ürün veya gerçek faaliyetle oluştuğunu göstermeyebilir.",
      "pitfall": "İlk ödemelerin yapılmasını uzun vadeli güvenilirlik kanıtı saymak.",
      "steps": [
        "Getirinin kaynağını sor",
        "Üye getirme şartını incele",
        "Bağımsız resmi bilgiyi kontrol et"
      ],
      "sources": [
        "fraud"
      ],
      "related": [
        "fraud",
        "platform-scams"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "İlk ödeme sistemin güvenilirliğini garanti eder mi?",
        "options": [
          "Evet, bir kez ödeme yeterlidir.",
          "Yalnız arkadaşın aldıysa eder.",
          "Hayır."
        ],
        "correct": 2,
        "explanation": "Hayır. İlk ödemelerin yapılmasını uzun vadeli güvenilirlik kanıtı saymak."
      },
      "group": "Dolandırıcılıktan korun",
      "moduleId": "security",
      "outcomes": [
        "Kazanç esas olarak yeni katılımcıların para getirmesine bağlıysa sürdürülebilirlik ve dolandırıcılık riski sorgulanmalıdır.",
        "Sık karıştırılan noktayı fark etmek: İlk ödemelerin yapılmasını uzun vadeli güvenilirlik kanıtı saymak."
      ]
    },
    {
      "id": "verify-sources",
      "title": "Bilgiyi doğrulamayı öğren",
      "intro": "Finans bilgisi için ilk kaynak, tarih, kapsam ve yöntem önemlidir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Finans bilgisi için ilk kaynak, tarih, kapsam ve yöntem önemlidir. Kurumun resmi yayını ile üçüncü kişinin yorumu ayrı şeylerdir. Eski bilgi bugünkü kural olmayabilir."
        },
        {
          "heading": "Karar verirken",
          "text": "Bir iddiayı kaynağına kadar izle. Birçok site aynı yazıyı tekrar ediyorsa bağımsız doğrulama sayılmaz. Ülke, ürün ve dönem sana uyuyor mu? Örnek oran güncel veriyle karıştırılmamalıdır."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Akademi derslerinin kaynakları bölüm sonunda bulunur. Genel kavramlar çevrimdışı okunabilir; güncel yasal tutar ve koşullar için bağlantıdaki resmi metni kontrol et. Kaynak kontrol tarihi güncelleme garantisi değildir."
        }
      ],
      "example": "Bir yazı %X kesinti diyor ama yıl ve gelir türü belirtmiyor. Aynı oranı kendi durumuna uygulamadan önce güncel GİB rehberi, ilgili ürün koşulu ve kişisel kapsam doğrulanmalıdır. Buradaki X, gerçek oran değildir.",
      "pitfall": "Bir bağlantı veya kurum logosunu bütün iddianın kanıtı saymak.",
      "steps": [
        "İlk kaynağı bul",
        "Tarih ve ülkeyi kontrol et",
        "Örnek ile güncel veriyi ayır"
      ],
      "sources": [
        "spk"
      ],
      "related": [
        "fraud",
        "platform-scams"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Kaynak değerlendirirken ne kontrol edilir?",
        "options": [
          "Tarih, kapsam, ülke ve ilk yayın.",
          "Yalnız sayfa tasarımı.",
          "Yalnız kaç kişi paylaştığı."
        ],
        "correct": 0,
        "explanation": "Tarih, kapsam, ülke ve ilk yayın. Bir bağlantı veya kurum logosunu bütün iddianın kanıtı saymak."
      },
      "group": "Dolandırıcılıktan korun",
      "moduleId": "security",
      "outcomes": [
        "Finans bilgisi için ilk kaynak, tarih, kapsam ve yöntem önemlidir.",
        "Sık karıştırılan noktayı fark etmek: Bir bağlantı veya kurum logosunu bütün iddianın kanıtı saymak."
      ]
    },
    {
      "id": "monthly-review",
      "title": "Ay sonunda 15 dakikalık kontrol",
      "group": "Kendi finansını değerlendir",
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
        "budget-plan",
        "saving-rate",
        "debt-burden"
      ],
      "tool": null,
      "minutes": 3,
      "moduleId": "review",
      "quiz": {
        "question": "Aylık özeti değerlendirmeden önce ne kontrol edilir?",
        "options": [
          "Yalnız en yüksek harcama.",
          "Kayıtların eksiksizliği, dönem ve gerçek hesap bakiyeleri.",
          "Yalnız grafik rengi."
        ],
        "correct": 1,
        "explanation": "Kayıtların eksiksizliği, dönem ve gerçek hesap bakiyeleri. Az gelir veya yüksek zorunlu gider bir karakter kusuru değildir; özet kişisel başarı puanı üretmez."
      },
      "outcomes": [
        "Özet ekranını karar vermek için kullan; kendine not vermek için değil.",
        "Sık karıştırılan noktayı fark etmek: Az gelir veya yüksek zorunlu gider bir karakter kusuru değildir; özet kişisel başarı puanı üretmez."
      ]
    },
    {
      "id": "saving-rate",
      "title": "Tasarruf oranını yorumla",
      "intro": "Gelirden kalan oran, belirli dönemde gelir eksi net giderin gelire bölünmesiyle hesaplanabilir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Gelirden kalan oran, belirli dönemde gelir eksi net giderin gelire bölünmesiyle hesaplanabilir. Bu ölçümün kapsamı açık olmalıdır. Kart alışverişi ve banka ödemesi farklı tarihlerde olduğundan nakit hareketiyle aynı değildir."
        },
        {
          "heading": "Karar verirken",
          "text": "Pozitif oran, paranın gerçekten birikim hesabına aktarıldığını kanıtlamaz. Eksik gelir veya gider sonucu bozar. Sıfır gelirde oran tanımsızdır; büyük yüzde göstermemek gerekir."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero aylık özeti kayıtlı gelir ve giderden yorum üretir. Hedefe rezerv, gerçek transfer ve yatırım katkısı ayrıca kontrol edilir. Oranı kendi koşullarına göre kıyasla; herkese tek hedef yüzde verme."
        }
      ],
      "example": "30.000 TL gelir ve 24.000 TL net gider varsa kalan 6.000 TL ve oran %20’dir. Bu, bankaya tam 6.000 TL eklenmiş olduğunu garanti etmez; eski kart borcu ödemeleri veya hesap hareketleri farklı olabilir.",
      "pitfall": "Gelirden kalan oranı kesin birikim artışı sanmak.",
      "steps": [
        "Gelir ve giderin tamlığını kontrol et",
        "Oranın kapsamını yaz",
        "Gerçek bakiye hareketini karşılaştır"
      ],
      "sources": [
        "cashflow"
      ],
      "related": [
        "monthly-review",
        "debt-burden"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "30.000 gelir, 24.000 net giderde oran nedir?",
        "options": [
          "%80.",
          "Kesin banka artışı %20.",
          "%20; kapsamı gelir−giderdir."
        ],
        "correct": 2,
        "explanation": "%20; kapsamı gelir−giderdir. Gelirden kalan oranı kesin birikim artışı sanmak."
      },
      "group": "Kendi finansını değerlendir",
      "moduleId": "review",
      "outcomes": [
        "Gelirden kalan oran, belirli dönemde gelir eksi net giderin gelire bölünmesiyle hesaplanabilir.",
        "Sık karıştırılan noktayı fark etmek: Gelirden kalan oranı kesin birikim artışı sanmak."
      ]
    },
    {
      "id": "debt-burden",
      "title": "Borç yükünü değerlendir",
      "intro": "Toplam borç uzun vadeli yükü; aylık ödeme ise yakın dönem nakit baskısını anlatır.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Toplam borç uzun vadeli yükü; aylık ödeme ise yakın dönem nakit baskısını anlatır. İkisini birlikte değerlendirmek gerekir. Aynı borç farklı vadelerde farklı aylık baskı yaratabilir."
        },
        {
          "heading": "Karar verirken",
          "text": "Aylık zorunlu borç ödemesini gerçekleşmiş gelirle kıyaslamak bir göstergedir, tek başına kredi uygunluk kararı değildir. Gelirin düzensizliği, temel giderler ve faiz riski sonucu değiştirir. Evrensel güvenli oran yoktur."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero taksitlerin kalanını ve bu ayın ödemelerini ayrı gösterir. Hesaptaki para borçla otomatik karıştırılmaz. Yeni taksit düşünürken diğer bekleyen yükümlülükleri de dahil et."
        }
      ],
      "example": "Aylık 30.000 TL gelir ve 9.000 TL borç ödemesi varsa sade oran %30’dur. Ancak kira 18.000 TL ise diğer ihtiyaçlara kalan 3.000 TL olur. Aynı %30 oran farklı yaşam koşullarında farklı baskı yaratabilir.",
      "pitfall": "Tek bir oranı herkes için güvenli kabul etmek.",
      "steps": [
        "Aylık bütün borç ödemelerini topla",
        "Temel giderleri ekle",
        "Gelir azalması senaryosu kur"
      ],
      "sources": [
        "debt"
      ],
      "related": [
        "monthly-review",
        "saving-rate"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Borç oranı tek başına yeterli midir?",
        "options": [
          "Hayır; temel gider ve gelir koşulları da gerekir.",
          "Evet, tek sayı tüm durumu açıklar.",
          "Yalnız toplam borç yüksekse yeterlidir."
        ],
        "correct": 0,
        "explanation": "Hayır; temel gider ve gelir koşulları da gerekir. Tek bir oranı herkes için güvenli kabul etmek."
      },
      "group": "Kendi finansını değerlendir",
      "moduleId": "review",
      "outcomes": [
        "Toplam borç uzun vadeli yükü; aylık ödeme ise yakın dönem nakit baskısını anlatır.",
        "Sık karıştırılan noktayı fark etmek: Tek bir oranı herkes için güvenli kabul etmek."
      ]
    },
    {
      "id": "emergency-cover",
      "title": "Tamponunun yeterliliğini ölç",
      "intro": "Acil durum fonunu, karşılayabileceği zorunlu gider süresiyle düşünmek yararlı olabilir.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Acil durum fonunu, karşılayabileceği zorunlu gider süresiyle düşünmek yararlı olabilir. Herkes için aynı ay sayısı doğru değildir. İş güvencesi, destekler ve bakım sorumlulukları koşulları değiştirir."
        },
        {
          "heading": "Karar verirken",
          "text": "Acil fonu bir sonraki ayın normal faturasıyla karıştırma. Planlı yıllık masraf sürpriz değildir; ayrı hazırlık ister. Fon kullanıldıysa yeniden tamamlama planı kur; kaydı saklamak durumu görünür tutar."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero acil tampon hesaplayıcısı gider ve kendi seçtiğin ay sayısından senaryo üretir. Bu sonuç kişisel tavsiye veya resmi yeterlilik puanı değildir."
        }
      ],
      "example": "Ayrılmış 30.000 TL ve aylık zorunlu gider 15.000 TL ise basit tampon iki aylıktır. Gelir kaybıyla sağlık veya taşınma gideri aynı anda oluşursa ihtiyaç farklılaşabilir. Yalnız geçmiş ortalamayı kesin yeterlilik sayma.",
      "pitfall": "Her koşul için tek ay sayısına güvenmek.",
      "steps": [
        "Zorunlu giderini hesapla",
        "Kendi koşullarına uygun süreyi seç",
        "Kullanım sonrası yenileme planı yap"
      ],
      "sources": [
        "emergency"
      ],
      "related": [
        "monthly-review",
        "saving-rate"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "30.000 tampon, 15.000 aylık giderde sade süre nedir?",
        "options": [
          "30 ay.",
          "2 ay.",
          "15 ay."
        ],
        "correct": 1,
        "explanation": "2 ay. Her koşul için tek ay sayısına güvenmek."
      },
      "group": "Kendi finansını değerlendir",
      "moduleId": "review",
      "outcomes": [
        "Acil durum fonunu, karşılayabileceği zorunlu gider süresiyle düşünmek yararlı olabilir.",
        "Sık karıştırılan noktayı fark etmek: Her koşul için tek ay sayısına güvenmek."
      ]
    },
    {
      "id": "wealth-trend",
      "title": "Net varlığın gelişimini izle",
      "intro": "Net varlık varlıklar eksi borçlardır.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Net varlık varlıklar eksi borçlardır. Bakiye artışının kaynağı gelir, yeni borç, kur veya varlık değer değişimi olabilir. Sadece bankada daha fazla para görmek iyileşmenin tamamını açıklamaz."
        },
        {
          "heading": "Karar verirken",
          "text": "Aynı kapsamla dönemleri karşılaştır. Yeni hesabı eklemek ölçüm alanını değiştirir; bunu kazanç gibi yorumlama. Borç ödeme banka ve borcu birlikte azaltabilir, net varlık her zaman aynı miktarda artmaz."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero kayıtlı hesap ve kartlara dayanır; ev veya dış yatırım otomatik dahil değildir. Net varlık anlık göstergedir, aylık gelir/giderle aynı kavram değildir."
        }
      ],
      "example": "Bankan 20.000 TL ve borcun 10.000 TL ise net 10.000 TL’dir. 5.000 TL kart ödemesinden sonra banka 15.000, borç 5.000 olur; net yine 10.000 TL. Ödeme tüketimi ikinci kez yaratmamıştır.",
      "pitfall": "Borç ödemesini her zaman aynı tutarda yeni net kazanç saymak.",
      "steps": [
        "Aynı hesap kapsamını koru",
        "Bakiye değişiminin nedenini ayır",
        "Dış varlıkların eksik olduğunu not et"
      ],
      "sources": [
        "cashflow"
      ],
      "related": [
        "monthly-review",
        "saving-rate"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Örnekte kart ödemesi net varlığı ne yaptı?",
        "options": [
          "5.000 TL artırdı.",
          "10.000 TL azalttı.",
          "Tek başına değiştirmedi."
        ],
        "correct": 2,
        "explanation": "Tek başına değiştirmedi. Borç ödemesini her zaman aynı tutarda yeni net kazanç saymak."
      },
      "group": "Kendi finansını değerlendir",
      "moduleId": "review",
      "outcomes": [
        "Net varlık varlıklar eksi borçlardır.",
        "Sık karıştırılan noktayı fark etmek: Borç ödemesini her zaman aynı tutarda yeni net kazanç saymak."
      ]
    },
    {
      "id": "annual-review",
      "title": "Yıllık finans değerlendirmesi",
      "intro": "Yıllık kontrol, tek bir ayın sıra dışı giderini uzun dönemle birlikte görmeyi sağlar.",
      "sections": [
        {
          "heading": "Kavramı öğren",
          "text": "Yıllık kontrol, tek bir ayın sıra dışı giderini uzun dönemle birlikte görmeyi sağlar. Gelir düzeni, kategori toplamları, borçlar, hedefler ve önemli olayları birlikte incele."
        },
        {
          "heading": "Karar verirken",
          "text": "Yıl içindeki eksik kayıtları ve kapsam değişikliklerini not et. Yüksek gelirli bir ayı bütün yılın standardı sayma. Yeni planı gerçek gözlemle kur; geçmişi değiştirmek yerine gelecek davranışı düzenle."
        },
        {
          "heading": "Günlük hayatta uygulama",
          "text": "Nero’nun 12 aylık grafiği ve CSV dışa aktarımı dönem kontrolüne yardım eder. Arşiv, yedek ve fişleri sakla. Yeni yıl limitlerini fiyat ve yaşam koşullarına göre tekrar düşün."
        }
      ],
      "example": "Bir ay 30.000 TL tek seferlik eşya gideri diğer aylarda olmayan artış yaratabilir. Yıllık incelemede bunu düzenli aylık alışkanlıktan ayır. Yeni yıl her ay aynı gider olacakmış gibi planlama; yenileme ihtimali varsa ayrı hedef aç.",
      "pitfall": "Tek bir sıra dışı ayı bütün yılın modeli saymak.",
      "steps": [
        "12 aylık toplamları incele",
        "Tek seferlik olayları işaretle",
        "Gelecek yıl için gerçekçi plan kur"
      ],
      "sources": [
        "cashflow"
      ],
      "related": [
        "monthly-review",
        "saving-rate"
      ],
      "tool": null,
      "minutes": 3,
      "quiz": {
        "question": "Yıllık kontrolde tek seferlik gider nasıl ele alınır?",
        "options": [
          "Düzenli giderlerden ayrılarak.",
          "Her ay aynı tutar tekrarlanacak diye.",
          "Gerçekleşmiş kayıttan silinerek."
        ],
        "correct": 0,
        "explanation": "Düzenli giderlerden ayrılarak. Tek bir sıra dışı ayı bütün yılın modeli saymak."
      },
      "group": "Kendi finansını değerlendir",
      "moduleId": "review",
      "outcomes": [
        "Yıllık kontrol, tek bir ayın sıra dışı giderini uzun dönemle birlikte görmeyi sağlar.",
        "Sık karıştırılan noktayı fark etmek: Tek bir sıra dışı ayı bütün yılın modeli saymak."
      ]
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
    },
    {
      "name": "Deflasyon",
      "text": "Genel fiyat düzeyinin düşmesi; tek bir ürünün ucuzlaması değildir."
    },
    {
      "name": "Vade",
      "text": "Ödemenin yapılacağı veya yatırımın tutulacağı süre/tarih."
    },
    {
      "name": "Efektif maliyet",
      "text": "Faiz, ücret ve ödeme zamanını birlikte dikkate alan maliyet yaklaşımı."
    },
    {
      "name": "Ekstre",
      "text": "Kartın belirli dönem hareketlerini, borcunu ve ödeme bilgilerini gösteren belge."
    },
    {
      "name": "Ana para",
      "text": "Borç alınan veya yatırıma konulan başlangıç tutarı; faizden ayrıdır."
    },
    {
      "name": "Risk kapasitesi",
      "text": "Finansal koşullarının bir kaybı karşılayabilme gücü; hissettiğin risk isteğinden farklı olabilir."
    },
    {
      "name": "Risk toleransı",
      "text": "Dalgalanma ve kayıp karşısında psikolojik olarak kabul edebildiğin düzey."
    },
    {
      "name": "Yoğunlaşma riski",
      "text": "Paranın büyük kısmının aynı varlık, kurum veya benzer etkenlerde toplanması."
    },
    {
      "name": "FOMO",
      "text": "Bir fırsatı kaçırma korkusuyla acele karar verme eğilimi."
    },
    {
      "name": "Volatilite",
      "text": "Fiyat değişkenliği; yatırımın tüm risklerini tek başına açıklamaz."
    },
    {
      "name": "Yatırım fonu",
      "text": "Birden çok yatırımcının varlığını fon kuralları içinde yöneten ortak yapı."
    },
    {
      "name": "Tahvil",
      "text": "İhraççıya borç verme ilişkisini temsil eden menkul kıymet."
    },
    {
      "name": "Temettü",
      "text": "Şirketin dağıttığı kâr payı; tutarı ve sürekliliği garanti değildir."
    },
    {
      "name": "BES",
      "text": "Bireysel emeklilik sistemi; koşullar ve kesintiler güncel resmi kaynaklardan incelenir."
    },
    {
      "name": "Mevduat sigortası",
      "text": "Kapsam ve limit koşulları dahilinde mevduat için koruma mekanizması."
    },
    {
      "name": "Kimlik avı",
      "text": "Sahte mesaj veya sayfayla şifre, kimlik ya da ödeme bilgisini ele geçirme girişimi."
    }
  ],
  "books": [
    {
      "id": "housel",
      "title": "The Psychology of Money",
      "author": "Morgan Housel",
      "note": "Yayınevi tanıtımı kitabın para kararlarında davranış, kişisel deneyim ve bakış açısının rolünü ele aldığını belirtir. Bu bir yazarın yaklaşımıdır; yatırım getirisi veya her durumda geçerli bir kural değildir. Burada kitabın metni çoğaltılmaz ve yazara ait uydurma alıntı verilmez.",
      "url": "https://www.harriman-house.com/authors/morgan-housel/the-psychology-of-money/9780857197689"
    }
  ],
  "modules": [
    {
      "id": "basics",
      "title": "Paranın temelleri",
      "description": "Bakiye, gelir, varlık ve borcu ayır.",
      "order": 1,
      "chapters": [
        "money-map",
        "money-purpose",
        "income",
        "spending",
        "net-worth",
        "liabilities"
      ]
    },
    {
      "id": "budget",
      "title": "Bütçeni kur",
      "description": "Gelirine ve ödeme tarihlerine uygun plan oluştur.",
      "order": 2,
      "chapters": [
        "budget-plan",
        "budget-methods",
        "needs",
        "fixed-variable",
        "cash-flow",
        "irregular",
        "annual-costs"
      ]
    },
    {
      "id": "habits",
      "title": "Harcama alışkanlıkları",
      "description": "Küçük harcamaları, abonelikleri ve kararlarını değerlendir.",
      "order": 3,
      "chapters": [
        "small-spending",
        "impulse",
        "purchase",
        "subscriptions",
        "lifestyle",
        "money-emotions"
      ]
    },
    {
      "id": "saving",
      "title": "Birikim ve hedefler",
      "description": "Acil durum tamponunu ve ulaşılabilir hedefleri planla.",
      "order": 4,
      "chapters": [
        "emergency",
        "goals",
        "automatic-saving",
        "goal-priority",
        "protect-saving"
      ]
    },
    {
      "id": "banking",
      "title": "Bankacılık",
      "description": "Hesap, faiz, ücret ve güvenli transferi öğren.",
      "order": 5,
      "chapters": [
        "bank-accounts",
        "deposit",
        "simple-interest",
        "compound",
        "bank-fees",
        "transfers",
        "account-security"
      ]
    },
    {
      "id": "debt",
      "title": "Kart ve borç",
      "description": "Ekstreyi, taksiti ve toplam kredi maliyetini anla.",
      "order": 6,
      "chapters": [
        "cards",
        "statement",
        "minimum",
        "card-interest",
        "installments",
        "loan-cost",
        "debt-methods",
        "guarantor"
      ]
    },
    {
      "id": "economy",
      "title": "Ekonomiyi anla",
      "description": "Fiyat, satın alma gücü, kur ve reel getiriyi ayır.",
      "order": 7,
      "chapters": [
        "inflation",
        "disinflation",
        "deflation",
        "purchasing-power",
        "real-return",
        "currency",
        "central-bank",
        "economic-news"
      ]
    },
    {
      "id": "preparation",
      "title": "Yatırıma hazırlan",
      "description": "Vade, risk, likidite ve masrafı birlikte değerlendir.",
      "order": 8,
      "chapters": [
        "saving-investing",
        "risk",
        "risk-capacity",
        "horizon",
        "liquidity",
        "diversification",
        "fees",
        "investment-checklist"
      ]
    },
    {
      "id": "products",
      "title": "Yatırım araçları",
      "description": "Araçların işleyişini ve farklı risklerini tanı.",
      "order": 9,
      "chapters": [
        "stocks",
        "bonds",
        "funds",
        "etfs",
        "gold",
        "fx-investment",
        "real-estate",
        "bes",
        "crypto-risk"
      ]
    },
    {
      "id": "behavior",
      "title": "Yatırım davranışları",
      "description": "FOMO, kalabalık etkisi ve geçmiş getiri tuzaklarını gör.",
      "order": 10,
      "chapters": [
        "regular-investing",
        "long-term",
        "timing",
        "fomo",
        "herd",
        "past-returns",
        "portfolio-review"
      ]
    },
    {
      "id": "decisions",
      "title": "Büyük kararlar",
      "description": "Konut, araç, eğitim ve sigortada toplam maliyeti tart.",
      "order": 11,
      "chapters": [
        "buy-rent",
        "car-cost",
        "education-cost",
        "insurance",
        "retirement",
        "family-money"
      ]
    },
    {
      "id": "turkey",
      "title": "Türkiye’de finans",
      "description": "Kurumları, haklarını ve güncel bilgi kaynaklarını tanı.",
      "order": 12,
      "chapters": [
        "institutions",
        "deposit-insurance",
        "taxes",
        "consumer-rights",
        "complaint"
      ]
    },
    {
      "id": "security",
      "title": "Dolandırıcılıktan korun",
      "description": "İddiaları doğrula, sahte platform ve mesajları fark et.",
      "order": 13,
      "chapters": [
        "fraud",
        "platform-scams",
        "social-advice",
        "phishing",
        "pyramid",
        "verify-sources"
      ]
    },
    {
      "id": "review",
      "title": "Kendi finansını değerlendir",
      "description": "Aylık/yıllık kontrol ve temel oranları yorumla.",
      "order": 14,
      "chapters": [
        "monthly-review",
        "saving-rate",
        "debt-burden",
        "emergency-cover",
        "wealth-trend",
        "annual-review"
      ]
    }
  ]
};if(typeof module!=='undefined'&&module.exports)module.exports=handbook;else root.NeroHandbook=handbook;})(typeof window!=='undefined'?window:globalThis);
