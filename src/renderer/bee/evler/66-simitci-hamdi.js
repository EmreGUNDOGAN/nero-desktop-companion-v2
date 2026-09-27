// 66 · Simitçi Hamdi (Ev)
// küçük ev, önde simit arabası (camlı), sırıkta simitler, tüten mangal
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mat, mesh, box, cyl, grp, at, C, body, smoke } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.58, wall: 0xF3E4C4, roof: 0xC94A3A, windows: [0.14] }); at(b, -0.2, 0, -0.16); g.add(b);
  const cart = grp(box(0.26, 0.16, 0.16, 0xC94A3A, 0, 0.16, 0), box(0.24, 0.12, 0.14, mat(0xCFEBEF, { transparent: true, opacity: 0.5 }), 0, 0.3, 0), box(0.26, 0.015, 0.16, C.white, 0, 0.365, 0), mesh(new THREE.TorusGeometry(0.06, 0.012, 5, 12), C.iron, 0, 0.06, 0.09));
  for (let i = 0; i < 4; i++) { const s = mesh(new THREE.TorusGeometry(0.035, 0.013, 5, 10), 0xC98A4E, -0.08 + i * 0.055, 0.28, 0); s.rotation.x = Math.PI / 2; cart.add(s); } at(cart, 0.24, 0, 0.3, -0.3); g.add(cart);
  const pole = grp(cyl(0.008, 0.008, 0.4, C.wood, 0, 0.2, 0, 4)); for (let i = 0; i < 4; i++) { const s = mesh(new THREE.TorusGeometry(0.035, 0.012, 5, 10), 0xC98A4E, 0, 0.18 + i * 0.05, 0); pole.add(s); } at(pole, -0.02, 0, 0.36); g.add(pole);
  g.add(at(grp(box(0.1, 0.06, 0.08, C.iron, 0, 0.08, 0), box(0.08, 0.01, 0.06, VM.lamp, 0, 0.115, 0), box(0.012, 0.05, 0.012, C.iron, -0.04, 0.025, 0), box(0.012, 0.05, 0.012, C.iron, 0.04, 0.025, 0)), -0.4, 0, 0.32), smoke(-0.4, 0.14, 0.32));
  return g; };
