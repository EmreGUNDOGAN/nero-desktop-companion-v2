# Nero · Üç yeni tema

Arcade Molası, Yörünge ve Serada Bir Gün, Nero'nun mevcut Electron uygulamasına eklenmiştir. Tema seçimi: **Ayarlar → Görünüm → Tema**. Biletini Sakla ve önceki temalar da pakettedir.

## Çalıştırma

ZIP'i bir klasöre çıkar, o klasörde terminal aç:

```sh
npm ci
npm start
```

Node.js ve npm gereklidir. Sürüm **9.6.8**. Paket eski 6.7.9 tabanından geldi; yeni tema eklemeleri güncel 9.6.8 kaynak üzerine birleştirildi. Finans modülü, mevcut temalar, görev sıralama/alt görevler, oyun ve gardırop korunur. GitHub Actions çıktısı setup EXE, blockmap, latest.yml, tam kaynak ZIP’i ve changelog içerir. Kaynaktan Windows kurulumunu oluşturmak için `npm run dist` kullanılır.

## Tasarım ve kaynaklar

- Arcade: piksel kabin çerçevesi, CRT mesaj konsolu, bağımsız oyun kabini, kartuş notlar, canlı blok grafik ve şehir sahneli odak konsolu.
- Sera: sarmaşıklı pirinç çerçeve, sera sahneleri, botanik tabelası, üç bitki illüstrasyonu, çizgili defter ve pirinç odak saati.
- Yörünge: yıldız haritası, ay ve uydu, yörünge çizimi, ay yüzeyi ve canlı ilerleme halkalı sayaç.

19 dekoratif görsel ve ikon atlası yerel PNG dosyalarıdır. Her temada 16 ikonluk ayrı bir atlas vardır. Metinler, grafik değerleri, görevler ve sayaç uygulamanın gerçek durumundan gelir. Tek bir ekran görüntüsünü arayüz gibi kullanmaz. Bu üç temanın arayüzü mevcut HTML/CSS/JavaScript bileşenlerini kullanır. Güncel sürümdeki React/Chart.js Canvas finans arayüzü ve bağımlılıkları da korunmuştur.

Altı ana görünüm (**Bugün, Notlar, İşler, Sayaç, Rozetler, Ayarlar**) ve not düzenleyici, arşivler, boş durumlar, hızlı kayıt, karakter konuşması ve sayaç rozeti temaya uyarlanmıştır. Ekran dar veya kısa olduğunda içerik kaydırılır.

- `themes/<tema>/assets/`: tüm yeni çizimler ve ikon atlasları.
- `src/renderer/panel/theme-trio.css` ve `theme-trio.js`: tema düzeni ve canlı bileşenler.
- `docs/theme-trio/references/`: onaylanan tasarım referansları.
- `docs/theme-trio/ASSETS.json`: boyutlar ve SHA-256 özeti.
- `docs/theme-trio/IMAGE-PROMPTS.json`: görsel üretim kayıtları.
- `docs/theme-trio/DESIGN-LOCK.md`: sonraki çalışmalar için ayrıntı ve doğrulama kuralları.
- `preview.html`: gerçek uygulama ekranlarından hazırlanan, çevrimdışı açılan galeri.

## Doğrulama

`npm test` mevcut test paketini çalıştırır. Ek Electron kontrolleri:

```sh
npx electron test/theme-trio-ui-smoke.js
npx electron test/theme-trio-character-smoke.js
```

Arayüz kontrolü üç temada altı ekranı dört boyut/ölçek kombinasyonunda dener (72 kontrol). Not kaydetme/arşivleme, iş ekleme/tamamlama, gerçek Timer sınıfı ile başlatma/duraklatma/devam/iptal, 10 saatlik özel süre, rozet kategorileri, kavanoz, klavye sekme geçişi, eski temalara dönüş, boş veriler ve hızlı kayıt da denetlenir. Karakter kontrolü üretimdeki preload ile katmanların yüklenmesini, konuşma balonunu ve sayaç rozetini dener.

9.6.8 entegrasyon kontrolleri: `docs/9.6.8-VALIDATION.md`. Tema kontrol sonuçları `docs/theme-trio/*verification.json`, ekran görüntüleri `docs/theme-trio/screens/` içindedir. Test verileri ayrı fixture içindedir; üretim kodu örnek not veya görev oluşturmaz. Ekran görüntülerindeki kayıtlar yalnızca bu örnek verilerdir. Windows kurulumu ve gerçek Windows masaüstü davranışları bu Linux ortamında ayrıca doğrulanmamıştır.
