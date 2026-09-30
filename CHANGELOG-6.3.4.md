# Nero 6.3.4 — Çiftlik Uyarıları, Köylü Mektupları ve Denge

## Öne çıkanlar

- 6.3.x ile gelen manuel **Kıyafet Dolabı** ve ilgili wardrobe denemeleri kaldırıldı. Nero'nun 6.2.0'daki otomatik pijama, parti ve kış kıyafetleri korunuyor.
- Köydeki 50 isimli karakterin her biri için 100 kişisel metin hazırlandı: toplam **5.000 köylü mektubu**.
- Aynı gönderen, gönderdiği mektuptan sonraki 10 mektupta yeniden seçilemez; aynı karakterin son 30 metni de tekrar edemez. Geçmiş save içinde korunur.
- Hediye içeren mektuplarda dağılım **%66 jeton / %33 balmumu / %1 tohum** olarak dengelendi.
- Oyun simülasyonu durduğunda rakip çiftliklerin gelişimi de durur; pause süresi için sonradan rakip catch-up yapılmaz.
- Sol alta koşullu **ünlem uyarı merkezi** eklendi: hasta kovan, solmuş tarh ve dolu depoyu listeler; uyarıdan doğrudan hedefe gidilir.
- “Hasat Et” yeşil rozeti artık kovan kendi kapasitesinin en az **%10'una** ulaştığında görünür ve birkaç piksel sağa alındı.
- Rehbere Mevsim Turnuvası'nın Bal Kalitesi, Arıcılık, Üretim ve Köy İtibarı puanlarının gerçek hesapları eklendi.
- Sürüm Yenilikleri ekranında **Önceki Sürüm** navigasyonu ve mevcutsa görüntülenen sürümün GitHub Releases / CHANGELOG bağlantısı eklendi.

## Teknik

- Release bağlantıları yalnız izin verilen GitHub Releases adreslerini harici tarayıcıda açar.
- Uyarı durumu save'e eski veri olarak yazılmaz; mevcut çiftlik state'inden canlı hesaplanır.
- 50×100 mektup verisi paketlenmiş gzip JSON parçaları olarak yüklenir ve sabit içerik kimlikleri seçim geçmişinde kullanılır.
