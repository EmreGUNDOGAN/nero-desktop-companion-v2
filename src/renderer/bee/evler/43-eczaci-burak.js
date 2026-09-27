// 43 · Eczacı Burak (Ev)
// yeşil panjurlu ev, pencerede şifalı bitki kavanozları, çatıda kurutulan otlar, ot tarhı
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mat, box, cyl, sph, cone, grp, at, C, body, butterflies } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.62, wall: 0xF6F1E7, roof: 0x7A6F5A, shutters: 0x4F9A5A }); at(b, -0.16, 0, -0.14); g.add(b);
  [0x7FBF62, 0xC9A06A, 0x9C7BD6, 0xE0A65A].forEach((c, i) => g.add(cyl(0.022, 0.022, 0.05, mat(c, { transparent: true, opacity: 0.85 }), -0.4 + i * 0.05, 0.3, 0.16, 8)));
  g.add(box(0.2, 0.012, 0.03, C.woodL, -0.33, 0.27, 0.16));
  const rack = grp(box(0.3, 0.012, 0.012, C.wood, 0, 0.12, 0)); for (let i = 0; i < 5; i++) rack.add(cone(0.02, 0.07, [0x7FBF62, 0x9FBF62, C.lilac][i % 3], -0.12 + i * 0.06, 0.08, 0, 5).rotateX(Math.PI)); at(rack, 0.14, 0.4, 0.2); g.add(rack, box(0.012, 0.52, 0.012, C.wood, -0.01, 0.26, 0.2), box(0.012, 0.52, 0.012, C.wood, 0.29, 0.26, 0.2));
  const bed = grp(box(0.28, 0.03, 0.14, 0x6B4428, 0, 0.015, 0)); for (let i = 0; i < 6; i++) bed.add(sph(0.025, [0x7FBF62, 0x9FBF62, C.lilac][i % 3], -0.1 + (i % 3) * 0.1, 0.04, i < 3 ? -0.03 : 0.03, 5)); at(bed, -0.22, 0, 0.38); g.add(bed, butterflies(-0.2, 0.3, 0.36, [C.lilac, C.white]));
  return g; };
