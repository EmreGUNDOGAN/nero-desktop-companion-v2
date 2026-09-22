<div align="center">

# nero.
### Biraz huysuz. Hep yanında.

Windows masaüstünde yaşayan, kendi ruh hâli ve karakteri olan küçük bir çalışma arkadaşı.

![Version](https://img.shields.io/badge/version-3.8.1-D4EE94)
![Platform](https://img.shields.io/badge/platform-Windows_10%2F11-0078D4)
![Electron](https://img.shields.io/badge/Electron-44.4.3-47848F)
![License](https://img.shields.io/badge/license-UNLICENSED-lightgrey)

**Stenwick tarafından geliştiriliyor.**

</div>

---

Nero; masaüstünde yaşayan etkileşimli bir companion uygulamasıdır. Notlarını, yapılacaklarını ve odak zamanlayıcını tek yerde tutarken kendi ruh hâline göre tepki verir, konuşur ve gün içinde sana eşlik eder.

> **Sürüm 3.8.1** — Electron tabanlı Windows masaüstü uygulaması. Uygulama verileri yerel olarak saklanır.

## Özellikler

| Alan | Davranış |
| --- | --- |
| Masaüstü karakteri | Şeffaf pencere, sürükleyerek taşıma, tıklayarak panel açma |
| Karakter animasyonu | Fare takibi, göz kırpma, nefes alma ve konuşma animasyonları |
| Ruh hâli | Etkileşim ve geçen zamana göre değişen duygu sistemi |
| Konuşma | Ruh hâline göre Türkçe replikler ve ayarlanabilir konuşkanlık |
| Notlar | Yerel olarak saklanan hızlı notlar |
| Yapılacaklar | Görev ekleme ve tamamlama |
| Zamanlayıcı | Odak süresi, bitiş bildirimi ve karakter tepkileri |
| Temalar | Değiştirilebilir karakter ve arayüz temaları |
| Sistem tepsisi | Panel, sessiz mod, gizleme ve çıkış kontrolleri |
| Kurulum | Windows x64 için NSIS tabanlı kurulum paketi |

## Kurulum

Hazır kurulum dosyaları yayımlandığında **Releases** bölümünden en güncel `Nero-Setup-<version>.exe` paketini kullanabilirsin.

Kaynak koddan çalıştırmak için Windows 10/11 ve güncel Node.js LTS gerekir.

```powershell
git clone https://github.com/EmreGUNDOGAN/nero-desktop-companion-v2.git
cd nero-desktop-companion-v2
npm install
npm start
```

Windows kurulum paketi oluşturmak için:

```powershell
npm run dist
```

Çıktılar `dist/` klasöründe oluşturulur.

## Nero nasıl davranır?

Nero yalnızca ekranda duran bir karakter değildir. Fareyi takip eder, göz kırpar, konuşurken yüz animasyonları kullanır ve uzun süre etkileşim kurulmadığında ruh hâli değişir. Bilgisayardan uzun süre uzaklaşıldığında uyku davranışına geçebilir; geri dönüldüğünde tekrar aktif olur.

Karaktere tıklamak paneli açıp kapatır. Sürükleyerek masaüstünde istediğin konuma taşıyabilirsin. Sağ tık menüsü ve sistem tepsisi üzerinden hızlı kontrollere erişebilirsin.

## Tema sistemi

Nero'nun görünümü veri odaklı tema sistemiyle değiştirilebilir. Her tema kendi `theme.json` tanımını ve SVG karakter katmanlarını taşır.

Projeyle birlikte gelen temalar:

- **Default / Cozy**
- **Disket**
- **Gece**
- **Kasaba**
- **Latte**
- **Pazartesi**

Yeni tema hazırlamak için [Tema Rehberi](docs/TEMA-REHBERI.md) dosyasına bak.

## Veriler nerede?

Kullanıcı verileri Windows'ta `%APPDATA%\Nero` altında tutulur.

```text
settings.json
notes.json
todos.json
mood.json
themes/
nero.log
```

Uygulamanın kullanıcı verilerini kaynak kod deposuna yazmaması özellikle amaçlanmıştır.

## Teknoloji

**Electron · JavaScript · HTML · CSS · SVG · electron-builder · NSIS · GitHub Actions**

Ana süreç pencere yönetimi, veri saklama, ruh hâli, zamanlayıcı ve tema altyapısını yönetir. Renderer katmanı karakter ve uygulama panelini oluşturur. Preload katmanı renderer ile Electron ana süreci arasında kontrollü köprü sağlar.

## Depo yapısı

```text
.github/
  workflows/          CI / Windows build
build/                Uygulama ikonları ve NSIS özelleştirmeleri
docs/                 Teknik ve kullanıcı dokümantasyonu
src/
  data/               Türkçe diyalog ve söz havuzları
  main/               Electron ana süreç modülleri
  preload/            Güvenli IPC köprüsü
  renderer/
    character/        Masaüstü karakteri
    panel/            Ana kontrol paneli
    fonts/            Yerel arayüz fontları
themes/               Nero karakter temaları
package.json          Uygulama ve electron-builder yapılandırması
CHANGELOG.md           Sürüm geçmişi
```

## Geliştirme

Bağımlılıkları kur:

```powershell
npm install
```

Geliştirme modunda çalıştır:

```powershell
npm start
```

Paketlenmiş Windows klasörü:

```powershell
npm run dist:dir
```

NSIS setup:

```powershell
npm run dist
```

`appId` değeri `com.stenwick.nero` olarak korunmalıdır. Bu kimlik mevcut kurulumların doğru şekilde güncellenmesi açısından önemlidir.

## Güvenlik

Nero'nun renderer katmanına doğrudan Node.js erişimi verilmez; uygulama ihtiyaç duyduğu masaüstü işlevlerini preload köprüsü üzerinden kullanır. Güvenlik sorunlarını herkese açık issue açmadan önce [SECURITY.md](SECURITY.md) üzerinden bildir.

## Katkı

Hata bildirmek veya geliştirme önermek için GitHub Issues kullanılabilir. Kod katkısı yapmadan önce [CONTRIBUTING.md](CONTRIBUTING.md) dosyasını incele.

## Lisans

Bu proje şu anda **UNLICENSED** durumundadır. Kaynak kodun GitHub'da görünür olması otomatik olarak yeniden kullanım, dağıtım veya ticari kullanım izni vermez.

---

<div align="center">

**nero.** — huysuz olabilir. yine de yanında.

</div>
