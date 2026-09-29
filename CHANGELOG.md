# Nero'da neler değişti?

Her sürümde eklenenler, değişenler ve düzeltilenler burada. En yeni sürüm en üstte.

# Nero 6.3.2 — Kanonik Nero Kıyafet Sistemi

## Masaüstü Nero

- Kıyafetlerin oturma sistemi tekrar düzenlendi. Kaynak kıyafet çizimleri korunuyor ancak artık çizimlerdeki farklı/şişkin karakter gövdesi doğrudan kullanılmıyor.
- Her PNG çalışma anında Nero’nun gerçek `body.svg` siluetine yeniden kuruluyor: uzun oval gövde, küçük yan eller, ayrı oval ayaklar ve Nero’nun kendi gövde oranları korunuyor.
- Kaynak çizimdeki sabit kafa, gözler, kaşlar, ağız, eller ve ayaklar ayrıştırılıyor. Kıyafetin kumaşı, yaka/kapüşon/ceket formu ve şapka gibi aksesuarları korunarak kanonik Nero gövdesine oturtuluyor.
- Omuz ve yaka bölgesi özel bir geçiş deformasyonuyla yeniden şekillendiriliyor; kıyafet gövdenin üstüne bırakılmış bir PNG gibi değil, Nero için çizilmiş gibi oturuyor.
- Kıyafetli Nero’da canlı göz takibi, göz kırpma, kaşlar, konuşma ağızları ve ifadeler kanonik koordinatlarda çalışmaya devam ediyor.
- Kıyafet Dolabı önizlemeleri de masaüstündeki aynı kanonik dönüştürme motorunu kullanıyor; kartta görülen tasarım ile Nero’nun giydiği tasarım aynı.
- 88 mevcut kıyafet kaynağı korunuyor; ayrı ayrı yeniden export edilmiş ikinci bir karakter seti gerekmiyor.
- Gece manuel seçim düzeltmesi ve özel gün kıyafet kilidi korunuyor.

## Kontrol

- Sürüm `6.3.2`, `appId` `com.stenwick.nero`.
- Ortak kıyafet dönüştürücü hem karakter penceresi hem Kıyafet Dolabı tarafından kullanılır.
- Kaynakta 88 adet 220×260 kıyafet PNG’si doğrulanır; JavaScript sözdizimi, testler, diyalog kontrolü, Electron smoke testi ve Windows paketlemesi GitHub Actions üzerinde çalıştırılır.
