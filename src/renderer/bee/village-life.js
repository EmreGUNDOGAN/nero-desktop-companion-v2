import { buildVillager } from './figures.js';
import { lookFor } from './villager-looks.js';

export function createVillageLife({ scene, walkers, graphics, house, bubble, festival = () => [] }) {
  const people = new Map();
  let residents = [], lastDay = -1;
  const seed = (n, day) => ((n * 2654435761 + day * 1013904223) >>> 0) / 4294967296;
  const personName = (r) => r.type === 'koylu' ? r.name : r.owner;
  function sync(v) {
    residents = v.village?.residents || [];
    const valid = new Set(residents.filter((r) => personName(r)).map((r) => r.n));
    for (const [id, p] of people) if (!valid.has(id) || p.slot !== residents.find((r) => r.n === id)?.slot) {
      walkers.remove(p.agent); scene.remove(p.fig); people.delete(id);
    }
    for (const r of residents) {
      const name = personName(r);
      if (!name || people.has(r.n) || !r.slot) continue;
      // Appearance tables come from an older village roster; never apply the wrong person's clothes.
      const saved = lookFor(r.n);
      const role = saved.name === name ? saved.role : /balıkçı/i.test(name) ? 'balikci'
        : /fırıncı|pastacı|aşçı/i.test(name) ? 'firinci'
          : /öğretmen|profesör/i.test(name) ? 'ogretmen'
            : /doktor|hemşire|veteriner/i.test(name) ? 'doktor'
              : /çiftçi|bahçıvan|arıcı/i.test(name) ? 'ciftci'
                : /nine/i.test(name) ? 'nine' : /küçük|minik|ikizler/i.test(name) ? 'cocuk' : 'koylu';
      const look = saved.name === name ? { ...saved } : { role, shirt: [0x6FA3D9, 0xD77A58, 0x9C7BD6, 0x6D9F74][r.n % 4] };
      if (look.role === 'nine' && /dede|mahmut/i.test(name)) look.role = 'koylu';
      const fig = buildVillager(look);
      fig.visible = false;
      fig.scale.multiplyScalar(0.9);
      scene.add(fig);
      people.set(r.n, { name, slot: r.slot, fig, agent: walkers.add(fig, r.slot), next: 0, delivering: false });
    }
  }
  function update(now) {
    const hour = now.getHours() + now.getMinutes() / 60;
    const day = Math.floor(now.getTime() / 86400000);
    if (lastDay !== day) { lastDay = day; for (const p of people.values()) p.next = 0; }
    const max = { yuksek: 12, dengeli: 6, hafif: 2 }[graphics()] || 6;
    let active = [...people.values()].filter((p) => p.fig.visible).length;
    for (const [id, p] of people) {
      if (p.delivering) continue;
      const departure = 7 + seed(id, day) * 3;
      if (hour < departure || hour >= 20) {
        if (p.fig.visible) active--;
        p.fig.visible = false; p.agent.path = []; p.agent.key = p.slot;
        continue;
      }
      if (hour >= 18) {
        if (p.fig.visible && p.agent.key !== p.slot && !p.agent.path.length) walkers.move(p.agent, p.slot, () => { p.fig.visible = false; });
        else if (p.agent.key === p.slot && !p.agent.path.length) p.fig.visible = false;
        continue;
      }
      if (!p.fig.visible && active < max && seed(id + now.getMinutes(), day) > 0.7) {
        p.fig.visible = true;
        active++;
        p.next = 0;
      }
      if (!p.fig.visible || p.agent.path.length || now.getTime() < p.next) continue;
      const plaza = festival();
      // Visits happen only during the festival; the normal wandering schedule resumes afterwards.
      if (plaza.length && hour >= 10 && hour < 17 && seed(id + 7, Math.floor(now.getTime() / 60000)) < 0.28) {
        p.next = now.getTime() + (2 + seed(id + 8, day) * 3) * 60000;
        walkers.move(p.agent, plaza[id % plaza.length]);
        continue;
      }
      const targets = residents.filter((r) => r.slot && r.slot !== p.agent.key && (r.type !== 'koylu' || r.n % 3 === id % 3));
      const target = targets[Math.floor(seed(id, Math.floor(now.getTime() / 60000)) * targets.length)];
      p.next = now.getTime() + (1 + seed(id + 4, day) * 3) * 60000;
      if (target) walkers.move(p.agent, target.slot);
    }
  }
  function deliver(who) {
    const p = [...people.values()].find((x) => x.name === who);
    const dest = house();
    if (!p || !dest) return;
    p.delivering = true; p.fig.visible = true;
    p.agent.path = [];
    if (!walkers.move(p.agent, dest, () => {
      p.fig.userData.jar.visible = true;
      bubble(p.fig, 'Teşekkürler!', 2000);
      setTimeout(() => {
        p.fig.userData.jar.visible = false;
        walkers.move(p.agent, p.slot, () => { p.delivering = false; p.fig.visible = false; });
      }, 1500);
    })) p.delivering = false;
  }
  return { sync, update, deliver, people };
}
