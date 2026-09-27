// 10 · Öğretmen Selin (Ev)
// pastel yeşil ev: verandada okuma köşesi, kitap rafı, yazı tahtası, elma ağacı
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, sph, grp, at, C, body, veranda, tree, birds } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.66, wall: 0xDCEFD6, roof: 0xB95A42, shutters: C.white }); at(b, -0.12, 0, -0.16); g.add(b);
  g.add(at(veranda(0.66), -0.12, 0, 0.2));
  const shelf = grp(box(0.18, 0.2, 0.06, C.wood, 0, 0.1, 0)); [C.red, C.blue, C.leafL, C.honey, C.lilac].forEach((c, i) => shelf.add(box(0.022, 0.06, 0.045, c, -0.06 + i * 0.03, 0.15, 0.01))); at(shelf, -0.3, 0, 0.22); g.add(shelf);
  g.add(at(grp(box(0.2, 0.14, 0.015, 0x2F4A3A, 0, 0.24, 0), box(0.2, 0.012, 0.03, C.wood, 0, 0.17, 0.01), box(0.012, 0.18, 0.012, C.wood, -0.08, 0.09, -0.02), box(0.012, 0.18, 0.012, C.wood, 0.08, 0.09, -0.02), box(0.08, 0.004, 0.003, C.white, -0.03, 0.26, 0.009)), 0.12, 0, 0.36, -0.2));
  const apple = tree(0.75); apple.children.forEach((c) => {}); at(apple, 0.4, 0, -0.06); g.add(apple); for (let i = 0; i < 5; i++) g.add(sph(0.02, C.red, 0.3 + (i % 3) * 0.07, 0.38 + (i % 2) * 0.05, 0.03 - (i % 2) * 0.05, 5));
  g.add(birds(0.1, 0.95, -0.1));
  return g; };
