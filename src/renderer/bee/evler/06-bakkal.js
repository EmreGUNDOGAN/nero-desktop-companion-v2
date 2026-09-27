// 6 · Bakkal (Dükkân)
// yeşil tenteli köşe dükkânı, önde meyve-sebze tezgâhı, kasalar, tartı, kapıda zil
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, grp, at, C, hip, body, awning, hangSign, crate, butterflies } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.76, wall: 0xFFF6E0, roof: 0x4F8A5A, roofType: 'hip', roofH: 0.28, windows: [-0.24, 0.24], trim: 0x4F8A5A }); at(b, -0.06, 0, -0.14); g.add(b);
  const aw = awning(0.8, '#4F9A5A', '#FFFFFF'); at(aw, -0.06, 0.44, 0.19); g.add(aw);
  g.add(hangSign('🛒', 0.34, 0.5, 0.12, -Math.PI / 2 + 0.3, '#E6F4E0'));
  const stall = grp(box(0.46, 0.12, 0.14, C.woodL, 0, 0.06, 0)); [[C.red, C.red, C.red], [C.orange, C.orange, C.orange], [C.leafL, C.leafL, C.leaf], [C.yellow, C.yellow, C.yellow]].forEach((f, i) => stall.add(at(crate(f), -0.17 + i * 0.115, 0.12, 0)));
  at(stall, -0.06, 0, 0.36); g.add(stall);
  g.add(at(grp(cyl(0.04, 0.05, 0.02, C.iron, 0, 0.13, 0, 8), cyl(0.01, 0.01, 0.12, C.iron, 0, 0.06, 0, 5)), 0.28, 0, 0.36));
  g.add(butterflies(-0.06, 0.34, 0.36, [C.yellow, C.white]));
  return g; };
