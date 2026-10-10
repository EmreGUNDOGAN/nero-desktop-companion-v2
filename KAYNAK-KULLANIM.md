# Nero 7.0.0 + Ezgi’s Krab Shack — kaynak teslimi

10 Ekim 2026. Mevcut Nero 6.9.13 kaynak tabanı üzerine restoran entegrasyonu eklenmiştir. Yeni kaynak sürümü **7.0.0** olarak hazırlanmıştır. Windows kurulumu ve tam kaynak kod GitHub Actions ile hazırlanır.

## Çalıştırma

1. ZIP dosyasını çıkarın, içindeki `Nero-7.0.0` klasöründe terminal açın.
2. Node.js 22 veya 24 ve npm kullanın.
3. `npm ci`
4. `npm start`
5. Nero panelinin üst çubuğunda, arıcılık ikonunun solundaki SpongeBob düğmesine tıklayın.

Nero zaten çalışıyorsa, tepsi menüsünden çıkıp kaynak sürümünü başlatın. Aynı anda ikinci açılış mevcut Nero penceresine yönlenebilir.

Yeni oyun: **60 altın, seviye 1, 0 XP**, bir açık masa, Nero ve ücretsiz Bay Yengeç temizlikçisi. Yeni oyun değerleri, kayıtlı ilerlemeyi silmez; kayıtlı oyunda kaldığınız yerden devam edilir. Normal ve deneme kayıt anahtarları ayrıdır. Kullanıcı deneme bağlantısı da aynı başlangıç değerlerini kullanır. Yüksek bütçeli senaryolar yalnız açık otomatik kontrol fixture’larında kullanılır.

## Kaynakların yeri

- `src/main/restaurant-window.js`: Nero düğmesinin açtığı ayrı oyun penceresi ve yerel dosya sunucusu.
- `src/renderer/panel/restaurant-launcher.css`: üst çubukta ikonun hizası ve görüntüsü.
- `src/renderer/restaurant/`: oyun, modeller, kayıt sistemi, ekonomi verileri ve hazır çalışan arayüz.
- `src/renderer/restaurant-ui/hud.jsx`: düzenlenebilir React arayüzü.
- `src/renderer/restaurant-ui/hud.scss` ve `game-hud.scss`: SCSS tasarım kaynakları.
- `themes/`: Nero’nun mevcut temaları ve bütün çalıştırma görselleri.
- `docs/restaurant-integration/`: entegrasyon notları ve doğrulama sonuçları.

Hazır arayüz derlemesi pakette bulunur; normal `npm start` için arayüzü tekrar derlemeniz gerekmez.

## React / SCSS arayüzünü yeniden derleme

```powershell
npm ci
npm run restaurant:ui
```

Bu küçük arayüz paketinin pnpm kilidi de vardır; pnpm kullanıyorsanız `pnpm install --frozen-lockfile` kullanabilirsiniz. Ana bağımlılıklar kurulunca ana klasörden `npm run restaurant:ui` de çalışır. Çıktı doğrudan `src/renderer/restaurant/game-hud.js` ve `game-hud.css` dosyalarını günceller.

## Kontroller

- 142 ürün modeli, ortak makine üretimi, talebe göre otomasyon ve servis akışı.
- 23 ekipman fabrikasının geçerli geometrileri.
- 10 servisçi / 10 temizlikçi, kasa hızları ve makine otomasyonunun kayıt turunda korunması.
- Nero düğmesinin 380, 600 ve 900 piksel genişliklerde hizası, yerel PNG yüklenmesi ve tek tık IPC çağrısı.
- Yeni oyun bütçesi ve sıfır XP.

`test/restaurant-launcher-ui.cjs`, kontrol amaçlı bir sahte panel verisi kullanır; kurulu Nero verilerine yazmaz.

## Paketleme

İstenirse kaynak klasöründen `npm run dist` ile Windows kurulum dosyası üretilebilir. Bu teslim ZIP’i kaynak koddur; hazır installer değildir. Hiçbir otomatik yayın yapılmaz (`--publish never`).

## Varlık kredileri

SpongeBob düğmesi: Nickelodeon / NickRewind, Wikimedia Commons, CC BY 3.0. Kaynak ve lisans bilgileri `src/renderer/panel/assets/spongebob-launcher-CREDITS.txt` dosyasında bulunur.

`SOURCE-MANIFEST.json` dosyası teslim edilen her kaynak dosyasının boyutunu ve SHA-256 özetini listeler. node_modules, test profilleri, eski dist çıktıları ve kişisel kayıtlar bu kaynak arşivine alınmamıştır.
