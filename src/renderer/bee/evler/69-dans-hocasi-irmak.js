// 69 · Dans Hocası Irmak (Ev)
// geniş verandalı ev, verandada dans eden iki figür (dönen), renkli fener dizisi, halk dansı mendili
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mat, box, cyl, sph, cone, grp, at, C, body } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.66, wall: 0xFFF6E6, roof: 0xB95A42, shutters: 0xE0626A }); at(b, -0.14, 0, -0.18); g.add(b);
  const floor = box(0.66, 0.03, 0.3, C.woodL, -0.14, 0.015, 0.16); g.add(floor);
  const dancers = [[C.red, -0.24], [C.blue, -0.04]].map(([c, x]) => { const d = grp(cone(0.05, 0.16, c, 0, 0.08, 0, 8), sph(0.03, 0xF2C9A0, 0, 0.19, 0, 6), box(0.1, 0.012, 0.012, 0xF2C9A0, 0, 0.14, 0)); at(d, x, 0.03, 0.18); g.add(d); return d; });
  const lights = []; for (let i = 0; i < 7; i++) { const l = sph(0.022, [VM.lamp, mat(C.red, { emissive: C.red, emissiveIntensity: 0.4 }), mat(C.leafL, { emissive: C.leafL, emissiveIntensity: 0.4 })][i % 3], -0.46 + i * 0.1, 0.46 - Math.sin((i / 6) * Math.PI) * 0.06, 0.32, 6); lights.push(l); g.add(l); }
  g.add(cyl(0.01, 0.01, 0.48, C.wood, -0.48, 0.24, 0.32, 5), cyl(0.01, 0.01, 0.48, C.wood, 0.2, 0.24, 0.32, 5));
  g.userData.animate = (t) => dancers.forEach((d, i) => { d.rotation.y = t * 2 * (i ? -1 : 1); d.position.y = 0.03 + Math.abs(Math.sin(t * 3 + i)) * 0.02; });
  return g; };
