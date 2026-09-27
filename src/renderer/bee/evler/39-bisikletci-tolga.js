// 39 · Bisikletçi Tolga (Ev)
// atölye garaj kapılı ev, duvarda asılı bisikletler, pompa, tamir sehpasında dönen tekerlek
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mesh, box, cyl, grp, at, C, shed, body, lamppost } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.72, wall: 0xEDE7DA, roof: 0x3F7FBF, roofType: 'shed', roofH: 0.26, windows: [0.26], doorX: 0.26 }); at(b, -0.08, 0, -0.14); g.add(b);
  g.add(box(0.3, 0.3, 0.02, 0x8A9098, -0.2, 0.15, 0.145)); for (let i = 0; i < 5; i++) g.add(box(0.3, 0.005, 0.005, 0x6A7078, -0.2, 0.04 + i * 0.06, 0.155));
  const bikeW = (c) => grp(mesh(new THREE.TorusGeometry(0.055, 0.01, 5, 12), C.iron, -0.07, 0, 0), mesh(new THREE.TorusGeometry(0.055, 0.01, 5, 12), C.iron, 0.07, 0, 0), box(0.15, 0.012, 0.012, c, 0, 0.03, 0));
  g.add(at(bikeW(C.red), -0.46, 0.34, -0.1, Math.PI / 2), at(bikeW(C.leafL), -0.46, 0.2, -0.1, Math.PI / 2));
  const wheel = mesh(new THREE.TorusGeometry(0.06, 0.012, 5, 14), C.iron); const stand = grp(box(0.02, 0.2, 0.02, C.iron, 0, 0.1, 0), wheel); wheel.position.set(0, 0.22, 0.03); for (let i = 0; i < 4; i++) { const s = box(0.11, 0.004, 0.004, 0xB0B0B0, 0, 0, 0); s.rotation.z = (i / 4) * Math.PI; wheel.add(s); } at(stand, 0.24, 0, 0.34); g.add(stand);
  g.add(at(grp(cyl(0.02, 0.03, 0.2, 0x3F7FBF, 0, 0.1, 0, 8), box(0.1, 0.012, 0.012, C.iron, 0.04, 0.2, 0)), 0.02, 0, 0.36), lamppost(-0.44, 0.3));
  g.userData.animate = (t) => { wheel.rotation.z = t * 3; };
  return g; };
