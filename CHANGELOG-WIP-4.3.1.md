# Nero 4.3.1 — Geçici Changelog (WIP)

> 4.3.0 sonrası bulunan kritik header click regression ve yardım ikonu UI polish turu.

## Aşama 0 — Başlangıç

### Kritik düzeltme
- Ayarlar / Sabitle / Küçült / Kapat kontrollerinin gerçek paketlenmiş uygulamada tıklanamaması düzeltilecek.
- Tüm header alanının draggable olması yerine, kontrollerle fiziksel olarak çakışmayan ayrı bir drag zone kullanılacak.
- Tüm 10 temada gerçek Electron hit-area doğrulaması yapılacak.

### UI polish
- Büyük ve border'lı `?` yardım butonları kaldırılacak.
- Yerine 12–14 px görsel boyutta, border'sız, transparent ve başlığın hafif sağ-üstünde duran küçük yardım işareti gelecek.
- Tooltip daha küçük ve website tipi hafif bir açıklama balonuna dönüştürülecek.
- Çilekli Piknik, Ege Yazı ve diğer temalarda kart çizgileriyle görsel çakışma giderilecek.

## Aşama 1 — Header clickability + yardım ikonu redesign

### Header
- Tüm `.top` alanının draggable olması kaldırıldı.
- Header artık `no-drag`; pencere sürükleme için kontrollerle fiziksel olarak çakışmayan ayrı `.panel-drag-zone` eklendi.
- Drag zone sağ tarafta 205 px güvenli alan bırakıyor; Ayarlar / Sabitle / Küçült / Kapat grubunun geometrisiyle kesişmiyor.
- Window controls katmanı z-index 100'e çıkarıldı ve bağımsız no-drag / pointer-events alanı olarak korunuyor.
- Gerçek Electron smoke testi artık yalnız resimli temalarda değil **10 temanın tamamında** çalışıyor.
- Test, drag-zone ile controls geometrisinin çakışmadığını, header'ın no-drag olduğunu, özel drag-zone'un drag olduğunu ve her dört butona native click event ulaştığını doğruluyor.

### Yardım ikonları
- 20 px, border'lı ve ayrı buton gibi görünen eski tasarım kaldırıldı.
- Yardım işareti artık **18 × 18 px hit-area içinde 12 px görsel ?** olarak çalışıyor.
- Border, arka plan ve buton kutusu tamamen kaldırıldı.
- Başlığın hemen sağında, yaklaşık -2 px yukarı offset ile küçük sağ-üst mikro işaret görünümü verildi.
- Hover / focus / click davranışı korunurken yalnız renk ve hafif hareketle belirginleşiyor.
- Tooltip max genişliği 220 px'e, padding 6×8 px'e ve font 10.5 px'e indirildi.
- Çilekli Piknik / Ege Yazı / Mum Işığı dahil tüm temalarda yardım ikonu border'sız ve transparent kalıyor.
- Pazartesi, Disket ve Kasaba tooltip'lerinde tema karakteri korunurken eski ağır kart/buton görünümü hafifletildi.

### Test
- **39/39 Node regression testi başarılı, 0 hata.**
- Gerçek Electron header native hit-test: **10/10 tema başarılı**.
- Cross-theme panel / yardım ikonu smoke testi: **10/10 tema başarılı**.
- Her temada yardım ikonlarının küçük, transparent ve border'sız computed style olduğu doğrulandı.
- Tooltip'lerin kompakt ölçüde kaldığı ve shell dışına taşmadığı doğrulandı.
- EXE henüz üretilmedi.

## Checkpoint politikası
- Kaynak kod düzeltmesi
- Node/regression testleri
- Gerçek Electron header + cross-theme smoke
- Kaynak checkpoint ZIP
- EXE yalnız final doğrulamasından sonra
