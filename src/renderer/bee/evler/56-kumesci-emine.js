// 56 · Kümesçi Emine (Ev)
// çiftlik evi, kümes (tahta rampalı), dolaşan tavuklar ve civcivler, yem kovası
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, sph, cone, grp, at, C, gable, body } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.56, wall: 0xFFF6E6, roof: 0xD9743A, windows: [-0.14] }); at(b, -0.22, 0, -0.16); g.add(b);
  const coop = grp(box(0.26, 0.16, 0.2, 0xC9A06A, 0, 0.14, 0), at(gable(0.26, 0.2, 0.1, 0xD9743A), 0, 0.22, 0), ...[[-0.11, -0.08], [0.11, -0.08], [-0.11, 0.08], [0.11, 0.08]].map(([x, z]) => box(0.02, 0.07, 0.02, C.wood, x, 0.03, z)), box(0.06, 0.012, 0.16, C.woodL, 0.14, 0.04, 0.12)); coop.children[coop.children.length - 1].rotation.x = 0.45; at(coop, 0.3, 0, -0.1); g.add(coop);
  const hens = [[0.1, 0.3], [0.3, 0.34], [-0.06, 0.38]].map(([x, z]) => { const h = grp(sph(0.035, C.white, 0, 0.04, 0, 6), sph(0.02, C.white, 0.03, 0.07, 0, 6), cone(0.008, 0.016, C.orange, 0.052, 0.07, 0, 4).rotateZ(-Math.PI / 2), sph(0.01, C.red, 0.03, 0.09, 0, 4)); at(h, x, 0, z); g.add(h); return h; });
  const chicks = [0, 1, 2].map((i) => { const c = sph(0.016, C.yellow, 0.2 + i * 0.04, 0.016, 0.42, 5); g.add(c); return c; });
  g.add(cyl(0.04, 0.03, 0.05, 0xA9B4BE, -0.3, 0.025, 0.36, 8));
  g.userData.animate = (t) => { hens.forEach((h, i) => { h.rotation.y = Math.sin(t * 0.6 + i * 2) * 1.5; h.children[1].position.y = 0.07 - Math.max(0, Math.sin(t * 3 + i)) * 0.02; }); chicks.forEach((c, i) => { c.position.x = 0.2 + i * 0.04 + Math.sin(t * 2 + i) * 0.03; }); };
  return g; };
