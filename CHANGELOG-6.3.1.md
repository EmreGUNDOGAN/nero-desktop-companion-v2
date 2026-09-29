# Nero 6.3.1 — Kıyafetler Nero’nun Üzerinde

## Masaüstü Nero

- Kıyafet sistemi yeniden düzeltildi. 88 kıyafetin her biri, daha önce hazırlanan ve Nero’nun gerçekten giydiği tam karakter çizimine geri döndürüldü.
- Giysiyi ayrı bir PNG olarak gövdenin üzerine bırakma yaklaşımı kaldırıldı. Ceket, hoodie, kazak, gömlek, şapka, pijama ve özel gün tasarımlarının kendi silueti, kolu, yakası, eli ve kenar çizgisi korunur.
- Masaüstünde kıyafet açıldığında çizimin içindeki sabit yüz çalışma anında yalnızca görünür yeşil baş bölgesinin içinden temizlenir. Şapka, kapüşon, yaka ve kıyafet kenarları bu işlemden etkilenmez.
- Temizlenen yüzün üstüne Nero’nun gerçek göz, pupil, göz kapağı, kaş ve ağız katmanları çizilir. Göz kırpma, konuşma, bakış ve mevcut mimikler kıyafetliyken çalışmaya devam eder.
- Şapkalı ve başlığı yüzü aşağı taşıyan kıyafetlerde göz konumu çizimin içinden otomatik bulunur; canlı yüz katmanları buna göre hizalanır.
- Ayarlar > Kıyafet Dolabı kartları doğrudan gerçek tam karakter kıyafet çizimini gösterir. Kullanıcı ne seçiyorsa Nero da aynı tasarımı giyer.
- Gece yapılan manuel kıyafet seçimi o gece hemen uygulanır; sonraki gece otomatik pijama döngüsü yeniden devreye girer.
- Sürüm `6.3.1`, `appId` `com.stenwick.nero` olarak korunur.

## Kontrol

- 72 seçilebilir kıyafet, 8 gece görünümü ve 8 özel görünüm olmak üzere 88 adet 220×260 PNG doğrulanır.
- JavaScript sözdizimi, testler, diyalog doğrulaması, Electron smoke testi ve Windows kurulum derlemesi GitHub Actions üzerinde çalıştırılır.
