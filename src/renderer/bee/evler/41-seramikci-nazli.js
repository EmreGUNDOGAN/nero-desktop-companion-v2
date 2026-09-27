// 41 · Seramikçi Nazlı (Ev)
// kerpiç tonlu atölye, yanda kubbeli çömlek fırını, dönen çömlek çarkı, sıra sıra vazolar
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, sph, grp, at, C, body, smoke } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.62, wall: 0xE8C9A8, roof: 0xC9763A, roofType: 'flat', windows: [-0.16], trim: 0xB9774A }); at(b, -0.16, 0, -0.14); g.add(b);
  const kiln = grp(sph(0.17, 0xB9774A, 0, 0.0, 0, 10), box(0.08, 0.07, 0.04, 0x3A2A1A, 0, 0.05, 0.15), box(0.05, 0.04, 0.01, VM.lamp, 0, 0.05, 0.17)); kiln.children[0].scale.y = 0.9; at(kiln, 0.34, 0, -0.14); g.add(kiln, smoke(0.34, 0.2, -0.16));
  const wheelTop = cyl(0.06, 0.06, 0.012, 0x8A5A34, 0, 0.12, 0, 12); const pot2 = cyl(0.03, 0.04, 0.06, 0xC98A5A, 0, 0.16, 0, 10); const wh = grp(cyl(0.02, 0.03, 0.11, C.woodD, 0, 0.055, 0, 8), wheelTop, pot2); at(wh, 0.14, 0, 0.32); g.add(wh);
  [0xC98A5A, 0x6FA3D9, 0xE0A06A, 0x9C7BD6, 0x7FBF62].forEach((c, i) => g.add(cyl(0.028 + (i % 2) * 0.008, 0.036, 0.08 + (i % 3) * 0.03, c, -0.44 + i * 0.07, 0.045, 0.34, 8)));
  g.userData.animate = (t) => { wheelTop.rotation.y = t * 6; pot2.rotation.y = t * 6; };
  return g; };
