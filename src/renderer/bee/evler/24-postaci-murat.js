// 24 · Postacı Murat (Ev)
// turuncu çatılı küçük ev, kapıda posta bisikleti (sepette mektuplar), kendi posta kutusu, mektup rüzgârlığı
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mesh, box, cyl, grp, at, C, body } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.6, wall: 0xF6F1E7, roof: 0xE9822E, shutters: 0x3F7FBF }); at(b, -0.16, 0, -0.14); g.add(b);
  const bike = grp(mesh(new THREE.TorusGeometry(0.06, 0.012, 5, 12), C.iron, -0.08, 0.07, 0), mesh(new THREE.TorusGeometry(0.06, 0.012, 5, 12), C.iron, 0.08, 0.07, 0), box(0.17, 0.015, 0.015, 0xF2C94C, 0, 0.1, 0), box(0.015, 0.08, 0.015, 0xF2C94C, 0.07, 0.13, 0), box(0.08, 0.06, 0.07, C.woodL, 0.1, 0.16, 0), box(0.05, 0.035, 0.005, C.white, 0.1, 0.2, 0.02)); at(bike, 0.26, 0, 0.32, -0.4); g.add(bike);
  g.add(at(grp(cyl(0.01, 0.01, 0.2, C.wood, 0, 0.1, 0, 5), box(0.08, 0.06, 0.1, 0x3F7FBF, 0, 0.23, 0), box(0.005, 0.03, 0.02, C.red, 0.043, 0.25, 0)), -0.4, 0, 0.28));
  const env = []; for (let i = 0; i < 3; i++) { const e = box(0.04, 0.03, 0.004, C.white, 0, 0, 0); env.push(e); g.add(e); }
  g.userData.animate = (t) => env.forEach((e, i) => { const k = (t * 0.25 + i / 3) % 1; e.position.set(0.1 + Math.sin(k * 6) * 0.1, 0.4 + k * 0.5, 0.3); e.rotation.z = k * 6; e.visible = k < 0.9; });
  return g; };
