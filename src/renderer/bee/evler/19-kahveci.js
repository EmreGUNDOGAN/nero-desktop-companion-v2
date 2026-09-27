// 19 · Kahveci (Dükkân)
// kahverengi tenteli köşe kahvesi, önde tavla masası, taburelerde fincanlar, cezve dumanı
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, grp, at, C, body, awning, hangSign, bench, smoke } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.72, wall: 0xF3E4C4, roof: 0x6E4526, windows: [-0.22, 0.22], chimney: C.brick }); at(b, -0.08, 0, -0.14); g.add(b);
  const aw = awning(0.76, '#8A5A34', '#F3E4C4'); at(aw, -0.08, 0.44, 0.19); g.add(aw);
  g.add(hangSign('☕', 0.3, 0.5, 0.12, -Math.PI / 2 + 0.3, '#F3E4C4'));
  const tbl = grp(box(0.22, 0.02, 0.16, C.wood, 0, 0.15, 0), box(0.018, 0.15, 0.018, C.woodD, -0.09, 0.075, -0.06), box(0.018, 0.15, 0.018, C.woodD, 0.09, 0.075, 0.06), box(0.16, 0.012, 0.1, 0xE8C86A, 0, 0.165, 0));
  for (const x of [-0.16, 0.16]) tbl.add(cyl(0.045, 0.045, 0.1, C.woodL, x, 0.05, 0, 8), cyl(0.018, 0.014, 0.03, C.white, x * 0.5, 0.18, 0.04, 8)); at(tbl, -0.1, 0, 0.36); g.add(tbl);
  g.add(at(grp(cyl(0.02, 0.03, 0.05, 0xC9763A, 0, 0.025, 0, 8), cyl(0.004, 0.004, 0.06, C.wood, 0.04, 0.05, 0, 4)), 0.3, 0.16, 0.36), smoke(0.3, 0.24, 0.36), bench(), smoke(0.13, 0.95, -0.24));
  g.children[g.children.length - 2].position.set(0.3, 0, 0.3);
  return g; };
