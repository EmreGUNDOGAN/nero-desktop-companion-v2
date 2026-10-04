# Nero 6.6.4 kaynak paketi

6.6.3 kaynak üzerine 100 yeni kıyafet, beş dolap sekmesi ve 13 hareket eklenmiştir. Değişiklikler: [CHANGELOG-6.6.4.md](CHANGELOG-6.6.4.md). Kıyafet adları: [docs/WARDROBE-100.md](docs/WARDROBE-100.md).

## Çalıştırma

Node.js 22 ve npm ile proje dizininde:

```sh
npm ci
npm test
npm start
```

Windows setup üretmek için `npm run dist` kullanın. Hazır exe bu kaynak paketine dahil değildir.

## Kullanım

Ayarlar → Nero’nun dolabı. Beş temadan kıyafet seçimi masaüstündeki Nero'ya uygulanır. Otomatik kıyafet, eski gece/kış kurallarını kullanır. Kıyafetleri çıkar seçeneği çıplak temel çizime döner; doğum günü otomatik kıyafeti önceliklidir.

Hareketleri dene bölümünde 13 hareket bulunur. Nero uyuyorsa, gizliyse, sürükleniyorsa veya tema desteklemiyorsa oynatma yapılmaz. Kızgınlık bekleme süresinde sevilme ve utanma hareketi engellenir. Yeni hareketler ayardan kapatılabilir.

## Görsel yapı

Canlı çizim `src/renderer/character/wardrobe-rig.js`, hareketler `motion-player.js`, katalog `src/shared/wardrobe-catalog.js` içindedir. Orijinal yüz SVG'leri kullanılır; gövde ve kol giysileri ayrı hareketli gruplara bağlıdır. `wardrobe/*.svg` dosyaları saydam, kıyafet-only katalog görselleridir; karakterin yerine konan fotoğraflar değildir.

Katalog ve hareket şablonunu yeniden üretmek için Python 3 ile:

```sh
python scripts/wardrobe/build_catalog.py
python scripts/wardrobe/build_rig.py
```

`approved-retro.json` onaylanan ölçüleri, `approved-motion.html` hareketlerin kaynak önizlemesini içerir. `visual_check.js` isteğe bağlı geliştirici kontrolüdür ve ayrıca `sharp` gerektirir; uygulamanın çalışması için gerekli değildir.

## Test kapsamı

266 otomatik test; 100 SVG'nin XML kontrolü ve statik toplu önizleme incelemesi. Windows/Electron canlı görsel testi ve setup derlemesi yapılmadı. Özellikle ölçek, tema değişimi, dans sırasında kol/gövde birleşimleri, göz kırpma/konuşma ve pencere kenarındaki hareketler Windows'ta denenmelidir.

Kaynaklar, temalar, derleme varlıkları, testler, kilit dosyası ve Actions tanımı dahildir. node_modules, derlenmiş exe ve eski iç içe arşivler dahil değildir. GitHub'a commit/push yapılmadı.
