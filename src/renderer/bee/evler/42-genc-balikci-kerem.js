// 42 · Genç Balıkçı Kerem (Ev)
// küçük mavi kulübe, iskelede oltası suda (sallanan şamandıra), kova dolusu balık
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mat, cyl, sph, grp, at, C, body, dock, cat } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.52, d: 0.46, h: 0.42, wall: 0xDDEBF5, roof: 0x4F7FB0, windows: [0.12], roofH: 0.28 }); at(b, -0.2, 0, -0.18); g.add(b);
  g.add(at(dock(0.44), 0.3, 0, 0.06));
  const rod = cyl(0.005, 0.007, 0.46, C.wood, 0, 0, 0, 4); rod.rotation.z = -0.6; at(rod, 0.4, 0.22, 0.24); g.add(rod);
  const bob = sph(0.018, C.red, 0.56, 0.03, 0.34, 6); g.add(bob, cyl(0.12, 0.12, 0.008, mat(0x7FC8E0, { roughness: 0.2 }), 0.56, 0.005, 0.34, 12));
  g.add(at(grp(cyl(0.04, 0.035, 0.07, 0xA9B4BE, 0, 0.035, 0, 8), sph(0.02, 0xB0C8D8, 0.01, 0.08, 0, 5), sph(0.02, 0xE0A65A, -0.015, 0.075, 0.01, 5)), 0.18, 0, 0.36), at(cat(0xE8A55A), 0.08, 0, 0.3, 0.8));
  g.userData.animate = (t) => { bob.position.y = 0.03 + Math.sin(t * 2.2) * 0.012; };
  return g; };
