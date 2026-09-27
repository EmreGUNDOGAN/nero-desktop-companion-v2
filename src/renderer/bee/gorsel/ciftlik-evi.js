// Çiftlik evi v2: oyuncunun evi, çiftlik büyüdükçe 4 aşamada gelişir
// aşama 0: ahşap çerçeveli kır evi, pencere saksıları, bank, kapıda arıcı aletleri
// aşama 1: + bal kavanozu raflı veranda, fener
// aşama 2: + yanda "Bal evi" bölümü (🍯 tabelası, kasalar)
// aşama 3: + çatı penceresi, arılı rüzgârgülü, bayrak, bahçe çiti
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, sph, grp, at, gable, body, veranda, lean, windowBox, climber, fence, bench, hangSign, lamppost, smoke, flag, butterflies, mat, C } from '../evler/kit.js';

export function farmStage(view) {
  const hives = Object.keys(view.hives || {}).length;
  const owned = Object.values(view.tiles || {}).filter((t) => t.owned).length;
  return hives >= 7 || owned >= 30 ? 3 : hives >= 4 || owned >= 18 ? 2 : hives >= 2 || owned >= 10 ? 1 : 0;
}

export function makeFarmHouse(stage = 0) {
  const g = new THREE.Group();
  const b = body({ w: 1.0, d: 0.8, h: 0.66, wall: 0xF3E4C4, roof: 0xD9743A, roofH: 0.5, door: 0x8A5A34, shutters: 0x6FA35E, chimney: C.brick, windows: [-0.3, 0.3] });
  at(b, 0, 0, -0.04); g.add(b);
  // Ahşap çerçeve (yarı ahşap cephe)
  for (const x of [-0.49, -0.16, 0.16, 0.49]) g.add(box(0.035, 0.66, 0.02, C.woodD, x, 0.33, 0.37));
  g.add(box(1.0, 0.035, 0.02, C.woodD, 0, 0.44, 0.37), box(1.0, 0.035, 0.02, C.woodD, 0, 0.64, 0.37));
  g.add(windowBox(-0.3, 0.35, 0.39, [C.red, C.yellow, C.white, C.lilac]), windowBox(0.3, 0.35, 0.39, [C.pink, C.white, C.yellow, C.red]));
  g.add(at(climber(12, 0.4, [C.pink, C.white, C.red]), -0.52, 0.02, 0.37));
  g.add(smoke(0.24, 1.3, -0.2));
  // Kapıda arıcı aletleri: yaslanmış çerçeveler ve körük
  g.add(at(grp(box(0.14, 0.1, 0.012, C.woodL, 0, 0.05, 0), box(0.12, 0.08, 0.014, 0xF2C94C, 0, 0.05, 0.001)), 0.2, 0, 0.44, -0.2));
  g.add(at(grp(cyl(0.035, 0.035, 0.09, 0xB8BEC6, 0, 0.045, 0, 10), cyl(0.02, 0.03, 0.05, 0xB8BEC6, 0, 0.11, 0, 8)), 0.34, 0, 0.46));
  g.add(at(bench(), -0.3, 0, 0.56));
  if (stage >= 1) {
    const v = veranda(1.0, 0.26); v.scale.set(1, 1.55, 1.1); at(v, 0, 0, 0.5); g.add(v); // köy evlerinden büyük olduğu için yüksek veranda
    const shelf = grp(box(0.3, 0.02, 0.08, C.woodL, 0, 0.18, 0), box(0.3, 0.02, 0.08, C.woodL, 0, 0.08, 0));
    for (let i = 0; i < 5; i++) shelf.add(cyl(0.025, 0.025, 0.06, mat(C.honey, { transparent: true, opacity: 0.9, roughness: 0.3 }), -0.11 + i * 0.055, 0.22, 0, 8), cyl(0.027, 0.027, 0.012, C.woodL, -0.11 + i * 0.055, 0.255, 0, 8));
    at(shelf, 0.36, 0, 0.56); g.add(shelf);
    g.add(box(0.05, 0.06, 0.05, VM.lamp, -0.1, 0.34, 0.6), cyl(0.003, 0.003, 0.05, C.iron, -0.1, 0.39, 0.6, 3));
  }
  if (stage >= 2) {
    const wing = lean(0.4, 0.56, 0.44, 0xEFE3C6, 0xB95A42); at(wing, 0.7, 0, -0.08); g.add(wing);
    g.add(box(0.03, 0.14, 0.14, VM.glass, 0.905, 0.28, -0.08), hangSign('🍯', 0.72, 0.62, 0.24, -Math.PI / 2 + 0.3, '#FFE08A'));
    for (let i = 0; i < 3; i++) g.add(box(0.12, 0.08, 0.1, C.woodL, 0.62 + (i % 2) * 0.13, 0.04 + Math.floor(i / 2) * 0.08, 0.34), cyl(0.02, 0.02, 0.04, C.honey, 0.6 + (i % 2) * 0.13, 0.1 + Math.floor(i / 2) * 0.08, 0.34, 6));
  }
  if (stage >= 3) {
    const dormer = grp(box(0.24, 0.2, 0.2, 0xF3E4C4, 0, 0.1, 0), box(0.14, 0.12, 0.02, VM.glass, 0, 0.1, 0.101), at(gable(0.24, 0.22, 0.12, 0xD9743A), 0, 0.2, 0)); at(dormer, -0.26, 0.74, 0.18); g.add(dormer);
    const vane = grp(cyl(0.008, 0.008, 0.3, C.iron, 0, 0.15, 0, 4)); const arrow = grp(box(0.2, 0.012, 0.012, C.iron, 0, 0, 0), sph(0.035, C.honey, 0.08, 0, 0, 6), box(0.012, 0.035, 0.035, C.ink, 0.08, 0, 0)); arrow.position.y = 0.3; vane.add(arrow); at(vane, 0, 1.16, -0.04); g.add(vane);
    g.add(flag(-0.7, 0, 0.5, C.honey));
    const f1 = fence(0.5); at(f1, -0.55, 0, 0.76); g.add(f1);
    g.userData.animate = (t) => { arrow.rotation.y = Math.sin(t * 0.3) * 1.2; };
  }
  g.add(butterflies(0, 0.5, 0.7, [C.yellow, C.pink]));
  return g;
}
