# Tasarım ve doğrulama kuralları

Bu dosya kullanıcının 7 Ekim 2026 tarihli “bir işlemi yaparken olduğundan emin olmadan devam etme” talebini ve önceki detay taleplerini kaydeder.

1. Bir dosya, ikon, görsel, ekran veya test hazır denmeden önce gerçekten mevcut olduğu ve kullanılabildiği kontrol edilir. Eski konuşma özeti doğrulama kanıtı sayılmaz.
2. Onaylanan referansın biçimleri, görselleri, kartları, yazı hiyerarşisi ve kompozisyonu esas alınır. Sadece renk değişimi tema teslimi sayılmaz.
3. Ayrıntılı çizimler için gereken gerçek görsel varlıklar üretilir ve kaynakla birlikte verilir. CSS, JavaScript, PNG, SVG veya canvas uygun göreve göre seçilir; bütün tasarım tek bir teknikle sınırlandırılmaz.
4. Yalnızca iki ekran yapılmaz. Bugün, Notlar, İşler, Sayaç, Rozetler, Ayarlar; bunların düzenleyicileri, arşivleri, boş durumları ve yardımcı kayıt/konuşma yüzeyleri birlikte kontrol edilir.
5. Kullanıcı yazıları güvenli metin olarak işlenir. Grafik ve sayaç değerleri canlıdır; tasarımın içine gömülü sahte değerler kullanılmaz.
6. Temaya geçiş ve temadan çıkış kontrol edilir. Yeni düzenin DOM taşıma işlemleri eski temalara dönünce geri alınır. Önceki kaynaklar ve kullanıcı özellikleri korunur.
7. Gerçek Electron renderinde küçük pencere, standart pencere ve %125 ölçek incelenir. Yatay taşma, kırpılma, okunamayan yazı ve eksik görsel teslimden önce düzeltilir.
8. Not yazma/kaydetme/arşivleme, iş tamamlama, sayaç durumları, uzun özel süre, rozet filtreleri, klavye ve boş veriler denenir. Sadece statik görselin güzel olması işlev doğrulaması değildir.
9. Son önizlemeler çalışan uygulamadan alınır; oluşturulan konsept resmi tamamlanmış yazılımın kanıtı diye sunulmaz.
10. Kaynak ZIP açılarak okunur, gerekli tüm kaynak ve görsel dosyaları içerdiği doğrulanır. Doğrulanmayan kapsam açıkça belirtilir.
