// 11 · Doktor Aslı (Ev)
// beyaz ev, yeşil panjur: yanda muayene odası eki (kırmızı haç), şifalı bitki bahçesi, bank
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, sph, grp, at, C, body, lean, lamppost, bench, butterflies } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.64, wall: C.white, roof: 0x5A8A6A, shutters: 0x4F9A5A }); at(b, -0.14, 0, -0.14); g.add(b);
  const ex = lean(0.28, 0.3, 0.3, 0xF6F6F2, 0x5A8A6A); at(ex, 0.34, 0, -0.1); g.add(ex, box(0.08, 0.025, 0.01, 0xD9573F, 0.34, 0.24, 0.056), box(0.025, 0.08, 0.01, 0xD9573F, 0.34, 0.24, 0.056));
  g.add(box(0.1, 0.18, 0.02, VM.glass, 0.34, 0.12, 0.052));
  const herb = grp(box(0.3, 0.03, 0.16, 0x6B4428, 0, 0.015, 0)); for (let i = 0; i < 6; i++) herb.add(sph(0.03, [C.leafL, 0x9FBF62, C.lilac][i % 3], -0.1 + (i % 3) * 0.1, 0.05, i < 3 ? -0.04 : 0.04, 5)); at(herb, -0.24, 0, 0.36); g.add(herb);
  g.add(at(bench(C.white), 0.2, 0, 0.36), lamppost(-0.46, 0.2), butterflies(-0.24, 0.3, 0.36, [C.white, C.lilac]));
  return g; };
