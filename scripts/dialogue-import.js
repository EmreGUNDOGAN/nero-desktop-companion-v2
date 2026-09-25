'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const MASTER_PATH = path.join(ROOT, 'src', 'data', 'dialogue.master.tr.json');
const MANIFEST_PATH = path.join(ROOT, 'src', 'data', 'dialogue-master.manifest.json');
const BUILDER_PATH = path.join(__dirname, 'dialogue-master.js');

const [category, inputArg, expectedArg] = process.argv.slice(2);
if (!category || !inputArg || !expectedArg) {
  console.error('Usage: node scripts/dialogue-import.js <category> <txt-path> <expected-count>');
  process.exit(2);
}

const expected = Number(expectedArg);
if (!Number.isInteger(expected) || expected < 1) {
  console.error('Expected count must be a positive integer.');
  process.exit(2);
}

const inputPath = path.resolve(process.cwd(), inputArg);
const raw = fs.readFileSync(inputPath, 'utf8');
const lines = raw
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => {
    const numbered = line.match(/^\d+[.)]\s+(.*)$/);
    return (numbered ? numbered[1] : line).trim();
  });

if (lines.length !== expected) {
  console.error(`Count mismatch for ${category}: expected ${expected}, got ${lines.length}`);
  process.exit(1);
}

const normalized = new Map();
for (let i = 0; i < lines.length; i += 1) {
  const key = lines[i].replace(/\s+/g, ' ').toLocaleLowerCase('tr-TR');
  if (normalized.has(key)) {
    console.error(`Duplicate in import for ${category}: lines ${normalized.get(key)} and ${i + 1}`);
    process.exit(1);
  }
  normalized.set(key, i + 1);
}

const master = JSON.parse(fs.readFileSync(MASTER_PATH, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
const oldPool = Array.isArray(master[category]) ? master[category] : [];
const metadataByText = new Map();

for (const entry of oldPool) {
  if (entry && typeof entry === 'object' && typeof entry.t === 'string') {
    metadataByText.set(entry.t, entry);
  }
}

master[category] = lines.map((text) => {
  const old = metadataByText.get(text);
  return old ? { ...old, t: text } : text;
});

manifest.approved_expanded ||= {};
manifest.approved_expanded[category] = { count: expected, status: 'approved' };
if (manifest.pending_reconcile) delete manifest.pending_reconcile[category];
if (manifest.pending_recovery) delete manifest.pending_recovery[category];
if (manifest.not_yet_expanded) delete manifest.not_yet_expanded[category];

fs.writeFileSync(MASTER_PATH, JSON.stringify(master, null, 2) + '\n', 'utf8');
fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

execFileSync(process.execPath, [BUILDER_PATH], { stdio: 'inherit' });
console.log(`Imported ${category}: ${expected} lines. Master + generated output updated.`);
