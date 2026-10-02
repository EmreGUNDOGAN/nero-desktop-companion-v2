# Nero Arıcılık — Paket 06 / 6.5.0

Durum: **KİLİTLİ VE KODLANIYOR**

Bu paket 2 Ekim 2026'da kullanıcı tarafından birlikte onaylanan üç maddeyi içerir.

## 1. Merkezi Depo — KİLİTLİ

Haritadaki mevcut Depo binası artık çiftliğin merkezi envanteridir. Binaya tıklanınca mevcut Bee UI diliyle ayrı panel açılır.

Sekmeler:
- **🍯 Bal:** bal türleri, toplam kg, siparişe ayrılmış ve kullanılabilir stok. Yalnız bal, kg kapasitesini tüketir.
- **🌿 Arıcılık:** Balmumu, Polen, Propolis, Arı Sütü. Bunlar bal kapasitesini tüketmez.
- **🌱 Tohumlar:** satın alınan ve hediye edilen bütün tohumlar aynı stokta tutulur. Ekim stoktan tüketir.
- **🪴 Dekorlar:** satın alınan dekor önce Depo'ya gider. Depodan yerleştirilir; haritadan kaldırılırsa para iadesi yerine Depo'ya döner.
- **🫙 Ürünler:** Mumlar ve Atölye'nin tamamladığı tüm işlenmiş ürünler. Kovan ürünleri buradan uygulanır, ticari ürünler buradan satılır.

Atölye artık tamamlanmış ürünleri kendi panelinde ikinci bir envanter olarak tutmaz; **Atölye üretir → ürün Depo'ya gider** mantığı kullanıcıya gösterilir.

## 2. Seyyah Yakup Bal Alım Farkı — KİLİTLİ

- Yakup'un aradığı bal için standart alım farkı **pazarın +%15'i** olacak.
- Backend katsayısı ve bütün görünen metinler aynı değeri kullanacak.
- Seyyah Satış Fişi'nin ayrıca verdiği +%10 ödeme mevcut kuralıyla korunur.

## 3. Fiziksel Arıcılık Atölyesi — KİLİTLİ

- Kullanıcının paylaştığı ekran görüntüsünde işaretlenen çiftlik yanındaki kare Atölye alanıdır.
- Teknik sabit alan: **`-1,2`**.
- Atölye binası oyunun başından itibaren haritada görünür.
- Alan rezerve edilir; tohum, kovan, dekor veya arazi yerleştirmesi bu kareyi kullanamaz.
- Eski bir kayıtta kare doluysa içerik kaybolmadan uygun başka bir boş alana taşınır.
- Atölye başlangıçta **kilitli/pasif** görünür.
- Binaya tıklanınca Atölye paneli açılır ve Mumcu'nun köye gelmesi gerektiğini söyler.
- **Mumcu (30)** geldikten sonra aynı bina aktif görünür ve gerçek Atölye panelini açar.
- Bina mevcut low-poly sıcak çiftlik sanat diliyle özel olarak tasarlanır; aktif durumda ürün detayları ve baca dumanı ile canlanır.
