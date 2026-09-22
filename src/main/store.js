const fs = require('fs');
const path = require('path');
const { app } = require('electron');

function dataPath(name) {
  const dir = app.getPath('userData');
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, name);
}
function read(name, fallback) {
  try { return JSON.parse(fs.readFileSync(dataPath(name), 'utf8')); }
  catch { return fallback; }
}
function write(name, value) {
  const file = dataPath(name);
  const temp = file + '.tmp';
  fs.writeFileSync(temp, JSON.stringify(value, null, 2), 'utf8');
  fs.renameSync(temp, file);
}
module.exports = { read, write, dataPath };
