# Nero'ya katkı

Katkıların küçük, odaklı ve kolay incelenebilir olması tercih edilir.

## Geliştirme

1. Depoyu fork et veya ayrı bir branch oluştur.
2. `npm install` ile bağımlılıkları kur.
3. `npm start` ile değişikliği yerel olarak doğrula.
4. Tek bir amaç taşıyan commit'ler kullan.
5. Pull request içinde değişikliğin nedenini ve nasıl test edildiğini açıkla.

## Kod yaklaşımı

- Mevcut modül sınırlarını koru.
- Renderer'a gereksiz Node.js yetkisi verme.
- Kullanıcı verilerinin geriye dönük uyumluluğunu gözet.
- Tema varlıklarını ve `theme.json` sözleşmesini bozma.
- Üretilen `dist/` ve `node_modules/` içeriklerini commit etme.

## Hata bildirimi

İşletim sistemi, Nero sürümü, yeniden üretme adımları, beklenen davranış ve gerçekleşen davranışı ekle. Log paylaşırken kişisel bilgileri temizle.
