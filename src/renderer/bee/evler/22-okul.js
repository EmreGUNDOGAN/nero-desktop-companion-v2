// 22 · Okul (Bina)
// sarı okul binası, çan kulesi (sallanan çan), bayrak, bahçede sek sek ve top
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, sph, grp, at, C, hip, body, lamppost, flag } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.86, h: 0.56, wall: 0xF5D76E, roof: 0xC94A3A, windows: [-0.3, -0.1, 0.1, 0.3], trim: C.white }); at(b, -0.04, 0, -0.16); g.add(b);
  const bell = sph(0.035, C.honey, 0, 0, 0, 8); const bt = grp(box(0.14, 0.16, 0.14, C.white, 0, 0.08, 0), at(hip(0.18, 0.18, 0.14, 0xC94A3A), 0, 0.16, 0)); bell.position.set(0, 0.08, 0.075); bt.add(bell); at(bt, -0.04, 0.88, -0.16); g.add(bt);
  g.add(flag(0.44, 0, 0.26, 0xE0262A));
  [[0, 0], [0.08, 0], [0.04, 0.08], [0.04, 0.16]].forEach(([x, z]) => g.add(box(0.07, 0.004, 0.07, C.white, -0.3 + x, 0.004, 0.26 + z)));
  g.add(sph(0.04, C.red, 0.16, 0.04, 0.36, 8), lamppost(0.3, 0.1));
  g.userData.animate = (t) => { bell.rotation.z = Math.sin(t * 2) * 0.3; };
  return g; };
