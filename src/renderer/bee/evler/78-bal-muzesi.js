// 78 · Bal Müzesi (Bina)
// köyün gururu: petek kubbeli büyük bina, sütunlu giriş, önde dev altın arı heykeli, bayraklar, çiçek tarhları
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mat, mesh, box, cyl, sph, grp, at, C, butterflies, flag } from './kit.js';

export default () => { const g = new THREE.Group();
  g.add(box(1.0, 0.5, 0.6, 0xFFF3D6, 0, 0.25, -0.12), box(1.04, 0.05, 0.64, 0xE9B63E, 0, 0.52, -0.12));
  const dome = mesh(new THREE.IcosahedronGeometry(0.34, 1), mat(C.honey, { flatShading: true, roughness: 0.5 }), 0, 0.56, -0.12); dome.scale.y = 0.75; g.add(dome, sph(0.05, VM.lamp, 0, 0.84, -0.12, 8));
  for (let i = 0; i < 5; i++) g.add(cyl(0.03, 0.034, 0.44, C.white, -0.36 + i * 0.18, 0.22, 0.24, 8));
  g.add(box(0.94, 0.06, 0.12, C.white, 0, 0.47, 0.24), box(1.0, 0.03, 0.18, C.stoneD, 0, 0.015, 0.26), box(0.16, 0.28, 0.03, C.woodD, 0, 0.14, 0.185), box(0.12, 0.14, 0.03, VM.glass, -0.3, 0.3, 0.185), box(0.12, 0.14, 0.03, VM.glass, 0.3, 0.3, 0.185));
  const bee = grp(sph(0.08, mat(C.honey, { metalness: 0.4, roughness: 0.35 }), 0, 0, 0, 10), box(0.035, 0.16, 0.16, C.ink, 0, 0, 0), sph(0.05, C.white, -0.02, 0.08, 0.07, 6), sph(0.05, C.white, -0.02, 0.08, -0.07, 6)); bee.children[0].scale.set(1.35, 1, 1); at(bee, 0, 0.3, 0.46); g.add(bee, cyl(0.1, 0.12, 0.18, C.stone, 0, 0.09, 0.46, 10));
  g.add(flag(-0.54, 0, 0.3, C.honey), flag(0.54, 0, 0.3, C.honey));
  for (const x of [-0.36, 0.36]) { const bed = grp(box(0.24, 0.03, 0.1, 0x6B4428, 0, 0.015, 0)); for (let i = 0; i < 4; i++) bed.add(sph(0.025, [C.yellow, C.lilac, C.pink, C.white][i], -0.08 + i * 0.055, 0.045, 0, 6)); at(bed, x, 0, 0.44); g.add(bed); }
  g.add(butterflies(0, 0.5, 0.42, [C.yellow, C.pink]));
  g.userData.animate = (t) => { bee.children[2].rotation.x = Math.sin(t * 18) * 0.35; bee.children[3].rotation.x = -Math.sin(t * 18) * 0.35; bee.position.y = 0.3 + Math.sin(t * 1.6) * 0.012; };
  return g; };
