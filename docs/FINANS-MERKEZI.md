# Finans Merkezi — Nero 9.6.8

Kullanıcının sağladığı `financial-dashboard.tsx` bileşeni ve ardından paylaştığı koyu ekran referansı, sekiz Bütçe sekmesine yeni bir seçenek olarak uygulanmıştır. Finans ayarları → Finans teması → **Finans Merkezi** seçilir. Nero, Modern finans, Kartlı finans ve Premium Black seçenekleri de kullanılabilir. Tema seçimi kullanıcı kayıtlarını değiştirmez; Bütçe'den çıkınca genel Nero görünümü döner.

## Sekmeler

- **Özet:** Çalışan işlem araması, Ctrl+K, gelir/gider/transfer/hesap hızlı işlemleri; son kayıtlar, finans araçları, gerçek günlük akış ve bekleyen ödemeler. Mevcut para, beklenen gelir ve taksit borcu ayrı tutulur.
- **İşlemler:** Düzenli kayıt listesi; tür, hesap, kategori, tarih, tutar ve sıralama filtreleri. Şablon, CSV, iade, silinen kayıtlar ve işlem istatistikleri korunur.
- **Hesaplar:** Nakit/banka/kart kartları, bakiyeler, rezervler, kart ekstresi ve ödeme; kategori ve kur yönetimi.
- **Birikim ve bütçe:** Gerçek hedef dağılımı, ilerleme, para ayırma/geri alma ve aylık harcama limitleri.
- **Ödemeler:** Yaklaşan/gecikmiş kayıtlar, gelir/gider filtresi, ödeme/geri alma, düzenli kayıtlar ve haftalık akış.
- **Raporlar:** Gerçek aylık eğilim, kategori halkası, aylık değerlendirme, büyük harcamalar, değişiklik geçmişi, CSV/PDF.
- **Takvim:** Ay okları, bugün ve bekleyen kayıt göstergeleri; tıklanan günün ödeme ve kart ayrıntıları.
- **Finans Akademisi:** Mevcut 94 ders, okuma ilerlemesi, arama, kaydedilenler, ders adımları, sözlük ve hesaplayıcılar.

Ayarlar, yeni/düzenlenen işlemler, hesaplar, limitler, hedefler, planlar, taksitler, bildirimler, yardım, marka seçimi ve ders pencereleri ortak koyu tema tokenlarını kullanır.

## Tasarım ve referans

Esas referans kullanıcının paylaştığı React bileşenidir. Kullanıcının koyu referansından ölçülen renkler kullanılır: #0a0a0a dış zemin, #171717 kart, #262626 ikon alanı, #2e2e2e kenarlık, #fafafa yazı ve #a1a1a1 ikincil yazı. Gelir tutarı #05df72, gider tutarı #ff6467; etiket zeminleri #15291d ve #2e191a. Bileşende açıkça belirtilen gelir yeşili ve gider kırmızısı korunur; ana yeşil vurgu eklenmez. Dar pencerede hızlı eylemler iki, geniş pencerede dört sütundur. Tasarım dili: antrasit yüzey, ince kenarlık, yuvarlak ikon, arama, hızlı eylem ızgarası, hizalı işlem tutarı ve yönlendiren hizmet satırları. Örnek dolar tutarları ve yatırım/danışmanlık demo hizmetleri ürüne eklenmez. Veri yokken açıklamalı boş durum vardır; önizlemelerdeki kayıtlar sadece geçici test ortamına aittir. Unsplash fotoğrafları bu bileşende ihtiyaç olmadığı için eklenmemiştir. Nero'nun mevcut 100 çevrimdışı marka ikonu korunmuştur.

Yeni bölüm yapıları, aynı bileşen ailesini kullanır. Dar masaüstü panelde dört sütunlu iki sıra sabit menü ve tek sütun içerik vardır. 760 pikselden itibaren sol menü, 1040 pikselden itibaren iki sütun içerik kullanılır. Küçük pencerede okunabilirlik için hızlı eylemler iki sütuna döner. Gerektiğinde içerik kaydırılır; sabit menü yerinde kalır. Azaltılmış hareket tercihi desteklenir. Tıklanabilir eylemler gerçek düğmelerdir; arama ve ikon düğmeleri etiketlidir.

Teknik kaynaklar:

- https://ui.shadcn.com/docs/installation/manual — mevcut projeyi yeniden oluşturmadan component/alias yapısı.
- https://tailwindcss.com/docs/installation/using-postcss — yerel derlenen Tailwind CSS.
- https://motion.dev/docs/react-accessibility — azaltılmış hareket tercihine uyum.

## Düzenlenebilir kaynak ve çalıştırma

```text
src/renderer/panel/
  components/ui/financial-dashboard.tsx  # kullanıcının bileşeninin Nero uyarlaması
  lib/utils.ts                          # clsx + tailwind-merge
  financial/index.tsx                   # sekiz sayfa, ortak kart/ikon/grafik yapısı
  financial/tailwind.css                # Tailwind kaynak dosyası
  budget-financial.css                 # görünüm tokenları, masaüstü ve diyaloglar
  budget-financial-tailwind.css         # yerel derlenmiş, yalnız bu temaya uygulanan utility stilleri
  budget-financial-app.js               # yerel derlenmiş üretim paketi
```

`components/ui` proje köküne değil mevcut renderer içine yerleştirilmiştir; masaüstü arayüz kaynakları bu ağaçtadır. `@/components/ui` aliası bu klasörü gösterir. `components.json`, TypeScript ve Tailwind kaynakları shadcn yapısını tanımlar. Yeni proje oluşturmak gerekmez. Tailwind preflight tüm Nero'yu değiştirmemek için kullanılmaz; derlenen stiller yalnız yeni finans görünümüne sınırlıdır.

```sh
npm ci
npm start
```

JSX/TSX veya Tailwind kaynaklarında değişiklik yapıldığında:

```sh
npm run finance:check
npm run finance:build
```

Üretim JS/CSS dosyaları kaynak paketine dahildir. Uygulama bunları yerel yükler; tema kullanımı CDN veya API anahtarı gerektirmez. `npm ci` yalnız geliştirme bağımlılıklarını kurar. GitHub yayını ve Actions çalıştırılması bu teslimin parçası değildir.

## Doğrulama

`npm test`: mevcut işlev testleri. `test/financial-dashboard-ui.cjs`: Windows Electron üzerinde geçici kullanıcı verisiyle sekiz sayfanın boş/dolu durumu, formlar, arama, klavye, rezerv, ödeme geri alma, takvim, Akademi, eski temalara dönüş ve yedekten geri yükleme.

Gerçek test ekranları `docs/financial-dashboard-screens` içindedir. `validation.json` ölçülen pencere/ölçek/yazı boyutu kontrollerini listeler. Ekranların test tutarları kullanıcı kayıtlarına veya uygulamanın başlangıç verisine eklenmez. Windows kurulum EXE'si bu kaynak tesliminde yeniden üretilmez.
