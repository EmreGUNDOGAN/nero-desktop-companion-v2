const test = require('node:test');
const assert = require('node:assert/strict');
const { BeeGame } = require('../src/main/bee');
const VILLAGE = require('../src/main/village-data');
const { LETTERS_BY_NAME } = require('../src/main/village-letters');

class MemoryStore {
  constructor(value = null) { this.value = value; }
  get() { return this.value; }
  set(value) { this.value = value; }
  flush() {}
}

const start = () => new BeeGame(new MemoryStore());

test('6.3.4 contains 50 villagers with 100 unique personal letters each', () => {
  const entries = Object.entries(LETTERS_BY_NAME);
  assert.equal(entries.length, 50);
  for (const [name, list] of entries) {
    assert.equal(list.length, 100, name);
    assert.equal(new Set(list).size, 100, name);
  }
});

test('6.3.4 kişisel mektup havuzu 6.6.1 dinamik gönderen ve 3 oyun günlük içerik cooldownuyla uyumludur', () => {
  const bee = start();
  const letterNames = new Set(Object.keys(LETTERS_BY_NAME));
  bee.state.village.arrived = VILLAGE.filter((entry) => entry.type === 'koylu' && letterNames.has(entry.name)).map((entry) => entry.n);
  assert.equal(bee.state.village.arrived.length, 50);

  let previous = null;
  const seenByDay = new Map();
  const originalRandom = Math.random;
  Math.random = () => 0;
  try {
    for (let day = 1; day <= 120; day++) {
      assert.equal(bee.sendLetter(day, day * 1000), true);
      const letter = bee.state.letters.at(-1);
      assert.ok(letter, `day ${day}`);
      if (previous) assert.notEqual(letter.from, previous, `same sender back-to-back: ${letter.from}`);
      const lastDay = seenByDay.get(letter.contentId);
      if (lastDay != null) assert.ok(day - lastDay >= 3, `content cooldown: ${letter.contentId}`);
      seenByDay.set(letter.contentId, day);
      previous = letter.from;
    }
  } finally {
    Math.random = originalRandom;
  }
});

test('6.3.4 rivals do not progress during manual or unattended pause', () => {
  const bee = start();

  bee.state.speed = 0;
  const manual = structuredClone(bee.state.rivals);
  bee.rollRivals(1);
  assert.deepEqual(bee.state.rivals, manual);
  assert.notEqual(bee.state.rivalsLastDay, 1);

  bee.state.speed = 1;
  bee.state.pauseStartedAt = Date.now();
  const unattended = structuredClone(bee.state.rivals);
  bee.rollRivals(1);
  assert.deepEqual(bee.state.rivals, unattended);
  assert.notEqual(bee.state.rivalsLastDay, 1);

  bee.state.pauseStartedAt = null;
  bee.rollRivals(1);
  assert.equal(bee.state.rivalsLastDay, 1);
  assert.notDeepEqual(bee.state.rivals, unattended);
});

test('6.3.4 UI includes warning center, exact tournament guide, and release history navigation', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const root = path.join(__dirname, '..');
  const html = fs.readFileSync(path.join(root, 'src/renderer/bee/index.html'), 'utf8');
  const js = fs.readFileSync(path.join(root, 'src/renderer/bee/bee.js'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'src/renderer/bee/ui-v2.css'), 'utf8');
  const notes = fs.readFileSync(path.join(root, 'src/renderer/bee/release-notes.js'), 'utf8');

  assert.match(html, /id="warning-center"/);
  assert.match(js, /function activeWarnings/);
  assert.match(js, /h\.sick/);
  assert.match(js, /t\.item\.wilted/);
  assert.match(js, /v\.storageKg >= v\.storageCap/);
  assert.match(css, /#warning-center/);
  assert.match(css, /-webkit-text-stroke/);

  assert.match(html, /Bal Kalitesi — 400/);
  assert.match(html, /70 taban \+ gönderilen kg ×8/);
  assert.match(html, /min\(100, balın taban fiyatı ×1,15\)/);
  assert.match(html, /Arıcılık — 250/);
  assert.match(html, /Üretim — 200/);
  assert.match(html, /Köy İtibarı — 150/);

  assert.match(html, /id="whats-new-prev"/);
  assert.match(html, /id="whats-new-release-link"/);
  assert.match(js, /let releaseIndex = -1/);
  assert.match(js, /function versionParts/);
  assert.match(js, /function compareVersions/);
  assert.match(js, /openRelease/);
  assert.match(notes, /RELEASES_PAGE_URL/);
  assert.doesNotMatch(notes, /version:\s*['"]6\.3\.4['"]/);
  assert.match(js, /window\.bee\.releases\(\)/);
  assert.match(html, /id="whats-new-all-releases-link"/);
});