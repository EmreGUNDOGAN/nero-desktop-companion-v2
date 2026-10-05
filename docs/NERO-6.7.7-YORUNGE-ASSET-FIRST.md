# Nero 6.7.7 — Yörünge Asset‑First Tasarım Notu

## Kilitli üretim prensibi
Tema görselleri uygulama çalışırken CSS ile çizilmez. Görsel kimlik önce PNG/SVG asset olarak hazırlanır, ardından CSS yalnız konumlandırma, responsive davranış, metin ve canlı veri bağlama için kullanılır.

## Katman sırası — Bugün hero
1. `home/hero-space-bg.svg`
2. `nero/nero-space-console.svg`
3. `home/control-desk-overlay.svg`
4. `home/crew-monitor-frame.svg`
5. `home/sticky-mission-note.svg`

## Sayfa assetleri
- Bugün: `home/`
- Loglar: `logs/hero-bg.svg`
- Kontrol: `control/hero-bg.svg`, `control/switch-bank.svg`
- T-Zamanı: `timer/hero-bg.svg`
- Yamalar: `badges/hero-bg.svg`, `badges/patch-frame.svg`

Rozetlerin mevcut başarı ikonları tema tarafından değiştirilmez.
