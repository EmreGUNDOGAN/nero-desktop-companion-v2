# Premium Black — Nero 9.6.7 kaynak kodu

Finansın sekiz sayfası referans görseldeki çizgi grafikleri, boşluklu halkalar, hedef satırları ve kapsül eylemleriyle yeniden tasarlandı. Tema adı Premium Black.

## Çalıştırma

Node.js ve npm kurulu ortamda proje klasöründe:

```
npm ci
npm start
```

Nero içinde Bütçe → Finans ayarları → Finans görünümü → Premium Black seçin. Windows kurulum paketi için `npm run dist`.

Kaynak ZIP'i bağımlılıklar ve derlenmiş kurulum dosyası içermez.

## Tasarım ve kontroller

`DESIGN.md` tasarım yapısını; `docs/9.6.7-PREMIUM-BLACK-VALIDATION.md` test kapsamını açıklar. `docs/premium-black-screens/` gerçek uygulamadan alınan sekiz sayfa ve diyalog görüntülerini içerir. Görsel kayıtlar yalnız geçici test verileridir; uygulamaya örnek hesap veya işlem eklenmez.

340 test ve 2.496 arayüz yerleşim kontrolü geçti.
