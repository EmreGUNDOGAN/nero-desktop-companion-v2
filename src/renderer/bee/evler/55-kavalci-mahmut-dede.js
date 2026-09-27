// 55 · Kavalcı Mahmut Dede (Ev)
// taş ev, kapı önünde hasır sandalye ve kaval, akşamları yanan kandil, üzüm asması
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, sph, cone, grp, at, C, body, ivy } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.62, wall: C.stone, roof: 0x8A5A34, shutters: 0x5F7A4A }); at(b, -0.16, 0, -0.14); g.add(b);
  const pergola = grp(box(0.02, 0.4, 0.02, C.wood, -0.15, 0.2, 0.12), box(0.02, 0.4, 0.02, C.wood, 0.15, 0.2, 0.12), box(0.34, 0.02, 0.3, C.woodL, 0, 0.4, 0)); pergola.add(at(ivy(12, 0.34, 0.06), 0, 0.42, 0)); for (let i = 0; i < 4; i++) pergola.add(sph(0.022, 0x6E3A7A, -0.1 + i * 0.07, 0.36, 0.08, 6)); at(pergola, 0.26, 0, 0.18); g.add(pergola);
  g.add(at(grp(box(0.1, 0.02, 0.1, 0xD9C08A, 0, 0.1, 0), box(0.1, 0.12, 0.015, 0xD9C08A, 0, 0.16, -0.05), ...[[-0.04, -0.04], [0.04, -0.04], [-0.04, 0.04], [0.04, 0.04]].map(([x, z]) => box(0.012, 0.1, 0.012, C.wood, x, 0.05, z))), 0.24, 0, 0.26));
  const kaval = cyl(0.006, 0.006, 0.2, C.woodL, 0.2, 0.11, 0.3, 5); kaval.rotation.z = 1.2; g.add(kaval, at(grp(cone(0.03, 0.04, 0xC9763A, 0, 0.02, 0, 6).rotateX(Math.PI), sph(0.012, VM.lamp, 0, 0.05, 0, 5)), -0.02, 0.08, 0.3));
  const notes = [0, 1].map((i) => { const n = sph(0.014, C.ink, 0, 0, 0, 5); g.add(n); return n; });
  g.userData.animate = (t) => notes.forEach((n, i) => { const k = (t * 0.25 + i * 0.5) % 1; n.position.set(0.24 + Math.sin(k * 6) * 0.05, 0.3 + k * 0.4, 0.26); n.visible = VM.glass.emissiveIntensity > 0.5 && k < 0.9; });
  return g; };
