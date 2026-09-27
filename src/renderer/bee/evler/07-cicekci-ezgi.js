// 7 · Çiçekçi Ezgi (Dükkân)
// tohum ve fide dükkânı: pudra pembesi ev, cam sera, tırmanan güller, çiçek arabası, kelebekler
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mesh, box, cyl, sph, grp, at, C, body, greenhouse, windowBox, climber, awning, hangSign, butterflies } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.66, wall: 0xF4BFD0, roof: 0x7FA88A, shutters: 0x8FCBB5, door: 0xA58BD6, chimney: 0xC98F7A }); at(b, -0.14, 0, -0.14); g.add(b);
  g.add(at(climber(16, 0.36), -0.43, 0.04, 0.145), box(0.012, 0.42, 0.012, C.wood, -0.43, 0.21, 0.142));
  g.add(windowBox(-0.34, 0.23, 0.155), windowBox(0.06, 0.23, 0.155));
  const aw = awning(0.66, '#9FD3C0', '#FFFFFF'); at(aw, -0.14, 0.44, 0.2); g.add(aw);
  g.add(hangSign('💐', 0.24, 0.5, 0.12, -Math.PI / 2 + 0.3, '#FDE8EE'));
  g.add(at(greenhouse(0.3, 0.34), 0.36, 0, -0.18));
  const cart = grp(box(0.34, 0.06, 0.2, C.woodL, 0, 0.13, 0), box(0.34, 0.08, 0.02, C.wood, 0, 0.19, 0.1), box(0.34, 0.08, 0.02, C.wood, 0, 0.19, -0.1));
  for (const z of [0.12, -0.12]) cart.add(mesh(new THREE.TorusGeometry(0.07, 0.014, 5, 12), C.woodD, -0.07, 0.07, z));
  [C.red, C.yellow, C.lilac, C.white, C.pink, C.orange].forEach((c, i) => { cart.add(sph(0.03, c, -0.13 + (i % 4) * 0.085, 0.24, -0.05 + Math.floor(i / 4) * 0.08, 6)); cart.add(sph(0.03, c, -0.1 + (i % 3) * 0.1, 0.26, 0.03, 6)); });
  at(cart, 0.2, 0, 0.36, -0.35); g.add(cart);
  [[C.red, -0.44, 0.38], [C.yellow, -0.34, 0.44], [C.white, -0.24, 0.4]].forEach(([c, x, z]) => g.add(at(grp(cyl(0.04, 0.032, 0.07, 0xA9B4BE, 0, 0.035, 0, 8), sph(0.03, c, 0.01, 0.12, 0, 6), sph(0.028, c, -0.02, 0.11, 0.01, 6), sph(0.026, c, 0.01, 0.105, -0.02, 6)), x, 0, z)));
  g.add(butterflies(0.2, 0.44, 0.36));
  return g; };
