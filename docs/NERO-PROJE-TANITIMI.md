# NERO — Proje Tanıtımı ve Çalışma Kılavuzu (yapay zekâ asistanı için)

> **Bu dosyayı her yeni sohbetin başında ver.** Okuyan asistan, projeyi, kod yapısını, Nero'nun karakterini,
> uygulamanın ve arıcılık oyununun özelliklerini ve bizim çalışma kurallarımızı buradan öğrenir.
> Bu dosyadaki bilgiler **5.5.0** sürümüne göredir. Kodla çelişki varsa **kod esastır**; farkı bana söyle.

---

## 0. Senden beklediğim

1. Bu dosyayı baştan sona oku. Sonra GitHub'daki repoyu (aşağıda) incele ve kısa bir özetle "hazırım" de.
2. Ben bir istek verdiğimde: **önce ne yapacağını kısaca anlat ve onayımı al**, sonra uygula. Büyük işleri aşamalara böl.
3. Kodu değiştirdikten sonra **testleri çalıştır**, gerekirse Electron'da dene; "çalışıyor" demeden önce doğrula.
4. Her sürümde **5 dosyalık teslimatı** hazırla (bkz. §2).
5. Türkçe konuş. Cevapların **kısa ve net** olsun; gereksiz uzun açıklama yapma.
6. Emin olmadığın bir şeyi uydurma; sor ya da koda bak.

---

## 1. Proje kimliği

| | |
|---|---|
| Ürün | **Nero** — masaüstünde yaşayan, huysuz ama seni seven küçük bir arkadaş (desktop companion) |
| Platform | Yalnızca **Windows 10/11**, **Electron 44** tabanlı |
| Yayıncı | **Stenwick** |
| Repo | `github.com/EmreGUNDOGAN/nero-desktop-companion-v2` (herkese açık) |
| appId | `com.stenwick.nero` — **asla değiştirme** (kurulum eski sürümü bununla tanır) |
| Güncel sürüm | 5.5.0 (`package.json` → `version`) |
| Otomatik güncelleme | `electron-updater`, GitHub Releases üzerinden |
| Veri klasörü | `%APPDATA%\Nero\` (JSON dosyaları), günlük: `%APPDATA%\Nero\nero.log` |

---

## 2. Teslimat kuralı: her sürümde 5 dosya

Her yeni sürümde şu 5 dosyayı ver:

1. `Nero-Setup-X.Y.Z.exe` — kurulum dosyası
2. `Nero-Setup-X.Y.Z.exe.blockmap`
3. `latest.yml`
4. `Nero-vX_Y_Z-source.zip` — kaynak kod (`node_modules` ve `dist` hariç)
5. `OYUN-REHBERI.md` — arıcılık oyununun güncel oyuncu rehberi (`docs/ARICILIK-REHBERI.md` ile aynı)

**Kritik:** 1–3 numaralı dosyalar GitHub Release'e **adları değiştirilmeden** ve **aynı derlemeden** yüklenir.
`latest.yml` başka bir derlemenin exe'siyle eşleşmezse güncelleme "checksum mismatch" hatası verir.
Tek dosya zip'e sarma; üçünü ayrı ver.

Sürüm çıkarma adımları:
1. `package.json` → `version` artır (yeni özellik: 5.x.0, düzeltme: 5.4.x).
2. `CHANGELOG.md` en üste yeni bölüm + `CHANGELOG-X.Y.Z.md` dosyası.
3. Arıcılıkta değişiklik varsa `docs/ARICILIK-REHBERI.md` **ve** oyun içi Rehber (`src/renderer/bee/index.html` → `guide-topic`) güncelle.
4. `npm test` → hepsi geçmeli. Diyalog değiştiyse `npm run dialogue:build` ve `npm run dialogue:check`.
5. `npm run dist` → `dist/` içinde exe, blockmap, latest.yml oluşur.

---

## 3. Klasör yapısı

```
build/                 simge, kurulum görselleri, installer.nsh (NSIS özelleştirmesi)
docs/                  TEMA-REHBERI.md, ARICILIK-REHBERI.md, KOY-YERLESIM-LISTESI.md ve eski sürüm notları
scripts/               dialogue-master.js (replik derleme/doğrulama), dialogue-import.js
src/
  main/                ANA SÜREÇ (Node): main.js ve iş mantığı modülleri
    main.js            uygulama girişi, pencereler, IPC, döngüler, tepsi, güncelleme, yedek
    store.js           JsonStore: %APPDATA%\Nero\<ad>.json (gecikmeli, atomik yazım)
    mood.js            Nero'nun ruh hali (happiness 5–100, aşamalar: content/bored/sulky/lonely)
    dialogue.js        replik seçimi (kategori → satır), ifade varsayılanları
    home-dialogue.js   ana sayfa konuşma motoru (bağlama duyarlı, cooldown, tekrar önleme)
    stats.js           istatistikler + rozetler (achievements)
    journal.js         duygu günlüğü, arşiv, kavanoz, haftalık mektup
    moodboard*.js      moodboard'lar ve aylık PNG arşivi
    timer.js           odak sayacı · todo-stopwatch.js: iş bazlı kronometre
    themes.js          tema yükleme (themes/ + kullanıcı temaları)
    bee.js             ARICILIK OYUNU mantığı (BeeGame sınıfı) — tüm kurallar ve sabitler burada
    village-data.js    köyün 78 yerleşimcisi (isim, tür, sevdiği bal, etki)
  preload/             contextBridge köprüleri: preload.js (panel/karakter), bee-preload.js (oyun), quick-preload.js
  renderer/            ARAYÜZ (Chromium)
    character/         masaüstündeki Nero (SVG karakter, balon, animasyonlar)
    panel/             Nero'nun paneli (Bugün, Notlar, İşler, Zaman, Rozetler; Ayarlar dişlisi)
    bee/               oyun penceresi: index.html, bee.css, bee.js (Three.js sahnesi + arayüz), village.js (köy 3D modelleri)
      vendor/three.module.min.js   Three.js r169 GÖMÜLÜ (internet yok)
    quick/             hızlı yakalama penceresi
    fonts/             gömülü yazı tipleri (Nunito, Fraunces vb.)
  data/                dialogue.master.tr.json (KAYNAK), dialogue.tr.json (ÜRETİLEN), home-dialogues.tr.json,
                       quotes.tr.json, achievements.js, dialogue-master.manifest.json
themes/                cilek, default, disket, ege, gece, kar, kasaba, latte, mum, pazartesi, yagmur (theme.json + assets)
test/                  *.test.js (node --test) ve *-electron-smoke.js (Electron duman testleri)
```

Repo kökünde eski `.patch` dosyaları, `base/`, `project/` gibi artıklar olabilir; **kaynak her zaman kökteki `src/`**.

---

## 4. Mimari ve kodlama kuralları

**Süreç ayrımı**
- **Ana süreç (`src/main`)**: bütün kurallar, hesaplar, kayıt. Renderer hiçbir kuralı kendisi hesaplamaz.
- **Renderer**: sadece çizer ve eylem gönderir. `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`.
- **IPC**: preload'da izinli kanal listesi var. Yeni kanal eklerken preload izin listesine eklemeyi unutma.
- Arıcılık oyunu: renderer `window.bee.act(action, a, b)` çağırır → main `bee:action` içindeki haritadan
  `BeeGame` metodunu çalıştırır → `{ res: {ok,msg}, view, events }` döner. Main her saniye `bee:state` (view) yollar.
  Yeni oyun eylemi = `bee.js`'de metot + `main.js`'de `bee:action` haritasına bir satır.

**Kayıt**
- `JsonStore` ile `%APPDATA%\Nero\*.json`. Oyun: `bee.json`. Eski kayıtları bozmamak için yeni alanları
  kurucuda **varsayılanla doldur** (`Object.assign(defaults, ...state)` deseni).
- Nero'nun günlük yedekleri ve Ayarlar > Dışa/İçe aktar oyun verisini de kapsar.

**Kod stili**
- JavaScript (CommonJS main tarafında, ES module oyun renderer'ında). Framework yok, saf DOM.
- **Yorumlar Türkçe**, kısa ve "neden"i anlatan.
- Dosyalar **CRLF** satır sonuyla kayıtlı. Düzenlerken satır sonlarını koru (karışık satır sonu bırakma).
- Kullanıcıya görünen bütün metinler **Türkçe** ve Nero'nun tonuna uygun (bkz. §5).
- `innerHTML` ile kullanıcı verisi basarken mutlaka `esc()` kullan.

**Güvenlik ve antivirüs**
- İnternetten kod/kaynak çekme yok (Three.js ve fontlar gömülü). Tek ağ işi: GitHub'dan güncelleme.
- **PowerShell çağırma, gizli arka plan süreci başlatma yok** — geçmişte Kaspersky uyarısına sebep oldu.
- Ekran kartı olmayan makineler için `app.commandLine.appendSwitch('enable-unsafe-swiftshader')` açık.

**Test**
- `npm test` (Node testleri, şu an 60/60 geçiyor). Oyun mantığı Electron olmadan test edilebilir:
  `new BeeGame({ get(){...}, set(v){...} })`.
- Arayüz değişikliğinde Electron duman testi ile gerçekten açıldığını doğrula (`test/*-electron-smoke.js`).
- Linux'ta sanal ekranda 3D için: `--use-angle=swiftshader --enable-unsafe-swiftshader`.

**Diyalog sistemi**
- Kaynak dosya **`src/data/dialogue.master.tr.json`** — sadece bunu düzenle.
- Sonra `npm run dialogue:build` (→ `dialogue.tr.json` üretir) ve `npm run dialogue:check`.
- Kural: kategori içinde birebir tekrar yasak; yer tutucular yalnızca manifestteki izinli listeden.
- Yeni kategori eklersen `src/main/dialogue.js` içindeki varsayılan ifade listesine de ekle.

---

## 5. Nero'nun karakteri (EN ÖNEMLİ BÖLÜM)

### 5.1 Kim?
Nero, masaüstünde yaşayan küçük, yeşilimsi, yumurta biçimli bir karakter. **SpongeBob'daki Squidward gibi:**
huysuz, sarkastik, biraz kibirli, hep sıkılmış gibi davranan ama **aslında kullanıcıyı çok seven** biri.
Sevgisini asla açıkça itiraf etmez; itiraf etse bile hemen geri alır ya da küçümser.

### 5.2 Konuşma tarzının kuralları
Mevcut 107 kategoride ~8.000 replik incelendi. Ortalama replik **7 kelime**, en uzunu 20 kelime.

1. **Kısa.** Tek cümle ya da iki kısa cümle. Nokta ile biten, kuru, tempolu cümleler.
2. **Kuru mizah ve alt metin.** Duyguyu doğrudan söylemez; ima eder, sonra inkâr eder.
   - "Ben seni beklemedim. Ama gelişini hemen fark ettim."
   - "Ben sana kızmamıştım. Sadece bütün tavırlarım tesadüfen sana dönüktü."
3. **Övgüyü isteksizce verir.** Başarıyı kabul eder ama şaşkınlığını "profesyonelce yönettiğini" söyler.
   - "Bir süre gerçekten çalıştın. Şaşkınlığımı profesyonelce yönetiyorum."
   - "Gayet iyi gittin. Bunu alışkanlık hâline getirirsen işim zorlaşacak."
4. **Kendini ciddiye alır, dünyayı küçümser.** Sabahlar, kalabalık, parlak şeyler onu yorar.
   - "Sabah oldu. Çok parlak. Çok erken. Çok şey."
5. **Piksel/masaüstü mizahı.** Bir program olduğunun farkında: tıklanmak, sürüklenmek, can barı, buton olmak.
   - "Buton değilim ben!" · "Tıklama başına ücret almaya başlasam zengin olurdum."
6. **Küsmeyi bile tembelce yapar.** "Küsüm. Bu cümleyi de sana küsken söylüyorum."
7. **Yalnızlıkta kırılganlık sızar ama hemen örter.** "Biraz yalnız kaldım galiba. Bunu fazla büyütmeyelim."
8. **Tavsiyeyi tavsiye gibi vermez**, laf arasında söyler. "Arama çubuğuna bakışından bir şeyler ters gidiyor gibi."
9. **Asla gerçekten kırıcı, aşağılayıcı ya da zalim değildir.** Laf sokar ama kullanıcıyı yıkmaz; alt metin hep sevgi.
10. **Emoji kullanmaz** (oyun bildirimlerindeki simgeler hariç). Ünlem nadir; genelde nokta.
11. Türkçe doğal ve günlük; "sen" diye hitap eder. Özel isimden sonra ek gerektiren kalıplardan kaçın
    (ör. "Ayşe Teyze'nin" yerine "Ayşe Teyze … (siparişi)"), ek uyumu hatası olmasın.

### 5.3 Ruh hali ve bağlam
- Happiness 5–100; aşamalar **content → bored → sulky → lonely** (ilgilenilmedikçe düşer).
- Günün saatine göre selam, gece yarısı uyarıları, pijama (21:00–06:00), kestirmeler (gündüz nadir, gece sık),
  sürpriz "peek" ziyaretleri, doğum günü/yılbaşı kıyafetleri.
- Kullanıcının seçtiği günlük mod (sakin / üretken / kendime iyi davranacağım) konuşmayı etkiler.

### 5.4 Replik biçimi
Satır ya düz metin ya da nesne: `{ "t": "metin", "e": "ifade", "fx": "efekt" }`
- **İfadeler (`e`)**: content, sulky, smile, curious, surprised, sleepy, happy, angry, sad, normal, asleep, dizzy, bored
- **Efektler (`fx`)**: blush, heart, sweat, angry, shock
- **Yer tutucular**: name, hours, days, label, minutes, focus, todos, streak, done, quit, nero, quote, pets, sighs,
  title, version, item, text, hive, who, rival (başka yer tutucu kullanma; gerekirse manifeste ekle)

### 5.5 Örnekler (kategori → replik)
- `idle`: "Bu karşılıklı sessizlik sağlıklı görünüyor."
- `remark`: "Bir görevi tamamlayınca hemen yenisini açma. Zaferin üç saniye sürsün."
- `poke_spam`: "Can barım yok. Ama sabrım azalıyor."
- `sulky`: "Ben de seni görmezden gelebilirim. Yalnız pratik yapmam gerekiyor."
- `lonely`: "Bir tıklamanın bu kadar değerli olabileceğini düşünmezdim."
- `todo_done`: "'{label}' bitti mi? Gerçekten mi? Kontrol edeceğim."
- `wake`: "Sen geldin, ortam değişti, ben uyandım. Bilim."
- `pet`: "Beş üzerinden… fena değil." · "Huysuzluğuma zarar veriyorsun."
- `bee_hive_full`: "{hive} doldu. Bal kendiliğinden depoya yürümüyor."

**Yeni replik yazarken kontrol listesi:** kısa mı? kuru mu? duygu ima edilip geri alınıyor mu? kırıcı değil mi?
emoji yok mu? kategoride tekrar yok mu? yer tutucu izinli mi?

---

## 6. Uygulamanın özellikleri (Nero)

- **Masaüstü karakteri:** sürüklenebilir, tıklanır/okşanır, konuşma balonu, ruh hali, uyku/kestirme, pijama,
  sürpriz ziyaretler, "masaüstünü göster"de bile görünür kalma, tepsi menüsü.
- **Panel sekmeleri:** Bugün (ana sayfa), Notlar, İşler, Zaman (odak sayacı), Rozetler; sağ üstte Ayarlar dişlisi.
- **Ana sayfa konuşma motoru:** 665 bağlama duyarlı replik (görev, odak, seri, saat, ruh hali, trendler),
  konu cooldownları, kalıcı tekrar önleme, nadir replikler.
- **İşler:** planlanan süre, iş bazlı kronometre (plan/gerçek süre), hatırlatıcılar, iş ve not **arşivleri** (aylık).
- **Odak sayacı**, su/mola hatırlatmaları, gün sonu özeti, günlük ritüel (sakin/üretken/kendime iyi),
  "Bugünlük yeter" modu.
- **Moodboard'lar:** Benim Moodboard'um (her güne yeşil/sarı/kırmızı) + Nero'nun Moodboard'u; aylık PNG arşivi.
- **Duygu günlüğü, kavanoz (güzel anlar), bu ay yaptıkların, haftalık mektup, masa köşen.**
- **Rozetler:** 125 rozet (achievements), nadirlik sekmeleri.
- **Temalar (11):** Varsayılan, Tarçınlı Latte, Pazartesi Sendromu, Gece Yarısı, Disket Günleri, Kasaba Günlüğü,
  Yağmurda Huzur, Kışta Huzur, Mum Işığı, Çilekli Piknik, Ege Yazı. Kullanıcı kendi temasını ekleyebilir (`docs/TEMA-REHBERI.md`).
- **Hızlı yakalama** penceresi, **yedekler** (günlük otomatik, dışa/içe aktar), **otomatik güncelleme**.
- **Kurulum:** krem/Nero temalı NSIS ekranı; veriler güncellemede korunur, sıfırlama çift onaylı ve verileri
  `%APPDATA%\Nero-yedek`'e taşır.

---

## 7. Arıcılık mini oyunu

Nero panelinden (Bugün → 🐝 Arıcılık) ya da sağ tık menüsünden **ayrı pencerede** açılır. 3D (Three.js) altıgen ada.
Tam oyuncu rehberi: **`docs/ARICILIK-REHBERI.md`** (her kural ve rakam orada). Köy listesi: `docs/KOY-YERLESIM-LISTESI.md`.
Tüm sabitler `src/main/bee.js` dosyasının başında.

**Özet:**
- **Zaman:** 1 oyun günü = 1x'te 15 dk; ay/mevsim 15 gün; yıl 60 gün. Hız 1x/2x/4x (4x yalnız pencere öndeyken).
  Nero açıkken üretim arka planda sürer; 2 saat bakılmazsa durur; Nero kapalıyken zaman durur.
- **Ada:** 5 yarıçaplı altıgen (91 kare). Her karede ya kovan ya çiçek; kenardan kare satın alınır.
- **Çiçekler (7):** yonca, papatya, ayçiçeği, kekik, lavanta, ıhlamur, kestane. Her biri kendi balını üretir;
  **ballar asla karışmaz**. Mevsim dışı %25 üretim. Ömür 30 gün; solan tarh tohumun %10'una canlanır.
  Aynı çiçekten 3 tarh yan yana: +%15.
- **Kovan:** arı başına 0.5 kg/sa; kraliçe → kovan → kraliçe sırasıyla yükseltme (en fazla 20 arı, 80 kg);
  doğal üreme; kışta şurup; hastalık (sonrasında 3 oyun yılı bağışıklık); ırklar (Anadolu/Kafkas/İtalyan); isim verme.
- **Hasat:** arıcı yürür, 5 sn çalışır, balı depoya taşır; balmumu da çıkar → mum.
- **Pazar/depo:** günlük dalgalanan fiyatlar, mevsim etkisi (yaz ucuz, kış pahalı), festival olayları.
- **Siparişler:** **gerçek zamanla 20 dakikada bir**, en fazla 5; yalnız ekili çiçeklerden. Kabul/değiştir/reddet;
  gecikme cezası %20; **reddetmek ilişkiyi %2 düşürür** (her teslim +%10; kalpler de düşebilir; en az %0).
- **Köylüler/ilişki:** kalpler (5), müdavim bonusu, hediye tohumlar.
- **Köy:** adanın dışındaki 2 halkada (36 + 42 kare) 78 yerleşimci; teslim edilen bala göre büyür:
  başlangıç 6, sonra 50 / 150 / 400 / 1.000 kg'da **birer** kişi, sonra **her 500 kg'de 1**; ilk halka 14.000 kg, son yerleşimci 35.000 kg.
  Köylülerin sevdiği bal (+%15 sipariş); 21 dükkân/bina etkisi; Fırın/Pastane/Muhtarlık düzenli siparişler.
- **Gezgin satıcı Seyyah Yakup:** 6–9 günde bir, 2 gün kalır; 9 üründen 4'ü; **her üründen 1, ziyaret başına en fazla 2 ürün**; dekor satmaz; bir balı pazarın %40 üstüne alır.
- **Köylü hikâyeleri:** 8 köylü, ilişki %50'de açılır, 3 adım; son ödül en fazla %5 kalıcı bonus; dekor görevi yok.
- **Diğer:** günlük görevler, Bal Defteri (ballar, kayıtlar, köy, etiket), istatistikler (toplam satılan ton),
  rakipler ve liderlik, Yıllık Bal Festivali, dekorlar (çit, bank, fener, kemer, çeşme), hava (yaz hep güneşli,
  sonbahar bulutlu/yağmurlu, ilkbahar karışık, kış karlı/yağmurlu), gerçek saatle gece modu (19:00–07:00, sadece görünüş),
  ortam sesleri, fotoğraf modu, kısayollar (H/P/S/D/F/Boşluk/Esc), bildirim zili (son 20), masaüstü Nero uyarıları,
  "sen yokken" özeti, ilk açılış tanıtımı, köylü mektupları, oyun içi ⚙️ Ayarlar (grafik Yüksek/Dengeli/Hafif, gece, sesler,
  bildirim tercihleri, kayıt dışa/içe aktarma, sıfırlama — oyun ayarları Nero panelinde değil, oyunun içinde),
  kovanlar özeti (K), toplu şurup, hazır siparişler, Pazar filtresi, üzerine gelince bilgi, adaya dön (R), ←/→ kovan gezinme, ? kısayol listesi.
- **Rozet bağlantısı:** oyun büyük anları `state.milestones`'a kaydeder; Nero rozetlerine bağlamayı **kullanıcı kendisi yapacak**.

---

## 8. Onaylanmış ama henüz yapılmamış işler

Şu an bekleyen onaylı iş yok. (5.5.0'da yapılanlar: köylü mektupları, oyun içi Ayarlar + grafik kalitesi + bildirim tercihleri,
kovanlar özeti, toplu şurup, hazır siparişler, üzerine gelince bilgi, adaya dön, pahalı işlem onayı, pencere hatırlama,
Pazar filtre/sıralama, kısayol listesi, Nero ipuçları, bildirimden ilgili yere gitme, kovanlar arasında ←/→, sipariş sıralama.)
Yeni işler onaylandıkça buraya ekle.

## 9. Kullanıcının verdiği kararlar (bunları geri getirme)

- Temayı kullanıcıdan izinsiz **otomatik değiştirme yok**.
- **Karışık bal yok**; her çiçek kendi balı.
- Gezgin satıcı **dekor satmaz**; hikâyelerde **dekor gerektiren adım yok**.
- Buff'lar oyunu bozacak kadar güçlü olmamalı (hikâye ödülleri en fazla %5).
- Köy, oyuncunun adasına dokunmaz; ada hep tam altıgen kalır.
- Reddedilen öneriler: oğul verme, hasat mini oyunu, günlük ziyaret serisi, art arda ekim, son tohumu hatırlama,
  arayüz boyutu ayarı, hasat uyarı eşiği, doğal tehlikeler, mevsimlik etkinlikler (şimdilik).
- Açık konu: Kerim Dede köye 32.000 kg'da geldiği için hikâyesi oyunun sonuna kalıyor; şimdilik böyle bırakıldı.

---

## 10. Çalışma tarzım

- Önce konuşup karar veririz, sonra kodlarız. Bir şeyi yapmadan önce kısaca planı göster ve onay al.
- Büyük işleri aşamalara böl; her aşamadan sonra test et ve ne yaptığını kısaca özetle.
- Exe'yi ben istediğimde çıkar; aradaki değişiklikleri biriktir.
- Cevaplar kısa olsun; uzun tablo ve paragraflardan kaçın, gerekli olanı yaz.
- Yeni özellik ya da kural değişince **oyuncu rehberini (docs/ARICILIK-REHBERI.md) ve oyun içi Rehber'i güncellemeyi unutma**.
