# NERO v4.1.0 — Arşiv, Moodboard ve Ayarlar UI Task Spec

> Durum: **Implement edildi — EXE oluşturulmadı**
>
> Baz kaynak: `source-v4.1.0`
>
> Bu belge, mevcut 4.1.0 kaynak kodu üzerinde yapılacak değişiklikleri netleştirir. EXE/build bu aşamada oluşturulmayacaktır.

---

## 0. Genel Kurallar

- Tema bütünlüğü korunacak. Yeni eklenen hiçbir UI parçası tek bir “genel” görünüme zorlanmayacak.
- Yeni arşiv, moodboard ve ayarlar kontrolleri **tüm temalarda o temanın mevcut görsel diline uyarlanacak**.
- Mevcut kullanıcı verileri silinmeyecek; migration geriye dönük uyumlu olacak.
- Mevcut 665 Home repliği, 125 achievement sistemi ve rarity sekmeleri etkilenmeyecek.
- Uygulama verileri kullanıcı onayı olmadan silinmeyecek.
- Bu task grubu tamamlanmadan release/EXE üretilmeyecek.

---

# TASK 1 — İşler Sayfasına Kullanıcı Kontrollü Arşiv

## Amaç

Tamamlanmış işler zamanla yüzlerce satıra ulaşmasın. Kullanıcı istediği tamamlanmış işleri **kendisi arşivleyebilsin**.

## Onaylanan Davranış

- Otomatik arşivleme **yok**.
- Kullanıcı tamamlanan bir işi manuel olarak arşivler.
- Arşivlenen iş ana “İşler” listesinden çıkar.
- İşler sayfasının altında **“Arşivler”** adlı kapatılıp/açılabilen bir bölüm bulunur.
- Arşiv içinde işler **ay ay gruplanır**:
  - Eylül 2026
  - Ağustos 2026
  - Temmuz 2026
- Her ay kendi accordion/dropdown alanına sahip olur.
- En yeni ay en üstte yer alır.
- Ay içinde en son arşivlenen/tamamlanan iş en üstte görünür.
- Arşivden geri çıkarma / “Aktife al” davranışı desteklenmelidir.
- Silme işlemi arşivlemeden farklı kalmalıdır.

## Önerilen Veri Modeli

Mevcut todo objesine:

```js
{
  id,
  text,
  done,
  createdAt,
  doneAt,
  remindAt,
  reminded,
  archivedAt: null
}
```

- `archivedAt === null` → normal listede
- `archivedAt !== null` → Arşivler bölümünde

## Mevcut Kod Konumları

- `src/renderer/panel/index.html`
  - İşler sayfası: yaklaşık **209–236**
  - `todo-list`
  - `todo-footer`
  - mevcut `Bitenleri temizle`
- `src/renderer/panel/panel.js`
  - `renderTodos()` yaklaşık **475–550**
- `src/main/main.js`
  - `todos:toggle` yaklaşık **1288–1330**
  - `todos:delete`
  - `todos:clearDone` yaklaşık **1351–1356**
  - `todosStore` başlangıcı yaklaşık **2095**
- `src/preload/preload.js`
  - Todo IPC allowlist

## Eklenecek IPC

Öneri:

```txt
todos:archive
todos:unarchive
```

## UI

- Tamamlanmış işte mevcut silme kontrolünden ayrı bir **Arşivle** aksiyonu.
- Sayfanın altı:
  - `Arşivler ▾`
  - kapalıyken yalnız başlık ve toplam adet
  - açıldığında aylık accordionlar
- Tema bazlı görünüm:
  - Kasaba → dosya/arşiv gazetesi dili
  - Disket → klasör / DOS arşivi dili
  - Cozy/Latte → yumuşak kart
  - Resimli temalar → mevcut kart dokularına uyumlu

## Kabul Kriterleri

- [ ] Kullanıcı arşivlemeden hiçbir tamamlanmış iş otomatik taşınmaz.
- [ ] Arşivlenen iş ana listede görünmez.
- [ ] Arşiv ay bazında doğru gruplanır.
- [ ] Arşiv aç/kapa durumu düzgün çalışır.
- [ ] Arşivden geri alma mümkündür.
- [ ] Eski todo verileri migration gerektirmeden çalışır.

---

# TASK 2 — Notlar Sayfasına Arşiv Sistemi

## Amaç

Notlar sayfası da yüzlerce aktif notla dolmasın.

## Onaylanan Davranış

- Notlar **otomatik arşivlenmez**.
- Kullanıcı notu manuel olarak **Arşivle** seçeneğiyle arşivler.
- Arşivlenen not aktif not listesinden çıkar.
- Notlar sayfasının altında **Arşivler** adlı açılır/kapanır alan bulunur.
- Arşivler ay ay gruplanır.
- Her ay ayrı accordion/dropdown olarak açılır.
- Arşivden geri çıkarma desteklenir.
- “Sil” ve “Arşivle” ayrı aksiyonlar olarak kalır.

## Önerilen Veri Modeli

```js
{
  id,
  body,
  createdAt,
  updatedAt,
  archivedAt: null
}
```

## Mevcut Kod Konumları

- `src/renderer/panel/index.html`
  - Notlar: yaklaşık **181–204**
- `src/renderer/panel/panel.js`
  - `renderNotes()` yaklaşık **365–419**
  - note editor yaklaşık **421+**
- `src/main/main.js`
  - `notes:save`
  - `notes:delete`
  - `notesStore` yaklaşık **2094**
  - `fullState()` → notes yaklaşık **947**
- `src/preload/preload.js`
  - Notes IPC allowlist

## Eklenecek IPC

```txt
notes:archive
notes:unarchive
```

## Kabul Kriterleri

- [ ] Arşivlenmiş not normal listede görünmez.
- [ ] Arşivler aylık gruplanır.
- [ ] Arşivden geri alma mümkündür.
- [ ] Mevcut notlar `archivedAt` olmadan aktif kabul edilir.
- [ ] Tema bazlı not kartı görünümü arşiv alanında da korunur.

---

# TASK 3 — Ana Sayfa “Bu Ay Yaptıkların” Alanını Kompaktlaştır

## Amaç

Ana sayfada uzun bir tamamlanan işler listesi oluşmasını engellemek.

## Onaylanan Davranış

- En üstte **daima en son tamamlanan iş** görünür.
- İlk **5 tamamlanan iş** doğrudan gösterilir.
- 5’ten fazla kayıt varsa:
  - `6 iş daha ↓`
  - veya temaya uygun eşdeğer bir aç/kapa kontrolü gösterilir.
- Kullanıcı açtığında kalan işler görünür.
- Tekrar kapatılabilir.
- Sayaç üstte ayın toplam iş sayısını göstermeye devam eder.
- Sıralama: **en yeni → en eski**.

## Mevcut Kod Konumları

- `src/main/journal.js`
  - `thisMonth()` yaklaşık **84–90**
  - sıralama zaten `b.doneAt - a.doneAt`
- `src/main/main.js`
  - `buildHome()` yaklaşık **638–642**
  - şu anda `journal.thisMonth(8)`
- `src/renderer/panel/index.html`
  - `archive-card`
- `src/renderer/panel/panel.js`
  - `renderArchive()` yaklaşık **937–949**
- `src/renderer/panel/panel.css`
  - `.archive`
  - `.archive-list`

## Teknik Değişiklik

- Home state yalnız 8 kayıtla sınırlandırılmayacak.
- Renderer:
  - ilk 5 kayıt
  - geri kalanı collapsed alan

## Kabul Kriterleri

- [ ] 1–5 iş varsa dropdown görünmez.
- [ ] 6+ iş varsa ilk 5 görünür.
- [ ] En son tamamlanan iş daima ilk sıradadır.
- [ ] Aç/kapa tema değişiminde bozulmaz.

---

# TASK 4 — İki Katmanlı Moodboard Sistemi

Bu task iki ayrı moodboard içerir:

1. **Benim Moodboard’um** — kullanıcı manuel doldurur.
2. **Nero’nun Moodboard’u** — Nero’nun mevcut otomatik mood/happiness verisinden oluşur.

Mevcut “Son 30 gün” görseli kaldırılacak / yeniden tasarlanacak.

---

## TASK 4A — Benim Moodboard’um

### Onaylanan Davranış

- Her takvim günü için bir yuvarlak bulunur.
- Sabit 30 yerine **ayın gerçek gün sayısı** kullanılır:
  - Şubat: 28/29
  - 30 günlük ay: 30
  - 31 günlük ay: 31
- Boş gün:
  - içi boş / nötr / renksiz
  - tema ile uyumlu border ve yüzey
- Kullanıcı bir güne tıklayınca üç seçenek açılır:
  - 🟢 Yeşil
  - 🟡 Sarı
  - 🔴 Kırmızı
- Aynı günün seçimi sonradan değiştirilebilir.
- Gelecek günler seçilemez.
- Her gün tek kayıt vardır.

### Veri Modeli

Yeni ve Nero mood’undan bağımsız store:

```txt
user-moodboard.json
```

Örnek:

```json
{
  "days": {
    "2026-09-01": "green",
    "2026-09-02": "yellow",
    "2026-09-03": "red"
  }
}
```

### Aylık Geçiş

Yeni aya ilk girişte:

1. Önceki ay kapanır.
2. Önceki ayın moodboard görseli oluşturulur.
3. Görsel kullanıcı klasörüne kaydedilir.
4. Eski JSON verisi **silinmez**.
5. Yeni ay boş görünür.

### Görsel Kaydetme — MÜMKÜN

**Evet, Electron içinde bunu yapmak mümkün.**

Önerilen klasör:

```txt
Resimler/Nero Moodboards/
```

Örnek dosya:

```txt
Nero-Moodboard-2026-09.png
```

PNG üretimi için güvenli yaklaşım:
- moodboard için özel render yüzeyi / offscreen HTML
- Electron `webContents.capturePage()` veya eşdeğer native image akışı
- PNG olarak `fs.writeFileSync(...)`

### Aylık Görsel İçeriği

Öneri: PNG yalnız kullanıcının board’unu değil, o ayın **iki board’unu birlikte** taşısın:

```txt
Eylül 2026

Benim Moodboard’um
● ● ○ ● ...

Nero’nun Moodboard’u
● ● ● ○ ...
```

Böylece aylık arşiv tek dosyada Nero ile kullanıcının ayını yan yana saklar.

---

## TASK 4B — Nero’nun Moodboard’u

### Mevcut Sistem

Şu anda kullanıcı mood’u değil, Nero’nun kendi `happiness` değeri kaydediliyor.

Kod:

- `src/main/journal.js`
  - `MOOD_BUCKETS` yaklaşık **24–33**
  - `recordHappiness()` yaklaşık **47–57**
  - `last30()` yaklaşık **59–71**
- `src/main/main.js`
  - her 30 saniyede:
    `journal.recordHappiness(mood.summary().happiness)`
    yaklaşık **1658**
  - `moodLogStore` yaklaşık **2099**
  - `buildHome()` içinde `journal.last30()` yaklaşık **640**
- `src/renderer/panel/panel.js`
  - `renderMoodLog()` yaklaşık **924–935**
- `src/renderer/panel/panel.css`
  - `.mood-strip`
  - `.mood-dot`
  - `c1–c5`

### Yeni Davranış

- Bu otomatik sistem **korunacak**.
- Ancak “Son 30 gün” yerine takvim ayına bağlı **Nero’nun Moodboard’u** olarak gösterilecek.
- Kullanıcı moodboard’unun hemen altında yer alacak.
- Kullanıcının board’una tıklanabilir; Nero’nun board’u salt okunur.
- Nero’nun mevcut 5 bucket verisi korunabilir:
  - zor
  - sıkıntılı
  - idare eder
  - iyi
  - keyifli
- Renklerin final tonları tema bütünlüğüne göre uyarlanır.

---

## TASK 4C — Moodboard Tasarımı / Tema Bütünlüğü

**Bu alan mevcut kötü “nokta grid” görünümünden yeniden tasarlanacak.**

Temel tasarım:

- Grid ay gün sayısına göre 7 sütun veya dengeli kompakt grid.
- Her dot/gün:
  - yeterli tıklama alanı
  - hover/focus durumunda tarih
  - tooltip
- Başlık:
  - `Benim Moodboard’um`
  - `Nero’nun Moodboard’u`
- Ay başlığı:
  - `Eylül 2026`

### Tema Kuralı

Moodboard tek tip görünmeyecek.

Örnek yaklaşım:

- **Kasaba:** gazete/takvim noktaları, serif/courier detay
- **Disket:** piksel hücre / retro LED hissi
- **Latte:** kahve tonu çerçeveli yumuşak noktalar
- **Yağmur/Kar:** cam/soft ışık
- **Çilek/Mum/Ege:** tema dekoru ve mevcut yüzey dili
- **Cozy/Pazartesi vb.:** kendi border-radius, border, surface ve typography değerlerini miras alır

Renk anlamları sabit kalır; **sunum şekli temaya göre değişebilir**.

## Kabul Kriterleri

- [ ] Kullanıcı ve Nero moodboard’ları birbirinden bağımsızdır.
- [ ] Kullanıcı sadece kendi board’unu düzenler.
- [ ] Nero board’u mevcut otomatik happiness verisinden dolar.
- [ ] Yeni ayda yeni board boş başlar.
- [ ] Önceki ay PNG olarak kaydedilir.
- [ ] Geçmiş JSON silinmez.
- [ ] Ayın gün sayısı doğru gösterilir.
- [ ] Tüm temalarda özel UI kontrolü yapılır.
- [ ] Klavye focus ve tooltip erişilebilirliği vardır.

---

# TASK 5 — Ayarlar Sekmesini Üst Sağ Dişli İkona Taşı

## Amaç

Ana navigation bar’ı sadeleştirmek ve Ayarlar’ı masaüstü uygulamalarındaki klasik konumuna taşımak.

## Onaylanan Yerleşim

Üst sağ kontrol grubu:

```txt
⚙    📌  −  ×
```

- Dişli, **pin ikonunun solunda**.
- Dişli ile pencere kontrolleri arasında görsel boşluk/ayraç bulunur.
- Ana navbar’dan **Ayarlar** sekmesi tamamen kaldırılır.
- Ana navbar:

```txt
Bugün | Notlar | İşler | Zaman/Sayaç | Rozetler
```

## Tema Bütünlüğü — ZORUNLU

**Dişli hiçbir temada sabit generic bir ikon gibi görünmeyecek.**

Uygulama yaklaşımı:

- SVG geometri ortak olabilir.
- `stroke: currentColor` / CSS custom properties kullanılacak.
- Boyut, border, radius, background, hover, active state temaya göre override edilecek.
- Gerekirse tema bazında icon styling yapılacak.
- Kasaba/Disket gibi karakteristik temalarda dişli de o temanın UI diline uyacak.
- Ayarlar açıkken dişli “active” görünür.
- Hover/focus state her temada okunaklı olacak.

## Mevcut Kod Konumları

- `src/renderer/panel/index.html`
  - header sağ kontroller yaklaşık **20–34**
  - navbar yaklaşık **35–60**
  - mevcut `data-tab="settings"` burada
  - Settings view yaklaşık **270+**
- `src/renderer/panel/panel.js`
  - tab sistemi yaklaşık **225–236**
  - `selectTab(tab)`
- `src/renderer/panel/panel.css`
  - header/window control stilleri
- `src/renderer/panel/skins.css`
  - tema bazlı top controls / tabs stilleri

## Kabul Kriterleri

- [ ] Navbar’da Ayarlar görünmez.
- [ ] Dişli üst sağda pinin solundadır.
- [ ] Dişliye basınca mevcut Settings view açılır.
- [ ] Ayarlar açıkken active state görünür.
- [ ] Tema değişince dişli temayla birlikte görsel olarak değişir.
- [ ] Pin / küçült / kapat davranışları etkilenmez.
- [ ] Klavye ile erişilebilir ve `aria-label="Ayarlar"` içerir.

---

# Etkilenecek Ana Dosyalar

```txt
src/renderer/panel/index.html
src/renderer/panel/panel.js
src/renderer/panel/panel.css
src/renderer/panel/skins.css

src/main/main.js
src/main/journal.js
src/preload/preload.js

test/
```

Yeni yardımcı modüller eklenebilir:

```txt
src/main/moodboard.js
src/main/archive.js
```

Bu ayrım, `main.js` ve `journal.js` dosyalarının gereksiz büyümesini önlemek için tercih edilebilir.

---

# Test Planı

## İş Arşivi

- [ ] Tamamlanan iş manuel arşivlenir.
- [ ] Açık iş arşivlenemez veya önce tamamlanma gerekir.
- [ ] Ay gruplaması yıl sınırında doğru çalışır.
- [ ] Arşivden geri alma çalışır.
- [ ] Eski todo JSON’u bozulmaz.

## Not Arşivi

- [ ] Not manuel arşivlenir.
- [ ] Arşivden geri döner.
- [ ] Ay/yıl gruplaması doğrudur.
- [ ] Silme ve arşivleme farklı davranır.

## Home “Bu ay yaptıkların”

- [ ] 5 ve altı iş → dropdown yok.
- [ ] 6+ → ilk 5 + kalanlar kontrolü.
- [ ] Sıralama newest-first.

## Moodboard

- [ ] 28/29/30/31 gün doğru.
- [ ] Gelecek gün kilitli.
- [ ] Gün rengi değiştirilebilir.
- [ ] User ve Nero verileri birbirine karışmaz.
- [ ] Ay değişiminde PNG bir kez üretilir.
- [ ] PNG tekrar tekrar duplicate oluşmaz.
- [ ] Uygulama ayın 1’inde kapalı olsa bile sonraki ilk açılışta önceki ay arşivlenir.
- [ ] Timezone/local date doğru kullanılır.

## Ayarlar Dişlisi

- [ ] Tüm temalarda görünür ve uyumlu.
- [ ] Navbar 5 ana sekmeye düşer.
- [ ] Dişli aktif state.
- [ ] Pencere kontrolleri bozulmaz.

---

# Uygulama Sırası Önerisi

1. Veri migration ve archive modelleri
2. Todo arşivi
3. Note arşivi
4. Home “Bu ay yaptıkların” dropdown
5. User Moodboard veri motoru
6. Nero Moodboard’un aylık modele taşınması
7. Aylık PNG export
8. Moodboard UI
9. Tüm tema moodboard override’ları
10. Ayarlar dişlisi
11. Tema bazlı dişli override’ları
12. Regression testleri
13. Kaynak kod güncellemesi
14. Kullanıcı onayından sonra EXE/build

---

# Bu Aşamada Yapılmayacaklar

- EXE oluşturulmayacak.
- GitHub Release açılmayacak.
- Version bump yapılmayacak.
- Kullanıcı verisi silinmeyecek.
- `main` branch’e merge yapılmayacak.


---

## Uygulama Sonucu

- Kaynak sürüm: `4.1.0`
- Yerel otomatik testler: **34/34 başarılı**
- JavaScript syntax kontrolleri: başarılı
- HTML ID / renderer DOM referans bütünlüğü: başarılı
- EXE / release: bu task kapsamında oluşturulmadı
