const store = require('./store');
const FILE = 'stats.json';
function getStats() { return store.read(FILE, { completed: 0, focusSeconds: 0, days: [], pets: 0 }); }
function saveStats(stats) { store.write(FILE, stats); return stats; }
module.exports = { getStats, saveStats };
