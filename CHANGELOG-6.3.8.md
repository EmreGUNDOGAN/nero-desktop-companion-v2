# Nero 6.3.8 — 90'lar Kırtasiye Asset Testi

Bu patchte yalnızca **90'lar Kırtasiye** program teması yeniden ele alındı. Diğer yeni temalara dokunulmadı.

## Yeni tema mimarisi

- Tema artık tek büyük `background-size: cover` sahnesi kullanmıyor.
- Kalem kutusu, kalemler, washi bantlar, ataçlar, stickerlar, kaset, spiral ve sticky note ayrı ayrı gerçek asset dosyaları.
- Assetler CSS'te kendi ölçüleriyle ve kendi konumlarıyla kompoze ediliyor.
- Pencere büyüyüp küçüldüğünde objeler tek bir dev resim gibi kesilmiyor veya anlamsız biçimde büyümüyor.
- Ana ekran, sayaç ve çalışma ekranlarında aynı asset seti farklı kompozisyonlarla kullanılıyor.

## Görsel dil

- Pastel pembe, mint, lila, açık mavi ve sarı palet.
- Defter çizgileri / kareli kağıt hissi.
- Dört ana istatistik kartı ayrı pastel kırtasiye kartları.
- Tema başlığı ayrı gingham asset.
- Ana kart ikonları ayrı SVG assetleri.

## Rozetler

- Mevcut rozet sistemi, ikonlar, SVG'ler, ölçüler ve yerleşim korunuyor.
- Yalnız klasik dairesel rozet arka planı 90'lar Kırtasiye pastel paletinde dönüşümlü renklendiriliyor.

## Güvenlik

- Resize tutamaçları yine `position:absolute` ve etkileşimli.
- Sekme sırası ve temel Nero HTML düzeni değiştirilmedi.
- Tema için yeni regresyon testleri eklendi.
