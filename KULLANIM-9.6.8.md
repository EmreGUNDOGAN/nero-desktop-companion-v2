# Nero 9.6.8

Ayarlar → Görünüm → Tema → **Biletini Sakla** seçilerek yeni tema açılır. Var olan temalar, finans görünümleri ve kullanıcı kayıtları korunur.

GitHub Actions → Build Nero 9.6.8 Final → Artifacts → **Nero-9.6.8-final-bundle** paketini indir. Paket kurulum EXE’si, blockmap, latest.yml, tam kaynak ZIP’i ve changelog içerir.

Kaynağı çalıştırmak için Node.js 22 ile `npm ci`, `npm run finance:build`, ardından `npm start` kullanılır. Windows kurulumunu oluşturmak için `npm run dist`.

Tema ayrıntıları: BILETINI-SAKLA.md. Finans kullanımı: docs/BUTCE-REHBERI.md. Sürüm değişiklikleri: CHANGELOG-9.6.8.md.
