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

## Aşama 1 — İş süresi + kronometre

### Yeni
- İş eklerken **planlanan süre** opsiyonel olarak elle girilebiliyor; 25/50 gibi preset zorunluluğu yok, 65 / 120 / 185 dk gibi arbitrary dakika değerleri destekleniyor.
- Her aktif iş için ayrı **başlat / duraklat / devam et** kronometresi eklendi.
- Kronometre süresi iş objesinde kalıcı tutuluyor ve pause/resume sırasında birikimli ilerliyor.
- Tamamlanan işlerde **Plan** ve **Gerçek** süre damgaları gösteriliyor.
- Arşivlenen işler planlanan ve gerçek süre bilgisini koruyor.

### Davranış
- Kronometre çalışırken iş tamamlandı olarak işaretlenirse kronometre **otomatik duruyor** ve geçen süre kullanıcıdan ikinci onay istemeden kaydediliyor.
- Tamamlanan iş tekrar aktif hale getirilirse önceki gerçek süre silinmiyor; yeniden başlatılan kronometre mevcut toplamın üzerine ekleniyor.
- Aynı anda yalnız bir iş kronometresi çalışıyor; başka bir iş kronometresi başlatılırsa önceki güvenli biçimde duraklatılıyor.
- Genel Nero odak sayacı ile iş kronometresi aynı anda çalışmıyor; böylece focus istatistiklerinde duplicate counting engelleniyor.
- İş kronometresi odak dakikalarına katkı yapıyor ancak normal timer tamamlanma/yarıda bırakma sayaçlarını ve timer achievement serilerini yapay biçimde tetiklemiyor.
- Uygulama normal şekilde kapanırken çalışan iş kronometresi duraklatılıyor; kapalı geçirilen süre bir sonraki açılışta çalışma süresi sayılmıyor.

### UI / Tema
- İş ekleme satırındaki eski iç içe input görünümüne yol açan genel CSS selector kaldırıldı.
- Planlanan süre alanı tek parça kompakt **⏱ dakika** kontrolüne dönüştürüldü.
- Hatırlatma saati ayrı bir kontrol olarak korunuyor ve saat/kronometre anlam karmaşası azaltıldı.
- Kronometre kontrolü ve süre damgaları Latte, Pazartesi, Gece, Disket, Kasaba, Yağmur, Kar, Çilek, Mum ve Ege temalarının görsel diline uyarlandı.
- Dar panel genişliğinde görev metni üst satıra, süre/hatırlatma/ekleme kontrolleri alt satıra geçerek sıkışma azaltılıyor.

### Veri Uyumluluğu
- Eski todo kayıtları yeni timing alanları olmadan da otomatik normalize ediliyor.
- Yeni alanlar: `plannedDurationMin`, `actualDurationMs`, `stopwatchStartedAt`, `focusCreditedMin`.
- Beklenmedik kapanıştan kalmış bir running timestamp yeni açılışta çevrimdışı zamanı saymadan temizleniyor.

### Test
- Yeni planlanan süre ve kronometre davranışları için özel test paketi eklendi.
- Pause/resume birikimi, arbitrary dakika, final focus credit ve duplicate counting test edildi.
- Tüm mevcut regresyonlarla birlikte **31/31 test başarılı, 0 hata**.
- Syntax ve 4.3.0 source integration kontrolleri başarılı.
- EXE üretilmedi.

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
