// 9 · Fırın (Dükkân)
// tuğla fırın evi: kubbeli taş fırın ekli, tüten baca, önde ekmek tezgâhı, un çuvalları
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, sph, grp, at, C, body, hangSign, smoke } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.64, wall: C.brick, roof: 0x7A2E22, windows: [-0.18, 0.18], chimney: C.stoneD }); at(b, -0.14, 0, -0.14); g.add(b);
  const oven = grp(sph(0.2, 0xC9B79A, 0, 0.02, 0, 12), box(0.1, 0.09, 0.05, 0x3A2A1A, 0, 0.06, 0.18), box(0.06, 0.05, 0.01, VM.lamp, 0, 0.06, 0.21)); oven.children[0].scale.y = 0.85; at(oven, 0.34, 0, -0.1); g.add(oven);
  g.add(smoke(0.01, 0.95, -0.27), smoke(0.34, 0.22, -0.14));
  g.add(hangSign('🍞', 0.22, 0.5, 0.11, -Math.PI / 2 + 0.3, '#FFF1C7'));
  const st = grp(box(0.36, 0.13, 0.13, C.woodL, 0, 0.065, 0)); for (let i = 0; i < 4; i++) { const br = sph(0.035, 0xD9A05A, -0.12 + i * 0.08, 0.15, 0, 7); br.scale.set(1.5, 0.75, 1); st.add(br); } at(st, -0.1, 0, 0.36); g.add(st);
  g.add(box(0.09, 0.1, 0.08, 0xE8DCC0, 0.32, 0.05, 0.3), box(0.09, 0.1, 0.08, 0xE8DCC0, 0.4, 0.05, 0.36));
  return g; };
