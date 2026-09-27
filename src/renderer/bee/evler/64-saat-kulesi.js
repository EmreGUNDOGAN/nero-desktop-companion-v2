// 64 · Saat Kulesi (Bina)
// köyün simgesi: yüksek taş kule, dört yüzlü ışıklı saat (dönen yelkovan), çan, sivri çatı, bayrak
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mesh, box, sph, grp, at, C, hip, lamppost, flag, birds } from './kit.js';

export default () => { const g = new THREE.Group();
  g.add(box(0.4, 0.2, 0.4, C.stoneD, 0, 0.1, 0), box(0.32, 1.1, 0.32, C.stone, 0, 0.75, 0), box(0.38, 0.05, 0.38, C.stoneD, 0, 1.32, 0), box(0.12, 0.2, 0.03, C.wood, 0, 0.1, 0.205));
  const hands = []; for (let i = 0; i < 4; i++) { const f = grp(mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.02, 16), VM.lamp).rotateX(Math.PI / 2), mesh(new THREE.TorusGeometry(0.11, 0.012, 5, 16), 0x5A4A3A)); const h = grp(box(0.008, 0.08, 0.006, C.ink, 0, 0.04, 0.014)); f.add(h); hands.push(h); f.position.y = 1.12; const a = (i / 4) * Math.PI * 2; f.position.x = Math.sin(a) * 0.165; f.position.z = Math.cos(a) * 0.165; f.rotation.y = a; g.add(f); }
  const bell = sph(0.05, C.honey, 0, 1.44, 0, 8); g.add(bell, box(0.02, 0.18, 0.02, C.stone, -0.15, 1.44, -0.15), box(0.02, 0.18, 0.02, C.stone, 0.15, 1.44, 0.15), box(0.02, 0.18, 0.02, C.stone, 0.15, 1.44, -0.15), box(0.02, 0.18, 0.02, C.stone, -0.15, 1.44, 0.15), at(hip(0.4, 0.4, 0.34, 0x5A6470), 0, 1.53, 0), flag(0, 1.8, 0, 0xE0262A));
  g.add(lamppost(-0.34, 0.3), lamppost(0.34, 0.3), birds(0, 1.9, 0));
  g.userData.animate = (t) => { hands.forEach((h) => { h.rotation.z = -t * 0.3; }); bell.rotation.z = Math.sin(t * 1.2) * 0.1; };
  return g; };
