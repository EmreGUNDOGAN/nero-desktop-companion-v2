// 26 · Marangoz İsmail (Ev)
// ahşap kaplama ev, yanda kereste sundurması, testere tezgâhı, yarım sandalye, talaş
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mesh, box, cyl, sph, grp, at, C, body, lean, smoke } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.6, wall: C.woodL, roof: 0x5A3A22, windows: [0.14], shutters: C.woodD, chimney: C.stoneD }); at(b, -0.18, 0, -0.14); g.add(b);
  for (let i = 0; i < 6; i++) g.add(box(0.61, 0.005, 0.005, C.woodD, -0.18, 0.06 + i * 0.08, 0.145));
  const shed2 = lean(0.3, 0.3, 0.28, C.woodD, 0x5A3A22); at(shed2, 0.3, 0, -0.12); g.add(shed2);
  for (let i = 0; i < 4; i++) { const l = cyl(0.03, 0.03, 0.26, 0x9A6A3A, 0, 0, 0, 7); l.rotation.z = Math.PI / 2; at(l, 0.3, 0.04 + (i % 2) * 0.055, 0.1 + Math.floor(i / 2) * 0.06); g.add(l); }
  const saw = mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.005, 14), 0xB0B0B0); saw.rotation.x = Math.PI / 2; g.add(at(grp(box(0.22, 0.1, 0.1, C.wood, 0, 0.05, 0)), -0.14, 0, 0.36), at(saw, -0.14, 0.12, 0.36));
  g.add(at(grp(box(0.09, 0.012, 0.09, C.woodL, 0, 0.1, 0), box(0.09, 0.1, 0.012, C.woodL, 0, 0.15, -0.04), box(0.012, 0.1, 0.012, C.woodL, -0.035, 0.05, 0.035)), 0.12, 0, 0.38, 0.5), smoke(0.02, 0.9, -0.24));
  for (let i = 0; i < 6; i++) g.add(sph(0.012, 0xE8C88A, -0.2 + i * 0.03, 0.005, 0.3 + (i % 2) * 0.04, 4));
  g.userData.animate = (t) => { saw.rotation.y = t * 8; };
  return g; };
