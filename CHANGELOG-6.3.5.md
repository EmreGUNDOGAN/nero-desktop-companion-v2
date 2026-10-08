# Nero 6.3.5 — Dört Mevsim ve Arıcılık Dengesi

## Arı ekonomisi

- 5. arının alış fiyatı **60 jeton** olarak değiştirildi.
- Sonraki her arının fiyatı bir önceki sıraya göre **%15 artar** ve tam jetona yuvarlanır.
- Fiyat geçmiş satın alma sayısına değil, kovandaki mevcut arı sayısına bağlı kalır; arı ölür veya satılırsa sonraki alış fiyatı geri düşer.
- Arı satış fiyatı ilgili sıranın alış fiyatının **%50'si** olarak korunur.

## Kış ve Seyyah Yakup

- Kış kaynaklı arı kaybı artık oyuncu kovanlarını **4 arının altına düşüremez**. Hastalık sistemindeki 4 arı tabanıyla aynı güvenli sınır kullanılır.
- Seyyah Yakup'un aradığı bal için verdiği fiyat bonusu **pazarın %40 üstünden %20 üstüne** indirildi.

## Arıcılık ekranı

- Sağ alttaki eski/statik Nero kaldırıldı. Yerine ana projedeki **kanonik Nero gövdesi, gözleri, mimikleri ve konuşma animasyonu** kullanılıyor.
- Arıcılık ekranındaki Nero her zaman **kıyafetsiz default görünümde** kalır; pijama, parti veya kış kıyafeti bu köşe karakterine uygulanmaz.
- Alt menüdeki **Hasat Et** altıgeni, diğer menü öğelerini oynatmadan beyaz menünün dikey merkezine alındı.

## Mevsimsel harita

- Harita için dört mevsimli görsel tema genişletildi.
- **İlkbahar:** daha taze yeşil palet, çiçek kümeleri ve çiçeklenmiş ağaçlar.
- **Yaz:** daha güçlü sıcak güneş, daha aydınlık gökyüzü ve canlı bitki tonu.
- **Sonbahar:** sıcak ışık, sarı-turuncu zemin/ağaç paleti ve boş karolarda doğal yaprak kümeleri.
- **Kış:** tamamen beyaza boyanmış bir zemin yerine soğuk doğal çim tonu üzerinde düzensiz kar lekeleri; yapılarda çatı karı, çamlarda kar katmanları ve yaprak döken ağaçlarda çıplak dallar.
- Mevsimsel zemin dekorları koordinat tabanlı deterministik üretildiği için oyun yeniden açıldığında rastgele yer değiştirmez.
- Mevsimsel görünüm kapatıldığında mevcut yaz/default görünüm davranışı korunur.

## Teknik doğrulama

- Yeni arı fiyat eğrisi, kış minimum 4 arı koruması ve Seyyah Yakup'un %20 fiyatı otomatik testlerle doğrulanır.
- Kanonik arıcılık Nero'su, Hasat Et hizası ve dört mevsim görsel altyapısı için regresyon testleri eklendi.
