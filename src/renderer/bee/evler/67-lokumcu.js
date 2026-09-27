// 67 · Lokumcu (Dükkân)
// pembe-beyaz şekerleme dükkânı, vitrinde lokum tepsileri, önde dev lokum küpleri maketi, lokum kutuları
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, grp, at, C, hip, body, awning, hangSign, butterflies } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.72, wall: 0xFFF1F2, roof: 0xE893A8, roofType: 'hip', roofH: 0.28, windows: [0.24], trim: 0xE893A8 }); at(b, -0.08, 0, -0.14); g.add(b);
  const aw = awning(0.76, '#F5B8C6', '#FFFFFF'); at(aw, -0.08, 0.44, 0.19); g.add(aw);
  g.add(box(0.26, 0.2, 0.03, VM.glass, -0.26, 0.2, 0.145), hangSign('🍬', 0.3, 0.5, 0.12, -Math.PI / 2 + 0.3, '#FFE3EA'));
  const tray = grp(box(0.22, 0.015, 0.1, C.honey, 0, 0.13, 0)); for (let i = 0; i < 8; i++) tray.add(box(0.035, 0.03, 0.035, [0xF5B8C6, C.white, 0x9FD3A8, 0xF5D76E][i % 4], -0.08 + (i % 4) * 0.053, 0.155, -0.025 + Math.floor(i / 4) * 0.05)); at(tray, -0.26, 0, 0.2); g.add(tray);
  [[0xF5B8C6, 0.28, 0.3, 0.12], [C.white, 0.38, 0.36, 0.1], [0x9FD3A8, 0.3, 0.42, 0.08]].forEach(([c, x, z, s]) => { const cube = box(s, s, s, c, x, s / 2, z); cube.rotation.y = x * 3; g.add(cube); });
  g.add(butterflies(0.2, 0.34, 0.34, [C.pink, C.white]));
  return g; };
