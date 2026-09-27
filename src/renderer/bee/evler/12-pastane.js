// 12 · Pastane (Dükkân)
// pembe çatılı pastane: pembe-beyaz tente, vitrinde pasta katları, önde şemsiyeli masalar
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, sph, cone, grp, at, C, hip, body, awning, hangSign, butterflies } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.76, wall: 0xFFF1F2, roof: 0xE893A8, roofType: 'hip', roofH: 0.3, windows: [-0.25, 0.25], trim: 0xE893A8 }); at(b, -0.06, 0, -0.14); g.add(b);
  const aw = awning(0.8, '#E0626A', '#FFFFFF'); at(aw, -0.06, 0.44, 0.19); g.add(aw);
  g.add(hangSign('🍰', 0.36, 0.5, 0.12, -Math.PI / 2 + 0.3, '#FFE3EA'));
  const cake = grp(cyl(0.07, 0.07, 0.05, C.white, 0, 0.025, 0, 12), cyl(0.05, 0.05, 0.04, 0xF5B8C6, 0, 0.07, 0, 12), cyl(0.032, 0.032, 0.035, C.white, 0, 0.11, 0, 12), sph(0.015, C.red, 0, 0.14, 0, 6)); at(cake, -0.3, 0.13, 0.17); g.add(cake, box(0.2, 0.02, 0.1, C.woodL, -0.3, 0.12, 0.17));
  for (const [x, z] of [[0.1, 0.38], [0.36, 0.3]]) g.add(at(grp(cyl(0.08, 0.08, 0.015, C.white, 0, 0.15, 0, 10), cyl(0.01, 0.01, 0.15, C.iron, 0, 0.075, 0, 5), cyl(0.008, 0.008, 0.28, C.iron, 0, 0.29, 0, 5), cone(0.15, 0.07, 0xF5B8C6, 0, 0.44, 0, 8)), x, 0, z));
  g.add(butterflies(0.2, 0.3, 0.34, [C.pink, C.white]));
  return g; };
