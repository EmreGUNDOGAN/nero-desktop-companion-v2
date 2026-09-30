// Nero 6.3.4 — 50 köylü × 100 kişisel mektup yükleyicisi.
'use strict';
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const LETTERS_BY_NAME = {};
for (let i = 1; i <= 25; i += 1) {
  const file = path.join(__dirname, 'letters', `village-letters-${String(i).padStart(2, '0')}.json.gz`);
  const pack = JSON.parse(zlib.gunzipSync(fs.readFileSync(file)).toString('utf8'));
  Object.assign(LETTERS_BY_NAME, pack);
}
module.exports = { LETTERS_BY_NAME };
