# Nero 6.6.2 kıyafet entegrasyonu

Bu kaynak paketi 6.6.1 final tabanına dayanır ve 6.6.2 olarak paketlenir. Kıyafet değişikliklerinin listesi CHANGELOG-WARDROBE-INTEGRATION.md içindedir.

## Çalıştırma

```sh
npm ci
npm start
```

## Test

```sh
npm test
```

## Windows kurulumu oluşturma

Windows üzerinde:

```sh
npm run dist
```

Kıyafet SVG katmanları hazırdır. Yeniden oluşturmak için `npm run wardrobe:build` kullanılabilir.

Orijinal çizimler ve ölçü profilleri `themes/default/assets/wardrobe` dizinindedir. Beden ve giysi çizimi birlikte kullanılır; orijinal mimikler ayrı katmanlardır. Kıyafet değişimi karakterin hareket sistemini değiştirmez.

Paket yalnızca kaynakları içerir. İç içe eski kaynak ZIP'leri, node_modules ve eski derlenmiş kurulum dosyaları dahil edilmemiştir. 6.6.2 sürüm numarası kullanılır.
