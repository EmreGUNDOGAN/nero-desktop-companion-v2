# Nero 6.6.3 kaynak paketi

Bu paket, kullanıcı tarafından bu görüşmede sağlanan 6.6.1 kaynağı üzerine uygulanmış hata düzeltmeleridir. Ayrı bir 6.6.2 sürümünün değişikliklerini içerdiği iddia edilmez.

## Çalıştırma

Node.js 22 ve npm kurulu bir ortamda:

```sh
npm ci
npm test
npm start
```

Windows kurulum paketi üretmek için:

```sh
npm run dist
```

Kaynak kod, tema/görsel dosyaları, kilit dosyası, testler ve derleme kaynakları dahildir. node_modules, eski iç içe kaynak arşivleri ve derlenmiş setup dosyaları dahil değildir.

Değişiklikler: CHANGELOG-6.6.3.md. Test sonuçları: TEST-RESULTS-6.6.3.txt.
