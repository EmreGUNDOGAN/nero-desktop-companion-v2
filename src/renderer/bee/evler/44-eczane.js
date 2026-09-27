// 44 · Eczane (Dükkân)
// beyaz cephe, yeşil ışıklı haç tabelası (yanıp söner), vitrin, önde bank ve sarmaşıklı kemer
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mat, mesh, box, grp, at, C, hip, body, ivy, bench } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.74, wall: 0xFAFAFA, roof: 0x5A6470, roofType: 'hip', roofH: 0.28, windows: [0.24] }); at(b, -0.08, 0, -0.14); g.add(b);
  g.add(box(0.26, 0.22, 0.03, VM.glass, -0.26, 0.2, 0.145));
  const cross = grp(box(0.18, 0.18, 0.03, VM.lamp, 0, 0, 0), box(0.12, 0.04, 0.035, 0x3FA05A, 0, 0, 0.002), box(0.04, 0.12, 0.035, 0x3FA05A, 0, 0, 0.002)); at(cross, -0.08, 0.66, 0.15); g.add(cross);
  const arch = grp(box(0.02, 0.36, 0.02, C.white, -0.14, 0.18, 0), box(0.02, 0.36, 0.02, C.white, 0.14, 0.18, 0), mesh(new THREE.TorusGeometry(0.14, 0.012, 5, 12, Math.PI), C.white, 0, 0.36, 0)); arch.add(at(ivy(10, 0.3, 0.08), 0, 0.4, 0.01)); at(arch, 0.3, 0, 0.34); g.add(arch, at(bench(C.white), -0.2, 0, 0.38));
  g.userData.animate = (t) => { cross.children[1].material = cross.children[2].material = mat(0x3FA05A, { emissive: 0x3FA05A, emissiveIntensity: 0.3 + (Math.sin(t * 2) > 0 ? 0.6 : 0) }); };
  return g; };
