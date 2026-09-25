import p1 from './bee-dialogues-01.js';
import p2 from './bee-dialogues-02.js';
import p3 from './bee-dialogues-03.js';
import p4 from './bee-dialogues-04.js';
import p5 from './bee-dialogues-05.js';
import p6 from './bee-dialogues-06.js';
import p7 from './bee-dialogues-07.js';
import p8 from './bee-dialogues-08.js';

export const BEE_DIALOGUES = Object.freeze(Object.assign({}, p1, p2, p3, p4, p5, p6, p7, p8));

export function pickBeeDialogue(topic, vars = {}) {
  const pool = BEE_DIALOGUES[topic] || [];
  if (!pool.length) return null;
  let line = pool[Math.floor(Math.random() * pool.length)];
  for (const [k, v] of Object.entries(vars || {})) line = line.split(`{${k}}`).join(String(v));
  return line;
}
