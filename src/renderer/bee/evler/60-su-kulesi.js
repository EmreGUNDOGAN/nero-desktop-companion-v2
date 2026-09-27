// 60 · Su Kulesi (Bina)
// ahşap ayaklı depo, köy adı yazılı gövde, merdiven, su damlaları, kuşlar
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mat, box, cyl, sph, cone, C, birds } from './kit.js';

export default () => { const g = new THREE.Group();
  for (const [x, z] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) g.add(box(0.045, 0.82, 0.045, C.wood, x, 0.41, z));
  for (const y of [0.3, 0.6]) g.add(box(0.44, 0.03, 0.03, C.wood, 0, y, 0.2), box(0.44, 0.03, 0.03, C.wood, 0, y, -0.2), box(0.03, 0.03, 0.44, C.wood, 0.2, y, 0), box(0.03, 0.03, 0.44, C.wood, -0.2, y, 0));
  g.add(cyl(0.3, 0.3, 0.38, 0x9A6A3A, 0, 1.0, 0, 14), cone(0.34, 0.2, 0xD9743A, 0, 1.29, 0, 14), box(0.26, 0.08, 0.02, C.white, 0, 1.0, 0.3), sph(0.03, VM.lamp, 0, 1.4, 0, 6));
  for (let i = 0; i < 6; i++) g.add(box(0.1, 0.015, 0.015, C.woodL, 0.24, 0.1 + i * 0.12, 0.24));
  const drop = sph(0.015, mat(0x7FC8E0, { transparent: true, opacity: 0.8 }), -0.1, 0.8, 0.28, 5); g.add(drop, birds(0, 1.5, 0));
  g.userData.animate = (t) => { const k = (t * 0.6) % 1; drop.position.y = 0.8 - k * 0.8; drop.visible = k < 0.95; };
  return g; };
