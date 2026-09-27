// Göl v2: su karesine kıyı taşları, genişleyen dalga halkaları ve ışıltılar
import * as THREE from '../vendor/three.module.min.js';
import { mat, C } from '../evler/kit.js';

const DIRS = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
export function makeWaterDeco(t, tiles, R = 1, seed = 1) {
  const g = new THREE.Group();
  let s = seed * 9301 + 49297; const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  // Kıyı taşları: komşusu su olmayan kenarlara
  for (let k = 0; k < 6; k++) {
    const n = tiles[`${t.q + DIRS[k][0]},${t.r + DIRS[k][1]}`];
    if (n && n.kind === 'water') continue;
    const a = Math.atan2(Math.sqrt(3) * (DIRS[k][1] + DIRS[k][0] / 2), 1.5 * DIRS[k][0]);
    for (let i = 0; i < 3; i++) {
      const off = (i - 1) * 0.28; const d = R * 0.78;
      const x = Math.cos(a) * d - Math.sin(a) * off, z = Math.sin(a) * d + Math.cos(a) * off;
      const st = new THREE.Mesh(new THREE.DodecahedronGeometry(0.06 + rnd() * 0.05, 0), mat(i % 2 ? C.stone : C.stoneD)); st.position.set(x, 0.1, z); st.scale.y = 0.6; st.castShadow = true; g.add(st);
    }
  }
  // Dalga halkaları
  const rings = [0, 1].map((i) => { const m = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.008, 4, 24), new THREE.MeshBasicMaterial({ color: 0xE6F6FB, transparent: true, opacity: 0.6, depthWrite: false })); m.rotation.x = Math.PI / 2; m.position.set((rnd() - 0.5) * 0.8, 0.125, (rnd() - 0.5) * 0.8); m.userData.p = rnd() * 3 + i; g.add(m); return m; });
  // Işıltılar
  const sparks = [0, 1, 2].map(() => { const m = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 0.05), new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.rotation.z = Math.PI / 4; m.position.set((rnd() - 0.5) * 1.1, 0.126, (rnd() - 0.5) * 1.1); m.userData.p = rnd() * 6; g.add(m); return m; });
  g.userData.animate = (time) => {
    rings.forEach((r) => { const k = ((time * 0.35 + r.userData.p) % 1.6) / 1.6; r.scale.setScalar(0.5 + k * 3); r.material.opacity = 0.55 * (1 - k); });
    sparks.forEach((m) => { m.material.opacity = Math.max(0, Math.sin(time * 1.7 + m.userData.p)) ** 8 * 0.9; });
  };
  return g;
}
