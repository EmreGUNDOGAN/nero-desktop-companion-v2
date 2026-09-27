// 20 · Değirmenci Osman (Ev)
// kiremit çatılı ev, yanda küçük su çarkı (dönen), un çuvalları, el arabası
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mat, mesh, box, cyl, grp, at, C, body } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.62, wall: 0xEFE6D2, roof: 0xD9743A, chimney: C.brick, shutters: 0x8A6F5A }); at(b, -0.16, 0, -0.14); g.add(b);
  const wheel = new THREE.Group(); wheel.add(mesh(new THREE.TorusGeometry(0.16, 0.02, 6, 16), C.woodD)); for (let i = 0; i < 8; i++) { const p = box(0.05, 0.03, 0.08, C.woodL, 0, 0, 0); const a = (i / 8) * Math.PI * 2; p.position.set(Math.cos(a) * 0.16, Math.sin(a) * 0.16, 0); p.rotation.z = a; wheel.add(p); }
  wheel.rotation.y = Math.PI / 2; at(wheel, 0.2, 0.2, -0.14); wheel.rotation.y = Math.PI / 2; g.add(wheel, box(0.04, 0.3, 0.04, C.woodD, 0.24, 0.15, -0.14), cyl(0.12, 0.12, 0.02, mat(0x7FC8E0, { roughness: 0.2 }), 0.32, 0.01, -0.14, 12));
  [[0.1, 0.32], [0.2, 0.36], [0.15, 0.4]].forEach(([x, z], i) => g.add(box(0.09, 0.1 + (i % 2) * 0.02, 0.08, 0xE8DCC0, x, 0.05, z)));
  g.add(at(grp(box(0.2, 0.06, 0.12, C.woodL, 0, 0.09, 0), mesh(new THREE.TorusGeometry(0.045, 0.01, 5, 10), C.iron, 0.1, 0.045, 0), box(0.14, 0.012, 0.012, C.wood, -0.15, 0.09, 0.04), box(0.14, 0.012, 0.012, C.wood, -0.15, 0.09, -0.04)), -0.3, 0, 0.36, 0.3));
  g.userData.animate = (t) => { wheel.rotation.x = t * 0.8; };
  return g; };
