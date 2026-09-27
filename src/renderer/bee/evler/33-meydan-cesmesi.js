// 33 · Meydan Çeşmesi (Bina)
// üç lüleli taş çeşme, akan su, çevresinde çiçekli saksılar, güvercinler, fenerler
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mat, cyl, sph, grp, at, C, pot, lamppost } from './kit.js';

export default () => { const g = new THREE.Group();
  g.add(cyl(0.45, 0.48, 0.14, C.stone, 0, 0.07, 0, 12), cyl(0.4, 0.4, 0.02, mat(0x7FC8E0, { roughness: 0.2 }), 0, 0.14, 0, 12), cyl(0.08, 0.1, 0.4, C.stone, 0, 0.3, 0, 8), cyl(0.2, 0.12, 0.06, C.stone, 0, 0.52, 0, 10), cyl(0.05, 0.07, 0.14, C.stone, 0, 0.62, 0, 8), sph(0.06, C.stone, 0, 0.72, 0, 8));
  const jets = []; for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2; const j = cyl(0.01, 0.014, 0.34, mat(0xBFE6F2, { transparent: true, opacity: 0.6 }), Math.cos(a) * 0.19, 0.33, Math.sin(a) * 0.19, 6); j.rotation.z = Math.cos(a) * 0.3; j.rotation.x = -Math.sin(a) * 0.3; jets.push(j); g.add(j); }
  for (let i = 0; i < 4; i++) g.add(at(pot([C.red, C.yellow, C.white, C.pink][i]), Math.cos(i * 1.57 + 0.78) * 0.62, 0, Math.sin(i * 1.57 + 0.78) * 0.62));
  const pig = [0, 1].map((i) => { const p = grp(sph(0.025, 0xB0B6BE, 0, 0.025, 0, 6), sph(0.015, 0x8A9098, 0.025, 0.045, 0, 6)); at(p, -0.2 + i * 0.4, 0.14, 0.44); g.add(p); return p; });
  g.add(lamppost(-0.6, -0.1), lamppost(0.6, -0.1));
  g.userData.animate = (t) => { jets.forEach((j, i) => { j.material.opacity = 0.45 + Math.sin(t * 6 + i) * 0.15; }); pig.forEach((p, i) => { p.rotation.y = Math.sin(t + i * 2) * 1.2; p.children[1].position.y = 0.045 + Math.abs(Math.sin(t * 3 + i)) * 0.01; }); };
  return g; };
