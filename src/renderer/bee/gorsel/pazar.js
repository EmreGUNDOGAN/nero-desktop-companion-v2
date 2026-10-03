import * as THREE from '../vendor/three.module.min.js';
import { box, cyl, grp, at, hangSign, C, mat } from '../evler/kit.js';

// 6.6.1 — Haritada kalıcı fiziksel Pazar. Pazar butonuyla aynı sistemi açar.
export function makePhysicalMarket() {
  const g = new THREE.Group();
  const cloth = mat(0xC85D45, { roughness: 0.8 });
  const cloth2 = mat(0xE7B54A, { roughness: 0.8 });

  // Ana tezgâh.
  const counter = grp(
    box(0.82, 0.12, 0.34, C.woodL, 0, 0.25, 0),
    box(0.055, 0.42, 0.055, C.woodD, -0.34, 0.21, 0),
    box(0.055, 0.42, 0.055, C.woodD, 0.34, 0.21, 0)
  );
  at(counter, 0, 0, 0.04); g.add(counter);

  // Çizgili tente.
  for (let i = 0; i < 5; i++) {
    const strip = box(0.18, 0.035, 0.58, i % 2 ? cloth : cloth2, -0.36 + i * 0.18, 0.69, 0);
    strip.rotation.z = (i - 2) * 0.015;
    g.add(strip);
  }
  for (const x of [-0.39, 0.39]) g.add(cyl(0.018, 0.018, 0.48, C.woodD, x, 0.47, 0, 6));

  // Günlük bırakılan ürünleri temsil eden sepet/kasalar.
  g.add(box(0.22, 0.15, 0.22, C.wood, -0.35, 0.075, 0.36));
  g.add(box(0.2, 0.12, 0.2, C.woodL, 0.34, 0.06, 0.34));
  for (let i = 0; i < 5; i++) {
    const jar = cyl(0.026, 0.026, 0.07, 0xD99B32, -0.22 + i * 0.11, 0.36, 0.08, 8);
    g.add(jar);
  }
  g.add(hangSign('🧺', 0, 0.83, 0.02, 0, '#FFF0BE'));
  g.userData.seasonalBuilding = true;
  return g;
}