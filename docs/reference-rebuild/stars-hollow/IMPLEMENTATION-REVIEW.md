# Gilmore Girls: reference implementation review

The five approved PNGs in `docs/tv-themes/concepts/stars-hollow` are the source of the composition. Originals have not been modified. Source extraction is theme-specific; no work on Scranton or Bikini Bottom is included in this stage.

## Assets and live content

Individual crops are recorded in asset-manifest.json; polygon cutouts in cutout-manifest.json; final glyph/sketch/date cleaning in refined-asset-manifest.json. Raw composition crops are reference material, not complete functional pages. Live note bodies, task names, dates, counter values, mood states, progress, and totals are rendered from the existing application state. Decorative printed signs, book covers and scene captions retain the original artwork.

Three image edits were used to remove baked UI text or supply an uninterrupted counter texture:

- home-hero-clean.png: original diner scene with baked greeting removed, overlaid by live greeting.
- timer-coffee-clean.png: original cup and focus tag with baked time removed; native countdown is displayed over the coffee.
- wood-wide.png: expanded plain counter texture matching the source wood direction. The original reference remains preserved.

The original logo and navigation glyphs are raster crops. Body text uses Times New Roman, with the bundled Caveat face for handwriting and Courier Prime for date stamps. Generated mockups do not identify a specific font file, so these choices must not be described as a verified original font identity.

## Verified behavior

- 353 unit tests passed, including real threshold progress with no premature achievement unlock.
- TV theme regression: 60 layout checks plus autosave/checklists, linked timers and repeated native-node restoration.
- Gilmore functional verification: memory opening without accidental form submission; search after paper assembly; real pointer drag Today to Later; linked timer/dated ledger/reset; native rarity filtering.
- Fifteen rendered layout inspections across 380, 600 and 900 pixel widths: no horizontal overflow after corrections. Actual rendered captures and detailed results are in screens and functional-verification.json.

All five pages have distinct source compositions: diner home, library notebook, Dragonfly paperwork, Luke's coffee counter, festival corkboard. Data-dependent content can have different text length or item count from the sample artwork. Window resizing adapts physical surfaces to fit and preserves functionality.

The latest user delivery request is source code only; no new Setup/EXE is to be delivered. Passing tests alone are not a claim of pixel-identical visual matching.

## Final header corrections

The source nav glyphs were previously truncated at 28 pixels. `finish-gilmore-header.py` recovers each complete glyph up to its caption gap and adds transparent padding; `final-nav-manifest.json` records all six crop boundaries. The badge count and rarity controls now flow inside the original heading paper, removing the negative offset that overlapped its description. The real renderer images and three-width verification are in `review-final-header`. Native filtering, cross-theme restoration and Gilmore functional regression passed. The user has yet to visually approve this final correction.
