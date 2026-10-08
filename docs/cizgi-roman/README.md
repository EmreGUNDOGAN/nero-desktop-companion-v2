# Çizgi Roman Arası — Nero 9.6.8

Onaylanan çizgi roman konseptinin çalışan Nero ekranlarına uygulanmış yeni, seçilebilir temasıdır. Mevcut temalar ve Finans Merkezi bu kaynak paketinde korunur.

## Kullanım

Bu paket tüm uygulamanın kaynak kodudur; kurulu Nero EXE dosyasını kendi başına değiştirmez. Kaynak projeyi normal Nero geliştirme/derleme yöntemiyle çalıştırın. Ayarlar → Görünüm → Tema → **Çizgi Roman Arası** seçin. Bütçe bölümünün ayrıca kendi görünüm seçimi vardır: Finans ayarları → Finans görünümü → **Nero teması** ile çizgi roman görünümü; **Finans Merkezi** ile önceki koyu tasarım kullanılır.

## Kapsam

Bugün, Notlar, İşler, Sayaç, Rozetler, Ayarlar ve Bütçe'nin sekiz alt bölümü. Arşivler, diyaloglar, kıyafet dolabı, küçük not penceresi, Nero konuşma balonu, sayaç rozeti ve odak tamamlandı bildirimi aynı görsel dili kullanır. Karakter ve kıyafet dosyaları değiştirilmedi.

Notlar ekranında seçilen not için otomatik kaydeden bir düzenleyici ve kalın/italik/liste/bağlantı araçları vardır. Biçimlendirme mevcut düz metin not gövdesinde Markdown olarak saklanır. Diğer temalar bu işaretleri düz metin olarak gösterebilir. Notun tam ekran düzenleyicisine sağdaki ayrıntılar düğmesiyle erişilir. Bağlantılar http/https ile sınırlıdır; HTML yapıştırma yerine düz metin kullanılır.

## Doğrulama

- Mevcut 340 Node testi geçti.
- Gerçek Windows Electron: 6 ana ekran × 4 boyut/ölçek = 24 yerleşim kontrolü.
- Çizgi roman bütçesi: 8 sekme × 3 boyut = 24 kontrol.
- Önceki Finans Merkezi: 120 boyut/tema/yazı boyutu kontrolü, gerçek gelir-gider-aktarma formları, arama, hedef, ödeme, takvim, akademi ve yedek dönüşü.
- Not otomatik kaydı, kalın metin ve bağlantı, arşivleme, yeni not; görev ekleme/tamamlama; sayaç 25/45/600 dakika, ilerleme, duraklatma/devam/bırakma; rozet filtreleri; kavanoz; klavye; sahne kapatma; eski temalara geçiş; boş kayıtlar; küçük hızlı not penceresi doğrulandı.
- Karakterin gerçek ön yükleyicisi, bütün resim katmanları, konuşma ve sayaç rozeti; odak tamamlandı bildirimi doğrulandı.

`actual-preview.png` ve `screens/` çalışan uygulamadan alınmıştır. Görüntülerdeki kayıtlar izole test verileridir; kullanıcı kayıtlarına eklenmez. `references/approved-concept.png` ise onaylanan üretilmiş konsepttir.

Test girişleri: `test/comic-ui-smoke.cjs`, `test/comic-finance-ui.cjs`, `test/comic-character-smoke.cjs`. Electron ile proje kökünden çalıştırılır. Sonuçlar bu klasörde JSON raporlarıyla bulunur.

## Varlıklar

Dört şehir/çizgi roman çizimi tema altında yereldir. İkonlar canlı SVG'dir; yazılar ve sayılar resimlere gömülmez. Yazı tipleri yerel Barlow Condensed dosyalarıdır; lisans `src/renderer/fonts/OFL-BarlowCondensed.txt`. Ağ bağlantısı veya yeni bir çalışma zamanı hizmeti gerektirmez.
