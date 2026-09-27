// 46 · Dokumacı Sevim (Ev)
// iki katlı ev, balkondan sarkan kilimler (dalgalanan), bahçede dokuma tezgâhı, yün yumakları
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, sph, grp, at, C, body, balcony } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.64, h: 0.7, wall: 0xF1E3C8, roof: 0x9A4A3A, shutters: 0x3F7FBF }); at(b, -0.14, 0, -0.14); g.add(b);
  g.add(at(balcony(0.5), -0.14, 0.44, 0.14));
  const rugs = [[0xC94A3A, -0.28], [0x3F7FBF, -0.14], [0xE9B63E, 0.0]].map(([c, x]) => { const r = grp(box(0.12, 0.24, 0.008, c, 0, -0.12, 0), box(0.12, 0.03, 0.01, C.white, 0, -0.08, 0.001), box(0.12, 0.03, 0.01, C.white, 0, -0.18, 0.001)); at(r, x, 0.5, 0.26); g.add(r); return r; });
  const loom = grp(box(0.02, 0.26, 0.02, C.wood, -0.1, 0.13, 0), box(0.02, 0.26, 0.02, C.wood, 0.1, 0.13, 0), box(0.22, 0.02, 0.02, C.wood, 0, 0.26, 0), box(0.18, 0.16, 0.005, 0xE0626A, 0, 0.16, 0)); at(loom, 0.3, 0, 0.3, -0.5); g.add(loom);
  [C.red, C.blue, C.yellow].forEach((c, i) => g.add(sph(0.03, c, 0.08 + i * 0.07, 0.03, 0.4, 7)));
  g.userData.animate = (t) => rugs.forEach((r, i) => { r.rotation.x = Math.sin(t * 1.6 + i) * 0.08; });
  return g; };
