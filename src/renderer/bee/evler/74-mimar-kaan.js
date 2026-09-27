// 74 · Mimar Kaan (Ev)
// modern L biçimli ev, düz çatı, geniş cam, çatıda güneş paneli, bahçede çizim masası ve maket
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, grp, at, C, body, lamppost } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.56, wall: 0xF2F2F2, roof: 0x3A3A3A, roofType: 'flat', windows: [], side: true }); at(b, -0.2, 0, -0.18); g.add(b);
  const wing = grp(box(0.28, 0.32, 0.4, 0xD9C9A8, 0, 0.16, 0), box(0.3, 0.04, 0.42, 0x3A3A3A, 0, 0.34, 0), box(0.02, 0.22, 0.3, VM.glass, -0.141, 0.16, 0)); at(wing, 0.26, 0, -0.06); g.add(wing);
  g.add(box(0.34, 0.3, 0.02, VM.glass, -0.2, 0.24, 0.1));
  const panel = box(0.3, 0.015, 0.2, 0x2A3A5A, -0.2, 0.62, -0.18); panel.rotation.x = -0.35; g.add(panel);
  g.add(at(grp(box(0.2, 0.015, 0.14, C.white, 0, 0.18, 0), box(0.015, 0.18, 0.015, C.iron, -0.08, 0.09, 0), box(0.015, 0.18, 0.015, C.iron, 0.08, 0.09, 0), box(0.14, 0.002, 0.1, 0xDDEBF5, 0, 0.19, 0)), 0.1, 0, 0.36, -0.3));
  g.add(at(grp(box(0.06, 0.06, 0.06, C.white, 0, 0.03, 0), box(0.04, 0.1, 0.04, C.white, 0.05, 0.05, 0)), -0.36, 0, 0.36), lamppost(0.44, 0.34));
  return g; };
