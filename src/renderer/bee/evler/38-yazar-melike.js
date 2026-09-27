// 38 · Yazar Melike (Ev)
// kitap dolu cumbalı ev, cumbada daktilo, bahçede okuma hamağı, uçuşan kâğıtlar
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, grp, at, C, body } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.62, wall: 0xF3EBD8, roof: 0x5A6470, shutters: 0x8A5A34 }); at(b, -0.16, 0, -0.14); g.add(b);
  const bay = grp(box(0.24, 0.22, 0.12, VM.glass, 0, 0.26, 0), box(0.28, 0.03, 0.15, C.woodD, 0, 0.385, 0), box(0.28, 0.03, 0.15, C.woodD, 0, 0.14, 0), box(0.09, 0.03, 0.06, 0x3A3A3A, 0, 0.17, 0)); at(bay, -0.16, 0, 0.2); g.add(bay);
  g.add(at(grp(cyl(0.012, 0.015, 0.34, C.trunk, -0.2, 0.17, 0, 5), cyl(0.012, 0.015, 0.34, C.trunk, 0.2, 0.17, 0, 5)), 0.28, 0, 0.32));
  const ham = box(0.36, 0.01, 0.1, 0xE0626A, 0.28, 0.2, 0.32); g.add(ham);
  const papers = []; for (let i = 0; i < 3; i++) { const p = box(0.035, 0.002, 0.045, C.white, 0, 0, 0); papers.push(p); g.add(p); }
  [[C.red, 0.03], [C.blue, 0.06], [C.leafL, 0.09]].forEach(([c, y]) => g.add(box(0.1, 0.025, 0.07, c, -0.42, y - 0.015, 0.32)));
  g.userData.animate = (t) => { ham.rotation.x = Math.sin(t * 1.2) * 0.1; papers.forEach((p, i) => { const k = (t * 0.2 + i / 3) % 1; p.position.set(0.1 + Math.sin(k * 8) * 0.12, 0.3 + k * 0.5, 0.3 + Math.cos(k * 6) * 0.06); p.rotation.set(k * 5, k * 3, 0); }); };
  return g; };
