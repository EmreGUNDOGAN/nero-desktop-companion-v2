// 4 · Hacer Nine (Ev)
// köyün en yaşlısı: yosunlu taş ev, sarmaşıklı duvar, kapı önünde hasır tabure ve uyuklayan kedi, kuyu
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, grp, at, C, gable, body, ivy, cat, smoke } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.66, wall: C.stone, roof: 0x6F7F4F, shutters: 0x8A6F5A, chimney: C.stoneD }); at(b, -0.12, 0, -0.14); g.add(b);
  g.add(at(ivy(12, 0.35, 0.4), -0.34, 0.05, 0.145), smoke(-0.01, 0.95, -0.27));
  const well = grp(cyl(0.11, 0.12, 0.13, C.stoneD, 0, 0.065, 0, 10), box(0.02, 0.24, 0.02, C.wood, -0.1, 0.18, 0), box(0.02, 0.24, 0.02, C.wood, 0.1, 0.18, 0), at(gable(0.26, 0.18, 0.08, 0x6F7F4F), 0, 0.3, 0), cyl(0.03, 0.03, 0.05, 0xA9B4BE, 0.03, 0.2, 0, 8)); at(well, 0.34, 0, 0.18); g.add(well);
  g.add(at(grp(cyl(0.045, 0.045, 0.02, 0xD9C08A, 0, 0.1, 0, 8), cyl(0.008, 0.008, 0.1, C.wood, 0.03, 0.05, 0.03, 4), cyl(0.008, 0.008, 0.1, C.wood, -0.03, 0.05, -0.03, 4)), 0.05, 0, 0.3));
  const k = cat(0x3A3A3A); at(k, 0.12, 0, 0.32, 2.2); g.add(k);
  g.userData.animate = (t) => { k.children[0].scale.y = 0.9 + Math.sin(t * 1.2) * 0.05; };
  return g; };
