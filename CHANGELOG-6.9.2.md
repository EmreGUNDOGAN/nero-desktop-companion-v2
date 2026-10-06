# Nero 6.9.2 — Finans

Bu sürüm, gönderilen gelişmiş finans kaynak paketinin 6.9.2 olarak derlenen dağıtımıdır.

## Geliştirilmiş finans çalışma alanı

- Tasarım yeniden düzenlendi; ayrı gelir/gider/transfer düğmeleri ve örnekli hesap açıklamaları.
- Başlangıç rehberi, bağlamsal “?” pencereleri, rahat/büyük yazı seçimi.
- Renkli halka grafikler, dairesel bütçe/hedef ilerlemesi, günlük ve 3/6/12 aylık eğriler; kategoriye dokunarak işlemleri açma.
- Aylık değerlendirme ve geliştirilmiş PDF özeti.
- Kart son ödeme günü bildirimi ve aylık ödeme takvimi.
- İşlem şablonları, benzer kayıt uyarısı ve son uygun düzenlemeyi geri alma.
- Finans El Kitabı: 26 bölüm, 30 terim, dört eğitim hesaplayıcısı; okuma ilerlemesi, kaydedilenler, arama, kaynaklar ve Morgan Housel okuma rafı notu.
- Eski 6.9.1 bütçe yedekleri yeni alanlar olmadan da yüklenir.

## Bütçe temel kapsamı

Mevcut Nero paneline tema renklerini ve yazı tiplerini kullanan Bütçe sayfası eklendi. Önceki görev, odaklanma, tema ve oyun özellikleri korunur.

- **Özet:** Aylık gelir, iadeler düşülmüş gider, gelir-gider farkı, kalan bütçe, net varlık, yaklaşan ödemeler ve son işlemler.
- **İşlemler:** Gelir, gider, iade, hesap transferi; düzenleme, silme ve geri alma; açıklama, kişi/mağaza, etiket, kategori bölme; tarih, hesap, kategori, tür ve tutar filtreleri, arama, sıralama ve sayfalama.
- **Hesaplar:** Nakit, banka, kredi kartı; başlangıç bakiyesi, para birimi, kart limiti, hesap kesim ve son ödeme günü; arşivleme, kart borcu ödemesi, kategori/alt kategori yönetimi ve manuel döviz kurları.
- **Bütçeler:** Toplam ve kategori limitleri; %80 ve %100 kullanım durumları, kullanılmayan limitin sonraki aya devri; birikim hedefleri, para ayırma/geri alma ve hedef arşivi.
- **Ödemeler:** Düzenli gider, gelir ve transfer; günlük/haftalık/aylık/yıllık/tek seferlik planlar, 2–120 aylık taksit, duraklatma, tarihi atlama ve ödendi/alındı kaydı; uygulama açıkken vade gününde Windows bildirimi.
- **Raporlar:** 12 aylık gelir-gider grafiği, önceki ay karşılaştırması, kategori dökümü, en büyük harcamalar, tasarruf oranı, değişiklik geçmişi ve aylık PDF.
- **Veri:** PNG/JPEG/PDF fişleri, önizlemeli CSV aktarımı, tekrar kontrolü, CSV dışa aktarımı ve fişleri içeren ayrı bütçe yedeği. Nero genel yedeği de bütçeyi içerir.

Hesaplamalar tam sayı kuruşla yapılır. Transfer, başlangıç bakiyesi ve birikime ayırma gelir/gider değildir. Döviz raporları işlemde kaydedilen kuru korur. Kart taksitinde alışveriş tam tutarla bir kez gider olur; taksit ödemeleri transferdir.

Kaynak paketinde kurulum ve kullanım için `docs/BUTCE-REHBERI.md`, uygulama kapsamı için `docs/BUTCE-TAKIP.md` bulunur.
