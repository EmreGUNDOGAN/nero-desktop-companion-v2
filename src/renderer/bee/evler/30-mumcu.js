// 30 · Mumcu (Dükkân)
// koyu kiremit dükkân, vitrinde yanan mumlar (titreşen), balmumu kalıpları, arı peteği tabelası
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, cone, grp, at, C, body, hangSign, smoke } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.72, wall: 0xF3E4C4, roof: 0x7A2E22, windows: [0.24], chimney: C.brick }); at(b, -0.08, 0, -0.14); g.add(b);
  g.add(box(0.28, 0.22, 0.03, VM.glass, -0.24, 0.2, 0.145));
  g.add(hangSign('🕯️', 0.3, 0.5, 0.12, -Math.PI / 2 + 0.3, '#FFF1C7'));
  const flames = []; const st = grp(box(0.44, 0.04, 0.12, C.wood, 0, 0.14, 0));
  [-0.16, -0.08, 0, 0.08, 0.16].forEach((x, i) => { const hgt = 0.07 + (i % 3) * 0.03; st.add(cyl(0.02, 0.02, hgt, [C.white, 0xF5E6A0, 0xF5B8C6][i % 3], x, 0.16 + hgt / 2, 0, 8)); const f = cone(0.012, 0.03, VM.lamp, x, 0.18 + hgt, 0, 6); flames.push(f); st.add(f); });
  at(st, -0.06, 0, 0.34); g.add(st);
  g.add(at(grp(box(0.1, 0.05, 0.08, 0xE8C86A, 0, 0.025, 0), box(0.08, 0.04, 0.07, 0xF2D26A, 0.02, 0.07, 0)), 0.32, 0, 0.32), smoke(0.1, 0.95, -0.24));
  g.userData.animate = (t) => flames.forEach((f, i) => { f.scale.y = 1 + Math.sin(t * 12 + i * 2) * 0.25; });
  return g; };
