import { buildVillager } from './figures.js';
import { lookFor } from './villager-looks.js';
import { pickIslandLifeEvent } from './island-life-events.js';

export function createVillageLife({
  scene, walkers, graphics, house, bubble,
  festival = () => [], festivalOpen = () => false,
  market = () => null, life = () => null, weather = () => null,
  season = () => null, markLifeEvent = () => {}
}) {
  const people = new Map();
  const marketSeller = buildVillager({ role: 'koylu', shirt: 0xB86A43, apron: 0xE8D7B0, hair: 0x5A3927, hat: 'kasket', hatColor: 0x7B5732 });
  marketSeller.scale.multiplyScalar(0.95);
  marketSeller.visible = false;
  scene.add(marketSeller);
  let marketSellerAgent = null;
  let residents = [], lastDay = -1, nextLifeCheck = 0, lastSocialMinute = -1;
  const localPlayed = new Set();
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
      people.set(r.n, {
        name, slot: r.slot, type: r.type, fig, agent: walkers.add(fig, r.slot),
        next: 0, delivering: false, marketDelivery: false, marketDay: -1, socialUntil: 0
      });
    }
  }

  function visibleWindow(id, p, day) {
    const depart = 6.6 + seed(id, day) * 2.6;
    let home = p.type === 'dukkan' ? 20.3 + seed(id + 41, day) * 1.3 : 19.2 + seed(id + 41, day) * 3.0;
    // Her gece az sayıda komşu daha geç saate kadar meydanda kalabilir.
    if (seed(id + 99, day) > 0.82) home = 23.4;
    return { depart, home };
  }

  function targetKey(kind, p, idx = 0) {
    if (kind === 'market' && market()) return market();
    if (kind === 'festival') {
      const plaza = festival();
      return plaza.length ? plaza[idx % plaza.length] : p.slot;
    }
    if (kind === 'shop') {
      const shops = residents.filter((r) => r.type === 'dukkan' && r.slot);
      return shops.length ? shops[idx % shops.length].slot : p.slot;
    }
    const choices = residents.filter((r) => r.slot && r.slot !== p.agent.key);
    return choices.length ? choices[idx % choices.length].slot : p.slot;
  }

  function runLifeEvent(now) {
    const time = now.getTime();
    if (time < nextLifeCheck) return;
    nextLifeCheck = time + 60_000;
    const state = life() || { played: [] };
    const played = new Set([...(state.played || []), ...localPlayed]);
    const available = [...people.values()].filter((p) => !p.delivering && !p.marketDelivery && p.fig.visible && !p.agent.path.length);
    const shopNames = residents.filter((r) => r.type === 'dukkan').map((r) => r.name);
    const event = pickIslandLifeEvent({
      season: season(), hour: now.getHours() + now.getMinutes() / 60, weather: weather(),
      played: [...played], peopleCount: available.length, shops: shopNames
    });
    if (!event) return;
    const participants = available.slice(0, Math.max(event.minPeople, Math.min(3, available.length)));
    if (participants.length < event.minPeople) return;
    participants.forEach((p, i) => {
      const dest = targetKey(event.target, p, i);
      walkers.move(p.agent, dest, () => {
        p.socialUntil = Date.now() + 10_000;
        if (i === 0) bubble(p.fig, event.title, 2600);
        else if (i === 1) bubble(p.fig, weather() === 'yagmurlu' ? event.rainLine : event.line, 3200);
      });
      p.next = time + 4 * 60_000;
    });
    localPlayed.add(event.id);
    markLifeEvent(event.id);
    nextLifeCheck = time + 6 * 60_000;
  }

  function socialTick(now) {
    const minute = Math.floor(now.getTime() / 60000);
    if (minute === lastSocialMinute) return;
    lastSocialMinute = minute;
    const visible = [...people.values()].filter((p) => p.fig.visible && !p.delivering && !p.marketDelivery && !p.agent.path.length);
    for (let i = 0; i < visible.length; i++) for (let j = i + 1; j < visible.length; j++) {
      const a = visible[i], b = visible[j];
      if (a.socialUntil > now.getTime() || b.socialUntil > now.getTime()) continue;
      if (Math.hypot(a.fig.position.x - b.fig.position.x, a.fig.position.z - b.fig.position.z) > 1.35) continue;
      if (seed(i + j + minute, lastDay) < 0.72) continue;
      bubble(a.fig, ['Günaydın!', 'Kolay gelsin!', 'Hava güzel.', 'Pazar nasıl?'][minute % 4], 1800);
      setTimeout(() => bubble(b.fig, ['Sağ ol!', 'Sana da!', 'Biraz serin.', 'İyi gidiyor.'][(minute + 1) % 4], 1800), 1300);
      a.socialUntil = b.socialUntil = now.getTime() + 4 * 60_000;
      return;
    }
  }

  function update(now) {
    const marketKey = market();
    if (marketKey && !marketSellerAgent) marketSellerAgent = walkers.add(marketSeller, marketKey, 0.55);
    if (marketSellerAgent) {
      marketSeller.visible = true;
      marketSellerAgent.state = 'idle';
    }
    const hour = now.getHours() + now.getMinutes() / 60;
    const day = Math.floor(now.getTime() / 86400000);
    if (lastDay !== day) { lastDay = day; for (const p of people.values()) p.next = 0; }
    const max = { yuksek: 12, dengeli: 6, hafif: 2 }[graphics()] || 6;
    let active = [...people.values()].filter((p) => p.fig.visible).length;

    for (const [id, p] of people) {
      if (p.delivering) continue;
      if (p.type === 'dukkan' && marketKey && p.marketDay !== day && !p.marketDelivery && !p.agent.path.length) {
        const deliveryHour = 8.5 + seed(id + 31, day) * 2.5;
        if (hour >= deliveryHour && hour < 13) {
          p.marketDelivery = true;
          p.fig.visible = true;
          const moved = walkers.move(p.agent, marketKey, () => {
            p.marketDay = day;
            bubble(p.fig, 'Pazara ürün bıraktım.', 1900);
            setTimeout(() => walkers.move(p.agent, p.slot, () => {
              p.marketDelivery = false; p.next = Date.now() + 60000;
            }), 1800);
          });
          if (!moved) p.marketDelivery = false;
          continue;
        }
      }
      if (p.marketDelivery) continue;

      const window = visibleWindow(id, p, day);
      if (hour < window.depart || hour >= window.home) {
        if (p.fig.visible && p.agent.key !== p.slot && !p.agent.path.length) {
          walkers.move(p.agent, p.slot, () => { p.fig.visible = false; });
        } else if (p.agent.key === p.slot && !p.agent.path.length) p.fig.visible = false;
        continue;
      }

      const late = hour >= 20.5;
      const showChance = late ? 0.86 : 0.7;
      if (!p.fig.visible && active < max && seed(id + now.getMinutes(), day) > showChance) {
        p.fig.visible = true; active++; p.next = 0;
      }
      if (!p.fig.visible || p.agent.path.length || now.getTime() < p.next) continue;

      const plaza = festival();
      const plazaChance = festivalOpen() ? 0.34 : (hour >= 17 ? 0.22 : 0.13);
      if (plaza.length && hour >= 9 && hour < 23 && seed(id + 7, Math.floor(now.getTime() / 60000)) < plazaChance) {
        p.next = now.getTime() + (2 + seed(id + 8, day) * 3) * 60000;
        walkers.move(p.agent, plaza[id % plaza.length]);
        continue;
      }
      if (marketKey && hour >= 9 && hour < 19 && seed(id + 16, Math.floor(now.getTime() / 60000)) < 0.11) {
        p.next = now.getTime() + 2 * 60000;
        walkers.move(p.agent, marketKey);
        continue;
      }
      const targets = residents.filter((r) => r.slot && r.slot !== p.agent.key && (r.type !== 'koylu' || r.n % 3 === id % 3));
      const target = targets[Math.floor(seed(id, Math.floor(now.getTime() / 60000)) * targets.length)];
      p.next = now.getTime() + (1 + seed(id + 4, day) * 3) * 60000;
      if (target) walkers.move(p.agent, target.slot);
    }

    socialTick(now);
    runLifeEvent(now);
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

  return { sync, update, deliver, people, marketSeller };
}