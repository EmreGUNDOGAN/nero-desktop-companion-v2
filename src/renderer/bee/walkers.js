// Cosmetic walkers use the actual island and village hexes; game time is irrelevant.
const DIRS = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
export const hexDistance = (a, b) => {
  const [aq, ar] = a.split(',').map(Number), [bq, br] = b.split(',').map(Number);
  return Math.max(Math.abs(aq - bq), Math.abs(ar - br), Math.abs(aq + ar - bq - br));
};

export function createWalkers({ THREE, world, height }) {
  const agents = new Set();
  let tiles = {}, graph = new Set();
  function setMap(island, village) {
    tiles = island || {};
    graph = new Set([...Object.keys(tiles).filter((k) => tiles[k].kind !== 'water'), ...(village || [])]);
    for (const a of agents) if (a.path.some((k) => !graph.has(k))) a.path = [];
  }
  function findPath(from, to) {
    if (!graph.has(from) || !graph.has(to)) return [];
    const open = new Set([from]), prev = new Map(), cost = new Map([[from, 0]]);
    while (open.size) {
      let current = null, best = Infinity;
      for (const k of open) {
        const f = cost.get(k) + hexDistance(k, to);
        if (f < best) { best = f; current = k; }
      }
      if (current === to) {
        const result = [to];
        while (prev.has(result[0])) result.unshift(prev.get(result[0]));
        return result;
      }
      open.delete(current);
      const [q, r] = current.split(',').map(Number);
      for (const [dq, dr] of DIRS) {
        const next = `${q + dq},${r + dr}`;
        if (!graph.has(next)) continue;
        const candidate = cost.get(current) + 1;
        if (candidate < (cost.get(next) ?? Infinity)) { prev.set(next, current); cost.set(next, candidate); open.add(next); }
      }
    }
    return [];
  }
  function waypoint(key, previous) {
    const [q, r] = key.split(',').map(Number);
    const p = world(q, r);
    const tile = tiles[key];
    p.y = tile ? height(tile) : 0.065;
    if (tile?.item || tile?.tree || tile?.decor || !tile) {
      // Stay near the incoming edge of occupied hexes, outside large props.
      const [pq, pr] = (previous || key).split(',').map(Number);
      const from = world(pq, pr);
      const d = from.clone().sub(p).setY(0);
      if (d.lengthSq() > 0.001) p.add(d.normalize().multiplyScalar(0.34));
    }
    return p;
  }
  function add(obj, key, speed = 0.9) {
    const agent = { obj, key, path: [], speed, velocity: 0, stride: 0, state: 'idle', onArrive: null, facing: obj.rotation.y };
    obj.position.copy(waypoint(key));
    agents.add(agent);
    return agent;
  }
  function move(agent, dest, onArrive) {
    const route = findPath(agent.key, dest);
    if (!route.length) return false;
    agent.path = route.slice(1);
    agent.onArrive = onArrive || null;
    if (!agent.path.length && onArrive) onArrive();
    return true;
  }
  function update(dt, t, low = false) {
    dt = Math.min(0.06, Math.max(0, dt));
    for (const a of agents) {
      if (!a.obj.visible) continue;
      const key = a.path[0];
      if (!key || a.state === 'sleep') {
        a.velocity = Math.max(0, a.velocity - dt * 2.8);
        if (!low || Math.floor(t * 15) % 2) a.obj.userData.idle?.(t);
        continue;
      }
      const target = waypoint(key, a.key);
      const dx = target.x - a.obj.position.x, dz = target.z - a.obj.position.z;
      const distance = Math.hypot(dx, dz);
      if (distance < 0.055) {
        a.obj.position.copy(target); a.key = a.path.shift();
        if (!a.path.length) { a.velocity = 0; a.obj.userData.idle?.(t); a.onArrive?.(); a.onArrive = null; }
        continue;
      }
      const desired = Math.min(a.speed, Math.max(0.22, distance * 2.1));
      a.velocity += Math.max(-2 * dt, Math.min(2 * dt, desired - a.velocity));
      const step = Math.min(distance, a.velocity * dt);
      a.obj.position.x += dx / distance * step;
      a.obj.position.z += dz / distance * step;
      a.obj.position.y += (target.y - a.obj.position.y) * Math.min(1, dt * 7);
      const angle = Math.atan2(dx, dz);
      a.facing += Math.atan2(Math.sin(angle - a.facing), Math.cos(angle - a.facing)) * Math.min(1, dt * 8);
      a.obj.rotation.y = a.facing;
      a.stride += step;
      if (!low || Math.floor(t * 15) % 2) a.obj.userData.walk?.(a.stride * 10);
    }
  }
  return { setMap, findPath, add, move, update, remove: (a) => agents.delete(a), agents };
}
