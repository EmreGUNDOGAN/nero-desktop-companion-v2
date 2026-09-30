# Nero 6.3.4 Plan — Part 01

Bu dosya 6.3.4 için kilitlenen ilk 3 maddeyi içerir. Bu aşamada yalnızca plan kilitlenmiştir; uygulama koduna henüz başlanmayacaktır.

## 1. Kıyafet Dolabı kaldırılacak

- Ayarlar menüsündeki **Kıyafet Dolabı** sekmesi tamamen kaldırılacak.
- Kıyafet kartları, kategori sekmeleri, seçim/önizleme alanları ve manuel kıyafet seçme işlevi kaldırılacak.
- Ayarlar içindeki diğer bölümlerin davranışı ve tasarımı değiştirilmeyecek.

## 2. Sonradan eklenen wardrobe sistemi temizlenecek

- `wardrobe.js` ve 6.3.x sürecinde eklenen manuel dolap mantığı kaldırılacak.
- `wardrobeOutfit`, `wardrobeSelectedNight`, `sleepOutfit` ve bunlara bağlı sonradan eklenen ayar/persistence akışları temizlenecek.
- 6.3.1–6.3.3 dönemindeki full-character, reshape, canonical wardrobe ve wardrobe-v2 denemeleri kaldırılacak.
- Buna karşılık **6.2.0’dan önce zaten var olan otomatik pijama / parti / kış görünümü davranışı korunacak**.

## 3. Kıyafet asset ve tema kalıntıları temizlenecek

- 6.3.x döneminde eklenen toplu `outfit-*` kıyafet assetleri ve yeni wardrobe klasörleri kaldırılacak.
- `body-dressed`, `hands-dressed`, wardrobe-v2 ve benzeri sonradan eklenen yardımcı kıyafet assetleri kaldırılacak.
- `theme.json` dosyalarındaki sonradan eklenmiş kıyafet bağlantıları temizlenecek.
- Yalnızca eski otomatik pijama / parti / kış davranışının gerçekten ihtiyaç duyduğu orijinal dosyalar korunacak.

## Kilit Durumu

- Madde 1: KİLİTLİ
- Madde 2: KİLİTLİ
- Madde 3: KİLİTLİ
