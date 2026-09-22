const LEVELS = [
  { after: 6 * 60 * 60 * 1000, mood: 'lonely' },
  { after: 4 * 60 * 60 * 1000, mood: 'upset' },
  { after: 3 * 60 * 60 * 1000, mood: 'bored' }
];
function getMood(idleMs = 0) {
  return LEVELS.find(x => idleMs >= x.after)?.mood || 'happy';
}
module.exports = { getMood, LEVELS };
