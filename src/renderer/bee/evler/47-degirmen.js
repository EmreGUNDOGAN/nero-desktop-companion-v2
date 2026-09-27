// 47 · Değirmen (Bina)
// beyaz yel değirmeni, dönen kırmızı kanatlar, un çuvalları, eşek arabası
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mesh, box, cyl, cone, grp, at, C } from './kit.js';

export default () => { const g = new THREE.Group();
  g.add(cyl(0.2, 0.3, 0.9, C.white, 0, 0.45, -0.06, 12), cone(0.24, 0.26, 0xD9743A, 0, 1.03, -0.06, 12), box(0.12, 0.2, 0.03, C.wood, 0, 0.1, 0.22), box(0.08, 0.08, 0.03, VM.glass, 0, 0.55, 0.19));
  const hub = new THREE.Group(); hub.position.set(0, 0.82, 0.22); hub.add(cyl(0.04, 0.04, 0.08, C.wood, 0, 0, 0, 8).rotateX(Math.PI / 2));
  for (let i = 0; i < 4; i++) { const arm = new THREE.Group(); arm.rotation.z = (i / 4) * Math.PI * 2; arm.add(box(0.03, 0.5, 0.02, C.wood, 0, 0.27, 0.02), box(0.11, 0.38, 0.01, 0xD9573F, 0.07, 0.31, 0.03)); hub.add(arm); }
  g.add(hub);
  [[-0.3, 0.3], [-0.22, 0.36], [-0.26, 0.32]].forEach(([x, z], i) => g.add(box(0.1, 0.1 + (i === 2 ? 0.02 : 0), 0.09, 0xE8DCC0, x, 0.05 + (i === 2 ? 0.08 : 0), z)));
  g.add(at(grp(box(0.2, 0.06, 0.12, C.woodL, 0, 0.12, 0), mesh(new THREE.TorusGeometry(0.05, 0.01, 5, 10), C.woodD, 0, 0.06, 0.07)), 0.3, 0, 0.34, -0.5));
  g.userData.animate = (t) => { hub.rotation.z = t * 0.8; };
  return g; };
