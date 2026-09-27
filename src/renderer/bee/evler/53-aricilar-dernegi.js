// 53 · Arıcılar Derneği (Bina)
// altıgen petek binası, petek pencereler, önde dev arı heykeli, kovan sergisi, bayrak dizisi
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mesh, box, cyl, sph, cone, grp, at, C } from './kit.js';

export default () => { const g = new THREE.Group();
  g.add(cyl(0.44, 0.44, 0.5, 0xF3E4C4, 0, 0.25, -0.08, 6), cone(0.52, 0.28, 0xE9B63E, 0, 0.64, -0.08, 6), sph(0.05, C.honey, 0, 0.8, -0.08, 6));
  for (let i = 0; i < 3; i++) g.add(mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 6), VM.glass, -0.14 + i * 0.14, 0.34, 0.3).rotateX(Math.PI / 2));
  g.add(box(0.14, 0.24, 0.03, C.wood, 0, 0.12, 0.31));
  const bee = grp(sph(0.07, C.honey, 0, 0, 0, 8), box(0.03, 0.14, 0.14, C.ink, 0, 0, 0), sph(0.04, C.white, -0.02, 0.07, 0.06, 6), sph(0.04, C.white, -0.02, 0.07, -0.06, 6)); bee.children[0].scale.set(1.3, 1, 1); at(bee, 0.36, 0.2, 0.3); g.add(bee, cyl(0.08, 0.1, 0.12, C.stone, 0.36, 0.06, 0.3, 8));
  [[0x9CC3E0, -0.36], [0xE8C86A, -0.22]].forEach(([c, x]) => g.add(at(grp(box(0.1, 0.1, 0.1, c, 0, 0.05, 0), box(0.12, 0.02, 0.12, C.white, 0, 0.11, 0)), x, 0, 0.34)));
  g.userData.animate = (t) => { bee.children[2].rotation.x = Math.sin(t * 20) * 0.4; bee.children[3].rotation.x = -Math.sin(t * 20) * 0.4; bee.position.y = 0.2 + Math.sin(t * 2) * 0.01; };
  return g; };
