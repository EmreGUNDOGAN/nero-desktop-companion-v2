// 75 · Yörük Gülizar (Ev)
// keçe çadır (yörük çadırı) + küçük taş ev, önünde kilim, kazan, keçi
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, sph, cone, grp, at, smoke } from './kit.js';

export default () => { const g = new THREE.Group();
  const tent = grp(cyl(0.3, 0.3, 0.24, 0x3A2A22, 0, 0.12, 0, 10), cone(0.34, 0.24, 0x2A1F1A, 0, 0.36, 0, 10), box(0.14, 0.18, 0.02, 0xC94A3A, 0, 0.09, 0.3), box(0.16, 0.03, 0.03, 0xE9B63E, 0, 0.22, 0.29), sph(0.025, VM.lamp, 0, 0.14, 0.2, 6)); at(tent, -0.16, 0, -0.1); g.add(tent);
  const rug = grp(box(0.3, 0.005, 0.18, 0xC94A3A, 0, 0.003, 0), box(0.24, 0.006, 0.12, 0x3F5E8A, 0, 0.004, 0), box(0.1, 0.007, 0.05, 0xE9B63E, 0, 0.005, 0)); at(rug, -0.1, 0, 0.36); g.add(rug);
  g.add(at(grp(cyl(0.06, 0.05, 0.07, 0x3A3A3A, 0, 0.1, 0, 10), cone(0.04, 0.05, VM.lamp, 0, 0.03, 0, 6)), 0.2, 0, 0.3), smoke(0.2, 0.16, 0.3));
  const goat = grp(box(0.14, 0.07, 0.06, 0x8A6F5A, 0, 0.1, 0), box(0.05, 0.05, 0.05, 0x8A6F5A, 0.09, 0.14, 0), cone(0.01, 0.05, 0x3A3A3A, 0.1, 0.19, 0.015, 4), cone(0.01, 0.05, 0x3A3A3A, 0.1, 0.19, -0.015, 4), ...[[-0.05, -0.02], [0.05, 0.02], [-0.05, 0.02], [0.05, -0.02]].map(([x, z]) => box(0.015, 0.07, 0.015, 0x8A6F5A, x, 0.035, z))); at(goat, 0.34, 0, -0.1, -0.8); g.add(goat);
  g.userData.animate = (t) => { goat.children[1].rotation.z = Math.sin(t * 1.3) * 0.2; };
  return g; };
