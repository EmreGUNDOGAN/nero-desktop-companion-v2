// Ada dekorları v2: boş karelere doğal süsler (nilüfer, sazlık, kır çiçeği, kaya, mantar, kütük, çiçekli ağaç) ve evden kovanlara patika
// Yerleşim tohumludur: aynı ada her açılışta aynı görünür. Sadece boş karelere konur (kovan, tarh, ağaç, dekor olmayan)
import * as THREE from '../vendor/three.module.min.js';
import { mat, C } from '../evler/kit.js';

const DIRS = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
const at = (o, x, y, z) => { o.position.set(x, y, z); return o; };
const M = (c) => mat(c);

export function makeIslandDecor(view, hexToWorld, topY, hivePositions = []) {
  const G = new THREE.Group();
  const put = (o, x, y, z) => { at(o, x, y, z); o.traverse((k) => { if (k.isMesh) k.castShadow = true; }); G.add(o); };
  let seed = 7; const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (const t of Object.values(view.tiles)) {
    const p = hexToWorld(t.q, t.r); const y = topY(t);
    const nearWater = DIRS.some(([a, b]) => { const n = view.tiles[`${t.q + a},${t.r + b}`]; return n && n.kind === 'water'; });
    if (t.kind === 'water') { // nilüferler
      for (let i = 0; i < 2; i++) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.02, 10), M(0x5FA24E)); put(l, p.x + (r() - 0.5) * 1.1, y + 0.02, p.z + (r() - 0.5) * 1.1); if (r() < 0.6) put(new THREE.Mesh(new THREE.SphereGeometry(0.055, 6, 4), M(0xF5B8C6)), l.position.x, y + 0.06, l.position.z); }
      continue;
    }
    if (t.item || t.tree || t.decor) continue;
    const k = r();
    if (t.owned && k > 0.3) continue; // sahip olunan boş karelerde az dekor (çiftlik temiz kalsın)
    if (nearWater && k < 0.7) { // sazlık
      const g = new THREE.Group(); for (let i = 0; i < 6; i++) { const x = (r() - 0.5) * 0.28, z = (r() - 0.5) * 0.28, h = 0.38 + r() * 0.2; const c = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.017, h, 4), M(0x7A9A4A)); c.position.set(x, h / 2, z); c.rotation.z = (r() - 0.5) * 0.3; g.add(c, at(new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.09, 6), M(0x6B4A2B)), x, h - 0.02, z)); }
      put(g, p.x + (r() - 0.5) * 0.6, y, p.z + (r() - 0.5) * 0.6);
    } else if (k < 0.3) { // kır çiçekleri (büyütüldü)
      const g = new THREE.Group(); const cols = [0xFFFFFF, 0xF5D76E, 0xE893A8, 0x9C7BD6, 0xE0626A];
      for (let i = 0; i < 8; i++) { const a = r() * 6.28, d = r() * 0.32; g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.18, 3), M(0x5F8F4A)), Math.cos(a) * d, 0.09, Math.sin(a) * d), at(new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 4), M(cols[Math.floor(r() * 5)])), Math.cos(a) * d, 0.19, Math.sin(a) * d)); }
      put(g, p.x + (r() - 0.5) * 0.8, y, p.z + (r() - 0.5) * 0.8);
    } else if (k < 0.42) { // kayalar (büyütüldü)
      const g = new THREE.Group(); for (let i = 0; i < 3; i++) { const s = new THREE.Mesh(new THREE.DodecahedronGeometry(0.11 + r() * 0.1, 0), M(i % 2 ? 0x9A948A : C.stone)); s.position.set((r() - 0.5) * 0.34, 0.05, (r() - 0.5) * 0.34); s.scale.y = 0.7; g.add(s); }
      put(g, p.x + (r() - 0.5) * 0.7, y, p.z + (r() - 0.5) * 0.7);
    } else if (k < 0.5) { // mantarlar
      const g = new THREE.Group(); for (let i = 0; i < 3; i++) { const x = (r() - 0.5) * 0.22, z = (r() - 0.5) * 0.22; g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.024, 0.07, 6), M(0xF3E4C4)), x, 0.035, z), at(new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 4, 0, 6.28, 0, 1.6), M(i % 2 ? 0xD9573F : 0xC98A4E)), x, 0.07, z)); }
      put(g, p.x + (r() - 0.5) * 0.7, y, p.z + (r() - 0.5) * 0.7);
    } else if (k < 0.55) { // devrik kütük
      const lg = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.55, 7), M(0x8A5A34)); lg.rotation.z = Math.PI / 2; lg.rotation.y = r() * 3; put(lg, p.x + (r() - 0.5) * 0.6, y + 0.07, p.z + (r() - 0.5) * 0.6);
    } else if (k < 0.6 && !t.owned) { // pembe çiçekli ağaç
      const g = new THREE.Group(); g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.4, 6), M(0x7A4E2C)), 0, 0.2, 0), at(new THREE.Mesh(new THREE.IcosahedronGeometry(0.3, 0), M(0xF5B8C6)), 0, 0.55, 0), at(new THREE.Mesh(new THREE.IcosahedronGeometry(0.2, 0), M(0xF9D2DC)), 0.15, 0.48, 0.1));
      put(g, p.x, y, p.z);
    }
  }
  // Patika: çiftlik evinden her kovana belirgin taş basamaklar
  const house = Object.values(view.tiles).find((t) => t.item && t.item.type === 'house');
  if (house) {
    const hp = hexToWorld(house.q, house.r); const hy = topY(house);
    for (const pos of hivePositions) for (let i = 1; i < 6; i++) { const f = i / 6; const st = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.12, 0.03, 7), M(0xB8A67E)); st.receiveShadow = true; G.add(at(st, hp.x + (pos.x - hp.x) * f + (r() - 0.5) * 0.08, Math.max(hy, pos.y) + 0.025, hp.z + (pos.z - hp.z) * f + (r() - 0.5) * 0.08)); }
  }
  return G;
}
