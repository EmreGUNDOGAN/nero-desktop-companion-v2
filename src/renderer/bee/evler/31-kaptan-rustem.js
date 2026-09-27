// 31 · Kaptan Rüstem (Ev)
// deniz feneri kulesi olan lacivert ev, çapa, dümen, çatıda dürbün, küçük kayık rafı
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mesh, box, cyl, cone, grp, at, C, body } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.6, wall: C.white, roof: 0x3E5478, windows: [-0.16], trim: 0x3E5478 }); at(b, -0.18, 0, -0.14); g.add(b);
  const tw = grp(); for (let i = 0; i < 4; i++) tw.add(cyl(0.1 - i * 0.008, 0.105 - i * 0.008, 0.18, i % 2 ? C.white : 0xD9573F, 0, 0.09 + i * 0.18, 0, 10)); tw.add(cyl(0.08, 0.08, 0.1, VM.lamp, 0, 0.77, 0, 10), cone(0.1, 0.1, 0xD9573F, 0, 0.87, 0, 10)); at(tw, 0.3, 0, -0.16); g.add(tw);
  g.add(at(grp(box(0.02, 0.18, 0.02, 0x4A4F57, 0, 0.09, 0), box(0.1, 0.02, 0.02, 0x4A4F57, 0, 0.15, 0), mesh(new THREE.TorusGeometry(0.05, 0.01, 5, 10, Math.PI), 0x4A4F57, 0, 0.03, 0).rotateZ(Math.PI)), 0.1, 0, 0.34));
  const helm = grp(mesh(new THREE.TorusGeometry(0.06, 0.01, 5, 12), C.woodD)); for (let i = 0; i < 6; i++) { const s = box(0.15, 0.008, 0.008, C.woodD, 0, 0, 0); s.rotation.z = (i / 6) * Math.PI; helm.add(s); } at(helm, -0.18, 0.3, 0.16); g.add(helm);
  const beam = mesh(new THREE.ConeGeometry(0.12, 0.7, 8, 1, true), new THREE.MeshBasicMaterial({ color: 0xFFE9A8, transparent: true, opacity: 0.25, side: THREE.DoubleSide, depthWrite: false })); beam.rotation.z = Math.PI / 2; beam.position.x = 0.35; const bg = grp(beam); at(bg, 0.3, 0.77, -0.16); g.add(bg);
  g.userData.animate = (t) => { bg.rotation.y = t * 0.9; beam.material.opacity = 0.04 + VM.glass.emissiveIntensity * 0.15; helm.rotation.z = Math.sin(t * 0.5) * 0.3; };
  return g; };
