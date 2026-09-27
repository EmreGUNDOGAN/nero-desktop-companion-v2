// 15 · Postane (Bina)
// kırmızı çatı, saat cepheli, sarı posta kutusu, mektup torbaları, posta güvercini
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mesh, box, cyl, sph, cone, grp, at, C, body, hangSign, flag } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.78, wall: 0xF6EEDC, roof: 0xC94A3A, windows: [-0.25, 0.25], trim: 0xC94A3A }); at(b, -0.06, 0, -0.14); g.add(b);
  g.add(at(grp(mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.02, 14), VM.lamp).rotateX(Math.PI / 2), box(0.006, 0.05, 0.01, C.ink, 0, 0.02, 0.012), box(0.04, 0.006, 0.01, C.ink, 0.015, 0, 0.012)), -0.06, 0.42, 0.15));
  g.add(hangSign('✉️', 0.34, 0.5, 0.12, -Math.PI / 2 + 0.3, '#FFF1C7'));
  g.add(at(grp(cyl(0.012, 0.012, 0.16, C.iron, 0, 0.08, 0, 5), box(0.1, 0.12, 0.08, 0xF2C94C, 0, 0.21, 0), box(0.06, 0.012, 0.01, C.ink, 0, 0.23, 0.041), cone(0.07, 0.04, 0xF2C94C, 0, 0.29, 0, 4).rotateY(Math.PI / 4)), 0.34, 0, 0.34));
  g.add(at(grp(sph(0.06, 0xC9B79A, 0, 0.05, 0, 7), sph(0.05, 0xB9A78A, 0.09, 0.045, 0.03, 7)), -0.3, 0, 0.36), flag(-0.46, 0, 0.1, 0xE0262A));
  const pig = grp(sph(0.03, 0xB0B6BE, 0, 0, 0, 6), sph(0.018, 0xB0B6BE, 0.03, 0.02, 0, 6)); at(pig, -0.06, 0.88, -0.14); g.add(pig);
  g.userData.animate = (t) => { pig.position.y = 0.88 + Math.abs(Math.sin(t * 2)) * 0.02; };
  return g; };
