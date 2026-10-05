# Nero 6.7.7 Source

Bu source paketi, **Yörünge Kontrol Merkezi asset-first yeniden tasarımını** içerir.

Ana asset dizini:

`src/renderer/panel/deco/yorunge-v677/`

Alt klasörler:
- `common/` — pencere ve ortak arayüz ikonları
- `icons/` — beş ana sekme SVG ikonları
- `home/` — Bugün sahnesi, masa, monitor, kart/yörünge assetleri
- `nero/` — transparan Nero karakter asseti
- `logs/` — Loglar hero asseti
- `control/` — Kontrol hero ve switch assetleri
- `timer/` — T-Zamanı hero asseti
- `badges/` — Yamalar hero ve patch çerçevesi

Doğrulama:

```bash
npm test
node scripts/wardrobe-v665/check-release.js
```

Windows release workflow: `.github/workflows/build-v6.7.7.yml`.
