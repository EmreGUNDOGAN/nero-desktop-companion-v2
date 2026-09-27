// 34 · Veteriner Kliniği (Bina)
// beyaz klinik, yeşil çatı, pati tabelası, köpek kulübesi ve köpek, küçük arı kovanı muayene masası
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, sph, grp, at, C, gable, body, hangSign, fence } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.74, wall: C.white, roof: 0x6FA35E, windows: [-0.24, 0.24], trim: 0x6FA35E }); at(b, -0.08, 0, -0.14); g.add(b);
  g.add(hangSign('🐾', 0.3, 0.5, 0.12, -Math.PI / 2 + 0.3, '#E6F4E0'));
  const kennel = grp(box(0.16, 0.12, 0.14, 0xC94A3A, 0, 0.06, 0), at(gable(0.16, 0.14, 0.07, 0x3E5478), 0, 0.12, 0), box(0.06, 0.07, 0.005, 0x3A2A1A, 0, 0.035, 0.071)); at(kennel, 0.32, 0, 0.28); g.add(kennel);
  const dog = grp(box(0.12, 0.06, 0.05, 0xB98A5A, 0, 0.06, 0), sph(0.035, 0xB98A5A, 0.07, 0.1, 0, 6), box(0.02, 0.05, 0.02, 0xB98A5A, -0.05, 0.02, 0.015), box(0.02, 0.05, 0.02, 0xB98A5A, 0.04, 0.02, 0.015)); const tail = box(0.05, 0.012, 0.012, 0xB98A5A, -0.08, 0.08, 0); dog.add(tail); at(dog, 0.16, 0, 0.36, 0.4); g.add(dog);
  g.add(at(grp(box(0.2, 0.02, 0.12, C.white, 0, 0.14, 0), box(0.015, 0.14, 0.015, C.iron, -0.08, 0.07, 0), box(0.015, 0.14, 0.015, C.iron, 0.08, 0.07, 0), box(0.07, 0.06, 0.07, 0xE8C86A, 0, 0.18, 0)), -0.3, 0, 0.34), fence(0.3));
  g.children[g.children.length - 1].position.set(-0.3, 0, 0.44);
  g.userData.animate = (t) => { tail.rotation.y = Math.sin(t * 10) * 0.6; };
  return g; };
