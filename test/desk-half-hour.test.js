'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { DESK_ITEMS, Stats } = require('../src/main/stats');

test('masa köşesi her 30 dakikada bir açılır ve kalan dakika doğru hesaplanır', () => {
  assert.deepEqual(DESK_ITEMS.map((x) => x.hours * 60), [30, 60, 90, 120, 150, 180, 210, 240, 270, 300]);
  const stats = new Stats({ get: () => ({}), set: () => {} });
  stats.data.totals.focusMin = 29;
  assert.equal(stats.deskList().next.minutesLeft, 1);
  stats.data.totals.focusMin = 30;
  stats.evaluateDesk();
  assert.ok(stats.deskList().items[0].unlockedAt);
  assert.equal(stats.deskList().next.minutesLeft, 30);
  stats.data.totals.focusMin = 299;
  stats.evaluateDesk();
  assert.equal(stats.deskList().next.minutesLeft, 1);
});

test('iş hatırlatıcıları platforma bağlı AM/PM alanı kullanmaz', () => {
  const html = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/index.html'), 'utf8');
  const panel = fs.readFileSync(path.join(__dirname, '../src/renderer/panel/panel.js'), 'utf8');
  assert.match(html, /id="todo-time" type="text"/);
  assert.match(html, /2\[0-3\]/);
  assert.match(panel, /tInput\.type = 'text'/);
});
