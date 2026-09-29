'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('canonical wardrobe renderer is shared by character and settings preview', () => {
  const root = path.join(__dirname, '..');
  const shared = fs.readFileSync(path.join(root, 'src/renderer/shared/wardrobe-canonical.js'), 'utf8');
  const character = fs.readFileSync(path.join(root, 'src/renderer/character/character.js'), 'utf8');
  const panel = fs.readFileSync(path.join(root, 'src/renderer/panel/panel.js'), 'utf8');
  const characterHtml = fs.readFileSync(path.join(root, 'src/renderer/character/index.html'), 'utf8');
  const panelHtml = fs.readFileSync(path.join(root, 'src/renderer/panel/index.html'), 'utf8');

  assert.match(shared, /extractGarmentAndHeadwear/);
  assert.match(shared, /warpCollar/);
  assert.match(shared, /ctx\.drawImage\(body, 0, 0, width, height\)/);
  assert.match(character, /NeroWardrobeCanonical\.build/);
  assert.match(panel, /NeroWardrobeCanonical\.renderInto/);
  assert.match(characterHtml, /shared\/wardrobe-canonical\.js/);
  assert.match(panelHtml, /shared\/wardrobe-canonical\.js/);
  assert.doesNotMatch(character, /WARDROBE_SHAPE_SCALE/);
  assert.doesNotMatch(panel, /WARDROBE_PREVIEW_SCALE/);
});
