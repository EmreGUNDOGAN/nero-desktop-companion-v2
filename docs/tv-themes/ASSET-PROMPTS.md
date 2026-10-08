# Production asset provenance

Built-in imagegen was used; no API/CLI fallback was used. Original approved page concepts are provided in `concepts`. Deterministic scene crops are recorded in `asset-extraction.json`; `scripts/extract-tv-assets.cjs` performs extraction. Transparent objects are in `clean-assets`; `scripts/install-tv-atlases.cjs` trims and installs them. Generated assets are bundled in the theme directories, not linked to a temporary external cache.

## Scranton home cleanup

Edit the existing approved four-character scene. Preserve characters, faces, positions, expressions, desks, objects and lighting. Remove only the overlaid Turkish greeting “İyi günler, Emre”, “Küçük bir iş. Sonra kahve.” and its backing; reconstruct the office wall/glass/blinds. Keep actual mug, company sign and reception labels. No new text or cropping. Result: `clean-assets/scranton-home.png`.

## Stars Hollow transparent atlas

One row of five separate realistic painterly objects on a transparent background: a cream Luke’s diner mug, navy library bookmark with book icon and tassel, embroidered dragonfly patch, a gazebo postcard, a vintage cassette. No titles, names, dates, UI menus or checkmarks; only real mug lettering is retained. Result: `clean-assets/stars-hollow-atlas.png`.

## Scranton transparent atlas

One row of five separate realistic painterly office objects on transparent alpha: a modest Dundie statuette with plain base, a navy-framed blank certificate with tiny company logo, a World's Best Boss mug, blue inbox tray with papers, a Dwight bobblehead with plain base. No baked achievement labels or dates. Result: `clean-assets/scranton-atlas.png`.

## Memory decorations

Two separate objects on transparent alpha: an ordinary glass jar of folded blank cream notes with brass lid, and a translucent gelatin cube containing a black stapler. No words or counts; live memory numbers are supplied by the UI. Result: `clean-assets/memory-atlas.png`.

## Clean coffee timer

One top-down cream ceramic coffee mug and matching saucer with two thin burgundy diner stripes. One handle right. Dark plain coffee centered in the image, transparent margins and subtle natural shadow. No text, numbers, logos, receipts or interface elements. Live timer digits render separately in the center. Result: `clean-assets/coffee-clean.png`.
