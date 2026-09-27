// 1 · Ayşe Teyze (Ev)
// emekli terzi: krem ev, bordo çatı, yan tarafta cam dikiş odası (bay window), çamaşır ipinde renkli kumaşlar, pencere saksıları
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, grp, at, C, body, windowBox, cat, smoke } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.66, wall: 0xF5E6CC, roof: 0x9E3B3B, shutters: 0x6FA35E, chimney: C.brick }); at(b, -0.1, 0, -0.12); g.add(b);
  const bay = grp(box(0.2, 0.22, 0.12, VM.glass, 0, 0.21, 0), box(0.24, 0.03, 0.15, C.white, 0, 0.335, 0), box(0.24, 0.03, 0.15, C.white, 0, 0.09, 0)); at(bay, 0.3, 0, 0.02); g.add(bay);
  g.add(windowBox(-0.3, 0.25, 0.17), windowBox(0.1, 0.25, 0.17, [C.pink, C.white, C.pink, C.yellow]));
  g.add(cyl(0.012, 0.012, 0.4, C.wood, -0.42, 0.2, 0.36, 5), cyl(0.012, 0.012, 0.4, C.wood, 0.36, 0.2, 0.36, 5), at(cyl(0.003, 0.003, 0.78, C.ink, 0, 0, 0, 3), -0.03, 0.38, 0.36));
  g.children[g.children.length - 1].rotation.z = Math.PI / 2;
  const cloths = [C.red, C.blue, C.yellow, C.lilac].map((c, i) => box(0.1, 0.12, 0.01, c, -0.3 + i * 0.17, 0.31, 0.36)); cloths.forEach((c) => g.add(c));
  g.add(at(cat(0xB0B0B0), -0.34, 0, 0.2, 0.6), smoke(0.07, 0.95, -0.25));
  g.userData.animate = (t) => cloths.forEach((c, i) => { c.rotation.x = Math.sin(t * 2 + i) * 0.25; });
  return g; };
