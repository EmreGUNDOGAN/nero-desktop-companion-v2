# Biletini Sakla

Nero için kâğıt biletler, lacivert mürekkep ve turuncu eylemlerden oluşan yeni tema.

## Açmak

1. Bu ZIP'i yeni bir klasöre çıkar.
2. Klasörde terminal açıp `npm ci`, ardından `npm start` çalıştır.
3. Bu kaynakla çalışan Nero panelinde **Ayarlar → Görünüm → Tema → Biletini Sakla** seç.

Güncellemeyi kullanmak için bu paketi çalıştır veya bu kaynaktan `npm run dist` ile yeniden kurulum oluştur. Panelin yeni CSS/JS bileşenleri de bu pakete dahildir.

Mevcut Nero kayıtları uygulamanın kendi veri klasöründen okunur. Yeni tema bu kayıtlara örnek veri eklemez. Ekran görüntülerindeki notlar ve sayılar yalnızca test oturumuna aittir.

## Tasarım

- Bugün: günlük bilet, tarih/barkod bölümü, odak ve iş özetleri, gerçek haftalık kayıtlarla çizilen sütun grafik, kavanoz ve hızlı eylemler.
- Notlar: yatay bilet listesi, istasyon çizimi, gerçek not önizlemesi ve Saklandı damgası; çizgili not editörü ve arşivler.
- İşler: bilet görev kartları; planlanan süre, hatırlatma, kronometre, tamamlamalar ve arşivler.
- Sayaç: büyük odak bileti, başlat/duraklat/devam et kontrolleri, süre seçimleri, süreyle ilerleyen beş durak ve günlük istatistikler.
- Rozetler ve Ayarlar: aynı kâğıt, tipografi, renkler ve bileşenler; mevcut bütün kontroller korunur.
- Hızlı yakalama, Nero'nun konuşma balonları ve sayaç rozeti de temaya uyum sağlar.

Bütün kontroller mevcut Nero işlevlerine bağlıdır. Önizlemedeki ayrı Mola modu, kaynak uygulamada ayrı bir sayaç türü olmadığı için eklenmedi; mevcut duraklat/devam et işlevi kullanılabilir.

## Kaynak dosyalar

| Dosya | İşlev |
| --- | --- |
| `themes/biletini-sakla/theme.json` | Tema kimliği, renkler ve mevcut Nero karakterinden kalıtım |
| `themes/biletini-sakla/assets/railway-panorama.png` | Tren, dağlar ve ağaçlar içeren şeffaf çizim |
| `themes/biletini-sakla/assets/station-panorama.png` | Notlar başlığındaki şeffaf istasyon çizimi |
| `themes/biletini-sakla/assets/paper-grain.png` | Kâğıt dokusu |
| `src/renderer/panel/biletini-sakla.css` | Yerleşimler, bilet kesikleri, damgalar, grafik görünümü ve uyarlanabilir boyutlar |
| `src/renderer/panel/biletini-sakla.js` | Canlı verilerle güncellenen tema bileşenleri |
| `src/renderer/panel/panel.js` | Tema metinleri ve mevcut render akışındaki küçük bağlantılar |
| `src/renderer/quick/*`, `src/preload/quick-preload.js` | Hızlı yakalamanın tema güncellemeleri |
| `src/renderer/character/character.css` | Konuşma ve sayaç rozetinin görünümü |

Uygulama mevcut Electron + HTML/CSS/JavaScript yapısını kullanır. Tren ve istasyon çizimleri ile kâğıt dokusu gerçek yerel PNG dosyalarıdır; ekranı taklit eden tek parça bir görsel kullanılmaz. Kartlar ve grafik HTML/CSS bileşenleridir. Fontlar da kaynak içinde yereldir; tasarım için CDN veya internet bağlantısı gerekmez.

## Kontroller

- Tema, Nero 9.6.8 içinde mevcut oyun, gardırop ve React/Canvas finans ekranlarıyla birleştirilmiştir.
- Tam Node test paketi ve Windows Electron UI kontrolleri 9.6.8 Actions derlemesinde çalıştırılır.
- `test/biletini-sakla-ui-smoke.js`: gerçek Electron renderer'ında altı ana ekranın 380×660, 440×820, 480×850 ve 900×900 (%125 ölçek) kontrolleri.
- Not oluşturma, Türkçe metin otomatik kaydı, not açma/arşivleme; iş ekleme/tamamlama; gerçek sayaç başlat/duraklat/devam et/iptal, süre ve sıfırlama; kavanoz, yardım, klavye, boş listeler, tema değiştirme ve hızlı yakalama.
- Ekran görüntüleri: `docs/biletini-sakla-screens/`.

Linux başsız görsel kontrol komutu:

```bash
npx electron --no-sandbox --ozone-platform=headless --disable-gpu --disable-software-rasterizer test/biletini-sakla-ui-smoke.js
```

Windows geliştirici oturumunda:

```powershell
npx electron test/biletini-sakla-ui-smoke.js
```

Windows kurulum paketi `npm run dist` ile oluşturulur. GitHub Actions çıktısında setup EXE, blockmap, latest.yml, tam kaynak ZIP’i ve changelog bulunur.

Gönderilen tema paketi eski 6.7.9 tabanından hazırlanmıştır. Tema değişiklikleri 9.6.7 kodlarına eklenmiş; mevcut finans modülü, oyun düzeltmeleri, alt görevler, görev sıralama ve gardırop korunmuştur. Sürüm 9.6.8 olarak güncellenmiştir.
