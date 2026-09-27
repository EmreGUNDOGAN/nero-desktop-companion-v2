// 57 · Marangoz Atölyesi (Dükkân)
// büyük ahşap kapılı atölye, çatıda vinç kolu, dışarıda yarım kayık, sandalye yığını
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, grp, at, C, body, hangSign } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.82, h: 0.56, wall: C.woodL, roof: 0x6E4526, windows: [0.3], doorX: 0.3, trim: C.woodD }); at(b, -0.04, 0, -0.14); g.add(b);
  const doors = grp(box(0.17, 0.36, 0.02, C.woodD, -0.09, 0.18, 0), box(0.17, 0.36, 0.02, C.woodD, 0.09, 0.18, 0)); for (const x of [-0.09, 0.09]) doors.add(box(0.15, 0.015, 0.022, C.wood, x, 0.18, 0.001)); doors.children[2].rotation.z = 0.9; doors.children[3].rotation.z = -0.9; at(doors, -0.22, 0, 0.145); g.add(doors);
  g.add(hangSign('🪚', 0.36, 0.5, 0.11, -Math.PI / 2 + 0.3, '#F3E4C4'));
  const crane = grp(box(0.03, 0.03, 0.3, C.woodD, 0, 0, 0.15), cyl(0.003, 0.003, 0.2, C.ink, 0, -0.1, 0.3, 3), box(0.05, 0.05, 0.05, C.woodL, 0, -0.2, 0.3)); at(crane, -0.22, 0.72, 0.0); g.add(crane);
  const hull = cyl(0.1, 0.1, 0.4, C.woodL, 0, 0, 0, 10, 1, true); hull.scale.set(1, 0.5, 1); hull.rotation.set(Math.PI / 2, 0, 0); at(hull, 0.28, 0.08, 0.34); g.add(hull);
  g.userData.animate = (t) => { crane.children[2].position.y = -0.2 + Math.sin(t * 0.6) * 0.04; };
  return g; };
