// Arı v2: çizgili gövde, baş, antenler, iğne, yarı saydam kanatlar, polen keseleri; kavisli uçuş yolu yardımcı fonksiyonu
import * as THREE from '../vendor/three.module.min.js';

const M = {
  body: new THREE.MeshStandardMaterial({ color: 0xF4C441, roughness: 0.6, flatShading: true }),
  stripe: new THREE.MeshStandardMaterial({ color: 0x2E2418, roughness: 0.7, flatShading: true }),
  wing: new THREE.MeshStandardMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.55, roughness: 0.15, side: THREE.DoubleSide, depthWrite: false }),
  pollen: new THREE.MeshStandardMaterial({ color: 0xE9822E, roughness: 0.8 })
};
const G = { body: new THREE.SphereGeometry(0.07, 10, 8), head: new THREE.SphereGeometry(0.042, 8, 6), stripe: new THREE.TorusGeometry(0.064, 0.013, 5, 12), wing: new THREE.CircleGeometry(0.075, 10), ant: new THREE.CylinderGeometry(0.004, 0.004, 0.06, 3), sting: new THREE.ConeGeometry(0.012, 0.035, 5), pollen: new THREE.SphereGeometry(0.018, 6, 4) };

export function makeBeeV2() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(G.body, M.body); body.scale.set(1.35, 0.95, 0.95); g.add(body);
  for (const x of [-0.035, 0.015]) { const s = new THREE.Mesh(G.stripe, M.stripe); s.rotation.y = Math.PI / 2; s.position.x = x; s.scale.set(0.95, 0.95, 0.95); g.add(s); }
  const head = new THREE.Mesh(G.head, M.stripe); head.position.x = 0.09; g.add(head);
  for (const z of [-0.018, 0.018]) { const a = new THREE.Mesh(G.ant, M.stripe); a.position.set(0.11, 0.045, z); a.rotation.z = -0.6; g.add(a); }
  const sting = new THREE.Mesh(G.sting, M.stripe); sting.rotation.z = Math.PI / 2; sting.position.x = -0.1; g.add(sting);
  // Kanatlar bir eklem grubuna bağlı: oyunun animasyon kodu grubun rotation.x'ini çevirir, kanadın duruş açısı bozulmaz
  const wing = (z, tilt) => { const pivot = new THREE.Group(); pivot.position.set(0, 0.06, z); const w = new THREE.Mesh(G.wing, M.wing); w.rotation.x = -Math.PI / 2 + tilt; w.scale.set(1, 0.6, 1); w.position.z = Math.sign(z) * 0.035; pivot.add(w); return pivot; };
  const w1 = wing(0.02, 0.3), w2 = wing(-0.02, -0.3);
  g.add(w1, w2);
  const pollen = [0.03, -0.03].map((z) => { const p = new THREE.Mesh(G.pollen, M.pollen); p.position.set(-0.01, -0.05, z); p.visible = false; g.add(p); return p; });
  g.userData = { wings: [w1, w2], pollen };
  return g;
}

// Kovan → çiçek arasında her arıya özgü bir yay: kontrol noktası iki noktanın ortasından yana ve yukarı kaydırılır
export function beeArc(from, to, e, phase) {
  const mid = from.clone().lerp(to, 0.5);
  const side = new THREE.Vector3(-(to.z - from.z), 0, to.x - from.x).normalize().multiplyScalar(0.35 * Math.sin(phase * 3.7));
  mid.add(side); mid.y += 0.45;
  const a = from.clone().lerp(mid, e), b = mid.clone().lerp(to, e);
  return a.lerp(b, e);
}
