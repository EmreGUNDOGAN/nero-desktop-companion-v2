// 37 · Dondurmacı (Dükkân)
// açık mavi tenteli dükkân, dev külah maketi, seyyar dondurma arabası (şemsiyeli), renkli sandalyeler
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mesh, box, cyl, sph, cone, grp, at, C, body, awning, butterflies } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.7, wall: 0xFFF6F2, roof: 0x6FA3D9, windows: [-0.22, 0.22] }); at(b, -0.1, 0, -0.14); g.add(b);
  const aw = awning(0.74, '#8FC8EC', '#FFFFFF'); at(aw, -0.1, 0.44, 0.19); g.add(aw);
  const cone1 = grp(cone(0.07, 0.2, 0xE0A65A, 0, 0.1, 0, 8).rotateX(Math.PI), sph(0.08, 0xF5B8C6, 0, 0.23, 0, 8), sph(0.06, 0xFFF1D6, 0, 0.31, 0, 8), sph(0.015, C.red, 0, 0.37, 0, 6)); at(cone1, -0.44, 0, 0.26); g.add(cone1, cyl(0.06, 0.07, 0.04, C.stone, -0.44, 0.0, 0.26, 8));
  const cart = grp(box(0.22, 0.14, 0.12, C.white, 0, 0.12, 0), box(0.22, 0.03, 0.12, 0x8FC8EC, 0, 0.2, 0), mesh(new THREE.TorusGeometry(0.04, 0.01, 5, 10), C.iron, -0.07, 0.04, 0.07), mesh(new THREE.TorusGeometry(0.04, 0.01, 5, 10), C.iron, 0.07, 0.04, 0.07), cyl(0.006, 0.006, 0.3, C.iron, 0, 0.36, 0, 4), cone(0.16, 0.07, 0xF5B8C6, 0, 0.52, 0, 8)); at(cart, 0.22, 0, 0.34, -0.3); g.add(cart);
  [C.yellow, C.pink].forEach((c, i) => g.add(at(grp(cyl(0.04, 0.04, 0.012, c, 0, 0.09, 0, 8), cyl(0.006, 0.006, 0.09, C.iron, 0, 0.045, 0, 4)), -0.12 + i * 0.12, 0, 0.42)));
  g.add(butterflies(0.2, 0.36, 0.34, [C.pink, C.yellow]));
  return g; };
