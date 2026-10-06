# 6.8.1 — Arıcının Evi + Çiçekçi Ezgi İç Mekânları

## Arıcının Evi

- Ev içi haritadaki köy evleriyle aynı 3D parça kitiyle (`evler/kit.js`) çizilen izometrik, düşük poligon diorama olarak korunur.
- Bal rafı, kupalar, mektuplar, açık defter, takvim ve hatıra panosu gerçek oyun verilerine bağlıdır.
- Nero oda içinde yer alır; ev ilerlemesine bağlı ek dekorlar korunur.
- İlgili objelere tıklamak Bal Defteri sekmelerini açar.

## Çiçekçi Ezgi

- Çiçekçi Ezgi'nin binasına tıklayınca küçük popup yerine dükkânın içi açılır (`gorsel/cicekci-ici.js`).
- İç mekân oyunun kendi 3D parça kiti, izometrik kamera ve düşük poligon görsel diliyle çizilir.
- Tezgâhta Kurutulmuş Lavanta, Kekik Demeti ve Çiçek Karışımı gerçek fiyat/stok verileriyle gösterilir.
- Ürüne tıklamak mevcut satın alma eylemini kullanır; fiyat, stok ve jeton kontrolü oyun motorunda kalır.
- Tohum rafı Mağaza > Tohumlar sekmesini açar; bekleyen hoş geldin hediyesi odada görünür ve alınabilir.
- Ezgi tezgâhın arkasında görünür; ilişki ve indirim bilgileri mevcut oyun verisinden gelir.

- Yeni test: `test/florist-interior.test.js`.
