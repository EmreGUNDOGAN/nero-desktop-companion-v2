// 40 · Pazar Yeri (Bina)
// üç renkli tenteli tezgâh, sebze meyve kasaları, terazi, ortada pazar bayrakları dizisi
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, cone, grp, at, C, awning, crate } from './kit.js';

export default () => { const g = new THREE.Group();
  const stall = (a, b2, x, z, fr) => { const s = grp(box(0.3, 0.14, 0.18, C.woodL, 0, 0.07, 0), box(0.02, 0.36, 0.02, C.wood, -0.13, 0.18, -0.08), box(0.02, 0.36, 0.02, C.wood, 0.13, 0.18, -0.08)); const aw = awning(0.34, a, b2); aw.position.set(0, 0.34, 0.02); s.add(aw); s.add(at(crate(fr), -0.05, 0.14, 0)); s.add(at(crate(fr.slice().reverse()), 0.08, 0.14, 0.02)); at(s, x, 0, z); return s; };
  g.add(stall('#E0626A', '#FFFFFF', -0.32, -0.24, [C.red, C.orange, C.leafL]), stall('#4F9A5A', '#FFFFFF', 0.32, -0.24, [C.leafL, C.lilac, C.yellow]), stall('#E9B63E', '#FFFFFF', 0, 0.28, [C.orange, C.red, C.yellow]));
  g.add(cyl(0.01, 0.01, 0.6, C.wood, -0.52, 0.3, 0.1, 5), cyl(0.01, 0.01, 0.6, C.wood, 0.52, 0.3, 0.1, 5)); const line = cyl(0.003, 0.003, 1.04, C.ink, 0, 0.58, 0.1, 3); line.rotation.z = Math.PI / 2; g.add(line);
  const flags = []; for (let i = 0; i < 9; i++) { const f = cone(0.03, 0.06, [C.red, C.yellow, C.blue][i % 3], -0.44 + i * 0.11, 0.54, 0.1, 3); f.rotation.x = Math.PI; flags.push(f); g.add(f); }
  g.userData.animate = (t) => flags.forEach((f, i) => { f.rotation.z = Math.sin(t * 3 + i) * 0.15; });
  return g; };
