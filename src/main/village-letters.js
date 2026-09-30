// Nero 6.3.4 — 50 köylü × 100 kişisel mektup yükleyicisi.
'use strict';
const fs = require('fs');
const path = require('path');

const LETTERS_BY_NAME = {};
for (let i = 1; i <= 7; i += 1) {
  const file = path.join(__dirname, 'letters', `village-letters-${String(i).padStart(2, '0')}.json`);
  const pack = JSON.parse(fs.readFileSync(file, 'utf8'));
  Object.assign(LETTERS_BY_NAME, pack);
}

const names = Object.keys(LETTERS_BY_NAME);
if (names.length !== 50) throw new Error(`Köylü mektup paketi eksik: ${names.length}/50`);
for (const [name, list] of Object.entries(LETTERS_BY_NAME)) {
  if (!Array.isArray(list) || list.length !== 100) {
    throw new Error(`Köylü mektup havuzu hatalı: ${name} (${Array.isArray(list) ? list.length : 'dizi değil'})`);
  }
  if (new Set(list).size !== 100) throw new Error(`Köylü mektup havuzunda tekrar var: ${name}`);
}
module.exports = { LETTERS_BY_NAME };
