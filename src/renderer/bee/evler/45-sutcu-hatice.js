// 45 · Sütçü Hatice (Ev)
// çiftlik evi, ahır kapısı eki, süt güğümleri, bahçede inek, çitte kedi
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, grp, at, C, gable, body } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.56, wall: 0xFFF6E6, roof: 0xB95A42, windows: [0.14] }); at(b, -0.22, 0, -0.16); g.add(b);
  const barn = grp(box(0.32, 0.32, 0.32, 0xB95A42, 0, 0.16, 0), at(gable(0.32, 0.32, 0.16, 0x7A2E22), 0, 0.32, 0), box(0.16, 0.2, 0.02, C.white, 0, 0.1, 0.165), box(0.16, 0.012, 0.022, 0xB95A42, 0, 0.1, 0.166)); barn.children[3].rotation.z = 0.9; at(barn, 0.3, 0, -0.12); g.add(barn);
  [0, 0.08, 0.04].forEach((x, i) => g.add(cyl(0.03, 0.035, 0.12, 0xC9CED6, -0.1 + x, 0.06, 0.32 + (i === 2 ? 0.06 : 0), 8)));
  const cow = grp(box(0.2, 0.1, 0.09, C.white, 0, 0.12, 0), box(0.06, 0.06, 0.07, C.white, 0.12, 0.15, 0), box(0.04, 0.02, 0.05, 0xF5B8C6, 0.16, 0.13, 0), box(0.06, 0.05, 0.005, 0x3A3A3A, -0.03, 0.14, 0.047), ...[[-0.07, -0.03], [0.07, 0.03], [-0.07, 0.03], [0.07, -0.03]].map(([x, z]) => box(0.02, 0.08, 0.02, C.white, x, 0.04, z))); at(cow, 0.3, 0, 0.3, -0.4); g.add(cow);
  g.userData.animate = (t) => { cow.children[1].rotation.z = Math.sin(t * 0.9) * 0.12; };
  return g; };
