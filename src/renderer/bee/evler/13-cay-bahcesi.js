// 13 · Çay Bahçesi (Bina)
// köyün buluşma yeri: çınar altında masalar, ağaçlarda fener zinciri, semaver, pergola
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, sph, cone, grp, at, C, tree, smoke } from './kit.js';

export default () => { const g = new THREE.Group();
  const t = tree(1.45); at(t, -0.1, 0, -0.18); g.add(t);
  const lamps = []; for (let i = 0; i < 7; i++) { const a = (i / 7) * Math.PI * 2; const l = sph(0.03, VM.lamp, -0.1 + Math.cos(a) * 0.55, 0.52, -0.12 + Math.sin(a) * 0.45, 6); l.castShadow = false; lamps.push(l); g.add(l, cyl(0.003, 0.003, 0.1, C.ink, l.position.x, 0.6, l.position.z, 3)); }
  [[-0.36, 0.28], [0.1, 0.38], [0.4, 0.1]].forEach(([x, z]) => { g.add(at(grp(cyl(0.1, 0.1, 0.02, C.white, 0, 0.17, 0, 10), cyl(0.014, 0.014, 0.17, C.iron, 0, 0.085, 0, 5), box(0.07, 0.09, 0.07, C.woodL, 0.14, 0.045, 0), box(0.07, 0.09, 0.07, C.woodL, -0.14, 0.045, 0), cyl(0.016, 0.013, 0.03, 0xB95A42, 0.03, 0.195, 0, 6), cyl(0.016, 0.013, 0.03, 0xB95A42, -0.03, 0.195, 0.02, 6)), x, 0, z)); });
  g.add(at(grp(cyl(0.05, 0.06, 0.14, 0xC9A06A, 0, 0.07, 0, 10), cone(0.04, 0.05, 0xC9A06A, 0, 0.17, 0, 10), cyl(0.012, 0.012, 0.05, 0xC9A06A, 0.06, 0.08, 0, 5)), 0.36, 0, -0.26));
  g.add(smoke(0.36, 0.22, -0.26));
  g.userData.animate = (t2) => lamps.forEach((l, i) => { l.position.y = 0.52 + Math.sin(t2 * 1.5 + i) * 0.01; });
  return g; };
