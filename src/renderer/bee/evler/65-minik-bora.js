// 65 · Minik Bora (Ev)
// ağaç ev: kalın ağaç üstünde kulübe, ip merdiven, salıncak, ağaçta sincap
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mesh, box, cyl, sph, grp, at, C, gable, body } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.5, d: 0.44, h: 0.4, wall: 0xFFF1D6, roof: 0xF2C94C, roofH: 0.26, windows: [0.12], shutters: 0xE893A8, side: false }); at(b, -0.24, 0, -0.2); g.add(b);
  g.add(cyl(0.08, 0.11, 0.7, C.trunk, 0.24, 0.35, -0.08, 8), mesh(new THREE.IcosahedronGeometry(0.34, 0), C.leaf, 0.24, 1.12, -0.08), mesh(new THREE.IcosahedronGeometry(0.22, 0), C.leafL, 0.4, 1.0, 0.04));
  const th = grp(box(0.3, 0.02, 0.3, C.woodL, 0, 0, 0), box(0.24, 0.18, 0.2, 0xC9A06A, 0, 0.1, 0), at(gable(0.24, 0.2, 0.12, 0xE0626A), 0, 0.19, 0), box(0.07, 0.07, 0.02, VM.glass, 0, 0.1, 0.101)); at(th, 0.24, 0.72, -0.08); g.add(th);
  for (let i = 0; i < 6; i++) g.add(box(0.1, 0.01, 0.01, C.woodL, 0.36, 0.1 + i * 0.1, 0.12)); g.add(box(0.004, 0.66, 0.004, C.ink, 0.31, 0.36, 0.12), box(0.004, 0.66, 0.004, C.ink, 0.41, 0.36, 0.12));
  const sq = grp(sph(0.025, 0xB9774A, 0, 0, 0, 6), sph(0.03, 0xC98A5A, -0.03, 0.02, 0, 6)); at(sq, 0.15, 0.55, -0.02); g.add(sq);
  g.userData.animate = (t) => { sq.position.y = 0.3 + ((t * 0.3) % 1) * 0.35; };
  return g; };
