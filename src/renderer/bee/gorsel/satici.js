// Gezgin satıcı arabası v2: çizgili brandalı at arabası, tel tekerlekler, fener, kasalar, yeleli at, sakallı satıcı
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, sph, cone, grp, mesh, mat, crate, C } from '../evler/kit.js';

function wheel() { const w = grp(mesh(new THREE.TorusGeometry(0.1, 0.014, 6, 16), C.woodD), cyl(0.022, 0.022, 0.04, C.iron, 0, 0, 0, 8).rotateX(Math.PI / 2)); for (let i = 0; i < 6; i++) { const s = box(0.2, 0.01, 0.01, C.wood, 0, 0, 0); s.rotation.z = (i / 6) * Math.PI; w.add(s); } return w; }
function stripes(a, b) { const cv = document.createElement('canvas'); cv.width = 64; cv.height = 64; const x = cv.getContext('2d'); for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? b : a; x.fillRect(i * 8, 0, 8, 64); } const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 1); return new THREE.MeshStandardMaterial({ map: t, roughness: 0.85, side: THREE.DoubleSide }); }

export function makeMerchantWagon() {
  const g = new THREE.Group();
  // Araba kasası ve branda
  g.add(box(0.62, 0.14, 0.34, C.woodL, 0, 0.25, 0), box(0.64, 0.03, 0.36, C.woodD, 0, 0.18, 0));
  const hood = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.6, 14, 1, true, 0, Math.PI), stripes('#7A2E3A', '#F6E6C8')); hood.rotation.z = Math.PI / 2; hood.position.y = 0.32; hood.castShadow = true; g.add(hood);
  for (const x of [-0.3, 0.3]) g.add(mesh(new THREE.TorusGeometry(0.19, 0.012, 5, 14, Math.PI), C.woodD, x, 0.32, 0).rotateY(Math.PI / 2));
  // Tekerlekler
  for (const [x, z] of [[-0.2, 0.19], [0.2, 0.19], [-0.2, -0.19], [0.2, -0.19]]) { const w = wheel(); w.position.set(x, 0.1, z); g.add(w); }
  // Önde kasalar ve fener
  g.add(crate([C.red, C.yellow, C.leafL], -0.18, 0.35), crate([C.lilac, C.honey, C.white], -0.04, 0.37));
  g.children[g.children.length - 2].position.y = 0.3; g.children[g.children.length - 1].position.y = 0.3;
  g.add(cyl(0.006, 0.006, 0.16, C.iron, 0.34, 0.44, 0.12, 4), box(0.05, 0.06, 0.05, VM.lamp, 0.34, 0.37, 0.12), cone(0.04, 0.03, C.iron, 0.34, 0.41, 0.12, 4));
  // Oklar ve at
  g.add(box(0.36, 0.015, 0.015, C.wood, 0.46, 0.2, 0.08), box(0.36, 0.015, 0.015, C.wood, 0.46, 0.2, -0.08));
  const horse = new THREE.Group(); const hc = 0x8A5A3A;
  const hbody = box(0.34, 0.15, 0.13, hc, 0, 0.3, 0); const neck = box(0.09, 0.2, 0.09, hc, 0.18, 0.42, 0); neck.rotation.z = -0.55; const hhead = box(0.16, 0.08, 0.08, hc, 0.28, 0.5, 0);
  const mane = box(0.04, 0.18, 0.1, 0x3A2A1A, 0.14, 0.45, 0); mane.rotation.z = -0.55; const tail = box(0.03, 0.16, 0.04, 0x3A2A1A, -0.19, 0.28, 0); tail.rotation.z = 0.35;
  horse.add(hbody, neck, hhead, mane, tail, sph(0.012, 0x1A1A1A, 0.33, 0.52, 0.042, 5), box(0.12, 0.06, 0.14, 0xC94A3A, 0, 0.39, 0));
  const legs = [[-0.12, 0.045], [0.12, 0.045], [-0.12, -0.045], [0.12, -0.045]].map(([x, z]) => { const l = box(0.035, 0.24, 0.035, 0x6E4526, x, 0.12, z); horse.add(l); return l; });
  horse.position.set(0.76, 0, 0); g.add(horse);
  // Satıcı: sakal, şapka, yelek
  const man = new THREE.Group();
  man.add(cyl(0.07, 0.08, 0.2, 0x3F7FBF, 0, 0.1, 0, 10), box(0.15, 0.1, 0.02, 0x7A2E3A, 0, 0.14, 0.07), sph(0.06, 0xF2C9A0, 0, 0.25, 0, 10), sph(0.045, 0xB9A07A, 0, 0.22, 0.03, 8), cyl(0.11, 0.11, 0.015, 0x5A3A22, 0, 0.3, 0, 12), cyl(0.055, 0.06, 0.07, 0x5A3A22, 0, 0.34, 0, 10));
  const armWave = box(0.03, 0.12, 0.03, 0x3F7FBF, 0.08, 0.2, 0); man.add(armWave); man.position.set(-0.1, 0, 0.38); g.add(man);
  g.userData.animate = (t) => { neck.rotation.z = -0.55 + Math.sin(t * 0.8) * 0.06; hhead.position.y = 0.5 + Math.sin(t * 0.8) * 0.01; tail.rotation.x = Math.sin(t * 2) * 0.25; armWave.rotation.z = Math.sin(t * 3) > 0.7 ? 1.8 + Math.sin(t * 12) * 0.3 : 0; man.position.y = Math.abs(Math.sin(t * 1.5)) * 0.008; };
  return g;
}
