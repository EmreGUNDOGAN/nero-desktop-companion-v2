// 14 · Bal Dükkânı (Dükkân)
// altın sarısı çatı, petek desenli cephe, vitrinde kavanoz rafı, kapıda dev arı, çatıda arı kovanı tabelası
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mat, mesh, box, cyl, sph, grp, at, C, body, hangSign } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.74, wall: 0xFFF3D6, roof: 0xE9B63E, windows: [0.24], trim: 0xC98612 }); at(b, -0.08, 0, -0.14); g.add(b);
  for (let i = 0; i < 6; i++) g.add(mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.006, 6), 0xF2D26A, -0.36 + (i % 3) * 0.055, 0.34 + Math.floor(i / 3) * 0.05, 0.145).rotateX(Math.PI / 2));
  g.add(hangSign('🍯', 0.32, 0.5, 0.12, -Math.PI / 2 + 0.3, '#FFE08A'));
  const shelf = grp(box(0.5, 0.04, 0.13, C.wood, 0, 0.18, 0)); for (let i = 0; i < 6; i++) shelf.add(cyl(0.03, 0.03, 0.07, mat(C.honey, { transparent: true, opacity: 0.9, roughness: 0.3 }), -0.2 + i * 0.08, 0.235, 0, 8), cyl(0.032, 0.032, 0.015, C.woodL, -0.2 + i * 0.08, 0.275, 0, 8)); at(shelf, -0.08, 0, 0.34); g.add(shelf);
  const bee = grp(sph(0.06, C.honey, 0, 0, 0, 8), box(0.025, 0.12, 0.12, C.ink, 0, 0, 0), sph(0.035, C.white, -0.02, 0.06, 0.05, 6), sph(0.035, C.white, -0.02, 0.06, -0.05, 6)); bee.children[0].scale.set(1.3, 1, 1); at(bee, 0.38, 0.14, 0.3); g.add(bee, cyl(0.07, 0.08, 0.08, C.stone, 0.38, 0.04, 0.3, 8));
  g.userData.animate = (t) => { bee.children[2].rotation.x = Math.sin(t * 20) * 0.4; bee.children[3].rotation.x = -Math.sin(t * 20) * 0.4; };
  return g; };
