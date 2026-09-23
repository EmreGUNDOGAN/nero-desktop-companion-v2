# Nero

Masaüstünde yaşayan, huysuz ama seni seven küçük bir arkadaş. Notlar, yapılacaklar ve zamanlayıcı içerir; ruh hali zamanla değişir.

Yayıncı: **Stenwick**

Sürümlerde neler değiştiğini görmek için: [CHANGELOG.md](CHANGELOG.md)

## Çalıştırmak için gerekenler

- Windows 10 veya 11
- [Node.js](https://nodejs.org) (LTS sürümü)

## Geliştirme modunda çalıştırma

Proje klasöründe bir terminal (PowerShell) aç:

```powershell
npm install
npm start
```

Nero ekranın sağ alt köşesinde belirir. Tepside (saatin yanındaki gizli simgeler) de bir simgesi olur.

## Kurulum dosyası (setup.exe) oluşturma

```powershell
npm run dist
```

Kurulum dosyası `dist\Nero-Setup-4.0.4.exe` olarak oluşur.

Yeni sürüm çıkarırken `package.json` içindeki `"version"` değerini artır (ör. `3.0.1`). `appId` değerini (`com.stenwick.nero`) **değiştirme**; kurulum programı eski sürümü bu kimlikten tanıyıp kaldırır.

### Kurulum programı ne yapar?

- Kurulum klasörü seçilebilir, masaüstü ve Başlat menüsü kısayolu oluşturur.
- Güncellemede notlar, yapılacaklar, ayarlar ve istatistikler her zaman korunur. Kurulum bir sıfırlama seçeneği sunar ama varsayılan cevap Hayır'dır; iki kez onaylanırsa bile veriler silinmez, `%APPDATA%\Nero-yedek` klasörüne taşınır.
- Kaldırırken verilerin de silinip silinmeyeceğini sorar.
- "Programlar ve Özellikler" listesinde yayıncı olarak Stenwick görünür.

Not: Eski `nero-desktop-companion` sürümleri farklı bir uygulama kimliğiyle kurulduysa kurulum programı onları tanımaz. Bir kereye mahsus Windows Ayarlar > Uygulamalar'dan elle kaldırmak gerekir.

## "Bilinmeyen yayıncı" uyarısı hakkında

Windows'un açılışta gösterdiği yayıncı adı, `.exe` dosyasının **kod imzalama sertifikasıyla** imzalanmasından gelir. `package.json`'a "Stenwick" yazmak bu uyarıyı kaldırmaz; dosya özelliklerinde ve Programlar listesinde Stenwick görünür ama SmartScreen ve UAC penceresi imza olmadan "Bilinmeyen yayıncı" demeye devam eder.

Uyarıda "Stenwick" yazması için:

1. Stenwick adına bir kod imzalama sertifikası alınması gerekir (DigiCert, Sectigo, GlobalSign gibi bir sertifika otoritesinden). Sertifikada şirket adı çıkması için Stenwick'in kayıtlı bir şirket olması gerekir; bireysel sertifikada kişinin kendi adı görünür.
2. Sertifika alındıktan sonra electron-builder'a tanıtılır ve `npm run dist` sırasında dosya otomatik imzalanır. `package.json` içindeki `win` bölümüne sertifika ayarları eklenir (sertifikanın türüne göre değişir).
3. İmzalı dosyalar bile ilk başta SmartScreen uyarısı görebilir; indirme sayısı arttıkça itibar oluşur ve uyarı kaybolur.

Microsoft'un kendi imzalama servisi (Azure Artifact Signing) şu an Türkiye'deki bireylere ve şirketlere açık değil. İmzasız dağıtırken kullanıcılar uyarıda **Ek bilgi > Yine de çalıştır** ile kurabilir.

## Klasör yapısı

```
build/            simge ve kurulum özelleştirmeleri (installer.nsh)
docs/             tema rehberi
src/main/         ana süreç: pencereler, ruh hali, zamanlayıcı, temalar
src/preload/      arayüz ile ana süreç arasındaki güvenli köprü
src/renderer/     karakter penceresi ve panel
src/data/         Nero'nun replikleri (dialogue.tr.json)
themes/            temalar: default (cozy), latte (Tarçınlı Latte), pazartesi (Pazartesi Sendromu)
```

## Nero takılırsa

- Görev çubuğunun sağındaki ^ okuna tıkla, Nero simgesine sağ tıkla, **Çıkış** de.
- Olmazsa **Ctrl + Shift + Esc** ile Görev Yöneticisi'ni aç, Nero'yu seçip **Görevi sonlandır** de.

Bir sorun olursa `%APPDATA%\Nero\nero.log` dosyasına bakılabilir.

## Güncelleme nasıl dağıtılır?

Nero, GitHub'daki **nero-desktop-companion-v2** reposunun Releases sayfasından güncellemeleri kendisi bulur. Bunun için:

1. `package.json` içindeki `"version"` değerini artır (ör. `4.0.5`).
2. `npm run dist` ile derle.
3. Yeni bir release oluştur (etiket: `v4.0.5`) ve `dist` klasöründeki şu **üç dosyayı** ekle: `Nero-Setup-4.0.5.exe`, `Nero-Setup-4.0.5.exe.blockmap`, `latest.yml`.

Repo herkese açık olmalı. `.github/workflows/build.yml` sayesinde `v` ile başlayan bir etiket gönderince bu üç dosya otomatik olarak da yüklenir.

## Veriler nerede?

Tüm veriler `%APPDATA%\Nero` klasöründedir: `settings.json`, `notes.json`, `todos.json`, `mood.json`, `stats.json`, günlük yedekler (`yedekler\`) ve kullanıcı temaları (`themes\`).

## Karakteri değiştirmek

`docs/TEMA-REHBERI.md` dosyasına bak. Kısaca: görselleri ve bir `theme.json` dosyasını `%APPDATA%\Nero\themes\<tema-adı>\` içine koy, Ayarlar'dan **Temaları yenile** de ve temayı seç.

## Nero nasıl davranır?

- **Fare takibi:** gözleri imleci ekranın her yerinde takip eder; fare uzun süre durursa etrafa bakınır.
- **Göz kırpma, nefes alma** ve konuşurken ağız hareketi sürekli çalışır.
- **Tıklama** paneli açar/kapatır. Art arda dürtülürse sinirlenir.
- **Sürükleme:** karaktere basılı tutup istediğin yere taşı. Şeffaf kısımları tıklamayı alttaki pencereye geçirir.
- **Sağ tık / tepsi simgesi:** hızlı menü (panel, sessiz mod, gizle, çıkış).
- **Ruh hali:** sen bilgisayar başındayken onunla ilgilenmediğin süreyi sayar. İlk 3 saat keyfi yerinde, sonra sırasıyla sıkılır, küser ve yalnız hisseder. Bilgisayardan 10 dakikadan uzun uzaklaşırsan uyur, dönünce uyanır.
- **Kendi kendine konuşma:** ruh haline göre arada bir söylenir ya da sana laf atar. Sıklığı Ayarlar > Konuşkanlık'tan değişir.
- **Zamanlayıcı:** bitince kutlar (ses + Windows bildirimi), erken bırakılırsa ne kadar erken bırakıldığına göre farklı tepki verir.
