// 36 · Fotoğrafçı Can (Ev)
// mor çatılı stüdyo ev, cephede fotoğraf çerçeveleri, bahçede sehpalı eski kamera (flaş), çiçek fonu
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mat, box, cyl, grp, at, C, body } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.64, wall: 0xF6F1E7, roof: 0x7A5FA8, windows: [0.2], shutters: 0x3A3A3A }); at(b, -0.14, 0, -0.14); g.add(b);
  [[C.blue, -0.36, 0.34], [C.honey, -0.24, 0.3], [C.red, -0.36, 0.2], [C.leafL, -0.24, 0.18]].forEach(([c, x, y]) => g.add(box(0.09, 0.08, 0.01, C.white, x, y, 0.15), box(0.07, 0.06, 0.012, c, x, y, 0.152)));
  const flash = box(0.03, 0.02, 0.02, VM.lamp, 0, 0.36, 0); const cam = grp(box(0.1, 0.08, 0.08, 0x3A3A3A, 0, 0.3, 0), cyl(0.025, 0.03, 0.05, 0x3A3A3A, 0, 0.3, 0.06, 8).rotateX(Math.PI / 2), flash); for (const a of [-0.3, 0.3, 3.14]) { const l = box(0.01, 0.28, 0.01, C.woodD, Math.sin(a) * 0.05, 0.13, Math.cos(a) * 0.05); l.rotation.x = Math.cos(a) * 0.2; l.rotation.z = -Math.sin(a) * 0.2; cam.add(l); } at(cam, 0.3, 0, 0.3, -0.6); g.add(cam);
  g.add(at(grp(box(0.26, 0.26, 0.01, 0xF5B8C6, 0, 0.13, 0), box(0.012, 0.28, 0.012, C.wood, -0.13, 0.14, 0), box(0.012, 0.28, 0.012, C.wood, 0.13, 0.14, 0)), 0.02, 0, 0.44));
  g.userData.animate = (t) => { flash.material = (Math.sin(t * 1.3) > 0.97) ? mat(0xFFFFFF, { emissive: 0xFFFFFF, emissiveIntensity: 2 }) : VM.lamp; };
  return g; };
