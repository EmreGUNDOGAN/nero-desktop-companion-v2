'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT, 'src', 'data', 'dialogue-master.manifest.json');
const MASTER_PATH = path.join(ROOT, 'src', 'data', 'dialogue.master.tr.json');
const OUTPUT_PATH = path.join(ROOT, 'src', 'data', 'dialogue.tr.json');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function textOf(entry) {
  if (typeof entry === 'string') return entry;
  if (entry && typeof entry === 'object' && typeof entry.t === 'string') return entry.t;
  return null;
}

function norm(text) {
  return text.trim().replace(/\s+/g, ' ').toLocaleLowerCase('tr-TR');
}

function validate(master, manifest) {
  const errors = [];
  const warnings = [];
  const allowed = new Set(manifest.rules.allowed_placeholders || []);

  for (const [category, pool] of Object.entries(master)) {
    if (!Array.isArray(pool)) continue;
    const seen = new Map();
    for (let i = 0; i < pool.length; i += 1) {
      const text = textOf(pool[i]);
      if (!text || !text.trim()) {
        errors.push(`${category}[${i + 1}]: invalid/empty dialogue entry`);
        continue;
      }
      const key = norm(text);
      if (seen.has(key)) {
        errors.push(`${category}: duplicate lines ${seen.get(key)} and ${i + 1}: ${text}`);
      } else {
        seen.set(key, i + 1);
      }
      for (const match of text.matchAll(/\{([a-zA-Z0-9_]+)\}/g)) {
        if (!allowed.has(match[1])) errors.push(`${category}[${i + 1}]: unknown placeholder {${match[1]}}`);
      }
    }
  }

  for (const [category, spec] of Object.entries(manifest.approved_expanded || {})) {
    const count = Array.isArray(master[category]) ? master[category].length : -1;
    if (count !== spec.count) errors.push(`${category}: expected approved count ${spec.count}, got ${count}`);
  }

  for (const [category, spec] of Object.entries(manifest.pending_reconcile || {})) {
    const count = Array.isArray(master[category]) ? master[category].length : -1;
    if (count !== spec.current_count) errors.push(`${category}: reconciliation baseline changed: expected ${spec.current_count}, got ${count}`);
    warnings.push(`${category}: pending reconciliation -> target ${spec.target_count}`);
  }

  for (const [category, spec] of Object.entries(manifest.pending_recovery || {})) {
    const count = Array.isArray(master[category]) ? master[category].length : -1;
    if (count !== spec.current_count) errors.push(`${category}: recovery baseline changed: expected ${spec.current_count}, got ${count}`);
    warnings.push(`${category}: full approved pool still needs exact-text recovery -> target ${spec.target_count}`);
  }

  return { errors, warnings };
}

const manifest = readJson(MANIFEST_PATH);
const master = readJson(MASTER_PATH);
const result = validate(master, manifest);

for (const warning of result.warnings) console.warn('WARN:', warning);
if (result.errors.length) {
  for (const error of result.errors) console.error('ERROR:', error);
  process.exit(1);
}

const checkOnly = process.argv.includes('--check');
if (checkOnly) {
  const output = readJson(OUTPUT_PATH);
  if (JSON.stringify(output) !== JSON.stringify(master)) {
    console.error('ERROR: dialogue.tr.json is out of sync with dialogue.master.tr.json');
    process.exit(1);
  }
  console.log('Dialogue master OK. Output is in sync.');
  process.exit(0);
}

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(master, null, 2) + '\n', 'utf8');
console.log('Built src/data/dialogue.tr.json from dialogue.master.tr.json');
