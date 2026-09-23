# Nero 4.3.0 — Geçici Changelog (WIP)

> Bu dosya geliştirme sırasında aşama aşama güncellenir. Final release öncesinde ana CHANGELOG.md içine profesyonel biçimde birleştirilecektir.

## Aşama 0 — Başlangıç durumu

### Düzeltildi
- Resimli/hava temalarında başlık kontrollerinin tıklanabilirliği için Ayarlar / Sabitle / Küçült / Kapat grubu draggable header alanının dışına taşındı.
- Başlık kontrol grubu bağımsız no-drag hit-area olarak yapılandırıldı.
- Kar, Yağmur, Çilek, Mum ve Ege temaları için gerçek Electron hit-test doğrulaması eklendi.

### Planlanan 4.3.0 geliştirmeleri
- İş süresi alanının yeniden tasarlanması.
- Opsiyonel manuel planlanan süre.
- İş bazlı kronometre; pause/resume ve iş tamamlanınca otomatik durma.
- Tamamlanan işlerde gerçek süre damgası.
- Moodboard gridlerinin kompaktlaştırılması.
- Ayın gerçek gün sayısına göre 28/29/30/31 dinamik moodboard.
- Yalnız veri bulunan geçmiş aylara erişim.
- Nero konuşma ikonunun metin bloğuna dikey ortalanması.
- “Şimdiye kadar” güvenli baseline sıfırlama.
- Ana sayfa işlevsel kartlarında tema uyumlu yardım ikonları.

## Checkpoint politikası
Her tamamlanan geliştirme bloğundan sonra:
1. Unit/regression testleri çalıştırılır.
2. Gerekli gerçek Electron smoke testleri çalıştırılır.
3. Bu WIP changelog güncellenir.
4. Kaynak kod checkpoint ZIP'i hazırlanır.
5. EXE üretilmez.

Final aşamada:
- Tüm WIP notları ana CHANGELOG.md altında tek 4.3.0 kaydında birleştirilir.
- Tam regression testi yapılır.
- Yalnız final onayından sonra setup / blockmap / latest.yml / kaynak ZIP oluşturulur.
