// 62 · Hırdavatçı Erol (Ev)
// koyu yeşil dükkân, önde çivi fıçıları, duvarda asılı kürek-tırmık, zincirli tabela
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, grp, at, C, body, hangSign, bench } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.72, wall: 0xE3DDD0, roof: 0x3F5E4A, windows: [0.24], trim: 0x3F5E4A }); at(b, -0.08, 0, -0.14); g.add(b);
  g.add(box(0.26, 0.2, 0.03, VM.glass, -0.26, 0.2, 0.145), hangSign('🔧', 0.3, 0.5, 0.12, -Math.PI / 2 + 0.3, '#E6F4E0'));
  [[-0.14, 0.34], [0.02, 0.36]].forEach(([x, z]) => g.add(at(grp(cyl(0.05, 0.055, 0.1, C.wood, 0, 0.05, 0, 10), cyl(0.052, 0.052, 0.012, C.iron, 0, 0.08, 0, 10), cyl(0.045, 0.045, 0.005, 0x8A9098, 0, 0.1, 0, 10)), x, 0, z)));
  [[0x8A5A34, -0.44, 0.0], [0x8A5A34, -0.44, 0.08]].forEach(([c, x, z], i) => { const t = grp(box(0.012, 0.34, 0.012, c, 0, 0.17, 0), box(0.06, i ? 0.012 : 0.08, 0.012, 0x8A9098, 0, 0.34, 0)); t.rotation.z = 0.1; at(t, x, 0, z); g.add(t); });
  g.add(at(bench(), 0.28, 0, 0.34));
  return g; };
