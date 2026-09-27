// 2 · Mehmet Usta (Ev)
// tamirci: lacivert tek eğimli çatılı atölye evi, yanda açık tamirhane sundurması (tezgâh, aletler), önde sökülmüş bisiklet
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mesh, box, sph, grp, at, C, shed, body, lamppost } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.6, wall: 0xE3DDD0, roof: 0x3E5478, roofType: 'shed', roofH: 0.26, windows: [-0.17], trim: 0x5A6470 }); at(b, -0.14, 0, -0.12); g.add(b);
  const sh = grp(box(0.3, 0.03, 0.3, C.stoneD, 0, 0.015, 0), box(0.02, 0.3, 0.02, C.iron, -0.13, 0.15, 0.13), box(0.02, 0.3, 0.02, C.iron, 0.13, 0.15, 0.13), box(0.34, 0.025, 0.34, 0x3E5478, 0, 0.31, 0));
  sh.add(box(0.24, 0.1, 0.1, C.woodL, 0, 0.1, -0.08), box(0.08, 0.05, 0.06, 0xC94A3A, -0.06, 0.18, -0.08), box(0.2, 0.12, 0.01, 0x7A6A5A, 0, 0.22, -0.14));
  for (let i = 0; i < 4; i++) sh.add(box(0.012, 0.06, 0.005, C.iron, -0.07 + i * 0.045, 0.22, -0.133)); at(sh, 0.3, 0, -0.08); g.add(sh);
  const wheel = mesh(new THREE.TorusGeometry(0.06, 0.012, 5, 12), C.iron, 0.12, 0.06, 0.34); wheel.rotation.y = 0.4; g.add(wheel, at(box(0.16, 0.012, 0.012, 0x3F7FBF, 0, 0, 0), 0.04, 0.09, 0.32));
  g.add(lamppost(0.44, 0.26));
  const spark = sph(0.012, VM.lamp, 0.3, 0.2, -0.16, 5); g.add(spark);
  g.userData.animate = (t) => { spark.visible = Math.sin(t * 6) > 0.6; };
  return g; };
