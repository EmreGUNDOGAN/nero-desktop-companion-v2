// 23 · Terzi Gülsüm (Ev)
// pembe panjurlu dükkân-ev, vitrinde terzi mankeni, kumaş topları, makas tabelası
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, sph, grp, at, C, body, windowBox, hangSign, butterflies } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.66, wall: 0xFFF6F2, roof: 0xB95A42, shutters: 0xE893A8, windows: [0.2] }); at(b, -0.12, 0, -0.14); g.add(b);
  g.add(box(0.22, 0.2, 0.03, VM.glass, -0.3, 0.18, 0.145));
  const dummy = grp(cyl(0.01, 0.01, 0.12, C.wood, 0, 0.06, 0, 5), cyl(0.04, 0.05, 0.1, 0xE8C8B8, 0, 0.16, 0, 8), sph(0.03, C.wood, 0, 0.22, 0, 6)); at(dummy, -0.3, 0.06, 0.12); g.add(dummy);
  [C.red, C.blue, C.yellow, C.lilac].forEach((c, i) => { const r = cyl(0.03, 0.03, 0.15, c, -0.12 + i * 0.07, 0.03, 0.36, 8); r.rotation.z = Math.PI / 2; g.add(r); });
  g.add(hangSign('✂️', 0.24, 0.5, 0.11, -Math.PI / 2 + 0.3, '#FDE8EE'), windowBox(0.08, 0.23, 0.155, [C.pink, C.white, C.pink, C.white]));
  g.add(butterflies(-0.1, 0.34, 0.36, [C.pink, C.lilac]));
  return g; };
