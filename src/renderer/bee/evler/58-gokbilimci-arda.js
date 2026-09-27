// 58 · Gökbilimci Arda (Ev)
// gözlemevi kubbeli ev (dönen kubbe, açık yarık), teleskop, yıldız haritası bayrağı
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, sph, grp, at, C, body } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.6, wall: 0xE8EAF2, roof: 0x3E4E78, roofType: 'flat', windows: [-0.16] }); at(b, -0.16, 0, -0.14); g.add(b);
  const obs = grp(cyl(0.22, 0.22, 0.2, 0xE8EAF2, 0, 0.1, 0, 14)); const dome = grp(sph(0.22, 0xB9C0D6, 0, 0, 0, 14), box(0.08, 0.26, 0.2, 0x1A1F33, 0, 0.08, 0.12)); dome.children[0].scale.y = 0.85; dome.position.y = 0.2; obs.add(dome);
  const tele = cyl(0.03, 0.04, 0.26, 0x3F4E78, 0, 0.28, 0.12, 8); tele.rotation.x = -0.7; obs.add(tele); at(obs, 0.28, 0, -0.1); g.add(obs);
  g.add(at(grp(box(0.2, 0.14, 0.005, 0x1A1F33, 0, 0.26, 0), box(0.012, 0.34, 0.012, C.wood, -0.1, 0.17, 0), ...[0, 1, 2, 3, 4].map((i) => sph(0.008, VM.lamp, -0.07 + i * 0.035, 0.24 + (i % 2) * 0.04, 0.004, 4))), -0.36, 0, 0.32));
  g.userData.animate = (t) => { dome.rotation.y = t * 0.15; };
  return g; };
