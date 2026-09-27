// 29 · Hemşire Canan (Ev)
// açık mavi ev, pencerede papatyalar, kapıda ilk yardım çantası, bahçede çamaşırda beyaz önlükler
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, grp, at, C, body, windowBox, lamppost } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.62, wall: 0xDDEBF5, roof: 0x6F8FB0, shutters: C.white }); at(b, -0.16, 0, -0.14); g.add(b);
  g.add(windowBox(-0.34, 0.23, 0.155, [C.white, C.yellow, C.white, C.yellow]), windowBox(0.02, 0.23, 0.155, [C.white, C.yellow, C.white, C.yellow]));
  g.add(at(grp(box(0.1, 0.07, 0.06, C.white, 0, 0.035, 0), box(0.05, 0.015, 0.005, 0xD9573F, 0, 0.04, 0.031), box(0.015, 0.05, 0.005, 0xD9573F, 0, 0.04, 0.031)), 0.06, 0, 0.3));
  g.add(cyl(0.01, 0.01, 0.34, C.wood, 0.28, 0.17, 0.36, 5), cyl(0.01, 0.01, 0.34, C.wood, 0.28, 0.17, -0.04, 5)); const line = cyl(0.003, 0.003, 0.4, C.ink, 0.28, 0.32, 0.16, 3); line.rotation.x = Math.PI / 2; g.add(line);
  const coats = [0, 1].map((i) => box(0.01, 0.13, 0.09, C.white, 0.28, 0.25, 0.08 + i * 0.16)); coats.forEach((c) => g.add(c));
  g.add(lamppost(-0.44, 0.3));
  g.userData.animate = (t) => coats.forEach((c, i) => { c.rotation.z = Math.sin(t * 2 + i) * 0.2; });
  return g; };
