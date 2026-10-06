# 6.8.0 — Arıcının Evi: izometrik iç mekân dioraması

- Ev içi artık tek parça illüstrasyon (SVG) değil; haritadaki köy evleriyle aynı 3D parça kitiyle
  (`evler/kit.js`) çizilen, çatısı kaldırılmış tek odalı izometrik diorama (`gorsel/ev-ici.js`).
- Aynı düz gölgeli düşük poligon dil, aynı ortografik kamera, aynı renk paleti (krem, bal sarısı, kahve, adaçayı).
- Altıgen halı, kovan maketi, Nero odada. Odadaki etiketler kaldırıldı; nesnelerin üstüne gelince küçük tooltip çıkar.
- Nesneler gerçek oyun verisine bağlı: bal kavanozları (bal rafı), kupalar, mektup yığını (okunmamış göstergesi),
  açık defter, hatıra panosundaki 3 kart, takvim (oyun günü).
- Ev seviyesi (0–3) odayı büyütür: 2. pencere ve saksılar, ikinci bal rafı ve kasalar, tavan feneri.
- Nesneye tıklamak ilgili Bal Defteri sekmesini açar; alttaki çipler klavye/erişilebilirlik için aynı işi yapar.
- Kaldırıldı: `assets/house/room-*.svg`.
