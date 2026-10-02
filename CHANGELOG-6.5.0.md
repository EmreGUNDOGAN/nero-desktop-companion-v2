# Nero 6.5.0 — Merkezi Depo ve Fiziksel Atölye

## 📦 Merkezi Depo
- Haritadaki mevcut **Depo binası artık tıklanabilir** ve çiftliğin merkezi envanter panelini açar.
- Depo 5 sekmeye ayrıldı: **Bal · Arıcılık · Tohumlar · Dekorlar · Ürünler**.
- Yalnızca **bal**, mevcut kg depo kapasitesini kullanır.
- Bal sekmesi tür bazlı stokla birlikte kabul edilmiş siparişlere ayrılmış ve serbest miktarı gösterir.
- Arıcılık sekmesi Balmumu, Polen, Propolis ve Arı Sütü stoklarını gram olarak gösterir.
- Tohumlar sekmesi satın alınan ve hediye edilen bütün tohumları tek stokta tutar; ekim bu stoktan tüketir.
- Dekorlar sekmesi satın alınan dekorları saklar. Mağazadan alınan dekor artık doğrudan yerleştirme moduna geçmez; önce Depo'ya gider.
- Haritadan kaldırılan dekor artık yarı fiyat iadesi vermez; **Depo'ya geri döner**.
- Ürünler sekmesi Mumları ve Arıcılık Atölyesi'nin tamamladığı işlenmiş ürünleri gösterir. Kovan ürünleri buradan uygulanır, ticari ürünler buradan satılır.
- Pazar ekranından merkezi Depo'ya geçiş eklendi.

## 🔨 Fiziksel Arıcılık Atölyesi
- Kullanıcının seçtiği çiftlik yanındaki **-1,2** karesi artık kalıcı Atölye alanıdır.
- Atölye binası oyunun başından itibaren haritada görünür.
- Bu kare satın alınamaz ve üzerine kovan, tarh veya dekor yerleştirilemez.
- Eski bir kayıtta bu kare kullanılmışsa oyuncunun içeriği kaybolmadan en yakın uygun boş alana taşınır.
- Atölye kilitliyken bina daha sakin/kapalı görünür ve tıklandığında **Mumcu köye gelince açılacağı** mevcut panelde gösterilir.
- Mumcu geldikten sonra aynı bina aktif hale gelir; pencereler/işlik detayları ve baca dumanıyla canlanır.
- Atölye tamamladığı ürünleri artık kullanıcıya **Depo → Ürünler** üzerinden sunar.

## 🛒 Seyyah Yakup
- Yakup'un aradığı bal için standart alım fiyatı artık **pazar fiyatının +%15'i**.
- Backend fiyat katsayısı ve ekrandaki açıklama aynı değere bağlandı.
- Seyyah Satış Fişi'nin ayrıca verdiği **+%10** ek ödeme korunur.

## 🌱 Mağaza ve envanter akışı
- Mağazadan alınan tohumlar Depo stokuna gider; haritaya ekim yalnız stoktan yapılır.
- Hediye tohumlar aynı Depo stoğunda görünür.
- Mağazadan alınan dekorlar Depo stokuna gider ve yalnız **Depo → Dekorlar → Yerleştir** yoluyla haritaya çıkar.
