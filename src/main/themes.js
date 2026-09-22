const fs = require('fs');
const path = require('path');
const { app } = require('electron');
function roots() {
  return [path.join(process.resourcesPath || app.getAppPath(), 'themes'), path.join(app.getPath('userData'), 'themes')];
}
function listThemes() {
  const out = [];
  for (const root of roots()) {
    if (!fs.existsSync(root)) continue;
    for (const name of fs.readdirSync(root)) {
      const manifest = path.join(root, name, 'theme.json');
      try { out.push({ id: name, root: path.join(root, name), ...JSON.parse(fs.readFileSync(manifest, 'utf8')) }); } catch {}
    }
  }
  return out;
}
module.exports = { listThemes };
