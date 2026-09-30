# Nero 6.3.4 Plan — Part 02

Bu dosya 6.3.4 için kilitlenen 4–6. maddeleri içerir. Bu aşamada yalnızca plan kilitlenmiştir; uygulama koduna henüz başlanmayacaktır.

## 4. Mektuplardaki hediye tohum oranı düşürülecek

- Yalnızca **hediye içeren mektuplar** dikkate alındığında tohum hediyesi oranı **%1** olacak.
- Hediye içeren mektuplardaki kalan **%99** olasılık mevcut jeton ve balmumu hediyeleri arasında yaklaşık 2:1 oranında dağıtılacak.
- Böylece dağılım:
  - %66 jeton
  - %33 balmumu
  - %1 tohum
- Tohum çıktığında mevcut Papatya / Ayçiçeği / Kekik havuzu korunacak.

## 5. Hasat Et uyarısı %10 doluluk eşiğinde görünecek

- Alt menüdeki **Hasat Et** düğmesinin yeşil rozeti artık `0.05 kg` gibi sabit düşük bir eşikle görünmeyecek.
- Bir kovanın kendi bal deposu **kapasitesinin en az %10’una** ulaştığında o kovan "hasada hazır" sayılacak.
- Teknik eşik: `h.total / h.capKg >= 0.10`.
- Rozette görünen sayı, bu %10 eşiğini geçen ve sıraya alınmamış hazır kovan sayısı olmaya devam edecek.
- Eşiği geçen kovan yoksa rozet gizlenecek.

## 6. Yeşil Hasat Et rozeti sağa alınacak

- Hasat Et düğmesindeki yeşil sayı rozeti mevcut konumunda kenara fazla yaklaştığı için rakamın tamamı görünmüyor.
- Rozet birkaç piksel **sağa doğru** yeniden konumlandırılacak; sayı kesilmeden tamamen görünecek.
- Rozetin boyutu, rengi ve mevcut yeşil başarı stili korunacak.
- Siparişler veya diğer kırmızı bildirim rozetlerinin konumu değiştirilmeden yalnızca `#harvest-all .badge-n` hizası düzeltilecek.

## Kilit Durumu

- Madde 4: KİLİTLİ
- Madde 5: KİLİTLİ
- Madde 6: KİLİTLİ
