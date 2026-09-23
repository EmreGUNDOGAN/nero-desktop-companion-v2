# Nero 4.3.1

4.3.1, 4.3.0 üzerine pencere etkileşimleri, görev çubuğu davranışı, Moodboard düzeni ve yardım arayüzü için odaklı bir düzeltme/polish sürümüdür.

## Düzeltildi
- **Nero ve panel sürükleme:** panel ve karakter art arda tekrar tekrar sürüklenebiliyor.
- **Minimize / görev çubuğundan geri dönüş sonrası sürükleme:** uygulama görev çubuğundan geri getirildiğinde hem panel hem Nero'nun etkileşim durumu temizleniyor; Nero'yu yeniden sürüklemek için önce paneli hareket ettirmek gerekmiyor.
- **Şeffaf Nero penceresi hit-test yenilemesi:** Windows restore sonrasında karakter penceresinin mouse alanının takılı kalmasına yol açan durum giderildi.
- **Üst pencere kontrolleri:** Ayarlar, Sabitle, Küçült ve Kapat butonlarının tıklanabilirliği korunurken panel sürükleme alanı kontrollerden ayrıldı.
- **Konum kilidi:** kilit açıkken aktif sürüklemeler kapatılıyor; kilit kaldırıldığında sürükleme yeniden kullanılabiliyor.

## Görev çubuğu davranışı
- Panel açıksa Nero görev çubuğundan geri çağrıldığında **Nero ve panel birlikte öne geliyor**.
- Panel kapalıysa görev çubuğundan geri çağırmak **yalnız Nero'yu öne getiriyor**; panel zorla açılmıyor.
- Tekrar tekrar minimize / restore akışında mevcut panel görünürlük durumu korunuyor.

## Moodboard
- Takvim 7 eşit sütunlu, doğal içerik yüksekliğinde ve daha kompakt bir düzene geçirildi.
- Dar panelde hücreler 32 px, normal panelde 36 px ritminde tutuluyor; satırlar arasında gereksiz dikey boşluk bırakılmıyor.
- Geniş panelde Moodboard kartı iki sütuna sıkışmak yerine tam genişliği kullanıyor.
- Duygu dili güncellendi:
  - Yeşil: **Muhteşem**
  - Sarı: **İdare eder**
  - Kırmızı: **Kötü**
- Saklanan veri biçimi değişmedi; mevcut `green / yellow / red` kayıtları dönüştürülmeden kullanılmaya devam ediyor.

## Yardım ikonları ve tooltip
- Ana sayfadaki `?` ikonları tüm temalarda küçük, bordersız ve transparan hale getirildi.
- Yardım tooltip'i artık kartın kendi stacking/overflow katmanında değil, **body seviyesinde tek bir sabit overlay** olarak çiziliyor.
- Tooltip viewport içinde yatay/dikey olarak sınırlandırılıyor; içerik, kart veya tema dekorlarının arkasında kalmıyor.
- Hover, klavye focus ve tıklama davranışları korunuyor; aynı anda yalnız bir yardım tooltip'i açık kalıyor.
- Latte, Pazartesi, Gece, Disket, Kasaba, Yağmur, Kar, Çilekli Piknik, Mum Işığı ve Ege Yazı temalarının görsel dili korunuyor.

## Veri ve geriye uyumluluk
- 4.3.0'daki notlar, işler, arşivler, moodboard kayıtları, istatistikler, rozetler ve ayarlar için veri şeması değiştirilmedi.
- Moodboard renk değerleri değiştirilmedi; yalnız kullanıcıya gösterilen etiketler güncellendi.
- 4.3.0'daki güvenli stats reset, iş kronometresi, moodboard geçmişi ve Home Dialogue davranışları korunuyor.

## Doğrulama
- Node regression test paketi çalıştırıldı.
- 10 temada üst pencere kontrolleri için Electron hit-test smoke testi çalıştırıldı.
- Panelin art arda pointer drag gesture'ları ve minimize/restore sonrası tekrar sürükleme senaryosu test edildi.
- Moodboard compact layout ve duygu etiketleri 10 temada Electron smoke testiyle doğrulandı.
- Yardım ikonları ve root tooltip katmanı 10 temada Electron smoke testiyle doğrulandı.
