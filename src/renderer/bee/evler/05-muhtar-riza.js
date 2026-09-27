// 5 · Muhtar Rıza (Ev)
// köyün muhtarı: iki katlı ev, balkon, bayrak, önünde bank ve duyuru panosu
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, grp, at, C, body, balcony, windowBox, bench, flag } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.78, h: 0.74, wall: 0xF1E3C8, roof: 0xD9743A, shutters: 0x8A5A34, chimney: C.brick, windows: [-0.24, 0.24] }); at(b, -0.08, 0, -0.14); g.add(b);
  g.add(box(0.13, 0.13, 0.03, VM.glass, -0.32, 0.25, 0.145), box(0.13, 0.13, 0.03, VM.glass, 0.16, 0.25, 0.145));
  g.add(at(balcony(0.5), -0.08, 0.44, 0.14), at(windowBox(0, 0, 0, [C.red, C.white, C.red, C.white]), -0.08, 0.47, 0.25));
  g.add(flag(0.42, 0, 0.2), at(bench(), -0.2, 0, 0.38));
  g.add(at(grp(box(0.18, 0.13, 0.02, C.woodL, 0, 0.22, 0), box(0.02, 0.2, 0.02, C.wood, -0.08, 0.1, 0), box(0.02, 0.2, 0.02, C.wood, 0.08, 0.1, 0), box(0.05, 0.05, 0.005, C.white, -0.04, 0.24, 0.012), box(0.05, 0.06, 0.005, C.yellow, 0.04, 0.21, 0.012)), 0.24, 0, 0.36));
  return g; };
