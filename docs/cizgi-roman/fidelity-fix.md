# Çizgi Roman Arası — görsel sadakat düzeltmesi

Kaynak: son teslim edilen Nero 9.6.8 Çizgi Roman Arası paketi. Kullanıcı 9.6.10 adını kendisinin değiştirdiğini ve temel kaynağın bu paket olduğunu doğruladı.

Düz renk istatistik kartları ayrı sarı/mavi/kırmızı çizimli panellerle değiştirildi. Notların ilk kartı bantlı kağıt, sonraki kartları iki farklı şehir/kağıt sahnesi kullanır. Grafik için ayrı bina çerçevesi, selamlama için mavi şehir sahnesi eklendi. Kavanoz büyütüldü; başlıklar, düğmeler ve sayaç bölümleri onaylanan çizgi roman çizgisine yaklaştırıldı.

Seçili not düzenleyicisi arşivden önce görünür. Yerleşim güncellenirken düzenleyicinin aynı yere tekrar taşınması engellendi; bu, otomatik kayıtta metin/bağlantı seçiminin kaybolmasını önler. Not özetlerinde satır sonları korunur. Sıfır odak süresinde dolu çubuk çizilmez. Veriler çizimlere gömülmedi.

Uygulanan stiller `comic-fidelity.css` içindedir; diğer temalara yalnızca Çizgi Roman Arası seçiliyken uygulanır. Mevcut karakter, kıyafetler ve finans kayıt biçimi korunur. Daha önce kilitlenen yeni özellikler ile SpongeBob temasının uygulaması bu düzeltmenin kapsamına alınmadı.

340 mevcut test, 24 ana ekran yerleşim kontrolü ve not/sayaç/tema geçiş işlemleri çalıştırıldı. Bütçede 24 Çizgi Roman yerleşimi ve 120 Finans Merkezi yerleşimi/işlem kontrolleri çalıştırıldı. Güncel JSON raporları bu klasördedir. `actual-preview.png` çalışan uygulamadan alınan ekran görüntülerini gösterir; içeriği izole test kayıtlarıdır.

Paket tüm kaynakları içerir. Kurulu EXE'yi otomatik değiştirmez; normal Nero çalıştırma/derleme yöntemiyle kullanılmalıdır.
