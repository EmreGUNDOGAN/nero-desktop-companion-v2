// 18 · Muhtarlık (Bina)
// taş bina, üstte saat kulesi, bayrak, duyuru panosu, önünde iki fener
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mesh, box, grp, at, C, hip, body, lamppost, flag } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.74, h: 0.58, wall: C.stone, roof: 0x8A6F5A, windows: [-0.22, 0.22], trim: C.stoneD }); at(b, -0.12, 0, -0.14); g.add(b);
  // Yanda yükselen saat kulesi (gece kadranı ışıklı)
  const tw = grp(box(0.22, 0.98, 0.22, C.stone, 0, 0.49, 0), box(0.26, 0.04, 0.26, C.stoneD, 0, 0.98, 0), at(hip(0.24, 0.24, 0.2, 0x5A4A3A), 0, 1.0, 0), mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.02, 14), VM.lamp).rotateX(Math.PI / 2)); tw.children[3].position.set(0, 0.82, 0.115); at(tw, 0.44, 0, -0.18); g.add(tw);
  g.add(flag(-0.46, 0, 0.24, 0xE0262A), lamppost(-0.3, 0.3), lamppost(0.2, 0.3));
  g.add(at(grp(box(0.2, 0.14, 0.02, C.woodL, 0, 0.21, 0), box(0.02, 0.2, 0.02, C.wood, -0.09, 0.1, 0), box(0.02, 0.2, 0.02, C.wood, 0.09, 0.1, 0), box(0.06, 0.05, 0.005, C.white, -0.04, 0.23, 0.012), box(0.05, 0.06, 0.005, C.yellow, 0.05, 0.2, 0.012)), -0.02, 0, 0.36));
  return g; };
