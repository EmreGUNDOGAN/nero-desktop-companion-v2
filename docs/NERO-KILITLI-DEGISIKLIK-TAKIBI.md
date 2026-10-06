# Nero — Kilitli Değişiklik Takibi

Karar tarihi: 6 Ekim 2026
Temel sürüm: 6.8.1 (`Nero-6.8.1-final-bundle (1).zip` içindeki kaynak kod).
Durum: Nero 6.9.0 kodlaması ve yerel kontroller tamamlandı. Windows paketi GitHub Actions ile hazırlanacak.

## 1. Sıralamada bal şurubu

- [x] Bal şurubu satın almak oyuncuya sıralama puanı kazandırmayacak.
- [x] Aynı kural AI rakipler için de geçerli olacak.
- [x] Oyuncu ve AI için bu davranış doğrulanacak.

## 2. Üretilen ürünler ve siparişleri

- [x] Pazarda üretilen ürünler için ayrı sekme olacak.
- [x] Üretilen ürünlerin ayrı sipariş sayfası olacak.
- [x] Aynı anda en fazla 10 ürün siparişi bulunacak.
- [x] Her 5 gerçek dakikada bir yeni ürün siparişi gelecek; süre oyun hızından bağımsız olacak.
- [x] Bal siparişleri mevcut düzeninde kalacak.
- [x] Sipariş sınırı, geliş aralığı ve iki sipariş grubunun ayrılığı doğrulanacak.

## 3. Görevleri sürükleyerek sıralama

- [x] Nero panelindeki İşler/görev listesinde göreve basılı tutup yukarı veya aşağı sürükleyerek sırası değiştirilebilecek.
- [x] Yeni sıra kaydedilecek ve uygulama yeniden açıldığında korunacak.
- [x] Sürükleme ve sıralamanın kalıcılığı doğrulanacak.

## 4. Alt görevler

- [x] Ana görevin yanındaki + düğmesiyle o görevin altında alt görev eklenebilecek.
- [x] Alt görevler ana görevin içinde, altında gösterilecek.
- [x] Her alt görev ayrı tamamlanabilecek.
- [x] En az bir alt görevi bulunan ana görev, tüm alt görevleri tamamlandığında otomatik tamamlanacak.
- [x] Tamamlanmış alt görevlerden biri yeniden açılırsa ana görev de yeniden açık olacak.
- [x] Alt görevler ve tamamlanma durumları kaydedilecek.
- [x] Otomatik tamamlanma, yeniden açılma ve kalıcılık doğrulanacak.

## Çalışma ve teslim kuralları

- Yalnızca yukarıdaki kararlaştırılmış kapsam uygulanacak; ek özellik veya kural kullanıcı kararı olmadan eklenmeyecek.
- Mevcut kullanıcı kayıtları korunacak.
- Kod değişikliklerinden sonra ilgili testler ve gerekli kontroller çalıştırılacak.
- Oyun kuralı değişikliklerinde oyuncu rehberi ve oyun içi rehber güncellenecek.
- Her eklemenin ilgili GitHub Actions çalıştırma bağlantısı kullanıcıya verilecek.
- Tek kalan aşama Actions derlemesiyse tamamlanması beklenmeyecek; gerçek durumuna uygun şekilde “Actions şu an hazırlanıyor” denilerek bağlantı paylaşılacak.
- Kullanıcıya yapılan açıklamalar kısa ve net olacak.

## Takip kaydı

| Aşama | Durum | GitHub Actions |
| --- | --- | --- |
| Kapsamın kilitlenmesi | Tamamlandı | Henüz yok |
| Bal şurubu sıralama düzeltmesi | Tamamlandı | 6.9.0 Actions |
| Ürün pazarı ve ayrı siparişler | Tamamlandı | 6.9.0 Actions |
| Görev sıralama | Tamamlandı | 6.9.0 Actions |
| Alt görevler | Tamamlandı | 6.9.0 Actions |
| Testler ve rehber güncellemeleri | Tamamlandı | 6.9.0 Actions |

Not: Görev alanını gösteren görsel önceki mesajda açılamadı. Ekran yerleşimi uygulanırken mevcut İşler paneli esas alınacak; yeni görsel paylaşılırsa ilgili alan doğrulanacak.

## 5. Odak bildirimi ve sesler — kilitli

- [x] Odak süresi normal bittiğinde sağ altta Nero'ya özel küçük bildirim kartı açılacak.
- [x] Onaylanan tasarım: sıcak krem zemin, yumuşak yeşil detaylar, hafif gölge; kapatma ve Tamam düğmeleri.
- [x] Yeniden çizilmiş karakter yerine uygulamanın gerçek Nero katmanları ve o anki kıyafeti kullanılacak.
- [x] Odak tamamlanınca `attic13-melody-ambient-handpan-lofi-loop-dmin-120bpm-227398.mp3` bir kez çalacak.
- [x] Durdur/vazgeç eyleminde `spongebob-fail.mp3` bir kez çalacak; duraklatma bu sesi tetiklemeyecek.
- [x] Normal Windows bildirim sesiyle çift ses oluşmayacak.
- [x] Mevcut ses kapatma tercihleri korunacak.

## 6. Radyo Akşamı — kilitli ilk sayfa denemesi

- [x] Tema adı: Radyo Akşamı.
- [x] Yalnız Bugün sayfasına özel tasarım ve bu sayfanın ortak üst başlığı/sekme çerçevesi hazırlanacak; diğer sayfaların özel tasarımı bu kapsamda değil.
- [x] Analog radyo frekans skalası, radyo tuşları, mekanik sayaç görünümü ve sıcak ceviz/krem/kehribar tonları kullanılacak.
- [x] Onaylanan görselin kompozisyonu esas alınacak; abartılı yapay dokular yerine sade CSS çizimleri ve net hatlar kullanılacak.
- [x] Mevcut işlevler korunacak; yeni veri veya gösterge uydurulmayacak.
- [x] 440 × 660 px varsayılan panelde ve mevcut yeniden boyutlandırma sınırlarında çalışacak; içerik gerektiğinde kaydırılacak.

## Uygulama onayı

6 Ekim 2026, 15:38: Kullanıcı tüm konuşulan değişikliklerin kodlanmasını onayladı.
GitHub'a gönderimden sonra kaynak bağlantısı ve ilgili Actions bağlantısı paylaşılacak.
Durum: Uygulama tamamlandı.


## 6.9.0 doğrulama ve teslim

- Kaynak tabanı: GitHub `feature/bee-v6.8.1`, `bca5e8b6d48eb70c492d03f6349a24ca787e64a2`; gönderilen ZIP ile oyun kodu eşleşti.
- 296 otomatik test geçti; diyalog ana dosyası ve 188 kıyafet katman paketi doğrulandı.
- Electron arayüz kontrolü: 440×660, 380×540 ve 700×860; uzun basma sıralaması, alt görev ekleme, gerçek kıyafetli bildirim doğrulandı.
- Kaynak: https://github.com/EmreGUNDOGAN/nero-desktop-companion-v2/tree/feature/nero-v6.9.0
- Actions: https://github.com/EmreGUNDOGAN/nero-desktop-companion-v2/actions/workflows/build-v6.9.0.yml
- Windows kurulum ve gerçek hoparlör sonucu henüz yerelde doğrulanmadı; paket Actions'ta hazırlanacak.
