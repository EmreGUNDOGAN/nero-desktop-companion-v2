# Nero Tema Rehberi

Bu rehber, Nero'ya yeni bir karakter görünümü (tema) eklemek için gereken her şeyi anlatır. Kodda hiçbir değişiklik yapmadan tema eklenebilir: bir klasör, bir `theme.json` ve görseller yeterli.

## Tema nereye konur?

Kullanıcı temaları şu klasöre konur:

```
%APPDATA%\Nero\themes\
```

Uygulamada **Ayarlar > Tema klasörünü aç** düğmesi bu klasörü doğrudan açar. Her tema kendi alt klasöründe durur:

```
%APPDATA%\Nero\themes\
  benim-temam\
    theme.json
    dialogue.json        (isteğe bağlı)
    assets\
      body.png
      eyes.png
      pupils.png
      ...
```

Klasörü koyduktan sonra **Ayarlar > Temaları yenile**, ardından listeden temayı seç. Temada eksik dosya ya da hata varsa Ayarlar ekranında kırmızı bir kutuda listelenir.

Uygulamayla birlikte dağıtılacak temalar ise projedeki `themes\` klasörüne konur ve kurulum dosyasına otomatik girer.

## Görselleri hazırlarken

En kolay yol şudur: **bütün parçaları aynı boyutta, şeffaf PNG tuvallerde, karakterdeki yerinde durur şekilde** dışa aktarmak. Örneğin tuval 440x520 ise gövde, gözler, kaşlar, ağızlar ve efektlerin hepsi 440x520 PNG olur; her parça tuvalin içinde olması gereken yerde durur, geri kalanı şeffaftır. Bu şekilde hazırlanan parçalar üst üste konunca kendiliğinden hizalanır ve `theme.json`'da koordinat yazmaya gerek kalmaz.

Parçalar küçük kırpılmışsa bu da olur; o zaman her parçanın tuvaldeki konumu `x`, `y`, `width`, `height` ile yazılır (aşağıda örnek var).

Önemli ayrımlar:

- **Göz bebekleri ayrı bir görsel olmalı.** Nero fareyi göz bebeklerini kaydırarak takip eder. İki göz bebeği tek bir PNG'de olabilir; ikisi birlikte kayar.
- **Gözün beyazı ayrı olmalı** ki göz bebekleri üstünde kayabilsin.
- **Göz kapakları** gözün üstüne binen parçalardır. Kırpma için en az bir "kapalı" göz kapağı gerekir. Yarı kapalı, ağır göz kapağı gibi varyantlar huysuz ifadeler için çok işe yarar.

## Katman sırası

Alttan üste doğru çizim sırası sabittir:

1. `body` – gövde (poz varyantları olabilir: ayakta, oturan, uyuyan...)
1. `outfit` – kıyafet. Şimdilik tek varyant var: `pajama`. Akşam 9'dan sabah 6'ya kadar otomatik giyilir (pijama ve gece külahı). İsteğe bağlı; yoksa Nero gece de aynı kalır.
2. `eyes` – gözlerin beyazı
3. `pupils` – göz bebekleri (fareyi takip eder)
4. `lids` – göz kapakları (ifadeye göre ve kırparken)
5. `brows` – kaşlar
6. `mouth` – ağız
7. `front` – gövdenin önüne gelen parçalar (ör. elde tutulan bir kupa, kol). İsteğe bağlı.
8. `effects` – ter damlası, zzz, kalp gibi efektler

## theme.json alanları

```json
{
  "id": "benim-temam",
  "name": "Benim Temam",
  "author": "Stenwick",
  "formatVersion": 1,

  "canvas": { "width": 440, "height": 520 },
  "defaultScale": 0.5,

  "bubbleAnchor": { "x": 220, "y": 30 },

  "eyeTracking": {
    "center": { "x": 220, "y": 210 },
    "range": { "x": 12, "y": 9 }
  },

  "layers": {
    "body":   { "default": "assets/body.png", "sitting": "assets/body-sitting.png" },
    "eyes":   { "default": "assets/eyes.png" },
    "pupils": { "default": "assets/pupils.png" },
    "lids":   { "heavy": "assets/lids-heavy.png", "half": "assets/lids-half.png", "closed": "assets/lids-closed.png" },
    "brows":  { "normal": "assets/brows-normal.png", "angry": "assets/brows-angry.png" },
    "mouth":  { "neutral": "assets/mouth-neutral.png", "talk1": "assets/mouth-talk1.png", "talk2": "assets/mouth-talk2.png" },
    "front":  { "mug": { "src": "assets/mug.png", "x": 250, "y": 300, "width": 90, "height": 80 } },
    "effects":{ "zzz": "assets/fx-zzz.png", "sweat": "assets/fx-sweat.png" }
  },

  "blink": { "lid": "closed" },
  "talkMouths": ["talk1", "talk2"],

  "expressions": {
    "normal": { "lids": "heavy", "brows": "normal", "mouth": "neutral" },
    "asleep": { "lids": "closed", "brows": "normal", "mouth": "neutral", "body": "sitting" }
  },

  "ui": {
    "paper": "#E7ECE4",
    "surface": "#F5F7F2",
    "ink": "#1F2B33",
    "muted": "#5D6B70",
    "accent": "#C08A22",
    "accentInk": "#1F2B33",
    "secondary": "#3F7F7A",
    "danger": "#B5543C",
    "line": "#C9D2C8",
    "bubbleBg": "#FFFDF6",
    "bubbleInk": "#1F2B33",
    "bubbleLine": "#1F2B33"
  }
}
```

### Alanların anlamı

| Alan | Ne işe yarar |
|---|---|
| `id` | Temanın kimliği. Küçük harf, rakam ve tire kullan. Yazılmazsa klasör adı kullanılır. |
| `name` | Ayarlar'daki listede görünen ad. |
| `canvas` | Görsellerin çizildiği tuvalin piksel boyutu. |
| `defaultScale` | Tema seçilince karakterin ekrandaki boyutu. Yüksek çözünürlüklü görsellerde 0.5 gibi bir değer kullan ki masaüstünde minik dursun. Kullanıcı Ayarlar'dan değiştirebilir. |
| `bubbleAnchor` | Konuşma balonunun kuyruğunun işaret ettiği nokta (tuval koordinatı). Genellikle kafanın tepesi. |
| `eyeTracking.center` | İki gözün ortası (tuval koordinatı). Göz bebekleri fareye bu noktaya göre bakar. |
| `eyeTracking.range` | Göz bebeklerinin en fazla kaç piksel kayabileceği (tuval pikseli). Göz bebeği gözün dışına taşıyorsa küçült. |
| `layers` | Her katmanın varyantları. Değer ya dosya yolu (`"assets/x.png"`) ya da konumlu nesne (`{ "src", "x", "y", "width", "height" }`). |
| `blink.lid` | Göz kırparken gösterilecek göz kapağı varyantı. |
| `talkMouths` | Konuşurken sırayla değişen ağız varyantları. |
| `expressions` | İfadeler: her ifade hangi katmanda hangi varyantın görüneceğini söyler. |
| `ui` | Panelin ve konuşma balonunun renkleri. `ui.skin` panelin kılığını seçer: `cozy` (varsayılan), `latte` (Tarçınlı Latte) ya da `pazartesi` (Pazartesi Sendromu). `ui.noteColors` notların renk listesidir. |

### İfadeler

Bir ifade şu anahtarları içerebilir: `body`, `eyes`, `pupils`, `lids`, `brows`, `mouth`, `front`, `effect`.

- Yazılmayan katman için varsayılan kullanılır (`default`, `normal` ya da `neutral` adlı varyant, yoksa ilk varyant).
- `"lids": null` göz kapağını gizler (gözler açık).
- `"front": null` ön parçayı o ifadede gizler.
- `"effect": "zzz"` o ifade sürdükçe bir efekt gösterir.

Nero'nun davranış sistemi şu ifade adlarını kullanır. Hepsini tanımlaman önerilir; tanımlanmayan ifade yerine `normal` kullanılır:

| İfade | Ne zaman |
|---|---|
| `normal` | Varsayılan hali (biraz huysuz, umursamaz) |
| `content` | Keyfi yerindeyken, konuşmadığı anlarda |
| `happy` | Zamanlayıcı bitince, bütün işler bitince |
| `smile` | Memnun ama belli etmek istemiyor |
| `curious` | Merak, üstüne fare gelince arada bir |
| `surprised` | Şaşırma, sürüklenmeye başlarken |
| `sad` | Uzun süre ilgilenilmeyince (5 saat+) |
| `sulky` | Küsmüş (yaklaşık 3 saat 45 dk+), laf sokarken |
| `angry` | Art arda dürtülünce |
| `bored` | Sıkılmış (3 saat+) |
| `sleepy` | Gece saatlerinde, uykulu |
| `asleep` | Sen bilgisayardan uzaktayken uyurken |

### Efekt adları

Replikler şu efekt adlarını kullanır: `blush`, `sweat`, `angry`, `zzz`, `shock`, `heart`. Temada olmayan efekt sessizce atlanır. `asleep` halinde, ifadede başka efekt yoksa `zzz` otomatik gösterilir.

Efektlerin küçük animasyonları hazırdır (zzz süzülür, ter damlası akar, kalp yüzer, öfke işareti atar). Efekt görseli karakterin neresinde duracaksa tuvalde orada olmalı.

## Kişiye özel replikler (dialogue.json)

Tema klasörüne bir `dialogue.json` konursa, içindeki kategoriler varsayılan repliklerin yerine geçer. Yazılmayan kategoriler varsayılan kalır. Biçim:

```json
{
  "click": [
    "Ne var?",
    { "t": "Beni mi çağırdın?", "e": "curious" },
    { "t": "Dürtme!", "e": "angry", "fx": "angry" }
  ]
}
```

`t` metin, `e` ifade, `fx` efekttir. Metinlerde şu yer tutucular kullanılabilir: `{label}`, `{minutes}`, `{hours}`, `{days}`. Kategori listesinin tamamı uygulama kaynaklarındaki `src/data/dialogue.tr.json` dosyasındadır.

## Ayar yaparken ipuçları

- Göz bebekleri doğru yere bakmıyorsa önce `eyeTracking.center` değerini gözlerin tam ortasına göre düzelt, sonra `range` ile kayma miktarını ayarla.
- Balon kafanın üstüne değil de yanına çıkıyorsa `bubbleAnchor` değerini değiştir.
- Karakter masaüstünde çok büyükse `defaultScale` değerini düşür.
- Karakterin şeffaf kısımlarına tıklayınca alttaki pencereye tıklanır; bu yüzden görsellerin arka planı gerçekten şeffaf olmalı (beyaz ya da damalı arka plan değil).
- Her değişiklikten sonra **Ayarlar > Temaları yenile** yeterli, uygulamayı kapatıp açmaya gerek yok.
