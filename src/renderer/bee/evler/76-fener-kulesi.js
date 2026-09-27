// 76 · Fener Kulesi (Bina)
// göl kıyısı feneri: kırmızı-beyaz çizgili kule, dönen ışık huzmesi, kayalık temel, iskele
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mesh, box, cyl, cone, grp, at, C, dock, birds } from './kit.js';

export default () => { const g = new THREE.Group();
  for (let i = 0; i < 4; i++) g.add(mesh(new THREE.DodecahedronGeometry(0.12 + (i % 2) * 0.05, 0), C.stoneD, Math.cos(i * 1.6) * 0.3, 0.04, Math.sin(i * 1.6) * 0.3));
  for (let i = 0; i < 6; i++) g.add(cyl(0.17 - i * 0.012, 0.18 - i * 0.012, 0.2, i % 2 ? C.white : 0xD9573F, 0, 0.1 + i * 0.2, 0, 12));
  g.add(cyl(0.16, 0.16, 0.03, C.iron, 0, 1.22, 0, 12), cyl(0.1, 0.1, 0.16, VM.lamp, 0, 1.32, 0, 10), cone(0.15, 0.16, 0xD9573F, 0, 1.48, 0, 12), box(0.1, 0.16, 0.02, C.wood, 0, 0.08, 0.17));
  const beam = mesh(new THREE.ConeGeometry(0.16, 1.1, 10, 1, true), new THREE.MeshBasicMaterial({ color: 0xFFE9A8, transparent: true, opacity: 0.2, side: THREE.DoubleSide, depthWrite: false })); beam.rotation.z = Math.PI / 2; beam.position.x = 0.55; const bg = grp(beam); bg.position.y = 1.32; g.add(bg);
  g.add(at(dock(0.4), 0.34, 0, 0.3), birds(0, 1.7, 0));
  g.userData.animate = (t) => { bg.rotation.y = t * 0.7; beam.material.opacity = 0.03 + VM.glass.emissiveIntensity * 0.14; };
  return g; };
