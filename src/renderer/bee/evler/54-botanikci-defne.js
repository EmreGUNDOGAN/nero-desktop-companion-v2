// 54 · Botanikçi Defne (Ev)
// sarmaşıkla kaplı ev, yuvarlak cam gözlem serası (kubbe), saksılarda nadir bitkiler, büyüteç masası
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mat, mesh, cyl, sph, cone, grp, at, C, body, ivy, butterflies } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.6, wall: 0xF1EADB, roof: 0x5F7A4A, windows: [-0.16] }); at(b, -0.18, 0, -0.16); g.add(b);
  g.add(at(ivy(18, 0.6, 0.5), -0.18, 0.05, 0.13), at(ivy(12, 0.55, 0.2), -0.18, 0.55, -0.04));
  const dome = grp(sph(0.2, mat(0xCFEBEF, { transparent: true, opacity: 0.45, roughness: 0.15 }), 0, 0, 0, 12), cyl(0.2, 0.2, 0.04, C.white, 0, 0.02, 0, 12), sph(0.03, VM.lamp, 0, 0.1, 0, 8)); dome.children[0].scale.y = 0.9; for (let i = 0; i < 5; i++) dome.add(sph(0.04, [C.leaf, C.leafL, 0x3F8A57][i % 3], -0.08 + i * 0.04, 0.06, (i % 2) * 0.05 - 0.02, 5)); dome.add(sph(0.025, 0xE0626A, 0.02, 0.12, 0, 6)); at(dome, 0.3, 0, -0.12); g.add(dome);
  [[0x3F8A57, -0.4], [0x7FBF62, -0.3], [0x9C7BD6, -0.2]].forEach(([c, x]) => g.add(at(grp(cyl(0.035, 0.028, 0.05, 0xB9774A, 0, 0.025, 0, 6), cone(0.035, 0.1, c, 0, 0.1, 0, 5)), x, 0, 0.34)));
  g.add(at(grp(cyl(0.08, 0.08, 0.015, C.white, 0, 0.15, 0, 10), cyl(0.01, 0.01, 0.15, C.iron, 0, 0.075, 0, 5), mesh(new THREE.TorusGeometry(0.025, 0.006, 4, 10), C.honey, 0.02, 0.17, 0).rotateX(Math.PI / 2)), 0.14, 0, 0.36), butterflies(0.3, 0.3, 0.1, [C.teal, C.lilac]));
  return g; };
