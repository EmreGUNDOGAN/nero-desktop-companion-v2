# Nero Tema Rehberi

Nero temaları karakterin görsel katmanlarını ve tema metadatasını bir arada tutar.

## Yapı

Her tema `themes/<tema-adı>/` altında bulunur:

```text
theme.json
assets/
  body.svg
  eyes.svg
  pupils.svg
  brows-*.svg
  lids-*.svg
  mouth-*.svg
  fx-*.svg
  outfit-pajama.svg
```

Tema tanımını değiştirirken mevcut `theme.json` dosyalarından birini şablon olarak kullan. Dosya adları renderer tarafından beklenen katmanlarla uyumlu kalmalıdır.

## Kullanıcı temaları

Kullanıcı tarafından eklenen temalar `%APPDATA%\Nero\themes\<tema-adı>\` altında tutulabilir. Uygulama içinden **Temaları yenile** komutu kullanıldıktan sonra yeni tema seçilebilir.

## Tasarım ilkeleri

- SVG viewBox ve karakter hizasını mevcut temalarla uyumlu tut.
- Şeffaf alanları gereksiz büyütme; hit-testing davranışını etkileyebilir.
- Yüz katmanlarının aynı koordinat sisteminde olduğundan emin ol.
- Varlık adlarını değiştirmek yerine yeni tema klasörü oluştur.
- Üçüncü taraf görsellerin lisanslarını repoya eklemeden önce kontrol et.
