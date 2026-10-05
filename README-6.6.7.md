# Nero 6.6.7 kaynak paketi

Bu sürüm, **Yörünge Kontrol Merkezi** temasının yapısal tasarım pilotudur.

Değişiklikler: `CHANGELOG-6.6.7.md`.

## Doğrulama

```bash
npm ci
npm test
node scripts/wardrobe-v665/check-release.js
npm run dist
```

GitHub Actions iş akışı: **Build Nero 6.6.7 Final**.
