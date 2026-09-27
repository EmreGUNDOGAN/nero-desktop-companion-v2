// 17 · Ressam Deniz (Ev)
// mor kapılı atölye ev, çatıda büyük tavan penceresi, bahçede şövale, boya lekeli basamak
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, sph, grp, at, C, body, butterflies } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.64, wall: 0xF6F1E7, roof: 0x6F5FA8, door: 0x9C7BD6, shutters: 0xF2C94C }); at(b, -0.14, 0, -0.14); g.add(b);
  const sky = box(0.18, 0.02, 0.2, VM.glass, -0.14, 0.72, 0.02); sky.rotation.x = -0.64; g.add(sky);
  const easel = grp(box(0.015, 0.34, 0.015, C.wood, -0.05, 0.16, 0), box(0.015, 0.34, 0.015, C.wood, 0.05, 0.16, 0), box(0.18, 0.14, 0.015, C.white, 0, 0.24, 0.02), box(0.12, 0.05, 0.016, C.leafL, 0, 0.21, 0.025), sph(0.02, C.honey, 0.05, 0.27, 0.03, 6), box(0.08, 0.03, 0.016, 0x6FA3D9, -0.03, 0.27, 0.025)); easel.children[0].rotation.z = 0.15; easel.children[1].rotation.z = -0.15; at(easel, 0.32, 0, 0.26, -0.5); g.add(easel);
  [C.red, C.honey, C.blue, C.lilac].forEach((c, i) => g.add(cyl(0.02, 0.02, 0.003, c, -0.2 + i * 0.05, 0.004, 0.24 + (i % 2) * 0.03, 8)));
  g.add(at(grp(cyl(0.03, 0.03, 0.05, 0xA9B4BE, 0, 0.025, 0, 8), cyl(0.004, 0.004, 0.12, C.woodL, 0.01, 0.08, 0, 4), cyl(0.004, 0.004, 0.12, C.woodL, -0.01, 0.08, 0.01, 4)), 0.14, 0, 0.36), butterflies(0.3, 0.4, 0.24, [C.lilac, C.honey]));
  return g; };
