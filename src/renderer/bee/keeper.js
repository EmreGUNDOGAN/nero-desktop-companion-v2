// ===========================================================================
// Nero Arıcılık · Arıcı v2 (daha ayrıntılı 3D model)
// buildKeeper() → THREE.Group. Mevcut yürüme kodu ile uyumlu: userData.{legL, legR, armL, armR}
// eklem noktalarından (kalça/omuz) döner. İsteğe bağlı: userData.tick(t, moving, working) körük dumanı,
// peçe salınımı ve çalışırken çerçeve kaldırma gibi ek hareketleri yapar.
// ===========================================================================
import * as THREE from './vendor/three.module.min.js';

const cache = new Map();
const mat = (c, o = {}) => { const k = `${c}|${JSON.stringify(o)}`; if (!cache.has(k)) cache.set(k, new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, flatShading: true, ...o })); return cache.get(k); };
function mesh(geo, m, x = 0, y = 0, z = 0) { const o = new THREE.Mesh(geo, typeof m === 'number' ? mat(m) : m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; return o; }
const box = (w, h, d, c, x, y, z) => mesh(new THREE.BoxGeometry(w, h, d), c, x, y, z);
const cyl = (rt, rb, h, c, x, y, z, s = 10) => mesh(new THREE.CylinderGeometry(rt, rb, h, s), c, x, y, z);
const sph = (r, c, x, y, z, s = 10) => mesh(new THREE.SphereGeometry(r, s, Math.max(6, s - 2)), c, x, y, z);
const cap = (r, l, c, x, y, z) => mesh(THREE.CapsuleGeometry ? new THREE.CapsuleGeometry(r, l, 4, 8) : new THREE.CylinderGeometry(r, r, l + r * 2, 8), c, x, y, z);

const SUIT = 0xF7F2E6, SUIT_D = 0xE6DFCD, GLOVE = 0xD9A95A, BOOT = 0x6E4526, SKIN = 0xF2C9A0, STRAW = 0xE8C98A, BAND = 0xD9573F, METAL = 0xB8BEC6, INK = 0x3A2E24;

// Bir uzuv: eklem noktasında duran bir grup; içindeki parçalar aşağı doğru sarkar (rotation.x ile doğal salınım)
function limb(parts) { const j = new THREE.Group(); parts.forEach((p) => j.add(p)); return j; }

export function buildKeeper() {
  const g = new THREE.Group();

  // --- Bacaklar (kalçadan eklemli): tulum paçası + çizme ---
  const leg = (x) => { const j = limb([cap(0.055, 0.14, SUIT, 0, -0.1, 0), box(0.12, 0.02, 0.015, SUIT_D, 0, -0.03, 0.05), cyl(0.06, 0.065, 0.09, BOOT, 0, -0.22, 0.005, 10), box(0.12, 0.035, 0.17, BOOT, 0, -0.27, 0.03), box(0.125, 0.012, 0.175, 0x3A2A1A, 0, -0.29, 0.03)]); j.position.set(x, 0.3, 0); return j; };
  const legL = leg(-0.075), legR = leg(0.075);

  // --- Gövde: tulum, fermuar, cepler, kemer, yaka ---
  const torso = new THREE.Group();
  const bodyM = cyl(0.15, 0.17, 0.36, SUIT, 0, 0.46, 0, 14); bodyM.scale.z = 0.8; torso.add(bodyM);
  torso.add(sph(0.155, SUIT, 0, 0.62, 0, 14)); torso.children[1].scale.set(1, 0.5, 0.82);
  torso.add(box(0.012, 0.3, 0.01, METAL, 0, 0.47, 0.137)); // fermuar
  for (const x of [-0.07, 0.07]) torso.add(box(0.07, 0.06, 0.012, SUIT_D, x, 0.42, 0.135), box(0.07, 0.012, 0.014, SUIT_D, x, 0.45, 0.137)); // cepler
  torso.add(cyl(0.172, 0.172, 0.035, 0x8A5A34, 0, 0.32, 0, 14)); torso.children[torso.children.length - 1].scale.z = 0.8; // kemer
  torso.add(box(0.05, 0.035, 0.012, 0xC9A06A, 0, 0.32, 0.14)); // toka
  torso.add(box(0.05, 0.05, 0.012, 0xF2B33D, -0.08, 0.53, 0.132), sph(0.012, INK, -0.08, 0.53, 0.14, 6)); // arı rozeti
  g.add(torso);

  // --- Kollar (omuzdan eklemli): üst kol + dirsek + ön kol + eldiven ---
  const arm = (x, side) => {
    const j = limb([cap(0.045, 0.12, SUIT, 0, -0.09, 0)]); const fore = new THREE.Group(); fore.position.set(0, -0.2, 0); fore.rotation.x = -0.25;
    fore.add(cap(0.042, 0.1, SUIT, 0, -0.07, 0), cyl(0.052, 0.048, 0.07, GLOVE, 0, -0.17, 0, 10), sph(0.05, GLOVE, 0, -0.22, 0.005, 10)); j.add(fore);
    j.position.set(x, 0.6, 0); j.rotation.z = side * 0.12; j.userData.fore = fore; return j; };
  const armL = arm(-0.19, -1), armR = arm(0.19, 1);

  // Sağ elde körük (duman makinesi), sol elde kovan levyesi
  const smoker = new THREE.Group();
  smoker.add(cyl(0.045, 0.045, 0.12, METAL, 0, -0.02, 0, 12), cyl(0.047, 0.047, 0.012, 0x8A9098, 0, 0.04, 0, 12), mesh(new THREE.ConeGeometry(0.035, 0.07, 10), METAL, 0, 0.08, 0.015));
  smoker.children[2].rotation.x = 0.4; smoker.add(box(0.06, 0.09, 0.02, 0x8A5A34, 0, -0.02, -0.055), box(0.05, 0.08, 0.012, 0xC98A5A, 0, -0.02, -0.07));
  smoker.position.set(0, -0.3, 0.03); armR.userData.fore.add(smoker);
  const tool = box(0.02, 0.012, 0.13, METAL, 0, -0.24, 0.07); armL.userData.fore.add(tool);
  // Çalışırken kaldırılan petek çerçevesi (normalde gizli)
  const frame = new THREE.Group(); frame.add(box(0.2, 0.14, 0.012, 0xC9A06A, 0, 0, 0), box(0.17, 0.11, 0.014, 0xF2C94C, 0, 0, 0.001)); frame.position.set(0.19, -0.26, 0.1); frame.visible = false; armL.userData.fore.add(frame);

  // --- Baş: yüz, gözler, yanaklar, bıyık ---
  const head = new THREE.Group(); head.position.y = 0.8;
  head.add(sph(0.12, SKIN, 0, 0, 0, 16));
  for (const x of [-0.04, 0.04]) head.add(sph(0.016, INK, x, 0.015, 0.11, 8), sph(0.022, 0xF2A0A0, x * 1.7, -0.025, 0.095, 8));
  const stache = box(0.08, 0.018, 0.02, 0x8A5A34, 0, -0.035, 0.115); head.add(stache);
  // Hasır şapka: kenar, tepe, kurdele
  head.add(cyl(0.26, 0.26, 0.02, STRAW, 0, 0.1, 0, 20), cyl(0.12, 0.13, 0.12, STRAW, 0, 0.17, 0, 16), cyl(0.132, 0.132, 0.03, BAND, 0, 0.125, 0, 16));
  // Peçe: şapkadan sarkan yarı saydam tül (yüz arkadan seçilir)
  const veilMat = new THREE.MeshStandardMaterial({ color: 0xF4F1EA, transparent: true, opacity: 0.38, roughness: 1, side: THREE.DoubleSide, depthWrite: false });
  const veil = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.17, 0.22, 20, 1, true), veilMat); veil.position.y = -0.02; veil.castShadow = false; head.add(veil);
  const veilRim = cyl(0.172, 0.172, 0.015, SUIT_D, 0, -0.13, 0, 20); head.add(veilRim);
  g.add(head);

  g.add(legL, legR, armL, armR);

  // Körük dumanı
  const puffs = []; const puffMat = () => new THREE.MeshStandardMaterial({ color: 0xE8E8E8, transparent: true, opacity: 0.0, roughness: 1, depthWrite: false });
  for (let i = 0; i < 5; i++) { const p = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), puffMat()); p.castShadow = false; g.add(p); puffs.push(p); }

  const nozzle = new THREE.Vector3();
  g.userData = {
    legL, legR, armL, armR, head, veil, smoker, frame,
    // Ek hareketler: bu fonksiyon çağrılmazsa model yine mevcut kodla yürür
    tick(t, moving, working) {
      veil.rotation.y = Math.sin(t * 1.3) * 0.05; veil.scale.x = 1 + Math.sin(t * 2.1) * 0.015;
      head.rotation.y = working ? Math.sin(t * 0.9) * 0.25 : 0;
      armL.userData.fore.rotation.x = working ? -1.0 : -0.25;
      armR.userData.fore.rotation.x = working ? -0.9 + Math.sin(t * 6) * 0.15 : -0.25;
      frame.visible = working && Math.sin(t * 0.8) > 0;
      smoker.children[3].scale.y = working ? 0.8 + Math.abs(Math.sin(t * 6)) * 0.4 : 1;
      smoker.children[2].getWorldPosition(nozzle); g.worldToLocal(nozzle);
      puffs.forEach((p, i) => { const k = (t * 0.7 + i / 5) % 1; if (!working) { p.material.opacity = 0; return; } p.position.set(nozzle.x + Math.sin(k * 5 + i) * 0.04, nozzle.y + k * 0.35, nozzle.z + k * 0.08); p.scale.setScalar(0.5 + k * 1.6); p.material.opacity = 0.6 * (1 - k); });
    }
  };
  g.scale.setScalar(1.25);
  return g;
}
