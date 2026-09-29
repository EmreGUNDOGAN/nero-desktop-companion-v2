// Paketlenmiş sürüm notları: eski sürümleri atlayan oyuncular için kronolojik arşiv.
// Özetler ilgili CHANGELOG dosyalarından hazırlanmıştır.
export const RELEASE_NOTES = [
  { version: '5.1.0', title: 'Çiftliğe yeni alışkanlıklar', items: [
    { icon: '📋', title: 'Günlük görevler ve Bal Defteri', text: 'Her gün üç görev, bal türlerinin kayıtları ve çiftlik isimleri.' },
    { icon: '📊', title: 'İstatistikler ve fotoğraf', text: 'Üretim ve kazanç grafikleri, gece görünümü ve fotoğraf modu.' }] },
  { version: '5.2.0', title: 'Köy büyüyor', items: [
    { icon: '🏡', title: 'Yerleşimciler', text: 'Teslim edilen bal arttıkça köy büyür; köylüler ve dükkânlar adayı çevreler.' },
    { icon: '🍯', title: 'Sevilen ballar', text: 'Köylülerin sevdiği ballar siparişlerini ve kazancı etkiler.' }] },
  { version: '5.3.0', title: 'Çiftlikten haberler', items: [
    { icon: '🔔', title: 'Bildirimler', text: 'Son bildirimler sol alttaki zilde saklanır.' },
    { icon: '🌼', title: 'Çiçekler ve denge', text: 'Solmuş çiçekleri canlandırma ve satın alma fiyatlarında düzenleme.' }] },
  { version: '5.4.0', title: 'Seyyah ve köylüler', items: [
    { icon: '🛒', title: 'Seyyah Yakup', text: 'Köye belirli aralıklarla uğrar; ürünler ve özel bal alımı sunar.' },
    { icon: '✉️', title: 'Köylü hikâyeleri', text: 'İlişkiler ilerledikçe köylülerin hikâyeleri açılır.' }] },
  { version: '5.4.1', title: 'Çiftlik yönetimi', items: [
    { icon: '⚙️', title: 'Oyun içi ayarlar', text: 'Grafik, ses, gece modu ve kayıt seçenekleri oyun içine taşındı.' },
    { icon: '🐝', title: 'Kovanlar özeti', text: 'Kovanlar arasında gezinme ve toplu şurup işlemleri eklendi.' }] },
  { version: '5.4.2', title: 'Büyüyen çiftlik', items: [
    { icon: '✨', title: 'Etkilerim', text: 'Odak, köy, hikâye ve Seyyah Yakup bonusları Bal Defteri’nde bir araya geldi.' },
    { icon: '🍯', title: 'Depo ve denge', text: 'Depo 10.000 kg’a kadar büyür; sipariş sıklığı, hastalık ve arı ekonomisi dengelenir.' }] },
  { version: '5.5.0', title: 'Arıcılık dünyası genişliyor', items: [
    { icon: '🐝', title: 'Yeni Nero diyalogları', text: 'Çiftlik olaylarına ve köylere özel yeni tepkiler.' },
    { icon: '📋', title: 'Yeni görevler ve Yakup ürünleri', text: 'Görev türleri ve gezgin satıcının ürün havuzu genişledi.' }] },
  { version: '5.5.1', title: 'Çiftliğin sesleri', items: [
    { icon: '🔊', title: 'Gerçek ses efektleri', text: 'Hasat, jeton ve yerleştirme gibi işlemlerde yeni sesler.' },
    { icon: '🌧️', title: 'Ortam sesleri', text: 'Kuş, arı, yağmur ve rüzgâr sesleri oyunun koşullarına göre çalınır.' }] },
  { version: '5.5.2', title: 'Kovan ve erzak dengesi', items: [
    { icon: '🌾', title: 'Erzak göstergesi', text: 'Kovanlarda kalan erzak günleri ve kış tüketimi görünür.' },
    { icon: '🐝', title: 'Çiftlik düzenlemeleri', text: 'Arı bakımı ve kovan işlerinde yaşam kalitesi iyileştirmeleri.' }] },
  { version: '5.5.3', title: 'Tohum envanteri', items: [
    { icon: '🌼', title: 'Tohumları sakla', text: 'Satın alınan tohumlar önce envantere eklenir.' },
    { icon: '📋', title: 'Sürüm yenilikleri', text: 'Yeni sürüm bilgileri oyunda ve rehberde görülebilir.' }] },
  { version: '5.5.4', title: 'Adaya dön', items: [
    { icon: '⌖', title: 'Düğme sol altta', text: 'Adaya dön düğmesi büyütülerek sol alta taşındı; R kısayolu çalışır.' }] },
  { version: '5.6.0', title: 'Çiftlik yeni bir yüz kazandı', items: [
    { icon: '🍯', title: 'Yeni arayüz', text: 'Tek parça alt menü, yenilenen üst çubuk ve çizilmiş simgeler.' },
    { icon: '🐝', title: 'Kovanlar ve istatistikler', text: 'Doluluk halkaları, kovan işlemleri, günlük karşılaştırmalar ve satış dökümü.' },
    { icon: '🏆', title: 'Liderlik', text: 'Rakipler artık üretir, satış yapar ve yatırım kararları verir; değişimlerinin nedenleri görünür.' }] },
  { version: '6.0.0', title: 'Yaşayan köy ve mevsim turnuvaları', items: [
    { icon: '🏘️', title: 'Köy canlanıyor', text: 'Köylüler gündüz dolaşır, teslimat sonrası seni ziyaret eder; Nero da adada yürür ve geceleri uyur.' },
    { icon: '🏆', title: 'Dört mevsim turnuvası', text: 'Kategori puanları, kupalar, 750/500/250 jeton ödülleri ve şampiyona sonraki yıl aynı mevsim +%20 üretim.' },
    { icon: '🌿', title: 'Çiçekler ve kovanlar', text: 'Yedi çiçeğin bonusları dengelendi, Ihlamur yerine Kış Fundası geldi; yeni kovan fiyatları kademelendi.' },
    { icon: '🔔', title: 'Yeni kolaylıklar', text: 'Bildirim sekmeleri, 10 saniyelik geri alma, sipariş süre tahmini, hasat rozeti ve gece yıldızları.' }] },
  { version: '6.1.0', title: 'Büyüyen ada ve festival alanı', items: [
    { icon: '🌿', title: 'Üç yeni tarh halkası', text: 'Ada genişledi, köy evleri dışa taşındı; boş karelerde seyrek doğal süsler var.' },
    { icon: '🎉', title: 'Festival meydanı', text: 'Mevsime göre süslenen alana festival sırasında köylüler ziyarete gelir.' },
    { icon: '🐝', title: 'Sipariş ve denge', text: 'Siparişler ekili çiçeklere göre gelir, rakip gelişimi ve balmumu kazancı yeniden dengelendi.' }] },
  { version: '6.2.0', title: 'Köy ve çiftlik yeni bir yüz kazandı', items: [
    { icon: '🏡', title: '78 özgün köy yapısı', text: 'Köylülerin evleri, dükkânları ve binaları yenilendi; yakından bakınca adları görünür.' },
    { icon: '🧑‍🌾', title: 'Yeni arıcı', text: 'Yürüyüş ve hasatta eklemli hareketler, körük dumanı ve kovan aletleri.' },
    { icon: '🐝', title: 'Canlanan ada', text: 'Büyüyen çiftlik evi; ırka ve seviyeye göre kovanlar; yeni arılar, tarhlar, göller ve satıcı arabası.' }] },
  { version: '6.3.0', title: 'Nero giyiniyor, ada mevsimi yaşıyor', items: [
    { icon: '🌸', title: 'Dört mevsim', text: 'Köy çatıları, ağaçlar ve ada mevsime göre giyinir. Görünümü oyun ayarlarından açıp kapatabilirsin.' },
    { icon: '🏠', title: 'Depo ve köy', text: 'Evin yakınında gelişen depo ve her 150 kg sipariş teslimatında gelen yeni bir köy evi.' },
    { icon: '🍯', title: 'Hasat ve kamera', text: 'Arıcının bal kavanozu, hasat parıltısı ve Q/E ile döndürülebilen ada.' }] },
  { version: '6.3.1', title: 'Kıyafetler gerçekten Nero’nun üzerinde', items: [
    { icon: '👕', title: 'Tam tasarım geri geldi', text: '88 kıyafet, hazırlanan tam karakter çizimleriyle gösterilir; ayrı bir giysiyi Nero’nun üstüne yapıştırma yöntemi kullanılmaz.' },
    { icon: '✨', title: 'Mimikler yine canlı', text: 'Çizimdeki sabit yüz çalışma anında temizlenir; Nero’nun göz kırpma, konuşma, bakış, kaş ve ağız animasyonları kıyafetin içinde çalışır.' }] }
];
