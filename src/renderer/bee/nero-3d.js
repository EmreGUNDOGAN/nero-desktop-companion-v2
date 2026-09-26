import { buildNero } from './figures.js';

export function createIslandNero({ scene, walkers, house, targets, getNight, villagers, bubble, say }) {
  const fig = buildNero();
  fig.scale.setScalar(1.3);
  scene.add(fig);
  let agent, next = 0, asleep = false;
  const greeted = new Map();
  function sync() {
    const key = house();
    if (key && !agent) agent = walkers.add(fig, key, 0.7);
  }
  function update(now) {
    if (!agent) return;
    const time = now.getTime();
    const dark = getNight() >= 0.5;
    if (dark) {
      if (!asleep && !agent.path.length) {
        if (agent.key !== house()) walkers.move(agent, house(), () => { asleep = true; agent.state = 'sleep'; bubble(fig, 'Zzz', 2200); });
        else { asleep = true; agent.state = 'sleep'; }
      }
      if (asleep) fig.userData.sleep(time / 1000);
      return;
    }
    if (asleep) { asleep = false; agent.state = 'idle'; fig.userData.wake(); next = time + 5000; }
    if (agent.path.length) return;
    for (const p of villagers().values()) {
      if (!p.fig.visible || p.delivering || p.agent.path.length || (greeted.get(p.name) || 0) > time - 300000) continue;
      if (Math.hypot(p.fig.position.x - fig.position.x, p.fig.position.z - fig.position.z) > 1.8) continue;
      greeted.set(p.name, time);
      bubble(p.fig, 'Günaydın!', 1900);
      setTimeout(() => bubble(fig, 'Bal nasıl gidiyor?', 1900), 2000);
      next = time + 7000;
      break;
    }
    if (time < next) return;
    const choices = targets().filter((key) => key !== agent.key);
    if (choices.length) walkers.move(agent, choices[Math.floor(Math.random() * choices.length)]);
    next = time + (20 + Math.random() * 40) * 1000;
  }
  function click() {
    if (!agent || asleep) return;
    agent.path = [];
    fig.rotation.y = Math.atan2(-fig.position.x, -fig.position.z);
    bubble(fig, say(), 3500);
    next = Date.now() + 8000;
  }
  return { fig, sync, update, click, get active() { return !!agent; } };
}
