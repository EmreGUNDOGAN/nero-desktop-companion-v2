# Yeni kıyafet koleksiyonunun kaynakları

`designs.json`: her biri ayrı çizilmiş 100 kıyafetin kimliği, adı, kategorisi ve tasarım tarifi.
`image-prompt.txt`: yerleşik görsel üretim aracına verilen ortak tarif. `DETAIL` alanı ilgili tasarımın `detail` değeriyle değiştirilir. Referans: eski `outfit-daily-kot-ceket.png`.

Üretim sırasında oluşturulan yüksek çözünürlüklü görsellerden oyunun 220×260 çalışma alanına alınmış, şeffaf ve yüzü boş gövdeler her yeni kıyafet klasöründe `original-blank.png` olarak bulunur. Bunlar eksiksiz yeniden derleme girdileridir. Aynı klasördeki `body.svg` bu gövdeyi içerir; gözler, göz kapakları, kaşlar ve ağız ayrı SVG katmanlarıdır. Dolap portreleri yalnızca önizleme içindir.

Uygulamayı çalıştırmak için görselleri yeniden üretmek gerekmez:

```sh
npm ci
npm test
npm start
```

Yeni görsel katmanlarını veya geliştirici kontrol görsellerini yeniden oluşturmak için isteğe bağlı `sharp` çizim bağımlılığı gerekir:

```sh
npm install --no-save sharp
npm run wardrobe:build-new
node scripts/wardrobe-v665/contact-sheet.js
node scripts/wardrobe-v665/preview-deform.js
```

`build-assets.js` önce mevcut `original-blank.png` girdisini kullanır; eski 88 kıyafeti yeniden çizmez. `original-hashes.json` eski dosyaların SHA-256 değerlerini saklar. Testler katalog dışındaki tüm eski görsel dosyalarının değişmediğini doğrular.

`preview-deform.js` bağlı hareket yüzeyinin durağan pozlarını yazılımsal olarak çizer. Bu çıktı canlı Electron/WebGL testinin yerine geçmez.

`check-release.js`, beş temada yirmişer yeni kıyafet, toplam 188 katalog girdisi ve tüm katman dosyaları tamamlanmadan sürüm paketlemesini durdurur.
