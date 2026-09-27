// 25 · Kasabalı Cem (Ev)
// modern beyaz küp ev, geniş cam cephe, çatı terası ve saksılar, bisiklet rafı, şezlong
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mesh, box, grp, at, C, body, pot, lamppost } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.62, wall: 0xFAFAFA, roof: 0x5A6470, roofType: 'flat', windows: [], side: true }); at(b, -0.14, 0, -0.14); g.add(b);
  g.add(box(0.36, 0.3, 0.02, VM.glass, 0.0, 0.25, 0.145), box(0.02, 0.32, 0.03, 0x3A3A3A, 0.19, 0.25, 0.15));
  const deck = grp(box(0.66, 0.02, 0.6, C.woodL, 0, 0, 0), box(0.66, 0.06, 0.01, 0x3A3A3A, 0, 0.04, 0.3)); at(deck, -0.14, 0.58, -0.14); g.add(deck, at(pot(C.leafL), -0.36, 0.59, 0.1), at(pot(C.leafL), 0.08, 0.59, 0.1));
  g.add(at(grp(box(0.2, 0.02, 0.08, C.blue, 0, 0.08, 0), box(0.08, 0.02, 0.08, C.blue, -0.1, 0.12, 0)), 0.32, 0, 0.32, -0.4));
  g.add(at(grp(box(0.2, 0.012, 0.012, C.iron, 0, 0.1, 0), mesh(new THREE.TorusGeometry(0.05, 0.01, 5, 12), C.red, -0.05, 0.07, 0.03)), -0.38, 0, 0.32), lamppost(0.44, 0.06));
  return g; };
