// 3 · Küçük Elif (Ev)
// aile evi: sarı çatı, açık mavi ev, bahçede salıncaklı ağaç, tebeşir resimleri, uçurtma
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mesh, box, cyl, grp, at, C, body, windowBox, tree } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.64, wall: 0xDDEBF5, roof: 0xF2C94C, shutters: 0xE893A8 }); at(b, -0.16, 0, -0.14); g.add(b);
  const tr = tree(0.85); at(tr, 0.34, 0, 0.02); g.add(tr);
  g.add(cyl(0.003, 0.003, 0.26, C.ink, 0.44, 0.3, 0.02, 3), cyl(0.003, 0.003, 0.26, C.ink, 0.44, 0.3, 0.1, 3), box(0.03, 0.012, 0.11, C.red, 0.44, 0.17, 0.06));
  [C.pink, C.blue, C.yellow].forEach((c, i) => g.add(box(0.07, 0.004, 0.07, c, -0.3 + i * 0.09, 0.005, 0.34 + (i % 2) * 0.04)));
  const kite = grp(mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.005, 4), C.red), cyl(0.002, 0.002, 0.3, C.ink, 0, -0.15, 0, 3)); kite.children[0].rotation.x = Math.PI / 2; at(kite, 0.1, 1.05, 0.2); g.add(kite);
  g.add(windowBox(-0.36, 0.25, 0.155, [C.yellow, C.pink, C.yellow, C.white]));
  g.userData.animate = (t) => { kite.position.x = 0.1 + Math.sin(t * 0.8) * 0.08; kite.rotation.z = Math.sin(t * 1.3) * 0.2; };
  return g; };
