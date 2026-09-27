// 21 · Çoban Yusuf (Ev)
// taş temelli ahşap çoban evi, yanda ağıl, çitte koyunlar, çoban değneği
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mesh, box, cyl, sph, grp, at, C, body, fence, smoke } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.56, wall: C.woodL, roof: 0x8A6F5A, windows: [0.14], trim: C.stoneD, chimney: C.stoneD }); at(b, -0.2, 0, -0.18); g.add(b);
  const pen = grp(at(fence(0.42, C.woodD), 0, 0, 0.18), at(fence(0.42, C.woodD), 0, 0, -0.18)); const side = fence(0.36, C.woodD); side.rotation.y = Math.PI / 2; side.position.x = 0.21; pen.add(side); at(pen, 0.2, 0, 0.12); g.add(pen);
  const sheep = []; [[0.12, 0.1], [0.28, 0.18], [0.2, 0.02]].forEach(([x, z], i) => { const s = grp(sph(0.06, 0xF2F2F2, 0, 0.07, 0, 7), sph(0.03, 0x3A3A3A, 0.06, 0.09, 0, 6), box(0.015, 0.05, 0.015, 0x3A3A3A, -0.03, 0.02, 0.02), box(0.015, 0.05, 0.015, 0x3A3A3A, 0.03, 0.02, -0.02)); s.children[0].scale.set(1.3, 0.9, 1); at(s, x, 0, z, i * 1.3); sheep.push(s); g.add(s); });
  g.add(at(grp(cyl(0.008, 0.008, 0.42, C.wood, 0, 0.21, 0, 4), mesh(new THREE.TorusGeometry(0.03, 0.007, 4, 8, Math.PI), C.wood, 0.03, 0.42, 0)), -0.44, 0, 0.2), smoke(-0.07, 0.9, -0.28));
  g.userData.animate = (t) => sheep.forEach((s, i) => { s.children[1].position.y = 0.09 + Math.sin(t * 1.5 + i) * 0.01; });
  return g; };
