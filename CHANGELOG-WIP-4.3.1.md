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

## Checkpoint politikası
- Kaynak kod düzeltmesi
- Node/regression testleri
- Gerçek Electron header + cross-theme smoke
- Kaynak checkpoint ZIP
- EXE yalnız final doğrulamasından sonra
