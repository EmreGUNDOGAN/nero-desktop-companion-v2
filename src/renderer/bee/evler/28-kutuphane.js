// 28 · Kütüphane (Bina)
// kubbeli taş bina, sütunlu giriş, kitap yığınlı basamaklar, iki fener, okuma bankı
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, sph, C, lamppost, birds } from './kit.js';

export default () => { const g = new THREE.Group();
  g.add(box(0.8, 0.5, 0.56, 0xEDE4D0, 0, 0.25, -0.12));
  const dome = sph(0.28, 0x6F9A8A, 0, 0.5, -0.12, 12); dome.scale.set(1, 0.7, 1); g.add(dome, sph(0.04, C.honey, 0, 0.72, -0.12, 6));
  for (let i = 0; i < 4; i++) g.add(cyl(0.028, 0.032, 0.42, C.white, -0.27 + i * 0.18, 0.21, 0.24, 8));
  g.add(box(0.74, 0.06, 0.12, C.white, 0, 0.45, 0.22), box(0.8, 0.03, 0.16, C.stoneD, 0, 0.015, 0.26), box(0.14, 0.26, 0.03, C.wood, 0, 0.13, 0.165), box(0.12, 0.14, 0.03, VM.glass, -0.25, 0.3, 0.165), box(0.12, 0.14, 0.03, VM.glass, 0.25, 0.3, 0.165));
  [[C.red, C.blue], [C.leafL, C.honey]].forEach((cs, i) => cs.forEach((c, j) => g.add(box(0.1, 0.025, 0.07, c, -0.3 + i * 0.6, 0.045 + j * 0.028, 0.34))));
  g.add(lamppost(-0.44, 0.34), lamppost(0.44, 0.34), birds(0, 1.1, -0.1));
  return g; };
