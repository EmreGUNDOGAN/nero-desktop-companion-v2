# Nero oyun düğmesi — kaynak hazırlığı

10 Ekim 2026. Kullanıcı, oyun tamamlandığında arıcılık gibi ayrı bir pencerede açılmasını ve üst çubukta arıcılık ikonunun soluna SpongeBob düğmesi eklenmesini istedi.

## Hazır

- Güncel Nero kaynakları: nero-tum-gelistirmeler/project. Arıcılık geliştirme kaynağı da aynı çalışma koduyla güncellendi.
- Pencere kontrollerindeki aynı flex satırına restaurant-launch düğmesi eklendi. Bikini Bottom temasında arıcılık ile aynı cqw ölçüsü; var olan sağdaki beş kontrolün hizası korunur.
- SpongeBob PNG’si yerel paket varlığıdır; uygulamanın açılışında internet bağlantısı gerekmez. Kaynak ve CC BY 3.0 kredisi ilgili assets klasörlerinde kayıtlı.
- Preload izin listesine restaurant:open eklendi. İlk tıklama ayrı oyun penceresi açar; sonraki tıklamalar aynı pencereyi öne getirir.
- Güncel 107 oyun kaynak dosyası iki kaynak ağacına eşlendi.
- Kaynak kontrolü: gerçek yerel HTTP sunucusu, IPC izinleri, tek pencere davranışı ve paket varlık erişimi geçti. Bu kontrol kullanıcı verisine ve kurulu uygulamaya dokunmaz.

## Kaynak teslimi

Kullanıcı kaynak teslimini istedi; güncel kaynaklar ZIP paketine hazırlanmıştır. Kurulu Nero sürümü bu kaynaklardan yeniden derlenerek güncellenebilir. Son paket üzerinde düğmenin yerleşimi, arıcılıkla birlikte kullanım ve kayıt devamlılığı görsel olarak kontrol edilecek. Şimdilik kurulu exe değiştirilmedi, installer/release üretilmedi ve paketleme aşamasına geçilmedi.

İkon kaynağı: https://commons.wikimedia.org/wiki/File:SpongeBob_SquarePants_character.png
