// Tarh v2: ahşap bordür, sürülmüş toprak sıraları, sıra hâlinde ekili çiçekler
import * as THREE from '../vendor/three.module.min.js';
import { mat, C } from '../evler/kit.js';

const geo = { stem: new THREE.CylinderGeometry(0.016, 0.016, 0.18, 4), petal: new THREE.SphereGeometry(0.07, 6, 5), center: new THREE.SphereGeometry(0.038, 6, 5), leaf: new THREE.SphereGeometry(0.035, 5, 4) };
const pm = new Map(); const petal = (hex) => { if (!pm.has(hex)) pm.set(hex, new THREE.MeshStandardMaterial({ color: new THREE.Color(hex), roughness: 0.8, flatShading: true })); return pm.get(hex); };

export function makeFlowerBed(def, seed, wilted = false, R = 1) {
  const g = new THREE.Group();
  let s = seed * 9301 + 49297; const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  // Toprak + ahşap bordür (altıgen halka)
  const soil = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.8, R * 0.84, 0.08, 6), mat(0x6B4428)); soil.position.y = 0.04; soil.receiveShadow = true; g.add(soil);
  for (let k = 0; k < 6; k++) { const a0 = (k / 6) * Math.PI * 2, a1 = ((k + 1) / 6) * Math.PI * 2; const r0 = R * 0.84; const p0 = new THREE.Vector3(Math.sin(a0) * r0, 0.07, Math.cos(a0) * r0), p1 = new THREE.Vector3(Math.sin(a1) * r0, 0.07, Math.cos(a1) * r0);
    const log = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, p0.distanceTo(p1) + 0.03, 6), mat(k % 2 ? C.wood : C.woodL)); log.position.copy(p0.clone().add(p1).multiplyScalar(0.5)); log.lookAt(p1); log.rotateX(Math.PI / 2); log.castShadow = true; g.add(log); }
  // Sürülmüş sıralar
  for (let i = -2; i <= 2; i++) { const row = new THREE.Mesh(new THREE.BoxGeometry(R * 1.2 - Math.abs(i) * 0.18, 0.025, 0.07), mat(0x5A3820)); row.position.set(0, 0.09, i * 0.22); g.add(row); }
  // Sıra hâlinde çiçekler
  const pmat = petal(wilted ? '#9C8A6A' : def.petal); const cmat = mat(0xF2B33D); const smat = mat(0x5F8F4A);
  for (let i = -2; i <= 2; i++) {
    const n = 5 - Math.abs(i); for (let j = 0; j < n; j++) {
      const x = (j - (n - 1) / 2) * 0.22 + (rnd() - 0.5) * 0.04, z = i * 0.22 + (rnd() - 0.5) * 0.03;
      const stem = new THREE.Mesh(geo.stem, smat); stem.position.set(x, 0.18, z); g.add(stem);
      const lf = new THREE.Mesh(geo.leaf, smat); lf.scale.set(1.4, 0.4, 0.7); lf.position.set(x + 0.03, 0.14, z); g.add(lf);
      const bloom = new THREE.Group();
      for (let k = 0; k < 5; k++) { const p = new THREE.Mesh(geo.petal, pmat); const pa = (k / 5) * Math.PI * 2; p.position.set(Math.cos(pa) * 0.06, 0, Math.sin(pa) * 0.06); p.scale.set(1, 0.45, 1); bloom.add(p); }
      const c = new THREE.Mesh(geo.center, cmat); c.position.y = 0.02; bloom.add(c);
      bloom.position.set(x, 0.29, z); bloom.scale.setScalar((0.85 + rnd() * 0.3) * (wilted ? 0.6 : 1));
      if (wilted) { bloom.position.y = 0.17; bloom.rotation.z = 0.9; }
      g.add(bloom);
    }
  }
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return g;
}
