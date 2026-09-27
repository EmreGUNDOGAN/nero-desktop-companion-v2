// 77 · Muhabir Bige (Ev)
// gazete bürosu-ev, cephede "Köy Postası" tabelası, önde gazete standı, uçuşan gazete, bisiklet
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mesh, box, grp, at, C, body, hangSign } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.66, wall: 0xF3EBD8, roof: 0x3A3A3A, windows: [0.22], shutters: 0x3A3A3A }); at(b, -0.12, 0, -0.14); g.add(b);
  g.add(box(0.24, 0.2, 0.03, VM.glass, -0.3, 0.2, 0.145), hangSign('📰', 0.26, 0.5, 0.12, -Math.PI / 2 + 0.3, '#FFFFFF'));
  const stand = grp(box(0.2, 0.2, 0.1, 0xC94A3A, 0, 0.1, 0), box(0.18, 0.1, 0.005, C.white, 0, 0.13, 0.051)); for (let i = 0; i < 3; i++) stand.add(box(0.12, 0.004, 0.003, C.ink, 0, 0.1 + i * 0.025, 0.054)); at(stand, 0.28, 0, 0.3); g.add(stand);
  const paper = box(0.08, 0.004, 0.06, C.white, 0, 0, 0); g.add(paper);
  g.add(at(grp(mesh(new THREE.TorusGeometry(0.055, 0.01, 5, 12), C.iron, -0.07, 0.065, 0), mesh(new THREE.TorusGeometry(0.055, 0.01, 5, 12), C.iron, 0.07, 0.065, 0), box(0.15, 0.012, 0.012, 0x3F7FBF, 0, 0.09, 0)), -0.36, 0, 0.36, 0.3));
  g.userData.animate = (t) => { const k = (t * 0.2) % 1; paper.position.set(0.3 - k * 0.5, 0.25 + Math.sin(k * 9) * 0.08 + k * 0.2, 0.34); paper.rotation.set(k * 6, k * 3, k * 4); paper.visible = k < 0.9; };
  return g; };
