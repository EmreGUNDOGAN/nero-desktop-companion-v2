# Nero 6.3.6 — Tema Koleksiyonu ve Arıcılık İnce Ayarları

## Arıcılık düzeltmeleri

- Sonbahar mevsim ikonundaki sürekli emoji/SVG geçişi kaldırıldı; mevsim ikonunu artık yalnızca UI2 yönetiyor.
- Arıcılık ekranındaki Nero'nun konuşma animasyonu, konuşma balonu kapandığı anda duruyor.
- Sol alttaki uyarı ünlemi, kart tasarımına dokunmadan daha yumuşak kırmızı tona geçirildi.
- Alt menüdeki **Hasat Et** vurgusu soft yeşil palete taşındı.

## Üretim etkileri

- Kovan panelindeki saatlik üretimin üzerine gelince **Üretim Etkileri** açıklaması açılıyor.
- Tooltip yalnızca gerçekten aktif üretim etkilerini gösteriyor ve değerleri canlı üretim formülüyle aynı backend kaynaklarından alıyor.
- Hava, arı ırkı, hastalık, odak bonusu, vitamin, çiçek besini, turnuva bonusu, kovan boostu, tarh/çeşme bonusları, köy-hikâye etkileri, mevsim uyumu ve kış üretim çarpanları destekleniyor.
- Buff'lar soft yeşil, debuff'lar soft kırmızı gösteriliyor.

## Kış hazırlık bildirimi

- Sonbaharın son oyun gününde, yani kışa bir gün kala herhangi bir kovanda hiç şurup yoksa Windows bildirimi geliyor.
- Aynı kış için yalnızca bir bildirim gönderiliyor ve bu bilgi save'e yazıldığı için uygulama yeniden açılınca tekrar etmiyor.
- Sonraki oyun yılında yeniden çalışıyor ve arıcılık kış bildirimi/ses tercihlerine uyuyor.

## 12 yeni program teması

Nero'nun mevcut program düzeni korunarak, yalnızca renk değişimi olmayan 12 ayrı görsel dünya eklendi:

- **Sonbahar Kütüphanesi**
- **Amalfi Limonları**
- **Ortancalı Kır Evi**
- **Kış Tramvayı**
- **90'lar Kırtasiye**
- **Gece Treni**
- **Eski Fotoğrafçı**
- **Lavanta Akşamı**
- **Kış Bahçesi**
- **Gece Masası**
- **Analog Radyo**
- **Pastel Mutfak**

Yeni temalarda foto-gerçekçi/AI-raster arka plan kullanılmıyor. Arka plan ve tema işaretleri kontrollü SVG çizimlerden oluşuyor; her tema kendi objelerini, paletini ve küçük UI karakterini taşıyor.

### Rozet kuralı

- Rozetlerin mevcut şekli, ikonları, sıralaması ve davranışı değiştirilmedi.
- Tema değişiminde yalnızca rozet dairesinin arka plan rengi uyarlanıyor.
- **90'lar Kırtasiye** temasında aynı mevcut rozet sistemi korunurken daireler tema paletindeki pastel tonlar arasında dönüşümlü renklendiriliyor.
- Diğer yeni temalarda rozet arka planı tema başına tek renktir.

## Teknik

- Sürüm **6.3.6**.
- Yeni tema klasörleri mevcut kanonik Nero karakter katmanlarını yeniden kullanıyor; karakter anatomisi veya ifadeleri yeniden tasarlanmıyor.
- Arıcılık düzeltmeleri ve tema kuralları için yeni otomatik regresyon testleri eklendi.
