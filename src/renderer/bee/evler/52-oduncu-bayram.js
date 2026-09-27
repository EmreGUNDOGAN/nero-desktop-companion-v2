// 52 · Oduncu Bayram (Ev)
// kütük ev (yatay kütük duvarlar), odun yığını, kütüğe saplı balta, çam ağaçları
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, cone, grp, at, C, body, smoke, birds } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.6, wall: 0x9A6A3A, roof: 0x4A3A22, windows: [0.14], shutters: 0x6E4526, chimney: C.stoneD }); at(b, -0.18, 0, -0.14); g.add(b);
  for (let i = 0; i < 7; i++) { const l = cyl(0.035, 0.035, 0.62, 0x8A5A34, 0, 0, 0, 6); l.rotation.z = Math.PI / 2; at(l, -0.18, 0.035 + i * 0.068, 0.14); g.add(l); }
  const pile = grp(); for (let i = 0; i < 9; i++) { const l = cyl(0.035, 0.035, 0.22, 0xA67A4A, 0, 0, 0, 6); l.rotation.x = Math.PI / 2; at(l, -0.08 + (i % 3) * 0.075, 0.035 + Math.floor(i / 3) * 0.065, 0); pile.add(l); } at(pile, 0.3, 0, 0.0); g.add(pile);
  const stump = cyl(0.07, 0.08, 0.1, 0x8A5A34, 0.14, 0.05, 0.34, 8); const axe = grp(box(0.014, 0.16, 0.014, C.wood, 0, 0.08, 0), box(0.06, 0.04, 0.012, 0xB0B0B0, 0.025, 0.15, 0)); axe.rotation.z = 0.5; at(axe, 0.14, 0.1, 0.34); g.add(stump, axe);
  [[-0.46, 0.2], [0.46, -0.3]].forEach(([x, z]) => g.add(at(grp(cyl(0.03, 0.04, 0.16, C.trunk, 0, 0.08, 0, 5), cone(0.18, 0.34, 0x3F8A57, 0, 0.32, 0, 6), cone(0.13, 0.26, 0x4F9A66, 0, 0.47, 0, 6)), x, 0, z)));
  g.add(smoke(0.03, 0.92, -0.25), birds(0.2, 1.0, 0));
  return g; };
