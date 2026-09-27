// 48 · Çiftçi Recep (Ev)
// çiftlik evi, kırmızı traktör, saman balyaları, korkuluk, buğday tarlası şeridi
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mesh, box, cyl, grp, at, C, body, smoke } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.6, wall: 0xEFE6D2, roof: 0xB95A42, chimney: C.brick }); at(b, -0.18, 0, -0.16); g.add(b);
  const tr = grp(box(0.2, 0.1, 0.12, 0xC94A3A, 0, 0.1, 0), box(0.09, 0.1, 0.1, 0xC94A3A, -0.05, 0.19, 0), box(0.07, 0.06, 0.09, VM.glass, -0.05, 0.2, 0), mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.03, 12), C.iron, -0.06, 0.07, 0.07).rotateX(Math.PI / 2), mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.03, 12), C.iron, -0.06, 0.07, -0.07).rotateX(Math.PI / 2), mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 10), C.iron, 0.08, 0.04, 0.07).rotateX(Math.PI / 2), mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 10), C.iron, 0.08, 0.04, -0.07).rotateX(Math.PI / 2), cyl(0.012, 0.012, 0.08, C.iron, 0.06, 0.18, 0, 5)); at(tr, 0.28, 0, 0.3, -0.4); g.add(tr, smoke(0.33, 0.27, 0.26));
  g.add(mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.12, 10), 0xE8C86A, 0.36, 0.08, -0.1).rotateZ(Math.PI / 2), mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.12, 10), 0xDDBB5A, 0.34, 0.08, 0.04).rotateZ(Math.PI / 2));
  const wheat = grp(); for (let i = 0; i < 14; i++) wheat.add(cyl(0.006, 0.006, 0.14, 0xE8C86A, -0.2 + (i % 7) * 0.06, 0.07, Math.floor(i / 7) * 0.06, 4)); at(wheat, -0.2, 0, 0.3); g.add(wheat);
  g.userData.animate = (t) => wheat.children.forEach((w, i) => { w.rotation.z = Math.sin(t * 1.5 + i * 0.5) * 0.15; });
  return g; };
