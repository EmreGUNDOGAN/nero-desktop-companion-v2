// 51 · Kuaför Şule (Ev)
// pembe-mor dükkân, döner berber direği (dönen), vitrinde ayna ve koltuk, makas tabelası
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, sph, grp, at, C, body, hangSign } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.68, wall: 0xFFF1F2, roof: 0x9C7BD6, windows: [0.22], trim: 0xE893A8 }); at(b, -0.1, 0, -0.14); g.add(b);
  g.add(box(0.26, 0.22, 0.03, VM.glass, -0.28, 0.2, 0.145), box(0.1, 0.12, 0.01, 0xDDEFF5, -0.28, 0.24, 0.12), hangSign('💇', 0.26, 0.5, 0.12, -Math.PI / 2 + 0.3, '#FDE8EE'));
  const pole = grp(cyl(0.025, 0.025, 0.26, C.white, 0, 0.13, 0, 8)); for (let i = 0; i < 4; i++) pole.add(cyl(0.027, 0.027, 0.025, 0xE0262A, 0, 0.04 + i * 0.06, 0, 8)); pole.add(sph(0.03, VM.lamp, 0, 0.28, 0, 6)); at(pole, 0.3, 0, 0.26); g.add(pole);
  g.add(at(grp(box(0.1, 0.03, 0.1, 0x9C7BD6, 0, 0.08, 0), box(0.1, 0.1, 0.02, 0x9C7BD6, 0, 0.13, -0.04), cyl(0.012, 0.012, 0.07, C.iron, 0, 0.035, 0, 5)), 0.1, 0, 0.36));
  g.userData.animate = (t) => { pole.children.slice(1, 5).forEach((r, i) => { r.position.y = 0.04 + ((i * 0.06 + t * 0.05) % 0.24); }); };
  return g; };
