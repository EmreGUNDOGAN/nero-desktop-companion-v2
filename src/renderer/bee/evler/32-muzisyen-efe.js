// 32 · Müzisyen Efe (Ev)
// balkonlu ev, balkonda saz, kapı önünde nota tabelası, uçuşan notalar
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, sph, grp, at, C, body, balcony } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.64, h: 0.68, wall: 0xF6EEDC, roof: 0xD9743A, shutters: 0x9C7BD6 }); at(b, -0.14, 0, -0.14); g.add(b);
  g.add(at(balcony(0.42), -0.14, 0.42, 0.14));
  const saz = grp(sph(0.05, 0x9A6A3A, 0, 0, 0, 8), box(0.015, 0.2, 0.012, C.woodD, 0, 0.14, 0)); saz.children[0].scale.set(1, 1.3, 0.4); at(saz, 0.02, 0.56, 0.2); saz.rotation.z = 0.4; g.add(saz);
  g.add(at(grp(cyl(0.045, 0.045, 0.02, 0xD9C08A, 0, 0.1, 0, 8), cyl(0.008, 0.008, 0.1, C.wood, 0, 0.05, 0, 4)), 0.28, 0, 0.32));
  const notes = []; for (let i = 0; i < 3; i++) { const n = grp(sph(0.018, C.ink, 0, 0, 0, 6), box(0.005, 0.05, 0.005, C.ink, 0.015, 0.025, 0)); notes.push(n); g.add(n); }
  g.userData.animate = (t) => notes.forEach((n, i) => { const k = (t * 0.3 + i / 3) % 1; n.position.set(0.02 + Math.sin(k * 7) * 0.08, 0.6 + k * 0.45, 0.22); n.scale.setScalar(k < 0.85 ? 1 : 0.01); });
  return g; };
