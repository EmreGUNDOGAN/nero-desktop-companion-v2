# Nero 6.6.4 — Dolap ve hareketler

Temel: bu görüşmede teslim edilen 6.6.3 kaynak paketi. 6.6.3'ün ekonomi/sipariş düzeltmeleri korunur. Ayrı bir 6.6.2 kaynak dalıyla birleştirme yapılmamıştır.

- Retro Gardırop, Masal Dünyası, Cozy Ev Hayatı, Uzay ve Bilim, Nero’ya Özel Absürt Şıklık: her temada 20, toplam 100 isimli kıyafet.
- Ayarlar içinde beş ayrı sekme; kalıcı kıyafet seçimi, otomatik kıyafet ve kıyafetleri çıkar seçenekleri.
- Onaylanan retro süveterin gövde ve kol çizimleri aynen korundu. Diğer yeni kıyafetler aynı omuz/yaka kalıbından üretildi. Kıyafetler saydam SVG parçaları olarak gövdeye ve ayrı hareket eden kollara bağlıdır.
- Nero'nun orijinal gövde konturu, tema yüz katmanları, göz kırpma, bakış takibi ve konuşma ağızları korunur. Masaüstündeki karakter tek bir PNG'ye dönüştürülmez.
- 13 hareket: gülmesini bastırma, düşünme, merakla bakma, dengesini toparlama, minik zafer, ayakla tempo, kollarını kavuşturma, etrafına bakma, sevilme, utanma, esneme, uykulu baş hareketi ve dans.
- Hareketler ilgili olaylardan ve seyrek boşta bekleme davranışlarından tetiklenir. Dolapta tek tek deneme ve yeni hareketleri kapatma kontrolleri vardır.
- Uyku, sürükleme, gizlenme ve kızgınlık süresi kontrolleri; hareket değiştiğinde eski zamanlayıcı ve dönüşümlerin temizlenmesi.
- Kıyafet değişimi canlı karaktere hemen gönderilir ve ayarlara kaydedilir. Desteklenmeyen özel temalar kendi çizimlerini kullanmaya devam eder.
- Doğum günü kıyafeti önceliklidir. Otomatik seçimde mevcut gece pijaması ve kış kıyafeti kuralları sürer; manuel seçim diğer zamanlarda korunur.
- 6.6.4 Windows Actions iş akışı kaynaklara eklendi; uzaktaki depoya gönderilmedi.

## Kapsam ve doğrulama

Bu pakette yeni eklenen koleksiyon 100 kıyafettir. Temel kaynakta bulunmayan eski geniş mevsim koleksiyonları yeniden oluşturulmuş sayılmaz. Mevcut üç otomatik tema kıyafeti korunur.

266 otomatik test başarılı. 100 SVG dosyası XML olarak doğrulandı ve karakter üzerinde statik toplu önizlemeleri incelendi. Hareketlerin zamanlayıcı, iptal, hedef katman ve olay kuralları test edildi. Windows/Electron üzerinde canlı görsel test ve setup derlemesi bu ortamda yapılmadı; bütün hareketlerin canlı ortamda kusursuz olduğu iddia edilmez.
