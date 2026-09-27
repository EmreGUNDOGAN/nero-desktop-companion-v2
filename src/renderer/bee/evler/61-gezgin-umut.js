// 61 · Gezgin Umut (Ev)
// karavan-ev: renkli karavan, önünde kamp ateşi, dünya haritası bayrağı, sırt çantası
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mesh, box, cyl, sph, cone, grp, at, C, smoke, flag } from './kit.js';

export default () => { const g = new THREE.Group();
  const cv = grp(box(0.56, 0.3, 0.3, 0x6FA3D9, 0, 0.22, 0), box(0.56, 0.1, 0.302, C.white, 0, 0.3, 0), cyl(0.15, 0.15, 0.56, 0x6FA3D9, 0, 0.37, 0, 12, 1, false, 0, Math.PI).rotateZ(Math.PI / 2), box(0.12, 0.1, 0.02, VM.glass, -0.12, 0.28, 0.152), box(0.12, 0.1, 0.02, VM.glass, 0.12, 0.28, 0.152), box(0.1, 0.2, 0.02, C.woodD, 0.22, 0.17, 0.152));
  for (const x of [-0.16, 0.16]) cv.add(mesh(new THREE.TorusGeometry(0.06, 0.02, 5, 12), C.iron, x, 0.07, 0.16), mesh(new THREE.TorusGeometry(0.06, 0.02, 5, 12), C.iron, x, 0.07, -0.16));
  at(cv, -0.08, 0, -0.14); g.add(cv);
  const fire = cone(0.05, 0.1, VM.lamp, 0, 0.06, 0, 6); const camp = grp(fire); for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; camp.add(sph(0.03, C.stoneD, Math.cos(a) * 0.08, 0.015, Math.sin(a) * 0.08, 5)); } for (let i = 0; i < 3; i++) { const l = cyl(0.012, 0.012, 0.12, C.trunk, 0, 0.02, 0, 5); l.rotation.set(Math.PI / 2, 0, (i / 3) * Math.PI); camp.add(l); } at(camp, 0.26, 0, 0.3); g.add(camp, smoke(0.26, 0.14, 0.3));
  g.add(flag(-0.44, 0, 0.2, 0x3F9A8A), at(grp(box(0.08, 0.12, 0.05, 0xC94A3A, 0, 0.06, 0), box(0.06, 0.04, 0.02, 0xA83E2B, 0, 0.05, 0.03)), 0.0, 0, 0.36));
  g.userData.animate = (t) => { fire.scale.y = 1 + Math.sin(t * 11) * 0.3; };
  return g; };
