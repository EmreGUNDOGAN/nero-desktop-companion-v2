// 49 · Saatçi Nihat (Ev)
// dar yüksek ev, cephede büyük saat (dönen yelkovan), vitrinde cep saatleri, guguklu kuş
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mesh, box, cyl, sph, grp, at, C, gable, body } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.56, h: 0.72, wall: 0xF3EBD8, roof: 0x5A4A3A, roofH: 0.42, windows: [0.14], shutters: 0x5A4A3A }); at(b, -0.18, 0, -0.14); g.add(b);
  const face = grp(mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.02, 16), VM.lamp).rotateX(Math.PI / 2), mesh(new THREE.TorusGeometry(0.1, 0.012, 5, 16), 0x5A4A3A)); const hour = box(0.008, 0.05, 0.006, C.ink, 0, 0.022, 0.014); const minute = box(0.006, 0.08, 0.006, C.ink, 0, 0.037, 0.016); const hh = grp(hour), mm = grp(minute); face.add(hh, mm); at(face, -0.18, 0.56, 0.15); g.add(face);
  g.add(box(0.22, 0.14, 0.03, VM.glass, -0.3, 0.18, 0.145)); for (let i = 0; i < 3; i++) g.add(cyl(0.02, 0.02, 0.006, C.honey, -0.36 + i * 0.06, 0.2, 0.17, 10).rotateX(Math.PI / 2));
  const cuckoo = grp(box(0.1, 0.1, 0.06, C.woodD, 0, 0, 0), at(gable(0.1, 0.06, 0.05, C.wood), 0, 0.05, 0)); const bird = sph(0.018, C.yellow, 0, 0, 0.03, 6); cuckoo.add(bird); at(cuckoo, 0.2, 0.34, 0.2); g.add(cuckoo, cyl(0.01, 0.01, 0.3, C.wood, 0.2, 0.15, 0.2, 5));
  g.userData.animate = (t) => { mm.rotation.z = -t * 0.8; hh.rotation.z = -t * 0.067; bird.position.z = 0.03 + (Math.sin(t * 0.7) > 0.95 ? 0.05 : 0); };
  return g; };
