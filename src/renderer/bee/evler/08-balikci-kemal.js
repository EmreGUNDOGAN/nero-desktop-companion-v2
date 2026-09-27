// 8 · Balıkçı Kemal (Ev)
// göl kıyısı evi: mavi ahşap kaplama, iskele, ters kayık, kurutulan ağ, çatıda martı
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mesh, box, cyl, sph, grp, at, C, body, dock, lamppost } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.6, wall: 0xDCE8F0, roof: 0x4F7FB0, windows: [0.14], trim: 0x3E5478 }); at(b, -0.16, 0, -0.16); g.add(b);
  for (let i = 0; i < 5; i++) g.add(box(0.61, 0.006, 0.005, 0xB8CAD8, -0.16, 0.08 + i * 0.09, 0.125));
  g.add(at(dock(0.46), 0.34, 0, 0.02));
  const hull = cyl(0.13, 0.13, 0.56, 0xD9573F, 0, 0, 0, 10); hull.scale.set(1, 0.55, 1); hull.rotation.set(Math.PI / 2, 0, 0.1); at(hull, -0.2, 0.07, 0.34); g.add(hull);
  const net = mesh(new THREE.PlaneGeometry(0.3, 0.24, 6, 5), new THREE.MeshStandardMaterial({ color: 0x8C7A5B, wireframe: true, transparent: true, opacity: 0.6, side: THREE.DoubleSide }), -0.46, 0.2, 0.2); net.rotation.y = 0.5; g.add(net, cyl(0.01, 0.01, 0.34, C.wood, -0.46, 0.17, 0.08, 5));
  g.add(lamppost(0.44, 0.3));
  const gull = grp(sph(0.025, C.white, 0, 0, 0, 6), box(0.08, 0.004, 0.02, C.white, 0, 0.005, 0)); at(gull, -0.16, 0.9, -0.16); g.add(gull);
  g.userData.animate = (t) => { gull.children[1].rotation.z = Math.sin(t * 4) * 0.3; };
  return g; };
