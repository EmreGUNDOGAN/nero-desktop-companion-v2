// 73 · Köy Serası (Bina)
// büyük ortak sera: uzun cam sera, içinde sıra sıra bitkiler ve çiçekler, önde saksı rafı, sulama hortumu
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mat, box, sph, grp, at, C, gable, pot, butterflies } from './kit.js';

export default () => { const g = new THREE.Group();
  const gl = mat(0xCFEBEF, { transparent: true, opacity: 0.42, roughness: 0.15 });
  g.add(box(0.9, 0.36, 0.5, gl, 0, 0.18, -0.08)); const r = gable(0.9, 0.5, 0.2, gl); r.rotation.y = Math.PI / 2; r.scale.set(0.56, 1, 1.8); r.position.set(0, 0.36, -0.08); g.add(r);
  for (let i = 0; i <= 6; i++) { const x = -0.45 + i * 0.15; g.add(box(0.014, 0.36, 0.014, C.white, x, 0.18, 0.17), box(0.014, 0.36, 0.014, C.white, x, 0.18, -0.33)); }
  for (let i = 0; i < 12; i++) g.add(sph(0.04, [C.leaf, C.leafL, 0x3F8A57][i % 3], -0.36 + (i % 6) * 0.14, 0.08, -0.2 + Math.floor(i / 6) * 0.2, 5), sph(0.025, [C.red, C.yellow, C.lilac, C.pink][i % 4], -0.36 + (i % 6) * 0.14, 0.13, -0.2 + Math.floor(i / 6) * 0.2, 6));
  g.add(sph(0.035, VM.lamp, -0.2, 0.34, -0.08, 8), sph(0.035, VM.lamp, 0.2, 0.34, -0.08, 8));
  const shelf = grp(box(0.36, 0.02, 0.1, C.woodL, 0, 0.14, 0), box(0.36, 0.02, 0.1, C.woodL, 0, 0.06, 0)); for (let i = 0; i < 4; i++) shelf.add(at(pot([C.red, C.yellow, C.white, C.pink][i]), -0.13 + i * 0.09, 0.15, 0)); at(shelf, -0.2, 0, 0.34); g.add(shelf, butterflies(0.2, 0.3, 0.34, [C.yellow, C.pink]));
  return g; };
