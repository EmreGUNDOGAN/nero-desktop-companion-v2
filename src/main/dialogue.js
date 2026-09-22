const fs = require('fs');
const path = require('path');
const dialoguePath = path.join(__dirname, '..', 'data', 'dialogue.tr.json');
function loadDialogue() {
  try { return JSON.parse(fs.readFileSync(dialoguePath, 'utf8')); }
  catch { return { happy: ['Buradayım.'], bored: ['Bir şey mi yapacaktık?'], upset: ['Beni unuttun galiba.'], lonely: ['...'] }; }
}
function randomLine(mood = 'happy') {
  const data = loadDialogue(); const lines = data[mood] || data.happy || ['...'];
  return lines[Math.floor(Math.random() * lines.length)];
}
module.exports = { loadDialogue, randomLine };
