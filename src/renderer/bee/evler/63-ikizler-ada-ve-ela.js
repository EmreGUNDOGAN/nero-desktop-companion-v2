// 63 · İkizler Ada ve Ela (Ev)
// aile evi, iki renkli oyun evi (ikiz), tahterevalli (sallanan), balonlar
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, sph, cone, grp, at, C, gable, body } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.62, wall: 0xFFF1D6, roof: 0x6FA3D9, shutters: 0xE893A8 }); at(b, -0.18, 0, -0.16); g.add(b);
  [[0xF5B8C6, 0.22], [0x9CC3E0, 0.4]].forEach(([c, x]) => g.add(at(grp(box(0.12, 0.12, 0.12, c, 0, 0.06, 0), at(gable(0.12, 0.12, 0.07, C.white), 0, 0.12, 0), box(0.04, 0.07, 0.005, C.white, 0, 0.035, 0.061)), x, 0, -0.1)));
  const saw = grp(box(0.34, 0.02, 0.05, C.red, 0, 0, 0), box(0.04, 0.04, 0.05, C.yellow, -0.15, 0.02, 0), box(0.04, 0.04, 0.05, C.yellow, 0.15, 0.02, 0)); saw.position.set(0.28, 0.08, 0.3); g.add(saw, cone(0.04, 0.07, C.woodD, 0.28, 0.035, 0.3, 4));
  const balloons = [C.red, C.yellow, C.lilac].map((c, i) => { const bl = grp(sph(0.04, c, 0, 0, 0, 8), cyl(0.002, 0.002, 0.2, C.ink, 0, -0.12, 0, 3)); bl.children[0].scale.y = 1.2; at(bl, -0.1 + i * 0.05, 0.62, 0.3); g.add(bl); return bl; });
  g.userData.animate = (t) => { saw.rotation.z = Math.sin(t * 1.5) * 0.18; balloons.forEach((bl, i) => { bl.position.y = 0.62 + Math.sin(t + i) * 0.03; bl.rotation.z = Math.sin(t * 0.8 + i) * 0.1; }); };
  return g; };
